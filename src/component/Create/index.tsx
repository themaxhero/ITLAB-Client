import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import "./index.css";
import { state, submitableTicket, compareExistingWithDraft } from '../../types/state';
import { Dispatch } from 'redux';
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import {creatingTicketDestinyChange,
        creatingTicketPrice,
        creatingTicketOrigin,
        creatingTicketDeparture,
        creatingTicketBack,
        creatingTicketKind,
        creatingTicketSubmit,
        updatingTicketSubmit,
} from "../../actions/ticket";

function Component({editingMode,
                    ticket,
                    editingId,
                    currentTicket,
                    onChangeDestiny,
                    onChangePrice,
                    onToggleInternational,
                    onToggleNational,
                    onChangeDeparture,
                    onChangeCategory,
                    onSubmitNewTicket,
                    onSubmitTicketUpdate,
                    onChangeBack,
                   }: any){
    const onSubmitCreate = () => onSubmitNewTicket();
    const onSubmitUpdate = () => onSubmitTicketUpdate();
    const onSubmit = editingMode && editingId ? onSubmitUpdate : onSubmitCreate;
    const current = currentTicket;
    const date = ticket.departure ? ticket.departure : "";
    const cantSubmit = editingMode ? 
        !submitableTicket(ticket)
        && compareExistingWithDraft(current, ticket)
        : !submitableTicket(ticket);
    return (
        <div className="TicketCreationContainer">
            <div className="dialog-topbar bg-dark text-white rounded-top">
                { editingMode ? 
                  "Editing a Ticket" 
                  : "Create a new Ticket"
                }
            </div>
            <Form className="TicketForm bg-light" placeholder="Category">
                <label>
                    Name:<br/> 
                    <FormControl
                        placeholder="Name"
                        value={ ticket.name }
                        onChange={ onChangeDestiny }/>
                    <br/>
                </label>
                <br/>
                <label>
                    Category: <br/>
                    <Dropdown>
                        <Dropdown.Toggle 
                            variant="outline-primary" 
                            id="dropdown-basic">
                            { ticket.category ? ticket.category : "Category" }
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item 
                                onClick={() => onChangeCategory("FRUIT")}>
                                FRUIT
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => onChangeCategory("VEGETABLE")}>
                                VEGETABLE
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <br/>
                </label>
                <br/>
                <label>
                    Price:<br/>
                    <FormControl 
                        placeholder="Price"
                        type="number"
                        value={ String(ticket.price) }
                        onChange={ onChangePrice }
                        min="1"
                        step="0.01"
                        data-number-to-fixed="2"
                        data-number-stepfactor="100"
                    />
                    <br/>
                </label>
                <br/>
                <label>
                    Origin:<br/>
                    <Form.Check inline 
                                label="National"
                                type="radio"
                                onChange={ onToggleInternational }
                                checked={ticket.national}
                                id={`inline-radio-1`}
                    />
                    <Form.Check inline 
                                label="international"
                                type="radio"
                                onChange={ onToggleNational }
                                checked={!ticket.national}
                                id={`inline-radio-2`}
                    />
                </label>
                <br/>
                <br/>
                <label>
                    Departure:<br/> 
                    <FormControl 
                        placeholder="Expiration Date"
                        value={ date }
                        onChange={ onChangeDeparture }
                        alt="Format: YYYY-MM"/>
                </label>
                <br/>
                <label>
                    Back:<br/> 
                    <FormControl 
                        placeholder="Expiration Date"
                        value={ date }
                        onChange={ onChangeBack }
                        alt="Format: YYYY-MM"/>
                </label>
                <br/>
                <div className="submitButtonContainer">
                    <Button onClick={onSubmit} 
                            disabled={cantSubmit}>
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
}

function mapStateToProps(state: state){
    return { 
        Ticket: state.ticket.creatingTicket,
        currentTicket: state.ticket.currentTicket,
        editingId: state.ticket.editingId,
    };
}

function mapDispatchToProps(dispatch: Dispatch){
    return {
        onChangeDestiny: (e: any) => 
            dispatch(creatingTicketDestinyChange(e.target.value)),
        onChangePrice: (e: any) => {
            dispatch(creatingTicketPrice(e.target.value))
        },
        onToggleInternational: (e: any) => 
            dispatch(creatingTicketOrigin(e.target.value)),
        onToggleNational: (e: any) => {
            const value = (e.target.value === "on") ? "off" : "on";
            dispatch(creatingTicketOrigin(value));
        },
        onChangeDeparture: (e: any) => 
            dispatch(creatingTicketDeparture(e.target.value)),
        onChangeBack: (e: any) => 
            dispatch(creatingTicketBack(e.target.value)),
        onChangeCategory: (value: string) => 
            dispatch(creatingTicketKind(value)),
        onSubmitNewTicket: () => dispatch(creatingTicketSubmit()),
        onSubmitTicketUpdate: () => dispatch(updatingTicketSubmit()),

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);