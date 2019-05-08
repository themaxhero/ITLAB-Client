import { History } from "history"
import { ticket } from '../types/state';

type uuid = string;

enum Category {
    VEGETABLE = "VEGETABLE",
    FRUIT = "FRUIT",
}

export function get(id: uuid){
    return { type: "TICKET/GET", payload: { id } };
}

export function edit(id: uuid, ticket: ticket){
    return { type: "TICKET/EDIT", payload: { id, ticket } };
}

export function update(id: uuid, parameters: any){
    return { type: "TICKET/UPDATE", payload: { id, parameters } };
}

export function destroy(id: uuid){
    return { type: "TICKET/DESTROY", payload: { id } };
}

export function search(payload: any){
    return { type: "TICKET/SEARCH", payload: payload }
}

export function ticketGetSuccessfulAction(response: any){
    return { type: "TICKET/STORE", payload: { response } };
}

export function ticketCreateSuccessfulAction(response: any){
    return { 
        type: "TICKET/CREATED_SUCCESSFULLY",
        payload: { response },
    };
}

export function ticketUpdateSuccessfulAction(ticket: any){
    return { type: "TICKET/UPDATED_SUCCESSFULLY", payload: { ticket }};
}

export function ticketDestroySuccessfulAction(ticketId: string){
    return { type: "TICKET/DESTROYED_SUCCESSFULLY", payload: { ticketId }};
}

export function ticketSearchSuccessfulAction(query: any){
    const type = "TICKET/STORE_SEARCH_RESULTS";
    const tickets = (response: any) => response.data.tickets;
    const payload = (response: any) => {
        return { tickets: tickets(response), query };
    } 
    const action = (response: any) => { 
        return {type, payload: payload(response)} 
    };
    return action;
}

export function ticketFailedAction(err: any){
    return { type: "TICKET/ERROR", payload: { err } };
}

export function creatingTicketDestinyChange(value: string){
    const newValue = value === "" ? undefined : value;
    return {type: "TICKET/CREATING_DESTINY_CHANGE",
            payload: { value: newValue },
    };
}

export function creatingTicketPrice(value: string){
    const newValue = +value;
    console.log(newValue);
    return {type: "TICKET/CREATING_PRICE_CHANGE",
            payload: { value: newValue },
        };
}

export function creatingTicketOrigin(value: string){
    const newValue: boolean = (value === "on")
    return {type: "TICKET/CREATING_ORIGIN_CHANGE",
            payload: { value: newValue },
        };
}

export function creatingTicketDeparture(value: string){
    return {type: "TICKET/CREATING_DEPARTURE_CHANGE",
            payload: { value },
        };
}

export function creatingTicketBack(value: string){
    return {type: "TICKET/CREATING_BACK_CHANGE",
            payload: { value },
        };
}

export function creatingTicketKind(value: string){
    const updateCondition = value === "ADULT" || value === "KID";
    const newValue = updateCondition ? value : undefined;
    return {type: "TICKET/CREATING_KIND_CHANGE",
            payload: { value: newValue },
        };
}

export function creatingTicketSubmit(){
    return { type: "TICKET/SUBMIT_CREATION" }
}

export function updatingTicketSubmit(){
    return { type: "TICKET/SUBMIT_UPDATE" }
}