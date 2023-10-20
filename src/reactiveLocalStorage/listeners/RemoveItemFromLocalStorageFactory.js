import { ReactiveWebStorageListenerFactory } from './ReactiveWebStorageListenerFactory'

/** @implements {ReactiveWebStorageListenerFactory} */
export class RemoveItemFromLocalStorageFactory {
  static createListener(reactiveLocalStorage) {
    return function removeItemFromLocalStorageListener({ key, newValue }) {
      if (!newValue) {
        reactiveLocalStorage.removeItemFromEvent(key)
      }
    }
  }
}
