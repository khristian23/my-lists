<template>
    <draggable tag="ui5-list" v-model="localItems" :component-data="ui5listComponentData" @end="onDrop">
        <ui5-li-custom v-for="(item) in localItems" :key="item.id" :datakey="item.id" class="li-custom">
            <div class="li-content">
                <ui5-button :icon="iconAction" design="Transparent" @click="$emit('itemAction', item.id)" />
                <div class="li-title-wrapper">
                    <div>
                        <ui5-icon class="li-icon" :name="item.icon" v-if="item.icon" />
                        <span :class="getScratchedClass('li-title')">{{item.name}}</span>
                    </div>
                    <span :class="getScratchedClass('li-desc')" v-if="item.description">{{item.description}}</span>
                </div>
                <span class="li-info" v-if="item.items">{{item.items}} items</span>
            </div>
        </ui5-li-custom>
    </draggable>
</template>

<script>
import '@ui5/webcomponents/dist/List'
import '@ui5/webcomponents/dist/CustomListItem'
import draggable from 'vuedraggable'

export default {
    name: 'the-list',
    props: ['header', 'items', 'iconAction', 'scratched'],
    components: {
        draggable
    },
    data () {
        return {
            localItems: [],
            ui5listComponentData: {
                attrs: {
                    mode: 'Delete',
                    'header-text': this.header
                },
                on: {
                    itemClick: this.onItemClick,
                    itemDelete: this.onItemDelete
                }
            }
        }
    },
    watch: {
        items: {
            immediate: true,
            handler () {
                this.localItems = [].concat(this.items).sort((a, b) => {
                    return a.priority - b.priority
                })
            }
        }
    },
    methods: {
        getScratchedClass (baseClass) {
            return this.scratched !== undefined ? baseClass + ' li-scratched' : baseClass
        },
        onDrop () {
            this.localItems.forEach((item, index) => {
                item.priority = index + 1
            })
            this.$emit('orderUpdated', this.localItems)
        },
        onItemClick (event) {
            this.$emit('itemPress', event.detail.item.getAttribute('datakey'))
        },
        onItemDelete (event) {
            let id = event.detail.item.getAttribute('datakey')
            let item = this.items.filter(item => item.id + '' === id)[0]
            this.$emit('itemDelete', item)
        }
    }
}
</script>

<style>
    .li-custom {
        height: 5rem;
    }

    .li-content {
        max-width: 100%;
        min-height: 1px;
        font-family: var(--sapFontFamily);
        display: flex;
        align-items: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex: 1 1 auto;
        overflow: hidden;
    }

    .li-title-wrapper {
        display: flex;
        flex-direction: column;
        min-width: 1px;
        line-height: normal;
        flex: 1 1 auto;
    }

    .li-icon {
        width: 0.75rem;
        height: 0.75rem;
    }

    .li-scratched {
        text-decoration: line-through;
    }

    .li-title {
        color: #32363a;
        font-size: var(--_ui5_list_item_title_size);
        padding-bottom: 0.375rem;
    }

    .li-desc {
        color: #6a6d70;
        font-size: var(--sapFontMediumSize);
    }

    .li-desc, .li-title {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .li-info {
        color: #107e3e;
        font-size: 0.875rem;
        flex-shrink: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0px 0.25rem;
        overflow: hidden;
    }
</style>
