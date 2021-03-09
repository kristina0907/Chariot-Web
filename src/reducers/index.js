//Так как хранилище может принимать только один объект
//создаем allReducers, который будет в себе объединять все преобразователи

import {combineReducers} from 'redux';
import users from './userReducer';
import userInfo from './userInfoReducer';
import trips from './tripReducer';
import tracks from './trackReducer';
import metCoordinates from './metCoordinateReducer';
import stationMets from './stationMetReducer';
import stationMet from './currentStationMetReducer';
import stationMetInfo from './stationMetInfoReducer';
import transactions from './transactionReducer';
import actualTarif from './tarifReducer';
import language from './languageReducer';


const allReducers = combineReducers({
    users: users,
    trips: trips,
    tracks: tracks,
    stationMets: stationMets,
    stationMet: stationMet,
    stationMetInfo: stationMetInfo,
    metCoordinates: metCoordinates,
    transactions: transactions,
    userInfo: userInfo,
    actualTarif: actualTarif,
    language: language
});

export default allReducers