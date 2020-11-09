"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.umlDiagram = void 0;
function umlDiagram(state, action) {
    if (state === void 0) { state = ""; }
    switch (action.type) {
        case 'UPDATE_CSDL':
            return "";
        case 'RECEIVE_UPDATED_UML':
            return action.umlDiagram;
        default:
            return state;
    }
}
exports.umlDiagram = umlDiagram;
//# sourceMappingURL=UmlDiagramState.js.map