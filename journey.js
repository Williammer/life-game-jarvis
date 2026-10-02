import {task,progression} from './model.js';
import {values,gap} from './module-model.js';

// ponytail: curated, inspectable coaching fixtures; replace advice generation with grounded Agent actions when a real model is connected.
export const DOMAIN={
 agent:{icon:'◇',color:'indigo',role:'Agent 工程顾问',question:'把一次可靠行动，做成可回放的作品。',source:'BuilderIO agent-native 官方作品',url:'https://github.com/BuilderIO/agent-native',support:'用明确契约、确认边界与失败测试衡量作品；不按阅读时长推断掌握。'},
 running:{icon:'↗',color:'teal',role:'运动与恢复教练',question:'维持节奏，也给身体恢复的空间。',source:'NHS Couch to 5K',url:'https://www.nhs.uk/better-health/get-active/get-running-with-couch-to-5k/',support:'入门项目包含休息日。个人强度需结合负荷、身体反馈与专业意见。'},
 parenting:{icon:'⌂',color:'amber',role:'家庭与育儿顾问',question:'看见彼此，比多做一件事更有价值。',source:'WHO 育儿干预指南 · 2023',url:'https://www.who.int/publications/i/item/9789240065505',support:'关注关系与父母可控行为；孩子年龄与家庭安排未知时，先观察，不给处方。'}
};
export const domain=m=>DOMAIN[m.id]||{icon:'✧',color:'indigo',role:'成长研究顾问',question:'先找到你的起点，再选择有意义的一步。',source:'尚未研究领域依据',url:null,support:'先收集基线与可核验成果，不凭模块名称推断个人水平。'};
export function createPersonal(){return {facts:[
 {id:'practice',scope:'agent',label:'学习方式',text:'有 Web 开发基础，更喜欢做出小作品再补概念。',source:'示例个人自述',date:'2026-09-26',enabled:true},
 {id:'failure',scope:'agent',label:'最近卡点',text:'工具契约已经写好；上一轮重试可能造成重复写入，尚无拒绝路径测试。',source:'示例实验日志',date:'2026-09-30',enabled:true},
 {id:'agent-goal',scope:'agent',label:'长期意愿',text:'能独立交付一个可靠的个人 Agent，而非只复制演示代码。',source:'示例已确认目标',date:'2026-09-26',enabled:true},
 {id:'load',scope:'running',label:'近期负荷',text:'近期连续活动，今天自述有些疲劳；具体负荷和伤病史尚未提供。',source:'示例晨间自述',date:'2026-10-02',enabled:true},
 {id:'running-base',scope:'running',label:'可比较基线',text:'示例马拉松 4:00:00；规律活动 2 次/周。赛事条件尚待复核。',source:'虚构历史记录',date:'2026-09-26',enabled:true},
 {id:'recovery',scope:'running',label:'恢复偏好',text:'愿意在疲劳日减量，优先建立能长期维持的节奏。',source:'示例个人偏好',date:'2026-09-26',enabled:true},
 {id:'family-values',scope:'parenting',label:'家庭价值',text:'希望有无设备的专注陪伴，先听孩子想说什么，冲突后愿意修复。',source:'示例家庭意愿',date:'2026-09-26',enabled:true},
 {id:'family-window',scope:'parenting',label:'照护安排',text:'18:00 接孩子；晚间陪伴只占本人可控的时间，不要求孩子配合完成任务。',source:'示例日程',date:'2026-10-02',enabled:true},
 {id:'time',scope:'all',label:'今日容量',text:'工作与照护之外，今天可给成长 90 分钟；希望留一些缓冲。',source:'示例晨间确认',date:'2026-10-02',enabled:true},
 {id:'reward',scope:'all',label:'庆祝偏好',text:'想用一段自由探索时间庆祝一个真实作品进展，不追求排行榜。',source:'示例个人偏好',date:'2026-09-26',enabled:true}
 ],revision:0};}
export function contextFor(m,day){return (day.personal?.facts||[]).filter(f=>f.enabled&&(f.scope==='all'||f.scope===m.id));}
export function nextMission(m,day){
 if(m.id==='running')return task(day.core.fatigue?'recover':'run');
 const metrics=values(m,day);const unmet=metrics.find(x=>x.taskId&&!(x.value!==null&&x.value>=x.target));
 return task(unmet?.taskId||m.defaultTaskId||m.taskIds[0]);
}
export function gates(m,day){return values(m,day).map((x,i)=>({id:x.id,title:x.name,done:x.value!==null&&x.value>=x.target,unknown:x.value===null,taskId:x.taskId,index:i}));}
export function canSchedule(m,id,day){if(m.id!=='agent')return true;const list=gates(m,day),index=list.findIndex(x=>x.taskId===id);return index<0||list.slice(0,index).every(x=>x.done);}
export function challenge(id,variant='standard'){
 const t=task(id);if(!t)throw Error('找不到这项任务。');if(!['minimum','standard','stretch'].includes(variant))throw Error('请选择可用的挑战难度。');
 const engineering=id.startsWith('agent-');const rest=id==='recover',family=id==='family';
 const standards={
 'agent-action':['变更先展示为提案','拒绝后原数据保持不变','重复确认只写入一次'],
 'agent-eval':['参数错误不产生写入','用户拒绝保持原数据','重试不重复写入'],
 'agent-pilot':['保留输入与工具结果','串起提案、确认和结果','回放一次并解释失败点'],
 recover:['记录身体感受','完成自己选择的恢复安排'],
 run:['按已确认的适宜安排活动','记录时长、感受与环境'],
 family:['留出约定的专注时间','记录自己倾听或回应的一件事']
 };
 let checks=standards[id]||['留下当前起点与限制','完成一个约定产物','记录下一步需要的证据'];
 let minutes=t.minutes,energy=t.energy,xp=t.xp,standard=t.standard;
 if(variant==='minimum'){
 minutes=engineering?15:rest?10:family?5:Math.min(15,t.minutes);energy=1;xp=engineering?15:rest?10:family?8:15;
 checks=engineering?['定位一个写入边界','留下下一次可继续的提案或失败观察']:rest?['记录感受并选一个恢复动作']:family?['认真听一次，并记录自己的回应']:['留下一个可继续的检查点'];
 standard=checks.join('；');
 }else if(variant==='stretch'){
 minutes=engineering?t.minutes+15:t.minutes;energy=engineering?t.energy+1:t.energy;xp=engineering?t.xp+5:t.xp;
 checks=[...checks,engineering?'再解释一个反例，记录工具帮助的范围':'写下下次如何调整，保持当前活动强度'];standard=checks.join('；');
 }
 return {taskId:id,variant,label:{minimum:'最小一步',standard:'标准挑战',stretch:engineering?'进阶尝试':'深入观察'}[variant],minutes,energy,xp,standard,masteryEligible:engineering&&variant!=='minimum',checkpoints:checks.map((title,i)=>({id:`${id}-${variant}-${i}`,title})),starter:engineering?'先打开上一轮作品，写出一次可能重复写入的场景。':rest?'先问自己今天身体哪里紧张、哪里不适。':family?'放下设备，问一个愿意认真听的问题。':'先写下目前的起点和一个可核验成果。'};
}
export function advisor(m,day){
 const t=nextMission(m,day),facts=contextFor(m,day),comparison=gap(m,day);const has=id=>facts.some(f=>f.id===id);
 let insight,why,missing,next;
 if(m.id==='agent'){
 insight=t.id==='agent-eval'?'受控写入已有证据，现在让失败也有可靠的行为。':t.id==='agent-pilot'?'失败路径已有证据，下一步把全过程变得可回放。':has('failure')?'上一轮的重复写入，是今天最值得解决的真实缺口。':'先补作品中的受控行动证据，让能力可以被检验。';
 why=has('practice')?'你有开发基础、偏好作品驱动，因此建议动手验证，暂缓泛读。':'学习方式尚待确认，先用一个小产物建立基线。';
 missing='还需要真实代码、运行结果、使用了哪些 AI 帮助；自述不能证明可靠性。';
 next=`${t.name}。验收后再进入下一个证据关卡，不用 XP 代替能力。`;
 }else if(m.id==='running'){
 insight=day.core.fatigue?'今天的进展，可以是一次认真恢复。':'今天先按适宜计划活动，观察节奏是否可持续。';
 why=has('load')?'结合近期活动与今日疲劳描述，恢复比强行加量更适合作为候选。':'近期负荷资料未授权或缺失；疲劳仅按今日确认状态处理，不推断原因。';
 missing='伤病史、具体负荷、近期睡眠及赛事条件未确认；不预测训练收益。';
 next='活动与恢复记录让下一次建议更准确；马拉松差距只由同口径新测量更新。';
 }else if(m.id==='parenting'){
 insight=has('family-values')?'把这次陪伴变成一次倾听，而不是另一项绩效。':'先观察自己的陪伴方式，再和家人讨论期待。';
 why=has('family-window')?'接孩子的固定安排已占时间，候选任务放在晚间空档，保持轻量。':'先确认家庭的可用窗口；任何安排仍要由你确认。';
 missing='孩子年龄、共同养育安排与家人意见待补；暂不选择人物量化高线。';
 next='记录自己的回应和一项观察。不以孩子听话、成绩或情绪换积分。';
 }else{insight='先留下你的起点，才能给出贴身的建议。';why='领域背景不足，这次只安排一个可讨论的基线产物。';missing='个人现状、专业来源与可比参照都待确认。';next='有证据后再评估目标、难度和路线。';}
 return {insight,why,missing,next,facts,gap:comparison,task:t};
}
export function reviewDay(modules,day){
 const p=progression(day.core);const planned=day.events.filter(e=>e.taskId);const entries=Object.entries(day.core.records);const known=entries.filter(([,r])=>Number.isFinite(r.minutes));
 const allocated=planned.reduce((n,e)=>n+e.end-e.start,0),actual=known.reduce((n,[,r])=>n+r.minutes,0);const checked=entries.filter(([,r])=>r.proof==='checked'&&r.masteryEligible!==false).length;
 const missing=planned.filter(e=>!day.core.records[e.taskId]);const needsReduction=entries.some(([,r])=>r.difficulty==='hard'||r.status==='partial');const next=modules.find(m=>m.id==='agent'&&m.status==='active')||modules.find(m=>m.status==='active');
 return {needsReduction,allocated,actual,buffer:Math.max(0,day.core.budget-allocated),count:planned.length,recorded:entries.length,unrecorded:missing.length,checked,xp:p.xp,
 planning:planned.length?`已安排 ${allocated} / ${day.core.budget} 分钟，${allocated>day.core.budget?'容量已超出，建议减量':`保留 ${Math.max(0,day.core.budget-allocated)} 分钟余量`}。${day.core.fatigue?'恢复优先，避免用进阶任务填满空档。':'强度仍需按当时状态复核。'}`:'尚未确认成长安排。先选一个值得推进的产物，再留出恢复与照护空间。',
 completion:entries.length?`已记录 ${entries.length} 项，累计投入 ${actual} 分钟；${checked} 项完整能力模拟验收。${missing.length?`${missing.length} 项尚未记录，不能判为失败。`:'自述与验收分开保留。'}`:'尚无行动记录。可以记部分完成或有效失败，不必等全部做完。',
 suggestion:needsReduction?'这次出现了未完成检查点或吃力反馈。建议下一轮先减量，保留已有产物，用一个最小实验定位障碍；确认后再调整日历。':next?advisor(next,day).next:'所有模块已暂停；保留记录，按需要恢复。',nextId:next?.id,
 learning:entries.some(([,r])=>r.status==='partial')?'今天已经留下检查点。下一次从未完成的一步继续，先缩范围，再讨论增加时间。':checked?'一个证据关卡已通过。下一次增加的是验证深度，不是简单堆时长。':'先保留真实观察。行动 XP 已认可投入，真实成长还需要对应的证据。'};
}
export function updateContext(day,description,scope){
 if(!['all',...(day.moduleRoutes||[]).map(r=>r.id)].includes(scope))throw Error('请选择当前生活模块。');
 const text=String(description||'').trim();if(text.length<6||text.length>600)throw Error('请用 6–600 个字说明背景、限制或最近一次经历。');
 const next=structuredClone(day);next.personal=next.personal||createPersonal();next.personal.facts.push({id:crypto.randomUUID(),scope,label:'本次补充',text,source:'本人在原型中提供 · 尚未专业评估',date:'2026-10-02',enabled:true});next.personal.revision++;next.revision++;next.notice='背景已补充；旧评估与计划提案需基于新背景重新生成。';return next;
}
