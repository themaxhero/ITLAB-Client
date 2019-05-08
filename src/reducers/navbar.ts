import { loop, Cmd } from "redux-loop"

export default function reducer(state: any, { type, payload }: any){
    switch(type){
        default:
            return loop(state, Cmd.none)
    }
}