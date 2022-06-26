(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.reactRefBoundary = {}, global.React));
})(this, (function (exports, React) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    var RefContext = /*#__PURE__*/React.createContext(null);
    var BoundaryProvider = function BoundaryProvider(_a) {
      var children = _a.children;

      var _b = __read(React.useState([]), 1),
          refs = _b[0];

      function addRef(ref) {
        refs.push(ref);
        return function () {
          return refs.splice(refs.indexOf(ref), 1);
        };
      }

      return /*#__PURE__*/React__default["default"].createElement(RefContext.Provider, {
        value: {
          addRef: addRef,
          refs: refs
        }
      }, children);
    };
    function useRef() {
      var ref = React.useRef();
      var context = React.useContext(RefContext);
      if (!context) throw new Error('Missing react-ref-boundary context. Check for correct use of BoundaryProvider');
      React.useEffect(function () {
        return context.addRef(ref);
      });
      return ref;
    }
    function useBoundary() {
      var context = React.useContext(RefContext);
      if (!context) throw new Error('Missing react-ref-boundary context. Check for correct use of BoundaryProvider');
      return {
        refs: context.refs
      };
    }

    exports.BoundaryProvider = BoundaryProvider;
    exports.useBoundary = useBoundary;
    exports.useRef = useRef;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=react-ref-boundary.js.map
