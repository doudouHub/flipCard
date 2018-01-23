export const mutations = {
    // 显示接收题目弹窗
    changeTheme(state, data) {
        state.theme.activeId = data;
    },
    // 打开预览
    viewPreview(state, data) {
        state.preview = !state.preview;
        if (data === 'screenshot') {
            // 开启截屏模式
            state.screenshot = true;
        }
    },
    // 切换上传模式
    changeUploadMode(state, data) {
        state.currUploadMode = data;
    },

    // 更新上传内容
    updateUploadContent(state, data) {
        state.currUploadContent = data;
    },
    // 更新主题元素
    updateCurImgElement(state, data) {
        state.currThemeElement = data;
    },
    // 更新卡片
    updateFlipCards(state, data) {
        switch (data.type) {
            case 'add':
                // 添加
                if (state.flipCards.list.length === 5) return;
                state.flipCards.list.push({
                    id: (new Date()).valueOf(),
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
                })
                break;
            case 'putword':
                // 编辑文字
                state.flipCards.list[data.index][data.state].txt = ' ';
                break;
            case 'putImg':
                // 上传图片
                state.flipCards.list[data.index][data.state].img = data.data;
                break;
            case 'update':
                // 翻翻卡信息更新
                state.flipCards = data.data;
                break;
            case 'clear':
                // 清空
                state.flipCards.list[data.index][data.state].img = '';
                state.flipCards.list[data.index][data.state].txt = '';
                break;
            case 'delete':
                // 删除
                if (state.flipCards.list.length === 1) return;
                state.flipCards.list.splice(data.index, 1);
                break;
            case 'flip':
                // 翻转
                // 如果当前非预览模式则不响应
                if (!state.preview && !data.force) return;
                if (data.state === 'posi') {
                    state.flipCards.list[data.index].posi.class = 'out';
                    setTimeout(function () {
                        state.flipCards.list[data.index].state = 'oppo';
                        state.flipCards.list[data.index].oppo.class = 'in';
                    }, 225);
                } else {
                    state.flipCards.list[data.index].oppo.class = 'out';
                    setTimeout(function () {
                        state.flipCards.list[data.index].state = 'posi';
                        state.flipCards.list[data.index].posi.class = 'in';
                    }, 225);
                }
                break;
            case 'flipAll':
                // 翻转所有卡牌
                let cardList = state.flipCards.list;
                for (let i in cardList) {
                    cardList[i].oppo.class = 'out';
                    setTimeout(function () {
                        cardList[i].state = 'posi';
                        cardList[i].posi.class = 'in';
                    }, 225);
                }
                break;
            case 'drop':
                // 拖拽松手
                state.flipCards.list[data.index][data.state].img = document.getElementById(data.data).getAttribute('src');
                break;
        }
    },
    // 更新放大预览图片
    updateImgView(state, data) {
        state.imgView.state = data.state;
        state.imgView.src = '';
        setTimeout(function () {
            state.imgView.src = data.src;
        }, 100)
    },
    // 回到编辑模式
    editModeAgain(state) {
        state.editAgain = true;
    }
};
