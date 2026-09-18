// DataViz Dash — bar and line charts with filter controls

const allData = [
  { label: 'Jan', value: 42, quarter: 'q1' },
  { label: 'Feb', value: 58, quarter: 'q1' },
  { label: 'Mar', value: 35, quarter: 'q1' },
  { label: 'Apr', value: 70, quarter: 'q2' },
  { label: 'May', value: 88, quarter: 'q2' },
  { label: 'Jun', value: 62, quarter: 'q2' },
  { label: 'Jul', value: 54, quarter: 'q3' },
  { label: 'Aug', value: 91, quarter: 'q3' },
  { label: 'Sep', value: 47, quarter: 'q3' },
  { label: 'Oct', value: 66, quarter: 'q4' },
  { label: 'Nov', value: 80, quarter: 'q4' },
  { label: 'Dec', value: 73, quarter: 'q4' },
];

const canvas       = document.getElementById('chartCanvas');
const ctx          = canvas.getContext('2d');
const chartType    = document.getElementById('chartType');
const filterSelect = document.getElementById('filterSelect');

const PAD = { top: 30, right: 20, bottom: 40, left: 45 };
const BAR_COLOR  = '#4a90e2';
const LINE_COLOR = '#e74c3c';

function getFilteredData() {
  const q = filterSelect.value;
  return q === 'all' ? allData : allData.filter(d => d.quarter === q);
}

function drawBar(data) {
  const w = canvas.width  - PAD.left - PAD.right;
  const h = canvas.height - PAD.top  - PAD.bottom;
  const maxVal = Math.max(...data.map(d => d.value));
  const barW   = w / data.length * 0.6;
  const gap    = w / data.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes(h, maxVal, data.length);

  data.forEach((d, i) => {
    const x   = PAD.left + i * gap + gap * 0.2;
    const barH = (d.value / maxVal) * h;
    const y   = PAD.top + h - barH;

    ctx.fillStyle = BAR_COLOR;
    ctx.fillRect(x, y, barW, barH);

    // Label
    ctx.fillStyle = '#444';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.label, x + barW / 2, PAD.top + h + 18);
  });
}

function drawLine(data) {
  const w = canvas.width  - PAD.left - PAD.right;
  const h = canvas.height - PAD.top  - PAD.bottom;
  const maxVal = Math.max(...data.map(d => d.value));
  const step   = w / (data.length - 1 || 1);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes(h, maxVal, data.length);

  ctx.beginPath();
  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = 2.5;

  data.forEach((d, i) => {
    const x = PAD.left + i * step;
    const y = PAD.top  + h - (d.value / maxVal) * h;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Dots + labels
  data.forEach((d, i) => {
    const x = PAD.left + i * step;
    const y = PAD.top  + h - (d.value / maxVal) * h;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = LINE_COLOR;
    ctx.fill();

    ctx.fillStyle = '#444';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.label, x, PAD.top + h + 18);
  });
}

function drawAxes(h, maxVal, count) {
  const w = canvas.width - PAD.left - PAD.right;

  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;

  // Y-axis grid lines and labels
  const ticks = 5;
  for (let i = 0; i <= ticks; i++) {
    const y = PAD.top + h - (i / ticks) * h;
    ctx.beginPath();
    ctx.moveTo(PAD.left, y);
    ctx.lineTo(PAD.left + w, y);
    ctx.stroke();

    ctx.fillStyle = '#888';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round((i / ticks) * maxVal), PAD.left - 6, y + 4);
  }

  // Axis borders
  ctx.strokeStyle = '#aaa';
  ctx.beginPath();
  ctx.moveTo(PAD.left, PAD.top);
  ctx.lineTo(PAD.left, PAD.top + h);
  ctx.lineTo(PAD.left + w, PAD.top + h);
  ctx.stroke();
}

function render() {
  const data = getFilteredData();
  if (chartType.value === 'bar') {
    drawBar(data);
  } else {
    drawLine(data);
  }
}

chartType.addEventListener('change', render);
filterSelect.addEventListener('change', render);
render();
