<template>
    <div>
        <header class="app-header">
            <div class="main-header">
                <div class="title">{{title}}</div>
            </div>
        </header>
        <section class="app-content">
            <MainList :lists="lists" @itemPress="onListPress" @itemEdit="onListEdit" @itemDelete="onListDelete" />
            <Confirmation id="confirmationDialog" :message="message" @yes="onDeleteConfirm" @no="onDeleteCancel" />
        </section>
        <footer class="app-footer">
            <ui5-button design="Transparent" icon="delete">Remove</ui5-button>
            <ui5-button design="Emphasized" icon="add">Create</ui5-button>
        </footer>
    </div>
</template>

<script>
import '@ui5/webcomponents/dist/Button'

import '@ui5/webcomponents-icons/dist/icons/delete'
import '@ui5/webcomponents-icons/dist/icons/add'

// import MainList from './components/MainList'
// import Confirmation from '/src/components/Confirmation'

export default {
    name: 'ListManager',
    components: {
        // MainList
        // Confirmation
    }
}
</script>
