// Throwaway prototype: values describe a fictional person, not the user's health or skill.
export const TASKS = [
  { id: 'recover', name: '恢复与身体观察', module: '健康', minutes: 20, energy: 1, xp: 20, contribution: 2, weight: 3, outcome: '留下一次恢复记录', gap: '训练节奏与恢复证据', standard: '记录今日身体感受与恢复安排', kind: 'rest' },
  { id: 'run', name: '完成一次轻松跑', module: '健康', minutes: 35, energy: 4, xp: 30, contribution: 3, weight: 3, outcome: '记录可比较的活动数据', gap: '规律活动记录', standard: '按已确认计划活动并记录感受', kind: 'run' },
  { id: 'read', name: '读懂一个反向传播例子', module: 'AI 实践', minutes: 30, energy: 2, xp: 20, contribution: 1, weight: 4, outcome: '写出自己的计算图解释', gap: '可解释的计算图', standard: '用自己的话解释三个节点的梯度', kind: 'read' },
  { id: 'build', name: '实现梯度累加的小实验', module: 'AI 实践', minutes: 45, energy: 3, xp: 40, contribution: 3, weight: 4, outcome: '一份可运行的最小实验', gap: '反向传播实现证据', standard: '完成共享节点的梯度累加，并解释原因', kind: 'build' },
  { id: 'review', name: '为梯度实验补上数值检查', module: 'AI 实践', minutes: 25, energy: 2, xp: 25, contribution: 2, weight: 4, outcome: '一份可复现的检查记录', gap: '数值验证证据', standard: '写出预期值、实际值和至少一个失败案例', kind: 'review' },
  { id: 'family', name: '留一段专心陪伴的时间', module: '育儿', minutes: 15, energy: 1, xp: 15, contribution: 2, weight: 2, outcome: '一条自己的陪伴反思', gap: '关注自己的可控行动', standard: '按约定投入陪伴，记录自己的观察', kind: 'family' },
];
export const SOURCES = {
  micrograd: 'https://github.com/karpathy/micrograd',
  gary: 'https://www.nhs.uk/better-health/get-active/get-running-with-couch-to-5k/',
  kipchoge: 'https://worldathletics.org/news/report/eliud-kipchoge-world-record-berlin-marathon-2022',
};
export function fresh() {
  return { budget: 90, energy: 7, fatigue: true, fixed: '10:00 工作会议；18:00 接孩子', wish: '让 AI 学习留下一个能运行的小作品', draft: ['recover','build','family'], active: [], revision: 0, records: {}, historyXP: 120, marathon: 14400, reward: '一本想读的书', claimed: false, notice: '', scenario: '普通日', selectedNode: 'backprop' };
}
export const task = id => TASKS.find(t => t.id === id);
export function priority(t, s) {
  const fit = t.id === 'run' && s.fatigue ? .35 : t.id === 'read' ? .7 : 1;
  return { fit, value: Math.round(t.weight * t.contribution * fit / t.minutes * 100) };
}
export function totals(ids) {
  return [...new Set(ids)].reduce((sum, id) => { const t = task(id); return { minutes: sum.minutes+t.minutes, energy: sum.energy+t.energy, xp: sum.xp+t.xp }; }, {minutes:0,energy:0,xp:0});
}
export function issues(s) {
  const use=totals(s.draft), errors=[];
  if (!s.draft.length) errors.push('先选择至少一个任务');
  if (use.minutes > s.budget) errors.push(`超过可用时间 ${use.minutes-s.budget} 分钟`);
  if (use.energy > s.energy) errors.push(`超过精力预算 ${use.energy-s.energy} 格`);
  if (s.draft.includes('run') && s.draft.includes('recover')) errors.push('本次演示请在跑步与恢复之间选择一条路线');
  return errors;
}
export function progression(s) {
  const records=Object.values(s.records);
  const xp=records.reduce((n,r)=>n+r.xp,0);
  const proven=id=>s.records[id]?.status==='done' && s.records[id]?.proof==='checked' && s.records[id]?.masteryEligible!==false;
  const skills=['计算图解释'];
  if(proven('build')) skills.push('反向传播实现');
  if(proven('review') && proven('build')) skills.push('数值检查');
  return { xp, total:s.historyXP+xp, level:Math.floor((s.historyXP+xp)/100)+1, skills, completed:records.filter(r=>r.status==='done').length, partial:records.filter(r=>r.status==='partial').length, eligible:xp>=60 && (s.moduleTaskIds?s.moduleTaskIds.some(proven):skills.length>=2), gap:s.marathon-7269 };
}
export function act(state, action) {
  const s=structuredClone(state); s.notice='';
  if(action.type==='toggle') {
    if(!task(action.id)) return state;
    s.draft=s.draft.includes(action.id)?s.draft.filter(id=>id!==action.id):[...s.draft,action.id];
  } else if(action.type==='plan') {
    const presets={balanced:['recover','build','family'],deep:['build','review','family'],light:['recover','read','family']};
    if(presets[action.id]) s.draft=[...presets[action.id]];
    s.notice='已更新建议，当前有效任务尚未改变。';
  } else if(action.type==='context') {
    if(action.budget!==undefined) s.budget=Math.max(15,Math.min(240,Number(action.budget)||15));
    if(action.energy!==undefined) s.energy=Math.max(1,Math.min(10,Number(action.energy)||1));
    if(action.fixed!==undefined) s.fixed=String(action.fixed);
    if(action.wish!==undefined) s.wish=String(action.wish);
    if(action.fatigue!==undefined) s.fatigue=Boolean(action.fatigue);
    s.notice=s.active.length?'已更新今日情况；改动仍需你确认。':'今日情况已更新。';
  } else if(action.type==='confirm') {
    const problems=issues(s);
    if(problems.length) s.notice=problems.join('；');
    else {s.active=[...s.draft];s.revision+=1;s.notice=`已确认第 ${s.revision} 版计划。现在可以执行和补录。`;}
  } else if(action.type==='disrupt') {
    s.budget=60;s.energy=4;s.draft=['recover','review','family'];s.scenario='临时被打断';
    s.notice='可用时间缩短为 60 分钟。替换建议已准备，原计划保持到你确认。';
  } else if(action.type==='record') {
    if(!s.active.includes(action.id)){s.notice='请先确认包含这个任务的计划。';return s;}
    const evidence=String(action.evidence||'').trim();
    if(evidence.length<2){s.notice='请留下实际完成情况，或载入一条示例证据。';return s;}
    const t={...task(action.id),...(action.proof==='checked'&&s.records[action.id]?.contract?s.records[action.id].contract:s.contracts?.[action.id])};
    const checked=Array.isArray(action.checkpoints)&&t.checkpoints? [...new Set(action.checkpoints)].filter(id=>t.checkpoints.some(c=>c.id===id)):null;
    const status=checked?(checked.length===t.checkpoints.length?'done':'partial'):(action.status==='partial'?'partial':'done');
    const xp=checked?Math.floor(t.xp*checked.length/t.checkpoints.length):status==='done'?t.xp:Math.floor(t.xp/2);
    const minutes=action.minutes===undefined?t.minutes:Number(action.minutes);
    s.records[action.id]={status,evidence,proof:action.proof==='checked'?'checked':'self',xp,checkpoints:checked,masteryEligible:t.masteryEligible!==false,contract:structuredClone(t),minutes:Math.max(0,Math.min(480,Number.isFinite(minutes)?minutes:t.minutes))};
    s.notice='记录已更新。重复保存只修正这一条，不重复发放 XP。';
  } else if(action.type==='removeRecord') {
    delete s.records[action.id];s.notice='已撤回这条模拟记录，分数与能力证据同步重算。';
  } else if(action.type==='reward') {
    s.reward=action.value;s.notice='阶段奖励已选择。';
  } else if(action.type==='claim') {
    if(!progression(s).eligible){s.notice='需要本日 60 XP 和一项新增的已核验证据。';return s;}
    if(s.claimed){s.notice='这项演示奖励已经领取，不会重复领取。';return s;}
    s.claimed=true;s.notice=`已领取「${s.reward}」的演示凭证；不会发生真实购买。`;
  } else if(action.type==='measurement') {
    s.marathon=14100;s.notice='已载入另一场比赛的虚拟测量 3:55:00；变化不归因于今天单个任务。';
  } else if(action.type==='node') s.selectedNode=action.id;
  return s;
}
export function scenario(name) {
  let s=fresh();s.scenario=name;
  if(name==='低精力') {s.energy=4;s.draft=['recover','read','family'];}
  if(name==='临时被打断') {s=act(s,{type:'confirm'});s=act(s,{type:'disrupt'});}
  if(name==='缺少能力证据'||name==='结算样例') {
    s=act(s,{type:'confirm'});
    for(const id of s.active)s=act(s,{type:'record',id,status:'done',proof:name==='结算样例'?'checked':'self',evidence:'原型样例：已完成记录；核验状态为模拟。'});
  }
  s.notice='已载入虚拟场景，可继续操作或重置。';return s;
}
