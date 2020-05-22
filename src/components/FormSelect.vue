<template>
    <div class="formItem">
        <ui5-label :id="name + 'Label'" :for="name + 'Select'" :required="isRequired" show-colon>{{label}}</ui5-label>
        <ui5-select :id="name + 'Select'" :aria-required="isRequired" :aria-labelledby="name + 'Label'"
            :value="value" @change="$emit('input', $event.target.selectedOption.value)">
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
    mixins: [formItem]
}
</script>
