// assets/app.js（接续上一版，已整合 data.js）
import { QUESTION_BANK } from './data.js';

// 状态管理增强
const Storage = {
  getStats: () => JSON.parse(localStorage.getItem("yc_stats") || '{"total":0,"correct":0,"badges":[],"modules":{"pinyin-zixing":0,"jushi-bingju":0,"yw-wen":0}}'),
  setStats: (stats) => localStorage.setItem("yc_stats", JSON.stringify(stats)),
  addMistake: (item) => {
    const list = JSON.parse(localStorage.getItem("yc_mistakes") || "[]");
    if (!list.some(q => q.id === item.id)) list.push(item);
    localStorage.setItem("yc_mistakes", JSON.stringify(list));
  },
  clearMistakes: () => localStorage.removeItem("yc_mistakes"),
  getMistakes: () => JSON.parse(localStorage.getItem("yc_mistakes") || "[]")
};

// 题库工具
function getQuestions(moduleKey, count) {
  const pool = QUESTION_BANK[moduleKey] || [];
  if (pool.length < count) return pool.sort(() => 0.5 - Math.random()); // 不足则全取
  return pool.sort(() => 0.5 - Math.random()).slice(0, count);
}

// 公共渲染函数
function renderQuiz(containerId, questions, isGame = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let index = 0;
  let selected = null;
  let locked = false;

  const elQuestion = container.querySelector('#quiz-question') || container.querySelector('#game-question');
  const elOptions = container.querySelector('#quiz-options') || container.querySelector('#game-options');
  const elProgress = container.querySelector('#quiz-progress') || container.querySelector('#game-progress');
  const elFeedback = container.querySelector('#quiz-feedback') || container.querySelector('#game-feedback');
  const btnSubmit = container.querySelector('#quiz-submit') || container.querySelector('#game-submit');
  const btnNext = container.querySelector('#quiz-next') || container.querySelector('#game-next');

  function updateProgress() {
    elProgress.textContent = `${index + 1} / ${questions.length}`;
  }

  function renderQ() {
    const q = questions[index];
    elQuestion.textContent = q.q;
    updateProgress();
    elFeedback.textContent = "";
    selected = null;
    locked = false;
    elOptions.innerHTML = "";
    q.opt.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        if (locked) return;
        selected = opt;
        [...elOptions.children].forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
      elOptions.appendChild(btn);
    });
  }

  btnSubmit.addEventListener("click", () => {
    if (locked || selected === null) return;
    locked = true;
    const q = questions[index];
    const correct = selected === q.ans;
    elFeedback.textContent = correct ? "✓ 回答正确！" : `✗ 错了：${q.exp}`;
    // 更新统计
    const stats = Storage.getStats();
    stats.total += 1;
    if (correct) stats.correct += 1;
    stats.modules[q.type.split('-')[0] || 'other'] += 1;
    Storage.setStats(stats);
    if (!correct) Storage.addMistake(q);
  });

  btnNext.addEventListener("click", () => {
    if (index < questions.length - 1) {
      index++;
      renderQ();
    } else {
      elFeedback.textContent = isGame 
        ? "本游戏已完成！点击其他游戏继续~" 
        : "练习结束！去‘进度成就’查看成果吧～";
    }
  });

  renderQ();
}

// 初始化各页面
function initPractice() {
  const allQ = [
    ...getQuestions("pinyin-zixing", 20),
    ...getQuestions("jushi-bingju", 15),
    ...getQuestions("yw-wen", 17)
  ].sort(() => 0.5 - Math.random()).slice(0, 30); // 综合30题
  renderQuiz("practice-quiz", allQ);
}

function initGames() {
  const gameBtns = document.querySelectorAll("[data-game]");
  const panel = document.getElementById("game-panel");
  if (!panel) return;

  let currentQuestions = [];
  let currentGameName = "";

  gameBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.game;
      let moduleKey, title, count;
      switch (key) {
        case "pinyin": 
          moduleKey = "pinyin-zixing"; title = "字音字形闯关"; count = 20; break;
        case "bingju": 
          moduleKey = "jushi-bingju"; title = "病句诊断室"; count = 15; break;
        case "yw": 
          moduleKey = "yw-wen"; title = "应用文写作挑战"; count = 17; break;
        default: return;
      }
      currentGameName = title;
      document.getElementById("game-title").textContent = title;
      currentQuestions = getQuestions(moduleKey, count);
      renderQuiz("game-panel", currentQuestions, true);
    });
  });

  // 默认加载字音字形
  document.querySelector("[data-game='pinyin']")?.click();
}

function initMistakes() {
  const listEl = document.getElementById("mistake-list");
  const clearBtn = document.getElementById("clear-mistakes");
  if (!listEl) return;

  function render() {
    const mistakes = Storage.getMistakes();
    if (mistakes.length === 0) {
      listEl.innerHTML = "<p>暂无错题，保持住！</p>";
      return;
    }
    listEl.innerHTML = mistakes.map(m => 
      `<div class="card"><h3>[${m.type}] ${m.q}</h3><p>✅ 正确答案：${m.ans}</p><p>💡 解析：${m.exp}</p></div>`
    ).join("");
  }

  clearBtn.addEventListener("click", () => {
    Storage.clearMistakes();
    render();
  });
  render();
}

function initProgress() {
  const stats = Storage.getStats();
  document.getElementById("stat-total").textContent = stats.total;
  const acc = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
  document.getElementById("stat-accuracy").textContent = `${acc}%`;

  const badgesEl = document.getElementById("stat-badges");
  badgesEl.innerHTML = "";
  const mods = stats.modules;
  if (mods["pinyin-zixing"] >= 10) badgesEl.innerHTML += "<li>字音达人</li>";
  if (mods["jushi-bingju"] >= 8) badgesEl.innerHTML += "<li>句式高手</li>";
  if (mods["yw-wen"] >= 10) badgesEl.innerHTML += "<li>应用文小能手</li>";
  if (stats.total >= 30) badgesEl.innerHTML += "<li>全能战士</li>";
  if (!badgesEl.innerHTML) badgesEl.innerHTML = "<li>暂无徽章，继续加油！</li>";
}

document.addEventListener("DOMContentLoaded", () => {
  initPractice();
  initGames();
  initMistakes();
  initProgress();
});
