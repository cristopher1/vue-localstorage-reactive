import { ReactiveWebStorageListenerFactory } from './ReactiveWebStorageListenerFactory'

/** @implements {ReactiveWebStorageListenerFactory} */
export class LoadDataFromLocalStorageFactory {
  static createListener(reactiveWebStorage) {
    return function loadDataFromLocalStorageListener() {
      reactiveWebStorage.loadDataFromLocalStorage()
    }
  }
}
