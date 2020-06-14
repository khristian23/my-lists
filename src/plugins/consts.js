let Constants = {
    install (Vue, options) {
        Vue.prototype.$Const = {
            lists: {
                types: [{
                    id: 'todo',
                    name: 'To Do List',
                    icon: 'task',
                    subTypes: [{
                        id: 'house',
                        name: 'House'
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
            }
        }
    }
}

export default Constants
