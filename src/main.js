import { ReactiveLocalStorageInstaller } from './reactiveLocalStorage/installer/ReactiveLocalStorageInstaller'
import { ReactiveLocalStorageBuilder } from './reactiveLocalStorage/builder/ReactiveLocalStorageBuilder'

/**
 * Returns the installer that contains the install method.
 *
 * @returns {ReactiveLocalStorageInstaller} The installer that contains the
 *   install method.
 */
export function createReactiveLocalStorageInstaller() {
  const reactiveLocalStorageBuilder = new ReactiveLocalStorageBuilder()
  return new ReactiveLocalStorageInstaller(reactiveLocalStorageBuilder)
}
