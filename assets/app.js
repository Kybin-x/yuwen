const AppData = {
  quizzes: [
    {
      id: "pinyin-1",
      type: "pinyin",
      question: "“处”在“处理事务”中的读音是：",
      options: ["chù", "chǔ", "chùan", "chú"],
      answer: "chǔ",
      explanation: "“处”作动词读 chǔ。"
    },
    {
      id: "pinyin-2",
      type: "pinyin",
      question: "“血”在“血液”中的读音是：",
      options: ["xiě", "xuè", "xué", "xie"],
      answer: "xuè",
      explanation: "书面语读 xuè。"
    },
    {
      id: "zixing-1",
      type: "zixing",
      question: "下面词语中正确的一项是：",
      options: ["松弛", "松驰", "松驰儿", "松炽"],
      answer: "松弛",
      explanation: "“松弛”是正确写法。"
    },
    {
      id: "zixing-2",
      type: "zixing",
      question: "下面词语中正确的一项是：",
      options: ["装帧", "装桢", "装祯", "装贞"],
      answer: "装帧",
      explanation: "“装帧”是正确写法。"
    },
    {
      id: "bingju-1",
      type: "bingju",
      question: "“这种主张受到大家讨论。”病句类型是：",
      options: ["搭配不当", "表意不明", "成分残缺", "语序不当"],
      answer: "表意不明",
      explanation: "“这种主张”指代不明。"
    },
    {
      id: "bingju-2",
      type: "bingju",
      question: "“我们要努力把学习提高上去。”病句类型是：",
      options: ["搭配不当", "表意不明", "语序不当", "结构混乱"],
      answer: "搭配不当",
      explanation: "“把学习提高”搭配不当，应为“把成绩提高”。"
    },
    {
      id: "jushi-1",
      type: "jushi",
      question: "将“老师表扬了同学”改为被动句：",
      options: ["老师把同学表扬了", "同学被老师表扬了", "同学表扬了老师", "表扬了同学老师"],
      answer: "同学被老师表扬了",
      explanation: "被动句结构为“被 + 施事”。"
    },
    {
      id: "jushi-2",
      type: "jushi",
      question: "下列哪项是更书面化的表达？",
      options: ["他挺厉害", "他很牛", "他表现优异", "他太棒了"],
      answer: "他表现优异",
      explanation: "更书面化、正式。"
    }
  ],
  games: {
    pinyin: {
      title: "多音字闯关",
      count: 5,
      poolType: "pinyin"
    },
    zixing: {
      title: "错别字消消乐",
      count: 5,
      poolType: "zixing"
    },
    bingju: {
      title: "病句诊断室",
      count: 5,
      poolType: "bingju"
    },
    jushi: {
      title: "句式变换挑战",
      count: 5,
      poolType: "jushi"
    }
  }
};

const Storage = {
  getStats() {
    const raw = localStorage.getItem("yc_stats");
    return raw ? JSON.parse(raw) : { total: 0, correct: 0, badges: [] };
  },
  setStats(stats) {
    localStorage.setItem("yc_stats", JSON.stringify(stats));
  },
  addMistake(item) {
    const raw = localStorage.getItem("yc_mistakes");
    const list = raw ? JSON.parse(raw) : [];
    const exists = list.find(q => q.id === item.id);
    if (!exists) {
      list.push(item);
      localStorage.setItem("yc_mistakes", JSON.stringify(list));
    }
  },
  getMistakes() {
    const raw = localStorage.getItem("yc_mistakes");
    return raw ? JSON.parse(raw) : [];
  },
  clearMistakes() {
    localStorage.removeItem("yc_mistakes");
  }
};

function pickRandomQuestions(type, count) {
  const pool = AppData.quizzes.filter(q => q.type === type);
  const shuffled = pool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function updateStats(isCorrect) {
  const stats = Storage.getStats();
  stats.total += 1;
  if (isCorrect) stats.correct += 1;

  const accuracy = stats.total ? stats.correct / stats.total : 0;
  stats.badges = [];

  if (stats.total >= 5) stats.badges.push("初学者");
  if (accuracy >= 0.7 && stats.total >= 10) stats.badges.push("稳定输出");
  if (accuracy >= 0.85 && stats.total >= 20) stats.badges.push("语文达人");

  Storage.setStats(stats);
}

function initPractice() {
  const elQuestion = document.getElementById("quiz-question");
  const elOptions = document.getElementById("quiz-options");
  const elProgress = document.getElementById("quiz-progress");
  const elFeedback = document.getElementById("quiz-feedback");
  const btnSubmit = document.getElementById("quiz-submit");
  const btnNext = document.getElementById("quiz-next");

  if (!elQuestion) return;

  const questions = AppData.quizzes.sort(() => 0.5 - Math.random()).slice(0, 10);
  let index = 0;
  let selected = null;
  let locked = false;

  function render() {
    const q = questions[index];
    elQuestion.textContent = q.question;
    elProgress.textContent = `${index + 1} / ${questions.length}`;
    elFeedback.textContent = "";
    selected = null;
    locked = false;
    elOptions.innerHTML = "";
    q.options.forEach(opt => {
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
    const correct = selected === q.answer;
    elFeedback.textContent = correct ? "回答正确！" : `答错了：${q.explanation}`;
    updateStats(correct);
    if (!correct) Storage.addMistake(q);
  });

  btnNext.addEventListener("click", () => {
    if (index < questions.length - 1) {
      index += 1;
      render();
    } else {
      elFeedback.textContent = "练习完成！可以去进度成就页查看数据。";
    }
  });

  render();
}

function initGames() {
  const panel = document.getElementById("game-panel");
  const title = document.getElementById("game-title");
  const questionEl = document.getElementById("game-question");
  const optionsEl = document.getElementById("game-options");
  const progressEl = document.getElementById("game-progress");
  const feedbackEl = document.getElementById("game-feedback");
  const btnSubmit = document.getElementById("game-submit");
  const btnNext = document.getElementById("game-next");

  if (!panel) return;

  let gameQuestions = [];
  let index = 0;
  let selected = null;
  let locked = false;

  function render() {
    const q = gameQuestions[index];
    title.textContent = currentGame.title;
    questionEl.textContent = q.question;
    progressEl.textContent = `${index + 1} / ${gameQuestions.length}`;
    feedbackEl.textContent = "";
    selected = null;
    locked = false;
    optionsEl.innerHTML = "";
    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        if (locked) return;
        selected = opt;
        [...optionsEl.children].forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
      optionsEl.appendChild(btn);
    });
  }

  function startGame(gameKey) {
    currentGame = AppData.games[gameKey];
    gameQuestions = pickRandomQuestions(currentGame.poolType, currentGame.count);
    index = 0;
    render();
  }

  let currentGame = AppData.games.pinyin;

  document.querySelectorAll("[data-game]").forEach(btn => {
    btn.addEventListener("click", () => startGame(btn.dataset.game));
  });

  btnSubmit.addEventListener("click", () => {
    if (locked || selected === null) return;
    locked = true;
    const q = gameQuestions[index];
    const correct = selected === q.answer;
    feedbackEl.textContent = correct ? "回答正确！" : `答错了：${q.explanation}`;
    updateStats(correct);
    if (!correct) Storage.addMistake(q);
  });

  btnNext.addEventListener("click", () => {
    if (index < gameQuestions.length - 1) {
      index += 1;
      render();
    } else {
      feedbackEl.textContent = "本轮结束，换个游戏继续吧！";
    }
  });

  startGame("pinyin");
}

function initMistakes() {
  const container = document.getElementById("mistake-list");
  const clearBtn = document.getElementById("clear-mistakes");
  if (!container) return;

  function render() {
    const mistakes = Storage.getMistakes();
    if (!mistakes.length) {
      container.innerHTML = "<p>暂无错题，保持住！</p>";
      return;
    }
    container.innerHTML = "";
    mistakes.forEach(item => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h3>${item.question}</h3><p>正确答案：${item.answer}</p>`;
      container.appendChild(div);
    });
  }

  clearBtn.addEventListener("click", () => {
    Storage.clearMistakes();
    render();
  });

  render();
}

function initProgress() {
  const totalEl = document.getElementById("stat-total");
  const accEl = document.getElementById("stat-accuracy");
  const badgesEl = document.getElementById("stat-badges");

  if (!totalEl) return;

  const stats = Storage.getStats();
  totalEl.textContent = stats.total;
  const accuracy = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
  accEl.textContent = `${accuracy}%`;

  badgesEl.innerHTML = "";
  if (!stats.badges.length) {
    badgesEl.innerHTML = "<li>暂无徽章，继续加油！</li>";
  } else {
    stats.badges.forEach(badge => {
      const li = document.createElement("li");
      li.textContent = badge;
      badgesEl.appendChild(li);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initPractice();
  initGames();
  initMistakes();
  initProgress();
});
