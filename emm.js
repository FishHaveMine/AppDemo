/**
 * 注：“成功输出”指的是接口执行成功回调函数的入参，“失败输出”指的是接口执行失败回调函数的入参
 *      失败输出统一为：
 *          {"msg":"失败信息"}
 * Created by chaozhong on 2015/11/25.
 * */

/*
 * JS API最终执行函数，JavaScript和原生功能交互桥梁
 *
 * @param apiName:字符串，接口名
 * @param param:字符串或JSON，调用接口需要传递的参数
 * @param oncallback:字符串，接口调用成功回调函数名
 * @param errorcallback:字符串，接口调用失败回调函数名
 * */
function _execute(invokeID, apiName, param, successCallBackName, failedCallBackName) {
    try {
        if (param && typeof param !== "string") {
            param = JSON.stringify(param);
        }
    } catch (e) {
        throw new Error(e.message);
    }
    var src = "emm-services://?action=jsfunction"
        + "&invokeID=" + (invokeID || "")
        + "&apiname=" + (apiName || "")
        + "&param=" + encodeURIComponent(param || "")
        + "&oncallback=" + (successCallBackName || "")
        + "&errorcallback=" + (failedCallBackName || "");
    var element = document.createElement("iframe");
    element.setAttribute("src", src);
    element.setAttribute("style", "display:none");
    element.setAttribute("width", "0px");
    element.setAttribute("height", "0px");
    element.setAttribute("frameborder", "0px");
    document.body.appendChild(element);
    element.parentNode.removeChild(element);

    console.info("successCallBackName", successCallBackName);
    console.info("failedCallBackName", failedCallBackName);
    console.info("invokeID", invokeID);
}

/*
 * 定义全局变量，接口回调函数的引用皆保存于此
 * */
window.JQAPICallBack = {
    callBackObjects: {},
    //接口执行成功回调
    successCallBack: function (invokeID, data) {
        this.callBackObjects[invokeID].successCallBack(data);
        delete  this.callBackObjects[invokeID];
    },
    //接口执行失败回调
    failedCallBack: function (invokeID, data) {
        this.callBackObjects[invokeID].failedCallBack(data);
        delete  this.callBackObjects[invokeID];
    }
};

/*
 * JS API创建工厂，JS API每被调用一次，创建一个实例，该实例保存API回调函数的引用
 * */
function JQAPIFactory(invokeID, APIName, param, successCallBack, failedCallBack) {
    if (typeof  successCallBack !== "function" || typeof  failedCallBack !== "function") {
        throw new Error("callback must be a function.");
    }
    this.successCallBack = successCallBack;
    this.failedCallBack = failedCallBack;
    _execute(invokeID, APIName, param, "JQAPICallBack.successCallBack", "JQAPICallBack.failedCallBack");
}

window.JQAPI = {
    /*
     * 获取SSOToken
     *
     * 输入：
     *      {"ISAID":"业务系统ID"}
     * 成功输出：
     *   {"SSOToken":"token"}
     * */
    getSSOToken: function (param, successCallBack, failedCallBack) {
        var invokeID = "getSSOToken" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "getSSOToken", param, successCallBack, failedCallBack);
    },

    /*
     * 获取用户信息
     *
     * 成功输出：（返回字段供参考）
     *   {
     *       "loginName":"登录名",
     *       "password":"登录密码",
     *       "name":"中文名字",
     *       "imei":"imei",
     *       "os":"手机系统和版本"
     *   }
     * */
    getUserInfo: function (successCallBack, failedCallBack) {
        var invokeID = "getUserInfo" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "getUserInfo", "", successCallBack, failedCallBack);
    },

    /*
     * 获取经纬度
     *
     * 成功输出：
     *       {"latitude":"纬度","longitude":"经度"}
     * */
    getLatitudeAndLongitude: function (successCallBack, failedCallBack) {
        var invokeID = "getLatitudeAndLongitude" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "getLatitudeAndLongitude", "", successCallBack, failedCallBack);
    },

	/**
		分享
	*/
	sharedToChat:function (param, successCallBack, failedCallBack){
		
        var invokeID = "sharedToChat" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "sharedToChat", param, successCallBack, failedCallBack);
    },

    /*
     * 文件下载
     *
     * 输入：
     *       {"url":"下载地址","fileName":"文件名称（带后缀）"}
     * */
    fileDownload: function (param, successCallBack, failedCallBack) {
        var invokeID = "fileDownload" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "fileDownload", param, successCallBack, failedCallBack);
    },

    /*
     * 文件上传（可多文件上传）
     *
     * 输入：
     *      {"file":["文件1URI","文件2URI"...],"url":"接口地址"}
     * 成功输出：
     *
     * */
    fileUpload: function (param, successCallBack, failedCallBack) {
        var invokeID = "fileUpload" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "fileUpload", param, successCallBack, failedCallBack);
    },

    /*
     * 获取相片（打开相机拍摄或打开相册选取）
     *
     * 输入：
     *     {"sourceType":"相片来源（相机或相册）","maxNum":"最大获取相片张数"}
     *     sourceType：0-相册，1-相机
     * 成功输出：JSON数组
     *      [{"path":"相片在文件系统中的绝度路径","base64":"相片base64表示"}]
     * */
    getPicture: function (param, successCallBack, failedCallBack) {
        var invokeID = "getPicture" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "getPicture", param, successCallBack, failedCallBack);
    },

    /*
     * 关闭当前WebView
     * */
    close: function () {
        var invokeID = "close" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "close", "", function () {
        }, function (msg) {
            throw new Error(msg);
        });
    },

    /*
     * 关闭当前WebView
     * */
    back: function () {
        var invokeID = "back" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "back", "", function () {
        }, function (msg) {
            throw new Error(msg);
        });
    },

    getDeviceInfo: function () {
        var invokeID = "getDeviceInfo" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "getDeviceInfo", "", function () {
        }, function (msg) {
            throw new Error(msg);
        });
    },
	
	/**
	*	IC 平台获取用户信息的方法
	*/
	jqGetUserInfo: function (successCallBack, failedCallBack) {
        var invokeID = "jqGetUserInfo" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "jqGetUserInfo", "", successCallBack, failedCallBack);
    },
	
	/**
	*	IC 平台获取用户身份票据
	*/
	jqGetICToken: function (successCallBack, failedCallBack) {
        var invokeID = "jqGetICToken" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "jqGetICToken", "", successCallBack, failedCallBack);
    },
	
	/**
	*	控制页面是否可以缩放，1为禁止，0为可缩放
	*/
     jqSetBrowserForbidZoomControls: function (param) {
         var invokeID = "jqSetBrowserForbidZoomControls" + new Date().getTime();
         JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "jqSetBrowserForbidZoomControls", param, function () {
         }, function (msg) {
             throw new Error(msg);
         });
      },
	
	/**
	*	控制标题栏显示与否
	*/
     jqSetBrowserTopBarShow: function (param) {
         var invokeID = "jqSetBrowserTopBarShow" + new Date().getTime();
         JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "jqSetBrowserTopBarShow", param, function () {
         }, function (msg) {
             throw new Error(msg);
         });
      },

	 /**
	*	控制标题栏“关闭”按钮显示与否
	*/
     jqSetBrowserTopBarCloseShow: function (param) {
         var invokeID = "jqSetBrowserTopBarShow" + new Date().getTime();
         JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "jqSetBrowserTopBarCloseShow", param, function () {
         }, function (msg) {
                throw new Error(msg);
         });
     },

	 /**
	*	控制标题栏“后退”按钮显示与否
	*/
	jqSetBrowserTopBarBackShow: function (param) {
         var invokeID = "jqSetBrowserTopBarBackShow" + new Date().getTime();
         JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "jqSetBrowserTopBarBackShow", param, function () {
         }, function (msg) {
                throw new Error(msg);
         });
     },
    /*
     * 打开一个新WebView
     *
     * 输入：
     *   {"url":"WebView地址（绝对路径或相对路径，未URI编码）"}
     * */
    open: function (param) {
        var invokeID = "open" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "open", param, function () {
        }, function (msg) {
            throw new Error(msg);
        });
    },

    /*
     * 图片查看（可保存图片）
     *
     * 输入：
     *   {"pictures":[图片URI数组],"position":"当前显示图片位置","allowSave":"是否允许保存相片"}
     *   示例：{"pictures":["1.png","2.png"],"position":2,"allowSave":true}
     * */
    viewPicture: function (param) {
        var invokeID = "viewPicture" + new Date().getTime();
        JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "viewPicture", param, function () {
        }, function (msg) {
            throw new Error(msg);
        });
    }
};