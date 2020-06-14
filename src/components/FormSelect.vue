<template>
    <div class="formItem">
        <ui5-label :id="name + 'Label'" :for="name + 'Select'" :required="isRequired" show-colon>{{label}}</ui5-label>
        <ui5-select :id="name + 'Select'" :aria-required="isRequired" :aria-labelledby="name + 'Label'"
            :value="value" @change="onSelectionChange" :disabled="isDisabled">
            <slot></slot>
        </ui5-select>
    </div>
</template>

<script>
import '@ui5/webcomponents/dist/Select'
import '@ui5/webcomponents/dist/Label'
import {formItem} from '@/mixins/formItem'

export default {
    name: 'form-select',
    mixins: [formItem],
    methods: {
        onSelectionChange (event) {
            this.$emit('input', event.target.selectedOption.value)
            this.$emit('change', event.target.selectedOption.value)
        }
    },
    computed: {
        isDisabled () {
            return !!this.disabled
        }
    }
}
</script>
