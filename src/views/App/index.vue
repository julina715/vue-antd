<template>
    <a-locale-provider :locale="locale">
        <div class="container">
            <p>
                <router-link to="/foo">Go to Foo</router-link>
                <router-link to="/bar">Go to Bar</router-link>
            </p>
            <router-view></router-view>
        </div>
    </a-locale-provider>
</template>

<script>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';

    export default {
        data () {
            return {
                locale: zhCN
            }
        }
    }
</script>
<style>
    *{
        min-height: 0;
    }
    body,
    html {
        width: 100%;
        height: 100%;
        min-width: 1280px;
        margin: 0;
    }
    .container{
        height: 100%;
    }
</style>