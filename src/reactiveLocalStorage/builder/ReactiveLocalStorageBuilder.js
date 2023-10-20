import { SerializerFactory } from '../defaultSerializer/factory/SerializerFactory'
import { ReactiveLocalStorage } from '../storage/ReactiveLocalStorage'
import { ref } from 'vue'

export class ReactiveLocalStorageBuilder {
  #reactiveStorage
  #webStorage
  #serializer

  constructor() {
    this.#reactiveStorage = ref({})
    this.#webStorage = window.localStorage
    this.#serializer = SerializerFactory.createDefaultSerializer()
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
