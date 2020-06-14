<template>
    <div class="page">
        <PageHeader :title="title" backButton="true" :user="user" />
        <section class="page-content">
            <SimpleForm ref="form" :error="error">
                <FormInput name="name" v-model="name" placeholder="Enter a name" required="true" />
                <FormInput name="description" v-model="description" placeholder="Enter a description" />
                <FormSelect name="type" v-model="type">
                    <ui5-option v-for="(type) in $Const.lists.types" :key="type.id" :icon="type.icon" :value="type.id">{{type.name}}</ui5-option>
                </FormSelect>
                <FormSelect name="subtype" v-model="subtype" :disabled="subTypesDisabled">
                    <ui5-option v-for="(subType) in subTypes" :key="subType.id" :icon="subType.icon" :value="subType.id">{{subType.name}}</ui5-option>
                </FormSelect>
            </SimpleForm>
        </section>
        <PageFooter>
            <ui5-button design="Emphasized" icon="save" @click="onSave">Save</ui5-button>
        </PageFooter>
    </div>
</template>

<script>
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
            name: '',
            description: '',
            type: this.$Const.lists.types[0].id,
            subtype: '',
            error: null
        }
    },
    components: {
        PageHeader,
        SimpleForm,
        PageFooter,
        FormInput,
        FormSelect
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
        subTypes () {
            return this.$Const.lists.types.filter(t => t.id === this.type)[0].subTypes
        },
        subTypesDisabled () {
            return !this.subTypes.length
        }
    },
    watch: {
        type (selection) {
            this.subtype = this.$Const.lists.types
                .filter(t => t.id === selection)[0]
                .subTypes[0].id
        }
    },
    methods: {
        async onSave () {
            let list = {
                name: this.name,
                description: this.description,
                type: this.type,
                subType: this.subtype
            }
            this.$emit('saveList', list)
        }
    }
}
</script>
