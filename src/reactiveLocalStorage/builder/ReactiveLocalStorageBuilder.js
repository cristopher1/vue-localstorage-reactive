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
      serialize: (value, options) => {
        const { replacer, space } = options
        return JSON.stringify(value, replacer, space)
      },
      parse: (value, options) => {
        const { reviver } = options
        return JSON.parse(value, reviver)
      },
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
