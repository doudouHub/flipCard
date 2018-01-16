<template>
    <div class="wrapper" :class="preview?'preview':''">
        <!--<v-head></v-head>-->
        <div class="content">
            <v-sidebar></v-sidebar>
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        <v-foot></v-foot>
    </div>
</template>

<script>
    import vFoot from './Footer.vue';
    import vSidebar from './Sidebar.vue';
    import router from '../../router/index';
    import {mapGetters} from 'vuex';

    export default {
        components: {
            vFoot, vSidebar
        },
        data() {
            return {}
        },
        computed: {
            ...mapGetters([
                'preview'
            ])
        },
        mounted() {
            const self = this;

        },
        methods: {}
    }
</script>

<style lang="scss">
    .wrapper {
        .content {
            position      : relative;
            width         : 100%;
            height        : 610px;
            padding-right : 200px;
        }
        &.preview {
            .content {
                padding-right : 0;
                .sidebar {
                    display : none;
                }
            }
        }
    }
</style>
