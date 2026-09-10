const schedule = {
  '周一': { '上午': ['数学', '物理', '化学', '语文', '英语'], '下午': ['生物', '体育', '班会'], '晚上': ['数学周测', '数学周测', '英语周测', '英语周测'] },
  '周二': { '上午': ['数学', '数学', '化学', '英语', '语文'], '下午': ['物理实验', '综合练习', '社团活动'], '晚上': ['物理周测', '晚自习', '晚自习', '晚自习'] },
  '周三': { '上午': ['英语', '英语', '物理', '语文', '数学'], '下午': ['英语听力', '生物', '自由研修'], '晚上': ['生物周测', '化学周测', '晚自习', '晚自习'] },
  '周四': { '上午': ['英语', '物理', '语文', '语文', '数学'], '下午': ['生物实验', '综合练习', '自主答疑'], '晚上': ['语文周测', '语文周测', '晚自习', '晚自习'] },
  '周五': { '上午': ['生物', '生物', '化学', '数学', '数学'], '下午': ['英语', '语文', '语文'], '晚上': ['放学回家'] },
};

function init() {
  if (document.querySelector('#floating-schedule')) return;
  const days = Object.keys(schedule);
  const rows = ['上午', '下午', '晚上'].map(period => `<tr><th>${period}</th>${days.map(day => `<td>${schedule[day][period].join(' · ')}</td>`).join('')}</tr>`).join('');
  document.body.insertAdjacentHTML('beforeend', `<button id="schedule-button" title="课程表">课</button><section id="floating-schedule" hidden><header id="schedule-header">高三领航一班理科班课程表 <button id="schedule-close">×</button></header><div><table><thead><tr><th>时段</th>${days.map(day => `<th>${day}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div></section>`);
  const panel = document.querySelector('#floating-schedule');
  document.querySelector('#schedule-button').onclick = () => panel.hidden = !panel.hidden;
  document.querySelector('#schedule-close').onclick = () => panel.hidden = true;
  let drag;
  document.querySelector('#schedule-header').onpointerdown = e => { if (e.target.tagName === 'BUTTON') return; const r = panel.getBoundingClientRect(); drag = [e.clientX-r.left, e.clientY-r.top]; };
  document.onpointermove = e => { if (drag) { panel.style.left = Math.max(0, e.clientX-drag[0])+'px'; panel.style.top = Math.max(0, e.clientY-drag[1])+'px'; panel.style.right = 'auto'; panel.style.bottom = 'auto'; } };
  document.onpointerup = () => drag = null;
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
