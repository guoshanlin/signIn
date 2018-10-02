<template>
  <div class="wrapper-box">
    <h3 class="fz14">活动概况</h3>
    <div class="content-wrapper m-t10 wrapper-border m-t20">
      <div class="clear">
        <span>参会统计</span>
        <!--<a class="c1 fr" @click="routePush('/base/joinStatistics',rowId)">详情</a>-->
      </div>
      <div class="fz14 fbox m-t10 ct c3 statistics-wrapper">
        <div class="flex">
          <span class="fz20 c2">{{report.ticket.number? report.ticket.number : 0}}</span><br>
          <span>报名人数</span>
        </div>
        <div class="flex">
          <span class="fz20 c2">{{report.ticket.signNumber? report.ticket.signNumber : 0}}</span><br>
          <span>签到人数</span>
        </div>
        <div class="flex">
          <span class="fz20 c2">{{report.ticket.signRete? report.ticket.signRete : 0}}%</span><br>
          <span>硬件发放数</span>
        </div>
      </div>
    </div>
    <div class="content-wrapper m-t10 wrapper-border">
      <div class="clear">
        <span>会场统计</span>
        <!--<a class="c1 fr" @click="routePush('/base/joinStatistics',rowId)">详情</a>-->
      </div>
      <div class="fbox fz14 m-t10 ct c3 statistics-wrapper">
        <div class="flex">
          <span class="fz20 c2">{{report.ticket.number? report.ticket.number : 0}}</span><br>
          <span>入场人次</span>
        </div>
        <div class="flex">
          <span class="fz20 c2">{{report.ticket.signNumber? report.ticket.signNumber : 0}}</span><br>
          <span>退场人次</span>
        </div>
        <div class="flex">
          <span class="fz20 c2">{{report.ticket.signRete? report.ticket.signRete : 0}}%</span><br>
          <span>参会率</span>
        </div>
        <div class="flex">
          <span class="fz20 c2">{{report.ticket.signRete? report.ticket.signRete : 0}}%</span><br>
          <span>专注度</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        data: '',
        report: {
            type:0,
            order: {
              number: 0,
              ticketNumber: 0,
              ticketPriceActual: 0,
              number_cp: 0,
              ticketNumber_cp: 0,
              ticketPriceActual_cp: 0
            },
            ticket: {
              signNumber: 0,
              signRete: 0,
              ordersNumber: 0,
              signNumber_cp: 0,
              signRete_cp: 0,
              ordersNumber_cp: 0
            },
          none: 0

        },
        rowId: this.$route.query.id
      }
    },
    created () {
      setTimeout(() => {
        this.getTicket()
      }, 20)
    },
    methods: {
      getTicket () {
        this.requestAjax('get', 'report', {id: this.$route.query.id}).then(res => {
          if(res.success){
            let ticket = res.data.ticket[0],
                orders = res.data.orders[0]
            for(let k in orders){
              this.report["order"][k] = orders[k]
            }
            for(let k in ticket){
              this.report["ticket"][k] = ticket[k]
            }
            this.report["type"] = res.data["type"]
          }
        })
      }
    }
  }
</script>

<style scoped>

  .statistics-wrapper {
    padding: 36px 0;
    border-top: 1px solid #e3e2e5;
  }
  .bdr{border-right:1px solid #e3e2e5; }

</style>
