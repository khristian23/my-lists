<template>
    <div class="page">
        <PageHeader :title="title" backButton="true" :user="user" />
        <section class="page-content">
            <h4 v-if="noItems">No data found</h4>
            <TheList header="Pending" :items="pendingItems" iconAction="accept" v-if="hasPendingItems"
                @itemPress="onItemPress" @itemAction="onItemDone" @itemDelete="onItemDelete"
                @orderUpdated="onOrderUpdated" />
            <TheList header="Done" :items="doneItems" iconAction="repost" v-if="hasDoneItems" scratched
                @itemPress="onItemPress" @itemAction="onItemUndone" @itemDelete="onItemDelete" />
        </section>
        <PageFooter>
            <template #spacer>
                <ui5-input ref="quick" placeholder="Quick create"></ui5-input>
            </template>
            <ui5-button design="Emphasized" icon="add" @click="onCreate" v-if="showCreateButton">Create</ui5-button>
        </PageFooter>
    </div>
</template>

<script>
import Storage from '@/storage/storage'
import ListItem from '@/storage/ListItem'
import '@ui5/webcomponents/dist/Input'

import TheList from '@/components/TheList'
import PageHeader from '@/components/TheHeader'
import PageFooter from '@/components/TheFooter'

import '@ui5/webcomponents-icons/dist/icons/accept'
import '@ui5/webcomponents-icons/dist/icons/repost'

const ENTER_KEY = 13

export default {
    name: 'list-details',
    props: ['user'],
    components: {
        PageHeader,
        PageFooter,
        TheList
    },
    data () {
        return {
            listId: null,
            list: {},
            items: [],
            showCreateButton: true
        }
    },
    watch: {
        '$route.params.id': {
            immediate: true,
            handler () {
                this._intializeListItems()
            }
        },
        user: {
            immediate: true,
            handler () {
                this._intializeListItems()
            }
        }
    },
    mounted () {
        this.hookQuickCreateListeners()
    },
    computed: {
        title () {
            return this.list.name || 'List not found'
        },
        noItems () {
            return !(this.hasPendingItems || this.hasDoneItems)
        },
        hasPendingItems () {
            return !!this.pendingItems.length
        },
        hasDoneItems () {
            return !!this.doneItems.length
        },
        pendingItems () {
            return this.items.filter(item => item.status === this.$Const.itemStatus.pending &&
                item.syncStatus !== this.$Const.changeStatus.deleted)
        },
        doneItems () {
            return this.items.filter(item => item.status === this.$Const.itemStatus.done &&
                item.syncStatus !== this.$Const.changeStatus.deleted)
        }
    },
    methods: {
        async _intializeListItems () {
            if (this.$route.name !== this.$Const.routes.listItems) {
                return
            }

            this.listId = parseInt(this.$route.params.id, 10)
            if (Number.isNaN(this.listId) || !this.user) {
                return
            }

            try {
                this.list = await Storage.getList(this.user.uid, this.listId)
            } catch (error) {
                this.$emit('showError', error.message)
                this.$router.replace({ name: this.$Const.routes.lists })
            }

            this.items = this.list.listItems || []
        },
        hookQuickCreateListeners () {
            this.$refs.quick.addEventListener('focus', () => {
                this.showCreateButton = false
            })
            this.$refs.quick.addEventListener('blur', (event) => {
                this.$refs.quick.value = ''
                this.showCreateButton = true
            })
            this.$refs.quick.addEventListener('keyup', event => {
                if (event.keyCode === ENTER_KEY) {
                    event.preventDefault()
                    this.onTriggerQuickCreate(this.$refs.quick.value)
                    this.$refs.quick.value = ''
                    this.$refs.quick.focus()
                }
            })
        },
        onTriggerQuickCreate (name) {
            const listItem = new ListItem({
                name: name,
                status: this.$Const.itemStatus.pending,
                listId: this.listId,
                syncStatus: this.$Const.changeStatus.new,
                modifiedAt: new Date().getTime()
            })
            this.items.push(listItem)
            this._saveList()
        },
        onCreate () {
            this.$router.push({ name: this.$Const.routes.listItem, params: { list: this.listId, id: 'new' } })
        },
        onItemPress (itemId) {
            this.$router.push({ name: this.$Const.routes.listItem, params: { list: this.listId, id: itemId } })
        },
        _getListItemById (itemId) {
            const idToFind = parseInt(itemId, 10)
            return this.items.filter(item => item.id === idToFind)[0]
        },
        onItemDone (itemId) {
            const changedItem = this._getListItemById(itemId)
            changedItem.status = this.$Const.itemStatus.done
            changedItem.flagAsModified()
            this._saveList()
        },
        onItemUndone (itemId) {
            const changedItem = this._getListItemById(itemId)
            changedItem.status = this.$Const.itemStatus.pending
            changedItem.flagAsModified()
            this._saveList()
        },
        onItemDelete (itemId) {
            const changedItem = this._getListItemById(itemId)
            changedItem.flagAsDeleted()
            this._saveList()
        },
        onOrderUpdated (listItems) {
            this.items = listItems
            this.items.forEach(item => {
                item.flagAsModified()
            })
            this._saveList()
        },
        _collectListItems () {
            this.list.listItems = this.items
        },
        async _saveList () {
            this._collectListItems()
            this.list.flagAsModified()
            await Storage.saveList(this.user.uid, this.list)
        }
    }
}
</script>
