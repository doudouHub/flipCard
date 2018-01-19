<template>
    <div class="sidebar">
        <!--  侧边内容  -->
        <el-tabs class="imglib-tabs" :aria-index="activeName" v-model="activeName">
            <el-tab-pane name="first" style="padding: 0 15px;">
                <span slot="label"><i class="el-icon-picture"></i> 图片</span>
                <div class="imglibs-tip" v-if="imglibsTip">
                    * 图片可拖动到题目区域
                    <div class="el-icon-close" @click="closeTip"></div>
                </div>
                <el-input class="imglibs-search" v-model="imgKeyword" placeholder="搜索关键词..."
                          @keyup.enter.native="getNetImglib" clearable>
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <ul class="imglib-list list-none">
                    <li class="imglib-item"
                        v-for="(item,index) in imglib.list"
                        :key="item.id"
                        v-if="Math.ceil((index+1)/imglib.pageSize)===imglib.page"
                        v-cloak>
                        <div class="imglib-box"
                             :class="item.id===imglib.activeId?'active':''"
                             @click="viewImginBox(item.thumb,item.id)">
                            <img :id="item.id" :src="item.thumb" alt="" draggable="true"
                                 @dragstart="drag($event)">
                        </div>
                    </li>
                </ul>
                <!--  没有图片的展示  -->
                <img class="imglib-nodata" src="../../../static/img/imglib-nodata.png" alt="" v-show="!imglib.list.length">
                <!--  图库分页跳转  -->
                <div class="img-pagination text-center" v-show="imglib.pageTotal">
                    <i class="el-icon-caret-left page-btn" :class="imglib.page===1?'disabled':''"
                       @click="handleCurrentChange('prev')"></i>
                    <el-input
                        :placeholder="inputFocus?'':placeholder"
                        @focus="inputFocus=true"
                        @blur="inputFocus=false"
                        @keyup.enter.native="turnPage"
                        :value="inputvalue"
                    >
                        <i slot="suffix" class="icon-enter" v-show="inputFocus"></i>
                    </el-input>
                    <i class="el-icon-caret-right page-btn" :class="imglib.page===imglib.pageTotal?'disabled':''"
                       @click="handleCurrentChange('next')"></i>
                </div>
            </el-tab-pane>
            <el-tab-pane name="second">
                <span slot="label"><i class="el-icon-menu"></i> 主题</span>
                <div class="theme-box">
                    <!--  本地主题列表  -->
                    <div class="theme-list-box">
                        <ul class="theme-list list-none" :class="themeOpenState?'open':''">
                            <li class="theme-item" v-for="(item,index) in theme.list">
                                <div class="thumb-box"
                                     :class="item.id===theme.activeId?'active':''"
                                     @click="selectTheme(item.id)" :title="item.name"
                                     :style="'background-image : url(./static/img/theme/theme' + item.id + '/bg-thumb.jpg);'"></div>
                            </li>
                        </ul>
                        <!--  伸缩主题列表按钮  -->
                        <div class="theme-openBtn" @click="themeOpenState=!themeOpenState" v-if="theme.list.length>4">
                            <div class="icon-open"></div>
                        </div>
                    </div>
                    <!--  编辑区域  -->
                    <div class="edit-area">
                        <h5>编辑</h5>
                        <!--  背景编辑  -->
                        <el-row class="edit-area-item">
                            <el-col :span="12">
                                <div class="img-box">
                                    <img :src="currThemeElement.backgroundThumb" alt="">
                                </div>
                            </el-col>
                            <el-col :span="12" class="edit-area-right">
                                <div class="label">背景图片</div>
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
                            <el-col :span="12" class="edit-area-right">
                                <div class="label">元素</div>
                                <el-button size="mini" icon="el-icon-plus" @click="selectLocalImg('element')">本地图片
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                themeOpenState: false, // 主题展开状态
                activeName: 'first',
                imgKeyword: '',
                // 网络图库
                imglib: {
                    activeId: 0,
                    pageSize: 12,
                    page: 1,
                    pageTotal: 0,
                    list: []
                },
                imglibsTip: true,
                inputFocus: false
            }
        },
        computed: {
            ...mapGetters([
                'theme',
                'currThemeElement'
            ]),
            placeholder() {
                return this.imglib.page + '/' + this.imglib.pageTotal;
            },
            inputvalue() {
                return this.inputFocus ? this.imglib.page : '';
            }
        },
        mounted() {
            this.imglibsTip = !sessionStorage.getItem('closetip');
        },
        methods: {
            // 切换主题
            selectTheme(id) {
                let currThemeElement = {
                    backgroundThumb: './static/img/theme/theme' + id + '/bg-thumb.jpg',
                    background: './static/img/theme/theme' + id + '/bg.jpg',
                    element: './static/img/theme/theme' + id + '/element.png'
                }
                this.$store.commit('changeTheme', id);
                // 更新当前主题元素
                this.$store.commit('updateCurImgElement', currThemeElement);
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
                    self.imglib.pageTotal = Math.round(res.data.list.length / self.imglib.pageSize);
                }).catch(function (err) {
                    console.log(err);
                });
            },
            // 切换分页
            handleCurrentChange(type) {
                switch (type) {
                    case 'prev':
                        if (this.imglib.page === 1) return;
                        this.imglib.page--;
                        break;
                    case 'next':
                        if (this.imglib.page === this.imglib.pageTotal) return;
                        this.imglib.page++;
                        break;
                }
            },
            // 拖动开始
            drag(ev) {
                ev.dataTransfer.setData("Text", ev.target.id);
                // console.log(ev.target.id, '拖动开始')
                this.$store.commit('updateImgView', {
                    state: false,
                    src: ''
                });
            },
            // 选择本地图片
            selectLocalImg(type) {
                this.$store.commit('changeUploadMode', type);
                // 调用C++方法选择本地文件
                this.$call_cplus('micro.cotroler', 'selectFile', 'single');
            },
            // 在弹窗中查看大图
            viewImginBox(src, id) {
                this.$store.commit('updateImgView', {
                    state: true,
                    src: src
                });
                this.imglib.activeId = id;
            },
            // 分页跳转
            turnPage(e) {
                let _val = e.target.value;
                if (!_val) return;
                _val = (_val < 1) ? 1 : (_val > this.imglib.pageTotal ? this.imglib.pageTotal : _val);
                this.imglib.page = Number(_val);
            },
            // 关闭提示
            closeTip() {
                this.imglibsTip = false;
                sessionStorage.setItem('closetip', true);
            }
        }
    }
</script>

<style lang='scss'>
    @import "../../styles/mixins";
    @import "../../styles/config";
    /* 图库切换头部 */
    .imglib-tabs {
        &[aria-index="first"] {
            .el-tabs__active-bar {
                margin-left : 21px;
            }
        }
        .el-tabs__nav {
            width            : 100%;
            background-color : #fff;
        }
        .el-tabs__item {
            padding    : 0;
            text-align : center;
        }
        .el-tabs__item {
            width : 50% !important;
            &.is-active, &:hover {
                color : #d24726;
                .el-icon-picture, .el-icon-menu {
                    color : #d24726;
                }
            }
            .el-icon-picture {
                font-size : 17px;
                position  : relative;
                top       : 1px;
                color     : #989898;
            }
            .el-icon-menu {
                font-size : 16px;
                position  : relative;
                top       : 1px;
                color     : #989898;
            }
        }

        .el-tabs__header {
            margin-bottom : 0;
        }

        .el-tabs__active-bar {
            width            : 60px !important;
            background-color : $mainColor;
            /* &:before {
                 content        : '';
                 @include stretch(false, false, 100%, 50%);
                 display        : block;
                 width          : 0;
                 height         : 0;
                 vertical-align : middle;
                 border-bottom  : 4px dashed $mainColor;
                 border-right   : 4px solid transparent;
                 border-left    : 4px solid transparent;
                 margin-left    : -4px;
             }*/
        }
        .el-tabs__nav-wrap {
            border-bottom : 1px solid #ddd;
        }
    }

    .imglibs-search {
        margin-top    : 20px;
        border-radius : 3px;
        .el-icon-search {
            line-height : 30px;
        }
        input {
            border-color  : #e2e2e2;
            line-height   : 30px;
            height        : 30px;
            padding-left  : 10px;
            border-radius : 2px;
            font-size     : 12px;
            &:focus {
                border-color : #d24726;
            }
        }
    }

    .img-pagination {
        .el-input {
            display : inline-block;
            width   : 65px;
            ::-webkit-input-placeholder {
                color : #333;
            }
        }
        .el-input__inner {
            height        : 20px;
            font-size     : 12px;
            border-radius : 2px;
            text-align    : center;
            padding-right : 15px;
            &:focus {
                border-color : #d24726;
            }
        }
        .el-input__suffix {
            .icon-enter {
                position : relative;
                top      : 2px;
                display  : block;
                width    : 15px;
                height   : 15px;
                background   : {
                    image    : $flip-element;
                    repeat   : no-repeat;
                    position : -201px -179px;
                }
            }
        }
    }
</style>
<style lang='scss' scoped>
    @import "../../styles/sideBar";
</style>

