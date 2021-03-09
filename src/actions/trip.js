import { FETCH_TRIP, ADD_TRIP, EXTEND_TRIP, COMPLETE_TRIP, TRIP_ERROR } from './types';
import axios from 'axios';
import { apiUrl, hubUrl } from './url';
import { authHeader, handleErrorResponse } from '../helpers';

export const fetchTrips = (trips) => {
  return {
    type: FETCH_TRIP,
    trips
  }
};

export const fetchAllTrips = (idUser, filter) => {
  const headers = authHeader();
  return (dispatch) => {
      return axios.get(`${apiUrl + "/trips/GetTrips"}`, {
        headers: headers,
        params: {
          idUser: idUser === undefined ? null : idUser,
          filter: filter === undefined ? null : filter
        }
      })
      .then(response => {
        dispatch(fetchTrips(response.data))
      })
      .catch(error => {
        throw (error);
      });
  };
};

