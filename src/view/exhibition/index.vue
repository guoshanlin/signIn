<template>
  <div class="wrapper wrapper-box">
    <h3 class="fz14">展台管理</h3>
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
          </Row>

        </i-col>
        <i-col span="12">
          <Row type="flex" justify="end" :gutter=5>
            <i-col>
                <Select v-model="selectVal.type" placeholder="类型" style="width: 120px;" @on-change="selectTypeChange" :clearable="true">
                  <Option v-for="item in select.type" :value="item.value" :key="item.value">{{item.name}}</Option>
                </Select>
            </i-col>
            <i-col>
              <i-input class="width-letf" placeholder="展台编号&名称" v-model="keyWord"></i-input>
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
            {title: '编号', show: true, key: 'name', width: 120, sortable: true, render: this.tdRender},

            {title: '名称', show: true, key: 'sex', sortable: true, render: this.tdRender},
            {title: '分类', show: true, width: 80, sortable: true, render: (h, params) => {
                return h('div', [
                  h('span', params.row.type == 1 ? '参会者' : '志愿者')
                ])
              }},
            {title: '公司', show: true, key: 'sex', sortable: true, render: this.tdRender},
            {title: '标签', show: true, key: 'sex', sortable: true, render: this.tdRender},
            {title: '简介', show: true, key: 'phone', sortable: false, render: this.tdRender},
            {title: '创建时间', width: 140, show: true, sortable: false, render: (h, params) => {
                return h('div', [
                  h('span', this.formatterObjTime(params.row.createTime))
                ])
              }},
            {title: '创建人', width: 140,show: true, key: 'phone', sortable: false, render: this.tdRender},
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
                    props: {type: 'primary', size: 'small'},
                    nativeOn: {
                      click: () => {
                        this.routePush('/base/exhibitionDetails', params.row.id)
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
          type: [
            {value: "0",name: '人工智能'},
            {value: "1",name: '大数据'},
            {value: "2",name: '云计算'}
          ]
        },
        selectVal: {
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
       *新增或修改展台
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
          title: _b ? '修改展台' : '新增展台',
          width: '820',
          opintions: [
            [
              {
                title: '展台编号',
                id: 'number',
                type: 'input',
                titlespan: 3,
                colspan: 9,
                required: true
              },
              {
                title: '展台名称',
                id: 'name',
                type: 'input',
                titlespan:3,
                colspan: 9,
                required: true
              }
            ],
            [
              {title: '海报', id: 'fileImg', type: 'fileImg',url: 'fileImgUrl',  titlespan: 3, colspan: 21, required: false, placeholder: '请上传头像照片'}
            ],
            [
              {
                title: '所属分类',
                id: 'type',
                type: 'select',
                titlespan: 3,
                colspan: 9,
                required: false
              },
              {
                title: '公司',
                id: 'company',
                type: 'input',
                titlespan:3,
                colspan: 9,
                required: false
              }
            ],
            [
              {
                title: '标签',
                id: 'tag',
                type: 'select',
                titlespan: 3,
                colspan: 21,
                required: false
              }
            ],
            [
              {
                title: '简介',
                id: 'synopsis',
                type: 'textarea',
                titlespan: 3,
                colspan: 21,
                required: false
              }
            ],
            [
              {
                title: '详情',
                id: 'details',
                type: 'textarea',
                titlespan: 3,
                rowsNub: 4,
                colspan: 21,
                required: false
              }
            ],
            [
              {title: '附件', id: 'materialFile', type: 'file', titlespan: 3, colspan: 21, required: false, accept: '*'}
            ],

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
          number: _b ? row.number : '',
          name: _b ? row.name : '',
          fileImg: '',
          fileImgUrl: '<div style="height:150px; line-height: 150px" class="c3 td-render">大小不超过4M</div>',

          type: _b ? row.type : '',
          company: _b ? row.company : '',
          tag: _b ? row.tag : '',
          synopsis: _b ? row.synopsis : '',
          details: _b ? row.details : '',
          materialFile: ''
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
            this.$Message.success(this.clickType + '展台成功')
            this.inputForm.modalshow = false
            this.loadTable()
          } else {
            if (this.clickType == '新增') {
              this.$Message.success(data.desc)
            } else {
              this.$Message.success(this.clickType + '展台失败')
            }
          }
          this.inputForm.modalDisabled = false
        }, (err) => {
          this.$Message.success(this.clickType + '展台失败')
          this.inputForm.modalDisabled = false
        })
      },
      /**
       * 批量删除
       */
      deleteAll () {
        if (this.selectRows === '' || this.selectRows.length === 0) {
          this.$Message.error('请选择要删除的展台')
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
