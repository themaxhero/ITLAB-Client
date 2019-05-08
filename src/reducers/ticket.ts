import { loop, Cmd } from 'redux-loop';
import { ActionCreator } from 'redux';
import axios from "axios";
import { action, cmdRunOptionsGen } from "../types/action";
import { ticketGetSuccessfulAction,
         ticketCreateSuccessfulAction,
         ticketUpdateSuccessfulAction,
         ticketSearchSuccessfulAction,
         ticketFailedAction,
} from "../actions/ticket";
import { push } from "connected-react-router";
import { ticketState as state,
         IConfig,
         ticket,
         baseTicket,
         fromExistingToDraft 
} from '../types/state';

const config: IConfig = require("../config.json");
const { api, port, uri } = config;


// Helpers

function makeParam(paramName: string, param: any){
    if (!param){
        return "";
    }
    return `${paramName}=${param}`;
}

// Side-Effects

function createTicket(payload: any){
    const { name, expirationDate, category, price, imported } = payload;
    const body = { name, expirationDate, category, price, imported };
    return axios.post(`${api}:${port}${uri}/ticket/register`, body);
}

function getTicket(ticketId: string){
    const url = `${api}:${port}${uri}/ticket/${ ticketId }`;
    return axios.get(url);
}

function updateTicket(payload: any){
    const { id, name, expirationDate, category, price, imported } = payload;
    const body = { id, name, expirationDate, category, price, imported };
    return axios.post(`${api}:${port}${uri}/ticket/update`, body);
}

function destroyTicket(payload: any){
    const { id } = payload;
    const body = { id };
    return axios.post(`${api}:${port}${uri}/ticket/destroy`, body);
}

function searchTicket(payload: any){
    const { category, name, min, max, national, departure, back } = payload;
    const urlParams = [
        makeParam("q", name),
        makeParam("c", category),
        makeParam("depDate", departure),
        makeParam("backDate", back),
        makeParam("min", min),
        makeParam("max", max),
        (national ? "national" : ""),
    ]
    .filter((param) => param !== "")
    .join("&")
    const url = `${api}:${port}${uri}/tickets?${ urlParams }`
    return axios.get(url);
}

// Actions

function get(state: state, payload: any){
    const { id } = payload;
    const options =
        cmdRunOptionsGen(ticketGetSuccessfulAction,
                         ticketFailedAction,
                         [ id ],
        );
    const cmd = Cmd.run(getTicket, options);
    return loop(state, cmd);
}

function edit(state: state, payload: any){
    const price = payload.ticket.price / 100;
    const ticket = {...payload.ticket, price};
    const newState = {
        ...state,
        creatingTicket: fromExistingToDraft(ticket),
        editingId: payload.id,
    };
    const cmd = Cmd.action(push("/editing"));
    console.log(cmd);
    return loop(newState, cmd);
}

function destroy(state: state, payload: any){
    const success = push("/");
    const fail = push(`/ticket/${ payload.id }`);
    const options = {
        successActionCreator: (a: any) => success,
        failActionCreator: (b: any) => fail,
        args: [ payload ],
    };
    const cmd = Cmd.run(destroyTicket, options);
    return loop(state, cmd);
}

function search(state: state, payload: any){
    const success = 
        ticketSearchSuccessfulAction(payload) as ActionCreator<any>;
    const fail = 
        ticketFailedAction as ActionCreator<any>;
    const options = 
        { successActionCreator: success,
          failActionCreator: fail,
          args:[ payload ],
        };
    const cmd = Cmd.run(searchTicket, options);
    return loop(state, cmd);
}

function store(state: state, payload: any){
    const { response } = payload;
    const cmd = Cmd.none;
    const decodeTicket = () => {
        const ticketJSON = response.data;
        const parsedJSON = JSON.parse(ticketJSON);
        const { departure, back } = parsedJSON;
        const decodedTicket = 
            {...parsedJSON, departure: new Date(departure), back: new Date(back)};
        return decodedTicket;
    }
    const currentTicket: ticket = decodeTicket();
    const newState = {...state, currentTicket};
    return loop(newState, cmd);
}

function createdSuccessfully(state: state, payload: any){
    const { response } = payload;
    const decodeTicket = () => {
        const ticketJSON = response.data;
        const parsedJSON = JSON.parse(ticketJSON);
        const { departure, back } = parsedJSON;
        const decodedTicket = 
            {...parsedJSON, departure: new Date(departure), back: new Date(back)};
        return decodedTicket;
    }
    const ticket = decodeTicket();
    const { id } = ticket;
    const cmd = Cmd.action(push(`/ticket/${ id }`));
    return loop(state, cmd);
}
function updatedSuccessfully(state: state, payload: any){
    const { response } = payload;
    const decodeTicket = () => {
        const ticketJSON = response.data;
        const parsedJSON = JSON.parse(ticketJSON);
        const { departure, back } = parsedJSON;
        const decodedTicket = 
            {...parsedJSON, departure: new Date(departure), back: new Date(back)};
        return decodedTicket;
    }
    const ticket = decodeTicket();
    const { id } = ticket;
    const cmd = Cmd.action(push(`/ticket/${ id }`));
    return loop(state, cmd);
}
function destroyedSuccessfully(state: state, payload: any){
    const cmd = Cmd.action(push("/"));
    return loop(state, cmd);
}
function storeSearchResults(state: state, payload: any){
    console.log(payload);
    const { tickets, query } = payload;
    const parsedTickets: ticket[] = tickets;
    const cmd = Cmd.none;
    const newState = {
        ...state, 
        searchResult: parsedTickets,
        prevQuery: query,
    }
    return loop(newState, cmd);
}
function setError(state: state, payload: any){
    const { error } = payload;
    const cmd = Cmd.none;
    const newState = {...state, error}
    return loop(newState, cmd);
}

function creatingTicketDestinyChange(state: state, payload: any){
    const { value } = payload;
    const ticket = state.creatingTicket;
    const newTicket = {...ticket, destiny: value};
    const newState = {...state, creatingTicket: newTicket};
    return loop(newState, Cmd.none);
}
function creatingTicketPriceChange(state: state, payload: any){
    const { value } = payload;
    const ticket = state.creatingTicket;
    const newTicket = {...ticket, price: value};
    const newState = {...state, creatingTicket: newTicket};
    return loop(newState, Cmd.none);
}
function creatingTicketOriginChange(state: state, payload: any){
    const { value } = payload;
    const ticket = state.creatingTicket;
    const newTicket = {...ticket, imported: value};
    const newState = {...state, creatingTicket: newTicket};
    return loop(newState, Cmd.none);
}
function creatingTicketDepartureChange(state: state, payload: any){
    const { value } = payload;
    const ticket = state.creatingTicket;
    const newTicket = {
        ...ticket, 
        departure: value,
    };
    const newState = {...state, creatingTicket: newTicket};
    return loop(newState, Cmd.none);
}
function creatingTicketBackChange(state: state, payload: any){
    const { value } = payload;
    const ticket = state.creatingTicket;
    const newTicket = {
        ...ticket, 
        back: value,
    };
    const newState = {...state, creatingTicket: newTicket};
    return loop(newState, Cmd.none);
}
function creatingTicketCategoryChange(state: state, payload: any){
    const { value } = payload;
    const ticket = state.creatingTicket;
    const newTicket = {...ticket, category: value};
    const newState = {...state, creatingTicket: newTicket};
    return loop(newState, Cmd.none);
}

function submitCreation(state: state){
    const ticket = state.creatingTicket;
    if (ticket.departure === undefined){
        return loop(state, Cmd.none);
    }
    const [year, month] = ticket.departure.split("-");
    if (ticket.name && ticket.departure && ticket.kind && ticket.price){
        const body = {
            ...ticket,
            price: (ticket.price * 100),
            expirationDate: new Date(+year, +month)
        };
        const success = ticketCreateSuccessfulAction as ActionCreator<any>;
        const fail = ticketFailedAction as ActionCreator<any>;
        const options = {
            successActionCreator: success,
            failActionCreator: fail,
            args: [ body ]
        };
        const cmd = Cmd.run(createTicket, options);
        const newState = {creatingTicket: baseTicket};
        return loop(newState, cmd)
    } else {
        throw new Error("Ticket does not have the required fields");
    }
}

function submitUpdate(state: state){
    const { editingId, creatingTicket} = state;
    const ticket = creatingTicket;
    if (ticket.departure === undefined){
        return loop(state, Cmd.none);
    }
    if (ticket.back === undefined){
        return loop(state, Cmd.none);
    }
    const [year, month] = ticket.departure.split("-");
    const [year2, month2] = ticket.back.split("-");
    const departure = new Date(+year, +month);
    const back = new Date(+year2, +month2);
    if (editingId 
        && ticket.name
        && ticket.departure
        && ticket.kind
        && ticket.price){
        const params = {
            ...creatingTicket,
            departure,
            back,
        }
        const options =
            cmdRunOptionsGen(ticketUpdateSuccessfulAction,
                             ticketFailedAction,
                             [ params ],
            );
        const cmd = Cmd.run(updateTicket, options);
        return loop(state, cmd);

    }
    const cmd = Cmd.none;
    return loop(state, cmd)
}

// Reducer

const initialState: state = {
    editingId: undefined,
    creatingTicket: baseTicket,
    currentTicket: undefined,
    searchResult: undefined,
    prevQuery: undefined,
}

export default function tickets(state: state = initialState,
                                { type, payload }: action){
    switch(type) {
        case "TICKET/GET":
            return get(state, payload);

        case "TICKET/EDIT":
            return edit(state, payload);
        
        case "TICKET/DESTROY":
            return destroy(state, payload);
        
        case "TICKET/SEARCH":
            return search(state, payload);
        
        case "TICKET/STORE":
            return store(state, payload);
        
        case "TICKET/CREATED_SUCCESSFULLY":
            return createdSuccessfully(state, payload);
        
        case "TICKET/UPDATED_SUCCESSFULLY":
            return updatedSuccessfully(state, payload);
        
        case "TICKET/DESTROYED_SUCCESSFULLY":
            return destroyedSuccessfully(state, payload);
        
        case "TICKET/STORE_SEARCH_RESULTS":
            return storeSearchResults(state, payload);
        
        case "TICKET/ERROR":
            return setError(state, payload);

        case "TICKET/CREATING_DESTINY_CHANGE":
            return creatingTicketDestinyChange(state, payload);

        case "TICKET/CREATING_PRICE_CHANGE":
            return creatingTicketPriceChange(state, payload);

        case "TICKET/CREATING_ORIGIN_CHANGE":
            return creatingTicketOriginChange(state, payload);

        case "TICKET/CREATING_DEPARTURE_CHANGE":
            return creatingTicketDepartureChange(state, payload);

        case "TICKET/CREATING_BACK_CHANGE":
            return creatingTicketBackChange(state, payload);

        case "TICKET/CREATING_KIND_CHANGE":
            return creatingTicketCategoryChange(state, payload);

        case "TICKET/SUBMIT_CREATION":
            return submitCreation(state);

        case "TICKET/SUBMIT_UPDATE":
            return submitUpdate(state);
        
        default:
            return loop(state, Cmd.none);
    }
}