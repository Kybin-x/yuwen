// JavaScript Document
// challenge.js - 知识闯关游戏逻辑

class ChallengeGame {
  constructor() {
    this.quizBank = quizBank;
    this.currentQuizIndex = 0;
    this.user = {
      name: '',
      class: '',
      id: ''
    };
    this.score = 0;
    this.answers = [];
    this.isStarted = false;
    
    // DOM元素引用
    this.registerPage = document.getElementById('registerPage');
    this.challengePage = document.getElementById('challengePage');
    this.resultPage = document.getElementById('resultPage');
    
    this.form = document.getElementById('registerForm');
    this.btnStart = document.getElementById('btnStart');
    this.btnSubmit = document.getElementById('btnSubmit');
    this.btnNext = document.getElementById('btnNext');
    this.progressFill = document.getElementById('progressFill');
    this.progressText = document.getElementById('progressText');
    this.userBadge = document.getElementById('userBadge');
    this.quizNumber = document.getElementById('quizNumber');
    this.quizPoint = document.getElementById('quizPoint');
    this.quizQuestion = document.getElementById('quizQuestion');
    this.quizOptions = document.getElementById('quizOptions');
    this.quizFeedback = document.getElementById('quizFeedback');
    this.resultScore = document.getElementById('resultScore');
    this.resultBadge = document.getElementById('resultBadge');
    this.resultMessage = document.getElementById('resultMessage');
    this.btnReview = document.getElementById('btnReview');
    this.btnRestart = document.getElementById('btnRestart');
    
    this.init();
  }
  
  init() {
    // 注册表单提交
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.startRegistration();
    });
    
    // 提交按钮
    this.btnSubmit.addEventListener('click', () => this.submitAnswer());
    
    // 下一题按钮
    this.btnNext.addEventListener('click', () => this.nextQuestion());
    
    // 错题练习
    this.btnReview.addEventListener('click', () => this.reviewMistakes());
    
    // 重新闯关
    this.btnRestart.addEventListener('click', () => this.restartChallenge());
  }
  
  startRegistration() {
    const className = document.getElementById('className').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    
    if (!className || !studentId || !studentName) {
      alert('请填写所有信息！');
      return;
    }
    
    if (studentId.length !== 9 || !/^\d+$/.test(studentId)) {
      document.getElementById('idError').textContent = '学号必须是9位数字';
      return;
    }
    
    this.user = {
      name: studentName,
      class: className,
      id: studentId
    };
    
    this.userBadge.textContent = `${studentName}的挑战`;
    this.registerPage.classList.add('hidden');
    this.challengePage.classList.remove('hidden');
    
    this.loadQuestion(this.currentQuizIndex);
    this.isStarted = true;
  }
  
  loadQuestion(index) {
    const quiz = this.quizBank[index];
    this.quizNumber.textContent = `第${index + 1}题`;
    this.quizPoint.textContent = quiz.point;
    this.quizQuestion.textContent = quiz.question;
    
    // 清空选项
    this.quizOptions.innerHTML = '';
    
    // 创建选项按钮
    quiz.options.forEach((option, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.dataset.option = String.fromCharCode(65 + i);
      btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + i)}.</span> ${option}`;
      btn.addEventListener('click', () => this.selectOption(btn));
      this.quizOptions.appendChild(btn);
    });
    
    // 更新进度
    this.progressFill.style.width = `${((index + 1) / this.quizBank.length) * 100}%`;
    this.progressText.textContent = `${index + 1}/${this.quizBank.length}`;
    
    // 重置状态
    this.quizFeedback.classList.add('hidden');
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected', 'correct', 'wrong'));
    this.btnSubmit.disabled = false;
    this.btnNext.classList.add('hidden');
  }
  
  selectOption(button) {
    // 取消其他选项的选中状态
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
    
    // 选中当前选项
    button.classList.add('selected');
  }
  
  submitAnswer() {
    const selected = document.querySelector('.option-btn.selected');
    
    if (!selected) {
      this.showFeedback('请选择一个答案！', 'wrong');
      return;
    }
    
    const selectedOption = selected.dataset.option;
    const quiz = this.quizBank[this.currentQuizIndex];
    
    // 记录答案
    this.answers.push({
      id: quiz.id,
      userAnswer: selectedOption,
      correctAnswer: quiz.answer,
      isCorrect: selectedOption === quiz.answer
    });
    
    // 更新分数
    if (selectedOption === quiz.answer) {
      this.score += 4; // 每题4分，共24题，满分100分（实际100分制）
    }
    
    // 显示反馈
    if (selectedOption === quiz.answer) {
      this.showFeedback(`✅ 答对了！\n${quiz.explanation}`, 'correct');
      selected.classList.add('correct');
    } else {
      this.showFeedback(`❌ 答错了！\n正确答案：${quiz.answer}\n${quiz.explanation}`, 'wrong');
      selected.classList.add('wrong');
    }
    
    // 启用下一题按钮
    this.btnNext.classList.remove('hidden');
    this.btnSubmit.disabled = true;
  }
  
  showFeedback(message, type) {
    this.quizFeedback.innerHTML = `<div class="feedback-title ${type}">${message.split('\n')[0]}</div><div class="feedback-content">${message.split('\n').slice(1).join('<br>')}</div>`;
    this.quizFeedback.classList.remove('hidden', 'correct', 'wrong');
    this.quizFeedback.classList.add(type);
    
    // 添加动画效果
    this.quizFeedback.style.animation = 'slideIn 0.3s ease';
    setTimeout(() => {
      this.quizFeedback.style.animation = '';
    }, 300);
  }
  
  nextQuestion() {
    this.currentQuizIndex++;
    
    if (this.currentQuizIndex < this.quizBank.length) {
      this.loadQuestion(this.currentQuizIndex);
    } else {
      this.showResult();
    }
  }
  
  showResult() {
    this.challengePage.classList.add('hidden');
    this.resultPage.classList.remove('hidden');
    
    // 计算分数（24题，每题约4.17分，总分100）
    const score = Math.round((this.score / 100) * 100);
    this.resultScore.textContent = score;
    
    // 生成称号
    const titles = [
      { min: 90, name: "【标点圣手】", desc: "连编辑都为你点赞！" },
      { min: 80, name: "【规范达人】", desc: "细节控の终极形态！" },
      { min: 70, name: "【勤学先锋】", desc: "进步神速，再接再厉！" },
      { min: 0,  name: "【潜力新星】", desc: "火种已点燃，下次必闪耀！" }
    ];
    
    let badge = titles[0].name;
    let message = titles[0].desc;
    
    for (let i = 0; i < titles.length; i++) {
      if (score >= titles[i].min) {
        badge = titles[i].name;
        message = titles[i].desc;
        break;
      }
    }
    
    this.resultBadge.textContent = badge;
    this.resultMessage.innerHTML = `🎉 ${this.user.name}，你已击败全校 ${Math.floor(score / 2)}% 的同学！<br>${message}`;
    
    // 如果有错题，显示错题练习按钮
    const mistakes = this.answers.filter(a => !a.isCorrect);
    if (mistakes.length === 0) {
      this.btnReview.textContent = "🏆 全部答对！";
      this.btnReview.disabled = true;
    }
  }
  
  reviewMistakes() {
    const mistakes = this.answers.filter(a => !a.isCorrect);
    if (mistakes.length === 0) return;
    
    // 创建错题页面
    const div = document.createElement('div');
    div.className = 'mistake-review';
    div.innerHTML = `
      <div class="review-header">
        <h2>❌ 错题回顾</h2>
        <button class="btn-close">&times;</button>
      </div>
      <div class="review-content">
        ${mistakes.map((m, i) => {
          const quiz = this.quizBank.find(q => q.id === m.id);
          return `
            <div class="mistake-item">
              <div class="mistake-header">第${i + 1}题 | ${quiz.point}</div>
              <div class="mistake-question">${quiz.question}</div>
              <div class="mistake-options">
                ${quiz.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isCorrect = letter === m.correctAnswer;
                  const isSelected = letter === m.userAnswer;
                  let cls = '';
                  if (isCorrect) cls = ' correct';
                  if (isSelected && !isCorrect) cls = ' wrong';
                  return `<div class="option${cls}">${letter}. ${opt}</div>`;
                }).join('')}
              </div>
              <div class="mistake-explanation">正确答案：${m.correctAnswer}<br>${quiz.explanation}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    
    document.body.appendChild(div);
    
    // 关闭按钮
    div.querySelector('.btn-close').addEventListener('click', () => {
      document.body.removeChild(div);
    });
  }
  
  restartChallenge() {
    this.currentQuizIndex = 0;
    this.score = 0;
    this.answers = [];
    this.isStarted = false;
    
    this.resultPage.classList.add('hidden');
    this.registerPage.classList.remove('hidden');
    
    // 重置表单
    document.getElementById('className').value = '';
    document.getElementById('studentId').value = '';
    document.getElementById('studentName').value = '';
    document.getElementById('idError').textContent = '';
  }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', function() {
  window.challengeGame = new ChallengeGame();
});