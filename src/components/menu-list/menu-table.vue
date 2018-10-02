<template>
  <div class="wrapper wrapper-box">
    <Row type="flex" :gutter=5 class="m-b10">
        <!--<列表导栏>-->
        <i-col span="12">
          <Row type="flex" justify="start">
            <i-col>
              <Button type="primary" @click="addOrModify">新增</Button>
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
          </Row>
        </i-col>
      </Row>
    <i-table :columns="columns" :data="data"
               border size="small" ref="table"  :no-data-text="loading"></i-table>
    <div style="text-align: right; padding-top: 5px;">
        <Page show-total show-sizer show-elevator style="display: inline-block;" placement="top"
              :total="total"
              :page-size="parms.limit"
              :current="parms.offset"
              @on-change="changePage"
              @on-page-size-change="changeSize"></Page>
      </div>
    <!--新增表单承载标签-->
    <input-from v-if="inputForm.show" @changeOptions="getInputVal" :options="inputForm.option" :value="inputForm.value" :modalDisabled="inputForm.modalDisabled"
                :modalshow="inputForm.modalshow"/>
  </div>
</template>
<script>
  import inputFrom from 'components/modal/inputFrom.vue'
  import {mapGetters} from 'vuex'
  export default {
    destroyed () {
      window.onresize = function () {}
    },
    data () {
      return {
        columns: [
          {title: '菜单名称', key: 'name', render: this.tdRender},
          {title: '菜单路径', key: 'url', render: this.tdRender},
          {title: '菜单图标', key: 'icon', render: this.tdRender},
          {title: '优先级', key: 'priority', render: this.tdRender},
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              return h('div', [
                h('span', params.row.status == '0' ? '不可用' : '可用')
              ])
            }},
          {
            title: '操作',
            align: 'center',
            width: 140,
            render: (h, params) => {
              return h('div',
                [
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
                    props: {type: params.row.status == '0' ? 'success': 'warning', size: 'small'},
                    nativeOn: {
                      click: () => { // warning
                        this.setStatus({id: params.row.id, code: '1', status: params.row.status == '0' ?  '1' : '0'}, params.row.status == '0' ? '启用': '禁用')
                      }
                    }
                  }, params.row.status == '0' ? '启用' : '禁用')
                  // h('Button', {
                  //   style: {marginRight: '5px', marginTop: '8px'},
                  //   props: {type: 'error', size: 'small'},
                  //   nativeOn: {
                  //     click: () => {
                  //       this.confirmDelete(params.row.id)
                  //     }
                  //   }
                  // }, '删除')
                ])
            }
          }
        ],
        data: [],
        total: 0,
        keyWord: '',
        parms: {
          keyWord: '',
          limit: 20,
          sort: 'priority',
          offset: 1
        },
        loading: '',
        clickType: '',
        inputForm: {
          show: false,
          modalDisabled: false,
          modalshow: false,
          option: {},
          value: {}
        } // 表单参数
      }
    },
    computed: {
      ...mapGetters([
        'userData'
      ])
    },
    components: {
      inputFrom
    },
    methods: {
      /**
       *加载table数据
       */
      loadTable () {
        this.loading = '数据加载中...请稍等！'
        this.requestAjax('GET', 'baseMenus', this.parms).then((data) => {
          if (data.success) {
            this.total = !isNaN(+data.data.total) ? +data.data.total : 0
            this.loading = '暂无数据'
            this.data = data.data.rows
          } else {
            this.loading = '暂无数据'
            this.data = []
          }
        })
      },
      /**
       *跳页
       * @param v
       */
      changePage (v) {
        this.parms.offset = v
        this.loadTable()
      },
      /**
       *改变页面展示用户条数
       * @param v
       */
      changeSize (v) {
        this.parms.limit = v
        this.loadTable()
      },

      /**
       * 模糊查询
       *
       */
      searchDriver () {
        this.parms.keyWord = this.keyWord
        this.parms.limit = 20
        this.parms.offset = 1
        this.loadTable()
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
          title: _b ? '修改菜单' : '新增菜单',
          width: '520',
          opintions: [
            [
              {title: '菜单名称', id: 'name', type: 'input', titlespan: 6, colspan: 18, required: false}
            ],
            [
              {title: '菜单路径', id: 'url', type: 'input', disabled: false, titlespan: 6, colspan: 18, required: false}
            ],
            [
              {title: '菜单图标', id: 'icon', type: 'input', titlespan: 6, colspan: 18, required: false}
            ],
            [
              {title: '优先级', id: 'priority', type: 'input', titlespan: 6, colspan: 18, required: false}
            ]
          ],
          button: [{type: 'primary', title: _b ? '修改' : '提交', click: 'handle'}]
        }

        this.inputForm.value = {
          name: _b ? row.name : '',
          url: _b ? row.url : '',
          icon: _b ? row.icon : '',
          priority: _b ? row.priority : '',
          status: 1
        }
        if (_b) {
          this.inputForm.value.id = row.id
          this.inputForm.value.status = row.status
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
        this.submitAjax(newVal)
      },
      /**
       * 提交表单
       * @param obj
       */
      submitAjax (obj) {
        this.requestAjax('post', 'baseMenus', obj).then((data) => {
          if (data.success) {
            this.$Message.success(this.clickType + '菜单成功')
            this.inputForm.modalshow = false
            this.loadTable()
          } else {
            if (this.clickType == '新增') {
              this.$Message.success(data.desc)
            } else {
              this.$Message.success(this.clickType + '菜单失败')
            }
          }
          this.inputForm.modalDisabled = false
        }, (err) => {
          this.$Message.success(this.clickType + '菜单失败')
          this.inputForm.modalDisabled = false
        })
      },
      /**
       * 提交表单
       * @param obj
       */
      setStatus (obj, msg) {
        this.requestAjax('post', 'baseMenus', obj).then((data) => {
          if (data.success) {
            this.$Message.success(msg + '菜单成功')
            this.loadTable()
          } else {
            this.$Message.success(msg + '菜单失败')
          }
        }, (err) => {
          this.$Message.success(msg + '菜单失败')
        })
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
        this.requestAjax('DELETE', 'baseMenusId', {}, id).then((data) => {
          if (data.success) {
            this.$Message.success('删除成功')
            this.loadTable()
          } else {
            this.$Message.error('删除失败')
          }
        })
      }
    },
    created () {
      // this.parms.memberId = this.userData.id
      this.$nextTick(() => {
        this.loadTable()
      })
    }
  }
</script>

<style scoped>
  .wrapper{
    margin: 10px;
  }
  .ivu-menu-horizontal{ height: 40px; line-height: 40px;}
</style>
