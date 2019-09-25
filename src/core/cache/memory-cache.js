/**
 * Simple In Memory Cache Module
 * Inspired and converted to ES6 from 
 * https://github.com/ljharb/global-cache/blob/master/index.js
 */

import define from "define-properties";
import isSymbol from "is-symbol";

let globalKey = '__ global cache key __';
// eslint-disable-next-line no-restricted-properties
if (typeof Symbol === 'function' && isSymbol(Symbol('foo')) && typeof Symbol['for'] === 'function') {
  // eslint-disable-next-line no-restricted-properties
  globalKey = Symbol['for'](globalKey);
}

let trueThunk = function () {
  return true;
};

let ensureCache = function ensureCache() {
  if (!global[globalKey]) {
    var properties = {};
    properties[globalKey] = {};
    var predicates = {};
    predicates[globalKey] = trueThunk;
    define(global, properties, predicates);
  }
  return global[globalKey];
};

let cache = ensureCache();

let isPrimitive = function isPrimitive(val) {
  return val === null || (typeof val !== 'object' && typeof val !== 'function');
};

let getPrimitiveKey = function getPrimitiveKey(val) {
  if (isSymbol(val)) {
    return Symbol.prototype.valueOf.call(val);
  }
  return typeof val + ' | ' + String(val);
};

let requirePrimitiveKey = function requirePrimitiveKey(val) {
  if (!isPrimitive(val)) {
    throw new TypeError('key must not be an object');
  }
};

const clear = () => {
  delete global[globalKey];
  cache = ensureCache();
};

const deleteKey = (key) => {
  requirePrimitiveKey(key);
  delete cache[getPrimitiveKey(key)];
  return !has(key);
};

const get = (key) => {
  requirePrimitiveKey(key);
  return cache[getPrimitiveKey(key)];
};

const has = (key) => {
  requirePrimitiveKey(key);
  return getPrimitiveKey(key) in cache;
};

const set = (key, value) => {
  requirePrimitiveKey(key);
  var primitiveKey = getPrimitiveKey(key);
  var props = {};
  props[primitiveKey] = value;
  var predicates = {};
  predicates[primitiveKey] = trueThunk;
  define(cache, props, predicates);
  return has(key);
};

const setIfMissingThenGet = (key, valueThunk) => {
  if (has(key)) {
    return get(key);
  }
  var item = valueThunk();
  set(key, item);
  return item;
};

export {
  clear,
  deleteKey,
  get,
  set,
  has,
  setIfMissingThenGet
};
