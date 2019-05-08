import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux"
import { edit, destroy } from "../../actions/ticket";
import Button from "react-bootstrap/Button"
import "./index.css"
import { formatMoney } from '../../utils';
import { ticket } from '../../types/state';

function getPriceText(price: string){
    if (document.documentElement.clientWidth < 465){
        return `Price: ${ price }`
    } else {
        return price
    }
}

function Ticket({ ticket, editTicket, deleteTicket }: any) {
    if (ticket !== undefined){
        const origin = ticket.imported ? "Imported" : "National";
        const date = ticket.expirationDate.toDateString();
        const price = formatMoney("$", ticket.price);
        const priceText = getPriceText(price);
        return (
            <div className="ticket">
                <div className="
                    d-flex
                    align-items-center
                    p-3
                    bg-dark
                    my-3
                    ticket-name
                    rounded
                    shadow-sm
                    no-select">
                    <div>{ ticket.name }</div>
                    <div>
                        <Button 
                            variant="primary"
                            onClick={() => editTicket(ticket.id, ticket)}>
                            Edit
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={() => deleteTicket(ticket.id)}>
                            Delete
                        </Button>
                    </div>
                </div>
                <div className="ticket-specs rounded p-3 bg-light">
                    <div>
                        <div>Category: { ticket.category } </div>
                        <div>Origin: { origin }</div>
                        <div>Expiration Date: { date }</div>
                    </div>
                    <div className="ticket-price">
                        <div className="d-flex justify-content-end ml-auto">
                            { priceText }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return <div>Loading...</div>
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: any){
    console.log(ownProps);
    return {
        editTicket: (id: string, ticket: ticket) => 
            dispatch(edit(id, ticket)),
        deleteTicket: (id: string) => {
            dispatch(destroy(id))
        },
    };
}

export default connect(null, mapDispatchToProps)(Ticket);