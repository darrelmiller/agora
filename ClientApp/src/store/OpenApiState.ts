import { AnyAction } from "redux";

export interface OpenApiState {
    OpenApi: string,
    OpenApiUrl: string
}


export function openApi(state: OpenApiState = {} as OpenApiState, action: AnyAction): OpenApiState {

    switch (action.type) {
        case 'UPDATE_CSDL':
            return {} as OpenApiState;
        case 'RECEIVE_UPDATED_OPENAPI':
            return {
                OpenApi: action.openApi,
                OpenApiUrl: action.openApiUrl
            };
        default:
            return state;
    }
}
