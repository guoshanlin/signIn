<template>
  <div>
    <div v-if="ids.length == 2">
      <Row :gutter="10">
        <i-col :span="span[0]">
          <div class="ivu-input-wrapper ivu-input-type">
            <i class="ivu-icon ivu-icon-ios-calendar-outline ivu-input-icon ivu-input-icon-normal" @click='initBTime(ids[0])'></i>
            <input :id="ids[0]" :value="value[ids[0]]" type="text" :placeholder="placeholder[0]" class="ivu-input" @click='initBTime(ids[0],ids[1])'>
          </div>
        </i-col>
        <i-col v-if="interval" span="1" class="ct" style="line-height: 32px">{{interval}}</i-col>
        <i-col :span="span[1]">
          <div class="ivu-input-wrapper ivu-input-type">
            <i class="ivu-icon ivu-icon-ios-calendar-outline ivu-input-icon ivu-input-icon-normal" @click='initETime(ids[1])'></i>
            <input :id="ids[1]" :value="value[ids[1]]" type="text" :placeholder="placeholder[1]" class="ivu-input" @click='initETime(ids[0],ids[1])'>
          </div>
        </i-col>
      </Row>
    </div>
    <div v-if="ids.length == 1">
      <div class="ivu-input-wrapper ivu-input-type">
        <i class="ivu-icon ivu-icon-ios-calendar-outline ivu-input-icon ivu-input-icon-normal" @click='initTime(ids[0])'></i>
        <input :id="ids[0]" :value="value[ids[0]]"  type="text" :placeholder="placeholder[0]" class="ivu-input" @click='initTime(ids[0])'>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        value: {}
      }
    },
    props: {
      ids: '',
      placeholder: '',
      span: '',
      interval: '',
      max: '',
      min: ''
    },
    watch: {
      ids (val) {
        this.ids = val
        this.initValue()
      }
    },
    methods: {
      initValue () {
        this.value = {}
        for (let i = 0; i < this.ids.length; i++) {
          this.value[this.ids[i]] = ''
        }
      },
      initTime (bId) {
        let _this = this
        WdatePicker({
          el: '' + bId,
          dateFmt: 'yyyy-MM-dd HH:mm:ss',
          autoPickDate: false,
          onpicking: function (dp) {
            console.log('initTime', dp.cal.getNewDateStr())
            _this.value[bId] = dp.cal.getNewDateStr()
          }
        })
      },
      initBTime (bId, endID) {
        let _this = this
        let max = '#F{$dp.$D(' + endID + ')}'
        let min = ''
        if(this.max) {
          max = '#F{$dp.$D(\'' + endID + '\')||\'' + this.max + '\'}'
        }
        if(this.min) {
          min = '#F{\'' + this.min + '\'||\'%y-%M-%d %H:%m:%s\'}'
        }
        WdatePicker({
          el: '' + bId,
          dateFmt: 'yyyy-MM-dd HH:mm:ss',
          autoPickDate: false,
          minDate: min,
          maxDate: max,
          onpicking: function (dp) {
            _this.value[bId] = dp.cal.getNewDateStr()
          },
          onpicked: function () {
            _this.$emit('on-change', bId, _this.value[bId])
          },
          oncleared: function () {
            _this.value[bId] = ''
            _this.$emit('on-change', bId, '')
          }
        })
      },
      initETime (bId, endID) {
        let _this = this
        let max = ''
        let min = '#F{$dp.$D(\'' + bId + '\')||\'1990-01-01 00:00:00\'}'
        if (this.max) {
          min = '#F{$dp.$D(\'' + bId + '\')||\'' + this.min + '\'||\'%y-%M-%d %H:%m:%s\'}'
        }
        if (this.min) {
          max = this.max + ''
        }
        WdatePicker({
          el: '' + endID,
          dateFmt: 'yyyy-MM-dd HH:mm:ss',
          autoPickDate: false,
          minDate: min,
          maxDate: max,
          onpicking: function (dp) {
            _this.value[endID] = dp.cal.getNewDateStr()
          },
          onpicked: function () {
            _this.$emit('on-change', endID, _this.value[endID])
          },
          oncleared: function () {
            _this.value[endID] = ''
            _this.$emit('on-change', endID, '')
          }
        })
      },
      getValue () {
        for (let i = 0; i < this.ids.length; i++) {
          this.value[this.ids[i]] = document.getElementById('' + this.ids[i]).value
        }
        return this.value
      },
      setValue (ids, values) {
        if (Object.prototype.toString.call(ids) === '[object Array]') {
          for (let i = 0, ilen = ids.length; i < ilen; i++) {
            document.getElementById('' + ids[i]).value = values[i]
          }
        } else {
          document.getElementById(ids).value = values
        }
      },
      setEmptyBTime () {
        this.value[this.ids[1]] = ''
        this.setValueEmpty(this.ids[0])
      },
      setEmptyETime () {
        this.value[this.ids[1]] = ''
        this.setValueEmpty(this.ids[1])
      },
      setValueEmpty (id) {
         document.getElementById('' + id).value = ''
      }
    },
    beforeCreate () {
      this.$nextTick(() => {
        this.initValue()
      })
    }
  }
</script>

<style scoped>

</style>
