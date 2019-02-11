import { isBrowser } from './utils';
import { IPreserve, ListenerType } from './Interfaces';

/**
 *
 * @param key the localstorage key name
 * @param initialState the initial state you want to store in your localstorage item. The initial state parameter is optional.
 */
export default function preserve(key: string, initialState?: any): IPreserve {
  if (!key) {
    throw new Error(`'Preserve' needs a key to keep track of you data.`);
  }

  // Check for browser environment, or else bail out.
  if (!isBrowser()) return undefined;

  let currentData: any = undefined;
  const listeners: ListenerType[] = [];

  if (get() === null || get() === undefined) {
    if (initialState !== undefined) {
      currentData = initialState;
      set(currentData);
    }
  }

  /**
   * Provides you with the current localStorage
   * data JSON-parsed.
   */
  function get<T>(): T {
    return JSON.parse(window.localStorage.getItem(key));
  }

  /**
   * Use this function to override current localStorage data
   * with new updated data.
   */
  function set<T>(data: T) {
    if (data === undefined) {
      throw new Error(`Please provide data to the 'set' method.`);
    }

    currentData = data;
    listeners.forEach(l => l(currentData));

    window.localStorage.setItem(key, JSON.stringify(currentData));
  }

  /**
   * Use this method to listen for changes in your localStorage item.
   * @param listener - A callback function that provides prevData and nextData as params.
   * @returns - an ubsubscribe function to make rid of unused subscriptions.
   */
  function subscribe(listener: ListenerType) {
    listeners.push(listener);
    let isSubscribed = true;

    return () => {
      if (!isSubscribed) return;

      isSubscribed = false;

      listeners.filter(l => l !== listener);
    };
  }

  function clearItem() {
    return window.localStorage.removeItem(key);
  }

  return {
    get,
    set,
    subscribe,
    clearItem
  };
}

export { IPreserve };
