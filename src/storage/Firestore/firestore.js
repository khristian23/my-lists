import firebase from 'firebase'

var firebaseConfig = {
    apiKey: 'AIzaSyDQ0HJ1ZdKFacEdnEgxBTXXM9XMMWTOxew',
    authDomain: 'my-lists-sync.firebaseapp.com',
    databaseURL: 'https://my-lists-sync.firebaseio.com',
    projectId: 'my-lists-sync',
    storageBucket: 'my-lists-sync.appspot.com',
    messagingSenderId: '1024075195955',
    appId: '1:1024075195955:web:2eee0d269a1c955a5e6546'
}

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)

export default firebaseApp.firestore()
