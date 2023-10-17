import { ReactiveWebStorageListenerFactory } from './ReactiveWebStorageListenerFactory'

/** @implements {ReactiveWebStorageListenerFactory} */
export class SetItemFromLocalStorageFactory {
  static createListener(reactiveWebStorage) {
    return function addItemFromLocalStorageListener({ key, newValue }) {
      if (newValue) {
        reactiveWebStorage.setItemFromEvent(key, newValue)
      }
    }
  }
}
