const defaultState = {user: '', statistics: '', total: '', name: '', quantity: ''};

export function initReducer(state = defaultState, action) {
    switch (action.type) {
        case 'statistics user':
            return {...state, user: action.payload};
        case 'init statistics':
            return {...state, statistics: action.payload};
        case 'init total':
            return {...state, total: action.payload};
        case 'name':
            return {...state, name: action.payload};
        case 'init users':
            return {...state, quantity: action.payload};
        default:
            return state;
    }
}