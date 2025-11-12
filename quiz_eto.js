// --- クイズのデータ ---
const quizData = [
    { q: "壬申の乱", a: "672" },
    { q: "乙巳の変", a: "645" },
    { q: "戊辰戦争", a: "1868" },
    { q: "甲申事変", a: "1884" },
    { q: "辛亥革命", a: "1911" },
    { q: "壬辰倭乱", a: "1592" },
    { q: "甲午農民戦争", a: "1894" },
    { q: "戊戌の変法", a: "1898" },
    { q: "丙午 (1966年)", a: "1966" },
    { q: "甲子園 (開場)", a: "1924" }, 
    { q: "丁酉の乱", a: "1597" }
];

// --- 必要なHTML要素を取得 ---
const questionDisplay = document.getElementById("question-display");
const answerInput = document.getElementById("answer-input");
const submitButton = document.getElementById("submit-button");
const resultMessage = document.getElementById("result-message");
const answerArea = document.getElementById("answer-area"); 
const retryButton = document.getElementById("retry-button"); 

// --- 変数の準備 ---
let currentQuizIndex = 0; 
let currentAnswer = "";
const maxQuestions = 10; 

// --- 関数定義 ---

/**
 * 新しいゲームを開始する関数
 */
function startNewGame() {
    quizData.sort(() => Math.random() - 0.5); // シャッフル
    currentQuizIndex = 0; 
    
    // UIをリセット
    questionDisplay.style.color = '#0056b3'; 
    answerArea.style.display = 'block'; 
    retryButton.style.display = 'none'; 
    
    setQuestion(); 
}

/**
 * 画面に問題を表示する関数
 */
function setQuestion() {
    if (currentQuizIndex >= maxQuestions || currentQuizIndex >= quizData.length) {
        showGameEnd();
        return;
    }
    const quiz = quizData[currentQuizIndex];
    questionDisplay.textContent = quiz.q; 
    currentAnswer = quiz.a;             
    
    answerInput.value = "";
    resultMessage.textContent = "";
    resultMessage.className = "";
    answerInput.focus();
}

/**
 * ゲーム終了処理の関数
 */
function showGameEnd() {
    questionDisplay.textContent = "終了！";
    questionDisplay.style.color = '#333'; 
    resultMessage.textContent = `お疲れ様でした！`;
    resultMessage.className = "";
    answerArea.style.display = 'none';
    retryButton.style.display = 'inline-block';
}

/**
 * 回答をチェックする関数
 */
function checkAnswer() {
    const userAnswer = answerInput.value; 
    
    if (userAnswer === currentAnswer) {
        // 正解
        resultMessage.textContent = "正解！ 🎉";
        resultMessage.className = "correct";
        
        setTimeout(() => {
            currentQuizIndex++; 
            setQuestion();      
        }, 800); 
        
    } else {
        // 不正解 (答えを表示して次に進む)
        resultMessage.textContent = `残念！正解は ${currentAnswer} でした。`; 
        resultMessage.className = "incorrect"; 
        
        setTimeout(() => {
            currentQuizIndex++; 
            setQuestion();      
        }, 1500); 
    }
}

// --- イベントリスナーの登録 ---
// ページ読み込み完了(DOMContentLoaded)を待ってから実行
document.addEventListener("DOMContentLoaded", () => {
    
    // 最初のゲームを開始
    startNewGame();

    // 「回答」ボタンがクリックされたら
    submitButton.addEventListener("click", checkAnswer);
    
    // エンターキーでも回答
    answerInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });
    
    // 「もう一度遊ぶ」ボタンがクリックされたら
    retryButton.addEventListener("click", startNewGame);
});