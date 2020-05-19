<template>
    <div class="page">
        <PageHeader title="Login" backButton="true" />
        <section class="page-content">
            <SimpleForm :error="error" ref="form">
                <FormInput name="email" v-model="email" placeholder="Enter an e-mail" />
                <FormInput name="password" v-model="password" placeholder="Enter a password" />
                <hr />
                <p>Or login with:</p>
                <div class="providers">
                    <a @click="onGoogle">
                        <img alt="Google" src="@/assets/google.png" />
                    </a>
                </div>
                <hr />
                <p>No account, then <router-link to="/register">Register</router-link></p>
            </SimpleForm>
        </section>
        <PageFooter>
            <ui5-button design="Emphasized" @click="onLogin">Log in</ui5-button>
        </PageFooter>
    </div>
</template>

<script>
import PageHeader from '@/components/TheHeader'
import SimpleForm from '@/components/TheForm'
import PageFooter from '@/components/TheFooter'
import FormInput from '@/components/FormInput'
import Firebase from 'firebase'

const LOGON_MESSAGE = 'Login successfully'

export default {
    name: 'login',
    components: {
        PageHeader,
        SimpleForm,
        PageFooter,
        FormInput
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
            this.$router.push({ name: 'register' })
        },
        onLogin () {
            Firebase.auth()
                .signInWithEmailAndPassword(this.email, this.password)
                .then(user => {
                    this.$refs.form.showToast(LOGON_MESSAGE)
                    this.$router.go(-1)
                }).catch(err => {
                    this.error = err.message
                })
        },
        onGoogle () {
            const provider = new Firebase.auth.GoogleAuthProvider()

            Firebase.auth().signInWithPopup(provider).then(result => {
                this.$refs.form.showToast(LOGON_MESSAGE)
                this.$router.go(-1)
            }).catch(err => {
                this.error = err.message
            })
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
