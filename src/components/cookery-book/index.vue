<template>
  <div class="initiating">
    <div class="initiating-form-item">
      <div class="m-t20">
        <div class="form-group">
          <div class="float-l form-title">
            <div><span class="red">*</span>菜谱详情:</div>
          </div>
          <div class="float-r form-fill">
            <div class="t-left">
              <div id="main">
                 <v-ueditor v-model="basicVal.mavonValue"></v-ueditor>
              </div>
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

  import vUeditor from 'components/v-ueditor'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        id: this.$route.query.id,
        status: 1,
        // 基本信息
        basicVal: {
          mavonValue: '',// 菜谱详情
        },
        disabled: false
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
        // this.basicVal.mavonValue = this.draftActivity.content
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
    },
    components: {
      vUeditor
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
  /*编辑器样式*/
  #main .v-note-wrapper{ max-height: 500px; position: inherit;}
  #main .v-note-wrapper .v-note-op .v-left-item .op-icon,#main .v-note-wrapper .v-note-op .v-right-item .op-icon {height: 20px;width: 20px;font-size: 12px;color: #757575;border-radius: 5px;margin: 0;padding: 0;}
  #main .fa-mavon-question-circle{ padding:0!important; }
  #main .v-note-wrapper .v-note-op,#main .v-note-wrapper .v-note-op .v-left-item,#main .v-note-wrapper .v-note-op .v-right-item{min-height: 30px;}
</style>
