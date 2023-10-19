import { ReactiveStorage } from '../../src/reactiveLocalStorage/storage/ReactiveStorage'
import { ReactiveStorageError } from '../../src/reactiveLocalStorage/storage/Error'
import { ref } from 'vue'

const filePath = 'src/reactiveLocalStorage/storage/ReactiveStorage.js'

describe(`class ReactiveStorage (${filePath})`, () => {
  describe('constructor', () => {
    it('Should throw a ReactiveStorageError when it attempt to create a ReactiveStorage object (ReactiveStorage is an abstract class)', () => {
      // Arrange
      const refStorage = ref({})
      const expected = ReactiveStorageError

      // Act
      const result = () => new ReactiveStorage(refStorage)

      // Assert
      expect(result).toThrow(expected)
    })
  })
})
