/* ファイル名: quiz_eto.js */

// --- クイズのデータ --- (変更なし)
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

// --- 必要なHTML要素を取得 --- (変更なし)
const questionDisplay = document.getElementById("question-display");
const answerInput = document.getElementById("answer-input");
const submitButton = document.getElementById("submit-button");
const resultMessage = document.getElementById("result-message");
const answerArea = document.getElementById("answer-area"); 
const retryButton = document.getElementById("retry-button"); 

// --- 変数の準備 --- (変更なし)
let currentQuizIndex = 0; 
let currentAnswer = "";
const maxQuestions = 10; 

// --- 関数定義 --- (startNewGame, setQuestion, showGameEnd は変更なし)
function startNewGame() {
    quizData.sort(() => Math.random() - 0.5);
    currentQuizIndex = 0; 
    questionDisplay.style.color = '#0056b3'; 
    answerArea.style.display = 'block'; 
    retryButton.style.display = 'none'; 
    setQuestion(); 
}
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
function showGameEnd() {
    questionDisplay.textContent = "終了！";
    questionDisplay.style.color = '#333'; 
    resultMessage.textContent = `お疲れ様でした！`;
    resultMessage.className = "";
    answerArea.style.display = 'none';
    retryButton.style.display = 'inline-block';
}

/**
 * ★ 回答をチェックする関数 (ここを修正)
 */
function checkAnswer() {
    const userAnswer = answerInput.value; 
    
    // ★ 追加: 入力が空かどうかをチェック
    // .trim() は、スペースだけ入力された場合も「空」とみなす処理
    if (userAnswer.trim() === "") {
        resultMessage.textContent = "文字を入力してください";
        resultMessage.className = "incorrect"; // 赤文字で表示
        return; // 入力が空なので、ここで処理を終了する
    }
    
    // (↓ 元からあった判定処理)
    if (userAnswer === currentAnswer) {
        // 正解
        resultMessage.textContent = "正解！ 🎉";
        resultMessage.className = "correct";
        
        setTimeout(() => {
            currentQuizIndex++; 
            setQuestion();      
        }, 800); 
        
    } else {
        // 不正解
        resultMessage.textContent = `残念！正解は ${currentAnswer} でした。`; 
        resultMessage.className = "incorrect"; 
        
        setTimeout(() => {
            currentQuizIndex++; 
            setQuestion();      
        }, 1500); 
    }
}

// --- イベントリスナーの登録 --- (変更なし)
document.addEventListener("DOMContentLoaded", () => {
    startNewGame();
    submitButton.addEventListener("click", checkAnswer);
    answerInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });
    retryButton.addEventListener("click", startNewGame);
});