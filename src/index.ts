import { isBrowser } from './utils';
import { IPreserve, ListenerType } from './Interfaces';

export default function preserve(key: string): IPreserve {
  if (!key) {
    throw new Error(`'Preserve' needs a key to keep track of you data.`);
  }

  // Check for browser environment, or else bail out.
  if (!isBrowser()) return undefined;

  let currentData: any;
  const listeners: ListenerType[] = [];

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
