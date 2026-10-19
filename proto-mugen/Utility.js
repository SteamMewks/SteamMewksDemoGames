let inAdventure = false;
let currentLocation = null;

// ====================
// UI描画（UIステータスの更新）
// ====================

function renderStatus() {
  updateInnButton();

  const status = document.getElementById("status");

  if (!status) return;

  const weaponName = player.equippedWeapon ? player.equippedWeapon.name : "なし";
  const armorName = player.equippedArmor ? player.equippedArmor.name : "なし";
  const accessoryName = player.equippedAccessory ? player.equippedAccessory.name : "なし";

  const itemStatus = Object.keys(ITEM_ICON_MAP)
    .map(key => `${ITEM_ICON_MAP[key]}${player.item[key].toLocaleString()}`)
    .join(" ");

  status.innerHTML = `
    <p>【${player.name}】Lv: ${player.level}( ${player.exp} / 1000 )</p>
</p>HP: ${player.hp.toLocaleString()} / ${player.mhp.toLocaleString()} MP: ${player.mp.toLocaleString()} / ${player.mmp.toLocaleString()}</p>
    <p>Atk: ${player.atk.toLocaleString()} / Def: ${player.def.toLocaleString()} / Dex: ${player.dex.toLocaleString()} / Agi: ${player.agi.toLocaleString()} / Mag: ${player.mag.toLocaleString()}</p>
    <p>所持金: ${player.gold.toLocaleString()}G / 幻水晶: ${player.phantasmCrystal.toLocaleString()} ⚛ / SP: ${player.sp}</p>
    <p>所持品: ${itemStatus}</p>
    <p>装備中 武器：${weaponName} / 防具：${armorName} / 装飾：${accessoryName}</p>
  `;
}

const ITEM_ICON_MAP = {
  heal_s: "🍬", // 冒険者ラムネ
  heal_m: "🍪", // 滋養クッキー
  heal_l: "💊", // 霊糖カプセル
  reverse: "🪽", // 帰還の羽
  life: "🧪"    // ポーション
};

// ====================
// UI制御(冒険の始まりと終わりで必ず呼ぶこと)
// ====================

function setAdventureUI(isAdventure) {
  ["runeSelect", "word1Select", "word2Select", "word3Select"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = isAdventure;
  });

  const departBtn = document.getElementById('departBtn');
  if (departBtn) departBtn.disabled = isAdventure;

  const buttons = document.getElementById('buttons');
  if (buttons) buttons.style.display = isAdventure ? 'none' : 'block';

  const adventureButtons = document.getElementById('adventureButtons');
  if (adventureButtons) adventureButtons.style.display = isAdventure ? 'block' : 'none';

  // ステータス切り替え
  const status = document.getElementById('status');

  const adventureStatus = document.getElementById('adventureStatus');

  if (status) status.style.display = isAdventure ? 'none' : 'block';
  if (adventureStatus) adventureStatus.style.display = isAdventure ? 'block' : 'none';

  // ここで描画も同時に呼ぶと確実
  if (isAdventure) {
    renderAdventureStatus(adventurePlayer);
  } else {
    renderStatus();
  }
}

// ====================
// 武器への接頭語の追加
// ====================

function applyWeaponAbility(weapon, abilityKey) {
  const ability = weaponsAbility[abilityKey];
  if (!ability) return weapon;

  // 名前補正
  weapon.name = `${ability.name}${weapon.name}`;

  // 価格補正（倍率）
  if (typeof ability.price === "number") {
    weapon.price = Math.floor(weapon.price * ability.price);
  }

  // ステータス倍率補正
  const stats = ["atk","def","dex","agi","mag","mhp","mmp","hp","mp"];
  for (const stat of stats) {

    // --- all補正 ---
    if (typeof ability.all === "number") {
      if (typeof weapon[stat] !== "number") {
        weapon[stat] = 5 + player.level;
      }
      weapon[stat] = Math.floor(weapon[stat] * ability.all);
    }

    // --- 個別補正 ---
    if (typeof ability[stat] === "number") {
      if (typeof weapon[stat] !== "number") {
        weapon[stat] = 3 + player.level;
      }
      weapon[stat] = Math.floor(weapon[stat] * ability[stat]);
    }
  }

  // 加算系（customなど）
  const additiveStats = ["custom"];
  for (const stat of additiveStats) {
    if (typeof ability[stat] === "number") {
      weapon[stat] = (weapon[stat] || 0) + ability[stat];
    }
  }

  // スキル付与
  if (Array.isArray(ability.skills)) {
    weapon.skills = [...(weapon.skills || []), ...ability.skills];
  }

  // ability情報を記録
  weapon.ability = abilityKey;

  return weapon;
}







// ====================
// ログ表示制御
// 追加時はCSSも併せて追加。
// ====================

// 文脈による優先クラス判定
const contextPriorityMap = [
  { keyword: 'スキル攻撃', className: 'num-skill' },
  { keyword: '通常攻撃', className: 'num-damage' },
];

// 数値＋単位によるフォールバック着色
const unitMap = [
  { keyword: 'ダメージ', className: 'num-damage' },
  { keyword: 'G', className: 'num-gold' },
  { keyword: 'ゴールド', className: 'num-gold' },
  { keyword: '購入', className: 'num-purchase' },
  { keyword: '売却', className: 'num-purchase' },
];

// ログの直列実行キュー
let logQueue = Promise.resolve();

// ====================
// ログ追加（タイプライター表示）
// ====================
function pushLog(text, speed = 20) {
  logQueue = logQueue.then(async () => {
    const log = document.getElementById('log');
    const span = document.createElement('span');
    log.prepend(span);

    // HTMLを除去したプレーンテキストで表示
    const temp = document.createElement('div');
    temp.innerHTML = text;
    const plain = temp.textContent || '';

    for (let i = 0; i < plain.length; i++) {
      span.appendChild(document.createTextNode(plain[i]));
      await new Promise(r => setTimeout(r, speed));
    }

    // ====================
    // 数値カラーリング判定
    // ====================

    let appliedClass = null;

    // ① 文脈優先（攻撃種別など）
    for (const ctx of contextPriorityMap) {
      if (text.includes(ctx.keyword)) {
        appliedClass = ctx.className;
        break;
      }
    }

    // ② 単位フォールバック（G / ダメージなど）
    let coloredText = text;
    for (const unit of unitMap) {
      const cls = appliedClass || unit.className;
      const regex = new RegExp(`(\\d+)(?=[^\\d]*${unit.keyword})`, 'g');
      coloredText = coloredText.replace(
        regex,
        `<span class="${cls}">$1</span>`
      );
    }

    span.innerHTML = coloredText;
    span.appendChild(document.createElement('br'));
    log.scrollTop = 0;
  });
}






