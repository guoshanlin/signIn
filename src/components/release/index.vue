<template>
  <div class="initiating">
    <div class="initiating-form-item">
      <!--<h3 class="t-left">基本信息</h3>-->
      <div class="m-t20">
        <div class="form-group">
          <div class="float-l form-title">
            <div><span class="red">*</span>活动标题:</div>
          </div>
          <div class="float-r form-fill">
            <div>
              <i-input type="text" placeholder="标题(不少于5个字)" v-model="basicVal.title"></i-input>
            </div>
          </div>
          <div class="clearFix"></div>
        </div>
        <div class="form-group">
          <div class="float-l form-title">
            <div><span class="red">*</span>举办时间:</div>
          </div>
          <div class="float-r form-fill">
            <div class="t-left">
              <i-time ref="timePicker" :ids='timePicker.timeArr' :placeholder="timePicker.placeholderArr" :span="timePicker.spanArr" @on-change="timeChange"></i-time>
            </div>
          </div>
          <div class="clearFix"></div>
        </div>
        <div class="form-group">
          <div class="float-l form-title">
            <div><span class="red">*</span>活动地点:</div>
          </div>
          <div class="float-r form-fill">
            <div>
              <Row :gutter="10">
                <i-col span="6">
                  <Select v-model="basicVal.city1"   @on-change="provinceChange" placeholder="请选择省/市" filterable>
                    <Option v-for="item in select.province" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </i-col>
                <i-col span="6">
                  <Select v-model="basicVal.city2" placeholder="请选择市/区" :filterable="false">
                  <!--<Select v-model="basicVal.city2" placeholder="请选择市/区" :filterable="false"  @on-change="cityChange">-->
                    <Option v-for="item in select.city" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </i-col>
                <!--<i-col span="4">-->
                  <!--<Select v-model="basicVal.city3" placeholder="请选择县、区" :filterable="false">-->
                    <!--<Option v-for="item in select.area" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                  <!--</Select>-->
                <!--</i-col>-->
                <i-col span="12">
                  <i-input type="text" placeholder="请输入详细地址" v-model="basicVal.address"></i-input>
                </i-col>
              </Row>
            </div>
          </div>
          <div class="clearFix"></div>
        </div>
        <div class="form-group">
          <div class="float-l form-title">
            <div><span class="red">*</span>活动海报:</div>
          </div>
          <div class="float-r form-fill">
            <div class="t-center">
              <Row type="flex" class="code-row-bg">
                <i-col :span="16">
                  <div class="container-img posct" v-html="imgHtml"></div>
                </i-col>
                <i-col :span="8">
                  <div class="upload">
                    <div class="p-t100">
                      <Row type="flex" justify="center">
                        <i-col span="7">
                          <Upload :action="getWbkUrl('upload')" :before-upload="handleUpload">
                            <Button type="primary" icon="ios-cloud-upload-outline">上传</Button>
                          </Upload>
                        </i-col>
                        <i-col span="7">
                          <Button type="primary">海报图库</Button>
                        </i-col>
                      </Row>
                    </div>
                    <div class="m-t30">
                      <p class="fz12 l-h20 t-left t-indent">
                        温馨提示：
                      </p>
                      <p class="fz12 l-h20 t-left t-indent">
                        1、 图片尺寸 1080*640，.jpg 或 .png格式，不超过 4M
                      </p>
                      <p class="fz12 l-h20 t-left t-indent">
                        2、精美海报能带来更好传播效果，吸引更多用户！
                      </p>
                    </div>
                  </div>
                </i-col>
              </Row>
            </div>
          </div>
          <div class="clearFix"></div>
        </div>
        <div class="form-group">
          <div class="float-l form-title">
            <div><span class="red">*</span>活动特色:</div>
          </div>
          <div class="float-r form-fill">
            <div class="t-left">
              <i-input v-model="basicVal.abstract" type="textarea" :rows="4" placeholder="请输入"></i-input>
            </div>
          </div>
          <div class="clearFix"></div>
        </div>
        <div class="form-group">
          <div class="float-l form-title">
            <div><span class="red">*</span>活动详情:</div>
          </div>
          <div class="float-r form-fill">
            <div class="t-left">
              <div id="main" v-if="showUeditor">
                <v-ueditor v-model="basicVal.mavonValue"></v-ueditor>
              </div>
            </div>
          </div>
          <div class="clearFix"></div>
        </div>
      </div>
    </div>
    <div class="posct">
      <i-button type="primary" v-if="id" @click="basicEvent()">保存</i-button>
      <i-button type="primary" v-else @click="basicEvent(id)">发布</i-button>
    </div>
  </div>
</template>

<script>

  import iTime from 'components/date-picker/index.vue' // 时间选择
  import vUeditor from 'components/v-ueditor'
  import {mapGetters} from 'vuex'
  import {initiateMixin } from 'mixins/initiateMixin'

  import locationData from 'js/address/location'

  export default {
    mixins: [initiateMixin],
    data() {
      const province = []
      let cityObj = {}
      let areaObj = {}
      for (let code in locationData) {
        let item = locationData[code]
        province.push(Object.assign({}, {label: item.name, value: item.name}))
        let cityList = item.cities
        cityObj[item.name] = []
        for (let key in cityList) {
          // console.log(cityList[key])
          cityObj[item.name].push(Object.assign({}, {label: cityList[key].name, value: cityList[key].name}))
          areaObj[cityList[key].name] = []
          for (let _key in cityList[key].districts) {
            // console.log(cityList[key].districts[_key])
            areaObj[cityList[key].name].push(Object.assign({}, {label: cityList[key].districts[_key], value: cityList[key].districts[_key]}))
          }
        }
      }

      return {
        id: this.$route.query.id,
        status: 1,
        imgHtml: '<div style="height:300px; line-height: 300px" class="c3">大小不超过4M</div>',
        // 基本信息
        basicVal: {
          title: '', // 标题
          city1: '广东省', // 地点省
          city2: '深圳市', // 地点市
          address: '', // 地点详细地址
          dataFile: '', // 海报文件流
          beginTime: '', // 开始时间
          endTime: '', // 结束时间
          abstract: '', // 活动特色
          mavonValue: '',// 活动详情
        },
        city: cityObj,
        areaObj: areaObj,
        select: {
          province: province,
          city: cityObj['广东省'],
          area: areaObj['深圳市']
        },
        msgTip: {
          name: {msg: '活动标题不能为空', required: true},
          city1: {msg: '请选择省/市', required: true},
          city2: {msg: '请选择市/区', required: true},
          address: {msg: '请填写地址', required: false},
          beginTime: {msg: '请选择开始时间', required: true},
          endTime: {msg: '请选择结束时间', required: true},
          remark: {msg: '活动特色不能为空', required: true},
          content: {msg: '活动详情不能为空', required: true}
        },
        disabled: false,
        timePicker: {
          timeArr: ['beginTime', 'endTime'],
          placeholderArr: ['开始时间', '结束时间'],
          spanArr: [12, 12]
        },
        showUeditor: false
      }
    },
    computed: {
      ...mapGetters([
        'userData',
        'draftActivity'
      ])
    },
    created() {
      setTimeout(() => {
        if (this.id) {
          this.initData()
        } else {
          this.showUeditor = true
        }
      }, 20)
    },
    methods: {
      initData () {
        if (!this.draftActivity) return
        this.showUeditor = true
        this.status = this.draftActivity.status
        this.basicVal.title = this.draftActivity.name

        this.basicVal.city1 = this.draftActivity.city1
        if(this.city[this.draftActivity.city1].length == 1) {
          this.select.city = this.areaObj[this.city[this.draftActivity.city1][0].value]
        }else {
          this.select.city = this.city[this.draftActivity.city1]
        }
        this.basicVal.city2 = this.draftActivity.city2
        this.basicVal.address = this.draftActivity.address

        this.basicVal.dataFile = this.draftActivity.posterUrl
        this.imgHtml = '<img class="img" width="100%" src=" ' + (this.$global + this.draftActivity.posterUrl) + '">'

        this.basicVal.beginTime = this.draftActivity.beginTime.time
        this.basicVal.endTime = this.draftActivity.endTime.time
        this.$refs.timePicker.setValue(['beginTime', 'endTime'], [new Date(this.draftActivity.beginTime.time).format('yyyy-MM-dd hh:mm:ss'), new Date(this.draftActivity.endTime.time).format('yyyy-MM-dd hh:mm:ss')])

        this.basicVal.abstract = this.draftActivity.remark
        this.basicVal.mavonValue = this.draftActivity.content
      },
      handleUpload: function (file) {
        let path = this.testImg(file)
        if (!path) return false

        this.imgHtml = '<img class="img" width="100%" src=" ' + path + '">'
        this.basicVal.dataFile = file
        return false
      },
      timeChange (id, value) {
        this.basicVal[id] = value
      },
      provinceChange (val) {
        this.basicVal.city2 = ''
        this.select.city = this.city[val]
        if(this.city[val].length == 1)  {
          this.select.city = this.areaObj[this.city[val][0].value]
        }else {
          this.select.city = this.city[val]
        }
      },
      cityChange (val) {
        this.basicVal.city3 = ''
        this.select.area = this.areaObj[val]
      },
      _isChangePostImg (){
        return (typeof  this.basicVal.dataFile) == 'object'
      }
    },
    components: {
      iTime,
      vUeditor
    }
  }
</script>

<style scoped>
  .initiating .initiating-form-item{line-height: 30px; margin-bottom: 20px}
  .initiating .initiating-form-item>div{ border: 1px solid #e3e2e5; padding: 10px; border-radius: 5px}
  .initiating div{line-height: 30px}
  .initiating .form-title{ width:100px !important; }
  .initiating .form-fill{ width: calc(100% - 100px) !important;}
  .initiating .form-sub{margin: 10px;}
  .initiating .form-sub button{ margin: 0 10px;}
  .initiating .form-group{margin: 5px 0px;}
  .initiating .upload{ height: 300px;padding: 0 10px}
  .initiating .ivu-radio-wrapper{margin: 5px!important;}
  .initiating .ivu-radio-group-button .ivu-radio-wrapper:last-child,.ivu-radio-group-button.ivu-radio-group-small .ivu-radio-wrapper:first-child{border-radius:0;}
  .initiating .registration-tip{cursor: pointer;}
  .initiating .registration-tip:hover{background-color: #f5f6f7;}
  .initiating .save-button{padding: 5px 0;}
  .initiating .ivu-select-dropdown{ z-index: 10000}
  .initiating .ivu-select-multiple .ivu-select-item{display: inline-block; margin: 2px}
  .initiating .ivu-select-multiple .ivu-select-item-selected{background-color: rgba(153, 199, 238, 0.36)}
  .initiating .ivu-select-multiple .ivu-select-item-selected:after{display: none;}
  .initiating .red{color: #FF0000}
  .initiating .container-img { border: 1px solid #e3e2e5; background-color: rgba(238,238,238,.5); width: 100%;padding: 10px;}
  .initiating img{width:100% !important;}
  /*编辑器样式*/
  #main .v-note-wrapper{ max-height: 500px; position: inherit;}
  #main .v-note-wrapper .v-note-op .v-left-item .op-icon,#main .v-note-wrapper .v-note-op .v-right-item .op-icon {height: 20px;width: 20px;font-size: 12px;color: #757575;border-radius: 5px;margin: 0;padding: 0;}
  #main .fa-mavon-question-circle{ padding:0!important; }
  #main .v-note-wrapper .v-note-op,#main .v-note-wrapper .v-note-op .v-left-item,#main .v-note-wrapper .v-note-op .v-right-item{min-height: 30px;}
</style>
