<template>
    <div class="formItem">
        <ui5-label :id="name + 'Label'" :for="name + 'Input'" :required="isRequired" show-colon>{{label}}</ui5-label>
        <ui5-input :id="name + 'Input'" :aria-required="isRequired" :aria-labelledby="name + 'Label'" :placeholder="placeholder"
            :value="value" @input="onInput" :required="isRequired" ref="input" :class="name">
            <div slot="valueStateMessage">{{stateMessage}}</div>
        </ui5-input>
    </div>
</template>

<script>
import '@ui5/webcomponents/dist/Input'
import '@ui5/webcomponents/dist/Label'
import { formItem } from '@/mixins/formItem'

export default {
    name: 'form-input',
    mixins: [formItem],
    data () {
        return {
            stateMessage: ''
        }
    },
    methods: {
        validate () {
            const input = this.$refs.input
            if (input.required && input.value === '') {
                input.valueState = 'Error'
                this.stateMessage = this.label + ' is required'
                return false
            }

            input.valueState = 'None'
            return true
        },
        onInput (event) {
            this.validate()
            this.$emit('input', event.target.value)
        }
    }
}
</script>
