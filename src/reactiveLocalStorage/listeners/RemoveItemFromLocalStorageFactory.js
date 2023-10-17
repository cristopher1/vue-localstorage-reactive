import { ReactiveWebStorageListenerFactory } from './ReactiveWebStorageListenerFactory'

/** @implements {ReactiveWebStorageListenerFactory} */
export class RemoveItemFromLocalStorageFactory {
  static createListener(reactiveWebStorage) {
    return function removeItemFromLocalStorageListener({ key, newValue }) {
      if (!newValue) {
        reactiveWebStorage.removeItemFromEvent(key)
      }
    }
  }
}
