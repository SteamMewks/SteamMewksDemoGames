

// ステータス・あとで戦闘UIと合流

function renderAdventureStatus(adventurePlayer) {
  const el = document.getElementById("adventureStatus");
  if (!el) return;

  if (!adventurePlayer || !adventurePlayer.battle) {
    el.innerHTML = "ステータス情報は未準備です";
    return;
  }

  const b = adventurePlayer.battle;

  const weaponName = adventurePlayer.equippedWeapon?.name ?? "なし";
  const armorName = adventurePlayer.equippedArmor?.name ?? "なし";
  const accessoryName = adventurePlayer.equippedAccessory?.name ?? "なし";

  // 冒険中のアイテム表示
  const itemStatus = Object.keys(ITEM_ICON_MAP)
    .map(key => `${ITEM_ICON_MAP[key]}${adventurePlayer.item[key].toLocaleString()}`)
    .join(" ");

  el.innerHTML = `
    <p>【${adventurePlayer.name}:冒険中】Lv: ${adventurePlayer.level} ( ${adventurePlayer.exp} / 1000 )</p>
    <p> HP: ${b.hp.toLocaleString()} / ${b.mhp.toLocaleString()} MP: ${b.mp.toLocaleString()} / ${b.mmp.toLocaleString()} / ${adventurePlayer.gold.toLocaleString()}G</p>
    <p>
      Atk: ${b.atk.toLocaleString()} /
      Def: ${b.def.toLocaleString()} /
      Dex: ${b.dex.toLocaleString()} /
      Agi: ${b.agi.toLocaleString()} /
      Mag: ${b.mag.toLocaleString()}
    </p>
    <p>所持品: ${itemStatus}</p>
  `;
}









let adventureStats = null;
let adventureState = null;

let adventurePhase = "idle";


function updateAdventureButtons() {
  const exploreBtn  = document.getElementById("exploreBtn");
  const approachBtn = document.getElementById("approachBtn");
  const retreatBtn  = document.getElementById("retreatBtn");

  if (adventurePhase === "idle") {
    exploreBtn.style.display  = "";
    exploreBtn.disabled = false;

    approachBtn.style.display = "none";
    retreatBtn.style.display  = "none";
  }

  if (adventurePhase === "investigating") {
    exploreBtn.disabled = true;

    approachBtn.style.display = "";
    retreatBtn.style.display  = "";
    approachBtn.disabled = false;
    retreatBtn.disabled  = false;
  }
}



// ====================
// 魔法陣数生成（±2）
// ====================
function generateCircleCount(baseCircle) {
  const variance = Math.floor(Math.random() * 5) - 2; // -2〜+2
  return Math.max(1, baseCircle + variance);
}

// ====================
// 冒険中アクション
// エリア探索管理
// ====================

//   -----調査開始-----

document.getElementById("exploreBtn").onclick = () => {

// ====================
// HPチェック
// ====================
if (adventurePlayer.battle.hp <= 0 || adventurePlayer.hp <= 0) {
  pushLog("体力が尽きている…");
  pushLog("回復しないと動けない！");
  return; // ここで処理中断
}

  renderAdventureStatus(adventurePlayer);
  if (!inAdventure) return;

  // ====================
  // ボス階層
  // ====================
  if (adventurePhase === "boss") {
    pushLog("巨大な魔法陣から光り輝く門が現れた……しかし、邪悪な魔法陣から何かが飛び出し、行く手を阻んだ！");

const enemies = createEnemyGroup("boss");
const allies  = createAllyGroup();
const players = getPlayerUnits();

const units = [...players, ...allies, ...enemies];

  document.getElementById("approachBtn").disabled = true;
  document.getElementById("retreatBtn").disabled = true;

initBattle(units);

    return;
  }

  // ====================
  // 財宝階層
  // ====================
  if (adventurePhase === "treasure") {
    pushLog("財宝を発見した！");
    // TODO: openTreasure();
    return;
  }

  // ====================
  // 通常階層のみ既存処理
  // ====================
  if (adventurePhase !== "idle") return;

  adventurePhase = "investigating";

  pushLog(
    `第${adventureState.depthNow}階層... ${adventureState.circleTarget} 基の魔法陣が歪みを生み出しているようだ。`
  );

  updateAdventureButtons();
};


//   ------階層の調査-----

document.getElementById("approachBtn").onclick = () => {
// ====================
// HPチェック
// ====================
if (adventurePlayer.battle.hp <= 0 || adventurePlayer.hp <= 0) {
  pushLog("体力が尽きている…");
  pushLog("回復しないと動けない！");
  return; // ここで処理中断
}

  if (adventurePhase !== "investigating") return;

  resolveApproachEvent();
  consumeCircle();
};

document.getElementById("retreatBtn").onclick = () => {
  if (adventurePhase !== "investigating") return;

// ====================
// HPチェック
// ====================
if (adventurePlayer.battle.hp <= 0 || adventurePlayer.hp <= 0) {
  pushLog("体力が尽きている…");
  pushLog("回復しないと動けない！");
  return; // ここで処理中断
}
  resolveRetreatEvent();
  consumeCircle();
};


function consumeCircle() {
  adventureState.circleNow++;

  // Circle終了チェック
  if (adventureState.circleNow >= adventureState.circleTarget) {
    finishCircleInvestigation();
  }
}




//   ------階層の調査終了-----
function finishCircleInvestigation() {
  pushLog("この階層の調査を完了した。");

  // フェーズを探索前に戻す
  adventurePhase = "idle";
  updateAdventureButtons();

  // 階層を進める
  advanceDepth();
}




//   -----魔法陣に接近-----

function resolveApproachEvent() {

adventurePlayer.battle.mp = Math.min(
  Math.floor(
    adventurePlayer.battle.mp + (adventurePlayer.battle.mmp * 0.01) + 1
  ),
  adventurePlayer.battle.mmp
);
renderAdventureStatus(adventurePlayer);

console.log(
  "[DEBUG-B] depth:", adventureState.depthNow,
  "adventureStats.Depth:", adventureStats.Depth,
);

  const roll = Math.random();

  if (roll < 0.6) {
    pushLog("敵影が実体化した！");

const enemies = createEnemyGroup();
const allies  = createAllyGroup();
const players = getPlayerUnits();

const units = [...players, ...allies, ...enemies];

  document.getElementById("approachBtn").disabled = true;
  document.getElementById("retreatBtn").disabled = true;

initBattle(units);

    return;
  }

  if (roll < 0.9) {
    pushLog("宝箱を発見した！");
  resolveTreasureChest();
    return;
  }

  pushLog("……何も起こらなかった。");

}



//   -----魔法陣から離れた-----

function resolveRetreatEvent() {

adventurePlayer.battle.mp = Math.min(
  Math.floor(
    adventurePlayer.battle.mp + (adventurePlayer.battle.mmp * 0.07) + 1
  ),
  adventurePlayer.battle.mmp
);


  const lostGold = Math.max(1, Math.floor(player.gold * 0.01));
  adventurePlayer.gold -= lostGold;

  pushLog(`逃走の代償として ${lostGold}G を失った。魔法陣が消失した！`);
renderAdventureStatus(adventurePlayer);
}


function advanceDepth() {
  adventureState.depthNow++;

  // ====================
  // 財宝階層
  // ====================
//  if (adventureState.depthNow === adventureStats.Depth) {
//    pushLog("レリアの最下層に到達した……財宝の気配が満ちている。");

//    adventurePhase = "treasure";
//    updateAdventureButtons();
//    return;
//  }

  // ====================
  // ボス階層
  // ====================
  if (adventureState.depthNow === adventureStats.Depth - 1) {
    pushLog("禍々しい気配を感じる…次の階層にレリアの主がいるようだ。");

  adventureState.circleNow = 0;
  adventureState.circleTarget = 0;

    adventurePhase = "boss";
    updateAdventureButtons();

console.log(
  "[DEBUG-B] depth:", adventureState.depthNow,
  "circleNow:", adventureState.circleNow,
  "circleTarget:", adventureState.circleTarget
);

    return;
  }

  // ====================
  // 通常階層
  // ====================
  adventureState.circleNow = 0;
  adventureState.circleTarget =
    generateCircleCount(adventureStats.Circle);
  pushLog(
    `次の階層への道が現れた！`
  );

  adventurePhase = "idle";
  updateAdventureButtons();

console.log(
  "[DEBUG] depth:", adventureState.depthNow,
  "circleNow:", adventureState.circleNow,
  "circleTarget:", adventureState.circleTarget
);

}



// ====================
// 帰還処理
// ====================
document.getElementById('returnBtn').onclick = () => {
  // 冒険中の状態をプレイヤーに反映
  syncAdventureToPlayer(adventurePlayer, player);

  // 冒険終了処理
  endAdventure();

  // ステータス表示を更新
  renderStatus();

  // 自動保存
  autoSave();

  // 幻想市場チェック
  trySpawnIllusionShop();
};

function syncAdventureToPlayer(adventurePlayer, player) {
  player.hp   = adventurePlayer.battle.hp;
  player.mp   = adventurePlayer.battle.mp;
  player.exp  = adventurePlayer.exp;
  player.gold = adventurePlayer.gold;

  // ★ AI を反映
  if (adventurePlayer.AI) {
    player.AI = structuredClone(adventurePlayer.AI);
  }

  console.log(
    `街に帰還した。` +
    `HP: ${adventurePlayer.battle.hp.toLocaleString()} / ` +
    `MP: ${adventurePlayer.battle.mp.toLocaleString()} / ` +
    `EXP: ${adventurePlayer.exp} / ` +
    `GOLD: ${adventurePlayer.gold}`
  );

  // 最大値超過を補正（装備解除差分対策）
  if (player.hp > player.mhp) player.hp = player.mhp;
  if (player.mp > player.mmp) player.mp = player.mmp;


  console.log(`AI傾向もプレイヤーに反映された:`, player.AI);
}

function endAdventure() {
  inAdventure = false;
  currentLocation = null;

  // 冒険ステータス表示をクリア
  const el = document.getElementById("adventureStatus");
  if (el) el.innerHTML = "";

  setAdventureUI(false);

  console.log(`街に帰還した。HP: ${player.hp.toLocaleString()} / MP: ${player.mp.toLocaleString()} / EXP: ${player.exp} / GOLD: ${player.gold}`);
}


//-----------------------------------------------------------

const ENEMY_MASTER = {

// 闇・雑魚
GHST: {
  name: "ゴースト",
  rate: 0,
  hp: 50,
  mp: 100, // 合計150
  atk: 4,
  def: 3,
  agi: 4,
  dex: 5,
  mag: 16, // 合計32
  exp: 20,
  skillSlot: [],
  faction: "enemy",
},

KGHST: {
  name: "キングゴースト",
  rate: 20,
  hp: 75,
  mp: 125, // 合計200
  atk: 8,
  def: 6,
  agi: 8,
  dex: 10,
  mag: 32, // 合計64
  exp: 30,
  skillSlot: [],
  faction: "enemy",
},

// 闇・ボス
VLGRS: {
  name: "ヴァルグリス",
  rate: 40,
  hp: 180,
  mp: 220, // 合計400
  atk: 13,
  def: 12,
  agi: 12,
  dex: 13,
  mag: 25, // 合計75
  exp: 40,
  skillSlot: [],
  faction: "boss",
},



// 恐怖・雑魚
SHADW: {
  name: "シャドウ",
  rate: 1,
  hp: 70,
  mp: 80, // 合計150
  atk: 7,
  def: 5,
  agi: 7,
  dex: 8,
  mag: 5, // 合計32
  exp: 20,
  skillSlot: [],
  faction: "enemy",
},
KSHADW: {
  name: "キングシャドウ",
  rate: 21,
  hp: 95,
  mp: 105, // 合計200
  atk: 14,
  def: 10,
  agi: 14,
  dex: 16,
  mag: 10, // 合計64
  exp: 30,
  skillSlot: [],
  faction: "enemy",
},

// 恐怖・ボス
NXFEL: {
  name: "ノクスフェル",
  rate: 41,
  hp: 190,
  mp: 210, // 合計400
  atk: 14,
  def: 13,
  agi: 16,
  dex: 17,
  mag: 15, // 合計75
  exp: 40,
  skillSlot: [],
  faction: "boss",
},



// 探求・雑魚
FAIRY: {
  name: "フェアリー",
  rate: 2,
  hp: 60,
  mp: 90, // 合計150
  atk: 5,
  def: 3,
  agi: 6,
  dex: 8,
  mag: 10, // 合計32
  exp: 20,
  skillSlot: [],
  faction: "enemy",
},
QFAIRY: {
  name: "クインフェアリー",
  rate: 22,
  hp: 85,
  mp: 115, // 合計150
  atk: 10,
  def: 6,
  agi: 12,
  dex: 16,
  mag: 20, // 合計32
  exp: 30,
  skillSlot: [],
  faction: "enemy",
},

// 探求・ボス
LMNRA: {
  name: "ルミナリア",
  rate: 42,
  hp: 170,
  mp: 230, // 合計400
  atk: 13,
  def: 12,
  agi: 14,
  dex: 18,
  mag: 18, // 合計50
  exp: 40,
  skillSlot: [],
  faction: "boss",
},


// 強欲・雑魚
GOBLN: {
  name: "ゴブリン",
  rate: 3,
  hp: 90,
  mp: 60, // 合計150
  atk: 11,
  def: 9,
  agi: 4,
  dex: 6,
  mag: 2, // 合計32
  exp: 20,
  skillSlot: [],
  faction: "enemy",
},

KGOBLN: {
  name: "キングゴブリン",
  rate: 23,
  hp: 115,
  mp: 80, // 合計150
  atk: 22,
  def: 18,
  agi: 8,
  dex: 12,
  mag: 4, // 合計32
  exp: 30,
  skillSlot: [],
  faction: "enemy",
},

// 強欲・ボス
GRDRN: {
  name: "グラドリオン",
  rate: 53,
  hp: 220,
  mp: 180, // 合計400
  atk: 20,
  def: 17,
  agi: 12,
  dex: 15,
  mag: 11, // 合計50
  exp: 40,
  skillSlot: [],
  faction: "boss",
},


// 偏執・雑魚
WISPR: {
  name: "ウィスプ",
  rate: 4,
  hp: 50,
  mp: 100, // 合計150
  atk: 3,
  def: 3,
  agi: 4,
  dex: 6,
  mag: 16, // 合計32
  exp: 20,
  skillSlot: [],
  faction: "enemy",
},
QWISPR: {
  name: "クインウィスプ",
  rate: 24,
  hp: 75,
  mp: 125, // 合計150
  atk: 6,
  def: 6,
  agi: 8,
  dex: 12,
  mag: 32, // 合計32
  exp: 30,
  skillSlot: [],
  faction: "enemy",
},

// 偏執・ボス
OBSDA: {
  name: "オブセディア",
  rate: 44,
  hp: 200,
  mp: 200, // 合計400
  atk: 14,
  def: 13,
  agi: 14,
  dex: 15,
  mag: 23, // 合計50
  exp: 40,
  skillSlot: [],
  faction: "boss",
},


// 欺瞞・雑魚
GIGNT: {
  name: "ギガンテス",
  rate: 5,
  hp: 100,
  mp: 50, // 合計150
  atk: 12,
  def: 9,
  agi: 3,
  dex: 7,
  mag: 1, // 合計32
  exp: 20,
  skillSlot: [],
  faction: "enemy",
},

KGIGNT: {
  name: "キングギガンテス",
  rate: 25,
  hp: 125,
  mp: 75, // 合計150
  atk: 24,
  def: 18,
  agi: 6,
  dex: 14,
  mag: 2, // 合計32
  exp: 30,
  skillSlot: [],
  faction: "enemy",
},

// 欺瞞・ボス
MLFCS: {
  name: "マリフィカス",
  rate: 45,
  hp: 180,
  mp: 220, // 合計400
  atk: 16,
  def: 14,
  agi: 12,
  dex: 17,
  mag: 16, // 合計50
  exp: 40,
  skillSlot: [],
  faction: "boss",
},


// 後悔・雑魚
SKLTN: {
  name: "スケルトン",
  rate: 6,
  hp: 130,
  mp: 20, // 合計150
  atk: 13,
  def: 9,
  agi: 3,
  dex: 5,
  mag: 2, // 合計32
  exp: 20,
  skillSlot: [],
  faction: "enemy",
},

KSKLTN: {
  name: "スケルトン",
  rate: 26,
  hp: 155,
  mp: 45, // 合計150
  atk: 26,
  def: 18,
  agi: 6,
  dex: 10,
  mag: 4, // 合計32
  exp: 30,
  skillSlot: [],
  faction: "enemy",
},

// 後悔・ボス
RQIEL: {
  name: "レクイエル",
  rate: 46,
  hp: 200,
  mp: 200, // 合計400
  atk: 17,
  def: 15,
  agi: 13,
  dex: 13,
  mag: 17, // 合計50
  exp: 40,
  skillSlot: [],
  faction: "boss",
},


// 虚無・雑魚
SLIME: {
  name: "スライム",
  rate: 7,
  hp: 60,
  mp: 90, // 合計150
  atk: 2,
  def: 2,
  agi: 4,
  dex: 3,
  mag: 21, // 合計32
  exp: 20,
  skillSlot: [],
  faction: "enemy",
},

QSLIME: {
  name: "クインスライム",
  rate: 27,
  hp: 85,
  mp: 115, // 合計150
  atk: 4,
  def: 4,
  agi: 8,
  dex: 6,
  mag: 41, // 合計32
  exp: 30,
  skillSlot: [],
  faction: "enemy",
},

VIDRN: {
  name: "ヴォイドラン",
  rate: 47,
  hp: 180,
  mp: 220, // 合計400
  atk: 13,
  def: 12,
  agi: 17,
  dex: 11,
  mag: 22, // 合計50
  exp: 40,
  skillSlot: [],
  faction: "boss",
},



// 観測・雑魚
ARMOR: {
  name: "アーマー",
  rate: 8,
  hp: 110,
  mp: 40, // 合計150
  atk: 12,
  def: 9,
  agi: 2,
  dex: 8,
  mag: 1, // 合計32
  exp: 20,
  skillSlot: [],
  faction: "enemy",
},

KARMOR: {
  name: "キングアーマー",
  rate: 28,
  hp: 135,
  mp: 65, // 合計150
  atk: 24,
  def: 18,
  agi: 4,
  dex: 16,
  mag: 2, // 合計32
  exp: 20,
  skillSlot: [],
  faction: "enemy",
},

// 観測・ボス
CLSTN: {
  name: "セレストロン",
  rate: 48,
  hp: 200,
  mp: 200, // 合計400
  atk: 15,
  def: 16,
  agi: 12,
  dex: 17,
  mag: 15, // 合計50
  exp: 40,
  skillSlot: [],
  faction: "boss",
},


// 超越・雑魚
SWDMM: {
  name: "ソードマン",
  rate: 9,
  hp: 120,
  mp: 30, // 合計150
  atk: 15,
  def: 7,
  agi: 3,
  dex: 6,
  mag: 1, // 合計32
  exp: 20,
  skillSlot: [],
  faction: "enemy",
},

QSWDMM: {
  name: "クインソードマン",
  rate: 29,
  hp: 145,
  mp: 55, // 合計150
  atk: 30,
  def: 14,
  agi: 6,
  dex: 12,
  mag: 2, // 合計32
  exp: 20,
  skillSlot: [],
  faction: "enemy",
},

// 超越・ボス
TRNSD: {
  name: "トランセンダ",
  rate: 49,
  hp: 220,
  mp: 180, // 合計400
  atk: 19,
  def: 16,
  agi: 13,
  dex: 14,
  mag: 13, // 合計50
  exp: 40,
  skillSlot: [],
  faction: "boss",
},




//NPC
COMPANION: {
  name: "コルウィ",//Samantha Corwe
  rate: 200,
  hp: 80,
  mp: 120, // 合計200

  atk: 5,
  def: 6,
  agi: 9,
  dex: 10,
  mag: 10, // 合計40

  exp: 0,
  skillSlot: ["attack","s_mindarrow"],
  faction: "ally",
  level: 5,
},

  FRIEND: { name: "拡張用",   rate: 200, hp: 1, mp: 1, atk: 1, def: 1, agi: 1,  mag: 1, exp: 0,  skillSlot: [], faction: "ally"  }
};

const enemyAlias = [
  // 役割個体
  { name: "ウォリアー", lv: 1, atk: 1.2 },
  { name: "ナイト", lv: 1, def: 1.2 },
  { name: "スカウト", lv: 1, dex: 1.2 },
  { name: "ローグ", lv: 1, agi: 1.2 },
  { name: "メイジ", lv: 1, mag: 1.2 },

  // 悪夢化
  { name: "ホラー", lv: 2, mhp: 1.2, mmp: 1.2, atk:1.1, def:1.1, dex:1.1, agi:1.1, mag:1.1 },
  { name: "デモンホラー", lv: 4, mhp: 1.0, mmp: 1.0, atk:1.3, def:1.3, dex:1.3, agi:1.3, mag:1.3 },
  { name: "ナイトメア", lv: 6, mhp: 0.8, mmp: 0.8, atk:1.5, def:1.5, dex:1.5, agi:1.5, mag:1.5 },

  //侵蝕化
  { name: "テラー", lv: 5, mhp: 1.5, mmp: 1.1, atk:1.3, def:1.3, dex:1.2, agi:1.2, mag:1.2 },
  { name: "ルーマー", lv: 5, mhp: 0.9, mmp: 1.3, atk:1.0, def:1.0, dex:1.2, agi:1.1, mag:1.5 },
  { name: "グリーダー", lv: 5, mhp: 1.3, mmp: 1.0, atk:1.4, def:1.3, dex:1.0, agi:1.0, mag:1.0 },
  { name: "オブセラー", lv: 5, mhp: 1.0, mmp: 1.0, atk:1.2, def:1.2, dex:1.1, agi:1.3, mag:1.3 },
  { name: "ディセラー", lv: 5, mhp: 0.9, mmp: 1.2, atk:1.0, def:1.0, dex:1.3, agi:1.2, mag:1.5 },
  { name: "レクエラー", lv: 5, mhp: 1.2, mmp: 1.0, atk:1.2, def:1.3, dex:1.0, agi:1.1, mag:1.2 },
  { name: "ヴォイダー", lv: 5, mhp: 1.0, mmp: 1.3, atk:0.9, def:1.0, dex:1.0, agi:1.0, mag:1.5 },
  { name: "セレスター", lv: 5, mhp: 1.1, mmp: 1.5, atk:1.1, def:1.1, dex:1.3, agi:1.1, mag:1.4 },
];

const ENEMY_GROUP_TYPES = [
  { main: 2, sub: 0 },
  { main: 0, sub: 2 },
  { main: 2, sub: 1 },
  { main: 1, sub: 2 },
  { main: 2, sub: 2 },
  { main: 4, sub: 0 },
];



function pickGroupType() {
  // まず敵の総数ごとに重みを設定（少ないほど大きく）
  const adjustedWeights = ENEMY_GROUP_TYPES.map(type => {
    const total = type.main + type.sub;
    return 1 / Math.max(total, 1); // 0を防ぐためにMath.max
  });

  // 重みの合計を計算して正規化
  const sumWeights = adjustedWeights.reduce((a, b) => a + b, 0);
  const normalizedWeights = adjustedWeights.map(w => w / sumWeights);

  // ランダムで選択
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < ENEMY_GROUP_TYPES.length; i++) {
    acc += normalizedWeights[i];
    if (r < acc) return ENEMY_GROUP_TYPES[i];
  }

  return ENEMY_GROUP_TYPES[0]; // 念のため
}

function normalizeEnemyRate(value) {
  if (value <= -1) return 0;

  const v = Math.floor(value);

  // 10未満はそのまま
  if (v < 10) return v;

  const tens = Math.floor(v / 10);
  const ones = v % 10;

  // 奇数十台のみ処理（1x, 3x, 5x, ...）
  if (tens % 2 === 1) {
    // 前半（10–14, 30–34, 50–54）
    if (ones <= 4) {
      return tens * 10 - 1; // 9, 29, 49...
    }
    // 後半（15–19, 35–39, 55–59）
    return (tens + 1) * 10; // 20, 40, 60...
  }


  // 偶数十台はそのまま
  return v;
}

function clampEnemyRateToLow(rate) {
  return Math.max(0, Math.min(9, rate));
}



function createEnemyGroup(mode = "normal") {
  // ====================
  // ボス戦モード（常に1体）
  // ====================
  if (mode === "boss") {

    // ボスは正規化のみ、クランプしない
    const bossRate = normalizeEnemyRate(adventureStats.Boss);

    const bossCandidates = Object.values(ENEMY_MASTER).filter(
      e => e.faction === "enemy" && e.rate === bossRate
    );

    if (bossCandidates.length === 0) return [];

    const boss =
      bossCandidates[Math.floor(Math.random() * bossCandidates.length)];

    const unit = createUnit(boss, "boss", "main");
    unit.isBoss = true;

    return [unit];
  }

  // ====================
  // 通常戦闘モード
  // ====================
  const groupType = pickGroupType();
  const group = [];

  // 雑魚は 0–9 に畳む
  const enemyRate = clampEnemyRateToLow(
    normalizeEnemyRate(adventureStats.Enemy)
  );
  const subRate = clampEnemyRateToLow(
    normalizeEnemyRate(adventureStats.Sub)
  );

  // ---------- メイン ----------
  const mainCandidates = Object.values(ENEMY_MASTER).filter(
    e => e.faction === "enemy" && e.rate === enemyRate
  );
  for (let i = 0; i < groupType.main; i++) {
    const enemy = mainCandidates[i % mainCandidates.length];
    if (enemy) group.push(createUnit(enemy, "enemy", "main"));
  }

  // ---------- サブ ----------
  const subCandidates = Object.values(ENEMY_MASTER).filter(
    e => e.faction === "enemy" && e.rate === subRate
  );
  for (let i = 0; i < groupType.sub; i++) {
    const enemy = subCandidates[i % subCandidates.length];
    if (enemy) group.push(createUnit(enemy, "enemy", "sub"));
  }

  return group;
}




function getPlayerUnits() {
  const units = [
    createUnit({
      name: adventurePlayer.name,
      hp: adventurePlayer.battle.hp,
      mhp: adventurePlayer.battle.mhp,
      mp: adventurePlayer.battle.mp,
      mmp: adventurePlayer.battle.mmp,
      atk: adventurePlayer.battle.atk,
      def: adventurePlayer.battle.def,
      dex: adventurePlayer.battle.dex,
      agi: adventurePlayer.battle.agi,
      mag: adventurePlayer.battle.mag,
      skillSlot: adventurePlayer.skillSlot,
      exp: 0,
      side: "player",
      AI: structuredClone(adventurePlayer.AI)  // ←安全コピー
    }, "player", adventurePlayer)
  ];

  console.log("=== プレイヤーユニット生成 ===");
  console.log(JSON.stringify(units[0], null, 2));

  return units;
}



const ALLY_BASE_1 = ENEMY_MASTER.COMPANION;

function createAllyGroup() {
  const group = [];
  const count = 1; // 今回は1体でいい

  for (let i = 0; i < count; i++) {
    group.push(createUnit(ALLY_BASE_1, "ally"));
  }

  return group;
}









let treasureWeaponLock = false;


function resolveTreasureChest() {

  if (treasureWeaponLock) return;

  const roll = Math.random();

  // 70%：お金
  if (roll < 0.1) {
    const depth = Math.max(1, adventureState.depthNow);
    const baseGold = ((10 + adventureStats.Level) * depth) * adventureStats.Reward;

    const variance = 0.75 + Math.random() * 0.5;
    const gold = Math.floor(baseGold * variance);

    player.gold += gold;
    pushLog(`${gold} ゴールドを手に入れた！`);
    return;
  }

  // 30%：装備
  const weapon = generateTreasureWeapon();
  treasureWeaponLock = true;
  openTreasureWeaponUI(weapon);
}



function generateTreasureWeapon() {

  const keys = Object.keys(weapons);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const base = weapons[key];

  const weapon = structuredClone(base);

  // --------------------
  // 正体隠蔽
  // --------------------
  weapon.realName = weapon.name;
  weapon.name = "？？？？";
  weapon.isIdentified = false;

  // --------------------
  // 能力変動
  // --------------------
const reward = Math.max(0, adventureStats.Reward || 0);
const maxBonus =
  Math.floor(adventureStats.Level / 2) + reward;


  let totalBonus = 0;

  function rollBonus() {
    return Math.floor(Math.random() * (maxBonus + 1));
  }

  const stats = ["atk", "def", "dex", "agi", "mag"];

  stats.forEach(stat => {
    const bonus = rollBonus();
    weapon[stat] = (weapon[stat] || 0) + bonus;
    totalBonus += bonus;
  });

  // HP / MP 系（常に同値）
  const hpBonus = rollBonus();
  weapon.hp  = (weapon.hp  || 0) + hpBonus;
  weapon.mhp = (weapon.mhp || 0) + hpBonus;
  totalBonus += hpBonus * 2;

  const mpBonus = rollBonus();
  weapon.mp  = (weapon.mp  || 0) + mpBonus;
  weapon.mmp = (weapon.mmp || 0) + mpBonus;
  totalBonus += mpBonus * 2;

  // --------------------
  // price / weight 反映
  // --------------------
  weapon.price = (weapon.price || 0) + totalBonus * 20;
  weapon.weight = (weapon.weight || 0) + Math.floor(totalBonus / 2);

  // --------------------
  // custom 変動
  // --------------------
  weapon.custom = (weapon.custom || 0)
    + Math.floor(Math.random() * 16) - 5; // -5 ～ +10

["atk","def","dex","agi","mag","hp","mhp","mp","mmp","custom","price","weight"]
  .forEach(key => {
    if (weapon[key] !== undefined) {
      weapon[key] = Math.max(0, weapon[key]);
    }
  });


  return weapon;
}



function openTreasureWeaponUI(weapon) {

  const ui = document.getElementById("TreasureUI");

  let previewHTML = "";

  if (!weapon.isIdentified) {
    const previews = getWeaponPreviewStats(weapon, 2);
    previewHTML = `
      <ul class="weapon-preview">
        ${previews.map(p => `<li>${p}</li>`).join("")}
        <li>……他にも何かありそうだ</li>
      </ul>
    `;
  }

  ui.innerHTML = `
    <div class="treasure-weapon">
      <p>宝箱の中から武器が現れた……</p>
      <p><strong>${weapon.name}</strong></p>

      ${previewHTML}

      <p>装備しますか？</p>
      <button id="treasureYes">はい</button>
      <button id="treasureNo">いいえ</button>
    </div>
  `;

  document.getElementById("returnBtn").disabled = true;
  document.getElementById("approachBtn").disabled = true;
  document.getElementById("retreatBtn").disabled = true;

  document.getElementById("treasureYes").onclick =
    () => equipTreasureWeapon(weapon);

  document.getElementById("treasureNo").onclick =
    () => storeTreasureWeapon(weapon);
}


function equipTreasureWeapon(weapon) {

  let logs = [];

  if (player.equippedWeapon) {
    player.weaponStorage.push(player.equippedWeapon);
    logs.push(`${player.equippedWeapon.name}を倉庫に移動`);
  }

  player.equippedWeapon = weapon;
  logs.push(`${weapon.name}を装備した`);

  document.getElementById("TreasureUI").innerHTML = "";

  renderStatus();
  adventurePlayer = createAdventurePlayer(player);

  pushLog(logs.join("、") + "。");
treasureWeaponLock = false;
  document.getElementById("returnBtn").disabled = false;
  document.getElementById("approachBtn").disabled = false;
  document.getElementById("retreatBtn").disabled = false;
}

function storeTreasureWeapon(weapon) {

  if (!weapon.isIdentified) {
    weapon.name = weapon.realName;
    weapon.isIdentified = true;
  }

  player.weaponStorage.push(weapon);

  document.getElementById("TreasureUI").innerHTML = "";

  pushLog(`？？？？を倉庫に転送した。`);

  treasureWeaponLock = false;
  document.getElementById("returnBtn").disabled = false;
  document.getElementById("approachBtn").disabled = false;
  document.getElementById("retreatBtn").disabled = false;
}

function getWeaponPreviewStats(weapon, count = 2) {

  const statLabels = {
    atk: "攻撃力",
    def: "防御力",
    dex: "器用さ",
    agi: "素早さ",
    mag: "魔力",
    hp:  "HP",
    mp:  "MP"
  };

  const candidates = [];

  Object.keys(statLabels).forEach(key => {
    if (weapon[key] && weapon[key] > 0) {
      candidates.push(`${statLabels[key]} +${weapon[key]}`);
    }
  });

  // シャッフル
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  return candidates.slice(0, count);
}


