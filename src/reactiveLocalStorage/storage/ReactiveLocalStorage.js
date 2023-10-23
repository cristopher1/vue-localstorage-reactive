import { ReactiveStorage } from './ReactiveStorage'

export class ReactiveLocalStorage extends ReactiveStorage {
  #localStorage
  #serializer
  #loadDataFromLocalStorageParameters

  constructor(reactiveStorage, localStorage, serializer) {
    super(reactiveStorage)
    this.#localStorage = localStorage
    this.#serializer = serializer
    this.#loadDataFromLocalStorageParameters = {}
  }

  setLoadDataFromLocalStorageParameters(parameters) {
    this.#loadDataFromLocalStorageParameters = parameters
  }

  /**
   * Obtains the number of elements saved in reactiveLocalStorage.
   *
   * @returns {number} Number Of elements saved in reactiveLocalStorage.
   */
  get length() {
    return super.length
  }

  /**
   * Returns the reactiveStorage used by ReactiveLocalStorage.
   *
   * @returns {any} The ReactiveStorage used by ReactiveLocalStorage.
   */
  get reactiveStorage() {
    return super.reactiveStorage
  }

  /**
   * Returns the key in nth position into reactiveLocalStorage.
   *
   * @param {number} index The index of a key in the reactiveLocalStorage.
   * @returns {string} The key in nth position.
   */
  key(index) {
    return super.key(index)
  }

  getItem(key, parseOptions = {}) {
    let value = super.getItem(key)
    if (!value) {
      const valueObtainedFromWebStorage = this.#localStorage.getItem(key)
      if (valueObtainedFromWebStorage) {
        value = this.#serializer.parse(
          valueObtainedFromWebStorage,
          parseOptions,
        )
        super.setItem(key, value)
      }
    }
    return value
  }

  setItem(key, item, serializeOptions = {}) {
    super.setItem(key, item)
    const serializedData = this.#serializer.serialize(item, serializeOptions)
    this.#localStorage.setItem(key, serializedData)
  }

  removeItem(key) {
    super.removeItem(key)
    this.#localStorage.removeItem(key)
  }

  /** Removes all pair key/value into reactiveLocalStorage. */
  clear() {
    super.clear()
    this.#localStorage.clear()
  }

  /**
   * This method must be used into listener object that listens an event. Sets
   * the data from localStorage into reactiveLocalStorage when the listener
   * event is fired.
   *
   * @example
   *   // Obtains an instance of reactiveLocalStorage using default serializer.
   *
   *   // For this example, the data is serialized using the following options:
   *   // const serializeOptions = {
   *   //   replacer: function (key, value) {
   *   //     if (typeof value === 'bigint') {
   *   //       return {
   *   //         __typeof__: 'bigint',
   *   //         value: value.toString(),
   *   //       }
   *   //     }
   *   //     return value
   *   //   },
   *   //   space: 1,
   *   // }
   *
   *   const parseOptions = {
   *     reviver: function (key, value) {
   *       const { __typeof__ } = value
   *       if (__typeof__ === 'bigint') {
   *         return BigInt(value.value)
   *       }
   *       return value
   *     },
   *   }
   *
   *   function createLoadDataFromLocalStorage(reactiveLocalStorage) {
   *     return () => {
   *       reactiveLocalStorage.loadDataFromLocalStorage(parseOptions)
   *     }
   *   }
   *
   *   // Obtains the listener.
   *   const loadDataFromLocalStorage = createLoadDataFromLocalStorage(
   *     reactiveLocalStorage,
   *   )
   *
   *   // Listens the event.
   *   window.addEventListener('load', loadDataFromLocalStorage)
   *
   * @param {object} parseOptions The options used by the parse method
   *   implemented by the serializer object.
   */
  loadDataFromLocalStorage() {
    const parseOptions = this.#loadDataFromLocalStorageParameters
    const localStorage = this.#localStorage
    const length = localStorage.length
    for (let index = 0; index < length; ++index) {
      const key = localStorage.key(index)
      const value = localStorage.getItem(key)
      const unserializedValue = this.#serializer.parse(value, parseOptions)
      super.setItem(key, unserializedValue)
    }
  }

  /**
   * This method must be used into listener object that listens a storage event.
   * Updates a pair key/value into reactiveLocalStorage when a pair key/value is
   * updated from storage area.
   *
   * @example
   *   // Obtains an instance of reactiveLocalStorage.
   *
   *   function createSetItemFromLocalStorageListener(reactiveLocalStorage) {
   *     // Listener that updates a pair key/value into
   *     // reactiveLocalStorage when the pair key/value is updated
   *     // from storage area.
   *     return ({ key, newValue }) => {
   *       if (newValue) {
   *         reactiveLocalStorage.setItemFromEvent(key, newValue)
   *       }
   *     }
   *   }
   *
   *   // Obtains the listener.
   *   const setItemFromLocalStorageListener =
   *     createSetItemFromLocalStorageListener(reactiveLocalStorage)
   *
   *   // Listens the storage event.
   *   window.addEventListener('storage', setItemFromLocalStorageListener)
   *
   * @param {string} key A key into reactiveLocalStorage.
   * @param {any} item The item to save.
   */
  setItemFromEvent(key, item) {
    super.setItem(key, item)
  }

  /**
   * This method must be used into listener object that listens a storage event.
   * Removes a pair key/value into reactiveLocalStorage when a pair key/value is
   * removed from storage area.
   *
   * @example
   *   // Obtains an instance of reactiveLocalStorage.
   *
   *   function createRemoveItemFromLocalStorageListener(
   *     reactiveLocalStorage,
   *   ) {
   *     // Listener that removes a pair key/value into
   *     // reactiveLocalStorage when the pair key/value is removed
   *     // from storage area.
   *     return ({ key, newValue }) => {
   *       if (!newValue) {
   *         reactiveLocalStorage.removeItemFromEvent(key)
   *       }
   *     }
   *   }
   *
   *   // Obtains the listener.
   *   const removeItemFromLocalStorageListener =
   *     createRemoveItemFromLocalStorageListener(reactiveLocalStorage)
   *
   *   // Listens the storage event.
   *   window.addEventListener('storage', removeItemFromLocalStorageListener)
   *
   * @param {string} key A key into reactiveLocalStorage.
   */
  removeItemFromEvent(key) {
    super.removeItem(key)
  }
}
