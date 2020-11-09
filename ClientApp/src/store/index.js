"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducers = void 0;
var ApiDescription = require("./ApiDescription");
var VocabularyState_1 = require("./VocabularyState");
var OpenApiState_1 = require("./OpenApiState");
var UmlDiagramState_1 = require("./UmlDiagramState");
// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
exports.reducers = {
    apiDescription: ApiDescription.reducer,
    umlDiagram: UmlDiagramState_1.umlDiagram,
    openApi: OpenApiState_1.openApi,
    vocabulary: VocabularyState_1.vocabulary
};
//# sourceMappingURL=index.js.map