(function(t){function e(e){for(var r,o,i=e[0],c=e[1],u=e[2],m=0,d=[];m<i.length;m++)o=i[m],Object.prototype.hasOwnProperty.call(s,o)&&s[o]&&d.push(s[o][0]),s[o]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(t[r]=c[r]);l&&l(e);while(d.length)d.shift()();return a.push.apply(a,u||[]),n()}function n(){for(var t,e=0;e<a.length;e++){for(var n=a[e],r=!0,i=1;i<n.length;i++){var c=n[i];0!==s[c]&&(r=!1)}r&&(a.splice(e--,1),t=o(o.s=n[0]))}return t}var r={},s={app:0},a=[];function o(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=t,o.c=r,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=e,i=i.slice();for(var u=0;u<i.length;u++)e(i[u]);var l=c;a.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"0cae":function(t,e,n){},"166a":function(t,e,n){"use strict";n("7600")},"1edc":function(t,e,n){},"288d":function(t,e,n){},"2b9b":function(t,e,n){"use strict";n("94b9")},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),s=n("8c4f"),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"app"},[n("router-view")],1)},o=[],i=n("bc3a"),c=n.n(i),u=function(){return c.a.create({baseURL:"https://coroname.uber.space"})},l={sendInteraction:function(t){return console.log(t),u().post("sendInteraction",t)}},m=n("e1bd"),d={name:"App",components:{},data:function(){return{}},watch:{},created:function(){window.addEventListener("resize",this.resize),this.$store.dispatch("setCountries"),this.$store.dispatch("setCurrentCountry","World"),this.$store.commit("setSession",Object(m["a"])())},mounted:function(){var t=this;l.sendInteraction({session:this.$store.state.session,event:"sessionStart"}),this.$nextTick((function(){t.resize()}))},methods:{resize:function(){this.$store.dispatch("setDimensions",{width:window.innerWidth,height:window.innerHeight})}}},h=d,f=n("2877"),p=Object(f["a"])(h,a,o,!1,null,"1004a50a",null),g=p.exports,v=n("ce5b"),y=n.n(v);n("bf40"),n("5363");r["default"].use(y.a);var x={icons:{iconfont:"mdi"},theme:{themes:{light:{primary:"#FA5E2D",secondary:"#b0bec5",anchor:"#8c9eff"},dark:!1}}},b=new y.a(x),w=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",[n("v-container",[n("v-data-table",{staticClass:"elevation-2",attrs:{headers:t.headers,items:t.memories,"items-per-page":25,"sort-by":"updatedAT","sort-desc":!0,dense:""},scopedSlots:t._u([{key:"top",fn:function(){return[n("v-toolbar",{attrs:{flat:""}},[n("v-toolbar-title",[t._v("Review Memories")]),n("v-divider",{staticClass:"mx-4",attrs:{inset:"",vertical:""}}),n("v-spacer"),t.status?n("v-alert",{attrs:{type:"success",dense:""}},[t._v(t._s(t.status))]):t._e(),n("v-dialog",{attrs:{"max-width":"500px"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[n("v-card",[n("v-card-title",[t._v("Are you sure you want to re-approve this item?")]),n("v-card-actions",[n("v-spacer"),n("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.closeDialog}},[t._v("Cancel")]),n("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.approve}},[t._v("OK")]),n("v-spacer")],1)],1)],1)],1)]},proxy:!0},{key:"item.updatedAT",fn:function(e){var n=e.item;return[t._v(" "+t._s(t.getDate(n.updatedAT))+" ")]}},{key:"item.reapprove",fn:function(e){var r=e.item;return[n("v-btn",{attrs:{icon:""},on:{click:function(e){return t.openDialog(r)}}},[n("v-icon",{attrs:{small:"",color:"black"}},[t._v(" mdi-flag-remove ")])],1)]}},{key:"no-data",fn:function(){return[n("v-btn",{attrs:{color:"primary",click:"initialize"}},[t._v(" Reset ")])]},proxy:!0}])})],1)],1)},k=[],_=(n("c740"),n("d81d"),n("96cf"),n("1da1")),M={debug:function(t){return u().get("debug",t)},getMemories:function(t){return u().post("getMemories",t)},upvoteMemory:function(t){return u().post("upvoteMemory",t)},flagMemory:function(t){return console.log("Service: ",t),u().post("flagMemory",t)}},D=n("3003");r["default"].use(D["a"]);var C={data:function(){return{headers:["id","updatedAT","comment","reapprove"].map((function(t){return{text:t,value:t}})),memories:[],counter:0,dialog:!1,deleteIndex:-1,status:null}},asyncComputed:{asyncMemories:function(){return Object(_["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,M.getMemories({attributes:["id","updatedAT","comment"],flagged:!0});case 2:return t.abrupt("return",t.sent.data);case 3:case"end":return t.stop()}}),t)})))()}},methods:{openDialog:function(t){this.dialog=!0,this.deleteIndex=t.id},closeDialog:function(){var t=this;this.dialog=!1,this.$nextTick((function(){t.editedIndex=-1}))},approve:function(){var t=this;return Object(_["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:try{M.flagMemory({id:t.deleteIndex,flagged:!1}).then((function(e){200==e.status&&(r["default"].delete(t.memories,t.memories.findIndex((function(e){return e.id==t.deleteIndex}))),t.status="Item ".concat(t.deleteIndex," was successfully re-approved."),t.closeDialog())}))}catch(n){console.log(n)}case 1:case"end":return e.stop()}}),e)})))()},getDate:function(t){var e=new Date(t),n=e.getFullYear()+"/"+e.getMonth()+"/"+e.getDay();return n}},watch:{asyncMemories:function(t){this.memories=t}}},S=C,$=Object(f["a"])(S,w,k,!1,null,"4b6e3650",null),A=$.exports,O=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",[t.cases&&t.memories&&t.countries&&t.mounted?[n("Scrollama",{staticClass:"scrollama",attrs:{progress:!0},on:{"step-enter":t.stepEnterHandler,"step-progress":t.stepProgressHandler}},[n("div",{staticClass:"visWrapper",attrs:{slot:"graphic"},slot:"graphic"},[n("vis",{attrs:{progress:t.progress,newMemory:t.newMemory},on:{pickDate:function(e){return t.pickDate(e)}}})],1),n("div",{staticClass:"introWrapper",class:{hidden:!t.showSidebar},attrs:{"data-step":"1"}},[n("h1",[t._v("corona"),n("br"),n("span",[t._v("memories")])]),n("p",{staticClass:"larger"},[t._v(" Numbers alone can not stories do not tell stories. You can.")]),n("p",[t._v("Since the start of the pandemic "),n("strong",[t._v("about "),n("counter"),t._v(" days")],1),t._v(" ago, we are confronted with charts about new cases or even deaths. What are the human stories behind the numbers?")]),n("p",{staticClass:"smaller"},[t._v("The research is conducted by Tobias Kauer (University of Edinburgh), Benjamin Bach (University of Edinburgh), and Marian Dörk (Potsdam University of Applied Sciences). It has been granted approval by the ethics committee. By clicking the button, you indicate that you are a speaker of English and at least 18 years old. You have read the "),n("a",{attrs:{href:"#"}},[t._v("information letter")]),t._v(" and you voluntarily agree to participate, and understand you can stop your participation at any time. You agree that your anonymous data may be kept permanently in Edinburgh University archived and may be used by qualified researchers for teaching and research purposes.")]),n("v-btn",{attrs:{color:"primary",outlined:""},on:{click:t.giveConsent}},[n("v-icon",{attrs:{small:""}},[t._v("mdi-check-circle")]),t._v(" I agree, show me ")],1)],1),n("div",{staticClass:"animatorWrapper",attrs:{"data-step":"2"}}),t.consent?n("div",{staticClass:"explorationWrapper",class:{hidden:!t.showSidebar},attrs:{id:"progressTarget","data-step":"3"}},[n("p",[n("strong",[t._v("Click the bubbles to read people’s stories.")]),n("br"),t._v("Select countries or hashtags to filter.")]),n("v-select",{attrs:{items:t.countries,label:"Your country",outlined:""},model:{value:t.currentCountry,callback:function(e){t.currentCountry=e},expression:"currentCountry"}}),t.hashtags?n("p",{staticClass:"hashtags"},t._l(t.hashtags.filter((function(t,e){return e<10})).sort((function(t,e){return t.tag.localeCompare(e.tag)})),(function(e,r){return n("v-chip",{key:"hashtag-"+r,style:{fontSize:e.size+"px",margin:"2px"},attrs:{small:"",color:"primary",outlined:t.activeHashtag!=e.tag},on:{click:function(n){t.activeHashtag=e.tag}}},[t._v(t._s(e.tag)+" ")])})),1):t._e()],1):t._e(),t.consent?n("div",{staticClass:"formWrapper",attrs:{id:"addTarget","data-step":"4"}},[t.newMemory.showForm?n("memoryForm",{attrs:{date:t.newMemory.date,country:t.currentCountry,countries:t.countries,hashtags:t.hashtags},on:{pickDate:function(e){return t.pickDate(e)},close:function(e){return t.toggleForm(!1)}}}):t._e()],1):t._e()]),t.consent&&t.currentStepId>1?n("div",{staticClass:"callToActionWrapper"},[n("v-btn",{attrs:{color:"primary",outlined:"",elevation:"2"},on:{click:t.toggleForm}},[t.newMemory.showForm?[n("v-icon",{attrs:{small:""}},[t._v("mdi-close-circle-outline")]),t._v("Stop adding ")]:[n("v-icon",{attrs:{small:""}},[t._v("mdi-tooltip-plus-outline")]),t._v("Add your story ")]],2)],1):t._e()]:[n("v-card",{staticClass:"d-flex justify-center mb-6",staticStyle:{"margin-top":"100px"},attrs:{color:"rgb(255, 0, 0, 0.0)",elevation:"0"}},[n("v-progress-circular",{attrs:{size:300,indeterminate:"",color:"primary"}},[t._v("Loading ..."),n("br"),t._v("try refresing?")])],1)]],2)},I=[],j=(n("5abe"),n("a57f")),E=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-card",{staticClass:"mx-auto",attrs:{elevation:"2","max-width":"500","min-width":"400",id:"top",light:""}},[t.returnID?n("v-card-text",{staticStyle:{"padding-top":"0px"}},[n("v-card-title",{staticClass:"ma-0",staticStyle:{"padding-left":"0"}},[t._v(" Your story has been recorded. "),n("v-spacer"),n("v-btn",{attrs:{icon:""},on:{click:t.close}},[n("v-icon",{attrs:{center:"",color:"lightgrey",small:""}},[t._v("mdi-close-circle")])],1)],1),n("p",[t._v(" If you have a minute and want to help our research, please consider filling out our "),n("a",{attrs:{href:"https://docs.google.com/forms/d/e/1FAIpQLSfydTg7ZpZG21s9in4M-mM_8BxA5mZm73K2p5KDshaAcRipgA/viewform?entry.62570228="+t.returnID,target:"_blank"}},[t._v("survey")]),t._v(". ")]),n("v-btn",{attrs:{small:"",outlined:"",color:"primary",block:"",href:"https://docs.google.com/forms/d/e/1FAIpQLSfydTg7ZpZG21s9in4M-mM_8BxA5mZm73K2p5KDshaAcRipgA/viewform?entry.62570228="+t.returnID,target:"_blank"}},[t._v("Fill out Survey")]),n("v-btn",{staticStyle:{"margin-top":"10px"},attrs:{small:"",outlined:"",color:"primary",block:""},on:{click:t.blankify}},[t._v("Add another story first")])],1):n("v-card-text",{staticStyle:{"padding-top":"0px"}},[n("v-card-title",{staticClass:"ma-0",staticStyle:{"padding-left":"0"}},[t._v(" Add your story to the chart "),n("v-spacer"),n("v-btn",{attrs:{icon:""},on:{click:t.close}},[n("v-icon",{attrs:{center:"",color:"lightgrey",small:""}},[t._v("mdi-close-circle")])],1)],1),n("v-form",{staticStyle:{padding:"10px 0"},model:{value:t.isFormValid,callback:function(e){t.isFormValid=e},expression:"isFormValid"}},[n("v-textarea",{staticClass:"ma-0 pa-0",attrs:{dense:"",outlined:"",rules:t.rules.notEmpty,label:"Your Story"},model:{value:t.comment,callback:function(e){t.comment=e},expression:"comment"}}),t.hashtags&&t.showHashtags>0?n("p",{staticClass:"hashtags"},[t._v(" Add these (or other) hashtags"),n("br"),t._l(t.hashtags.filter((function(e,n){return n<t.showHashtags})).sort((function(t,e){return t.tag.localeCompare(e.tag)})),(function(e,r){return n("v-chip",{key:"hashtag-"+r,style:{margin:"2px"},attrs:{small:"",color:"primary",outlined:!t.comment.includes(e.tag)},on:{click:function(n){return t.addTag(e.tag)}}},[t._v(t._s(e.tag)+" ")])})),n("a",{on:{click:function(e){t.showHashtags=20}}},[t._v("show more")])],2):t._e(),n("v-select",{attrs:{items:t.countries,dense:"",label:"Your country",outlined:""},model:{value:t.currentCountry,callback:function(e){t.currentCountry=e},expression:"currentCountry"}}),this.exactDate?[n("v-menu",{attrs:{"close-on-content-click":!1,"nudge-right":40,transition:"scale-transition","offset-y":"","min-width":"auto"},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on,s=e.attrs;return[n("v-text-field",t._g(t._b({staticClass:"ma-0",attrs:{rules:t.rules.notEmpty,label:"Pick a date","append-icon":"mdi-calendar",outlined:"",readonly:"",dense:""},model:{value:t.displayDate,callback:function(e){t.displayDate=e},expression:"displayDate"}},"v-text-field",s,!1),r))]}}]),model:{value:t.datepicker,callback:function(e){t.datepicker=e},expression:"datepicker"}},[n("v-date-picker",{on:{input:function(e){t.datepicker=!1}},model:{value:t.displayDate,callback:function(e){t.displayDate=e},expression:"displayDate"}})],1)]:[n("v-text-field",{staticClass:"ma-0",attrs:{"v-model":t.getRoughDate(t.displayDate),label:"Date",outlined:"",dense:"",readonly:""}})]],2),n("v-btn",{staticStyle:{margin:"10px 0"},attrs:{disabled:!t.isFormValid,block:"",color:"primary",outlined:""},on:{click:t.sendMemory}},[t._v("Send")])],1)],1)},F=[],T={data:function(){return{panel:null,comment:"",name:"",currentCountry:null,datepicker:!1,showHashtags:0,returnID:null,displayDate:null,isFormValid:!1,rules:{notEmpty:[function(t){return!!t||"Please enter a memory!"}]}}},props:{country:String,countries:Array,hashtags:Array,date:Object},computed:{exactDate:{set:function(){this.$store.commit("toggleNewMemoryExactDate")},get:function(){return this.$store.state.newMemory.exactDate}}},mounted:function(){this.currentCountry=this.country},methods:{addTag:function(t){this.comment=this.comment+" "+t},getRoughDate:function(t){console.log(t);var e=new Date(t),n="Late";e.getDate()<=20&&(n="Mid"),e.getDate()<=10&&(n=" Early");var r=["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()];return n+" "+r},sendMemory:function(){var t=this;return Object(_["a"])(regeneratorRuntime.mark((function e(){var n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return l.sendInteraction({session:t.$store.state.session,event:"send",element:"memory"}),t.loading=!0,n={comment:t.comment,date:new Date(t.displayDate),country:t.currentCountry,exact:t.date.exact},e.prev=3,e.next=6,M.sendMemory(n);case 6:r=e.sent,200==r.status&&(t.returnID=r.data.id,t.$vuetify.goTo("#top",{duration:500})),e.next=13;break;case 10:e.prev=10,e.t0=e["catch"](3),t.status=e.t0.response.data.error;case 13:case"end":return e.stop()}}),e,null,[[3,10]])})))()},close:function(){l.sendInteraction({session:this.$store.state.session,event:"close",element:"memoryForm"}),this.returnID=null,this.$emit("close")},blankify:function(){this.returnID=null,this.comment=""}},watch:{comment:function(t){t.length>2&&this.showHashtags<10&&(this.showHashtags=10)},date:{immediate:!0,deep:!0,handler:function(){this.displayDate=this.date.string,this.exactDate=this.date.exact}},displayDate:function(){this.$emit("pickDate",{string:this.displayDate,exact:this.exactDate})},exactDate:function(){this.$emit("pickDate",{string:this.displayDate,exact:this.exactDate})}}},H=T,R=(n("2b9b"),Object(f["a"])(H,E,F,!1,null,"77cd6751",null)),B=R.exports,P=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("span",[t._v(t._s(t.counter))])},L=[],z={data:function(){return{counter:0}},computed:{daysSinceStart:function(){var t=new Date("2020-01-22"),e=new Date;return Math.ceil((e-t)/864e5)}},mounted:function(){this.count()},methods:{count:function(){var t=this;setTimeout((function(){t.counter++,t.counter<=t.daysSinceStart&&t.count()}),5)}}},W=z,Y=Object(f["a"])(W,P,L,!1,null,"5c9d5361",null),N=Y.exports,U=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.scales.x&&t.cases&&t.mounted?n("svg",{attrs:{width:t.dimensions.width,height:t.dimensions.height}},[n("g",{directives:[{name:"axis",rawName:"v-axis:x",value:t.scales,expression:"scales",arg:"x"}],staticClass:"axis xAxis",attrs:{transform:"translate(0,"+(t.dimensions.height-t.dimensions.top-t.dimensions.bottom+10)+")"}}),n("g",{directives:[{name:"axis",rawName:"v-axis:y",value:t.scales,expression:"scales",arg:"y"}],staticClass:"axis yAxis",attrs:{transform:"translate("+(t.dimensions.width-t.dimensions.right)+")"}}),n("path",{attrs:{d:t.caseLine,"stroke-width":"3","stroke-linejoin":"round",fill:"none",stroke:"black"}}),t.beeswarm?n("g",{staticClass:"beeswarm"},[n("g",{staticClass:"circles"},t._l(t.beeswarm.filter((function(e,n){return n<t.progress&&e.isMemory})),(function(e){return n("path",{key:"circle-"+e.id,class:{inactive:t.activeHashtag&&t.activeHashtag!=e.hashtag},attrs:{d:e.d,transform:"translate("+e.x+","+e.y+")",id:"circle-"+e.id,opacity:t.opacity},on:{click:function(n){return t.click(e.id)},mouseover:function(n){return t.hover(e,n)},mouseout:function(n){return t.hover(e,n)}}})})),0),t.activeMemories&&t.progress>t.beeswarm.filter((function(t){return t.isMemory})).length-10?n("g",t._l(t.memoryLinks,(function(e,r){return n("g",{key:"card-"+r},[n("line",{attrs:{stroke:"#FA5E2D",x1:e.source.x,y1:e.source.y,x2:e.target.x,y2:e.target.y}}),n("foreignObject",{attrs:{width:t.memoryBox.width+4,height:t.memoryBox.height+4,x:e.target.x-t.memoryBox.width/2,y:e.target.y-t.memoryBox.height/2,requiredFeatures:"http://www.w3.org/TR/SVG11/feature#Extensibility"}},[n("memoryCard",{attrs:{dimensions:t.memoryBox,memory:e.target.memory}})],1)],1)})),0):t._e(),t.newMemory.showForm?n("Datepicker",{attrs:{date:t.newMemory.date}}):t._e()],1):t._e()]):t._e()},J=[],K=(n("99af"),n("4160"),n("a9e3"),n("18a5"),n("159b"),n("2909")),G=n("5698"),V=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("g",{staticClass:"datePicker",attrs:{transform:"translate("+t.x+",0)"},on:{mousedown:t.mouseDown,mouseup:t.mouseUp}},[n("line",{attrs:{y1:"0",y2:t.height,x1:"0",x2:"0",stroke:"#FA5E2D","stroke-width":"2px","stroke-dasharray":"0"}}),n("circle",{attrs:{r:"40",cx:"0",cy:t.y,fill:"#FA5E2D"}}),n("text",{attrs:{x:"0","text-anchor":"middle",y:t.y}},[t._v(t._s(t.displayDate))])])},Z=[],X=(n("7db0"),n("c7cd"),{data:function(){return{formatDate:G["o"]("%Y-%m-%d"),parseDate:G["q"]("%Y-%m-%d"),height:window.innerHeight,x:-100,y:-100,displayDate:null,fixed:!1}},props:{date:Object},computed:{scales:function(){return this.$store.state.scales},cases:function(){return this.$store.state.cases}},mounted:function(){document.addEventListener("mousemove",this.onMouseMove)},watch:{date:{deep:!0,immediate:!0,handler:function(t){t.string!=this.displayDate&&(this.displayDate=t.string,this.x=this.scales.x(this.parseDate(t.string)))}}},methods:{onMouseMove:function(t){if(!this.fixed&&t.clientX>this.scales.x.range()[0]&&t.clientX<this.scales.x.range()[1]){var e=this.scales.x.invert(t.clientX),n=this.formatDate(e);this.x=t.clientX,this.y=this.scales.y(this.getLineElement(e).value),this.displayDate=n}},mouseUp:function(){this.fixed=!0,this.$parent.$emit("pickDate",{string:this.displayDate,exact:this.date.exact})},mouseDown:function(){this.fixed=!1},getLineElement:function(t){var e="string"==typeof t?t:this.formatDate(t),n=this.cases.find((function(t){return t.dateString==e}));return n||null},getRoughDate:function(t){if(!t)return null;var e="Late";t.getDate()<=20&&(e="Mid"),t.getDate()<=10&&(e="Early");var n=["January","February","March","April","May","June","July","August","September","October","November","December"][t.getMonth()];return e+" "+n}}}),q=X,Q=(n("166a"),Object(f["a"])(q,V,Z,!1,null,"5a24f326",null)),tt=Q.exports,et=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.memory?n("v-card",{staticClass:"memoryCard overflow-y-auto",attrs:{elevation:"2",width:t.dimensions.width,"max-height":t.dimensions.height}},[n("div",[n("v-btn",{staticStyle:{position:"absolute",right:"5px",top:"0px"},attrs:{icon:""},on:{click:t.close}},[n("v-icon",{attrs:{small:"",color:"black"}},[t._v("mdi-close-circle")])],1)],1),n("v-card-text",[n("v-row",{attrs:{dense:""}},[n("v-col",[n("p",{staticClass:"topBar"},[n("v-btn",{attrs:{"x-small":"",fab:"",outlined:"",center:""},on:{click:function(e){return t.upvote(e)},mouseover:function(e){return t.mouseOver(!0)},mouseout:function(e){return t.mouseOver(!1)}}},[t._v(" "+t._s(t.weight)),n("br"),n("v-icon",{attrs:{color:"black",small:""}},[t._v("mdi-heart")])],1),t._v(" "+t._s(t.memory.dateString)+" ")],1),n("p",{staticClass:"comment"},[t._v(t._s(t.memory.comment))]),t.status?[t._v(" "+t._s(t.status)+" ")]:[n("v-btn",{attrs:{outlined:"","x-small":""},on:{click:t.report}},[n("v-icon",{attrs:{"x-small":""}},[t._v("mdi-flag")]),t._v(" Report ")],1)]],2)],1)],1)],1):t._e()},nt=[],rt={data:function(){return{status:null,weight:null}},props:{memory:Object,dimensions:Object},created:function(){this.weight=this.memory.weight},computed:{localMemory:function(){return this.memory?this.memory:null}},methods:{close:function(){l.sendInteraction({session:this.$store.state.session,event:"close",element:this.memory.id}),this.$store.commit("setActiveMemories",this.memory.id)},mouseOver:function(t){this.weight=t?"+1":this.localMemory.weight},upvote:function(){var t=this;return Object(_["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:l.sendInteraction({session:t.$store.state.session,event:"upvote",element:t.memory.id});try{M.upvoteMemory({id:t.memory.id}).then((function(e){200==e.status&&(t.localMemory.weight=e.data.weight)}))}catch(n){console.log(n)}case 2:case"end":return e.stop()}}),e)})))()},report:function(){var t=this;return Object(_["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:l.sendInteraction({session:t.$store.state.session,event:"report",element:t.memory.id});try{M.flagMemory({id:t.memory.id,flagged:!0}).then((function(e){200==e.status&&(t.status="Thank you. We will not show this story until we reviewed it.",setTimeout((function(){t.close()}),2e3))}))}catch(n){console.log(n)}case 2:case"end":return e.stop()}}),e)})))()}}},st=rt,at=(n("8ae4"),Object(f["a"])(st,et,nt,!1,null,"ddc9ed0e",null)),ot=at.exports,it={components:{Datepicker:tt,memoryCard:ot},data:function(){return{mounted:!1,visibleHashtags:10,opacity:.8,lineGenerator:G["j"]().x((function(t){return t.x})).y((function(t){return t.y})),memoryBox:{width:300,height:150}}},props:{progress:Number,newMemory:Object},computed:{dimensions:function(){return this.$store.state.dimensions},cases:function(){return this.$store.state.cases},beeswarm:function(){return this.$store.getters.beeswarm},activeHashtag:function(){return this.$store.state.activeHashtag},scales:function(){return this.$store.state.scales},activeMemories:function(){return this.$store.getters.activeMemories},memoryLinks:function(){var t=this;if(!this.activeMemories)return null;var e=[],n=[];this.activeMemories.forEach((function(r){e.push({type:"circle",fx:r.x,fy:r.y}),e.push({type:"box",x:r.x-t.memoryBox.width/2,y:r.y-t.memoryBox.height/2,memory:r}),n.push({source:e.length-2,target:e.length-1})}));for(var r=G["g"](e).force("charge",G["f"]().strength(1)).force("link",G["e"]().links(n)).force("collide",G["d"](100)),s=0;s<=10;s++)r.tick();return n.forEach((function(e){e.target.y<t.memoryBox.height/2&&(e.target.y=t.memoryBox.height/2),e.target.x<t.memoryBox.width/2&&(e.target.x=t.memoryBox.width/2)})),n},caseLine:function(){var t=this;if(!this.scales||!this.cases)return!1;var e=this.cases.map((function(e){return e.x=t.scales.x(e.date),e.y=t.scales.y(e.value),e}));return this.lineGenerator(e)},hashtags:function(){var t=this;if(!this.beeswarm)return null;var e=[],n=[],r=Object(K["a"])(this.beeswarm).sort((function(t,e){return e.weight-t.weight}));r.forEach((function(r){e.push({type:"circle",fx:r.x,fy:r.y}),r.hashtag&&n.length<t.visibleHashtags&&(e.push({type:"label",x:r.x,y:r.y,text:r.hashtag,id:r.id}),n.push({source:e.length-2,target:e.length-1}))}));for(var s=G["g"](e).force("charge",G["f"]().strength(1)).force("link",G["e"]().links(n)).force("collide",G["d"](17)),a=0;a<=10;a++)s.tick();return n.forEach((function(t){t.target.anchor=t.target.x>=t.source.x?"start":"end"})),n}},watch:{},mounted:function(){this.mounted=!0},methods:{hover:function(t,e){if(!this.datePicker){var n="mouseover"==e.type?2:1;G["n"](e.target).transition("50").attr("transform","translate(".concat(t.x,",").concat(t.y,") scale(").concat(n,")"))}},click:function(t){l.sendInteraction({session:this.$store.state.session,event:"openMemory",element:t}),this.$store.commit("setActiveMemories",t)}},directives:{axis:function(t,e){var n=G["n"](t);switch(e.arg){case"x":n.call(G["a"](e.value.x).ticks(G["p"]).tickFormat(G["o"]("%b"))),n.selectAll(".domain").attr("stroke","none"),n.selectAll(".tick line").attr("stroke","none"),n.selectAll(".tick text").style("text-anchor","end").style("text-transform","UPPERCASE").style("opacity",.3);break;case"y":n.call(G["b"](e.value.y).tickSize(-1e3).ticks(5)),n.selectAll(".domain").attr("stroke","none"),n.selectAll(".tick line").attr("opacity",.05),n.selectAll(".tick text").attr("opacity",.3);break}}}},ct=it,ut=(n("8172"),Object(f["a"])(ct,U,J,!1,null,"a92af33a",null)),lt=ut.exports,mt={name:"App",components:{Scrollama:j["a"],memoryForm:B,counter:N,vis:lt},data:function(){return{showSidebar:!0,mounted:!1,consent:!1,currentStepId:0,progress:0,newMemory:{showForm:!1,date:{string:"",exact:!0}}}},computed:{cases:function(){return this.$store.state.cases},memories:function(){return this.$store.state.memories},countries:function(){return this.$store.state.countries},hashtags:function(){return this.$store.state.hashtags},currentCountry:{get:function(){return this.$store.state.currentCountry},set:function(t){this.$store.dispatch("setCurrentCountry",t),l.sendInteraction({session:this.$store.state.session,event:"select-country",element:t})}},activeHashtag:{get:function(){return this.$store.state.activeHashtag},set:function(t){t==this.activeHashtag?(l.sendInteraction({session:this.$store.state.session,event:"unselect-hashtag",element:t}),this.$store.commit("setActiveHashtag",null)):(l.sendInteraction({session:this.$store.state.session,event:"select-hashtag",element:t}),this.$store.commit("setActiveHashtag",t))}}},mounted:function(){this.mounted=!0},methods:{giveConsent:function(){var t=this;l.sendInteraction({session:this.$store.state.session,event:"click",element:"consent"}),this.consent=!0,this.$nextTick((function(){t.$vuetify.goTo("#progressTarget",{duration:2e3})}))},stepEnterHandler:function(t){var e=t.element;t.direction;switch(e.className){case"introWrapper":this.progress=0;break}this.currentStepId=e.dataset.step},stepProgressHandler:function(t){var e=t.element,n=t.progress;if("animatorWrapper"==e.className&&this.consent){var r=Math.ceil(n*this.memories.length);this.progress=r}},toggleForm:function(){var t=this;l.sendInteraction({session:this.$store.state.session,event:this.newMemory.showForm?"hide":"show",element:"memoryForm"}),this.newMemory.showForm?(r["default"].set(this.newMemory,"showForm",!1),this.$vuetify.goTo("#progressTarget",{duration:500})):(r["default"].set(this.newMemory,"showForm",!0),this.$nextTick((function(){t.$vuetify.goTo("#addTarget",{duration:2e3})})))},pickDate:function(t){r["default"].set(this.newMemory.date,"string",t.string),r["default"].set(this.newMemory.date,"exact",t.exact)}}},dt=mt,ht=(n("7296"),n("cc21"),Object(f["a"])(dt,O,I,!1,null,"ea14cb3c",null)),ft=ht.exports,pt=(n("4de4"),n("0481"),n("caad"),n("13d5"),n("a434"),n("4069"),n("b64b"),n("ac1f"),n("2532"),n("466d"),n("5319"),n("2f62")),gt={getCases:function(t){return u().post("getCases",t)},getCountries:function(){return u().post("getCountries")}};r["default"].use(pt["a"]);var vt=G["q"]("%Y-%m-%d"),yt=new pt["a"].Store({state:{session:"",countries:[],currentCountry:"",currentMetric:"relative_cases",cases:[],memories:[],activeMemories:[],hashtags:[],activeHashtag:"",dimensions:{width:0,height:0,top:100,right:40,bottom:50,left:400},scales:{},newMemory:{exactDate:!0}},getters:{activeMemories:function(t){return t.memories.filter((function(e){return t.activeMemories.includes(e.id)}))},beeswarm:function(t){var e=t.cases.map((function(t){return{fx:t.x,fy:t.y,isMemory:!1,radius:4}})),n=G["l"]().domain(G["c"](t.memories,(function(t){return t.weight}))).range([2,6]),r=t.memories.map((function(e){var r=t.cases.findIndex((function(t){return t.dateString==e.dateString}));e.value=-1!==r?t.cases[r].value:0,e.isMemory=!0,e.x=t.scales.x(e.date),e.y=t.scales.y(e.value),e.radius=n(e.weight),e.scale=1;var s=function(t){return t+(Math.random()*e.radius/2-e.radius/4)},a=s(e.radius),o=s(e.radius),i=s(e.radius),c=s(e.radius);return e.d="\n          M 0 ".concat(-a,"\n          C ").concat(o/2," ").concat(-a," ").concat(o," ").concat(-o/2," ").concat(o," ",0,"\n          C ").concat(o," ").concat(i/2," ").concat(i/2," ").concat(i," ",0," ").concat(i,"\n          C ").concat(-c/2," ").concat(i," ").concat(-c," ").concat(c/2," ").concat(-c," ",0,"\n          C ").concat(-c," ").concat(-a/2," ").concat(-a/2," ").concat(-a," ",0," ").concat(-a,"\n        ").replace(/(\r\n|\n|\r)/gm,""),e}));if(r.length>0){for(var s=r.concat(e),a=G["g"](s).force("forceX",G["h"]((function(t){return t.x})).strength(.1)).force("forceY",G["i"]((function(t){return t.y})).strength(.1)).force("collide",G["d"]((function(t){return t.radius+t.radius/4}))),o=0;o<=20;o++)a.tick();return s}return[]}},mutations:{setSession:function(t,e){t.session=e},setCases:function(t,e){t.cases=e},setCurrentCountry:function(t,e){t.currentCountry=e},setCountries:function(t,e){t.countries=e},setActiveHashtag:function(t,e){t.activeHashtag=e},setActiveMemories:function(t,e){var n=t.activeMemories.findIndex((function(t){return t==e}));-1===n?t.activeMemories.push(e):t.activeMemories.splice(n,1)},setMemories:function(t,e){t.memories=e.map((function(t){var e=t.comment.match(/#[a-z]+/gi);return t.hashtag=e?e[0]:null,t.date=vt(t.dateString),t}))},setDimensions:function(t,e){e.width&&(t.dimensions.width=e.width),e.height&&(t.dimensions.height=e.height),e.left&&(t.dimensions.left=e.left)},setScales:function(t){var e=t.dimensions,n=[0,G["k"]([50,G["k"](t.cases,(function(t){return t.value}))])],r=G["c"](t.cases,(function(t){return t.date})),s=G["m"]().domain(r).range([e.left,e.width-e.right]),a=G["l"]().domain(n).range([e.height-e.bottom-e.top,e.top]);t.scales={x:s,y:a}},toggleNewMemoryExactDate:function(t){t.newMemory.exactDate=!t.newMemory.exactDate},setHashtags:function(t,e){var n=e.map((function(t){return t.comment.match(/#[a-z]+/gi)})).flat().filter((function(t){return t})),r=n.reduce((function(t,e){return t[e]=(t[e]||0)+1,t}),{}),s=Object.keys(r).map((function(t){return{tag:t,occurences:r[t]}})).sort((function(t,e){return e.occurences-t.occurences})),a=G["l"]().domain(G["c"](s,(function(t){return t.occurences}))).range([5,15]);s.forEach((function(t){return t.size=a(t.occurences)})),t.hashtags=s}},actions:{setCases:function(t){return Object(_["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,gt.getCases({country:t.state.currentCountry,metric:t.state.currentMetric});case 2:n=e.sent.data.map((function(t){return{dateString:t.d,date:vt(t.d),value:t.v}})),t.commit("setCases",n),t.commit("setScales");case 5:case"end":return e.stop()}}),e)})))()},setMemories:function(t){return Object(_["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,M.getMemories({attributes:[["date","dateString"],"exactDate","comment","weight","id"],country:t.state.currentCountry,flagged:!1});case 2:n=e.sent.data,t.commit("setMemories",n),t.commit("setHashtags",n);case 5:case"end":return e.stop()}}),e)})))()},setCountries:function(t){return Object(_["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:n=["World","Germany","France","Italy","United States","United Kingdom","Switzerland"],t.commit("setCountries",n);case 2:case"end":return e.stop()}}),e)})))()},setCurrentCountry:function(t,e){t.commit("setCurrentCountry",e),t.dispatch("setCases"),t.dispatch("setMemories")},setDimensions:function(t,e){t.commit("setDimensions",e),t.commit("setScales")}}});r["default"].use(s["a"]),r["default"].config.productionTip=!1;var xt=new s["a"]({routes:[{path:"/",component:ft},{path:"/review/",component:A}]});new r["default"]({router:xt,store:yt,vuetify:b,render:function(t){return t(g)}}).$mount("#app")},7600:function(t,e,n){},8172:function(t,e,n){"use strict";n("1edc")},"8ae4":function(t,e,n){"use strict";n("288d")},"94b9":function(t,e,n){},cc21:function(t,e,n){"use strict";n("0cae")}});
//# sourceMappingURL=app.1d66c463.js.map