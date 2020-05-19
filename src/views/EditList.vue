<template>
    <div class="page">
        <PageHeader :title="title" backButton="true" :user="user" />
        <section class="page-content">
            <SimpleForm ref="form" :error="error">
                <FormInput name="name" v-model="name" placeholder="Enter a name" required="true" />
                <FormInput name="description" v-model="description" placeholder="Enter a description" />
            </SimpleForm>
        </section>
        <PageFooter>
            <ui5-button design="Emphasized" icon="save" @click="onSave">Save</ui5-button>
        </PageFooter>
    </div>
</template>

<script>
import Storage from '@/storage/storage'
import PageHeader from '@/components/TheHeader'
import SimpleForm from '@/components/TheForm'
import PageFooter from '@/components/TheFooter'
import FormInput from '@/components/FormInput'
import '@ui5/webcomponents-icons/dist/icons/save'

export default {
    name: 'add-list',
    props: ['user'],
    data () {
        return {
            name: '',
            description: '',
            error: null
        }
    },
    components: {
        PageHeader,
        SimpleForm,
        PageFooter,
        FormInput
    },
    computed: {
        title () {
            if (this.name) {
                return this.name
            } else if (this.$route.params.id === 'new') {
                return 'Create List'
            } else {
                return 'Edit List'
            }
        }
    },
    methods: {
        async onSave () {
            let list = {
                name: this.name,
                description: this.description
            }

            await Storage.saveList(list)
            this.$refs.form.showToast('List created')
            this.$router.go(-1)
            this.$refs.form.showToast('List created2')
        }
    }
}
</script>
