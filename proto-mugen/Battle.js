function getLevelMultiplier(level) {
  // Lv1 = 1.0, Lv2 = 1.1, Lv3 = 1.2 ...
  return 1 + (Math.max(level, 1) - 1) * 0.2;
}

function shouldScaleBySide(side) {
  return side === "enemy" || side === "boss";
}

function rollEnemyLevel(baseLevel) {
  const r = Math.random();

  // 70% はそのまま
  if (r < 0.7) {
    return baseLevel;
  }

  // 残り30%で -2 ～ +3
  const delta = Math.floor(Math.random() * 6) - 2; // -2,-1,0,1,2,3
  return Math.max(1, baseLevel + delta);
}


function createUnit(base, side, source = null) {


console.log(
  "[DEBUG] side:", side,
);

  const baseLevel = adventureStats?.Level ?? 1;
  const risk      = adventureStats?.Risk   ?? 1;
  const reward    = adventureStats?.Reward ?? 1;

  const scaleTarget = shouldScaleBySide(side);

  const STAT_MIN_RATE_BY_SIDE = {
    player: 0.65,
    ally:   0.65,
    enemy:  0.4,
    boss:   0.85
  };

  function getStatMinRate(side) {
    return STAT_MIN_RATE_BY_SIDE[side] ?? 0.5;
  }

  // ====================
  // 実際に使うレベル
  // ====================
  let effectiveLevel;
if (side === "player") {
  effectiveLevel = player.level;

} else if (side === "ally") {
  const levelOffset = base.level ?? 0;
  effectiveLevel = player.level + levelOffset;

} else if (side === "boss") {
  // ボスは常にスケーリング＋固定補正
  effectiveLevel = rollEnemyLevel(baseLevel) + 5;

} else if (scaleTarget) {
  effectiveLevel = rollEnemyLevel(baseLevel);

} else {
  effectiveLevel = baseLevel;
}


// ====================
// 二つ名付与判定（5％、敵のみ）
// ====================
let twoTitleApplied = false;
let twoTitleData = null;

if (side === "enemy") { // 敵だけ対象
  const aliasList = Object.values(enemyAlias); // 二つ名リスト
  if (aliasList.length > 0 && Math.random() < 0.03) {
    twoTitleApplied = true;
    // リストからランダムで1つ選ぶ
    twoTitleData = aliasList[Math.floor(Math.random() * aliasList.length)];

    // レベル加算
    effectiveLevel += twoTitleData.lv ?? 0;
  }
}

// ====================
// 表示名生成（UI用）
// ====================
let displayName = `${base.name} Lv${effectiveLevel}`;
if (twoTitleApplied) displayName = `${twoTitleData.name}${displayName}`;
const logName = base.name;

// ====================
// 能力値計算（side別・二つ名個別倍率対応）
// ====================
let atk, def, agi, dex, mag, maxHp, maxMp, hp, mp;
const levelBonus = Math.floor((base.level ?? 1) * 0.5);

// 二つ名倍率（存在しない場合は1倍）
const twoTitleMultiplier = {
  atk: twoTitleApplied ? (twoTitleData.atk ?? 1) : 1,
  def: twoTitleApplied ? (twoTitleData.def ?? 1) : 1,
  agi: twoTitleApplied ? (twoTitleData.agi ?? 1) : 1,
  dex: twoTitleApplied ? (twoTitleData.dex ?? 1) : 1,
  mag: twoTitleApplied ? (twoTitleData.mag ?? 1) : 1,
  hp:  twoTitleApplied ? (twoTitleData.hp ?? 1)  : 1,
  mp:  twoTitleApplied ? (twoTitleData.mp ?? 1)  : 1,
};

if (side === "ally") {
  const lvRate = 1 + 0.2 * (effectiveLevel - 1);

  // 基礎値にレベル補正と二つ名倍率を掛ける
  let atk0 = (base.atk ?? 1) * lvRate * twoTitleMultiplier.atk;
  let def0 = (base.def ?? 1) * lvRate * twoTitleMultiplier.def;
  let agi0 = (base.agi ?? 1) * lvRate * twoTitleMultiplier.agi;
  let dex0 = (base.dex ?? 1) * lvRate * twoTitleMultiplier.dex;
  let mag0 = (base.mag ?? 1) * lvRate * twoTitleMultiplier.mag;

  // 相互補正・整数化
  atk = Math.max(0, Math.floor(atk0 + dex0 / 3 + levelBonus));
  def = Math.max(0, Math.floor(def0 + agi0 / 3 + levelBonus));
  agi = Math.max(0, Math.floor(agi0 + dex0 / 2 + levelBonus));
  dex = Math.max(0, Math.floor(dex0 + agi0 / 3 + levelBonus));
  mag = Math.max(0, Math.floor(mag0 + (base.mmp ?? 0) * 0.1 + levelBonus));

  maxHp = Math.floor(((base.hp ?? adventurePlayer.hp ?? 100) * lvRate * twoTitleMultiplier.hp) * 2);
  maxMp = Math.floor(((base.mp ?? adventurePlayer.mp ?? 50) * lvRate * twoTitleMultiplier.mp) * 2);
  hp = maxHp;
  mp = maxMp;

} else {
  const levelMul = scaleTarget ? getLevelMultiplier(effectiveLevel) : 1;
  const riskMul  = scaleTarget ? risk : 1;
  const bossMul = side === "boss" ? 1.2 : 1;


  // 基礎値にレベル・リスク・二つ名倍率を掛ける
  let atk0 = (base.atk ?? 0) * levelMul * riskMul * bossMul * twoTitleMultiplier.atk;
  let def0 = (base.def ?? 0) * levelMul * riskMul * bossMul * twoTitleMultiplier.def;
  let agi0 = (base.agi ?? 0) * levelMul * riskMul * bossMul * twoTitleMultiplier.agi;
  let dex0 = (base.dex ?? 0) * levelMul * riskMul * bossMul * twoTitleMultiplier.dex;
  let mag0 = (base.mag ?? 0) * levelMul * riskMul * bossMul * twoTitleMultiplier.mag;


  // 相互補正・整数化
  atk = Math.max(0, Math.floor(atk0 + dex0 / 3 + levelBonus));
  def = Math.max(0, Math.floor(def0 + agi0 / 3 + levelBonus));
  agi = Math.max(0, Math.floor(agi0 + dex0 / 2 + levelBonus));
  dex = Math.max(0, Math.floor(dex0 + agi0 / 3 + levelBonus));
  mag = Math.max(0, Math.floor(mag0 + (base.mmp ?? 0) * 0.1 + levelBonus));

  if (side === "player") {
    maxHp = base.mhp ?? 100;
    maxMp = base.mmp ?? 50;
    hp = base.hp ?? maxHp;
    mp = base.mp ?? maxMp;
} else {

  const bossHpMul = side === "boss" ? 1.5 : 1;

  maxHp = base.mhp ?? Math.floor(
    (base.hp ?? 1)
    * levelMul
    * riskMul
    * bossHpMul
    * twoTitleMultiplier.hp
  );

  maxMp = base.mmp ?? Math.floor(
    (base.mp ?? 0)
    * levelMul
    * riskMul
    * (side === "boss" ? 1.3 : 1)
    * twoTitleMultiplier.mp
  );

  hp = maxHp;
  mp = maxMp;
}

}

const minRate = getStatMinRate(side);

// ====================
// 経験値計算（レベル差補正付き）
// ====================
let exp = 0;

if (side === "enemy" || side === "boss") {
  const baseExp = base.exp ?? 0;
  const playerLevel = adventurePlayer?.lv ?? 1;
  const levelDiff = effectiveLevel - playerLevel;

  if (levelDiff >= 2) {
    exp = Math.floor(baseExp * 1.1); // 10％増
  } else if (levelDiff <= -2) {
    exp = Math.floor(baseExp * 0.9); // 10％減
  } else {
    exp = baseExp;
  }

  // 最低1は保証
  exp = Math.max(1, exp);
}

  // ====================
  // スキル追加
  // ====================
  let skillSlot = [...(base.skillSlot ?? [])];
  if (twoTitleApplied && twoTitleData.plusSkill) {
    skillSlot.push(...twoTitleData.plusSkill);
  }


  return {
    id: crypto.randomUUID(),
    name: displayName,   // UI表示用
    logName,             // ログ用
    baseName: base.name,
    side,
    source,

    hp,
    maxHp,
    mp,
    maxMp,

    atk,
    atkMax: Math.floor(atk * 2.5),
    atkMin: Math.floor(atk * minRate),

    def,
    defMax: Math.floor(def * 2.5),
    defMin: Math.floor(def * minRate),

    dex,
    dexMax: Math.floor(agi * 2.5),
    dexMin: Math.floor(agi * minRate),

    agi,
    agiMax: Math.floor(agi * 2.5),
    agiMin: Math.floor(agi * minRate),

    mag,
    magMax: Math.floor(mag * 2.5),
    magMin: Math.floor(mag * minRate),

    skillSlot,
    exp,


    resist: base.resist ?? null,
    Enchant: false,
    EnchantCount: 0,
    EnchantMag: 0,
    Guard: false,
    GuardCount: 0,
    alive: true,

    effectiveLevel
  };
}

let battleState = null;

function initBattle(units) {
  battleState = {
    units,          // 全ユニット（player / ally / enemy）
    turnOrder: [],
    turnIndex: 0,
    phase: "turn"   // "turn" | "command" | "end"
  };

  prepareTurnOrder();
  pushLog("戦闘が始まった！");

  // ★ここでグリッドを描画
  renderBattleGrid();

  nextTurn();
}


function prepareTurnOrder() {
  battleState.turnOrder = battleState.units
    .filter(u => u.alive)
    .sort((a, b) => b.agi - a.agi);

  battleState.turnIndex = 0;
}



function nextTurn() {
  const skills = document.getElementById("skillButtons");
  if (skills) skills.innerHTML = "";

  if (checkBattleEnd()) return;

  if (battleState.turnIndex >= battleState.turnOrder.length) {
    prepareTurnOrder();
    renderBattleGrid();
  }

  const actor = battleState.turnOrder[battleState.turnIndex++];

  if (!actor.alive) {
    nextTurn();
    return;
  }

  // ====================
  // 状態異常処理
  // ====================
  const { canAct, forceAI } = processEnchantAtTurnStart(actor);

  renderBattleGrid();

  if (!canAct) {
    setTimeout(nextTurn, 300);
    return;
  }

  // ====================
  // ★ 手番開始時の回復アクセ処理 ★
  // ====================
  const acc = actor.source?.equippedAccessory;
  if (acc && acc.type === "Setup" && acc.effect) {
    let healed = false;
    if (acc.effect.hp) {
      const prevHp = actor.hp;
      actor.hp = Math.min(actor.hp + acc.effect.hp, actor.maxHp || 1);
      if (actor.hp > prevHp) healed = true;
    }
    if (acc.effect.mp) {
      const prevMp = actor.mp;
      actor.mp = Math.min(actor.mp + acc.effect.mp, actor.maxMp || 0);
      if (actor.mp > prevMp) healed = true;
    }
  }

  renderBattleGrid();

  if (!canAct) {
    setTimeout(nextTurn, 300);
    return;
  }


  // ====================
  // 行動フェーズ
  // ====================
  if (actor.side === "player" && !forceAI) {
    if (player.mode === "auto") {
      executeAIRandom(actor);
      setTimeout(nextTurn, 300);
    } else {
      startPlayerTurn(actor);
    }
  } else {
    // 敵・混乱中プレイヤー・アライ
    executeAIRandom(actor);
    setTimeout(nextTurn, 300);
  }
}





function processEnchantAtTurnStart(unit) {

  let canAct  = true;
  let forceAI = false;

  // ====================
  // Enchant 効果処理
  // ====================
  if (unit.Enchant) {
    switch (unit.Enchant) {

      case "毒": {
        const maxHp = unit.mhp ?? unit.hpMax ?? unit.hp;
        const dmg = Math.max(1, Math.floor(maxHp * unit.EnchantMag));
        unit.hp = Math.max(1, unit.hp - dmg);
        pushLog(`${unit.baseName} を瘴気が蝕む！ ${dmg} のダメージを受けた！`);
        break;
      }

      case "回復": {
        const maxHp = unit.mhp ?? unit.hpMax ?? unit.hp;
        const heal = Math.max(1, Math.floor(maxHp * unit.EnchantMag));
        unit.hp = Math.min(unit.maxHp ?? unit.hp, unit.hp + heal);
        pushLog(`${unit.baseName} を癒し力が包み込む！ ${heal} 回復した！`);
        break;
      }

      case "呪い": {
        const maxMp = unit.mmp ?? unit.mpMax ?? unit.mp;
        const loss = Math.max(1, Math.floor(maxMp * unit.EnchantMag));
        unit.mp = Math.max(0, unit.mp - loss);
        pushLog(`${unit.baseName} を瘴気が蝕む！ MP を ${loss} 失った！`);
        break;
      }

      case "麻痺": {
        if (Math.random() * 100 < 25) {
          canAct = false;
          pushLog(`${unit.baseName} は痺れて動けない！`);
        }
        break;
      }

      case "混乱": {
        forceAI = true;
        pushLog(`${unit.baseName} は混乱している…`);
        break;
      }
    }
  }

  // ====================
  // Enchant カウント減少
  // ====================
  if (unit.Enchant) {
    unit.EnchantCount--;
    if (unit.EnchantCount <= 0) {
      const s = unit.Enchant;
      unit.Enchant = false;
      unit.EnchantCount = 0;
      unit.nchantMag = 0;
      pushLog(`${unit.baseName} の ${s} の効果が切れた！`);
    }
  }

  // ====================
  // Guard カウント減少（★独立）
  // ====================
  if (unit.Guard) {
    unit.GuardCount--;
    if (unit.GuardCount <= 0) {
      const s = unit.Guard;
      unit.Guard = false;
      unit.GuardCount = 0;
      pushLog(`${unit.baseName} の ${s} が解けた！`);
    }
  }

  return { canAct, forceAI };
}






function startPlayerTurn(actor) {
  pushLog(`${actor.baseName} の行動だ。Test`);
console.log(document.getElementById("skillButtons"));
console.log(actor.skillSlot);

  // スキルボタンを表示
  renderSkillButtons(actor.skillSlot);
}


function renderSkillButtons(skillSlot) {
  const container = document.getElementById("skillButtons");
  container.innerHTML = "";

  const actor = battleState.turnOrder[battleState.turnIndex - 1];

  // 表示候補スキル
  const allSkills = [...skillSlot];

  // 武器スキルを追加（存在すれば）
if (player.equippedWeapon?.skills?.length) {
  allSkills.push(...player.equippedWeapon.skills);
}


  let usableCount = 0; // ← 押せるスキル数を数える

  allSkills.forEach(id => {
    const skill = SKILL_MASTER[id];
    if (!skill) return;
    if (skill.type === "passive") return;

    const btn = document.createElement("button");

    let label = skill.name;
    if (skill.mp > 0) label += ` (${skill.mp})`;
    btn.textContent = label;

    const disabled = skill.mp > actor.mp;
    btn.disabled = disabled;

    if (!disabled) usableCount++; // ← 使えるならカウント

    btn.addEventListener("click", () => {
      playerUseSkill(skill);
    });

    container.appendChild(btn);
  });

  // === ここから「わるあがき」判定 ===
  if (usableCount === 0) {
    const skill = SKILL_MASTER.lastattack;

    const btn = document.createElement("button");
    btn.textContent = skill.name;
    btn.addEventListener("click", () => {
      playerUseSkill(skill);
    });

    container.appendChild(btn);
  }
}






function endPlayerTurn() {
  // 次のターンへ
  nextTurn();
}


//   -----AIスキル決定-----


function executeAIRandom(actor) {
  const usableSkills = actor.skillSlot
    .map(id => SKILL_MASTER[id])
    .filter(s =>
      s &&
      s.type !== "passive" &&
      actor.mp >= s.mp
    );

  const skill =
    usableSkills.length > 0
      ? usableSkills[Math.floor(Math.random() * usableSkills.length)]
      : SKILL_MASTER.attack;

  executeSkill(actor, skill, battleState.units);
}


// ====================
// AI対象選択
// ====================
function selectTargets(user, skill, units) {
  if (!user || !units) return [];

  const t = skill.category?.target;
  const effect = skill.category?.effect;
  if (!t || !effect) return [];

  // 攻撃／支援 判定
  const isAttack =
    effect === "physical" ||
    effect === "magical" ||
    effect === "hybrid" ||
    effect === "debuff" ||
    effect === "EnchantDebuff";

  const isSupport =
    effect === "heal" ||
    effect === "buff" ||
    effect === "Guard" ||
    effect === "EnchantBuff";

  // 陣営ごとに分ける
  let enemies = [];
  let allies  = [];

  if (user.side === "player" || user.side === "ally") {
    enemies = units.filter(u => u.alive && (u.side === "enemy" || u.side === "boss"));
    allies  = units.filter(u => u.alive && (u.side === "player" || u.side === "ally"));
  } else if (user.side === "enemy" || user.side === "boss") {
    enemies = units.filter(u => u.alive && (u.side === "player" || u.side === "ally"));
    allies  = units.filter(u => u.alive && (u.side === "enemy" || u.side === "boss"));
  }

  switch (t) {
    case "self":
      return [user];

    case "enemy":
      return isAttack && enemies.length
        ? [enemies[Math.floor(Math.random() * enemies.length)]]
        : [];

    case "enemys":
      return isAttack ? enemies : [];

    case "ally":
      return isSupport && allies.length
        ? [allies[Math.floor(Math.random() * allies.length)]]
        : [];

    case "allys":
      return isSupport ? allies : [];

    default:
      return [];
  }
}

// ====================
// AIスキル実行
// ====================

function executeSkill(user, skill, allUnits) {
  if (!user) {
    pushLog("スキルを使うユニットが存在しません！");
    return;
  }

  // MPチェック
  if (user.mp < skill.mp) {
    pushLog("MPが足りない！");
    return;
  }

  user.mp -= skill.mp;
  pushLog(`${user.baseName} は ${skill.message} `);

  // 対象決定
  const targets = selectTargets(user, skill, allUnits);
  if (!targets.length) return;

  // 効果処理
  targets.forEach(target => {
    if (target) applySkillEffect(user, target, skill);
  });
}






function applySkillEffect(user, target, skill) {
  const { effect } = skill.category;

// ====================
// 状態付与（EnchantBuff / EnchantDebuff）
// ====================
if (effect === "EnchantBuff" || effect === "EnchantDebuff") {

    if (user.Enchant === "祈封") {
      pushLog(
        `しかし、${user.baseName}は 声を失っている！`
      );
      return;
    }

  const EnchantName    = skill.ability;        // 例: "毒", "麻痺", "guard"
  const count          = skill.chance;         // 付与ターン数
  const magnification  = skill.magnification;  // 効果値
  const effectType     = effect;               // EnchantBuff / EnchantDebuff

  // ====================
  // レジスト判定（Debuffのみ）
  // ====================
  if (effectType === "EnchantDebuff" && target.resist) {
    const resistList = Array.isArray(target.resist)
      ? target.resist
      : [target.resist];

    if (resistList.includes(EnchantName)) {
      pushLog(
        `どこからか声が聞こえる。「この者は ${EnchantName}の神の 守護がある……」`
      );
      return;
    }
  }

  // ====================
  // エンデュランスによる付与ターン延長
  // ====================
  let extraTurn = 0;

  if (user.skillSlot?.includes("endurance")) {
    const enduranceSkill = SKILL_MASTER["endurance"];
    if (enduranceSkill?.magnification) {
      extraTurn = enduranceSkill.magnification;
    }
  }

  // ====================
  // 状態上書き／更新処理
  // ====================
  if (target.Enchant === EnchantName) {
    // 同じ状態ならターン数更新（長い方を採用）
    target.EnchantCount = Math.max(
      target.EnchantCount,
      count + extraTurn
    );

    pushLog(
      `${target.baseName} の ${EnchantName} の加護が延長された！`
    );
  } else {
    // 別状態 or 状態なし → 上書き
    target.Enchant      = EnchantName;
    target.EnchantCount = count + extraTurn;
    target.EnchantMag   = magnification;

    pushLog(
      `${target.baseName} は ${EnchantName} の効果を受けた！`
    );
  }

  renderBattleGrid();
  return;
}

// ====================
// 防御付与 Guard
// ====================
if (effect === "Guard") {

    if (user.Enchant === "守封") {
      pushLog(
        `しかし、${user.baseName}は 闘志が高まりすぎている！`
      );
      return;
    }

  const GuardName = skill.ability;        // 例: "guard"
  const count      = skill.magnification;  // 付与ターン数

  target.Guard = GuardName;
  target.GuardCount = Math.max(target.GuardCount || 0, count);

  renderBattleGrid();
  return;
}

  // ====================
  // 回復（最大HPの％回復）
  // abilityは使わない
  // ====================
  if (effect === "heal") {
    const healValue = Math.floor(target.maxHp * skill.magnification);
    const actualHeal = Math.max(1, healValue);

    target.hp = Math.min(target.maxHp, target.hp + actualHeal);

    pushLog(`${target.baseName} のHPが ${actualHeal} 回復した！`);
    renderBattleGrid();
    return;
  }

// ====================
// バフ / デバフ（能力値変動）
// Max / Min を超えない
// ====================
if (effect === "buff" || effect === "debuff") {
  const stat = skill.ability; // "atk" / "def" / "agi" / "mag"
  const maxKey = stat + "Max";
  const minKey = stat + "Min";

  if (
    target[stat] !== undefined &&
    target[maxKey] !== undefined &&
    target[minKey] !== undefined
  ) {

    // ====================
    // デバフ耐性チェック
    // ====================
    if (effect === "debuff" && target.resist) {
      const resistList = Array.isArray(target.resist)
        ? target.resist
        : [target.resist];

      // 全デバフ耐性 or 能力別耐性
      if (
        resistList.includes("debuff") ||
        resistList.includes(stat + "Down")
      ) {
        pushLog(`${target.baseName} には効果がなかった！`);
        return;
      }
    }

    // ====================
    // デバフ成功判定
    // ====================
    if (effect === "debuff") {
      const baseRate = 50;

      const userLv   = user.effectiveLevel ?? 1;
      const targetLv = target.effectiveLevel ?? 1;

      const levelDiff = userLv - targetLv;
      let successRate = baseRate + levelDiff;

      // 上下限クランプ
      successRate = Math.min(95, Math.max(5, successRate));

      const roll = Math.random() * 100;

      if (roll >= successRate) {
        pushLog(`${target.baseName} には効かなかった！`);
        return;
      }
    }

    // ====================
    // 能力値変動処理
    // ====================
    const before = target[stat];
    const raw = before * skill.magnification;

    // バフは切り捨て、デバフは切り上げ
    const amount =
      effect === "buff"
        ? Math.floor(raw)
        : Math.ceil(raw);

    const sign = effect === "buff" ? 1 : -1;
    const change = amount * sign;

    let after = before + change;

    // 上限・下限クランプ
    after = Math.min(target[maxKey], after);
    after = Math.max(target[minKey], after);

    const diff = after - before;
    target[stat] = after;

    if (diff > 0) {
      pushLog(
        `${target.baseName} の ${stat.toUpperCase()} が ${diff} 上昇した！`
      );
    } else if (diff < 0) {
      pushLog(
        `${target.baseName} の ${stat.toUpperCase()} が ${Math.abs(diff)} 低下した！`
      );
    } else {
      pushLog(
        `${target.baseName} の ${stat.toUpperCase()} はこれ以上変化しない！`
      );
    }

    renderBattleGrid();
  }
  return;
}

// ====================
// 全体リセット（Guard / Enchant）
// ====================
if (effect === "allReset") {

  // Guard解除
  if (target.Guard) {
    target.Guard = false;
    target.GuardCount = 0;
  }

  // Enchant解除
  if (target.Enchant) {
    target.Enchant = false;
    target.EnchantCount = 0;
  }

  pushLog(
    `${target.baseName} の守りは解かれ、祈りは失われた！`
  );

  return;
}


// --------------------
// ダメージ計算
// --------------------
let basePower;
let atkRate = 1;
let magRate = 0;

if (effect === "hybrid" && typeof skill.ability === "string" && skill.ability.includes("-")) {
  // "70-30" 形式
  const [atkP, magP] = skill.ability.split("-").map(Number);
  const total = atkP + magP || 1;

  atkRate = atkP / total;
  magRate = magP / total;

  basePower =
    (Number(user.atk || 0) * atkRate) +
    (Number(user.mag || 0) * magRate);

} else if (skill.ability === "normal") {
  // normal の場合は atk と mag の高い方を採用
  basePower = Math.max(Number(user.atk || 0), Number(user.mag || 0));

} else {
  // それ以外はそのまま
  basePower = Number(user[skill.ability] || 0);
}


// --------------------
// 命中判定
// --------------------
let hitResult = "hit"; // hit / miss / graze
let isCritical = false;

// hybrid は必中・急所なし
if (effect !== "hybrid") {

function hasEnchant(chara, name) {
  return chara.Enchant === name;
}

// 攻撃側 dex（状態補正込み）
let effectiveDex = Number(user.dex || 0);

if (hasEnchant(user, "妙技")) effectiveDex *= 2;

// 防御側 agi（状態補正込み）
let effectiveAgi = Number(target.agi || 0);

if (hasEnchant(target, "俊足")) effectiveAgi *= 2;

// 攻撃側命中値
let hitStat = 0;
if (effect === "physical") {

  if (user.Enchant === "打封") {
    pushLog(`しかし、${user.baseName}は 思うように体が動かない！`);
    return;
  }

  hitStat = (effectiveDex + Number(user.atk || 0)) / 2;

} else if (effect === "magical") {

  if (user.Enchant === "符封") {
    pushLog(`しかし、${user.baseName}は 符号を忘却している！`);
    return;
  }

  hitStat = (effectiveDex + Number(user.mag || 0)) / 2;
}

// 防御側回避値
let evadeStat = effectiveAgi;


  // 基礎命中率
  let hitRate = 0.7;

  // 能力差補正（差10ごとに±5%）
  let diff = hitStat - evadeStat;
  hitRate += diff * 0.005;

  // 揺らぎ（±5%）
  hitRate += (Math.random() * 0.1 - 0.05);

  // 上限・下限
  hitRate = Math.min(0.95, Math.max(0.05, hitRate));

  let roll = Math.random();

  // 命中判定
  if (roll > hitRate) {
    if (effect === "physical") {
      hitResult = "miss";
    } else if (effect === "magical") {
      hitResult = "graze"; // かすり
    }
  }

  // 急所判定（physicalのみ・命中時のみ）
  if (effect === "physical" && hitResult === "hit") {
    if (Math.random() < 0.05) {
      isCritical = true;
    }
  }
}

// 回避処理
if (hitResult === "miss") {
  pushLog(`${user.baseName} の攻撃は当たらなかった！`);
  return;
}

if (hitResult === "graze") {
  pushLog(`${target.baseName} は攻撃をかわした！`);
}


// --------------------
// スキル倍率適用（条件付き強化）
// --------------------
let magnification = Number(skill.magnification ?? 1);


// ===== Enchant チェック =====
if (
  skill.check &&
  user.Enchant === skill.check
) {
  magnification *= 5;

  // Enchant 消費
  user.Enchant = false;
  user.EnchantCount = 0;
  user.EnchantMag = 0;

  pushLog(`${user.baseName} の ${skill.check} が解放された！`);
}

// ===== 最終適用 =====
basePower *= magnification;

// 急所ログ（後出し）
if (isCritical) {
  basePower *= 2;
  pushLog("急所に命中した！");
}


// --------------------
// 防御値決定
// --------------------
let targetDef;

if (effect === "hybrid") {
  if (skill.ability === "normal") {
    // normal の場合は atk/mag比率で判定
    if ((user.atk || 0) > (user.mag || 0)) {
      targetDef = Number(target.def || 0);
    } else if ((user.mag || 0) > (user.atk || 0)) {
      targetDef = Number(target.mag || 0) * 0.5;
    } else {
      targetDef = Math.min(
        Number(target.def || 0),
        Number(target.mag || 0)
      );
    }
  } else {
    if (atkRate > magRate) {
      targetDef = Number(target.mag || 0);
    } else if (magRate > atkRate) {
      targetDef = Number(target.def || 0);
    } else {
      targetDef = Math.min(
        Number(target.def || 0),
        Number(target.mag || 0)
      );
    }
  }
} else if (effect === "physical") {
  targetDef = Number(target.def || 0);
} else {
  targetDef = Number(target.mag || 0) * 0.5;
}

// --------------------
// 攻撃側 Enchant による防御貫通
// --------------------
if (effect === "physical" && user.Enchant === "剛腕") {
  // 物理防御を50%として扱う
  targetDef *= 0.5;
}

if (effect === "magical" && user.Enchant === "叡智") {
  // 魔法防御を25%として扱う
  targetDef *= 0.25;
}

// --------------------
// 整数化・下限保証
// --------------------
targetDef = Math.floor(targetDef);
if (targetDef <= 0) targetDef = 1;


// --------------------
// 防御ソフトキャップ（追加）
// --------------------
const DEF_SOFT_CAP =
  (Number(target.lv) || 1) * 8 + 50;

let effectiveDef =
  targetDef * (DEF_SOFT_CAP / (DEF_SOFT_CAP + targetDef));

// --------------------
// ダメージ算出
// --------------------
let baseDamage = basePower * 0.3;
baseDamage *= (1 + (basePower - effectiveDef) / effectiveDef);

// レベル補正
let levelRate =
  1 + ((Number(user.lv) || 1) - (Number(target.lv) || 1)) * 0.01;
levelRate = Math.min(1.3, Math.max(0.7, levelRate));
baseDamage *= levelRate;

// 振れ幅
let minDamageCandidate = baseDamage * 0.8;
let maxDamageCandidate = baseDamage * 1.3;

// 最低ダメージを少しマイルドに
let minDamage = Math.max(
  minDamageCandidate,
  Math.min(
    baseDamage * 0.5,
    Number(target.maxHp || 1) * 0.025
  )
);

let maxDamage = maxDamageCandidate;

let damage = Math.floor(
  minDamage + Math.random() * (maxDamage - minDamage)
);

if (hitResult === "graze") {
  damage = Math.floor(damage * 0.25);
}


// --------------------
// 攻撃側アクセ補正
// --------------------
let attackerAcc = user.source?.equippedAccessory;
if (attackerAcc && attackerAcc.type === "Damageroll") {
  if (effect === "physical" && attackerAcc.effect.physical)
    damage += attackerAcc.effect.physical;
  if (effect === "magical" && attackerAcc.effect.magical)
    damage += attackerAcc.effect.magical;
}

// 最低ダメ保証
damage += 1 + Math.floor(Math.random() * 2);
if (damage < 1) damage = 1;





// --------------------
// ダメージ適用
// --------------------
let finalDamage = damage;

let logMessages = [];
let reflectedDamage = 0;
let counterDamage = 0;
let healedHP = 0;
let healedMP = 0;

// 攻撃タイプ判定
const isPhysical = (effect === "physical");
const isMagical  = (effect === "magical");

// --------------------
// Guard 判定
// --------------------
function hasGuard(chara, name) {
  return chara.Guard === name;
}

// 防御：physical 半減
if (isPhysical && hasGuard(target, "防御")) {
  finalDamage = Math.floor(finalDamage / 2);
  logMessages.push(`${target.baseName} は防御した！`);
}

// 反撃：physical 半減＋半分を返す
if (isPhysical && hasGuard(target, "反撃")) {
  counterDamage = Math.floor(finalDamage / 2);
  finalDamage = Math.floor(finalDamage / 2);

  user.hp -= counterDamage;
  if (user.hp < 0) user.hp = 0;

  logMessages.push(
    `${target.baseName} の反撃！ ${user.baseName} に ${counterDamage} ダメージ！`
  );
}

// 反射：magical 無効＋全量返す
if (isMagical && hasGuard(target, "反射")) {
  reflectedDamage = finalDamage;

  user.hp -= reflectedDamage;
  if (user.hp < 0) user.hp = 0;

  finalDamage = 0;

  logMessages.push(`${target.baseName} は魔法を反射した！`);
  logMessages.push(
    `${user.baseName} は ${reflectedDamage} ダメージを受けた！`
  );
}

// 命吸：physical 無効＋50% HP回復
if (isPhysical && hasGuard(target, "命吸")) {
  healedHP = Math.floor(finalDamage * 0.5);
  target.hp = Math.min(target.mhp, target.hp + healedHP);
  finalDamage = 0;

  logMessages.push(
    `${target.baseName} は命を吸収し、HPを回復した！`
  );
}

// 魔吸：magical 無効＋50% MP回復
if (isMagical && hasGuard(target, "魔吸")) {
  healedMP = Math.floor(finalDamage * 0.5);
  target.mp = Math.min(target.mmp, target.mp + healedMP);
  finalDamage = 0;

  logMessages.push(
    `${target.baseName} は魔力を吸収した！`
  );
}

// 癒し：magical 無効＋50% HP回復
if (isMagical && hasGuard(target, "癒し")) {
  healedHP = Math.floor(finalDamage * 0.5);
  target.hp = Math.min(target.mhp, target.hp + healedHP);
  finalDamage = 0;

  logMessages.push(
    `${target.baseName} は癒しの力で回復した！`
  );
}

// --------------------
// 守護（最後にまとめて処理）
// --------------------
if (target.Enchant === "守護" && finalDamage > 0) {
  finalDamage = Math.floor(finalDamage / 2);
  logMessages.push(`${target.baseName} は守護に守られた！`);
}

// 最低ダメージ保証（完全無効時は除外）
if (finalDamage > 0) {
  finalDamage = Math.max(1, finalDamage);
}

// --------------------
// HP適用
// --------------------
if (finalDamage > 0) {
  target.hp -= finalDamage;
  logMessages.unshift(
    `${target.baseName} に ${finalDamage} ダメージ！`
  );
}
// else {
//  logMessages.unshift(
//    `${target.baseName} はダメージを受けなかった！`
//  );
//}

let isKilled = false;
if (target.hp <= 0) {
  target.hp = 0;
  target.alive = false;
  isKilled = true;
}

// --------------------
// 反射アクセ（Guard後・ログ追記）
// --------------------
let defenderAcc = target.source?.equippedAccessory;
if (defenderAcc && defenderAcc.type === "Counter" && defenderAcc.effect.reflect) {
  let reflectDamage = Math.floor(
    damage * (defenderAcc.effect.reflect / 100)
  );
  reflectDamage += 1 + Math.floor(Math.random() * 2);
  reflectDamage = Math.max(1, reflectDamage);

  user.hp -= reflectDamage;
  if (user.hp < 1) user.hp = 1;
  user.alive = true;

}

// --------------------
// ログ出力
// --------------------
for (const msg of logMessages) {
  pushLog(msg);
}


if (isKilled) {
  pushLog(`${target.baseName} は倒れた！`);

  const gainedExp = target.exp ?? 0;

  if (user.side === "player") {
    adventurePlayer.exp += gainedExp;
    pushLog(`${user.source.name} は ${gainedExp} EXP を得た！`);
  } else if (user.side === "ally") {
    adventurePlayer.exp += gainedExp;
    pushLog(`${adventurePlayer.name} は ${gainedExp} EXP を得た！`);
  }
}

renderBattleGrid();
renderAdventureStatus(adventurePlayer);
}



function parseHybridRatio(ability) {
  const [a, b] = ability.split("-").map(Number);
  const total = a + b || 1;
  return {
    atkRate: a / total,
    magRate: b / total
  };
}






function checkBattleEnd() {
  const playersAlive = battleState.units.some(
    u => u.alive && (u.side === "player" || u.side === "ally")
  );
  const enemiesAlive = battleState.units.some(
    u => u.alive && (u.side === "enemy"  || u.side === "boss")
  );

  if (!playersAlive) {
    pushLog("全滅した……");
    syncBattleResultToAdventure();
    renderAdventureStatus(adventurePlayer);
    renderBattleGrid(); // 倒れた状態を反映

  // 少しタイミングをずらすと安全
  setTimeout(() => clearBattleState(), 100);

    return true;
  }

if (!enemiesAlive) {

  if (adventureState.depthNow === adventureStats.Depth - 1) {
  pushLog("このレリアのボスをボスを打ち倒した！");

  adventureState.depthNow += 1,

    pushLog("ボスの守る扉を潜り抜けた……財宝の気配が満ちている。");

    adventurePhase = "treasure";
    updateAdventureButtons();
    return;


  } else {
  pushLog("敵を全滅させた！");
}


  renderBattleGrid();  // 倒れた状態を反映
  syncBattleResultToAdventure();
  renderAdventureStatus(adventurePlayer);

  // 少しタイミングをずらすと安全
  setTimeout(() => clearBattleState(), 100);

  document.getElementById("approachBtn").disabled = false;
  document.getElementById("retreatBtn").disabled = false;

  return true;
}
  return false;
}


function clearBattleState() {
  // 戦闘ユニットを全削除
  battleState.units = [];
  battleState.turnOrder = [];
  battleState.turnIndex = 0;

  // UI中身を空にする
  const grid = document.getElementById("battleGrid");
  if (grid) grid.innerHTML = "";

  const skills = document.getElementById("skillButtons");
  if (skills) skills.innerHTML = "";

  const log = document.getElementById("battleLog");
  if (log) log.innerHTML = "";
}

//戦闘終了後のデータ引継ぎ
function syncBattleResultToAdventure() {
  battleState.units.forEach(unit => {
    if (unit.side === "player" && unit.source) {
      // HP / MP を冒険プレイヤーに反映
      unit.source.battle.hp = Math.max(0, unit.hp);
      unit.source.battle.mp = Math.max(0, unit.mp);

      // ★ AI を反映
      if (unit.AI) {
        unit.source.AI = structuredClone(unit.AI);
      }

      pushLog(
        `${unit.baseName} の消耗が冒険に反映された（HP:${unit.hp} MP:${unit.mp}）`
      );
      pushLog(
        `${unit.baseName} のAI傾向も冒険に反映された`
      );
    }
  });
}






function formatGuard(unit) {
  if (!unit || !unit.Guard) return "";
  return `${unit.Guard}(${unit.GuardCount})`;
}

function formatEnchant(unit) {
  if (!unit || !unit.Enchant) return "";
  return `${unit.Enchant}(${unit.EnchantCount})`;
}


function renderBattleGrid() {
  const table = document.getElementById("battleGrid");
  table.innerHTML = "";

  const allyUnits = battleState.units.filter(
    u => (u.side === "player" || u.side === "ally") && u.alive
  );
const enemyUnits = battleState.units.filter(
  u => (u.side === "enemy" || u.side === "boss") && u.alive
);


  const maxRows = Math.max(allyUnits.length, enemyUnits.length);

  // ====================
  // プレイヤーに analyze スキルがあるか判定
  // ====================
  const player = battleState.units.find(u => u.side === "player");
  const hasAnalyze = player && player.skillSlot.some(
    id => SKILL_MASTER[id]?.id === "analyze"
  );

  // ====================
  // 表示用フォーマット
  // ====================
  const formatGuard = unit =>
    unit && unit.Guard ? `${unit.Guard}(${unit.GuardCount})` : "";

  const formatEnchant = unit =>
    unit && unit.Enchant ? `${unit.Enchant}(${unit.EnchantCount})` : "";

  for (let i = 0; i < maxRows; i++) {

    /* ---------- 名前行 ---------- */
    const trName = document.createElement("tr");

    // 味方：名前
    const tdAllyName = document.createElement("td");
    tdAllyName.style.padding = "2px 10px";
    if (i < allyUnits.length) {
      const unit = allyUnits[i];
      const label = document.createElement("label");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.dataset.unitId = unit.id;
      label.appendChild(cb);
      label.appendChild(document.createTextNode(" " + unit.name));
      tdAllyName.appendChild(label);
    }
    trName.appendChild(tdAllyName);

    // 味方：Guard
    const tdAllyGuard = document.createElement("td");
    tdAllyGuard.style.padding = "2px 6px";
    tdAllyGuard.style.fontSize = "0.8em";
    if (i < allyUnits.length) {
      tdAllyGuard.textContent = formatGuard(allyUnits[i]);
    }
    trName.appendChild(tdAllyGuard);

    // スペーサー
    const tdSpacer = document.createElement("td");
    tdSpacer.style.width = "20px";
    trName.appendChild(tdSpacer);

    // 敵：名前
    const tdEnemyName = document.createElement("td");
    tdEnemyName.style.padding = "2px 10px";
    if (i < enemyUnits.length) {
      const unit = enemyUnits[i];
      const label = document.createElement("label");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.dataset.unitId = unit.id;
      label.appendChild(cb);
      label.appendChild(document.createTextNode(" " + unit.name));
      tdEnemyName.appendChild(label);
    }
    trName.appendChild(tdEnemyName);

    // 敵：Guard
    const tdEnemyGuard = document.createElement("td");
    tdEnemyGuard.style.padding = "2px 6px";
    tdEnemyGuard.style.fontSize = "0.8em";
    if (i < enemyUnits.length) {
      tdEnemyGuard.textContent = formatGuard(enemyUnits[i]);
    }
    trName.appendChild(tdEnemyGuard);

    table.appendChild(trName);

    /* ---------- HP / MP 行 ---------- */
    const trHP = document.createElement("tr");

    // 味方：HP / MP
    const tdAllyHP = document.createElement("td");
    tdAllyHP.style.padding = "2px 10px";
    if (i < allyUnits.length) {
      const unit = allyUnits[i];
      tdAllyHP.textContent =
        unit.side === "player"
          ? `HP:${unit.hp}/${unit.maxHp} MP:${unit.mp}/${unit.maxMp}`
          : `HP:${unit.hp}/${unit.maxHp}`;
    }
    trHP.appendChild(tdAllyHP);

    // 味方：Enchant
    const tdAllyEnchant = document.createElement("td");
    tdAllyEnchant.style.padding = "2px 6px";
    tdAllyEnchant.style.fontSize = "0.8em";
    if (i < allyUnits.length) {
      tdAllyEnchant.textContent = formatEnchant(allyUnits[i]);
    }
    trHP.appendChild(tdAllyEnchant);

    // スペーサー
    trHP.appendChild(document.createElement("td"));

    // 敵：HP
    const tdEnemyHP = document.createElement("td");
    tdEnemyHP.style.padding = "2px 10px";
    if (i < enemyUnits.length) {
      const unit = enemyUnits[i];
      tdEnemyHP.textContent = hasAnalyze
        ? `HP:${unit.hp}/${unit.maxHp}`
        : "";
    }
    trHP.appendChild(tdEnemyHP);

    // 敵：Enchant（analyze時のみ）
    const tdEnemyEnchant = document.createElement("td");
    tdEnemyEnchant.style.padding = "2px 6px";
    tdEnemyEnchant.style.fontSize = "0.8em";
    if (i < enemyUnits.length && hasAnalyze) {
      tdEnemyEnchant.textContent = formatEnchant(enemyUnits[i]);
    }
    trHP.appendChild(tdEnemyEnchant);

    table.appendChild(trHP);
  }
}

// ====================
// チェックボックスから選択ユニット取得
// ====================
function getSelectedTargets(user, skill) {
  const checkboxes = document.querySelectorAll('#battleGrid input[type="checkbox"]');
  const checkedUnits = [];

  const { target, effect } = skill.category ?? {};
  if (!target || !effect) return [];

  // ====================
  // 攻撃／支援 判定
  // ====================
  const isAttack =
    effect === "physical" ||
    effect === "magical" ||
    effect === "hybrid" ||
    effect === "debuff" ||
    effect === "EnchantDebuff";

  const isSupport =
    effect === "heal" ||
    effect === "buff" ||
    effect === "Guard" ||
    effect === "EnchantBuff";

  // ====================
  // チェックされたユニット収集
  // ====================
  checkboxes.forEach(cb => {
    if (!cb.checked) return;

    const unit = battleState.units.find(u => u.id == cb.dataset.unitId);
    if (!unit || !unit.alive) return;

    const isEnemy =
      (user.side === "player" || user.side === "ally")
        ? (unit.side === "enemy" || unit.side === "boss")
        : (unit.side === "player" || unit.side === "ally");

    const isAlly =
      (user.side === "player" || user.side === "ally")
        ? (unit.side === "player" || unit.side === "ally")
        : (unit.side === "enemy" || unit.side === "boss");

    if (isAttack && isEnemy)  checkedUnits.push(unit);
    if (isSupport && isAlly)  checkedUnits.push(unit);
  });

  // ====================
  // チェックなし時の候補生成
  // ====================
  const validUnits = battleState.units.filter(u => {
    if (!u.alive) return false;

    const isEnemy =
      (user.side === "player" || user.side === "ally")
        ? (u.side === "enemy" || u.side === "boss")
        : (u.side === "player" || u.side === "ally");

    const isAlly =
      (user.side === "player" || user.side === "ally")
        ? (u.side === "player" || u.side === "ally")
        : (u.side === "enemy" || u.side === "boss");

    return (isAttack && isEnemy) || (isSupport && isAlly);
  });

  // ====================
  // target による最終決定
  // ====================
  switch (target) {
    // 単体対象：チェック優先、なければランダム
    case "enemy":
    case "ally": {
      const pool = checkedUnits.length ? checkedUnits : validUnits;
      if (pool.length === 0) return [];
      return [pool[Math.floor(Math.random() * pool.length)]];
    }

    // 全体対象：チェックを無視して必ず全員
    case "enemys":
    case "allys":
      return validUnits;

    case "self":
      return [user];

    default:
      return [];
  }

}


function playerUseSkill(skill) {
  const actor = battleState.turnOrder[battleState.turnIndex - 1];

  // MP消費
  actor.mp -= skill.mp;

  const targets = getSelectedTargets(actor, skill);

  pushLog(`${actor.baseName} は ${skill.message}`);

  targets.forEach(target =>
    applySkillEffect(actor, target, skill)
  );

  endPlayerTurn();
}

