import { AnyAction } from "redux";

export interface VocabularyState {
    searchTerm: string,
    graphTerms: GraphTerm[]
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


export function vocabulary(state: VocabularyState = { graphTerms: [], searchTerm: "" } as VocabularyState, action: AnyAction): VocabularyState {

    switch (action.type) {
        case 'UPDATE_SEARCHTERM':
            return {
                searchTerm: action.searchTerm,
                graphTerms: [] as GraphTerm[]
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