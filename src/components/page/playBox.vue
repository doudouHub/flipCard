<template>
    <div class="edit-panel" :class="('theme-'+theme.activeId)"
         :style="'background-image : url('+currThemeElement.background+');'">
        <div class="panel-label"></div>
        <div class="flipcard-title text-center" v-text="flipCards.title"></div>

        <!--展示主体：卡片预览列表-->
        <div class="card-preList">
            <ul class="card-preList-box list-none" id="card-preList-box">
                <li class="item list-none"
                    :class="flipCards.list.length===2?'items-two':''"
                    :style="'width:'+ 100/flipCards.list.length +'%'" v-for="(item,index) in flipCards.list"
                    :key="item.id">
                    <div class="viewport-flip">
                        <!--  卡片正面  -->
                        <div class="list flip"
                             :class="item.posi.class?item.posi.class:'in'"
                             :style="'background-image : url('+currThemeElement.element+');'"
                             @click="flipCard(index,'posi')">
                            <div class="card-content">
                                <img :src="item.posi.img" draggable="false" alt="" v-if="item.posi.img">
                                <div class="dis-table ver-mid card-content-text">
                                    <div class="dis-tab-cell" v-text="item.posi.txt"></div>
                                </div>
                            </div>
                        </div>
                        <!--  卡片反面  -->
                        <div class="list flip"
                             :class="item.oppo.class?item.oppo.class:'out'"
                             :style="'background-image : url('+currThemeElement.element+');opacity:'+(flipCardShow?'1':'0')"
                             @click="flipCard(index,'oppo')">
                            <div class="card-content">
                                <img :src="item.oppo.img" draggable="false" alt="" v-if="item.oppo.img">
                                <div class="dis-table ver-mid card-content-text">
                                    <div class="dis-tab-cell" v-text="item.oppo.txt"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="card-againBtn" @click="doitAgain"></div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapGetters} from 'vuex'

    export default {
        data: function () {
            return {
                flipCardShow: false
            }
        },
        computed: {
            ...mapGetters([
                'theme',
                'flipCards',
                'currThemeElement',
                'currUploadContent'
            ])
        },
        methods: {
            // 翻转卡片 index 卡片索引，当前状态值
            flipCard(index, state) {
                this.$store.commit('updateFlipCards', {
                    type: 'flip',
                    index: index,
                    state: state,
                    force: 1
                });
            },
            // 退出编辑，返回预览
            backToEdit() {
                this.$store.commit('viewPreview');
            },
            // 题型重新开始
            doitAgain() {
                this.$store.commit('updateFlipCards', {type: 'flipAll'});
            }
        },
        mounted() {
            const self = this;
            // 演示显示反面
            setTimeout(() => {
                self.flipCardShow = true;
            }, 500)
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/themePlay";
</style>
<style lang="scss">
    @import "../../styles/editPanel";
    @import "../../styles/flipcard";
</style>
<style lang="scss" scoped>
    .edit-panel {
        .card-preList {
            padding : 30px 300px;
            @media (max-width : 1600px) {
                padding : 30px 190px;
            }
            @media (max-width : 1440px) {
                padding : 30px 160px;
            }
            @media (max-width : 1100px) {
                padding : 30px 140px;
                @media (max-height : 600px) {
                    padding : 0 140px;
                }
            }
            .card-preList-box {
                .item {
                    @media (max-width : 1800px) {
                        transform         : scale(0.8);
                        -webkit-transform : scale(0.8);
                        margin-top        : -38px;
                    }
                    @media (max-width : 1600px) {
                        transform         : scale(0.7);
                        -webkit-transform : scale(0.7);
                    }
                    @media (max-width : 1440px) {
                        transform         : scale(0.6);
                        -webkit-transform : scale(0.6);
                    }
                    @media (max-width : 1100px) {
                        @media (max-height : 600px) {
                            transform         : scale(0.5);
                            -webkit-transform : scale(0.5);
                            margin-top        : -38px;
                        }
                    }
                    &:nth-child(even) {
                        @media (max-width : 1600px) {
                            top : 300px;
                        }
                        @media (max-width : 1440px) {
                            top : 220px;
                            @media (max-height : 600px) {
                                top : 200px;
                            }
                        }
                    }
                }
            }
        }
        .card-content {
            width  : 282px;
            height : 204px;
        }
        .card-preList-box {
            .item:nth-child(even) {
                top : 360px;
            }
            .card-content-text {
                width     : 100%;
                height    : 100%;
                font-size : 40px;
                padding   : 10px;
            }
        }
        .panel-label {
            width               : 198px;
            height              : 58px;
            background-position : 0 bottom;
        }
    }

    .flipcard-title {
        font-size : 44px;
        color     : #fff;
        margin    : 70px auto 10px;
        @media (max-width : 1440px) {
            font-size : 32px;
        }
        @media (max-height : 600px) {
            margin : 40px auto 0;
        }
    }
</style>
