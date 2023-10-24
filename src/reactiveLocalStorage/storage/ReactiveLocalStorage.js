import { ReactiveStorage } from './ReactiveStorage'

export class ReactiveLocalStorage extends ReactiveStorage {
  #localStorage
  #serializer
  #loadDataFromLocalStorageParameters

  /**
   * @param {ReactiveStorage} reactiveStorage An instance of reactiveStorage
   *   class.
   * @param {Storage} localStorage The localStorage object.
   * @param {object} serializer An object used to serialize and unserialize
   *   data.
   * @param {(value: any, serializeOptions?: object) => string} serializer.serialize
   *   A function used to serialize data.
   * @param {(value: string, parseOptions?: object) => any} serializer.parse A
   *   function used to unserialize data.
   */
  constructor(reactiveStorage, localStorage, serializer) {
    super(reactiveStorage)
    this.#localStorage = localStorage
    this.#serializer = serializer
    this.#loadDataFromLocalStorageParameters = {}
  }

  /**
   * Obtains the number of elements saved in reactiveLocalStorage.
   *
   * @returns {number} Number of elements saved in reactiveLocalStorage.
   * @override
   * @readonly
   */
  get length() {
    return super.length
  }

  /**
   * Returns the reactiveStorage object used by reactiveLocalStorage instance.
   *
   * @returns {any} The reactiveStorage object used by reactiveLocalStorage
   *   instance.
   * @override
   * @readonly
   */
  get reactiveStorage() {
    return super.reactiveStorage
  }

  /**
   * Sets the parseOptions that will be used to serialize.parse method that will
   * be called into loadDataFromLocalStorage method.
   *
   * @param {object} parameters The parameters used to parse data when the
   *   loadDataFromLocalStorage method is called.
   */
  setLoadDataFromLocalStorageParameters(parameters) {
    this.#loadDataFromLocalStorageParameters = parameters
  }

  /**
   * Returns the key in nth position into reactiveLocalStorage.
   *
   * @param {number} index The index of a key in the reactiveLocalStorage.
   * @returns {string} The key in nth position.
   * @override
   */
  key(index) {
    return super.key(index)
  }

  /**
   * Returns the parsed key's value saved into reactiveLocalStorage.
   *
   * @example
   *   // Obtains an instance of reactiveLocalStorage, in this case will be used a
   *   // reactiveLocalStorage with a default serializer.
   *
   *   const serializeOptions = {
   *     replacer: function (key, value) {
   *       const unserializedData = this[key]
   *       if (unserializedData instanceof Date) {
   *         return {
   *           __typeof__: 'Date',
   *           value: unserializedData.toJSON(),
   *         }
   *       }
   *       return value
   *     },
   *     space: 1,
   *   }
   *
   *   const parseOptions = {
   *     reviver: function (key, value) {
   *       const { __typeof__ } = value
   *       if (__typeof__ === 'Date') {
   *         return new Date(value.value)
   *       }
   *       return value
   *     },
   *   }
   *
   *   const date = new Date()
   *
   *   reactiveLocalStorage.setItem('key', date, serializeOptions)
   *
   *   const parseData = reactiveLocalStorage.getItem('key', parseOptions)
   *
   * @param {string} key A key saved into reactiveLocalStorage.
   * @param {object} parseOptions An object that contains the options that will
   *   be passed to serializer.parse method.
   * @returns {any} The parsed key's value.
   * @override
   */
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

  /**
   * Saves the pair key/value into reactiveLocalStorage.
   *
   * @example
   *   // Obtains an instance of reactiveLocalStorage, in this case will be used a
   *   // reactiveLocalStorage with a default serializer.
   *
   *   const serializeOptions = {
   *     replacer: function (key, value) {
   *       if (typeof value === 'bigint') {
   *         return {
   *           __typeof__: 'bigint',
   *           value: value.toString(),
   *         }
   *       }
   *       return value
   *     },
   *     space: 1,
   *   }
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
   *   const bigInt = BigInt(200)
   *
   *   reactiveLocalStorage.setItem('key', bigInt, serializeOptions)
   *
   * @param {string} key A key saved into reactiveLocalStorage.
   * @param {any} item The key's value to save.
   * @param {object} serializeOptions An object that contains the options that
   *   will be passed to serializer.serialize method.
   * @override
   */
  setItem(key, item, serializeOptions = {}) {
    super.setItem(key, item)
    const serializedData = this.#serializer.serialize(item, serializeOptions)
    this.#localStorage.setItem(key, serializedData)
  }

  /**
   * Removes the pair key/value from reactiveLocalStorage.
   *
   * @param {string} key The key to remove from reactiveLocalStorage.
   * @override
   */
  removeItem(key) {
    super.removeItem(key)
    this.#localStorage.removeItem(key)
  }

  /**
   * Removes all pairs key/value into reactiveLocalStorage.
   *
   * @override
   */
  clear() {
    super.clear()
    this.#localStorage.clear()
  }

  /**
   * This method must be used into listener object that listens an event. Sets
   * the data from localStorage into reactiveLocalStorage when the listened
   * event is fired.
   *
   * @example
   *   // Obtains an instance of reactiveLocalStorage, in this case will be used a
   *   // reactiveLocalStirage with a default serializer.
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
   *   reactiveLocalStorage.setLoadDataFromLocalStorageParameters(
   *     parseOptions,
   *   )
   *
   *   function createLoadDataFromLocalStorage(reactiveLocalStorage) {
   *     return () => {
   *       reactiveLocalStorage.loadDataFromLocalStorage()
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
}
