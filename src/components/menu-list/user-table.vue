<template>
  <div class="wrapper wrapper-box">
    <!-- <Affix :offset-top="10" style="padding:5px 0px;">-->
    <Row type="flex" justify="end" class="m-b15">
      <i-col>
        <i-input class="width-letf" placeholder="关键字" v-model="keyWord"></i-input>
      </i-col>
      <i-col>
        <Button type="primary"  class="m-r15 m-l5" icon="ios-search" @click="searchDriver">搜索</Button>
      </i-col>
    </Row>
    <!--  </Affix>-->
    <!--table列表-->
    <i-table :columns="columns" :data="data" border size="small" ref="table" @on-sort-change="sortChange" :no-data-text="loading"></i-table>
    <!--分页-->
    <div style="text-align: right; padding-top: 5px;">
      <Page show-total show-sizer show-elevator style="display: inline-block;" placement="top"
            :total="total"
            :page-size="parms.limit"
            :current="parms.offset"
            @on-change="changePage"
            @on-page-size-change="changeSize"></Page>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        columns: [
          {title: '头像昵称',
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
          {title: '状态', render: (h, params) => {
              return h('div', [
                h('span', params.row.status == 0 ? "禁用": "启用")
              ])
            }},
          {
            title: '用户类型',
            key: 'type',
            render: (h, params) => {
              return h('div', params.row.type == 1 ? '企业' : '个人')
            }
          },
          {title: '手机', key: 'phone', sortable: false, render: this.tdRender},
          {
            title: '设置角色',
            align: 'center',
            render: (h, params) => {
              return h('Select', {
                style: {},
                props: {value: '' + params.row.roleId},
                on: {
                  'on-change': (value) => {
                     this.submitAjax('members', {roleId: value, id: params.row.id, type: 0})
                  }
                }
              }, this.getOptions(h))
            }
          }
        ],
        data: [],
        total: 0,
        keyWord: '',
        parms: {
          keyWord: '',
          limit: 20,
          offset: 1
        },
        selectRows: '',
        loading: '',
        selectOptions: []
      }
    },
    computed: {},
    methods: {
      /**
       *加载table数据
       */
      loadTable () {
        this.loading = '数据加载中...请稍等！'
        const _type = 'GET'
        const _params = this.parms
        const _url = 'members'
        this.requestAjax(_type, _url, _params).then((data) => {
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
       *排序
       * @param obj
       */
      sortChange (obj) {
        this.parms.sort = obj.key
        this.parms.order = obj.order
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
       * 提交表单
       * @param url
       * @param obj
       */
      submitAjax (url, obj) {
        this.requestAjax('POST', url, obj).then((data) => {
          if (data.success) {
            this.$Message.success('用户角色修改成功')
            this.loadTable()
          } else {
              this.$Message.success('用户角色修改失败')
          }
        }, () => {
          this.$Message.success( '用户角色修改失败')
        })
      },
      loadTableRole () {
        this.selectOptions = []
        this.requestAjax('GET', 'baseRoles', this.parms).then((data) => {
          if (data.success) {
            data.data.rows.forEach((item) => {
              this.selectOptions.push({value: item.id, label: item.name})
            })
          }
        })
      },
      getOptions (h) {
        let option = []
        this.selectOptions.forEach((item) => {
          option.push(h('Option', {
            props: {value: item.value, key: item.value}
          }, item.label))
        })
        return option
      }
    },
    created () {
      this.$nextTick(() => {
        this.loadTableRole()
        this.loadTable()
      })
    }
  }
</script>

<style scoped>
  .wrapper{
    margin: 10px;
  }
</style>
