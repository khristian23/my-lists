<template>
    <main>
        <header>
            <ShellBar :title="title" />
            <fd-search-input placeholder="Search" />
        </header>
        <article class="fd-has-clearfix">
            <fd-list-group>
                <fd-list-group-item v-for="(item, i) in list" :key="i">
                    <fd-form-item-checkbox >
                        <fd-checkbox />
                    </fd-form-item-checkbox>
                    {{item.name}}
                    <template #action>
                        <fd-label class="align_bottom_right">1 item</fd-label>
                    </template>
                </fd-list-group-item>
            </fd-list-group>
        </article>
        <footer>
            <fd-action-bar>
                <template #actions>
                    <fd-action-bar-actions v-fd-padding:tiny.right>
                        <fd-button>Delete</fd-button>
                        <fd-button styling="emphasized">Create</fd-button>
                    </fd-action-bar-actions>
                </template>
            </fd-action-bar>
        </footer>
    </main>
</template>

<script>
import ShellBar from '@/components/ShellBar.vue'
import axios from 'axios'

export default {
    name: 'MainApp',
    components: { ShellBar },
    data () {
        return {
            title: 'My Lists',
            list: []
        }
    },
    mounted () {
        axios
            .get('/static/data/mainlist.json')
            .then(response => (this.list = response.data))
    }
}
</script>

<style>
html, body {
    height: 100%;
}
main {
    min-height: 100%;
    padding: 0;
    margin: 0;
    position: relative;
}
main::after {
    content: '';
    display: block;
    height: 65px;
}
footer {
    background: white;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 65px;
}
.fd-shellbar__title {
    display: block;
}
.align_bottom_right {
    width: 100px;
    height: 20px;
    position: absolute;
    right: 5px;
    bottom: 0px;
}
#fd-portal-container {
    display: none;
}
</style>
