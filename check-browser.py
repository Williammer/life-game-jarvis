"""End-to-end prototype checks; requires agent-browser and serve.py on port 5180."""
import json
import subprocess

SESSION = 'jarvis-regression'
COUNT = 0

def browser(*args):
    result = subprocess.run(['agent-browser', '--session', SESSION, *args], capture_output=True, text=True, timeout=20)
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

browser('open', 'http://127.0.0.1:5180/')
browser('set', 'viewport', '1440', '1000')
check('今天' in read('h1'), 'Today opens with three selectable, grounded missions')
check(evaluate('document.querySelectorAll(".mission-card").length') == 3, 'Three living domains share one mission system')
click('[data-journey="variant"][data-mid="agent"][data-variant="minimum"]')
click('[data-journey="plan"]')
check('50' in read('.proposal-summary'), 'Minimum Agent mission changes the proposed budget')
check(evaluate('document.querySelectorAll(".day-lane:not(.pending) .event.quest").length') == 0, 'Proposal remains separate from confirmed calendar')
click('[data-action="accept"]')
check(evaluate('[...document.querySelectorAll(".event.quest strong")].every(e=>e.textContent.trim().length>0)'), 'Contract-backed calendar events retain meaningful names')
click('[data-journey="start"][data-task="agent-action"]')
for index in range(2):
    browser('check', f'[value="agent-action-minimum-{index}"]')
browser('fill', '#quest-evidence', '我定位了写入边界，留下提案草图；完整拒绝和重试路径仍未实现。')
click('#quest-record-form [type="submit"]')
check('15 XP' in read('.evidence-receipt'), 'Minimum artifact receives only its contracted action reward')
evaluate('document.querySelector("[data-keep=record-agent-action]").open=true')
click('[data-action="verify"][data-id="agent-action"]')
click('[data-action="growth"]')
check('还差 3 项' in read('.atlas-row.indigo .atlas-gap'), 'Reviewing a minimum artifact does not prove complete mastery')
click('[data-action="today"]')
click('[data-journey="variant"][data-mid="agent"][data-variant="standard"]')
click('[data-journey="plan"]')
check('75' in read('.proposal-summary'), 'A completed minimum mission can become a full challenge')
click('[data-action="accept"]')
click('[data-journey="start"][data-task="agent-action"]')
for index in range(3):
    browser('check', f'[value="agent-action-standard-{index}"]')
browser('fill', '#quest-evidence', '提案、拒绝不写入、重复确认三项已经留下独立断言、运行结果和 AI 帮助说明。')
browser('fill', '#quest-record-form [name="minutes"]', '40')
click('[data-journey="hint"]')
check('独立断言' in browser('get', 'value', '#quest-evidence'), 'Coaching hint preserves in-progress evidence')
click('#quest-record-form [type="submit"]')
check('30 XP' in read('.evidence-receipt'), 'Full contract replaces the earlier award instead of stacking it')
evaluate('document.querySelector("[data-keep=record-agent-action]").open=true')
click('[data-action="verify"][data-id="agent-action"]')
click('[data-action="growth"]')
check('还差 2 项' in read('.atlas-row.indigo .atlas-gap'), 'Complete simulated evidence opens the next capability gate')
check('失败也有可靠' in read('.expedition-copy'), 'Advisor changes next-step analysis when evidence changes')
click('[data-mod="open"][data-mid="agent"]')
check(evaluate('document.querySelector("[data-mod=schedule][data-task=agent-pilot]").disabled'), 'Later challenge remains gated by its real prerequisite')
click('[data-mod="analyze"][data-mid="agent"]')
check(not evaluate('document.querySelector("[data-mod=confirm]").disabled'), 'Current analysis can be confirmed')
click('[data-action="today"]')
click('[data-journey="context"]')
browser('uncheck', '[data-context-id="failure"]')
click('[data-action="growth"]')
click('[data-mod="open"][data-mid="agent"]')
check(evaluate('document.querySelector("[data-mod=confirm]").disabled'), 'Context withdrawal invalidates an earlier analysis')
click('[data-mod="overview"]')
click('[data-mod="new"]')
browser('fill', '#new-module', '英语口语：独立完成一次技术分享')
click('#module-create [type="submit"]')
check('待评估' in read('.module-score'), 'New domain remains unknown instead of receiving invented scores')
click('[data-action="reset"]')
click('[data-action="today"]')
for module in ('agent', 'running', 'parenting'):
    click(f'[data-journey="variant"][data-mid="{module}"][data-variant="minimum"]')
click('[data-journey="context"]')
evaluate('document.querySelector("details[data-keep=capacity]").open=true')
browser('fill', '#capacity-form [name="budget"]', '15')
browser('fill', '#capacity-form [name="energy"]', '2')
click('#capacity-form [type="submit"]')
click('[data-action="accept"]')
check(evaluate('document.querySelectorAll(".event.quest").length') == 1, 'Low-capacity plan defers optional missions without overscheduling')
click('[data-journey="start"][data-task="agent-action"]')
browser('check', '[value="agent-action-minimum-0"]')
browser('fill', '#quest-evidence', '只定位了一个写入边界，还没有完成提案；保留失败观察。')
browser('fill', '#quest-record-form [name="minutes"]', '8')
click('#quest-record-form [type="submit"]')
check('7 XP' in read('.evidence-receipt'), 'Partial completion settles by checkpoint share')
check('减量草案' in read('.camp-review'), 'Observed difficulty yields an actionable recovery proposal')
click('[data-journey="adapt"]')
check(evaluate('document.querySelectorAll(".proposal").length') == 1, 'Review can generate a visible adjustment proposal')
browser('set', 'viewport', '390', '844')
check(evaluate('document.body.scrollWidth<=innerWidth'), 'Mobile Today has no horizontal overflow')
click('[data-action="growth"]')
check(evaluate('document.body.scrollWidth<=innerWidth'), 'Mobile growth atlas has no horizontal overflow')
click('[data-mod="analyze"][data-mid="parenting"]')
check(evaluate('document.body.scrollWidth<=innerWidth'), 'Mobile adviser and proposal have no horizontal overflow')
check('待评估' in read('.module-proposal'), 'Family analysis preserves missing personal baseline')
click('[data-action="today"]')
click('[data-journey="context"]')
if evaluate('document.querySelector(".personal-context")===null'):
    click('[data-journey="context"]')
browser('focus', '#context-description')
browser('fill', '#context-description', '最近照护安排改变，需要保留更短的晚间窗口。')
browser('press', 'Tab')
check(evaluate('document.activeElement.tagName==="SELECT"'), 'Keyboard reaches contextual scope after text input')
browser('press', 'Tab')
check(evaluate('document.activeElement.type==="submit"'), 'Keyboard reaches the context confirmation action')
browser('press', 'Enter')
check('最近照护安排改变' in read('.context-facts'), 'Keyboard submission saves a traceable personal observation')
check(browser('errors') == '', 'No uncaught browser errors across the full journey')
print(f'{COUNT} browser checks passed.', flush=True)
