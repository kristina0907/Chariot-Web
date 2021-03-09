import { BehaviorSubject } from 'rxjs';
import { handleResponse } from '../helpers';
import { apiUrl } from '../actions/url';
import LocalizedStrings from 'react-localization';
import data from '../localization/data.json'
let strings = new LocalizedStrings(data);
//Служба аутентификации используется для входа и выхода из приложения, для входа в систему она отправляет учетные данные пользователя 
//в /users/authenticate route на api, если аутентификация прошла успешно, сведения о пользователе, 
//включая токен, добавляются в локальное хранилище, а текущий пользователь устанавливается в приложении путем вызова currentUserSubject.следующий пользователь.;)

//RxJS используются для хранения текущего состояния пользователя и связи между различными компонентами приложения.
const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
var error = "";
var errorPhoneUniq = "";
var isVerifyCode = true;
var codeUser = "";
var phoneError="";
var language = localStorage.getItem('language') != undefined ? localStorage.getItem('language') : "en";
var recaptchaResponse = null;

export const authenticationService = {
    setLanguage,
    login,
    logout,
    register,   
    generateConfirmationCode,
    verifyConfirmCode,
    CheckPhoneUniq,
    ValidateCaptcha,
    generateConfirmationCodeForRestoringAccess, 
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value },
    get error() { return error },
    get errorPhoneUniq() { return errorPhoneUniq },
    get recaptchaResponse() { return recaptchaResponse },
    get isVerifyCode() { return isVerifyCode },
    get codeUser() { return codeUser },
    get phoneError() {return phoneError},
    get language() {return language}
};

async function login(phone, password, captchaToken) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, captchaToken })
    };

    return fetch(`${apiUrl}/auth/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            if (user.phoneError !== undefined) {
                if (user.phoneError.length === 1)
                    error = user.phoneError[0];
                else
                    error = user.phoneError;
                return;
            }

            if (user.password !== undefined) {
                error = user.password;
                return;
            }

            if (user.captchaError !== undefined) {
                error = user.captchaError;
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}

async function register(email, password, name, surName, phone, birtDate, CodeConfirm, CodeUser) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, surName, phone, birtDate, CodeConfirm, CodeUser })
    };

    return fetch(`${apiUrl}/auth/register`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}

async function generateConfirmationCode(phone) {
    if(codeUser === undefined || codeUser === null || codeUser === '')
        codeUser = uuidv4();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeUser, phone })
    };

    return fetch(`${apiUrl}/auth/GenerateConfirmationCode`, requestOptions)
        .then(response => response.json())
        .then(tempUser => {
            strings.setLanguage(authenticationService.language) 
            alert(strings.confirmationCode + ": " + tempUser.codeConfirm);
            //return tempUser;
        })
        .catch(error => alert('Ошибка:' + error));
}

async function generateConfirmationCodeForRestoringAccess(phone, captchaToken) {
    codeUser = uuidv4();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeUser, phone, captchaToken })
    };

    return fetch(`${apiUrl}/auth/GenerateConfirmationCodeForRestoringAccess`, requestOptions)
        .then(response => response.json())
        .then(tempUser => {
            if (tempUser.phoneError == "noUserWithThisPhone") {
                phoneError = "noUserWithThisPhone";
            } else if (tempUser.captchaError === 'invalid captcha') {
                error = 'invalid captcha';
            } else {
                phoneError = "";
                error = '';
                strings.setLanguage(authenticationService.language)
                alert(strings.confirmationCode + ": " + tempUser.codeConfirm);
            }
        })
        .catch(error => alert('Ошибка:' + error));
}

async function verifyConfirmCode(codeConfirm, phone) {
    isVerifyCode = false;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeConfirm, codeUser, phone })
    };

    return fetch(`${apiUrl}/auth/VerifyConfirmCode`, requestOptions)
        .then(response => response.json())
        .then(tempUser => {
            if (tempUser.codeUser == "codeIsNotVerify"){
                //alert("Код введен неверно");
            }
            else{
                codeUser = tempUser.codeUser;
                isVerifyCode = true;
            }
            //return tempUser;
        })
        .catch(error => alert('Ошибка:' + error));
}

async function CheckPhoneUniq(phone) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(phone)
    };
    return fetch(`${apiUrl}/auth/checkPhoneUniq`, requestOptions)
        .then(response => response.json())
        .then(user => {
            if (user.phoneError !== undefined) {
                if (user.phoneError.length === 1)
                    errorPhoneUniq = user.phoneError[0];
                else
                    errorPhoneUniq = user.phoneError;
            }
            else{
                errorPhoneUniq = ""
            }                
        });
}

async function ValidateCaptcha(recaptchaToken) {
    codeUser = uuidv4();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recaptchaToken , codeUser })
    };

    recaptchaResponse = null;

    return fetch(`${apiUrl}/auth/ValidateCaptcha`, requestOptions)
        .then(response => response.json())
        .then(rcresp => recaptchaResponse = rcresp);
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async function setLanguage(lang){
      language = lang;
  }