<template>
  <div class="wrapper wrapper-box">
   <!-- <Affix :offset-top="10" style="padding:5px 0px;">-->
      <Row type="flex" :gutter=5 class="m-b15">
        <!--<列表导栏>-->
        <i-col span="12">
          <Row type="flex" justify="start">
            <i-col>
              <Button type="primary" @click="addOrModify">新增</Button>
<!--              <Button type="warning" " @click="deleteAll">删除</Button>-->
            </i-col>
          </Row>

        </i-col>
        <i-col span="12">
          <Row type="flex" justify="end">
            <i-col>
              <i-input class="width-letf" placeholder="关键字" v-model="keyWord"></i-input>
            </i-col>
            <i-col>
              <Button type="primary"  class="m-r15 m-l5" icon="ios-search" @click="searchDriver">搜索</Button>
            </i-col>
            <i-col>
              <div style="padding-top:4px; ">
                <!--<table-columns :columns="table.columns" @change="columnsChange"></table-columns>-->
              </div>
            </i-col>
          </Row>
        </i-col>
      </Row>
  <!--  </Affix>-->
    <!--table列表-->
    <i-table :columns="table.columns" :data="data" border size="small" ref="table" @on-sort-change="sortChange" @on-selection-change="selectTable" :no-data-text="loading" @on-row-dblclick="rowDbClick"></i-table>
    <!--分页-->
    <div style="text-align: right; padding-top: 5px;">
      <Page show-total show-sizer show-elevator style="display: inline-block;" placement="top"
            :total="total"
            :page-size="params.limit"
            :current="params.offset"
            @on-change="changePage"
            @on-page-size-change="changeSize"></Page>
    </div>
    <!--新增表单承载标签-->
    <input-from v-if="inputForm.show" @changeOptions="getInputVal" :options="inputForm.option" :value="inputForm.value" :modalDisabled="inputForm.modalDisabled"
                :modalshow="inputForm.modalshow"/>
    <!--详情列表承载标签-->
    <table-details v-if="tableDetails.show" :modalshow=tableDetails.modalshow :newValue=tableDetails.option  @getValue="tableDetailsMethods"></table-details>
    <Modal
      title="修改密码"
      v-model="password.isShowModal"
      :mask-closable="false"
      @on-cancel="password.isShowModal = false"
      class-name="vertical-center-modal inputForm bottom" :width="512">
      <div>
          <Row :gutter=5>
            <i-col :span="6">
              <p class="width-right m-l10"><span class="red_tip">*</span>新密码:</p>
            </i-col>
            <i-col :span="18">
              <i-input type="password" placeholder=" 请输入..." v-model="password.password"></i-input>
            </i-col>
            <i-col :span="6">
              <p class="width-right m-l10"><span class="red_tip">*</span>确认密码:</p>
            </i-col>
            <i-col :span="18">
              <i-input type="password" placeholder=" 请输入..." v-model="password.newPassword"></i-input>
            </i-col>
          </Row>
      </div>
      <div slot="footer">
        <i-button type="ghost" @click="password.isShowModal = false">取消</i-button>
        <i-button type="primary" @click="handle">确认</i-button>
      </div>
    </Modal>
  </div>
</template>
<script>
 import inputFrom from 'components/modal/inputFrom.vue'
 import tableDetails from 'components/modal/tableDetails.vue'
 import tableColumns from 'components/table-columns'

 import {columnsMixin } from 'mixins/columnsMixin'
  export default {
    mixins: [columnsMixin],
    destroyed () {
      window.onresize = function () {}
      clearInterval(this.timer)
    },
    data () {
      return {
        table:{
          url: 'members',
          columns: [
            {title: '头像昵称',
              show: true,
              sortable: true,
              width: 160,
              render: (h, params) => {
                return h('div',
                  { 'class': 'td-render',
                    domProps: {
                      title: params.row.name ? params.row.name : params.row.nickName}}, [
                    h('Avatar', {
                      style: {marginRight: '5px'},
                      props: {
                        src: params.row.img
                      }
                    }),
                    h('span', params.row.name ? params.row.name : params.row.nickName)
                  ])
              }},
            {title: '姓名', show: true, key: 'name', width: 100, sortable: true, render: this.tdRender},
            {title: '性别', show: true, key: 'sex', width: 80, sortable: true, render: this.tdRender},
            {title: '手机号', show: true, key: 'phone', width: 160, sortable: true, render: this.tdRender},
            {title: '公司', show: true, key: 'company', sortable: true, render: this.tdRender},
            {title: '职位', show: true, key: 'position', sortable: true, render: this.tdRender},
            {title: '微信uniconID', show: true, key: 'wechatNumber', width: 160, sortable: true, render: this.tdRender},
            {title: '状态', show: true, width: 80, sortable: true, render: (h, params) => {
                return h('div', [
                  h('span', params.row.status == 0 ? "禁用": "启用")
                ])
              }},
            {title: '创建时间', width: 140, show: true, sortable: true, render: (h, params) => {
                return h('div', [
                  h('span', this.formatterObjTime(params.row.createTime))
                ])
              }},
            {title: '操作',
              show: true,
              width: 180,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    style: {marginRight: '5px'},
                    props: {type: 'primary', size: 'small'},
                    nativeOn: {
                      click: () => {
                        this.addOrModify(params.row, '修改')
                      }
                    }
                  }, '修改'),
                  h('Button', {
                    style: {marginRight: '5px'},
                    props: {type: params.row.status == 1 ? 'warning' : 'success', size: 'small'},
                    nativeOn: {
                      click: () => {
                        this.requestAjax('post', 'members', {id: params.row.id, status: params.row.status == 1 ? 0 : 1}).then((data) => {
                          if (data.success) this.loadTable()
                        })
                      }
                    }
                  }, params.row.status == 1 ? '禁用' : '启用'),
                  h('Button', {
                    style: {marginRight: '5px'},
                    props: {type: 'error', size: 'small'},
                    nativeOn: {
                      click: () => {
                        this.password.password = ''
                        this.password.newPassword = ''
                        this.checkUser = params.row
                        this.password.isShowModal = true
                      }
                    }
                  }, '重置')
                ])
              }
            }
          ],
        },
        clickType: '',
        inputForm: {
          show: false,
          modalDisabled: false,
          modalshow: false,
          option: {},
          value: {}
        }, // 表单参数
        tableDetails: {
          show: false,
          modalshow: false,
          option: {}
        }, // 详情参数
        timer: {},
        checkUser: '',
        password: {
          isShowModal: false,
          password: '',
          newPassword: ''
        }
      }
    },
    computed: {},
    components: {
       inputFrom,
       tableDetails,
       tableColumns
    },
    methods: {
      /**
       *双击表格列时触发
      */
      rowDbClick (row) {
        this.rowDetails(row)
      },
      /**
       * 监听事件table选中事件
       */
      selectTable (val) {
        this.selectRows = val
      },

      /**
       *查看详情
       */
      rowDetails (row) {
        this.tableDetails.show = true
        this.tableDetails.modalshow = true
        this.tableDetails.option = {
          title: '人员详情',
          width: '768',
          tabPane: false,
          uEditor: false,
          rowId: '',
          opintions: [
            [
              {title: '姓名', value: row.name, show: true, type: ''},
              {title: '昵称', value: row.nickName, show: true, type: ''}
            ],
            [
              {title: '手机', value: row.phone, show: true, type: ''},
              {title: '微信号', value: row.wechatNumber, show: true, type: ''}
            ],
            [
              {title: '状态', value: row.status == 0 ? "禁用": "启用", show: true, type: ''},
              {title: '角色', value: this.getRole(row.role), show: true, type: ''}
            ],
            [
              {title: '邮箱', value: row.email, show: true, type: ''},
              {title: '性别', value: row.sex, show: true, type: ''}
            ],
            [
              {title: '公司', value: row.company, show: true, type: ''},
              {title: '部门', value: row.position, show: true, type: ''}
            ]
          ],
          button: [
//                        {type: 'primary', title: '提交', click: 'handle'}
          ]
        }
      },
      /**
       *隐藏详情
       */
      tableDetailsMethods (val) {
        this.tableDetails.modalshow = false
      },
      /**
       *新增或修改用户
       */
      addOrModify (row, type) {
        let _b = false
        if (type === '修改') {
          this.clickType = '修改'
          _b = true
        } else {
          this.clickType = '新增'
        }
        this.inputForm.modalshow = true
        this.inputForm.show = true
        this.inputForm.modalDisabled = false
        this.inputForm.option = {
          title: _b ? '修改用户' : '新增用户',
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
          button: _b ? [{
            type: 'primary',
            title: '修改',
            click: 'handle'
          }] : [{
            type: 'primary',
            title: '提交',
            click: 'handle'
          }]
        }
        this.inputForm.value = {
          name: _b ? row.name : '',
          nickName: _b ? row.nickName : '',
          phone: _b ? row.phone : '',
          sex: _b ? '' + row.sex : '',
          status: _b ? row.status : 1,

          wechatNumber: _b ? row.wechatNumber : '',
          company: _b ? row.company : '',
          position: _b ? '' + row.position : '',
        }
        if (_b) {
          this.inputForm.value.id = row.id
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
        console.log(newVal)
        return
        switch (this.clickType) {
          case '新增':
          case '修改':
            this.submitAjax('members', newVal)
            break
          default:
        }
        this.inputForm.modalDisabled = true
      },
      /**
       * 提交表单
       * @param url
       * @param obj
       */
      submitAjax (url, obj) {
        this.requestAjax('POST', url, obj).then((data) => {
          if (data.success) {
            this.$Message.success(this.clickType + '用户成功')
            this.inputForm.modalshow = false
            this.loadTable()
          } else {
            if (this.clickType == '新增') {
              this.$Message.success(data.desc)
            } else {
              this.$Message.success(this.clickType + '用户失败')
            }
          }
          this.inputForm.modalDisabled = false
        }, (err) => {
          this.$Message.success(this.clickType + '用户失败')
          this.inputForm.modalDisabled = false
        })
      },
      /**
       * 批量删除
       */
      deleteAll () {
        if (this.selectRows === '' || this.selectRows.length === 0) {
          this.$Message.error('请选择要删除的用户')
          return
        }
        let id = []
        this.selectRows.forEach((item) => {
          id.push(item.id)
        })
        id = id.join(',')
        this.confirmDelete(id)
      },
      /**
       * 删除前提示
       * @param row
       */
      confirmDelete (id) {
        this.$Modal.confirm({
          title: '提示信息',
          content: '是否确认删除操作？',
          onOk: () => {
            this.deleteUserInfo(id)
          },
          onCancel: () => {

          }
        })
      },
      /**
       * 删除功能
       * @param row
       */
      deleteUserInfo (id) {
        const _type = 'DELETE'
        const _url = 'deleteMembers'
        const _params = {}
        this.requestAjax(_type, _url, _params, id).then((data) => {
            if (data.success) {
              this.$Message.success('删除成功')
              this.loadTable()
            } else {
              this.$Message.error('删除失败')
            }
        })
      },
      /**
       *密码重置
       */
      handle () {
        if (this.password.password == '') {
          this.$Message.error('请输入新密码')
          return
        }
        if (this.password.password == '') {
          this.$Message.error('请再次输入确认密码')
          return
        }
        console.log(this.password)
        if (this.password.password != this.password.newPassword) {
          this.$Message.error('修改的两次密码输入不一致')
          return
        }
        this.requestAjax('post', 'members', {id: this.checkUser.id, passWord: this.password.password}).then((data)=>{
          if (data.success) {
            this.password.isShowModal = false
            this.$Message.success('密码重置成功')
          } else {
            this.$Message.error('密码重置失败')
          }
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
        window.onresize = () => {}
        this.loadTable()
        // this.initTableScroll()
        document.querySelector('.ivu-page-options-elevator').title = '输入后回车跳至指定页'
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.loadTable()
        }, 60 * 1000)
      })
    }
  }
</script>

<style scoped>
  .wrapper{
    margin: 10px;
  }
</style>
