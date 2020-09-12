export default {
    user: {
        anonymous: 'Anonymous'
    },
    lists: {
        types: [{
            id: 'todo',
            name: 'To Do List',
            icon: 'task',
            subTypes: [{
                id: 'personal',
                name: 'Personal'
            }, {
                id: 'work',
                name: 'Work'
            }]
        }, {
            id: 'shop',
            name: 'Shopping List',
            icon: 'cart',
            subTypes: [{
                id: 'groceries',
                name: 'Groceries'
            }, {
                id: 'house',
                name: 'House'
            }]
        }, {
            id: 'wish',
            name: 'Whishlist',
            icon: 'favorite-list',
            subTypes: []
        }]
    },
    itemStatus: {
        done: 'Done',
        pending: 'Pending'
    },
    changeStatus: {
        none: '',
        new: 'N',
        changed: 'C',
        deleted: 'D'
    },
    routes: {
        lists: 'lists',
        list: 'list',
        listItems: 'list-items',
        listItem: 'list-item',
        login: 'login',
        register: 'register',
        profile: 'profile'
    }
}
