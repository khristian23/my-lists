<template>
    <div class="app">
        <touter-view />
    </div>
</template>

<script>
import '@ui5/webcomponents-base/dist/features/browsersupport/IE11'
import axios from 'axios'

export default {
    name: 'MainApp',
    data () {
        return {
            title: 'My Lists',
            lists: [],
            message: ''
        }
    },
    mounted () {
        axios
            .get('./static/data/mainlist.json')
            .then(response => (this.lists = response.data))
    },
    methods: {
        onDeleteConfirm () {
            this.resolveConfirm()
        },
        onDeleteCancel () {
            this.rejectConfirm()
        },
        confirmDialog (message) {
            var dialog = document.getElementById('confirmationDialog')
            return new Promise((resolve, reject) => {
                this.resolveConfirm = resolve
                this.rejectConfirm = reject
                dialog.open()
            })
        },
        onListPress (listId) {
            alert('Selected Key: ' + listId)
        },
        onListDelete (list) {
            // var itemToDelete = this.lists.reduce((result, item, index) => {
            //     if (item.id + '' === listId) {
            //         result = {
            //             index: index,
            //             item: item
            //         }
            //     }
            //     return result
            // }, {})
            var index = this.lists.indexOf(list)

            this.message = 'Are you sure to delete list ' + list.name + '?'
            var self = this
            var dialog = document.getElementById('confirmationDialog')
            this.confirmDialog().then(() => {
                self.lists.splice(index, 1)
            }).then(() => {
                dialog.close()
            }).catch(() => {
                dialog.close()
            })
        },
        onListEdit (listId) {
            alert('Edit List' + listId)
        }
    }
}
</script>

<style>
    body {
        margin: 0;
    }

    .app {
        height: 100%;
        width: 100%;
    }

    .app-header {
        background: white;
        position: fixed;
        width: 100%;
        top: 0px;
        z-index: 10;
    }

    .main-header {
        color: white;
        background: #3f5161;
        font-family: var(--sapFontFamily);
        padding: 1rem;
        font-weight: bold;
    }

    /* .sub-header {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid #b3b3b3;
        background: white;
    } */

    .app-content {
        padding: 0 1rem;
        overflow-y: auto;
    }

    .app-content::before {
        content: '';
        display: block;
        height: 3rem;
    }

    .app-content::after {
        content: '';
        display: block;
        height: 3rem;
    }

    footer {
        background: white;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        border-top: 1px solid #b3b3b3;
    }
    footer ui5-button {
        margin-left: 6px;
        margin-right: 4px;
    }
</style>
