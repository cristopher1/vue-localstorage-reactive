import { SerializerFactory } from './defaultSerializer/factory/SerializerFactory'
import { ReactiveLocalStorage } from '../storage/ReactiveLocalStorage'
import { ref } from 'vue'

export class ReactiveLocalStorageBuilder {
  #reactiveStorage
  #localStorage
  #serializer

  constructor() {
    this.#reactiveStorage = ref({})
    this.#localStorage = window.localStorage
    this.#serializer = SerializerFactory.createDefaultSerializer()
  }

  setReactiveStorage(reactiveStorage) {
    this.#reactiveStorage = reactiveStorage
  }

  setlocalStorage(localStorage) {
    this.#localStorage = localStorage
  }

  setSerializer(serializer) {
    this.#serializer = serializer
  }

  build() {
    return new ReactiveLocalStorage(
      this.#reactiveStorage,
      this.#localStorage,
      this.#serializer,
    )
  }
}
