import React from "react";
import "./index.css"
import { formatMoney } from "../../utils";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { Dispatch } from "redux";

function SearchTicket({ ticket, onClick }: any){
    const { id, name, price, category, imported } = ticket;
    return (<div className="SearchPage-ticket
                            bg-light
                            round
                            no-select"
                            key={ id } 
                 onClick={() => onClick(id)}>
                <div className="SearchPage-ticket-topbar bg-dark rounded-top">
                    <div className="SearchPage-tkt-name">{ name }</div> 
                    <div className="SearchPage-tkt-prc-value">
                        { formatMoney("$", price) }
                    </div>
                </div>
                <div className="SearchPage-tkt-info rounded-bottom">
                    <div>Category: { category }</div>
                    <div>Origin: { imported ? "Imported" : "National" }</div>
                </div>
            </div>)
}

function mapDispatchToProps(dispatch: Dispatch){
    return { onClick: (id: string) => dispatch(push(`/ticket/${id}`)) }
}

export default connect(null, mapDispatchToProps)(SearchTicket);