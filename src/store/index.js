import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import {mutations} from './mutations'

Vue.use(Vuex);

const state = {
    theme: {
        list: [
            {
                id: 1,
                name: '碧海蓝心'
            },
            {
                id: 2,
                name: '湖光山色'
            },
            {
                id: 3,
                name: '光辉岁月'
            },
            {
                id: 4,
                name: '秋天收获'
            }
        ],
        activeId: 1
    }
}

const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});

if (module.hot) {
    module.hot.accept([
        './getters',
        './actions',
        './mutations'
    ], () => {
        store.hotUpdate({
            getters: require('./getters'),
            actions: require('./actions'),
            mutations: require('./mutations').mutations
        })
    })
}

export default store
