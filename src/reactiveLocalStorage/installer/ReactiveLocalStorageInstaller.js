import { LoadDataFromLocalStorageFactory } from '../listeners/LoadDataFromLocalStorageFactory'
import { RemoveItemFromLocalStorageFactory } from '../listeners/RemoveItemFromLocalStorageFactory'
import { SetItemFromLocalStorageFactory } from '../listeners/SetItemFromLocalStorageFactory'
import { ReactiveLocalStorageBuilder } from '../builder/ReactiveLocalStorageBuilder'
import { reactive } from 'vue'

export class ReactiveLocalStorageInstaller {
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
  install(app, options = {}) {
    const {
      useRefStorage = true,
      useRemoveItemFromLocalStorage = false,
      useAddItemFromLocalStorage = false,
      serializer = undefined,
    } = options

    const reactiveLocalStorageBuilder = new ReactiveLocalStorageBuilder()

    if (!useRefStorage) {
      reactiveLocalStorageBuilder.setReactiveStorage(reactive({}))
    }

    if (serializer) {
      reactiveLocalStorageBuilder.setSerializer(serializer)
    }

    const reactiveLocalStorage = reactiveLocalStorageBuilder.build()

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
