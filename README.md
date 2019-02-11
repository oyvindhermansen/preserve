# Preserve

A state lib for keeping track of and change localStorage data

[![Build Status](https://travis-ci.org/oyvindhermansen/preserve.svg?branch=master)](https://travis-ci.org/oyvindhermansen/preserve) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Install

```sh
 npm install @oyvindher/preserve
```

or with Yarn

```sh
yarn add @oyvindher/preserve
```

## API

`preserve(key:string, initialData?: any)`

The preserve function gives you 4 methods in return:

- `get()` Gives the current state of your localstorage item.
- `set<T>(data:T)` Set the current state of your localstorage item.
- `subscribe(callback: nextData => void)` Gives you a callback to listen to current state changes
- `clearItem()` Clears the localStorge item

## Basic usage

```ts
import preserve from '@oyvindher/preserve';

// Make an item you want to keep track of.
// The initial state is optional.
const myItem = preserve('myData', 0);
```

```ts
// Get the current data from localStorage key
myItem.get(); // 0
```

```ts
// Update the localStorage data.
myItem.set(1);
```

```ts
// Listen to changes that happens within your localStorage item
myItem.subscribe(nextData => {
  console.log(nextData); // 1
});
```

```ts
// Clear the item from localStorage
myItem.clearItem();
```
