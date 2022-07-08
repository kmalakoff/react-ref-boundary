"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.useRef = useRef;
exports.useBoundary = useBoundary;
exports.BoundaryProvider = void 0;
var _react = _interopRequireDefault(require("react"));
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
exports.BoundaryProvider = BoundaryProvider;
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
