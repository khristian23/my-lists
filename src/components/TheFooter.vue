<template>
    <footer class="page-footer">
        <div v-if="hasSpacerSlot" class="spacer">
            <slot name="spacer"></slot>
        </div>
        <div v-else class="spacer" />
        <slot></slot>
    </footer>
</template>

<script>
export default {
    name: 'the-footer',
    computed: {
        hasSpacerSlot () {
            return !!this.$slots.spacer
        }
    }
}
</script>

<style>
    footer {
        background: white;
        width: 100%;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: stretch;
        border-top: 1px solid #b3b3b3;
    }

    footer .spacer {
        flex-grow: 1;
        margin-left: 4px;
        margin-right: 6px;
    }

    footer .spacer > * {
        width: 100%;
    }

    footer ui5-button {
        flex-shrink: 0;
        margin-left: 6px;
        margin-right: 4px;
    }
</style>
