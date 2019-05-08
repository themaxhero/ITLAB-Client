import React, { useEffect } from "react";
import { connect } from "react-redux"
import { Dispatch } from "redux";
import "./index.css";
import SearchTicket from "./SearchTicket";
import { search } from "../../actions/ticket";
import { ticket } from '../../types/state';

function Component({ location,
                  searchResult,
                  doSearch,
                  prevQuery }: any){
    const params = new URLSearchParams(location.search);
    const name = params.get('q');
    const departure = params.get("depDate");
    const back = params.get("backDate");
    const min = params.get('min');
    const max = params.get('max');
    const c = params.get('c');
    const national = params.get("national");
    const query = {name, category: c, min, max, national, departure, back};
    const newQuery = query === prevQuery;
    const queryUndefined = prevQuery === undefined;
    if ( newQuery || queryUndefined ){
        useEffect(() => { doSearch(query) });
    }
    if (searchResult){
        const results = searchResult.map(
            (ticket: ticket) => 
                <SearchTicket 
                    ticket={ ticket } 
                    key={ticket.id}/>
        )
        return (<div>{ results }</div>)
    }
    return (<div></div>)
}

function mapStateToProps(state: any){
    return {
        searchResult: state.ticket.searchResult,
        prevQuery: state.ticket.prevQuery,
    };
}

function mapDispatchToProps(dispatch: Dispatch){
    return {
        doSearch: (payload: any) => dispatch(search(payload)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)