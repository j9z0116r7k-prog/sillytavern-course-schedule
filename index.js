const DAYS = ['周一', '周二', '周三', '周四', '周五'];
const ROWS = [
  ['早读', '07:20–07:50', ['早读自习','早读自习','早读自习','早读自习','早读自习'], 'early'],
  ['第 1 节', '08:00–08:40', ['数学','数学','英语','英语','生物'], 'morning'],
  ['第 2 节', '08:50–09:30', ['物理','数学','英语','物理','生物'], 'morning'],
  ['大课间 · 25 分钟', '09:30–09:55', null, 'break'],
  ['第 3 节', '09:55–10:35', ['化学','化学','物理','语文','化学'], 'morning'],
  ['第 4 节', '10:45–11:25', ['语文','英语','语文','语文','数学'], 'morning'],
  ['第 5 节', '11:35–12:15', ['英语','语文','数学','数学','数学'], 'morning'],
  ['眼保健操 · 15 分钟', '14:15–14:30', null, 'break eye'],
  ['第 6 节', '14:30–15:10', ['生物','物理实验','英语听力','生物实验','英语'], 'afternoon'],
  ['第 7 节', '15:20–16:00', ['体育','综合练习','生物','综合练习','语文'], 'afternoon'],
  ['第 8 节', '16:10–16:50', ['班会','社团活动','自由研修','自主答疑','语文'], 'afternoon'],
  ['晚自习 1', '19:00–19:40', ['数学周测','物理周测','生物周测','语文周测','放学回家'], 'evening'],
  ['晚自习 2', '19:50–20:30', ['数学周测','晚自习','化学周测','语文周测'], 'evening'],
  ['晚自习 3', '20:40–21:20', ['英语周测','晚自习','晚自习','晚自习'], 'evening'],
  ['晚自习 4', '21:30–22:10', ['英语周测','晚自习','晚自习','晚自习'], 'evening'],
];

function rows() { 
  return ROWS.map((r, i) => { 
    const [label, time, courses, type] = r; 
    if (!courses) return `<tr class="stcs-break ${type}"><td colspan="6">${time}　${label}</td></tr>`; 
    const cells = courses.map((course, col) => i === 11 && col === 4 ? '<td class="stcs-home" rowspan="4">放学回家</td>' : `<td class="stcs-class stcs-${type}">${course}</td>`).join(''); 
    return `<tr><th class="stcs-time stcs-${type}"><b>${label}</b><small>${time}</small></th>${cells}</tr>`; 
  }).join(''); 
}

// 拖拽辅助函数：绑定长按拖拽事件
function bindLongPressDrag(targetEl, moveEl = targetEl, longPressMs = 400) {
  let timer = null;
  let isDragging = false;
  let startX = 0, startY = 0;
  let offsetX = 0, offsetY = 0;
  let hasMoved = false;

  const onPointerDown = (e) => {
    // 忽略点击关闭/交互按钮
    if (e.target.closest('button') && e.target !== targetEl) return;
    
    startX = e.clientX;
    startY = e.clientY;
    const rect = moveEl.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    hasMoved = false;

    timer = setTimeout(() => {
      isDragging = true;
      moveEl.classList.add('stcs-dragging');
      if (navigator.vibrate) navigator.vibrate(40); // 触发长按震动反馈
    }, longPressMs);

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
  };

  const onPointerMove = (e) => {
    const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
    // 如果未达到长按时间就移动了超过 8px，取消长按判定
    if (!isDragging && dist > 8) {
      clearTimeout(timer);
      return;
    }

    if (isDragging) {
      hasMoved = true;
      if (e.cancelable) e.preventDefault();
      
      // 边界限制，防止脱出可视区域
      const left = Math.max(0, Math.min(window.innerWidth - moveEl.offsetWidth, e.clientX - offsetX));
      const top = Math.max(0, Math.min(window.innerHeight - moveEl.offsetHeight, e.clientY - offsetY));
      
      moveEl.style.left = `${left}px`;
      moveEl.style.top = `${top}px`;
      moveEl.style.right = 'auto';
      moveEl.style.bottom = 'auto';
    }
  };

  const onPointerUp = () => {
    clearTimeout(timer);
    if (isDragging) {
      isDragging = false;
      moveEl.classList.remove('stcs-dragging');
    }
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerUp);
  };

  targetEl.addEventListener('pointerdown', onPointerDown);

  // 返回判断函数，防止拖拽松开时触发点击事件
  return () => hasMoved;
}

function init() {
  if (document.getElementById('stcs-panel')) return;
  
  document.body.insertAdjacentHTML('beforeend', `<button id="stcs-toggle" type="button" aria-label="打开课程表">课</button><section id="stcs-panel" hidden><header id="stcs-head"><div><span>WEEKLY TIMETABLE · GRADE 12</span><strong>高三领航一班 · 理科班课程表</strong></div><button id="stcs-close" type="button" aria-label="关闭课程表">×</button></header><p id="stcs-note">早读已预留 · 上午第二节后大课间 25 分钟 · 下午第一节前眼保健操 15 分钟</p><div id="stcs-scroll"><table><thead><tr><th>时间</th>${DAYS.map(d => `<th>${d}</th>`).join('')}</tr></thead><tbody>${rows()}</tbody></table></div></section>`);
  
  const panel = document.getElementById('stcs-panel');
  const toggleBtn = document.getElementById('stcs-toggle');
  const closeBtn = document.getElementById('stcs-close');
  const head = document.getElementById('stcs-head');

  // 1. 悬浮图标长按拖动 (长按 350ms 后可拖拽)
  const wasToggleDragged = bindLongPressDrag(toggleBtn, toggleBtn, 350);
  toggleBtn.onclick = () => {
    if (!wasToggleDragged()) {
      panel.hidden = !panel.hidden;
    }
  };

  // 2. 面板 Header 抓取拖动 (保留头部按住拖动)
  bindLongPressDrag(head, panel, 0);

  closeBtn.onclick = () => panel.hidden = true;
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
