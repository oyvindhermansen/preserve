import { IPreserve } from './Interfaces';

/**
 *
 * @param item - Preserved item.
 *
 * preserveLogger is a development util for logging out
 * the previous and next state of the chosen preserved item when
 * something changes.
 */
export default function preserveLogger(item: IPreserve) {
  if (!item) {
    throw new Error(`You need to provide a preserved item to use the logger.`);
  }

  if (
    !('get' in item) ||
    !('set' in item) ||
    !('subscribe' in item) ||
    !('clearItem' in item)
  ) {
    throw new Error(
      `Looks like you passed a non-preserved item to the logger. Make sure it comes from preserve!`
    );
  }

  item.subscribe((prevState, nextState) => {
    console.log(
      '%c Previous state ',
      'font-size: 12px; color: blue; font-weight: bold',
      prevState
    );
    console.log(
      '%c Next state ',
      'font-size: 12px; color: green; font-weight: bold',
      nextState
    );
    console.log('\n');
  });
}
