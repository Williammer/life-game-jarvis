"""Assessment modes and scoped re-evaluation. Requires serve.py and agent-browser."""
import json
import subprocess

SESSION = 'jarvis-assessment-check'
COUNT = 0

def browser(*args):
    result = subprocess.run(['agent-browser', '--session', SESSION, *args], capture_output=True, text=True, timeout=25)
    assert result.returncode == 0, result.stderr or result.stdout
    return result.stdout.strip()

def click(selector):
    browser('scrollintoview', selector)
    browser('click', selector)

def read(selector):
    return browser('get', 'text', selector)

def evaluate(source):
    return json.loads(browser('eval', source))

def check(condition, name):
    global COUNT
    assert condition, name
    COUNT += 1
    print(f'PASS {COUNT}: {name}', flush=True)

def send(text):
    browser('fill', '#feedback-message', text)
    click('#feedback-form [type=submit]')

def close():
    click('[data-feedback-control=close]')

browser('open', 'http://127.0.0.1:5180/')
browser('set', 'viewport', '1440', '1000')
click('[data-action=growth]')
check(evaluate('document.querySelectorAll(".atlas-row>.assessment-panel").length') == 3, 'All existing domains offer both assessment modes')
running = '.atlas-row.teal .assessment-panel'
agent = '.atlas-row.indigo .assessment-panel'
check('5.0 / 10' in read(running+' .assessment-self') and '10.0 / 10' in read(running+' .assessment-reference'), 'Personal and reference scores share the same scale')
check('6.9 / 10' in read(running+' .assessment-field'), 'Domain goal progress remains separate from the role-model comparison')
click(running+' [data-mode=cultivation]')
check('炼虚 · 初期' in read(running+' .assessment-self') and '渡劫 · 圆满' in read(running+' .assessment-reference'), 'Both participants map to a specific cultivation realm and stage')
check(evaluate('document.activeElement.dataset.mode==="cultivation"'), 'Mode switching restores focus to the selected control')
check(evaluate('document.querySelector(".atlas-row.indigo .assessment-panel").dataset.mode==="numeric"'), 'A domain-specific mode does not change another domain')
click(running+' [data-mode=numeric]')
check('5.0 / 10' in read(running+' .assessment-self'), 'Switching back retains the same factual assessment')
click('.atlas-row.teal [data-feedback=benchmark]')
send('改用 Usain Bolt')
click('[data-feedback-control=confirm]')
close()
check('待评估' in read(running+' .assessment-self') and '10.0 / 10' in read(running+' .assessment-reference'), 'Bolt has a scored reference while absent sprint evidence stays unknown')
click(running+' .assessment-self [data-feedback]')
send('100米成绩改为 19.16秒')
check('5.0 / 10' in read('.feedback-proposal') and '待评估' in read(running+' .assessment-self'), 'Corrected personal context produces a scoring proposal before mutation')
click('[data-feedback-control=confirm]')
close()
check('5.0 / 10' in read(running+' .assessment-self') and 'Usain Bolt' in read(running+' .assessment-reference'), 'Confirmed sprint baseline updates both participant results')
click(running+' [data-mode=cultivation]')
check('炼虚 · 初期' in read(running+' .assessment-self') and '渡劫 · 圆满' in read(running+' .assessment-reference'), 'The same Bolt comparison maps to both realms')
check(evaluate('document.querySelectorAll(".atlas-row.teal .cultivation-path .self").length') == 1, 'Exactly one personal realm is highlighted')
click(running+' [data-feedback-message]')
check(browser('get', 'value', '#feedback-message') == '重新评估', 'Re-evaluation entrance retains the selected assessment and intent')
click('#feedback-form [type=submit]')
check('证据相同' in read('.feedback-history') and '炼虚' in read('.feedback-proposal'), 'Re-evaluation returns an evidence-based proposal without inventing progress')
close()
click(running+' [data-mode=numeric]')
click(running+' .assessment-self [data-feedback]')
check(not evaluate('document.querySelector("[data-feedback-control=confirm]").disabled'), 'Presentation switching preserves a valid pending assessment')
click('[data-feedback-control=reject]')
close()
click('.atlas-row.teal [data-mod=open]')
check('5.0 / 10' in read('.reference-section .assessment-self'), 'Overview and module detail read the same confirmed score')
click('.reference-section [data-mode=cultivation]')
check('渡劫 · 圆满' in read('.reference-section .assessment-reference'), 'Detailed role-model evaluation supports the same realm mode')
click('.reference-section .assessment-field [data-feedback]')
send('为什么这样判断？')
check('领域目标' in read('.feedback-history') and '100米成绩' in read('.feedback-history'), 'Domain feedback carries its comparison inputs and scope')
close()
click('.reference-section .assessment-self [data-feedback]')
send('重新评估')
close()
click('[data-action=today]')
click('[data-journey=context]')
browser('uncheck', '[data-context-id=load]')
click('[data-action=growth]')
click('.atlas-row.teal .assessment-self [data-feedback]')
check(evaluate('document.querySelector("[data-feedback-control=confirm]").disabled'), 'A changed personal context invalidates the old reassessment proposal')
close()
# The other domain retains its separate comparison and unknowns.
click(agent+' [data-mode=cultivation]')
check('结丹 · 中期' in read(agent+' .assessment-self'), 'Checklist comparison is mapped from capability evidence, not action XP')
parenting = '.atlas-row.amber .assessment-panel'
click(parenting+' [data-mode=cultivation]')
check('待评估' in read(parenting+' .assessment-self') and '待评估' in read(parenting+' .assessment-reference'), 'Missing personal data and unselected role model receive no fabricated realm')
browser('set', 'viewport', '320', '740')
check(evaluate('document.body.scrollWidth<=innerWidth'), 'Mobile atlas with two assessment modes has no horizontal overflow')
click('.atlas-row.teal [data-mod=open]')
check(evaluate('document.body.scrollWidth<=innerWidth'), 'Mobile detailed scores and realms fit the viewport')
click('.reference-section .assessment-self [data-feedback]')
check(evaluate('document.querySelector("#feedback-dialog").scrollWidth<=innerWidth'), 'Assessment discussion is usable on mobile')
browser('screenshot', '/tmp/jarvis-assessment-mobile.png')
browser('press', 'Escape')
check(evaluate('document.activeElement.dataset.feedback==="assessment"'), 'Escape returns focus to the specific assessment')
browser('set', 'viewport', '1440', '1000')
browser('scrollintoview', '.reference-section')
browser('screenshot', '/tmp/jarvis-assessment-detail.png')
check(browser('errors') == '', 'No uncaught browser errors across assessment flows')
print(f'{COUNT} assessment browser checks passed.', flush=True)
