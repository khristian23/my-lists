<template>
    <header class="page-header">
        <div class="main-header">
            <div v-if="backButton">
                <ui5-button icon="nav-back" design="Transparent" @click="onNavBack" />
            </div>
            <div class="spacer" />
            <div :class="titleClasses">{{title}}</div>
            <div class="spacer" />
            <router-link to="/login" v-if="!isLoggedIn">
                <ui5-avatar icon="employee" size="XS" />
            </router-link>
            <router-link to="/profile" v-if="isLoggedIn">
                <ui5-avatar :initials="initials" size="XS" />
            </router-link>
        </div>
    </header>
</template>

<script>
import '@ui5/webcomponents-icons/dist/icons/nav-back'
import '@ui5/webcomponents-icons/dist/icons/employee'
import '@ui5/webcomponents/dist/Avatar'

export default {
    name: 'the-header',
    props: ['title', 'backButton', 'user'],
    methods: {
        onNavBack () {
            this.$router.go(-1)
        },
        onLogin () {
            this.$router.push({ name: 'login' })
        }
    },
    computed: {
        titleClasses () {
            var classes = 'title'
            if (this.backButton) {
                classes += ' right-spacer'
            }
            return classes
        },
        isLoggedIn () {
            return this.user && !this.user.isAnonymous
        },
        initials () {
            if (this.isLoggedIn) {
                let name = this.user.displayName
                if (!name) {
                    name = this.user.email
                }
                return name.charAt(0).toUpperCase()
            }
            return ''
        }
    }
}
</script>

<style>
    .main-header {
        color: #cae4fb;
        background: #3f5161;
        font-family: var(--sapFontFamily);
        height: 3rem;
        font-weight: bold;
        padding-left: 6px;
        padding-right: 12px;
        display: flex;
        align-items: center;
    }

    .main-header ui5-button {
        color: #cae4fb;
        margin-right: 10px;
        flex-shrink: 0;
        font-size: 1.375rem;
        line-height: 2.375rem;
    }

    .main-header ui5-button:hover {
        background-color: rgba(99,127,153,0.5);
        border-color: transparent;
    }

    .main-header .spacer {
        flex: auto;
    }

    .main-header .right-spacer {
        padding-right: 3rem;
    }

    /* .sub-header {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid #b3b3b3;
        background: white;
    } */

    .user {
        background-color: #286eb4;
        height: 2rem;
        width: 2rem;
        font-size: 0.75rem;
        color: #fff;
        border-radius: 50%;
        outline: none;
    }
</style>
