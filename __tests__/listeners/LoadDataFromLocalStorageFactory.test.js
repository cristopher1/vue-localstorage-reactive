import {
  faker,
  getDefaultSerializer,
  getReactiveLocalStorageInstance,
  localStorage,
} from '../helpers'
import { LoadDataFromLocalStorageFactory } from '../../src/reactiveLocalStorage/listeners/LoadDataFromLocalStorageFactory'
import { ref } from 'vue'

const filePath =
  'src/reactiveLocalStorage/listeners/LoadDataFromLocalStorageFactory.js'

describe(`class LoadDataFromLocalStorageFactory (${filePath})`, () => {
  let reactiveLocalStorage

  beforeEach(() => {
    const webStorage = localStorage
    const refStorage = ref({})
    const defaultSerializer = getDefaultSerializer()
    reactiveLocalStorage = getReactiveLocalStorageInstance(
      refStorage,
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
        LoadDataFromLocalStorageFactory.createListener(reactiveLocalStorage)

      // Assert
      expect(typeof result).toBe(expected)
    })
  })
  describe('(function) loadDataFromLocalStorageListener', () => {
    it('Should load data into localStorage when the event load is produced', () => {
      // Arrange
      const defaultSerializer = getDefaultSerializer()
      const loadEvent = new Event('load')
      const listener =
        LoadDataFromLocalStorageFactory.createListener(reactiveLocalStorage)
      const key = faker.string.sample()
      const expected = faker.animal.cow()

      const serializedData = defaultSerializer.serialize(expected)
      localStorage.setItem(key, serializedData)

      window.addEventListener('load', listener)

      // Act
      window.dispatchEvent(loadEvent)

      // Assert
      const result = reactiveLocalStorage.getItem(key)
      expect(result).toBe(expected)
    })
  })
})
