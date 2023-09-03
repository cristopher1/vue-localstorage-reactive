class ReactiveStorageListenerFactory {
  static createRemoveItemFromLocalStorageListener(reactiveWebStorage) {
    return function removeItemFromLocalStorageListener({ key, newValue }) {
      if (!newValue) {
        reactiveWebStorage.removeItemFromEvent(key)
      }
    }
  }

  static createAddItemFromLocalStorageListener(reactiveWebStorage) {
    return function addItemFromLocalStorageListener({ key, newValue }) {
      if (newValue) {
        reactiveWebStorage.setItemFromEvent(key, newValue)
      }
    }
  }

  static createLoadReactiveLocalStorageListener(reactiveWebStorage) {
    return function loadReactiveLocalStorageListener() {
      reactiveWebStorage.loadDataFromLocalStorage()
    }
  }
}

export default ReactiveStorageListenerFactory
