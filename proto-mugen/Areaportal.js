const UNITS = [

  { name: "スライム",   rate: 0,  HP: 30, MP: 5,  atk: 5,  def: 2,  agi: 4,  mag: 1, exp: 10, skillSlot: [], Faction: "enemy" },
  { name: "ゴブリン",   rate: 5,  HP: 50, MP: 10, atk: 10, def: 5,  agi: 6,  mag: 2, exp: 20, skillSlot: [], Faction: "enemy" },
  { name: "オーク",     rate: 8,  HP: 80, MP: 15, atk: 15, def: 10, agi: 5,  mag: 3, exp: 35, skillSlot: [], Faction: "enemy" },

  { name: "ドラゴン",   rate: 50, HP: 200, MP: 50, atk: 40, def: 25, agi: 10, mag: 15, exp: 150, skillSlot: [], Faction: "boss" },
  { name: "デーモン",   rate: 51, HP: 180, MP: 60, atk: 35, def: 20, agi: 12, mag: 20, exp: 140, skillSlot: [], Faction: "boss" },
  { name: "ゴーレム",   rate: 7,  HP: 150, MP: 0,  atk: 20, def: 30, agi: 2,  mag: 0,  exp: 60, skillSlot: [], Faction: "enemy" },

  { name: "魔導士",     rate: 3,  HP: 40, MP: 60, atk: 5,  def: 3,  agi: 5,  mag: 20, exp: 40, skillSlot: [], Faction: "enemy" },
  { name: "ナイト",     rate: 6,  HP: 90, MP: 20, atk: 18, def: 15, agi: 7,  mag: 5,  exp: 50, skillSlot: [], Faction: "enemy" },

  { name: "フェアリー", rate: 100, HP: 35, MP: 80, atk: 3,  def: 2,  agi: 10, mag: 25, exp: 30, skillSlot: [], Faction: "ally" },
  { name: "精霊戦士",   rate: 100, HP: 100, MP: 50, atk: 20, def: 10, agi: 8,  mag: 10, exp: 70, skillSlot: [], Faction: "ally" }

];


// ====================
// Rune 定義
// ====================

const RUNES = {

  001: {

    label: "θ",

    Depth: +0,

    Circle: 3,

    Risk: +0.1,

    Reward: 1.1,

    Level: +1,

  },

  002: {

    label: "Δ",

    Depth: +3,

    Circle: 5,

    Risk: +1,

    Reward: 1.25,

    Level: +21,

    Boss: 20,

  }

};



// ====================

// Word1（雑魚・リスク）

// ====================

const WORD1 = {

  001: {

    label: "静かな",

    Sub:1,
    Depth: -2,

    Risk:-0.1,

  },

  002: {

    label: "輝ける",


  },

  003: {

    label: "絶妙な",


  },

};



// ====================

// Word2（ボス・リワード）

// ====================

const WORD2 = {

  001: {

    label: "萌葱色の",

    Boss:0,

    Depth: -4,

    Reward:-0.1,

  },

  002: {

    label: "空虚の",

  }

};



// ====================

// Word3（深さ・サークル)

// ====================

const WORD3 = {

  forest: {

    label: "大森林",

    Enemy:4,

  },

  city: {

    label: "廃棄都市",

    Enemy:6,

  }

};





function populateSelect(selectId, dataObj) {
  const select = document.getElementById(selectId);

  Object.keys(dataObj).forEach(key => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = dataObj[key].label;

    select.appendChild(option);
  });
}

// 初期化
populateSelect("runeSelect", RUNES);
populateSelect("word1Select", WORD1);
populateSelect("word2Select", WORD2);
populateSelect("word3Select", WORD3);

function mergeStats(...parts) {
  const result = {
    Enemy: 0,
    Sub: 0,
    Boss: 0,
    Depth: 10,
    Circle: 3,
    Risk: 1,
    Reward: 1,
    Level: 1,
  };

  parts.forEach(p => {
    Object.keys(result).forEach(k => {
      if (p[k]) result[k] += p[k];
    });
  });
  return result;
}

// 5段階マッピング関数

function mapToLevel(value, max, labels) {
  const step = max / labels.length;
  const index = Math.min(Math.floor(value / step), labels.length - 1);
  return labels[index];
}

// ====================
// Risk表示用正規化
// 1以下 → 0
// 3以上 → 3
// それ以外 → risk - 1
// ====================

function normalizeRiskForDisplay(risk) {
  if (risk <= 1.0) return 0;
  if (risk >= 3.0) return 3.0;
  return risk - 1.0;
}

// Area情報更新

// ====================
// エリア情報更新
// ====================

function updateAreaInformation() {
  const runeKey  = document.getElementById("runeSelect").value;
  const word1Key = document.getElementById("word1Select").value;
  const word2Key = document.getElementById("word2Select").value;
  const word3Key = document.getElementById("word3Select").value;
  const rune  = RUNES[runeKey];
  const w1    = WORD1[word1Key];
  const w2    = WORD2[word2Key];
  const w3    = WORD3[word3Key];

  if (!rune || !w1 || !w2 || !w3) return;

  const stats = mergeStats(rune, w1, w2, w3);

  // ====================
  // Enemyユニット取得
  // ====================

  let mainUnits = getUnitsByEnemyRate(stats.Enemy);
  const mainDisplay = mainUnits.length ? mainUnits.join(", ") : "なし";

  // ====================
  // 各ラベル設定
  // ====================

  const depthLabels  = ["一層","二層","三層","四層","五層"];
  const circleLabels = ["無","微","小","中","大"];
  const riskLabels   = ["易","少","普","高","極"];
  const depthDisplay  = mapToLevel(stats.Depth, 20, depthLabels);
  const circleDisplay = mapToLevel(stats.Circle, 10, circleLabels);
  const riskDisplay = mapToLevel(
  normalizeRiskForDisplay(stats.Risk),

  3,

  riskLabels

);

  // ====================
  // 表示
  // ====================

  document.getElementById("areaInformation").innerHTML =
    `<b>フィールド情報</b> 
<br>
     レベル: ${stats.Level} 
     生息: ${mainDisplay} 
     深さ: ${depthDisplay} 
     歪み: ${circleDisplay} 
     難易度: ${riskDisplay}`;

}

// ====================
// Enemy補完用関数
// ====================

function getUnitsByEnemyRate(rate) {
  // ENEMY_MASTER を配列に変換
const enemies = Object.values(ENEMY_MASTER)
  .filter(u => u.faction === "enemy");


  // 完全一致
  let matched = enemies
    .filter(u => u.rate === rate)
    .map(u => u.name);

  if (matched.length) return matched;

  // 補完処理
  if (rate < 0) {
    const minRate = Math.min(...enemies.map(u => u.rate));
    return enemies
      .filter(u => u.rate === minRate)
      .map(u => u.name);
  }

  if (rate > 10) {
    const maxRate = Math.max(...enemies.map(u => u.rate));
    return enemies
      .filter(u => u.rate === maxRate)
      .map(u => u.name);
  }

  return []; // 一応保険
}

// セレクト変更時に自動更新
["runeSelect", "word1Select", "word2Select", "word3Select"]
  .forEach(id =>
    document.getElementById(id)
      .addEventListener("change", updateAreaInformation)
  );

// 初期表示
updateAreaInformation();
// ====================
// 戦闘モード切り替え
// ====================

const modeBtn = document.getElementById("modeBtn");
const modeDesc = document.getElementById("modeDesc");

function updateModeUI() {
  if (!modeBtn || !modeDesc) return;
  if (player.mode === "auto") {
    modeBtn.textContent = "気軽";
    modeDesc.textContent = "戦闘は自動で進行します";
  } else {
    modeBtn.textContent = "じっくり";
    modeDesc.textContent = "行動を自分で選択します";
  }
}

if (modeBtn) {
  modeBtn.onclick = () => {
    player.mode = (player.mode === "auto") ? "manual" : "auto";
    updateModeUI();
  };
}

// 初期表示
updateModeUI();

function startAdventure(location) {
  inAdventure = true;
  currentLocation = location;
  adventurePlayer = createAdventurePlayer(player);
adventurePhase = "idle";
updateAdventureButtons();


//document.getElementById("exploreBtn").disabled = false;
//document.getElementById("approachBtn").disabled = true;
//document.getElementById("retreatBtn").disabled = true;

  // ★ ルーン記号ごとの色マップ
  const runeColorMap = {
    "θ": "#00bfff",
    "Δ": "#7fff00",
    "Λ": "#ffff00",
    "Ω": "#ff7f00",
    "Ψ": "#ff0000"
  };

  const runeMatch = location.name.match(/^[^\s]/);
  const runeSymbol = runeMatch ? runeMatch[0] : null;
  const color =
    runeSymbol && runeColorMap[runeSymbol]
      ? runeColorMap[runeSymbol]
      : "white";

  pushLog(
    `<span style="color:${color};"><b>${location.name}</b></span> に出発した！`
  );

  // ====================
  // ★ 冒険進行データ初期化と冒険中のエリア情報adventureStats
  // ====================
  adventureStats = location.stats;

  adventureState = {
    depthNow: 1,
    circleNow: 0,
    circleTarget: generateCircleCount(adventureStats.Circle)
  };

  pushLog(
    `第${adventureState.depthNow}階層：魔法陣を感知した（${adventureState.circleTarget}基）`
  );

  setAdventureUI(true);
  renderAdventureStatus(adventurePlayer);

  // デバッグ
  console.log("現在地データ:", currentLocation);
  console.log("冒険ステータス:", adventureStats);
  console.log("冒険進行状態:", adventureState);
}


// ====================
// 冒険開始処理
// ====================

function hasActiveSkillEquipped() {
  return player.skillSlot.some(id => {
    if (!id) return false;
    const skill = SKILL_MASTER[id];
    return skill && skill.type === "active";
  });
}

//   -----戦闘データ作成(adventurePlayer.battle.atk)等-----


// -------------------------
// 出発ボタンの処理
// -------------------------
document.getElementById("departBtn").onclick = () => {

  // ====================
  // HPチェック
  // ====================
  if (player.hp <= 0) {
    pushLog("冒険に行く元気がない…宿屋に行こう！");
    return; // ここで処理中断
  }

  // ★ 二重安全装置：アクティブスキル確認
  if (!hasActiveSkillEquipped()) {
    pushLog(`アクティブスキルが無い。このままでは戦えない。`);
    return;
  }

  const rune = RUNES[document.getElementById("runeSelect").value];
  const w1   = WORD1[document.getElementById("word1Select").value];
  const w2   = WORD2[document.getElementById("word2Select").value];
  const w3   = WORD3[document.getElementById("word3Select").value];

  const areaName = `${rune.label} ${w1.label}${w2.label}${w3.label}`;
  const stats = mergeStats(rune, w1, w2, w3);

  startAdventure({
    name: areaName,
    stats
  });

  renderAdventureStatus(adventurePlayer);
};
