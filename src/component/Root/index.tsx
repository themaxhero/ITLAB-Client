import React from "react";
import { Store } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter as _, Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { History } from "history";
import Navbar from "../Navbar";
import Home from "../Home";
import Create from "../Create";
import Search from "../Search";
import TicketContainer from "../TicketContainer";

interface IRootProps {
    store: Store,
    history: History,
}

type props = IRootProps;

function Root({ store, history }: props){
    return(
        <Provider store={ store }>
            <Navbar/>
            <ConnectedRouter history={ history }>
                <Switch>
                    <Route path="/" component={ Home } exact/>
                    <Route path="/new" component={ Create }/>
                    <Route path="/editing" component={() => <Create editingMode/>}/>
                    <Route path="/search" component={ Search }/>
                    <Route path="/ticket/:id" component={ TicketContainer }/>
                </Switch>
            </ConnectedRouter>
        </Provider>
    )
}

export default Root;