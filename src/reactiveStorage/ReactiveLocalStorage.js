import { ReactiveLocalStorageError } from './Error'
import { ReactiveStorage } from './ReactiveStorage'

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

  #isValidIndex(index) {
    if (typeof index !== 'number' || !Number.isInteger(index)) {
      throw new ReactiveLocalStorageError('"index" parameter must be a Number')
    }
  }

  #isValidKey(key) {
    if (typeof key !== 'string') {
      throw new ReactiveLocalStorageError('"key" parameter must be a String')
    }
  }

  get length() {
    return super.length
  }

  get reactiveStorage() {
    return super.reactiveStorage
  }

  key(index) {
    this.#isValidIndex(index)
    return super.key(index)
  }

  getItem(key) {
    this.#isValidKey(key)
    let value = super.getItem(key)
    if (!value && (value = this.#webStorage.getItem(key))) {
      try {
        value = JSON.parse(value)
      } catch (error) {
      } finally {
        super.setItem(key, value)
      }
    }
    return value
  }

  setItem(key, item) {
    this.#isValidKey(key)
    super.setItem(key, item)
    if (typeof item === 'object') {
      this.#webStorage.setItem(key, JSON.stringify(item))
    } else {
      this.#webStorage.setItem(key, item)
    }
  }

  removeItem(key) {
    this.#isValidKey(key)
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
    this.#isValidKey(key)
    super.setItem(key, item)
  }

  removeItemFromEvent(key) {
    this.#isValidKey(key)
    super.removeItem(key)
  }
}
