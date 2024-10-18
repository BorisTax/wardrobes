import{u as S,R as U,r as A,F as G,a as y,M as K,b as ee,c as V,m as I,I as x,j as w,E as X,d,C as J,T as B,e as Z,f as te,g as O,h as j,i as se,k as ne,l as oe,n as ue,P as q,p as ae,o as Q,q as de,s as ce,t as ie,v as W,w as re,x as le,y as pe,z as me,A as $,B as Ee,D as Ae,G as ge,H as Te,J as Ie,K as De,L as fe,N as Se,O as ye,Q as Le,S as xe,U as Re,V as Ce,W as he,X as Me,Y as Ne,Z as _,_ as ve,$ as Pe}from"./index.ce4be4a2.js";function we(){const{permissions:R}=S(O),e=R.get(U.MATERIALS),i=S(j),o=S(se),[{baseMaterial:T,materialIndex:E},l]=A.exports.useState({baseMaterial:[...o.keys()][0]||G.EMPTY,materialIndex:0}),g=y(ne),M=y(oe),N=y(ue),v=A.exports.useMemo(()=>(i.filter(t=>t.type===T)||[{name:"",type:""}]).toSorted((t,s)=>t.name>s.name?1:-1),[i,T]),D=v[E]||{name:"",code:"",image:"",type:G.DSP,purpose:K.BOTH},L=ee(D.id),f=(D==null?void 0:D.type)===G.DSP,p=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434","\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"],r=v.map(t=>[t.name,t.code,V.get(t.purpose)||""]),c=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:D.name||"",message:I.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:D.code,message:I.ENTER_CODE,type:x.TEXT},{caption:"\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435:",value:D.purpose||"",valueCaption:t=>V.get(t)||"",list:[...V.keys()],message:I.ENTER_PURPOSE,type:x.LIST,readonly:!f},{caption:"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435:",value:L||"",message:I.ENTER_IMAGE,type:x.FILE}];return w(X,{children:[w("div",{children:[d("div",{className:"d-flex flex-nowrap gap-2 align-items-start",children:d(J,{title:"\u041C\u0430\u0442\u0435\u0440\u0438\u0430\u043B: ",value:T,items:[...o.keys()],displayValue:t=>o.get(t)||"",onChange:(t,s)=>{l(u=>({...u,baseMaterial:s,materialIndex:0}))}})}),d("hr",{}),d(B,{heads:p,content:r,onSelectRow:t=>{l(s=>({...s,materialIndex:t}))}})]}),e!=null&&e.Read?d(Z,{name:D.name,items:c,onUpdate:e!=null&&e.Update?async(t,s)=>{const u=t[0]?s[0]:"",m=t[1]?s[1]:"",C=t[2]?s[2]:K.FASAD,n=t[3]?s[3]:"";return await N({id:D.id,type:T,name:u,code:m,image:n,purpose:C})}:void 0,onDelete:e!=null&&e.Delete?async()=>{const t=await g(D.id);return l(s=>({...s,materialIndex:0})),t}:void 0,onAdd:e!=null&&e.Create?async(t,s)=>{const u=s[0],m=s[1],C=s[2],n=s[3];return te(u,T,i)?{success:!1,message:I.MATERIAL_EXIST}:await M({name:u,type:T,code:m,image:"",purpose:C},n)}:void 0}):d("div",{})]})}function _e(){var c;const{permissions:R}=S(O),e=R.get(U.MATERIALS),i=S(ae),[{type:o,profileIndex:T},E]=A.exports.useState({type:i[0].type,profileIndex:0}),l=i.filter(t=>t.type===o),g=S(Q),M=A.exports.useMemo(()=>g.map(t=>t.name).toSorted(),[g]);A.exports.useMemo(()=>{E({type:i[0].type,profileIndex:0})},[i]);const N=y(de),v=y(ce),D=y(ie),L=l[T],f=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434","\u0429\u0435\u0442\u043A\u0430"],p=l.map(t=>{var s;return[t.name,t.code,(s=g.find(u=>u.id===t.brushId))==null?void 0:s.name]}),r=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:L.name,message:I.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:L.code,message:I.ENTER_CODE,type:x.TEXT},{caption:"\u0429\u0435\u0442\u043A\u0430:",value:((c=g.find(t=>t.id===L.brushId))==null?void 0:c.name)||"",list:M,message:I.ENTER_BRUSH,type:x.LIST}];return w(X,{children:[w("div",{children:[d("div",{className:"d-flex flex-nowrap gap-2 align-items-start",children:d(J,{title:"\u0422\u0438\u043F: ",value:o,items:[...q.keys()],displayValue:t=>q.get(t),onChange:(t,s)=>{E({type:s,profileIndex:0})}})}),d("hr",{}),d(B,{heads:f,content:p,onSelectRow:t=>{E(s=>({...s,profileIndex:t}))}})]}),e!=null&&e.Read?d(Z,{name:L.name,items:r,onUpdate:e!=null&&e.Update?async(t,s)=>{var a;const u=t[0]?s[0]:"",m=t[1]?s[1]:"",C=t[2]?(a=g.find(h=>h.name===s[2]))==null?void 0:a.id:-1;return await D({id:L.id,type:o,name:u,code:m,brushId:C})}:void 0,onDelete:e!=null&&e.Delete?async()=>{const t=await N(L);return E(s=>({...s,profileIndex:0})),t}:void 0,onAdd:e!=null&&e.Create?async(t,s)=>{var a;const u=s[0],m=s[1],C=((a=g.find(h=>h.name===s[2]))==null?void 0:a.id)||-1;return l.find(h=>h.name===u&&h.type===o)?{success:!1,message:I.MATERIAL_EXIST}:await v({name:u,type:o,code:m,brushId:C})}:void 0}):d("div",{})]})}function Ue(){var s;const{permissions:R}=S(O),e=R.get(U.MATERIALS),i=S(W),o=S(re),T=A.exports.useMemo(()=>i.toSorted((u,m)=>(u==null?void 0:u.name)>(m==null?void 0:m.name)?1:-1),[i]),E=A.exports.useMemo(()=>o.map(u=>u.caption).toSorted((u,m)=>u>m?1:-1),[o]),[l,g]=A.exports.useState(0),{id:M,name:N,code:v,typeId:D}=T[l]||{id:-1,name:"",dsp:"",code:"",typeId:-1},L=y(le),f=y(pe),p=y(me),r=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434"],c=T.map(u=>{var m;return[u.name,u.code,(m=o.find(C=>C.id===u.typeId))==null?void 0:m.caption]}),t=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:N||"",message:I.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:v,message:I.ENTER_CODE,type:x.TEXT},{caption:"\u0422\u0438\u043F:",value:((s=o.find(u=>u.id===D))==null?void 0:s.caption)||"",message:I.ENTER_CODE,type:x.LIST,list:E}];return w(X,{children:[d(B,{heads:r,content:c,onSelectRow:u=>{g(u)}}),e!=null&&e.Read?d(Z,{name:N,items:t,onUpdate:e!=null&&e.Update?async(u,m)=>{var P;const C=u[0]?m[0]:"",n=u[1]?m[1]:"",a=u[2]?(P=o.find(b=>b.caption===m[2]))==null?void 0:P.id:-1;return await p({id:M,name:C,code:n,typeId:a||-1})}:void 0,onDelete:e!=null&&e.Delete?async()=>{const u=await L(M);return g(0),u}:void 0,onAdd:e!=null&&e.Create?async(u,m)=>{var P;const C=m[0],n=m[1],a=u[2]?(P=o.find(b=>b.caption===m[2]))==null?void 0:P.id:-1;return T.find(b=>b.name===C)?{success:!1,message:I.MATERIAL_EXIST}:await f({name:C,code:n,typeId:a||-1})}:void 0}):d("div",{})]})}function Oe(){const{permissions:R}=S(O),e=R.get(U.MATERIALS),i=S($),o=A.exports.useMemo(()=>i.toSorted((c,t)=>c.name>t.name?1:-1),[i]),T=S(j),[E,l]=A.exports.useState(0);A.exports.useMemo(()=>T.filter(c=>c.type===G.DSP).map(c=>c.name),[T]);const{id:g,name:M,code:N}=o[E]||{name:"",code:""},v=y(Ee),D=y(Ae),L=y(ge),f=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434"],p=o.map(c=>[c.name,c.code]),r=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:M||"",message:I.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:N,message:I.ENTER_CODE,type:x.TEXT}];return A.exports.useEffect(()=>{l(0)},[o]),w(X,{children:[d(B,{heads:f,content:p,onSelectRow:c=>{l(c)}}),e!=null&&e.Read?d(Z,{name:M,items:r,onUpdate:e!=null&&e.Update?async(c,t)=>{const s=c[0]?t[0]:"",u=c[1]?t[1]:"";return await L({id:g,name:s,code:u})}:void 0,onDelete:e!=null&&e.Delete?async()=>{const c=await v(o[E]);return l(0),c}:void 0,onAdd:e!=null&&e.Create?async(c,t)=>{const s=t[0],u=t[1];return o.find(C=>C.name===s)?{success:!1,message:I.MATERIAL_EXIST}:await D({name:s,code:u})}:void 0}):d("div",{})]})}function be(){const{permissions:R}=S(O),e=R.get(U.MATERIALS),i=S(Q),o=A.exports.useMemo(()=>i.toSorted((r,c)=>r.name>c.name?1:-1),[i]),[T,E]=A.exports.useState(0),{id:l,name:g,code:M}=o[T]||{id:-1,name:"",code:""},N=y(Te),v=y(Ie),D=y(De),L=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434"],f=o.map(r=>[r.name,r.code]),p=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:g,message:I.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:M,message:I.ENTER_CODE,type:x.TEXT}];return A.exports.useEffect(()=>{E(0)},[o]),w(X,{children:[d(B,{heads:L,content:f,onSelectRow:r=>{E(r)}}),e!=null&&e.Read?d(Z,{name:g,items:p,onUpdate:e!=null&&e.Update?async(r,c)=>{r[0]&&c[0];const t=r[1]?c[1]:"";return await D({name:g,id:l,code:t})}:void 0,onDelete:e!=null&&e.Delete?async()=>{const r=await N(l);return E(0),r}:void 0,onAdd:e!=null&&e.Create?async(r,c)=>{const t=c[0],s=c[1];return o.find(m=>m.name===t)?{success:!1,message:I.MATERIAL_EXIST}:await v({name:t,code:s})}:void 0}):d("div",{})]})}function Xe(){const{permissions:R}=S(O),e=R.get(U.MATERIALS),i=S(fe),o=A.exports.useMemo(()=>i.toSorted((f,p)=>f.caption>p.caption?1:-1),[i]),[T,E]=A.exports.useState(0),{name:l,caption:g,code:M}=o[T]||{name:"",caption:"",code:""},N=y(Se),v=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434"],D=o.map(f=>[f.caption,f.code]),L=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:g,message:I.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:M,message:I.ENTER_CODE,type:x.TEXT}];return A.exports.useEffect(()=>{E(0)},[i]),w(X,{children:[d(B,{heads:v,content:D,onSelectRow:f=>{E(f)}}),e!=null&&e.Read?d(Z,{name:l,items:L,onUpdate:e!=null&&e.Update?async(f,p)=>{const r=f[0]?p[0]:"",c=f[1]?p[1]:"";return await N({name:l,caption:r,code:c})}:void 0}):d("div",{})]})}function Be(){const{permissions:R}=S(O),e=R.get(U.MATERIALS),i=S(ye),o=A.exports.useMemo(()=>i.toSorted((p,r)=>p.name>r.name?1:-1),[i]),[T,E]=A.exports.useState(0),{name:l,code:g}=o[T]||{name:"",code:""},M=y(Le),N=y(xe),v=y(Re),D=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434"],L=o.map(p=>[p.name,p.code]),f=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:l||"",message:I.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:g,message:I.ENTER_CODE,type:x.TEXT}];return A.exports.useEffect(()=>{E(0)},[i]),w(X,{children:[d(B,{heads:D,content:L,onSelectRow:p=>{E(p)}}),e!=null&&e.Read?d(Z,{name:l,items:f,onUpdate:e!=null&&e.Update?async(p,r)=>{const c=p[0]?r[1]:"",t=p[1]?r[2]:"";return await v({name:l,code:c,caption:t})}:void 0,onDelete:e!=null&&e.Delete?async()=>{const p=await M(o[T]);return E(0),p}:void 0,onAdd:async(p,r)=>{const c=r[0];return o.find(s=>s.name===l)?{success:!1,message:I.MATERIAL_EXIST}:await N({name:l,code:c})}}):d("div",{})]})}function Ze(){const{permissions:R}=S(O),e=R.get(U.MATERIALS),i=S(W),o=S($),T=S(Ce),E=S(j),l=A.exports.useMemo(()=>E.filter(n=>n.type===G.DSP),[E]),g=A.exports.useMemo(()=>T.map(n=>({dsp:E.find(a=>a.id===n.matId),edge:i.find(a=>a.id===n.edgeId),zaglushka:o.find(a=>a.id===n.zaglushkaId)})).toSorted((n,a)=>{var h;return n.dsp&&a.dsp&&((h=n.dsp)==null?void 0:h.name)>a.dsp.name?1:-1}),[T,i,o]),M=A.exports.useMemo(()=>l.map(n=>n.name),[E]),N=A.exports.useMemo(()=>i.toSorted((n,a)=>(n==null?void 0:n.name)>(a==null?void 0:a.name)?1:-1).map(n=>n.name),[i]),v=A.exports.useMemo(()=>o.toSorted((n,a)=>(n==null?void 0:n.name)>(a==null?void 0:a.name)?1:-1).map(n=>n.name),[o]),[D,L]=A.exports.useState(0),{dsp:f,edge:p,zaglushka:r}=g[D],c=y(he),t=y(Me),s=y(Ne),u=["\u0414\u0421\u041F","\u041A\u0440\u043E\u043C\u043A\u0430","\u0417\u0430\u0433\u043B\u0443\u0448\u043A\u0430"],m=g.map(n=>{var a,h,P;return[(a=n.dsp)==null?void 0:a.name,(h=n.edge)==null?void 0:h.name,(P=n.zaglushka)==null?void 0:P.name]}),C=[{caption:"\u0414\u0421\u041F:",value:(f==null?void 0:f.name)||"",message:I.ENTER_CAPTION,type:x.LIST,list:M},{caption:"\u041A\u0440\u043E\u043C\u043A\u0430:",value:(p==null?void 0:p.name)||"",message:I.ENTER_CODE,type:x.LIST,list:N},{caption:"\u0417\u0430\u0433\u043B\u0443\u0448\u043A\u0430:",value:(r==null?void 0:r.name)||"",message:I.ENTER_CODE,type:x.LIST,list:v}];return w(X,{children:[d(B,{heads:u,content:m,onSelectRow:n=>{L(n)}}),e!=null&&e.Read?d(Z,{items:C,onUpdate:e!=null&&e.Update?async(n,a)=>{var H,k;const h=n[1]?(H=i.find(F=>F.name===a[1]))==null?void 0:H.id:-1,P=n[2]?o.find(F=>F.name===a[2]):-1;return await s({matId:(k=g[D].dsp)==null?void 0:k.id,edgeId:h,zaglushkaId:P})}:void 0,onAdd:e!=null&&e.Create?async(n,a)=>{var k,F,Y;const h=n[0]?(k=l.find(z=>z.name===a[0]))==null?void 0:k.id:-1,P=n[1]?(F=i.find(z=>z.name===a[1]))==null?void 0:F.id:-1,b=n[2]?(Y=o.find(z=>z.name===a[2]))==null?void 0:Y.id:-1;return await t({matId:h||-1,edgeId:P||-1,zaglushkaId:b||-1})}:void 0,onDelete:e!=null&&e.Delete?async()=>{var a;const n=await c(((a=g[D].dsp)==null?void 0:a.id)||-1);return L(0),n}:void 0}):d("div",{})]})}function ze(){const{permissions:R}=S(O),e=R.get(U.MATERIALS),[i,o]=A.exports.useState(_.PLATE),T=[...ve.entries()].map((l,g)=>d("div",{className:i===l[0]?"tab-button-active":"tab-button-inactive",onClick:()=>{o(l[0])},role:"button",children:l[1]},g)),E=Fe(i);return A.exports.useEffect(()=>{e!=null&&e.Read||window.location.replace("/")},[e]),w("div",{className:"database-edit-container",children:[d("div",{className:"tab-header-container",children:T}),E]})}function Fe(R){return{[_.PLATE]:d(we,{}),[_.PROFILE]:d(_e,{}),[_.EDGE]:d(Ue,{}),[_.ZAGLUSHKI]:d(Oe,{}),[_.DSP_EDGE_ZAGL]:d(Ze,{}),[_.BRUSH]:d(be,{}),[_.TREMPEL]:d(Xe,{}),[_.UPLOTNITEL]:d(Be,{})}[R]||d(Pe,{})}export{ze as default};