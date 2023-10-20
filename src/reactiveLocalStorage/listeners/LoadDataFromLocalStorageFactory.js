import { ReactiveWebStorageListenerFactory } from './ReactiveWebStorageListenerFactory'

/** @implements {ReactiveWebStorageListenerFactory} */
export class LoadDataFromLocalStorageFactory {
  static createListener(reactiveLocalStorage) {
    return function loadDataFromLocalStorageListener() {
      reactiveLocalStorage.loadDataFromLocalStorage()
    }
  }
}
