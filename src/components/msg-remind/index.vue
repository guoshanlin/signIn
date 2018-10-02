<template>
  <div class="initiating">
    <div class="initiating-form-item">
      <!--<h3 class="t-left">基本信息</h3>-->
      <div class="m-t20">
        <div class="form-group">
          <div class="float-l form-title">
            <div><span class="red">*</span>学习时间:</div>
          </div>
          <div class="float-r form-fill">
            <div>
              <i-input type="text" placeholder="支持多个时间段(开始~结束)，支持循环，也支持特定输入" v-model="basicVal.title"></i-input>
            </div>
            <div>
              <i-input type="text" placeholder="对应时间段的通知提示语" v-model="basicVal.title"></i-input>
            </div>
          </div>
          <div class="clearFix"></div>
        </div>
        <div class="form-group m-t15">
          <div class="float-l form-title">
            <div><span class="red">*</span>休息时间:</div>
          </div>
          <div class="float-r form-fill">
            <div>
              <i-input type="text" placeholder="支持多个时间段(开始~结束)，支持循环，也支持特定输入" v-model="basicVal.title"></i-input>
            </div>
            <div>
              <i-input type="text" placeholder="对应时间段的通知提示语" v-model="basicVal.title"></i-input>
            </div>
          </div>
          <div class="clearFix"></div>
        </div>
        <div class="form-group m-t15">
          <div class="float-l form-title">
            <div><span class="red">*</span>餐饮时间:</div>
          </div>
          <div class="float-r form-fill">
            <div>
              <i-input type="text" placeholder="支持多个时间段(开始~结束)，支持循环，也支持特定输入" v-model="basicVal.title"></i-input>
            </div>
            <div>
              <i-input type="text" placeholder="对应时间段的通知提示语" v-model="basicVal.title"></i-input>
            </div>
          </div>
          <div class="clearFix"></div>
        </div>
      </div>
    </div>
    <div class="posct">
      <i-button type="primary" @click="basicEvent()">保存</i-button>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        id: this.$route.query.id,
        // 基本信息
        basicVal: {
          title: '', // 标题
        },
        msgTip: {
          name: {msg: '活动标题不能为空', required: true},
          remark: {msg: '活动特色不能为空', required: true},
          content: {msg: '活动详情不能为空', required: true}
        },
        disabled: false,
      }
    },
    computed: {
      ...mapGetters([
        'draftActivity'
      ])
    },
    created() {
      setTimeout(() => {
        if (this.id) {
          this.initData()
        }
      }, 20)
    },
    methods: {
      initData () {
        if (!this.draftActivity) return
        // this.basicVal.title = this.draftActivity.name
      },
      basicEvent() {
        let _params = {
          id: this.id,
          name: this.basicVal.title, // 名称
        }
        if(!this.verification(_params, this.msgTip)) return
        this.disabled = true
        this.requestAjax('post', 'activitys', _params).then(res => {
          if (data.success) {
            this.$Message.success('保存成功')
            this.disabled = false
          } else {
            this.disabled = false
            this.$Message.success('保存失败')
          }
        })
      }
    }
  }
</script>

<style scoped>
  .initiating .initiating-form-item{line-height: 30px; margin-bottom: 20px}
  .initiating .initiating-form-item>div{ border: 1px solid #e3e2e5; padding: 10px; border-radius: 5px}
  .initiating div{line-height: 30px}
  .initiating .form-title{ width:100px !important; }
  .initiating .form-fill{ width: calc(100% - 100px) !important;}
  .initiating .form-group{margin: 5px 0px;}
  .initiating .red{color: #FF0000}
</style>
