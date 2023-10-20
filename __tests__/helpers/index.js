import { faker } from '@faker-js/faker'
import { ReactiveLocalStorage } from '../../src/reactiveLocalStorage/storage/ReactiveLocalStorage'

faker.seed(129)

export const getDefaultSerializer = () => ({
  serialize: (value, options = {}) => {
    const { replacer, space } = options
    return JSON.stringify(value, replacer, space)
  },
  parse: (value, options = {}) => {
    const { reviver } = options
    return JSON.parse(value, reviver)
  },
})

export const getReactiveLocalStorageInstance = (
  reactiveStorage,
  webStorage,
  serializer,
) => new ReactiveLocalStorage(reactiveStorage, webStorage, serializer)

export const createArrayTestWithObjects = (nElement) => {
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

export const addItemsInReactiveLocalStorage = (
  elements,
  reactiveLocalStorage,
) => {
  elements.forEach((element) => {
    const { key, value } = element
    reactiveLocalStorage.setItem(key, value)
  })
}

export const { localStorage } = window

export { faker }
