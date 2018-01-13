<template>
    <div class="edit-panel" :class="'theme-'+theme.activeId"
         :style="'background-image : url('+currThemeElement.background+');'">
        <h1 class="text-center">翻翻卡</h1>

        <!--展示主体：卡片预览列表-->
        <div class="card-preList">
            <ul class="card-preList-box list-none" id="card-preList-box">
                <li class="item list-none"
                    :class="flipCards.length==2?'items-two':''"
                    :style="'width:'+ 100/flipCards.length +'%'" v-for="(item,index) in flipCards"
                    :key="item.id">
                    <div class="viewport-flip">
                        <!--  卡片正面  -->
                        <div class="list flip"
                             :class="item.posi.class?item.posi.class:'in'"
                             :style="'background-image : url('+currThemeElement.element+');'"
                             @drop.prevent="drop($event,index,'posi')"
                             @dragover.prevent="dragover($event,index)"
                             @click="flipCard(index,'posi')">
                            <div
                                class="card-content"
                                :class="flipCardHoverIndex===index?'hover':''">
                                <img :src="item.posi.img" ondragstart="return false" alt="">
                                <div class="card-text">{{item.posi.txt}}</div>
                            </div>
                        </div>
                        <!--  卡片反面  -->
                        <div class="list flip"
                             :class="item.oppo.class?item.oppo.class:'out'"
                             :style="'background-image : url('+currThemeElement.element+');opacity:'+(flipCardShow?'1':'0')"
                             @drop.prevent="drop($event,index,'oppo')"
                             @dragover.prevent="dragover($event,index)"
                             @click="flipCard(index,'oppo')">
                            <div
                                class="card-content"
                                :class="flipCardHoverIndex===index?'hover':''">
                                <img :src="item.oppo.img" ondragstart="return false" alt="">
                                <div class="card-text">{{item.oppo.txt}}</div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapGetters} from 'vuex'

    export default {
        data: function () {
            return {
                flipCards: [
                    {
                        id: 1,
                        posi: {
                            img: 'http://p3.so.qhimgs1.com/t017857df256efc4b93.jpg',
                            txt: '123'
                        },
                        oppo: {
                            img: 'http://p3.so.qhimgs1.com/t017857df256efc4b93.jpg',
                            txt: '456'
                        }
                    },
                    {
                        id: 2,
                        posi: {
                            img: 'http://p3.so.qhimgs1.com/t017857df256efc4b93.jpg',
                            txt: '123'
                        },
                        oppo: {
                            img: 'http://p3.so.qhimgs1.com/t017857df256efc4b93.jpg',
                            txt: '456'
                        }
                    },
                ],
                flipCardShow: false,
                flipCardHoverIndex: -1  // 拖拽悬浮索引
            }
        },
        computed: {
            ...mapGetters([
                'theme',
                'currThemeElement'
            ])
        },
        methods: {
            // 翻转卡片 index 卡片索引，当前状态值
            flipCard(index, state) {
                const self = this;
                if (state === 'posi') {
                    Vue.set(this.flipCards[index].posi, 'class', 'out');
                    setTimeout(function () {
                        Vue.set(self.flipCards[index], 'state', 'oppo');
                        Vue.set(self.flipCards[index].oppo, 'class', 'in');
                    }, 225);
                } else {
                    Vue.set(this.flipCards[index].oppo, 'class', 'out');
                    setTimeout(function () {
                        Vue.set(self.flipCards[index], 'state', 'posi');
                        Vue.set(self.flipCards[index].posi, 'class', 'in');
                    }, 225);
                }
            },
            // 拖拽松手 ev事件回调 index 卡片索引 state 当前卡片状态
            drop(ev, index, state) {
                this.flipCardHoverIndex = -1;
                let data = ev.dataTransfer.getData("Text"),
                    $target;

                if (ev.target.className.indexOf('card-content') !== -1) {
                    $target = ev.target;
                } else if (ev.target.parentNode.className.indexOf('card-content') !== -1) {
                    $target = ev.target.parentNode;
                } else {
                    return;
                }
                this.flipCards[index][state].img = document.getElementById(data).getAttribute('src');
            },
            // 拖拽经过放置区
            dragover(ev, index) {
                const self = this;
                // 当处于可放置区，为悬停增加样式
                if (ev.target.className.indexOf('card-content') !== -1 || ev.target.parentNode.className.indexOf('card-content') !== -1) {
                    this.flipCardHoverIndex = index;
                } else {
                    this.flipCardHoverIndex = -1;
                }
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

<style lang="scss" scoped>
    @import "../../styles/mixins";
    @import "../../styles/theme";
    @import "../../styles/flipcard";

    .edit-panel {
        height   : 100%;
        overflow : hidden;
    }
</style>
