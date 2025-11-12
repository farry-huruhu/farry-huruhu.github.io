/* ファイル名: quiz_jikkan.js */

// --- 計算ルール --- (変更なし)
const jikkanMap = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'];

// --- ランダムな問題を生成する関数 --- (変更なし)
function generateQuizProblem() {
    const minYear = 600;
    const maxYear = 2030;
    const randomYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
    const lastDigit = randomYear % 10;
    const answer = jikkanMap[lastDigit];
    const question = `西暦 ${randomYear} 年`;
    return { q: question, a: answer };
}

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
    currentQuizIndex = 0; 
    questionDisplay.style.color = '#0056b3'; 
    answerArea.style.display = 'block'; 
    retryButton.style.display = 'none'; 
    setQuestion(); 
}
function setQuestion() {
    if (currentQuizIndex >= maxQuestions) {
        showGameEnd();
        return;
    }
    const quiz = generateQuizProblem(); 
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
    let delay = 800;
    
    if (userAnswer === currentAnswer) {
        // 正解
        resultMessage.textContent = "正解！ 🎉";
        resultMessage.className = "correct";
    } else {
        // 不正解
        resultMessage.textContent = `残念！正解は ${currentAnswer} でした。`; 
        resultMessage.className = "incorrect"; 
        delay = 1500;
    }

    setTimeout(() => {
        currentQuizIndex++;
        setQuestion();
    }, delay);
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