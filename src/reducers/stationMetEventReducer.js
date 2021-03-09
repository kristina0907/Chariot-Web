import { FETCH_STATION_MET_EVENT} from '../actions/types';

export default function stationMetEventReducer(state = [], action) {
    switch (action.type) {  
                 case FETCH_STATION_MET_EVENT:
            return action.stationMetEvents;      
        default:
            return state;
    }
}
