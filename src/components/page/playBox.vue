<template>
    <div>

    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapGetters} from 'vuex'

    export default {
        data: function () {
            return {

            }
        },
        computed: {
            ...mapGetters([
                'theme',
                'currThemeElement'
            ])
        },
        methods: {

        },
        mounted() {

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
