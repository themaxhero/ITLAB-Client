import React from "react";
import { render } from "react-dom";
import './index.css';
import Root from './component/Root';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { routerMiddleware } from "connected-react-router";
import { install } from "redux-loop";
import logger from "redux-logger";
import reducers from "./reducers";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const enhancer = composeWithDevTools(
    install(),
    applyMiddleware(routerMiddleware(history)),
    applyMiddleware(logger),
);

const store = createStore(reducers(history), enhancer);

const element = <Root store={ store } history={ history }/>;

const renderOnElement = document.getElementById('root');

render(element, renderOnElement);

serviceWorker.unregister();