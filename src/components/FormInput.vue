<template>
    <div class="formItem">
        <ui5-label :id="name + 'Label'" :for="name + 'Input'" :required="isRequired" show-colon>{{label}}</ui5-label>
        <ui5-input :id="name + 'Input'" :aria-required="isRequired" :aria-labelledby="name + 'Label'" :placeholder="placeholder"
            :value="value" @input="onInput" :required="isRequired" ref="input">
            <div slot="valueStateMessage">{{stateMessage}}</div>
        </ui5-input>
    </div>
</template>

<script>
import '@ui5/webcomponents/dist/Input'
import '@ui5/webcomponents/dist/Label'

export default {
    name: 'form-input',
    props: ['name', 'value', 'placeholder', 'required'],
    data () {
        return {
            stateMessage: ''
        }
    },
    computed: {
        isRequired () {
            return this.required || false
        },
        label () {
            return this.capitalized(this.name)
        }
    },
    methods: {
        capitalized (value) {
            if (typeof value !== 'string') return ''
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
        validate () {
            let input = this.$refs.input
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
