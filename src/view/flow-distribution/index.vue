<template>
  <div class="wrapper-box">
    <h3 class="fz14">人流量分布</h3>
    <div class="content-wrapper m-t10 wrapper-border m-t20">
      <div class="clear">
        <span>区域分布</span>
      </div>
      <div class="fz14 m-t10 ct c3 statistics-wrapper">
        <Row type="flex" align="middle">
          <i-col :span="10">
            <div class="wrapper-border m-t10" style="height: 260px;">
              <div id="region1" style="width: 100%; height: 260px;"></div>
            </div>
          </i-col>
          <i-col :span="14">
            <div style="padding: 20px;">
              <i-table border :columns="table.columns" :data="table.data"></i-table>
            </div>
          </i-col>
        </Row>
      </div>
    </div>
    <div class="content-wrapper m-t10 wrapper-border">
      <div class="clear">
        <span>用户分布</span>
      </div>
      <div class="fz14 m-t10 ct c3 statistics-wrapper">
        <div class="wrapper-border m-t10" style="height: 260px;">
          <div id="region2" style="width: 100%; height: 260px;"></div>
        </div>
        <div style="padding: 20px 0;">
          <i-table border :columns="table.columnsPro" :data="table.dataPro"></i-table>
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
        table: {
          columns: [
            {title: '区域', key: 'name', sortable: false},
            {title: '停车区', key: 'value1', sortable: false},
            {title: '入场区', key: 'value2', sortable: false},
            {title: '会议区', key: 'value3', sortable: false},
            {title: '休息区', key: 'value4', sortable: false},
            {title: '餐饮区', key: 'value5', sortable: false},
          ],
          data: [
            {name: '人数',value: 5},
            {name: '占比',value: 5},
          ],
          chartValue:[
            {name: '停车区',value: 5},
            {name: '入场区',value: 4},
            {name: '会议区',value: 6},
            {name: '休息区',value: 3},
            {name: '餐饮区',value: 7}
          ],
          total: 0,

          columnsPro: [
            {title: '', key: 'company', sortable: false,renderHeader: ()=>{
              return ''
              }},
            {title: '停车区', key: 'position', sortable: false},
            {title: '入场区', key: 'position', sortable: false},
            {title: '会议区', key: 'position', sortable: false},
            {title: '休息区', key: 'position', sortable: false},
            {title: '餐饮区', key: 'position', sortable: false}
          ],
          dataPro: [{},{}],
          totalPro: 0
        },
        charts: {},
        rowId: this.$route.query.id
      }
    },
    created () {
      setTimeout(() => {
        this.charts.region1Chart = this.echarts.init(document.getElementById('region1'))
        this.charts.region2Chart = this.echarts.init(document.getElementById('region2'))
        // this.getTicket()
        this. initChart1()
        this. initChart2()
      }, 20)
    },
    methods: {
      getTicket () {
        this.requestAjax('get', 'report', {id: this.$route.query.id}).then(res => {
          if(res.success){
          }
        })
      },
      initChart1 () {
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'right',
            top: '55',
            data: this.table.chartValue.map((item) => {
              return item.name
            })
          },
          grid: {
            left: 'left'
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius : '65%',
              center: ['40%', '50%'],
              avoidLabelOverlap: false,
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.table.chartValue,
              label: {
                normal: {
                  show: true,
                  position: 'inner',
                  color: '#000',
                  //    formatter: '{b} : {c} ({d}%)'
                  formatter: '{d}%'
                }
              }
            }
          ]
        }
        this.charts.region1Chart.setOption(option)
      },
      initChart2 () {
        let data = [1,2,3,4,5]
        let option = {
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            x: 'left',
            padding: [10, 0, 0, 30],
            itemWidth: 18,
            data:['参会者','嘉宾','记者','工作人员']
          },
          grid: {
            left: '2%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: [
            {
              show:true,
              type: 'category',
              data: ['停车区', '入场区', '会议区', '休息区', '餐饮区'],
              axisTick: {
                show: false
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'参会者',
              type:'bar',
              data:data.map(()=>{
                return Math.floor(Math.random() * 100)
              })
            },
            {
              name:'嘉宾',
              type:'bar',
              data:data.map(()=>{
                return Math.floor(Math.random() * 100)
              })
            },
            {
              name:'记者',
              type:'bar',
              data:data.map(()=>{
                return Math.floor(Math.random() * 100)
              })
            },
            {
              name:'工作人员',
              type:'bar',
              data:data.map(()=>{
                return Math.floor(Math.random() * 100)
              })
            }
          ]
        }
        this.charts.region2Chart.setOption(option)
      }
    },

  }
</script>

<style scoped>

  .statistics-wrapper {
    padding: 5px;
    border-top: 1px solid #e3e2e5;
  }
</style>
