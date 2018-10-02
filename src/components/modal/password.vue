<!--
表单组件
-->
<style>
  .inputForm .ivu-col {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .inputForm .ivu-col p {
    line-height: 30px
  }
  .red_tip {
    display: inline-block;
    width: 10px;
    height: 20px;
    color: #FF0000
  }
</style>
<template>
  <Modal
    title="修改密码"
    v-model="isShowModal"
    :mask-closable="false"
    @on-cancel="cancel"
    class-name="vertical-center-modal inputForm bottom" :width="512">
    <div>
      <div>
        <Row :gutter=5>
          <i-col :span="6">
            <p class="width-right m-l10"><span class="red_tip">*</span>原密码:</p>
          </i-col>
          <i-col :span="18">
            <i-input type="password" placeholder=" 请输入..." v-model="value.oldPassword"></i-input>
          </i-col>
          <i-col :span="6">
            <p class="width-right m-l10"><span class="red_tip">*</span>新密码:</p>
          </i-col>
          <i-col :span="18">
            <i-input type="password" placeholder=" 请输入..." v-model="value.password"></i-input>
          </i-col>
          <i-col :span="6">
            <p class="width-right m-l10"><span class="red_tip">*</span>确认密码:</p>
          </i-col>
          <i-col :span="18">
            <i-input type="password" placeholder=" 请输入..." v-model="value.newPassword"></i-input>
          </i-col>
        </Row>
      </div>
    </div>
    <div slot="footer">
      <i-button type="ghost" @click="cancel">取消</i-button>
      <i-button type="primary" @click="handle" :disabled="disabledButton">确认</i-button>
    </div>
  </Modal>
</template>
<script>
  import {setUserInfo, setIsLogin} from 'js/cache'
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    data () {
      return {
        disabledButton: false,
        isShowModal: this.show,
        value: {
          oldPassword: '',
          newPassword: '',
          password: ''
        }
      }
    }, // 参数
    mounted() {
    },
    beforeCreate() {
      this.$nextTick(() => {
      })
    }, // 数据加载前触发
    props: {
      show: ''
    },
    watch: {
      /**
       *绑定modal显示参数，与父组件同步
       * @param val
       */
      show (val) {
        this.isShowModal = val
      }
    },
    computed: {
      ...mapGetters([
        'userData',
        'isLogin'
      ])
    },
    methods: {
      ...mapMutations({
        setUserDate: 'SET_USERDATA',
        setIsLogin: 'SET_ISLOGIN'
      }),
      /**
       *点击自定义按钮时触发
       * @param event
       */
      handle () {
        if (this.value.oldPasswor == '') {
          this.$Message.error('请输入原密码')
          return
        }
        if (this.value.passWord == '') {
          this.$Message.error('请输入新密码')
          return
        }
        if (this.value.newPassword == '') {
          this.$Message.error('请输入确认密码')
          return
        }
        if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/.test(this.value.password)) {
          this.$Message.error('密码必须为6-30位字母、数字组合')
          return
        }
        if (this.value.password != this.value.newPassword) {
          this.$Message.error('修改的两次密码输入不一致')
          return
        }
        const _params = {
          id: this.userData.userId,
          passWord: this.value.oldPassword,
          newPassWord: this.value.password
        }
        this.requestAjax('POST', 'updatePwd', _params).then((data) => {
          if (data.success) {
            setIsLogin(false)
            this.setIsLogin(false)
            this.setUserDate(null)
            setUserInfo(null)
            this.$Notice.success({
              title: '修改成功,3秒后将退回首页',
              duration: 3
            })
            setTimeout(() => {
              this.routePush('/login', '', '', {oldPath: this.$route.path})
            }, 3 * 1000)
          } else {
            this.$Message.error('修改失败')
          }
        }, () => {
          this.$Message.error('修改失败')
        })
      },
      /**
       *点击取消时触发
       */
      cancel () {
        this.$emit('cancel')
      }
    }
  }
</script>
