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

export default {
    name: 'list-item',
    props: ['user'],
    data () {
        return {
            itemId: null,
            listId: null,
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
            if (!this.$route.params.id || !this.user) {
                return
            }

            this.listId = parseInt(this.$route.params.list, 10)

            if (this.$route.params.id !== 'new') {
                this.itemId = parseInt(this.$route.params.id, 10)
                this.item = await Storage.getListItem(this.user.uid, this.listId, this.itemId)
                if (!this.item) {
                    this.$router.replace({ name: this.$Const.routes.list, params: { id: this.listId } })
                } else {
                    this.fields.forEach(d => {
                        this[d] = this.item[d]
                    })
                }
            }
        },
        validate () {
            this.error = null
            if (!this.$refs.form.validate()) {
                this.error = 'Some fields have invalid entries'
            }
            return !this.error
        },
        onSave () {
            if (this.validate()) {
                const listItem = {
                    id: this.itemId,
                    listId: this.listId,
                    name: this.name,
                    syncStatus: this.$Const.changeStatus.changed
                }

                this.$emit('saveItem', listItem)
            }
        }
    }
}
</script>

<style>
</style>
