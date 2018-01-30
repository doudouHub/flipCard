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
                                            ref="input_posi"
                                            :disabled="preview"
                                            v-model="item.posi.txt">
                                        </el-input>
                                    </div>
                                </div>
                                <img :src="item.posi.img" draggable="false" alt="" v-if="item.posi.img"
                                     @click="viewImginBox(item.posi.img)">
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
                                            ref="input_oppo"
                                            placeholder="请输入内容"
                                            :disabled="preview"
                                            v-model="item.oppo.txt">
                                        </el-input>
                                    </div>
                                </div>
                                <img :src="item.oppo.img" draggable="false" alt="" v-if="item.oppo.img"
                                     @click="viewImginBox(item.oppo.img)">
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
        <div class="card-addBtn noselect" @click="addNewCard" v-cloak v-show="flipCards.list.length<5">
            <div class="icon-add"></div>
            添加题目（{{flipCards.list.length}}/5）
        </div>
        <div v-show="preview">
            <div class="card-backBtn noselect" @click="backToEdit" v-show="!screenshot">
                退出预览
            </div>
            <div class="card-againBtn noselect" @click="doitAgain"></div>
        </div>

        <!--  图片预览弹窗  -->
        <el-dialog
            class="imgView-dialog"
            title=""
            :visible="imgView.state"
            :fullscreen="true"
            :modal-append-to-body="false"
            :before-close="closeDialog"
            center>
            <img :src="imgView.src" alt="">
        </el-dialog>
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
            }
        },
        computed: {
            ...mapGetters([
                'preview',
                'screenshot',
                'theme',
                'currThemeElement',
                'flipCards',
                'imgView'
            ])
        },
        mounted() {
            const self = this;
            // 演示显示反面
            setTimeout(() => {
                self.flipCardShow = true;
            }, 225)
        },
        methods: {
            // 翻转卡片 index 卡片索引，当前状态值
            flipCard(index, state) {
                this.$store.commit('updateFlipCards', {
                    type: 'flip',
                    index: index,
                    state: state
                });
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

                this.$store.commit('updateFlipCards', {
                    type: 'drop',
                    index: index,
                    state: state,
                    data: data
                });
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
                this.$store.commit('updateFlipCards', {type: 'add'});
            },
            // 删除这张卡片
            deleteThisCard(index) {
                this.$store.commit('updateFlipCards', {type: 'delete', index: index});
            },
            // 清空卡片内容
            clearThisConetent(index, state) {
                this.$store.commit('updateFlipCards', {type: 'clear', index: index, state: state});
            },
            // 编辑卡片内容 type 类型，index 索引，state 卡片位置
            editContent(type, index, state) {
                const self = this;
                switch (type) {
                    case 'word':
                        this.$store.commit('updateFlipCards', {
                            type: 'putword',
                            index: index,
                            state: state
                        });
                        this.$nextTick(_ => {
                            // console.log(this.$refs);
                            this.$refs['input_' + state][index].$refs.textarea.focus();
                        });
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
                const self = this;
                this.$store.commit('updateFlipCards', {type: 'flipAll'});
                this.$store.commit('viewPreview');
            },
            // 题型重新开始
            doitAgain() {
                this.$store.commit('updateFlipCards', {type: 'flipAll'});
            },
            // 关闭弹窗
            closeDialog() {
                this.$store.commit('updateImgView', {
                    state: false,
                    src: ''
                });
            },
            // 在弹窗中查看大图
            viewImginBox(src) {
                if (this.preview) return;
                this.$store.commit('updateImgView', {
                    state: true,
                    src: src
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/themeEdit";
</style>
<style lang="scss">
    @import "../../styles/editPanel";
    @import "../../styles/flipcard";
</style>
