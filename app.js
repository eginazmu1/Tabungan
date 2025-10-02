const savingsData = {
  goalTitle: 'Liburan Bali Rp 5.000.000',
  goalAmount: 5000000,
  totalSaved: 2650000,
  weeklyTarget: 200000,
  users: [
    {
      id: 'a',
      name: 'Egi',
      avatar: '🧑🏻',
      color: '#377dff',
      weeklyTarget: 100000,
      contributionThisWeek: 100000,
      hasPaid: true
    },
    {
      id: 'b',
      name: 'Partner',
      avatar: '🧑🏽',
      color: '#34c759',
      weeklyTarget: 100000,
      contributionThisWeek: 0,
      hasPaid: false
    }
  ],
  history: [
    { date: '08 Okt', name: 'Egi', amount: 100000, status: '✅' },
    { date: '02 Okt', name: 'Partner', amount: 100000, status: '✅' },
    { date: '01 Okt', name: 'Egi', amount: 100000, status: '✅' },
    { date: '24 Sep', name: 'Partner', amount: 100000, status: '✅' }
  ],
  weeklyBreakdown: [
    { label: 'M-7', a: 100000, b: 90000 },
    { label: 'M-6', a: 100000, b: 100000 },
    { label: 'M-5', a: 80000, b: 100000 },
    { label: 'M-4', a: 100000, b: 100000 },
    { label: 'M-3', a: 100000, b: 70000 },
    { label: 'M-2', a: 100000, b: 100000 },
    { label: 'M-1', a: 100000, b: 100000 },
    { label: 'Minggu Ini', a: 100000, b: 0 }
  ],
  streakWeeks: 3
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

function updateGoalProgress({ goalTitle, goalAmount, totalSaved }) {
  const titleEl = document.getElementById('goal-title');
  const progressValueEl = document.getElementById('goal-progress-value');
  const progressBarEl = document.getElementById('goal-progress-bar');

  titleEl.textContent = goalTitle;
  progressValueEl.textContent = `${formatCurrency(totalSaved)} dari ${formatCurrency(goalAmount)}`;

  const percent = Math.min((totalSaved / goalAmount) * 100, 100);
  progressBarEl.style.width = `${percent}%`;
  progressBarEl.setAttribute('aria-valuenow', percent.toFixed(1));
}

function renderUserCards(users) {
  const container = document.getElementById('user-cards');
  container.innerHTML = '';

  users.forEach((user) => {
    const card = document.createElement('article');
    card.className = `user-card user-card--${user.id}`;

    const header = document.createElement('div');
    header.className = 'user-card__header';

    const avatar = document.createElement('div');
    avatar.className = `avatar avatar--${user.id}`;
    avatar.style.background = user.color;
    avatar.textContent = user.avatar;

    const titleWrap = document.createElement('div');
    const nameEl = document.createElement('div');
    nameEl.className = 'user-card__name';
    nameEl.textContent = user.name;

    const targetEl = document.createElement('div');
    targetEl.className = 'user-card__target';
    targetEl.textContent = `Target: ${formatCurrency(user.weeklyTarget)}`;

    titleWrap.append(nameEl, targetEl);
    header.append(avatar, titleWrap);

    const status = document.createElement('div');
    status.className = 'user-card__status';
    status.classList.toggle('user-card__status--done', user.hasPaid);
    status.innerHTML = `${user.hasPaid ? '✅' : '❌'} ${user.hasPaid ? 'Sudah Setor' : 'Belum Setor'}`;

    const contribution = document.createElement('div');
    contribution.className = 'user-card__target';
    contribution.textContent = `Realisasi: ${formatCurrency(user.contributionThisWeek)}`;

    card.append(header, status, contribution);
    container.appendChild(card);
  });
}

function renderHistory(history) {
  const tbody = document.getElementById('history-body');
  tbody.innerHTML = '';

  history.forEach((item) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.date}</td>
      <td>${item.name}</td>
      <td>${formatCurrency(item.amount)}</td>
      <td>
        <span class="status-dot ${item.status === '✅' ? 'status-dot--done' : 'status-dot--pending'}"></span>
        ${item.status}
      </td>
    `;

    tbody.appendChild(row);
  });
}

function renderWeeklyTarget(weeklyTarget, users) {
  const label = document.getElementById('weekly-target-label');
  const statusPill = document.getElementById('weekly-target-status');
  const icon = statusPill.querySelector('.status-pill__icon');
  const text = statusPill.querySelector('.status-pill__text');

  const totalThisWeek = users.reduce((sum, user) => sum + user.contributionThisWeek, 0);
  const isDone = totalThisWeek >= weeklyTarget;

  label.textContent = formatCurrency(weeklyTarget);

  statusPill.classList.remove('status-pill--done', 'status-pill--pending');
  statusPill.classList.add(isDone ? 'status-pill--done' : 'status-pill--pending');
  icon.textContent = isDone ? '✅' : '❌';
  text.textContent = isDone ? 'Done' : 'Belum';
}

function renderWeeklyChart(breakdown, users) {
  const chart = document.getElementById('weekly-chart');
  chart.innerHTML = '';
  const maxAmount = Math.max(...breakdown.map((item) => Math.max(item.a, item.b))) || 1;

  breakdown.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'chart__row';

    const label = document.createElement('div');
    label.className = 'chart__label';
    label.textContent = item.label;

    const bars = document.createElement('div');
    bars.className = 'chart__bars';

    const barA = document.createElement('div');
    barA.className = 'chart__bar chart__bar--a';
    barA.style.setProperty('--value', `${(item.a / maxAmount) * 100}%`);

    const barB = document.createElement('div');
    barB.className = 'chart__bar chart__bar--b';
    barB.style.setProperty('--value', `${(item.b / maxAmount) * 100}%`);

    const value = document.createElement('div');
    value.className = 'chart__bar-value';
    value.textContent = `${formatCurrency(item.a)} • ${formatCurrency(item.b)}`;

    bars.append(barA, barB);
    row.append(label, bars, value);
    chart.appendChild(row);
  });
}

function renderNotification(users, weeklyTarget) {
  const notification = document.getElementById('notification');
  const [userA, userB] = users;
  const totalThisWeek = users.reduce((sum, user) => sum + user.contributionThisWeek, 0);

  if (userA.hasPaid && userB.hasPaid) {
    notification.textContent = 'Mantap! Minggu ini kompak menabung 🎉.';
  } else if (userA.hasPaid && !userB.hasPaid) {
    const remaining = weeklyTarget - totalThisWeek;
    notification.textContent = `${userA.name} sudah setor ${formatCurrency(userA.contributionThisWeek)}. Yuk ${userB.name}, tinggal ${formatCurrency(remaining)} lagi minggu ini!`;
  } else if (!userA.hasPaid && userB.hasPaid) {
    const remaining = weeklyTarget - totalThisWeek;
    notification.textContent = `${userB.name} sudah setor ${formatCurrency(userB.contributionThisWeek)}. Yuk ${userA.name}, tinggal ${formatCurrency(remaining)} lagi minggu ini!`;
  } else {
    notification.textContent = 'Belum ada setoran minggu ini, semangat mulai dari kamu duluan!';
  }
}

function renderStreak(streakWeeks) {
  const streak = document.getElementById('streak-message');
  streak.textContent = `Sudah ${streakWeeks} minggu berturut-turut kompak ✅`;
}

function initDashboard() {
  updateGoalProgress(savingsData);
  renderUserCards(savingsData.users);
  renderHistory(savingsData.history);
  renderWeeklyTarget(savingsData.weeklyTarget, savingsData.users);
  renderWeeklyChart(savingsData.weeklyBreakdown, savingsData.users);
  renderNotification(savingsData.users, savingsData.weeklyTarget);
  renderStreak(savingsData.streakWeeks);
}

window.addEventListener('DOMContentLoaded', initDashboard);
