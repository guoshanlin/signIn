<template>

  <div class='editor-wrapper m-t10'>
    <div class='container ueditor-content'>
      <div :id='id' class='edui_editor_wrp'></div>
    </div>

    <Modal
      v-model="modalMast"
      title="上传图片">
      <div>
        <!--:action="getWbkUrl('upload')"-->
        <Upload
          ref="upload"
          multiple
          type="drag"
          name="file"
          accept="image/*"
          :on-success="successFile"
          :action="actionUrl">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或拖拽上传</p>
          </div>
        </Upload>
      </div>
    </Modal>
  </div>

</template>

<script>

  import '../../../static/ueditor/ueditor/ueditor.config'
  import '../../../static/ueditor/ueditor/ueditor.all'
  import '../../../static/ueditor/ueditor_custom'
  import '../../../static/ueditor/ueditor/lang/zh-cn/zh-cn'

  export default {
    props: {
      value: ''
    },
    data() {
      return {
        modalMast: false,
        actionUrl: process.env.API + this.getWbkUrl('upload'),

        id: 'ueditor',
        editor: null,
        valueUE: this.value
      }
    },
    destroyed() {
      UE.delEditor(this.id)
    },
    beforeCreate() {
      let _this = this
      UE.registerUI('insertimage2', function (editor, uiName) {
        editor.registerCommand(uiName, {
          execCommand: function () {
            _this.selectFile()
          }
        })
        var btn = new UE.ui.Button({
          name: uiName,
          title: '图片',
          cssRules: '',
          onclick: function () {
            editor.execCommand(uiName)
          }
        })
        return btn
      })
    },
    created() {
      this.$nextTick(() => {
        let editorId = 'appmsg_editor'
        this.editor = UE.getEditor(this.id, {
          id: editorId,
          wordCount: false,
          elementPathEnabled: false
        })
        this.editor.addListener('catchremotesuccess', function () {
          console.log('内容已上传完成')
        })
        this.editor.addListener('catchremoteerror', function () {
          console.log('远程图片抓取失败')
        })
        this.editor.addListener('contentChange', () => {
          const content = this.editor.getContent()
          this.$emit('input', content)
        })

        this.editor.ready(() => {
          this.editor.setContent(this.value)
          document.querySelector('#' + this.editor.ui.toolbars[0].id).classList.add('edui-toolbar-primary')
          document.querySelector('#' + this.editor.ui.toolbars[1].id).classList.add('edui-toobar-secondary')
          document.querySelector('#' + editorId + '_toolbarbox').classList.add('show-edui-more')
        })
      })
    },
    methods: {
      getEditor() {
        return this.editor
      },
      selectFile () {
        this.modalMast = true
      },
      successFile(response){
        this.$refs.upload.clearFiles()
        this.editor.focus()
        this.modalMast = false
        this.editor.execCommand('inserthtml', '<img src="' + this.$global + response.msg + '" />')
      }
    }
  }
</script>

<style scoped>

</style>
