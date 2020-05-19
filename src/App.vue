<template>
    <div class="app">
        <router-view :user="user" />
    </div>
</template>

<script>
import '@ui5/webcomponents-base/dist/features/browsersupport/IE11'
import Firebase from 'firebase'

export default {
    name: 'main-app',
    data () {
        return {
            user: null
        }
    },
    mounted () {
        Firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.user = user.email
            }
        })
    }
}
</script>

<style>
    body {
        margin: 0;
    }

    .app {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        font-size: 1rem;
        font-family: var(--sapFontFamily);
    }

    .page {
        display: flex;
        flex-direction: column;
        height: 100%;
        position: absolute;
        z-index: 0;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: hidden auto;
    }

    .page-header {
        background: white;
        width: 100%;
        z-index: 1;
        vertical-align: top;
        position: relative;
    }

    .page-content {
        position: relative;
        padding: 0 1rem;
        margin-top: 0;
        flex-grow: 1;
        overflow-y: auto;
    }

    .page-footer {
        flex-shrink: 0;
    }
</style>
