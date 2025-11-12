// HTMLドキュメントがすべて読み込まれてから、全体の処理を開始します
document.addEventListener("DOMContentLoaded", () => {

    // --- クイズのデータ (拡張版) ---
    const quizData = [
        // 既存データ
        { q: "米", a: ["アメリカ", "アメリカ合衆国"] }, { q: "英", a: ["イギリス", "英国"] }, { q: "仏", a: "フランス" },
        { q: "独", a: "ドイツ" }, { q: "伊", a: "イタリア" }, { q: "中", a: ["中国", "中華人民共和国"] },
        { q: "韓", a: ["韓国", "大韓民国"] }, { q: "印", a: "インド" }, { q: "豪", a: "オーストラリア" },
        { q: "露", a: "ロシア" }, { q: "西", a: "スペイン" }, { q: "蘭", a: "オランダ" }, { q: "加", a: "カナダ" },
        { q: "伯", a: "ブラジル" }, { q: "朝", a: ["北朝鮮", "朝鮮民主主義人民共和国"] }, { q: "希", a: ["ギリシャ","ギリシア"] },
        { q: "瑞", a: "スウェーデン" }, { q: "泰", a: "タイ" }, { q: "丁", a: "デンマーク" }, { q: "土", a: "トルコ" },
        { q: "諾", a: "ノルウェー" }, { q: "洪", a: "ハンガリー" }, { q: "比", a: "フィリピン" },
        { q: "芬", a: "フィンランド" }, { q: "勃", a: "ブルガリア" }, { q: "普", a: "プロイセン" },
        { q: "越", a: "ベトナム" }, { q: "秘", a: "ペルー" }, { q: "墨", a: "メキシコ" }, { q: "蒙", a: "モンゴル" },
        // 追加データ
        { q: "愛", a: "アイルランド" }, { q: "墺", a: "オーストリア" }, { q: "波", a: "ポーランド" },
        { q: "葡", a: "ポルトガル" }, { q: "玖", a: "キューバ" }, { q: "羅", a: "ルーマニア" },
        { q: "宇", a: "ウクライナ" }, { q: "新", a: ["ニュージーランド"] }, { q: "馬", a: ["マレーシア"] },
        { q: "緬", a: "ミャンマー" }, { q: "尼", a: "インドネシア" }, { q: "塔", a: "パキスタン" },
        { q: "刺", a: "イラン" }, { q: "埃", a: "エジプト" }, { q: "亜", a: "アルゼンチン" },
        { q: "智", a: "チリ" }, { q: "南", a: "南アフリカ" }, { q: "牙", a: "ケニア" },{ q: "星", a: "シンガポール"},{q: "白",a: "ベルギー"}
    ];

    // --- 必要なHTML要素を取得 ---
    const questionDisplay = document.getElementById("question-display");
    const answerInput = document.getElementById("answer-input");
    const submitButton = document.getElementById("submit-button");
    const resultMessage = document.getElementById("result-message");
    const answerArea = document.getElementById("answer-area"); 
    const retryButton = document.getElementById("retry-button"); 
    const homeButton = document.getElementById("home-button");
    const incorrectList = document.getElementById("incorrect-list"); 
    const timerDisplay = document.getElementById("timer"); 

    // --- 変数の準備 ---
    let currentQuizIndex = 0; 
    let currentAnswer = ""; 
    let score = 0;
    let incorrectQuestions = []; 
    
    // タイマー用の変数
    let timeLeft = 60; 
    let timerInterval = null; 
    let isGameActive = false; // ゲームがアクティブか（時間切れや終了判定の重複防止）

    /**
     * 新しいゲームを開始する関数
     */
    function startNewGame() {
        // データをシャッフル
        quizData.sort(() => Math.random() - 0.5);
        
        // 変数をリセット
        currentQuizIndex = 0; 
        score = 0;
        incorrectQuestions = []; 
        isGameActive = true;
        
        // 表示をリセット
        if (questionDisplay) questionDisplay.style.color = '#0056b3'; 
        if (answerArea) answerArea.style.display = 'block'; 
        if (retryButton) retryButton.style.display = 'none'; 
        if (homeButton) homeButton.style.display = 'none'; 
        if (incorrectList) incorrectList.innerHTML = ""; 
        
        // タイマーの初期化と開始
        timeLeft = 60;
        if (timerDisplay) {
            timerDisplay.style.display = 'block';
            updateTimerDisplay();
        }
        startTimer();

        // 最初の問題を表示
        setQuestion(); 
    }

    /**
     * 画面に問題を表示する関数
     */
    function setQuestion() {
        if (!isGameActive) return; // ゲームが終了していたら何もしない

        // データ内の全問題を解いたら終了
        if (currentQuizIndex >= quizData.length) { 
            showGameEnd(false, true); // (時間切れではない, 全問クリア)
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
    
    /**
     * ゲーム終了処理の関数（リザルト演出）
     * @param {boolean} isTimeUp - 時間切れで終了したかどうか
     * @param {boolean} isAllClear - 全問クリアしたかどうか
     */
    function showGameEnd(isTimeUp = false, isAllClear = false) {
        if (!isGameActive) return; // 既に終了処理が呼ばれていたら何もしない
        isGameActive = false;
        
        clearInterval(timerInterval); // タイマー停止
        if (timerDisplay) timerDisplay.style.display = 'none';

        // --- リザルト演出 ---
        if (questionDisplay) {
            
            if (isAllClear) {
                // 1. 「すべて終わったとき」の演出
                questionDisplay.textContent = "🏆 全問クリア！ 🏆";
                questionDisplay.style.color = '#e6a800'; // ゴールド風の色
            } else if (isTimeUp) {
                // 2. 「途中で終わったとき（時間切れ）」の演出
                questionDisplay.textContent = "時間切れ！";
                questionDisplay.style.color = '#333'; // 通常の色
            } 
        }
        
        // --- スコア表示 ---
        if (resultMessage) {
            const totalScore = score * 50; 
            
            if (isAllClear) {
                // 1. 「すべて終わったとき」のスコア表示
                resultMessage.textContent = `🎉 全問クリア！ ${quizData.length}問中${score}問正解、合計 ${totalScore} ポイントです！`;
            } else if (isTimeUp) {
                // 2. 「途中で終わったとき（時間切れ）」のスコア表示
                resultMessage.textContent = `時間切れ！ ${currentQuizIndex}問挑戦し${score}問正解、合計 ${totalScore} ポイントです！`;
            }
            resultMessage.className = "";
        }
        
        // --- 間違いリスト表示 (共通) ---
        if (incorrectList) {
            incorrectList.innerHTML = ""; // いったんクリア
            if (incorrectQuestions.length > 0) {
                let html = "<h3>間違えた問題:</h3><ul>";
                for (const item of incorrectQuestions) {
                    html += `<li>「${item.q}」 → 正解: 「${item.a}」</li>`;
                }
                html += "</ul>";
                incorrectList.innerHTML = html;
            }
        }
        
        // --- ボタン表示 (共通) ---
        if (answerArea) answerArea.style.display = 'none';
        if (retryButton) retryButton.style.display = 'inline-block';
        if (homeButton) homeButton.style.display = 'inline-block';
    }

    /**
     * 回答をチェックする関数
     */
    function checkAnswer() {
        if (!isGameActive || !answerInput || !resultMessage) return; 

        const userAnswer = answerInput.value;

        // 空欄チェック
        if (userAnswer.trim() === "") {
            resultMessage.textContent = "文字を入力してください。";
            resultMessage.className = "incorrect";
            answerInput.focus(); 
            return; 
        }

        let isCorrect = false; 

        // 正解判定
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
            // --- 正解の場合 ---
            score++; 
            timeLeft += 5; // 5秒追加
            updateTimerDisplay(); // タイマー表示更新
            
            resultMessage.textContent = "正解！ 🥳 (+5秒)";
            resultMessage.className = "correct";
            
            // 0.8秒後に次の問題へ
            setTimeout(() => {
                currentQuizIndex++; 
                setQuestion();      
            }, 800); 
            
        } else {
            // --- 不正解の場合 ---
            let displayAnswer = "";
            if (Array.isArray(currentAnswer)) {
                displayAnswer = currentAnswer[0];
            } else {
                displayAnswer = currentAnswer;
            }

            // 間違いリストに記録
            const currentQuestion = quizData[currentQuizIndex].q;
            incorrectQuestions.push({ q: currentQuestion, a: displayAnswer });

            resultMessage.textContent = `残念！正解は「${displayAnswer}」でした。`;
            resultMessage.className = "incorrect";

            // 1.5秒後に次の問題へ
            setTimeout(() => {
                currentQuizIndex++; 
                setQuestion();      
            }, 1500); 
        }
    }

    /**
     * タイマーを1秒ごとに進める関数
     */
    function startTimer() {
        clearInterval(timerInterval); // 既存のタイマーをクリア
        timerInterval = setInterval(() => {
            if (!isGameActive) {
                clearInterval(timerInterval);
                return;
            }
            
            timeLeft--;
            updateTimerDisplay();
            
            // 時間切れ判定
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                showGameEnd(true, false); // (時間切れ, 全問クリアではない)
            }
        }, 1000); // 1秒ごと
    }

    /**
     * タイマーの表示を更新する関数
     */
    function updateTimerDisplay() {
        if (!timerDisplay) return;
        timerDisplay.textContent = timeLeft;
        
        // 10秒以下でタイマーを赤くする
        if (timeLeft <= 10) {
            timerDisplay.classList.add("low-time");
        } else {
            timerDisplay.classList.remove("low-time");
        }
    }

    // --- イベントリスナーの登録 ---
    
    // 回答ボタン
    if (submitButton) {
        submitButton.addEventListener("click", checkAnswer);
    }
    
    // Enterキー
    if (answerInput) {
        answerInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                checkAnswer();
            }
        });
    }
    
    // リトライボタン
    if (retryButton) {
        retryButton.addEventListener("click", startNewGame);
    }

    // --- ゲームの初回開始 ---
    startNewGame();

}); // DOMContentLoaded の閉じカッコ