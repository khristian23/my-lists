<template>
    <div class="page">
        <PageHeader :title="title" />
        <section class="page-content">
            <TheList :items="lists" iconAction="edit"
                @itemPress="onListPress" @itemAction="onListEdit" @itemDelete="onListDelete" />
            <Confirmation id="confirmationDialog" :message="message" @yes="onDeleteConfirm" @no="onDeleteCancel" />
        </section>
        <PageFooter>
            <ui5-button design="Emphasized" icon="add">Create</ui5-button>
        </PageFooter>
    </div>
</template>

<script>
import axios from 'axios'
import '@ui5/webcomponents/dist/Button'

import '@ui5/webcomponents-icons/dist/icons/delete'
import '@ui5/webcomponents-icons/dist/icons/add'
import '@ui5/webcomponents-icons/dist/icons/edit'
import '@ui5/webcomponents-icons/dist/icons/cart'
import '@ui5/webcomponents-icons/dist/icons/favorite-list'
import '@ui5/webcomponents-icons/dist/icons/task'

import TheList from '@/components/TheList'
import Confirmation from '@/components/TheConfirmation'
import PageHeader from '@/components/TheHeader'
import PageFooter from '@/components/TheFooter'

export default {
    name: 'ListManager',
    components: {
        TheList,
        Confirmation,
        PageHeader,
        PageFooter
    },
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
            this.$router.push({ name: 'list', params: { id: listId } })
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
