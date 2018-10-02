<template>
  <Modal
    :title="options.title"
    v-model="modalshow"
    :mask-closable="false"
    @on-cancel="cancel"
    class-name="vertical-center-modal inputForm bottom" :width="options.width">

    <div>
      <Row>
        <i-col span="5"><p class="m-l10 title-wrapper"><span class="red_tip">* </span> 计划名称</p></i-col>
        <i-col span="19"><Input v-model="fromVal.name" placeholder="请输入推广计划名称"/></i-col>
      </Row>
      <Row>
        <i-col span="5"><p class="m-l10 title-wrapper"><span class="red_tip">* </span> 选择活动</p></i-col>
        <i-col span="19">
          <Select v-model="fromVal.activity" style="width:260px" @on-change="selectChange">
            <Option v-for="item in activityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </i-col>
      </Row>
      <Row>
        <i-col span="5"><p class="m-l10 title-wrapper"><span class="red_tip">* </span> 营销方案</p></i-col>
        <i-col span="19">
          <RadioGroup v-model="fromVal.type">
            <div>
              <Radio :label="0">方案选优 （说明：对比测试不同营销方式效果，以便确定最优方式。）</Radio>
            </div>
            <div class="m-t10">
              <Radio :label="1">优化方案 （说明：通过多次推广，逐步扩大使用群体范围，获取用户反馈，完善优化方案。）</Radio>
            </div>
          </RadioGroup>
        </i-col>
      </Row>
      <Row>
        <i-col span="5"><p class="m-l10 title-wrapper"><span class="red_tip">* </span> 选择方案</p></i-col>
        <i-col span="19">
          <div>
            <RadioGroup v-if="fromVal.type==1" v-model="fromVal.disabledGroup">
              <!--<Radio label="0">海报</Radio>-->
              <Radio label="1">邀请函</Radio>
              <Radio label="2">微信分享</Radio>
            </RadioGroup>
            <CheckboxGroup v-if="fromVal.type==0" v-model="fromVal.chakboxVal">
              <!--<Checkbox label="0">海报</Checkbox>-->
              <Checkbox label="1">邀请函</Checkbox>
              <Checkbox label="2">微信分享</Checkbox>
            </CheckboxGroup>
          </div>
        </i-col>
      </Row>
      <Row v-if="fromVal.type==0 && fromVal.chakboxVal.indexOf('0') != -1">
        <i-col span="5"><p class="m-l10 title-wrapper"><span class="red_tip">* </span> 选择海报</p></i-col>
        <i-col span="19">
          <Select v-model="fromVal.postList" style="width:100%" multiple>
            <Option v-for="item in postList" :value="item.value" :key="item.id">{{ item.name }}</Option>
          </Select>
        </i-col>
      </Row>
      <Row  v-if="fromVal.type==0 && fromVal.chakboxVal.indexOf('1') != -1">
        <i-col span="5"><p class="m-l10 title-wrapper"><span class="red_tip">* </span> 选择邀请函</p></i-col>
        <i-col span="19">
          <Select v-model="fromVal.invitationList" style="width:100%" multiple>
            <Option v-for="item in invitationList" :value="item.value" :key="item.id">{{ item.name }}</Option>
          </Select>
        </i-col>
      </Row>
      <Row v-if="fromVal.type==1 && fromVal.disabledGroup== '0'">
        <i-col span="5"><p class="m-l10 title-wrapper"><span class="red_tip">* </span> 选择海报</p></i-col>
        <i-col span="19">
          <Select v-model="fromVal.post" style="width:100%">
            <Option v-for="item in postList" :value="item.value" :key="item.id">{{ item.name }}</Option>
          </Select>
        </i-col>
      </Row>
      <Row  v-if="fromVal.type==1 && fromVal.disabledGroup=='1'">
        <i-col span="5"><p class="m-l10 title-wrapper"><span class="red_tip">* </span> 选择邀请函</p></i-col>
        <i-col span="19">
          <Select v-model="fromVal.invitation" style="width:100%">
            <Option v-for="item in invitationList" :value="item.value" :key="item.id">{{ item.name}}</Option>
          </Select>
        </i-col>
      </Row>
      <Row>
        <i-col span="5"><p class="m-l10 title-wrapper"><span class="red_tip">* </span> 整体计划时间</p></i-col>
        <i-col span="19">
          <i-time ref="timePicker" :ids='timePicker.timeArr' :interval="timePicker.interval" :placeholder="timePicker.placeholderArr"
                  :span="timePicker.spanArr" @on-change="timeChange" style="margin: -5px 0 -5px 0;"></i-time>
        </i-col>
      </Row>
      <Row>
        <i-col span="5"><p class="m-l10 title-wrapper"><span class="red_tip">* </span> 计划推广用户数</p></i-col>
        <i-col span="7"><InputNumber v-model="fromVal.number" class="m-r10" placeholder="" :min="1" style="width: 120px"/>人</i-col>
        <i-col span="5" v-if="fromVal.type==1"><p class="m-l10 title-wrapper"><span class="red_tip">* </span> 计划执行次数</p></i-col>
        <i-col span="7" v-if="fromVal.type==1">
          <Select v-model="fromVal.executeNumver" style="width:120px" class="m-r10">
            <Option v-for="item in numberList" :value="item" :key="item">{{item}}</Option>
          </Select>次</i-col>
      </Row>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="cancel">取消</Button>
      <Button type="primary" @click="confirmEvent" :disabled="buttonDisabled">确定</Button>
    </div>
  </Modal>
</template>

<script>

  import iTime from 'components/date-picker/index.vue'
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
        modalshow: this.isShowModal,

        id: '',
        fromVal: {
          name: '',
          activity: '',
          type: 0,
          chakboxVal: [],
          disabledGroup: '',
          number: 1,
          executeNumver: 1,
          beginTime: '',
          endTime: '',
          post: '',
          postList: [],
          invitation: '',
          invitationList: []
        },

        timePicker: {
          timeArr: ['beginTime', 'endTime'],
          placeholderArr: ['开始时间', '结束时间'],
          interval: '到',
          spanArr: [10, 10]
        },
        numberList: [1, 2, 3],

        msgTip: {
          name: {msg: '名称不能为空', required: true},
          activity: {msg: '请选择活动', required: true},
          beginTime: {msg: '请选择开始时间', required: true},
          endTime: {msg: '请选择结束时间', required: true},
          number: {msg: '计划推广用户数不能为空', required: true}
        },

        buttonDisabled: false,

        invitationList: [],
        postList: []
      }
    },
    computed: {
      ...mapGetters([
        'userData'
      ])
    },
    props: {
      isShowModal: {
        type: Boolean,
        default: true
      },
      activityList: {
        type: Array,
        default: () => []
      },
      options: '',
      value: ''
    },
    watch: {
      isShowModal(val) {
        this.modalshow = val
      },
      value (val) {
        this.fromVal = val
        this.id = val.id
        if (this.value.id) {
          let obj = this.getList(this.fromVal.items)
          this.fromVal.chakboxVal = obj.chakboxVal
          this.fromVal.disabledGroup = obj.disabledGroup + ''
          this.invitationData(JSON.parse(this.fromVal.activity).activityId, obj)
          this.posterData(JSON.parse(this.fromVal.activity).activityId, obj)
        }
        this.$refs.timePicker.setValue(['beginTime', 'endTime'], (this.fromVal.beginTime ? [new Date(this.fromVal.beginTime).format('yyyy-MM-dd hh:mm:ss'), new Date(this.fromVal.endTime).format('yyyy-MM-dd hh:mm:ss')] : ['', '']))
      }
    },
    beforeCreate () {
      this.$nextTick(() => {
        this.fromVal = this.value
        if (this.value.id) {
          let obj = this.getList(this.fromVal.items)
          this.fromVal.chakboxVal = obj.chakboxVal
          this.fromVal.disabledGroup = obj.disabledGroup + ''
          this.invitationData(JSON.parse(this.fromVal.activity).activityId, obj)
          this.posterData(JSON.parse(this.fromVal.activity).activityId, obj)
        }
      })
    },
    created() {
      setTimeout(() => {
      }, 20)
    },
    methods: {
      cancel() {
        this.$emit('hiddenModal', 'cancel')
      },
      confirmEvent() {
        this.fromVal.beginTime = this.$refs.timePicker.getValue().beginTime // 开始时间
        this.fromVal.endTime = this.$refs.timePicker.getValue().endTime // 结束时间
        if (!this.verification(this.fromVal, this.msgTip)) return
        let activity = JSON.parse(this.fromVal.activity)
        let itemsArr = []
        if (this.fromVal.type == 1) {
          if (!this.fromVal.disabledGroup) {
            this.$Message.error('请选择方案')
            return
          }
          if (this.fromVal.disabledGroup == '0') {
            if(!this.fromVal.post || this.fromVal.post == '') {
              this.$Message.error('请选择海报')
              return
            } else {
              itemsArr.push({type: '0', sourceId: JSON.parse(this.fromVal.post).id, name: JSON.parse(this.fromVal.post).name})
              // this.fromVal.postList.forEach((item) => {
              //   itemsArr.push({type: '0', sourceId: JSON.parse(item).id, name: JSON.parse(item).name})
              // })
            }
          }
          if (this.fromVal.disabledGroup == '1') {
            if (!this.fromVal.invitation || this.fromVal.invitation == '') {
              this.$Message.error('请选择邀请函')
              return
            } else {
              itemsArr.push({type: '1', sourceId: JSON.parse(this.fromVal.invitation).id, name: JSON.parse(this.fromVal.invitation).name})
              // this.fromVal.invitationList.forEach((item) => {
              //   itemsArr.push({type: '1', sourceId: JSON.parse(item).id, name: JSON.parse(item).name})
              // })
            }
          }
          if (this.fromVal.disabledGroup == '2') {
            itemsArr.push({type: '2', sourceId: activity.activityId, name: '微信分享'})
          }
        } else {
          if (this.fromVal.chakboxVal.length == 0) {
            this.$Message.error('请选择方案')
            return
          }
          if (this.fromVal.chakboxVal.indexOf('0') != -1) {
            if(this.fromVal.postList.length == 0) {
              this.$Message.error('请选择海报')
              return
            } else {
              this.fromVal.postList.forEach((item) => {
                itemsArr.push({type: '0', sourceId: JSON.parse(item).id, name: JSON.parse(item).name})
              })
            }
          }
          if (this.fromVal.chakboxVal.indexOf('1') != -1) {
            if (this.fromVal.invitationList.length == 0) {
              this.$Message.error('请选择邀请函')
              return
            } else {
              this.fromVal.invitationList.forEach((item) => {
                itemsArr.push({type: '1', sourceId: JSON.parse(item).id, name: JSON.parse(item).name})
              })
            }
          }
          if (this.fromVal.chakboxVal.indexOf('2') != -1) {
            itemsArr.push({type: '2', sourceId: activity.activityId, name: '微信分享'})
          }
          if (itemsArr.length < 2) {
            this.$Message.error('请选择邀请函、微信分享中的两个或两个以上')
            // this.$Message.error('请选择海报、邀请函、微信分享中的两个或两个以上')
            return
          }
        }
        let parms = {
          activityId: activity.activityId, // 选择活动的id
          activityImg: activity.activityImg, // 选择活动的海报
          activityMember: activity.activityMember, // 选择活动的昵称
          activityTitle: activity.activityTitle, // 选择活动的名称
          userId: this.userData.userId, // 用户userId
          beginTime: this.fromVal.beginTime, // 开始时间
          endTime: this.fromVal.endTime, // 结束时间
          name: this.fromVal.name, // 计划名称
          items: itemsArr, // 选择方案以及方案内容id
          type: this.fromVal.type, // 营销方案
          userCount: this.fromVal.number, // 推广用户数量
          exeCount: this.fromVal.executeNumver // 计划推广次数
        }
        if (this.fromVal.id) parms._id = this.fromVal.id
        this.ajaxData(parms)
      },
      timeChange () {

      },
      invitationData (id, obj) {
        this.requestAjax('GET', 'invitationConfig', {activityId: JSON.parse(this.fromVal.activity).activityId, limit: 100}).then((data) => {
          this.total = 0
          if (data.success) {
            data.data.rows.forEach((item) => {
              item.value = JSON.stringify({id: item.id, name: item.name})
            })
            this.invitationList = data.data.rows
          }
          if (this.value.id && obj) {
            this.$nextTick(() => {
              if (this.fromVal.type == '1') {
                this.fromVal.invitation = obj.invitation
              } else {
                this.fromVal.invitationList = obj.invitationList
              }
              this.fromVal = JSON.parse(JSON.stringify(this.fromVal))
            })
          }
        })
      },
      posterData (id,obj) {
        this.requestAjax('GET', 'poster', {activityId: JSON.parse(this.fromVal.activity).activityId, limit: 100}).then((data) => {
          if (data.success) {
              data.data.rows.forEach((item) => {
                item.value = JSON.stringify({id: item.id, name: item.name})
              })
             this.postList = data.data.rows
          }
          if(this.value.id && obj) {
            this.$nextTick(() => {
              if (this.fromVal.type == '1') {
                this.fromVal.post = obj.post
              } else {
                this.fromVal.postList = obj.postList
              }
              this.fromVal = JSON.parse(JSON.stringify(this.fromVal))
            })
          }
        })
      },
      selectChange (val) {
        this.fromVal.invitationList = []
        this.invitationList = []
        this.fromVal.postList = []
        this.postList = []
        if (val) {
          this.invitationData(JSON.parse(val).activityId)
          this.posterData(JSON.parse(val).activityId)
        }
      },
      ajaxData (parms) {
        this.buttonDisabled = true
        let msg =this.options.title
        this.requestFile('post', 'createOrUpdatePromotionPlan', parms).then((data) => {
          this.buttonDisabled = false
          if (data.success) {
            this.$Message.success(msg + '成功')
            this.$emit('hiddenModal', 'success')
          } else {
            this.$Message.error(msg + '失败')
          }

        }, () => {
          this.buttonDisabled = false
          this.$Message.error(msg + '失败')
        })
      },
      getList (items) {
        let obj = {chakboxVal: [], disabledGroup: '', postList: [], invitationList: [], post: '', invitation: ''}
        for (let item of items) {
          if (this.fromVal.type == 1) {
            obj.disabledGroup = item.type
            if (item.type == 0) {
              obj.post = JSON.stringify({id: item.sourceId, name: item.name})
            }
            if (item.type == 1) {
              obj.invitation = JSON.stringify({id: item.sourceId, name: item.name})
            }
          } else {
            if (obj.chakboxVal.indexOf('' + item.type) == -1) {
              obj.chakboxVal.push('' + item.type)
            }
            if (item.type == 0) {
              obj.postList.push(JSON.stringify({id: item.sourceId, name: item.name}))
            }
            if (item.type == 1) {
              obj.invitationList.push(JSON.stringify({id: item.sourceId, name: item.name}))
            }
          }
        }
        return obj
      }
    },
    components: {
      iTime
    }
  }
</script>

<style scoped>

  .red_tip {
    display: inline-block;
    width: 10px;
    height: 20px;
    color: #FF0000;
    vertical-align: sub;
  }

  .title-wrapper {
    text-align: right;
    padding-right: 20px;
  }
</style>
