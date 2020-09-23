<template>
    <div class="page">
        <PageHeader :title="title" backButton="true" :user="user" />
        <section class="page-content">
            <SimpleForm ref="form" :error="error">
                <FormInput name="name" v-model="name" required="true" />
            </SimpleForm>
        </section>
        <PageFooter>
            <ui5-button design="Emphasized" icon="save" @click="onSave">Save</ui5-button>
        </PageFooter>
    </div>
</template>

<script>
import Storage from '@/storage/storage'
import PageHeader from '@/components/TheHeader'
import SimpleForm from '@/components/TheForm'
import PageFooter from '@/components/TheFooter'
import FormInput from '@/components/FormInput'

import '@ui5/webcomponents-icons/dist/icons/save'
import '@ui5/webcomponents/dist/Input'
import '@ui5/webcomponents/dist/Label'

import ListItem from '@/storage/ListItem'

export default {
    name: 'list-item',
    props: ['user'],
    data () {
        return {
            itemId: null,
            listId: null,
            list: null,
            item: null,
            error: null,
            name: '',
            fields: ['name']
        }
    },
    watch: {
        '$route.params.id': {
            immediate: true,
            async handler () {
                await this.initializeView()
            }
        },
        user: {
            immediate: true,
            async handler () {
                await this.initializeView()
            }
        }
    },
    components: {
        PageHeader,
        PageFooter,
        SimpleForm,
        FormInput
    },
    computed: {
        title () {
            return this.name ? this.name : 'New Item'
        }
    },
    methods: {
        async initializeView () {
            if (!this._validateParameters()) {
                return
            }

            await this._loadList()

            if (!this.$route.params.id || this.$route.params.id === 'new') {
                this._loadNewItem()
            } else {
                this._loadExistentItem()
            }
        },
        _validateParameters () {
            if (this.$route.name !== this.$Const.routes.listItem) {
                return false
            }

            if (!this.$route.params.id || !this.$route.params.list || !this.user) {
                return false
            }
            return true
        },
        async _loadList () {
            this.listId = parseInt(this.$route.params.list, 10)
            try {
                this.list = await Storage.getList(this.user.uid, this.listId)
            } catch (error) {
                this.$emit('showError', error.message)
                this.$router.replace({ name: this.$Const.routes.lists })
            }
        },
        _loadNewItem () {
            this.name = ''
        },
        _loadExistentItem () {
            this.itemId = parseInt(this.$route.params.id, 10)

            this.item = this.list.listItems.filter(item => item.id === this.itemId)[0]
            if (this.item) {
                this.fields.forEach(field => {
                    this[field] = this.item[field]
                })
            } else {
                this.$emit('showError', `List Item Id ${this.itemId} not found`)
                this.$router.replace({ 
                    name: this.$Const.routes.listItem, 
                    params: { list: this.listId, id: 'new' }
                })
            }
        },
        validate () {
            this.error = null
            if (!this.$refs.form.validate()) {
                this.error = 'Some fields have invalid entries'
            }
            return !this.error
        },
        _processNewListItem () {
            const listItem = new ListItem({
                id: null,
                listId: this.listId,
                name: this.name
            })
            listItem.flagAsNew()
            this.list.addListItem(listItem)
            this.list.flagAsItemModified()
        },
        _processExistentListItem () {
            this.item.name = this.name
            this.item.listId = this.listId
            this.item.flagAsModified()
            this.list.flagAsItemModified()
        },
        onSave () {
            if (this.validate()) {
                if (!this.item) {
                    this._processNewListItem()
                } else {
                    this._processExistentListItem()
                }
                Storage.saveList(this.user.uid, this.list)
                this.$emit('showToast', 'List Item saved')
                this.$router.replace({ name: this.$Const.routes.listItems, params: { id: this.listId }})
            }
        }
    }
}
</script>

<style>
</style>
