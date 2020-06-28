<template>
    <div class="page">
        <PageHeader title="Profile" backButton="true" />
        <section class="page-content">
            <SimpleForm>
                <FormInput name="name" v-model="name" required="true" disabled="true" />
                <FormInput name="e-mail" v-model="email" required="true" disabled="true" />
            </SimpleForm>
        </section>
        <PageFooter>
            <ui5-button icon="synchronize" @click="$emit('synchronize')">Synchronize</ui5-button>
            <ui5-button design="Emphasized" icon="log" @click="$emit('logout')">Logout</ui5-button>
        </PageFooter>
    </div>
</template>

<script>
import PageHeader from '@/components/TheHeader'
import SimpleForm from '@/components/TheForm'
import PageFooter from '@/components/TheFooter'
import FormInput from '@/components/FormInput'

import '@ui5/webcomponents-icons/dist/icons/log'
import '@ui5/webcomponents-icons/dist/icons/synchronize'

export default {
    name: 'profile',
    props: ['user'],
    data () {
        return {
            name: this.user.displayName,
            email: this.user.email
        }
    },
    components: {
        PageHeader,
        SimpleForm,
        PageFooter,
        FormInput
    }
}
</script>
