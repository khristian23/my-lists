<template>
    <div class="app">
        <router-view
            :user="user"
            :footerMessage="footerMessage"
            @synchronize="triggerSynchronization"
            @login="onLogin"
            @logout="onLogout"
            @saveList="onSaveList"
            @saveItem="onSaveItem"
            @deleteList="onDeleteList" />
        <ui5-toast ref="toast">{{toast}}</ui5-toast>
    </div>
</template>

<script>
import '@ui5/webcomponents-base/dist/features/browsersupport/IE11'
import Firebase from 'firebase'
import Firestore from '@/storage/Firestore/firestore' // eslint-disable-line no-unused-vars
import Storage from '@/storage/storage'
import Sync from '@/storage/Sync'
import '@ui5/webcomponents/dist/Toast'

const LOGON_MESSAGE = 'Login successfully'

export default {
    name: 'main-app',
    data () {
        return {
            user: null,
            lists: [],
            toast: '',
            footerMessage: ''
        }
    },
    async created () {
        const user = this.listenToFirebaseUserChanges()
        if (user) {
            // Cached Firebase user found
            this.triggerSynchronization()
        }
    },
    methods: {
        async listenToFirebaseUserChanges () {
            return new Promise(resolve => {
                try {
                    Firebase.auth().onAuthStateChanged(async user => {
                        if (user) {
                            // User was authenticated or is anonymous (isAnonimous = true)
                            // Firebase can pull this info from local IndexedDB is no network found
                            this.user = user
                        } else {
                            // No network found and no local firebase storage
                            this.setAnonymousUser()
                        }
                    })
                } catch (error) {
                    this.setAnonymousUser()
                }
            })
        },
        setAnonymousUser () {
            this.user = Storage.createLocalAnonymousUser()
        },
        showToast (message) {
            this.toast = message
            this.$refs.toast.show()
        },
        onLogin (options) {
            this.showToast(LOGON_MESSAGE)
            this.$router.replace({ name: this.$Const.routes.lists })
            if (options.sync) {
                this.triggerSynchronization()
            }
        },
        onLogout () {
            Firebase.auth().signOut()
                .then(() => {
                    this.$router.replace({ name: this.$Const.routes.lists })
                })
        },
        async triggerSynchronization () {
            const result = await Sync.synchronize()
            if (!result) {
                this.setAnonymousUser()
            } else {
                const currentRoute = this.$router.currentRoute
                this.$router.replace({ name: currentRoute.name, params: currentRoute.params })
            }
        },
        async onSaveList (list) {
            try {
                await Storage.saveList(this.user.uid, list)
                this.showToast('List saved')
                this.$router.replace({ name: this.$Const.routes.lists, params: { id: list.id } })
            } catch (e) {
                alert(e)
            }
        },
        async onSaveItem (item) {
            try {
                const list = await Storage.getList(this.user.uid, item.listId)
                list.syncStatus = this.$Const.changeStatus.changed
                await Storage.saveList(this.user.uid, list)

                const createdItem = await Storage.saveListItem(this.user.uid, item)
                this.showToast('Item saved')
                this.$router.replace({ name: this.$Const.routes.list, params: { id: createdItem.listId } })
            } catch (e) {
                alert(e)
            }
        },
        async onDeleteList (listId) {
            try {
                await Storage.deleteList(this.user.uid, listId)
                this.showToast('List deleted')
            } catch (e) {
                alert(e)
            }
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
