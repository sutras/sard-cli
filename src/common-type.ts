export interface FrontMatter {
  nav?:
    | string
    | {
        title?: string
        order?: number
        hidden?: boolean
        redirect?: string
      }
  title?: string
  subtitle?: string
  order?: number
  group?:
    | string
    | {
        title: string
        order?: number
        hidden?: boolean
        redirect?: string
      }
  hidden?: boolean
  redirect?: string
  version?: string
  disableMarkdownLayout?: boolean
}
