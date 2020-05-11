<template>
    <div class="page">
        <PageHeader :title="list.name" backButton="true" />
        <section class="page-content">
            <p>The clicked link id: {{this.$route.params.id}}</p>
            <p>The list name is: {{list.name}}</p>
            <TheList header="Pending" :items="items" iconAction="accept"
                @itemPress="onItemPress" @itemAction="onItemDone" @itemDelete="onItemDelete" />
            <TheList header="Done" :items="items" iconAction="repost" v-if="hasDoneItems"
                @itemPress="onItemPress" @itemAction="onItemUndone" @itemDelete="onItemDelete" />
        </section>
        <PageFooter>
            <template #spacer>
                <ui5-input ref="quick" placeholder="Quick create"></ui5-input>
            </template>
            <ui5-button design="Emphasized" :icon="btnIcon" @click="onCreate">{{btnText}}</ui5-button>
        </PageFooter>
    </div>
</template>

<script>
import axios from 'axios'
import '@ui5/webcomponents/dist/Input'
import TheList from '@/components/TheList'
import PageHeader from '@/components/TheHeader'
import PageFooter from '@/components/TheFooter'
import '@ui5/webcomponents-icons/dist/icons/arrow-top'
import '@ui5/webcomponents-icons/dist/icons/accept'
import '@ui5/webcomponents-icons/dist/icons/repost'

var ICON_ADD = 'add'
var ICON_UP = 'arrow-top'
var CREATE = 'Create'
var ADD = 'Add'

export default {
    name: 'list-details',
    components: {
        PageHeader,
        PageFooter,
        TheList
    },
    data () {
        return {
            listId: this.$route.params.id,
            list: {},
            items: [],
            btnIcon: ICON_ADD,
            btnText: CREATE
        }
    },
    created () {
        axios.get('./static/data/mainlist.json').then(response => {
            this.list = response.data.filter(data => data.id == this.listId)[0] // eslint-disable-line eqeqeq
        })
    },
    mounted () {
        this.$refs.quick.addEventListener('focus', () => {
            this.btnIcon = ICON_UP
            this.btnText = ADD
        })
        this.$refs.quick.addEventListener('blur', () => {
            this.btnIcon = ICON_ADD
            this.btnText = CREATE
        })
        this.$refs.quick.addEventListener('keyup', event => {
            if (event.keyCode === 13) {
                event.preventDefault()
                this.onCreate()
            }
        })
    },
    computed: {
        hasDoneItems () {
            return !!this.items.filter(item => item.status === 'Done').length
        }
    },
    methods: {
        onCreate () {
            this.items.push({
                id: this.items.length,
                name: this.$refs.quick.value,
                status: 'Pending'
            })
            this.$refs.quick.value = ''
            this.$refs.quick.focus()
        },
        onItemDone () {

        }
    }
}
</script>
