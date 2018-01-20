<template>
    <div class="footer">
        <div class="pull-right">
            <!-- 底部内容  -->
            <el-button size="small" @click="closeWindow" round>关闭</el-button>
            <!--<el-button size="small" round>查看范例</el-button>-->
            <el-button size="small" @click="getToPreview" round>预览</el-button>
            <el-button size="small" type="danger" @click="insertPPT" round>插入PPT</el-button>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    // import html2canvas from 'html2canvas';

    export default {
        data() {
            return {}
        },
        computed: {
            ...mapGetters([
                'preview',
                'theme',
                'flipCards',
                'currThemeElement'
            ])
        },
        methods: {
            // 预览模式
            getToPreview() {
                this.$store.commit('viewPreview');
            },
            // 关闭窗口
            closeWindow() {
                this.$call_cplus('micro.cotroler', 'closewindow', '');
            },
            // 插入ppt
            insertPPT() {
                const self = this;
                let data = {
                    wtype: 'all',
                    qtype: 'h5',
                    sortid:'ra.savework',
                    type:'cls',
                    themeId: this.theme.activeId,
                    currThemeElement: this.currThemeElement,
                    workid: this.$uuid(),
                    workname: this.flipCards.title,
                    flipCards: this.flipCards,
                    timestamp: (new Date()).valueOf(),
                    datecreated: new Date() * 1,
                    h5_url:window.location.href
                };
                // // 向C++发行题目信息
                // self.$call_cplus('micro.cotroler', 'setdata', JSON.stringify(data));
                this.$store.commit('viewPreview','screenshot');
                setTimeout(function () {
                    // 截图保存
                    html2canvas([document.body], {
                        onrendered: function (canvas) {
                            let imgurl = canvas.toDataURL("image/jpeg", 1.0);
                            imgurl = imgurl.replace("data:image/jpeg;base64,", "");

                            //发送消息，保存截图数据
                            self.$call_cplus('micro.cotroler', 'sendimgurl', imgurl);
                            // 向C++发行题目信息
                            self.$call_cplus('micro.cotroler', 'setdata', JSON.stringify(data));
                        }
                    });
                }, 200)
            }
        }
    }
</script>

<style lang='scss' scoped>
    .footer {
        position           : relative;
        z-index            : 100;
        line-height        : 59px;
        border-top         : 1px solid #ddd;
        padding-right      : 30px;
        overflow           : hidden;
        -webkit-transition : transform .2s linear;
        transition         : transform .2s linear;
        .el-button {
            width : 100px;
            &.el-button--default {
                background-color : #f8f8f8;
            }
            &.el-button--danger {
                background-color : #d24726;
            }
        }
    }
</style>
