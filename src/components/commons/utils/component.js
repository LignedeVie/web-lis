/**
 * checks if an entity is a valid vNode
 * @param {any} node
 * @returns {boolean}
 */
export function isVNode (node) {
  if (node === null) return false;
  if (typeof node !== 'object') return false;
  return Object.prototype.hasOwnProperty.call(node, 'componentOptions');
}

/**
 * @param  {...import('vue').VNodeData} sources
 * @returns {import('vue').VNodeData}
 */
export function mergeFunctionalData (...sources) {
  // merged data
  const data = {};

  // merge strats
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    const keys = Object.keys(source);
    for (let j = 0; j < keys.length; j++) {
      const prop = keys[j];
      switch (prop) {
        // Array merge strategy (array concatenation)
        case 'class':
        case 'style':
        case 'directives': {
          if (!Array.isArray(data[prop])) {
            data[prop] = [];
          }
          // Repackaging in an array allows Vue runtime
          // to merge class/style bindings regardless of type.
          data[prop] = data[prop].concat(source[prop]);
          break;
        }
        // Space delimited string concatenation strategy
        case 'staticClass': {
          if (!source[prop]) {
            break;
          }
          if (data[prop] === undefined) {
            data[prop] = '';
          }
          if (data[prop]) {
            // Not an empty string, so concatenate
            data[prop] += ' ';
          }
          data[prop] += source[prop].trim();
          break;
        }
        // Object, the properties of which to merge via array merge strategy (array concatenation).
        // Callback merge strategy merges callbacks to the beginning of the array,
        // so that the last defined callback will be invoked first.
        // This is done since to mimic how Object.assign merging
        // uses the last given value to assign.
        case 'on':
        case 'nativeOn': {
          data[prop] = data[prop] || {};
          if (!source[prop]) break;
          for (const e of Object.keys(source[prop])) {
            if (data[prop][e]) {
              // Concat function to array of functions if callback present.
              // Insert current iteration data in beginning of merged array.
              data[prop][e] = [].concat(data[prop][e], source[prop][e]);
            } else {
              // Straight assign.
              data[prop][e] = source[prop][e];
            }
          }
          break;
        }
        // skip
        // case 'model': break;
        // Object merge strategy
        // case 'model':
        case 'attrs':
        case 'props':
        case 'domProps':
        case 'scopedSlots':
        case 'staticStyle':
        case 'hook':
        case 'transition': {
          data[prop] = { ...data[prop], ...source[prop] };
          break;
        }
        // Reassignment strategy (no merge)
        case 'slot':
        case 'key':
        case 'ref':
        case 'tag':
        case 'show':
        case 'keepAlive':
        default: {
          if (source[prop] === undefined) break;
          data[prop] = source[prop];
          break;
        }
      }
    }
  }

  // return data
  return data;
}

/**
 * @param {Object.<string,any>} listenersObj listeners object
 * @param {string} name listener name
 * @param  {...any} args arguments to call the listener with
 * @returns {void}
 */
export function invokeListener (listenersObj, name, ...args) {
  if (!listenersObj[name]) return;
  const listeners = Array.isArray(listenersObj[name]) ? listenersObj[name] : [listenersObj[name]];
  listeners.forEach(fn => fn(...args));
}
