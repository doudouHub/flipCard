import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import uuid from 'uuid/v1';
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
Vue.prototype.$uuid = uuid;

// 调用C++方法
Vue.prototype.$call_cplus = (cmd, tag, msg) => {
    console.log("call_cplus, cmd: " + cmd + ", msg:" + msg);
    try {
        cef.message.sendMessage(cmd, [msg, tag]);
    } catch (e) {
    }
}

// C++调用js的方法
window.executePdu = (data) => {
    console.log(data, '获得返回数据');
    data = JSON.parse(data);
    switch (data.sortid) {
        // 获得添加图片数据
        case 'addimg':
            if (!data.data.length) return;
            let currThemeElement = store.state.currThemeElement;
            // console.log(currThemeElement);
            switch (store.state.currUploadMode) {
                case 'background':
                    currThemeElement.backgroundThumb = data.data[0];
                    currThemeElement.background = data.data[0];
                    break;
                case 'element':
                    currThemeElement.element = data.data[0];
                    break;
                case 'cardContent':
                    // 卡片内容
                    let currUploadContent = store.state.currUploadContent;

                    store.commit('updateFlipCards', {
                        type: 'putImg',
                        index: currUploadContent.index,
                        state: currUploadContent.state,
                        data: data.data[0]
                    });
                    return;
            }
            store.commit('updateCurImgElement', currThemeElement);
            break;
        case 'sendjsdata':
            // 获得存储的信息
            if (data.data.flipCards) {
                store.commit('changeTheme', data.data.themeId);
                store.commit('updateCurImgElement', data.data.currThemeElement);
                store.commit('updateFlipCards', {
                    type: 'update',
                    data: data.data.flipCards
                });
            }
            break;
    }
};

// 获取连接参数
Vue.prototype.$getQueryString = (name) => {
    try {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null)
            return decodeURI(r[2]);
        return null;
    } catch (e) {
        log_error(" getQueryString function error=" + e.message);
    }
}

// 获取浏览器内核参数
Vue.prototype.$getBrowser = (n) => {
    let ua = navigator.userAgent.toLowerCase(),
        s,
        name = '',
        ver = 0;
    //探测浏览器
    (s = ua.match(/msie ([\d.]+)/)) ? _set("ie", _toFixedVersion(s[1])) :
        (s = ua.match(/firefox\/([\d.]+)/)) ? _set("firefox", _toFixedVersion(s[1])) :
            (s = ua.match(/chrome\/([\d.]+)/)) ? _set("chrome", _toFixedVersion(s[1])) :
                (s = ua.match(/opera.([\d.]+)/)) ? _set("opera", _toFixedVersion(s[1])) :
                    (s = ua.match(/version\/([\d.]+).*safari/)) ? _set("safari", _toFixedVersion(s[1])) : 0;

    function _toFixedVersion(ver, floatLength) {
        ver = ('' + ver).replace(/_/g, '.');
        floatLength = floatLength || 1;
        ver = String(ver).split('.');
        ver = ver[0] + '.' + (ver[1] || '0');
        ver = Number(ver).toFixed(floatLength);
        return ver;
    }

    function _set(bname, bver) {
        name = bname;
        ver = bver;
    }

    return (n == 'n' ? name : (n == 'v' ? ver : name + ver));
}

// 判断元素父节点是否包含class
Vue.prototype.$parentIndexOf = (node, parentClassName) => {
    if (node.className === parentClassName) {
        return node;
    }
    for (let i = 0, n = node; n = n.parentNode; i++) {
        if (n.className.indexOf(parentClassName) !== -1) {
            // console.log(n.className)
            return n;
        }
        //找不到目标父节点，防止死循环
        if (n == document.documentElement) {
            return false;
        }
    }
}

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
