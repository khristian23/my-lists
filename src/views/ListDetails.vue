<template>
    <div class="page">
        <PageHeader :title="list.name" backButton="true" :user="user" />
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
import '@ui5/webcomponents/dist/Input'

import TheList from '@/components/TheList'
import PageHeader from '@/components/TheHeader'
import PageFooter from '@/components/TheFooter'

import '@ui5/webcomponents-icons/dist/icons/accept'
import '@ui5/webcomponents-icons/dist/icons/repost'

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
            listId: parseInt(this.$route.params.id, 10),
            list: {},
            items: [],
            showCreateButton: true
        }
    },
    watch: {
        listId: {
            immediate: true,
            async handler () {
                this.list = await Storage.getList(this.user.uid, this.listId)
                if (this.list) {
                    this.loadListItems()
                } else {
                    this.$router.replace({ name: this.$Const.routes.lists })
                }
            }
        }
    },
    mounted () {
        this.hookListeners()
    },
    computed: {
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
            return this.items.filter(item => item.status === 'Pending')
        },
        doneItems () {
            return this.items.filter(item => item.status === 'Done')
        }
    },
    methods: {
        hookListeners () {
            this.$refs.quick.addEventListener('focus', () => {
                this.showCreateButton = false
            })
            this.$refs.quick.addEventListener('blur', (event) => {
                this.$refs.quick.value = ''
                this.showCreateButton = true
            })
            this.$refs.quick.addEventListener('keyup', event => {
                if (event.keyCode === 13) {
                    event.preventDefault()
                    this.onQuickCreate()
                }
            })
        },
        async loadListItems () {
            this.items = await Storage.getListItems(this.user.uid, this.listId)
        },
        onQuickCreate () {
            const listItem = {
                name: this.$refs.quick.value,
                status: 'Pending',
                listId: this.listId
            }
            this.$refs.quick.value = ''
            this.$refs.quick.focus()
            this.saveListItem(listItem)
        },
        onCreate () {
            this.$router.push({ name: 'item', params: { list: this.listId, id: 'new' } })
        },
        onItemPress (itemId) {
            this.$router.push({ name: 'item', params: { list: this.listId, id: itemId } })
        },
        onItemDone (itemId) {
            const listItem = {
                id: itemId,
                status: 'Done'
            }
            this.saveListItem(listItem)
        },
        onItemUndone (itemId) {
            const listItem = {
                id: itemId,
                status: 'Pending'
            }
            this.saveListItem(listItem)
        },
        onItemDelete () {

        },
        onOrderUpdated (listItems) {
            try {
                Storage.saveListItems(this.user.uid, listItems)
                this.flagListAsChanged()
            } catch (e) {
                alert(e)
            }
        },
        async flagListAsChanged () {
            const list = await Storage.getList(this.user.uid, this.listId)
            list.syncStatus = this.$Const.status.changed
            await Storage.saveList(this.user.uid, list)
        },
        async saveListItem (listItem) {
            await this.flagListAsChanged()
            listItem.syncStatus = this.$Const.status.changed
            await Storage.saveListItem(this.user.uid, listItem)
            this.loadListItems()
        }
    }
}
</script>
