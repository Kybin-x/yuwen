// main.js - 首页知识点卡片生成逻辑

// 知识点配置
const knowledgePoints = {
  '问号': {
    icon: '❓',
    title: '问号',
    subtitle: '选择问句与疑问语气',
    color: 'question',
    description: '掌握选择问句、特指问句的标点使用规则'
  },
  '引号': {
    icon: '“”',
    title: '引号',
    subtitle: '引用与特殊含义',
    color: 'quote',
    description: '理解引号内标点位置及引用规范'
  },
  '书名号': {
    icon: '《》',
    title: '书名号',
    subtitle: '作品名称标示',
    color: 'book',
    description: '区分书名号与双引号的使用场景'
  },
  '顿号': {
    icon: '、',
    title: '顿号',
    subtitle: '并列词语停顿',
    color: 'comma',
    description: '掌握顿号与逗号在并列成分中的区别'
  },
  '冒号': {
    icon: '：',
    title: '冒号',
    subtitle: '提示与总结',
    color: 'colon',
    description: '理解冒号的提示、总结、解释作用'
  },
  '分号': {
    icon: '；',
    title: '分号',
    subtitle: '并列分句连接',
    color: 'semicolon',
    description: '掌握分号在复句中的使用规则'
  },
  '破折号': {
    icon: '——',
    title: '破折号',
    subtitle: '解释说明与转折',
    color: 'dash',
    description: '理解破折号的注释、插说、转折功能'
  },
  '括号': {
    icon: '（）',
    title: '括号',
    subtitle: '注释与补充说明',
    color: 'bracket',
    description: '掌握括号的位置与注释对象'
  }
};

// 统计每个知识点的题目数量
function countQuizByPoint() {
  const counts = {};
  quizBank.forEach(quiz => {
    const point = quiz.point;
    counts[point] = (counts[point] || 0) + 1;
  });
  return counts;
}

// 生成卡片
function generateCards() {
  const cardGrid = document.getElementById('cardGrid');
  const quizCounts = countQuizByPoint();
  
  Object.keys(knowledgePoints).forEach(pointName => {
    const point = knowledgePoints[pointName];
    const quizCount = quizCounts[pointName] || 0;
    
    const card = document.createElement('div');
    card.className = `knowledge-card-item card-${point.color}`;
    card.onclick = () => {
      location.href = `knowledge.html?point=${encodeURIComponent(pointName)}`;
    };
    
    card.innerHTML = `
      <span class="card-icon">${point.icon}</span>
      <h3 class="card-title">${point.title}</h3>
      <p class="card-subtitle">${point.subtitle}</p>
      <div class="card-stats">
        <span>已掌握 ${quizCount}/24</span>
        <span>${point.description}</span>
      </div>
    `;
    
    cardGrid.appendChild(card);
  });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  generateCards();
});