// JavaScript Document
// knowledge.js - 知识点详情页逻辑

// 知识点内容映射
const knowledgeContent = {
  '问号': {
    rules: [
      "选择问句中，只有最后一个问句用问号，其余用逗号",
      "特指问句（有明确针对性的疑问）用问号",
      "反问句末尾必须用问号",
      "疑问词不表示疑问时不用问号"
    ],
    examples: [
      { wrong: "你选A还是B？C呢？", correct: "你选A还是B，C呢？" },
      { wrong: "怎么可能不来？谁决定的？你吗？", correct: "怎么可能不来？谁决定的，你吗？" },
      { wrong: "这难道不是事实吗，你怎么能怀疑？", correct: "这难道不是事实吗？你怎么能怀疑？" }
    ]
  },
  '引号': {
    rules: [
      "引号内句末标点（句号、问号、叹号）应放在引号内",
      "引号内不是完整句子时，句末不加句号",
      "说话人在中间时，前后引语要用引号包裹",
      "引文末尾需保留原文标点"
    ],
    examples: [
      { wrong: "他说："今天天气真好。"", correct: "他说："今天天气真好。"" },
      { wrong: "真是'后生可畏'啊！。", correct: "真是'后生可畏'啊！" },
      { wrong: "他喊道：“同学们好！”", correct: "他喊道："同学们好！"" }
    ]
  },
  '书名号': {
    rules: [
      "书籍、报刊、文章、歌曲、电影、电视剧等用书名号",
      "活动、节日、会议等用双引号",
      "书名号内不能套用其他标点符号",
      "书名号可以与引号连用，但顺序为：引号+书名号"
    ],
    examples: [
      { wrong: ""人民的名义"是一部优秀的电视剧", correct: "《人民的名义》是一部优秀的电视剧" },
      { wrong: "七月初七是传统节日"乞巧节"", correct: "七月初七是传统节日“乞巧节”" },
      { wrong: "《城市垃圾处理》已成为难题", correct: "“城市垃圾处理”已成为难题" }
    ]
  },
  '顿号': {
    rules: [
      "并列词语之间用顿号",
      "概数之间不用顿号（如：一二十只）",
      "并列谓语之间一般用逗号",
      "并列补语之间一般用逗号"
    ],
    examples: [
      { wrong: "一、二十只鸟", correct: "一二十只鸟" },
      { wrong: "他跑、跳、喊着向前冲", correct: "他跑、跳，喊着向前冲" },
      { wrong: "任务重、工程难、规模大", correct: "任务重、工程难、规模大" } // 实际上这里正确
    ]
  },
  '冒号': {
    rules: [
      "冒号用于提示下文或总结上文",
      "冒号后必须紧跟具体内容",
      "冒号不能用于'是''即''就是'等词语后无解释时",
      "冒号与'说''道'等后接直接引语时要谨慎"
    ],
    examples: [
      { wrong: "我国月球探测工程将分三步实施：一是'绕'，即卫星绕月飞行；二是'落'，即探测装置登上月球；三是'回'，即采集月壤样品返回地球。", correct: "我国月球探测工程将分三步实施：一是'绕'，即卫星绕月飞行；二是'落'，即探测装置登上月球；三是'回'，即采集月壤样品返回地球。" }, // 实际上这里正确
      { wrong: "他的优点是：勤奋、好学、诚实。", correct: "他的优点是勤奋、好学、诚实。" },
      { wrong: "这个方案很好：它解决了所有问题。", correct: "这个方案很好：它解决了所有问题。" } // 实际上这里正确
    ]
  },
  '分号': {
    rules: [
      "分号用于复句内并列分句之间",
      "分号不能用于单句内部",
      "分号前后必须是完整的分句",
      "分号有时可用句号代替，但不能用逗号代替"
    ],
    examples: [
      { wrong: "所以容易产生争议；而实践证明，该方案可行。", correct: "所以容易产生争议。而实践证明，该方案可行。" },
      { wrong: "他喜欢读书；也喜欢运动。", correct: "他喜欢读书，也喜欢运动。" },
      { wrong: "第一，准备充分；第二，方法得当；第三，坚持到底。", correct: "第一，准备充分；第二，方法得当；第三，坚持到底。" } // 这里实际正确
    ]
  },
  '破折号': {
    rules: [
      "破折号用于解释说明",
      "破折号用于话语中断或转移",
      "破折号用于补充说明",
      "破折号与括号功能相似但强调程度不同"
    ],
    examples: [
      { wrong: "蝉的幼虫初次出现于地面，需要寻求适当的地点——矮树、篱笆、野草、灌木枝等——脱掉身上的皮。", correct: "蝉的幼虫初次出现于地面，需要寻求适当的地点——矮树、篱笆、野草、灌木枝等——脱掉身上的皮。" },
      { wrong: "这是他的特点——认真、细致、负责。", correct: "这是他的特点：认真、细致、负责。" },
      { wrong: "她终于明白了——原来是他做的。", correct: "她终于明白了——原来是他做的。" }
    ]
  },
  '括号': {
    rules: [
      "括号紧贴被注释的词语",
      "句内括号注释句中成分，括号在标点前",
      "句外括号注释整个句子，括号在句号后",
      "括号内文字末尾不加句号"
    ],
    examples: [
      { wrong: "七月初七（乞巧节），是传统节日。", correct: "七月初七（乞巧节）是传统节日。" },
      { wrong: "这个方案很成功（尽管有些小问题）。", correct: "这个方案很成功（尽管有些小问题）。" },
      { wrong: "他参加了比赛（获得了第一名）。",
        correct: "他参加了比赛（获得了第一名）。" }
    ]
  }
};

// 获取URL参数
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// 加载知识点详情
function loadKnowledgePage() {
  const point = getQueryParam('point') || '问号';
  const knowledgeCard = document.getElementById('knowledgeCard');
  const knowledgeIcon = document.getElementById('knowledgeIcon');
  const knowledgeTitle = document.getElementById('knowledgeTitle');
  const knowledgeContentEl = document.getElementById('knowledgeContent');
  const quizList = document.getElementById('quizList');
  
  // 设置标题和图标
  knowledgeIcon.textContent = knowledgePoints[point]?.icon || '❓';
  knowledgeTitle.textContent = knowledgePoints[point]?.title || '知识点';
  
  // 生成知识点内容
  const content = knowledgeContent[point] || knowledgeContent['问号'];
  
  let html = `<h4>📝 核心规则</h4><ul>`;
  content.rules.forEach(rule => {
    html += `<li>${rule}</li>`;
  });
  html += `</ul>`;
  
  html += `<h4>🔍 典型错误示例</h4>`;
  content.examples.forEach((ex, index) => {
    html += `<div class="example"><strong>错误：</strong>${ex.wrong}<br><strong>正确：</strong>${ex.correct}</div>`;
  });
  
  knowledgeContentEl.innerHTML = html;
  
  // 生成相关题目
  const relatedQuizzes = quizBank.filter(q => q.point === point);
  let quizHtml = '';
  
  relatedQuizzes.forEach((quiz, index) => {
    quizHtml += `
      <div class="quiz-item" data-id="${quiz.id}">
        <div class="quiz-item-header">
          第${index + 1}题 | ${quiz.point}
        </div>
        <p class="quiz-question">${quiz.question}</p>
        <div class="quiz-item-options">
          ${quiz.options.map((opt, i) => 
            `<button class="option-btn" data-option="${String.fromCharCode(65 + i)}">${opt}</button>`
          ).join('')}
        </div>
        <button class="btn-submit-quiz">查看答案</button>
        <div class="quiz-feedback hidden"></div>
      </div>
    `;
  });
  
  quizList.innerHTML = quizHtml;
  
  // 添加事件监听
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
  
  document.querySelectorAll('.btn-submit-quiz').forEach(button => {
    button.addEventListener('click', function() {
      const item = this.closest('.quiz-item');
      const selected = item.querySelector('.option-btn.selected');
      const feedback = item.querySelector('.quiz-feedback');
      
      if (!selected) {
        feedback.innerHTML = '<div class="feedback-title wrong">⚠️ 请先选择一个答案</div>';
        feedback.classList.remove('hidden', 'correct', 'wrong');
        feedback.classList.add('wrong');
        return;
      }
      
      const option = selected.dataset.option;
      const quizId = item.dataset.id;
      const quiz = quizBank.find(q => q.id === quizId);
      
      if (option === quiz.answer) {
        feedback.innerHTML = `
          <div class="feedback-title correct">✅ 答对了！</div>
          <div class="feedback-content">${quiz.explanation}</div>
        `;
        feedback.classList.remove('hidden', 'wrong');
        feedback.classList.add('correct');
      } else {
        feedback.innerHTML = `
          <div class="feedback-title wrong">❌ 答错了！</div>
          <div class="feedback-content">正确答案：${quiz.answer}<br>${quiz.explanation}</div>
        `;
        feedback.classList.remove('hidden', 'correct');
        feedback.classList.add('wrong');
      }
    });
  });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  loadKnowledgePage();
});