(this["webpackJsonpimage-front"]=this["webpackJsonpimage-front"]||[]).push([[0],{187:function(e,t,a){},194:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),i=a(29),r=a.n(i),c=(a(90),a(91),a(7)),l=a(78),o=a(8),d=a(9),h=a(25),m=a(27),u=a(30),g=a(85),j=(a(92),a(199)),p=a(197),b=a(202),x=a(198),f=a(79),y=a.n(f),v=a(23),O=a.n(v),I=a(54);a(184);function w(){return O.a.get("/api/get_req_url/").then((function(e){return e.data.req_url})).catch((function(e){console.log(e)}))}var z=a(1);window.process=Object(u.a)({},window.process);var N=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).handleResize=function(){if(n.dropzoneRef.current){var e=n.dropzoneRef.current.getBoundingClientRect(),t=e.width,a=e.height;n.setState({dropzoneDimensions:{width:t,height:a}})}},n.handleEhrChange=function(e){n.setState({e_hr:e.target.value})},n.handleEminChange=function(e){n.setState({e_min:e.target.value})},n.onDrop=function(e){e.length>1?n.setState({isMultipleimages:!0}):(n.setState({isLoading:!0,files:[],recentImage:null,previewImage:e[0],isMultipleimages:!1}),n.loadingImage(e))},n.loadingImage=function(e){setTimeout((function(){n.setState({files:e,isLoading:!1,showProcessedImage:!1},(function(){console.log(n.state.files[0].name)}))}),1e3)},n.analyzingImage=function(){setTimeout((function(){n.setState({isAnalyzing:!1},(function(){console.log(n.state.files[0].name)}))}),1e3)},n.activateSpinner=function(){n.setState({isLoading:!0,isAnalyzing:!0,files:[]})},n.deactivateSpinner=function(){n.setState({isLoading:!1,isAnalyzing:!1})},n.handleDisabledClick=function(){n.setState({showMessage:!0})},n.sendImage=function(){n.setState({isLoading:!1,isAnalyzing:!0,files:[]});var e=new FormData;e.append("image",n.state.files[0],n.state.files[0].name),e.append("e_hr",n.state.e_hr),e.append("e_min",n.state.e_min),w().then((function(t){O.a.post("".concat(t,"/api/images/"),e,{headers:{accept:"application/json","content-type":"multipart/form-data"}}).then((function(e){n.getImageResults(e),console.log(e.data)})).catch((function(e){console.log("Error Message here: "+e)}))}))},n.getImageResults=function(e){w().then((function(t){O.a.get("".concat(t,"/api/images/").concat(e.data.id,"/"),{headers:{accept:"application/json"}}).then((function(e){n.setState({recentImage:e,analyzedInfo:e.data.analyzed_info}),console.log(e)})).catch((function(e){console.log("Error Message here: "+e)})),n.deactivateSpinner()}))},n.showProcessedImage=Object(l.a)(Object(c.a)().mark((function e(){var t;return Object(c.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w();case 2:t=e.sent,O.a.get("".concat(t).concat(n.state.recentImage.data.processed_image),{headers:{accept:"image/png, image/jpeg"},responseType:"blob"}).then((function(e){n.getImageResults(e),console.log(e.data),n.setState({showProcessedImage:!1})})).catch((function(e){console.log("Error Message here: "+e)})),n.setState({showProcessedImage:!0});case 5:case"end":return e.stop()}}),e)}))),n.showAQI=function(){n.setState({showAQI:!0}),setTimeout((function(){n.calculateLabelPositions()}),1)},n.hideAQI=function(){n.setState({showAQI:!1})},n.hideProcessedImage=function(){n.setState({showProcessedImage:!1})},n.state={prevZoomLevel:1,files:[],isLoading:!1,isAnalyzing:!1,recentImage:null,previewImage:null,e_hr:"",e_min:"",showMessage:!1,isMultipleimages:!1,showProcessedImage:!1,showAQI:!1,analyzedInfo:null,dropzoneDimensions:{width:0,height:0},labelPositions:[],tickLabelPositions:[]},n.dropzoneRef=s.a.createRef(),n.gaugeWrapperRef=s.a.createRef(),n}return Object(d.a)(a,[{key:"calculateZoomLevel",value:function(){return window.outerWidth/window.screen.width*(window.innerWidth/window.outerWidth)}},{key:"calculateLabelPositions",value:function(){var e=this.gaugeWrapperRef.current;if(e){var t=e.getBoundingClientRect(),a=t.width/2.2,n=.89*t.height,s=.7*a,i=[-160,-123,-87,-51,-15].map((function(e){var t=e*Math.PI/180;return{x:a+s*Math.cos(t),y:n+s*Math.sin(t)}})),r=[-179,-144,-108,-72,-35,-1].map((function(e){var t=1.36*s,i=.97*a,r=.44*n,c=e*Math.PI/180;return{x:i+t*Math.cos(c),y:r+t*Math.sin(c)}}));this.setState({labelPositions:i,tickLabelPositions:r})}}},{key:"getAQILabel",value:function(e){var t=[Object(z.jsx)("span",{children:"Good"}),Object(z.jsx)("span",{children:"Moderate"}),Object(z.jsxs)("span",{children:["Unhealthy for",Object(z.jsx)("br",{}),"Sensitive",Object(z.jsx)("br",{}),"Groups"]}),Object(z.jsx)("span",{children:"Unhealthy"}),Object(z.jsxs)("span",{children:["Very",Object(z.jsx)("br",{}),"Unhealthy"]})];switch(e){case 0:return t[0];case 1:return t[1];case 2:return t[2];case 3:return t[3];case 4:return t[4];default:return"None"}}},{key:"getAQILabelIndex",value:function(e){var t=["0","50","100","150","200","300"];switch(e){case 0:return t[0];case 1:return t[1];case 2:return t[2];case 3:return t[3];case 4:return t[4];default:return"None"}}},{key:"componentDidMount",value:function(){var e=this;setInterval((function(){var t=e.calculateZoomLevel();t!==e.state.prevZoomLevel&&(e.calculateLabelPositions(),e.setState({prevZoomLevel:t}))}),50),window.addEventListener("resize",this.handleResize);var t=this.dropzoneRef.current.getBoundingClientRect(),a=t.width,n=t.height;this.calculateLabelPositions(),window.addEventListener("resize",this.calculateLabelPositions.bind(this)),this.setState({dropzoneDimensions:{width:a,height:n}})}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.handleResize),window.removeEventListener("resize",this.calculateLabelPositions.bind(this))}},{key:"getAQIValue",value:function(e){var t=.2,a=0,n=0,s=0,i=0;e>0&&e<=54?(a=0,n=50,s=0,i=54):e>54&&e<=70?(a=51,n=100,s=55,i=70):e>70&&e<=85?(a=101,n=150,s=71,i=85):e>85&&e<=105?(a=151,n=200,s=86,i=105):(a=201,n=300,s=106,i=200);var r=(e-s)*(n-a)/i-s+a;return console.log("AQI value:",r),r<=50?r/50*t:r<=100?t+(r-50)/50*t:r<=150?.4+(r-100)/50*t:r<=200?.6200000000000001+(r-150)/50*t:r<=300?.82+(r-200)/100*t:.9934896074258042}},{key:"getAQIPercent",value:function(e){var t=.2;return e<=50?e/50*t:e<=100?t+(e-50)/50*t:e<=150?.4+(e-100)/50*t:e<=200?.6000000000000001+(e-150)/50*t:e<=300?.8+(e-200)/100*t:.9934896074258042}},{key:"render",value:function(){var e=this,t=this.state.dropzoneDimensions,a={maxWidth:"".concat(.99*t.width,"px"),maxHeight:"".concat(.9*t.height,"px"),objectFit:"contain",border:"1px dashed #ccc"},n={display:"flex",justifyContent:"center",alignItems:"center",width:"".concat(t.width,"px"),maxHeight:"330px"};this.state.files.map((function(e){return Object(z.jsx)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:Object(z.jsxs)("li",{style:{margin:"auto"},children:[e.name," - ",e.size," bytes"]},e.name)})}));return Object(z.jsxs)(s.a.Fragment,{children:[null===this.state.recentImage&&Object(z.jsx)("div",{ref:this.dropzoneRef,style:{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"330px",marginBottom:"15px"},children:Object(z.jsx)("div",{className:"image-preview",style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:this.state.previewImage?Object(z.jsx)("img",{src:URL.createObjectURL(this.state.previewImage),alt:"",style:a}):Object(z.jsx)(g.a,{onDrop:this.onDrop,accept:"image/png, image/jpeg",children:function(e){var t=e.isDragActive,a=e.getRootProps,s=e.getInputProps;return Object(z.jsxs)("div",Object(u.a)(Object(u.a)({},a({className:"dropzone back"})),{},{style:Object(u.a)(Object(u.a)({},n),{},{display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center"}),children:[Object(z.jsx)("input",Object(u.a)({},s())),Object(z.jsx)("i",{className:"fa fa-cloud-upload fa-4x text-muted",style:{fontSize:120}}),Object(z.jsx)("p",{className:"text-muted",children:t?"Drop some images":"Drag 'n' drop some files here, or click to select files"})]}))}})})}),Object(z.jsx)(j.a,{children:this.state.recentImage?null:Object(z.jsx)(s.a.Fragment,{children:Object(z.jsxs)("div",{className:"row justify-content-center",style:{marginTop:"5px"},children:[Object(z.jsx)("label",{htmlFor:"exposure_time",className:"col-form-label",children:"Exposure Time:"}),Object(z.jsx)("div",{className:"col-sm-2 col-md-4",children:Object(z.jsx)("input",{type:"number",className:"form-control",placeholder:"",id:"exposure_hour",name:"e_hr",value:this.state.e_hr,onChange:this.handleEhrChange,min:"0",style:{width:"100%"}})}),Object(z.jsx)("label",{htmlFor:"exposure_hour",className:"col-form-label",children:"hr"}),Object(z.jsx)("div",{className:"col-sm-2 col-md-4",children:Object(z.jsx)("input",{type:"number",className:"form-control",placeholder:"",id:"exposure_min",name:"e_min",value:this.state.e_min,onChange:this.handleEminChange,min:"0",style:{width:"100%"}})}),Object(z.jsx)("label",{htmlFor:"exposure_min",className:"col-form-label",children:"min"})]})})}),this.state.files.length>0&&(""!==this.state.e_hr&&""!==this.state.e_min&&parseInt(this.state.e_hr)>=0&&parseInt(this.state.e_min)>=0&&(0!==parseInt(this.state.e_hr)||0!==parseInt(this.state.e_min))?Object(z.jsx)(p.a,{variant:"info",size:"lg",className:"analyze-button",onClick:this.sendImage,children:"Analyze"}):Object(z.jsx)(p.a,{variant:"info",size:"lg",className:"analyze-button",onClick:this.handleDisabledClick,children:"Analyze"})),this.state.showMessage&&(""===this.state.e_hr||""===this.state.e_min)&&Object(z.jsx)(b.a,{variant:"warning",style:{marginTop:"13px"},children:"Please fill in both 'Exposure Hour' and 'Exposure Minute' fields."}),this.state.showMessage&&0===parseInt(this.state.e_hr)&&0===parseInt(this.state.e_min)&&Object(z.jsx)(b.a,{variant:"warning",style:{marginTop:"13px"},children:"At least one of them should be 1 or greater."}),this.state.showMessage&&(parseInt(this.state.e_hr)<0||parseInt(this.state.e_min)<0)&&Object(z.jsx)(b.a,{variant:"warning",style:{marginTop:"13px"},children:"Please enter only non-negative values for 'Exposure Hour' and 'Exposure Minute'."}),this.state.isMultipleimages&&Object(z.jsx)(b.a,{variant:"warning",style:{marginTop:"13px"},children:"Please upload only one image at a time."}),this.state.isLoading&&Object(z.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},children:[Object(z.jsx)(x.a,{animation:"border",role:"status",style:{marginTop:"50px"}}),Object(z.jsx)("div",{style:{textAlign:"center",marginTop:"5px"},children:"Loading..."})]}),this.state.isAnalyzing&&Object(z.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},children:[Object(z.jsx)(x.a,{animation:"border",role:"status",style:{marginTop:"50px"}}),Object(z.jsx)("div",{style:{textAlign:"center",marginTop:"5px"},children:"Analyzing..."})]}),this.state.recentImage&&Object(z.jsxs)(s.a.Fragment,{children:[!this.state.recentImage.data.analyzed.includes("Failed")&&Object(z.jsx)("div",{className:"circular-progress-container",children:Object(z.jsx)("div",{className:"circular-progress-bar",style:{marginTop:"13px !important"},children:Object(z.jsx)(I.a,{value:Number(this.state.recentImage.data.analyzed),text:Number(this.state.recentImage.data.analyzed)<100?"SAFE":"DANGER",styles:Object(I.b)({fontSize:"14px",textColor:Number(this.state.recentImage.data.analyzed)<100?"#007bff":"#dc3545",pathColor:Number(this.state.recentImage.data.analyzed)<100?"#007bff":"#dc3545",trailColor:"#f2f2f2"})})})}),this.state.recentImage.data.analyzed.includes("Failed")&&Object(z.jsx)(b.a,{variant:"warning",style:{marginTop:"50px"},children:Object(z.jsx)("div",{className:"auto-line-break analyzed-results",children:this.state.recentImage.data.analyzed})}),!this.state.recentImage.data.analyzed.includes("Failed")&&Number(this.state.recentImage.data.analyzed)<100?Object(z.jsx)(b.a,{variant:"primary",className:"custom-alert",style:{marginTop:"40px"},children:Object(z.jsxs)("div",{className:"auto-line-break analyzed-results",children:["Ozone exposure level",Object(z.jsx)("br",{}),Object(z.jsx)("b",{children:Math.round(this.state.recentImage.data.analyzed)})," ppb"]})}):!this.state.recentImage.data.analyzed.includes("Failed")&&Object(z.jsx)(b.a,{variant:"danger",className:"custom-alert",style:{marginTop:"40px"},children:Object(z.jsxs)("div",{className:"auto-line-break analyzed-results",children:["Ozone exposure level",Object(z.jsx)("br",{})," ",Object(z.jsx)("b",{children:Math.round(this.state.recentImage.data.analyzed)})," ppb"]})}),this.state.recentImage&&Object(z.jsx)(s.a.Fragment,{children:this.state.showAQI?Object(z.jsxs)(s.a.Fragment,{children:[Object(z.jsx)(p.a,{style:{marginTop:"0px",marginBottom:"50px",fontSize:"15px",width:"150px",height:"40px"},variant:"primary",size:"lg",className:"mt-3 mx-auto",onClick:this.hideAQI,children:"AQI"}),Object(z.jsx)("div",{ref:this.gaugeWrapperRef,children:Object(z.jsxs)("div",{className:"aqi-gauge-container",style:{marginBottom:"40px"},children:[Object(z.jsx)(y.a,{id:"gauge-chart",nrOfLevels:6,colors:["#00FF00","#FFFF00","#FFA500","#FF4500","#B70000"],arcsLength:[.2,.2,.2,.2,.2],percent:this.getAQIValue(Number.parseFloat(this.state.recentImage.data.analyzed)),textColor:"#000000",needleColor:"#d7d7d7",needleBaseColor:"#d7d7d7",arcPadding:.01,cornerRadius:.5,arcWidth:.35,marginInPercent:.035,hideText:!0,animate:!1,animDelay:500,animateDuration:1e3,formatTextValue:function(t){console.log("Received value:",t);var a=Number.parseFloat(e.state.e_hr)+.0166667*Number.parseFloat(e.state.e_min),n=(Number.parseFloat(e.state.recentImage.data.analyzed),Number.parseFloat(e.state.recentImage.data.analyzed)/(8/a));return n>0&&n<=50?"Good":n>50&&n<=100?"Moderate":n>100&&n<=150?"Unhealthy for Sensitive Groups":n>150&&n<=200?"Unhealthy":n>200&&n<=300?"Very Unhealthy":"None"}}),Object(z.jsx)("div",{className:"aqi-gauge-labels",children:this.state.labelPositions.map((function(t,a){return Object(z.jsx)("div",{className:"aqi-gauge-label aqi-gauge-label-".concat(a),style:{position:"absolute",left:t.x,top:t.y},children:Object(z.jsx)("span",{children:e.getAQILabel(a)})},a)}))}),Object(z.jsx)("div",{className:"aqi-gauge-labels",children:this.state.tickLabelPositions.map((function(e,t){return Object(z.jsx)("div",{className:"aqi-gauge-tick-label aqi-gauge-tick-label-".concat(t),style:{transform:"translate(".concat(e.x,"px, ").concat(e.y,"px)")},children:Object(z.jsx)("span",{children:[0,50,100,150,200,300][t]})},t)}))})]})})]}):Object(z.jsx)(p.a,{style:{marginTop:"0px",marginBottom:"50px",fontSize:"15px",width:"150px",height:"40px"},variant:"primary",size:"lg",className:"mt-3 mx-auto",onClick:this.showAQI,children:"AQI"})})]})]})}}]),a}(n.Component),L=function(e){return Object(z.jsx)("div",{className:"image-container",style:{display:"flex",flexDirection:"column",alignItems:"center",marginTop:"10px"},children:Object(z.jsx)("div",{style:{border:"2px solid #ccc",borderRadius:"4px",padding:"3px",marginTop:"0px",marginBottom:"3px"},children:Object(z.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[Object(z.jsxs)("b",{style:{color:"gray",fontStyle:"italic"},children:["Processed  Image Data #",e.id]}),Object(z.jsx)("img",{className:"justify-content-center",src:e.pict,height:"300",rounded:!0,align:"center",style:{marginTop:"0px",marginBottom:"7px"}}),Object(z.jsx)("div",{className:"analyzed-info-container",children:e.analyzedInfo&&Object(z.jsx)("div",{className:"analyzed-info auto-line-break",style:{marginBottom:"0px !important"},children:Object(z.jsx)("b",{style:{color:"gray",fontStyle:"italic"},children:Object(z.jsx)("p",{children:e.analyzedInfo})})})})]})})})},A=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(){var e;Object(o.a)(this,a);for(var n=arguments.length,s=new Array(n),i=0;i<n;i++)s[i]=arguments[i];return(e=t.call.apply(t,[this].concat(s))).state={images:[],visible:2,isLoading:!0,newLoaded:!1,status:!1},e.getImages=function(){w().then((function(t){O.a.get("".concat(t,"/api/images/"),{headers:{accept:"application/json"}}).then((function(t){e.setState({images:t.data,analyzedInfo:t.data.analyzed_info,status:!0}),console.log(t)})),e.setState({isLoading:!1})}))},e.handleVisible=function(){var t=e.state.visible+2;e.setState({newLoaded:!0}),setTimeout((function(){e.setState({visible:t,newLoaded:!1})}),300)},e}return Object(d.a)(a,[{key:"componentDidMount",value:function(){setTimeout(this.getImages,1e3)}},{key:"render",value:function(){var e=this.state.images.slice(0,this.state.visible).map((function(e,t){return Object(z.jsx)(L,{pict:e.processed_image,name:e.analyzed,analyzedInfo:e.analyzed_info,id:t+1},e.id)}));return Object(z.jsxs)("div",{children:[Object(z.jsx)("h3",{children:" Analysis of images"}),0===this.state.images.length&&this.state.status&&Object(z.jsx)("h3",{children:"No images Analyzed"}),this.state.isLoading?Object(z.jsx)(x.a,{animation:"border",role:"status"}):Object(z.jsxs)(s.a.Fragment,{children:[e,this.state.newLoaded&&Object(z.jsx)(x.a,{animation:"border",role:"status"}),Object(z.jsx)("br",{}),this.state.images.length>this.state.visible&&this.state.images.length>2&&Object(z.jsx)(p.a,{clasName:"mb-5",variant:"primary",size:"lg",onClick:this.handleVisible,style:{marginBottom:"20px"},children:"Load more"}),this.state.images.length<=this.state.visible&&this.state.images.length>0&&Object(z.jsx)("p",{className:"mb-3",children:"No more images to load"})]})]})}}]),a}(n.Component),_=A,k=a(201),S=a(200),F=(a(187),function(){return Object(z.jsxs)(k.a,{bg:"dark",variant:"dark",className:"mb-3",children:[Object(z.jsx)(k.a.Brand,{href:"/home",children:"RGB Analyzer"}),Object(z.jsxs)(S.a,{className:"me-auto",children:[Object(z.jsx)(S.a.Link,{href:"/home",children:"Home"}),Object(z.jsx)(S.a.Link,{href:"/list",children:"Analysis History"})]}),Object(z.jsx)("div",{className:"license",children:Object(z.jsx)("p",{children:"\xa9 2023 jaycho@korea.ac.kr. All rights reserved."})})]})}),C=a(83),P=a(10);var T=function(){return Object(z.jsxs)(C.a,{children:[Object(z.jsx)(F,{}),Object(z.jsx)("div",{className:"App",children:Object(z.jsxs)(P.c,{children:[Object(z.jsx)(P.a,{exact:!0,path:"/main",component:N}),Object(z.jsx)(P.a,{exact:!0,path:"/list",component:_}),Object(z.jsx)(P.a,{exact:!0,path:"*",component:N})]})})]})},M=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,203)).then((function(t){var a=t.getCLS,n=t.getFID,s=t.getFCP,i=t.getLCP,r=t.getTTFB;a(e),n(e),s(e),i(e),r(e)}))};r.a.render(Object(z.jsx)(s.a.StrictMode,{children:Object(z.jsx)(T,{})}),document.getElementById("root")),M()},90:function(e,t,a){},91:function(e,t,a){},92:function(e,t,a){}},[[194,1,2]]]);
//# sourceMappingURL=main.3ab9bf4b.chunk.js.map