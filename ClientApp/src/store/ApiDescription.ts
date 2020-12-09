import { Action, Reducer, AnyAction } from 'redux';
import { VocabularyState } from './VocabularyState';


// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ApiDescriptionState {
    csdl: string,
    errors: CSDLError[],
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

export interface CSDLErrorTarget {
    Name: string
}


// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.


export const reducer: Reducer<ApiDescriptionState>
    = (state: ApiDescriptionState = {} as ApiDescriptionState, action: AnyAction): ApiDescriptionState => {

    return {
        csdl: csdl(state.csdl, action),
        errors: errors(state.errors, action),
    };
};


const defaultCsdl: string = `<edmx:Edmx xmlns:edmx='http://docs.oasis-open.org/odata/ns/edmx' Version='4.0'>
    <edmx:DataServices>
    </edmx:DataServices>
</edmx:Edmx>`;

function csdl(state: string = defaultCsdl, action: AnyAction): string {
    switch (action.type) {
        case 'UPDATE_CSDL':
            return action.csdl;
        default:
            return state;
    }
}

function errors(state: CSDLError[] = [], action: AnyAction): CSDLError[] {

    switch (action.type) {
        case 'UPDATE_CSDL':
            return [];
        case 'RECEIVE_UPDATED_WARNINGS_REPORT':
            return action.warningsReport.Result[1].Details[0].Details;
        default:
            return state;
    }
}
