<template>
    <div class="edit-panel" :class="'theme-'+theme.activeId"
         :style="'background-image : url(./static/img/theme/theme' + theme.activeId + '/bg.png);'">
        <h1 class="text-center">翻翻卡</h1>

        <!--展示主体：卡片预览列表-->
        <div class="card-preList">
            <ul class="card-preList-box list-none" id="card-preList-box">
                <li class="item list-none"
                    :class="flipCards.length==2?'items-two':''"
                    :style="'width:'+ 100/flipCards.length +'%'" v-for="(item,index) in flipCards"
                    :key="item.id">
                    <div class="viewport-flip" @click="flipCard(index,item.state)">
                        <div class="list flip"
                             :class="item.posi.class?item.posi.class:'in'"
                             :style="'background-image : url(./static/img/theme/theme' + theme.activeId + '/element.png);'">
                            <div class="card-content">
                                <img :src="item.posi.img" alt="">
                                <div class="card-text">{{item.posi.txt}}</div>
                            </div>
                        </div>
                        <div class="list flip"
                             :class="item.oppo.class?item.oppo.class:'out'"
                             :style="'background-image : url(./static/img/theme/theme' + theme.activeId + '/element.png);opacity:'+(flipCardShow?'1':'0')">
                            <div class="card-content">
                                <img :src="item.oppo.img" alt="">
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
                    {
                        id: 3,
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
                        id: 4,
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
                        id: 5,
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
                flipCardShow: false
            }
        },
        computed: {
            ...mapGetters([
                'theme'
            ])
        },
        methods: {
            // 翻转卡片 index 卡片索引，当前状态值
            flipCard(index, state) {
                const self = this;
                if (!state || state === 'posi') {
                    Vue.set(this.flipCards[index].posi, 'class', 'out');
                    Vue.set(this.flipCards[index], 'state', 'oppo');
                    setTimeout(function () {
                        Vue.set(self.flipCards[index].oppo, 'class', 'in');
                    }, 225);
                } else {
                    Vue.set(this.flipCards[index].oppo, 'class', 'out');
                    Vue.set(this.flipCards[index], 'state', 'posi');
                    setTimeout(function () {
                        Vue.set(self.flipCards[index].posi, 'class', 'in');
                    }, 225);
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

<style lang="scss">
    @import "../../styles/mixins";
    @import "../../styles/theme";
    @import "../../styles/flipcard";

    .edit-panel {
        height   : 100%;
        overflow : hidden;
    }


</style>
