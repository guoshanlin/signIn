<template>
  <div class="b wrapper-box">
    <h3 class="fz14">人员详情</h3>
    <div class="content-wrapper wrapper-border m-t20">
      <h3>人员信息</h3>
      <Table class="m-t10" border ref="$table" :columns="col" :data="tableData"></Table>
    </div>
    <div class="content-wrapper m-t10 wrapper-border">
      <div class="fbox m-b10">
        <div class="flex">
          <h3>硬件信息</h3>
        </div>
        <div>
          <Button type="primary" @click="binding(0)" size="small">绑定</Button>
          <Button type="primary" @click="binding(1)" size="small">取消绑定</Button>
        </div>
      </div>
      <div class="t-indent l-h30">  硬件ID: 4328971237</div>
      <div class="t-indent l-h30">发放时间: 2018/9/17 18:07:04</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userId: this.$route.query.id,

        user: {},
        tableData: [{}],
        col: [
          {
            title: "姓名",
            align: 'left',
            key: "name",
            render: this.tdRender
          },
          {
            title: "性别",
            align: 'left',
            key: "sex",
            render: this.tdRender
          },
          {
            title: "类型",
            align: 'left',
            key: "type",
            render: this.tdRender
          },
          {
            title: "手机",
            align: 'left',
            key: "phone",
            render: this.tdRender
          },
          {
            title: "公司",
            align: 'left',
            key: "company",
            render: this.tdRender
          },
          {
            title: "职位",
            align: 'left',
            key: "position",
            render: this.tdRender
          },
          {title: '签到状态', render: (h, params) => {
              return h('div', [
                h('span', params.row.status == 0 ? "未签到": "已签到")
              ])
            }},
          {title: '签到时间', render: (h, params) => {
              return h('div', [
                h('span', this.formatterObjTime(params.row.createTime))
              ])
            }}
        ]

      }
    },
    created() {
      setTimeout(() => {
        // this.requestOrderInfo()
      }, 20)
    },
    methods: {
      requestOrderInfo() {
        this.requestAjax('get', 'usersInfo', {}, this.userId).then(res => {
          if(res.success) {
            // this.user = res.data.data
            // this.tableData = []
          }

        })
      },
      binding (v) {
        if(v== 0) console.log('绑定')
        if(v== 1) console.log('取消绑定')
      }
    }
  }
</script>

<style scoped>
</style>
