<template>
    <div class="footer">
        <div class="pull-right">
            <!-- 底部内容  -->
            <el-button size="small" @click="closeWindow" round>关闭</el-button>
            <el-button size="small" round>查看范例</el-button>
            <el-button size="small" @click="getToPreview" round>预览</el-button>
            <el-button size="small" type="danger" @click="insertPPT" round>插入PPT</el-button>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {}
        },
        computed: {
            ...mapGetters([
                'preview'
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
            insertPPT(){

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
