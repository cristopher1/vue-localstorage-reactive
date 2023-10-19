import {
  faker,
  getDefaultSerializer,
  getReactiveLocalStorageInstance,
} from '../helpers'
import { SetItemFromLocalStorageFactory } from '../../src/reactiveLocalStorage/listeners/SetItemFromLocalStorageFactory'
import { reactive } from 'vue'

const filePath =
  'src/reactiveLocalStorage/listeners/SetItemFromLocalStorageFactory.js'

describe(`class SetItemFromLocalStorageFactory (${filePath})`, () => {
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
        SetItemFromLocalStorageFactory.createListener(reactiveLocalStorage)

      // Assert
      expect(typeof result).toBe(expected)
    })
  })
  describe('(function) SetItemFromLocalStorageListener', () => {
    it('Should update the value of a key into reactiveLocalStorage when that value is update from localStorage', () => {
      // Arrange
      const listener =
        SetItemFromLocalStorageFactory.createListener(reactiveLocalStorage)
      const key = faker.string.sample()
      const value = faker.animal.cow()
      const expected = faker.commerce.productName()
      const storageEvent = new StorageEvent('storage', {
        key,
        newValue: expected,
      })

      reactiveLocalStorage.setItem(key, value)

      window.addEventListener('storage', listener)

      // Act
      window.dispatchEvent(storageEvent)

      // Assert
      const result = reactiveLocalStorage.getItem(key)
      expect(result).toBe(expected)
    })
  })
})
