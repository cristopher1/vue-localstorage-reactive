import {
  faker,
  localStorage,
  createArrayTestWithObjects,
  addItemsInReactiveLocalStorage,
  getDefaultSerializer,
} from './helpers'
import reactiveLocalStoragePlugin from '../src/index'
import { ReactiveLocalStorage } from '../src/reactiveLocalStorage/storage/ReactiveLocalStorage'
import { isRef, isReactive } from 'vue'

const createApp = () => ({
  config: {
    globalProperties: {},
  },
})

const filePath = 'src/index.js'

describe(`export default ReactiveLocalStorageInstaller (${filePath})`, () => {
  describe('use the installer with default parameters', () => {
    describe('(method) install', () => {
      it('Should install plugin with default parameters', () => {
        // Arrange
        const app = createApp()
        const expected = ReactiveLocalStorage

        // Act
        reactiveLocalStoragePlugin.install(app)

        // Assert
        const result = app.config.globalProperties.$reactiveLocalStorage

        expect(result).toBeInstanceOf(expected)
      })
    })

    describe('test an instance of ReactiveLocalStorage with default parameters', () => {
      let defaultSerializer
      let reactiveLocalStorage

      beforeEach(() => {
        defaultSerializer = getDefaultSerializer()

        const app = createApp()

        reactiveLocalStoragePlugin.install(app)

        reactiveLocalStorage = app.config.globalProperties.$reactiveLocalStorage
      })

      afterEach(() => {
        localStorage.clear()
      })

      describe('(getter) length', () => {
        it('Should return 0 when reactiveLocalStorage is empty', () => {
          // Arrange
          const expected = 0

          // Act
          const result = reactiveLocalStorage.length
          const localStorageLength = localStorage.length

          // Assert
          expect(result).toBe(expected)
          expect(localStorageLength).toBe(expected)
        })
        it('Should return 3 when reactiveLocalStorage contain 3 elements', () => {
          // Arrange
          const expected = 3
          const data = createArrayTestWithObjects(expected)
          addItemsInReactiveLocalStorage(data, reactiveLocalStorage)

          // Act
          const result = reactiveLocalStorage.length
          const localStorageLength = localStorage.length

          // Assert
          expect(result).toBe(expected)
          expect(localStorageLength).toBe(expected)
        })
      })
      describe('(getter) reactiveStorage', () => {
        it('Should return the vue ref instance used', () => {
          // Arrange
          const expected = true

          // Act
          const result = isRef(reactiveLocalStorage.reactiveStorage)

          // Assert
          expect(result).toBe(expected)
        })
      })
      describe('(method) key', () => {
        it('Should return null when the key not exists into reactiveLocalStorage', () => {
          // Arrange
          const index = 0

          // Act
          const result = reactiveLocalStorage.key(index)

          // Assert
          expect(result).toBeNull()
        })
        it('Should return the key in fourth position into reactiveLocalStorage', () => {
          // Arrange
          const index = 3
          const nData = 4
          const data = createArrayTestWithObjects(nData)
          const expected = data[index].key
          addItemsInReactiveLocalStorage(data, reactiveLocalStorage)

          // Act
          const result = reactiveLocalStorage.key(index)

          // Assert
          expect(result).toBe(expected)
        })
      })
      describe('(method) setItem', () => {
        it('Should set an object (nested object) using serialize and parse options', () => {
          // Arrange
          const serializeOptions = {
            replacer: function (key, value) {
              const unserializedData = this[key]
              if (unserializedData instanceof Date) {
                return {
                  __typeof__: 'Date',
                  value: unserializedData.toJSON(),
                }
              }
              return value
            },
            space: 1,
          }
          const parseOptions = {
            reviver: function (key, value) {
              const { __typeof__ } = value
              if (__typeof__ === 'Date') {
                return new Date(value.value)
              }
              return value
            },
          }

          const key = faker.string.sample(30)
          const expected = {
            key1: faker.string.sample(90),
            key2: faker.date.birthdate(),
            key3: {
              nestedObject: {
                key1: faker.string.symbol(17),
                nestedObject: [
                  {
                    username: faker.internet.userName(),
                    password: faker.internet.password({ length: 50 }),
                  },
                  {
                    username: faker.internet.userName(),
                    password: faker.internet.password({ length: 50 }),
                  },
                  {
                    username: faker.internet.userName(),
                    password: faker.internet.password({ length: 50 }),
                  },
                ],
              },
            },
          }

          // Act
          reactiveLocalStorage.setItem(key, expected, serializeOptions)

          // Assert
          const result = reactiveLocalStorage.getItem(key, parseOptions)
          const valueReturnedFromLocalStorage = localStorage.getItem(key)
          const unserializedValue = defaultSerializer.parse(
            valueReturnedFromLocalStorage,
            parseOptions,
          )

          expect(result).toEqual(expected)
          expect(result).toEqual(unserializedValue)
        })
        it('Should override an object saved in reactiveLocalStorage when set a new object using the same key', () => {
          // Arrange
          const key = faker.string.sample(50)
          const initValue = {
            user: faker.internet.userName(),
            password: faker.internet.password({ length: 17 }),
          }
          const expected = {
            ...initValue,
            otherInfo: { newPassword: faker.internet.password({ length: 20 }) },
          }

          reactiveLocalStorage.setItem(key, initValue)

          // Act
          reactiveLocalStorage.setItem(key, expected)

          // Assert
          const result = reactiveLocalStorage.getItem(key)
          const valueReturnedFromLocalStorage = localStorage.getItem(key)
          const unserializedValue = defaultSerializer.parse(
            valueReturnedFromLocalStorage,
          )

          expect(result).toEqual(expected)
          expect(result).toEqual(unserializedValue)
        })
      })
      describe('(method) getItem', () => {
        it('Should return null when the key not exists into reactiveLocalStorage nor into localStorage', () => {
          // Arrange
          const key = faker.string.sample(17)

          // Act
          const result = reactiveLocalStorage.getItem(key)

          // Assert
          expect(result).toBeNull()
        })
        describe('when the key exists in reactiveLocalStorage', () => {
          it('Should return an object (simple object)', () => {
            // Arrange
            const key = 'simpleObject'
            const expected = {
              user: faker.internet.userName(),
              password: faker.internet.password({ length: 17 }),
            }

            reactiveLocalStorage.setItem(key, expected)

            // Act
            const result = reactiveLocalStorage.getItem(key)

            // Assert
            expect(result).toEqual(expected)
          })
        })
        describe('when the key not exists in reactiveLocalStorage, but exists into localStorage', () => {
          it('Should return an object (nested object)', () => {
            // Arrange
            const key = faker.string.numeric()
            const expected = {
              nestedObject: {
                nestedObject: {
                  key1: faker.string.hexadecimal(),
                  key2: faker.number.int(),
                },
              },
            }

            const serializedData = defaultSerializer.serialize(expected)
            localStorage.setItem(key, serializedData)

            // Act
            const result = reactiveLocalStorage.getItem(key)

            // Assert
            expect(result).toEqual(expected)
          })
        })
      })
      describe('(method) removeItem', () => {
        it('Should call this method inclusive if not exists the key into reactiveLocalStorage', () => {
          // Arrange
          const key = faker.string.symbol()

          // Act
          const result = () => reactiveLocalStorage.removeItem(key)

          // Assert
          expect(result).not.toThrow()
        })
        it('Should remove an object (nested object)', () => {
          // Arrange
          const key = faker.string.sample()
          const value = {
            key: faker.string.sample(79),
            nestedObject: {
              key: faker.number.int(),
              nestedObject: {
                key: faker.string.sample(),
              },
            },
          }

          reactiveLocalStorage.setItem(key, value)

          // Act
          reactiveLocalStorage.removeItem(key)

          // Assert
          const result = reactiveLocalStorage.getItem(key)

          expect(result).toBeNull()
        })
      })
      describe('(method) clear', () => {
        it('Should remove all element into ReactiveLocalStorage', () => {
          // Arrange
          const expected = 0
          const nElements = faker.number.int({
            max: 100,
          })
          const data = createArrayTestWithObjects(nElements)
          addItemsInReactiveLocalStorage(data, reactiveLocalStorage)

          // Act
          reactiveLocalStorage.clear()

          // Assert
          const result = reactiveLocalStorage.length
          const localStorageLength = localStorage.length

          expect(result).toBe(expected)
          expect(localStorageLength).toBe(expected)
        })
      })
      describe('(method) loadDataFromLocalStorage', () => {
        it('Should load data from localStorage', () => {
          // Arrange
          const input = [
            { key: faker.string.sample(), value: faker.animal.bear() },
            { key: faker.string.sample(), value: faker.commerce.department() },
            {
              key: faker.string.sample(),
              value: faker.company.buzzPhrase(),
            },
          ]

          for (const { key, value } of input) {
            const serializedData = defaultSerializer.serialize(value)
            localStorage.setItem(key, serializedData)
          }

          // Act
          reactiveLocalStorage.loadDataFromLocalStorage()

          // Assert
          for (const { key, value } of input) {
            const expected = value
            const result = reactiveLocalStorage.getItem(key)

            expect(result).toBe(expected)
          }
        })
      })
      describe('(function) loadDataFromLocalStorageListener', () => {
        it('Should load data into localStorage when the event load is produced', () => {
          // Arrange
          const loadEvent = new Event('load')
          const key = faker.string.sample()
          const expected = faker.animal.cow()

          const serializedData = defaultSerializer.serialize(expected)
          localStorage.setItem(key, serializedData)

          // Act
          window.dispatchEvent(loadEvent)

          // Assert
          const result = reactiveLocalStorage.getItem(key)
          expect(result).toBe(expected)
        })
      })
    })
  })
  describe('use the installer without default parameters', () => {
    describe('(method) install', () => {
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
        const result = app.config.globalProperties.$reactiveLocalStorage

        expect(result).toBeInstanceOf(expected)
      })
    })

    describe('test an instance of ReactiveLocalStorage without default parameters', () => {
      let defaultSerializer
      let reactiveLocalStorage

      beforeEach(() => {
        defaultSerializer = getDefaultSerializer()

        const app = createApp()
        const options = {
          useRefStorage: false,
          useRemoveItemFromLocalStorage: true,
          useAddItemFromLocalStorage: true,
          serializer: defaultSerializer,
        }

        reactiveLocalStoragePlugin.install(app, options)

        reactiveLocalStorage = app.config.globalProperties.$reactiveLocalStorage
      })

      afterEach(() => {
        localStorage.clear()
      })

      describe('(getter) length', () => {
        it('Should return 0 when reactiveLocalStorage is empty', () => {
          // Arrange
          const expected = 0

          // Act
          const result = reactiveLocalStorage.length
          const localStorageLength = localStorage.length

          // Assert
          expect(result).toBe(expected)
          expect(localStorageLength).toBe(expected)
        })
        it('Should return 3 when reactiveLocalStorage contain 3 elements', () => {
          // Arrange
          const expected = 3
          const data = createArrayTestWithObjects(expected)
          addItemsInReactiveLocalStorage(data, reactiveLocalStorage)

          // Act
          const result = reactiveLocalStorage.length
          const localStorageLength = localStorage.length

          // Assert
          expect(result).toBe(expected)
          expect(localStorageLength).toBe(expected)
        })
      })
      describe('(getter) reactiveStorage', () => {
        it('Should return the vue ref instance used', () => {
          // Arrange
          const expected = true

          // Act
          const result = isReactive(reactiveLocalStorage.reactiveStorage)

          // Assert
          expect(result).toBe(expected)
        })
      })
      describe('(method) key', () => {
        it('Should return null when the key not exists into reactiveLocalStorage', () => {
          // Arrange
          const index = 0

          // Act
          const result = reactiveLocalStorage.key(index)

          // Assert
          expect(result).toBeNull()
        })
        it('Should return the key in fourth position into reactiveLocalStorage', () => {
          // Arrange
          const index = 3
          const nData = 4
          const data = createArrayTestWithObjects(nData)
          const expected = data[index].key
          addItemsInReactiveLocalStorage(data, reactiveLocalStorage)

          // Act
          const result = reactiveLocalStorage.key(index)

          // Assert
          expect(result).toBe(expected)
        })
      })
      describe('(method) setItem', () => {
        it('Should set an object (nested object)', () => {
          // Arrange
          const key = faker.string.sample(30)
          const expected = {
            key1: faker.string.sample(90),
            key2: faker.number.int(),
            key3: {
              nestedObject: {
                key1: faker.string.symbol(17),
                nestedObject: [
                  {
                    username: faker.internet.userName(),
                    password: faker.internet.password({ length: 50 }),
                  },
                  {
                    username: faker.internet.userName(),
                    password: faker.internet.password({ length: 50 }),
                  },
                  {
                    username: faker.internet.userName(),
                    password: faker.internet.password({ length: 50 }),
                  },
                ],
              },
            },
          }

          // Act
          reactiveLocalStorage.setItem(key, expected)

          // Assert
          const result = reactiveLocalStorage.getItem(key)
          const valueReturnedFromLocalStorage = localStorage.getItem(key)
          const unserializedValue = defaultSerializer.parse(
            valueReturnedFromLocalStorage,
          )

          expect(result).toEqual(expected)
          expect(result).toEqual(unserializedValue)
        })
        it('Should override an object saved in reactiveLocalStorage when set a new object using the same key', () => {
          // Arrange
          const key = faker.string.sample(50)
          const initValue = {
            user: faker.internet.userName(),
            password: faker.internet.password({ length: 17 }),
          }
          const expected = {
            ...initValue,
            otherInfo: { newPassword: faker.internet.password({ length: 20 }) },
          }

          reactiveLocalStorage.setItem(key, initValue)

          // Act
          reactiveLocalStorage.setItem(key, expected)

          // Assert
          const result = reactiveLocalStorage.getItem(key)
          const valueReturnedFromLocalStorage = localStorage.getItem(key)
          const unserializedValue = defaultSerializer.parse(
            valueReturnedFromLocalStorage,
          )

          expect(result).toEqual(expected)
          expect(result).toEqual(unserializedValue)
        })
      })
      describe('(method) getItem', () => {
        it('Should return null when the key not exists into reactiveLocalStorage nor into localStorage', () => {
          // Arrange
          const key = faker.string.sample(17)

          // Act
          const result = reactiveLocalStorage.getItem(key)

          // Assert
          expect(result).toBeNull()
        })
        describe('when the key exists in reactiveLocalStorage', () => {
          it('Should return an object (simple object)', () => {
            // Arrange
            const key = 'simpleObject'
            const expected = {
              user: faker.internet.userName(),
              password: faker.internet.password({ length: 17 }),
            }

            reactiveLocalStorage.setItem(key, expected)

            // Act
            const result = reactiveLocalStorage.getItem(key)

            // Assert
            expect(result).toEqual(expected)
          })
        })
        describe('when the key not exists in reactiveLocalStorage, but exists into localStorage', () => {
          it('Should return an object (nested object)', () => {
            // Arrange
            const key = faker.string.numeric()
            const expected = {
              nestedObject: {
                nestedObject: {
                  key1: faker.string.hexadecimal(),
                  key2: faker.number.int(),
                },
              },
            }

            const serializedData = defaultSerializer.serialize(expected)
            localStorage.setItem(key, serializedData)

            // Act
            const result = reactiveLocalStorage.getItem(key)

            // Assert
            expect(result).toEqual(expected)
          })
        })
      })
      describe('(method) removeItem', () => {
        it('Should call this method inclusive if not exists the key into reactiveLocalStorage', () => {
          // Arrange
          const key = faker.string.symbol()

          // Act
          const result = () => reactiveLocalStorage.removeItem(key)

          // Assert
          expect(result).not.toThrow()
        })
        it('Should remove an object (nested object)', () => {
          // Arrange
          const key = faker.string.sample()
          const value = {
            key: faker.string.sample(79),
            nestedObject: {
              key: faker.number.int(),
              nestedObject: {
                key: faker.string.sample(),
              },
            },
          }

          reactiveLocalStorage.setItem(key, value)

          // Act
          reactiveLocalStorage.removeItem(key)

          // Assert
          const result = reactiveLocalStorage.getItem(key)

          expect(result).toBeNull()
        })
      })
      describe('(method) clear', () => {
        it('Should remove all element into ReactiveLocalStorage', () => {
          // Arrange
          const expected = 0
          const nElements = faker.number.int({
            max: 100,
          })
          const data = createArrayTestWithObjects(nElements)
          addItemsInReactiveLocalStorage(data, reactiveLocalStorage)

          // Act
          reactiveLocalStorage.clear()

          // Assert
          const result = reactiveLocalStorage.length
          const localStorageLength = localStorage.length

          expect(result).toBe(expected)
          expect(localStorageLength).toBe(expected)
        })
      })
      describe('(method) loadDataFromLocalStorage', () => {
        it('Should load data from localStorage', () => {
          // Arrange
          const input = [
            { key: faker.string.sample(), value: faker.animal.bear() },
            { key: faker.string.sample(), value: faker.commerce.department() },
            {
              key: faker.string.sample(),
              value: faker.company.buzzPhrase(),
            },
          ]

          for (const { key, value } of input) {
            const serializedData = defaultSerializer.serialize(value)
            localStorage.setItem(key, serializedData)
          }

          // Act
          reactiveLocalStorage.loadDataFromLocalStorage()

          // Assert
          for (const { key, value } of input) {
            const expected = value
            const result = reactiveLocalStorage.getItem(key)

            expect(result).toBe(expected)
          }
        })
      })
      describe('(function) loadDataFromLocalStorageListener', () => {
        it('Should load data into localStorage when the event load is produced using the setLoadDataFromLocalStorageParameters', () => {
          // Arrange
          const serializeOptions = {
            replacer: function (key, value) {
              if (typeof value === 'bigint') {
                return {
                  __typeof__: 'bigint',
                  value: value.toString(),
                }
              }
              return value
            },
            space: 1,
          }
          const parseOptions = {
            reviver: function (key, value) {
              const { __typeof__ } = value
              if (__typeof__ === 'bigint') {
                return BigInt(value.value)
              }
              return value
            },
          }

          reactiveLocalStorage.setLoadDataFromLocalStorageParameters(
            parseOptions,
          )

          const loadEvent = new Event('load')
          const key = faker.string.sample()
          const expected = faker.number.bigInt()

          const serializedData = defaultSerializer.serialize(
            expected,
            serializeOptions,
          )

          localStorage.setItem(key, serializedData)

          // Act
          window.dispatchEvent(loadEvent)

          // Assert
          const result = reactiveLocalStorage.getItem(key)
          expect(result).toBe(expected)
        })
      })
    })
  })
})
