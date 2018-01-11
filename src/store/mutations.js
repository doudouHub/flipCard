import Vue from 'vue';

export const mutations = {
    // 显示接收题目弹窗
    changeTheme(state, data) {
        state.theme.activeId = data;
    },
};
