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
    useRef: function() {
        return useRef;
    },
    useBoundary: function() {
        return useBoundary;
    },
    default: function() {
        return _default;
    }
});
var _react = /*#__PURE__*/ _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var RefContext = /*#__PURE__*/ _react.default.createContext(undefined);
var BoundaryProvider = function(param) {
    var children = param.children;
    var addRef = function addRef(ref) {
        refs.push(ref);
        return function() {
            return refs.splice(refs.indexOf(ref), 1);
        };
    };
    var state = _react.default.useState([]);
    var refs = state[0];
    return /*#__PURE__*/ _react.default.createElement(RefContext.Provider, {
        value: {
            addRef: addRef,
            refs: refs
        }
    }, children);
};
function useRef(initialValue) {
    var ref = _react.default.useRef(initialValue);
    var context = _react.default.useContext(RefContext);
    if (!context) throw new Error("react-ref-boundary: addRef not found on context. You might be missing the BoundaryProvider or have multiple instances of react-ref-boundary");
    _react.default.useEffect(function() {
        return context.addRef(ref);
    });
    return ref;
}
function useBoundary() {
    var context = _react.default.useContext(RefContext);
    if (!context) throw new Error("Missing react-ref-boundary context. Check for correct use of BoundaryProvider");
    return {
        refs: context.refs
    };
}
var _default = {
    BoundaryProvider: BoundaryProvider,
    useRef: useRef,
    useBoundary: useBoundary
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}