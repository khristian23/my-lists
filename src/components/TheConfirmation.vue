<template>
    <ui5-dialog id="confirmation-dialog" header-text="Confirmation">
        <section class="dialog-content">{{message}}</section>

        <div slot="footer" class="dialog-footer">
            <div class="spacer" />
            <ui5-button design="Emphasized" @click="$emit('yes')">Yes</ui5-button>
            <ui5-button design="Transparent" @click="$emit('no')">No</ui5-button>
        </div>
    </ui5-dialog>
</template>

<script>
import '@ui5/webcomponents/dist/Dialog'

export default {
    name: 'the-confirmation',
    props: ['message']
}
</script>

<style>
    .dialog-content {
        padding: 1rem;
        color: #32363a;
        font-size: 1rem;
        font-family: var(--sapFontFamily);
    }

    .dialog-footer {
        display: flex;
        align-items: center;
        height: 3rem;
    }

    .dialog-footer .spacer {
        flex-grow: 1;
    }

    .dialog-footer ui5-button {
        margin: 0 6px;
    }
</style>
