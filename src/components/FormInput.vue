<template>
    <div class="formItem">
        <ui5-label :id="name + 'Label'" :for="name + 'Input'" :required="isRequired" show-colon>{{ capitalized(name) }}</ui5-label>
        <ui5-input :id="name + 'Input'" :aria-required="isRequired" :aria-labelledby="name + 'Label'" :placeholder="placeholder"
            :value="value" @input="$emit('input', $event.target.value)" :required="isRequired" />
    </div>
</template>

<script>
import '@ui5/webcomponents/dist/Input'
import '@ui5/webcomponents/dist/Label'

export default {
    name: 'form-input',
    props: ['name', 'value', 'placeholder', 'required'],
    computed: {
        isRequired () {
            return this.required || false
        }
    },
    methods: {
        capitalized (value) {
            if (typeof value !== 'string') return ''
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    }
}
</script>
