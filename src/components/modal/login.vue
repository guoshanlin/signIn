<style scoped>
  #login-div .lc-block:not(.lcb-alt) {padding: 0px 35px;}
  #login-div .ivu-form-item {display: block;width: 100%;margin-bottom: 24px!important;}
  #login-div  .ivu-form-item:last-child,#login-div .ivu-form-item:nth-last-child(2) {margin-bottom:0px!important;}
  #login-div .ivu-form-item-required {display: block;}
  #loginMsg,#registerMsg{color: #FF0000;margin-right: 0px;width: 200px;text-align:  right;}
  .login-div .ivu-modal-footer{border-top: 0px}
  .login-div .ivu-modal-header{border-bottom: 0px}
  .login-div .ivu-modal-content{ background-color: #e2e2de}

</style>

<template>
  <div>
    <Modal
      :title="hasUser? '登录':'注册'"
      v-model="isShowModal"
      :mask-closable="false"
      @on-cancel="cancel"
      class-name="vertical-center-modal login-div" width="560">
      <div id="login-div">
          <div v-if="hasUser" class="lc-block toggled" id="l-login">
            <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
              <FormItem prop="user">
                <i-input type="text" v-model="formInline.user" placeholder="请输入账号手机">
                  <Icon type="ios-person-outline" slot="prepend"></Icon>
                </i-input>
              </FormItem>
              <FormItem prop="password">
                <i-input type="password" v-model="formInline.password" placeholder="请输入密码">
                  <Icon type="ios-locked-outline" slot="prepend"></Icon>
                </i-input>
              </FormItem>
              <FormItem>
                <Row>
                  <i-col span="12">
                    <div class="t-left">
                      <CheckboxGroup v-model="formInline.checkbox" class="in-line">
                        <Checkbox label="remember">自动登录</Checkbox>
                      </CheckboxGroup>
                    </div>
                  </i-col>
                  <i-col span="12">
                     <div class="t-right"><a>忘记密码？</a></div>
                  </i-col>
                </Row>
                 <div v-show="loginFail" id="loginMsg" class="in-line"><Icon type="sad-outline"></Icon><span>用户名或密码不正确</span></div>
              </FormItem>
              <FormItem class="t-center">
                 <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
              </FormItem>
              <FormItem>
                <div class="t-right"><a @click="hasUser=!hasUser">{{hasUser? '免费注册' :'已有账号登录'}}</a></div>
              </FormItem>
            </Form>
          </div>
           <div v-if="!hasUser">
             <Form ref="formRegister" :model="formRegister" :rules="ruleRegister" :label-width="80">
               <FormItem label="手机号码" prop="phone">
                 <i-input type="text" v-model="formRegister.phone" placeholder="请输入您的常用手机"></i-input>
               </FormItem>
               <FormItem label="电子邮箱" prop="email">
                 <i-input type="text" v-model="formRegister.email" placeholder="请输入您的常用邮箱"></i-input>
               </FormItem>
               <FormItem label="登录密码" prop="password">
                 <i-input type="password" v-model="formRegister.password" placeholder="长度不低于6位（字母、数字组合）"></i-input>
               </FormItem>
               <FormItem label="确认密码" prop="passwordCheck">
                 <i-input type="password" v-model="formRegister.passwordCheck" placeholder="请再次输入密码"></i-input>
               </FormItem>
               <FormItem label="昵称" prop="nickName">
                 <i-input type="text" v-model="formRegister.nickName" placeholder="请输入昵称"></i-input>
               </FormItem>
               <FormItem class="t-center">
                  <Checkbox v-model="formRegister.checkbox" class="in-line">我已阅读并同意 <a> 用户隐私及服务协议</a></Checkbox>
                  <div v-show="registerMsg" id="registerMsg" class="in-line"><Icon type="sad-outline"></Icon><span>注册失败</span></div>
               </FormItem>
               <FormItem class="t-center">
                 <Button type="primary" @click="handleSubmit('formRegister')" :disabled="!formRegister.checkbox">注册</Button>
               </FormItem>
               <FormItem>
                 <div class="t-right"><a @click="hasUser=!hasUser">{{hasUser? '免费注册' :'已有账号登录'}}</a></div>
               </FormItem>
             </Form>
           </div>
        </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>

  import {setUserInfo, setIsLogin} from 'js/cache'
  import {mapMutations, mapGetters} from 'vuex'
  import utils from 'js/utils'

  export default {
    data () {
      const checkPhone = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入手机号'))
          } else if (utils.isPhone(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
            callback()
        }
      }
      const checkUserPhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户手机号'))
        } else if (utils.isPhone(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/.test(value)) {
            callback(new Error('密码必须为6-30位字母、数字组合'))
          }
          if (this.formRegister.passwordCheck !== '') {
            // 对第二个密码框单独验证
            this.$refs.formRegister.validateField('passwordCheck')
          }
          callback()
        }
      }
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.formRegister.password) {
          callback(new Error('两次密码输入不一致'))
        } else {
          callback()
        }
      }
      return {
        loginFail: false,
        registerMsg: false,
        formInline: {
          user: '',
          password: '',
          checkbox: []
        },
        formRegister: {
          phone: '',
          email: '',
          password: '',
          passwordCheck: '',
          nickName: '',
          checkbox: false
        },
        hasUser: true,
        isShowModal: true,
        ruleInline: {
          user: [
            { required: true, validator: checkUserPhone, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        ruleRegister: {
          phone: [
            { required: true, validator: checkPhone, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
          ],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          passwordCheck: [
            { required: true, validator: validatePassCheck, trigger: 'blur' }
          ],
          nickName: [
              { required: true, message: '请输入昵称', trigger: 'blur' }
            ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'userData',
        'isLogin'
      ])
    },
    destroyed () {
      document.onkeydown = () => {}
    },
    methods: {
      ...mapMutations({
        setUserDate: 'SET_USERDATA',
        setIsLogin: 'SET_ISLOGIN'
      }),
      /**
       * 登录前的验证
       * @param name
       */
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'formRegister') {
              this.register()
            } else {
              this.login()
            }
          }
        })
      },
      /**
       *
       * 登录
       */
      login () {
        const _type = 'POST'
        const _params = {
          phone: this.formInline.user,
          passWord: this.formInline.password
        }
        const _url = 'login'
        setIsLogin(false)
        this.setIsLogin(false)
        this.requestAjax(_type, _url, _params).then((data) => {
          if (data.success) {
            this.loginFail = false
            this.setIsLogin(true)
            this.setUserDate(data.data.member)
            setUserInfo(data.data.member)
            setIsLogin(true)
            this.$emit('onCancel', {login: true})
          } else {
            this.loginFail = true
          }
        })
      },
      /**
       * 隐藏modal
       */
      cancel () {
        this.$emit('onCancel')
      },
      register () {
        const _type = 'POST'
        const _params = {
          phone: this.formRegister.phone,
          passWord: this.formRegister.password,
          email: this.formRegister.email,
          nickName: this.formRegister.nickName
        }
        const _url = 'members'
        this.requestAjax(_type, _url, _params).then((data) => {
          if (data.success) {
            this.registerMsg = false
            this.$Message.success('注册成功')
            this.hasUser = true
            this.formInline.user = _params.phone
            this.formInline.password = _params.password
            this.$refs.formRegister.resetFields()
          } else {
            this.registerMsg = true
          }
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
/*        document.onkeydown = (event) => {
          var e = event || window.event
          if (e && e.keyCode === 13) {
            this.handleSubmit('formInline')
            e.preventDefault()
          }
        }*/
      })
    }
  }
</script>
