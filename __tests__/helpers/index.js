import { faker } from '@faker-js/faker'
import { ReactiveLocalStorage } from '../../src/reactiveLocalStorage/storage/ReactiveLocalStorage'

faker.seed(129)

export const getDefaultSerializer = () => ({
  serialize: (...parameters) => JSON.stringify(...parameters),
  parse: (...parameters) => JSON.parse(...parameters),
})

export const getReactiveLocalStorageInstance = (
  reactiveStorage,
  webStorage,
  serializer,
) => new ReactiveLocalStorage(reactiveStorage, webStorage, serializer)

export const { localStorage } = window

export { faker }
