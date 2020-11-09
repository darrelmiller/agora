import { AnyAction } from "redux";

export function umlDiagram(state: string = "", action: AnyAction): string {

    switch (action.type) {
        case 'UPDATE_CSDL':
            return "";
        case 'RECEIVE_UPDATED_UML':
            return action.umlDiagram;
        default:
            return state;
    }
}
