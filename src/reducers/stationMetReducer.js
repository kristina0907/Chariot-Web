import { FETCH_STATION_MET, ADD_STATION_MET, UPDATE_STATION_MET, STATION_MET_ERROR } from '../actions/types';
const initialState = {
    data: [],
    error: null
}
export default function metReducer(state = initialState, action) {
    switch (action.type) { 
        case ADD_STATION_MET:
            return {data: [action.payload, ...state.data]};
        case UPDATE_STATION_MET:
        const {idStationMet, isEnable, code, name, adress, dateBegin, latitude, longitude, comment, countSlots} = action.payload;
            return {data: state.data.map((stationMet) => {
                if (stationMet.idStationMet === action.idStationMet) {
                    return {
                        ...stationMet,
                        idStationMet: idStationMet,
                        isEnable: isEnable,
                        code: code,
                        name: name,
                        adress: adress,
                        dateBegin: dateBegin,
                        latitude: latitude,
                        longitude: longitude,
                        comment: comment,
                        countSlots: countSlots                                              
                    }
                } else return stationMet;
            })}       
        case FETCH_STATION_MET:
            return {...state, data: action.stationMets};
        case STATION_MET_ERROR:
            return {...state, error: action.payload}      
        default:
            return state;
    }
}


