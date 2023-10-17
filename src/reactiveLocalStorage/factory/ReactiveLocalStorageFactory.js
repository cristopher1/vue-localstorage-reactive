import { ReactiveLocalStorage } from '../storage/ReactiveLocalStorage'

export class ReactiveLocalStorageFactory {
  static createReactiveStorage(reactiveStorage, webStorage) {
    return new ReactiveLocalStorage(reactiveStorage, webStorage)
  }
}
