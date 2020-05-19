export const model = {

    tables: {
        'list': {
            config: {
                autoIncrement: true,
                keyPath: 'id'
            },
            indexes: [
                'name',
                'description',
                'type',
                'subtype',
                'status'
            ]
        },
        'item': {
            config: {
                autoIncrement: true,
                keyPath: 'id'
            },
            indexes: [
                'listid',
                'name',
                'priority',
                'status'
            ]
        }
    }
}
