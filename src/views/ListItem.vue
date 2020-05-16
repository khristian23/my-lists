<template>
    <div class="page">
        <PageHeader :title="title" backButton="true" />
        <section class="page-content">
            <div class="form">
                <ui5-label id="nameLabel" for="nameInput" required show-colon>Name</ui5-label>
                <ui5-input id="nameInput" aria-required="true" aria-labelledby="nameLabel" placeholder="Enter item name"
                    :value="name" @input="name = $event.target.value" required />
            </div>
        </section>
        <PageFooter>
            <ui5-button design="Emphasized" icon="save" @click="onSave">Save</ui5-button>
        </PageFooter>
    </div>
</template>

<script>
import PageHeader from '@/components/TheHeader'
import PageFooter from '@/components/TheFooter'

import '@ui5/webcomponents-icons/dist/icons/save'
import '@ui5/webcomponents/dist/Input'
import '@ui5/webcomponents/dist/Label'

export default {
    name: 'list-item',
    data () {
        return {
            name: '',
            test: '',
            another: ''
        }
    },
    components: {
        PageHeader,
        PageFooter
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
    .form {
        display: flex;
        flex-direction: column;
        padding-bottom: 1rem;
    }

    .form > * {
        width: 100%;
    }

    .form > ui5-label {
        margin-top: 1rem;
    }
</style>
