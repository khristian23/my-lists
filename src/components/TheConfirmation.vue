<template>
    <ui5-dialog id="confirmation-dialog" header-text="Confirmation">
        <section class="dialog-content">{{message}}</section>

        <div slot="footer" class="dialog-footer">
            <div class="spacer" />
            <ui5-button design="Emphasized" @click="onYes">Yes</ui5-button>
            <ui5-button design="Transparent" @click="onNo">No</ui5-button>
        </div>
    </ui5-dialog>
</template>

<script>
import '@ui5/webcomponents/dist/Dialog'

export default {
    name: 'the-confirmation',
    data () {
        return {
            message: ''
        }
    },
    computed: {
        dialog () {
            return document.getElementById('confirmation-dialog')
        }
    },
    methods: {
        onYes () {
            this.dialog.close()
            this.resolveConfirm(true)
        },
        onNo () {
            this.dialog.close()
            this.resolveConfirm(false)
        },
        showDialog (message) {
            this.message = message
            return new Promise((resolve) => {
                this.resolveConfirm = resolve
                this.dialog.open()
            })
        }
    }
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
