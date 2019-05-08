import React from "react";
import Button from "react-bootstrap/Button";
import { push } from "connected-react-router";
import { connect } from "react-redux"
import { Dispatch } from 'redux';
import "./index.css"

function Component({ onClick }: any){
    return (
        <div className="Home">
            <h1 className="center">Welcome to the Ticket Store.</h1>
            <Button variant="primary" onClick={ onClick }>
                Create a new Ticket
            </Button>
        </div>
    );
}

function mapDispatchToProps(dispatch: Dispatch){
    return {
        onClick: () => dispatch(push("/new")),
    };
}

export default connect(null, mapDispatchToProps)(Component);