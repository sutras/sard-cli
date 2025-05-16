import { inject, InjectionKey } from 'vue'
import { FrontMatter } from '../../common-type'

export const frontMatterContextKey = Symbol(
  'frontMatterContext',
) as InjectionKey<FrontMatter>

export function useFrontMatter() {
  return inject(frontMatterContextKey, {})
}
