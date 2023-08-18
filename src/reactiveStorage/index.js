import { ref, reactive } from 'vue'
import { ReactiveLocalStorage } from './ReactiveLocalStorage'
import ReactiveStorageListenerFactory from './ReactiveStorageListener'

export function createReactiveStorage(webStorage, config) {
  const {
    useRefStorage,
    useLoadDataFromLocalStorage,
    useRemoveItemFromLocalStorage,
    useAddItemFromLocalStorage,
  } = config

  const reactiveStorage = useRefStorage ? ref({}) : reactive({})
  const reactiveLocalStorage = new ReactiveLocalStorage(reactiveStorage, webStorage)

  if (useLoadDataFromLocalStorage) {
    const onLoad =
      ReactiveStorageListenerFactory.createLoadReactiveLocalStorageListener(reactiveLocalStorage)
    window.addEventListener('load', onLoad)
  }
  if (useRemoveItemFromLocalStorage) {
    const onRemoveItem =
      ReactiveStorageListenerFactory.createRemoveItemFromLocalStorageListener(reactiveLocalStorage)
    window.addEventListener('storage', onRemoveItem)
  }
  if (useAddItemFromLocalStorage) {
    const onAddItem =
      ReactiveStorageListenerFactory.createAddItemFromLocalStorageListener(reactiveLocalStorage)
    window.addEventListener('storage', onAddItem)
  }
  return reactiveLocalStorage
}
