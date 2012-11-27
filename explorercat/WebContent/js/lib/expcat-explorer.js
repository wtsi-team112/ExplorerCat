expcat.namespace("expcat.cql.Type");
expcat.cql.Type={INTEGER:{getName:function(){return"INTEGER"},parse:function(c){return parseInt(c,10)},defaultValue:function(){return 0}},REAL:{getName:function(){return"REAL"},parse:function(c){return parseFloat(c,10)},defaultValue:function(){return 0}},STRING:{getName:function(){return"STRING"},parse:function(c){return String(c)},defaultValue:function(){return""}},BOOLEAN:{getName:function(){return"BOOLEAN"},parse:function(c){return c?!0:!1},defaultValue:function(){return!0}},DATE:{getName:function(){return"DATE"},
parse:function(c){var c=c.toString(),h=c.charAt(2),d=c.charAt(4);if((h==="-"||h==="/")&&c.length===10)h=parseInt(c.substr(0,2),10),d=parseInt(c.substr(3,2),10),c=parseInt(c.substr(6,4),10);else if((d==="-"||d==="/")&&c.length===10)h=parseInt(c.substr(8,2),10),d=parseInt(c.substr(5,2),10),c=parseInt(c.substr(0,4),10);else throw Error("Wrong date format, expecting yyyy/mm/dd or dd/mm/yyyy");if(h>31||h<1||d>12||d<1||c<0)throw Error("Wrong date");return new Date(c,d,h)},defaultValue:function(){return parse("2000-01-01")}},
CLAUSE:{getName:function(){return"CLAUSE"},parse:function(){throw Error("Invalid operation for type CLAUSE");},defaultValue:function(){return null}},PROPERTY:{getName:function(){return"PROPERTY"},parse:function(c){return c},defaultValue:function(){return null}}};expcat.namespace("expcat.cql.Operator");
expcat.cql.Operator=function(){var c=expcat.cql.Type,h=function(a,b,f){if(b!==f.length)throw Error(a+" was expecting "+b+" operands");},d=function(a){return a===c.INTEGER||a===c.REAL},e=function(a){return a===c.CLAUSE},l=function(a,b){for(var f=0;f<a.length;++f)if(!b.supportsType(a[f].getType()))throw Error("Type "+a[f].getType().getName()+" not supported by "+b.getName());};return{EQUAL:{getSymbol:function(){return"="},getName:function(){return"EQUAL"},translate:function(a){h("EQUAL",this.getArity(),
a);l(a,this);return a[0].translate()+" = "+a[1].translate()},supportsType:function(){return!0},getArity:function(){return 2}},GREATER:{getSymbol:function(){return">"},getName:function(){return"GREATER"},translate:function(a){h("GREATER",this.getArity(),a);l(a,this);return a[0].translate()+" > "+a[1].translate()},supportsType:d,getArity:function(){return 2}},GREATER_EQUAL:{getSymbol:function(){return">="},getName:function(){return"GREATER_EQUAL"},translate:function(a){h("GREATER_EQUAL",this.getArity(),
a);l(a,this);return a[0].translate()+" >= "+a[1].translate()},supportsType:d,getArity:function(){return 2}},LESS_EQUAL:{getSymbol:function(){return"<="},getName:function(){return"LESS_EQUAL"},translate:function(a){h("LESS_EQUAL",this.getArity(),a);l(a,this);return a[0].translate()+" <= "+a[1].translate()},supportsType:d,getArity:function(){return 2}},LESS:{getSymbol:function(){return"<"},getName:function(){return"LESS"},translate:function(a){h("LESS",this.getArity(),a);l(a,this);return a[0].translate()+
" < "+a[1].translate()},supportsType:d,getArity:function(){return 2}},CONTAINS:{getSymbol:function(){return"contains"},getName:function(){return"CONTAINS"},translate:function(a){h("CONTAINS",this.getArity(),a);l(a,this);return a[0].translate()+" contains "+a[1].translate()},supportsType:function(a){return!d(a)},getArity:function(){return 2}},MATCHES:{getSymbol:function(){return"matches"},getName:function(){return"MATCHES"},translate:function(a){h("MATCHES",this.getArity(),a);l(a,this);return a[0].translate()+
" matches "+a[1].translate()},supportsType:function(a){return a===c.STRING},getArity:function(){return 2}},STARTS_WITH:{getSymbol:function(){return"startsWith"},getName:function(){return"STARTS_WITH"},translate:function(a){h("STARTS_WITH",this.getArity(),a);l(a,this);return a[0].translate()+" startsWith "+a[1].translate()},supportsType:function(a){return a===c.STRING},getArity:function(){return 2}},RANGE_FOR:{getSymbol:function(){return"range"},getName:function(){return"RANGE_FOR"},translate:function(a){h("RANGEFOR",
this.getArity(),a);l(a,this);return"rangeFor "+a[0].translate()+" ["+a[1].translate()+","+a[2].translate()+"]"},supportsType:d,getArity:function(){return 3}},NOT:{getSymbol:function(){return"NOT"},getName:function(){return"NOT"},translate:function(a){h("NOT",this.getArity(),a);l(a,this);return"NOT "+a[0].translate()},supportsType:e,getArity:function(){return 1}},AND:{getSymbol:function(){return"AND"},getName:function(){return"AND"},translate:function(a){h("AND",this.getArity(),a);l(a,this);return a[0].translate()+
" AND "+a[1].translate()},supportsType:e,getArity:function(){return 2}},OR:{getSymbol:function(){return"OR"},getName:function(){return"OR"},translate:function(a){h("OR",this.getArity(),a);l(a,this);return a[0].translate()+" OR "+a[1].translate()},supportsType:e,getArity:function(){return 2}},getSymbolMap:function(){var a={},b;for(b in this)typeof this[b]!=="function"&&(a[this[b].getSymbol()]=this[b]);return a}}}();expcat.namespace("expcat.cql.Value");
expcat.cql.Value=function(){var c=expcat.cql.Type,h=function(d,e){if(typeof c[d]==="undefined")throw Error("Unknown CQL type : "+d);d=c[d];e=d.parse(e);return{getValue:function(){return e},getType:function(){return d},translate:function(){if(d===c.DATE){var l=e.getFullYear(),a=e.getMonth(),b=e.getDate();return l+"/"+(a<10?"0"+a:a)+"/"+(b<10?"0"+b:b)}return d===c.STRING?"'"+e+"'":e}}};h.prototype={constructor:h};return h}();expcat.namespace("expcat.cql.Property");
expcat.cql.Property=function(){var c=expcat.cql.Type,h=expcat.cql.Value,d=function(e){var d,a=e.name||"null",b=e.alias||a,f=e.description||null,n=e.maximum||null,g=e.minimum||null,j=e.allowedValues||null;if(typeof c[e.type]==="undefined")throw Error("Unknown CQL type : "+e.type);d=c[e.type];return{getName:function(){return a},getAlias:function(){return b},getValue:function(){return a},getType:function(){return d},translate:function(){return a},getDescription:function(){return f},getMinimum:function(){return g},
getMaximum:function(){return n},getAllowedValues:function(){return j},isValueValid:function(a){if(!a instanceof h)throw Error("Expecting a Value object but you provided a primitive type "+typeof a);return a.getType()!==d?!1:(a.getType()===c.INTEGER||a.getType()===c.REAL)&&isNaN(a.getValue())?!1:n&&a.getValue()>n?!1:g&&a.getValue()<g?!1:j&&j.indexOf(a.getValue())===-1?!1:!0}}};d.prototype={constructor:d};return d}();expcat.namespace("expcat.cql.Clause");
expcat.cql.Clause=function(){var c=expcat.cql.Type,h=expcat.cql.Operator,d=function(){return c.CLAUSE},e=function(){var e,a=[],b=!1,f=function(){a=[]};return{setOperator:function(b){var f=h[b];if(typeof f==="undefined")throw Error("Unknown operator "+b);for(b=0;b<a.length;++b)if(!f.supportsType(a[b].getType()))throw Error("Operand not supported by operator: "+f.getName()+" and "+a[b].getType());e=f},getOperator:function(){return e},setOperands:function(b){var c;f();for(c=0;c<b.length;++c){var d=b[c];
if(e&&!e.supportsType(d.getType()))throw Error("Operand not supported by operator: "+e.getName()+" and "+d.getType().getName());a.push(d)}},getOperands:function(){return a},clearOperands:f,encloseInBrackets:function(a){b=a},translate:function(){if(typeof e==="undefined")throw Error("Operator not defined for translation");return b?"("+e.translate(a)+")":e.translate(a)},getType:d}};e.prototype={constructor:e,getType:d};return e}();expcat.namespace("expcat.plugins.ConditionBar");
expcat.plugins.ConditionBar=function(){var c=expcat.cql.Clause,h=expcat.cql.Value,d=function(e,d,a,b,f,n){var g=!1,j=n||"helpTooltip",q,r,s=[],u=function(a,b){var m=$("<select></select>");m.attr("name",a);m.attr("id",a);b&&b.length>0&&w(m,b);return m},w=function(a,b){var m=[],k;a.html("");for(i=0;i<b.length;++i)k='<option value="'+i+'">'+b[i]+"</option>",m.push(k);a.html(m.join(" "));a.val(0)},x=function(){var b=p(),m=[],k;for(k in a)a[k].supportsType(b.getType())&&m.push(a[k]);b=[];for(k=0;k<m.length;++k)b.push(m[k].getSymbol());
w(r,b)},v=function(){var a=m();s.length!==a.getArity()-1&&(s=z(a.getArity()-1))},o=function(){var a=m();s=z(a.getArity()-1)},y=function(){var a;for(a=0;a<s.length;++a){var b=s[a];k(b)||t(b)}},t=function(a){var b=p(),m=b.getMinimum(),k=b.getMaximum(),f=b.getAllowedValues(),b=b.getType();f!==null?a.val(0):m!==null?a.val(m):k!==null?a.val(k):a.val(b.defaultValue())},z=function(a){var b=[],m,c,d=80/a,h=p().getAllowedValues(),g;if(h==null)for(g=0;g<a;++g)m=$("<input type='text'></input>"),c="inputValue_"+
g+"_"+e,m.attr("name",c),m.attr("id",c),m.css("width",d+"%"),b.push(m),m.bind("change",function(){var a=$(this);k(a)||t(a);f()});else for(g=0;g<a;++g)c="inputValue_"+g+"_"+e,m=u(c,h),m.css("width",d+"%"),b.push(m),m.bind("change",function(){f()});return b},p=function(){var a=q.get(0);return d[a.options[a.selectedIndex].text]},m=function(){var b=r.get(0);return a[b.options[b.selectedIndex].text]},k=function(a){var b=p(),m=a.val();b.getAllowedValues()!=null&&(m=b.getAllowedValues()[parseInt(m)]);m=
b.isValueValid(new h(b.getType().getName(),m));if(!m&&d[a.val()])return!0;m&&a.val(b.getType().parse(a.val()));return m},A=function(){var a=new c,b=p(),k=[b],f,e;a.setOperator(m().getName());for(e=0;e<s.length;++e)f=s[e].val(),b.getAllowedValues()!==null&&(f=b.getAllowedValues()[parseInt(f)]),k.push(new h(b.getType().getName(),f));a.setOperands(k);return g?(b=new c,b.setOperator("NOT"),b.setOperands([a]),b):a},B=function(){var a=p(),b=a.getDescription();return a.getDescription()===null?"No description":
b},C=function(a){var b,m=[];for(b in a)m.push(b);return m};(function(){q=u("selectProperty"+e,C(d));r=u("selectOperator"+e,C(a));o();q.bind("change",function(){x();o();b(e,s);y();$("#"+j+e).html(B());f()});r.bind("change",function(){v();b(e,s);y();f()})})();return{getSelectedProperty:p,getSelectedOperator:m,getPropertySelect:function(){return q},getPropertyDescription:B,getOperatorSelect:function(){return r},getInputValues:function(){return s},negateCondition:function(){g=!g},isConditionNegated:function(){return g},
getId:function(){return e},buildClause:A,refresh:function(){x();v();y()},translateToCQL:function(){return A().translate()}}};d.prototype={constructor:expcat.plugins.ConditionBar};return d}();expcat.namespace("expcat.plugins.OperatorBar");
expcat.plugins.OperatorBar=function(){var c=function(c,d,e){var l,a=function(a,b){var e=[],c;a.html("");for(i=0;i<b.length;++i)c='<option value="'+i+'">'+b[i]+"</option>",e.push(c);a.html(e.join(" "));a.val(0)},b=function(){var a=l.get(0);return d[a.options[a.selectedIndex].text]};l=function(b,c){var d=$("<select></select>");d.attr("name",b);d.attr("id",b);c&&c.length>0&&a(d,c);d.bind("change",function(){e()});return d}("selectOperator"+c,function(a){var b,e=[];for(b in a)e.push(b);return e}(d));
return{getSelectedOperator:b,getOperatorSelect:function(){return l},getId:function(){return c},translateToCQL:function(){return b().getSymbol()}}};c.prototype={constructor:c};return c}();expcat.namespace("expcat.plugins.QueryComposerUI");
expcat.plugins.QueryComposerUI=function(){var c=function(c){var c=c||[$("<div></div>")],d=[],e=[],l=function(a){var b;for(b=0;b<d.length;++b)if(d[b].attr("id")===a)return b;return-1};return{addUIComponent:function(a,b){d.push(a);e.push(b||!1)},removeUIComponents:function(a,b){var c=l(a),b=b||0,h=Math.abs(b)+1;c!==-1&&(b<0&&(c+=b,c<0&&(c=0)),d.splice(c,h),e.splice(c,h))},getUIComponent:function(a){a=l(a);return a===-1?null:d[a]},getNumUIComponents:function(){return d.length},setComponentNesting:function(a,
b){var c=l(a);e[c]=b},setComponentNestingWithinRadius:function(a,b,c){var a=l(a),d;e[a]=c;d=a-b;if(d>=0)for(;d<a;)e[d]=c,d++;d=a+b;if(d<e.length)for(;d>a;)e[d]=c,d--},applyNestingCorrectorFunction:function(a){a(e)},checkComponentIsNested:function(a){return l(a)===-1?!1:e[i]},checkPreviousComponentIsNested:function(a){a=l(a);return a===-1||a===0?!1:e[a-1]},checkNextComponentIsNested:function(a){a=l(a);return a===-1||a===e.length?!1:e[a+1]},getNumConsecutiveNestedComponents:function(a){var a=l(a),b;
if(a===-1)return 0;for(b=a;b<e.length;++b)if(!e[b])return b-a;return b-a-1},getNestingFlags:function(){return e},buildDOMTreeForComponents:function(a){var a=a||"<div></div>",b=!1,f=a,a=$(a),l;for(l=0;l<d.length;++l){if(!b&&e[l]){for(var b=void 0,f=null,g=$(c[0]).clone(),j=g,b=1;b<c.length;++b)f=$(c[b]).clone(),j.append(f),j=f;f=g;a.append(f);b=f;for(f=b.children();f.length!==0;)b=$(f[0]),f=b.children();f=b}else b&&!e[l]&&(f=a);f.append(d[l]);b=e[l]}return a}}};c.prototype={constructor:c};return c}();
expcat.namespace("expcat.plugins.QueryComposerUIManager");
expcat.plugins.QueryComposerUIManager=function(){var c=expcat.cql.Operator,h=expcat.plugins.ConditionBar,d=expcat.plugins.OperatorBar,e=function(e,a,b,f){var n=0,g=[],j=new expcat.plugins.QueryComposerUI(b),q={AND:c.AND,OR:c.OR},r=function(a){var b;for(b=1;b<a.length;b+=2)if(!a[b-1]&&a[b]||!a[b+1]&&a[b])a[b]=!1},s=function(){var a="cnd"+$(this).attr("id").substring(3),b;a:{b=parseInt($(this).attr("id").substring(3));var c;for(c=0;c<g.length;++c)if(g[c].getId()===b){b=c;break a}b=-1}!j.checkPreviousComponentIsNested(a)&&
j.getNumConsecutiveNestedComponents(a)>1?(j.removeUIComponents(a,1),g.splice(b,b<g.length?2:1)):(j.removeUIComponents(a,-1),b>0?g.splice(b-1,2):g.splice(b,2));j.applyNestingCorrectorFunction(r);t()},u=function(){var a=$(this).attr("id").substring(4);j.setComponentNestingWithinRadius("op"+a,1,!0);t()},w=function(){$(this).attr("id").substring(4);j.setComponentNestingWithinRadius("op"+$(this).attr("id").substring(4),1,!1);j.applyNestingCorrectorFunction(r);t()},x=function(){var a=new d(n,q,z),b=a.getOperatorSelect(),
c=a.getId(),e,f,h;g.push(a);f=o("operator","operator"+c);e=o("operatorLine","opLine"+c);a=o("operatorPanel","op"+c);h=o("nestButton","nbtn"+c);c=o("unnestButton","ubtn"+c);h.bind("click",u);c.bind("click",w);a.append(e);f.append(b);a.append(f);a.append(c);a.append(h);n++;return a},v=function(){var b=new h(n,a,e,y,z);b.refresh();var c=b.getPropertySelect(),d=b.getOperatorSelect(),f=b.getInputValues(),j=b.getId(),p,r,q,t,u,w,x,v;g.push(b);p=o("conditionPanel","cnd"+j);r=o("negation","negationDiv"+j);
q=o("property","propertyDiv"+j);x=o("helpButton","helpProperty"+j);helpTooltip=o("helpTooltip","helpTooltip"+j);t=o("operator","operatorDiv"+j);u=o("value","valueDiv"+j);w=o("grouping","optionsDiv"+j);negateButton=o("negationButton","neg"+j);j=o("removeButton","rem"+j);for(v=0;v<f.length;++v)u.append(f[v]);negateButton.bind("click",function(){$(this).attr("class").indexOf("Down")!==-1?$(this).attr("class","negationButton"):$(this).attr("class","negationButtonDown");b.negateCondition();z()});x.tooltip({position:"top right",
opacity:0.9});helpTooltip.html(b.getPropertyDescription());j.bind("click",s);r.append(negateButton);p.append(r);q.append(c);q.append(x);q.append(helpTooltip);p.append(q);t.append(d);p.append(t);p.append(u);w.append(j);p.append(w);n++;return p},o=function(a,b){return $("<div></div>",{"class":a,id:b})},y=function(a,b){var c=j.getUIComponent("cnd"+a),e;$(".value > input",c).detach();$(".value > select",c).detach();for(e=0;e<b.length;++e)$(".value",c).append(b[e])},t=function(){var a=$("#"+f);a.detach();
a.children().detach();$("#query-container").append(j.buildDOMTreeForComponents(a));z()},z=function(){var a=p();$("#cqlCode").html(a)},p=function(){var a,b=!1,c=j.getNestingFlags(),e=[],d;for(d=0;d<g.length;++d)a=g[d].translateToCQL(),!b&&c[d]&&e.push("("),b&&!c[d]&&e.push(")"),e.push(a),b=c[d];c[d-1]&&e.push(")");return e.join(" ")};return{addCondition:function(){$("#"+f).children().length>0&&j.addUIComponent(x());j.addUIComponent(v());t()},generateCQLCode:p}};e.prototype={constructor:e};return e}();
expcat.namespace("expcat.plugins.RGB");expcat.plugins.RGB=function(){var c=function(c,d,e){var l=c,a=d,b=e,c=function(a){a=Math.round(a);if(parseFloat(a)!=parseInt(a)||isNaN(a))throw Error("RGB Color is not Integer: "+a);a<0?a=0:a>255&&(a=255);return a},l=c(l),a=c(a),b=c(b);return{getCssRGB:function(){return"rgb("+l+","+a+","+b+")"},getRed:function(){return l},getGreen:function(){return a},getBlue:function(){return b}}};c.prototype={constructor:c};return c}();expcat.namespace("expcat.plugins.RGB.Gradient");
expcat.plugins.RGB.Gradient=function(){var c=expcat.plugins.RGB,h=function(d,e,h,a){var b=function(a){return a/255};return{getRGB:function(f){var f=parseFloat(f,10),n=Math.abs(a-h),g=Math.abs(h),j=null;f<=h?j=d:(g=f?(f+g)/n:0,f=(b(e.getRed())-b(d.getRed()))*g+b(d.getRed()),n=(b(e.getGreen())-b(d.getGreen()))*g+b(d.getGreen()),g=(b(e.getBlue())-b(d.getBlue()))*g+b(d.getBlue()),j=new c(Math.round(f*255),Math.round(n*255),Math.round(g*255)));return j}}};h.prototype={constructor:h};return h}();expcat.namespace("expcat.plugins.TableExplorer");
expcat.plugins.TableExplorer=function(){var c=function(c,d,e){var l=expcat.plugins.TableExplorer.DataProvider,a=e.width||600,b=e.height||600,f=e.renderTo,n=e.columnOptions||{},e=e.pageSize||25,g=null,j=null,q=function(){(g!=void 0||g!=null)&&g.destroy();(j!=void 0||j!=null)&&j.destroy()};q();g=new l(c,e,n);g.executeQuery(d,function(){Ext.QuickTips.init();j=Ext.create("Ext.grid.Panel",{title:g.getResultName(),store:g.getDataStore(),columns:g.getTableheaders(),height:b,width:a,renderTo:f||Ext.getBody(),
columnLines:!0,autoDestroy:!0,dockedItems:[{xtype:"pagingtoolbar",store:g.getDataStore(),dock:"bottom",displayInfo:!0}],viewConfig:{splitHandleWidth:100,forceFit:!0}});var c=g.getTableheaders().length-1;j.columns[c].setVisible(!1);return j});return{getTable:function(){return j},destroy:q}};c.prototype={constructor:c};return c}();expcat.namespace("expcat.plugins.TableExplorer.DataProvider");
expcat.plugins.TableExplorer.DataProvider=function(){var c=expcat.plugins.RGB,h=expcat.plugins.RGB.Gradient,d=function(e,d,a){var b,f,n,g,j=function(){return b.header.columns},q=function(a){var b=Ext.data.Types;return a=a=="INTEGER"?b.INT.type:a=="REAL"?b.FLOAT.type:a=="STRING"?b.STRING.type:b.AUTO.type},r=function(b,e,d,k,f,g,j){d=j.getHeaderCt().getHeaderAtIndex(f).dataIndex;a:{for(k=0;k<a.length;k++)if(a[k].name===d){d=a[k].renderers;break a}d=void 0}e.tdAttr=e.tdAttr||" ";if(d!=void 0)for(k=0;k<
d.length;k++)if(d[k].name==="tooltip")e.tdAttr="data-qtip='"+b+"'";else if(d[k].name==="colorRenderer")d[k].startLimit!=void 0&&d[k].endLimit!=void 0&&d[k].startColor!=void 0&&d[k].endColor!=void 0&&(f=new h(new c(d[k].startColor[0],d[k].startColor[1],d[k].startColor[2]),new c(d[k].endColor[0],d[k].endColor[1],d[k].endColor[2]),d[k].startLimit,d[k].endLimit),e.tdAttr+=' style="background-color:'+f.getRGB(b).getCssRGB()+';"');else if(d[k].name==="stringReplacer"){if(d[k].stringToReplace===b+"")return d[k].replacementString}else d[k].name===
"stringColorer"&&d[k].colors[b+""]&&(e.tdAttr+=' style="color:'+d[k].colors[b+""]+'; font-weight: bold;"');return b},s=function(a){var b={},c=j(),d;for(d=0;d<a.length;++d)b[c[d].name]=a[d];return new ResultModel(b)},u=function(){var a;Ext.ClassManager.get("CQLProxy")?(a=Ext.ClassManager.get("CQLProxy"),a.read=o):Ext.define("CQLProxy",{extend:"Ext.data.proxy.Ajax",create:w,update:x,destroy:v,read:o});n=new CQLProxy;n.read=o;n.create=w;n.update=x;n.destroy=v;return n},w=function(){},x=function(){},
v=function(){},o=function(a,c,d){var e=this,h=function(){a.resultSet=new Ext.data.ResultSet({records:f,total:b.header.numRows,loaded:!0});a.setSuccessful();a.setCompleted();typeof c=="function"&&c.call(d||e,a)},j;a.sorters.length>0?t(a.start,d.pageSize,function(){y(a.start,d.pageSize,h)},a.sorters):y(a.start,d.pageSize,h)},y=function(a,c,d){e.getResultData(b.ticketNumber,b.hashCode,c,a,function(a){var b;if(a.returnCode===0){f=[];a=a.resultData.rows;for(b=0;b<a.length;++b)f.push(s(a[b].values));typeof d===
"function"&&d()}else throw Error(a.errorMessage);})},t=function(a,c,d,f){e.sortResultData(b.ticketNumber,b.hashCode,f[0].property,f[0].direction!="ASC",function(a){if(a.returnCode===0)d();else throw Error(a.errorMessage);})};return{executeQuery:function(a,c,f){e.setupQuery(a,function(a){if(a.returnCode===0){b=a;var a=[],e=j(),f;for(f=0;f<e.length;++f)a.push({name:e[f].alias,type:q(e[f].type)});Ext.ModelManager.isRegistered("ResultModel")?(e=Ext.ModelManager.getModel("ResultModel"),e.fields=a,e.proxy=
u()):Ext.define("ResultModel",{extend:"Ext.data.Model",fields:a,proxy:u()});g=new Ext.data.Store({model:"ResultModel",autoLoad:!0,remoteSort:!0,pageSize:d})}else throw Error(a.errorMessage);typeof c==="function"&&c()},f)},getColumnDefinitions:j,getDataStore:function(){return g},destroy:function(){e.releaseQuery(b.ticketNumber,b.hashCode)},getResultName:function(){return b.resultName},getTableheaders:function(){var b=[],c=j(),d;for(d=0;d<c.length;++d){var e={};e.header=c[d].alias;e.dataIndex=c[d].name;
var f=e,h;a:for(var g=0;g<a.length;g++)if(a[g].name==c[d].name){h=a[g].width;break a}f.width=h||100;var f=e,l;a:for(g=0;g<a.length;g++)if(a[g].name==c[d].name){l=a[g].sort;break a}f.sortable=l;e.renderer=r||100;b.push(e)}b.push({text:"DummyColumn",flex:1});return b}}};d.prototype={constructor:d};return d}();expcat.namespace("expcat.plugins.CatalogExplorerTable");
expcat.plugins.CatalogExplorerTable=function(){var c=function(c,d,e){var l=expcat.plugins.TableExplorer,a=null,b=function(){(a!=void 0||a!=null)&&a.destroy()};b();a=new l(c,d,e);return{getCatalogExplorerTable:function(){return a},destroy:b}};c.prototype={constructor:c};return c}();