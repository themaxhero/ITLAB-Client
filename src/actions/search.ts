export function changeSearchQuery(query: string){
    return { type: "SEARCH/CHANGE_QUERY", payload: { query } };
}

export function performSearch(query: string){
    return { type: "SEARCH/PERFORM",
             payload: { query }
    }
}