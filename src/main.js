import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import "babel-polyfill";
import store from 'store/index'
import {Tabs, TabPane, Button, Input, Pagination, Row, Col} from 'element-ui'

Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Button);
Vue.use(Input);
Vue.use(Pagination);
Vue.use(Row);
Vue.use(Col);

const vm = new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');

Vue.prototype.$axios = axios;

// 调用C++方法
Vue.prototype.$call_cplus = (cmd, tag, msg) => {
    try {
        if (cef != undefined) {
            console.log("call_cplus, cmd: " + cmd + ", msg:" + msg);
            cef.message.sendMessage(cmd, [msg, tag]);
        }
    } catch (e) {
    }
}

// C++调用js的方法
window.executePdu = (data) => {
    console.log(data);
    data = JSON.parse(data);
    switch (data.sortid) {
        // 获得添加图片数据
        case 'addimg':
            if(!data.data.length) return;
            let currThemeElement = store.state.currThemeElement;
            console.log(currThemeElement);
            switch (store.state.currUploadMode) {
                case 'background':
                    currThemeElement.backgroundThumb = data.data[0];
                    currThemeElement.background = data.data[0];
                    break;
                case 'element':
                    currThemeElement.element = data.data[0];
                    break;
            }
            store.commit('updateCurImgElement', currThemeElement);
            break;
    }
};

// 缓存读取操作
Vue.prototype.$localSave = {
    get: function (key) {
        let data = localStorage.getItem(key);
        try {
            data = JSON.parse(localStorage.getItem(key));
        } catch (err) {
            // console.log(err)
        }
        return data;
    },
    set: function (key, val) {
        val = JSON.stringify(val);
        localStorage.setItem(key, val)
    }
}

// 对象深层复制
Vue.prototype.$deepClone = (data) => {
    let obj = {};
    let originQueue = [data];
    let copyQueue = [obj];
    // 以下两个队列用来保存复制过程中访问过的对象，以此来避免对象环的问题（对象的某个属性值是对象本身）
    let visitQueue = [];
    let copyVisitQueue = [];
    while (originQueue.length > 0) {
        let _data = originQueue.shift();
        let _obj = copyQueue.shift();
        visitQueue.push(_data);
        copyVisitQueue.push(_obj);
        for (let key in _data) {
            let _value = _data[key];
            if (typeof _value !== 'object') {
                _obj[key] = _value;
            } else {
                // 使用indexOf可以发现数组中是否存在相同的对象(实现indexOf的难点就在于对象比较)
                let index = visitQueue.indexOf(_value);
                if (index >= 0) {
                    _obj[key] = copyVisitQueue[index];
                }
                originQueue.push(_value);
                _obj[key] = {};
                copyQueue.push(_obj[key]);
            }
        }
    }
    return obj;
};

// 数组对象排序
Vue.prototype.$sortBy = function (prop) {
    return function (obj1, obj2) {
        let val1 = obj1[prop];
        let val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}
