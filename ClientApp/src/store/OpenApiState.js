"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApi = void 0;
function openApi(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case 'UPDATE_CSDL':
            return {};
        case 'RECEIVE_UPDATED_OPENAPI':
            return {
                OpenApi: action.openApi,
                OpenApiUrl: action.openApiUrl
            };
        default:
            return state;
    }
}
exports.openApi = openApi;
//# sourceMappingURL=OpenApiState.js.map