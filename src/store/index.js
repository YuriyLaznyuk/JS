import {createStore, combineReducers, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import {initReducer} from "./reducers/initReducer";

const rootReducers = combineReducers({
    sqlite: initReducer
});

export const store = createStore(rootReducers,
    composeWithDevTools(applyMiddleware(thunk)));