<template>
    <div class="footer">
        <div class="pull-right">
            <!-- 底部内容  -->
            <el-button round>取消</el-button>
            <el-button round>查看范例</el-button>
            <el-button @click="getToPreview" round>预览</el-button>
            <el-button type="danger" round>插入PPT</el-button>
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
            getToPreview(){
                this.$store.commit('viewPreview');
            }
        }
    }
</script>

<style lang='scss'>
    .footer {
        line-height   : 90px;
        border-top    : 1px solid #ddd;
        padding-right : 30px;
    }
</style>
