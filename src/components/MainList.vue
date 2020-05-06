<template>
    <div class="list-wrapper">
        <ui5-list id="master-list" ref="master-list" @itemClick="onItemClick" @itemDelete="onItemDelete" mode="Delete">
            <ui5-li-custom v-for="(list) in lists" :key="list.id" :datakey="list.id" class="li-custom">
                <div class="li-content">
                    <ui5-button icon="edit" design="Transparent" @click="$emit('itemEdit', list.id)"></ui5-button>
                    <div class="li-title-wrapper">
                        <div>
                            <ui5-icon class="li-icon" :name="list.icon"></ui5-icon>
                            <span class="li-title">{{list.name}}</span>
                        </div>
                        <span class="li-desc">{{list.description}}</span>
                    </div>
                    <span class="li-info">{{list.items}} items</span>
                </div>
            </ui5-li-custom>
        </ui5-list>
    </div>
</template>

<script>
import '@ui5/webcomponents/dist/List'
import '@ui5/webcomponents/dist/CustomListItem'

import '@ui5/webcomponents-icons/dist/icons/edit'
import '@ui5/webcomponents-icons/dist/icons/cart'
import '@ui5/webcomponents-icons/dist/icons/favorite-list'
import '@ui5/webcomponents-icons/dist/icons/task'

export default {
    name: 'MainList',
    props: ['lists'],
    methods: {
        onItemClick (event) {
            this.$emit('itemPress', event.detail.item.getAttribute('datakey'))
        },
        onItemDelete (event) {
            let id = event.detail.item.getAttribute('datakey')
            let item = this.lists.filter(item => item.id + '' === id)[0]
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
