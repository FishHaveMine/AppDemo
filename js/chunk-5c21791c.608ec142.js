(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5c21791c"],{"06c5":function(t,e,n){"use strict";n.d(e,"a",(function(){return s}));n("a630"),n("fb6a"),n("b0c0"),n("d3b7"),n("25f0"),n("3ca3");var r=n("6b75");function s(t,e){if(t){if("string"===typeof t)return Object(r["a"])(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Object(r["a"])(t,e):void 0}}},2532:function(t,e,n){"use strict";var r=n("23e7"),s=n("5a34"),i=n("1d80"),a=n("ab13");r({target:"String",proto:!0,forced:!a("includes")},{includes:function(t){return!!~String(i(this)).indexOf(s(t),arguments.length>1?arguments[1]:void 0)}})},"25f0":function(t,e,n){"use strict";var r=n("6eeb"),s=n("825a"),i=n("d039"),a=n("ad6d"),o="toString",c=RegExp.prototype,u=c[o],f=i((function(){return"/a/b"!=u.call({source:"a",flags:"b"})})),l=u.name!=o;(f||l)&&r(RegExp.prototype,o,(function(){var t=s(this),e=String(t.source),n=t.flags,r=String(void 0===n&&t instanceof RegExp&&!("flags"in c)?a.call(t):n);return"/"+e+"/"+r}),{unsafe:!0})},"2f11":function(t,e,n){"use strict";var r=n("ba9b"),s=n.n(r);s.a},4690:function(t,e,n){t.exports=n.p+"img/nullcontent.57791ffb.png"},"4df4":function(t,e,n){"use strict";var r=n("0366"),s=n("7b0b"),i=n("9bdd"),a=n("e95a"),o=n("50c4"),c=n("8418"),u=n("35a1");t.exports=function(t){var e,n,f,l,d,h,g=s(t),p="function"==typeof this?this:Array,v=arguments.length,b=v>1?arguments[1]:void 0,y=void 0!==b,m=u(g),k=0;if(y&&(b=r(b,v>2?arguments[2]:void 0,2)),void 0==m||p==Array&&a(m))for(e=o(g.length),n=new p(e);e>k;k++)h=y?b(g[k],k):g[k],c(n,k,h);else for(l=m.call(g),d=l.next,n=new p;!(f=d.call(l)).done;k++)h=y?i(l,b,[f.value,k],!0):f.value,c(n,k,h);return n.length=k,n}},"6b75":function(t,e,n){"use strict";function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}n.d(e,"a",(function(){return r}))},a04b:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticClass:"messageCenter"},[n("van-pull-refresh",{on:{refresh:t.onRefresh},model:{value:t.refreshing,callback:function(e){t.refreshing=e},expression:"refreshing"}},t._l(t.taskList,(function(e){return n("van-cell",{key:e.uuid,staticClass:"taskBox"},[n("div",{staticClass:"taskBox_title"},[t._v(t._s(e.title))]),n("div",{staticClass:"taskBox_content"},[t._v(t._s(e.content))]),n("div",{staticClass:"taskBox_dao"},[n("div",{staticClass:"createInfo"},[n("div",[t._v(t._s(t._f("ellipsis")(e.createUser)))]),n("div",{staticClass:"createTime"},[t._v(t._s(e.createTime))])]),n("van-button",{attrs:{type:"primary",size:"small",color:"linear-gradient(to right, #4bb0ff, #6149f6)"},on:{click:function(n){return t.handleProcessed(e.uuid)}}},[t._v("已处理")])],1)])})),1),n("div",{directives:[{name:"show",rawName:"v-show",value:t.finished&&0==t.taskList.length,expression:"finished && taskList.length == 0"}],staticClass:"noContent"},[n("img",{attrs:{src:t.nullcontent}})])],1)},s=[],i=(n("99af"),n("caad"),n("fb6a"),n("2532"),n("b85c")),a=n("4690"),o=n.n(a),c={name:"messageCenter",data:function(){return{nullcontent:o.a,taskList:[],loading:!1,finished:!1,refreshing:!1,showTheGroup:"unprocessed",page:{current:1,pageSize:10,total:0},socket:{}}},beforeMount:function(){this.onRefresh()},beforeDestroy:function(){},filters:{ellipsis:function(t){return t?t.length>8?t.slice(0,8)+"...":t:""}},methods:{ws:function(){var t=this,e=this.urls.webSocketkUrl+"/task/";t.socket=new WebSocket(e+"".concat(this.$store.state.userLogin.userMsg.uuid,"@").concat((new Date).getTime())),t.socket.addEventListener("open",(function(){})),t.socket.addEventListener("message",(function(e){if("string"===typeof e.data&&"成功连接"!==e.data){var n=JSON.parse(e.data);if(!n)return!1;var r,s=[],a=Object(i["a"])(n);try{for(a.s();!(r=a.n()).done;){var o=r.value;o.group.includes(t.showTheGroup)&&t.taskList.unshift(o),2===o.state&&s.push(o.uuid)}}catch(d){a.e(d)}finally{a.f()}if(s.length>0){var c,u=[],f=Object(i["a"])(t.taskList);try{for(f.s();!(c=f.n()).done;){var l=c.value;s.includes(l.uuid)||u.push(l)}}catch(d){f.e(d)}finally{f.f()}t.taskList=u}}}))},shutdown:function(){this.socket.close()},getTaskList:function(){var t=this;this.refreshing&&(this.taskList=[],this.refreshing=!1,this.page={current:1,pageSize:10,total:0}),this.spinning=!0;var e=this,n={groupId:this.showTheGroup,page:{current:this.page.current,size:this.page.pageSize}};this.$toast.loading({message:"加载中...",forbidClick:!0,duration:0}),this.postAxios(this.urls.dutytask.taskGetList,n).then((function(n){t.$toast.clear(),0===n.errorCode&&(e.taskList=n.responseBody.result||[],e.taskList&&e.taskList.sort((function(t,e){return new Date(e.createTime).getTime()-new Date(t.createTime).getTime()})),e.page={current:n.responseBody.page.current,pageSize:n.responseBody.page.size,total:n.responseBody.page.total}),e.loading=!1,e.finished=!0,0!=e.page.total&&e.page.current*e.page.pageSize<e.page.total&&(e.finished=!1)}))},handleProcessed:function(t){var e=this,n=this;this.$dialog.confirm({title:"确认处理该事件?",message:""}).then((function(){e.postAxios(e.urls.dutytask.handleProcessed,{taskId:[t]}).then((function(t){0===t.errorCode?n.$toast("处理成功"):n.$toast(t.message),n.onRefresh()}))})).catch((function(){}))},onRefresh:function(){this.finished=!1,this.loading=!0,this.getTaskList()}}},u=c,f=(n("2f11"),n("2877")),l=Object(f["a"])(u,r,s,!1,null,"56d6272a",null);e["default"]=l.exports},a630:function(t,e,n){var r=n("23e7"),s=n("4df4"),i=n("1c7e"),a=!i((function(t){Array.from(t)}));r({target:"Array",stat:!0,forced:a},{from:s})},b85c:function(t,e,n){"use strict";n.d(e,"a",(function(){return s}));n("a4d3"),n("e01a"),n("d28b"),n("e260"),n("d3b7"),n("3ca3"),n("ddb0");var r=n("06c5");function s(t){if("undefined"===typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(t=Object(r["a"])(t))){var e=0,n=function(){};return{s:n,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,i,a=!0,o=!1;return{s:function(){s=t[Symbol.iterator]()},n:function(){var t=s.next();return a=t.done,t},e:function(t){o=!0,i=t},f:function(){try{a||null==s["return"]||s["return"]()}finally{if(o)throw i}}}}},ba9b:function(t,e,n){},caad:function(t,e,n){"use strict";var r=n("23e7"),s=n("4d64").includes,i=n("44d2"),a=n("ae40"),o=a("indexOf",{ACCESSORS:!0,1:0});r({target:"Array",proto:!0,forced:!o},{includes:function(t){return s(this,t,arguments.length>1?arguments[1]:void 0)}}),i("includes")},fb6a:function(t,e,n){"use strict";var r=n("23e7"),s=n("861d"),i=n("e8b5"),a=n("23cb"),o=n("50c4"),c=n("fc6a"),u=n("8418"),f=n("b622"),l=n("1dde"),d=n("ae40"),h=l("slice"),g=d("slice",{ACCESSORS:!0,0:0,1:2}),p=f("species"),v=[].slice,b=Math.max;r({target:"Array",proto:!0,forced:!h||!g},{slice:function(t,e){var n,r,f,l=c(this),d=o(l.length),h=a(t,d),g=a(void 0===e?d:e,d);if(i(l)&&(n=l.constructor,"function"!=typeof n||n!==Array&&!i(n.prototype)?s(n)&&(n=n[p],null===n&&(n=void 0)):n=void 0,n===Array||void 0===n))return v.call(l,h,g);for(r=new(void 0===n?Array:n)(b(g-h,0)),f=0;h<g;h++,f++)h in l&&u(r,f,l[h]);return r.length=f,r}})}}]);