<h1 align="center">Welcome to @cljimenez/vue-localstorage-reactive 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/cristopher1/vue-localstorage-reactive#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/cristopher1/vue-localstorage-reactive/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/cristopher1/vue-localstorage-reactive/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/cristopher1/vue-localstorage-reactive" />
  </a>
</p>

> Wrapper to use localStorage reactive in Vue 3

### **Note: This plugin only can used in applications that contains only an unique instance of vue application created by createApp function.**

### 🏠 [Homepage](https://github.com/cristopher1/vue-localstorage-reactive#readme)

## Install

```sh
npm install @cljimenez/vue-localstorage-reactive
```

## How to use?

 - ### Install the plugin.
   ```js
   import { createReactiveLocalStorageInstaller } from '@cljimenez/vue-localstorage-reactive'

   import { createApp } from 'vue'

   import App from './App.vue'

   const app = createApp(App)

   app.use(createReactiveLocalStorageInstaller())
   ```

 - ### Install options.
   When you installs this plugin using:

   ```js
   app.use(createReactiveLocalStorageInstaller(), options)
   ```

   The options object can contain the following attributes:

   * `useRefStorage`: (boolean). By default is true. When this value is true, the reactiveStorage object is created using `ref` function; otherwise is used the `reactive` function.
   *  `serializer`: (object). By default is undefined. This object is used to serializes and unserializes data to save complex object into localStorage.
     
      The serializer object contains two methods:
       1. `serialize(value: any, options?: object)`: Serializes the data.
       2. `parse(value: string, options?: object)`: Unserializes the data.

      When the value of `serializer` is undefined, the default serializer used is:

      ```js
      {
        serialize: (value, options) => {
         const { replacer, space } = options
         return JSON.stringify(value, replacer, space)
        },
        parse: (value, options) => {
         const { reviver } = options
         return JSON.parse(value, reviver)
        },
      }
      ```

      You can define your own serializer using a wrapper that implements the serialize and parse methods or you can use other serializer, for example [@cljimenez/json-serializer-core](https://www.npmjs.com/package/@cljimenez/json-serializer-core) with [@cljimenez/json-serializer-base-serializers](https://www.npmjs.com/package/@cljimenez/json-serializer-base-serializers).

 - ### About the ReactiveLocalStorage methods
   The `ReactiveLocalStorage` object provides an interface similar to the Storage interface, this methods are:

   - `(getter) length`: Obtains the number of elements saved in reactiveLocalStorage.
   - `(method) key(index)`: Returns the key in nth position into reactiveLocalStorage.
   - `(method) getItem(key, parseOptions = {})`: Returns the parsed key's value saved into reactiveLocalStorage.
   - `(method) setItem(key, item, serializeOptions = {})`: Saves the pair key/value into reactiveLocalStorage.
   - `(method) removeItem(key)`: Removes the pair key/value from reactiveLocalStorage.
   - `(method) clear()`: Removes all pairs key/value into reactiveLocalStorage.
  
   And include others methods:

   - `(getter) reactiveStorage`: Returns the reactiveStorage object used by reactiveLocalStorage instance.
   - `(method) setLoadDataFromLocalStorageParameters(parameters)`: Sets the parseOptions that will be used to serialize.parse method that will be called into loadDataFromLocalStorage method.
   - `(method) loadDataFromLocalStorage()`: This method must be used into listener object that listens an event. Sets the data from localStorage into reactiveLocalStorage when the listened event is fired.

  - ### Use the composition API:

    You can use the provide / inject functions.

    ```js
    // main.js
    import { createReactiveLocalStorageInstaller } from '@cljimenez/vue-localstorage-reactive'

    import { createApp } from 'vue'

    import App from './App.vue'

    const app = createApp(App)

    app.use(createReactiveLocalStorageInstaller())

    app.provide('reactiveLocalStorage', app.config.globalProperties.$reactiveLocalStorage)
    ```

## Author

👤 **Cristopher Jiménez**

- Github: [@cristopher1](https://github.com/cristopher1)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/cristopher1/vue-localstorage-reactive/issues).

## 📝 License

Copyright © 2023 [Cristopher Jiménez](https://github.com/cristopher1).<br />
This project is [MIT](https://github.com/cristopher1/vue-localstorage-reactive/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
