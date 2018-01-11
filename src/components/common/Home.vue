<template>
    <div class="wrapper">
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
    //    import vHead from './Header.vue';
    import vFoot from './Footer.vue';
    import vSidebar from './Sidebar.vue';
    import router from '../../router/index';

    export default {
        components: {
            vFoot, vSidebar
        },
        data() {
            return {}
        },
        mounted() {
            const self = this;

        },
        methods: {}
    }
</script>

<style lang="scss">
    .wrapper {
        margin        : 50px auto;
        width         : 960px;
        height        : 690px;
        border        : 1px solid #ccc;
        border-radius : 5px;
        box-shadow    : 0 0 3px rgba(0, 0, 0, .2);
        .content {
            position      : relative;
            width         : 100%;
            height        : 600px;
            padding-right : 234px;
        }
    }
</style>
