import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { changeSearchQuery, performSearch } from "../../actions/search";

function Component({ doPerformSearch, onChangeSearchQuery, query }: any){
    const onSubmit = (event: any) => {
        event.preventDefault();
        doPerformSearch(query);
    }
    return (<Navbar variant="dark" bg="dark" expand="lg">
            <Navbar.Brand href="/">Feira da Fruta</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Form inline className="ml-auto" onSubmit={ onSubmit }>
                <FormControl
                    type="text"
                    placeholder="Search"
                    value={ query ? query : ""}
                    className="mr-sm-2"
                    onChange={ onChangeSearchQuery }
                />
                <Button
                    className="SearchPage-button"
                    variant="primary"
                    onClick={ onSubmit }
                >
                Search
                </Button>
            </Form>
            </Navbar.Collapse>
            </Navbar>);
}

function mapStateToProps(state: any){
    console.log(state.search);
    return { query: state.search.currentQuery }
}

function mapDispatchToProps(dispatch: Dispatch){
    return {
        onChangeSearchQuery: (e: any) => 
            dispatch(changeSearchQuery(e.target.value)),
        doPerformSearch: (query: string) => 
            dispatch(performSearch(query)),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);