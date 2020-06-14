<template>
    <div class="app">
        <router-view
            :user="user"
            @logout="onLogout"
            @saveList="onSaveList"
            @addListItem="onAddListItem" />
        <ui5-toast ref="toast">{{toast}}</ui5-toast>
    </div>
</template>

<script>
import '@ui5/webcomponents-base/dist/features/browsersupport/IE11'
import Firebase from 'firebase'
import Storage from '@/storage/storage'
import '@ui5/webcomponents/dist/Toast'

export default {
    name: 'main-app',
    data () {
        return {
            user: null,
            lists: [],
            toast: ''
        }
    },
    async created () {
        try {
            Firebase.auth().signInAnonymously()
            Firebase.auth().onAuthStateChanged(async user => {
                if (user) {
                    // User was authenticated or anonymous (isAnonimous = true)
                    // Firebase can pull this info from local IndexedDB is no network found
                    this.user = user
                } else {
                    // No network found and no local firebase storage
                    this.user = Storage.createLocalAnonymousUser()
                }
            })
        } catch (error) {
            this.user = Storage.createLocalAnonymousUser()
        }
    },
    methods: {
        showToast (message) {
            this.toast = message
            this.$refs.toast.show()
        },
        onLogout () {
            Firebase.auth().signOut()
                .then(() => {
                    this.user = null
                    this.$router.replace('list-manager')
                })
        },
        async onSaveList (list) {
            await Storage.saveList(this.user.uid, list)
            this.showToast('List saved')
            this.$router.replace({ name: 'list-manager' })
        },
        async onAddListItem (listItem) {
            await Storage.addListItem(this.user.uid, listItem)
            this.showToast('List item saved')
        }
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
