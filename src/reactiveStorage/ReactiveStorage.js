import { isReactive, isRef } from 'vue'

export class ReactiveStorage {
  #reactiveStorage

  constructor(reactiveStorage) {
    if (this.constructor == ReactiveStorage) {
      throw new Error('This is an abstract class')
    }
    if (!isReactive(reactiveStorage) && !isRef(reactiveStorage)) {
      throw new Error('"reactiveStorage" parameter must be a reactive or ref object')
    }
    this.#reactiveStorage = reactiveStorage
  }

  #obtainReactiveStorage(reactiveStorage) {
    return isRef(reactiveStorage) ? reactiveStorage.value : reactiveStorage
  }

  get length() {
    const reactiveStorage = this.#obtainReactiveStorage(this.#reactiveStorage)
    return Object.keys(reactiveStorage).length
  }

  key(index) {
    const reactiveStorage = this.#obtainReactiveStorage(this.#reactiveStorage)
    return Object.keys(reactiveStorage)[index]
  }

  setItem(key, item) {
    const reactiveStorage = this.#obtainReactiveStorage(this.#reactiveStorage)
    reactiveStorage[key] = item
  }

  getItem(key) {
    const reactiveStorage = this.#obtainReactiveStorage(this.#reactiveStorage)
    return reactiveStorage[key]
  }

  removeItem(key) {
    const reactiveStorage = this.#obtainReactiveStorage(this.#reactiveStorage)
    if (Object.prototype.hasOwnProperty.call(reactiveStorage, key)) {
      delete reactiveStorage[key]
    }
  }

  clear() {
    const reactiveStorage = this.#obtainReactiveStorage(this.#reactiveStorage)
    for (const key in reactiveStorage) {
      this.removeItem(key)
    }
  }

  getReactiveStorage() {
    return this.#reactiveStorage
  }
}
