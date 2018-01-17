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
            vSidebar, vFoot
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
            // 获取题目信息
            this.$call_cplus('micro.cotroler', 'getdata', '');
            if (this.$getQueryString('isplay')) {
                this.$router.push('/play');
            }
            console.log(this.$getBrowser(), '浏览器内核');
        },
        methods: {}
    }
</script>

<style lang="scss">
    .wrapper {
        overflow : hidden;
        .content {
            position       : relative;
            padding-right  : 200px;
            margin-bottom  : -60px;
            padding-bottom : 60px;
            transition     : padding .2s linear, margin .2s linear;
        }
        &.preview {
            .content {
                padding-right  : 0;
                padding-bottom : 0;
                margin-bottom  : 0;
            }
            .sidebar {
                -webkit-transform : translate3d(100%, 0, 0);
                transform         : translate3d(100%, 0, 0);
            }
            .footer {
                -webkit-transform : translate3d(0, 100%, 0);
                transform         : translate3d(0, 100%, 0);
            }
        }
    }
</style>
