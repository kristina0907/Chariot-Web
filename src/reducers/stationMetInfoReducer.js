import { EDIT_STATION_MET } from '../actions/types';

export default function stationMetInfoReducer(state = [], action) {
    switch (action.type) {       
        case EDIT_STATION_MET:
            return action.stationMet;       
        default:
            return state;
    }
}