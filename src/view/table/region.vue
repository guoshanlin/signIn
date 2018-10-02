<template>
  <div class="wrapper wrapper-box">
   <!-- <Affix :offset-top="10" style="padding:5px 0px;">-->
      <Row type="flex" class="m-b15">
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
          <Row type="flex" justify="end" :gutter=5>
            <i-col>
                <Select v-model="selectVal.activity" placeholder="活动名称" style="width: 120px;" @on-change="selectTypeChange" :clearable="true">
                  <Option v-for="item in select.activity" :value="item.id" :key="item.id">{{item.name}}</Option>
                </Select>
            </i-col>
            <i-col>
                <Select v-model="selectVal.status" placeholder="采集器状态" style="width: 120px;" @on-change="selectChange" :clearable="true">
                  <Option v-for="item in select.status" :value="item.value" :key="item.value">{{item.name}}</Option>
                </Select>
            </i-col>
            <i-col>
              <i-input class="width-letf" placeholder="区域名称&采集器地址" v-model="keyWord"></i-input>
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
            {title: '活动名称', show: true, key: 'name', width: 200, sortable: true, render: this.tdRender},

            {title: '所属区域', show: true, key: 'name', sortable: true, render: this.tdRender},
            {title: '区域名称', show: true, key: 'sex', sortable: true, render: this.tdRender},
            {title: '采集器ID', show: true, key: 'phone', sortable: false, render: this.tdRender},
            {title: '采集器MAC地址', show: true, key: 'phone', sortable: false, render: this.tdRender},
            {title: '采集器状态', show: true, width: 120, sortable: true, render: (h, params) => {
                return h('div', [
                  h('span', params.row.status == 1 ? '运行中' : (Math.random() < 0.5 ? "已停止": "已结束"))
                ])
              }},
            {title: '创建时间', width: 140, show: true, sortable: false, render: (h, params) => {
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
                    props: {type: 'error', size: 'small'},
                    nativeOn: {
                      click: () => {
                        this.confirmDelete(params.row.id)
                      }
                    }
                  }, '删除'),
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
                  }, params.row.status == 1 ? '停止' : '启用')
                ])
              }
            }
          ],
        },
        select: {
          status: [
            {value: "0",name: '运行'},
            {value: "1",name: '已停止'},
            {value: "2",name: '已结束'}
          ],
          activity: [
            {id: "0",name: '活动1'},
            {id: "1",name: '活动2'},
            {id: "2",name: '活动3'},
            {id: "3",name: '活动4'}
          ]
        },
        selectVal: {
          status: '',
          activity: ''
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
        checkUser: ''
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
          title: '区域详情',
          width: '768',
          tabPane: false,
          uEditor: false,
          rowId: '',
          opintions: [
            [
              {title: '活动名称', value: row.name, show: true, type: ''},
              {title: '所属区域', value: row.nickName, show: true, type: ''}
            ],
            [
              {title: '区域名称', value: row.phone, show: true, type: ''},
              {title: '采集器ID', value: row.wechatNumber, show: true, type: ''}
            ],
            [
              {title: '采集器MAC地址', value: row.wechatNumber, show: true, type: ''},
              {title: '状态', value: row.status == 0 ? "禁用": "启用", show: true, type: ''}
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
       *新增或修改区域
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
          title: _b ? '修改区域' : '新增区域',
          width: '620',
          opintions: [
            [
              {
                title: '所属区域',
                id: 'name',
                type: 'input',
                titlespan: 6,
                colspan: 18,
                required: true
              },
              {
                title: '区域名称',
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
            this.$Message.success(this.clickType + '区域成功')
            this.inputForm.modalshow = false
            this.loadTable()
          } else {
            if (this.clickType == '新增') {
              this.$Message.success(data.desc)
            } else {
              this.$Message.success(this.clickType + '区域失败')
            }
          }
          this.inputForm.modalDisabled = false
        }, (err) => {
          this.$Message.success(this.clickType + '区域失败')
          this.inputForm.modalDisabled = false
        })
      },
      /**
       * 批量删除
       */
      deleteAll () {
        if (this.selectRows === '' || this.selectRows.length === 0) {
          this.$Message.error('请选择要删除的区域')
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
        this.params.status = this.selectVal.status
        this.loadTable()
      },
      selectTypeChange () {
        this.params.limit = 20
        this.params.offset = 1
        this.params.activity = this.selectVal.activity
        this.loadTable()
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
