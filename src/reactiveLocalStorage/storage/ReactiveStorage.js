import { ReactiveStorageError } from './Error'
import { isReactive, isRef } from 'vue'

/** @abstract */
export class ReactiveStorage {
  #reactiveStorage

  constructor(reactiveStorage) {
    if (this.constructor === ReactiveStorage) {
      throw new ReactiveStorageError('This is an abstract class')
    }
    if (!isReactive(reactiveStorage) && !isRef(reactiveStorage)) {
      throw new ReactiveStorageError(
        '"reactiveStorage" parameter must be a reactive or ref object',
      )
    }
    this.#reactiveStorage = reactiveStorage
  }

  #obtainReactiveStorageValue() {
    const reactiveStorage = this.#reactiveStorage
    return isRef(reactiveStorage) ? reactiveStorage.value : reactiveStorage
  }

  get length() {
    const reactiveStorage = this.#obtainReactiveStorageValue()
    return Object.keys(reactiveStorage).length
  }

  get reactiveStorage() {
    return this.#reactiveStorage
  }

  key(index) {
    const reactiveStorage = this.#obtainReactiveStorageValue()
    return Object.keys(reactiveStorage)[index] ?? null
  }

  setItem(key, item) {
    const reactiveStorage = this.#obtainReactiveStorageValue()
    reactiveStorage[key] = item
  }

  getItem(key) {
    const reactiveStorage = this.#obtainReactiveStorageValue()
    return reactiveStorage[key] ?? null
  }

  removeItem(key) {
    const reactiveStorage = this.#obtainReactiveStorageValue()
    if (Object.prototype.hasOwnProperty.call(reactiveStorage, key)) {
      delete reactiveStorage[key]
    }
  }

  clear() {
    const reactiveStorage = this.#obtainReactiveStorageValue()
    for (const key in reactiveStorage) {
      this.removeItem(key)
    }
  }
}
