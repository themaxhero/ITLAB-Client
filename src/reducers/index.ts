import { combineReducers } from "redux-loop";
import ticket from "./ticket";
import search from "./search";
import { connectRouter } from "connected-react-router";
import { History } from "history";

export default (history: History<any>) => {
    return combineReducers({ 
        ticket,
        search,
        router: connectRouter(history),
    } as any);
}