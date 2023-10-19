import {
  faker,
  getDefaultSerializer,
  getReactiveLocalStorageInstance,
} from '../helpers'
import { RemoveItemFromLocalStorageFactory } from '../../src/reactiveLocalStorage/listeners/RemoveItemFromLocalStorageFactory'
import { reactive } from 'vue'

const filePath =
  'src/reactiveLocalStorage/listeners/RemoveItemFromLocalStorageFactory.js'

describe(`class RemoveItemFromLocalStorageFactory (${filePath})`, () => {
  let reactiveLocalStorage

  beforeEach(() => {
    const webStorage = localStorage
    const reactiveStorage = reactive({})
    const defaultSerializer = getDefaultSerializer()
    reactiveLocalStorage = getReactiveLocalStorageInstance(
      reactiveStorage,
      webStorage,
      defaultSerializer,
    )
  })
  describe('(method) createListener', () => {
    it('Should return a function (listener)', () => {
      // Arrange
      const expected = 'function'

      // Act
      const result =
        RemoveItemFromLocalStorageFactory.createListener(reactiveLocalStorage)

      // Assert
      expect(typeof result).toBe(expected)
    })
  })
  describe('(function) RemoveItemFromLocalStorageListener', () => {
    it('Should remove a pair key/value into reactiveLocalStorage when the key is removed from localStorage', () => {
      // Arrange
      const listener =
        RemoveItemFromLocalStorageFactory.createListener(reactiveLocalStorage)
      const key = faker.string.sample()
      const value = faker.animal.cow()
      const storageEvent = new StorageEvent('storage', {
        key,
        newValue: null,
      })

      reactiveLocalStorage.setItem(key, value)

      window.addEventListener('storage', listener)
      // the data is removed to simulate a storage event
      localStorage.removeItem(key)

      // Act
      window.dispatchEvent(storageEvent)

      // Assert
      const result = reactiveLocalStorage.getItem(key)
      expect(result).toBeNull()
    })
  })
})
