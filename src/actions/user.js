import { UPDATE_PASSWORD, ERROR_PASSWORD, FETCH_USER, DEPOSIT_ACCOUNT, USER_ERROR, UPDATE_USER, EDIT_USER } from './types';
import axios from 'axios';
import { authHeader, handleErrorResponse } from '../helpers';
import { apiUrl } from './url';
import { authenticationService } from '../services';
import LocalizedStrings from 'react-localization';
import data from '../localization/data.json'
let strings = new LocalizedStrings(data);

export const fetchUsers = (users) => {
  return {
    type: FETCH_USER,
    users
  }
};

export const fetchAllUsers = (idUser, filter) => {
  const headers = authHeader();
  return (dispatch) => {
      return axios.get(`${apiUrl + "/users/GetUsers"}`, {
        headers: headers,
        params: {
          idUser: idUser === undefined ? null : idUser,
          filter: filter === undefined ? null : filter
        }
      })
      .then(response => {
        dispatch(fetchUsers(response.data))
      })
      .catch(error => {
        handleErrorResponse(error.response);
        throw (error);
      });
  };
};

export const userError = (data) => {
  return {
    type: USER_ERROR,
    payload: {data: data, time: Date.now()}
  }
};

export const editUser = (params) => {
  const headers = authHeader();
  return (dispatch) => {
    return axios.get(`${apiUrl + "/users/EditUser"}`, {
      headers: headers,
      params: {
        idUser: params
      }
    })
      .then(response => {       
          dispatch(fetchUser(response.data))
      })
      .catch(error => {
        handleErrorResponse(error.response);
        throw (error);
      });
  };
};

export const fetchUser = (user) => {
  return {
    type: EDIT_USER,
    user
  }
};

export const depositAccount = ({ idUser, depositAmount }) => {
  const headers = authHeader();
  return (dispatch) => {
    return axios.post(apiUrl + "/users/DepositAccount", { idUser, depositAmount }, { headers: headers })
      .then(response => {
        dispatch(depositAccountSuccess(response.data))
        // alert("Баланс пополнен");
      })
      .catch(error => {
        throw (error);
      });
  };
};

export const depositAccountSuccess = (data) => {
  return {
    type: DEPOSIT_ACCOUNT,
    payload: {
      amount: data.amount,
      date: data.date,
      idTransactionType: data.idTransactionType,
      idTransacttion: data.idTransacttion,
      idUser: data.idUser,
      idUserTrip: data.idUserTrip,
      isVerify: data.isVerify,
      transactionType: data.transactionType,
      transactionTypeFK: data.transactionTypeFK,
      userAccountNumber: data.userAccountNumber,
      userName: data.userName,
      userSurName: data.userSurName,
      transactionCode: data.transactionCode
    }
  }
};
export const updateUser = ({ idUser, name, surName, birtDate, phone, email}) => {
  const headers = authHeader();
  return (dispatch) => {
    return axios.post(apiUrl + "/users/UpdateUser", { idUser, name, surName, birtDate, phone, email }, { headers: headers })
      .then(response => {
          dispatch(updateUserSuccess(response.data));
          //alert("Данные изменены");  
      })
      .catch(error => {
        throw (error);
      });
  };
};

export const updateUserSuccess = (data) => {
  return {
    idUser: data.idUser,
    type: UPDATE_USER,
    payload: {
      name: data.name,
      surName: data.surName,
      birtDate: data.birtDate,
      login: data.login,
      phone: data.phone,
      email: data.email,
      idUser: data.idUser
    }
  }
};


export const updatePassword = ({idUser, oldPassword, newPassword}) => {
  const headers = authHeader();
  return (dispatch) => {
    return axios.post(apiUrl + "/users/UpdatePassword", { idUser, oldPassword, newPassword }, { headers: headers })
      .then(response => {
        if (response.data === "oldPasswordIsIncorrect"){
          //alert("Старый пароль неверный");            
          strings.setLanguage(authenticationService.language) 
          dispatch(updatePasswordError(strings.oldPasswordIsIncorrect))
        }
        else{
          //dispatch(updatePasswordSuccess(response.data));
          //dispatch(updatePasswordError(null))          
          dispatch(updateUserSuccess(response.data))
          strings.setLanguage(authenticationService.language) 
          alert(strings.passwordChanged); 
        }
      })
      .catch(error => {
        throw (error);
      });
  };
};

export const changePassword = ({idUser, newPassword}) => {
  const headers = authHeader();
  return (dispatch) => {
    return axios.post(apiUrl + "/auth/ChangePassword", { idUser, newPassword }, { headers: headers })
      .then(response => {    
          dispatch(changePasswordSuccess(response.data))  
          strings.setLanguage(authenticationService.language) 
          alert(strings.passwordChanged); 
      })
      .catch(error => {
        throw (error);
      });
  };
};

export const changePasswordSuccess = (data) => {
  return {
    type: UPDATE_PASSWORD,   
  }
};

export const updatePasswordSuccess = (data) => {
  return {
    idUser: data.idUser,
    type: UPDATE_PASSWORD,
    payload: {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    }
  }
};

export const updatePasswordError = (data) => {
  return {
    type: ERROR_PASSWORD,
    payload:{data: data, time: Date.now() }
  }
};




