import { AnyAction } from "redux";

export function uriSpace(state: UriSpaceNode = { layer: "", segment:"", children: []}, action: AnyAction): UriSpaceNode {

    switch (action.type) {
        case 'UPDATE_CSDL':
            return { layer: "", segment: "", children: [] };
        case 'RECEIVE_URISPACE':
            return action.uriSpace;
        default:
            return state;
    }
}

export interface UriSpaceNode {
    layer: string;
    segment: string;
    children: UriSpaceNode[]
}