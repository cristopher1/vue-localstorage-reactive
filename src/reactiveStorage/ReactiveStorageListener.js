class ReactiveStorageListenerFactory {
  static createRemoveItemFromLocalStorageListener(reactiveWebStorage) {
    return ({ key, newValue }) => {
      if (!newValue) {
        reactiveWebStorage.removeItemFromEvent(key)
      }
    }
  }

  static createAddItemFromLocalStorageListener(reactiveWebStorage) {
    return ({ key, newValue }) => {
      if (newValue) {
        reactiveWebStorage.setItemFromEvent(key, newValue)
      }
    }
  }

  static createLoadReactiveLocalStorageListener(reactiveWebStorage) {
    return () => {
      reactiveWebStorage.loadDataFromLocalStorage()
    }
  }
}

export default ReactiveStorageListenerFactory
