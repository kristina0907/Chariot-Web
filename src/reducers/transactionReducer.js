import { FETCH_TRANSACTION, DEPOSIT_ACCOUNT } from '../actions/types';
const initialState = {
    data: [],
    error: null
}
export default function transactionReducer(state = [], action) {
    switch (action.type) {            
        case FETCH_TRANSACTION:
            return action.transactions;
        case DEPOSIT_ACCOUNT:
            return [action.payload, ...state];
        default:
            return state;
    }
}