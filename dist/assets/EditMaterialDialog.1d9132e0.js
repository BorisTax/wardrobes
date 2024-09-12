import{u as D,R as v,r as m,F as b,a as S,M as G,b as K,c as z,m as p,I as x,j as N,E as _,d as o,C as k,e as V,g as q,T as U,f as O,h as J,i as P,k as X,l as Q,n as Y,o as $,P as ee,p as te,q as H,s as se,t as ae,v as ne,w as j,x as oe,y as ue,z as de,A as W,B as ce,D as ie,G as re,H as le,J as me,K as Ee,L as pe,N as Ae,O as ge,Q as Te,S as De,U as Se,V as Ie,W as fe,X as xe,Y as Re,Z as w,_ as Le,$ as Ce}from"./index.ffc4f207.js";function ye(){const{permissions:R}=D(P),e=R.get(v.MATERIALS),c=D(X),[{baseMaterial:n,extMaterialIndex:I},r]=m.exports.useState({baseMaterial:b.DSP,extMaterialIndex:0}),i=S(Q),g=S(Y),L=S($),C=m.exports.useMemo(()=>(c.filter(t=>t.material===n)||[{name:"",material:""}]).toSorted((t,a)=>t.name>a.name?1:-1),[c,n]),E=C[I]||{name:"",code:"",image:"",material:b.DSP,purpose:G.BOTH},y=K(E.material,E.name),f=(E==null?void 0:E.material)===b.DSP,T=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434","\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"],u=C.map(t=>[t.name,t.code,z.get(t.purpose)||""]),s=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:E.name||"",message:p.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:E.code,message:p.ENTER_CODE,type:x.TEXT},{caption:"\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435:",value:E.purpose||"",valueCaption:t=>z.get(t)||"",list:z,message:p.ENTER_PURPOSE,type:x.LIST,readonly:!f},{caption:"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435:",value:y||"",message:p.ENTER_IMAGE,type:x.FILE}];return N(_,{children:[N("div",{children:[o("div",{className:"d-flex flex-nowrap gap-2 align-items-start",children:o(k,{title:"\u041C\u0430\u0442\u0435\u0440\u0438\u0430\u043B: ",value:n,items:V,onChange:(t,a)=>{r(l=>({...l,baseMaterial:q(a),extMaterialIndex:0}))}})}),o("hr",{}),o(U,{heads:T,content:u,onSelectRow:t=>{r(a=>({...a,extMaterialIndex:t}))}})]}),e!=null&&e.Read?o(O,{name:E.name,items:s,onUpdate:e!=null&&e.Update?async(t,a)=>{const l=t[0]?a[0]:"",M=t[1]?a[1]:"",h=t[2]?a[2]:G.FASAD,d=t[3]?a[3]:"";return await L({name:E.name,material:n,newName:l,newCode:M,image:d,purpose:h})}:void 0,onDelete:e!=null&&e.Delete?async()=>{const t=await i(E);return r(a=>({...a,extMaterialIndex:0})),t}:void 0,onAdd:e!=null&&e.Create?async(t,a)=>{const l=a[0],M=a[1],h=a[2],d=a[3];return J(l,n,c)?{success:!1,message:p.MATERIAL_EXIST}:await g({name:l,material:n,code:M,image:"",purpose:h},d)}:void 0}):o("div",{})]})}function Me(){const{permissions:R}=D(P),e=R.get(v.MATERIALS),c=D(te),[{type:n,profileIndex:I},r]=m.exports.useState({type:c[0].type,profileIndex:0}),i=c.filter(t=>t.type===n),g=D(H),L=m.exports.useMemo(()=>g.map(t=>t.name).toSorted(),[g]);m.exports.useMemo(()=>{r({type:c[0].type,profileIndex:0})},[c]);const C=S(se),E=S(ae),y=S(ne),f=i[I],T=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434","\u0429\u0435\u0442\u043A\u0430"],u=i.map(t=>[t.name,t.code,t.brush]),s=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:f.name,message:p.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:f.code,message:p.ENTER_CODE,type:x.TEXT},{caption:"\u0429\u0435\u0442\u043A\u0430:",value:f.brush,list:L,message:p.ENTER_BRUSH,type:x.LIST}];return N(_,{children:[N("div",{children:[o("div",{className:"d-flex flex-nowrap gap-2 align-items-start",children:o(k,{title:"\u0422\u0438\u043F: ",value:n||"",items:ee,onChange:(t,a)=>{r({type:a,profileIndex:0})}})}),o("hr",{}),o(U,{heads:T,content:u,onSelectRow:t=>{r(a=>({...a,profileIndex:t}))}})]}),e!=null&&e.Read?o(O,{name:f.name,items:s,onUpdate:e!=null&&e.Update?async(t,a)=>{const l=t[0]?a[0]:"",M=t[1]?a[1]:"",h=t[2]?a[2]:"";return await y({name,type:n,newName:l,newCode:M,newBrush:h})}:void 0,onDelete:e!=null&&e.Delete?async()=>{const t=await C(f);return r(a=>({...a,profileIndex:0})),t}:void 0,onAdd:e!=null&&e.Create?async(t,a)=>{const l=a[0],M=a[1],h=a[2];return i.find(A=>A.name===l&&A.type===n)?{success:!1,message:p.MATERIAL_EXIST}:await E({name:l,type:n,code:M,brush:h})}:void 0}):o("div",{})]})}function he(){const{permissions:R}=D(P),e=R.get(v.MATERIALS),c=D(j),n=m.exports.useMemo(()=>c.toSorted((s,t)=>(s==null?void 0:s.name)>(t==null?void 0:t.name)?1:-1),[c]),I=D(X);m.exports.useMemo(()=>I.filter(s=>s.material===b.DSP).map(s=>s.name),[I]);const[r,i]=m.exports.useState(0),{name:g,code:L}=n[r]||{name:"",dsp:"",code:""},C=S(oe),E=S(ue),y=S(de),f=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434"],T=n.map(s=>[s.name,s.code]),u=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:g||"",message:p.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:L,message:p.ENTER_CODE,type:x.TEXT}];return N(_,{children:[o(U,{heads:f,content:T,onSelectRow:s=>{i(s)}}),e!=null&&e.Read?o(O,{name:g,items:u,onUpdate:e!=null&&e.Update?async(s,t)=>{const a=s[0]?t[0]:"",l=s[1]?t[1]:"",M=s[2]?t[2]:"";return await y({name:n[r].name,newName:a,code:l,dsp:M})}:void 0,onDelete:e!=null&&e.Delete?async s=>{const t=n.findIndex(l=>l.name===s),a=await C(n[t]);return i(0),a}:void 0,onAdd:e!=null&&e.Create?async(s,t)=>{const a=t[0],l=t[1];return n.find(h=>h.name===a)?{success:!1,message:p.MATERIAL_EXIST}:await E({name:a,code:l})}:void 0}):o("div",{})]})}function Ne(){const{permissions:R}=D(P),e=R.get(v.MATERIALS),c=D(W),n=m.exports.useMemo(()=>c.toSorted((s,t)=>s.name>t.name?1:-1),[c]),I=D(X),[r,i]=m.exports.useState(0);m.exports.useMemo(()=>I.filter(s=>s.material===b.DSP).map(s=>s.name),[I]);const{name:g,code:L}=n[r]||{name:"",code:""},C=S(ce),E=S(ie),y=S(re),f=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434"],T=n.map(s=>[s.name,s.code]),u=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:g||"",message:p.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:L,message:p.ENTER_CODE,type:x.TEXT}];return m.exports.useEffect(()=>{i(0)},[n]),N(_,{children:[o(U,{heads:f,content:T,onSelectRow:s=>{i(s)}}),e!=null&&e.Read?o(O,{name:g,items:u,onUpdate:e!=null&&e.Update?async(s,t)=>{const a=s[0]?t[0]:"",l=s[1]?t[1]:"";return await y({name:g,newName:a,code:l})}:void 0,onDelete:e!=null&&e.Delete?async()=>{const s=await C(n[r]);return i(0),s}:void 0,onAdd:e!=null&&e.Create?async(s,t)=>{const a=t[0],l=t[1];return n.find(h=>h.name===a)?{success:!1,message:p.MATERIAL_EXIST}:await E({name:a,code:l})}:void 0}):o("div",{})]})}function we(){const{permissions:R}=D(P),e=R.get(v.MATERIALS),c=D(H),n=m.exports.useMemo(()=>c.toSorted((u,s)=>u.name>s.name?1:-1),[c]),[I,r]=m.exports.useState(0),{name:i,code:g}=n[I]||{name:"",code:""},L=S(le),C=S(me),E=S(Ee),y=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434"],f=n.map(u=>[u.name,u.code]),T=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:i,message:p.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:g,message:p.ENTER_CODE,type:x.TEXT}];return m.exports.useEffect(()=>{r(0)},[n]),N(_,{children:[o(U,{heads:y,content:f,onSelectRow:u=>{r(u)}}),e!=null&&e.Read?o(O,{name:i,items:T,onUpdate:e!=null&&e.Update?async(u,s)=>{const t=u[0]?s[0]:"",a=u[1]?s[1]:"";return await E({name:i,newName:t,code:a})}:void 0,onDelete:e!=null&&e.Delete?async u=>{const s=n.findIndex(a=>a.name===u),t=await L(n[s]);return r(0),t}:void 0,onAdd:e!=null&&e.Create?async(u,s)=>{const t=s[0],a=s[1];return n.find(M=>M.name===t)?{success:!1,message:p.MATERIAL_EXIST}:await C({name:t,code:a})}:void 0}):o("div",{})]})}function ve(){const{permissions:R}=D(P),e=R.get(v.MATERIALS),c=D(pe),n=m.exports.useMemo(()=>c.toSorted((T,u)=>T.caption>u.caption?1:-1),[c]),[I,r]=m.exports.useState(0),{name:i,caption:g,code:L}=n[I]||{name:"",caption:"",code:""},C=S(Ae),E=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434"],y=n.map(T=>[T.caption,T.code]),f=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:g,message:p.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:L,message:p.ENTER_CODE,type:x.TEXT}];return m.exports.useEffect(()=>{r(0)},[c]),N(_,{children:[o(U,{heads:E,content:y,onSelectRow:T=>{r(T)}}),e!=null&&e.Read?o(O,{name:i,items:f,onUpdate:e!=null&&e.Update?async(T,u)=>{const s=T[0]?u[0]:"",t=T[1]?u[1]:"";return await C({name:i,caption:s,code:t})}:void 0}):o("div",{})]})}function Pe(){const{permissions:R}=D(P),e=R.get(v.MATERIALS),c=D(ge),n=m.exports.useMemo(()=>c.toSorted((u,s)=>u.name>s.name?1:-1),[c]),[I,r]=m.exports.useState(0),{name:i,code:g}=n[I]||{name:"",code:""},L=S(Te),C=S(De),E=S(Se),y=["\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435","\u041A\u043E\u0434"],f=n.map(u=>[u.name,u.code]),T=[{caption:"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435:",value:i||"",message:p.ENTER_CAPTION,type:x.TEXT},{caption:"\u041A\u043E\u0434:",value:g,message:p.ENTER_CODE,type:x.TEXT}];return m.exports.useEffect(()=>{r(0)},[c]),N(_,{children:[o(U,{heads:y,content:f,onSelectRow:u=>{r(u)}}),e!=null&&e.Read?o(O,{name:i,items:T,onUpdate:e!=null&&e.Update?async(u,s)=>{const t=u[0]?s[1]:"",a=u[1]?s[2]:"";return await E({name:i,code:t,caption:a})}:void 0,onDelete:e!=null&&e.Delete?async()=>{const u=await L(n[I]);return r(0),u}:void 0,onAdd:async(u,s)=>{const t=s[0];return n.find(l=>l.name===i)?{success:!1,message:p.MATERIAL_EXIST}:await C({name:i,code:t})}}):o("div",{})]})}function _e(){const{permissions:R}=D(P),e=R.get(v.MATERIALS),c=D(j),n=D(W),I=D(Ie),r=m.exports.useMemo(()=>c.toSorted((d,A)=>(d==null?void 0:d.name)>(A==null?void 0:A.name)?1:-1).map(d=>d.name),[c]),i=m.exports.useMemo(()=>n.toSorted((d,A)=>(d==null?void 0:d.name)>(A==null?void 0:A.name)?1:-1).map(d=>d.name),[n]),g=m.exports.useMemo(()=>I.toSorted((d,A)=>(d==null?void 0:d.name)>(A==null?void 0:A.name)?1:-1),[I]),L=D(X),C=m.exports.useMemo(()=>L.filter(d=>d.material===b.DSP).map(d=>d.name),[L]),[E,y]=m.exports.useState(0),{name:f,edge:T,zaglushka:u}=g[E]||{name:"",edge:"",zaglushka:""},s=S(fe),t=S(xe),a=S(Re),l=["\u0414\u0421\u041F","\u041A\u0440\u043E\u043C\u043A\u0430","\u0417\u0430\u0433\u043B\u0443\u0448\u043A\u0430"],M=g.map(d=>[d.name,d.edge,d.zaglushka]),h=[{caption:"\u0414\u0421\u041F:",value:f||"",message:p.ENTER_CAPTION,type:x.LIST,list:C},{caption:"\u041A\u0440\u043E\u043C\u043A\u0430:",value:T,message:p.ENTER_CODE,type:x.LIST,list:r,listWithoutEmptyRow:!0},{caption:"\u0417\u0430\u0433\u043B\u0443\u0448\u043A\u0430:",value:u,message:p.ENTER_CODE,type:x.LIST,list:i,listWithoutEmptyRow:!0}];return N(_,{children:[o(U,{heads:l,content:M,onSelectRow:d=>{y(d)}}),e!=null&&e.Read?o(O,{name:f,items:h,onUpdate:e!=null&&e.Update?async(d,A)=>{const B=d[1]?A[1]:"",Z=d[2]?A[2]:"";return await a({name:g[E].name,edge:B,zaglushka:Z})}:void 0,onAdd:e!=null&&e.Create?async(d,A)=>{const B=d[0]?A[0]:"",Z=d[1]?A[1]:"",F=d[2]?A[2]:"";return await t({name:B,edge:Z,zaglushka:F})}:void 0,onDelete:e!=null&&e.Delete?async d=>{const A=await s(g[E]);return y(0),A}:void 0}):o("div",{})]})}function Xe(){const{permissions:R}=D(P),e=R.get(v.MATERIALS),[c,n]=m.exports.useState(w.PLATE),I=[...Le.entries()].map((i,g)=>o("div",{className:c===i[0]?"tab-button-active":"tab-button-inactive",onClick:()=>{n(i[0])},role:"button",children:i[1]},g)),r=Ue(c);return m.exports.useEffect(()=>{e!=null&&e.Read||window.location.replace("/")},[e]),N("div",{className:"database-edit-container",children:[o("div",{className:"tab-header-container",children:I}),r]})}function Ue(R){return{[w.PLATE]:o(ye,{}),[w.PROFILE]:o(Me,{}),[w.EDGE]:o(he,{}),[w.ZAGLUSHKI]:o(Ne,{}),[w.DSP_EDGE_ZAGL]:o(_e,{}),[w.BRUSH]:o(we,{}),[w.TREMPEL]:o(ve,{}),[w.UPLOTNITEL]:o(Pe,{})}[R]||o(Ce,{})}export{Xe as default};
