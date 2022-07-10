(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.reactRefBoundary = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  var RefContext = /*#__PURE__*/ React__default["default"].createContext(undefined);
  var BoundaryProvider = function(param) {
      var children = param.children;
      var addRef = function addRef(ref) {
          refs.push(ref);
          return function() {
              return refs.splice(refs.indexOf(ref), 1);
          };
      };
      var state = React__default["default"].useState([]);
      var refs = state[0];
      return /*#__PURE__*/ React__default["default"].createElement(RefContext.Provider, {
          value: {
              addRef: addRef,
              refs: refs
          }
      }, children);
  };
  function useRef(initialValue) {
      var ref = React__default["default"].useRef(initialValue);
      var context = React__default["default"].useContext(RefContext);
      if (!context) throw new Error("react-ref-boundary: addRef not found on context. You might be missing the BoundaryProvider or have multiple instances of react-ref-boundary");
      React__default["default"].useEffect(function() {
          return context.addRef(ref);
      });
      return ref;
  }
  function useBoundary() {
      var context = React__default["default"].useContext(RefContext);
      if (!context) throw new Error("Missing react-ref-boundary context. Check for correct use of BoundaryProvider");
      return {
          refs: context.refs
      };
  }
  var index = {
      BoundaryProvider: BoundaryProvider,
      useRef: useRef,
      useBoundary: useBoundary
  };

  exports.BoundaryProvider = BoundaryProvider;
  exports["default"] = index;
  exports.useBoundary = useBoundary;
  exports.useRef = useRef;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=react-ref-boundary.js.map
