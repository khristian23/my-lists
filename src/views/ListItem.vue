<template>
    <div class="page">
        <PageHeader :title="title" backButton="true" :user="user" />
        <section class="page-content">
            <SimpleForm>
                <ui5-label id="nameLabel" for="nameInput" required show-colon>Name</ui5-label>
                <ui5-input id="nameInput" aria-required="true" aria-labelledby="nameLabel" placeholder="Enter item name"
                    :value="name" @input="name = $event.target.value" required />
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

import '@ui5/webcomponents-icons/dist/icons/save'
import '@ui5/webcomponents/dist/Input'
import '@ui5/webcomponents/dist/Label'

export default {
    name: 'list-item',
    props: ['user'],
    data () {
        return {
            name: '',
            test: '',
            another: ''
        }
    },
    components: {
        PageHeader,
        PageFooter,
        SimpleForm
    },
    computed: {
        title () {
            return this.name ? this.name : 'New Item'
        }
    },
    methods: {
        onSave () {
            // todo
        }
    }
}
</script>

<style>
</style>
