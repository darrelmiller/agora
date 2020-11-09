import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ApiDescriptionState {
    csdl: string,
    errors: CSDLError[],
    umlDiagram: string,
    openApi: OpenApiState
    vocabulary: VocabularyState
}

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

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = UpdateCsdlAction | ReceiveUpdatedUmlDiagramAction | ReceiveUpdatedWarningsReportAction
    | UpdateSearchTermAction | RequestUpdatedUmlDiagramAction | ReceiveUpdatedOpenApiAction
    | ReceiveGraphTerms;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    processCSDL: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        
        const appState = getState();
        if (appState && appState.apiDescription && appState.apiDescription.csdl ) {

            fetch(`csdlImage`, {method: "POST", body: appState.apiDescription.csdl})
                .then(response => response.headers.get("Location") as string)
                .then(data => {
                    dispatch({ type: 'RECEIVE_UPDATED_UML', umlDiagram: data });
                });

            // Fetch updated warnings
            fetch(`csdlValidation`, {method: "POST", body: appState.apiDescription.csdl})
                .then(response => response.json() )
                .then(data => { 
                                dispatch({ type: 'RECEIVE_UPDATED_WARNINGS_REPORT', 
                                              warningsReport: data });
                            });

            // Fetch updated OpenAPI
            fetch(`openapi`, {method: "POST", body: appState.apiDescription.csdl})
                .then(async response => {return { openApiUrl: response.headers.get("Content-Location") as string,
                                    openApi: (await response.text()) };} )
                .then(data => { 
                                dispatch({ type: 'RECEIVE_UPDATED_OPENAPI', 
                                              openApi: data.openApi,
                                              openApiUrl: data.openApiUrl });
                                
                            });

            dispatch({ type: 'REQUEST_UPDATED_UML' });
        }
    },
    updateCsdl: (newValue: string) => ({ type: 'UPDATE_CSDL', csdl: newValue } as UpdateCsdlAction),
    updateSearchTerm: (newValue: string) => ({ type: 'UPDATE_SEARCHTERM', searchTerm: newValue } as UpdateSearchTermAction),
    searchForTerm: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();

        if (appState && appState.apiDescription && appState.apiDescription.csdl) {

            fetch(`graphIdentifiers?name=` + appState.apiDescription.vocabulary.searchTerm, { method: "GET" })
                .then(response => response.json())
                .then(data => {
                    dispatch({ type: 'RECEIVE_GRAPHTERMS', results: data });
                });
        }
    }
};


// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.


export const reducer: Reducer<ApiDescriptionState> = (state: ApiDescriptionState = {} as ApiDescriptionState, incomingAction: Action): ApiDescriptionState => {

    const action = incomingAction as KnownAction;

    return {
        csdl: csdl(state.csdl, action),
        umlDiagram: umlDiagram(state.umlDiagram, action),
        errors: errors(state.errors, action),
        openApi: openApi(state.openApi, action),
        vocabulary: vocabulary(state.vocabulary,action)
    };
   
};

export interface OpenApiState {
    OpenApi: string,
    OpenApiUrl: string
}

export interface VocabularyState {
    searchTerm: string,
    graphTerms: GraphTerm[]
}

export interface WarningsReport {
    Result: CSDLError[]
}

export interface CSDLError {
    Code: string,
    Message: string,
    Target: CSDLErrorTarget,
    Details: CSDLError[],
    InnerError: CSDLError
}

export interface GraphTermSearchResults {
    matches: GraphTerm[]
}

export interface GraphTerm {
    version: string,
    type: string,
    namespace: string,
    name: string,
    kind: string
    description: string,
    required: boolean
}

export interface CSDLErrorTarget {
    Name: string
}

const defaultCsdl: string = `<edmx:Edmx xmlns:edmx='http://docs.oasis-open.org/odata/ns/edmx' Version='4.0'>
    <edmx:DataServices>
    </edmx:DataServices>
</edmx:Edmx>`;

function csdl(state: string = defaultCsdl, incomingAction: any): string {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'UPDATE_CSDL':
            return action.csdl;
        default:
            return state;
    }
}

function umlDiagram(state: string = "", incomingAction: any): string {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'UPDATE_CSDL':
            return "";
        case 'RECEIVE_UPDATED_UML':
            return action.umlDiagram;
        default:
            return state;
    }
}

function errors(state: CSDLError[] = [], incomingAction: any): CSDLError[] {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'UPDATE_CSDL':
            return [];
        case 'RECEIVE_UPDATED_WARNINGS_REPORT':
            return action.warningsReport.Result[1].Details[0].Details;
        default:
            return state;
    }
}

function openApi(state: OpenApiState = {} as OpenApiState, incomingAction: any): OpenApiState {
    const action = incomingAction as KnownAction;
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

function vocabulary(state: VocabularyState = {graphTerms: [], searchTerm: "" } as VocabularyState, incomingAction: any): VocabularyState {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'UPDATE_SEARCHTERM':
            return {
                searchTerm: action.searchTerm,
                graphTerms: [] as GraphTerm[] 
            } ;
        case 'RECEIVE_GRAPHTERMS':
            return {
                searchTerm: state.searchTerm,
                graphTerms: action.results.matches
            };
        default:
            return state;
    }
}