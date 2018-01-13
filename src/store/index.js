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
    },
    // 预览模式
    preview: false,
    // 当前上传模式
    currUploadMode:'background',
    // 当前主题元素
    currThemeElement: {
        backgroundThumb: './static/img/theme/theme1/bg-thumb.png',
        background: './static/img/theme/theme1/bg.png',
        element: './static/img/theme/theme1/element.png'
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
