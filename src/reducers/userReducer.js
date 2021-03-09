import { ADD_USER, DELETE_USER, FETCH_USER, ERROR_PASSWORD, UPDATE_USER, UPDATE_PASSWORD } from '../actions/types';
const initialState = {
    data: [],
    error: null
}
export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_USER:
            return {data: [action.payload, ...state.data]};
        case UPDATE_USER:
            const {idUser, name, surName, birtDate, phone, email, login, isEnable, isOperator, comment} = action.payload;
                return {data: state.data.map((user) => {
                    if (user.idUser === action.idUser) {
                        return {
                            ...user,
                            idUser: idUser,
                            name: name,
                            surName: surName,
                            birtDate: birtDate,
                            phone: phone,
                            email: email,
                            login: login,
                            isEnable: isEnable,
                            isOperator: isOperator,
                            comment: comment                     
                        }
                    } else return user;
            })};        
        case DELETE_USER:
            return {data:state.data.filter(user => user.idUser !== action.payload.idUser)};
        case FETCH_USER:
            return {...state, data: action.users};
        case ERROR_PASSWORD:
            return {...state, error: action.payload} 
        default:
            return state;
    }
}