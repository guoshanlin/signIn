<template>
  <div class="wrapper wrapper-box">
    <h3 class="fz14">人员管理</h3>
    <div class="content-wrapper m-t10 wrapper-border m-t20">
      <Row type="flex">
        <!--<列表导栏>-->
        <i-col span="12">
          <Row type="flex" justify="start" :gutter=5>
            <i-col>
              <Button type="primary" @click="addOrModify">新增</Button>
            </i-col>
            <i-col>
              <Upload :action="getWbkUrl('upload')" :before-upload="handleUpload">
                <Button type="primary">导入</Button>
              </Upload>
            </i-col>
            <i-col>
              <Button type="primary" @click="hardware">分发硬件</Button>
            </i-col>
          </Row>

        </i-col>
        <i-col span="12">
          <Row type="flex" justify="end" :gutter=5>
            <i-col>
                <Select v-model="selectVal.type" placeholder="人员类型" style="width: 120px;" @on-change="selectTypeChange" :clearable="true">
                  <Option v-for="item in select.type" :value="item.value" :key="item.value">{{item.name}}</Option>
                </Select>
            </i-col>
            <i-col>
                <Select v-model="selectVal.signIn" placeholder="签到状态" style="width: 120px;" @on-change="selectChange" :clearable="true">
                  <Option v-for="item in select.signIn" :value="item.value" :key="item.value">{{item.name}}</Option>
                </Select>
            </i-col>
            <i-col>
              <i-input class="width-letf" placeholder="姓名&手机&硬件ID" v-model="keyWord"></i-input>
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
    </div>
    <div class="content-wrapper m-t10 wrapper-border m-t20">
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
    </div>
    <!--新增表单承载标签-->
    <input-from v-if="inputForm.show" @changeOptions="getInputVal" :options="inputForm.option" :value="inputForm.value" :modalDisabled="inputForm.modalDisabled"
                :modalshow="inputForm.modalshow"/>
  </div>
</template>
<script>
  import inputFrom from 'components/modal/inputFrom.vue'
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
            {title: '姓名', show: true, key: 'name', width: 120, sortable: true, render: this.tdRender},

            {title: '性别', show: true, key: 'sex',width: 80, sortable: true, render: this.tdRender},
            {title: '类型', show: true, width: 80, sortable: true, render: (h, params) => {
                return h('div', [
                  h('span', params.row.type == 1 ? '参会者' : '志愿者')
                ])
              }},
            {title: '手机', show: true, key: 'phone', width: 120, sortable: true, render: this.tdRender},
            {title: '公司', show: true, key: 'sex', sortable: true, render: this.tdRender},
            {title: '职位', show: true, key: 'sex', sortable: true, render: this.tdRender},
            {title: '签到状态', show: true, key: 'phone', sortable: false, render: this.tdRender},
            {title: '签到时间', width: 140, show: true, sortable: false, render: (h, params) => {
                return h('div', [
                  h('span', this.formatterObjTime(params.row.createTime))
                ])
              }},
            {title: '硬件ID', show: true, key: 'phone', sortable: false, render: this.tdRender},
            {title: '操作',
              show: true,
              width: 100,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    style: {marginRight: '5px'},
                    props: {type: 'primary', size: 'small'},
                    nativeOn: {
                      click: () => {
                        this.routePush('/base/userDetails', params.row.id)
                      }
                    }
                  }, '详情')
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
        select: {
          signIn: [
            {value: "0",name: '未签到'},
            {value: "1",name: '已签到'}
          ],
          type: [
            {value: "0",name: '参会者'},
            {value: "1",name: '志愿者'},
            {value: "2",name: '记者'},
            {value: "3",name: '嘉宾'}
          ]
        },
        selectVal: {
          signIn: '',
          type: ''
        },
        timer: {},
        checkUser: ''
      }
    },
    computed: {},
    components: {
      inputFrom,
      tableColumns
    },
    methods: {
      /**
       *双击表格列时触发
       */
      rowDbClick (row) {
        // this.rowDetails(row)
      },
      /**
       * 监听事件table选中事件
       */
      selectTable (val) {
        this.selectRows = val
      },
      /**
       *新增或修改人员
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
          title: _b ? '修改人员' : '新增人员',
          width: '620',
          opintions: [
            [
              {
                title: '所属人员',
                id: 'name',
                type: 'input',
                titlespan: 6,
                colspan: 18,
                required: true
              },
              {
                title: '人员名称',
                id: 'nickName',
                type: 'input',
                titlespan: 6,
                colspan: 18,
                required: true
              }
            ],
            [
              {
                title: '活动名称',
                id: 'nickName',
                type: 'select',
                titlespan: 6,
                colspan: 18,
                required: true
              },
              {
                title: '采集器ID',
                id: 'sex',
                type: 'input',
                titlespan:6,
                colspan: 18,
                required: false,
                relation: ''
              }
            ],
            [
              {
                title: '采集器MAC地址',
                id: 'wechatNumber',
                type: 'input',
                titlespan: 6,
                colspan: 18,
                required: false
              }
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
       *分发硬件
       */
      hardware () {
        this.clickType = 'hardware'
        this.inputForm.modalshow = true
        this.inputForm.show = true
        this.inputForm.modalDisabled = false
        this.inputForm.option = {
          title: '分发硬件',
          width: '620',
          opintions: [
            [
              {
                title: '手机号&用户ID',
                id: 'name',
                type: 'input',
                titlespan: 6,
                colspan: 18,
                required: true
              },
              {
                title: '硬件ID',
                id: 'nickName',
                type: 'input',
                titlespan: 6,
                colspan: 18,
                required: true
              }
            ]
          ],
          button:  [{
            type: 'primary',
            title: '确定',
            click: 'handle'
          }]
        }
        this.inputForm.value = {
          name: '',
          nickName: ''
        }
      },
      /**
       *提交返回处理方法
       * @param val
       * @param type
       */
      getInputVal (val, type) {
        this.inputForm.value = val  // 表单填写的内容;
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
          case 'hardware':
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
            this.$Message.success(this.clickType != 'hardware' ? this.clickType + '人员成功' : '分发硬件成功')
            this.inputForm.modalshow = false
            this.loadTable()
          } else {
            if (this.clickType == '新增') {
              this.$Message.success(data.desc)
            } else {
              this.$Message.success(this.clickType != 'hardware' ? this.clickType + '人员失败' : '分发硬件失败')
            }
          }
          this.inputForm.modalDisabled = false
        }, (err) => {
          this.$Message.success(this.clickType != 'hardware' ? this.clickType + '人员失败' : '分发硬件失败')
          this.inputForm.modalDisabled = false
        })
      },
      /**
       * 批量删除
       */
      deleteAll () {
        if (this.selectRows === '' || this.selectRows.length === 0) {
          this.$Message.error('请选择要删除的人员')
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
      selectChange () {
        this.params.limit = 20
        this.params.offset = 1
        this.params.signIn = this.selectVal.signIn
        this.loadTable()
      },
      selectTypeChange () {
        this.params.limit = 20
        this.params.offset = 1
        this.params.type = this.selectVal.type
        this.loadTable()
      },
      /**
       * 上传文件
       * @param file
       * @returns {boolean}
       */
      handleUpload (file) {
        let arr = file.name.split('.')
        if (['xls', 'xlsx', 'xlsm', 'xlt', 'xltx', 'xltm'].indexOf(arr[arr.length - 1]) === -1) {
          this.$Message.error(file.name + '非excel文件，不能导入')
          return false
        }
        return false
        let formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'account')
        this.requestFile('POST', 'vipsUpload', formData).then((data) => {
          if (data.success) {
            this.$Message.success('导入成功')
            this.requestGuestList()
          } else {
            this.$Message.error('导入失败')
          }
        },(err) => {
          this.$Message.error('导入失败')
        })
        return false
      },
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
