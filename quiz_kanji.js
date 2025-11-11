// HTMLドキュメントがすべて読み込まれてから、全体の処理を開始します
document.addEventListener("DOMContentLoaded", () => {

    // --- クイズのデータ (漢字→国名) ---
    const quizData = [
        { q: "米", a: ["アメリカ", "アメリカ合衆国"] },
        { q: "英", a: ["イギリス", "英国"] },
        { q: "仏", a: "フランス" },
        { q: "独", a: "ドイツ" },
        { q: "伊", a: "イタリア" },
        { q: "中", a: ["中国", "中華人民共和国"] },
        { q: "韓", a: ["韓国", "大韓民国"] },
        { q: "印", a: "インド" },
        { q: "豪", a: "オーストラリア" },
        { q: "露", a: "ロシア" },
        { q: "西", a: "スペイン" },
        { q: "蘭", a: "オランダ" },
        { q: "加", a: "カナダ" },
        { q: "伯", a: "ブラジル" },
        { q: "朝", a: ["北朝鮮", "朝鮮民主主義人民共和国"] },
        { q: "希", a: "ギリシア" },
        { q: "瑞", a: "スウェーデン" },
        { q: "泰", a: "タイ" },
        { q: "丁", a: "デンマーク" },
        { q: "土", a: "トルコ" },
        { q: "諾", a: "ノルウェー" },
        { q: "洪", a: "ハンガリー" },
        { q: "比", a: "フィリピン" },
        { q: "芬", a: "フィンランド" },
        { q: "勃", a: "ブルガリア" },
        { q: "普", a: "プロイセン" },
        { q: "越", a: "ベトナム" },
        { q: "秘", a: "ペルー" },
        { q: "墨", a: "メキシコ" },
        { q: "蒙", a: "モンゴル" },
        { q: "白", a: "ベルギー"},
        { q: "波", a: "ポーランド"},
        { q: "葡", a: "ポルトガル"},
        { q: "馬", a: "マレーシア"},
        { q: "緬", a: "ミャンマー"},
        { q: "墺", a: "オーストリア"},
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
        
        if (questionDisplay) questionDisplay.style.color = '#0056b3'; 
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