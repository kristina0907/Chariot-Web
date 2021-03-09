import { LANGUAGE} from './types';
import { authenticationService } from '../services';


export const setLanguage = (language) => {
    return (dispatch) => {
        authenticationService.setLanguage(language);
        dispatch(languageSuccess(language))        
    }
}

export const languageSuccess = (language) => {
    return {
        type: LANGUAGE,
        language
    };
}