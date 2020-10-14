import Vue from 'vue'
import Firebase from 'firebase'
import Firestore from '@/storage/Firestore/firestore' // eslint-disable-line no-unused-vars
import storage from '@/storage/storage'

let firebaseAuthInstance

const firebaseAuth = () => {
    if (firebaseAuthInstance) {
        return firebaseAuthInstance
    }

    firebaseAuthInstance = new Vue({
        data () {
            return {
                user: null
            }
        },
        async created () {
            await this.listenToFirebaseUserChanges()
        },
        methods: {
            async listenToFirebaseUserChanges () {
                try {
                    Firebase.auth().onAuthStateChanged(this.onAuthStateChanged)
                } catch (error) {
                    this.setAnonymousUser()
                }
            },
            setAnonymousUser () {
                this.user = storage.createLocalAnonymousUser()
            },
            onAuthStateChanged (user) {
                if (user) {
                    // User was authenticated or is anonymous (isAnonimous = true)
                    // Firebase can pull this info from local IndexedDB is no network found
                    this.user = user
                } else {
                    // No network found and no local firebase storage
                    this.setAnonymousUser()
                }
            },
            async signOut () {
                return Firebase.auth().signOut()
            },
            async getRedirectResult () {
                return Firebase.auth().getRedirectResult()
            },
            async login (email, password) {
                return Firebase.auth()
                    .signInWithEmailAndPassword(email, password)
                    .catch(e => {
                        throw Error(e.message)
                    })
            },
            async signInWithGoogleRedirect () {
                const provider = new Firebase.auth.GoogleAuthProvider()
                Firebase.auth().signInWithRedirect(provider)
            },
            async createUserWithEmailAndPassword (email, password) {
                return Firebase.auth()
                    .createUserWithEmailAndPassword(email, password)
            },
            async updateUser (userCredentials, options) {
                return userCredentials.user.updateProfile(options)
            }
        }
    })

    return firebaseAuthInstance
}

export default firebaseAuth
