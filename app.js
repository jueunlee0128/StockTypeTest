// 점수 저장
let scores = {
    안정형: 0,
    균형형: 0,
    공격형: 0,
    즉흥형: 0,
    장기형: 0,
    단타형: 0,
    감정형: 0,
    분석형: 0,
    집중형: 0,
    단기형: 0,
    논리형: 0,
    계획형: 0,
    분산형: 0,
    보수형: 0,
    중립형: 0,
};

let currentQuestion = 0;

// 스토리 스크립트
const storyScript = [
    { 
        speaker: "나레이션",
        line: "2027년, 대한민국은 투자에 미쳐버렸다.",
        images: [
            { src: "images/ThirdImage.png", position: "left", height: "100%", width: "auto", delay: 700},
            { src: "images/FirstImage.png", position: "right", height: "100%", width: "auto"},
        ]
    },
    { 
        speaker: "나레이션",
        line: "교장쌤은 코인 BJ, 영어쌤은 미국 주식 유튜버가 됐다.",
        images: [
            { src: "images/bitcoin.png", position: "right", height: "80%", width: "auto", delay: 1000 },
            { src: "images/Youtube.png", position: "left", height: "80%", width: "auto" }
        ]
    },
    { 
        speaker: "나레이션", 
        line: "어느 날, 디미가 소리친다.", 
        images: [
            { src: "images/shouting.png", position: "center", height: "80%", width: "auto"}
        ]
    },
    { 
        speaker: "디미", 
        line: "야!!!! 이 코인 오늘 700% 간대!!!!",
        image: { src: "images/Dimi.png", position: "left" }
    },
];
let currentStoryIndex = 0;
let isTyping = false;
let typingTimeout;
let imageTimeoutIds = []; // 이미지 타임아웃 ID 저장 배열

// 질문 후 스토리 스크립트
const postQuestion1Script = [
    { 
        speaker: "나레이션", 
        line: "📉 주식 -94% (손이 덜덜)",
        image: { src: "images/FourthImage.png", position: "center", height: "70%", width: "auto" }
    },
    { 
        speaker: "나레이션",
        line: "디미가 다시 속삭인다.",
        image: { src: "images/FifthImage.png", position: "center", height: "80%", width: "auto"}
    },
    { 
        speaker: "디미", 
        line: "야… 지금이 진짜 저점이래… (찡긋★)",
        image: { src: "images/Image.png", position: "center", height: "80%", width: "auto" }
    },
];
let postQuestionStoryIndex = 0;
let onPostStoryComplete = null;

// 질문 후 스토리 표시 함수
function showPostQuestionStory(script, onComplete) {
    postQuestionStoryIndex = 0; // 인덱스 초기화
    onPostStoryComplete = onComplete; // 완료 콜백 저장
    
    const dialogueBox = document.querySelector('.dialogue-box');
    
    // 기존 이벤트 리스너 제거
    const newDialogueBox = dialogueBox.cloneNode(true);
    dialogueBox.parentNode.replaceChild(newDialogueBox, dialogueBox);

    // 새 이벤트 리스너 추가
    newDialogueBox.addEventListener('click', handlePostStoryClick);

    // 첫 대사 시작
    showNextPostStoryLine(script);
}

function showNextPostStoryLine(script) {
    if (postQuestionStoryIndex >= script.length) {
        if (onPostStoryComplete) {
            onPostStoryComplete();
        }
        // 이벤트 리스너 원래대로 되돌리기
        const dialogueBox = document.querySelector('.dialogue-box');
        const newDialogueBox = dialogueBox.cloneNode(true);
        dialogueBox.parentNode.replaceChild(newDialogueBox, dialogueBox);
        newDialogueBox.addEventListener('click', handleIntroStoryClick);

        return;
    }

    const dialogue = script[postQuestionStoryIndex];
    const dialogueText = document.getElementById('dialogueText');
    const characterName = document.getElementById('characterName');
    const imageContainer = document.getElementById('character-images');

    imageContainer.innerHTML = ''; // 이전 이미지/효과 제거

    if (dialogue.image) {
        const img = document.createElement('img');
        img.src = dialogue.image.src;
        img.className = `character-image ${dialogue.image.position}`;
        if (dialogue.image.width) img.style.width = dialogue.image.width;
        if (dialogue.image.height) img.style.height = dialogue.image.height;
        imageContainer.appendChild(img);
        setTimeout(() => img.classList.add('show'), 10);
    }

    characterName.innerText = dialogue.speaker;
    typeWriter(dialogueText, dialogue.line, 50);

    postQuestionStoryIndex++;
}

function handlePostStoryClick() {
    const script = postQuestion1Script; // 현재는 고정
    const currentLine = script[postQuestionStoryIndex - 1].line;
    const dialogueText = document.getElementById('dialogueText');

    if (isTyping) {
        skipTyping(dialogueText, currentLine);
    } else {
        showNextPostStoryLine(script);
    }
}

function handleIntroStoryClick() {
    if (currentStoryIndex > 0) { // 스토리가 시작된 후에만 작동
        const currentLine = storyScript[currentStoryIndex - 1].line;
        const dialogueText = document.getElementById('dialogueText');

        if (isTyping) {
            skipTyping(dialogueText, currentLine);
        } else {
            showNextDialogue();
        }
    }
}

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
    
    const currentScreen = document.getElementById(`question${questionId}Screen`);

    // 첫 번째 질문에 대한 답변 후 특별 스토리 표시
    if (questionId === 1) {
        const blankScreen = document.getElementById('blankScreen');
        transitionToScreen(currentScreen, blankScreen);
        
        // 500ms 후에 스토리 시작
        setTimeout(() => {
            showPostQuestionStory(postQuestion1Script, () => {
                // 스토리가 끝나면 두 번째 질문으로 이동
                const nextScreen = document.getElementById(`question${questionId + 1}Screen`);
                transitionToScreen(blankScreen, nextScreen);
            });
        }, 500);
        return; // 여기서 함수 종료
    }
    
    // 다음 질문으로 이동
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
        
        // 낮은 점수 라벨에 투명도 적용
        if (axisScores.보수 < axisScores.공격) {
            document.getElementById('label1Left').classList.add('low-score');
        } else if (axisScores.보수 > axisScores.공격) {
            document.getElementById('label1Right').classList.add('low-score');
        }
        
        if (axisScores.단기 < axisScores.장기) {
            document.getElementById('label2Left').classList.add('low-score');
        } else if (axisScores.단기 > axisScores.장기) {
            document.getElementById('label2Right').classList.add('low-score');
        }
        
        if (axisScores.감정 < axisScores.논리) {
            document.getElementById('label3Left').classList.add('low-score');
        } else if (axisScores.감정 > axisScores.논리) {
            document.getElementById('label3Right').classList.add('low-score');
        }
        
        if (axisScores.즉흥 < axisScores.계획) {
            document.getElementById('label4Left').classList.add('low-score');
        } else if (axisScores.즉흥 > axisScores.계획) {
            document.getElementById('label4Right').classList.add('low-score');
        }
        
        if (axisScores.집중 < axisScores.분산) {
            document.getElementById('label5Left').classList.add('low-score');
        } else if (axisScores.집중 > axisScores.분산) {
            document.getElementById('label5Right').classList.add('low-score');
        }
    }, 1000);
    
    // 투자 유형 특징 표시
    const charCircles = document.getElementById('charCircles');
    charCircles.innerHTML = '';
    
    const typeCharacteristics = {
        안정형: ['손실을\n싫어함', '느리더라도\n꾸준한 수익 선호', '좋은 기업이면\n오래 보유'],
        균형형: ['리스크와\n수익의 균형', '분산투자\n선호', '상황 따라\n유연함'],
        공격형: ['높은 수익\n가능성이 최우선', '변동성\nOK', '단기 투자,\n테마주 관심'],
        장기형: ['좋은 기업이면\n오래 보유', '단기 등락에\n둔감', '미래 성장성\n중시'],
        단타형: ['결과에\n민감', '빠른 매수,\n매도', '즉각적인\n결정으로 투자'],
        감정형: ['분위기,\n주변 말에\n영향 받음', '급등하면 사고\n급락하면 불안', '좋은 기회를\n놓칠까봐 두려움'],
        분석형: ['숫자, 데이터,\n재무제표 등을\n분석함', '논리적 근거에\n따라 투자함', '충동적인\n투자 안함']
    };
    
    const features = typeCharacteristics[resultType];
    if (features) {
        features.forEach(feature => {
            const circle = document.createElement('div');
            circle.className = 'char-circle';
            circle.textContent = feature;
            charCircles.appendChild(circle);
        });
    }
    
    // SUMMIT 조언 표시
    const adviceTexts = {
        안정형: '과도한 회피로 기회를 놓치지 않도록 분산 전략을 유지하세요.',
        균형형: '기준을 명확히 하여 균형을 맞추면 흔들림이 더 줄어들 거예요.',
        공격형: '높은 변동성을 감수하는 만큼, 명확한 손절 기준으로 리스크를 통제하세요.',
        장기형: '장기 투자의 힘을 믿되, 정기적인 포트폴리오 점검으로 방향성을 확인하세요.',
        단타형: '빠른 매매만큼 거래 비용과 감정 개입을 최소화하는 전략이 중요합니다.',
        감정형: '시장 분위기보다 사전에 정한 기준에 따라 의사결정을 내리는 연습을 해보세요.',
        분석형: '철저한 분석을 강점으로 삼되, 과도한 정보 탐색으로 타이밍을 놓치지 않도록 하세요.'
    };
    
    document.getElementById('adviceText').textContent = adviceTexts[resultType] || '투자는 꾸준함이 핵심입니다.';
    
    transitionToScreen(currentScreen, resultScreen);
}

// 테스트 재시작
function resetTest() {
    // 점수 초기화
    for (let key in scores) {
        scores[key] = 0;
    }
    currentQuestion = 0;
    currentStoryIndex = 0; // 스토리 인덱스 초기화
    
    const currentScreen = document.querySelector('.screen.active');
    const startScreen = document.getElementById('startScreen');
    if (currentScreen && currentScreen !== startScreen) {
        transitionToScreen(currentScreen, startScreen);
    }
}

// 초기화
// 텍스트 타이핑 효과 함수
function typeWriter(element, text, speed, callback) {
    let i = 0;
    element.innerHTML = "";
    isTyping = true;
    document.getElementById('nextArrow').style.display = 'none'; // 화살표 숨기기

    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            typingTimeout = setTimeout(typing, speed);
        } else {
            isTyping = false;
            document.getElementById('nextArrow').style.display = 'block'; // 화살표 보이기
            if (callback) callback();
        }
    }
    typing();
}

function skipTyping(element, text) {
    if (isTyping) {
        clearTimeout(typingTimeout);
        element.innerHTML = text;
        isTyping = false;
        document.getElementById('nextArrow').style.display = 'block'; // 화살표 보이기
    }
}

// 다음 대화 표시 함수
function showNextDialogue() {
    // 이전 이미지 타이머 모두 제거
    imageTimeoutIds.forEach(id => clearTimeout(id));
    imageTimeoutIds = [];

    if (currentStoryIndex >= storyScript.length) {
        // 스토리가 끝나면 질문 화면으로 넘어감 (예시)
        const blankScreen = document.getElementById('blankScreen');
        const firstQuestion = document.getElementById('question1Screen');
        transitionToScreen(blankScreen, firstQuestion);
        return;
    }

    const dialogue = storyScript[currentStoryIndex];
    const dialogueText = document.getElementById('dialogueText');
    const characterName = document.getElementById('characterName');
    const imageContainer = document.getElementById('character-images');

    // 이전 이미지 모두 제거
    imageContainer.innerHTML = '';

    if (dialogue.images && dialogue.images.length > 0) {
        let totalDelay = 0;
        dialogue.images.forEach((imageData, index) => {
            const timeoutId = setTimeout(() => {
                const img = document.createElement('img');
                img.src = imageData.src;
                img.className = `character-image ${imageData.position}`;

                if (imageData.width) img.style.width = imageData.width;
                if (imageData.height) img.style.height = imageData.height;
                
                imageContainer.appendChild(img);

                setTimeout(() => img.classList.add('show'), 10);

            }, totalDelay);

            imageTimeoutIds.push(timeoutId);
            totalDelay += (imageData.delay || 0);
        });
    }
    characterName.innerText = dialogue.speaker;
    typeWriter(dialogueText, dialogue.line, 50);

    currentStoryIndex++;
}

document.addEventListener('DOMContentLoaded', function() {
    // 질문 화면 생성
    createQuestionScreens();
    
    // START 버튼
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', function() {
        const startScreen = document.getElementById('startScreen');
        const blankScreen = document.getElementById('blankScreen');
        transitionToScreen(startScreen, blankScreen);

        // 화면 전환 후 첫 대사 시작
        setTimeout(showNextDialogue, 500);
    });

    // 대화창 클릭/터치 이벤트
    const dialogueBox = document.querySelector('.dialogue-box');
    dialogueBox.addEventListener('click', handleIntroStoryClick);
    
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
