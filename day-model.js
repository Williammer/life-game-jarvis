import {challenge} from './journey.js';
import { fresh, task, act, progression } from './model.js';

export const START=480, END=1320;
export const clock=m=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
export const minutes=s=>{const [h,m]=s.split(':').map(Number);return h*60+m;};
const clone=s=>structuredClone(s);
const uid=()=>globalThis.crypto.randomUUID();
export const finished=(core,id,contracts=core.contracts)=>core.records[id]?.status==='done'&&(!contracts?.[id]||contracts[id].variant===core.records[id].contract?.variant);
export function newDay(){return {core:fresh(),revision:0,events:[
  {id:'work-am',title:'专注工作',start:540,end:600,kind:'fixed'},
  {id:'meeting',title:'项目会议',start:600,end:660,kind:'fixed'},
  {id:'work-pm',title:'工作时间',start:840,end:1020,kind:'fixed'},
  {id:'pickup',title:'接孩子',start:1080,end:1110,kind:'fixed'},
],proposal:null,recordDraft:null,lastPlan:null,now:540,selected:null,focus:'build',waiting:null,notice:'',messages:[{role:'assistant',text:'今天先保护一个能留下作品的时间块。告诉我固定安排、想推进的事和身体感受，我会在日历里标出可确认的建议。也可以点空白时间直接添加。'}]};}

export function conflicts(events){const out=[];for(let i=0;i<events.length;i++){const e=events[i];if(!Number.isInteger(e.start)||!Number.isInteger(e.end)||e.start<START||e.end>END||e.end<=e.start)out.push(`${e.title}：时间需在 08:00–22:00 内，且结束晚于开始`);for(let j=i+1;j<events.length;j++){const b=events[j];if(e.start<b.end&&b.start<e.end)out.push(`${e.title} 与 ${b.title} 重叠`);}}return out;}
export function gaps(events,from=START,to=END){let cursor=from;const out=[];for(const e of [...events].sort((a,b)=>a.start-b.start)){if(e.end<=from||e.start>=to)continue;if(e.start>cursor)out.push([cursor,Math.min(e.start,to)]);cursor=Math.max(cursor,e.end);}if(cursor<to)out.push([cursor,to]);return out;}
function duration(text){if(/半(?:个)?小时/.test(text))return 30;const m=text.match(/(\d+(?:\.\d+)?)\s*(分钟|分|小时)/);return m?Math.round(Number(m[1])*(m[2]==='小时'?60:1)):null;}
function normalize(text){const nums={'零':0,'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};return text.replace(/([零一二两三四五六七八九十]+)(?=点|时|分钟|小时)/g,word=>{if(!word.includes('十'))return nums[word]??word;const [a,b]=word.split('十');return String((a?nums[a]:1)*10+(b?nums[b]:0));}).replace(/(\d{1,2})点半/g,'$1:30').replace(/(\d{1,2})点(\d{1,2})分?/g,'$1:$2').replace(/(\d{1,2})点/g,'$1:00').replace(/：/g,':');}
function taskFrom(text){if(/数值|验证|检查/.test(text))return 'review';if(/实验|代码|实践|实现|作品/.test(text))return 'build';if(/读|学习|课程|概念/.test(text))return 'read';if(/恢复|休息|拉伸/.test(text))return 'recover';if(/跑步|轻松跑/.test(text))return 'run';if(/陪伴|亲子/.test(text))return 'family';return null;}

// ponytail: bounded Chinese time grammar for an honest offline prototype; an optional model extracts the same action contract.
export function parse(text,s){text=String(text).trim().slice(0,5000);const normalized=normalize(text);const result={events:[],context:{},questions:[],notes:[],progress:null,move:null,remove:null,explain:false,recognized:false};
  if(/明天|后天|下周/.test(text)){result.questions.push('这版只排今天。你想把哪部分安排在今天？');return result;}
  if(/为什么|依据|怎么算|有什么用/.test(text)){result.explain=true;result.recognized=true;return result;}
  const selected=s.events.find(e=>e.id===s.selected);
  if(selected&&/这个|这项/.test(text)&&/缩短|改成|改为/.test(text)&&duration(normalized)){
    const d=/缩短(?!到)/.test(text)?selected.end-selected.start-duration(normalized):duration(normalized);
    if(d<15)result.questions.push('缩短后少于 15 分钟。要改成 15 分钟，还是取消这项？');
    else{result.move={id:selected.id,start:selected.start,end:selected.start+d};result.recognized=true;}return result;
  }
  const namedTask=s.moduleRoutes?.flatMap(r=>r.taskIds).find(id=>text.includes(task(id).name));
  const progressId=selected?.taskId||namedTask||taskFrom(text);
  if(progressId&&/完成|做了|做完|搞定|跑通|没做完|没跑通|没完成/.test(text)&&!/想|计划|希望/.test(text)){
    result.progress={id:progressId,status:/没(?:有)?完成|没做完|没跑通|部分|只做|还没|失败/.test(text)?'partial':'done',minutes:duration(normalized)||task(progressId).minutes,evidence:text,proof:'self'};result.recognized=true;return result;
  }
  if(/不累|不疲劳|精神很好|精力充足/.test(text)){result.context.fatigue=false;result.context.energy=7;result.recognized=true;}
  else if(/累|疲劳|恢复|休息|连续跑/.test(text)){result.context.fatigue=true;result.context.energy=4;result.notes.push('身体负荷按你的描述降低；不根据连续跑步天数直接作医疗判断。');result.recognized=true;}
  const budget=normalized.match(/(?:只有|最多|可用|只剩|剩下|留出|能投入)\s*(\d+)\s*(分钟|小时)/);
  if(budget){result.context.budget=Math.max(15,Math.min(240,Number(budget[1])*(budget[2]==='小时'?60:1)));result.recognized=true;}
  if(/想|希望|优先|主线|安排|留给/.test(text)&&progressId){result.context.focus=progressId;result.context.wish=text;result.recognized=true;}
  const clauses=normalized.split(/[，,；;。\n]+/).filter(Boolean);
  for(const clause of clauses){
    const timeMatches=[...clause.matchAll(/(?:(上午|早上|下午|晚上|晚间|今晚|中午|早晨)\s*)?(\d{1,2}):(\d{1,2})/g)];
    if(!timeMatches.length){if(/有会|开会|接孩子|出门/.test(clause)&&!/想|希望/.test(clause)){result.questions.push(`“${clause}”从几点开始、持续多久？例如：14:00–15:00。`);result.waiting=clause;}continue;}
    const period=timeMatches[0][1]||clause.match(/上午|早上|下午|晚上|今晚|中午/)?.[0];
    const convert=(m)=>{let h=Number(m[2]);if((m[1]||period)&&/下午|晚上|晚间|今晚/.test(m[1]||period)&&h<12)h+=12;if((m[1]||period)==='中午'&&h<11)h+=12;return Number(m[3])<60&&h<24?h*60+Number(m[3]):NaN;};
    const start=convert(timeMatches[0]);
    if(/取消|删掉|去掉/.test(clause)){
      const existing=s.events.find(e=>e.start===start);if(existing){result.remove=existing.id;result.recognized=true;}else result.questions.push(`${clock(start)} 没有找到可取消的安排，请点日历中的具体事项。`);continue;
    }
    if(/改到|移到|挪到/.test(clause)){
      const existing=s.events.find(e=>clause.includes(e.title)||e.taskId===taskFrom(clause))||(/这个|这项/.test(clause)?selected:null);
      if(existing){result.move={id:existing.id,start,end:start+(existing.end-existing.start)};result.recognized=true;}else result.questions.push('没有定位到要移动的事项，请点日历中的事项再修改时间。');continue;
    }
    let title=clause.replace(/(?:(上午|早上|下午|晚上|晚间|今晚|中午|早晨)\s*)?\d{1,2}:\d{1,2}/g,'').replace(/\d+(?:\.\d+)?\s*(?:分钟|分|小时)|半(?:个)?小时/g,'').replace(/^[我在从到至\s—–\-~～]+|[\s—–\-~～]+$/g,'').replace(/(?:请)?重新安排.*$/,'').trim();
    if(!title&&s.waiting)title=s.waiting;
    if(!title){result.questions.push('这个时间块要安排什么事？也可以直接点日历补上名称。');continue;}
    const span=duration(clause.replace(/\d{1,2}:\d{1,2}/g,''));
    const end=timeMatches.length>1?convert(timeMatches[1]):span?start+span:null;
    if(end===null){result.questions.push(`“${title}”需要多久？例如：${clock(start)} ${title} 30分钟。`);result.waiting=title;continue;}
    result.events.push({id:uid(),title:title.slice(0,80),start,end,kind:'fixed'});result.recognized=true;
  }
  if(/帮我安排|规划今天|重新安排|按现在|推荐下一步/.test(text))result.recognized=true;
  if(!result.recognized&&!result.questions.length)result.questions.push('本地演示还不能可靠理解这句话。可以写“10:00–11:00 项目会，今天想做 AI 实验”，或直接在日历上选时间。');
  return result;
}

function chooseSlot(events,duration,now,preferred){const free=gaps(events,Math.max(START,now),END).filter(([a,b])=>b-a>=duration);if(!free.length)return null;const after=free.find(([a,b])=>Math.max(a,preferred)+duration<=b);const slot=after||free[0];const start=after?Math.max(slot[0],preferred):slot[0];return [start,start+duration];}
export function propose(s,extraction={},reason='按今天的约束重新安排',baseRevision=s.revision){
  const currentDraft=s.proposal?.baseRevision===s.revision?s.proposal:null;const baseEvents=currentDraft?.events||s.events;
  const ctx={...s.core,...currentDraft?.context,...extraction.context};const contracts={...s.core.contracts,...currentDraft?.contracts,...extraction.contracts};const focus=extraction.context?.focus||currentDraft?.focus||s.focus;
  const added=extraction.events||[];let events=baseEvents.filter(e=>!e.taskId||finished(s.core,e.taskId,contracts)).map(clone);
  // Identical stated obligations replace their previous occurrence, rather than duplicating a meeting.
  for(const event of added){events=events.filter(e=>e.title!==event.title);events.push(event);}
  if(extraction.remove)events=events.filter(e=>e.id!==extraction.remove);
  if(extraction.move){const orig=baseEvents.find(e=>e.id===extraction.move.id);if(orig){events=events.filter(e=>e.id!==orig.id);events.push({...orig,...extraction.move});}}
  const health=ctx.fatigue?'recover':'run';const ai=s.core.records.build?.status==='done'&&s.core.records.build?.proof==='checked'?'review':focus==='read'?'read':'build';
  const ids=s.moduleRoutes?s.moduleRoutes.map(r=>{
    const requested=r.taskIds.find(id=>extraction.taskIds?.includes(id));
    return requested||(ctx.fatigue&&r.fatigueTaskId)||[r.defaultTaskId,...r.taskIds].find(id=>s.core.records[id]?.status!=='done')||r.defaultTaskId;
  }):[ai,health,'family'];if(extraction.taskIds)ids.unshift(...extraction.taskIds);else if(!s.moduleRoutes&&focus==='review'&&!ids.includes('review'))ids.unshift('review');
  if(s.moduleRoutes)for(const id of ids)if(!contracts[id])contracts[id]=challenge(id);
  const notes=[...(extraction.notes||[])],deferred=[];let used=events.filter(e=>e.taskId&&!finished(s.core,e.taskId,contracts)).reduce((n,e)=>n+e.end-e.start,0),energy=events.filter(e=>e.taskId&&!finished(s.core,e.taskId,contracts)).reduce((n,e)=>n+(contracts[e.taskId]||task(e.taskId)).energy,0);
  for(const id of [...new Set(ids)]){
    const t={...task(id),...contracts[id]},record=s.core.records[id];if(finished(s.core,id,contracts)||events.some(e=>e.taskId===id)||baseEvents.some(e=>e.id===extraction.remove&&e.taskId===id))continue;
    if(s.moduleRoutes&&!s.moduleRoutes.some(r=>r.taskIds.includes(id)))continue;
    // ponytail: checkpoint share estimates remaining time; a grounded Agent can recalibrate from actual attempts.
    const remaining=record?.checkpoints&&t.checkpoints?t.minutes*(1-record.checkpoints.filter(id=>t.checkpoints.some(c=>c.id===id)).length/t.checkpoints.length):t.minutes-(record?.minutes||0);
    const needed=record?.status==='partial'&&(!contracts[id]||record.contract?.variant===contracts[id].variant)?Math.max(Math.min(15,t.minutes),Math.ceil(remaining)):t.minutes;
    if(used+needed>ctx.budget||energy+t.energy>ctx.energy){deferred.push(`${t.name}：超过今天的时间或精力上限`);continue;}
    const preferred=id==='family'?1110:id==='recover'||id==='run'?1020:660;
    const slot=chooseSlot(events,needed,s.now,preferred);
    if(!slot){deferred.push(`${t.name}：没有 ${needed} 分钟的连续空档`);continue;}
    events.push({id:`quest-${id}`,taskId:id,title:t.name,start:slot[0],end:slot[1],kind:'quest'});used+=needed;energy+=t.energy;
  }
  notes.unshift(ctx.fatigue?'你提到疲劳：优先尝试恢复任务，保留调整权。':'未标记疲劳：把轻松活动作为候选，不自动提升健康指标。');
  if(s.moduleRoutes)notes.push('按启用模块的下一任务与现有证据排入空档；现状分、榜样与日历共享模块身份。');else notes.push(ai==='review'?'已有模拟实现证据，下一步补数值验证。':ai==='read'?'按你优先补概念的意愿，安排一段能留下解释的阅读。':'目前缺少可运行实现的证据，先保护一段实践时间；不把阅读与实践机械五五分。');
  if(s.core.records[ai]?.status==='partial')notes.push('已做过的部分保留，本次只安排剩余时间。');
  return {baseRevision,contracts,events:events.sort((a,b)=>a.start-b.start),context:{...currentDraft?.context,...extraction.context},focus,reason,notes,deferred,questions:extraction.questions||[],used,energy,source:extraction.source||'local'};
}
export function planIssues(events,core){const pending=events.filter(e=>e.taskId&&!finished(core,e.taskId));const used=pending.reduce((n,e)=>n+e.end-e.start,0),energy=pending.reduce((n,e)=>n+(core.contracts?.[e.taskId]||task(e.taskId)).energy,0);return [...conflicts(events),...(used>core.budget?['成长任务超过时间预算，请缩短或调整']:[]),...(energy>core.energy?['成长任务超过精力预算，请调整']:[])];}
export function proposalIssues(s){if(!s.proposal)return ['还没有待确认提案'];return [...(s.proposal.baseRevision!==s.revision?['日历或证据已变化，请让 Jarvis 基于最新版重排']:[]),...planIssues(s.proposal.events,{...s.core,...s.proposal.context,contracts:s.proposal.contracts}),...s.proposal.questions];}
export function accept(s){const next=clone(s),errors=proposalIssues(s);if(errors.length){next.notice=errors.join('；');return next;}next.lastPlan=clone(s.events);next.events=clone(s.proposal.events);next.core={...next.core,...s.proposal.context,contracts:clone(s.proposal.contracts||{})};delete next.core.focus;next.focus=s.proposal.focus||s.focus;next.core.active=next.events.filter(e=>e.taskId).map(e=>e.taskId);next.core.draft=[...next.core.active];next.revision++;next.core.revision=next.revision;next.proposal=null;next.waiting=null;next.notice='提案已确认入历。每项任务都带着完成标准，随时可以补录。';return next;}
export function editEvent(s,event,remove=false){const next=clone(s);let events=s.events.filter(e=>e.id!==event.id);if(!remove)events.push({...event,id:event.id||uid()});const errors=planIssues(events,s.core);if(errors.length){next.notice=errors.join('；');return next;}next.lastPlan=clone(s.events);next.events=events.sort((a,b)=>a.start-b.start);next.core.active=events.filter(e=>e.taskId).map(e=>e.taskId);next.revision++;next.notice=remove?'已确认移除事项，已保存的进展继续保留。':'日历已更新。此前未确认的提案需要重新分析。';return next;}
export function record(s,draft,checked=false){const next=clone(s);if(!draft||!task(draft.id)||(!s.core.active.includes(draft.id)&&!s.core.records[draft.id])||String(draft.evidence||'').trim().length<2){next.notice='请先安排任务，并提供至少一句完成情况。';return next;}if(draft.baseRevision!==undefined&&draft.baseRevision!==s.revision){next.notice='记录提案已过期，请重新描述完成情况。';return next;}next.core=act({...s.core,active:[...new Set([...s.core.active,draft.id])]},{...draft,type:'record',proof:checked?'checked':'self'});next.core.active=[...s.core.active];if(!next.core.records[draft.id]){next.notice=next.core.notice;return next;}next.recordHistory=[...(s.recordHistory||[]),{id:draft.id,previous:s.core.records[draft.id]||null,record:clone(next.core.records[draft.id]),revision:s.revision+1}];next.revision++;next.recordDraft=null;next.notice=checked?'已保存模拟验收；没有执行真实代码或验证健康数据。':'完成情况已保存，XP 已重算；能力仍由验收证据决定。';return next;}
export function nextAction(s){const p=progression(s.core);if(s.proposal)return {title:proposalIssues(s).length?'先解决这份提案中的问题':'看一眼改动，再确认入历',text:proposalIssues(s).join('；')||'日历右侧是草案，左侧仍是当前安排。'};
  const next=s.events.filter(e=>e.taskId&&!finished(s.core,e.taskId)).sort((a,b)=>a.start-b.start)[0];
  if(next){const t={...task(next.taskId),...s.core.contracts?.[next.taskId]},r=s.core.records[t.id];return {title:r?'从上次的检查点继续':`下一步：${t.name}`,text:`${clock(next.start)} · ${next.end-next.start} 分钟。${r?`已记录：${r.evidence}`:t.standard}`,event:next};}
  if(s.moduleRoutes&&p.completed)return {title:'进展已记录，可以回看模块总览',text:'任务的行动 XP 与模块现状分分别计算；自述完成后仍可补能力证据。'};
  if(p.completed)return {title:p.skills.length<2?'行动完成了，再补一条能力证据':'新的路标已开放',text:p.skills.length<2?'可以先结束今天。之后再验收实现，不会因为有 XP 就自动点亮能力。':'实现已通过模拟验收。下一次的实践可以聚焦数值检查与失败案例。'};
  return {title:'把今天交给一段描述',text:'我会结合固定事项、身体感受与证据缺口，把具体建议排进空档。'};
}
export function converse(s,text,extraction){const next=clone(s);next.notice='';next.messages.push({role:'user',text});const parsed=extraction||parse(text,s);if(s.waiting&&s.proposal){parsed.context={...s.proposal.context,...parsed.context};parsed.events=[...s.proposal.events.filter(e=>!e.taskId&&!s.events.some(old=>old.id===e.id)),...(parsed.events||[])];}next.waiting=parsed.waiting||null;
  if(parsed.explain){next.messages.push({role:'assistant',text:'安排先避开固定事项，再比较连续空档、个人自评精力和当前能力证据缺口。任务分钟与 XP 使用公开的演示规则；没有科学的“人生 ROI 百分比”。恢复可以得到行动 XP，但不自动增加耐力。'});return next;}
  if(parsed.progress){if(!s.core.active.includes(parsed.progress.id)){next.messages.push({role:'assistant',text:'这项任务还未在已确认计划中。先把它加入日历；已有描述会保留在对话里。'});return next;}next.recordDraft={...parsed.progress,baseRevision:parsed.baseRevision??s.revision};next.messages.push({role:'assistant',text:`我把这段描述整理为「${parsed.progress.status==='partial'?'部分完成':'任务达标'}」记录。确认后更新 XP，能力验收单独进行。`});return next;}
  if(parsed.recognized||parsed.events?.length||Object.keys(parsed.context||{}).length){next.proposal=propose(s,parsed,text,parsed.baseRevision??s.revision);next.messages.push({role:'assistant',text:parsed.summary||`我已把事项与建议排在草案里。${next.proposal.used} 分钟用于成长任务，${next.proposal.deferred.length?`${next.proposal.deferred.length} 项暂缓。`:'留出了固定事项和任务之间的空档。'}${parsed.questions?.length?'有一处信息需要你补充。':'确认前，当前日历保持不变。'}`});}
  else next.messages.push({role:'assistant',text:(parsed.questions||['请补充希望安排的具体事项与时间。']).join('\n')});
  return next;
}
