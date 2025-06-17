import fse from 'fs-extra'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { CWD, tempDir } from '../utils/constants.js'
import child_process from 'child_process'
import { glob } from 'glob'
import consola from 'consola'
import { rimraf } from 'rimraf'
import * as compiler from 'vue/compiler-sfc'
import esbuild from 'esbuild'
import { sardConfig } from '../getSardConfig.js'
import { camelCase, upperFirst } from 'lodash-es'

const { build: buildConfig } = sardConfig

const outDir = path.resolve(CWD, buildConfig.outDir)
const srcDir = path.resolve(CWD, buildConfig.srcDir)
const uniModulesDir = path.resolve(CWD, buildConfig.uniModulesDir)
const uniPluginDir = path.resolve(uniModulesDir, buildConfig.uniName)

const srcIgnore = '.sard/**/*'

async function deleteOutDir() {
  const content = await fsp.readFile(path.resolve(CWD, '.gitignore'), {
    encoding: 'utf8',
  })
  const ignore = buildConfig.outDir.replace(/^\.?\//, '')
  if (!new RegExp(`^${ignore}`, 'm').test(content)) {
    throw Error(
      `${buildConfig.outDir} 不在 .gitignore 忽略规则中，有删除重要文件的风险`,
    )
  }
  await rimraf(outDir)
}

async function copySrcToDist(pattern: string) {
  const result = await glob(path.resolve(srcDir, pattern).replace(/\\/g, '/'), {
    ignore: srcIgnore,
  })
  const targetResult = result.map((file) =>
    path.resolve(outDir, '.' + file.replace(srcDir, '')),
  )

  await Promise.all(
    result.map(async (source, index) => {
      const target = targetResult[index]
      const targetPath = path.dirname(target)
      if (!fse.existsSync(targetPath)) {
        fse.mkdirsSync(targetPath)
      }
      await fse.copyFile(source, target)
    }),
  )
}

const tsconfigPath = path.resolve(tempDir, '__temp-tsconfig.sard.json')

const vueTsconfig = {
  include: [`${srcDir}/**/*`],
  exclude: [`${srcDir}/**/test/**/*`, `${srcDir}/**/${srcIgnore}`],
  compilerOptions: {
    target: 'esnext',
    resolveJsonModule: true,
    esModuleInterop: true,
    moduleResolution: 'node',
    declaration: true,
    strict: true,
    noImplicitAny: false,
    noUnusedLocals: true,
    noUnusedParameters: true,
    types: ['@dcloudio/types'],
    skipLibCheck: true,
    module: 'esnext',
    outDir: outDir,
  },
}

async function compileTsAndGenerateVueType() {
  await fsp.writeFile(tsconfigPath, JSON.stringify(vueTsconfig))

  const config = [['vue-tsc'], ['-p', tsconfigPath]].flat(Infinity).join(' ')

  await new Promise<void>((resolve, reject) => {
    const child = child_process.exec(`${config}`, async (err) => {
      await fsp.rm(tsconfigPath)
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })

    child.stdout!.on('data', (data) => {
      consola.log(data)
    })
  })

  const vueJs = await glob(
    path.resolve(outDir, './**/*.vue.js').replace(/\\/g, '/'),
  )
  for (const file of vueJs) {
    await fsp.rm(file)
  }

  const vueDts = await glob(
    path.resolve(outDir, './**/*.vue.d.ts').replace(/\\/g, '/'),
  )
  for (const file of vueDts) {
    await fsp.rename(file, file.replace(/\.vue\.d\.ts$/, '.d.ts'))
  }
}

async function copyLwa() {
  await copySrcToDist('./**/lwa.slim.*')
}

function geAllComponentName(script: string) {
  return script.match(/(?<=import\s+)\w+(?=\s+from\s+"[^"]+\.vue")/g)
}

function insertComponents(code: string, components: string[]) {
  return code.replace(/(?<=defineComponent\(\{\n)/, () => {
    return (
      `  components: {\n` +
      `${components.map((item) => `    ${item},\n`).join('')}` +
      `  },\n`
    )
  })
}

function doCompileVue(code: string, filePath: string) {
  let wxsMatch = ''
  code = code.replace(/<script.*?lang="wxs".*?><\/script>/, (m) => {
    wxsMatch = m
    return ''
  })
  const { descriptor } = compiler.parse(code, {
    filename: filePath,
  })

  // template
  let compiledVue = `<template>${descriptor.template!.content}</template>\n\n`

  // wxs
  if (wxsMatch) {
    compiledVue += `<!-- #ifdef MP-WEIXIN -->\n${wxsMatch}\n<!-- #endif -->\n\n`
  }

  // script
  if (descriptor.script || descriptor.scriptSetup) {
    const compiledScript = compiler
      .compileScript(descriptor, {
        id: filePath,
        inlineTemplate: false,
      })
      .content.replace(/^.*__isScriptSetup.*$/m, '')
      // 转义uniapp条件注释，避免被esbuild删掉
      .replace(/\/\/ #/g, '//! #')

    let transformedScript = esbuild
      .transformSync(compiledScript, {
        loader: 'ts',
        legalComments: 'inline',
      })
      .code.replace(/\/\/! #/g, '// #')
      .replace(/\/\* @__PURE__ \*\//g, '')

    const components = geAllComponentName(transformedScript)
    if (components) {
      transformedScript = insertComponents(transformedScript, components)
    }

    compiledVue += `<script>\n${transformedScript}</script>\n`
  }

  // style
  const style = descriptor.styles[0]

  if (style) {
    compiledVue += `\n<style lang="scss">${style.content}</style>`
  }

  return compiledVue
}

async function compileVue() {
  const result = await glob(
    path.resolve(srcDir, './**/*.vue').replace(/\\/g, '/'),
    {
      ignore: srcIgnore,
    },
  )
  const targetResult = result.map((file) =>
    path.resolve(outDir, '.' + file.replace(srcDir, '')),
  )

  await Promise.all(
    result.map(async (source, index) => {
      const target = targetResult[index]
      const targetPath = path.dirname(target)
      if (!fse.existsSync(targetPath)) {
        fse.mkdirsSync(targetPath)
      }

      const content = await fsp.readFile(source, {
        encoding: 'utf8',
      })

      const vue = doCompileVue(content, source)

      await fsp.writeFile(target, vue)
    }),
  )
}

async function handleGlobalComponent() {
  let content = await fsp.readFile(path.resolve(srcDir, 'global.d.ts'), {
    encoding: 'utf8',
  })

  content = content.replace(/\.vue/gm, '')

  await fsp.writeFile(path.resolve(outDir, 'global.d.ts'), content)
}

async function copyScss() {
  await copySrcToDist('./**/*.scss')
}

async function copyStaticFiles() {
  await copySrcToDist('./**/*.{jpg,png,gif,jpeg,ttf,svg}')
}

async function copyWxs() {
  await copySrcToDist('./**/*.wxs')
}

async function copyPackageJson() {
  await fse.copyFile(
    path.resolve(CWD, 'package.json'),
    path.resolve(outDir, 'package.json'),
  )
}

async function copyComponentsReadme() {
  await copySrcToDist('./components/**/*.md')
}

async function copyRootReadme() {
  await fse.copyFile(
    path.resolve(CWD, 'README.md'),
    path.resolve(outDir, 'README.md'),
  )
}

async function copyChangelog() {
  await fse.copyFile(
    path.resolve(CWD, 'CHANGELOG.md'),
    path.resolve(outDir, 'CHANGELOG.md'),
  )
}

function doParseMdTable(tableStr: string) {
  const match = tableStr.match(/^\|.+?$/gm)
  return match
    ? match
        .slice(2)
        .map((item) => item.replace(/^\s*\|\s*|\s*\|\s*$/g, ''))
        .map((item) => item.split(/\s*(?<!\\)\|\s*/))
    : []
}

function parseMdPropsTable(tableStr: string) {
  return doParseMdTable(tableStr).map(([prop, desc, type, defaultValue]) => {
    return [
      camelCase(prop.match(/^[\w-]+/)?.[0] || ''),
      desc,
      type.replace(/\\\|/g, '|'),
      defaultValue,
    ]
  })
}

function parseMdEmitsTable(tableStr: string) {
  return doParseMdTable(tableStr).map(([prop, desc, type]) => {
    return [prop.match(/^[\w-]+/)?.[0] || '', desc, type.replace(/\\\|/g, '|')]
  })
}

function parseMdTable(tableStr: string, title: string) {
  return title.endsWith('Props')
    ? parseMdPropsTable(tableStr)
    : parseMdEmitsTable(tableStr)
}

function getMdTableStr(content: string, title: string) {
  return (
    content.match(new RegExp(`\\n### ${title}\\b[\\s\\S]+?(?=\\n#|$)`, 'g')) ||
    []
  )
}

async function parseMdTableByTitle(
  file: string,
  title: string,
  content?: string,
) {
  const tableArr: string[][] = []

  if (typeof content === 'undefined') {
    if (!fse.existsSync(file)) {
      return tableArr
    }
    content = await fsp.readFile(file, {
      encoding: 'utf-8',
    })
  }

  const tableStrList = getMdTableStr(content, title)

  for (const tableStr of tableStrList) {
    const match = tableStr.match(/继承 \[`(.*?)`\]\((.+?|)#(.+?)\)/)
    // 继承
    if (match) {
      const [, , relativePath, extendTitle] = match

      // 其他文件
      if (relativePath) {
        const extendFile = path.resolve(
          path.dirname(file),
          '..',
          relativePath,
          'README.md',
        )
        tableArr.push(...(await parseMdTableByTitle(extendFile, extendTitle)))
      }
      // 当前文件
      else {
        tableArr.push(
          ...(await parseMdTableByTitle(file, extendTitle, content)),
        )
      }
    }

    tableArr.push(...parseMdTable(tableStr, title))
  }

  return tableArr
}

function deduplicateMdTable(table: string[][]) {
  return Object.values(Object.fromEntries(table.map((row) => [row[0], row])))
}

async function generateUniPropsType() {
  const result = await glob(
    path
      .resolve(path.resolve(outDir, 'components'), './**/*.vue')
      .replace(/\\/g, '/'),
  )
  return Promise.all(
    result.map(async (file) => {
      const content = await fsp.readFile(file, {
        encoding: 'utf-8',
      })

      const filename = path.basename(file, '.vue')

      let targetFile = ''
      const propsName = upperFirst(camelCase(filename)) + 'Props'
      const emitsName = upperFirst(camelCase(filename)) + 'Emits'
      const dir = path.dirname(file)
      const readmeFile = path.resolve(dir, 'README.md')

      if (fse.existsSync(readmeFile)) {
        targetFile = readmeFile
      } else {
        const relativeDir = buildConfig.mapReadme[filename]
        if (relativeDir) {
          targetFile = path.resolve(dir, relativeDir, 'README.md')
        }
      }

      if (targetFile && fse.existsSync(targetFile)) {
        const propTable = deduplicateMdTable(
          await parseMdTableByTitle(targetFile, propsName),
        )
        const eventTable = deduplicateMdTable(
          await parseMdTableByTitle(targetFile, emitsName),
        )

        const docs: string[] = ['/**']

        propTable.forEach(([prop, desc, type, defaultValue]) => {
          docs.push(
            ` * @property {${type}} ${prop} ${desc}，默认值：${defaultValue}。`,
          )
        })

        eventTable.forEach(([prop, desc, type]) => {
          docs.push(` * @event {${type}} ${prop} ${desc}`)
        })

        docs.push(' */')
        const docsStr = docs.join('\n')

        const newContent = content.replace('export default', `${docsStr}\n$&`)

        await fsp.writeFile(file, newContent)
      }
    }),
  )
}

async function generateUniModules() {
  if (!uniPluginDir.includes('uni_modules')) {
    throw Error(`${uniPluginDir} 不包含 'uni_modules'，有删除重要文件的风险`)
  }

  await rimraf(uniPluginDir)
  fse.mkdirsSync(uniPluginDir)
  await fse.copy(outDir, path.resolve(uniPluginDir))
}

export async function build() {
  const steps = [
    [deleteOutDir, `删除 ${outDir} 目录`],
    [compileTsAndGenerateVueType, `编译 ts 文件以及生成 vue 类型文件`],
    [copyLwa, `拷贝 lwa `],
    [compileVue, `编译 vue 文件`],
    [handleGlobalComponent, `全局组件类型处理`],
    [copyScss, `拷贝 scss 文件`],
    [copyStaticFiles, `拷贝静态资源`],
    [copyWxs, `拷贝 wxs 文件`],
    [copyPackageJson, `复制 package.json 文件`],
    [copyComponentsReadme, `复制组件 README.md 文件`],
    [copyRootReadme, `复制根 README.md 文件`],
    [generateUniPropsType, `生成 HbuilderX 类型提示`],
    [copyChangelog, `已复制 CHANGELOG.md 文件`],
    [generateUniModules, '已完成 uni_modules 目录构建'],
    [null, `已完成所有构建流程`],
  ] as const

  try {
    for (const [index, [step, msg]] of steps.entries()) {
      await step?.()
      consola.success(`[${index + 1}/${steps.length}] ${msg}`)
    }
  } catch (err) {
    consola.error(err)
  }
}
