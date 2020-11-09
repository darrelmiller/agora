"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vocabulary = void 0;
function vocabulary(state, action) {
    if (state === void 0) { state = { graphTerms: [], searchTerm: "" }; }
    switch (action.type) {
        case 'UPDATE_SEARCHTERM':
            return {
                searchTerm: action.searchTerm,
                graphTerms: []
            };
        case 'RECEIVE_GRAPHTERMS':
            return {
                searchTerm: state.searchTerm,
                graphTerms: action.results.matches
            };
        default:
            return state;
    }
}
exports.vocabulary = vocabulary;
//# sourceMappingURL=VocabularyState.js.map