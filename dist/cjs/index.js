"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    BoundaryProvider: function() {
        return BoundaryProvider;
    },
    useBoundary: function() {
        return useBoundary;
    },
    useRef: function() {
        return useRef;
    }
});
var _react = require("react");
var RefContext = /*#__PURE__*/ (0, _react.createContext)(undefined);
var BoundaryProvider = function(param) {
    var children = param.children;
    var addRef = function addRef(ref) {
        refs.push(ref);
        return function() {
            return refs.splice(refs.indexOf(ref), 1);
        };
    };
    var state = (0, _react.useState)([]);
    var refs = state[0];
    return /*#__PURE__*/ (0, _react.createElement)(RefContext.Provider, {
        value: {
            addRef: addRef,
            refs: refs
        }
    }, children);
};
function useRef(initialValue) {
    var ref = (0, _react.useRef)(initialValue);
    var context = (0, _react.useContext)(RefContext);
    if (!context) throw new Error('react-ref-boundary: addRef not found on context. You might be missing the BoundaryProvider or have multiple instances of react-ref-boundary');
    (0, _react.useEffect)(function() {
        return context.addRef(ref);
    });
    return ref;
}
function useBoundary() {
    var context = (0, _react.useContext)(RefContext);
    if (!context) throw new Error('Missing react-ref-boundary context. Check for correct use of BoundaryProvider');
    return {
        refs: context.refs
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }