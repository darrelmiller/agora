"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uriSpace = void 0;
function uriSpace(state, action) {
    if (state === void 0) { state = { layer: "", segment: "", children: [] }; }
    switch (action.type) {
        case 'UPDATE_CSDL':
            return { layer: "", segment: "", children: [] };
        case 'RECEIVE_URISPACE':
            return action.uriSpace;
        default:
            return state;
    }
}
exports.uriSpace = uriSpace;
//# sourceMappingURL=UriSpaceState.js.map