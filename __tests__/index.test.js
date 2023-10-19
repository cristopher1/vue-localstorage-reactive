import reactiveLocalStoragePlugin from '../src/index'
import { ReactiveLocalStorage } from '../src/reactiveLocalStorage/storage/ReactiveLocalStorage'

const createApp = () => ({
  config: {
    globalProperties: {},
  },
})

const filePath = 'src/index.js'

describe(`export default ReactiveLocalStorageInstaller (${filePath})`, () => {
  describe('(method) install', () => {
    it('Should install plugin with default parameters', () => {
      // Arrange
      const app = createApp()
      const expected = ReactiveLocalStorage

      // Act
      reactiveLocalStoragePlugin.install(app)

      // Assert
      const result =
        app.config.globalProperties.$reactiveWebStorage.localStorage

      expect(result).toBeInstanceOf(expected)
    })
    it('Should install plugin without default parameters', () => {
      // Arrange
      const app = createApp()
      const options = {
        useRefStorage: false,
        useRemoveItemFromLocalStorage: true,
        useAddItemFromLocalStorage: true,
      }
      const expected = ReactiveLocalStorage

      // Act
      reactiveLocalStoragePlugin.install(app, options)

      // Assert
      const result =
        app.config.globalProperties.$reactiveWebStorage.localStorage

      expect(result).toBeInstanceOf(expected)
    })
  })
})
