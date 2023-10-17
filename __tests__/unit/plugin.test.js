import reactiveLocalStorageplugin from '../../src/index'

const filePath = 'src/index.js'

const createApp = () => ({
  config: {
    globalProperties: {},
  },
})

describe(`export default (${filePath})`, () => {
  describe('(method) install', () => {
    it('Should install plugin with default parameters', () => {
      // Arrange
      const app = createApp()

      // Act
      reactiveLocalStorageplugin.install(app)

      // Assert
      const reactiveLocalStorage =
        app.config.globalProperties.$reactiveWebStorage.localStorage

      expect(reactiveLocalStorage).not.toBeUndefined()
      expect(reactiveLocalStorage).not.toBeNull()
    })
    it('Should install plugin without default parameters', () => {
      // Arrange
      const app = createApp()
      const options = {
        useRefStorage: false,
        useRemoveItemFromLocalStorage: true,
        useAddItemFromLocalStorage: true,
      }

      // Act
      reactiveLocalStorageplugin.install(app, options)

      // Assert
      const reactiveLocalStorage =
        app.config.globalProperties.$reactiveWebStorage.localStorage

      expect(reactiveLocalStorage).not.toBeUndefined()
      expect(reactiveLocalStorage).not.toBeNull()
    })
  })
})
