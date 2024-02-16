(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.reactRefBoundary = {}, global.React));
})(this, (function (exports, react) { 'use strict';

  var RefContext = /*#__PURE__*/ react.createContext(undefined);
  var BoundaryProvider = function(param) {
      var children = param.children;
      var addRef = function addRef(ref) {
          refs.push(ref);
          return function() {
              return refs.splice(refs.indexOf(ref), 1);
          };
      };
      var state = react.useState([]);
      var refs = state[0];
      return /*#__PURE__*/ react.createElement(RefContext.Provider, {
          value: {
              addRef: addRef,
              refs: refs
          }
      }, children);
  };
  function useRef(initialValue) {
      var ref = react.useRef(initialValue);
      var context = react.useContext(RefContext);
      if (!context) throw new Error("react-ref-boundary: addRef not found on context. You might be missing the BoundaryProvider or have multiple instances of react-ref-boundary");
      react.useEffect(function() {
          return context.addRef(ref);
      });
      return ref;
  }
  function useBoundary() {
      var context = react.useContext(RefContext);
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
