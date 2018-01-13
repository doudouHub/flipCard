<template>
    <div class="sidebar">
        <!--  侧边内容  -->
        <el-tabs class="imglib-tabs" v-model="activeName" @tab-click="tabClick">
            <el-tab-pane label="主题" name="first">
                <div class="theme-box">
                    <!--  本地主题列表  -->
                    <ul class="theme-list list-none">
                        <li class="theme-item" v-for="(item,index) in theme.list">
                            <div class="thumb-box"
                                 :class="item.id===theme.activeId?'active':''"
                                 @click="selectTheme(item.id)" :title="item.name"
                                 :style="'background-image : url(./static/img/theme/theme' + item.id + '/bg-thumb.png);'"></div>
                        </li>
                    </ul>
                    <!--  编辑区域  -->
                    <div class="edit-area">
                        <h5 class="text-center">编辑</h5>
                        <!--  背景编辑  -->
                        <el-row class="edit-area-item">
                            <el-col :span="12">
                                <div class="img-box">
                                    <img :src="currThemeElement.backgroundThumb" alt="">
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div>背景</div>
                                <el-button size="mini" icon="el-icon-plus" @click="selectLocalImg('background')">本地图片
                                </el-button>
                            </el-col>
                        </el-row>
                        <!--  元素编辑  -->
                        <el-row class="edit-area-item">
                            <el-col :span="12">
                                <div class="img-box">
                                    <img :src="currThemeElement.element" alt="">
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div>元素</div>
                                <el-button size="mini" icon="el-icon-plus" @click="selectLocalImg('element')">本地图片
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="图库" name="second">
                <el-input class="imglibs-search" v-model="imgKeyword" placeholder="输入关键词搜索"
                          @keyup.enter.native="getNetImglib"></el-input>
                <ul class="imglib-list list-none">
                    <li class="imglib-item" v-for="(item,index) in imglib.list"
                        v-if="Math.ceil((index+1)/imglib.pageSize)==imglib.page"
                        v-cloak>
                        <div class="imglib-box">
                            <img :id="item.id" :src="item.thumb" alt="" draggable="true" @dragstart="drag($event)">
                        </div>
                    </li>
                </ul>
                <el-pagination
                    class="text-center"
                    small
                    layout="prev, pager, next"
                    :total="imglib.list.length"
                    :page-size="imglib.pageSize"
                    :current-page="imglib.page"
                    @current-change="handleCurrentChange">
                </el-pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                activeName: 'first',
                imgKeyword: '指鹿为马',
                // 网络图库
                imglib: {
                    pageSize: 12,
                    page: 1,
                    list: []
                },
            }
        },
        computed: {
            ...mapGetters([
                'theme',
                'currThemeElement'
            ])
        },
        mounted() {

        },
        methods: {
            // 切换主题
            selectTheme(id) {
                let currThemeElement = {
                    backgroundThumb: './static/img/theme/theme' + id + '/bg-thumb.png',
                    background: './static/img/theme/theme' + id + '/bg.png',
                    element: './static/img/theme/theme' + id + '/element.png'
                }
                this.$store.commit('changeTheme', id);
                // 更新当前主题元素
                this.$store.commit('updateCurImgElement', currThemeElement);
            },
            // tab切换事件
            tabClick() {
                // 第一次切换图库
                if (this.activeName === 'second' && !this.imglib.list.length) {
                    this.getNetImglib();
                }
            },
            // 获取在线图库
            getNetImglib() {
                const self = this;
                this.$axios.get('http://image.so.com/j', {
                    params: {
                        q: self.imgKeyword,
                        pn: 40,
                        src: 'srp'
                    }
                }).then(function (res) {
                    self.imglib.list = res.data.list;
                    self.imglib.page = 1;
                }).catch(function (err) {
                    console.log(err);
                });
            },
            // 切换分页
            handleCurrentChange(val) {
                this.imglib.page = val;
            },
            // 拖动开始
            drag(ev) {
                ev.dataTransfer.setData("Text", ev.target.id);
                console.log(ev.target.id, '拖动开始')
            },
            // 选择本地图片
            selectLocalImg(type) {
                this.$store.commit('changeUploadMode', type);
                // 调用C++方法选择本地文件
                this.$call_cplus('micro.cotroler', 'selectFile', 'single');
            }
        }
    }
</script>

<style lang='scss'>
    @import "../../styles/mixins";
    @import "../../styles/theme";

    .sidebar {
        @include stretch(0, 0, 0, false);
        width            : 234px;
        border-left      : 1px solid #ddd;
        background-color : #f9f9f9;
    }

    .imglib-tabs {
        .el-tabs__nav {
            width            : 100%;
            background-color : #fff;
        }
        .el-tabs__item {
            padding    : 0;
            text-align : center;
        }
        .el-tabs__active-bar, .el-tabs__item {
            width : 50% !important;
        }
    }

    .imglibs-search {
        padding : 0 15px;
        input {
            text-align : center;
        }
    }

    .imglib-list {
        overflow : hidden;
        .imglib-item {
            float          : left;
            width          : 50%;
            padding-bottom : 10px;
        }
        .imglib-box {
            margin           : 0 auto;
            width            : 86px;
            height           : 62px;
            display          : flex;
            justify-content  : center;
            align-items      : center;
            background-color : #f3f3f3;
            cursor           : pointer;
            &:hover, &.active {
                border-color     : #e3512f;
                background-color : #ffdfdf;
            }
            img {
                display    : block;
                max-width  : 100%;
                max-height : 100%;
            }
        }
    }

    /* 编辑区域 */
    .edit-area-item {
        margin-bottom : 15px;
        .img-box {
            width           : 86px;
            height          : 62px;
            display         : -ms-flexbox;
            display         : flex;
            -ms-flex-pack   : center;
            justify-content : center;
            -ms-flex-align  : center;
            align-items     : center;
            img {
                display    : block;
                margin     : 0 auto;
                max-width  : 100%;
                max-height : 100%;
            }
        }
    }
</style>
