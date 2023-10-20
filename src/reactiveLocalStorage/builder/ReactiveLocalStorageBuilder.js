import { ReactiveLocalStorage } from '../storage/ReactiveLocalStorage'
import { ref } from 'vue'

export class ReactiveLocalStorageBuilder {
  #reactiveStorage
  #webStorage
  #serializer

  constructor() {
    this.#reactiveStorage = ref({})
    this.#webStorage = window.localStorage
    this.#serializer = {
      serialize: (...parameters) => JSON.stringify(...parameters),
      parse: (...parameters) => JSON.parse(...parameters),
    }
  }

  setReactiveStorage(reactiveStorage) {
    this.#reactiveStorage = reactiveStorage
  }

  setWebStorage(webStorage) {
    this.#webStorage = webStorage
  }

  setSerializer(serializer) {
    this.#serializer = serializer
  }

  build() {
    return new ReactiveLocalStorage(
      this.#reactiveStorage,
      this.#webStorage,
      this.#serializer,
    )
  }
}
