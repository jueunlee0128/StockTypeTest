// 점수 저장
let scores = {
    안정형: 0,
    균형형: 0,
    공격형: 0,
    장기형: 0,
    단타형: 0,
    감정형: 0,
    분석형: 0
};

let currentQuestion = 0;

// 화면 전환 함수
function transitionToScreen(fromScreen, toScreen) {
    fromScreen.classList.add('fade-out');
    
    // 헤더 표시/숨김 처리
    const startHeader = document.querySelector('#startScreen .header');
    const questionHeaders = document.querySelectorAll('#questionScreens .question-header');
    const resultHeader = document.getElementById('resultHeader');
    
    setTimeout(() => {
        fromScreen.classList.remove('active', 'fade-out');
        toScreen.classList.add('active');
        
        // 헤더 표시 제어
        if (toScreen.id === 'startScreen') {
            // 시작 화면
            if (startHeader) startHeader.style.display = 'flex';
            if (resultHeader) resultHeader.style.display = 'none';
        } else if (toScreen.id === 'resultScreen') {
            // 결과 화면
            if (startHeader) startHeader.style.display = 'none';
            if (resultHeader) resultHeader.style.display = 'flex';
        } else {
            // 질문 화면
            if (startHeader) startHeader.style.display = 'none';
            if (resultHeader) resultHeader.style.display = 'none';
        }
    }, 500);
}

// 질문 화면 생성
function createQuestionScreens() {
    const container = document.getElementById('questionScreens');
    
    questions.forEach((q, index) => {
        const screen = document.createElement('div');
        screen.id = `question${q.id}Screen`;
        screen.className = 'screen';
        
        screen.innerHTML = `
            <div class="question-header">
                <div class="logo-small">
                    <img src="SUMMIT.png" alt="주식 아이콘" class="logo-icon-small logo-btn">
                </div>
                <h2 class="question-title">Q${q.id}. ${q.question}</h2>
                <img src="Search_white.png" alt="검색" class="search-icon-small">
            </div>

            <div class="question-container">
                ${q.answers.map((answer, i) => `
                    <button class="answer-btn" data-answer="${i}">${answer.text}</button>
                `).join('')}
            </div>
        `;
        
        container.appendChild(screen);
    });
}

// 답변 선택 처리
function handleAnswer(questionId, answerIndex) {
    const question = questions[questionId - 1];
    const answer = question.answers[answerIndex];
    
    // 점수 추가
    for (let type in answer.scores) {
        scores[type] += answer.scores[type];
    }
    
    // 다음 질문으로 이동
    const currentScreen = document.getElementById(`question${questionId}Screen`);
    
    if (questionId < questions.length) {
        const nextScreen = document.getElementById(`question${questionId + 1}Screen`);
        transitionToScreen(currentScreen, nextScreen);
    } else {
        // 마지막 질문이면 결과 화면으로
        showResult();
    }
}

// 결과 계산 및 표시
function showResult() {
    const currentScreen = document.getElementById(`question${questions.length}Screen`);
    const resultScreen = document.getElementById('resultScreen');
    
    // 최고 점수 유형 찾기
    let maxScore = 0;
    let resultType = '';
    
    for (let type in scores) {
        if (scores[type] > maxScore) {
            maxScore = scores[type];
            resultType = type;
        }
    }
    
    // 메인 유형 표시
    const typeInfo = investorTypes[resultType];
    document.getElementById('resultType').textContent = typeInfo.title;
    document.getElementById('resultSubtitle').textContent = `"${typeInfo.subtitle}"`;
    
    // 각 축별로 관련 유형 점수를 합산
    const axisScores = {
        // 보수 vs 공격
        보수: scores.안정형 + scores.균형형,
        공격: scores.공격형,
        
        // 단기 vs 장기
        단기: scores.단타형 + scores.공격형,  // 공격형도 단기 투자 관심
        장기: scores.장기형 + scores.안정형,  // 안정형도 장기 보유 성향
        
        // 감정 vs 논리
        감정: scores.감정형,
        논리: scores.분석형,
        
        // 즉흥 vs 계획
        즉흥: scores.단타형 + scores.감정형,  // 빠른 판단, 직감적
        계획: scores.안정형 + scores.분석형,  // 신중한 계획
        
        // 집중 vs 분산
        집중: scores.공격형,  // 한 종목 집중 투자
        분산: scores.안정형 + scores.균형형   // 리스크 분산
    };
    
    // 막대 그래프 표시 (중간 기준 양쪽 모두 표시)
    
    // Bar 1: 보수(왼쪽) vs 공격(오른쪽)
    const bar1Left = document.getElementById('scoreBar1Left');
    const bar1Right = document.getElementById('scoreBar1Right');
    const bar1LeftWidth = `${(axisScores.보수 / 20) * 50}%`;
    const bar1RightWidth = `${(axisScores.공격 / 20) * 50}%`;
    
    // Bar 2: 단기(왼쪽) vs 장기(오른쪽)
    const bar2Left = document.getElementById('scoreBar2Left');
    const bar2Right = document.getElementById('scoreBar2Right');
    const bar2LeftWidth = `${(axisScores.단기 / 20) * 50}%`;
    const bar2RightWidth = `${(axisScores.장기 / 20) * 50}%`;
    
    // Bar 3: 감정(왼쪽) vs 논리(오른쪽)
    const bar3Left = document.getElementById('scoreBar3Left');
    const bar3Right = document.getElementById('scoreBar3Right');
    const bar3LeftWidth = `${(axisScores.감정 / 20) * 50}%`;
    const bar3RightWidth = `${(axisScores.논리 / 20) * 50}%`;
    
    // Bar 4: 즉흥(왼쪽) vs 계획(오른쪽)
    const bar4Left = document.getElementById('scoreBar4Left');
    const bar4Right = document.getElementById('scoreBar4Right');
    const bar4LeftWidth = `${(axisScores.즉흥 / 20) * 50}%`;
    const bar4RightWidth = `${(axisScores.계획 / 20) * 50}%`;
    
    // Bar 5: 집중(왼쪽) vs 분산(오른쪽)
    const bar5Left = document.getElementById('scoreBar5Left');
    const bar5Right = document.getElementById('scoreBar5Right');
    const bar5LeftWidth = `${(axisScores.집중 / 20) * 50}%`;
    const bar5RightWidth = `${(axisScores.분산 / 20) * 50}%`;
    
    // 초기에는 모든 바를 0으로 설정
    bar1Left.style.width = '0%';
    bar1Right.style.width = '0%';
    bar2Left.style.width = '0%';
    bar2Right.style.width = '0%';
    bar3Left.style.width = '0%';
    bar3Right.style.width = '0%';
    bar4Left.style.width = '0%';
    bar4Right.style.width = '0%';
    bar5Left.style.width = '0%';
    bar5Right.style.width = '0%';
    
    // 화면 전환
    transitionToScreen(currentScreen, resultScreen);
    
    // 1초 후에 애니메이션 시작
    setTimeout(() => {
        bar1Left.style.width = bar1LeftWidth;
        bar1Right.style.width = bar1RightWidth;
        bar2Left.style.width = bar2LeftWidth;
        bar2Right.style.width = bar2RightWidth;
        bar3Left.style.width = bar3LeftWidth;
        bar3Right.style.width = bar3RightWidth;
        bar4Left.style.width = bar4LeftWidth;
        bar4Right.style.width = bar4RightWidth;
        bar5Left.style.width = bar5LeftWidth;
        bar5Right.style.width = bar5RightWidth;
    }, 1000);
    
    // 특징 표시 (상위 3개 유형)
    const sortedScores = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    const charCircles = document.getElementById('charCircles');
    charCircles.innerHTML = '';
    
    const characteristics = {
        안정형: '뉴스,\n실적 중시',
        균형형: '느리더라도\n꾸준한 수익 선호',
        공격형: '손실을\n싫어함',
        장기형: '좋은 기업\n오래 보유',
        단타형: '빠른 매매로\n수익',
        감정형: '분위기에\n영향받음',
        분석형: '데이터\n중심 투자'
    };
    
    sortedScores.forEach(([type, score]) => {
        if (score > 0) {
            const circle = document.createElement('div');
            circle.className = 'char-circle';
            circle.textContent = characteristics[type] || investorTypes[type].subtitle;
            charCircles.appendChild(circle);
        }
    });
    
    transitionToScreen(currentScreen, resultScreen);
}

// 테스트 재시작
function resetTest() {
    scores = {
        안정형: 0,
        균형형: 0,
        공격형: 0,
        장기형: 0,
        단타형: 0,
        감정형: 0,
        분석형: 0
    };
    currentQuestion = 0;
    
    const currentScreen = document.querySelector('.screen.active');
    const startScreen = document.getElementById('startScreen');
    if (currentScreen && currentScreen !== startScreen) {
        transitionToScreen(currentScreen, startScreen);
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 질문 화면 생성
    createQuestionScreens();
    
    // START 버튼
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', function() {
        const startScreen = document.getElementById('startScreen');
        const firstQuestion = document.getElementById('question1Screen');
        transitionToScreen(startScreen, firstQuestion);
    });
    
    // 터치 디바이스 지원
    startBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.style.transform = 'translateY(-2px)';
    });
    
    startBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.click();
    });
    
    // 모달 관련 이벤트
    const modal = document.getElementById('confirmModal');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    
    function showModal() {
        modal.style.display = 'flex';
    }
    
    function hideModal() {
        modal.style.display = 'none';
    }
    
    modalCancel.addEventListener('click', hideModal);
    
    modalConfirm.addEventListener('click', function() {
        hideModal();
        resetTest();
    });
    
    // 로고 클릭 이벤트 (모든 로고에 적용)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('logo-icon-small') || e.target.classList.contains('logo-btn')) {
            const startScreen = document.getElementById('startScreen');
            const currentScreen = document.querySelector('.screen.active');
            if (currentScreen !== startScreen) {
                showModal();
            }
        }
    });
    
    // 답변 버튼 클릭 이벤트
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('answer-btn')) {
            const answerIndex = parseInt(e.target.dataset.answer);
            const questionScreen = e.target.closest('.screen');
            const questionId = parseInt(questionScreen.id.match(/\d+/)[0]);
            
            handleAnswer(questionId, answerIndex);
        }
    });
    
    // 재시작 버튼
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', resetTest);
    }
    
    // 로고 버튼 (결과 화면)
    const logoBtn2 = document.getElementById('logoBtn2');
    if (logoBtn2) {
        logoBtn2.addEventListener('click', function() {
            showModal();
        });
    }
});
