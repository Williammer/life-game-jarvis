import {TASKS,task} from './model.js';

const makeTask=(id,name,module,minutes,standard)=>({id,name,module,minutes,standard,energy:2,xp:30,contribution:2,weight:3,outcome:standard,gap:standard,kind:'build'});
const register=t=>{const index=TASKS.findIndex(x=>x.id===t.id);if(index<0)TASKS.push(t);else TASKS[index]=t;};
const metric=(id,name,value,target,unit,weight=1,taskId=null)=>({id,name,value,target,unit,weight,taskId,evidence:'虚拟背景样例',updated:'2026-09-30'});
const road=(id,window,title,standard,taskIds=[])=>({id,window,title,standard,taskIds});
export const REFERENCES={
 running:[
  {id:'kipchoge',name:'Eliud Kipchoge',subtitle:'柏林马拉松 · 2022',source:'https://worldathletics.org/news/report/eliud-kipchoge-world-record-berlin-marathon-2022',kind:'numeric',metricId:'marathon',target:7269,unit:'秒',claim:'官方成绩 2:01:09。远期参照，不是训练处方。'},
  {id:'gary',name:'Gary',subtitle:'NHS 跑步故事',source:'https://www.nhs.uk/better-health/get-active/get-running-with-couch-to-5k/',kind:'numeric',metricId:'consistency',target:3,unit:'次/周',claim:'68 岁开始跑步，72 岁自述每周三次。仅比较频率，不推断配速或健康水平。'},
  {id:'bolt',name:'Usain Bolt',subtitle:'男子 100 米 · 柏林 2009',source:'https://worldathletics.org/records/by-discipline/sprints/100-metres/outdoor/men',kind:'numeric',metricId:'sprint100',target:9.58,unit:'秒',claim:'百米世界纪录 9.58 秒。仅比较同距离计时表现；马拉松成绩不能推算百米水平。'}
 ],
 agent:[
  {id:'calendar',name:'BuilderIO · Calendar',subtitle:'Agent Native 官方应用',source:'https://github.com/BuilderIO/agent-native/tree/d2b14cfeaa041fa1d8726ad272b7e71ad824f3c6/templates/calendar',kind:'checklist',claim:'作品参照：日历草案、选择上下文、可操作成果。下方四项是 Jarvis 的实践验收清单，非官方评分。'},
  {id:'tasks',name:'BuilderIO · Tasks',subtitle:'Agent Native 官方应用',source:'https://github.com/BuilderIO/agent-native/tree/d2b14cfeaa041fa1d8726ad272b7e71ad824f3c6/templates/tasks',kind:'checklist',claim:'作品参照：任务路线建议与就地操作。四项验收清单由 Jarvis 演示定义；不表示已掌握整个仓库。'}
 ],
 parenting:[]
};
export function newModules(){
 [makeTask('agent-action','做一个需确认的 Agent action','Agent 实践',40,'保留原数据；提案可见；确认后一次写入'),makeTask('agent-eval','给 Agent 补三条失败用例','Agent 实践',30,'覆盖参数错误、用户拒绝和重试，不重复写入'),makeTask('agent-pilot','跑通一次可回放的 Agent 流程','Agent 实践',30,'留下输入、工具结果、确认记录与下一步')].forEach(register);
 return [
  {id:'running',name:'跑步与恢复',goal:'建立可持续训练节奏，逐步改善耐力',status:'active',priority:'优先',revision:0,updated:'2026-09-30',metrics:[metric('consistency','规律活动',2,3,'次/周',2),metric('recovery','恢复观察',3,4,'次/周',1),{...metric('marathon','马拉松成绩',14400,13500,'秒',1),start:16200},{...metric('sprint100','100米成绩',null,15,'秒',1),start:20,timeFormat:'seconds',evidence:'尚未提供百米同口径计时；不能从耐力成绩推断'}],taskIds:['recover','run'],fatigueTaskId:'recover',defaultTaskId:'run',roadmap:[road('near','未来 2 周','先稳定训练与恢复节奏','有活动与恢复记录，按身体反馈调整',['recover','run']),road('mid','1–3 个月','完成一个适合自己的训练周期','对照负荷、恢复与同口径测试，不承诺固定提升'),road('long','3–12 个月','逐步缩小同距离成绩差距','用新的比赛或测试数据复评阶段目标')],benchmark:structuredClone(REFERENCES.running[0]),messages:[],proposal:null,history:[]},
  {id:'agent',name:'Agent 实践',goal:'做出一个能可靠执行、可验证的个人 Agent',status:'active',priority:'优先',revision:0,updated:'2026-09-30',metrics:[metric('schema','工具契约',1,1,'项'),metric('approval','受控写入',0,1,'项',1,'agent-action'),metric('evaluation','失败用例',0,1,'项',1,'agent-eval'),metric('trace','可回放流程',0,1,'项',1,'agent-pilot')],taskIds:['agent-action','agent-eval','agent-pilot'],defaultTaskId:'agent-action',roadmap:[road('near','未来 2 周','把一个 action 做扎实','提案 → 确认 → 幂等写入；留下可运行产物',['agent-action']),road('mid','1–3 个月','让失败也有可验证的行为','完成失败用例与可回放的单 Agent 流程',['agent-eval','agent-pilot']),road('long','3–12 个月','独立交付一个能长期使用的 Agent 应用','真实试用、复盘、维护与可解释的迭代记录')],benchmark:structuredClone(REFERENCES.agent[0]),messages:[],proposal:null,history:[]},
  {id:'parenting',name:'陪伴与育儿',goal:'把可控的专注陪伴变成稳定习惯',status:'active',priority:'轻量',revision:0,updated:null,metrics:[{...metric('attention','专注陪伴记录',null,3,'次/周'),evidence:'尚未提供个人背景',updated:null}],taskIds:['family'],defaultTaskId:'family',roadmap:[road('near','未来 2 周','留下陪伴与观察的基线','记录自己的投入，不评价孩子是否听话',['family']),road('mid','1–3 个月','找到适合家庭的固定节奏','与家人讨论并回顾安排是否合适'),road('long','3–12 个月','持续调整陪伴方式','按家庭阶段重新确认目标，不做人格打分')],benchmark:null,messages:[],proposal:null,history:[]}
 ];
}
export function values(module,day){return module.metrics.map(m=>{const r=day.core.records[m.taskId];return {...m,value:r?.status==='done'&&r.proof==='checked'&&r.masteryEligible!==false?m.target:m.value,fromRecord:r?.status==='done'&&r.proof==='checked'&&r.masteryEligible!==false,evidence:r?.status==='done'&&r.proof==='checked'&&r.masteryEligible!==false?r.evidence:m.evidence};});}
export function score(module,day){const list=values(module,day);const known=list.filter(m=>m.value!==null);const total=list.reduce((n,m)=>n+m.weight,0);const weight=known.reduce((n,m)=>n+m.weight,0);const ratio=m=>Math.max(0,Math.min(1,m.start===undefined?m.value/m.target:(m.start-m.value)/(m.start-m.target)));return {value:weight?Math.round(100*known.reduce((n,m)=>n+ratio(m)*m.weight,0)/weight):null,coverage:total?Math.round(100*weight/total):0,known:known.length,count:list.length,metrics:list.map(m=>({...m,percent:m.value===null?null:Math.round(ratio(m)*100)}))};}
export const formatValue=(v,unit)=>v===null?'未知':unit==='秒'&&v<60?`${Number(v.toFixed(2))} 秒`:unit==='秒'?`${Math.floor(v/3600)}:${String(Math.floor(v%3600/60)).padStart(2,'0')}:${String(v%60).padStart(2,'0')}`:`${v} ${unit}`;
export function gap(module,day,reference=module.benchmark){if(!reference)return {headline:'待选择榜样',current:'尚无可比参照',target:'与 Jarvis 讨论适合你的对象',ratio:null};if(reference.kind==='checklist'){const metrics=values(module,day),done=metrics.filter(m=>m.value!==null&&m.value>=m.target).length;return {headline:`还差 ${metrics.length-done} 项实践证据`,current:`已有 ${done} / ${metrics.length} 项`,target:'逐项补齐作品清单',ratio:metrics.length?done/metrics.length:null};}if(reference.kind==='numeric'){const m=values(module,day).find(m=>m.id===reference.metricId);if(!m||m.value===null)return {headline:'缺少同口径个人数据',current:'未知',target:formatValue(reference.target,reference.unit),ratio:null};const delta=Math.round(Math.abs(m.value-reference.target)*100)/100;const reached=m.start===undefined?m.value>=reference.target:m.value<=reference.target;return {headline:reached?'已达到此项参照':`差 ${formatValue(delta,reference.unit)}`,current:formatValue(m.value,m.unit),target:formatValue(reference.target,reference.unit),ratio:m.start===undefined?Math.min(1,m.value/reference.target):Math.min(1,reference.target/m.value)};}return {headline:'可比指标待讨论',current:'保留现状数据',target:'来源与验收口径尚待核查',ratio:null};}
export const ASSESSMENT_MODES={numeric:'数量 / 分数',cultivation:'凡人修炼境界'};
// These thresholds are Jarvis's game mapping, borrowing the names, not a scale from the novel.
export const CULTIVATION=[['炼气',0],['筑基',1],['结丹',2],['元婴',3],['化神',4],['炼虚',5],['合体',6],['大乘',7],['渡劫',8]];
export function assessmentLevel(value,mode='numeric'){
 if(!Object.hasOwn(ASSESSMENT_MODES,mode))throw Error('请选择可用的评估模式。');
 if(value===null||!Number.isFinite(value))return {score:null,label:'待评估',rank:'待评估',index:null,next:null};
 const points=Math.round(Math.max(0,Math.min(10,value))*10)/10,rounded=points;
 if(mode==='numeric'){const rank=points>=10?'参照达成':points>=8?'精通':points>=6?'熟练':points>=4?'进阶':points>=2?'入门':'起步';return {score:rounded,label:`${rounded.toFixed(1)} / 10 分`,rank,index:Math.min(5,Math.floor(points/2)),next:points>=10?null:Math.min(10,(Math.floor(points/2)+1)*2)};}
 const index=CULTIVATION.findLastIndex(([,floor])=>points>=floor),[name,floor]=CULTIVATION[index],next=CULTIVATION[index+1]?.[1]??10,progress=(points-floor)/(next-floor);
 const stage=points===10?'圆满':progress<1/3?'初期':progress<2/3?'中期':'后期';
 return {score:rounded,label:`${name} · ${stage}`,rank:name,index,next:points===10?null:next};
}
export function assessment(m,day,reference=m.benchmark){
 const mode=m.assessmentMode||'numeric',metrics=values(m,day),domain=score(m,day);let own=null,referenceScore=null,basis='先确认榜样与可比口径。',coverage=0,evidence=[];
 if(reference?.kind==='numeric'){
  const x=metrics.find(x=>x.id===reference.metricId),lower=x?.unit==='秒';
  if(x&&Number.isFinite(reference.target)&&reference.target>0){referenceScore=10;evidence=[`${x.name}：${formatValue(x.value,x.unit)}；${x.evidence}`];
   if(Number.isFinite(x.value)&&(lower?x.value>0:x.value>=0))own=10*(lower?reference.target/x.value:x.value/reference.target);coverage=own===null?0:100;
   basis=`仅比较「${x.name}」。榜样 ${formatValue(reference.target,reference.unit)} 定为 10 分；${lower?'个人分数 = 10 × 榜样用时 / 个人用时':'个人分数 = 10 × 个人数量 / 榜样数量'}，展示上限 10。这是相对表现量表，不是总体能力比例。`;
  }else basis='缺少与榜样同口径的指标定义或可信目标，暂不映射分数。';
 }else if(reference?.kind==='checklist'){
  referenceScore=10;coverage=domain.coverage;const known=metrics.filter(x=>x.value!==null),complete=known.filter(x=>x.value>=x.target).length;
  own=known.length===metrics.length?10*complete/metrics.length:null;
  basis=`以 ${metrics.length} 项约定作品证据为清单参照；逐项达标后才计入比较。榜样清单目标映射为 10 分，不代表官方评分或作者总体水平。缺项未知时，双方差距暂不定级。`;
  evidence=metrics.map(x=>`${x.name}：${x.value===null?'未知':x.value>=x.target?'已有证据':'尚未达标'}；${x.evidence}`);
 }else if(reference)basis='自选榜样的来源与可比标准待核查，双方暂不定分或境界。';
 const self=assessmentLevel(own,mode),roleModel=assessmentLevel(referenceScore,mode),field=assessmentLevel(domain.value===null?null:domain.value/10,mode);
 const distance=self.score===null||roleModel.score===null?null:Math.round((roleModel.score-self.score)*10)/10;
 const headline=distance===null?'差距待评估':mode==='numeric'?`相差 ${distance.toFixed(1)} 分`:distance===0?'达到此项参照境界':self.index===roleModel.index?`同为${self.rank} · 相差 ${distance.toFixed(1)} 分`:`距榜样 ${roleModel.index-self.index} 个境界 · ${distance.toFixed(1)} 分`;
 return {mode,self,roleModel,field,headline,distance,coverage,basis,evidence,domainCoverage:domain.coverage,referenceName:reference?.name||'未设置榜样'};
}
export function moduleXP(m,day){return m.taskIds.reduce((sum,id)=>sum+(day.core.records[id]?.xp||0),0);}
export function routes(modules,day){return modules.filter(m=>m.status==='active').map(m=>{const metrics=day?values(m,day):[];const taskIds=m.id==='agent'&&day?m.taskIds.filter(id=>{const i=metrics.findIndex(x=>x.taskId===id);return i<0||metrics.slice(0,i).every(x=>x.value!==null&&x.value>=x.target);}):m.taskIds;const unmet=metrics.find(x=>x.taskId&&!(x.value!==null&&x.value>=x.target));return {id:m.id,taskIds,defaultTaskId:unmet?.taskId||m.defaultTaskId,fatigueTaskId:m.fatigueTaskId};});}
export function newModule(text){const [name,...rest]=String(text).trim().split(/[：:]/);if(!name.trim()||name.length>24)throw Error('模块名称请使用 1–24 个字，例如“英语口语：能完成一次工作交流”。');if(!rest.join(':').trim())throw Error('补一句想达到什么，例如“英语口语：能完成一次工作交流”。');const id=crypto.randomUUID(),tid=`${id}-baseline`,goal=rest.join(':').trim().slice(0,180);register(makeTask(tid,`梳理${name}的现状与第一步`,name,20,'留下当前水平、一个阶段产物和可核验的标准'));return {id,name:name.trim(),goal,status:'active',priority:'常规',revision:0,updated:null,metrics:[{...metric('outcome','阶段产物',null,1,'份'),evidence:'尚未确认验收口径',updated:null}],taskIds:[tid],defaultTaskId:tid,roadmap:[road('near','未来 2 周','确认基线与一个小成果','先收集背景，再确定适合自己的挑战',[tid]),road('mid','1–3 个月','根据首轮结果确定阶段目标','待与 Jarvis 讨论，不假设提升速度'),road('long','3–12 个月','确定值得长期投入的方向','待确认目标和可比参照')],benchmark:null,messages:[],proposal:null,history:[]};}
export function proposeModule(m,patch,reason){return {...m,proposal:{baseRevision:m.revision,patch,reason}};}
export function confirmModule(m){if(!m.proposal)throw Error('还没有待确认变更');if(m.proposal.baseRevision!==m.revision)throw Error('模块已更新，请重新讨论这份提案');const {patch,reason}=m.proposal;return {...m,...structuredClone(patch),revision:m.revision+1,proposal:null,history:[{revision:m.revision+1,reason},...m.history].slice(0,8)};}
export function discuss(m,text){const next=structuredClone(m);next.messages.push({role:'user',text});let reply='';const ref=(REFERENCES[m.id]||[]).find(r=>text.toLowerCase().includes(r.name.toLowerCase())||text.toLowerCase().includes(r.id));const goal=text.match(/(?:目标改为|目标是)[：:\s]*(.+)/);const stage=text.match(/(近期|中期|长期)(?:计划)?改为[：:\s]*(.+)/);const rename=text.match(/(?:重命名为|名称改为)[：:\s]*(.+)/);
 if(ref){next.proposal={baseRevision:m.revision,patch:{benchmark:structuredClone(ref)},reason:`改用 ${ref.name} 作参照`};reply=`我整理了 ${ref.name} 的来源与可比范围。确认后只更新参照与差距，现状分、日历和已有证据保留。路线中的近期/中期验收仍以你自己的目标为准。`;}
 else if(goal){next.proposal={baseRevision:m.revision,patch:{goal:goal[1].slice(0,180)},reason:'更新模块目标'};reply='目标已整理为提案。现有评分口径和任务先保留；目标变化后，可以继续讨论各阶段的验收标准。';}
 else if(stage){const key={近期:'near',中期:'mid',长期:'long'}[stage[1]];next.proposal={baseRevision:m.revision,patch:{roadmap:m.roadmap.map(r=>r.id===key?{...r,title:stage[2].slice(0,160)}:r)},reason:`调整${stage[1]}计划`};reply='已生成路线文字调整提案；时长是规划窗口，已有任务与验收标准保留。确认后进入总览。';}
 else if(rename){const name=rename[1].trim();if(!name||name.length>24)reply='名称请使用 1–24 个字。';else {next.proposal={baseRevision:m.revision,patch:{name},reason:'修改模块名称'};reply='名称修改已生成提案，模块身份和历史保留。';}}
 else if(/榜样|参照|参考|换一个/.test(text)){reply=(REFERENCES[m.id]||[]).length?`本地可讨论的已知参照有：${REFERENCES[m.id].map(r=>r.name).join('、')}。选择一个，或用“补充其他榜样”提供来源；陌生来源不会自动标为已核验。`:'先给出你认可的人物或作品与公开链接。若没有可比数据，我们保留叙述参照，把 gap 标为待定义。';}
 else if(/下一步|路线|差距|怎么/.test(text)){reply=`先推进「${m.roadmap[0].title}」。验收：${m.roadmap[0].standard}。再用证据决定是否进入「${m.roadmap[1].title}」。你可以说“中期改为…”调整路线。`;}
 else reply='这是本地规则演示。可以说“目标改为…／近期改为…／重命名为…”，或点一个参照候选；其他表述暂不能可靠解析。';
 next.messages.push({role:'assistant',text:reply});return next;
}
export const SOURCE_TYPES={github:'GitHub 个人主页 / 活动',linkedin:'LinkedIn',x:'X / Twitter',article:'文章 / 论文',video:'视频 / 演讲',code:'代码 / 项目',other:'其他公开资料'};
export function sourceType(url){const u=new URL(url),host=u.hostname.toLowerCase().replace(/^www\./,'');return host==='github.com'?(u.pathname.split('/').filter(Boolean).length>1?'code':'github'):host==='linkedin.com'?'linkedin':['x.com','twitter.com'].includes(host)?'x':['youtube.com','youtu.be','bilibili.com','vimeo.com'].includes(host)?'video':'other';}
export function referenceSources(reference){
 if(!reference)return [];
 if(reference.sources)return structuredClone(reference.sources);
 return reference.source?[{id:'primary',type:sourceType(reference.source),url:reference.source,title:'原始公开参照',note:reference.claim||'',status:reference.kind==='narrative'?'pending':'preset'}]:[];
}
export const referenceSourceText=reference=>reference?`${reference.name} · ${reference.sources?reference.sources.length:reference.source?1:0} 条资料\n评估重点：${reference.focus||'待讨论领域能力与成果'}\n观察范围：${reference.observationWindow||'待确认时间范围'}\n${referenceSources(reference).map(s=>`${SOURCE_TYPES[s.type]||SOURCE_TYPES.other} · ${s.title||'未命名资料'} · ${s.status==='preset'?'预置参照口径':'待读取与核验'}\n${s.url}${s.note?'\n支持的判断（本人说明）：'+s.note:''}`).join('\n')}`:'尚未选择榜样与资料';
export function configureReference(reference,name,inputs,{focus='',observationWindow=''}={}){
 name=String(name||'').trim();focus=String(focus).trim();observationWindow=String(observationWindow).trim();
 if(!name||name.length>80)throw Error('人物或作品名称请使用 1–80 个字');
 if(!Array.isArray(inputs)||!inputs.length||inputs.length>12)throw Error('请提供至少 1 条、最多 12 条公开资料链接');
 if(focus.length>600||observationWindow.length>120)throw Error('评估重点最多 600 字，观察范围最多 120 字');
 const existing=referenceSources(reference),seen=new Set();
 const sources=inputs.map((input,i)=>{
  let u;try{u=new URL(String(input.url||'').trim());}catch{throw Error(`第 ${i+1} 条资料需要完整的公开链接`);}
  if(!['http:','https:'].includes(u.protocol)||u.username||u.password||u.href.length>2048)throw Error(`第 ${i+1} 条链接请使用不含登录信息的 http / https 地址`);
  if(seen.has(u.href))throw Error(`第 ${i+1} 条链接重复，请保留一条并补充说明`);seen.add(u.href);
  const type=input.type&&input.type!=='auto'?input.type:sourceType(u.href),title=String(input.title||'').trim(),note=String(input.note||'').trim();
  if(!Object.hasOwn(SOURCE_TYPES,type))throw Error('请选择可用的资料类型');
  if(title.length>120||note.length>600)throw Error('资料标题最多 120 字，说明最多 600 字');
  const previous=existing.find(s=>s.id===input.id);
  return {id:previous?.id||crypto.randomUUID(),type,url:u.href,title,note,status:reference?.name===name&&previous?.url===u.href&&previous.status==='preset'?'preset':'pending'};
 });
 const anchor=reference?.anchorURL||reference?.source;
 const keep=reference&&reference.name===name&&reference.kind!=='narrative'&&sources.some(s=>s.url===anchor);
 return {...(keep?structuredClone(reference):{id:reference?.name===name?reference.id:crypto.randomUUID(),name,subtitle:'本人提供 · 待核查',kind:'narrative',claim:'已收录公开资料；身份、成果归属与对应领域能力尚待读取核验，暂不定分或境界。'}),name,sources,source:keep?anchor:sources[0].url,anchorURL:keep?anchor:null,focus,observationWindow};
}
export function customReference(name,url){return configureReference(null,name,[{url}]);}

// ponytail: curated assessment fixtures demonstrate the review contract; real domain analysis requires the Agent runtime and retrieved evidence.
export function analyzeModule(m,day,reference=m.benchmark,text=''){
 const metrics=m.metrics.map(x=>{const name=x.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const found=text.match(new RegExp(name+'[为：:、，\\s]*(\\d+(?:\\.\\d+)?)'));if(found&&(!Number.isFinite(Number(found[1]))||Number(found[1])>Number.MAX_SAFE_INTEGER||x.unit==='秒'&&Number(found[1])<=0))throw Error('现状数值超出可用范围，请核对后重新描述。');return found?{...x,value:Number(found[1]),evidence:'本轮自述（待核验）：'+text.slice(0,240),updated:'2026-10-02'}:x;});
 const assessed={...m,metrics};
 const baseline=score(assessed,day),comparison=gap(assessed,day,reference);const missing=baseline.metrics.filter(x=>x.value===null).map(x=>`${x.name}的个人证据`);
 const sources=referenceSources(reference),pendingSources=sources.filter(x=>x.status!=='preset');
 if(!reference)missing.push('你认可的榜样或作品来源');if(reference?.kind==='narrative')missing.push('参照来源核查与可比指标','对应领域的评估维度、同口径标准与可复核分项');
 if(pendingSources.length)missing.push(`${pendingSources.length} 条榜样资料的内容读取、本人身份与成果归属核验`);
 if(reference&&!reference.observationWindow)missing.push('榜样资料的观察时间范围');
 const referenceBasis=referenceSourceText(reference).split('\n');
 const referenceResearch={field:m.name,goal:m.goal,focus:reference?.focus||'与本领域相关的能力、作品质量和可验证成果',observationWindow:reference?.observationWindow||null,sources,dimensions:metrics.map(x=>x.name),checks:['核查本人身份、成果归属、发布时间与可访问性','按领域区分持续活动、作品质量和可验证成果；不以粉丝、点赞或提交次数代替能力','每个分项回链到原文、代码或成果；标注自述、外部验证、缺失与冲突','先讨论可比口径与可信度，再形成双方评分及境界；用户确认后采用']};
 let roadmap=structuredClone(m.roadmap),goal=m.goal;
 if(reference?.id==='gary'){goal='先验证每周三次是否适合自己，再追求稳定';roadmap=[road('near','未来 2 周','观察从每周两次向三次过渡的可行性','先补齐活动、负荷与恢复记录；不强制加量',['recover','run']),road('mid','1–3 个月','找到可维持的每周活动节奏','用多周记录检查频率与恢复是否兼容'),road('long','3–12 个月','接近榜样的长期规律性','每周三次只是同口径频率参照，不代表同等健康或耐力')];}
 if(reference?.id==='tasks'){goal='交付一个有建议、确认与反馈闭环的任务 Agent';roadmap=[road('near','未来 2 周','完成一次任务修改提案','复用任务对象；拒绝不写入；确认后一次生效',['agent-action']),road('mid','1–3 个月','验证失败、重试与下一步反馈','用明确失败用例检查结果，保留可回放记录',['agent-eval','agent-pilot']),road('long','3–12 个月','独立完成可长期使用的任务应用','以实际使用记录与官方作品能力清单逐项对照')];}
 if(reference?.id==='bolt'){goal='先建立可信的百米基线，再确认适合自己的阶段目标';roadmap=[road('near','未来 2 周','确认已有百米计时与测量条件','整理同距离成绩、计时方式、身体限制；不由马拉松数据推断'),road('mid','1–3 个月','与专业支持共同确认可行阶段目标','根据个人条件复核方式与负荷，不照搬世界纪录运动员训练'),road('long','3–12 个月','用同口径记录持续复评','新的证据决定差距，不承诺追平时间')];}
 const personalBasis=(day.personal?.facts||[]).filter(f=>f.enabled&&(f.scope==='all'||f.scope===m.id)).map(f=>`${f.label}：${f.text}（${f.source}，${f.date}）`);
 const analysis={personalBasis,label:'Jarvis 模拟分析 · 待确认',confidence:missing.length?'证据不足，结论暂定':'基于示例证据，需现实复核',basis:baseline.metrics.map(x=>`${x.name}：${formatValue(x.value,x.unit)}；目标口径 ${formatValue(x.target,x.unit)}；来源：${x.evidence}`),missing,gap:comparison,reason:reference?.id==='kipchoge'?'精英马拉松可计算同距离成绩差，但现有信息不足以推算追平所需时间。先验证个人阶段目标与训练条件。':reference?.kind==='checklist'?'用公开作品能力项定义差距，优先补受控执行与验证证据。任务完成和实际能力验收分别处理。':'先确认可比性与个人起点，再选择可验证的下一阶段；资料不足的维度保持未知。',score:baseline.value,coverage:baseline.coverage,comparison:assessment(assessed,day,reference)};
 Object.assign(analysis,{referenceBasis,referenceResearch});
 return {...m,proposal:{baseRevision:m.revision,dayRevision:day.revision,reason:'Jarvis 分析目标、差距与阶段路线',patch:{goal,roadmap,metrics,benchmark:reference,assessment:analysis,updated:'2026-10-02'}}};
}
