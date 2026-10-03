import assert from 'node:assert/strict';
import {newModules,customReference,configureReference,referenceSources,referenceSourceText,analyzeModule,assessment,confirmModule} from './module-model.js';
import {newDay} from './day-model.js';
import {createPersonal} from './journey.js';
import {checkpoint,reply,applyFeedback,undoFeedback,versions} from './feedback.js';

let day=newDay();day.personal=createPersonal();let modules=newModules();
const input=[
 {url:'https://github.com/example',title:'开源活动',note:'关注本人贡献、持续维护与协作'},
 {url:'https://www.linkedin.com/in/example',title:'职业背景'},
 {url:'https://x.com/example',title:'公开讨论'},
 {url:'https://example.com/article',type:'article',note:'判断技术论证质量'},
 {url:'https://www.youtube.com/watch?v=example',type:'video'},
 {url:'https://github.com/example/project',type:'code',note:'关注测试、可靠性与用户成果'}
];
const reference=configureReference(null,'示例榜样',input,{focus:'Agent 受控执行、评估质量与可维护性',observationWindow:'最近十二个月'});
assert.deepEqual(reference.sources.map(s=>s.type),['github','linkedin','x','article','video','code']);
assert.ok(reference.sources.every(s=>s.status==='pending'));
assert.equal(customReference('旧入口','https://example.com').sources.length,1);
for(const url of ['javascript:alert(1)','file:///tmp/a','https://u:p@example.com','bad'])assert.throws(()=>configureReference(null,'名称',[{url}]),/链接/);
assert.throws(()=>configureReference(null,'名称',[{url:'https://example.com'},{url:'https://example.com/'}]),/重复/);
assert.throws(()=>configureReference(null,'名称',[]),/至少/);
assert.throws(()=>configureReference(null,'名称',Array.from({length:13},(_,i)=>({url:`https://example.com/${i}`}))),/12/);
assert.throws(()=>configureReference(null,'名称',[{url:'https://example.com',note:'字'.repeat(601)}]),/说明/);
const original=structuredClone(modules[1]),originalAssessment=assessment(original,day);
let proposed=analyzeModule(original,day,reference);
assert.equal(assessment(proposed,day).roleModel.score,originalAssessment.roleModel.score);
assert.equal(assessment({...proposed,...proposed.proposal.patch},day).roleModel.score,null);
assert.match(proposed.proposal.patch.assessment.referenceBasis.join('\n'),/github.com\/example/);
assert.equal(proposed.proposal.patch.assessment.referenceResearch.field,original.name);
assert.match(proposed.proposal.patch.assessment.missing.join('\n'),/6 条.*读取/);
assert.equal(proposed.proposal.patch.assessment.referenceResearch.observationWindow,'最近十二个月');
modules[1]=confirmModule(proposed);
for(const mode of ['numeric','cultivation'])assert.equal(assessment({...modules[1],assessmentMode:mode},day).roleModel.score,null);
const c=checkpoint({scope:'benchmark',mid:'agent'},day,modules);assert.match(c.basis,/linkedin.com/);assert.match(c.basis,/可维护性/);
const source=referenceSources(modules[1].benchmark)[0],target={scope:'reference-source',mid:'agent',item:source.id};
assert.match(checkpoint(target,day,modules).content,/本人贡献/);
let response=reply(target,'链接改为 https://github.com/corrected',day,modules);
assert.ok(response.proposal);assert.match(response.proposal.before,/github.com\/example/);assert.match(response.proposal.after,/github.com\/corrected/);
assert.match(referenceSourceText(modules[1].benchmark),/github.com\/example/);
const undo={day:structuredClone(day),modules:structuredClone(modules)};
const xp=structuredClone(day.core.records),applied=applyFeedback(response.proposal,day,modules);day=applied.day;modules=applied.modules;
assert.equal(modules[1].benchmark.sources[0].url,'https://github.com/corrected');assert.deepEqual(day.core.records,xp);
assert.deepEqual(modules[0],original.id==='running'?original:newModules()[0]);
const stale=response.proposal;assert.throws(()=>applyFeedback(stale,day,modules),/过期/);
undo.version=versions(day,modules);const restored=undoFeedback(undo,day,modules);assert.equal(restored.modules[1].benchmark.sources[0].url,source.url);
let removal=reply(target,'移除这条资料',day,modules).proposal;assert.equal(removal.patch.benchmark.sources.length,5);assert.equal(modules[1].benchmark.sources.length,6);
const known=newModules()[0].benchmark;
const enriched=configureReference(known,known.name,[...referenceSources(known),{url:'https://example.com/interview',type:'video'}]);
assert.equal(enriched.kind,'numeric');assert.equal(enriched.target,known.target);
assert.equal(assessment({...newModules()[0],benchmark:enriched},day).roleModel.score,10);
const withdrawn=configureReference(enriched,enriched.name,enriched.sources.filter(s=>s.url!==known.source));assert.equal(withdrawn.kind,'narrative');
assert.equal(assessment({...newModules()[0],benchmark:withdrawn},day).roleModel.score,null);
assert.equal(configureReference(known,'另一位人物',referenceSources(known)).kind,'narrative');
response=reply({scope:'benchmark',mid:'agent'},'补充资料 https://example.com/paper https://example.com/talk',day,modules);
assert.equal(response.proposal.patch.benchmark.sources.length,8);assert.match(response.proposal.after,/example.com\/paper/);
console.log('PASS: multi-source references, URL validation, evidence provenance, unknown scores, scoped corrections, confirmation, stale guards, undo and isolation.');
