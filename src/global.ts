import { ReactiveLocalStorage } from './reactiveLocalStorage/storage/ReactiveLocalStorage'

export {}
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /** The reactiveLocalStorage object. */
    $reactiveLocalStorage: ReactiveLocalStorage
  }
}
