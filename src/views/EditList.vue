<template>
    <div class="page">
        <PageHeader :title="title" backButton="true" :user="user" />
        <section class="page-content">
            <SimpleForm ref="form" :error="error">
                <FormInput name="name" v-model="name" placeholder="Enter a name" required="true" />
                <FormInput name="description" v-model="description" placeholder="Enter a description" />
                <FormSelect name="type" v-model="type" @change="onTypeSelection">
                    <ui5-option v-for="theType in $Const.lists.types"
                        :key="theType.id"
                        :icon="theType.icon"
                        :value="theType.id"
                        :selected="theType.id === type">
                        {{theType.name}}
                    </ui5-option>
                </FormSelect>
                <FormSelect name="subtype" v-model="subtype" :disabled="subTypesDisabled">
                    <ui5-option v-for="theSubType in subTypes"
                        :key="theSubType.id"
                        :icon="theSubType.icon"
                        :value="theSubType.id"
                        :selected="theSubType.id === subtype">
                        {{theSubType.name}}
                    </ui5-option>
                </FormSelect>
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
import FormSelect from '@/components/FormSelect'
import '@ui5/webcomponents/dist/Option'
import '@ui5/webcomponents-icons/dist/icons/save'

export default {
    name: 'add-list',
    props: ['user'],
    data () {
        return {
            listId: null,
            name: '',
            description: '',
            type: this.$Const.lists.types[0].id,
            subtype: null,
            subTypes: [],
            error: null,
            fields: ['name', 'description', 'type', 'subtype']
        }
    },
    components: {
        PageHeader,
        SimpleForm,
        PageFooter,
        FormInput,
        FormSelect
    },
    watch: {
        '$route.params.id': {
            immediate: true,
            async handler () {
                if (this.$route.params.id !== 'new') {
                    this.listId = parseInt(this.$route.params.id, 10)
                    const data = await Storage.getList(this.user.uid, this.listId)

                    this.fields.forEach(d => {
                        this[d] = data[d]
                    })
                } else {
                    this.type = this.$Const.lists.types[0].id
                }
                this.onTypeChanged()
            }
        }
    },
    computed: {
        title () {
            if (this.name) {
                return this.name
            } else if (this.$route.params.id === 'new') {
                return 'Create List'
            } else {
                return 'Edit List'
            }
        },
        subTypesDisabled () {
            return !this.subTypes.length
        }
    },
    methods: {
        onTypeSelection () {
            this.subtype = null
            this.onTypeChanged()
        },
        onTypeChanged () {
            this.subTypes = this.$Const.lists.types.filter(t => t.id === this.type)[0].subTypes

            const type = this.$Const.lists.types.filter(t => t.id === this.type)[0]
            if (type.subTypes.length) {
                this.subtype = this.subtype || type.subTypes[0].id
            } else {
                this.subtype = null
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
                const list = {
                    id: this.listId,
                    name: this.name,
                    description: this.description,
                    type: this.type,
                    subtype: this.subtype
                }

                this.$emit('saveList', list)
            }
        }
    }
}
</script>
