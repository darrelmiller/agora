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
    var _a, _b;
    if (state === void 0) { state = []; }
    switch (action.type) {
        case 'UPDATE_CSDL':
            return [];
        case 'RECEIVE_UPDATED_WARNINGS_REPORT':
            return (_b = (_a = action.warningsReport.Result[1]) === null || _a === void 0 ? void 0 : _a.Details[0]) === null || _b === void 0 ? void 0 : _b.Details;
        default:
            return state;
    }
}
//# sourceMappingURL=ApiDescription.js.map