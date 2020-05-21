<template>
    <div class="form">
        <ui5-messagestrip type="Negative" v-if="error">{{error}}</ui5-messagestrip>
        <slot></slot>
        <ui5-toast ref="toast">{{toast}}</ui5-toast>
    </div>
</template>

<script>
import '@ui5/webcomponents/dist/MessageStrip'
import '@ui5/webcomponents/dist/Toast'

export default {
    name: 'the-form',
    props: ['error'],
    data () {
        return {
            toast: ''
        }
    },
    methods: {
        showToast (message) {
            this.toast = message
            this.$refs.toast.show()
        },
        validate () {
            return this.$children.reduce((r, c) => {
                return c.validate() && r
            }, true)
        }
    }
}
</script>

<style>
    .form {
        display: flex;
        flex-direction: column;
        padding-bottom: 1rem;
        width: 100%;
    }

    .form ui5-messagestrip {
        margin-top: 16px
    }

    .form .formItem {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .form .formItem > * {
        width: 100%;
    }

    .form .formItem > ui5-label {
        margin-top: 1rem;
    }
</style>
