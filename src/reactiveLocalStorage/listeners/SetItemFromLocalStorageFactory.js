import { ReactiveWebStorageListenerFactory } from './ReactiveWebStorageListenerFactory'

/** @implements {ReactiveWebStorageListenerFactory} */
export class SetItemFromLocalStorageFactory {
  static createListener(reactiveLocalStorage) {
    return function addItemFromLocalStorageListener({ key, newValue }) {
      if (newValue) {
        reactiveLocalStorage.setItemFromEvent(key, newValue)
      }
    }
  }
}
