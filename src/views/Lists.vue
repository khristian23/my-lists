<template>
    <div class="page">
        <PageHeader :title="title" :user="user" />
        <section class="page-content">
            <TheList :items="lists" iconAction="edit" class="lists"
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
    name: 'lists',
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
            immediate: true,
            async handler () {
                if (this.user) {
                    await this.getCurrentUserLists()
                }
            }
        }
    },
    methods: {
        async getCurrentUserLists () {
            const unsortedlists = await Storage.getLists(this.user.uid) || []
            this.lists = unsortedlists.sort((a, b) => a.name.localeCompare(b.name))
        },
        onListPress (listId) {
            this.$router.push({ name: this.$Const.routes.listItems, params: { id: listId } })
        },
        _getListIndexById (listId) {
            for (let i = 0; i < this.lists.length; i++) {
                if (this.lists[i].id === listId) {
                    return i
                }
            }
            throw Error(`List Id: ${listId} is not found`)
        },
        async onListDelete (listId) {
            const index = this._getListIndexById(listId)
            const list = this.lists[index]

            const message = 'Are you sure to delete list "' + list.name + '"?'
            const confirmationAnswer = await this.$refs.confirmation.showDialog(message)
            if (confirmationAnswer) {
                this.lists.splice(index, 1)
                if (list.firebaseId) {
                    list.flagAsDeleted()
                    await Storage.saveList(this.user.uid, list)
                } else {
                    await Storage.deleteList(this.user.uid, list.id)
                }
                this.$emit('showToast', 'List deleted')
            }
        },
        onListEdit (listId) {
            this.$router.push({ name: this.$Const.routes.list, params: { id: listId } })
        },
        onCreate () {
            this.$router.push({ name: this.$Const.routes.list, params: { id: 'new' } })
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
