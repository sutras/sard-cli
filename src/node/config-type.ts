import { type DeepRequired } from 'utility-types'
import { type HtmlTagDescriptor } from 'vite'

export type Route = {
  /**
   * 路由名称
   */
  title: string
  /**
   * 路由路径
   */
  path: string
  /**
   * 路由对应的文件路径（相对于项目根目录)
   */
  filePath?: string
  /**
   * 是否为菜单组
   */
  type?: 'group'
  /**
   * 重定向到子路由的路径
   */
  index?: string
  /**
   * 子路由
   */
  children?: Route[]
  /**
   * 是否隐藏菜单
   */
  hidden?: boolean
}

export interface UserConfig {
  name?: string
  /**
   * 开发或生产环境服务的公共基础路径
   * https://cn.vitejs.dev/config/shared-options.html#base
   */
  base?: string
  /**
   * 作为静态资源服务的文件夹
   * https://cn.vitejs.dev/config/shared-options.html#publicdir
   */
  publicDir?: string
  /**
   * 构建库相关的配置
   */
  build?: {
    /**
     * 库所在的目录（相对于项目根目录)
     */
    srcDir?: string
    /**
     * 指定输出路径（相对于项目根目录)
     */
    outDir?: string
    /**
     * uni_modules 所在的目录（相对于项目根目录)
     */
    uniModulesDir?: string
    /**
     * uni_modules 插件名
     */
    uniName?: string
  }
  /**
   * 定义在 .md 文件 @code 规则中的路径别名
   */
  codeAlias?: Record<string, string>
  /**
   * 是否有移动端的演示案例
   */
  mobile?: boolean
  /**
   * 设置指定路径下显示移动端演示案例，正则字符串
   */
  mobileVisible?: string
  /**
   * git 仓库配置，用于部署文档站点
   */
  git?: {
    /**
     * 仓库名称，例如：github
     */
    name: string
    /**
     * 图标名称，例如：github
     */
    icon: string
    /**
     * 文档站点文件所在的分支名称，例如：gh-pages
     */
    branch: string
    /**
     * 仓库地址
     */
    repo: string
    /**
     * 文档仓库地址
     */
    docsRepo: string
    /**
     * 仓库url
     */
    url: string
    /**
     * gitee 手动刷新 pages 的页面地址
     */
    pages?: string
  }[]

  /**
   * 构建文档站点的配置
   */
  site?: {
    /**
     * 指定输出路径（相对于项目根目录)
     * https://cn.vitejs.dev/config/build-options.html#build-outdir
     */
    outDir: string
    /**
     * 网站名，显示在页面头部
     */
    name?: string
    /**
     * 网站 logo，显示在页面头部，相对于 public 目录
     * https://cn.vitejs.dev/config/shared-options.html#publicdir
     */
    logo?: string
    /**
     * seo相关配置
     */
    seo?: {
      /**
       * 网页标题
       */
      title: string
      /**
       * 网页描述
       */
      description: string
    }
    /**
     * 添加到 head 的自定义标签
     * https://cn.vitejs.dev/guide/api-plugin.html#transformindexhtml
     * HtmlTagDescriptor
     */
    tags?: HtmlTagDescriptor[]
    /**
     * 首页地址
     */
    homePath?: string
    /**
     * 404 页面
     */
    notFoundPath?: string
    /**
     * 页面底部的版权信息
     */
    copyright?: string
  }
}

export type MergedConfig = DeepRequired<Omit<UserConfig, 'site'>> & {
  site: Required<NonNullable<UserConfig['site']>>
}
