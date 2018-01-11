<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import router from '../../router/index'
    import config from '../../config.js'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        components: {
            vHead, vSidebar
        },
        data() {
            return {
                websocketTimer: null
            }
        },
        computed: mapGetters([
            'user'
        ]),
        mounted() {
            const self = this;

        },
        methods: {}
    }
</script>

<style>

</style>
