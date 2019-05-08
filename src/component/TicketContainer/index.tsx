import React, { useEffect } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { get } from "../../actions/ticket";
import Ticket from "../Ticket";
import { state, ticket } from "../../types/state";

interface OwnProps {
    match: any;
}

interface StateProps {
    currentTicket: ticket | undefined;
}

interface DispatchProps {
    getTicket: (id: string) => void,
}

type props = StateProps & DispatchProps & OwnProps;

function Component({ match, getTicket, currentTicket}: props){
    if (currentTicket === undefined || currentTicket.id !== match.params.id){
        useEffect(() => { getTicket(match.params.id )})
    }
    return <Ticket ticket={ currentTicket } />;
}

function mapStateToProps(state: state): StateProps {
    return { currentTicket: state.ticket.currentTicket };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps{
    return { getTicket: (id: string) => dispatch(get(id)) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);