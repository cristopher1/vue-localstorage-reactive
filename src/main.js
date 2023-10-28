import { ReactiveLocalStorageInstaller } from './reactiveLocalStorage/installer/ReactiveLocalStorageInstaller'
import { ReactiveLocalStorageBuilder } from './reactiveLocalStorage/builder/ReactiveLocalStorageBuilder'

/**
 * Returns the installer object used to install the plugin.
 *
 * @returns {ReactiveLocalStorageInstaller} The installer object used to install
 *   the plugin.
 */
export function createReactiveLocalStorageInstaller() {
  const reactiveLocalStorageBuilder = new ReactiveLocalStorageBuilder()
  return new ReactiveLocalStorageInstaller(reactiveLocalStorageBuilder)
}
