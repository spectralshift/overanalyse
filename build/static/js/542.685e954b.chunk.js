"use strict";(self.webpackChunkoveranalyse=self.webpackChunkoveranalyse||[]).push([[542],{91542:(e,t,a)=>{a.r(t),a.d(t,{default:()=>h});var r=a(65043),o=a(63336),n=a(85865),s=a(96446),i=a(68903),c=a(64600),l=a(11659),d=a(32143),p=a(24763),u=a(39423),m=a(70579);const h=()=>{const[e,t]=(0,r.useState)(["","",""]),[a,h]=(0,r.useState)(["K","K","K"]),[v,g]=(0,r.useState)(null),b=["Science/sec","Science Saved","Science Needed"],x=(e,t)=>{const a=(0,p.SN)(e,t);g(a)};return(0,m.jsxs)(o.A,{elevation:3,sx:{p:3,maxWidth:600,mx:"auto"},children:[(0,m.jsx)(n.A,{variant:"h4",gutterBottom:!0,children:"CivIdle Science Calculator"}),(0,m.jsx)(s.A,{sx:{mb:3,bgcolor:"background.paper",p:2,borderRadius:1},children:[0,1,2].map((r=>(0,m.jsxs)(i.Ay,{container:!0,spacing:2,alignItems:"center",sx:{mb:2},children:[(0,m.jsx)(i.Ay,{item:!0,xs:12,sm:4,children:(0,m.jsx)(n.A,{variant:"subtitle1",fontWeight:"medium",children:b[r]})}),(0,m.jsx)(i.Ay,{item:!0,xs:8,sm:5,children:(0,m.jsx)(c.A,{type:"number",value:e[r],onChange:o=>((r,o)=>{const n=[...e];n[r]=o,t(n),x(n,a)})(r,o.target.value),variant:"outlined",size:"small",fullWidth:!0,inputProps:{step:"any"}})}),(0,m.jsx)(i.Ay,{item:!0,xs:4,sm:3,children:(0,m.jsx)(l.A,{value:a[r],onChange:t=>((t,r)=>{const o=[...a];o[t]=r,h(o),x(e,o)})(r,t.target.value),variant:"outlined",size:"small",fullWidth:!0,children:["K","M","B","T","Q"].map((e=>(0,m.jsx)(d.A,{value:e,children:e},e)))})})]},r)))}),(0,m.jsx)(s.A,{sx:{bgcolor:"primary.light",p:2,borderRadius:1,color:"primary.contrastText"},children:v&&!v.error?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(n.A,{variant:"h6",gutterBottom:!0,children:"Results"}),(0,m.jsxs)(i.Ay,{container:!0,spacing:2,alignItems:"center",children:[(0,m.jsx)(i.Ay,{item:!0,children:(0,m.jsx)(u.A,{})}),(0,m.jsxs)(i.Ay,{item:!0,xs:!0,children:[(0,m.jsxs)(n.A,{children:["It will take ",(0,m.jsx)(s.A,{component:"span",sx:{color:"#FF4136",fontWeight:"bold"},children:v.ticks})," ticks"]}),(0,m.jsxs)(n.A,{variant:"body2",children:["Time: ",v.timespan]})]})]})]}):(0,m.jsx)(n.A,{color:"error",children:(null===v||void 0===v?void 0:v.error)||"Enter values to calculate"})})]})}},24763:(e,t,a)=>{a.d(t,{vX:()=>n,SN:()=>o,f0:()=>s});const r=JSON.parse('[{"Era":2,"EraTitle":"Bronze Age","EraCost":63750},{"Era":3,"EraTitle":"Iron Age","EraCost":929040},{"Era":4,"EraTitle":"Classical Age","EraCost":9004740},{"Era":5,"EraTitle":"Middle Age","EraCost":184137980},{"Era":6,"EraTitle":"Renaissance","EraCost":1742017980},{"Era":7,"EraTitle":"Industrial","EraCost":33263393350},{"Era":8,"EraTitle":"World Wars","EraCost":941318393350},{"Era":9,"EraTitle":"Cold War","EraCost":14580188393350},{"Era":10,"EraTitle":"Information Age","EraCost":314580188393350}]'),o=(e,t)=>{const a={K:1e3,M:1e6,B:1e9,T:1e12,Q:1e15},[r,o,n]=e.map(((e,r)=>parseFloat(e)*a[t[r]]));if(r<=0||isNaN(o)||isNaN(n))return{error:"Invalid input. Please check your values."};const s=Math.max(0,Math.round((n-o)/r));return{ticks:s,timespan:i(s)}},n=(e,t,a,r)=>{const o=parseFloat(a)*{K:.001,M:1,B:1e3,T:1e6,Q:1e9}[r],n=parseFloat(t),s=[],i=[],c=[];let l=0,d=0;for(let p=0;p<=2e3;p+=25){const e=64*Math.pow(p,3)/o/3600,t=p/(e+n),a=e+n;s.push({x:p,y:t}),i.push({x:p,y:a}),p%200===0&&c.push({x:p,evPerSecondInMillions:o,baseCalculation:e,y1:t,y2:a}),p>0&&t<d&&0===l&&(l=p),d=t}if(l>0){d=0;for(let e=l-25;e<l+25;e++){const t=e/(64*Math.pow(e,3)/o/3600+n);if(t<d){l=e-1;break}d=t}}return{lineChart1Data:s,lineChart2Data:i,integerValue:l,debugData:c,inputValues:{currentGP:e,setupTime:t,evPerSecond:a,evUnit:r}}},s=e=>r.slice(0,20).map((t=>{const a=Math.ceil(t.EraCost/e);return{...t,TimeToReach:i(a)}})),i=e=>{const t=Math.floor(e/86400),a=Math.floor(e%86400/3600),r=Math.floor(e%3600/60),o=e%60,n=[];return t>0&&n.push("".concat(t,"d")),a>0&&n.push("".concat(a,"h")),r>0&&n.push("".concat(r,"m")),(o>0||0===n.length)&&n.push("".concat(o,"s")),n.join(" ")}},32143:(e,t,a)=>{a.d(t,{A:()=>T});var r=a(98587),o=a(58168),n=a(65043),s=a(58387),i=a(68606),c=a(67266),l=a(34535),d=a(61475),p=a(98206),u=a(51347),m=a(75429),h=a(55013),v=a(95849),g=a(5658),b=a(71424),x=a(28052),y=a(57056),A=a(32400);function f(e){return(0,A.Ay)("MuiMenuItem",e)}const C=(0,y.A)("MuiMenuItem",["root","focusVisible","dense","disabled","divider","gutters","selected"]);var E=a(70579);const j=["autoFocus","component","dense","divider","disableGutters","focusVisibleClassName","role","tabIndex","className"],M=(0,l.Ay)(m.A,{shouldForwardProp:e=>(0,d.A)(e)||"classes"===e,name:"MuiMenuItem",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,a.dense&&t.dense,a.divider&&t.divider,!a.disableGutters&&t.gutters]}})((e=>{let{theme:t,ownerState:a}=e;return(0,o.A)({},t.typography.body1,{display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",whiteSpace:"nowrap"},!a.disableGutters&&{paddingLeft:16,paddingRight:16},a.divider&&{borderBottom:"1px solid ".concat((t.vars||t).palette.divider),backgroundClip:"padding-box"},{"&:hover":{textDecoration:"none",backgroundColor:(t.vars||t).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}},["&.".concat(C.selected)]:{backgroundColor:t.vars?"rgba(".concat(t.vars.palette.primary.mainChannel," / ").concat(t.vars.palette.action.selectedOpacity,")"):(0,c.X4)(t.palette.primary.main,t.palette.action.selectedOpacity),["&.".concat(C.focusVisible)]:{backgroundColor:t.vars?"rgba(".concat(t.vars.palette.primary.mainChannel," / calc(").concat(t.vars.palette.action.selectedOpacity," + ").concat(t.vars.palette.action.focusOpacity,"))"):(0,c.X4)(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.focusOpacity)}},["&.".concat(C.selected,":hover")]:{backgroundColor:t.vars?"rgba(".concat(t.vars.palette.primary.mainChannel," / calc(").concat(t.vars.palette.action.selectedOpacity," + ").concat(t.vars.palette.action.hoverOpacity,"))"):(0,c.X4)(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:t.vars?"rgba(".concat(t.vars.palette.primary.mainChannel," / ").concat(t.vars.palette.action.selectedOpacity,")"):(0,c.X4)(t.palette.primary.main,t.palette.action.selectedOpacity)}},["&.".concat(C.focusVisible)]:{backgroundColor:(t.vars||t).palette.action.focus},["&.".concat(C.disabled)]:{opacity:(t.vars||t).palette.action.disabledOpacity},["& + .".concat(g.A.root)]:{marginTop:t.spacing(1),marginBottom:t.spacing(1)},["& + .".concat(g.A.inset)]:{marginLeft:52},["& .".concat(x.A.root)]:{marginTop:0,marginBottom:0},["& .".concat(x.A.inset)]:{paddingLeft:36},["& .".concat(b.A.root)]:{minWidth:36}},!a.dense&&{[t.breakpoints.up("sm")]:{minHeight:"auto"}},a.dense&&(0,o.A)({minHeight:32,paddingTop:4,paddingBottom:4},t.typography.body2,{["& .".concat(b.A.root," svg")]:{fontSize:"1.25rem"}}))})),T=n.forwardRef((function(e,t){const a=(0,p.b)({props:e,name:"MuiMenuItem"}),{autoFocus:c=!1,component:l="li",dense:d=!1,divider:m=!1,disableGutters:g=!1,focusVisibleClassName:b,role:x="menuitem",tabIndex:y,className:A}=a,C=(0,r.A)(a,j),T=n.useContext(u.A),k=n.useMemo((()=>({dense:d||T.dense||!1,disableGutters:g})),[T.dense,d,g]),S=n.useRef(null);(0,h.A)((()=>{c&&S.current&&S.current.focus()}),[c]);const I=(0,o.A)({},a,{dense:k.dense,divider:m,disableGutters:g}),N=(e=>{const{disabled:t,dense:a,divider:r,disableGutters:n,selected:s,classes:c}=e,l={root:["root",a&&"dense",t&&"disabled",!n&&"gutters",r&&"divider",s&&"selected"]},d=(0,i.A)(l,f,c);return(0,o.A)({},c,d)})(a),O=(0,v.A)(S,t);let w;return a.disabled||(w=void 0!==y?y:-1),(0,E.jsx)(u.A.Provider,{value:k,children:(0,E.jsx)(M,(0,o.A)({ref:O,role:x,tabIndex:w,component:l,focusVisibleClassName:(0,s.A)(N.focusVisible,b),className:(0,s.A)(N.root,A)},C,{ownerState:I,classes:N}))})}))}}]);
//# sourceMappingURL=542.685e954b.chunk.js.map