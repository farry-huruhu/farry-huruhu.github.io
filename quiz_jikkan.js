// --- ★ 変更点：クイズデータを削除し、「計算ルール」を定義 ---
// 西暦の下一桁 (0, 1, 2...) と十干 (庚, 辛, 壬...) の対応表
// (0=庚, 1=辛, 2=壬, 3=癸, 4=甲, 5=乙, 6=丙, 7=丁, 8=戊, 9=己)
const jikkanMap = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'];

// --- ★ 変更点：ランダムな問題を生成する関数を追加 ---
/**
 * ランダムな「年」と「十干」のクイズを1問生成する
 */
function generateQuizProblem() {
    // 600年 (飛鳥時代) から 2030年 の間でランダムな年を生成
    const minYear = 600;
    const maxYear = 2030;
    const randomYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
    
    // 年の下一桁を計算
    const lastDigit = randomYear % 10;
    
    // 正解の十干を jikkanMap から見つける
    const answer = jikkanMap[lastDigit];
    
    // 問題文を作成
    const question = `西暦 ${randomYear} 年`;
    
    // { 問題文, 答え } の形式で返す
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

// --- 関数定義 ---

/**
 * 新しいゲームを開始する関数 (★ 変更点：シャッフル処理を削除)
 */
function startNewGame() {
    // quizData.sort(() => Math.random() - 0.5); // ← リストがないので削除
    
    currentQuizIndex = 0; 
    questionDisplay.style.color = '#0056b3'; 
    answerArea.style.display = 'block'; 
    retryButton.style.display = 'none'; 
    setQuestion(); 
}

/**
 * 画面に問題を表示する関数 (★ 変更点：ここで問題を生成)
 */
function setQuestion() {
    // 10問終わったら終了 (これは変更なし)
    if (currentQuizIndex >= maxQuestions) {
        showGameEnd();
        return;
    }
    
    // ★ リストから選ぶ代わりに、新しい問題を「生成」する
    const quiz = generateQuizProblem(); 
    
    // (↓ 以下は変更なし)
    questionDisplay.textContent = quiz.q; 
    currentAnswer = quiz.a;             
    answerInput.value = "";
    resultMessage.textContent = "";
    resultMessage.className = "";
    answerInput.focus();
}

/**
 * ゲーム終了処理の関数 (変更なし)
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
 * 回答をチェックする関数 (★ 変更点：次に進む処理を単純化)
 */
function checkAnswer() {
    const userAnswer = answerInput.value; 
    let delay = 800; // 次に進むまでの時間 (ミリ秒)
    
    if (userAnswer === currentAnswer) {
        // 正解
        resultMessage.textContent = "正解！ 🎉";
        resultMessage.className = "correct";
    } else {
        // 不正解 (答えを表示して次に進む)
        resultMessage.textContent = `残念！正解は ${currentAnswer} でした。`; 
        resultMessage.className = "incorrect"; 
        delay = 1500; // 不正解時は少し長く待つ
    }

    // ★ 正解・不正解に関わらず、指定時間後に次の問題へ
    setTimeout(() => {
        currentQuizIndex++; // 問題番号を増やす
        setQuestion();      // 次の問題をセット
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