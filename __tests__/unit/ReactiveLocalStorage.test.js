import { ReactiveLocalStorage } from '../../src/reactiveStorage/ReactiveLocalStorage'
import {
  ReactiveLocalStorageError,
  ReactiveStorageError,
} from '../../src/reactiveStorage/Error'
import { ref, reactive, isRef, isReactive } from 'vue'
import { faker } from '@faker-js/faker'

const { localStorage } = window
const filePath = 'src/reactiveStorage/ReactiveLocalStorage.js'

faker.seed(100)

const getReactiveLocalStorageInstance = (reactiveStorage, webStorage) => {
  return new ReactiveLocalStorage(reactiveStorage, webStorage)
}

const createArrayTestWithObjects = (nElement) => {
  const array = []
  for (let i = 0; i < nElement; i++) {
    const element = {
      key: faker.string.sample(),
      value: {
        string: faker.string.sample(),
        number: faker.number.int(),
        array: new Array(faker.number.int({ max: 100 })),
      },
    }
    array.push(element)
  }
  return array
}

const addItemsInReactiveLocalStorage = (elements, reactiveLocalStorage) => {
  elements.forEach((element) => {
    const { key, value } = element
    reactiveLocalStorage.setItem(key, value)
  })
}

const getReactiveStorageInstance = (reactiveLocalStorage) => {
  const reactiveStorage = reactiveLocalStorage.reactiveStorage
  return isRef(reactiveStorage) ? reactiveStorage.value : reactiveStorage
}

describe(`class ReactiveLocalStorage (${filePath})`, () => {
  describe('constructor', () => {
    it('Should create a ReactiveLocalStorage object when the constructor is called using Storage and vue Ref instances', () => {
      // Arrange
      const refStorage = ref({})

      // Act
      const result = () =>
        getReactiveLocalStorageInstance(refStorage, localStorage)

      // Assert
      expect(result).not.toThrow()
    })
    it('Should throw a ReactiveLocalStorageError when the constructor is called using vue Ref instance but not a Storage instance', () => {
      // Arrange
      const refStorage = ref({})
      const notStorage = faker.string.sample(100)
      const expected = ReactiveLocalStorageError

      // Act
      const result = () =>
        getReactiveLocalStorageInstance(refStorage, notStorage)

      // Assert
      expect(result).toThrow(expected)
    })
    it('Should create a ReactiveLocalStorage object when the constructor is called using Storage and vue Reactive instances', () => {
      // Arrange
      const reactiveStorage = reactive({})

      // Act
      const result = () =>
        getReactiveLocalStorageInstance(reactiveStorage, localStorage)

      // Assert
      expect(result).not.toThrow()
    })
    it('Should throw a ReactiveLocalStorageError when the constructor is called using vue Reactive instance but not a Storage instance', () => {
      // Arrange
      const reactiveStorage = reactive({})
      const notStorage = faker.number.int()
      const expected = ReactiveLocalStorageError

      // Act
      const result = () =>
        getReactiveLocalStorageInstance(reactiveStorage, notStorage)

      // Assert
      expect(result).toThrow(expected)
    })
    it('Should throw a ReactiveStorageError when the constructor is called using a Storage instance but not a vue Ref/Reactive instance', () => {
      // Arrange
      const notVueReactiveStorage = [1, 2, 3, 4, 5, 6, 7]
      const expected = ReactiveStorageError

      // Act
      const result = () =>
        getReactiveLocalStorageInstance(notVueReactiveStorage, localStorage)

      // Assert
      expect(result).toThrow(expected)
    })
  })
  describe('(method) getItem', () => {
    it('Should throw ReactiveStorageError if the "key" parameter is not a String', () => {
      // Arrange
      const key = true
      const expectec = ReactiveStorageError
      const reactiveStorage = ref({})
      const reactiveLocalStorage = getReactiveLocalStorageInstance(
        reactiveStorage,
        localStorage,
      )

      // Act
      const result = () => reactiveLocalStorage.getItem(key)

      // Assert
      expect(result).toThrow(expectec)
    })
  })
  describe('(method) setItem', () => {
    it('Should throw ReactiveStorageError if the "key" parameter is not a String', () => {
      // Arrange
      const key = [7]
      const expectec = ReactiveStorageError
      const reactiveStorage = reactive({})
      const reactiveLocalStorage = getReactiveLocalStorageInstance(
        reactiveStorage,
        localStorage,
      )

      // Act
      const result = () => reactiveLocalStorage.setItem(key)

      // Assert
      expect(result).toThrow(expectec)
    })
  })
  describe('(method) removeItem', () => {
    it('Should throw ReactiveStorageError if the "key" parameter is not a String', () => {
      // Arrange
      const key = {}
      const expectec = ReactiveStorageError
      const reactiveStorage = ref({})
      const reactiveLocalStorage = getReactiveLocalStorageInstance(
        reactiveStorage,
        localStorage,
      )

      // Act
      const result = () => reactiveLocalStorage.removeItem(key)

      // Assert
      expect(result).toThrow(expectec)
    })
  })
  describe('(method) setItemFromEvent', () => {
    it('Should throw ReactiveStorageError if the "key" parameter is not a String', () => {
      // Arrange
      const key = reactive({})
      const expectec = ReactiveStorageError
      const reactiveStorage = reactive({})
      const reactiveLocalStorage = getReactiveLocalStorageInstance(
        reactiveStorage,
        localStorage,
      )

      // Act
      const result = () => reactiveLocalStorage.setItemFromEvent(key)

      // Assert
      expect(result).toThrow(expectec)
    })
  })
  describe('(method) removeItemFromEvent', () => {
    it('Should throw ReactiveStorageError if the "key" parameter is not a String', () => {
      // Arrange
      const key = ref({})
      const expectec = ReactiveStorageError
      const reactiveStorage = ref({})
      const reactiveLocalStorage = getReactiveLocalStorageInstance(
        reactiveStorage,
        localStorage,
      )

      // Act
      const result = () => reactiveLocalStorage.removeItemFromEvent(key)

      // Assert
      expect(result).toThrow(expectec)
    })
  })
  describe('test an instance generated by constructor with parameters (vue Ref, Storage)', () => {
    let reactiveLocalStorage

    beforeEach(() => {
      const refStorage = ref({})
      reactiveLocalStorage = getReactiveLocalStorageInstance(
        refStorage,
        localStorage,
      )
    })
    afterEach(() => {
      localStorage.clear()
    })

    describe('(getter) length', () => {
      it('Should return 0 when reactiveLocalStorage is empty', () => {
        // Arrange
        const expected = 0

        // Act
        const reactiveLocalStorageResult = reactiveLocalStorage.length
        const localStorageResult = localStorage.length

        // Assert
        expect(reactiveLocalStorageResult).toBe(expected)
        expect(localStorageResult).toBe(expected)
      })
      it('Should return 3 when reactiveLocalStorage contain 3 elements', () => {
        // Arrange
        const expected = 3
        const data = createArrayTestWithObjects(expected)
        addItemsInReactiveLocalStorage(data, reactiveLocalStorage)

        // Act
        const reactiveLocalStorageResult = reactiveLocalStorage.length
        const localStorageResult = localStorage.length

        // Assert
        expect(reactiveLocalStorageResult).toBe(expected)
        expect(localStorageResult).toBe(expected)
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
      it('Should add a primitive value (String)', () => {
        // Arrange
        const key = faker.string.sample(20)
        const expected = faker.string.sample(200)

        // Act
        reactiveLocalStorage.setItem(key, expected)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]
        const localStorageResult = localStorage.getItem(key)

        expect(reactiveLocalStorageResult).toBe(expected)
        expect(localStorageResult).toBe(expected)
      })
      it('Should add an object (nested object)', () => {
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
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]
        const localStorageResult = JSON.parse(localStorage.getItem(key))

        expect(reactiveLocalStorageResult).toEqual(expected)
        expect(localStorageResult).toEqual(expected)
      })
      it('Should override an object saved in reactiveLocalStorage when add a new object using the same key', () => {
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
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]
        const localStorageResult = JSON.parse(localStorage.getItem(key))

        expect(reactiveLocalStorageResult).toEqual(expected)
        expect(localStorageResult).toEqual(expected)
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
        it('Should return a primitive value (Number)', () => {
          // Arrange
          const key = faker.string.sample(15)
          const expected = faker.number.int()

          reactiveLocalStorage.setItem(key, expected)

          // Act
          const reactiveLocalStorageResult = reactiveLocalStorage.getItem(key)

          // Assert
          const localStorageResult = Number(localStorage.getItem(key))

          expect(reactiveLocalStorageResult).toBe(expected)
          expect(localStorageResult).toBe(expected)
        })
        it('Should return an object (simple object)', () => {
          // Arrange
          const key = 'simpleObject'
          const expected = {
            user: faker.internet.userName(),
            password: faker.internet.password({ length: 17 }),
          }

          reactiveLocalStorage.setItem(key, expected)

          // Act
          const reactiveLocalStorageResult = reactiveLocalStorage.getItem(key)

          // Assert
          const localStorageResult = JSON.parse(localStorage.getItem(key))

          expect(reactiveLocalStorageResult).toEqual(expected)
          expect(localStorageResult).toEqual(expected)
        })
      })
      describe('when the key not exists in reactiveLocalStorage, but exists into localStorage', () => {
        it('Should return a primitive value (Number)', () => {
          // Arrange
          const key = faker.string.sample(27)
          const expected = faker.number.int()

          localStorage.setItem(key, expected)

          // Act
          const result = reactiveLocalStorage.getItem(key)

          // Assert
          expect(result).toBe(expected)
        })
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

          localStorage.setItem(key, JSON.stringify(expected))

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
      it('Should remove a primitive value (Boolean)', () => {
        // Arrange
        const key = faker.string.sample(32)
        const value = true

        reactiveLocalStorage.setItem(key, value)

        // Act
        reactiveLocalStorage.removeItem(key)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]
        const localStorageResult = localStorage.getItem(key)

        expect(reactiveLocalStorageResult).toBeUndefined()
        expect(localStorageResult).toBeNull()
      })
      it('Should remove an object (Array)', () => {
        // Arrange
        const key = faker.string.sample(27)
        const value = [1, 2, 3, 4, 5, 6, 7]

        reactiveLocalStorage.setItem(key, value)

        // Act
        reactiveLocalStorage.removeItem(key)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]
        const localStorageResult = localStorage.getItem(key)

        expect(reactiveLocalStorageResult).toBeUndefined()
        expect(localStorageResult).toBeNull()
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
        const reactiveLocalStorageResult = reactiveLocalStorage.length
        const localStorageResult = localStorage.length

        expect(reactiveLocalStorageResult).toBe(expected)
        expect(localStorageResult).toBe(expected)
      })
    })
    describe('(method) removeItemFromEvent', () => {
      it('Should call this method inclusive if not exists the key into reactiveLocalStorage', () => {
        // Arrange
        const key = faker.string.sample(35)

        // Act
        const result = () => reactiveLocalStorage.removeItemFromEvent(key)

        // Assert
        expect(result).not.toThrow()
      })
      it('Should remove a primitive value (String)', () => {
        // Arrange
        const key = faker.string.sample(79)
        const value = faker.string.sample(99)

        reactiveLocalStorage.setItem(key, value)
        localStorage.removeItem(key)

        // Act
        reactiveLocalStorage.removeItemFromEvent(key)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]

        expect(reactiveLocalStorageResult).toBeUndefined()
      })
      it('Should remove an object (Array)', () => {
        // Arrange
        const key = faker.string.sample(77)
        const value = [1, 2, 3, 4, 5]

        reactiveLocalStorage.setItem(key, value)
        localStorage.removeItem(key)

        // Act
        reactiveLocalStorage.removeItemFromEvent(key)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]

        expect(reactiveLocalStorageResult).toBeUndefined()
      })
    })
    describe('(method) setItemFromEvent', () => {
      it('Should add a primitive value (Boolean)', () => {
        // Arrange
        const key = faker.string.sample(45)
        const expected = false

        // Act
        reactiveLocalStorage.setItemFromEvent(key, expected)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]

        expect(reactiveLocalStorageResult).toBe(expected)
      })
      it('Should add an object (Array)', () => {
        // Arrange
        const key = faker.string.sample(79)
        const expected = [
          { key: faker.string.sample(100), value: faker.number.int() },
        ]

        // Act
        reactiveLocalStorage.setItemFromEvent(key, expected)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]

        expect(reactiveLocalStorageResult).toEqual(expected)
      })
      it('Should override an object saved in reactiveLocalStorage when add a new object using the same key', () => {
        // Arrange
        const key = 'simpleObject'
        const initValue = {
          user: faker.internet.userName(),
          password: faker.internet.password({ length: 50 }),
        }
        const expected = [7]

        reactiveLocalStorage.setItem(key, initValue)

        // Act
        reactiveLocalStorage.setItemFromEvent(key, expected)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]

        expect(reactiveLocalStorageResult).toEqual(expected)
      })
    })
  })
  describe('test an instance generated by constructor with parameters (vue Reactive, Storage)', () => {
    let reactiveLocalStorage

    beforeEach(() => {
      const reactiveStorage = reactive({})
      reactiveLocalStorage = getReactiveLocalStorageInstance(
        reactiveStorage,
        localStorage,
      )
    })
    afterEach(() => {
      localStorage.clear()
    })
    describe('(getter) length', () => {
      it('Should return 0 when reactiveLocalStorage is empty', () => {
        // Arrange
        const expected = 0

        // Act
        const reactiveLocalStorageResult = reactiveLocalStorage.length
        const localStorageResult = localStorage.length

        // Assert
        expect(reactiveLocalStorageResult).toBe(expected)
        expect(localStorageResult).toBe(expected)
      })
      it('Should return 7 when reactiveLocalStorage contain 7 elements', () => {
        // Arrange
        const expected = 7
        const data = createArrayTestWithObjects(expected)
        addItemsInReactiveLocalStorage(data, reactiveLocalStorage)

        // Act
        const reactiveLocalStorageResult = reactiveLocalStorage.length
        const localStorageResult = localStorage.length

        // Assert
        expect(reactiveLocalStorageResult).toBe(expected)
        expect(localStorageResult).toBe(expected)
      })
    })
    describe('(getter) reactiveStorage', () => {
      it('Should return the vue reactive instance used', () => {
        // Arrange
        const expected = true

        // Act
        const result = isReactive(reactiveLocalStorage.reactiveStorage)

        // Assert
        expect(result).toBe(expected)
      })
    })
    describe('(method) key', () => {
      it('return null when the key not exists into reactiveLocalStorage', () => {
        // Arrange
        const index = 7

        // Act
        const result = reactiveLocalStorage.key(index)

        // Assert
        expect(result).toBeNull()
      })
      it('return the key in fifth position into reactiveLocalStorage', () => {
        // Arrange
        const index = 4
        const nData = faker.number.int({ max: 100 })
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
      it('Should add a primitive value (Number)', () => {
        // Arrange
        const key = faker.string.sample(47)
        const expected = faker.number.int()

        // Act
        reactiveLocalStorage.setItem(key, expected)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]
        const localStorageResult = Number(localStorage.getItem(key))

        expect(reactiveLocalStorageResult).toBe(expected)
        expect(localStorageResult).toBe(expected)
      })
      it('Should add an object (Array)', () => {
        // Arrange
        const key = faker.string.sample(35)
        const expected = [1, 2, 3, 4, 5, 6, 7]

        // Act
        reactiveLocalStorage.setItem(key, expected)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]
        const localStorageResult = JSON.parse(localStorage.getItem(key))

        expect(reactiveLocalStorageResult).toEqual(expected)
        expect(localStorageResult).toEqual(expected)
      })
      it('Should override an object saved in reactiveLocalStorage when add a new object using the same key', () => {
        // Arrange
        const key = faker.string.sample(45)
        const initValue = [1, 2, 3, 4, 5]
        const expected = [1, 2, 3]

        reactiveLocalStorage.setItem(key, initValue)

        // Act
        reactiveLocalStorage.setItem(key, expected)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]
        const localStorageResult = JSON.parse(localStorage.getItem(key))

        expect(reactiveLocalStorageResult).toEqual(expected)
        expect(localStorageResult).toEqual(expected)
      })
    })
    describe('(method) getItem', () => {
      it('Should return null when the key not exists into reactiveLocalStorage nor into localStorage', () => {
        // Arrange
        const key = faker.string.sample(50)

        // Act
        const result = reactiveLocalStorage.getItem(key)

        // Assert
        expect(result).toBeNull()
      })
      describe('when the key exists in reactiveLocalStorage', () => {
        it('Should return a primitive value (Boolean)', () => {
          // Arrange
          const key = faker.string.sample(79)
          const expected = true

          reactiveLocalStorage.setItem(key, expected)

          // Act
          const reactiveLocalStorageResult = reactiveLocalStorage.getItem(key)

          // Assert
          const localStorageResult = Boolean(localStorage.getItem(key))

          expect(reactiveLocalStorageResult).toBe(expected)
          expect(localStorageResult).toBe(expected)
        })
        it('Should return an object (Array)', () => {
          // Arrange
          const key = faker.string.sample(57)
          const expected = [1, 2, 3, 4, 5, 6, 7]

          reactiveLocalStorage.setItem(key, expected)

          // Act
          const reactiveLocalStorageResult = reactiveLocalStorage.getItem(key)

          // Assert
          const localStorageResult = JSON.parse(localStorage.getItem(key))

          expect(reactiveLocalStorageResult).toEqual(expected)
          expect(localStorageResult).toEqual(expected)
        })
      })
      describe('when the key not exists in reactiveLocalStorage, but exists into localStorage', () => {
        it('Should return a primitive value (String)', () => {
          // Arrange
          const key = faker.string.sample(79)
          const expected = faker.string.sample(100)

          localStorage.setItem(key, expected)

          // Act
          const result = reactiveLocalStorage.getItem(key)

          // Assert
          expect(result).toBe(expected)
        })
        it('Should return an object (simple object)', () => {
          // Arrange
          const key = faker.string.sample(57)
          const input = {
            int: faker.number.int(),
            string: faker.string.sample(),
            username: faker.internet.userName(),
            password: faker.internet.password({ length: 17 }),
            date: {
              typeof: 'date',
              value: faker.date.birthdate(),
            },
          }
          const expected = { ...input, date: input.date.value }

          localStorage.setItem(key, JSON.stringify(input))

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
        const key = faker.string.sample(70)

        // Act
        const result = () => reactiveLocalStorage.removeItem(key)

        // Assert
        expect(result).not.toThrow()
      })
      it('Should remove a primitive value (String)', () => {
        // Arrange
        const key = faker.string.sample(100)
        const value = faker.string.sample()

        reactiveLocalStorage.setItem(key, value)

        // Act
        reactiveLocalStorage.removeItem(key)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]
        const localStorageResult = localStorage.getItem(key)

        expect(reactiveLocalStorageResult).toBeUndefined()
        expect(localStorageResult).toBeNull()
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
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]
        const localStorageResult = localStorage.getItem(key)

        expect(reactiveLocalStorageResult).toBeUndefined()
        expect(localStorageResult).toBeNull()
      })
    })
    describe('(method) clear', () => {
      it('Should remove all element into ReactiveLocalStorage', () => {
        // Arrange
        const expected = 0
        const nElements = faker.number.int({ max: 100 })
        const data = createArrayTestWithObjects(nElements)
        addItemsInReactiveLocalStorage(data, reactiveLocalStorage)

        // Act
        reactiveLocalStorage.clear()

        // Assert
        const reactiveLocalStorageResult = reactiveLocalStorage.length
        const localStorageResult = localStorage.length

        expect(reactiveLocalStorageResult).toBe(expected)
        expect(localStorageResult).toBe(expected)
      })
    })
    describe('(method) removeItemFromEvent', () => {
      it('Should call this method inclusive if not exists the key into reactiveLocalStorage', () => {
        // Arrange
        const key = faker.string.sample()

        // Act
        const result = () => reactiveLocalStorage.removeItemFromEvent(key)

        // Assert
        expect(result).not.toThrow()
      })
      it('Should remove a primitive value (Number)', () => {
        // Arrange
        const key = faker.string.sample(79)
        const value = 7

        reactiveLocalStorage.setItem(key, value)
        localStorage.removeItem(key)

        // Act
        reactiveLocalStorage.removeItemFromEvent(key)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]

        expect(reactiveLocalStorageResult).toBeUndefined()
      })
      it('Should remove an object (simple object)', () => {
        // Arrange
        const key = faker.string.sample()
        const value = {
          key: faker.string.sample(),
          int: faker.number.int(),
        }

        reactiveLocalStorage.setItem(key, value)
        localStorage.removeItem(key)

        // Act
        reactiveLocalStorage.removeItemFromEvent(key)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]

        expect(reactiveLocalStorageResult).toBeUndefined()
      })
    })
    describe('(method) setItemFromEvent', () => {
      it('Should add a primitive value (String)', () => {
        // Arrange
        const key = faker.string.sample(79)
        const expected = faker.string.sample()

        // Act
        reactiveLocalStorage.setItemFromEvent(key, expected)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]

        expect(reactiveLocalStorageResult).toBe(expected)
      })
      it('Should add an object (simple object)', () => {
        // Arrange
        const key = faker.string.sample()
        const expected = {
          value: [1, 2, 3, 4, 5, 6, 7],
        }

        // Act
        reactiveLocalStorage.setItemFromEvent(key, expected)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]

        expect(reactiveLocalStorageResult).toEqual(expected)
      })
      it('Should override an object saved in reactiveLocalStorage when add a new object using the same key', () => {
        // Arrange
        const key = faker.string.sample(17)
        const initValue = {
          value: [1, 2, 3, 4, 5, 6, 7],
        }
        const expected = { ...initValue, secondValue: faker.string.sample() }

        reactiveLocalStorage.setItem(key, initValue)

        // Act
        reactiveLocalStorage.setItemFromEvent(key, expected)

        // Assert
        const reactiveStorage = getReactiveStorageInstance(reactiveLocalStorage)
        const reactiveLocalStorageResult = reactiveStorage[key]

        expect(reactiveLocalStorageResult).toEqual(expected)
      })
    })
  })
})
