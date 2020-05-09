<template>
    <div class="page">
        <PageHeader :title="list.name" backButton="true" />
        <section class="page-content">
            <p>The clicked link id: {{this.$route.params.id}}</p>
            <p>The list name is: {{list.name}}</p>
        </section>
        <PageFooter>
            <template #spacer>
                <ui5-input placeholder="Quick create"></ui5-input>
            </template>
            <ui5-button design="Emphasized" icon="add">Create</ui5-button>
        </PageFooter>
    </div>
</template>

<script>
import axios from 'axios'
import '@ui5/webcomponents/dist/Input'
import PageHeader from '@/components/TheHeader'
import PageFooter from '@/components/TheFooter'

export default {
    name: 'list-details',
    components: {
        PageHeader,
        PageFooter
    },
    data () {
        return {
            listId: this.$route.params.id,
            list: {}
        }
    },
    created () {
        var that = this
        axios.get('./static/data/mainlist.json').then(response => {
            that.list = response.data.filter(data => data.id == that.listId)[0] // eslint-disable-line eqeqeq
        })
    }
}
</script>
