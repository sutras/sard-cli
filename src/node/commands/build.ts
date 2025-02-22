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
import conventionalChangelog from 'conventional-changelog'

const { build: buildConfig } = sardConfig

const outDir = path.resolve(CWD, buildConfig.outDir)
const srcDir = path.resolve(CWD, buildConfig.srcDir)
const uniModulesDir = path.resolve(CWD, buildConfig.uniModulesDir)

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
  const result = await glob(path.resolve(srcDir, pattern).replace(/\\/g, '/'))
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
  exclude: [`${srcDir}/**/test/*`],
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

  const style = descriptor.styles[0]

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

  let compiledVue = `<template>${descriptor.template!.content}</template>\n\n`

  if (wxsMatch) {
    compiledVue += `<!-- #ifdef MP-WEIXIN -->\n${wxsMatch}\n<!-- #endif -->\n\n`
  }

  const components = geAllComponentName(transformedScript)
  if (components) {
    transformedScript = insertComponents(transformedScript, components)
  }

  compiledVue += `<script>\n${transformedScript}</script>\n`

  if (style) {
    compiledVue += `\n<style lang="scss">${style.content}</style>`
  }

  return compiledVue
}

async function compileVue() {
  const result = await glob(
    path.resolve(srcDir, './**/*.vue').replace(/\\/g, '/'),
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

async function generateChangelog() {
  await new Promise<void>((resolve, reject) => {
    let data = ''

    conventionalChangelog({
      preset: 'angular',
      releaseCount: 0,
    })
      .setEncoding('utf8')
      .on('data', (chunk) => {
        data += chunk
      })
      .on('error', (err) => {
        reject(err)
      })
      .on('end', async () => {
        await fsp.writeFile(path.resolve(CWD, 'CHANGELOG.md'), data)
        resolve()
      })
  })
}

async function copyPackageJson() {
  await fse.copyFile(
    path.resolve(CWD, 'package.json'),
    path.resolve(outDir, 'package.json'),
  )
}

async function copyReadme() {
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

async function generateUniModules() {
  const pluginDir = path.resolve(uniModulesDir, buildConfig.uniName)

  if (!uniModulesDir.includes('uni_modules')) {
    throw Error(`${uniModulesDir} 不包含 'uni_modules'，有删除重要文件的风险`)
  }

  await rimraf(pluginDir)
  fse.mkdirsSync(pluginDir)
  fse.copy(outDir, path.resolve(pluginDir))
}

export async function build() {
  const steps = [
    [deleteOutDir, `已删除 ${outDir} 目录`],
    [compileTsAndGenerateVueType, `已完成 ts 文件编译以及生成 vue 类型文件`],
    [copyLwa, `已完成 lwa 拷贝`],
    [compileVue, `已完成 vue 文件编译`],
    [handleGlobalComponent, `已完成全局组件类型处理`],
    [copyScss, `已完成 scss 拷贝`],
    [copyStaticFiles, `已完成静态资源拷贝`],
    [copyWxs, `已完成 wxs 拷贝`],
    [generateChangelog, `已完 CHANGELOG.md 文件生成`],
    [copyPackageJson, `已复制 package.json 文件`],
    [copyReadme, `已复制 README.md 文件`],
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
