<template>

  <div class="wrapper-content clearFix">
    <div class="fl cloud-left-menu">
        <div class="user-pic-wrapper posct">
          <img src="../../assets/logo_core.gif">
        </div>
        <Menu theme="dark" ref="refName" :active-name="activeNenu" width="160px"  class="menu-wrapper menu-wrapper-scroll c2" @on-select="changeMenu">
          <template v-for="(item,i) in menuList">
            <MenuItem :name="item.path" :key="i"><Icon :type="item.icon"></Icon>{{item.title}}</MenuItem>
          </template>
        </Menu>
    </div>
    <div class="fr app-content">
      <div class="app-header c3">
        <Row type="flex" justify="end">
          <!--<i-col class="header-col"><a class="hover-c3" @click="routePush('/index')">返回首页</a></i-col>-->
          <i-col class="header-col">
            <Dropdown @on-click="handleSubmit" placement="bottom-end">
              <a href="javascript:void(0)" class="hover-c3">{{userData.nickName}}<Icon type="arrow-down-b"></Icon></a>
              <DropdownMenu slot="list">
                <DropdownItem name="my">个人信息</DropdownItem>
                <DropdownItem name="password" divided>修改密码</DropdownItem>
                <DropdownItem  name="logout" divided>退出</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </i-col>
        </Row>
      </div>
      <div class="content-router">
        <router-view></router-view>
      </div>
    </div>
    <i-password :show="passModalShow" @cancel="passModalShow = false"></i-password>
    <input-from v-if="inputForm.show" @changeOptions="getInputVal" :options="inputForm.option" :value="inputForm.value" :modalDisabled="inputForm.modalDisabled"
                :modalshow="inputForm.modalshow"/>
  </div>

</template>

<script>
  import {setIsLogin, setUserInfo} from 'js/cache'
  import {mapMutations, mapGetters} from 'vuex'
  import iPassword from 'components/modal/password'
  import inputFrom from 'components/modal/inputFrom.vue'

  export default {
    data () {
      return {
        activeNenu: this.$route.path,
        menuList:[
          {icon: 'android-walk', path: '/meeting', title: '活动'},
          {icon: 'person', path: '/role', title: '人员'},
          {icon: 'android-globe', path: '/region', title: '区域'}
        ],
        passModalShow: false,
        inputForm: {
          show: false,
          modalDisabled: false,
          modalshow: false,
          option: {},
          value: {}
        } // 表单参数
      }
    },
    created () {
      // setTimeout(() => {
      //   if (!this.isLogin) {
      //     this.$Message.error('请先登入')
      //     this.routePush('/index')
      //   }
      // }, 20)
    },
    components: {
      iPassword,
      inputFrom
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
      changeMenu (name) {
        this.routePush(name)
      },
      /**
       *
       * 退出登录
       */
      logout () {
        const _type = 'POST'
        const _params = {}
        const _url = 'logout'
        this.requestAjax(_type, _url, _params).then((res) => {
          setIsLogin(false)
          this.setIsLogin(false)
          this.setUserDate(null)
          setUserInfo(null)
          this.routePush('/login')
        }, () => {
          setIsLogin(false)
          this.setIsLogin(false)
          this.setUserDate(null)
          setUserInfo(null)
          this.routePush('/login')
        })
      },
      handleSubmit (name) {
        switch ('' + name) {
          case 'logout': // 退出登录
            this.logout()
            break
          case 'password': // 修改密码
           this.passModalShow = true
            break
          case 'my': // 个人信息
            this.addOrModify(this.userData)
            break
          default:
        }
      },
      /**
       *新增或修改用户
       */
      addOrModify (row) {
        this.inputForm.modalshow = true
        this.inputForm.show = true
        this.inputForm.modalDisabled = false
        this.inputForm.option = {
          title: '个人信息',
          width: '768',
          opintions: [
            [
              {
                title: '姓名',
                id: 'name',
                type: 'input',
                titlespan: 3,
                colspan: 9,
                required: true
              },
              {
                title: '昵称',
                id: 'nickName',
                type: 'input',
                titlespan: 3,
                colspan: 9,
                required: true
              }
            ],
            [
              {
              title: '性别',
              id: 'sex',
              type: 'select',
              titlespan: 3,
              colspan: 9,
              required: false,
              relation: ''
            },
              {
                title: '手机',
                id: 'phone',
                type: 'input',
                titlespan: 3,
                colspan: 9,
                required: true,
                valueType: 'mobilePhone'
              }
            ],
            [
              {
                title: '微信号',
                id: 'wechatNumber',
                type: 'input',
                titlespan: 3,
                colspan: 9,
                required: false
              },
              {
                title: '状态',
                id: 'status',
                type: 'select',
                titlespan: 3,
                colspan: 9,
                relation: '',
                disabled: true,
                required: false
              }
            ],
            [
              {
                title: '公司',
                id: 'company',
                type: 'input',
                titlespan: 3,
                colspan: 9,
                required: false
              },
               {
                 title: '职位',
                   id: 'position',
                 type: 'input',
                 titlespan: 3,
                 colspan: 9,
                 required: false
               },
            ]
          ],
          button: [{
            type: 'primary',
            title: '修改',
            click: 'handle'
          }]
        }
        this.inputForm.value = {
          name: row.name,
          nickName: row.nickName,
          phone: row.phone,
          sex: row.sex,
          status: row.status ? row.status  : 1,
          company: row.company,
          position: row.position,
          wechatNumber: row.wechatNumber,
          id: row.id
        }
      },
      /**
       *提交返回处理方法
       * @param val
       * @param type
       */
      getInputVal (val, type) {
        this.inputForm.value = val // 表单填写的内容;
        if (type === 'cancel') { // 按钮操作
          this.inputForm.modalshow = false // 隐藏modal
          return
        }
        let newVal = {}
        Object.assign(newVal, val)
        this.inputForm.modalDisabled = true
        this.requestAjax('post', 'cst_user_members', newVal).then((data) => {
          if (data.success) {
            this.$Message.success('修改信息成功')
            let _obj = {}
            Object.assign(_obj, this.userData, newVal)
            this.setUserDate(_obj)
            setUserInfo(_obj)
            this.inputForm.modalshow = false
          } else {
            this.$Message.success('修改信息失败')
          }
          this.inputForm.modalDisabled = false
        }, () => {
          this.$Message.success('修改信息失败')
          this.inputForm.modalDisabled = false
        })
      },
      getMenuList () {
        this.menuList = []
        this.requestAjax('GET', 'getRoleMemu', {roleId: this.userData.roleId ? this.userData.roleId : 'BI1O43PZD2EC7JQO'}).then((data) => {
          if (data.success) {
            data.data.forEach((item) => {
              this.menuList.push({icon: item.icon, path: item.url, title: item.name})
            })
            this.$nextTick(() => {
              this.$refs.refName.updateActiveName()
              this.initScroll(document.querySelectorAll('.menu-wrapper-scroll'))
            })
          }
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.$refs.refName.updateActiveName()
          this.initScroll(document.querySelectorAll('.menu-wrapper-scroll'))
        })
        // this.getMenuList()
      })
    }
  }
</script>

<style scoped>
  .wrapper-content{
    min-width: 1060px;
    height: 100%;
  }

  .app-header{
    position: relative;
    z-index: 999;
    width: 100%;
    height: 50px;
    box-shadow: 0 2px 20px 0 rgba(15,12,70,.1);
    line-height: 50px;
    background-color: rgba(212,156,156,.3);
  }
  .header-col{
    margin-right: 24px;
  }
  .app-content{
    width: calc(100% - 165px);
    height: 100%;
    background-color: #f8f8f8;
    background-repeat: repeat;
    background-size: inherit;
    background-attachment: fixed;
    background-position: center center;
    background-image: url(../../assets/u27.jpg);
  }
  .cloud-left-menu{
    height: 100%;
    width: 160px;
    background: #F2F2F2;
  }
  .user-pic-wrapper{
    height: 140px;
  }
  .user-pic-wrapper img{
    width: 140px;
  }

  .menu-wrapper{
    background: #F2F2F2;
    height: calc(100% - 140px);
    overflow-x:auto ;
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title {
    color: #333;
  }
  .content-router{ height: calc(100% - 50px); overflow: auto}
</style>
