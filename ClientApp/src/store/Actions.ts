import { AppThunkAction } from '.';
import { GraphTermSearchResults } from './VocabularyState';
import { WarningsReport } from './ApiDescription';
import { UriSpaceNode } from './UriSpaceState';

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface UpdateCsdlAction {
    type: 'UPDATE_CSDL';
    csdl: string;
}

interface UpdateSearchTermAction {
    type: 'UPDATE_SEARCHTERM';
    searchTerm: string;
}

interface ReceiveGraphTerms {
    type: 'RECEIVE_GRAPHTERMS';
    results: GraphTermSearchResults
}

interface RequestUpdatedUmlDiagramAction {
    type: 'REQUEST_UPDATED_UML';
}

interface ReceiveUpdatedUmlDiagramAction {
    type: 'RECEIVE_UPDATED_UML';
    umlDiagram: string;
}

interface ReceiveUpdatedWarningsReportAction {
    type: 'RECEIVE_UPDATED_WARNINGS_REPORT';
    warningsReport: WarningsReport;
}

interface ReceiveUpdatedOpenApiAction {
    type: 'RECEIVE_UPDATED_OPENAPI';
    openApi: string;
    openApiUrl: string;
}

interface ReceiveUriSpace {
    type: 'RECEIVE_URISPACE';
    uriSpace: UriSpaceNode
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = UpdateCsdlAction
    | ReceiveUpdatedUmlDiagramAction
    | ReceiveUpdatedWarningsReportAction
    | UpdateSearchTermAction
    | RequestUpdatedUmlDiagramAction
    | ReceiveUpdatedOpenApiAction
    | ReceiveGraphTerms
    | ReceiveUriSpace;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    processCSDL: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)

        const appState = getState();
        if (appState && appState.apiDescription && appState.apiDescription.csdl) {

            fetch(`csdlImage`, { method: "POST", body: appState.apiDescription.csdl })
                .then(response => response.headers.get("Location") as string)
                .then(data => {
                    dispatch({ type: 'RECEIVE_UPDATED_UML', umlDiagram: data });
                });

            // Fetch updated warnings
            fetch(`csdlValidation`, { method: "POST", body: appState.apiDescription.csdl })
                .then(response => response.json())
                .then(data => {
                    dispatch({
                        type: 'RECEIVE_UPDATED_WARNINGS_REPORT',
                        warningsReport: data
                    });
                });

            // Fetch updated OpenAPI
            fetch(`openapi`, { method: "POST", body: appState.apiDescription.csdl })
                .then(async response => {
                    return {
                        openApiUrl: response.headers.get("Content-Location") as string,
                        openApi: (await response.text())
                    };
                })
                .then(data => {
                    dispatch({
                        type: 'RECEIVE_UPDATED_OPENAPI',
                        openApi: data.openApi,
                        openApiUrl: data.openApiUrl
                    });
                });

            // Fetch Urispace
            fetch(`urispacedata`, { method: "POST", body: appState.apiDescription.csdl })
                .then(response => response.json())
                .then(data => {
                    dispatch({
                        type: 'RECEIVE_URISPACE',
                        uriSpace: data
                    });
                });


            dispatch({ type: 'REQUEST_UPDATED_UML' });
        }
    },
    updateCsdl: (newValue: string) => ({ type: 'UPDATE_CSDL', csdl: newValue } as UpdateCsdlAction),
    updateSearchTerm: (newValue: string) => ({ type: 'UPDATE_SEARCHTERM', searchTerm: newValue } as UpdateSearchTermAction),
    searchForTerm: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();

        if (appState && appState.apiDescription && appState.apiDescription.csdl) {

            fetch(`graphIdentifiers?name=` + appState.vocabulary.searchTerm, { method: "GET" })
                .then(response => response.json())
                .then(data => {
                    dispatch({ type: 'RECEIVE_GRAPHTERMS', results: data });
                });
        }
    },
    updateUriSpace: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();

        if (appState && appState.apiDescription && appState.apiDescription.csdl) {
            // Fetch Urispace
            fetch(`urispacedata`, { method: "POST", body: appState.apiDescription.csdl })
                .then(response => response.json())
                .then(data => {
                    dispatch({
                        type: 'RECEIVE_URISPACE',
                        uriSpace: data
                    });
                });
        }
    }
};
