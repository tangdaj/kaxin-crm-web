<template>
    <el-container style="height:100vh">
        <el-aside :width="isCollapse ? '64px' : '200px'">
            <el-header style="background-color: #14889A;">CRM
            <span style="font-size: 12px;" v-text="isCollapse?'':'卡信crm/小号管理系统'"></span>
            </el-header>
            <el-menu
                    router
                    background-color="#eaedf1"
                    text-color="black"
                    active-text-color="#409EFF"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    :default-active="$route.path"
            >
                <!--<el-submenu >
                    <template slot="title">
                        <i :class="isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'" style="margin-left: 0px;" @click="toggleCollapse"></i>
                    </template>
                </el-submenu>-->
                <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                    <template slot="title">
                        <i :class="iconObj[item.id]"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                        <template slot="title">
                            <i class="el-icon-s-promotion"></i>
                            <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-container style="border-right: #4a5064;">
            <el-header>
                <i :class="isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'" style="margin-left: 0px;"
                   @click="toggleCollapse"></i>
                <div class="demo-basic--circle">
                    <div class="block">
                        <el-avatar :size="sizeList" :src="circleUrl"></el-avatar>
                    </div>
                </div>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>

    export default {
        components: {},
        data() {
            return {
                circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
                sizeList: "medium",
                menulist: [
                    {
                        id: '125',
                        authName: '系统管理',
                        path: 'setting',
                        children: [
                            {
                                id: '1',
                                authName: '菜单管理',
                                path: 'menuManagement',
                            },
                            {
                                id: '2',
                                authName: '账号维护',
                                path: 'accountMaintenance',
                            },
                            {
                                id: '3',
                                authName: '角色管理',
                                path: 'roleManagement',
                            },
                            {
                                id: '4',
                                authName: '号码归属维护',
                                path: 'numberOwnership',
                            },
                            {
                                id: '5',
                                authName: '修改密码',
                                path: 'editPassword',
                            },
                        ]
                    },
                    {
                        id: '103',
                        authName: '四川联通小号',
                        path: 'sc',
                        children: [
                            {
                                id: '1',
                                authName: '小号管理',
                                path: 'scTrumpetManagement',
                            },
                            {
                                id: '2',
                                authName: '操作日志',
                                path: 'scOperationLog',
                            },
                            {
                                id: '3',
                                authName: '话单查询',
                                path: 'scBilledQuery',
                            },
                        ]
                    },
                    {
                        id: '145',
                        authName: '云南联通小号',
                        path: 'yn',
                        children: [
                            {
                                id: '1',
                                authName: '小号管理',
                                path: 'ynTrumpetManagement',
                            },
                            {
                                id: '2',
                                authName: '操作日志',
                                path: 'ynOperationLog',
                            },
                            {
                                id: '3',
                                authName: '话单查询',
                                path: 'ynBilledQuery',
                            },
                            {
                                id: '4',
                                authName: '短信发送记录',
                                path: 'smsSendingRecord',
                            },
                            {
                                id: '5',
                                authName: '短信接收记录',
                                path: 'smsReceivingRecord',
                            },
                            {
                                id: '6',
                                authName: '数据统计',
                                path: 'statistics',
                            },
                        ]
                    },

                ],
                iconObj: {
                    '125': 'iconfont icon-icon_user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                isCollapse: false,
            }
        },
        methods: {
            /* logout () {
               window.sessionStorage.clear
               this.$router.push('/login')
             },
             async getMenuList () {
               const { data } = await this.$http.get('menus')
               if (data.meta.status === 200) {
                 //this.menulist = data.data
                 console.log(this.menulist)
               } else {
                 this.$message({
                   type: 'error',
                   message: data.meta.msg
                 })
               }
             },*/
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            }
        },
        /* created() {
             this.getMenuList()
         },*/
    }
</script>

<style lang="less" scoped>
    .el-header {
        background-color: #14889A;
        display: flex;
        justify-content: space-between;
        padding-left: 0px;
        align-items: center;
        color: #fff;
        font-size: 20px;

        > div {
            display: flex;
            align-items: center;

            span {
                margin-left: 15px;
            }
        }

        img {
            width: 120px;
            height: 50px;
        }
    }

    .el-aside {
        background-color: #eaedf1;
        /*background-color: #2DA0CD;*/

        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .iconfont {
        margin-right: 10px;
    }

    .toggle-button {
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>
