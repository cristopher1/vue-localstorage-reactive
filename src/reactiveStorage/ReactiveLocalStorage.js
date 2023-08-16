import { ReactiveStorage } from './ReactiveStorage'

export class ReactiveLocalStorage extends ReactiveStorage {
  #webStorage

  constructor(reactiveStorage, webStorage) {
    if (!(webStorage instanceof Storage)) {
      throw new Error('"webStorage" parameter must be instanceof Storage')
    }
    super(reactiveStorage)
    this.#webStorage = webStorage
  }

  get length() {
    return super.length
  }

  key(index) {
    return super.key(index)
  }

  getItem(key) {
    let value = super.getItem(key)
    if (!value && (value = this.#webStorage.getItem(key))) {
      super.setItem(key, value)
    }
    return value
  }

  setItem(key, item) {
    super.setItem(key, item)
    this.#webStorage.setItem(key, item)
  }

  removeItem(key) {
    super.removeItem(key)
    this.#webStorage.removeItem(key)
  }

  clear() {
    super.clear()
    this.#webStorage.clear()
  }

  loadDataFromWebStorage() {
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

  getReactiveStorage() {
    return super.getReactiveStorage()
  }
}
