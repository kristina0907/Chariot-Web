import { EDIT_USER } from '../actions/types';

export default function userInfoReducer(state = [], action) {
    switch (action.type) {       
        case EDIT_USER:
            return action.user;       
        default:
            return state;
    }
}