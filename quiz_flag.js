// HTMLドキュメントがすべて読み込まれてから、全体の処理を開始します
document.addEventListener("DOMContentLoaded", () => {

    // --- クイズのデータ (国旗→国名) ---
    const quizData = [
        { q: "🇺🇸", a: ["アメリカ", "アメリカ合衆国"] },
        { q: "🇬🇧", a: ["イギリス", "英国"] },
        { q: "🇫🇷", a: "フランス" },
        { q: "🇩🇪", a: "ドイツ" },
        { q: "🇮🇹", a: "イタリア" },
        { q: "🇨🇳", a: ["中国", "中華人民共和国"] },
        { q: "🇰🇷", a: ["韓国", "大韓民国"] },
        { q: "🇮🇳", a: "インド" },
        { q: "🇦🇺", a: "オーストラリア" },
        { q: "🇷🇺", a: "ロシア" },
        { q: "🇪🇸", a: "スペイン" },
        { q: "🇳🇱", a: "オランダ" },
        { q: "🇨🇦", a: "カナダ" },
        { q: "🇧🇷", a: "ブラジル" },
        { q: "🇰🇵", a: ["北朝鮮", "朝鮮民主主義人民共和国"] },
        { q: "🇬🇷", a: ["ギリシャ","ギリシア" ]},
        { q: "🇸🇪", a: "スウェーデン" },
        { q: "🇹🇭", a: "タイ" },
        { q: "🇩🇰", a: "デンマーク" },
        { q: "🇹🇷", a: "トルコ" },
        { q: "🇳🇴", a: "ノルウェー" },
        { q: "🇭🇺", a: "ハンガリー" },
        { q: "🇵🇭", a: "フィリピン" },
        { q: "🇫🇮", a: "フィンランド" },
        { q: "🇧🇬", a: "ブルガリア" },
        { q: "🇻🇳", a: "ベトナム" },
        { q: "🇵🇪", a: "ペルー" },
        { q: "🇲🇽", a: "メキシコ" },
        { q: "🇲🇳", a: "モンゴル" }
    ];

    // --- 必要なHTML要素を取得 ---
    const questionDisplay = document.getElementById("question-display");
    const answerInput = document.getElementById("answer-input");
    const submitButton = document.getElementById("submit-button");
    const resultMessage = document.getElementById("result-message");
    const answerArea = document.getElementById("answer-area"); 
    const retryButton = document.getElementById("retry-button"); 
    const homeButton = document.getElementById("home-button"); 

    let currentQuizIndex = 0; 
    let currentAnswer = ""; 
    const maxQuestions = 10; 
    let score = 0; // ★ 1. スコアを記録する変数を追加

    function startNewGame() {
        quizData.sort(() => Math.random() - 0.5);
        currentQuizIndex = 0; 
        score = 0; // ★ 2. ゲーム開始時にスコアをリセット
        
        if (questionDisplay) questionDisplay.style.color = '#333';
        if (answerArea) answerArea.style.display = 'block'; 
        if (retryButton) retryButton.style.display = 'none'; 
        if (homeButton) homeButton.style.display = 'none'; 
        
        setQuestion(); 
    }

    function setQuestion() {
        if (currentQuizIndex >= maxQuestions || currentQuizIndex >= quizData.length) {
            showGameEnd(); 
            return;
        }
        
        const quiz = quizData[currentQuizIndex];
        
        if (questionDisplay) questionDisplay.textContent = quiz.q; 
        currentAnswer = quiz.a; 
        
        if (answerInput) answerInput.value = "";
        if (resultMessage) {
            resultMessage.textContent = "";
            resultMessage.className = "";
        }
        if (answerInput) answerInput.focus(); 
    }
    
    function showGameEnd() {
        if (questionDisplay) {
            questionDisplay.textContent = "終了！";
            questionDisplay.style.color = '#333'; 
        }
        if (resultMessage) {
            // ★ 3. 終了メッセージにスコアを表示
            resultMessage.textContent = `お疲れ様でした！ ${maxQuestions}問中${score}問正解です！`;
            resultMessage.className = "";
        }
        if (answerArea) answerArea.style.display = 'none';
        if (retryButton) retryButton.style.display = 'inline-block';
        if (homeButton) homeButton.style.display = 'inline-block';
    }

    function checkAnswer() {
        if (!answerInput || !resultMessage) return; 

        const userAnswer = answerInput.value;

        if (userAnswer.trim() === "") {
            resultMessage.textContent = "文字を入力してください。";
            resultMessage.className = "incorrect";
            answerInput.focus(); 
            return; 
        }

        let isCorrect = false; 

        if (Array.isArray(currentAnswer)) {
            if (currentAnswer.includes(userAnswer)) {
                isCorrect = true;
            }
        } else {
            if (userAnswer === currentAnswer) {
                isCorrect = true;
            }
        }

        if (isCorrect) {
            score++; // ★ 2. 正解したらスコアを加算
            resultMessage.textContent = "正解！ 🥳";
            resultMessage.className = "correct";
            setTimeout(() => {
                currentQuizIndex++; 
                setQuestion();      
            }, 800); 
            
        } else {
            let displayAnswer = "";
            if (Array.isArray(currentAnswer)) {
                displayAnswer = currentAnswer[0];
            } else {
                displayAnswer = currentAnswer;
            }

            resultMessage.textContent = `残念！正解は「${displayAnswer}」でした。`;
            resultMessage.className = "incorrect";

            setTimeout(() => {
                currentQuizIndex++; 
                setQuestion();      
            }, 1500); 
        }
    }

    // --- イベントリスナーの登録 ---
    if (submitButton) submitButton.addEventListener("click", checkAnswer);
    if (answerInput) answerInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") checkAnswer();
    });
    if (retryButton) retryButton.addEventListener("click", startNewGame);

    // --- ゲームの初回開始 ---
    startNewGame();

});