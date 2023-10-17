import { ref, reactive } from 'vue'
import { ReactiveLocalStorageFactory } from '../factory/ReactiveLocalStorageFactory'
import { LoadDataFromLocalStorageFactory } from '../listeners/LoadDataFromLocalStorageFactory'
import { RemoveItemFromLocalStorageFactory } from '../listeners/RemoveItemFromLocalStorageFactory'
import { SetItemFromLocalStorageFactory } from '../listeners/SetItemFromLocalStorageFactory'

export class ReactiveLocalStorageInstaller {
  #getReactiveStorage(useRefStorage) {
    return useRefStorage ? ref({}) : reactive({})
  }

  #getWebStorage() {
    return window.localStorage
  }

  #getSerializer(serializer) {
    const defaultSerializer = {
      serialize: (...parameters) => JSON.stringify(...parameters),
      parse: (...parameters) => JSON.parse(...parameters),
    }
    return serializer ?? defaultSerializer
  }

  #activateLoadDataFromLocalStorageEventListener(reactiveLocalStorage) {
    const onLoad =
      LoadDataFromLocalStorageFactory.createListener(reactiveLocalStorage)
    window.addEventListener('load', onLoad)
  }

  #activateRemoveItemFromLocalStorageListener(reactiveLocalStorage) {
    const onRemove =
      RemoveItemFromLocalStorageFactory.createListener(reactiveLocalStorage)
    window.addEventListener('storage', onRemove)
  }

  #activateSetItemFromLocalStorageListener(reactiveLocalStorage) {
    const onAdd =
      SetItemFromLocalStorageFactory.createListener(reactiveLocalStorage)
    window.addEventListener('storage', onAdd)
  }

  #addReactiveLocalStorageToApp(app, reactiveLocalStorage) {
    app.config.globalProperties.$reactiveWebStorage = {
      localStorage: reactiveLocalStorage,
    }
  }

  /**
   * @param {App<Element>} app - Instance of createApp
   * @param {object} options - Configuration of this plugin
   */
  install(app, options) {
    const {
      useRefStorage,
      useRemoveItemFromLocalStorage,
      useAddItemFromLocalStorage,
      serializer,
    } = options

    const reactiveStorage = this.#getReactiveStorage(useRefStorage)
    const webStorage = this.#getWebStorage()
    const serializerObject = this.#getSerializer(serializer)

    const reactiveLocalStorage =
      ReactiveLocalStorageFactory.createReactiveStorage(
        reactiveStorage,
        webStorage,
        serializerObject,
      )

    this.#activateLoadDataFromLocalStorageEventListener(reactiveLocalStorage)

    if (useRemoveItemFromLocalStorage) {
      this.#activateRemoveItemFromLocalStorageListener(reactiveLocalStorage)
    }

    if (useAddItemFromLocalStorage) {
      this.#activateSetItemFromLocalStorageListener(reactiveLocalStorage)
    }

    this.#addReactiveLocalStorageToApp(app, reactiveLocalStorage)
  }
}
