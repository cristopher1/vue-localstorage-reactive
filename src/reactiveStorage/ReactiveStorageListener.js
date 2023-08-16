class ReactiveStorageListenerFactory {
  static createOnRemoveItemFromWebStorageListener(reactiveWebStorage) {
    return function onRemoveItemFromWebStorageListener({ key, newValue }) {
      if (!newValue) {
        reactiveWebStorage.removeItemFromEvent(key)
      }
    }
  }
  static createOnAddItemFromWebStorageListener(reactiveWebStorage) {
    return function onAddItemFromWebStorageListener({ key, newValue }) {
      if (newValue) {
        reactiveWebStorage.setItemFromEvent(key, newValue)
      }
    }
  }
  static createOnLoadReactiveWebStorageListener(reactiveWebStorage) {
    return function onLoadReactiveWebStorageListener() {
      reactiveWebStorage.loadDataFromWebStorage()
    }
  }
}

export default ReactiveStorageListenerFactory
