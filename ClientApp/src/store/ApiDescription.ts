import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ApiDescriptionState {
    isLoading: boolean;
    csdl: string;
    umlDiagram: string;
    openApi: string;
    openApiUrl: string;
    warningsReport: WarningsReport;
    errors: CSDLError[]
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface UpdateCsdlAction {
    type: 'UPDATE_CSDL';
    csdl: string;
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
type KnownAction = UpdateCsdlAction | ReceiveUpdatedUmlDiagramAction | ReceiveUpdatedWarningsReportAction | RequestUpdatedUmlDiagramAction | ReceiveUpdatedOpenApiAction ;

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
    updateCsdl: (newValue:string) => ({ type: 'UPDATE_CSDL', csdl: newValue } as UpdateCsdlAction)
};


// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ApiDescriptionState = { 
    csdl: `<edmx:Edmx xmlns:edmx='http://docs.oasis-open.org/odata/ns/edmx' Version='4.0'>
    <edmx:DataServices>
    </edmx:DataServices>
</edmx:Edmx>`, 
    umlDiagram: "", 
    openApi: "",
    openApiUrl: "", 
    warningsReport: {} as WarningsReport, 
    errors: [] as CSDLError[],
    isLoading: false};


export const reducer: Reducer<ApiDescriptionState> = (state: ApiDescriptionState | undefined, incomingAction: Action): ApiDescriptionState => {
    if (state === undefined) {
        console.log("initializing state " + unloadedState.csdl)
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'UPDATE_CSDL':
            return {
                csdl: action.csdl,
                umlDiagram: "",
                openApi: "",
                openApiUrl: "",
                warningsReport: {} as WarningsReport,
                errors: state.errors,
                isLoading: true
            };
        case 'RECEIVE_UPDATED_UML':
            return {
                csdl: state.csdl,
                umlDiagram: action.umlDiagram,
                openApi: state.openApi,                
                openApiUrl: state.openApiUrl,                
                warningsReport: state.warningsReport,
                errors: state.errors,
                isLoading: false
            };
        case 'RECEIVE_UPDATED_WARNINGS_REPORT':
            return {
                csdl: state.csdl,
                umlDiagram: state.umlDiagram,
                openApi: state.openApi,                
                openApiUrl: state.openApiUrl,                
                warningsReport: action.warningsReport,
                errors: action.warningsReport.Result[1].Details[0].Details,
                isLoading: false
            };
        case 'RECEIVE_UPDATED_OPENAPI':
                return {
                    csdl: state.csdl,
                    umlDiagram: state.umlDiagram,
                    openApi: action.openApi,                
                    openApiUrl: action.openApiUrl,                
                    warningsReport: state.warningsReport,
                    errors: state.errors,
                    isLoading: false
                };
    }

    return state;
};

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

export interface CSDLErrorTarget {
    Name: string
}