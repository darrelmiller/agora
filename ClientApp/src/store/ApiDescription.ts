import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';


// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ApiDescriptionState {
    isLoading: boolean;
    csdl: string;
    umlDiagram: string;
    warningsReport: string;
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
    umlDiagram: string;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = UpdateCsdlAction | ReceiveUpdatedUmlDiagramAction | ReceiveUpdatedWarningsReportAction | RequestUpdatedUmlDiagramAction ;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestUmlDiagram: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.apiDescription?.csdl ) {
            fetch(`csdlImage`, {method: "POST", body: appState.apiDescription.csdl})
                .then(response => response.text() as Promise<string>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_UPDATED_UML', umlDiagram: data });
                });

            dispatch({ type: 'REQUEST_UPDATED_UML' });
        }
    }
};


// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ApiDescriptionState = { csdl: "", umlDiagram: "", warningsReport: "", isLoading: false};

export const reducer: Reducer<ApiDescriptionState> = (state: ApiDescriptionState | undefined, incomingAction: Action): ApiDescriptionState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'UPDATE_CSDL':
            return {
                csdl: action.csdl,
                umlDiagram: "",
                warningsReport: "",
                isLoading: true
            };
        case 'RECEIVE_UPDATED_UML':
            return {
                csdl: state.csdl,
                umlDiagram: action.umlDiagram,
                warningsReport: state.warningsReport,
                isLoading: false
            };
    }

    return state;
};
