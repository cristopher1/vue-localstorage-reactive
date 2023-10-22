import { LoadDataFromLocalStorageFactory } from '../listeners/LoadDataFromLocalStorageFactory'
import { ReactiveLocalStorageBuilder } from '../builder/ReactiveLocalStorageBuilder'
import { App, reactive } from 'vue'

export class ReactiveLocalStorageInstaller {
  #activateLoadDataFromLocalStorageEventListener(reactiveLocalStorage) {
    const onLoad =
      LoadDataFromLocalStorageFactory.createListener(reactiveLocalStorage)
    window.addEventListener('load', onLoad)
  }

  #addReactiveLocalStorageToApp(app, reactiveLocalStorage) {
    app.config.globalProperties.$reactiveLocalStorage = reactiveLocalStorage
  }

  /**
   * Installs the plugin.
   *
   * @param {App<Element>} app Instance of the app created by createApp.
   * @param {object} options Plugin's configuration.
   * @param {boolean} [options.useRefStorage] Defines the reactive storage used.
   *   When this parameter is false, it is used a reactive object to save the
   *   data; otherwise, it is used a ref object. By default is true.
   * @param {object} [options.serializer] An object used to serializes and
   *   unserializes data. By default is used a wrapped JSON.
   * @param {Function} options.serializer.serialize A method used to serialize
   *   data.
   * @param {Function} options.serializer.parse A method used to unserialize
   *   data.
   */
  install(app, options = {}) {
    const { useRefStorage = true, serializer = undefined } = options

    const reactiveLocalStorageBuilder = new ReactiveLocalStorageBuilder()

    if (!useRefStorage) {
      reactiveLocalStorageBuilder.setReactiveStorage(reactive({}))
    }

    if (serializer) {
      reactiveLocalStorageBuilder.setSerializer(serializer)
    }

    const reactiveLocalStorage = reactiveLocalStorageBuilder.build()

    this.#activateLoadDataFromLocalStorageEventListener(reactiveLocalStorage)
    this.#addReactiveLocalStorageToApp(app, reactiveLocalStorage)
  }
}
