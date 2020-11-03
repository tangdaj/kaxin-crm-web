<template>
    <div>
        <h4>欢迎登陆本系统...</h4>
       <!-- <div class="block">
            <span class="demonstration">默认</span>
            <el-date-picker
                    v-model="value1"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    @change="test"
                    end-placeholder="结束日期">
            </el-date-picker>
        </div>-->
    </div>
</template>

<script>
  export default {
    data () {
      return {
        dialogAddgsVisible: false,
        title: '',
          value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      }
    },
    methods: {
        dateConversion(time){
            let value = new Date(time);
            let date = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate() + ' ' + value.getHours() + ':' + value.getMinutes() + ':' + value.getSeconds();
            return date;
        },
        test(){
           // let startTime = this.dateConversion(this.value1[0]);
           // let stopTime = this.dateConversion(this.value1[1]);
            alert(this.value1);
            //alert(stopTime);  +startTime+"&stopTime="+stopTime
            this.$http.get("http://183.215.190.121:9999/scOpera/test?times="+this.value1).then(res => {
                this.accountList = res.data.list;
                this.total = res.data.total;
            })
        },

      /**
       *点击新增按钮，弹出新增模态框
       * @param
       */
      addgsForm () {
        this.dialogAddgsVisible = true
        this.title = '新增分类'
      },
      /**
       *关闭或取消模态框，清空值
       * @param
       */
      closeDialogAddgsVisible () {
        this.$refs.addForm.resetFields()//element封装的方法,清空模态框的值
        this.title = '' //初始化title的值
        this.addForm = {//初始化addForm中的值
          name: '',
          sort: '',
        }
      },
    },
  }
</script>

<style lang="less" scoped>

</style>
