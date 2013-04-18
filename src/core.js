var document   = window.document
  , _tire      = window.tire
  , _$         = window.$
  , idExp      = /^#[\w\-]+$/
  , classExp   = /^\.[\w\-]+$/
  , tagNameExp = /^[\w\-]+$/
  , tagExp     = /<([\w:]+)/
  , slice      = [].slice;

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// If slice is not available we provide a backup
try {
  slice.call(document.documentElement.childNodes, 0)[0].nodeType;
} catch(e) {
  slice = function (i) {
    i = i || 0;
    var elem, results = [];
    for (; (elem = this[i]); i++) {
      results.push(elem);
    }
    return results;
  };
}

var tire = function (selector, context) {
  return new tire.fn.find(selector, context);
};

tire.fn = tire.prototype = {

  /**
   * Default length is zero
   */

  length: 0,

  /**
   * Extend `tire.fn`
   *
   * @param {Object} o
   */

  extend: function (o) {
    for (var k in o) {
      this[k] = o[k];
    }
  },

  /**
   * Find elements by selector
   *
   * @param {String|Object|Function|Array} selector
   * @param {Object} context
   *
   * @return {Object}
   */

  find: function (selector, context) {
    var elms = [], attrs;

    if (!selector) {
      return this;
    }

    if (tire.isFunction(selector)) {
      return tire.ready(selector);
    }

    if (selector.nodeType) {
      this.selector = '';
      this.context = selector;
      return this.set([selector]);
    }

    if (selector.length === 1 && selector[0].nodeType) {
      this.selector = selector.selector;
      this.context = selector[0];
      return this.set(selector);
    }

    context = this.context ? this.context : (context || document);

    if (tire.isPlainObject(context)) {
      attrs = context;
      context = document;
    }

    if (tire.isString(selector)) {
      this.selector = selector;
      if (idExp.test(selector) && context.nodeType === context.DOCUMENT_NODE) {
        elms = (elms = context.getElementById(selector.substr(1))) ? [elms] : [];
      } else if (context.nodeType !== 1 && context.nodeType !== 9) {
        elms = [];
      } else if (tagExp.test(selector)) {
        var tmp = context.createElement('div');
        tmp.innerHTML = selector;
        this.each.call(slice.call(tmp.childNodes, 0), function () {
          elms.push(this);
        });
      } else {
        elms = slice.call(
          classExp.test(selector) && context.getElementsByClassName !== undefined ? context.getElementsByClassName(selector.substr(1)) :
          tagNameExp.test(selector) ? context.getElementsByTagName(selector) :
          context.querySelectorAll(selector)
        );
      }
    } else if (selector.nodeName || selector === window) {
      elms = [selector];
    } else if (tire.isArray(selector)) {
      elms = selector;
    }

    if (selector.selector !== undefined) {
      this.selector = selector.selector;
      this.context = selector.context;
    } else if (this.context === undefined) {
      if (elms[0] !== undefined && !tire.isString(elms[0])) {
        this.context = elms[0];
      } else {
        this.context = document;
      }
    }

    return this.set(elms).each(function () {
      return attrs && $(this).attr(attrs);
    });
  },

  /**
   * Fetch property from elements
   *
   * @param {String} prop
   * @return {Array}
   */

  pluck: function (prop) {
    var result = [];
    this.each(function () {
      if (this[prop]) result.push(this[prop]);
    });
    return result;
  },

  /**
   * Run callback for each element in the collection
   *
   * @param {Function} callback
   * @return {Object}
   */

  each: function(target, callback) {
    var i, key;

    if (typeof target === 'function') {
      callback = target;
      target = this;
    }

    if (target === this || target instanceof Array) {
      for (i = 0; i < target.length; ++i) {
        if (callback.call(target[i], i, target[i]) === false) break;
      }
    } else {
      for (key in target) {
        if (target.hasOwnProperty(key) && callback.call(target[key], key, target[key]) === false) break;
      }
    }

    return target;
  },

  /**
   * Set elements to tire object before returning `this`
   *
   * @param {Array} elements
   * @return {Object}
   */

  set: function (elements) {
    // Introduce a fresh `tire` set to prevent context from being overridden
    var i = 0, newSet = tire();
    newSet.selector = this.selector;
    newSet.context = this.context;
    for (; i < elements.length; i++) {
      newSet[i] = elements[i];
    }
    newSet.length = i;
    return newSet;
  }
};

/**
 * Extend `tire` with arguments, if the arguments length is one the extend target is `tire`
 */

tire.extend = function () {
  var target = arguments[0] || {};

  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {};
  }

  if (arguments.length === 1) target = this;

  tire.fn.each(slice.call(arguments), function (index, value) {
    for (var key in value) {
      if (target[key] !== value[key]) target[key] = value[key];
    }
  });

  return target;
};

tire.fn.find.prototype = tire.fn;

tire.extend({

  // We sould be able to use slice outside
  slice: slice,

  // We sould be able to use each outside
  each: tire.fn.each,

  /**
   * Trim string
   *
   * @param {String} str
   * @return {String}
   */

  trim: function (str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
  },

  /**
   * Check if the element matches the selector
   *
   * @param {Object} element
   * @param {String} selector
   * @return {Boolean}
   */

  matches: function (element, selector) {
    if (!element || element.nodeType !== 1) return false;

    // Trying to use matchesSelector if it is available
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
    if (matchesSelector) {
      return matchesSelector.call(element, selector);
    }

    // querySelectorAll fallback
    if (document.querySelectorAll !== undefined) {
      var nodes = element.parentNode.querySelectorAll(selector);

      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] === element) return true;
      }
    }

    return false;
  },

  /**
   * Check if the `obj` is a function
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isFunction: function (obj) {
    return typeof obj === 'function';
  },

  /**
   * Check if the `obj` is a array
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isArray: function (obj) {
    return obj instanceof Array;
  },

  /**
   * Check if the `obj` is a string
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isString: function (obj) {
    return typeof obj === 'string';
  },

  /**
   * Check if the `obj` is a number
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isNumeric: function (obj) {
    return typeof obj === 'number';
  },

  /**
   * Check if the `obj` is a object
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isObject: function (obj) {
    return obj instanceof Object && !this.isArray(obj) && !this.isFunction(obj) && !this.isWindow(obj);
  },

  /**
   * Check if `obj` is a plain object
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isPlainObject: function (obj) {
    if (!obj || !this.isObject(obj) || this.isWindow(obj) || obj.nodeType) {
      return false;
    } else if (obj.__proto__ === Object.prototype) {
      return true;
    } else {
      var key;
      for (key in obj) {}
      return key === undefined || {}.hasOwnProperty.call(obj, key);
    }
  },

  /**
   * Check if `obj` is a `window` object
   */

  isWindow: function (obj) {
    return obj !== null && obj !== undefined && (obj === obj.window || 'setInterval' in obj);
  },

  /**
   * Parse JSON string to object.
   *
   * @param {String} str
   * @return {Object|null}
   */

  parseJSON: function (str) {
    if (!this.isString(str) || !str) {
      return null;
    }

    str = this.trim(str);

    if (window.JSON && window.JSON.parse) {
      return window.JSON.parse(str);
    }

    // Solution to fix JSON parse support for older browser. Not so nice but it works.
    try { return (new Function('return ' + str))(); }
    catch (e) { return null; }
  },

  /**
   * Calling .noConflict will restore the window.$` to its previous value.
   *
   * @param {Boolean} name Restore `tire` to it's previous value.
   * @return {Object}
   */

  noConflict: function (name) {
    if (name) {
      window.tire = _tire;
    }

    window.$ = _$;
    return tire;
  }
});