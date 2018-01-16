import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default  new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            redirect: '/edit',
            component: resolve => require(['../components/common/Home.vue'], resolve),
             children:[
                {
                    path: '/edit',
                    component: resolve => require(['../components/page/EditPanel.vue'], resolve)
                }
            ]
        },
        {
            path: '/play',
            component: resolve => require(['../components/page/playBox.vue'], resolve)
        }
    ]
})
