import * as ApiDescription from './ApiDescription';
import { vocabulary, VocabularyState } from './VocabularyState';
import { OpenApiState, openApi } from './OpenApiState';
import { umlDiagram } from './UmlDiagramState';
import { uriSpace, UriSpaceNode } from './UriSpaceState';

// The top-level state object
export interface ApplicationState {
    apiDescription: ApiDescription.ApiDescriptionState,
    umlDiagram: string,
    openApi: OpenApiState,
    vocabulary: VocabularyState,
    uriSpace: UriSpaceNode
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    apiDescription: ApiDescription.reducer,
    umlDiagram: umlDiagram,
    openApi: openApi,
    vocabulary: vocabulary,
    uriSpace: uriSpace
};


// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
