import { ReactiveStorageError } from './Error'
import { isReactive, isRef } from 'vue'

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

  #isValidIndex(index) {
    if (typeof index !== 'number' || !Number.isInteger(index)) {
      throw new ReactiveStorageError('"index" parameter must be a Number')
    }
  }

  #isValidKey(key) {
    if (typeof key !== 'string') {
      throw new ReactiveStorageError('"key" parameter must be a String')
    }
  }

  #obtainReactiveStorageValue(reactiveStorage) {
    return isRef(reactiveStorage) ? reactiveStorage.value : reactiveStorage
  }

  get length() {
    const reactiveStorage = this.#obtainReactiveStorageValue(
      this.#reactiveStorage,
    )
    return Object.keys(reactiveStorage).length
  }

  get reactiveStorage() {
    return this.#reactiveStorage
  }

  key(index) {
    this.#isValidIndex(index)
    const reactiveStorage = this.#obtainReactiveStorageValue(
      this.#reactiveStorage,
    )
    return Object.keys(reactiveStorage)[index] ?? null
  }

  setItem(key, item) {
    this.#isValidKey(key)
    const reactiveStorage = this.#obtainReactiveStorageValue(
      this.#reactiveStorage,
    )
    reactiveStorage[key] = item
  }

  getItem(key) {
    this.#isValidKey(key)
    const reactiveStorage = this.#obtainReactiveStorageValue(
      this.#reactiveStorage,
    )
    return reactiveStorage[key]
  }

  removeItem(key) {
    this.#isValidKey(key)
    const reactiveStorage = this.#obtainReactiveStorageValue(
      this.#reactiveStorage,
    )
    if (Object.prototype.hasOwnProperty.call(reactiveStorage, key)) {
      delete reactiveStorage[key]
    }
  }

  clear() {
    const reactiveStorage = this.#obtainReactiveStorageValue(
      this.#reactiveStorage,
    )
    for (const key in reactiveStorage) {
      this.removeItem(key)
    }
  }
}
