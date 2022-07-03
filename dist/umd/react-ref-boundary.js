(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.reactRefBoundary = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
  }
  function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _s, _e;
      try {
          for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
              _arr.push(_s.value);
              if (i && _arr.length === i) break;
          }
      } catch (err) {
          _d = true;
          _e = err;
      } finally{
          try {
              if (!_n && _i["return"] != null) _i["return"]();
          } finally{
              if (_d) throw _e;
          }
      }
      return _arr;
  }
  function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  var RefContext = /*#__PURE__*/ React.createContext(null);
  var BoundaryProvider = function(param) {
      var children = param.children;
      var addRef = function addRef(ref) {
          refs.push(ref);
          return function() {
              return refs.splice(refs.indexOf(ref), 1);
          };
      };
      var ref = _slicedToArray(React.useState([]), 1), refs = ref[0];
      return /*#__PURE__*/ React__default["default"].createElement(RefContext.Provider, {
          value: {
              addRef: addRef,
              refs: refs
          }
      }, children);
  };
  function useRef() {
      var ref = React.useRef();
      var context = React.useContext(RefContext);
      if (!context) throw new Error("Missing react-ref-boundary context. Check for correct use of BoundaryProvider");
      React.useEffect(function() {
          return context.addRef(ref);
      });
      return ref;
  }
  function useBoundary() {
      var context = React.useContext(RefContext);
      if (!context) throw new Error("Missing react-ref-boundary context. Check for correct use of BoundaryProvider");
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
