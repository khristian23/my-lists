export const formItem = {
    props: ['name', 'value', 'placeholder', 'required', 'disabled'],
    computed: {
        isRequired () {
            return this.required || false
        },
        label () {
            return this.capitalized(this.name)
        }
    }
}
