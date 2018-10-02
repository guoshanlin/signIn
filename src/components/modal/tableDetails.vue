<style>
  .inputForm .ivu-col {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .inputForm .ivu-col p {
    line-height: 30px
  }

  .talbeDetails .td {
    padding-left: 6px;
    border: 1px solid #cccccc;
  }

  .talbeDetails .td-c {
    background-color: #F0F0EE;
  }
</style>
<template>
  <Modal
    :title="value.title"
    v-model="isShowModal"
    @on-cancel="cancel"
    class-name="vertical-center-modal talbeDetails inputForm" :width="value.width" id="talbeDetails">
    <div>
      <div style="padding: 20px;">
        <table>
          <tbody>
          <template v-for="rows in value.opintions">
            <tr v-if="rows[0].show">
              <template v-for="row in rows">
                <td class="td td-c" :width="width.short" :height="height">{{row.title}}</td>
                <td class="td" :colspan="row.colspan" :height="height" :width="width.long" v-if="row.type=='select'">
                  <Select clearable style="width: 100%" @on-change="changeContent(arguments[0], row.id)">
                    <Option v-for="item in select[row.id]" :value="item.value" :key="item">{{ item.label }}
                    </Option>
                  </Select>
                </td>
                <td class="td" :colspan="row.colspan" :height="height" :width="width.long" v-if="row.type=='time'">
                  <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间（不含秒）"
                               style="width:100%"
                               @on-change="changeContent(arguments[0], row.id)"></Date-picker>
                </td>
                <td class="td" :colspan="row.colspan" :height="height" :width="width.long" v-if="row.type=='input'">
                  <Input type="text" placeholder="请输入" v-model="valueInput"
                         @on-change="changeContent('',row.id,'valueInput')" style="width: 100%"></Input>
                </td>
                <td class="td" :colspan="row.colspan" :height="height" :width="width.long">
                  <div :name="row.title" style="color: red"
                       v-if="row.type ==='carDate' && row.value.indexOf('已过期') > 0">{{row.value}}
                  </div>
                  <div :name="row.title" v-else>{{row.value}}</div>
                </td>
              </template>
            </tr>
            <tr v-if="rows[0].moreerButton">
              <template v-for="row in rows">
                <td class="td td-c" :width="width.short" :height="height">{{row.title}}</td>
                <td class="td" :colspan="row.colspan" :height="height" :width="width.long">
                  <a href="javascript:void(0)" class="more_zz" @click="clickMore">{{row.value}}</a>
                </td>
              </template>
            </tr>
            <tr v-if="rows[0].moreer" :class="{ 'r_server': display,}">
              <!--影藏部分展示不可修改的内容-->
              <template v-for="row in rows">
                <td class="td td-c" :width="width.short" :height="height">{{row.title}}</td>
                <td class="td" :colspan="row.colspan" :height="height" :width="width.long" v-if="!row.select">
                  {{row.value}}
                </td>
              </template>
            </tr>
          </template>
          </tbody>
        </table>  <!--组件模块不带表头的table-->
      </div>
    </div>
    <div slot="footer">
        <Button v-for="item in value.button" :type="item.type" @click="handle(item.click)"  :key="item.title">{{item.title}}</Button>
    </div>
  </Modal>
</template>
<script>
  export default {
    data() {
      return {
        isShowModal: this.modalshow,
        valueInput: '',
        display: true,
        select: {},
        model8: '',
        height: '35',
        width: {
          long: '240',
          short: '160'
        },
        value: this.newValue
      }
    },
    props: {
      newValue: '',
      modalshow: ''
    },
    watch: {
      modalshow: function modalshow(val) {
        this.isShowModal = val
        // if(val){
        //   this.load()
        // }
      },
      newValue: function value(val) {
        this.value = val
      }
    },
    mounted: function () {
    },

    methods: {
      cancel () {
        this.$emit('getValue', 'hidden') // 双向绑定传值
      },

      handle () {
        this.$Message.info('此功能暂未开放')
        //  this.$emit('getValue', "hidden") // 双向绑定传值
      },

      clickMore () {
        this.display = !this.display
      },
      changeContent () {

      },
      /**
       * 获取文本编辑器的输入值；
       * @param val
       * @param name
       * @param type
       */
      getVal (val, name, type) {
        console.log(val)
      }
    },
    beforeCreate () {
      this.$nextTick(() => {
      })
    }
  }

</script>
