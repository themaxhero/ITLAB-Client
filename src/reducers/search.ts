import { loop, Cmd } from "redux-loop";
import { searchState as state } from "../types/state";
import { search } from "../actions/ticket";
import { push } from "connected-react-router";

function changeQuery(state: state, payload: any){
    const newState = {...state, currentQuery: payload.query}
    return loop(newState, Cmd.none)
}

function performSearch(state: state, payload: any){
    const { query } = payload;
    const cmd_search = Cmd.action(search({name: query}));
    const cmd_redirect = Cmd.action(push(`/search?q=${query}`))
    const cmd = Cmd.list([cmd_search, cmd_redirect])
    const newState = {...state, currentQuery: undefined};
    return loop(newState, cmd);
}

const initialModel: state = {
    currentQuery: undefined,
}

export default function reducer(state: state = initialModel,
                                { type, payload }: any){
    switch(type){
        case "SEARCH/CHANGE_QUERY":
            return changeQuery(state, payload);

        case "SEARCH/PERFORM":
            return performSearch(state, payload);

        default:
            return loop(state, Cmd.none)
    }
}