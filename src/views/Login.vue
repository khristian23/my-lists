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
    async created () {
        const result = await this.$auth.getRedirectResult()

        if (result.user) {
            const sync = await this.getSyncConfirmation()
            this.$emit('login', { sync: sync })
        }
    },
    methods: {
        onRegister () {
            this.$router.replace({ name: 'register' })
        },
        async onLogin () {
            try {
                await this.$auth.login(this.email, this.password)
                const sync = await this.getSyncConfirmation()
                this.$emit('login', { sync: sync })
            } catch (e) {
                this.error = e.message
            }
        },
        onGoogle () {
            try {
                this.$auth.signInWithGoogleRedirect()
            } catch (e) {
                this.error = e.message
            }
        },
        async getSyncConfirmation () {
            const message = 'Would you like to synchronize locally stored lists?'
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
