import {
    FETCH_USERS_SUCCESS,
} from '../actions';
import { CREATE_USER, UPDATE_USER } from '../modules/UserEditor/actions';

const initialState = {
    list: [],
    byId: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERS_SUCCESS: {
            const byId = {};
            const list = [];
            action.payload.users.forEach((user) => {
                byId[user.id] = user;
                list.push(user.id);
            });

            return {
                byId,
                list,
            };
        }
        case CREATE_USER: {
            const { user } = action.payload;
            const list = [...state.list, user.id];
            const byId = { ...state.byId, [user.id]: user };

            return {
                byId,
                list,
            };
        }
        case UPDATE_USER: {
            const { user } = action.payload;
            const byId = { ...state.byId, [user.id]: user };

            return {
                ...state,
                byId,
            };
        }
        default:
            return state;
    }
};