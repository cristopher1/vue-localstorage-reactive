import { ReactiveLocalStorageError } from './Error'
import { ReactiveStorage } from './ReactiveStorage'
import { serializer } from './Serializers/JSONSerializer'

export class ReactiveLocalStorage extends ReactiveStorage {
  #webStorage

  constructor(reactiveStorage, webStorage) {
    if (!(webStorage instanceof Storage)) {
      throw new ReactiveLocalStorageError(
        '"webStorage" parameter must be instanceof Storage',
      )
    }
    super(reactiveStorage)
    this.#webStorage = webStorage
  }

  #isInvalidSerializeData(data) {
    const validTypes = ['string']
    const type = typeof data
    return validTypes.includes(type)
  }

  #parseData(value) {
    let parseData = value
    try {
      parseData = serializer.parse(value)
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error
      }
    }
    return parseData
  }

  #serializeData(value) {
    return this.#isInvalidSerializeData(value)
      ? value
      : serializer.serialize(value)
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
    if (!value && (value = this.#webStorage.getItem(key))) {
      value = this.#parseData(value)
      super.setItem(key, value)
    }
    return value
  }

  setItem(key, item) {
    super.setItem(key, item)
    const serializedData = this.#serializeData(item)
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
