import { FETCH_TRIP, ADD_TRIP, TRIP_ERROR } from '../actions/types';
const initialState = {
    data: [],
    error: null
}
export default function tripReducer(state = [], action) {
    switch (action.type) {
        case ADD_TRIP:
            return [...state, action.payload];        
        case FETCH_TRIP:
            return action.trips;        
        default:
            return state;
    }
}