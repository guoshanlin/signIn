<template>
  <div class="wrapper-box">
    <h3 class="fz14">流量统计</h3>
    <Menu mode="horizontal" active-name="0" @on-select="menuSelect">
      <MenuItem name="0">访问量统计</MenuItem>
      <MenuItem name="1">访客分析</MenuItem>
    </Menu>

    <div v-if="statistics == 0">
      <div class="wrapper-border m-t10" style="min-height: 260px;">
        <div class="m-t30 full-width">
          <Row type="flex" :gutter=5>
            <!--<列表导栏>-->
            <i-col span="16">
              <Row type="flex" justify="start">
                <i-col>
                  <RadioGroup @on-change="orderStatusChange" v-model="timePicker.day" type="button">
                    <Radio label="-1">昨天</Radio>
                    <Radio label="-7">最近7天</Radio>
                    <Radio label="-30">最近30天</Radio>
                  </RadioGroup>
                </i-col>
                <i-col>
                  <div class="m-l5" style="min-width: 350px;">
                    <i-time ref="timePicker" :ids='timePicker.timeArr' :placeholder="timePicker.placeholderArr"
                            :span="timePicker.spanArr" :day="timePicker.day" @on-change="timeChange"></i-time>
                  </div>
                </i-col>
              </Row>

            </i-col>
            <i-col span="8">
              <Row type="flex" justify="end">
                <i-col>
                  <Button type="primary">导出</Button>
                </i-col>
              </Row>
            </i-col>
          </Row>
          <div class="wrapper-border m-t10" style="height: 400px;">
             <Row class="full-width">
                <i-col :span="12">
                    <Row type="flex" justify="center" align="middle" class="">
                      <i-col>
                        <div class="m-r15">
                          <span class="demo-Circle-inner fz24 c7">{{dataRl.ctRl.maxCt}}</span><br>
                          <span class="demo-Circle-inner fz16">日最高</span>
                        </div>
                      </i-col>
                      <i-col>
                        <div>
                          <div class="t-center m-b15"><span class="demo-Circle-inner fz24 c7">PV:浏览量</span></div>
                          <i-circle :percent="100" stroke-color="#2db7f5" :size="200" :stroke-width="10">
                            <span class="demo-Circle-inner fz24 c7">{{dataRl.ctRl.totalCt}}</span><br>  <br>
                            <span class="demo-Circle-inner fz16">总浏览量</span>
                          </i-circle>
                          <div class="t-center">
                            <span class="demo-Circle-inner fz24 c7">{{toDecimal2(dataRl.ctRl.avgCt)}}</span><br>
                            <span class="demo-Circle-inner fz16">日平均</span>
                          </div>
                        </div>
                      </i-col>
                      <i-col>
                        <div class="m-l15">
                          <span class="demo-Circle-inner fz24 c7">{{dataRl.ctRl.minCt}}</span><br>
                          <span class="demo-Circle-inner fz16">日最低</span>
                        </div>
                      </i-col>
                    </Row>
                </i-col>
                 <i-col :span="12">
                   <Row type="flex" justify="center" align="middle" class="">
                     <i-col>
                       <div class="m-r15">
                         <span class="demo-Circle-inner fz24 c6">{{dataRl.distinctCtRl.maxCt}}</span><br>
                         <span class="demo-Circle-inner fz16">日最高</span>
                       </div>
                     </i-col>
                     <i-col>
                       <div>
                         <div class="t-center m-b15"><span class="demo-Circle-inner fz24 c6">UV:访客数</span></div>
                         <i-circle :percent="100" :size="200" stroke-color="#5cb85c" :stroke-width="10">
                           <span class="demo-Circle-inner fz24 c6">{{dataRl.distinctCtRl.totalCt}}</span><br><br>
                           <span class="demo-Circle-inner fz16">总访客数</span>
                         </i-circle>
                         <div class="t-center">
                           <span class="demo-Circle-inner fz24 c6">{{toDecimal2(dataRl.distinctCtRl.avgCt)}}</span><br>
                           <span class="demo-Circle-inner fz16">日平均</span>
                         </div>
                       </div>
                     </i-col>
                     <i-col>
                       <div class="m-l15">
                         <span class="demo-Circle-inner fz24 c6">{{dataRl.distinctCtRl.minCt}}</span><br>
                         <span class="demo-Circle-inner fz16">日最低</span>
                       </div>
                     </i-col>
                   </Row>
                 </i-col>
             </Row>
          </div>
          <div class="clear m-t30">
            <div>访问量趋势图</div>
            <Button class="fr" type="primary">导出</Button>
          </div>
          <div class="wrapper-border m-t10" style="height: 260px;">
             <div id="pageView" style="height: 260px; width: 100%"></div>
          </div>
          <div class="wrapper-border m-t10">
            <i-table border :columns="columns" :data="data"></i-table>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
        <div class="m-t20">
          <Row type="flex" :gutter=5>
            <!--<列表导栏>-->
            <i-col span="16">
              <Row type="flex" justify="start">
                <i-col>
                  <RadioGroup @on-change="orderStatusChange" v-model="timePickerTwo.day" type="button">
                    <Radio label="-1">昨天</Radio>
                    <Radio label="-7">最近7天</Radio>
                    <Radio label="-30">最近30天</Radio>
                  </RadioGroup>
                </i-col>
                <i-col>
                  <div class="m-l5" style="min-width: 350px;">
                    <i-time ref="timePickerTwo" :ids='timePickerTwo.timeArr' :placeholder="timePickerTwo.placeholderArr"
                            :span="timePickerTwo.spanArr" :day="timePickerTwo.day" @on-change="timeChangeTwo"></i-time>
                  </div>
                </i-col>
              </Row>

            </i-col>
            <i-col span="8">
              <Row type="flex" justify="end">
                <i-col>
                  <!--<Button type="primary">导出</Button>-->
                </i-col>
              </Row>
            </i-col>
          </Row>
        </div>
        <div class="content-wrapper m-t20 wrapper-border">
          <div class="clear">
            <span>访客性别分布</span>
            <Button class="fr" type="primary">导出</Button>
          </div>
          <Row type="flex" align="middle">
            <i-col :span="12">
              <div class="wrapper-border m-t10" style="height: 260px;">
                <div id="flowed1" style="width: 100%; height: 260px;"></div>
              </div>
            </i-col>
            <i-col :span="12">
              <div style="padding: 20px;">
                <i-table border :columns="table.columns" :data="table.data"></i-table>
              </div>
            </i-col>
          </Row>
        </div>
        <div v-if="show" class="content-wrapper m-t20 wrapper-border">
          <div class="clear">
            <span>省份分布 TOP10</span>
            <Button class="fr" type="primary">导出</Button>
          </div>
          <Row type="flex">
            <i-col :span="12">
              <div class="wrapper-border m-10" style="height: 400px;">
                 <div id="map1" style="width:100%;height: 400px"></div>
              </div>
            </i-col>
            <i-col :span="12">
              <div class="wrapper-border m-10" style="height: 400px;">chart 图表2</div>
            </i-col>
          </Row>
            <div class="m-10">
              <i-table border :columns="table.columnsPro" :data="table.dataPro"></i-table>
            </div>
       </div>
        <div v-if="show" class="content-wrapper m-t20 wrapper-border">
            <div class="clear">
              <span>城市分布 TOP10</span>
              <Button class="fr" type="primary">导出</Button>
            </div>
            <Row type="flex">
              <i-col :span="12">
                <div class="wrapper-border m-10" style="height: 400px;">
                  <div id="map2" style="width:100%;height: 400px"></div>
                </div>
              </i-col>
              <i-col :span="12">
                <div class="wrapper-border m-10" style="height:400px;">chart 图表2</div>
              </i-col>
            </Row>
              <div class="m-10">
                <i-table border :columns="table.columnsCity" :data="table.dataCity"></i-table>
              </div>
        </div>

        <div class="content-wrapper m-t20 wrapper-border">
          <div class="clear">
            <span>终端系统分布</span>
            <Button class="fr" type="primary">导出</Button>
          </div>
          <Row type="flex" align="middle">
            <i-col :span="12">
              <div class="wrapper-border m-t10" style="height: 260px;">
                <div id="flowed2" style="width: 100%; height: 260px;"></div>
              </div>
            </i-col>
            <i-col :span="12">
              <div style="padding: 20px;">
                <i-table border :columns="table.columnsTer" :data="table.dataTer" :height="260"></i-table>
              </div>
            </i-col>
          </Row>
        </div>
        <div class="content-wrapper m-t20 wrapper-border">
          <div class="clear">
            <span>终端机型分布 Top 10</span>
            <Button class="fr" type="primary">导出</Button>
          </div>
          <Row type="flex" align="middle">
            <i-col :span="12">
              <div class="wrapper-border m-t10" style="height: 260px;">
                <div id="flowed3" style="width: 100%; height: 260px;"></div>
              </div>
            </i-col>
            <i-col :span="12">
              <div style="padding: 20px;">
                <i-table border :columns="table.columnsTerTop" :data="table.dataTerTop" :height="260"></i-table>
              </div>
            </i-col>
          </Row>
        </div>
    </div>
  </div>
</template>

<script>
  import iTime from 'components/date-picker/time-slot.vue'
  export default {
    name: 'index',
    data () {
      return {
        show: false,
        statistics: 0,
        orderStatus: '-1',
        width: {
          width01: document.documentElement.clientWidth - 330
        },
        dataRl: {
          'ctRl': {'minCt': 0, 'totalCt': 0, 'maxCt': 0, 'avgCt': 0},
          'distinctCtRl': {'minCt': 0, 'totalCt': 0, 'maxCt': 0, 'avgCt': 0}
        },
        pageViewData: {},
        columns: [
          {title: '页面/场景', width: 100, key: 'key', sortable: false},
          {title: '总浏览量PV', width: 110, key: 'totalCt', sortable: false},
          {title: '日最高PV', key: 'maxCt', sortable: false},
          {title: '日最低PV', key: 'minCt', sortable: false},
          {title: '日平均PV',
            key: 'avgCt',
            sortable: false,
            render: (h, params) => {
            return h('div', this.toDecimal2(params.row.avgCt))
            }},
          {title: '总访客数UV', width: 110, key: 'dtTotalCt', sortable: false},
          {title: '日最高UV', key: 'dtMaxCt', sortable: false},
          {title: '日最低UV', key: 'dtMinCt', sortable: false},
          {title: '日平均UV',
            key: 'dtAvgCt',
            sortable: false,
            render: (h, params) => {
              return h('div', this.toDecimal2(params.row.dtAvgCt))
            }}
        ],
        data: [{company: '订单详情页', position: 1}, {company: '提交订单页', position: 1}],
        table: {
          columns: [
            {title: '性别', key: 'name', sortable: false},
            {title: '访客数', key: 'value', sortable: false},
            {
              title: '占比',
              sortable: false,
              render: (h, params) => {
                return h('div', [
                  h('span', this.proportion(params.row.value, this.table.total) + '%')
                ])
              }}
            ],
          data: [],
          total: 0,

          columnsPro: [
            {title: '省份', key: 'company', sortable: false},
            {title: '访客数', key: 'position', sortable: false},
            {title: '占比', key: 'position', sortable: false}
            ],
          dataPro: [],
          totalPro: 0,

          columnsCity: [
            {title: '城市', key: 'company', sortable: false},
            {title: '访客数', key: 'position', sortable: false},
            {title: '占比', key: 'position', sortable: false}
          ],
          dataCity: [],
          totalCity: 0,

          columnsTer: [
            {title: '终端系统', key: 'name', sortable: false, render: this.tdRender},
            {title: '访客数', key: 'value', sortable: false},
            {
              title: '占比',
              sortable: false,
              render: (h, params) => {
                return h('div', [
                  h('span', this.proportion(params.row.value, this.table.totalTer) + '%')
                ])
              }}
          ],
          dataTer: [],
          totalTer: 0,

          columnsTerTop: [
            {title: '终端机型', key: 'name', sortable: false, render: this.tdRender},
            {title: '访客数', key: 'value', sortable: false},
            {
              title: '占比',
              sortable: false,
              render: (h, params) => {
                return h('div', [
                  h('span', this.proportion(params.row.value, this.table.totalTop) + '%')
                ])
              }}
          ],
          dataTerTop: [],
          totalTop: 0
        },
        charts: {},
        timePicker: {
          timeArr: ['bTime', 'eTime'],
          placeholderArr: ['开始时间', '结束时间'],
          spanArr: [12, 12],
          day: '0'
        },
        timePickerTwo: {
          timeArr: ['bTime', 'eTime'],
          placeholderArr: ['开始时间', '结束时间'],
          spanArr: [12, 12],
          day: '0'
        },
        params: {
          activityId: this.$route.query.id,
          bTime: '',
          eTime: ''
        },
        paramsTwo: {
          activityId: this.$route.query.id,
          ctKey: 'visitor_sex,visitor_client_sys,visitor_client_model',
          topN: 10,
          bTime: '',
          eTime: ''
        },
        timer: {}
      }
    },
    destroyed () {
      window.onresize = function () {}
      clearInterval(this.timer)
    },
    created () {
      setTimeout(() => {
        clearInterval(this.timer)
          this.timer = setInterval(() => {
            if (this.statistics == 0) {
              this.queryAccessCt()
              this.queryAccessCtByMinList()
              this.queryAccessCtByUrlList()
            } else {
              this.queryAccessCtByType()
            }
          }, 60 * 1000)
      }, 20)
    },
    components: {
      iTime
    },
    methods: {
      menuSelect (v) {
        this.statistics = v
        setTimeout(() => {
          this._resize()
          if (v == 1) {
            this.initChart1()
          } else {
            this.initChart()
          }
        }, 20)
      },
      orderStatusChange () {

      },
      initChart () {
        this.charts.pageViewChart = this.echarts.init(document.getElementById('pageView'), 'shine')
        let data = this.pageViewData
        let option = {
          color: ["#00ADFF"],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#283b56'
              }
            }
          },
          grid: {
            top: '10%',
            left: '5%',
            right: '10%',
            bottom: '10%',
            width: '85%',
            height: '80%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: "#ccc"
            },
            data: data.map((item) => {
              return item.time
            })
          },
          yAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
              color: "#ccc",
              // formatter: (value)=> {
              //   if(value>=10000 &&  value<100000000){
              //     return value/10000 + "万";
              //   }else if(value>=100000000 &&  value<1000000000000){
              //     return value/100000000 + "亿";
              //   }else if(value>=1000000000000){
              //     return value/1000000000000 + "兆";
              //   }else {
              //     return value;
              //   }
              // }
            },
            splitLine: {
              lineStyle: {
                type: 'dotted',
                color: '#515151'
              }
            },
            min: 0,
            boundaryGap: [0.2, 0.2]
          },
          series: [
            {
              type: 'line',
             // showSymbol: false,
              name: 'PV浏览量',
              data: data.map((item) => {
                return item.ct
              })
            },
            {
              type: 'line',
              // showSymbol: false,
              name: 'UV浏览量',
              data: data.map((item) => {
                return item.dtCt
              })
            }
          ]
        }

        this.charts.pageViewChart.setOption(option)
      },
      initChart1 () {
        this.charts.flowed1Chart = this.echarts.init(document.getElementById('flowed1'), 'shine')
        this.charts.flowed2Chart = this.echarts.init(document.getElementById('flowed2'), 'shine')
        this.charts.flowed3Chart = this.echarts.init(document.getElementById('flowed3'), 'shine')

        let option = {
          // title: {
          //   text: '报障类型',
          //   x: 'right',
          //   top: '20'
          // },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'right',
            top: '55',
            data: this.table.data.map((item) => {
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
              radius: ['50%', '70%'],
              center: ['30%', '50%'],
              avoidLabelOverlap: false,
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.table.data,
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
        this.charts.flowed1Chart.setOption(option)
        option.legend.data = this.table.dataTer.map((item) => {
          return item.name
        })
        option.series[0].data = this.table.dataTer
        this.charts.flowed2Chart.setOption(option)
        option.legend.data = this.table.dataTerTop.map((item) => {
          return item.name
        })
        option.series[0].data = this.table.dataTerTop
        this.charts.flowed3Chart.setOption(option)
        return
        this.charts.map1Chart = this.echarts.init(document.getElementById('map1'), 'shine')
        this.charts.map2Chart = this.echarts.init(document.getElementById('map2'), 'shine')
        let optionMap = {
          // title: {
          //   text: '省份分布 TOP10',
          //   subtext: '纯属虚构',
          //   left: 'center'
          // },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          grid: {

          },
          visualMap: {
            min: 0,
            max: 2500,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            calculable: true
          },
          series: [
            {
              type: 'map',
              mapType: 'china',
              roam: false,
              label: {
                normal: {
                  show: true
                },
                emphasis: {
                  show: true
                }
              },
              data:[
                {name: '北京',value: Math.round(Math.random()*1000) },
                {name: '天津',value: Math.round(Math.random()*1000) },
                {name: '上海',value: Math.round(Math.random()*1000) }
              ]
            }
          ]
        }

         this.charts.map1Chart.setOption(optionMap)
         this.charts.map2Chart.setOption(optionMap)
      },
      _resize () {
        for (let char in this.charts) {
          this.charts[char].resize()
        }
      },
      timeChange (id) {
        let _time = this.$refs.timePicker.getValue()
        if (id) {
          this.timePicker.day = this.getTimeDay(_time, this.timePicker.timeArr)
        }
        this.params.bTime = _time.bTime + ' 00:00:00'
        this.params.eTime = _time.eTime + ' 23:59:59'
        this.queryAccessCt()
        this.queryAccessCtByMinList()
        this.queryAccessCtByUrlList()
      },
      timeChangeTwo (id) {
        let _time = this.$refs.timePickerTwo.getValue()
        if (id) {
          this.timePickerTwo.day = this.getTimeDay(_time, this.timePickerTwo.timeArr)
        }
        this.paramsTwo.bTime = _time.bTime + ' 00:00:00'
        this.paramsTwo.eTime = _time.eTime + ' 23:59:59'
        this.queryAccessCtByType()
      },
      queryAccessCt () {
        this.requestAjax('get', 'queryAccessCt', this.params).then((data) => {
          if (data.success) {
            this.dataRl = data.data
          } else {
            this.dataRl = {
              'ctRl': {'minCt': 0, 'totalCt': 0, 'maxCt': 0, 'avgCt': 0},
              'distinctCtRl': {'minCt': 0, 'totalCt': 0, 'maxCt': 0, 'avgCt': 0}
            }
          }
        }, () => {

        })
        },
      queryAccessCtByMinList () {
        this.requestAjax('get', 'ctByFormat', this.params).then((data) => {
          if (data.success) {
            this.pageViewData = data.data
            setTimeout(() => {
              this._resize()
              this.initChart()
            }, 20)
          }
        }, () => {

        })
      },
      queryAccessCtByUrlList () {
        this.requestAjax('get', 'queryAccessCtByUrlList', this.params).then((data) => {
          this.data = []
          if (data.success) {
            this.data = data.data
          }
        }, () => {

        })
      },
      queryAccessCtByType () {
        this.requestAjax('get', 'queryAccessCtByType', this.paramsTwo).then((data) => {
          if (data.success) {
            let _arr = this.paramsTwo.ctKey.split(',')  // visitor_sex,visitor_client_sys,visitor_client_model
            let _obj = {visitor_sex: ['data', 'total'], visitor_client_sys: ['dataTer', 'totalTer'], visitor_client_model: ['dataTerTop', 'totalTop']}
            for (let i in _arr) {
              console.log(i, _obj[_arr[i]])
               let item = data.data[_arr[i]]
               let _newArr = []
               let _total = 0
               for (let key in item) {
                if (_arr[i] == 'visitor_sex') {
                  if (key == 0) {
                    _newArr.push({value: item[key], name: '未知'})
                  } else {
                    _newArr.push({value: item[key], name: key == 1 ? '男' : '女'})
                  }
                } else {
                  _newArr.push({value: item[key], name: key })
                }
                 _total += item[key]
               }
              this.table[_obj[_arr[i]][0]] = _newArr
              this.table[_obj[_arr[i]][1]] = _total
            }
            setTimeout(() => {
              this._resize()
              this.initChart1()
            }, 20)
            // this.data = data.data
          }
        }, () => {

        })
      },
      proportion (val, total) {
        if (isNaN(+val) || isNaN(+total) || +total == 0) {
          return '0.00'
        } else {
          return this.toDecimal2(((+val) / (+total)) * 100)
        }
      },
      getTimeDay (timeObj, arr) {
        if (timeObj[arr[0]] == new Date().addTimes('-1d').format('yyyy-MM-dd') && timeObj[arr[1]] == new Date().addTimes('-1d').format('yyyy-MM-dd')) {
          return '-1'
        } else if (timeObj[arr[0]] == new Date().addTimes('-1d').format('yyyy-MM-dd') && timeObj[arr[1]] == new Date().addTimes('-7d').format('yyyy-MM-dd')) {
          return '-7'
         } else if (timeObj[arr[0]] == new Date().addTimes('-1d').format('yyyy-MM-dd') && timeObj[arr[1]] == new Date().addTimes('-30d').format('yyyy-MM-dd')) {
          return '-30'
        } else {
          return ''
        }
      }
    }
  }
</script>

<style scoped>
  .c6 {color: #5cb85c}
  .c7 {color: #2db7f5}
</style>
