"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = void 0;
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
exports.reducer = function (state, action) {
    if (state === void 0) { state = {}; }
    return {
        csdl: csdl(state.csdl, action),
        errors: errors(state.errors, action),
    };
};
var defaultCsdl = "<edmx:Edmx xmlns:edmx='http://docs.oasis-open.org/odata/ns/edmx' Version='4.0'>\n    <edmx:DataServices>\n    </edmx:DataServices>\n</edmx:Edmx>";
function csdl(state, action) {
    if (state === void 0) { state = defaultCsdl; }
    switch (action.type) {
        case 'UPDATE_CSDL':
            return action.csdl;
        default:
            return state;
    }
}
function errors(state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case 'UPDATE_CSDL':
            return [];
        case 'RECEIVE_UPDATED_WARNINGS_REPORT':
            return action.warningsReport.Result[1].Details[0].Details;
        default:
            return state;
    }
}
//# sourceMappingURL=ApiDescription.js.map