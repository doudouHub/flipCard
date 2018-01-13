import Vue from 'vue';

export const mutations = {
    // 显示接收题目弹窗
    changeTheme(state, data) {
        state.theme.activeId = data;
    },
    // 打开预览
    viewPreview(state) {
        state.preview = !state.preview;
    },
    // 切换上传模式
    changeUploadMode(state, data) {
        state.currUploadMode = data;
    },
    // 更新主题元素
    updateCurImgElement(state, data) {
        state.currThemeElement = data;
    }
};
