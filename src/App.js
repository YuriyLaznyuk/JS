import React,{useState} from 'react';
import {BrowserRouter, Route, Switch
} from "react-router-dom";
import './app.scss';
import MainPage from "./pages/MainPage";
import Statistics from "./pages/Statistics";
import UserPage from "./pages/UserPage";
import {Provider} from "react-redux";
import {store} from "./store/index";

function App(props) {

    return (
        <Provider store={store}>
            <BrowserRouter>

                <Switch>
                    <Route exact path='/'><MainPage/></Route>
                    <Route path='/statistics'><Statistics/></Route>
                    <Route path='/user-page/:id'><UserPage/></Route>
                </Switch>

            </BrowserRouter>
        </Provider>
    );
}

export default App;