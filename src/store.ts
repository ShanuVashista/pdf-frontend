import {createStore} from "redux";
import {UserType} from "./types";

export interface AppStateType {
    user?: UserType,
    active_state?: Record<any, any>
}

const initialState: AppStateType = {
    user: null,
    active_state: null
};

export const store = createStore((state: AppStateType = initialState, action: any): AppStateType => {
    const {type} = action;
    switch (type) {

        case SET_USER:
            return {...state, user: action.user};

        case SET_ACTIVE_STATE:
            return {...state, active_state: action.active_state};

        default:
            return state;
    }
});

export const SET_USER = Symbol("SET_USER");
export const SET_ACTIVE_STATE = Symbol("SET_ACTIVE_STATE");