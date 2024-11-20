import{a as U,u as B,r as y,aK as ge,a9 as O,c as u,aA as K,O as j,aL as xe,aM as Ne,j as R,Q as Ae,aN as Te,aO as le,aP as ye,aQ as De,ay as Se,aR as ce,aS as _,m as J,I as w,P as A,aT as Be,E as Re,T as be,d as Fe,aU as ie,aV as M,aW as Oe,aX as re,B as Ve,aY as we,aZ as _e,R as Me,L as ke,C as D,a_ as se,a$ as oe,aG as ee,U as S,e as Pe,V as Le,z as Ue,b0 as Ge,i as $e,X as He,b1 as ve,ai as We,o as Xe,b2 as je}from"./index.897c2b05.js";import{s as Ke,I as Ye,S as ze,P as ne}from"./SpecificationTable.99802a72.js";function Qe(){const i=U(Ke),c=B(Te),x=B(le),[E,d]=y.exports.useState(0),a=c[E]||c[0],I=new Map,g=c.map(f=>{const o=ge.get(f.type);return Object.keys(O).find(h=>h===f.type)?(I.has(o)?I.set(o,I.get(o)+1):I.set(o,1),`${o}(${I.get(o)})`):o}),b=y.exports.useMemo(()=>c.map((f,o)=>u("div",{role:"button",className:o===E?"tab-button-active":"tab-button-inactive",onClick:()=>{d(o)},children:`${g[o]}`},o)),[c,E,g]),V=Object.keys(O).find(f=>f===a.type)?K.FASAD:K.CORPUS,s=x.wardrobeTypeId!==j.GARDEROB&&xe(x)<2&&a.type===Ne.CORPUS?"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0435 \u043A\u043E\u043B-\u0432\u043E \u0444\u0430\u0441\u0430\u0434\u043E\u0432":"";return y.exports.useEffect(()=>{E>=c.length&&d(0)},[c,E]),R("div",{children:[u(Ye,{children:u(Ae,{icon:"excel",caption:"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0432 Excel",title:"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0432 Excel",onClick:()=>i(a.spec,g[E])})}),u("div",{className:"d-flex flex-row flex-wrap align-items-center gap-1",children:b}),u("hr",{}),u(ze,{purposes:[V,K.BOTH],specification:a.spec,hint:s,legendToRight:!0})]})}const Ze=(i,c,x,E,d)=>{const a=U(ye),I=B(De);return y.exports.useEffect(()=>{a(i,c,x,E,d)},[i,x,E,d,a]),I},F=new Map;F.set(_.NONE,"\u043D\u0435\u0442");F.set(_.THIN,"0,45\u043C\u043C");F.set(_.THICK,"2\u043C\u043C");const k=new Map;k.set("CONF","\u041A\u043E\u043D\u0444\u0438\u0440\u043C\u0430\u0442");k.set("MINIF","\u041C\u0438\u043D\u0438\u0444\u0438\u043A\u0441");k.set("BOTH","\u041A\u043E\u043D\u0444. \u0438 \u043C\u0438\u043D\u0438\u0444.");k.set("NONE","\u043D\u0435\u0442");const qe={id:ie.SHELF,length:0,width:0,count:0,kromka:{L1:_.NONE,L2:_.NONE,W1:_.NONE,W2:_.NONE}};function Je(){var o,h,Y,z;const i=y.exports.useRef(null),c=B(le).details||[],x=U(Oe),E=U(re),d=B(Ve),[a,I]=y.exports.useState(0),g=c[a]||qe,[,b]=Se(we),V=["\u0414\u0435\u0442\u0430\u043B\u044C","\u0414\u043B\u0438\u043D\u0430","\u0428\u0438\u0440\u0438\u043D\u0430","\u041A\u043E\u043B-\u0432\u043E","\u041A\u0440\u043E\u043C\u043A\u0430 2","\u041A\u0440\u043E\u043C\u043A\u0430 0.45","\u041A\u0440\u0435\u043F\u0435\u0436"],s=c.map((n,p)=>({key:p,data:[d.get(n.id)||"",n.length,n.width,n.count,ce(n,_.THICK),ce(n,_.THIN),k.get(de(n))||""]})),f=[{caption:"\u0414\u0435\u0442\u0430\u043B\u044C:",value:g.id||0,valueCaption:n=>d.get(n)||"",message:J.ENTER_CAPTION,type:w.LIST,list:[...d.keys()],optional:!0},{caption:"\u0414\u043B\u0438\u043D\u0430:",value:`${g.length}`,message:J.ENTER_LENGTH,type:w.TEXT,propertyType:A.INTEGER_POSITIVE_NUMBER},{caption:"\u0428\u0438\u0440\u0438\u043D\u0430:",value:`${g.width}`,message:J.ENTER_WIDTH,type:w.TEXT,propertyType:A.INTEGER_POSITIVE_NUMBER},{caption:"\u041A\u043E\u043B-\u0432\u043E:",value:`${g.count}`,message:J.ENTER_COUNT,type:w.TEXT,propertyType:A.INTEGER_POSITIVE_NUMBER},{caption:"\u041A\u0440\u043E\u043C\u043A\u0430 \u043F\u043E \u0434\u043B\u0438\u043D\u0435 1:",value:`${(o=g.kromka)==null?void 0:o.L1}`,list:[...F.keys()],valueCaption:n=>F.get(n)||"",message:"",type:w.LIST},{caption:"\u041A\u0440\u043E\u043C\u043A\u0430 \u043F\u043E \u0434\u043B\u0438\u043D\u0435 2:",value:`${(h=g.kromka)==null?void 0:h.L2}`,list:[...F.keys()],valueCaption:n=>F.get(n)||"",message:"",type:w.LIST},{caption:"\u041A\u0440\u043E\u043C\u043A\u0430 \u043F\u043E \u0448\u0438\u0440\u0438\u043D\u0435 1:",value:`${(Y=g.kromka)==null?void 0:Y.W1}`,list:[...F.keys()],valueCaption:n=>F.get(n)||"",message:"",type:w.LIST},{caption:"\u041A\u0440\u043E\u043C\u043A\u0430 \u043F\u043E \u0448\u0438\u0440\u0438\u043D\u0435 2:",value:`${(z=g.kromka)==null?void 0:z.W2}`,list:[...F.keys()],valueCaption:n=>F.get(n)||"",message:"",type:w.LIST},{caption:"\u041A\u0440\u0435\u043F\u0435\u0436:",value:de(g),list:[...k.keys()],valueCaption:n=>k.get(n)||"",message:"",type:w.LIST}];return y.exports.useEffect(()=>{b(i)},[b,i]),u(Be,{dialogRef:i,title:"\u0420\u0435\u0434\u0430\u043A\u0442\u043E\u0440 \u0434\u0435\u0442\u0430\u043B\u0435\u0439",onClose:()=>{x()},children:R(Re,{children:[u(be,{heads:V,content:s,onSelectRow:n=>I(n)}),u(Fe,{name:"",items:f,dontAsk:!0,onUpdate:async(n,p)=>{const C=[...c];return n[0]&&(C[a].id=p[0]),n[1]&&(C[a].length=+p[1]),n[2]&&(C[a].width=+p[2]),n[3]&&(C[a].count=+p[3]),n[4]&&C[a].kromka&&(C[a].kromka.L1=p[4]),n[5]&&C[a].kromka&&(C[a].kromka.L2=p[5]),n[6]&&C[a].kromka&&(C[a].kromka.W1=p[6]),n[7]&&C[a].kromka&&(C[a].kromka.W2=p[7]),n[8]&&(C[a].drill=me(p[8])),E(G=>({...G,details:C})),{success:!0,message:""}},onDelete:async()=>{const n=c.filter((p,C)=>C!==a);return E(p=>({...p,details:n})),{success:!0,message:""}},onAdd:async(n,p)=>{const C=[...c],G={id:ie.SHELF,length:+p[1],width:+p[2],count:+p[3],kromka:{L1:p[4],L2:p[5],W1:p[6],W2:p[7]},drill:me(p[8])};return C.push(G),E(Q=>({...Q,details:C})),{success:!0,message:""}}})]})})}function de(i){var E;let c=!1,x=!1;return(E=i.drill)==null||E.forEach(d=>{d===M.CONFIRMAT2&&(c=!0),d===M.MINIFIX2&&(x=!0)}),c&&x?"BOTH":c?"CONF":x?"MINIF":"NONE"}function me(i){return i==="BOTH"?[M.CONFIRMAT2,M.MINIFIX2]:i==="CONF"?[M.CONFIRMAT2,M.CONFIRMAT2]:i==="MINIF"?[M.MINIFIX2,M.MINIFIX2]:[]}function et(){var I,g,b,V,s;const i=B(_e),c=(I=i.get(O.DSP))==null?void 0:I.charId,x=(g=i.get(O.MIRROR))==null?void 0:g.charId,E=(b=i.get(O.LACOBEL))==null?void 0:b.charId,d=(V=i.get(O.SAND))==null?void 0:V.charId,a=(s=i.get(O.FMP))==null?void 0:s.charId;return{dspDefaultId:c,mirrorDefaultId:x,lacobelDefaultId:E,sandDefaultId:d,fmpDefaultId:a}}const v=[0,1,2,3,4,5,6],W={fontStyle:"italic",color:"gray"},X=6,tt=[150,200,250,300,350,400,450,500];function ot(){const{permissions:i}=B(Pe);i.get(Me.SPECIFICATION);const c=B(Le),x=B(Ue),E=B(Ge),d=B(le),a=U(re),I=B($e),{dspDefaultId:g,fmpDefaultId:b,lacobelDefaultId:V,mirrorDefaultId:s,sandDefaultId:f}=et(),[o,h]=y.exports.useState(!1),{dsp16List:Y,dsp10List:z,mirrorList:n,fmpList:p,sandList:C,lacobelList:G}=ut(I),Q=B(He),{wardrobeId:pe,wardrobeTypeId:Z,width:Ee,depth:te,height:ue,dspId:he,fasades:l,profileId:Ie,extComplect:T}=d,P=Object.values(l).reduce((e,t)=>t.count+e,0),[{consoleSameHeight:$,consoleSameDepth:H,standSameHeight:L},q]=y.exports.useState({consoleSameHeight:!0,consoleSameDepth:!0,standSameHeight:!0}),ae=Ze(ie.INNER_STAND,d.wardrobeTypeId,d.wardrobeId,d.width,d.height)||{length:0},fe=ke(),Ce=U(ve);return y.exports.useEffect(()=>{L&&a(e=>({...e,extComplect:{...e.extComplect,stand:{...e.extComplect.stand,height:ae.length}}}))},[ae.length,L]),y.exports.useEffect(()=>{const e=$?ue:T.console.height,t=H?te:T.console.depth;a(r=>({...r,extComplect:{...r.extComplect,console:{...r.extComplect.console,height:e,depth:t}}}))},[te,ue]),R("div",{className:"wardrobe-calculator-container",children:[R("div",{children:[R("div",{className:"wardrobe-param-container",children:[u("div",{className:"text-center",children:"\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B"}),R(ne,{style:{padding:"0.5em",border:"1px solid"},children:[u(D,{disabled:d.schema,title:"\u0421\u0435\u0440\u0438\u044F \u0448\u043A\u0430\u0444\u0430:",value:pe,items:[...x.keys()],displayValue:e=>x.get(e),onChange:e=>{a(t=>({...t,wardrobeId:e,fasades:se,extComplect:oe(t.height,t.depth)}))}}),u(D,{disabled:d.schema,title:"\u0422\u0438\u043F \u0448\u043A\u0430\u0444\u0430:",value:Z,items:[...c.keys()],displayValue:e=>c.get(e),onChange:e=>{a(t=>({...t,wardrobeTypeId:e,fasades:se,extComplect:oe(t.height,t.depth)}))}}),u(ee,{caption:"\u0441\u0445\u0435\u043C\u043D\u044B\u0439",checked:d.schema,disabled:d.wardrobeTypeId===j.SYSTEM,onChange:async()=>{d.schema?await fe("\u0412\u0441\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 \u0434\u0435\u0442\u0430\u043B\u0438\u0440\u043E\u0432\u043A\u0435 \u0431\u0443\u0434\u0443\u0442 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u044B. \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C?")&&a(e=>({...e,schema:!d.schema})):a(e=>({...e,schema:!d.schema}))}}),d.schema?u("input",{type:"button",value:"\u0420\u0435\u0434\u0430\u043A\u0442\u043E\u0440 \u0434\u0435\u0442\u0430\u043B\u0435\u0439",onClick:()=>{Ce()}}):u("div",{}),u("div",{className:"text-end",children:"\u0428\u0438\u0440\u0438\u043D\u0430: "}),u(S,{disabled:d.schema,value:Ee,type:A.INTEGER_POSITIVE_NUMBER,min:800,max:5400,setValue:e=>{a(t=>({...t,width:+e}))},submitOnLostFocus:!0}),u("div",{className:"text-end",children:"\u0413\u043B\u0443\u0431\u0438\u043D\u0430: "}),u(S,{disabled:d.schema,value:te,type:A.INTEGER_POSITIVE_NUMBER,min:350,max:1e3,setValue:e=>{a(t=>({...t,depth:+e}))},submitOnLostFocus:!0}),u("div",{className:"text-end",children:"\u0412\u044B\u0441\u043E\u0442\u0430: "}),u(S,{disabled:d.schema,value:ue,type:A.INTEGER_POSITIVE_NUMBER,min:1700,max:2700,setValue:e=>{a(t=>({...t,height:+e}))},submitOnLostFocus:!0}),u(D,{title:"\u0426\u0432\u0435\u0442 \u0414\u0421\u041F:",value:he,items:Y,displayValue:e=>{var t;return(t=I.get(e))==null?void 0:t.name},onChange:e=>{a(t=>({...t,dspId:e}))}}),Z!==j.GARDEROB&&u(D,{title:"\u0426\u0432\u0435\u0442 \u043F\u0440\u043E\u0444\u0438\u043B\u044F:",value:Ie,items:[...Q.keys()],displayValue:e=>{var t,r;return((r=I.get(((t=Q.get(e))==null?void 0:t.charId)||0))==null?void 0:r.name)||""},onChange:e=>{a(t=>({...t,profileId:e}))}})]}),Z!==j.GARDEROB&&R(ne,{style:{padding:"0.5em",border:"1px solid"},children:[u("div",{className:"text-end",children:"\u0424\u0430\u0441\u0430\u0434\u043E\u0432 \u0432\u0441\u0435\u0433\u043E: "}),R("div",{className:"d-flex align-items-center justify-content-between",children:[u("div",{children:P}),u("div",{className:"small-button",role:"button",onClick:()=>{a(e=>({...e,fasades:se}))},children:"\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C"})]}),u(D,{title:"\u0414\u0421\u041F:",value:l.dsp.count,items:v,displayValue:e=>`${e}`,onChange:e=>{+e+P-l.dsp.count<=X&&a(t=>({...t,fasades:{...l,dsp:{count:+e,matId:new Array(+e).fill(g)}}}))}}),l.dsp.count>0&&l.dsp.matId.map((e,t)=>u(D,{styles:W,title:`${t+1}`,items:z,value:l.dsp.matId[t],displayValue:r=>{var m;return(m=I.get(r))==null?void 0:m.name},onChange:r=>{const m=[...l.dsp.matId];m[t]=r,a(N=>({...N,fasades:{...N.fasades,dsp:{...N.fasades.dsp,matId:m}}}))}},"dsp"+t)),u(D,{title:"\u0417\u0435\u0440\u043A\u0430\u043B\u043E:",value:l.mirror.count,items:v,displayValue:e=>`${e}`,onChange:e=>{+e+P-l.mirror.count<=X&&a(t=>({...t,fasades:{...l,mirror:{count:+e,matId:new Array(+e).fill(s)}}}))}}),l.mirror.count>0&&l.mirror.matId.map((e,t)=>u(D,{styles:W,title:`${t+1}`,items:n,value:l.mirror.matId[t],displayValue:r=>{var m;return(m=I.get(r))==null?void 0:m.name},onChange:r=>{const m=[...l.mirror.matId];m[t]=r,a(N=>({...N,fasades:{...N.fasades,mirror:{...N.fasades.mirror,matId:m}}}))}},"mirror"+t)),u(D,{title:"\u0424\u041C\u041F:",value:l.fmp.count,items:v,displayValue:e=>`${e}`,onChange:e=>{+e+P-l.fmp.count<=X&&a(t=>({...t,fasades:{...l,fmp:{count:+e,matId:new Array(+e).fill(b)}}}))}}),l.fmp.count>0&&l.fmp.matId.map((e,t)=>u(D,{styles:W,title:`${t+1}`,items:p,value:l.fmp.matId[t],displayValue:r=>{var m;return(m=I.get(r))==null?void 0:m.name},onChange:r=>{const m=[...l.fmp.matId];m[t]=r,a(N=>({...N,fasades:{...N.fasades,fmp:{...N.fasades.fmp,matId:m}}}))}},"fmp"+t)),u(D,{title:"\u041F\u0435\u0441\u043A\u043E\u0441\u0442\u0440\u0443\u0439:",value:l.sand.count,items:v,displayValue:e=>`${e}`,onChange:e=>{+e+P-l.sand.count<=X&&a(t=>({...t,fasades:{...l,sand:{count:+e,matId:new Array(+e).fill(f)}}}))}}),l.sand.count>0&&l.sand.matId.map((e,t)=>u(D,{styles:W,title:`${t+1}`,items:C,value:l.sand.matId[t],displayValue:r=>{var m;return(m=I.get(r))==null?void 0:m.name},onChange:r=>{const m=[...l.sand.matId];m[t]=r,a(N=>({...N,fasades:{...N.fasades,sand:{...N.fasades.sand,matId:m}}}))}},"sand"+t)),u(D,{title:"\u041B\u0430\u043A\u043E\u0431\u0435\u043B\u044C:",value:l.lacobel.count,items:v,displayValue:e=>`${e}`,onChange:e=>{+e+P-l.lacobel.count<=X&&a(t=>({...t,fasades:{...l,lacobel:{count:+e,matId:new Array(+e).fill(V)}}}))}}),l.lacobel.count>0&&l.lacobel.matId.map((e,t)=>u(D,{styles:W,title:`${t+1}`,items:G,value:l.lacobel.matId[t],displayValue:r=>{var m;return(m=I.get(r))==null?void 0:m.name},onChange:r=>{const m=[...l.lacobel.matId];m[t]=r,a(N=>({...N,fasades:{...N.fasades,lacobel:{...N.fasades.lacobel,matId:m}}}))}},"lacobel"+t))]})]}),Z!==j.SYSTEM&&R("div",{className:"wardrobe-param-container",children:[u("div",{className:`text-center ${o?"toggle-section-button-show":"toggle-section-button-hidden"}`,role:"button",onClick:()=>h(!o),children:"\u0414\u043E\u043F. \u043A\u043E\u043C\u043F\u043B\u0435\u043A\u0442\u0430\u0446\u0438\u044F"}),R(ne,{hidden:!o,style:{padding:"0.5em",border:"1px solid"},children:[u("div",{}),R("div",{className:"d-flex align-items-center justify-content-between",children:[u("div",{}),u("div",{className:"small-button",role:"button",onClick:()=>{a(e=>({...e,extComplect:oe(e.height,e.depth)})),q({consoleSameDepth:!0,consoleSameHeight:!0,standSameHeight:!0})},children:"\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C"})]}),u("div",{className:"text-end",children:"\u0422\u0435\u043B\u0435\u0441\u043A\u043E\u043F: "}),u(S,{value:T.telescope,type:A.INTEGER_POSITIVE_NUMBER,min:0,max:10,setValue:e=>{a(t=>({...t,extComplect:{...t.extComplect,telescope:+e}}))}}),u("hr",{}),u("hr",{}),u("div",{className:"text-end",children:"\u041A\u043E\u043D\u0441\u043E\u043B\u0438 \u043A\u043E\u043B-\u0432\u043E: "}),u(S,{value:T.console.count,type:A.INTEGER_POSITIVE_NUMBER,min:0,max:2,setValue:e=>{a(t=>({...t,extComplect:{...t.extComplect,console:{...t.extComplect.console,count:+e}}}))}}),R("div",{className:"d-flex flex-column align-items-end",children:[u("div",{className:"text-end",children:"\u0412\u044B\u0441\u043E\u0442\u0430 \u043A\u043E\u043D\u0441\u043E\u043B\u0438: "}),u(ee,{styles:{fontSize:"0.8em"},checked:$,caption:"\u043A\u0430\u043A \u0443 \u0448\u043A\u0430\u0444\u0430",onChange:()=>{q(e=>({...e,consoleSameHeight:!$})),$||a(e=>({...e,extComplect:{...e.extComplect,console:{...e.extComplect.console,height:e.height}}}))}})]}),u(S,{disabled:$,value:T.console.height,type:A.INTEGER_POSITIVE_NUMBER,min:0,max:3e3,setValue:e=>{a(t=>({...t,extComplect:{...t.extComplect,console:{...t.extComplect.console,height:+e}}}))}}),R("div",{className:"d-flex flex-column align-items-end",children:[u("div",{className:"text-end",children:"\u0413\u043B\u0443\u0431\u0438\u043D\u0430 \u043A\u043E\u043D\u0441\u043E\u043B\u0438: "}),u(ee,{styles:{fontSize:"0.8em"},checked:H,caption:"\u043A\u0430\u043A \u0443 \u0448\u043A\u0430\u0444\u0430",onChange:()=>{q(e=>({...e,consoleSameDepth:!H})),H||a(e=>({...e,extComplect:{...e.extComplect,console:{...e.extComplect.console,depth:e.depth}}}))}})]}),u(S,{disabled:H,value:T.console.depth,type:A.INTEGER_POSITIVE_NUMBER,min:0,max:800,setValue:e=>{a(t=>({...t,extComplect:{...t.extComplect,console:{...t.extComplect.console,depth:+e}}}))}}),u(D,{title:"\u0428\u0438\u0440\u0438\u043D\u0430 \u043A\u043E\u043D\u0441\u043E\u043B\u0438:",items:tt,value:T.console.width,displayValue:e=>`${e}`,onChange:e=>{a(t=>({...t,extComplect:{...t.extComplect,console:{...t.extComplect.console,width:+e}}}))}}),u(D,{title:"\u0422\u0438\u043F \u043A\u043E\u043D\u0441\u043E\u043B\u0438:",value:T.console.typeId,items:[...E.keys()],displayValue:e=>E.get(e),onChange:e=>{a(t=>({...t,extComplect:{...t.extComplect,console:{...t.extComplect.console,typeId:e}}}))}}),u("hr",{}),u("hr",{}),u("div",{className:"text-end",children:"\u041A\u043E\u0437\u044B\u0440\u0435\u043A: "}),u(S,{value:T.blinder,type:A.INTEGER_POSITIVE_NUMBER,min:0,max:1,setValue:e=>{a(t=>({...t,extComplect:{...t.extComplect,blinder:+e}}))}}),u("div",{className:"text-end",children:"\u041F\u043E\u043B\u043A\u0430 \u0434\u043E\u043F (\u043F\u043E\u043B\u043E\u0447\u043D): "}),u(S,{value:T.shelf,type:A.INTEGER_POSITIVE_NUMBER,min:0,max:10,setValue:e=>{a(t=>({...t,extComplect:{...t.extComplect,shelf:+e}}))}}),u("div",{className:"text-end",children:"\u041F\u043E\u043B\u043A\u0430 \u0434\u043E\u043F (\u043F\u043B\u0430\u0442): "}),u(S,{value:T.shelfPlat,type:A.INTEGER_POSITIVE_NUMBER,min:0,max:10,setValue:e=>{a(t=>({...t,extComplect:{...t.extComplect,shelfPlat:+e}}))}}),u("div",{className:"text-end",children:"\u041F\u0435\u0440\u0435\u043C\u044B\u0447\u043A\u0430 (\u0434\u043E\u043F): "}),u(S,{value:T.pillar,type:A.INTEGER_POSITIVE_NUMBER,min:0,max:10,setValue:e=>{a(t=>({...t,extComplect:{...t.extComplect,pillar:+e}}))}}),u("hr",{}),u("hr",{}),u("div",{className:"text-end",children:"\u0421\u0442\u043E\u0439\u043A\u0430 (\u0434\u043E\u043F) \u043A\u043E\u043B-\u0432\u043E: "}),u(S,{value:T.stand.count,type:A.INTEGER_POSITIVE_NUMBER,min:0,max:10,setValue:e=>{a(t=>({...t,extComplect:{...t.extComplect,stand:{...t.extComplect.stand,count:+e}}}))}}),R("div",{className:"d-flex flex-column align-items-end",children:[u("div",{className:"text-end",children:"\u0421\u0442\u043E\u0439\u043A\u0430 (\u0434\u043E\u043F) \u0440\u0430\u0437\u043C\u0435\u0440: "}),u(ee,{styles:{fontSize:"0.8em"},checked:L,caption:"\u043A\u0430\u043A \u0443 \u0448\u043A\u0430\u0444\u0430",onChange:()=>{q(e=>({...e,standSameHeight:!L}))}})]}),u(S,{disabled:L,value:L?ae.length:T.stand.height,type:A.INTEGER_POSITIVE_NUMBER,min:0,max:2750,setValue:e=>{a(t=>({...t,extComplect:{...t.extComplect,stand:{...t.extComplect.stand,height:+e}}}))}}),u("hr",{}),u("hr",{}),u("div",{className:"text-end",children:"\u0422\u0440\u0443\u0431\u0430 (\u0434\u043E\u043F): "}),u(S,{value:T.truba,type:A.INTEGER_POSITIVE_NUMBER,min:0,max:10,setValue:e=>{a(t=>({...t,extComplect:{...t.extComplect,truba:+e}}))}}),u("div",{className:"text-end",children:"\u0422\u0440\u0435\u043C\u043F\u0435\u043B\u044C (\u0434\u043E\u043F): "}),u(S,{value:T.trempel,type:A.INTEGER_POSITIVE_NUMBER,min:0,max:10,setValue:e=>{a(t=>({...t,extComplect:{...t.extComplect,trempel:+e}}))}}),u("div",{className:"text-end",children:"\u0422\u043E\u0447\u043A\u0438 \u0441\u0432\u0435\u0442\u0430: "}),u(S,{value:T.light,type:A.INTEGER_POSITIVE_NUMBER,min:0,max:10,setValue:e=>{a(t=>({...t,extComplect:{...t.extComplect,light:+e}}))}})]})]})]}),u(Qe,{}),u(Je,{})]})}function ut(i){const c=B(We),x=B(Xe),E=B(je),d=y.exports.useMemo(()=>E.filter(s=>s.purposeId!==K.FASAD).map(s=>s.charId).toSorted((s,f)=>{var o,h;return(((o=i.get(s))==null?void 0:o.name)||"")>(((h=i.get(f))==null?void 0:h.name)||"")?1:-1}),[x]),a=y.exports.useMemo(()=>E.filter(s=>s.purposeId!==K.CORPUS).map(s=>s.charId).toSorted((s,f)=>{var o,h;return(((o=i.get(s))==null?void 0:o.name)||"")>(((h=i.get(f))==null?void 0:h.name)||"")?1:-1}),[x]),I=y.exports.useMemo(()=>c.filter(s=>s.id===O.MIRROR).map(s=>s.charId).toSorted((s,f)=>{var o,h;return(((o=i.get(s))==null?void 0:o.name)||"")>(((h=i.get(f))==null?void 0:h.name)||"")?1:-1}),[c]),g=y.exports.useMemo(()=>c.filter(s=>s.id===O.FMP).map(s=>s.charId).toSorted((s,f)=>{var o,h;return(((o=i.get(s))==null?void 0:o.name)||"")>(((h=i.get(f))==null?void 0:h.name)||"")?1:-1}),[c]),b=y.exports.useMemo(()=>c.filter(s=>s.id===O.SAND).map(s=>s.charId).toSorted((s,f)=>{var o,h;return(((o=i.get(s))==null?void 0:o.name)||"")>(((h=i.get(f))==null?void 0:h.name)||"")?1:-1}),[c]),V=y.exports.useMemo(()=>c.filter(s=>s.id===O.LACOBEL).map(s=>s.charId).toSorted((s,f)=>{var o,h;return(((o=i.get(s))==null?void 0:o.name)||"")>(((h=i.get(f))==null?void 0:h.name)||"")?1:-1}),[c]);return{dsp16List:d,dsp10List:a,mirrorList:I,fmpList:g,sandList:b,lacobelList:V}}export{ot as default};