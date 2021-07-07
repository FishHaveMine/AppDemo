var staticInfo = {
  // uploadHost: window.location.origin + '/ops/'
  uploadHost: '/ops/'
}

function getTheOptionsByDiction (uuid) {
  return new Promise(function (resolve, reject) {
    app.PostData(true, staticInfo.uploadHost + 'workflow/dataSource/rest/dictionary', {
      'uuid': uuid
    }, function (data) {
      var responseBody = data.responseBody.properties
      var options = []

      if (responseBody) {
        responseBody.value && responseBody.value.map(function (item) {
          var base = {
            'label': item,
            'value': item
          }
          options.push(base)
        })
      }

      var back = {
        list: {
          options: options
        }
      }
      resolve(back)
    })
  })
} 

// 获取url参数
function getUrlVariable (variable) {
  var url = window.location.search.substring(1)
  var vars = url.split('&')

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')

    if (pair[0] == variable) {
      return pair[1]
    }
  }

  return null
}

/** *** 表单默认配置方法  start *****/
/**
 * 根据流程节点的字段配置，设置流程当前节点的隐藏显示、只读、必填、环境变量
 */
function setFieldAttribute (processKey, nodeId, formKey) {
  app.PostData(false, staticInfo.uploadHost + 'workflow/process/rest/config/query/all', {
    'processKey': processKey,
    'nodeId': nodeId,
    'formKey': formKey
  }, function (data) {
    // 获取查看状态
    var view = getUrlVariable('view')
    var list = data.responseBody

    if (list && list != '') {
      if (list.length > 0) {
        // 流程变量数组
        var processVariable = [] 
        
        // 子表必填数组
        var tabelRequire = []

        for (var i = 0; i < list.length; i++) {
          // 隐藏显示
          if (list[i].hide == 'true') {
            app.setHiddenByKey(list[i].model, true)
          }

          if (!view || view != 'true') {
            // 字段只读
            if (list[i].readonly == 'true') {
              app.setDisableByKey(list[i].model, true)
            } 
            
            // 字段必填
            if (list[i].required == 'true' && list[i].type != 'table') {
              app.setRequiredByKey(list[i].model, true)
            } 
            
            // 子表必填
            /* if (list[i].required == "true" && list[i].type == "table") {
            		app.setTabelRequire(list[i].model, true);
            		} */
          } 
          
          // 流程变量设置
          if (list[i].processVariable == 'true') {
            processVariable.push(list[i].model)
          } 
          
          // 子表必填设置
          if (list[i].required == 'true' && list[i].type == 'table') {
            tabelRequire.push(list[i].model)
          }
        } 
        
        // 设置流程变量
        app.setVariables(processVariable) 
        
        // 设置子表必填
        app.setTabelRequire(tabelRequire)
      }
    }
  })
}

// 在表单上调用，改变环境变量后，自动更新下一节点
function getNextNodeOnForm () {
  // 获取下一节点
  // parent.window.getNextNodeList();
  var iframeUuid = getUrlVariable('iframeUuid')
  parent.window.getNextNodeListFuns[iframeUuid]()
}

/**
 * 页面初始化方法
 * 在表单加载后、unit.js调用之前，进行调用
 * */
function onMounted () {
  console.log('onMounted') 
  
  // 获取回显数据，并且调用后才可使用getBaseInfo
  var iframeUuid = getUrlVariable('iframeUuid')
  parent.window.setFormBaseInfoFuns[iframeUuid](iframeUuid)
  
  var processKey = app.getBaseInfo().processKey
  var nodeId = app.getBaseInfo().nodeId
  var formKey = app.getBaseInfo().formKey 
  
  // 根据流程节点的字段配置，设置流程当前节点的隐藏显示、只读、必填、环境变量
  setFieldAttribute(processKey, nodeId, formKey)
}
/** *** 表单默认配置方法  end *****/

/** *** 配置项通用方法  start *****/
// 获取配置项-基类-物理CI-软硬件下的分类
function getSoftAndHardwareClassification () {
  return new Promise(function (resolve, reject) {
    app.PostData(true, staticInfo.uploadHost + 'cmdb/model/getModelTree', {}, function (data) {
      var responseBody = data.responseBody
      var options = []

      if (responseBody && responseBody != '') {
        if (responseBody.length > 0) {
          // 获取基类
          var CIBase = {}

          for (var i = 0; i < responseBody.length; i++) {
            if (responseBody[i].fieldName == 'CIBase') {
              CIBase = responseBody[i]
              break
            }
          }

          var CIBaseChildren = CIBase.children 
          
          // 获取物理CI
          var PhysicalCI = {}
          for (var j = 0; j < CIBaseChildren.length; j++) {
            if (CIBaseChildren[j].fieldName == 'PhysicalCI') {
              PhysicalCI = CIBaseChildren[j]
              break
            }
          }

          var PhysicalCIChildren = PhysicalCI.children 
          
          // 获取硬软件
          var OnlineCI = {}
          for (var k = 0; k < PhysicalCIChildren.length; k++) {
            if (PhysicalCIChildren[k].fieldName == 'OnlineCI') {
              OnlineCI = PhysicalCIChildren[k]
              break
            }
          }

          if (Object.keys(OnlineCI).length > 0) {
            // 构造下拉树的数据
            options = getChildrenData(OnlineCI)
          } else {
            options = getChildrenData(CIBase)
          }

          resolve(options)
        }
      }
    })
  })
} 

// 获取配置项-基类（CIBase）下的分类
function getSoftAndHardwareClassificationAll () {
  return new Promise(function (resolve, reject) {
    app.PostData(true, staticInfo.uploadHost + 'cmdb/model/getModelTree', {}, function (data) {
      var responseBody = data.responseBody
      var options = []

      if (responseBody && responseBody != '') {
        if (responseBody.length > 0) {
          // 获取基类
          var CIBase = {}

          for (var i = 0; i < responseBody.length; i++) {
            if (responseBody[i].fieldName == 'CIBase') {
              CIBase = responseBody[i]
              break
            }
          }

          options = getChildrenData(CIBase)
          resolve(options)
        }
      }
    })
  })
} 

// 获取子节点数据
function getChildrenData (jsonobject) {
  var sour = []
  var thisChildren = jsonobject.children

  for (var i = 0; i < thisChildren.length; i++) {
    var json = {}
    var label = thisChildren[i].label
    var value = thisChildren[i].id
    json['label'] = label
    json['value'] = value 
    
    // 构造子数据
    var children = getChildrenData(thisChildren[i])

    if (children.length > 0) {
      json['children'] = children
    }

    sour.push(json)
  }

  return sour
}

/**
 * cmdb-查询配置项实例列表
 * 根据分类id，查询分类下的配置项实例
 */
function getCmdbInstanceByModelId (modelId) {
  return new Promise(function (resolve, reject) {
    app.PostData(true, staticInfo.uploadHost + 'cmdb/instance/getByModelId', {
      'modelId': modelId
    }, function (data) {
      var responseBody = data.responseBody
      var options = []

      if (responseBody && responseBody != '') {
        if (responseBody.length > 0) {
          // 构造下拉树的数据
          for (var i = 0; i < responseBody.length; i++) {
            var json = {}
            var label = responseBody[i].name
            var value = responseBody[i].uuid

            if (label == undefined || label == '') {
              label = responseBody[i].properties.ip
            }

            json['label'] = label
            json['value'] = value
            options.push(json)
          }
        }
      }

      resolve(options)
    })
  })
}

/**
 * cmdb-根据模型名称查询配置项实例列表
 * 根据分类ModelName，查询分类下的配置项实例
 */
function getCmdbInstanceByModelName (name) {
  return new Promise(function (resolve, reject) {
    app.PostData(true, staticInfo.uploadHost + 'cmdb/instance/getByModelName', {
      'name': name
    }, function (data) {
      var responseBody = data.responseBody
      var options = []

      if (responseBody && responseBody != '') {
        if (responseBody.length > 0) {
          // 构造下拉树的数据
          for (var i = 0; i < responseBody.length; i++) {
            var json = {}
            var label = responseBody[i].name
            var value = responseBody[i].uuid
            json['label'] = label
            json['value'] = value
            options.push(json)
          }
        }
      }

      resolve(options)
    })
  })
}

/**
 * cmdb-查询配置项
 * 根据配置项实例uuid，查询该配置项的详细信息
 */
function getInstanceInfoByUuid (uuid) {
  return new Promise(function (resolve, reject) {
    app.PostData(true, staticInfo.uploadHost + 'cmdb/instance/getById', {
      'uuid': uuid
    }, function (data) {
      var info = data.responseBody
      resolve(info)
    })
  })
} 

// 获取配置项-基类（CIBase）-物理CI（PhysicalCI）-软硬件（OnlineCI）下的分类
function onlineCISelect () {
  return new Promise(function (resolve, reject) {
    getSoftAndHardwareClassification().then(function (data) {
      var sour = {
        'list': {
          'options': data
        }
      }
      resolve(sour)
    })
  })
} 

// 获取配置项-基类（CIBase）下的分类
function onlineCISelectAll () {
  return new Promise(function (resolve, reject) {
    getSoftAndHardwareClassificationAll().then(function (data) {
      var sour = {
        'list': {
          'options': data
        }
      }
      resolve(sour)
    })
  })
} 

// 获取配置项-业务系统分类下的数据
function bizSystemSelect () {
  return new Promise(function (resolve, reject) {
    // 使用配置项-业务系统分类数据
    getCmdbInstanceByModelName('业务系统').then(function (data) {
      // 构造下拉数据格式
      var sour = {
        'list': {
          'options': data
        }
      }
      resolve(sour)
    })
  })
}
/** *** 配置项通用方法  end *****/

/** *** 表单默认下拉方法  start *****/
// 获取所有用户
function userSelect () {
  return new Promise(function (resolve, reject) {
    app.PostData(true, staticInfo.uploadHost + 'workflow/form/getAllUserList', {}, function (data) {
      var options = data.responseBody
      var json = {
        'list': {
          'options': options
        }
      }
      resolve(json)
    })
  })
} 

// 获取所有部门
function departmentSelect () {
  return new Promise(function (resolve, reject) {
    app.PostData(true, staticInfo.uploadHost + 'workflow/form/getAllDepartmentList', {}, function (data) {
      var options = data.responseBody
      var json = {
        'list': {
          'options': options
        }
      }
      resolve(json)
    })
  })
} 

// 获取所有角色
function roleSelect () {
  return new Promise(function (resolve, reject) {
    app.PostData(true, staticInfo.uploadHost + 'workflow/form/getAllRoleList', {}, function (data) {
      var options = data.responseBody
      var json = {
        'list': {
          'options': options
        }
      }
      resolve(json)
    })
  })
}
/** *** 表单默认下拉方法  end *****/

/** *** 表单通用下拉方法  start *****/
// 服务模板下拉
function templateSelect () {
  return new Promise(function (resolve, reject) {
    var responseBody = queryFormManageList('kform201103144020802', '', 1, 1000)
    var options = []
    var result = responseBody.result

    if (result && result != '' && result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        var json = {}
        json.label = result[i].properties.title
        json.value = result[i].uuid
        options.push(json)
      }
    }

    var data = {
      'list': {
        'options': options
      }
    }
    resolve(data)
  })
} 

// 事件一级分类下拉
function levelOneSelect () {
  return new Promise(function (resolve, reject) {
    var responseBody = queryFormManageList('kform201105153157045', '', 1, 1000)
    var options = []
    var result = responseBody.result

    if (result && result != '' && result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        var _json = {}
        _json.label = result[i].properties.levelone
        _json.value = result[i].properties.levelone // 判断是否存在相同的对象

        var b = false

        for (var j = 0; j < options.length; j++) {
          if (_json.label == options[j].label) {
            b = true
            break
          }
        } 
        
        // 若不存在，添加到options
        if (!b) {
          options.push(_json)
        }
      }
    }

    var json = {
      'list': {
        'options': options
      }
    }
    resolve(json)
  })
} 

// 事件二级分类下拉
function levelTwoSelect () {
  return new Promise(function (resolve, reject) {
    var responseBody = queryFormManageList('kform201105153157045', '', 1, 1000)
    var options = []
    var result = responseBody.result

    if (result && result != '' && result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        var _json2 = {}
        _json2.label = result[i].properties.leveltwo
        _json2.value = result[i].properties.leveltwo 
        
        // 判断是否存在相同的对象
        var b = false

        for (var j = 0; j < options.length; j++) {
          if (_json2.label == options[j].label) {
            b = true
            break
          }
        } 
        
        // 若不存在，添加到options
        if (!b) {
          options.push(_json2)
        }
      }
    }

    var json = {
      'list': {
        'options': options
      }
    }
    resolve(json)
  })
}
/** *** 表单通用下拉方法  end *****/

/** *** 表单通用方法  start *****/
/**
 * 根据部门uuid，获取部门用户
 * 多个部门以英文逗号分隔，参数 departmentUuids 的值是一个字符串，例如 departmentUuids = "uuid1,uuid2"
 * */
function getUserInfoByDepartmentUuids (departmentUuids) {
  if (!departmentUuids || departmentUuids == '') {
    console.log('请输入部门uuid！')
    return
  }

  var responseBody = null
  app.PostData(false, staticInfo.uploadHost + 'workflow/form/getUserInfoByDepartmentUuids', {
    'departmentUuids': departmentUuids
  }, function (data) {
    responseBody = data.responseBody
  })
  return responseBody
}

/**
 * 根据角色uuid，获取角色用户
 * 多个角色以英文逗号分隔，参数 roleUuids 的值是一个字符串，例如 roleUuids = "uuid1,uuid2"
 * */
function getUserInfoByRoleUuids (roleUuids) {
  if (!roleUuids || roleUuids == '') {
    console.log('请输入角色uuid！')
    return
  }

  var responseBody = null
  app.PostData(false, staticInfo.uploadHost + 'workflow/form/getUserInfoByRoleUuids', {
    'roleUuids': roleUuids
  }, function (data) {
    responseBody = data.responseBody
  })
  return responseBody
}

/**
 * 根据用户uuid，部门uuid，角色uuid，获取用户
 * 多个值以英文逗号分隔，参数 group 的值是一个字符串，例如 group = "uuid1,uuid2,departUuid1,roleUuid1"
 * */
function getUserInfoByGroup (group) {
  if (!group || group == '') {
    console.log('请输入groupuuid！')
    return
  } 
  
  // 转成数组 ["uuid1", "uuid2", "departUuid1", "roleUuid1"]
  var thisGroup = group.split(',')
  var responseBody = null
  app.PostData(false, staticInfo.uploadHost + 'workflow/form/rest/getUserInfoByGroup', {
    'group': thisGroup
  }, function (data) {
    responseBody = data.responseBody
  })
  return responseBody
}

/**
 * 获取表单数据列表
 * formKey  表单key
 * keyWord  查询关键字，不需要则填""或NULL
 * page  查询分页页码，不需要则填""或NULL，默认为1
 * limit  查询每页条数，不需要则填""或NULL，默认为1000
 * */
function queryFormManageList (formKey, keyWord, page, limit) {
  if (!formKey || formKey == '') {
    console.log('请输入formKey！')
    return
  }

  if (!keyWord || keyWord == '') {
    keyWord = ''
  }

  if (!page || page == '') {
    page = 1
  }

  if (!limit || limit == '') {
    limit = 1000
  }

  var responseBody = null
  app.PostData(false, staticInfo.uploadHost + 'workflow/formManage/rest/queryFormManageList', {
    'formKey': formKey,
    'keyWord': keyWord,
    'pageInfo': {
      'page': page,
      'limit': limit
    }
  }, function (data) {
    responseBody = data.responseBody
  })
  return responseBody
}

/**
 * 获取表单实列信息
 * formKey  表单key
 * uuid  表单实例uuid
 * */
function queryFormManage (formKey, uuid) {
  if (!formKey || formKey == '') {
    console.log('请输入formKey！')
    return
  }

  if (!uuid || uuid == '') {
    console.log('请输入uuid！')
    return
  }

  var responseBody = null
  app.PostData(false, staticInfo.uploadHost + 'workflow/formManage/rest/queryFormManage', {
    'formKey': formKey,
    'uuid': uuid
  }, function (data) {
    responseBody = data.responseBody
  })
  return responseBody
}

/**
 * 根据子表模板，生成新的子表JSON
 * */
function getSubFormJSONByTemplate (subform) {
	var s = [];
	
	if (subform && subform != '' && subform.length > 0) {
    for (var i = 0; i < subform.length; i++) {
      if (subform[i].subtype == 'input' || subform[i].subtype == 'textarea' || subform[i].subtype == 'number' 
      || subform[i].subtype == 'time' || subform[i].subtype == 'date' || subform[i].subtype == 'dateTime') {
        var json = {};
        json.type = subform[i].subtype;
        json.name = subform[i].subname;
        
        var ToPinYin = new ChineseToPinYin();
        var model = ToPinYin.chineseToPinYin('single', subform[i].subname);
        json.key = model;
        json.model = model;
        
        var options = {};
        options.defaultValue = subform[i].subdefault;
        options.required = false;
        options.disabled = false;
        options.hidden = false;
        json.options = options;
        
        s.push(json);
      } else if (subform[i].subtype == 'select' || subform[i].subtype == 'radio') {
        var _json3 = {};
        _json3.type = subform[i].subtype;
        _json3.name = subform[i].subname;

        var _ToPinYin = new ChineseToPinYin();

        var _model = _ToPinYin.chineseToPinYin('single', subform[i].subname);
        _json3.key = _model;
        _json3.model = _model;
        
        var _options = {};
        _options.defaultValue = subform[i].subdefault;
        _options.required = false;
        _options.disabled = false;
        _options.hidden = false;
        _options.remote = true;
        _options.remoteType = 'func';
        _options.remoteFunc = subform[i].subselect;
        _json3.options = _options;
        
        s.push(_json3);
      } else if (subform[i].subtype == 'select-multiple') {
        var _json4 = {};
        _json4.type = 'select';
        _json4.name = subform[i].subname;

        var _ToPinYin2 = new ChineseToPinYin();
        var _model2 = _ToPinYin2.chineseToPinYin('single', subform[i].subname);
        _json4.key = _model2;
        _json4.model = _model2;
        
        var _options2 = {};
        var defaultValue = [];
        var defaultValues = subform[i].subdefault.split(',');

        if (defaultValues && defaultValues != '' && defaultValues.length > 0) {
          for (var j = 0; j < defaultValues.length; j++) {
            defaultValue.push(defaultValues[j]);
          }
        }

        _options2.defaultValue = defaultValue;
        _options2.multiple = true;
        _options2.required = false;
        _options2.disabled = false;
        _options2.hidden = false;
        _options2.remote = true;
        _options2.remoteType = 'func';
        _options2.remoteFunc = subform[i].subselect;
        _json4.options = _options2;
        
        s.push(_json4);
      } else if (subform[i].subtype == 'checkbox' || subform[i].subtype == 'cascader') {
        var _json5 = {};
        _json5.type = subform[i].subtype;
        _json5.name = subform[i].subname;

        var _ToPinYin3 = new ChineseToPinYin();
        var _model3 = _ToPinYin3.chineseToPinYin('single', subform[i].subname);
        _json5.key = _model3;
        _json5.model = _model3;
        
        var _options3 = {};
        var _defaultValue = [];
        var _defaultValues = subform[i].subdefault.split(',');

        if (_defaultValues && _defaultValues != '' && _defaultValues.length > 0) {
          for (var _j = 0; _j < _defaultValues.length; _j++) {
            _defaultValue.push(_defaultValues[_j]);
          }
        }

        _options3.defaultValue = _defaultValue;
        _options3.required = false;
        _options3.disabled = false;
        _options3.hidden = false;
        _options3.remote = true;
        _options3.remoteType = 'func';
        _options3.remoteFunc = subform[i].subselect;
        _json5.options = _options3;
        
        s.push(_json5);
      } else if (subform[i].subtype == 'fileupload') {
        var _json6 = {};
        _json6.type = subform[i].subtype;
        _json6.name = subform[i].subname;

        var _ToPinYin4 = new ChineseToPinYin();
        var _model4 = _ToPinYin4.chineseToPinYin('single', subform[i].subname);
        _json6.key = _model4;
        _json6.model = _model4;
        
        var _options4 = {};
        _options4.defaultValue = [];
        _options4.required = false;
        _options4.disabled = false;
        _options4.hidden = false;
        _json6.options = _options4;
        
        s.push(_json6);
      } else if (subform[i].subtype == 'switch') {
        var _json7 = {};
        _json7.type = subform[i].subtype;
        _json7.name = subform[i].subname;

        var _ToPinYin5 = new ChineseToPinYin();
        var _model5 = _ToPinYin5.chineseToPinYin('single', subform[i].subname);
        _json7.key = _model5;
        _json7.model = _model5;
        
        var _options5 = {};

        if (subform[i].subdefault == 'true') {
          _options5.defaultValue = true;
        } else {
          _options5.defaultValue = false;
        }

        _options5.required = false;
        _options5.disabled = false;
        _options5.hidden = false;
        _json7.options = _options5;
        
        s.push(_json7);
      }
    }
  }
	
	return s;
}

/**
 * 生成服务模板子表
 * uuidField: 模板下拉字段，必填
 * titleField: 需要回填的标题对应的字段名，非必填，没有则填''
 * descriptionField: 需要回填的内容对应的字段名,非必填，没有则填''
 * subformField: 需要生成的子表对应的字段名，必填
 * */
function generateSubFormByTemplate (uuidField, titleField, descriptionField, subformField) {
  if (!uuidField || uuidField == '') {
    console.log('请填写模板下拉字段uuidField！');
    return;
  }

  if (!subformField || subformField == '') {
    console.log('请填写需要生成的子表对应的字段名subformField！');
    return;
  }

  var uuid = app.getValue(uuidField);
  
  // 根据表单formKey和表单实例uuid获取表单实列信息
  var responseBody = queryFormManage('kform201103144020802', uuid);

  if (titleField && titleField != '') {
    // 设置模板标题
    var title = responseBody.properties.title;
    app.setValue(titleField, title);
  }

  if (descriptionField && descriptionField != '') {
    // 设置模板内容
    var description = responseBody.properties.description;
    app.setValue(descriptionField, description);
  } 
  
	//生成子表JSON
  var s = [];
  var subform = responseBody.properties.subform;
  s = getSubFormJSONByTemplate(subform);

	//设置模板子表
  app.exchange(subformField, s);
}

/**
 * 生成模板子表
 * mainModelField: 主表单的模板下拉字段名，必填
 * mainSubformField: 主表单需要生成的子表对应的字段名，必填
 * mainFields: 主表单需要赋值的字段名，多个以英文逗号分隔，非必填，没有则填''
 * templateFields: 模板需要取值的字段名，多个以英文逗号分隔，非必填，没有则填''
 * 		例如：templateField = 'A,B,C'，mainField = 'a,b,c'，则调用该函数时，会将模板的字段A的值赋给主表单的字段a，字段B的值赋给字段b，字段C的值赋给字段c
 * templateSubformField: 模板需要获取的子表对应的字段名，必填
 * templateFormKey: 模板的表单formKey，必填
 * */
function generateSubFormByTemplate2 (mainModelField, mainSubformField, mainFields, templateFields, templateSubformField, templateFormKey) {
  if (!mainModelField || mainModelField == '') {
    console.log('请填写主表单的模板下拉字段名 mainModelField！');
    return;
  }

  if (!mainSubformField || mainSubformField == '') {
    console.log('请填写主表单需要生成的子表对应的字段名 mainSubformField！');
    return;
  }

  if (!templateSubformField || templateSubformField == '') {
    console.log('模板需要获取的子表对应的字段名 templateSubformField！');
    return;
  }

  if (!templateFormKey || templateFormKey == '') {
    console.log('请填写模板的表单formKey templateFormKey！');
    return;
  }

	//主表单的模板下拉的值，即模板的表单实例uuid
  var value = app.getValue(mainModelField);
  
  //根据模板的表单formKey和模板的表单实例uuid获取表单实列信息
  var responseBody = queryFormManage(templateFormKey, value);

	//将模板的内容赋值给主表单
	if (mainFields && mainFields != '' && templateFields && templateFields != '') {
		//模板字段
		var mainFieldArray = mainFields.split(',');
		//主表单字段
		var templateFieldArray = templateFields.split(','); 
		for (var i = 0; i < mainFieldArray.length; i++) {
			if (mainFieldArray[i] != '' && templateFieldArray[i] != '') {
				app.setValue(mainFieldArray[i], responseBody.properties[templateFieldArray[i]]);
			}
		}
	}
	
	//生成子表JSON
  var s = [];
  var subform = responseBody.properties[templateSubformField];
  s = getSubFormJSONByTemplate(subform);

	//设置模板子表
  app.exchange(mainSubformField, s);
}

/**
 * 根据一级分类、二级分类，获取对应的三级分类
 * leveloneField: 需要获取数据的一级分类字段名
 * leveltwoField: 需要获取数据的二级分类字段名
 * levelthreeField: 需要赋值的三级分类字段名
 * */
function getLevelThree (leveloneField, leveltwoField, levelthreeField) {
  var levelone = app.getValue(leveloneField)
  var leveltwo = app.getValue(leveltwoField)
  var levelthree = ''

  if (levelone != '' && leveltwo != '') {
    var responseBody = queryFormManageList('kform201105153157045', '', 1, 1000)
    var result = responseBody.result

    if (result && result != '' && result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        var thislevelone = result[i].properties.levelone
        var thisleveltwo = result[i].properties.leveltwo

        if (levelone == thislevelone && leveltwo == thisleveltwo) {
          levelthree = result[i].properties.levelthree
          break
        }
      }

      app.setValue(levelthreeField, levelthree)
    }
  }
}
/** *** 表单通用方法  start *****/
