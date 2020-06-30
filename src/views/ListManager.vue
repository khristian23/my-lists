<template>
    <div class="page">
        <PageHeader :title="title" :user="user" />
        <section class="page-content">
            <TheList :items="lists" iconAction="edit"
                @itemPress="onListPress" @itemAction="onListEdit" @itemDelete="onListDelete"
                @orderUpdated="onOrderUpdated" />
            <Confirmation ref="confirmation" />
       </section>
        <PageFooter>
            <ui5-button design="Emphasized" icon="add" @click="onCreate">Create</ui5-button>
        </PageFooter>
    </div>
</template>

<script>
import Storage from '@/storage/storage'
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
    props: ['user'],
    components: {
        TheList,
        Confirmation,
        PageHeader,
        PageFooter
    },
    data () {
        return {
            title: 'My Lists',
            lists: []
        }
    },
    watch: {
        user: {
            handler () {
                if (this.user) {
                    this.getCurrentUserLists()
                }
            },
            immediate: true
        }
    },
    methods: {
        async getCurrentUserLists () {
            let unsortedlists = await Storage.getLists(this.user.uid)
            this.lists = unsortedlists.sort((a, b) => a.name.localeCompare(b.name))
        },
        onListPress (listId) {
            this.$router.push({ name: 'list', params: { id: listId } })
        },
        async onListDelete (list) {
            var index = this.lists.indexOf(list)

            let message = 'Are you sure to delete list "' + list.name + '"?'
            let confirmationAnswer = await this.$refs.confirmation.showDialog(message)
            if (confirmationAnswer) {
                this.lists.splice(index, 1)
                this.$emit('deleteList', list.id)
            }
        },
        onListEdit (listId) {
            this.$router.push({ name: 'editList', params: { id: listId } })
        },
        onCreate () {
            this.$router.push({ name: 'editList', params: { id: 'new' } })
        },
        onOrderUpdated (lists) {
            try {
                Storage.saveLists(this.user.uid, lists)
            } catch (e) {
                alert(e)
            }
        }
    }
}
</script>
