export interface IConfig{
    api: string;
    port: number;
    uri: string;
}

interface ITicket {
    id: string;
    name: string;
    departure: Date;
    back: Date;
    kind: string;
    price: number;
    national: boolean;
}

interface IdLessTicket{
    name?: string;
    departure?: string;
    back?: string;
    kind?: string;
    price?: number;
    national: boolean;
}

export function submitableTicket(ticket: IdLessTicket){
    const allFieldsAreFilled = ticket.name 
        && ticket.departure 
        && ticket.kind 
        && ticket.price;
    const regex = /^[0-9]{4}-[0-1][0-9]$/;
    const departure = ticket.departure
    const departureHasValidFormat = departure === undefined ? 
        false : regex.test(departure);
    return (allFieldsAreFilled && departureHasValidFormat);
}

export function fromExistingToDraft(current: ticket): IdLessTicket{
    const year = current.departure.getFullYear();
    const month = current.departure.getMonth();
    return {
        name: current.name,
        departure: `${year}-${month}`,
        back: `${year}-${month}`,
        kind: current.kind,
        price: current.price,
        national: current.national,
    };
}

export function compareExistingWithDraft(current: ticket, ticket: IdLessTicket){
    const regex = /^[0-9]{4}-[0-1][0-9]$/;
    const departure = ticket.departure;
    const back = ticket.back;
    const departureHasValidFormat = 
        departure === undefined ? false : regex.test(departure);
    if (!departureHasValidFormat || !departure){
        return false
    }
    const [year, month] = departure.split("-");
    const [year2, month2] = back.split("-");
    const equalName = current.name === ticket.name;
    const equalDeparture = current.departure === new Date(+year, +month);
    const equalBack = current.back === new Date(+year2, +month2);
    const equalCategory = current.kind === ticket.kind;
    const equalImported = current.national === ticket.national;
    const equalPrice = current.price === ticket.price;
    return equalName 
           && equalDeparture
           && equalBack
           && equalCategory
           && equalImported
           && equalPrice;
}

export const baseTicket: IdLessTicket = {
    national: false,
}

export type ticket = ITicket;

interface ISearch{
    currentQuery: string | undefined;
}

export type searchState = ISearch;

interface ITicketState {
    editingId?: string;
    creatingTicket: IdLessTicket;
    currentTicket: ITicket | undefined;
    searchResult: ITicket[] | undefined;
    prevQuery: any | undefined;
}

export type ticketState = ITicketState;

interface IState{
    ticket: ticketState;
    search: searchState;
}

export type state = IState;