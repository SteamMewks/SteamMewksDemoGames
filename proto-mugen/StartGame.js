//   -----セーブ-----


function autoSave() {
  localStorage.setItem('playerData', JSON.stringify(player));
}

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm("本当にデータをリセットしますか？")) {
    // ローカルストレージのデータ削除
    localStorage.removeItem('playerData');

    // player の中身も初期化（必要な初期値に合わせて変更）
    player = {
      hp: 100,
      mp: 50,
      gold: 0,
      items: [],
      // 他のプロパティも全部初期化
    };
    pushLog('データをリセットしました。画面を更新してください。');
    // 必要なら画面UIも更新
  }

});


//   -----プレイヤー生成-----

function createPlayer() {
  return {
    name: null,
    hp: 100, mhp: 100,
    mp: 50,  mmp: 50,
    atk: 10, def: 8, agi: 6, dex: 5, mag: 5,
    level: 1, sp: 10, gold: 500000000, exp:0,
    mode: "auto",
    item: {
      heal_s: 0, heal_m: 0, heal_l: 0,
      reverse: 0, life: 0
    },
    skill: ["attack"],
    // ★ 初期スキル装備
    skillSlot: (() => {
      const slots = Array(7).fill(null);
      slots[0] = "attack";
      return slots;
    })(),

    equippedWeapon: null,
    equippedArmor: null,
    equippedAccessory: null,

    weaponStorage: [],
    armorStorage: [],
    accessoryStorage: [],

    codeTimer: 0,
    phantasmCrystal: 0,
    phantasmFlag: {
      shopItems: [],    // 固定アイテムの名前配列
      shopExpire: 0,    // 有効期限（ms）
      shopActive: false // 出現中かどうかのフラグ
},



   AI:{attack:25, guard:25, support:25, jamming:25},
   grow:{HP:0, MP:0, atk:0, def:0, agi:0, mag:0},

  };
}


//   -----冒険用プレイヤー生成-----
function getEquipmentStats(equip) {
  if (!equip) {
    return { mhp:0, mmp:0, atk:0, def:0, dex:0, agi:0, mag:0, weight:0 };
  }

return {
  mhp:     equip.stats?.mhp     ?? equip.mhp     ?? 0,
  mmp:     equip.stats?.mmp     ?? equip.mmp     ?? 0,
  atk:    equip.stats?.atk    ?? equip.atk    ?? 0,
  def:    equip.stats?.def    ?? equip.def    ?? 0,
  mag:    equip.stats?.mag    ?? equip.mag    ?? 0,
  dex:    equip.stats?.dex    ?? equip.dex    ?? 0, // ← 追加
  weight: equip.stats?.weight ?? equip.weight ?? 0
};

}

// 重さは仮：アクセや防具に weight があれば使える
function getWeightPenalty(player) {
let total = 0;

if (player?.equippedWeapon?.weight) {
  total += player.equippedWeapon.weight;
}
if (player?.equippedArmor?.weight) {
  total += player.equippedArmor.weight;
}
  // アクセサリー

  return total;
}


function createAdventurePlayer(player) {

  const base = structuredClone(player);
  pushLog("=== 冒険用プレイヤー生成 ===");

  // 装備そのものの確認
  console.log("Weapon:", base.equippedWeapon);
  console.log("Armor:", base.equippedArmor);
  console.log("Accessory:", base.equippedAccessory);

  // ==========================
  // 装備ステータス取得
  // ==========================
  const weaponStats    = getEquipmentStats(base.equippedWeapon);
  const armorStats     = getEquipmentStats(base.equippedArmor);
  const accessoryStats = getEquipmentStats(base.equippedAccessory);

  // stats の確認（※必ず宣言後）
  console.log("Weapon Stats:", weaponStats);
  console.log("Armor Stats:", armorStats);
  console.log("Accessory Stats:", accessoryStats);

  // ==========================
  // 合計重量
  // ==========================
  let totalWeight =
    weaponStats.weight +
    armorStats.weight +
    accessoryStats.weight;

  // ==========================
  // 基本能力値に装備加算
  // ==========================
["mhp","mmp","atk","def","dex","mag"].forEach(stat => {
  if (base[stat] === undefined) return;

  const before = base[stat];
  const w  = weaponStats[stat] || 0;
  const a  = armorStats[stat] || 0;
  const ac = accessoryStats[stat] || 0;

  const add = w + a + ac;
  base[stat] += add;

  if (add) {
    pushLog(
      `装備反映: ${stat.toUpperCase()} ` +
      `${before} + ${w}(武器) + ${a}(防具) + ${ac}(装飾) → ${base[stat]}`
    );
  }
});

  // ==========================
  // 常時効果（アクセサリー個別）
  // ==========================
  const accessory = base.equippedAccessory;
  if (accessory?.type === "Auto" && accessory.effect) {
    Object.entries(accessory.effect).forEach(([stat, add]) => {
      if (base[stat] === undefined) return;
      base[stat] += add;
      pushLog(`${accessory.name} が光り輝いた！ ${stat.toUpperCase()} が上昇した。`);
    });
  }

  // ==========================
  // 戦闘用ステータス
  // ==========================
const w = totalWeight;

base.battle = {
  atk: Math.max(
    0,
    base.atk
      + Math.floor(base.dex / 2)
      + w
  ),

  def: Math.max(
    0,
    base.def
      + Math.floor(base.agi / 2)
      - Math.floor(w / 3)
  ),

  dex: Math.max(
    0,
    base.dex
      + Math.floor(base.agi / 3)
      - Math.floor(w / 2)
  ),

  agi: Math.max(
    0,
    base.agi
      + Math.floor(base.dex / 2)
      - w
  ),

mag: base.mag
   + Math.floor(base.mmp * 0.07)
   + Math.floor(base.dex / 4),

  hp:  base.hp,
  mhp: base.mhp ?? base.hp,
  mp:  base.mp,
  mmp: base.mmp ?? base.mp,
};



  // ==========================
  // Loreパッシブ補正
  // ==========================
applyLorePassives(base, base.skillSlot);

  return base;
}




function applyLorePassives(base, skillSlot) {
  if (!skillSlot || !base.battle) return;

  const battleTargets = ["atk","def","dex","agi","mag"];

  skillSlot.forEach(id => {
    const skill = SKILL_MASTER[id];
    if (!skill) return;
    if (skill.type !== "passive") return;
    if (skill.category?.effect !== "Lore") return;

    const target = skill.category.target;

    // =====================
    // オムニロア処理
    // =====================
    if (target === "all") {
      battleTargets.forEach(stat => {
        if (!(stat in base.battle)) return;
        const before = base.battle[stat];
        base.battle[stat] = Math.floor(before * skill.magnification);

        pushLog(
          `${skill.name} が全体へ作用。${stat.toUpperCase()} ${before} → ${base.battle[stat]}`
        );
      });
      return;
    }

    // =====================
    // 通常ロア処理
    // =====================
    if (!target || !(target in base.battle)) return;

    const before = base.battle[target];
    base.battle[target] = Math.floor(before * skill.magnification);

    pushLog(`${skill.name} が発動。${target.toUpperCase()} ${before} → ${base.battle[target]}`);
  });
}





//   -----ロード・新規作成-----

const gameUI = document.getElementById('gameUI');
window.addEventListener('DOMContentLoaded', () => {
  const modeBtn = document.getElementById("modeBtn");
  if (modeBtn) {
    modeBtn.onclick = () => {
      player.mode = player.mode === "auto" ? "manual" : "auto";
      updateModeUI();
      autoSave();
    };
  }
  const creationDiv = document.getElementById('characterCreation');
  const saved = localStorage.getItem('playerData');
  if (saved) {
    // セーブデータがあればロードしてゲーム開始
    player = Object.assign(createPlayer(), JSON.parse(saved));
    pushLog('セーブデータをロードした。');
    creationDiv.style.display = 'none';
    gameUI.style.display = 'block'; // ゲーム画面表示
    startGame();
  } else {
    // セーブなし → キャラメイク画面を表示
    creationDiv.style.display = 'block';
    gameUI.style.display = 'none';
    const TOTAL_HPMP = 200;
    const TOTAL_STAT_POINTS = 32;
    const MIN_HP = 50;
    const MIN_MP = 30;

    const hpInput = document.getElementById('hpInput');
    const mpInput = document.getElementById('mpInput');
    const hpmpSum = document.getElementById('hpmpSum');
    const statInputs = document.querySelectorAll('.statInput');
    const statPointsDisplay = document.getElementById('statPoints');


    // 初期値設定
    hpInput.value = 140;
    mpInput.value = 60;
    hpmpSum.textContent = `200 / ${TOTAL_HPMP}`;
    statPointsDisplay.textContent = 0;


    // HP/MP合計表示更新

    function updateHpMpSum() {
      let hp = parseInt(hpInput.value) || 0;
      let mp = parseInt(mpInput.value) || 0;
      hpmpSum.textContent = `${hp + mp} / ${TOTAL_HPMP}`;
    }

    hpInput.oninput = updateHpMpSum;
    mpInput.oninput = updateHpMpSum;

    // ステータス割り振り表示更新
function updateStatPoints() {
  let used = 0;
  statInputs.forEach(input => {
    let val = parseInt(input.value) || 1;
    used += val;
  });
  let remaining = TOTAL_STAT_POINTS - used;
  statPointsDisplay.textContent = remaining;
}


    statInputs.forEach(input => input.oninput = updateStatPoints);

    // 作成ボタン
    document.getElementById('createPlayerBtn').onclick = () => {
      const name = document.getElementById('playerName').value.trim();

      // 名前チェック
      if (name.length < 1 || name.length > 6) {
        alert("名前は1文字以上6文字以下にしてください。");
        return;
      }

      let hp = parseInt(hpInput.value) || 0;
      let mp = parseInt(mpInput.value) || 0;

      // HP/MP最低値チェック
      if (hp < MIN_HP || mp < MIN_MP) {
        alert(`HPは${MIN_HP}以上、MPは${MIN_MP}以上にしてください。`);
        return;
      }

      // HP+MP合計調整
      if (hp + mp > TOTAL_HPMP) {
        mp = TOTAL_HPMP - hp;
        if (mp < MIN_MP) {
          mp = MIN_MP;
          hp = TOTAL_HPMP - mp;
        }
      }

      // ステータスチェック
let atk = parseInt(document.getElementById('atkInput').value) || 1;
let def = parseInt(document.getElementById('defInput').value) || 1;
let dex = parseInt(document.getElementById('dexInput').value) || 1;
let agi = parseInt(document.getElementById('agiInput').value) || 1;
let mag = parseInt(document.getElementById('magInput').value) || 1;


let usedPoints = atk + def + agi + mag + dex;

if (usedPoints !== TOTAL_STAT_POINTS) {
  alert(`ステータスポイントは全て使い切ってください。残りポイント: ${TOTAL_STAT_POINTS - usedPoints}`);
  return;
}


      // プレイヤー作成
      player = createPlayer();
      player.name = name;
      player.hp = player.mhp = hp;
      player.mp = player.mmp = mp;
player.atk = atk;
player.def = def;
player.agi = agi;
player.mag = mag;
player.dex = dex;


      // キャラメイク画面を非表示、ゲーム画面表示
      creationDiv.style.display = 'none';
      gameUI.style.display = 'block';

      // ゲーム開始
      startGame();
    };
  }

  // 共通：ゲーム開始時の処理
  function startGame() {
    setAdventureUI(false);
    normalizeEquipment();
    renderStatus();
    updateModeUI();
  }

});

function normalizeEquipment() {
  if (player.equippedWeapon?.name?.name) {
    player.equippedWeapon = {
      id: player.equippedWeapon.id,
      ...player.equippedWeapon.name
    };
  }
  if (player.equippedArmor?.name?.name) {
    player.equippedArmor = {
      id: player.equippedArmor.id,
      ...player.equippedArmor.name
    };
  }
}
