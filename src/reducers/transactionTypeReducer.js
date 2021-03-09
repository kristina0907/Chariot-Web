import { FETCH_TRANSACTION_TYPE} from '../actions/types';

export default function transactionTypeReducer(state = [], action) {
    switch (action.type) {  
                 case FETCH_TRANSACTION_TYPE:
            return action.transactionTypes;      
        default:
            return state;
    }
}
