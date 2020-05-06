<template>
    <ui5-dialog id="confirmation-dialog" header-text="Confirmation">
        <section>{{message}}</section>

        <div slot="footer" class="dialog-footer">
            <ui5-button design="Emphasized" @click="$emit('yes')">Yes</ui5-button>
            <ui5-button design="Transparent" @click="$emit('no')">No</ui5-button>
        </div>
    </ui5-dialog>
</template>

<script>
import '@ui5/webcomponents/dist/Dialog'

export default {
    name: 'Confirmation',
    props: ['message']
}
</script>
