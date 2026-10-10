// 宣告目前題目編號，0 代表第一題
let currentQuestion = 0;

// 宣告答對題數
let score = 0;

// 宣告目前是否已經作答
let hasAnswered = false;

// 宣告使用者選擇的選項編號
let selectedOption = -1;

// 宣告測驗是否結束
let quizFinished = false;

// 宣告動畫時間
let animationTime = 0;

// 宣告上一次點擊時間，避免滑鼠和觸控重複觸發
let lastPointerTime = 0;

// 宣告所有測驗題目
const questions = [
  // 建立第一題
  {
    // 設定第一題問題文字
    question: "在 p5.js 中，哪一個指令可以建立畫布？",

    // 設定第一題四個選項
    options: ["createCanvas()", "background()", "drawCanvas()", "makeCanvas()"],

    // 設定第一題正確答案索引
    answer: 0
  },

  // 建立第二題
  {
    // 設定第二題問題文字
    question: "在 p5.js 中，哪一個指令可以設定背景顏色？",

    // 設定第二題四個選項
    options: ["fill()", "stroke()", "background()", "color()"],

    // 設定第二題正確答案索引
    answer: 2
  },

  // 建立第三題
  {
    // 設定第三題問題文字
    question: "在 p5.js 中，哪一個指令可以畫出橢圓形？",

    // 設定第三題四個選項
    options: ["circle()", "ellipse()", "round()", "drawEllipse()"],

    // 設定第三題正確答案索引
    answer: 1
  },

  // 建立第四題
  {
    // 設定第四題問題文字
    question: "在 p5.js 中，哪一個函式會持續重複執行？",

    // 設定第四題四個選項
    options: ["setup()", "start()", "loop()", "draw()"],

    // 設定第四題正確答案索引
    answer: 3
  },

  // 建立第五題
  {
    // 設定第五題問題文字
    question: "在 p5.js 中，哪一個指令可以設定圖形填滿顏色？",

    // 設定第五題四個選項
    options: ["fill()", "paint()", "insideColor()", "shapeColor()"],

    // 設定第五題正確答案索引
    answer: 0
  }
];

// 宣告系統使用的顏色
const COLORS = {
  // 設定頁面背景顏色
  pageBackground: "#F7F4F0",

  // 設定主要文字顏色
  text: "#2D3142",

  // 設定題目框背景顏色
  questionBox: "#736F72",

  // 設定未作答選項顏色
  normalOption: "#B8D8E8",

  // 設定正確答案顏色
  correctOption: "#E9E3E6",

  // 設定錯誤答案顏色
  wrongOption: "#BB4430",

  // 設定其他選項顏色
  disabledOption: "#D9D9D9",

  // 設定按鈕顏色
  button: "#4F5D75",

  // 設定白色文字
  white: "#FFFFFF",

  // 設定外框顏色
  border: "#2D3142"
};

// p5.js 初始化函式，只會執行一次
function setup() {
  // 建立符合瀏覽器視窗大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 設定文字水平對齊方式為置中
  textAlign(CENTER, CENTER);

  // 設定文字垂直對齊方式為置中
  textAlign(CENTER, CENTER);

  // 設定矩形從中心點開始繪製
  rectMode(CENTER);

  // 設定線條端點樣式
  strokeCap(ROUND);

  // 設定畫布背景顏色
  background(COLORS.pageBackground);

  // 設定畫布不使用固定影格速率，維持 p5.js 預設更新
  frameRate(60);
}

// p5.js 主要繪圖函式，會持續執行
function draw() {
  // 清除畫布並重新繪製背景
  background(COLORS.pageBackground);

  // 增加動畫時間
  animationTime += 0.05;

  // 判斷測驗是否結束
  if (quizFinished) {
    // 繪製結果畫面
    drawResultScreen();

    // 結束目前這次繪圖
    return;
  }

  // 繪製測驗畫面
  drawQuizScreen();
}

// 限制數值在指定的最小值與最大值之間
function clamp(value, minValue, maxValue) {
  // 回傳限制後的數值
  return min(max(value, minValue), maxValue);
}

// 根據畫面寬度與高度計算響應式字體大小
function responsiveTextSize(baseSize, minSize, maxSize) {
  // 取得畫面寬度與高度中較小的數值
  const shortestSide = min(width, height);

  // 根據畫面尺寸計算字體大小
  const calculatedSize = shortestSide * baseSize;

  // 將字體大小限制在最小值與最大值之間
  return clamp(calculatedSize, minSize, maxSize);
}

// 根據目前畫面尺寸計算響應式版面
function calculateLayout() {
  // 設定頁面左右安全邊界
  const sidePadding = clamp(width * 0.05, 16, 48);

  // 設定內容區域寬度
  const contentWidth = width - sidePadding * 2;

  // 判斷是否為寬螢幕
  const isWideLayout = width >= 720 && height >= 330;

  // 設定標題文字大小
  const titleSize = responsiveTextSize(0.055, 20, 42);

  // 設定副標題文字大小
  const progressSize = responsiveTextSize(0.031, 14, 24);

  // 設定題目文字大小
  const questionSize = responsiveTextSize(0.042, 17, 31);

  // 設定選項文字大小
  const optionTextSize = responsiveTextSize(0.032, 15, 24);

  // 設定按鈕文字大小
  const buttonTextSize = responsiveTextSize(0.032, 15, 24);

  // 設定標題區域高度
  const headerHeight = clamp(height * 0.16, 72, 135);

  // 設定題目框寬度
  const questionBoxWidth = min(contentWidth, 900);

  // 設定題目框高度
  const questionBoxHeight = clamp(height * 0.17, 92, 155);

  // 設定題目框水平位置
  const questionBoxX = width / 2;

  // 設定題目框垂直位置
  const questionBoxY = headerHeight + questionBoxHeight / 2 + 8;

  // 設定選項區域上方位置
  const optionsTop = questionBoxY + questionBoxHeight / 2 + 22;

  // 設定底部安全邊界
  const bottomPadding = clamp(height * 0.035, 14, 32);

  // 設定底部按鈕高度
  const buttonHeight = clamp(height * 0.075, 48, 64);

  // 設定選項與按鈕之間的間距
  const optionsButtonGap = clamp(height * 0.025, 12, 28);

  // 設定選項區域底部位置
  const optionsBottom = hasAnswered
    ? height - bottomPadding - buttonHeight - optionsButtonGap
    : height - bottomPadding;

  // 設定選項區域可使用高度
  const optionsAvailableHeight = max(100, optionsBottom - optionsTop);

  // 判斷是否使用雙欄排版
  const useTwoColumns =
    isWideLayout &&
    contentWidth >= 650 &&
    optionsAvailableHeight >= 170;

  // 設定選項欄數
  const columnCount = useTwoColumns ? 2 : 1;

  // 設定選項按鈕之間的水平間距
  const columnGap = clamp(width * 0.025, 14, 30);

  // 計算每一欄選項寬度
  const optionWidth = useTwoColumns
    ? (contentWidth - columnGap) / 2
    : contentWidth;

  // 設定選項垂直間距
  const rowGap = clamp(height * 0.018, 8, 18);

  // 計算每一列選項高度
  const rowCount = useTwoColumns ? 2 : 4;

  // 計算適合目前畫面的選項高度
  const calculatedOptionHeight =
    (optionsAvailableHeight - rowGap * (rowCount - 1)) / rowCount;

  // 將選項高度限制在適合觸控的範圍
  const optionHeight = clamp(
    calculatedOptionHeight,
    48,
    useTwoColumns ? 86 : 70
  );

  // 計算選項實際使用高度
  const optionsHeight =
    optionHeight * rowCount + rowGap * (rowCount - 1);

  // 計算選項區域實際起始位置
  const adjustedOptionsTop =
    optionsTop + max(0, (optionsAvailableHeight - optionsHeight) / 2);

  // 回傳完整響應式版面資料
  return {
    sidePadding,
    contentWidth,
    titleSize,
    progressSize,
    questionSize,
    optionTextSize,
    buttonTextSize,
    headerHeight,
    questionBoxWidth,
    questionBoxHeight,
    questionBoxX,
    questionBoxY,
    optionsTop: adjustedOptionsTop,
    optionWidth,
    optionHeight,
    rowGap,
    columnGap,
    columnCount,
    useTwoColumns,
    buttonHeight,
    bottomPadding,
    optionsButtonGap
  };
}

// 將過長文字自動換行
function wrapTextByWidth(message, maxWidth, textSizeValue) {
  // 設定目前文字大小
  textSize(textSizeValue);

  // 將文字依照空白切割成陣列
  const words = message.split(" ");

  // 宣告文字行陣列
  const lines = [];

  // 宣告目前正在組合的文字行
  let currentLine = "";

  // 逐一處理每個文字片段
  for (let i = 0; i < words.length; i++) {
    // 取得目前文字片段
    const testLine =
      currentLine.length === 0
        ? words[i]
        : currentLine + " " + words[i];

    // 判斷加入文字後是否超過寬度
    if (textWidth(testLine) <= maxWidth) {
      // 將文字加入目前文字行
      currentLine = testLine;
    } else {
      // 將目前文字行加入文字行陣列
      lines.push(currentLine);

      // 將目前文字片段設定為新的一行
      currentLine = words[i];
    }
  }

  // 判斷最後一行是否有文字
  if (currentLine.length > 0) {
    // 將最後一行加入文字行陣列
    lines.push(currentLine);
  }

  // 回傳換行後的文字
  return lines.join("\n");
}

// 繪製測驗主畫面
function drawQuizScreen() {
  // 取得目前題目的資料
  const current = questions[currentQuestion];

  // 計算目前畫面的響應式版面
  const layout = calculateLayout();

  // 設定標題文字顏色
  fill(COLORS.text);

  // 移除文字外框
  noStroke();

  // 設定標題文字大小
  textSize(layout.titleSize);

  // 顯示測驗標題
  text(
    "p5.js 程式設計簡易指令測驗",
    width / 2,
    layout.headerHeight * 0.34
  );

  // 設定題數文字大小
  textSize(layout.progressSize);

  // 顯示目前題數
  text(
    `第 ${currentQuestion + 1} 題／共 ${questions.length} 題`,
    width / 2,
    layout.headerHeight * 0.74
  );

  // 設定題目框背景顏色
  fill(COLORS.questionBox);

  // 移除題目框外框
  noStroke();

  // 繪製題目背景框
  rect(
    layout.questionBoxX,
    layout.questionBoxY,
    layout.questionBoxWidth,
    layout.questionBoxHeight,
    18
  );

  // 設定題目文字顏色
  fill(COLORS.white);

  // 設定題目文字大小
  textSize(layout.questionSize);

  // 將題目文字依照寬度換行
  const wrappedQuestion = wrapTextByWidth(
    current.question,
    layout.questionBoxWidth * 0.86,
    layout.questionSize
  );

  // 顯示題目文字
  text(
    wrappedQuestion,
    layout.questionBoxX,
    layout.questionBoxY,
    layout.questionBoxWidth * 0.86,
    layout.questionBoxHeight * 0.82
  );

  // 繪製選項
  drawOptions(current, layout);

  // 判斷是否已經作答
  if (hasAnswered) {
    // 繪製下一題按鈕
    drawNextButton(layout);
  }
}

// 取得指定選項的位置
function getOptionPosition(optionIndex, layout) {
  // 判斷目前是否為雙欄版面
  if (layout.useTwoColumns) {
    // 計算目前選項所在欄位
    const column = optionIndex % 2;

    // 計算目前選項所在列
    const row = floor(optionIndex / 2);

    // 計算選項水平位置
    const optionX =
      layout.sidePadding +
      layout.optionWidth / 2 +
      column * (layout.optionWidth + layout.columnGap);

    // 計算選項垂直位置
    const optionY =
      layout.optionsTop +
      layout.optionHeight / 2 +
      row * (layout.optionHeight + layout.rowGap);

    // 回傳選項位置
    return {
      x: optionX,
      y: optionY
    };
  }

  // 計算單欄選項的水平位置
  const optionX = width / 2;

  // 計算單欄選項的垂直位置
  const optionY =
    layout.optionsTop +
    layout.optionHeight / 2 +
    optionIndex * (layout.optionHeight + layout.rowGap);

  // 回傳選項位置
  return {
    x: optionX,
    y: optionY
  };
}

// 繪製四個選項
function drawOptions(current, layout) {
  // 逐一繪製四個選項
  for (let i = 0; i < current.options.length; i++) {
    // 取得目前選項位置
    const position = getOptionPosition(i, layout);

    // 設定選項水平位置
    let optionX = position.x;

    // 設定選項垂直位置
    let optionY = position.y;

    // 判斷是否為正確答案並已作答
    if (hasAnswered && i === current.answer) {
      // 讓正確答案上下跳動
      optionY += sin(animationTime * 4) * 8;
    }

    // 判斷是否為錯誤答案並已作答
    if (
      hasAnswered &&
      i === selectedOption &&
      selectedOption !== current.answer
    ) {
      // 讓錯誤答案左右移動
      optionX += sin(animationTime * 10) * 10;
    }

    // 判斷目前選項的背景顏色
    if (!hasAnswered) {
      // 尚未作答時使用一般選項顏色
      fill(COLORS.normalOption);
    } else if (i === current.answer) {
      // 正確答案使用 #E9E3E6
      fill(COLORS.correctOption);
    } else if (i === selectedOption) {
      // 錯誤答案使用 #BB4430
      fill(COLORS.wrongOption);
    } else {
      // 其他選項使用灰色
      fill(COLORS.disabledOption);
    }

    // 設定選項外框顏色
    stroke(COLORS.border);

    // 設定選項外框粗細
    strokeWeight(2);

    // 繪製選項按鈕
    rect(
      optionX,
      optionY,
      layout.optionWidth,
      layout.optionHeight,
      12
    );

    // 判斷目前是否為使用者答錯的選項
    if (
      hasAnswered &&
      i === selectedOption &&
      selectedOption !== current.answer
    ) {
      // 錯誤答案使用白色文字
      fill(COLORS.white);
    } else {
      // 其他答案使用深色文字
      fill(COLORS.text);
    }

    // 設定選項文字大小
    textSize(layout.optionTextSize);

    // 設定選項文字內容
    const optionText =
      `${String.fromCharCode(65 + i)}. ${current.options[i]}`;

    // 顯示選項文字
    text(
      optionText,
      optionX,
      optionY,
      layout.optionWidth * 0.9,
      layout.optionHeight * 0.84
    );
  }
}

// 繪製下一題按鈕
function drawNextButton(layout) {
  // 設定下一題按鈕水平位置
  const buttonX = width / 2;

  // 設定下一題按鈕垂直位置
  const buttonY =
    height -
    layout.bottomPadding -
    layout.buttonHeight / 2;

  // 設定下一題按鈕寬度
  const buttonWidth = min(layout.contentWidth * 0.55, 320);

  // 設定按鈕背景顏色
  fill(COLORS.button);

  // 設定按鈕外框顏色
  stroke(COLORS.border);

  // 設定按鈕外框粗細
  strokeWeight(2);

  // 繪製下一題按鈕
  rect(
    buttonX,
    buttonY,
    buttonWidth,
    layout.buttonHeight,
    12
  );

  // 設定按鈕文字顏色
  fill(COLORS.white);

  // 設定按鈕文字大小
  textSize(layout.buttonTextSize);

  // 判斷是否為最後一題
  if (currentQuestion === questions.length - 1) {
    // 顯示查看結果文字
    text("查看結果", buttonX, buttonY);
  } else {
    // 顯示下一題文字
    text("下一題", buttonX, buttonY);
  }
}

// 繪製測驗結果畫面
function drawResultScreen() {
  // 計算目前畫面的響應式版面
  const layout = calculateLayout();

  // 設定結果頁標題文字大小
  const resultTitleSize = responsiveTextSize(0.075, 26, 52);

  // 設定結果文字大小
  const resultTextSize = responsiveTextSize(0.045, 19, 32);

  // 設定結果頁標題顏色
  fill(COLORS.text);

  // 設定結果頁標題文字大小
  textSize(resultTitleSize);

  // 顯示測驗完成文字
  text("測驗完成！", width / 2, height * 0.28);

  // 設定結果文字大小
  textSize(resultTextSize);

  // 顯示答對題數
  text(
    `你答對了 ${score} 題，共 ${questions.length} 題`,
    width / 2,
    height * 0.43
  );

  // 設定結果按鈕寬度
  const buttonWidth = min(layout.contentWidth * 0.6, 330);

  // 設定結果按鈕高度
  const buttonHeight = clamp(height * 0.08, 50, 68);

  // 設定結果按鈕水平位置
  const buttonX = width / 2;

  // 設定結果按鈕垂直位置
  const buttonY = height * 0.62;

  // 設定結果按鈕背景顏色
  fill(COLORS.button);

  // 設定結果按鈕外框顏色
  stroke(COLORS.border);

  // 設定結果按鈕外框粗細
  strokeWeight(2);

  // 繪製結果按鈕
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 12);

  // 設定結果按鈕文字顏色
  fill(COLORS.white);

  // 設定結果按鈕文字大小
  textSize(layout.buttonTextSize);

  // 顯示重新測驗文字
  text("重新測驗", buttonX, buttonY);
}

// 處理滑鼠按下事件
function mousePressed() {
  // 呼叫共用指標事件處理函式
  handlePointerPress(mouseX, mouseY);

  // 不讓瀏覽器繼續處理滑鼠事件
  return false;
}

// 處理觸控開始事件
function touchStarted() {
  // 取得第一個觸控點的水平位置
  const touchX = touches.length > 0 ? touches[0].x : mouseX;

  // 取得第一個觸控點的垂直位置
  const touchY = touches.length > 0 ? touches[0].y : mouseY;

  // 呼叫共用指標事件處理函式
  handlePointerPress(touchX, touchY);

  // 不讓瀏覽器滑動頁面
  return false;
}

// 處理滑鼠與觸控的共用點擊邏輯
function handlePointerPress(pointerX, pointerY) {
  // 取得目前時間
  const now = millis();

  // 判斷是否在短時間內重複觸發
  if (now - lastPointerTime < 250) {
    // 直接結束函式
    return;
  }

  // 記錄本次點擊時間
  lastPointerTime = now;

  // 判斷測驗是否結束
  if (quizFinished) {
    // 處理重新測驗按鈕
    handleRestartButton(pointerX, pointerY);

    // 結束函式
    return;
  }

  // 判斷是否已經作答
  if (hasAnswered) {
    // 處理下一題按鈕
    handleNextButton(pointerX, pointerY);

    // 結束函式
    return;
  }

  // 取得目前題目資料
  const current = questions[currentQuestion];

  // 計算目前版面
  const layout = calculateLayout();

  // 逐一檢查四個選項
  for (let i = 0; i < current.options.length; i++) {
    // 取得目前選項的位置
    const position = getOptionPosition(i, layout);

    // 設定觸控判斷範圍的額外寬度
    const touchPaddingX = 6;

    // 設定觸控判斷範圍的額外高度
    const touchPaddingY = 6;

    // 判斷指標是否在選項範圍內
    const isInsideOption =
      pointerX >= position.x - layout.optionWidth / 2 - touchPaddingX &&
      pointerX <= position.x + layout.optionWidth / 2 + touchPaddingX &&
      pointerY >= position.y - layout.optionHeight / 2 - touchPaddingY &&
      pointerY <= position.y + layout.optionHeight / 2 + touchPaddingY;

    // 判斷是否點擊目前選項
    if (isInsideOption) {
      // 執行答題
      answerQuestion(i);

      // 結束迴圈
      break;
    }
  }
}

// 處理下一題按鈕
function handleNextButton(pointerX, pointerY) {
  // 計算目前響應式版面
  const layout = calculateLayout();

  // 設定下一題按鈕水平位置
  const buttonX = width / 2;

  // 設定下一題按鈕垂直位置
  const buttonY =
    height -
    layout.bottomPadding -
    layout.buttonHeight / 2;

  // 設定下一題按鈕寬度
  const buttonWidth = min(layout.contentWidth * 0.55, 320);

  // 判斷指標是否位於下一題按鈕範圍
  const isInsideButton =
    pointerX >= buttonX - buttonWidth / 2 &&
    pointerX <= buttonX + buttonWidth / 2 &&
    pointerY >= buttonY - layout.buttonHeight / 2 &&
    pointerY <= buttonY + layout.buttonHeight / 2;

  // 判斷是否點擊下一題按鈕
  if (isInsideButton) {
    // 前往下一題
    goToNextQuestion();
  }
}

// 處理重新測驗按鈕
function handleRestartButton(pointerX, pointerY) {
  // 計算目前響應式版面
  const layout = calculateLayout();

  // 設定重新測驗按鈕寬度
  const buttonWidth = min(layout.contentWidth * 0.6, 330);

  // 設定重新測驗按鈕高度
  const buttonHeight = clamp(height * 0.08, 50, 68);

  // 設定重新測驗按鈕水平位置
  const buttonX = width / 2;

  // 設定重新測驗按鈕垂直位置
  const buttonY = height * 0.62;

  // 判斷指標是否位於重新測驗按鈕範圍
  const isInsideButton =
    pointerX >= buttonX - buttonWidth / 2 &&
    pointerX <= buttonX + buttonWidth / 2 &&
    pointerY >= buttonY - buttonHeight / 2 &&
    pointerY <= buttonY + buttonHeight / 2;

  // 判斷是否點擊重新測驗按鈕
  if (isInsideButton) {
    // 重新開始測驗
    resetQuiz();
  }
}

// 處理使用者答題
function answerQuestion(optionIndex) {
  // 記錄使用者選擇的選項
  selectedOption = optionIndex;

  // 設定目前題目已經作答
  hasAnswered = true;

  // 取得目前題目資料
  const current = questions[currentQuestion];

  // 判斷使用者是否答對
  if (optionIndex === current.answer) {
    // 答對時增加分數
    score++;
  }

  // 將動畫時間歸零
  animationTime = 0;
}

// 前往下一題
function goToNextQuestion() {
  // 判斷是否已經是最後一題
  if (currentQuestion === questions.length - 1) {
    // 設定測驗結束
    quizFinished = true;

    // 結束函式
    return;
  }

  // 前往下一題
  currentQuestion++;

  // 設定下一題尚未作答
  hasAnswered = false;

  // 清除選項紀錄
  selectedOption = -1;

  // 重設動畫時間
  animationTime = 0;
}

// 重新開始測驗
function resetQuiz() {
  // 將題目編號重設為第一題
  currentQuestion = 0;

  // 將分數歸零
  score = 0;

  // 設定尚未作答
  hasAnswered = false;

  // 清除選項紀錄
  selectedOption = -1;

  // 設定測驗尚未結束
  quizFinished = false;

  // 重設動畫時間
  animationTime = 0;
}

// 當瀏覽器視窗大小改變時執行
function windowResized() {
  // 重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算畫面版面
  calculateLayout();
}