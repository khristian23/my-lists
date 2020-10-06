<template>
    <div class="page">
        <PageHeader title="Register" backButton="true" />
        <section class="page-content">
            <SimpleForm :error="error" ref="form">
                <FormInput name="name" v-model="name" placeholder="Enter a display name" required="true" />
                <FormInput name="email" v-model="email" placeholder="Enter an e-mail" required="true" />
                <FormInput name="password" v-model="password" placeholder="Enter a password" required="true" />
                <FormInput name="confirmation" v-model="confirmation" placeholder="Confirm your password" required="true" />
            </SimpleForm>
        </section>
        <PageFooter>
            <ui5-button design="Transparent" @click="onLogin">Back to Login</ui5-button>
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
            name: '',
            email: '',
            password: '',
            confirmation: '',
            error: null
        }
    },
    watch: {
        confirmation () {
            this.checkConfirmation()
        }
    },
    methods: {
        onLogin () {
            this.$router.replace({ name: 'login' })
        },
        checkConfirmation () {
            if (this.password !== '' && this.password !== this.confirmation) {
                this.error = 'Passwords must match'
            } else {
                this.error = null
            }
        },
        validate () {
            this.error = null
            if (!this.$refs.form.validate()) {
                this.error = 'Some fields have invalid entries'
            } else {
                this.checkConfirmation()
            }

            return !this.error
        },
        onRegister () {
            if (this.validate()) {
                try {
                    const userCredentials = await this.$auth.createUserWithEmailAndPassword(this.email, this.password)
                    await this.$auth.update(userCredentials, { displayName: this.name })
                    this.$refs.form.showToast('User registered')
                    this.$router.replace({ name: this.$Const.routes.lists })
                } catch (e) {
                    this.error = e.message
                }
            }
        }
    }
}
</script>
