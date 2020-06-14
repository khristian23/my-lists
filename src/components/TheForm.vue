<template>
    <div class="form">
        <ui5-messagestrip type="Negative" v-if="error">{{error}}</ui5-messagestrip>
        <slot></slot>
    </div>
</template>

<script>
import '@ui5/webcomponents/dist/MessageStrip'

export default {
    name: 'the-form',
    props: ['error'],
    methods: {
        validate () {
            return this.$children.reduce((r, c) => {
                return c.validate ? c.validate() && r : true
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
        margin-bottom: 0.5rem;
    }
</style>
