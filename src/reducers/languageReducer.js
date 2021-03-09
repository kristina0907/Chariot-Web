import { LANGUAGE } from '../actions/types';

export default function userInfoReducer(state = [], action) {
    switch (action.type) {       
        case LANGUAGE:
            return action.language;       
        default:
            return state;
    }
}