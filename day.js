import {feedbackButton as fb,feedbackKey,feedbackDialog,reply,applyFeedback,undoFeedback,versions} from './feedback.js';
import {createPersonal,challenge,nextMission,canSchedule,updateContext} from './journey.js';
import {dailyBoard,contextPanel,questSession,receiptHTML,campReview} from './journey-ui.js';
import {newModules,score,gap,moduleXP,routes,newModule,discuss,proposeModule,confirmModule,customReference,analyzeModule,REFERENCES} from './module-model.js';
import {overview,moduleDetail,moduleRail} from './module-ui.js';
import {newDay,finished,START,END,clock,minutes,propose,proposalIssues,accept,editEvent,record,nextAction,converse,conflicts} from './day-model.js';
import {task,progression,act} from './model.js';

let s=newDay(),page='today',editor=null,draft='';
let modules=newModules(),moduleId=null;const moduleUI={chat:{},showPaused:false,create:false,createText:'',referenceEditor:false};
s.personal=createPersonal();
const feedbackUI={active:null,threads:{},opener:null};
const journeyUI={variants:{},context:false,session:null,anchor:'',receipt:null};
syncModules();
const app=document.querySelector('#app');
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(label,action,extra='',primary=false)=>`<button class="btn ${primary?'primary':''}" data-action="${action}" ${extra}>${label}</button>`;
function rail(){return moduleRail(modules,s);}
function eventHTML(e,pending=false){const old=s.events.find(x=>x.id===e.id);const changed=pending&&(!old||old.start!==e.start||old.end!==e.end||old.title!==e.title);const t={...task(e.taskId),...(pending?s.proposal?.contracts?.[e.taskId]:s.core.contracts?.[e.taskId])};const r=s.core.records[e.taskId],short=e.end-e.start<30;const bad=pending&&conflicts(s.proposal.events).some(x=>x.includes(e.title));return `<button class="event ${e.taskId?'quest':''} ${pending?'proposed':''} ${pending&&!changed?'unchanged':''} ${bad?'conflict':''} ${finished(s.core,e.taskId)?'complete':''} ${s.selected===e.id?'selected':''} ${short?'short':''}" style="top:${(e.start-START)*1.2}px;height:${Math.max(21,(e.end-e.start)*1.2-3)}px" data-action="${pending?'draft-event':'select'}" data-id="${esc(e.id)}" ${pending?'':'draggable="true"'} aria-label="${esc(e.title)}，${clock(e.start)} 到 ${clock(e.end)}，${pending?(changed?'待确认改动':'沿用当前安排'):r?.status==='done'?'已记录完成':'已入历'}"><strong>${short?clock(e.start)+' ':''}${esc(e.title)}</strong><small>${clock(e.start)}–${clock(e.end)}${e.taskId?` · ${r?.status==='done'?'已记录':t.xp+' XP 上限'}`:''}</small></button>`;}
function calendar(){return `<section class="calendar" aria-label="今日可编辑日历"><div class="calendar-head"><div><h2>10 月 2 日 · 周五</h2><p>示例日 · 点空白时间添加，拖动事项调整</p></div>${button('添加事项','add')}</div><div class="cal-legend"><span><i></i>固定事项</span><span><i class="quest-key"></i>成长任务</span><span><i class="draft-key"></i>待确认草案</span></div><div class="cal-columns"><span>当前安排 · v${s.revision}</span>${s.proposal?'<span class="pending">Jarvis 草案 · 尚未生效</span>':''}</div><div class="calendar-scroll"><div class="timeline"><div class="time-labels">${Array.from({length:14},(_,i)=>`<span style="top:${i*72}px">${clock(START+i*60)}</span>`).join('')}</div><div class="day-lane"><div class="slots">${Array.from({length:28},(_,i)=>`<button class="time-slot" data-action="slot" data-time="${START+i*30}" aria-label="在 ${clock(START+i*30)} 添加事项"></button>`).join('')}</div>${s.events.map(e=>eventHTML(e)).join('')}</div>${s.proposal?`<div class="day-lane pending">${s.proposal.events.map(e=>eventHTML(e,true)).join('')}</div>`:''}<div class="now-line" style="top:${(s.now-START)*1.2}px" title="模拟当前时间 ${clock(s.now)}"></div></div></div><div class="calendar-foot"><span>时间线 08:00–22:00 · 模拟现在 ${clock(s.now)}</span>${s.lastPlan?'<button data-action="undo">撤销上次日历修改</button>':''}</div>${editorHTML()}</section>`;}
function editorHTML(){if(!editor)return '';const t=editor.taskId?{...task(editor.taskId),...(editor._draft?s.proposal?.contracts?.[editor.taskId]:s.core.contracts?.[editor.taskId])}:null,r=s.core.records[editor.taskId];return `<form class="event-editor" id="event-editor"><h3>${editor._draft?'编辑草案中的这件事':editor.id?'编辑这件事':'添加到这个时间'}</h3><label class="field">事项<input name="title" required maxlength="80" value="${esc(editor.title)}"></label><div class="editor-times"><label class="field">开始<input name="start" type="time" required min="08:00" max="21:59" value="${clock(editor.start)}"></label><label class="field">结束<input name="end" type="time" required min="08:01" max="22:00" value="${clock(editor.end)}"></label></div>${t?`<p class="context-standard"><b>任务达标标准：</b>${esc(t.standard)}<br>时间变短可以只推进一部分；达标标准与能力验收不随之降低。${r?`<br>已记录：${esc(r.evidence)}`:''}</p>${fb('task',modules.find(m=>m.taskIds.includes(t.id))?.id,t.id)}`:''}<div class="actions"><button class="btn primary" type="submit">${editor._draft?'更新草案':editor.id?'确认修改':'确认添加'}</button>${button('收起','close-editor')}${editor.id?button(editor._draft?'从草案移除':'移除事项','delete-event'):''}</div>${t&&!editor._draft?`<div class="actions">${button('描述完成情况','report',`data-id="${t.id}"`)}</div>`:''}</form>`;}
function diff(){const p=s.proposal;if(!p)return [];const changes=[];for(const e of p.events){const old=s.events.find(o=>o.id===e.id);if(!old)changes.push({kind:'新增',e});else if(old.start!==e.start||old.end!==e.end||old.title!==e.title)changes.push({kind:'调整',e,old});}for(const old of s.events)if(!p.events.some(e=>e.id===old.id))changes.push({kind:'移除',e:old});return changes;}
function proposalHTML(){if(!s.proposal)return '';const p=s.proposal,issues=proposalIssues(s),changes=diff();return `<section class="proposal" aria-label="计划提案"><h3>这次建议改动 <small>基于 v${p.baseRevision}</small></h3>${fb('proposal')}<div class="proposal-summary"><span><b>${p.used}</b> 分钟成长时间</span><span><b>${p.energy}</b> / ${p.context.energy??s.core.energy} 格精力</span></div><ul class="changes">${changes.map(({kind,e,old})=>`<li><span class="change-kind ${kind==='移除'?'removed':''}">${kind}</span><div>${esc(e.title)}<small>${old?`${clock(old.start)}–${clock(old.end)} → `:''}${clock(e.start)}–${clock(e.end)}${e.taskId?` · ${esc(task(e.taskId).gap)}`:''}</small>${e.taskId?fb('task',modules.find(m=>m.taskIds.includes(e.taskId))?.id,e.taskId,'讨论这项安排','proposal'):''}</div></li>`).join('')||'<li>当前时段无需调整。</li>'}</ul><details data-keep="rationale"><summary>为什么这样排 · 取舍与完成标准</summary><ul>${[...p.notes,...p.deferred,...p.events.filter(e=>e.taskId).map(e=>{const c=p.contracts?.[e.taskId]||task(e.taskId);return `${e.title}：${c.standard}。达标最多 ${c.xp} XP；${c.checkpoints?'按实际检查点比例结算':'部分完成按演示规则结算一半'}。`;})].map(n=>`<li>${esc(n)}</li>`).join('')}</ul></details>${issues.length?`<div class="proposal-error">${issues.map(esc).join('<br>')}</div>`:''}<div class="actions">${button('确认入历','accept',issues.length?'disabled':'',true)}${button('放弃草案','discard')}<button class="btn mobile-calendar-link" data-action="show-calendar">查看日历</button></div></section>`;}
function recordHTML(){const r=s.recordDraft;if(!r)return '';const c=s.core.contracts?.[r.id]||task(r.id);return `<section class="record-preview"><h3>确认这条进展</h3><p>${esc(task(r.id).name)} · ${r.status==='partial'?'部分完成':'自述达标'} · 累计 ${r.minutes} 分钟</p><p>${esc(r.evidence)}</p><p>行动 ${r.status==='partial'?Math.floor(c.xp/2):c.xp} XP；同任务覆盖重算，能力暂不解锁。</p><div class="actions">${button('确认记录','save-record','',true)}${button('取消','discard-record')}</div></section>`;}
function panel(){const next=nextAction(s),selected=s.events.find(e=>e.id===s.selected);return `<aside class="agent-panel" aria-label="Jarvis 对话"><div class="agent-heading"><span class="agent-dot"></span><h2>Jarvis</h2><small>与你一起安排今天</small></div><div class="agent-content"><div class="agent-intent"><h3>${esc(next.title)}</h3><p>${esc(next.text)}</p>${fb('plan')}${next.event?button('打开任务与完成标准','select',`data-id="${esc(next.event.id)}"`):''}</div>${proposalHTML()}${recordHTML()}${s.messages.length>1?`<details class="conversation-log" data-keep="conversation"><summary>对话记录 · ${s.messages.length-1} 条新消息</summary><div class="chat-history" aria-label="对话记录">${s.messages.slice(-6).map(m=>`<div class="chat-message ${m.role}"><small>${m.role==='user'?'你':'Jarvis · 本地演示'}</small>${esc(m.text)}</div>`).join('')}</div></details>${!s.proposal&&!s.recordDraft?`<p class="latest-reply">${esc(s.messages.at(-1).text)}</p>`:''}`:''}${selected?`<div class="selected-context"><span>正在讨论：${esc(selected.title)} · ${clock(selected.start)}</span><button data-action="unselect">清除</button></div>`:`<div class="selected-context"><span>模块上下文：${esc(modules.find(m=>m.id===moduleId)?.name||'所有启用模块')}</span><button data-action="growth">查看</button></div>`}<form class="composer" id="composer"><label class="sr-only" for="message">告诉 Jarvis 今天的安排或完成情况</label><textarea id="message" maxlength="5000" placeholder="今晚 19 点到 20 点家庭聚餐，想做 AI 实验，连续跑了 5 天有点累…">${esc(draft)}</textarea><div class="composer-footer"><span>描述约束、改时间或补进展</span><button class="btn primary" type="submit">发送</button></div></form><div class="quick-actions">${!s.core.active.length?'<button data-action="example">试一段晨间描述</button>':'<button data-action="replan">按当前情况重新安排</button>'}${s.selected?'<button data-action="shorten">把这项缩短 15 分钟</button>':''}<button data-action="why">解释这次取舍</button></div></div><details class="agent-mode" data-keep="mode"><summary>原型模式 · 本地规则演示</summary><p>没有连接真实模型或 Google Calendar。可识别有限的中文时间、疲劳、时间预算和任务进展；不能理解的内容会要求补充。所有个人背景与验收均为虚构，刷新后清空。</p><p>本轮验证交互；正式 Agent 将读取同一计划与选中对象，返回受校验的提案。</p></details></aside>`;}
function evidence(){const p=progression(s.core);return `<section class="evidence-strip"><div class="evidence-heading"><h2>今天留下了什么</h2>${fb('reward')}</div><div><div class="evidence-items"><div><strong>${p.xp}</strong> 行动 XP<br><span>Lv.${p.level} · 累计 ${p.total} XP</span></div><div><strong>${modules.filter(m=>score(m,s).value!==null).length}/${modules.length}</strong> 模块有现状证据<br><span>在成长总览分别查看</span></div><div><strong>${Object.values(s.core.records).filter(r=>r.proof==='checked').length}</strong> 模拟验收记录<br><span>只有相关分项随证据变化</span></div></div><div class="evidence-log">${Object.entries(s.core.records).map(([id,r])=>`<details data-keep="record-${id}"><summary>${esc(task(id).name)} · ${r.status==='partial'?'部分完成':'已记录'} · ${r.xp} XP · ${r.proof==='checked'?(r.masteryEligible!==false?'完整能力模拟验收':'最小产物模拟验收'):'自述，待验证'}</summary><p>${esc(r.evidence)}</p><p>本任务累计投入 ${r.minutes} 分钟</p>${fb('evidence',modules.find(m=>m.taskIds.includes(id))?.id,id)}${r.status==='done'&&r.proof!=='checked'? button('模拟通过能力验收','verify',`data-id="${id}"`):''} ${button('撤回这条记录','remove-record',`data-id="${id}"`)}</details>`).join('')||'<p class="empty-evidence">完成、只推进了一部分，或调整了恢复安排，都可以直接告诉 Jarvis。</p>'}</div></div></section>`;}
function growth(){return moduleId?moduleDetail(modules,moduleId,s,moduleUI):overview(modules,s,moduleUI);}
function render(){const active=document.activeElement;const focusSelector=active?.dataset.contextId?`[data-context-id="${CSS.escape(active.dataset.contextId)}"]`:active?.dataset.journey?`[data-journey="${CSS.escape(active.dataset.journey)}"]${['mid','variant','task'].filter(key=>active.dataset[key]).map(key=>`[data-${key}="${CSS.escape(active.dataset[key])}"]`).join('')}`:active?.dataset.mod?`[data-mod="${CSS.escape(active.dataset.mod)}"]${active.dataset.mid?`[data-mid="${CSS.escape(active.dataset.mid)}"]`:''}`:active?.dataset.action?`[data-action="${CSS.escape(active.dataset.action)}"]${active.dataset.id?`[data-id="${CSS.escape(active.dataset.id)}"]`:''}`:active?.closest('form')&&active.type==='submit'?`#${active.closest('form').id} [type="submit"]`:null;const opened=[...document.querySelectorAll('details[open][data-keep]')].map(e=>e.dataset.keep);const oldScroll=document.querySelector('.calendar-scroll')?.scrollTop||0;const oldFocus=document.activeElement?.id;const selection=['message','module-message','new-module'].includes(oldFocus)?[document.activeElement.selectionStart,document.activeElement.selectionEnd]:null;app.innerHTML=`<header class="day-header"><div class="day-brand"><span class="brand-mark" aria-hidden="true">✧</span>Jarvis<span>.</span></div><nav class="day-nav" aria-label="主导航"><button data-action="today" class="${page==='today'?'active':''}" aria-current="${page==='today'?'page':'false'}">今日</button><button data-action="growth" class="${page==='growth'?'active':''}" aria-current="${page==='growth'?'page':'false'}">成长总览</button></nav><div class="day-status"><span class="desktop-status">个人顾问 · 成长远征</span><span class="tag">可试玩原型</span></div></header><main class="day-shell" id="main"><div class="day-heading"><div><h1 tabindex="-1">${page==='today'?'今天，推进一件真正重要的事。':moduleId?esc(modules.find(m=>m.id===moduleId).name)+' · 成长路线':'把想成为的自己，变成下一步。'}</h1><p>${page==='today'?'10 月 2 日 · 周五 · 样例日　每一步行动，都有自己的成长去向。':'你的个人上下文、现实参照与每一份证据，共同决定成长路线。'}</p></div>${page==='today'?button('模拟：临时打断','interrupt'):button('打开今日日历','today')}</div>${s.notice?`<div class="day-notice" role="status">${esc(s.notice)}</div>`:''}${contextPanel(modules,s,journeyUI)}${receiptHTML(journeyUI)}${page==='today'?`${dailyBoard(modules,s,journeyUI)}${questSession(s,journeyUI)}<div class="workspace">${rail()}${calendar()}${panel()}</div>${evidence()}${campReview(modules,s)}`:growth()}<footer class="day-footer"><span>本地演示 · 虚构个人背景 · 内存中保存 · 不含真实 AI 推理</span><span><a href="docs/ai-native-gamification.md" target="_blank">机制研究依据</a> · <a href="docs/ai-native-feedback-design.md" target="_blank">AI 协商设计研究</a> · <a href="variants.html?variant=C&step=1">原来的 A / B / C</a> · <button data-action="reset">重置示例</button></span></footer></main>${feedbackUI.active?feedbackDialog(feedbackUI.active,s,modules,feedbackUI.threads[feedbackKey(feedbackUI.active)]):''}`;for(const key of opened)document.querySelector(`details[data-keep="${CSS.escape(key)}"]`)?.setAttribute('open','');const cal=document.querySelector('.calendar-scroll');if(cal)cal.scrollTop=oldScroll;const chat=document.querySelector('.chat-history');if(chat)chat.scrollTop=chat.scrollHeight;if(selection){const el=document.getElementById(oldFocus);el?.focus();el?.setSelectionRange(...selection);}else if(focusSelector){const target=document.querySelector(focusSelector);(target||document.querySelector('h1'))?.focus({preventScroll:true});}document.querySelector('#announcement').textContent=s.notice;if(feedbackUI.active){document.querySelector('#feedback-dialog').showModal();}}
function updateDraft(event,remove=false){const {_draft,...item}=event;const p=s.proposal;p.events=p.events.filter(e=>e.id!==item.id);if(!remove)p.events.push(item);p.events.sort((a,b)=>a.start-b.start);const pending=p.events.filter(e=>e.taskId&&s.core.records[e.taskId]?.status!=='done');p.used=pending.reduce((n,e)=>n+e.end-e.start,0);p.energy=pending.reduce((n,e)=>n+(p.contracts?.[e.taskId]||task(e.taskId)).energy,0);s.notice='草案已更新；查看校验结果后确认入历。当前安排尚未改变。';}
function chat(text){syncModules();s=converse(s,text);draft='';render();}
function select(id){s.selected=id;editor={...s.events.find(e=>e.id===id)};render();document.querySelector('#event-editor input')?.focus();}
app.addEventListener('input',e=>{if(e.target.id==='message')draft=e.target.value;if(e.target.closest('#event-editor')){const f=e.target.closest('form');editor={...editor,title:f.elements.title.value,start:minutes(f.elements.start.value),end:minutes(f.elements.end.value)};}});
app.addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='composer'){if(draft.trim())chat(draft.trim());return;}if(e.target.id==='event-editor'){if(editor._draft){updateDraft(editor);editor=null;render();return;}const old=s.revision;s=editEvent(s,editor);if(s.revision!==old)editor=null;render();}});
app.addEventListener('keydown',e=>{if(e.target.id==='message'&&e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();if(draft.trim())chat(draft.trim());}});
app.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;if(b.closest('form'))e.preventDefault();const a=b.dataset.action,id=b.dataset.id;s.notice='';
 if(a==='today'||a==='growth'){page=a;if(a==='growth')moduleId=null;render();window.scrollTo(0,0);document.querySelector('h1')?.focus({preventScroll:true});return;}
 if(a==='select'){select(id);return;}
 if(a==='slot'||a==='add'){const start=Number(b.dataset.time)||660;editor={title:'',start,end:Math.min(start+30,END),kind:'fixed'};s.selected=null;render();document.querySelector('#event-editor input')?.focus();return;}
 if(a==='close-editor')editor=null;
 if(a==='delete-event'){if(editor._draft)updateDraft(editor,true);else s=editEvent(s,editor,true);editor=null;s.selected=null;}
 if(a==='unselect'){s.selected=null;editor=null;}
 if(a==='draft-event'){editor={...s.proposal.events.find(e=>e.id===id),_draft:true};render();document.querySelector('#event-editor input')?.focus();return;}
 if(a==='show-calendar'){document.querySelector('.calendar')?.scrollIntoView({block:'start'});return;}
 if(a==='accept'){s=accept(s);editor=null;}
 if(a==='discard'){s.proposal=null;s.waiting=null;s.notice='草案已放弃，当前日历未改变。';}
 if(a==='discard-record')s.recordDraft=null;
 if(a==='save-record'){const id=s.recordDraft?.id,before=s.core.records[id]?.xp||0;s=record(s,s.recordDraft);if(id)makeReceipt(id,before);}
 if(a==='example'){chat('今晚19点到20点家庭聚餐，今天想做Agent实践，连续跑了5天，有点累。');return;}
 if(a==='replan'){chat('按现在的情况重新安排');return;}
 if(a==='shorten'){chat('把这个缩短15分钟');return;}
 if(a==='why'){chat('为什么这样安排？');return;}
 if(a==='report'){draft=`${task(id).name}，`;render();document.querySelector('#message')?.focus();return;}
 if(a==='interrupt'){s.now=1020;s.messages.push({role:'user',text:'模拟打断：已经 17:00，今天只剩 60 分钟成长时间，而且有点累。'});s.proposal=propose(s,{context:{budget:60,energy:4,fatigue:true}},'模拟临时打断：保留记录，按剩余空档安排');s.notice='模拟时间已到 17:00，重新安排的草案尚未生效。';}
 if(a==='undo'){s.events=s.lastPlan;s.lastPlan=null;s.core.active=s.events.filter(e=>e.taskId).map(e=>e.taskId);s.revision++;s.notice='日历已撤销一次；完成记录与当前偏好保留，旧提案需要重排。';editor=null;}
 if(a==='verify'){const before=s.core.records[id]?.xp||0;s=record(s,{id,...s.core.records[id],baseRevision:s.revision},true);makeReceipt(id,before);}
 if(a==='remove-record'){s.core=act(s.core,{type:'removeRecord',id});s.revision++;s.notice=s.core.notice;}
 if(a==='measurement'||a==='claim'||a==='reward'){s.core=act(s.core,{type:a,value:b.dataset.value});s.notice=s.core.notice;}
 if(a==='reset'){feedbackUI.active=null;feedbackUI.threads={};s=newDay();s.personal=createPersonal();Object.assign(journeyUI,{variants:{},context:false,session:null,receipt:null,anchor:'',evidence:undefined,checkpoints:undefined,minutes:undefined,hint:false});editor=null;draft='';modules=newModules();moduleId=null;syncModules();moduleUI.chat={};moduleUI.create=false;moduleUI.referenceEditor=false;page='growth';render();window.scrollTo(0,0);document.querySelector('h1')?.focus({preventScroll:true});return;}
 render();
});
app.addEventListener('dragstart',e=>{const el=e.target.closest('.event:not(.proposed)');if(el){e.dataTransfer.setData('text/plain',el.dataset.id);e.dataTransfer.effectAllowed='move';}});
app.addEventListener('dragover',e=>{if(e.target.closest('.day-lane:not(.pending)'))e.preventDefault();});
app.addEventListener('drop',e=>{const lane=e.target.closest('.day-lane:not(.pending)');if(!lane)return;e.preventDefault();const id=e.dataTransfer.getData('text/plain'),event=s.events.find(x=>x.id===id);if(!event)return;const start=START+Math.round((e.clientY-lane.getBoundingClientRect().top)/1.2/15)*15;s.proposal=propose(s,{move:{id,start,end:start+event.end-event.start}},`拖动「${event.title}」到 ${clock(start)}`);s.selected=id;s.notice='拖动已成为待确认提案。查看具体时段与冲突后，再确认入历。';render();});
function syncModules(){s.moduleRoutes=routes(modules,s);s.core.moduleTaskIds=modules.flatMap(m=>m.taskIds);}
function replaceModule(m){modules=modules.map(x=>x.id===m.id?m:x);syncModules();}
function openModule(id,pane='document'){moduleUI.mobilePane=pane;moduleId=id;page='growth';moduleUI.referenceEditor=false;moduleUI.create=false;render();window.scrollTo(0,0);document.querySelector('h1')?.focus({preventScroll:true});}
app.addEventListener('input',e=>{if(e.target.id==='module-message')moduleUI.chat[moduleId]=e.target.value;if(e.target.id==='new-module')moduleUI.createText=e.target.value;if(e.target.closest('#reference-form')){const f=e.target.closest('form');moduleUI.referenceName=f.elements.name.value;moduleUI.referenceURL=f.elements.url.value;}});
app.addEventListener('change',e=>{if(e.target.id==='module-switch')openModule(e.target.value);});
app.addEventListener('submit',e=>{
 try{
 if(e.target.id==='module-create'){const m=newModule(moduleUI.createText);if(modules.some(x=>x.name===m.name))throw Error('已有同名模块，请打开现有模块继续讨论。');modules.push(m);syncModules();moduleUI.createText='';s.notice='新模块已建立。背景不足，Jarvis 先保留未知，再建议如何补齐。';openModule(m.id);return;}
 if(e.target.id==='reference-form'){const m=modules.find(x=>x.id===moduleId),reference=customReference(e.target.elements.name.value,e.target.elements.url.value);replaceModule(analyzeModule(m,s,reference));moduleUI.referenceEditor=false;render();return;}
 if(e.target.id==='module-chat'){const text=(moduleUI.chat[moduleId]||'').trim();if(!text)return;let m=modules.find(x=>x.id===moduleId);const ref=(REFERENCES[m.id]||[]).find(r=>text.toLowerCase().includes(r.name.toLowerCase())||text.toLowerCase().includes(r.id));if(ref||/分析|评估|现状|量化|gap/i.test(text)){m=analyzeModule(m,s,ref||m.benchmark,text);m.messages.push({role:'user',text},{role:'assistant',text:'目标、可比差距与阶段路线已整理为待确认分析。先看证据和未知项，再决定是否采用。'});}else m=discuss(m,text);replaceModule(m);moduleUI.chat[moduleId]='';render();return;}
 }catch(err){s.notice=err.message;render();}
});
app.addEventListener('click',e=>{const el=e.target.closest('[data-mod]');if(!el)return;e.preventDefault();const a=el.dataset.mod,id=el.dataset.mid;let m=modules.find(x=>x.id===(id||moduleId));s.notice='';
 try{
 if(a==='overview'){moduleId=null;page='growth';moduleUI.create=false;render();window.scrollTo(0,0);document.querySelector('h1')?.focus({preventScroll:true});return;}
 if(a==='open'){openModule(id);return;}
 if(a==='pane'){moduleUI.mobilePane=el.dataset.pane;render();document.querySelector(`[data-mod="pane"][data-pane="${moduleUI.mobilePane}"]`)?.focus({preventScroll:true});return;}
 if(a==='new'){moduleUI.create=true;render();document.querySelector('#new-module')?.focus();return;}
 if(a==='cancel-create')moduleUI.create=false;
 if(a==='toggle-paused')moduleUI.showPaused=!moduleUI.showPaused;
 if(a==='analyze'||a==='reference'){const reference=a==='reference'?REFERENCES[m.id].find(x=>x.id===el.dataset.ref):m.benchmark;replaceModule(analyzeModule(m,s,reference));openModule(m.id,'jarvis');document.querySelector('.module-proposal [data-mod="confirm"]')?.focus();return;}
 if(a==='confirm'){if(m.proposal?.dayRevision!==undefined&&m.proposal.dayRevision!==s.revision)throw Error('证据或日历已变化，请重新分析。');replaceModule(confirmModule(m));s.notice='模块分析已确认。总览与路线同步更新，日历和行动 XP 保留。';}
 if(a==='discard'){replaceModule({...m,proposal:null});s.notice='已保留当前模块，提案未采用。';}
 if(a==='pause'){replaceModule({...m,status:m.status==='active'?'paused':'active',revision:m.revision+1});s.revision++;s.notice='模块状态已更新，已有日历与证据保留；日历旧草案需要重排。';}
 if(a==='next'){replaceModule(discuss(m,'下一阶段怎么走？'));}
 if(a==='discuss-reference'){moduleUI.mobilePane='jarvis';moduleUI.chat[m.id]='想讨论一个更合适的榜样';render();document.querySelector('#module-message')?.focus();return;}
 if(a==='custom-ref'){moduleUI.referenceEditor=!moduleUI.referenceEditor;render();document.querySelector('#reference-form input')?.focus();return;}
 if(a==='schedule'){if(!canSchedule(m,el.dataset.task,s))throw Error('先补齐前置能力证据，再进入这一阶段。');if(m.status==='paused')throw Error('先恢复模块，再推荐新任务。');syncModules();s.proposal=propose(s,{taskIds:[el.dataset.task],contracts:{[el.dataset.task]:challenge(el.dataset.task)}},`围绕「${m.name}」的阶段缺口安排`);page='today';s.notice='已生成包含模块任务的日历草案，确认后生效。';render();document.querySelector('[data-action="accept"]')?.focus();return;}
 render();
 }catch(err){s.notice=err.message;render();}
});
render();

function makeReceipt(id,before=0){const r=s.core.records[id];if(!r)return;journeyUI.receipt={id,title:task(id).name,xp:r.xp,delta:r.xp-before,partial:r.status==='partial',proven:r.status==='done'&&r.proof==='checked'&&r.masteryEligible!==false};}
function missionProposal(context={}){
 syncModules();const active=modules.filter(m=>m.status==='active').sort((a,b)=>(b.id==='agent')-(a.id==='agent'));
 const candidate={...s,core:{...s.core,...context}};const contracts=Object.fromEntries(active.map(m=>{const t=nextMission(m,candidate);return [t.id,challenge(t.id,journeyUI.variants[m.id]||'standard')];}));
 s.proposal=propose(s,{taskIds:Object.keys(contracts),contracts,context:{...context,startAnchor:journeyUI.anchor||'午饭后，打开上一轮作品，先做第一个检查点。'}},'围绕个人差距，选择今天的挑战合约');
 s.notice='任务难度、产物与奖励已放入草案；确认后才成为今日合约。';
}
app.addEventListener('input',e=>{
 if(e.target.id==='start-anchor')journeyUI.anchor=e.target.value;
 if(e.target.id==='context-description')journeyUI.contextText=e.target.value;
 if(e.target.closest('#quest-record-form')){const f=e.target.closest('form');journeyUI.evidence=f.querySelector('#quest-evidence').value;journeyUI.minutes=f.elements.minutes.value;journeyUI.checkpoints=[...f.querySelectorAll('[name="checkpoint"]:checked')].map(x=>x.value);journeyUI.difficulty=f.elements.difficulty.value;}
});
app.addEventListener('change',e=>{if(!e.target.dataset.contextId)return;const f=s.personal.facts.find(x=>x.id===e.target.dataset.contextId);if(!f)return;f.enabled=e.target.checked;s.personal.revision++;s.revision++;s.notice='本次分析可使用的背景已更新；旧提案需重新分析。';render();});
app.addEventListener('click',e=>{
 const el=e.target.closest('[data-journey]');if(!el)return;e.preventDefault();const a=el.dataset.journey;
 if(a==='variant'){journeyUI.variants[el.dataset.mid]=el.dataset.variant;s.notice='已选择候选难度；已确认的合约保留，重新生成草案后才会改变。';}
 if(a==='context')journeyUI.context=!journeyUI.context;
 if(a==='plan'||a==='adapt'){if(a==='adapt')modules.forEach(m=>{if(m.taskIds.some(id=>s.core.records[id]?.status==='partial'||s.core.records[id]?.difficulty==='hard'))journeyUI.variants[m.id]='minimum';});missionProposal();editor=null;}
 if(a==='start'){
  const id=el.dataset.task;if(!s.core.active.includes(id)){s.notice='先确认包含这项挑战的日历。';render();return;}
  journeyUI.session=id;journeyUI.sessionRevision=s.revision;journeyUI.hint=false;journeyUI.evidence=undefined;journeyUI.minutes=undefined;journeyUI.checkpoints=undefined;journeyUI.difficulty='fit';
 }
 if(a==='close-session')journeyUI.session=null;
 if(a==='hint')journeyUI.hint=!journeyUI.hint;
 if(a==='dismiss-receipt')journeyUI.receipt=null;
 render();
 const target=a==='plan'||a==='adapt'?'.proposal':a==='start'?'.quest-session':a==='context'&&journeyUI.context?'.personal-context':null;
 if(target){document.querySelector(target)?.scrollIntoView({block:'start'});if(a==='start')document.querySelector('#quest-evidence')?.focus({preventScroll:true});if(a==='plan'||a==='adapt')document.querySelector('[data-action="accept"]')?.focus({preventScroll:true});}
 if(a==='variant')document.querySelector(`[data-journey="variant"][data-mid="${CSS.escape(el.dataset.mid)}"][data-variant="${el.dataset.variant}"]`)?.focus({preventScroll:true});
});
app.addEventListener('submit',e=>{
 try{
 if(e.target.id==='personal-context-form'){s=updateContext(s,journeyUI.contextText,e.target.elements.scope.value);journeyUI.contextText='';render();document.querySelector('#context-description')?.focus({preventScroll:true});}
 if(e.target.id==='capacity-form'){
  const f=e.target, budget=Number(f.elements.budget.value),energy=Number(f.elements.energy.value);if(!Number.isInteger(budget)||budget<15||budget>240||!Number.isInteger(energy)||energy<1||energy>10)throw Error('时间需为 15–240 分钟，精力需为 1–10 的整数。');
  missionProposal({budget,energy,fatigue:f.elements.fatigue.checked});journeyUI.context=false;render();document.querySelector('.proposal')?.scrollIntoView({block:'start'});
 }
 if(e.target.id==='quest-record-form'){
  const f=e.target,id=journeyUI.session,before=s.core.records[id]?.xp||0,revision=s.revision;const checkpoints=[...f.querySelectorAll('[name="checkpoint"]:checked')].map(x=>x.value),evidence=f.querySelector('#quest-evidence').value.trim(),spent=Number(f.elements.minutes.value);
  if(evidence.length<8||evidence.length>2000||!Number.isFinite(spent)||spent<0||spent>480)throw Error('请留下至少 8 个字的真实进展，并核对实际时长。');
  s=record(s,{id,evidence,minutes:spent,checkpoints,baseRevision:journeyUI.sessionRevision});
  if(s.revision!==revision){s.core.records[id].difficulty=f.elements.difficulty.value;makeReceipt(id,before);journeyUI.session=null;}
  render();document.querySelector('.evidence-receipt')?.scrollIntoView({block:'start'});document.querySelector('[data-journey="dismiss-receipt"]')?.focus({preventScroll:true});
 }
 }catch(err){s.notice=err.message;render();}
});

function closeFeedback(){
 const d=feedbackUI.active;feedbackUI.active=null;const dialog=document.querySelector('#feedback-dialog');dialog?.close();dialog?.remove();const entry=[...document.querySelectorAll('[data-feedback]')].find(el=>el.dataset.feedback===d.scope&&el.dataset.feedbackMid===(d.mid||'')&&el.dataset.feedbackItem===(d.item||'')&&el.dataset.feedbackDetail===(d.detail||''));(entry||feedbackUI.opener)?.focus({preventScroll:true});
}
function renderFeedback(focusMessage=false){
 const old=document.querySelector('#feedback-dialog'),scroll=old?.querySelector('.feedback-body')?.scrollTop||0;
 const opened=old?.querySelector('[data-keep="feedback-basis"]')?.open;
 old?.remove();app.insertAdjacentHTML('beforeend',feedbackDialog(feedbackUI.active,s,modules,feedbackUI.threads[feedbackKey(feedbackUI.active)]));
 const dialog=document.querySelector('#feedback-dialog');dialog.showModal();dialog.querySelector('.feedback-body').scrollTop=scroll;
 if(opened)dialog.querySelector('[data-keep="feedback-basis"]').open=true;
 if(focusMessage)dialog.querySelector('#feedback-message').focus({preventScroll:true});
}
function sendFeedback(){
 const d=feedbackUI.active,thread=feedbackUI.threads[feedbackKey(d)],text=thread.draft.trim();if(!text)return;
 thread.error='';thread.agreement=null;thread.messages.push({role:'user',text});
 try{const result=reply(d,text,s,modules,thread);thread.messages.push({role:'assistant',text:result.text});thread.proposal=result.proposal||null;thread.draft='';}
 catch(err){thread.error=err.message;}
 renderFeedback(true);document.querySelector('.feedback-proposal')?.scrollIntoView({block:'start'});
}
app.addEventListener('cancel',e=>{if(e.target.id==='feedback-dialog'){e.preventDefault();closeFeedback();}},true);
app.addEventListener('input',e=>{if(e.target.id==='feedback-message'&&feedbackUI.active)feedbackUI.threads[feedbackKey(feedbackUI.active)].draft=e.target.value;});
app.addEventListener('submit',e=>{if(e.target.id==='feedback-form'){e.preventDefault();sendFeedback();}});
app.addEventListener('keydown',e=>{if(e.target.id==='feedback-message'&&e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();sendFeedback();}});
app.addEventListener('click',e=>{
 const entry=e.target.closest('[data-feedback]');
 if(entry){e.preventDefault();const d={scope:entry.dataset.feedback,mid:entry.dataset.feedbackMid,item:entry.dataset.feedbackItem,detail:entry.dataset.feedbackDetail};feedbackUI.active=d;feedbackUI.opener=entry;feedbackUI.threads[feedbackKey(d)]||={messages:[],draft:'',proposal:null};renderFeedback(true);return;}
 if(!feedbackUI.active)return;
 const thread=feedbackUI.threads[feedbackKey(feedbackUI.active)],prompt=e.target.closest('[data-feedback-prompt]'),control=e.target.closest('[data-feedback-control]');
 if(prompt){thread.draft=prompt.dataset.feedbackPrompt;renderFeedback(true);return;}
 if(!control)return;e.preventDefault();thread.error='';const a=control.dataset.feedbackControl;
 if(a==='close'){closeFeedback();return;}
 try{
  if(a==='reject'){thread.proposal=null;thread.messages.push({role:'assistant',text:'这份修订已放弃，对应对象保留原状。可以继续提出其他方案。'});}
  if(a==='agree'){thread.agreement=versions(s,modules);thread.messages.push({role:'user',text:'我认可当前版本的判断。'});}
  if(a==='confirm'){
   const previous={day:structuredClone(s),modules:structuredClone(modules)},result=applyFeedback(thread.proposal,s,modules);
   s=result.day;modules=result.modules;syncModules();thread.proposal=null;thread.agreement=versions(s,modules);thread.undo={...previous,version:thread.agreement};
   thread.messages.push({role:'assistant',text:'你确认了这份修订；对应内容已经更新。新的资料出现时，我们再重新判断。'});
   editor=null;journeyUI.receipt=null;render();return;
  }
  if(a==='undo'){const result=undoFeedback(thread.undo,s,modules);s=result.day;modules=result.modules;syncModules();thread.undo=null;thread.agreement=null;thread.messages.push({role:'assistant',text:'已撤销这次修订；对话继续保留。'});render();return;}
 }catch(err){thread.error=err.message;}
 renderFeedback();
});
