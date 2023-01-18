var v=Object.defineProperty;var R=(s,t,e)=>t in s?v(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var p=(s,t,e)=>(R(s,typeof t!="symbol"?t+"":t,e),e);import{d as b,a as _,r as h,b as E,e as $,o as f,c as g,f as d,t as l,u as k,g as w,h as I,F as j,i as q}from"./index-874b30aa.js";const O={baseUrl:"",timeout:5e3},C=s=>{const t=[];return Object.entries(s).forEach(([e,n])=>{const a=encodeURIComponent(e);if(n!=null)switch(typeof n){case"string":case"number":t.push(`${a}=${encodeURIComponent(n)}`);return;case"bigint":t.push(`${a}=${encodeURIComponent(n.toString())}`);return;case"boolean":n===!0&&t.push(a);return;default:throw new TypeError("Invalid query parameter")}}),t.length?`?${t.join("&")}`:""},D=async(s,t={})=>{const e=t.headers||{};t.headers={accept:"application/json",...e};const n=await U(s,t);try{return{data:await n.json(),response:n}}catch(a){throw new m(a,n)}},U=async(s,t={})=>{const{baseUrl:e,headers:n,params:a}={...O,...t};let r;try{const u=t.fetch??fetch,c=a?`${e}${s}${C(a)}`:`${e}${s}`;r=await u(c,{headers:n})}catch(u){throw new m(u,r)}if(!(r!=null&&r.ok))throw new m(new Error("Response not OK"),r);return r};class m extends Error{constructor(e,n){var t=(...args)=>{super(...args);p(this,"error");p(this,"response")};e.name==="TypeError"?(t("Error fetching resource"),this.name="RequestNetworkError"):(t(e.message),this.name="RequestError"),this.error=e,this.response=n}}const y=async(s,t={})=>{const e=await D(s,{baseUrl:"https://environment.data.gov.uk/flood-monitoring",...t});return[e.data.items,e]},S=s=>s.substring(s.lastIndexOf("/")+1),x=async s=>{const[t,e]=await y(`/id/stations/${s}`);return[N(t),e]},N=s=>({id:S(s["@id"])}),B={limit:1e3},F=async(s,t={})=>{const e={...B,...t},{ascending:n,descending:a,since:r,limit:u}=e,c={since:r,_limit:u};(r||n||a)&&(c._sorted=!0);const[o,i]=await y(`/id/stations/${s}/readings`,{params:c});return[T(o,{ascending:n,descending:a}),i]},T=(s,t={})=>{const e=s,n={};e.forEach(({measure:c,dateTime:o,value:i})=>{n[c]=n[c]||[],n[c].push([new Date(o).valueOf(),i])});const a={};Object.entries(n).forEach(([c,o])=>{const i=S(c);a[i]=o});const{ascending:r,descending:u}=t;if(r||u){const c=r?([o],[i])=>o-i:([o],[i])=>i-o;Object.values(a).forEach(o=>{o.sort(c)})}return a},V=b("station",()=>({getStation:async e=>{const[n,a]=await x(e);return[n,a]},getStationReadings:async(e,n={})=>{const[a,r]=await F(e,n);return[a,r]}})),A={key:0},K={key:1},Q=_({__name:"StationPage",setup(s){const t=V(),e=q(),n=h(null),a=h({}),r=E(()=>{const o=e.params.id;return Array.isArray(o)?o[0]:o}),u=h();$(async()=>{const[o,{data:i}]=await t.getStation(r.value);n.value=o,a.value=i});const c=async()=>{const[o]=await t.getStationReadings(r.value,{since:new Date(Date.now()-864e5).toISOString(),ascending:!0});u.value=o};return(o,i)=>(f(),g(j,null,[d("div",null,"Station id "+l(k(r)),1),d("div",null,[d("button",{onClick:c},"Get Readings")]),u.value?(f(),g("div",A,[d("pre",null,l(u.value),1)])):w("",!0),d("pre",null,l(a.value),1),n.value?(f(),g("div",K,[d("h1",null,[I(l(n.value.label)+" ",1),d("small",null,"("+l(n.value.id)+")",1)]),d("pre",null,l(n.value),1)])):w("",!0),d("pre",null,l(a.value),1)],64))}});export{Q as default};
