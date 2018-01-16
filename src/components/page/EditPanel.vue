<template>
    <div class="edit-panel" :class="('theme-'+theme.activeId)+' '+(preview?'':'editMode')"
         :style="'background-image : url('+currThemeElement.background+');'">
        <div class="panel-label"></div>
        <el-input class="flipcard-title" :disabled="preview" v-model="flipCards.title"
                  :placeholder="preview?'':'点击此处输入标题'"></el-input>

        <!--展示主体：卡片预览列表-->
        <div class="card-preList" :class="preview?'':'editMode'">
            <ul class="card-preList-box list-none" id="card-preList-box">
                <li class="item list-none"
                    :class="flipCards.list.length===2?'items-two':''"
                    :style="'width:'+ 100/flipCards.list.length +'%'" v-for="(item,index) in flipCards.list"
                    :key="item.id">
                    <div class="card-clear icon-clear" @click="deleteThisCard(index)">
                        <div class="icon-clear"></div>
                    </div>
                    <div class="viewport-flip">
                        <!--  卡片两面：通过是否preview预览状态判断是否需要呈现编辑  -->
                        <!--  卡片正面  -->
                        <div class="list flip"
                             :class="preview?(item.posi.class?item.posi.class:'in'):'in'"
                             :style="'background-image : url('+currThemeElement.element+');'"
                             @click="flipCard(index,'posi')">
                            <div
                                class="card-content"
                                @drop.prevent="drop($event,index,'posi')"
                                @dragover.prevent="dragover($event,index,'posi')"
                                :class="(flipCardHoverIndex===index && flipCardHoverState==='posi')?'hover':''">
                                <div class="content-clear" @click="clearThisConetent(index,'posi')"
                                     v-if="item.posi.img || item.posi.txt"></div>
                                <div class="dis-table ver-mid" v-show="item.posi.txt">
                                    <div class="dis-tab-cell card-text">
                                        <el-input
                                            type="textarea"
                                            autosize
                                            resize="none"
                                            placeholder="请输入内容"
                                            autofocus
                                            :disabled="preview"
                                            v-model="item.posi.txt">
                                        </el-input>
                                    </div>
                                </div>
                                <img :src="item.posi.img" draggable="false" alt="" v-if="item.posi.img">
                                <!--  卡片编辑区域  -->
                                <div class="card-edit-btns" v-else-if="!preview">
                                    <dl class="card-edit-item" @click="editContent('word',index,'posi')">
                                        <dd>
                                            <div class="img-box icon-text"></div>
                                        </dd>
                                        <dt>文字</dt>
                                    </dl>
                                    <dl class="card-edit-item" @click="editContent('image',index,'posi')">
                                        <dd>
                                            <div class="img-box icon-image"></div>
                                        </dd>
                                        <dt>图片</dt>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <!--  卡片反面  -->
                        <div class="list flip"
                             :class="preview?(item.oppo.class?item.oppo.class:'out'):'in'"
                             :style="'background-image : url('+currThemeElement.element+');opacity:'+(flipCardShow?'1':'0')"
                             @click="flipCard(index,'oppo')">
                            <div
                                class="card-content"
                                @drop.prevent="drop($event,index,'oppo')"
                                @dragover.prevent="dragover($event,index,'oppo')"
                                :class="(flipCardHoverIndex===index && flipCardHoverState==='oppo')?'hover':''">
                                <div class="content-clear" @click="clearThisConetent(index,'oppo')"
                                     v-if="item.oppo.img || item.oppo.txt"></div>
                                <div class="dis-table ver-mid" v-show="item.oppo.txt">
                                    <div class="dis-tab-cell card-text">
                                        <el-input
                                            type="textarea"
                                            autosize
                                            resize="none"
                                            placeholder="请输入内容"
                                            autofocus
                                            :disabled="preview"
                                            v-model="item.oppo.txt">
                                        </el-input>
                                    </div>
                                </div>
                                <img :src="item.oppo.img" draggable="false" alt="" v-if="item.oppo.img">
                                <!--  卡片编辑区域  -->
                                <div class="card-edit-btns" v-else-if="!preview">
                                    <dl class="card-edit-item" @click="editContent('word',index,'oppo')">
                                        <dd>
                                            <div class="img-box icon-text"></div>
                                        </dd>
                                        <dt>文字</dt>
                                    </dl>
                                    <dl class="card-edit-item" @click="editContent('image',index,'oppo')">
                                        <dd>
                                            <div class="img-box icon-image"></div>
                                        </dd>
                                        <dt>图片</dt>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="card-addBtn" @click="addNewCard" v-cloak>
            <div class="icon-add"></div>
            添加题目（{{flipCards.list.length}}/5）
        </div>
        <div v-show="preview">
            <div class="card-backBtn" @click="backToEdit">
                退出预览
            </div>
            <div class="card-againBtn" @click="doitAgain"></div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapGetters} from 'vuex'

    export default {
        data: function () {
            return {
                flipCardShow: false,
                flipCardHoverState: '',
                flipCardHoverIndex: -1,  // 拖拽悬浮索引
                flipCards: {
                    title: '',
                    list: [
                        {
                            id: 1,
                            posi: {
                                img: '',
                                txt: ''
                            },
                            oppo: {
                                img: '',
                                txt: ''
                            }
                        },
                        {
                            id: 2,
                            posi: {
                                img: '',
                                txt: ''
                            },
                            oppo: {
                                img: '',
                                txt: ''
                            }
                        },
                    ]
                }
            }
        },
        computed: {
            ...mapGetters([
                'preview',
                'theme',
                'currThemeElement',
                'currUploadContent'
            ])
        },
        watch: {
            'currUploadContent'(val) {
                console.log(val, '卡片内容更新');
                // 卡片内容更新
                this.flipCards.list[val.index][val.state].img = val.content;
                console.log(this.flipCards.list[val.index][val.state], JSON.stringify(val));
            }
        },
        methods: {
            // 翻转卡片 index 卡片索引，当前状态值
            flipCard(index, state) {
                const self = this;
                // 如果当前非预览模式则不响应
                if (!this.preview) return;
                if (state === 'posi') {
                    Vue.set(this.flipCards.list[index].posi, 'class', 'out');
                    setTimeout(function () {
                        Vue.set(self.flipCards.list[index], 'state', 'oppo');
                        Vue.set(self.flipCards.list[index].oppo, 'class', 'in');
                    }, 225);
                } else {
                    Vue.set(this.flipCards.list[index].oppo, 'class', 'out');
                    setTimeout(function () {
                        Vue.set(self.flipCards.list[index], 'state', 'posi');
                        Vue.set(self.flipCards.list[index].posi, 'class', 'in');
                    }, 225);
                }
            },
            // 拖拽松手 ev事件回调 index 卡片索引 state 当前卡片状态
            drop(ev, index, state) {
                this.flipCardHoverIndex = -1;
                let data = ev.dataTransfer.getData("Text"),
                    $target;

                if (this.$parentIndexOf(ev.target, 'card-content')) {
                    $target = this.$parentIndexOf(ev.target, 'card-content');
                } else {
                    return;
                }
                this.flipCards.list[index][state].img = document.getElementById(data).getAttribute('src');
            },
            // 拖拽经过放置区 index card索引  state 卡片位置
            dragover(ev, index, state) {
                const self = this;
                // 当处于可放置区，为悬停增加样式
                if (this.$parentIndexOf(ev.target, 'card-content')) {
                    this.flipCardHoverIndex = index;
                    this.flipCardHoverState = state;
                } else {
                    this.flipCardHoverIndex = -1;
                }
            },
            // 添加新卡片
            addNewCard() {
                const self = this;
                if (this.flipCards.list.length === 5) return;
                this.flipCards.list.push({
                    id: (new Date()).valueOf(),
                    posi: {
                        img: '',
                        txt: ''
                    },
                    oppo: {
                        img: '',
                        txt: ''
                    }
                })
            },
            // 删除这张卡片
            deleteThisCard(index) {
                if (this.flipCards.list.length === 1) return;
                this.flipCards.list.splice(index, 1);
            },
            // 清空卡片内容
            clearThisConetent(index, state) {
                this.flipCards.list[index][state] = {
                    img: '',
                    txt: ''
                }
            },
            // 编辑卡片内容 type 类型，index 索引，state 卡片位置
            editContent(type, index, state) {
                const self = this;
                switch (type) {
                    case 'word':
                        this.flipCards.list[index][state].txt = ' ';
                        break;
                    case 'image':
                        this.$store.commit('changeUploadMode', 'cardContent');
                        this.$store.commit('updateUploadContent', {
                            index: index,
                            state: state,
                            content: ''
                        });

                        // 调用C++方法选择本地文件
                        this.$call_cplus('micro.cotroler', 'selectFile', 'single');
                        break;
                }
            },
            // 退出编辑，返回预览
            backToEdit() {
                this.$store.commit('viewPreview');
            },
            // 题型重新开始
            doitAgain() {

            }
        },
        mounted() {
            const self = this;
            // 演示显示反面
            setTimeout(() => {
                self.flipCardShow = true;
            }, 225)
        }
    }
</script>

<style lang="scss">
    @import "../../styles/mixins";
    @import "../../styles/config";
    @import "../../styles/theme";
    @import "../../styles/flipcard";

    .edit-panel {
        height   : 100%;
        overflow : hidden;
        background   : {
            position : top center;
            size     : cover;
        }
        .card-addBtn {
            @include stretch(false, false, 80px, 50%);
            background   : {
                image    : $flip-element;
                repeat   : no-repeat;
                position : 0 -49px;
            }
            color       : #fff;
            text-align  : center;
            width       : 202px;
            height      : 50px;
            line-height : 39px;
            margin-left : -201px;
            cursor      : pointer;
            display     : none;
            .icon-add {
                display        : inline-block;
                vertical-align : middle;
                width          : 15px;
                height         : 15px;
                margin-right   : 5px;
                background   : {
                    image    : $flip-element;
                    repeat   : no-repeat;
                    position : -177px -181px;
                }
            }
        }
        .card-backBtn {
            @include stretch(false, 20px, 15px, false);
            background   : {
                image    : $flip-element;
                repeat   : no-repeat;
                position : 0 -109px;
            }
            color       : #fff;
            text-align  : center;
            width       : 126px;
            height      : 50px;
            line-height : 39px;
            cursor      : pointer;
        }
        .card-againBtn {
            @include stretch(50%, 50px, false, false);
            background   : {
                image    : $flip-element;
                repeat   : no-repeat;
                position : -135px -104px;
            }
            margin-top : -28px;
            width      : 56px;
            height     : 56px;
            cursor     : pointer;
        }
        &.editMode {
            .card-addBtn {
                display : block;
            }
        }
        .panel-label {
            @include stretch(15px, false, false, 0);
            width   : 120px;
            height  : 40px;
            background : {
                image  : $flip-element;
                repeat : no-repeat;
            }
            z-index : 100;
        }
    }

    .flipcard-title {
        input {
            display          : block;
            text-align       : center;
            font-size        : 20px;
            border    : {
                color : #94c9fe;
                style : dashed;
                width : 1px;
            }
            width            : 286px;
            line-height      : 44px;
            margin           : 40px auto;
            border-radius    : 0;
            background-color : transparent;
            color            : #fff;
            &:hover, &:focus {
                border    : {
                    color : #fff;
                }
            }
        }
        &.is-disabled {
            .el-input__inner {
                border           : none;
                background-color : transparent;
                color            : #fff;
            }
        }
        ::-webkit-input-placeholder { /* WebKit browsers */
            color : #94c9fe;
        }
    }
</style>

