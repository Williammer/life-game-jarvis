import {REFERENCES,analyzeModule,proposeModule,confirmModule,gap,score,formatValue,customReference,routes} from './module-model.js';
import {propose,accept,proposalIssues,parse,clock} from './day-model.js';
import {challenge,nextMission,advisor,domain,reviewDay,updateContext} from './journey.js';
import {task} from './model.js';

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const feedbackKey=d=>[d.scope,['context','task','checkpoint','evidence'].includes(d.scope)?'':d.mid||'',d.item||'',d.detail||''].join(':');
export const feedbackButton=(scope,mid='',item='',label='与 Jarvis 讨论',detail='')=>`<button type="button" class="feedback-link" data-feedback="${esc(scope)}" data-feedback-mid="${esc(mid)}" data-feedback-item="${esc(item)}" data-feedback-detail="${esc(detail)}" aria-label="${esc(label)}">${esc(label)} <span aria-hidden="true">◌</span></button>`;
export const versions=(day,modules)=>JSON.stringify([day.revision,day.personal?.revision,day.core,day.now,modules.map(m=>[m.id,m.revision]),day.proposal,modules.map(m=>m.proposal)]);
const moduleFor=(d,day,modules)=>modules.find(m=>m.id===d.mid)||(['task','checkpoint','evidence'].includes(d.scope)?modules.find(m=>m.taskIds.includes(d.item)):d.scope==='context'?modules.find(m=>m.id===day.personal.facts.find(f=>f.id===d.item)?.scope):undefined);
const stageName=id=>({near:'近期',mid:'中期',long:'长期'}[id]||'阶段');
const planText=p=>p?`${p.used} 分钟 / ${p.energy} 格精力\n${p.events.filter(e=>e.taskId).map(e=>`${clock(e.start)}–${clock(e.end)} ${e.title}：${p.contracts?.[e.taskId]?.standard||task(e.taskId).standard}`).join('\n')}\n${p.deferred.join('\n')}`:'尚无草案';
const moduleChanges=(value,patch,original)=>Object.keys(patch).filter(k=>!['assessment','updated'].includes(k)&&JSON.stringify(original[k])!==JSON.stringify(patch[k])).map(k=>{
 const v=value[k];return k==='goal'?`目标：${v}`:k==='benchmark'?`榜样：${v?.name||'暂不采用'}`:k==='metrics'?v.filter(x=>JSON.stringify(original.metrics.find(y=>y.id===x.id))!==JSON.stringify(patch.metrics.find(y=>y.id===x.id))).map(x=>`${x.name}：${formatValue(x.value,x.unit)}`).join('；'):k==='roadmap'?v.filter(x=>JSON.stringify(original.roadmap.find(y=>y.id===x.id))!==JSON.stringify(patch.roadmap.find(y=>y.id===x.id))).map(r=>`${stageName(r.id)}：${r.title}\n验收：${r.standard}`).join('\n'):String(v);
}).join('\n')||'内容保留，记录当前确认版本';
const currentPlan=day=>`${day.core.budget} 分钟预算 / ${day.core.energy} 格精力 / ${day.core.fatigue?'恢复优先':'未标记疲劳'}\n${day.events.filter(e=>e.taskId).map(e=>`${clock(e.start)}–${clock(e.end)} ${e.title}`).join('\n')||'尚未安排成长任务'}`;
export function checkpoint(d,day,modules){
 const m=moduleFor(d,day,modules),t=d.item?task(d.item):null;
 let label='这条建议',content='',basis='',tips=[];
 if(d.scope==='benchmark'){
  label=`${m.name} · 榜样设定`;content=m.benchmark?`${m.benchmark.name}\n${m.benchmark.claim}`:'尚未选择参照';basis=`${m.benchmark?.source||'缺少可信参照'}\n${advisor(m,day).why}\n${advisor(m,day).facts.map(f=>f.label+'：'+f.text).join('\n')}`;tips=[...(REFERENCES[m.id]||[]).map(r=>`改用 ${r.name}`),'暂不采用榜样','为什么适合我？'];
 }else if(d.scope==='gap'&&d.item==='rubric'){
  label=`${m.name} · 评分口径`;content=m.metrics.map(x=>`${x.name}：权重 ${x.weight}，目标 ${formatValue(x.target,x.unit)}`).join('\n');basis='各模块使用自己的演示量表，不做跨领域排名。未知项单列覆盖率；任务自述与能力验收分开。';tips=['为什么这样判断？','补充背景：我希望目标更重视…'];
 }else if(d.scope==='gap'||d.scope==='metric'){
  const x=m.metrics.find(x=>x.id===d.item)||m.metrics.find(x=>x.id===m.benchmark?.metricId)||m.metrics[0];
  label=`${m.name} · ${d.scope==='gap'?'差距分析':x.name}`;content=d.scope==='gap'?`${gap(m,day).headline}\n${gap(m,day).current} → ${gap(m,day).target}`:`${x.name}：${formatValue(score(m,day).metrics.find(y=>y.id===x.id).value,x.unit)}；目标 ${formatValue(x.target,x.unit)}`;
  basis=`${x.evidence}\n未知不计为零；自述不能自动证明完整能力。`;tips=['为什么这样判断？',`${x.name}未知`,x.unit==='秒'?`${x.name}改为 4:10:00`:`${x.name}改为 ${x.value??1}`];
 }else if(d.scope==='goal'){
  label=`${m.name} · 成长目标`;content=m.goal;basis='目标由本人决定，评分与能力验收需另行讨论。';tips=['目标改为…','补充背景：…','为什么适合我？'];
 }else if(d.scope==='roadmap'){
  const r=m.roadmap.find(r=>r.id===d.item)||m.roadmap[0];label=`${m.name} · ${stageName(r.id)}规划`;content=`${r.window}\n${r.title}\n验收：${r.standard}`;basis='阶段窗口不承诺提升速度。路线文字可协商，具体挑战合约与前置证据单独确认。';tips=[`${stageName(r.id)}改为…`,'验收改为…','为什么先做这个？'];
 }else if(d.scope==='advisor'||d.scope==='source'){
  const a=advisor(m,day),dom=domain(m);label=`${m.name} · ${d.scope==='source'?'专业依据':'顾问判断与下一步'}`;content=d.scope==='source'?`${dom.source}\n${dom.support}\n${a.missing}`:`${a.insight}\n${a.why}\n${a.next}`;basis=`${dom.url||'尚无领域来源'}\n${a.facts.map(f=>`${f.label}：${f.text}`).join('\n')}`;tips=['为什么适合我？','补充背景：…','这个背景不适用'];
 }else if(d.scope==='context'){
  const f=day.personal.facts.find(f=>f.id===d.item);label=`个人背景 · ${f.label}`;content=f.text;basis=`${f.source} · ${f.date} · ${f.enabled?'允许本轮使用':'已停用'}`;tips=['背景改为…',f.enabled?'这条背景不适用':'恢复使用这条背景'];
 }else if(d.scope==='task'||d.scope==='checkpoint'){
  const id=t?.id||nextMission(m,day).id,c=(d.detail==='proposal'?day.proposal?.contracts?.[id]:null)||day.core.contracts?.[id]||challenge(id),cp=c.checkpoints.find(x=>x.id===d.detail);
  label=`${task(id).name} · ${d.scope==='checkpoint'?'执行检查点':'挑战标准'}`;content=cp?cp.title:`${c.label}\n${c.standard}\n${c.minutes} 分钟 · 最多 ${c.xp} 行动 XP`;basis=`${m?advisor(m,day).why:'按已确认合约执行'}\n缩短任务不自动降低完整能力验收要求。`;tips=['这个检查点为什么必要？','改为最小一步','改为标准挑战','补充背景：…'];
 }else if(d.scope==='evidence'){
  const r=day.core.records[d.item];label=`${task(d.item).name} · 完成判断`;content=r?`${r.evidence}\n${r.minutes} 分钟 · ${r.xp} XP · ${r.proof==='checked'?'模拟验收':'自述，待验证'}`:'尚未记录证据';basis='模拟验收未运行真实代码；行动积分与完整能力分开。';tips=['为什么这样判断？','撤回能力验收','补充背景：…'];
 }else if(d.scope==='reward'){
  label='行动积分与成长纪念';content='按检查点比例结算；重复保存覆盖，不叠加。60 XP + 一项完整能力模拟验收可领取演示纪念。';basis='固定演示规则，不是科学的多巴胺或人生价值计量。';tips=['为什么这样结算？','补充背景：我更希望…'];
 }else if(d.scope==='review'){
  const r=reviewDay(modules,day);label={planning:'每日安排评估',completion:'完成度评估',learning:'复盘与下一步'}[d.item]||'营地复盘';content=d.item==='planning'?r.planning:d.item==='completion'?r.completion:`${r.learning}\n${r.suggestion}`;basis='未记录保持未知；完成部分与难度来自自述，不自动推断原因。';tips=['为什么这样判断？','下次改为最小一步','补充背景：实际原因是…'];
 }else if(d.scope==='proposal'&&m){
  label=`${m.name} · 当前修订提案`;content=m.proposal?`${m.proposal.baseRevision!==m.revision||m.proposal.dayRevision!==undefined&&m.proposal.dayRevision!==day.revision?'原提案已过期，须基于当前资料重评。\n':''}${moduleChanges({...m,...m.proposal.patch},m.proposal.patch,m)}`:'尚无提案';basis=m.proposal?.reason||'可以先讨论目标或参照';tips=['目标改为…','为什么这样判断？'];
 }else if(d.scope==='plan'&&d.item==='anchor'){
  label='开始锚点';content=day.core.startAnchor||'候选：午饭后，打开上一轮作品，先做第一个检查点。';basis='实施意图是可修改的开始线索，不保证习惯自动形成。';tips=['锚点改为…','补充背景：…','为什么这样安排？'];
 }else{
  label=d.scope==='proposal'?'今日计划草案':'今日判断与规划';content=d.scope==='proposal'?planText(day.proposal):currentPlan(day);basis='先避开固定事项，再按容量、精力与前置能力证据安排。';tips=['今天只有 45 分钟','改为最小一步','为什么这样安排？'];
 }
 return {...d,key:feedbackKey(d),label,content,basis,tips,version:versions(day,modules)};
}

// ponytail: bounded local action grammar; a real Agent can replace proposal generation without changing confirmation or object identity.
export function reply(d,text,day,modules,thread={}){
 text=String(text||'').trim();if(!text||text.length>2000)throw Error('请用 1–2000 个字说明反馈。');
 const c=checkpoint(d,day,modules),m=moduleFor(d,day,modules),base=c.version;
 const pending=thread.proposal?.base===base?thread.proposal:d.scope==='proposal'&&m?.proposal?.baseRevision===m.revision&&(m.proposal.dayRevision===undefined||m.proposal.dayRevision===day.revision)?{kind:'module',mid:m.id,patch:m.proposal.patch,reason:m.proposal.reason,base,before:moduleChanges(m,m.proposal.patch,m),after:moduleChanges({...m,...m.proposal.patch},m.proposal.patch,m)}:null;
 const working=m&&pending?.kind==='module'?{...m,...pending.patch}:m;
 const proposal=(kind,data,before,after)=>({kind,...data,base,before,after,reason:text});
 const modulePatch=(patch,before,after)=>{const combined={...(pending?.patch||{}),...patch};return {text:'已整理为修订提案。你可以继续修改、拒绝或确认；确认后才更新这里的内容。',proposal:proposal('module',{mid:m.id,patch:combined},moduleChanges(m,combined,m)+('benchmark' in combined||'metrics' in combined?'\n可比差距：'+gap(m,day).headline:''),moduleChanges({...m,...combined},combined,m)+('benchmark' in combined||'metrics' in combined?'\n可比差距：'+gap({...m,...combined},day).headline:''))};};
 if(/…|\.\.\./.test(text))return {text:'把省略号替换为你的具体内容再发送。比如“近期改为先做一个只读提案”。'};
 if(/^(?:为什么|解释)|为什么必要/.test(text)){const proposed=pending?.kind==='module'?checkpoint(d,day,modules.map(x=>x.id===m.id?working:x)):pending?.kind==='day'?{...c,content:planText(pending.plan)}:c;return {text:`针对「${c.label}」：${proposed.basis}\n${pending?'正在讨论的候选，尚未生效':'当前采用的内容'}：${proposed.content}\n你可以指出哪个前提不符合实际；我会先修正前提，再形成候选方案。`,proposal:pending};}
 const background=text.match(/^(?:补充背景|实际原因是)[：:\s]*(.+)/s);
 if(background){const desc=background[1].trim();if(desc.length<6||desc.length>600)throw Error('背景请使用 6–600 个字。');return {text:'这段原文将作为待评估背景保存，不自动当作专业结论。确认后旧判断与计划需基于新背景重评。',proposal:proposal('context',{description:desc,scope:m?.id||'all'},'未包含这段背景',desc)};}
 if(d.scope==='context'){
  const f=day.personal.facts.find(f=>f.id===d.item),correction=text.match(/^背景改为[：:\s]*(.+)/s),disable=/不适用|停用/.test(text),enable=/恢复使用/.test(text);
  if(correction||disable||enable){const value=correction?.[1].trim();if(value&&(value.length<6||value.length>600))throw Error('背景请使用 6–600 个字。');return {text:'修改只影响这条背景，确认后使旧评估过期。',proposal:proposal('fact',{item:f.id,patch:correction?{text:value,source:'本人更正 · 待专业评估',date:'2026-10-02'}:{enabled:enable}},f.text+(f.enabled?'（启用）':'（停用）'),value||`${f.text}（${enable?'启用':'停用'}）`)};}
 }
 if(d.scope==='benchmark'){
  if(/暂不采用|取消榜样/.test(text))return modulePatch({benchmark:null,assessment:null},m.benchmark?.name||'无参照','暂不采用榜样；差距保持待定义');
  const ref=(REFERENCES[m.id]||[]).find(r=>text.toLowerCase().includes(r.name.toLowerCase())||text.toLowerCase().includes(r.id));
  const custom=text.match(/^榜样改为[：:\s]*(.+?)\s+(https?:\/\/\S+)$/);
  if(ref||custom){const reference=ref||customReference(custom[1],custom[2]);const revised=analyzeModule(working,day,reference).proposal.patch;return modulePatch(revised,`${working.benchmark?.name||'无参照'} · ${gap(working,day).headline}`,`${reference.name} · ${gap({...working,...revised},day).headline}\n目标：${revised.goal}\n近期：${revised.roadmap[0].title}`);}
  return {text:'请选一个已列出的候选，或输入“榜样改为 人物/作品 https://公开来源”。陌生参照只保存为待核查，不会凭名字生成数值差距。'};
 }
 if(d.scope==='gap'&&d.item==='rubric')return {text:'这份评分量表是演示口径。请说明你重视的目标或哪项证据不合适，可用“补充背景：…”记录偏好，再单独调整目标或现状。我不会把权重意见误记成基线数值。'};
 if(m&&['gap','metric'].includes(d.scope)){
  const x=working.metrics.find(x=>x.id===d.item)||working.metrics.find(x=>x.id===working.benchmark?.metricId)||working.metrics[0];
  const named=working.metrics.find(y=>text.includes(y.name));if(named&&named.id!==x.id)return {text:`这里正在讨论「${x.name}」，请从「${named.name}」旁的入口更正该项，避免修改错对象。`};
  const unknown=/未知|不可比|不确定/.test(text);const number=text.match(/(?:改为|为|是|：|:)\s*(\d+(?:\.\d+)?)(?::(\d{2}):(\d{2}))?/);
  if(unknown||number){let value=unknown?null:number[2]!==undefined?Number(number[1])*3600+Number(number[2])*60+Number(number[3]):Number(number[1]);
   if(!unknown&&(!Number.isFinite(value)||value<0||value>1e7||number[2]!==undefined&&(x.unit!=='秒'||Number(number[2])>=60||Number(number[3])>=60)))throw Error('请核对数值；时间使用 H:MM:SS，其余指标使用同口径非负数。');
   if(!unknown&&x.unit==='秒'&&number[2]===undefined)throw Error('成绩请使用 H:MM:SS，避免把小时、分钟误当秒。');
   if(x.taskId&&value!==null&&value>=x.target)return {text:'这项涉及完整能力，个人自述先保留为背景。请在已安排挑战中提供产物并单独验收；我不会通过修改基线直接解锁能力。'};
   const metrics=working.metrics.map(y=>y.id===x.id?{...y,value,evidence:`本人更正（待核验）：${text}`,updated:'2026-10-02'}:y);
   if(score(working,day).metrics.find(y=>y.id===x.id).fromRecord)return {text:'当前这一项来自模拟验收记录，修改基线不能覆盖验收。请在“完成判断”处讨论撤回能力验收，再补充新的资料。'};
   return modulePatch({metrics,assessment:null,updated:'2026-10-02'},`${x.name}：${formatValue(x.value,x.unit)} · ${gap(working,day).headline}`,`${x.name}：${formatValue(value,x.unit)} · ${gap({...working,metrics},day).headline}`);
  }
  return {text:`你在讨论「${x.name}」。可以说“${x.name}改为 ${x.unit==='秒'?'4:10:00':'2'}”或“${x.name}未知”。当前证据来源可继续核查；不把不同口径硬算成差距。`};
 }
 if(m){
  const goal=text.match(/^目标改为[：:\s]*(.+)/s),stage=text.match(/^(近期|中期|长期)(?:计划)?改为[：:\s]*(.+)/s),standard=text.match(/^验收改为[：:\s]*(.+)/s);
  if(goal)return modulePatch({goal:goal[1].slice(0,180),assessment:null},working.goal,goal[1].slice(0,180));
  if(stage||standard){const id=stage?{近期:'near',中期:'mid',长期:'long'}[stage[1]]:d.scope==='roadmap'?d.item:'near';const r=working.roadmap.find(r=>r.id===id);if(!r)throw Error('请选中要修改的规划阶段。');const revised={...r,...(stage?{title:stage[2].slice(0,160)}:{standard:standard[1].slice(0,240)})};return modulePatch({roadmap:working.roadmap.map(x=>x.id===id?revised:x),assessment:null},`${r.title}\n验收：${r.standard}`,`${revised.title}\n验收：${revised.standard}\n具体任务合约与前置能力仍独立验收。`);}
 }
 if(d.scope==='evidence'&&/撤回能力验收/.test(text)){
  const r=day.core.records[d.item];if(!r||r.proof!=='checked')return {text:'这条记录没有能力验收可撤回。自述行动保留，不证明掌握。'};
  return {text:'确认后将模拟验收改为自述，保留投入与行动 XP；相关能力与后续关卡重新计算。',proposal:proposal('evidence',{item:d.item},'模拟验收 · '+r.evidence,'自述，待验证 · '+r.evidence)};
 }
 if(['plan','task','checkpoint','review','proposal'].includes(d.scope)||d.scope==='advisor'){
  const variant=/最小|减量/.test(text)?'minimum':/标准挑战/.test(text)?'standard':/进阶/.test(text)?'stretch':null;
  let extraction=parse(text,day);const anchor=text.match(/^锚点改为[：:\s]*(.+)/s);if(anchor){if(anchor[1].length>160)throw Error('开始锚点请使用 1–160 个字。');extraction={context:{startAnchor:anchor[1]}};}
  if(variant){const candidates=m?[nextMission(m,day).id]:modules.filter(x=>x.status==='active').map(x=>nextMission(x,day).id);const ids=['task','checkpoint'].includes(d.scope)?[d.item]:candidates;extraction={context:{},taskIds:ids,contracts:Object.fromEntries(ids.map(id=>[id,challenge(id,variant)]))};}
  if(variant||Object.keys(extraction.context||{}).length||extraction.move||extraction.remove||extraction.events?.length){
   const withDraft=pending?.kind==='day'?{...day,proposal:pending.plan}:day;const plan=propose({...withDraft,moduleRoutes:routes(modules,day)},extraction,text);const issues=proposalIssues({...day,proposal:plan});return {text:issues.length?`这份候选还需处理：${issues.join('；')}`:'已按当前约束生成修订日历。先看差异；确认后更新同一份今日计划与合约。',proposal:proposal('day',{plan},currentPlan(day),planText(plan))};
  }
 }
 return {text:`你的反馈已保留在「${c.label}」的独立对话中。本地原型暂不能可靠理解这段修改。请具体说明要更正的内容，或先用“补充背景：…”记录原因；不会自动把你标为同意。`,proposal:pending};
}
export function applyFeedback(p,day,modules){
 if(!p||p.base!==versions(day,modules))throw Error('对象、背景或草案已变化。这份修订已过期；保留对话，请重新发送修改后再确认。');
 let nextDay=structuredClone(day),nextModules=structuredClone(modules);
 if(p.kind==='module'){nextModules=nextModules.map(m=>m.id===p.mid?confirmModule(proposeModule(m,p.patch,p.reason)):m);nextDay.revision++;}
 if(p.kind==='day'){const issues=proposalIssues({...day,proposal:p.plan});if(issues.length)throw Error(issues.join('；'));nextDay=accept({...day,proposal:p.plan});}
 if(p.kind==='context')nextDay=updateContext(day,p.description,p.scope);
 if(p.kind==='fact'){nextDay.personal.facts=nextDay.personal.facts.map(f=>f.id===p.item?{...f,...p.patch}:f);nextDay.personal.revision++;nextDay.revision++;}
 if(p.kind==='evidence'){const r=nextDay.core.records[p.item];nextDay.recordHistory=[...(day.recordHistory||[]),{id:p.item,previous:structuredClone(r),revision:day.revision+1}];r.proof='self';nextDay.revision++;}
 nextDay.notice='这份修订已确认；对应判断和计划已同步更新。';return {day:nextDay,modules:nextModules};
}
export function undoFeedback(undo,day,modules){
 if(!undo||undo.version!==versions(day,modules))throw Error('确认后又发生了其他变更，不能覆盖新资料。请重新讨论要恢复的内容。');
 const previousDay=structuredClone(undo.day),previousModules=structuredClone(undo.modules);previousDay.messages=structuredClone(day.messages);previousModules.forEach(m=>m.messages=structuredClone(modules.find(x=>x.id===m.id)?.messages||m.messages));previousDay.revision=day.revision+1;previousDay.personal.revision=(day.personal?.revision||0)+1;previousModules.forEach(m=>m.revision=(modules.find(x=>x.id===m.id)?.revision||0)+1);previousDay.notice='已撤销这次协商修订；旧提案需要重新确认。';return {day:previousDay,modules:previousModules};
}
export function feedbackDialog(d,day,modules,thread){
 const c=checkpoint(d,day,modules),p=thread.proposal,stale=p&&p.base!==c.version,agreed=thread.agreement===c.version;
 return `<dialog id="feedback-dialog" aria-labelledby="feedback-title"><div class="feedback-header"><div><span class="advisor-role">就这条内容，与 Jarvis 一起判断</span><h2 id="feedback-title">${esc(c.label)}</h2></div><button type="button" class="btn" data-feedback-control="close" aria-label="关闭讨论">关闭</button></div><div class="feedback-body"><section class="feedback-object"><strong>当前内容</strong><p>${esc(c.content)}</p><details data-keep="feedback-basis"><summary>这条内容的依据与边界</summary><p>${esc(c.basis)}</p></details></section><div class="feedback-history" role="log" aria-label="这条内容的协商记录">${thread.messages.map(msg=>`<div class="feedback-message ${msg.role}"><small>${msg.role==='user'?'你':'Jarvis · 本地模拟'}</small><p>${esc(msg.text)}</p></div>`).join('')||'<p class="feedback-empty">哪里不符合你的实际情况？从这里反馈，对话会始终带着这条内容。</p>'}</div>${p?`<section class="feedback-proposal"><h3>待确认修订</h3><div class="feedback-diff"><div><strong>修改前</strong><p>${esc(p.before)}</p></div><div><strong>修改后</strong><p>${esc(p.after)}</p></div></div>${stale?'<p class="inline-error">这份提案已过期。请基于当前内容重新发送修改。</p>':''}<p>任务证据、行动 XP 与固定安排沿用现有规则。还不合适，可以在下面继续修改。</p><div class="actions"><button class="btn primary" data-feedback-control="confirm" ${stale?'disabled':''}>确认这份修订</button><button class="btn" data-feedback-control="reject">暂不采用</button></div></section>`:''}${thread.error?`<p class="inline-error" role="alert">${esc(thread.error)}</p>`:''}${agreed?'<p class="feedback-agreement" role="status">已达成一致 · 你确认了当前版本</p>':thread.agreement?'<p class="feedback-empty">原先的共识对应旧版本，需要重新复核。</p>':''}${thread.undo?`<button class="feedback-link" data-feedback-control="undo" ${thread.undo.version!==c.version?'disabled':''}>撤销这次修订</button>`:''}</div><div class="feedback-compose"><div class="feedback-chips">${c.tips.map(t=>`<button type="button" data-feedback-prompt="${esc(t)}">${esc(t)}</button>`).join('')}</div><form id="feedback-form"><label class="field" for="feedback-message">反馈或继续修改<textarea id="feedback-message" maxlength="2000" required placeholder="指出不准确的前提，给出你的限制，或提出更合适的方案…">${esc(thread.draft||'')}</textarea></label><div class="composer-footer"><span>只讨论当前内容 · Ctrl / ⌘ + Enter 发送</span><button class="btn primary" type="submit">发送反馈</button></div></form>${!p?'<button class="feedback-link" data-feedback-control="agree">认可当前判断，达成一致</button>':''}<p class="mode-note">本地有限规则模拟，尚未接入真实模型。自由反馈会保留；无法理解时会澄清。共识不代表缺失事实已被验证。刷新清空。</p></div></dialog>`;
}
