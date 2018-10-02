<template>
  <div class="wrapper wrapper-box">
    <h3 class="fz14">人流量明细</h3>
    <div class="content-wrapper m-t10 wrapper-border m-t20">
      <Row type="flex" justify="end" :gutter=5>
        <i-col>
          <i-col style="line-height: 24px">
            <Select v-model="selectVal.region" placeholder="所属区域" style="width: 120px;" @on-change="selectChange" :clearable="true">
              <Option v-for="item in select.region" :value="item.value" :key="item.value">{{item.name}}</Option>
            </Select>
          </i-col>
        </i-col>
        <i-col>
          <i-col style="line-height: 24px">
            <Select v-model="selectVal.type" placeholder="人员类型" style="width: 120px;" @on-change="selectTypeChange" :clearable="true">
              <Option v-for="item in select.type" :value="item.value" :key="item.value">{{item.name}}</Option>
            </Select>
          </i-col>
        </i-col>
        <i-col>
          <i-time ref="timePicker" :ids='timePicker.timeArr' :placeholder="timePicker.placeholderArr" :span="timePicker.spanArr" :day="timePicker.day" @on-change="timeChange"></i-time>
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
    </div>
    <div class="content-wrapper m-t10 wrapper-border m-t20">
      <i-table :columns="table.columns" :data="data" border size="small" ref="table" @on-sort-change="sortChange" :no-data-text="loading" ></i-table>
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
  </div>
</template>
<script>
  import tableColumns from 'components/table-columns'
  import iTime from 'components/date-picker/time-slot.vue'
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
            {title: '硬件ID', show: true, key: 'id', width: 140, sortable: true, render: this.tdRender},
            {title: '用户', show: true, key: 'name',sortable: true, render: this.tdRender},
            {title: '人员类型', show: true, width: 110, sortable: true, render: (h, params) => {
                return h('div', [
                  h('span', params.row.type == 1 ? '参会者' : '志愿者')
                ])
              }},
            {title: '所属区域 ', show: true, key: 'phone', sortable: true, render: this.tdRender},
            {title: '区域名称', show: true, key: 'sex', sortable: true, render: this.tdRender},
            {title: '开始时间', width: 140, show: true, sortable: false, render: (h, params) => {
                return h('div', [
                  h('span', this.formatterObjTime(params.row.createTime))
                ])
              }},
            {title: '结束时间', width: 140, show: true, sortable: false, render: (h, params) => {
                return h('div', [
                  h('span', this.formatterObjTime(params.row.createTime))
                ])
              }}
          ],
        },
        timePicker: {
          timeArr: ['bTime', 'eTime'],
          placeholderArr: ['开始时间', '结束时间'],
          spanArr: [12, 12],
          day: '0'
        },
        select: {
          region: [
            {value: "0",name: '停车区'},
            {value: "1",name: '入场区'},
            {value: "2",name: '会议区'},
            {value: "3",name: '休息区'},
            {value: "4",name: '餐饮区'}
          ],
          type: [
            {value: "0",name: '参会者'},
            {value: "1",name: '志愿者'},
            {value: "2",name: '记者'},
            {value: "3",name: '嘉宾'}
          ]
        },
        selectVal: {
          region: '',
          type: ''
        },
        timer: {},
        checkUser: ''
      }
    },
    computed: {},
    components: {
      tableColumns,
      iTime
    },
    methods: {
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
      timeChange () {
        let _time = this.$refs.timePicker.getValue()
        this.params.bTime = _time.bTime + ' 00:00:00'
        this.params.eTime = _time.eTime + ' 23:59:59'
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
