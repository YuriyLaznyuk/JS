import {createStore, combineReducers, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import {workReducer} from "./reducers/workReducer";

const rootReducers = combineReducers({
    sqlite: workReducer
});

export const store = createStore(rootReducers,
    composeWithDevTools(applyMiddleware(thunk)));