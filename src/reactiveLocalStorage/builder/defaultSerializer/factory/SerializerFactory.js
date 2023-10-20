export class SerializerFactory {
  static createDefaultSerializer() {
    return {
      serialize: (value, options) => {
        const { replacer, space } = options
        return JSON.stringify(value, replacer, space)
      },
      parse: (value, options) => {
        const { reviver } = options
        return JSON.parse(value, reviver)
      },
    }
  }
}
