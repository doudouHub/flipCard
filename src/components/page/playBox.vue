<template>
    <div class="edit-panel" :class="('theme-'+theme.activeId)"
         :style="'background-image : url('+currThemeElement.background+');'">
        <div class="panel-label"></div>
        <el-input class="flipcard-title" disabled="disabled" v-model="flipCards.title"></el-input>

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
                            </div>
                        </div>
                        <!--  卡片反面  -->
                        <div class="list flip"
                             :class="item.oppo.class?item.oppo.class:'out'"
                             :style="'background-image : url('+currThemeElement.element+');opacity:'+(flipCardShow?'1':'0')"
                             @click="flipCard(index,'oppo')">
                            <div class="card-content">
                                <img :src="item.oppo.img" draggable="false" alt="" v-if="item.oppo.img">
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!--<div class="card-backBtn" @click="backToEdit">-->
        <!--退出预览-->
        <!--</div>-->
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
            }, 225)
        }
    }
</script>

<style lang="scss">
    @import "../../styles/theme";
    @import "../../styles/editPanel";
    @import "../../styles/flipcard";
</style>
