import { AnyAction, ActionCreator } from "redux";

interface IAction extends AnyAction{
    type: string;
    payload?: any;
}

export type action = IAction;

export function cmdRunOptionsGen(success: Function,
                                 fail: Function,
                                 args: any[] = []){
    return { successActionCreator: success as ActionCreator<action>,
             failActionCreator: fail as ActionCreator<action>,
             args,
    };
}