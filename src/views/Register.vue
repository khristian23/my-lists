<template>
    <div class="page">
        <PageHeader title="Register" backButton="true" />
        <section class="page-content">
            <SimpleForm :error="error" ref="form">
                <FormInput name="email" v-model="email" placeholder="Enter an e-mail" required="true" />
                <FormInput name="password" v-model="password" placeholder="Enter a password" required="true" />
                <FormInput name="confirmation" v-model="confirmation" placeholder="Confirm your password" required="true" />
                <p>Or <router-link to="/login">Login</router-link></p>
            </SimpleForm>
        </section>
        <PageFooter>
            <ui5-button design="Emphasized" @click="onRegister">Sign Up</ui5-button>
        </PageFooter>
    </div>
</template>

<script>
import PageHeader from '@/components/TheHeader'
import SimpleForm from '@/components/TheForm'
import PageFooter from '@/components/TheFooter'
import FormInput from '@/components/FormInput'
import Firebase from 'firebase'

export default {
    name: 'register',
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
            confirmation: '',
            error: null
        }
    },
    watch: {
        confirmation () {
            if (this.password !== '' && this.password !== this.confirmation) {
                this.error = 'Passwords must match'
            } else {
                this.error = null
            }
        }
    },
    methods: {
        validate () {
            let messages = ''
            if (this.email.trim() === '') {
                messages += '#E-mail is required'
            }
            if (this.password.trim() === '') {
                messages += '#Password is required'
            }
            if (this.confirmation.trim() === '') {
                messages += '#Confirm your password'
            }
            this.error = messages ? messages.slice(1).replace(/#/g, ' and ') : null
            return !this.error
        },
        onRegister () {
            if (!this.error && this.validate()) {
                Firebase.auth()
                    .createUserWithEmailAndPassword(this.email, this.password)
                    .then(userCredentials => {
                        this.$refs.form.showToast('User registered')
                        this.$router.push({ name: 'list-manager' })
                    }, error => {
                        this.error = error.message
                    })
            }
        }
    }
}
</script>
