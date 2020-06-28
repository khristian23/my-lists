<template>
    <div class="page">
        <PageHeader title="Login" backButton="true" />
        <section class="page-content">
            <SimpleForm :error="error" ref="form">
                <FormInput name="email" v-model="email" placeholder="Enter an e-mail" />
                <FormInput name="password" v-model="password" placeholder="Enter a password" />
                <hr>
                <p>Or login with:</p>
                <div class="providers">
                    <a @click="onGoogle">
                        <img alt="Google" src="@/assets/google.png" />
                    </a>
                </div>
            </SimpleForm>
            <Confirmation ref="confirmation" />
        </section>
        <PageFooter>
            <ui5-button design="Transparent" @click="onRegister">Register</ui5-button>
            <ui5-button design="Emphasized" @click="onLogin">Log in</ui5-button>
        </PageFooter>
    </div>
</template>

<script>
import PageHeader from '@/components/TheHeader'
import SimpleForm from '@/components/TheForm'
import PageFooter from '@/components/TheFooter'
import FormInput from '@/components/FormInput'
import Confirmation from '@/components/TheConfirmation'
import Firebase from 'firebase'

export default {
    name: 'login',
    components: {
        PageHeader,
        SimpleForm,
        PageFooter,
        FormInput,
        Confirmation
    },
    data () {
        return {
            email: '',
            password: '',
            error: ''
        }
    },
    methods: {
        onRegister () {
            this.$router.replace({ name: 'register' })
        },
        onLogin () {
            try {
                Firebase.auth()
                    .signInWithEmailAndPassword(this.email, this.password)
                    .then(async () => {
                        let sync = await this.getSyncConfirmation()
                        this.$emit('login', { sync: sync })
                    }).catch(err => {
                        this.error = err.message
                    })
            } catch (e) {
                this.error = 'Cannot reach server. Try again later'
            }
        },
        onGoogle () {
            try {
                const provider = new Firebase.auth.GoogleAuthProvider()

                Firebase.auth().signInWithPopup(provider).then(async () => {
                    let sync = await this.getSyncConfirmation()
                    this.$emit('login', { sync: sync })
                }).catch(err => {
                    this.error = err.message
                })
            } catch (e) {
                this.error = 'Cannot reach server. Try again later'
            }
        },
        async getSyncConfirmation () {
            let message = 'Would you like to synchronize locally stored lists?'
            return this.$refs.confirmation.showDialog(message)
        }
    }
}
</script>

<style>
    ui5-messagestrip {
        margin-top: 16px
    }

    .providers {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .providers a {
        cursor: pointer;
    }

    .providers img {
        height: 80px;
        width: 80px;
        flex-shrink: 1;
    }
</style>
