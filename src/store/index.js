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
                name: '热气球'
            },
            {
                id: 2,
                name: '舞台电视'
            },
            {
                id: 3,
                name: '天空星球'
            },
            {
                id: 4,
                name: '森林蜜蜂'
            }
        ],
        activeId: 1
    },
    // 当前主题元素
    currThemeElement: {
        backgroundThumb: './static/img/theme/theme1/bg-thumb.jpg',
        background: './static/img/theme/theme1/bg.jpg',
        element: './static/img/theme/theme1/element.png'
    },
    flipCards: {
        title: '',
        list: [
            {
                id: 1,
                posi: {
                    img: '',
                    txt: '',
                    class: 'in'
                },
                oppo: {
                    img: '',
                    txt: '',
                    class: 'out'
                }
            },
            {
                id: 2,
                posi: {
                    img: '',
                    txt: '',
                    class: 'in'
                },
                oppo: {
                    img: '',
                    txt: '',
                    class: 'out'
                }
            }
        ]
    },
    // 预览模式
    preview: false,
    // 当前上传模式 background 背景图片，element 主题元素，cardContent 卡片内容
    currUploadMode: 'background',
    // 当前卡片内容 index 索引，state 正反面，content 内容
    currUploadContent: {
        index: 0,
        state: 'posi',
        content: ''
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
