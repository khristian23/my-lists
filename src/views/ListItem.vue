<template>
    <div class="page">
        <PageHeader :title="title" backButton="true" :user="user" />
        <section class="page-content">
            <SimpleForm>
                <FormInput name="name" v-model="name" required="true" />
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

import '@ui5/webcomponents-icons/dist/icons/save'
import '@ui5/webcomponents/dist/Input'
import '@ui5/webcomponents/dist/Label'

export default {
    name: 'list-item',
    props: ['user'],
    data () {
        return {
            name: ''
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
        onSave () {
        }
    }
}
</script>

<style>
</style>
