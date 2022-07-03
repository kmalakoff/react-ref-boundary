"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.useRef = useRef;
exports.useBoundary = useBoundary;
exports.BoundaryProvider = void 0;
var _react = _interopRequireWildcard(require("react"));
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function() {
        return cache;
    };
    return cache;
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
var RefContext = /*#__PURE__*/ (0, _react).createContext(null);
var BoundaryProvider = function(param) {
    var children = param.children;
    var addRef = function addRef(ref) {
        refs.push(ref);
        return function() {
            return refs.splice(refs.indexOf(ref), 1);
        };
    };
    var ref = _slicedToArray((0, _react).useState([]), 1), refs = ref[0];
    return /*#__PURE__*/ _react.default.createElement(RefContext.Provider, {
        value: {
            addRef: addRef,
            refs: refs
        }
    }, children);
};
exports.BoundaryProvider = BoundaryProvider;
function useRef() {
    var ref = (0, _react).useRef();
    var context = (0, _react).useContext(RefContext);
    if (!context) throw new Error("Missing react-ref-boundary context. Check for correct use of BoundaryProvider");
    (0, _react).useEffect(function() {
        return context.addRef(ref);
    });
    return ref;
}
function useBoundary() {
    var context = (0, _react).useContext(RefContext);
    if (!context) throw new Error("Missing react-ref-boundary context. Check for correct use of BoundaryProvider");
    return {
        refs: context.refs
    };
}
