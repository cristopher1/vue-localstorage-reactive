import { ReactiveLocalStorageError } from './Error'
import { ReactiveStorage } from './ReactiveStorage'

export class ReactiveLocalStorage extends ReactiveStorage {
  #webStorage
  #serializer

  constructor(reactiveStorage, webStorage, serializer) {
    if (!(webStorage instanceof Storage)) {
      throw new ReactiveLocalStorageError(
        '"webStorage" parameter must be instanceof Storage',
      )
    }
    super(reactiveStorage)
    this.#webStorage = webStorage
    this.serializer = serializer
  }

  get length() {
    return super.length
  }

  get reactiveStorage() {
    return super.reactiveStorage
  }

  key(index) {
    return super.key(index)
  }

  getItem(key) {
    let value = super.getItem(key)
    if (!value) {
      const valueObtainedFromWebStorage = this.#webStorage.getItem(key)
      if (valueObtainedFromWebStorage) {
        value = this.#serializer.parse(valueObtainedFromWebStorage)
        super.setItem(key, value)
      }
    }
    return value
  }

  setItem(key, item) {
    super.setItem(key, item)
    const serializedData = this.#serializer.serialize(item)
    this.#webStorage.setItem(key, serializedData)
  }

  removeItem(key) {
    super.removeItem(key)
    this.#webStorage.removeItem(key)
  }

  clear() {
    super.clear()
    this.#webStorage.clear()
  }

  loadDataFromLocalStorage() {
    const webStorage = this.#webStorage
    for (let index = 0; index < webStorage.length; ++index) {
      const key = webStorage.key(index)
      const value = webStorage.getItem(key)
      super.setItem(key, value)
    }
  }

  setItemFromEvent(key, item) {
    super.setItem(key, item)
  }

  removeItemFromEvent(key) {
    super.removeItem(key)
  }
}
