var XLSXBuilder=function(t){function e(r){if(i[r])return i[r].exports;var a=i[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var i={};return e.m=t,e.c=i,e.d=function(t,i,r){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=17)}([function(t,e,i){function r(t){var e,i,r;if(a.call(this,t),r="string"==typeof t?{tag:t}:t,Object.defineProperty(this,"root",{value:!!r.root,writable:!1}),this.tag="string"==typeof r.tag?r.tag:"",this.attributes=[],this.childs=[],r.attributes)for(e=0;e<r.attributes.length;e++)this.addAttribute(r.attributes[e]);if(r.properties)for(i=0;i<r.properties.length;i++)this.addChild(r.properties[i])}var a=i(5),o=i(19);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.processingInformation='<?xml version="1.0" encoding="UTF-8"?>',r.prototype.addAttribute=function(t){var e=t instanceof o?t:new o(t);return this.attributes.push(e),t.id&&Object.defineProperty(this,t.id,{value:e,writable:!1,configurable:!0}),e},r.prototype.addChild=function(t){var e=t instanceof r?t:new r(t);return this.childs.push(e),t.id&&Object.defineProperty(this,t.id,{value:e,writable:!1,configurable:!0}),e},r.prototype.remove=function(t){var e,i,a;if(!(t in this))return null;if((i=this[t])instanceof o)a=this.attributes;else{if(!(i instanceof r)||t in new r(""))return null;a=this.childs}return e=a.indexOf(i),a.splice(e,1),delete this[t],i},r.prototype.serialize=function(){var t,e,i;for(t=(this.root?r.processingInformation:"")+"<"+this.tag,e=0;e<this.attributes.length;e++)t+=this.attributes[e].serialize();if(this.childs.length||this.value||"number"==typeof this.value){for(t+=">",i=0;i<this.childs.length;i++)t+="string"==typeof this.childs[i]?this.childs[i]:this.childs[i].serialize();t+=this.xmlEncode(this.value),t+="</"+this.tag+">"}else t+="/>";return t},t.exports=r},function(t,e,i){function r(t){a.call(this,t),this._filename=t.filename,this._path=t.path}var a=i(0);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.prototype.getFileName=function(){return this._filename},r.prototype.setFileName=function(t){if(!t.match(/^\S+\.\S{3,4}$/))throw new Error("Invalid file name: "+t);this._filename=t},r.prototype.getPath=function(){return this._path},r.prototype.getAbsolutePath=function(){return this.getPath()+this.getFileName()},r.prototype.setPath=function(t){if(!t||t.lastIndexOf("/")!==t.length-1)throw new Error("Invalid file path: "+t);this._path=t},t.exports=r},function(t,e){function i(){this.styleId=null}i.prototype._createConfiguration=function(){throw new Error("Abstract method must be implemented by its subclass!")},i.prototype.getStyleId=function(t){return null===this.styleId&&(this.styleId=this.styles.addStyle(this._createConfiguration())),this.styleId},i.prototype.registerAt=function(t){this.styles=t},i.prototype.getValue=function(t,e){return e[t]},t.exports=i},function(t,e,i){function r(t){a.call(this,r.metadata),this._applyType(t)}var a=i(0),o=i(9),n=i(4),s=i(10),l=i(11),p=i(12);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.DataType={Boolean:"b",Date:"d",InlineString:"inlineStr",Number:"n",SharedString:"s",FormularString:"str"},r.metadata={tag:"c",attributes:[{id:"reference",name:"r",value:""},{id:"style",name:"s",value:"0"}],properties:[{id:"text",tag:"v"}]},r.prototype._applyType=function(t){switch(Object.defineProperty(this,"type",{value:r.DataType.SharedString,writable:!0}),t.constructor){case o:this.type=r.DataType.Date;break;case n:this.type=r.DataType.Number;break;case s:this.type=r.DataType.Boolean,t.isCustomFormatted()||this.addAttribute({name:"t",value:r.DataType.Boolean});break;case l:this.type=r.DataType.Number;break;default:this.addAttribute({name:"t",value:r.DataType.SharedString}),this.type=r.DataType.SharedString}this.bindingType=t},r.prototype.setStyle=function(t){this.style.value=t},r.prototype.setReference=function(t){if("string"!=typeof t||!t.match(/^[A-Z]+[1-9]+[0-9]*$/g))throw new Error('The given Cell reference "'+t+'" does not match the reference pattern.');this.reference.value=t},r.prototype.setValue=function(t,e){var i,a;if(a=this.bindingType.getValue(t,e),!this._isValuePresent(a))return void(this.text.value="");switch(this.type){case r.DataType.Number:this.text.value=a;break;case r.DataType.Boolean:"string"==typeof a&&(a="true"===a.toLowerCase()),this.text.value=a?"1":"0";break;case r.DataType.Date:this.text.value=a;break;default:i=p.getInstance(),this.text.value=i.insert(a)}this.setStyle(this.bindingType.getStyleId(e))},r.prototype._isValuePresent=function(t){return"string"==typeof t&&!!t||"number"==typeof t||"boolean"==typeof t||t instanceof Date},t.exports=r},function(t,e,i){function r(t){a.call(this),this.unit=t?t.unit:null,this.unitProperty=t?t.unitProperty:null,this.delimiter=!!t&&t.delimiter,this.scale=t?t.scale:null,this.styleIds={}}var a=i(2);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.DEFAULT={numberFormat:0},r.builtin={1:"0",2:"0.00",3:"#,##0",4:"#,##0.00",9:"0%",10:"0.00%",11:"0.00E+00",12:"# ?/?",13:"# ??/??",37:"#,##0;(#,##0)",38:"#,##0;[Red](#,##0)",39:"#,##0.00;(#,##0.00)",40:"#,##0.00;[Red](#,##0.00)",48:"##0.0E+0"},r.prototype._createConfiguration=function(t){var e,i,a,o=r.builtin[1],n="";if(!this.delimiter&&"number"!=typeof this.scale)return r.DEFAULT;if(this.delimiter&&(o="#,##"+o),"number"==typeof this.scale&&this.scale>0)for(o+=".",e=0;e<this.scale;e++)o+="0";"string"==typeof this.unitProperty&&t?n=' "'+t[this.unitProperty]+'"':"string"==typeof this.unit&&(n=' "'+this.unit+'"'),o+=n,a={numberFormat:{format:o}};for(i in r.builtin)r.builtin[i]===o&&(a.numberFormat=parseInt(i,10));return a},r.prototype.getStyleId=function(t){var e,i;return this.unitProperty?t?(i=t[this.unitProperty],e=this.styleIds[i],void 0===e&&(this.styleIds[i]=this.styles.addStyle(this._createConfiguration(t))),this.styleIds[i]):0:Object.getPrototypeOf(r.prototype).getStyleId.call(this)},t.exports=r},function(t,e){function i(t){this.value=t&&t.value?t.value:""}i.prototype.xmlEncode=function(t){return"string"==typeof t&&null!==t.match(/[><"'&]+/)?this._replace(t):t},i.prototype._replace=function(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")},t.exports=i},function(t,e,i){function r(t){a.call(this,r.metadata),t instanceof a&&(this.setFileName(t.getFileName()+".rels"),this.setPath(t.getPath()+"_rels/"))}var a=i(1),o=i(0);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.metadata={filename:".rels",path:"_rels/",tag:"Relationships",root:!0,attributes:[{name:"xmlns",value:"http://schemas.openxmlformats.org/package/2006/relationships"}],properties:[]},r.prototype.addRelationship=function(t,e){var i="rId"+(this.childs.length+1);return this.childs.push(new o({tag:"Relationship",attributes:[{name:"Id",value:i},{name:"Type",value:e},{name:"Target",value:t}]})),i},t.exports=r},function(t,e,i){function r(t){a.call(this,r.metadata),Object.defineProperty(this,"_columns",{value:t,writable:!1}),this._hierarchyProperty=t._hierarchyProperty,this._hierarchyLevel=0,this._createCols(),this._createHeader()}var a=i(1),o=i(8);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.metadata={tag:"worksheet",root:!0,attributes:[{name:"xmlns",value:"http://schemas.openxmlformats.org/spreadsheetml/2006/main"},{name:"xmlns",suffix:"r",value:"http://schemas.openxmlformats.org/officeDocument/2006/relationships"}],properties:[{tag:"sheetPr",properties:[{tag:"outlinePr",attributes:[{name:"summaryBelow",value:"0"}]}]},{id:"dimension",tag:"dimension",attributes:[{id:"reference",name:"ref",value:"A1"}]},{id:"views",tag:"sheetViews",properties:[{id:"defaultView",tag:"sheetView",attributes:[{name:"workbookViewId",value:"0"}],properties:[{id:"pane",tag:"pane",attributes:[{name:"ySplit",value:"1"},{name:"topLeftCell",value:"A2"},{name:"activePane",value:"bottomLeft"},{name:"state",value:"frozen"}]}]}]},{id:"format",tag:"sheetFormatPr",attributes:[{name:"defaultRowHeight",value:"15"}]},{id:"columns",tag:"cols"},{id:"data",tag:"sheetData"},{id:"filter",tag:"autoFilter",attributes:[{id:"reference",name:"ref",value:"A1"}]},{tag:"pageMargins",attributes:[{name:"left",value:"0.75"},{name:"right",value:"0.75"},{name:"top",value:"1"},{name:"bottom",value:"1"},{name:"header",value:"0.5"},{name:"footer",value:"0.5"}]}]},r.MAX_ROWS=1048576,r.prototype._createCols=function(){var t,e,i,r;for(e=0;e<this._columns.size();e++)t=this._columns.columns[e],i=this._calculateColumnWidth(t.label.length)+2.4,r=function(t){var e,i;return i=.25,e=1/i,Math.ceil(t*e)/e}(Math.max(this._calculateColumnWidth(t.width),i)),this.columns.addChild({tag:"col",attributes:[{name:"min",value:e+1},{name:"max",value:e+1},{name:"bestFit",value:"1"},{name:"width",value:Math.max(r,i)},{name:"customWidth",value:"1"}]})},r.prototype._calculateColumnWidth=function(t){return"number"!=typeof t?0:(2*t/3*11+5)/7.33},r.prototype._setHierarchyDepth=function(t){"number"!=typeof t||t<1||t>7||(this.format.hierarchyDepth||this.format.addAttribute({id:"hierarchyDepth",name:"outlineLevelRow",value:t||0}),this.format.hierarchyDepth.value=Math.max(this.format.hierarchyDepth.value,t))},r.prototype._createHeader=function(){var t=this._columns.getHeader();if(null===t)return this.remove("filter"),void this.views.defaultView.remove("pane");this._appendRow(t)},r.prototype._appendRow=function(t){var e,i;for(t.setReference(""+(this.data.childs.length+1)),this.data.childs.push(t.serialize()),e=0;e<this.childs.length;e++)"dimension"==this.childs[e].tag&&(i="A1:"+o.getColumnReferenceByIndex(this._columns.size()-1)+this.data.childs.length,this.dimension.reference.value=i,this.filter&&(this.filter.reference.value=i))},r.prototype.createGroup=function(t,e){var i;this._hierarchyLevel=e,i=this._columns.getGroupHeader(t),this._appendRow(i)},r.prototype.insert=function(t){var e;if(this.data.childs.length==r.MAX_ROWS)throw new Error("Row limit reached.");e=this._columns.hierarchyLevelProperty?t[this._columns.hierarchyLevelProperty]:this._hierarchyLevel,this._appendRow(this._columns.bind(t,e)),this._setHierarchyDepth(e)},t.exports=r},function(t,e,i){function r(){a.call(this,r.metadata)}var a=i(0),o=i(3);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.metadata={tag:"row",attributes:[{id:"reference",name:"r",value:""},{id:"spans",name:"spans",value:"1:1"}]},r.getColumnReferenceByIndex=function(t){return t<26?String.fromCharCode(65+t):r.getColumnReferenceByIndex(Math.floor(t/26)-1)+String.fromCharCode(65+t%26)},r.prototype._updateSpans=function(){this.spans.value="1:"+this.childs.length},r.prototype.addCell=function(t){var e;t&&t instanceof o&&(e=this.childs.push(t),this._updateSpans(),this.reference.value&&t.setReference(r.getColumnReferenceByIndex(e-1)+this.reference.value),this.style&&t.setStyle(this.style.value))},r.prototype.setReference=function(t){var e,i;if((i="number"==typeof t?String(t):t)&&i.match(/^[1-9]+[0-9]*$/g)&&this.reference.value!=i)for(this.reference.value=i,e=0;e<this.childs.length;e++)this.childs[e].setReference(r.getColumnReferenceByIndex(e)+i)},r.prototype.setStyle=function(t){var e,i;for(this.style||(i=this.addAttribute({name:"s"}),Object.defineProperty(this,"style",{value:i})),this.style.value=t,e=0;e<this.childs.length;e++)this.childs[e].setStyle(t)},t.exports=r},function(t,e,i){function r(t){a.call(this),this.type=t?t.type:null,this.format=t?t.format:null,this.calendar=t?t.calendar:null,this.inputFormat=t&&"string"==typeof t.inputFormat?t.inputFormat.toUpperCase():null}var a=i(2);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.DEFAULT={numberFormat:14},r.builtin={14:"mm-dd-yy",15:"d-mmm-yy",16:"d-mmm",17:"mmm-yy",18:"h:mm AM/PM",19:"h:mm:ss AM/PM",20:"h:mm",21:"h:mm:ss",22:"m/d/yy h:mm",45:"mm:ss",46:"[h]:mm:ss",47:"mmss.0"},r.oSymbols={Y:{apply:function(t,e){e.setUTCFullYear(t)}},M:{apply:function(t,e){e.setUTCMonth(t-1)}},D:{apply:function(t,e){e.setUTCDate(t)}}},r.prototype._createConfiguration=function(){var t,e,i;if(!this.type&&!this.format&&!this.calendar)return r.DEFAULT;switch(this.type){case"datetime":i=r.builtin[22];break;case"time":i=r.builtin[21];break;default:i=r.builtin[14]}switch("string"==typeof this.format&&(i=this.format.match(/^[dhmsy\s-,.:\/]+(AM\/PM)?$/)?this.format:i),this.calendar){case"islamic":i="b2d mmmm yyyy";break;case"japanese":i="[$-ja-JP]ge.m.d"}e={numberFormat:{format:i}};for(t in r.builtin)r.builtin[t]===i&&(e.numberFormat=parseInt(t,10));return e},r.prototype.getValue=function(t,e){var i=e[t];return null===i||void 0===i?null:("object"==typeof i&&(i=i.valueOf()),"number"==typeof i?r._JsDateToExcel(i):this.inputFormat&&"string"==typeof this.inputFormat?r._JsDateToExcel(r._parseStringDate(i,this.inputFormat)):"time"===this.type&&r.odataDurationRegex.test(i)?r._JsDateToExcel(r._parseODataDuration(i)):r.odataDateRegex.test(i)?r._JsDateToExcel(r._parseOdataDate(i)):isFinite(i)?r._JsDateToExcel(parseInt(i,10)):null)},r._parseODataDuration=function(t){var e,i,a,o,n,s;return e=r.odataDurationRegex.exec(t),e[2]||e[3]?t:(i=parseInt(e[4]||0,10),a=parseInt(e[5]||0,10),o=parseInt(e[6]||0,10),n=parseFloat(e[7]||0),s=e[8],s=s?1e3*parseFloat("0."+s):0,s+=1e3*n+6e4*o+36e5*a+864e5*i,"-"===e[1]&&(s=-s),s)},r._parseOdataDate=function(t){var e,i,a;return e=r.odataDateRegex.exec(t),i=new Date(parseInt(e[1],10)),e[2]&&e[3]&&(a=parseInt(e[2]+e[3],10),i.setUTCMinutes(i.getUTCMinutes()-a)),i.getTime()},r.odataDateRegex=/^\/Date\((-?\d+)(\+|-)?(\d+)?\)\/$/,r.odataDurationRegex=/^([+-])?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(?:\.(\d+))?S)?)?/,r.dateStringRegex=/([Y]{4,}|[M]{2}|[D]{2})/g,r._JsDateToExcel=function(t){return Math.max(t/864e5+25569,0)},r._parseStringDate=function(t,e){var i,a,o;a=new Date(0);do{null!==(i=r.dateStringRegex.exec(e))&&(o=t.slice(i.index,i.index+i[0].length),r.oSymbols[i[0].charAt(0)].apply(parseInt(o,10),a))}while(null!==i);return a.getTime()},t.exports=r},function(t,e,i){function r(t){a.call(this),this.trueValue=t?t.trueValue:null,this.falseValue=t?t.falseValue:null}var a=i(2);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.DEFAULT={numberFormat:0},r.prototype.isCustomFormatted=function(){return!!this.trueValue&&"string"==typeof this.trueValue&&!!this.falseValue&&"string"==typeof this.falseValue},r.prototype._createConfiguration=function(){var t=r.DEFAULT;return this.isCustomFormatted()&&(t={numberFormat:{format:'"'+this.trueValue+'";;"'+this.falseValue+'"'}}),t},t.exports=r},function(t,e,i){function r(t){a.call(this,t),this.displayUnit="boolean"!=typeof t.displayUnit||t.displayUnit}var a=i(4);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.DEFAULT_SCALE=3,r.DIGITS={ADP:0,AFN:0,ALL:0,AMD:0,BHD:3,BIF:0,BYR:0,CAD:2,CHF:2,CLF:4,CLP:0,COP:0,CRC:0,CZK:0,DEFAULT:2,DJF:0,ESP:0,GNF:0,GYD:0,HUF:0,IDR:0,IQD:0,IRR:0,ISK:0,ITL:0,JOD:3,JPY:0,KMF:0,KPW:0,KRW:0,KWD:3,LAK:0,LBP:0,LUF:0,LYD:3,MGA:0,MGF:0,MMK:0,MNT:0,MRO:0,MUR:0,OMR:3,PKR:0,PYG:0,RSD:0,RWF:0,SLL:0,SOS:0,STD:0,SYP:0,TMM:0,TND:3,TRL:0,TWD:0,TZS:0,UGX:0,UYI:0,UZS:0,VND:0,VUV:0,XAF:0,XOF:0,XPF:0,YER:0,ZMK:0,ZWD:0},r.prototype._createConfiguration=function(t){var e,i,a,o,n;for(o="#,##0",a=this.unitProperty||"number"!=typeof this.scale?r.DIGITS[t[this.unitProperty]]:this.scale,"number"!=typeof a&&(a=r.DIGITS.DEFAULT),o+=a>0?".":"_.",e=0;e<a;e++)o+="0";for(i=r.DEFAULT_SCALE-a;i>0;i--)o+="_0";return this.displayUnit&&(n=t[this.unitProperty]?'"'+t[this.unitProperty]+'"':"_E_U_R",o=o+" "+n),o="* "+o+";* - "+o,{numberFormat:{format:o}}},t.exports=r},function(t,e,i){function r(){if(r.instance instanceof r)return r.instance;a.call(this,r.metadata),Object.defineProperty(this,"map",{value:new Map,writable:!1}),Object.defineProperty(this,"_shared",{value:new o(""),writable:!1}),r.instance=this}var a=i(1),o=i(22);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.getInstance=function(){return r.instance||(r.instance=new r),r.instance},r.metadata={filename:"sharedStrings.xml",tag:"sst",root:!0,attributes:[{name:"xmlns",value:"http://schemas.openxmlformats.org/spreadsheetml/2006/main"}]},r.prototype.insert=function(t){var e;return this.map.has(t)?this.map.get(t):(this._shared.setValue(t),e=this.map.size,this.map.set(t,e),this.childs.push(this._shared.serialize()),e)},t.exports=r},function(t,e,i){function r(t){a.call(this),this.font=t?t.font:null,this.fill=t?t.fill:null,this.template=t?t.template:null,this.hierarchyLevel=t?t.hierarchyLevel:null,this._styleIds=[]}var a=i(2),o=i(14);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.DEFAULT={font:{size:11,name:"Arial"}},r.prototype._createConfiguration=function(t){var e=this.font||this.fill?{font:this.font,fill:this.fill}:{font:r.DEFAULT.font};return this.hierarchyLevel&&(e.align={align:o.horizontal.LEFT,indent:2*t[this.hierarchyLevel]}),e},r.prototype.getStyleId=function(t){var e,i;return this.hierarchyLevel?t?(i=t[this.hierarchyLevel],e=this._styleIds[i],void 0===e&&(this._styleIds[i]=this.styles.addStyle(this._createConfiguration(t))),this._styleIds[i]):0:Object.getPrototypeOf(r.prototype).getStyleId.call(this)},r.prototype.getValue=function(t,e){var i,r,a,o;if(!this.template)return"string"==typeof t?e[t]:e[t[0]];if(t.every(function(t){return null===e[t]||void 0===e[t]||"string"==typeof e[t]&&""===e[t]}))return"";for(a=this.template,r=/{([0-9]+)}/g,i=r.exec(this.template);null!==i;)o=e[t[i[1]]],null!==o&&void 0!==o||(o=""),a=a.replace(i[0],o),i=r.exec(this.template);return a},t.exports=r},function(t,e,i){function r(){o.call(this,r.metadata)}function a(t,e){var i,r=!1;for(i in e)r=r||e[i]===t&&"function"!=typeof e[i];return r}var o=i(0);r.prototype=Object.create(o.prototype),r.prototype.constructor=r,r.metadata={tag:"alignment"},r.horizontal={LEFT:"left",CENTER:"center",RIGHT:"right",contains:function(t){return a(t,r.horizontal)}},r.vertical={TOP:"top",MIDDLE:"middle",BOTTOM:"bottom",contains:function(t){return a(t,r.vertical)}},r.prototype.isDefault=function(){return 0==this.attributes.length},r.prototype.setIndent=function(t){if("number"!=typeof t||t<=0)return this.remove("indent"),void this.remove("horizontal");this._setAlignmentAttribute("indent",t),this.horizontal||this.setHorizontalAlignment(r.horizontal.LEFT)},r.prototype.setHorizontalAlignment=function(t){r.horizontal.contains(t)&&this._setAlignmentAttribute("horizontal",t)},r.prototype.setVerticalAlignment=function(t){r.vertical.contains(t)&&this._setAlignmentAttribute("vertical",t)},r.prototype._setAlignmentAttribute=function(t,e){this[t]||this.addAttribute({id:t,name:t}),this[t].value=e},r.prototype.equals=function(t){return void 0!==t&&null!==t&&this.vertical==t.vertical&&this.horizontal==t.horizontal&&this.indent==t.indent},t.exports=r},,,function(t,e,i){function r(t,e,i){var r,a,o,n,s;if(!(t instanceof Array&&t.length))throw new Error("No binding provided");if(n="SAP Document Export",s="Metadata",this.app=new this.objects.App(e),this.core=new this.objects.Core(e),this.workbook=new this.objects.Workbook,e&&(n=e.sheetName?e.sheetName:n,s=e.metaSheetName?e.metaSheetName:s),this.sheet=this.workbook.addSheet(n,{columns:t,hierarchyLevel:i}),this.workbook.selectSheet(this.sheet),"object"==typeof e&&e.metainfo instanceof Array)for(r=[{property:"key",label:"Key",width:20},{property:"value",label:"Value",width:20}],this.metadata=this.workbook.addSheet(s,{columns:r,hideHeader:!0}),a=0;a<e.metainfo.length;a++)o=e.metainfo[a],this.metadata.createGroup(o.name,1),this._insertIntoSheet(o.items.slice(),this.metadata)}var a=i(18),o=i(20),n=i(21),s=i(6),l=i(7),p=i(23);r.prototype={objects:{App:a,ContentTypes:o,Core:n,Relationships:s,Sheet:l,Workbook:p},build:function(){var t,e,i,r,a,o,n,s,l;for(t=[{name:"[Content_Types].xml",path:"",type:this.objects.ContentTypes},{name:".rels",path:"_rels/",type:this.objects.Relationships,relationships:[{target:"xl/workbook.xml",type:"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"},{target:"docProps/app.xml",type:"http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties"},{target:"docProps/core.xml",type:"http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties"}]}],e=new JSZip,i=0;i<t.length;i++){if(a=t[i],o=a.type,(n=new o)instanceof this.objects.Relationships)for(r=0;r<a.relationships.length;r++)s=a.relationships[r],n.addRelationship(s.target,s.type);e.file(a.path+a.name,n.serialize())}return e.file(this.app.getAbsolutePath(),this.app.serialize()),e.file(this.core.getAbsolutePath(),this.core.serialize()),e.file(this.workbook.getAbsolutePath(),this.workbook.serialize()),e.file(this.workbook.getRelationships().getAbsolutePath(),this.workbook.getRelationships().serialize()),this.workbook.getRelatedFiles().forEach(function(t,i,r){e.file(t.getAbsolutePath(),t.serialize())}),l={compression:"DEFLATE",type:JSZip.support.nodebuffer?"nodebuffer":"arraybuffer"},e.generateAsync?e.generateAsync(l):new Promise(function(t,i){t(e.generate(l))})},append:function(t){this._insertIntoSheet(t,this.sheet)},_insertIntoSheet:function(t,e){var i;if(void 0!==t&&null!==t)for(i=t instanceof Array?t:[t];i.length;)e.insert(i.shift())}},t.exports=r},function(t,e,i){function r(t){a.call(this,r.metadata),t&&(t.application&&(this.application.value=t.application),t.version&&(this.version.value=t.version))}var a=i(1);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.metadata={path:"docProps/",filename:"app.xml",tag:"Properties",root:!0,attributes:[{name:"xmlns",value:"http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"},{name:"xmlns",suffix:"vt",value:"http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"}],properties:[{id:"application",tag:"Application",value:"SAP UI5"},{tag:"DocSecurity",value:"0"},{tag:"Company",value:"SAP SE"},{tag:"SharedDoc",value:"false"},{id:"version",tag:"AppVersion",value:"1.54"}]},t.exports=r},function(t,e,i){function r(t){a.call(this,t),this.name=t.name?t.name:"",this.prefix=t.prefix?t.prefix:"",this.suffix=t.suffix?t.suffix:""}var a=i(5);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.prototype.serialize=function(){return" "+(this.prefix?this.prefix+":":"")+this.name+(this.suffix?":"+this.suffix:"")+'="'+this.xmlEncode(this.value)+'"'},t.exports=r},function(t,e,i){function r(){a.call(this,r.metadata)}var a=i(1);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.FILENAME="",r.metadata={filename:"[Content_Types].xml",tag:"Types",root:!0,attributes:[{name:"xmlns",value:"http://schemas.openxmlformats.org/package/2006/content-types"}],properties:[{tag:"Default",attributes:[{name:"Extension",value:"xml"},{name:"ContentType",value:"application/xml"}]},{tag:"Default",attributes:[{name:"Extension",value:"rels"},{name:"ContentType",value:"application/vnd.openxmlformats-package.relationships+xml"}]},{tag:"Override",attributes:[{name:"PartName",value:"/xl/workbook.xml"},{name:"ContentType",value:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"}]},{tag:"Override",attributes:[{name:"PartName",value:"/xl/worksheets/sheet1.xml"},{name:"ContentType",value:"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"}]},{tag:"Override",attributes:[{name:"PartName",value:"/xl/styles.xml"},{name:"ContentType",value:"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"}]},{tag:"Override",attributes:[{name:"PartName",value:"/xl/sharedStrings.xml"},{name:"ContentType",value:"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"}]},{tag:"Override",attributes:[{name:"PartName",value:"/docProps/core.xml"},{name:"ContentType",value:"application/vnd.openxmlformats-package.core-properties+xml"}]},{tag:"Override",attributes:[{name:"PartName",value:"/docProps/app.xml"},{name:"ContentType",value:"application/vnd.openxmlformats-officedocument.extended-properties+xml"}]}]},t.exports=r},function(t,e,i){function r(t){a.call(this,r.metadata),t&&(t.title&&(this.title.value=t.title),t.modifiedBy&&(this.modifiedBy.value=t.modifiedBy))}var a=i(1);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.metadata={path:"docProps/",filename:"core.xml",tag:"cp:coreProperties",root:!0,attributes:[{name:"xmlns",suffix:"cp",value:"http://schemas.openxmlformats.org/package/2006/metadata/core-properties"},{name:"xmlns",suffix:"dc",value:"http://purl.org/dc/elements/1.1/"},{name:"xmlns",suffix:"dcterms",value:"http://purl.org/dc/terms/"},{name:"xmlns",suffix:"dcmitype",value:"http://purl.org/dc/dcmitype/"},{name:"xmlns",suffix:"xsi",value:"http://www.w3.org/2001/XMLSchema-instance"}],properties:[{id:"title",tag:"dc:title",value:"Table Export"},{tag:"dc:creator",value:"SAP UI5 Document Export"},{tag:"dcterms:created",attributes:[{prefix:"xsi",name:"type",value:"dcterms:W3CDTF"}],value:(new Date).toISOString()},{tag:"cp:keywords",value:"SAP UI5 EXPORT"},{id:"modifiedBy",tag:"cp:lastModifiedBy",value:"SAP UI5"}]},t.exports=r},function(t,e,i){function r(t){a.call(this,r.metadata),this.setValue(t)}var a=i(0);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.metadata={tag:"si",properties:[{id:"text",tag:"t"}]},r.prototype.setValue=function(t){this.text.value=t&&"string"==typeof t?t:""+t},t.exports=r},function(t,e,i){function r(){var t;o.call(this,r.metadata),this._styles=new l,this._styles.setPath(this.getPath()),this.addRelatedFile(this._styles),this._sharedStrings=n.getInstance(),this._sharedStrings.setPath(this.getPath()),this.addRelatedFile(this._sharedStrings);for(t in r.RELATIONS)this._relationships.addRelationship(r.RELATIONS[t].target,r.RELATIONS[t].type);this._registeredSheets=[]}var a=i(24),o=i(26),n=i(12),s=i(7),l=i(27);r.prototype=Object.create(o.prototype),r.prototype.constructor=r,r.RELATIONS={sharedStrings:{target:"sharedStrings.xml",type:"http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings"},styles:{target:"styles.xml",type:"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"}},r.metadata={filename:"workbook.xml",path:"xl/",tag:"workbook",root:!0,attributes:[{name:"xmlns",value:"http://schemas.openxmlformats.org/spreadsheetml/2006/main"},{name:"xmlns",suffix:"r",value:"http://schemas.openxmlformats.org/officeDocument/2006/relationships"}],properties:[{tag:"bookViews",properties:[{tag:"workbookView",attributes:[{name:"xWindow",value:"0"},{name:"yWindow",value:"0"},{name:"windowWidth",value:"22260"},{name:"windowHeight",value:"12645"}]}]},{id:"sheets",tag:"sheets"}]},r.prototype.addSheet=function(t,e){var i,r,o,n,l;return r=this.sheets.childs.length+1,l="sheet"+r+".xml",o=this._relationships.addRelationship("worksheets/"+l,"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"),this.sheets.addChild({tag:"sheet",attributes:[{name:"name",value:t},{name:"sheetId",value:""+r},{name:"id",prefix:"r",value:o}]}),i=new a(e,this._styles),n=new s(i),n.setFileName(l),n.setPath(this.getPath()+"worksheets/"),this.addRelatedFile(n),this._registeredSheets.push(n),n},r.prototype.selectSheet=function(t){if(!(t instanceof s)||this._registeredSheets.indexOf(t)<0)throw new Error("Could not select sheet. Sheet not found.");this._registeredSheets.forEach(function(t,e,i){t.views.defaultView.remove("selected")}),t.views.defaultView.addAttribute({id:"selected",name:"tabSelected",value:"1"})},t.exports=r},function(t,e,i){function r(t,e){var i,r,o;for(this.columns=[],this._row=null,this.styles=e,this.hideHeader=t.hideHeader,Object.defineProperty(this,"hierarchyLevelProperty",{value:t.hierarchyLevel}),i=t.columns,o=0;o<i.length;o++)0==o&&("string"==typeof i[o]&&(i[o]={property:i[o]}),i[o].hierarchyLevel=this.hierarchyLevelProperty),r=i[o]instanceof a?i[o]:new a(i[o],this.styles),this.columns.push(r)}var a=i(25),o=i(13),n=i(8),s=i(3);r.prototype._initBinding=function(){var t;for(this._row=new n,t=0;t<this.columns.length;t++)this._row.addCell(this.columns[t].getCell())},r.prototype.bind=function(t,e){var i,r;for(null===this._row&&this._initBinding(),r=Math.min(e,7),r&&!this._row.outline?this._row.addAttribute({id:"outline",name:"outlineLevel",value:r}):r&&this._row.outline?this._row.outline.value=r:!r&&this._row.outline&&this._row.remove("outline"),i=0;i<this.columns.length;i++)this.columns[i].bind(t);return this._row},r.prototype.getHeader=function(){var t,e,i;return this.hideHeader?null:(e=new n,i=new o({font:{name:"Arial",size:11,bold:!0},fill:{color:"F7F7F7"}}),i.registerAt(this.styles),e.setStyle(i.getStyleId()),e.addAttribute({name:"customFormat",value:"1"}),this.columns.forEach(function(r,a,o){t=new s(i),t.setValue("label",r),e.addCell(t)}),e)},r.prototype.getGroupHeader=function(t){var e,i,r;return i=new n,r=new o({font:{name:"Arial",size:11,bold:!0},fill:{color:"F2F2F2"}}),r.registerAt(this.styles),i.setStyle(r.getStyleId()),i.addAttribute({name:"customFormat",value:"1"}),i.spans.value="1:"+this.size(),e=new s(r),e.setValue("name",{name:t}),i.addCell(e),i},r.prototype.size=function(){return this.columns.length},t.exports=r},function(t,e,i){function r(t,e){var i;if(!(i="string"==typeof t?{property:t}:t)||!i.property)throw new Error("The property for the column is not defined");this.align=i.align?i.align:r.Align.Left,this.property=i.property,this.label=i.label?i.label:i.property,this.width=i.width,this.styles=e,this.type=this._initType(i)}var a=i(3),o=i(9),n=i(4),s=i(11),l=i(10),p=i(13);r.Align={Left:"left",Center:"center",Right:"right"},r.prototype._initType=function(t){var e,i;return i=t.type,"date"===i||"datetime"===i||"time"===i?(e=new o({calendar:t.calendar,format:t.format,type:i,inputFormat:t.inputFormat}),this.label="datetime"===i?this.label+" (UTC)":this.label):e="number"===i||"percent"===i||"exponent"===i?new n({delimiter:t.delimiter,scale:t.scale,type:t.type,unit:t.unit,unitProperty:t.unitProperty}):"currency"===i?new s({type:i,unitProperty:t.unitProperty,displayUnit:t.displayUnit,scale:t.scale}):"boolean"===i?new l({trueValue:t.trueValue,falseValue:t.falseValue}):new p({type:"text",template:t.template,hierarchyLevel:t.hierarchyLevel}),e.registerAt(this.styles),e},r.prototype.getCell=function(){return this.cell||(this.cell=new a(this.type)),this.cell},r.prototype.bind=function(t){this.cell.setValue(this.property,t)},t.exports=r},function(t,e,i){function r(t){a.call(this,t),this._relatedFiles=[],this._relationships=new o(this),this.addRelatedFile(this._relationships)}var a=i(1),o=i(6);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.prototype.addRelatedFile=function(t){if(!(t instanceof a))throw new Error("A related file must be of type XMLFile");this._relatedFiles.push(t)},r.prototype.getRelationships=function(){return this._relationships},r.prototype.getRelatedFiles=function(){return this._relatedFiles.slice()},t.exports=r},function(t,e,i){function r(){a.call(this,r.metadata),this.addFill({type:"none"}),this.addFill({type:"gray125"}),this.addStyle(o.DEFAULT)}var a=i(1),o=i(28),n=i(29),s=i(30),l=i(31),p=i(32);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.metadata={filename:"styles.xml",tag:"styleSheet",root:!0,attributes:[{name:"xmlns",value:"http://schemas.openxmlformats.org/spreadsheetml/2006/main"}],properties:[{id:"numberFormats",tag:"numFmts",attributes:[{id:"count",name:"count",value:"0"}]},{id:"fonts",tag:"fonts",attributes:[{id:"count",name:"count",value:"0"}]},{id:"fills",tag:"fills",attributes:[{id:"count",name:"count",value:"0"}]},{id:"borders",tag:"borders",attributes:[{id:"count",name:"count",value:"0"}]},{tag:"cellStyleXfs",attributes:[{name:"count",value:"1"}],properties:[{tag:"xf",attributes:[{name:"numFmtId",value:"0"},{name:"fontId",value:"0"},{name:"fillId",value:"0"},{name:"borderId",value:"0"}]}]},{id:"cellXfs",tag:"cellXfs",attributes:[{id:"count",name:"count",value:"0"}]},{tag:"cellStyles",attributes:[{name:"count",value:"1"}],properties:[{tag:"cellStyle",attributes:[{name:"name",value:"Normal"},{name:"xfId",value:"0"},{name:"builtinId",value:"0"}]}]},{tag:"dxfs",attributes:[{name:"count",value:"0"}]},{tag:"tableStyles",attributes:[{name:"count",value:"0"},{name:"defaultTableStyle",value:"TableStyleMedium2"},{name:"defaultPivotStyle",value:"PivotStyleLight16"}]}]},r.prototype.addStyle=function(t){var e,i,r,a,n;return i=this.addFont(t.font),r=this.addFill(t.fill),a=this.addBorder(t.border),void 0===t.numberFormat&&(t.numberFormat=0),n=p._isBuiltin(t.numberFormat)?t.numberFormat:this.addNumberFormat(t.numberFormat),e=new o,e.setFontId(i),e.setFillId(r),e.getBorderId(a),e.setNumberFormatId(n),e.setAlignment(t.align),this._addToAggregation(e,this.cellXfs)},r.prototype._addToAggregation=function(t,e){var i,r;return r=-1,e.childs.forEach(function(e,i,a){e.equals(t)&&(r=i)}),-1===r&&(e.addChild(t),i=e.childs.length,e.count.value=i,r=i-1),r},r.prototype.addColor=function(t){var e;this.colors||this.addChild({id:"colors",tag:"colors",properties:[{id:"mru",tag:"mruColors"}]}),(e=this.colors.mru.childs.some(function(e){return e.rgb.value==="FF"+t}))||this.colors.mru.addChild({tag:"color",attributes:[{id:"rgb",name:"rgb",value:"FF"+t}]})},r.prototype.addFont=function(t){var e=new n(t);return this._addToAggregation(e,this.fonts)},r.prototype.addFill=function(t){var e,i;return i=new s(t),e=this._addToAggregation(i,this.fills),null!==i.getFill()&&this.addColor(i.getFill()),e},r.prototype.addBorder=function(t){var e=new l(t);return this._addToAggregation(e,this.borders)},r.prototype.addNumberFormat=function(t){var e,i;return i=new p(t),e=this._addToAggregation(i,this.numberFormats),i.setId(p.ID_OFFSET+e),i.getId()},t.exports=r},function(t,e,i){function r(){a.call(this,r.metadata)}var a=i(0),o=i(14);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.metadata={tag:"xf",attributes:[{id:"numberFormat",name:"numFmtId",value:"0"},{id:"font",name:"fontId",value:"0"},{id:"fill",name:"fillId",value:"0"},{id:"border",name:"borderId",value:"0"}]},r.DEFAULT={font:{name:"Arial",size:11,family:"2",color:"1",bold:!1},fill:{type:"none"}},r.prototype.getAlignment=function(){return this.alignment?this.alignment:null},r.prototype.getFontId=function(){return this.font.value},r.prototype.getFillId=function(){return this.fill.value},r.prototype.getBorderId=function(){return this.border.value},r.prototype.getNumberFormatId=function(){return this.numberFormat.value},r.prototype.setAlignment=function(t){var e,i;if(i="alignment",this._apply(t,"Alignment"),void 0===t||null===t)return void this.remove(i);i in this||(e=new o,this.addChild(e),Object.defineProperty(this,i,{value:e,writable:!1,configurable:!0})),this[i].setHorizontalAlignment(t.horizontal),this[i].setVerticalAlignment(t.vertical),this[i].setIndent(t.indent)},r.prototype.setFontId=function(t){this._apply(t,"Font"),this.font.value=t},r.prototype.setFillId=function(t){this._apply(t,"Fill"),this.fill.value=t},r.prototype.setBorderId=function(t){this.border.value=t},r.prototype.setNumberFormatId=function(t){this._apply(t,"NumberFormat"),this.numberFormat.value=t},r.prototype._apply=function(t,e){var i="apply"+e;this.remove(i),t&&this.addAttribute({id:i,name:i,value:"1"})},r.prototype.equals=function(t){return t instanceof r&&(this.getFontId()===t.getFontId()&&this.getFillId()===t.getFillId()&&this.getBorderId()===t.getBorderId()&&this.getNumberFormatId()===t.getNumberFormatId()&&(!this.alignment&&!t.alignment||this.alignment&&this.alignment.equals(t.alignment)))},t.exports=r},function(t,e,i){function r(t){a.call(this,r.metadata),t&&t instanceof Object&&this.setName(t.name).setSize(t.size).setFamily(t.family).setBold(!!t.bold)}var a=i(0);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.DEFAULT_SIZE=11,r.DEFAULT_NAME="Arial",r.metadata={tag:"font",properties:[{id:"size",tag:"sz",attributes:[{id:"valueAttribute",name:"val",value:r.DEFAULT_SIZE}]},{id:"color",tag:"color",attributes:[{id:"valueAttribute",name:"theme",value:"1"}]},{id:"name",tag:"name",attributes:[{id:"valueAttribute",name:"val",value:r.DEFAULT_NAME}]},{id:"family",tag:"family",attributes:[{id:"valueAttribute",name:"val",value:2}]}]},r.prototype.equals=function(t){return t instanceof r&&(this.getName()==t.getName()&&this.getSize()==t.getSize()&&this.isBold()==t.isBold()&&this.getColor()==t.getColor()&&this.getFamily()==t.getFamily())},r.prototype.isBold=function(){return!!this.bold},r.prototype.getSize=function(){return this.size.valueAttribute.value},r.prototype.getName=function(){return this.name.valueAttribute.value},r.prototype.getColor=function(){return this.color.valueAttribute.value},r.prototype.getFamily=function(){return this.family.valueAttribute.value},r.prototype.setBold=function(t){return t===!!this.bold?this:(t?this.addChild({id:"bold",tag:"b"}):this.remove("bold"),this)},r.prototype.setFamily=function(t){return t>0&&t<15&&(this.family.valueAttribute.value=t),this},r.prototype.setName=function(t){return t&&"string"==typeof t&&(this.name.valueAttribute.value=t),this},r.prototype.setSize=function(t){if("number"!=typeof t||isNaN(t)||t<1||t>96)throw new Error("The size "+t+" is not supported.");return this.size.valueAttribute.value=t,this},t.exports=r},function(t,e,i){function r(t){a.call(this,r.metadata),t&&(t.color?this.setFill(t.color):t.type&&this.setType(t.type))}var a=i(0);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.DEFAULT_TYPE="none",r.metadata={tag:"fill",properties:[{id:"fill",tag:"patternFill",attributes:[{id:"type",name:"patternType",value:r.DEFAULT_TYPE}]}]},r.prototype.equals=function(t){return t instanceof r&&(this.getType()===t.getType()&&this.getFill()===t.getFill())},r.prototype.getFill=function(){return this.fill.childs.length?this.fill.color.rgb.value.substring(2):null},r.prototype.setFill=function(t){this.reset(),t&&"string"==typeof t&&/^[A-Fa-f0-9]{6}$/.test(t)&&(this.fill.type.value="solid",this.fill.addChild({id:"color",tag:"fgColor",attributes:[{id:"rgb",name:"rgb",value:"FF"+t}]}),this.fill.addChild({tag:"bgColor",attributes:[{name:"indexed",value:"64"}]}))},r.prototype.getType=function(){return this.fill.type.value},r.prototype.setType=function(t){this.reset(),this.fill.type.value=t},r.prototype.reset=function(){this.fill.type.value="none",this.fill.childs.length=0},t.exports=r},function(t,e,i){function r(){a.call(this,r.metadata)}var a=i(0);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.metadata={tag:"border",properties:[{tag:"left"},{tag:"right"},{tag:"top"},{tag:"bottom"},{tag:"diagonal"}]},r.prototype.equals=function(t){return t instanceof r},t.exports=r},function(t,e,i){function r(t){a.call(this,r.metadata),this.format.value=t&&t.format?t.format:r.DEFAULT}var a=i(0);r.prototype=Object.create(a.prototype),r.prototype.constructor=r,r.metadata={tag:"numFmt",attributes:[{id:"formatId",name:"numFmtId"},{id:"format",name:"formatCode"}]},r.BUILTIN_IDS=[0,1,2,3,4,9,10,11,12,13,14,15,16,17,18,19,20,21,22,37,38,39,40,45,46,47,48,49],r.ID_OFFSET=166,r.DEFAULT="#,##0.00",r.prototype.getId=function(){return this.formatId.value},r.prototype.getFormat=function(){return this.format.value},r.prototype.setId=function(t){var e="number"==typeof t?t:parseInt(t,10);isNaN(e)||e<0||r._isBuiltin(e)||(this.formatId.value=t)},r.prototype.setFormat=function(t){this.format.value=t},r._isBuiltin=function(t){return r.BUILTIN_IDS.indexOf(t)>-1},r.prototype.equals=function(t){return t instanceof r&&this.getFormat()===t.getFormat()},t.exports=r}]);
