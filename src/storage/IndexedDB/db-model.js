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
                'status',
                'modifiedAt',
                'userId'
            ]
        },
        'item': {
            config: {
                autoIncrement: true,
                keyPath: 'id'
            },
            indexes: [
                'listId',
                'name',
                'priority',
                'status',
                'modifiedAt',
                'userId'
            ]
        }
    }
}
