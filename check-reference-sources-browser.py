"""Public role-model sources, review and evidence boundaries. Requires serve.py and agent-browser."""
import json
import subprocess

SESSION = 'jarvis-reference-sources-check'
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

def editor():
    click('.module-document .reference-sources [data-mod=edit-reference]')

browser('open', 'http://127.0.0.1:5180/')
browser('set', 'viewport', '1440', '1000')
click('[data-action=growth]')
check(evaluate('document.querySelectorAll(".atlas-gap [data-mod=edit-reference]").length') == 3, 'Every domain offers role-model data entry from the overview')
click('.atlas-row.indigo [data-mod=edit-reference]')
check(browser('get', 'value', '#reference-name') == 'BuilderIO · Calendar', 'Existing reference sources are prefilled for editing')
check(evaluate('document.activeElement.id==="reference-name"'), 'Opening data entry focuses its labeled name field')
click('.reference-candidates [data-mod=custom-ref]')
browser('fill', '#reference-name', '示例研究者')
browser('fill', '#reference-focus', 'Agent 工具设计、可靠性评估与公开项目维护')
browser('fill', '#reference-window', '最近 12 个月')
sources = [
    ('https://github.com/example', 'auto', '开源活动', '核查本人贡献与持续维护'),
    ('https://www.linkedin.com/in/example', 'auto', '职业经历', ''),
    ('https://x.com/example', 'auto', '公开讨论', ''),
    ('https://example.com/article', 'article', '技术文章', '核查技术论证质量'),
    ('https://www.youtube.com/watch?v=example', 'video', '技术演讲', ''),
    ('https://github.com/example/project', 'code', '代表项目', '核查测试、可靠性与真实使用成果')
]
for i, (url, kind, title, note) in enumerate(sources):
    if i:
        click('[data-mod=reference-add]')
    browser('fill', f'#source-url-{i}', url)
    browser('select', f'#source-type-{i}', kind)
    browser('fill', f'#source-title-{i}', title)
    if note:
        browser('fill', f'#source-note-{i}', note)
check(evaluate('document.querySelectorAll(".reference-source-row").length') == 6, 'Six profile and published-work sources can be supplied together')
check(browser('get', 'value', '#source-type-3') == 'article', 'A manually selected article type survives later source-row additions')
click('[data-mod=reference-add]')
browser('fill', '#source-url-6', sources[0][0])
click('#reference-form [type=submit]')
check('重复' in read('#reference-form') and browser('get', 'value', '#source-note-0') == sources[0][3], 'Duplicate addresses are rejected without losing source notes')
click('[data-mod=reference-remove][data-index="6"]')
browser('set', 'viewport', '320', '740')
check(evaluate('document.body.scrollWidth<=innerWidth'), 'Multi-source editor fits a 320px mobile viewport')
browser('scrollintoview', '#reference-form')
browser('screenshot', '/tmp/jarvis-reference-sources-editor-mobile.png')
browser('set', 'viewport', '1440', '1000')
click('#reference-form [type=submit]')
check('示例研究者' in read('.module-proposal') and '最近 12 个月' in read('.module-proposal'), 'Source submission creates a domain-scoped reviewable proposal')
check('6 条待读取与核验' in read('.module-proposal'), 'New links are explicitly pending rather than verified')
check('BuilderIO' in read('.module-document .assessment-reference'), 'A source proposal leaves the adopted role model unchanged')
click('.module-proposal [data-mod=discard]')
check('BuilderIO' in read('.module-document .assessment-reference'), 'Rejecting the data proposal preserves the live reference')
click('.reference-candidates [data-mod=custom-ref]')
check(browser('get', 'value', '#reference-name') == '示例研究者' and evaluate('document.querySelectorAll(".reference-source-row").length') == 6, 'Returning to a rejected proposal preserves its independent source draft')
click('#reference-form [type=submit]')
click('.module-proposal [data-mod=confirm]')
check('示例研究者' in read('.module-document .assessment-reference') and '待评估' in read('.module-document .assessment-reference'), 'Confirmed custom reference remains unscored until evidence and rubric are verified')
check(evaluate('document.querySelectorAll(".module-document [data-reference-source]").length') == 6, 'All confirmed sources appear beside the role-model assessment')
check('GitHub 个人主页 / 活动' in read('.module-document .reference-sources') and 'LinkedIn' in read('.module-document .reference-sources') and '代码 / 项目' in read('.module-document .reference-sources'), 'Profiles and public works retain their distinct source types')
browser('scrollintoview', '.module-document .reference-sources-heading')
browser('screenshot', '/tmp/jarvis-reference-sources-multi.png')
click('.module-document [data-reference-source]:first-child [data-feedback]')
check('核查本人贡献与持续维护' in read('.feedback-object'), 'Source feedback carries the exact URL and intended evidence')
send('链接改为 https://github.com/corrected')
check('github.com/example' in read('.feedback-diff>div:first-child') and 'github.com/corrected' in read('.feedback-diff>div:last-child'), 'A link correction shows the actual adopted before and proposed after')
click('[data-feedback-control=confirm]')
close()
check('https://github.com/corrected' in read('.module-document .reference-sources'), 'Confirmed correction updates the same source entry')
click('.module-document [data-reference-source]:last-child [data-feedback]')
send('移除这条资料')
check(evaluate('document.querySelectorAll(".module-document [data-reference-source]").length') == 6, 'Source removal remains pending until explicit confirmation')
click('[data-feedback-control=confirm]')
close()
check(evaluate('document.querySelectorAll(".module-document [data-reference-source]").length') == 5, 'Confirmed source removal updates the evidence collection')
editor()
browser('fill', '#reference-focus', '尚未提交的草稿：关注工具调用失败与重试')
click('[data-mod=reference-cancel]')
click('.module-document .reference-section [data-feedback=benchmark]')
click('#feedback-dialog [data-mod=edit-reference]')
check(not evaluate('Boolean(document.querySelector("#feedback-dialog"))') and browser('get', 'value', '#reference-focus').startswith('尚未提交'), 'Role-model discussion opens its data editor and retains the module draft')
click('[data-mod=reference-cancel]')
click('.module-document [data-reference-source]:first-child [data-feedback]')
send('链接改为 https://github.com/revised')
click('[data-feedback-control=confirm]')
close()
editor()
check(evaluate('document.querySelector("#reference-form [type=submit]").disabled') and browser('get', 'value', '#reference-focus').startswith('尚未提交'), 'A changed role model invalidates an unsent source draft without discarding it')
click('[data-mod=reference-reload]')
check(browser('get', 'value', '#source-url-0') == 'https://github.com/revised' and not evaluate('document.querySelector("#reference-form [type=submit]").disabled'), 'Explicit reload restores the current reference collection before further edits')
click('[data-mod=reference-cancel]')
click('[data-mod=overview]')
check('1 条基础资料' in read('.atlas-row.teal') and '5 条基础资料' in read('.atlas-row.indigo'), 'Source collections remain independent across domains')
click('.atlas-row.teal [data-mod=edit-reference]')
check('示例研究者' not in browser('get', 'value', '#reference-name'), 'Another domain does not inherit the custom source draft')
click('[data-mod=reference-add]')
browser('fill', '#source-url-1', 'https://example.com/interview')
browser('fill', '#reference-window', '2022 年柏林马拉松')
click('#reference-form [type=submit]')
click('.module-proposal [data-mod=confirm]')
check('10.0 / 10' in read('.module-document .assessment-reference'), 'Supplemental pending links do not change the original numeric reference score')
editor()
check(evaluate('document.querySelectorAll(".reference-source-row").length') == 2, 'Reopening after adoption loads the current confirmed collection')
click('[data-mod=reference-cancel]')
click('.module-document [data-reference-source]:first-child [data-feedback]')
send('移除这条资料')
click('[data-feedback-control=confirm]')
close()
check('待评估' in read('.module-document .assessment-reference'), 'Withdrawing the original numeric evidence withdraws its score and realm mapping')
browser('set', 'viewport', '320', '740')
click('[data-mod=pane][data-pane=document]')
check(evaluate('document.body.scrollWidth<=innerWidth'), 'Confirmed source list and assessment fit a 320px mobile viewport')
click('.module-document [data-reference-source] [data-feedback]')
check(evaluate('document.querySelector("#feedback-dialog").scrollWidth<=innerWidth'), 'Individual source discussion remains usable on mobile')
browser('press', 'Escape')
check(evaluate('document.activeElement.dataset.feedback==="reference-source"'), 'Escape returns keyboard focus to the same source')
browser('set', 'viewport', '1440', '1000')
browser('scrollintoview', '.module-document .reference-sources')
browser('screenshot', '/tmp/jarvis-reference-sources-detail.png')
check(browser('errors') == '', 'No uncaught browser errors across source editing and feedback')
print(f'{COUNT} reference-source browser checks passed.', flush=True)
