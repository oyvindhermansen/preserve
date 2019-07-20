import 'jest-localstorage-mock';
import preserve, { preserveLogger } from '../src/index';

// @ts-ignore
global.console = { warn: jest.fn(), log: jest.fn() };

describe('Preserve', () => {
  beforeEach(() => {
    // values stored in tests will also be available in other tests unless you run
    localStorage.clear();
  });

  it('should be able to set initial data to localStorage', () => {
    const key = 'myData';
    const item = preserve(key, 0);

    // Check for initial state
    expect(localStorage.__STORE__[key]).toBe('0');

    // Set new data
    item.set(1);
    expect(localStorage.__STORE__[key]).toBe('1');
  });

  it('should be able to update data', () => {
    const key = 'myData';
    const initialData = { name: 'Øyvind' };
    const item = preserve(key);
    item.set(initialData);

    expect(localStorage.__STORE__[key]).toBe(`${JSON.stringify(initialData)}`);

    item.set({ name: 'Other' });

    const expected = JSON.stringify({ name: 'Other' });

    // testing what is in localStorage
    expect(localStorage.__STORE__[key]).toBe(expected);

    // testing the parsed localStorage data
    expect(item.get()).toEqual(JSON.parse(expected));
  });

  it('should be able to update data if data is pure boolean values', () => {
    const key = 'myData';
    const item = preserve(key);
    item.set(false);

    expect(localStorage.__STORE__[key]).toBe(`${JSON.stringify(false)}`);
  });

  it('should fail if set method does not provide any data', () => {
    const item = preserve('empty');

    expect(() => {
      // @ts-ignore
      item.set();
    }).toThrow();
  });

  it('should listen to updates to the localStorage', done => {
    const key = 'myItem';
    const item = preserve(key);
    item.set(1);

    const listener = (prevItem: any, nextItem: any) => {
      expect(prevItem).toEqual(1);
      expect(nextItem).toEqual(10);

      done();
    };

    item.subscribe(listener);
    item.set(10);

    expect(localStorage.__STORE__[key]).toBe('10');
  });

  it('should throw an error if you do not provide a key.', () => {
    expect(() => {
      // @ts-ignore
      preserve();
    }).toThrow();
  });

  it('should be able to clear a preserved item.', () => {
    const key = 'myData';
    const item = preserve(key);
    item.set(1);
    expect(localStorage.__STORE__[key]).toBe('1');
    expect(item.get()).toBe(1);

    // clear item
    item.clearItem();

    expect(localStorage.__STORE__[key]).toBe(undefined);
    expect(item.get()).toBe(null);
  });
});

describe('preserveLogger', () => {
  it('should fail if not given a preserved item', () => {
    expect(() => {
      // @ts-ignore
      preserveLogger();
    }).toThrow();
  });

  it('should fail if provided with a non-preserved item', () => {
    const fakeItem = { counter: 1 };

    expect(() => {
      // @ts-ignore
      preserveLogger(fakeItem);
    }).toThrow();
  });

  it('should log to the console if item is updated', () => {
    const key = 'myData';
    const item = preserve(key);

    // Log the item
    preserveLogger(item);

    // Set new state
    item.set(1);

    expect(localStorage.__STORE__[key]).toBe('1');
    expect(item.get()).toBe(1);
    expect(console.log).toBeCalled();
  });
});
