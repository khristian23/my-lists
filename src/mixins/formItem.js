export const formItem = {
    props: ['name', 'value', 'placeholder', 'required'],
    computed: {
        isRequired () {
            return this.required || false
        },
        label () {
            return this.capitalized(this.name)
        }
    }
}
