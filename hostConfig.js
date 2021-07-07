/* eslint-disable import/first */
/* eslint-disable no-tabs */

// eslint-disable-next-line no-unexpected-multiline
(function (window, $) {
  var globalHost = {
    // 测试环境地址
    baseURL: 'http://14.29.70.194:52943/itil/'
  }
  window.globalHost = globalHost
  // 用于判断表单是否只读 只读（true）非只读（false）
  window.formIsView = false
  // 表单数据
  window.formData = []
  // 流程信息
  window.processData = []
  // 子表数据
  window.subFormData = []
  // 表单处理操作的数据
  window.footerData = []
  /**
   * 执行脚本
  */
  window.evil = function (fn) {
    const Fn = Function
    new Fn(fn)()
  }
  // 设置显示隐藏（内部使用，不对外提供）
  const utilShow = function (itemTarget, flag) {
    if (!itemTarget) {
      console.error('失败，id 不存在')
      return
    }
    if (flag) {
      itemTarget.isappshowfield = '是'
    } else {
      itemTarget.isappshowfield = '否'
    }
  }

  // 设置是否必填（内部使用，不对外提供）
  const utilRequire = function (itemTarget, flag) {
    if (!itemTarget) {
      console.error('失败，id 不存在')
      return
    }
    if (flag) {
      itemTarget.isrequired = '是'
    } else {
      itemTarget.isrequired = '否'
    }
  }

  // 设置是否只读（内部使用，不对外提供）
  const utilReadOnly = function (itemTarget, flag) {
    if (!itemTarget) {
      console.error('失败，id 不存在')
      return
    }
    if (flag) {
      if (itemTarget.ext_type === 'hidden' || itemTarget.ext_type === 'ckeditor' || itemTarget.ext_type === 'attachFile' ||
      itemTarget.ext_type === 'radio' || itemTarget.ext_type === 'checkbox') {
        itemTarget.isreadonly = '是'
      } else {
        itemTarget.isreadonly = '是'
        if (itemTarget.oldExtType !== itemTarget.ext_type) {
          itemTarget.oldExtType = itemTarget.ext_type
          itemTarget.ext_type = 'HReadonly'
        }
      }
    } else {
      if (itemTarget.ext_type === 'hidden' || itemTarget.ext_type === 'ckeditor' || itemTarget.ext_type === 'attachFile' ||
      itemTarget.ext_type === 'radio' || itemTarget.ext_type === 'checkbox') {
        itemTarget.isreadonly = '否'
      } else {
        itemTarget.isreadonly = '否'
        if (itemTarget.oldExtType !== itemTarget.ext_type) {
          itemTarget.ext_type = itemTarget.oldExtType
        }
      }
    }
  }

  /**
     * 给根据id给表单设置值
     * @param id:表单id
     * @param value:存放的值
     * @param name:显示的中文值，可以为空，为空代表赋值value
    */
  window.app_setValue = function (id, value, name) {
    let itemTarget = window.formData.find(item => item.ext_id === id)
    if (!itemTarget) {
      console.error('赋值失败，id 不存在')
      return
    }
    // 将name、value强转为字符串
    if (value) {
      value = '' + value
    }
    if (name) {
      name = '' + name
    } else {
      const newName = window.app_getComboxName(itemTarget, value)
      if (newName) {
        name = newName
      }
    }
    // 当组件为"多内容输入框"不能直接保存值
    if (itemTarget.ext_type === 'multiText') {
      itemTarget.dialogVal = value
    } else {
      itemTarget.rawvalue = name
      itemTarget.value = value
      itemTarget.scriptSetValue = value
    }
  }

  /**
   * 根据id 获取值
   * @param id:表单id
  */
  window.app_getValue = function (id) {
    const itemTarget = window.formData.find(item => item.ext_id === id)
    if (!itemTarget) {
      console.error('获取失败，id 不存在')
      return
    }
    return itemTarget.value
  }

  /**
   * 根据id 获取对象
   * @param id:表单id
  */
  window.app_getFormItem = function (id) {
    const itemTarget = window.formData.find(item => item.ext_id === id)
    if (!itemTarget) {
      console.error('获取失败，id 不存在')
      return
    }
    return itemTarget
  }

  /**
   * 根据 id 设置隐藏、显示
   * @param id：表单id
   * @param flag:  显示(true)/隐藏(false)
  */
  window.app_show = function (id, flag) {
    const itemTarget = window.formData.find(item => item.ext_id === id)
    utilShow(itemTarget, flag)
  }

  /**
   * 根据id 设置是否必填
   * @param flag:  设置(true)/移除(false)
  */
  window.app_require = function (id, flag) {
    const itemTarget = window.formData.find(item => item.ext_id === id)
    utilRequire(itemTarget, flag)
  }

  /**
   * 根据id 设置是否只读
   * @param flag:  设置(true)/移除(false)
  */
  window.app_readOnly = function (id, flag) {
    const itemTarget = window.formData.find(item => item.ext_id === id)
    utilReadOnly(itemTarget, flag)
  }

  /**
   * 获取当前节点名称
   */
  window.app_getCurNodeName = function () {
    return window.processData.curNodeName
  }

  /**
   * 获取下一节点名称（通常在app_beforeNextStep里面使用，其他去清空是为空的）
   */
  window.app_getNextNodeName = function () {
    let nextNodeName = ''
    if (window.footerData.next.showNext) {
      nextNodeName = window.footerData.next.nextNodes.id || ''
    }
    if (window.footerData.back.showBack) {
      nextNodeName = window.footerData.back.nextNodes.id || ''
    }
    return nextNodeName
  }

  /**
   * 设置下一个节点名称
   * @param value: 节点名称
  */
  window.app_setNextNode = function (value) {
    window.footerData.next.setNextNode = value
  }

  /**
   * 设置下一个处理人
   * @param value: 处理人名称
  */
  window.app_setNextUser = function (value) {
    window.footerData.next.setNextUser = value
  }

  // 获取走过的节点集合
  window.app_getPassNodeNames = function () {
    return window.processData.passNodeNames
  }

  /**
   * 获取当前时间(格式:yyyy-MM-dd hh:mm:ss)
   */
  window.app_getCurDateTime = function () {
    const dateTime = new Date()
    const year = dateTime.getFullYear()
    const month = dateTime.getMonth() < 9 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1
    const day = dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate()
    const date = `${year}-${month}-${day}`
    const time = dateTime.toTimeString().split(' ')[0]
    const dt = date + ' ' + time
    return dt
  }

  /**
   * 获取当前登陆人
  */
  window.app_getCurUser = function () {
    let sour = window.ITILInfo
    return sour ? sour.user : {}
  }

  /**
   * 获取项目地址
  */
  window.app_getContextPath = function () {
    return window.globalHost.baseURL
  }

  /**
   * 新增一组数据
   * @param subFormId 子表id
   * @param data JSON格式的数据
   */
  window.app_addSubForm = function (subFormId, data) {
    const subform = window.subFormData.find(item => item.uuid === subFormId)
    if (!subform) {
      console.error('失败，id 不存在')
      return false
    }
    let group = JSON.parse(JSON.stringify(subform.addGroup))
    // data = {
    //   systemtem: '基础环境-机房,基础环境-安全,基础环境-网络',
    //   modular: '中间件(MW),数据库(DB),工具软件(US)',
    //   equipment: '',
    //   otherequipment: ''
    // }
    group.map(elem => {
      elem.cname = elem.ext_name
      if (data[elem.ext_field]) {
        elem.value = data[elem.ext_field]
      }
      if (elem.value === undefined) {
        elem.value = ''
      }
    })
    group.forEach(leafData => {
      leafData.diyParam = leafData.ext_select
      leafData.name = leafData.ext_id
      leafData.id = window.uuid()
      leafData.linkage = []
      group.forEach(temp => {
        const params = temp.ext_select && temp.ext_select.split('|')
        if (params) {
          params.forEach(param => {
            const p = param.split('_')[0]
            if (leafData.ext_id === p && temp.ext_id !== p) {
              leafData.linkage.push(temp.ext_id)
              if (!temp.rawvalue) {
                temp.rawvalue = `请选择${leafData.ext_id}`
              }
            }
          })
        }
      })
    })
    group.push({
      cname: 'uuid',
      ext_field: 'uuid',
      ext_id: 'uuid',
      ext_maxLength: 'uuid',
      ext_name: 'uuid',
      ext_select: 'uuid',
      ext_type: 'hidden',
      value: ''
    })
    subform.list.push(group)
    // 子表新增一组后的回调函数
    if (typeof window.app_subform_after_add === 'function') {
      let rowId = subform.list.length - 1
      let rowData = group
      // subFormId:子表id，rowId：当前组序号，rowData：当前组数据
      window.app_subform_after_add(subFormId, rowId, rowData)
    }
  }

  /**
   * 移出一组数据
   * @param subFormId 子表id
   * @param number 子表集合索引
   */
  window.app_deleteSubForm = function (subFormId, number) {
    const subform = window.subFormData.find(item => item.uuid === subFormId)
    const itemUuid = subform.list[number].find(item => item.ext_id === 'uuid').value
    if (!subform) {
      console.error('失败，id 不存在')
      return false
    }
    if (itemUuid) {
      subform.deleteGroup.push(itemUuid)
    }
    subform.list.splice(number, 1)
  }

  /**
  * 删除子表全部数据
  * @param subFormId 子表id
  */
  window.app_deleteAllSubForm = function (subFormId) {
    const subform = window.subFormData.find(item => item.uuid === subFormId)
    if (!subform) {
      console.error('失败，id 不存在')
      return false
    }
    subform.list = []
  }

  /**
  * 获取子表某组数据
  * @param subFormId 子表id
  * @param number 子表集合索引
  */
  window.app_getSubFormValue = function (subFormId, number) {
    const subform = window.subFormData.find(item => item.uuid === subFormId)
    if (!subform) {
      console.error('失败，id 不存在')
      return false
    }
    const data = subform.list[number]
    const result = {}
    if (data) {
      data.forEach(item => {
        result[item.ext_field] = item.value
      })
    }
    return result
  }

  /**
  * 设置子表某组数据
  * @param subFormId 子表id
  * @param number 子表集合索引
  * @param data JSON格式的数据
  */
  window.app_setSubFormValue = function (subFormId, number, data) {
    const subform = window.subFormData.find(item => item.uuid === subFormId)
    if (!subform) {
      console.error('失败，id 不存在')
      return false
    }
    // data = {
    //   systemtem: 'b75248d74ab049ccb83db1a4600b42d1,cbeb643fcd7345d6acaa0cc8b7e001cb,a68b6b6cf95d44b7b25dc2db5f9fe49d,286d40ef19c745b7bd0025d48a3445b8,efdd2aea295f41dea259bcef837b3c51',
    //   modular: '中间件(MW),数据库(DB),工具软件(US)',
    //   equipment: '',
    //   otherequipment: ''
    // }
    subform.list[number] && subform.list[number].map(item => {
      const newData = data[item.ext_field]
      if (typeof newData === 'string') {
        const newName = window.app_getComboxName(item, newData)
        if (newName) {
          item.rawvalue = newName
        }
        item.value = newData
        item.scriptSetValue = newData
      }
      return item
    })
  }

  /**
  * 通过id获取某子表对象
  * @param subFormId 子表id
  */
  window.app_getSubFormById = function (subFormId) {
    const subform = window.subFormData.find(item => item.uuid === subFormId)
    if (!subform) {
      console.error('失败，id 不存在')
      return false
    }
    return subform
  }

  /**
  * 获取子表的某组数据
  * @param subFormId 子表id
  * @param number 子表集合索引
  */
  window.app_getSubFormItem = function (subFormId, number) {
    const subform = window.subFormData.find(item => item.uuid === subFormId)
    if (!subform) {
      console.error('失败，id 不存在')
      return false
    }
    return subform.list[number]
  }

  /**
  * 获取子表某个字段的对象集合
  * @param subFormId 子表id
  * @param name 字段名
  */
  window.app_getSubFormField = function (subFormId, name) {
    let fildData = []
    const subform = window.subFormData.find(item => item.uuid === subFormId)
    if (!subform) {
      console.error('失败，id 不存在')
      return false
    }
    subform.list.forEach(item => {
      item.forEach(field => {
        if (field.ext_field === name) {
          fildData.push(field)
        }
      })
    })
    return fildData
  }

  /**
   * 显示/隐藏子表的某个字段
   * @param subFormId 子表id
   * @param name 子表字段
   * @param flag 是否显示 显示(true) 隐藏(false)
   */
  window.app_showSubForm = function (subFormId, name, flag) {
    const subform = window.subFormData.find(item => item.uuid === subFormId)
    subform.list.map(item => {
      item.map(elem => {
        if (elem.ext_field === name) {
          utilShow(elem, flag)
        }
      })
    })
    let addisreadonly = subform.addGroup.find(item => item.ext_field === name)
    utilShow(addisreadonly, flag)
  }

  /**
   *  功能：子表设置某个字段是否只读(true)/必填(false)
   * @param subFormId 子表id
   * @param name 子表字段
   * @param flag 只读true/不只读false
  */
  window.app_readOnlySubForm = function (subFormId, name, flag) {
    const subform = window.subFormData.find(item => item.uuid === subFormId)
    subform.list.map(item => {
      item.map(elem => {
        if (elem.ext_field === name) {
          utilReadOnly(elem, flag)
        }
      })
    })
    let addisreadonly = subform.addGroup.find(item => item.ext_field === name)
    utilReadOnly(addisreadonly, flag)
  }

  /**
  * 功能：子表设置某个字段必填(true)/不必填(false)
  * @param subFormId 子表id
  * @param name 子表字段
  * @param flag 只读true/不只读false
  */
  window.app_requireSubForm = function (subFormId, name, flag) {
    const subform = window.subFormData.find(item => item.uuid === subFormId)
    subform.list.map(item => {
      item.map(elem => {
        if (elem.ext_field === name) {
          utilRequire(elem, flag)
        }
      })
    })
    let addIsrequired = subform.addGroup.find(item => item.ext_field === name)
    utilRequire(addIsrequired, flag)
  }

  /**
  * 功能：带文本输入的对话框
  * @param title 显示标题
  * @param defaultText 默认值
  * @param okFun 点击确认的回调（带一个参数，是文本框的值）
  */
  window.app_prompt = function (title, defaultText, okFun) {
    var json = {
      title: title,
      input: { type: 'text', value: defaultText },
      buttons: [
        { title: '确认', click: okFun },
        { title: '取消' }
      ]
    }
    // eslint-disable-next-line no-undef
    $.alertView(json)
  }

  /**
  * 功能：根据value获取name
  * @param itemTarget 当前组件信息
  * @param value 当前值
  */
  window.app_getComboxName = function (itemTarget, value) {
    let name = ''
    const params = itemTarget.ext_select && itemTarget.ext_select.split('|')
    if (params && params[0] && params[0] !== 0) {
      let APP_TOKEN = localStorage.getItem('APP_TOKEN')
      APP_TOKEN = APP_TOKEN && JSON.parse(APP_TOKEN).value
      let APP_USER = localStorage.getItem('APP_USER')
      APP_USER = APP_USER && JSON.parse(APP_USER).value
      const URL = window.globalHost.baseURL + '/appapi/getComboxName.do'
      const paramData = `autoid=${itemTarget.ext_select}&value=${value}&login_id=${APP_USER}&app_token=${APP_TOKEN}`
      $.ajax({
        url: URL,
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: paramData,
        async: false,
        success: function (result) {
          result = JSON.parse(result)
          if (result.status === 200) {
            if (result.data && result.data.text) {
              name = result.data.text
            }
          }
        }
      })
    }
    return name
  }
  /**
  * 功能：使用脚本执行下拉SQL，返回下拉的结果集
  * @param key (替换SQL中的$1|String)
  * @param autoId (下拉表的autoId,如果有参数，多个以"|"分隔 ，例:700|$2|$3)
  */
  window.app_commHintSelect = function (value, autoId) {
    let data
    let APP_TOKEN = localStorage.getItem('APP_TOKEN')
    APP_TOKEN = APP_TOKEN && JSON.parse(APP_TOKEN).value
    let user = window.app_getCurUser()
    const URL = window.globalHost.baseURL + '/appapi/commHintSelect.do'
    const paramData = `autoid=${autoId}&value=${value}&login_id=${user.loginId}&user_id=${user.userId}&app_token=${APP_TOKEN}`
    $.ajax({
      url: URL,
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      data: paramData,
      async: false,
      success: function (result) {
        result = JSON.parse(result)
        if (result.status === 200) {
          if (result.data) {
            data = result.data
          }
        } else {
          console.err('使用脚本执行下拉SQL出错！！！')
        }
      }
    })
    return data
  }
// eslint-disable-next-line no-undef
})(window, jQuery)
