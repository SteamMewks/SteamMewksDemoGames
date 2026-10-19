let player = createPlayer();

// ====================

// 定数・初期設定

// ====================

const SELL_RATE = 0.5; // 半額


// ====================

// スキルマスタ

// ====================

//const CATEGORY_LABEL = {
//  single_physical: "単体物理",
//  all_physical: "全体物理",

//  single_magic: "単体魔法",
//  all_magic: "全体魔法",

//  single_heal: "単体回復",
//  all_heal: "全体回復",

//  single_buff: "単体支援",
//  all_buff: "全体支援",

//  other: "その他"
//};


const SKILL_MASTER = { // ToDo スキル設計の続き。バフは設計のみ完成。デバフは設計からやり直し
  attack: {
 id: "attack", name: "通常攻撃",
 mp: 0, sp: 0,
 category: { target: "enemy", effect: "hybrid" },
 ability: "normal", magnification: 0.8,
 message: "の通常攻撃！",
 type: "active",
 require: () => true
  },

  powerblow: {
 id: "powerblow", name: "パワーブロウ",
 mp: 6, sp: 5,
 category: { target: "enemy", effect: "physical" },
 ability: "atk", magnification: 1.3,
 message: "の強打！", type: "active",
 require: (p) => p.atk >= p.mag
  },

  powerstrike: {
 id: "powerstrike", name: "パワーストライク",
 mp: 18, sp: 10,
 category: { target: "enemy", effect: "physical" },
 ability: "atk", magnification: 1.5,
 message: "の渾身の一撃！",
 type: "active",
 require: (p) => p.atk >= p.mag && p.lv >= 30
  },

  mindbastar: {
 id: "mindbastar", name: "マインドバスター",
 mp: 8, sp: 5,
 category: { target: "enemy", effect: "magical" },
 ability: "atk", magnification: 1.1,
 message: "は精神を撃ち抜いた！",
 type: "active",
 require: (p) => p.mag >= p.atk
  },

  mindpunish: {
 id: "mindpunish", name: "マインドパニッシュ",
 mp: 20, sp: 10,
 category: { target: "enemy", effect: "magical" },
 ability: "atk", magnification: 1.2,
 message: "は精神を粉砕した！",
 type: "active",
 require: (p) => p.mag >= p.atk && p.lv >= 30
  },

  guard: {
 id: "guard", name: "防御",
 mp: 0, sp: 1,
 category: { target: "self", effect: "Guard" },
 ability: "防御", magnification: 1,
 message: "は身を固めた！",
 type: "active",
 require: () => true
  },

  Counter: {
 id: "Counter", name: "カウンター",
 mp: 10, sp: 3,
 category: { target: "self", effect: "Guard" },
 ability: "反撃", magnification: 1,
 message: "は身を固めた！",
 type: "active",
 require: (p) => p.mhp >= 300 && p.atk >= 100
  },

  refshield: {
 id: "refshield", name: "反射の盾",
 mp: 10, sp: 1,
 category: { target: "self", effect: "Guard" },
 ability: "反射",   magnification: 1,
 message: "の前に輝く盾が現れた！",
 type: "active",
 require: () => true,
  },

  refwall: {
 id: "refshield", name: "反射の壁",
 mp: 40, sp: 3,
 category: { target: "self", effect: "Guard" },
 ability: "反射",   magnification: 3,
 message: "の前に輝く障壁が展開される！",
 type: "active",
 require: (p) => p.mhp >= 300 && p.mag >= 100
  },

  atkUP: {
    id: "atkUP",  name: "アプグース",
    mp: 15, sp: 5,
    category: { target: "ally", effect: "buff" },
    ability: "atk",  magnification: 0.75,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 16
  },

  defUP: {
    id: "defUP",  name: "アプルーバ",
    mp: 15, sp: 3,
    category: { target: "ally", effect: "buff" },
    ability: "def",    magnification: 0.75,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 14
  },

  dexUP: {
    id: "dexUP",    name: "アプティーク",
    mp: 15, sp: 3,
    category: { target: "ally", effect: "buff" },
    ability: "dex",    magnification: 0.75,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 10
  },

  agiUP: {
    id: "agiUP",    name: "アプジーア",
    mp: 15, sp: 3,
    category: { target: "ally", effect: "buff" },
    ability: "agi",    magnification: 0.75,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 12
  },

  magUP: {
    id: "magUP",    name: "アプリーン",
    mp: 15, sp: 5,
    category: { target: "ally", effect: "buff" },
    ability: "mag",    magnification: 0.75,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 18
  },

  atkDOWN: {
    id: "atkDOWN",  name: "ディグス",
    mp: 10, sp: 3,
    category: { target: "enemy", effect: "debuff" },
    ability: "atk",  magnification: 0.1,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 26
  },

  defDOWN: {
    id: "defDOWN",  name: "ディルバ",
    mp: 10, sp: 3,
    category: { target: "enemy", effect: "debuff" },
    ability: "def",    magnification: 0.1,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 24
  },

  dexDOWN: {
    id: "dexDOWN",    name: "ディティク",
    mp: 10, sp: 3,
    category: { target: "enemy", effect: "debuff" },
    ability: "dex",    magnification: 0.1,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 20
  },

  agiDOWN: {
    id: "agiDOWN",    name: "ディジア",
    mp: 10, sp: 3,
    category: { target: "enemy", effect: "debuff" },
    ability: "agi",    magnification: 0.1,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 22
  },

  magDOWN: {
    id: "magDOWN",    name: "ディリン",
    mp: 10, sp: 5,
    category: { target: "enemy", effect: "debuff" },
    ability: "mag",    magnification: 0.1,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 28
  },

  cure: {
    id: "cure", name: "メルプ",
    mp: 20, sp: 2,
    category: { target: "ally", effect: "heal" },
    ability: "null", magnification: 0.3,
    message: "は回復魔法を使った！",
    type: "active",
    require: () => true
  },

  aid: {
    id: "aid", name: "ラルプ",
    mp: 40, sp: 3,
    category: { target: "ally", effect: "heal" },
    ability: "null", magnification: 0.5,
    message: "は回復魔法を使った！",
    type: "active",
    require: (p) => p.lv >= 15
  },
  heal: {
    id: "heal", name: "ファルプ",
    mp: 60, sp: 5,
    category: { target: "ally", effect: "heal" },
    ability: "null", magnification: 1,
    message: "は回復魔法を使った！",
    type: "active",
    require: (p) => p.lv >= 40
  },

  reset: {
    id: "reset", name: "忘却の祈り",
    mp: 50, sp: 10,
    category: { target: "units", effect: "allreset" },
    ability: null, magnification: 1,
    message: "は忘却の祈りを捧げた……", type: "active", require: (p) => p.lv >= 50
  },

  healprayer: {
    id: "healprayer",
    name: "治癒の祈り",
    mp: 20, sp: 1,
    category: { target: "allys", effect: "EnchantBuff" },
    ability: "回復",
    magnification: 0.05, chance:6,
    message: "は治癒の祈りを捧げた……",
    type: "active",
    require: () => true
  },

  atkprayer: {
    id: "atkprayer",
    name: "剛腕の祈り",
    mp: 30, sp: 5,
    category: { target: "allys", effect: "EnchantBuff" },
    ability: "剛腕",
    magnification: 0, chance:3,
    message: "は剛腕の祈りを捧げた……",
    type: "active",
    require: () => true
  },

  defprayer: {
    id: "defprayer",
    name: "守護の祈り",
    mp: 30, sp: 5,
    category: { target: "allys", effect: "EnchantBuff" },
    ability: "守護",
    magnification: 0, chance:3,
    message: "は守護の祈りを捧げた…",
    type: "active",
    require: () => true
  },

  dexprayer: {
    id: "dexprayer",
    name: "妙技の祈り",
    mp: 30, sp: 3,
    category: { target: "allys", effect: "EnchantBuff" },
    ability: "妙技",
    magnification: 0, chance:3,
    message: "は 妙技の祈りを捧げた…",
    type: "active",
    require: () => true
  },

  agiprayer: {
    id: "agiprayer",
    name: "俊足の祈り",
    mp: 20, sp: 3,
    category: { target: "allys", effect: "EnchantBuff" },
    ability: "俊足",
    magnification: 0, chance:3,
    message: "は 俊足の祈りを捧げた…",
    type: "active",
    require: () => true
  },

  magprayer: {
    id: "magprayer",
    name: "叡智の祈り",
    mp: 20, sp: 5,
    category: { target: "allys", effect: "EnchantBuff" },
    ability: "叡智",
    magnification: 0, chance:3,
    message: "は 叡智の祈りを捧げた…",
    type: "active",
    require: () => true
  },

 guardcurse: {
    id: "guardcurse",
    name: "守備封じの呪縛",
    mp: 10, sp: 2,
    category: { target: "enemys", effect: "EnchantDebuff" },
    ability: "守封",
    magnification: 0, chance:3,
    message: "は 守備封じの祈りを捧げた…",
    type: "active",
    require: () => true
  },

  prayercurse: {
    id: "prayercurse",
    name: "祈り封じの呪縛",
    mp: 10, sp: 2,
    category: { target: "enemys", effect: "EnchantDebuff" },
    ability: "祈封",
    magnification: 0, chance:3,
    message: "は 祈り封じの祈りを捧げた…",
    type: "active",
    require: () => true
  },

  attackcurse: {
    id: "attackcurse",
    name: "打撃封じの呪縛",
    mp: 30, sp: 5,
    category: { target: "enemys", effect: "EnchantDebuff" },
    ability: "打封",
    magnification: 0, chance:3,
    message: "は 打撃封じの祈りを捧げた…",
    type: "active",
    require: () => true
  },

  magiccurse: {
    id: "magiccurse",
    name: "符術封じの呪縛",
    mp: 30, sp: 5,
    category: { target: "enemys", effect: "EnchantDebuff" },
    ability: "符封",
    magnification: 0, chance:3,
    message: "は符術封じの祈りを捧げた…",
    type: "active",
    require: () => true
  },


  poisoncurse: {
    id: "poisoncurse",
    name: "邪毒の呪縛",
    mp: 20, sp: 4,
    category: { target: "enemys", effect: "EnchantDebuff" },
    ability: "毒",
    magnification: 0.1, chance:3,
    message: "メッセージ",
    type: "active",
    require: () => true
  },

  paralyzecurse: {
    id: "paralyzecurse",
    name: "拘鎖の呪縛",
    mp: 30, sp: 4,
    category: { target: "enemys", effect: "EnchantDebuff" },
    ability: "麻痺",
    magnification: 10, chance:3,
    message: "メッセージ",
    type: "active",
    require: () => true
  },

  powersweep: {
 id: "powersweep", name: "パワースイープ",
 mp: 14, sp: 5,
 category: { target: "enemys", effect: "physical" },
 ability: "atk", magnification: 1.1,
 message: "は 薙ぎ払った！", type: "active",
 require: (p) => p.atk >= p.mag
  },

  powercrash: {
 id: "powercrash", name: "パワークラッシュ",
 mp: 22, sp: 10,
 category: { target: "enemys", effect: "physical" },
 ability: "atk", magnification: 1.3,
 message: "は 激しく武器を振り回した！",
 type: "active",
 require: (p) => p.atk >= p.mag && p.lv >= 30
  },


  mindblast: {
 id: "mindblast", name: "マインドブラスト",
 mp: 16, sp: 5,
 category: { target: "enemys", effect: "magical" },
 ability: "atk", magnification: 0.8,
 message: "から 拡散する魔力が放たれた！",
 type: "active",
 require: (p) => p.mag >= p.atk
  },

  mindstorm: {
 id: "mindstorm", name: "マインドストーム",
 mp: 24, sp: 10,
 category: { target: "enemys", effect: "magical" },
 ability: "atk", magnification: 1.0,
 message: "から 放たれた魔力が逆巻く！",
 type: "active",
 require: (p) => p.mag >= p.atk && p.lv >= 30
  },

  demonsguard: {
 id: "guard", name: "デモンズガード",
 mp: 15, sp: 5,
 category: { target: "self", effect: "Guard" },
 ability: "命吸", magnification: 1,
 message: "は 悪魔の構えを取った！",
 type: "active",
 require: (p) => p.mmp >= 300 && p.atk >= 200
  },

  mindguard: {
 id: "mindguard", name: "マインドガード",
 mp: 20, sp: 5,
 category: { target: "self", effect: "Guard" },
 ability: "魔吸", magnification: 1,
 message: "は 反撃の構えを取った！",
 type: "active",
 require: (p) => p.mhp >= 500 && p.atk >= 200
  },

  healshield: {
 id: "refshield", name: "癒しの盾",
 mp: 20, sp: 3,
 category: { target: "self", effect: "Guard" },
 ability: "癒し",   magnification: 1,
 message: "の前に輝く盾が現れた！",
 type: "active",
 require: (p) => p.mhp >= 300 && p.mag >= 150
  },

  healwall: {
 id: "refshield", name: "癒しの壁",
 mp: 60, sp: 5,
 category: { target: "self", effect: "Guard" },
 ability: "癒し",   magnification: 3,
 message: "の前に輝く障壁が展開される！",
 type: "active",
 require: (p) => p.mhp >= 300 && p.mag >= 200
  },

  atkUPall: {
    id: "atkUP",  name: "オルアプグス",
    mp: 25, sp: 10,
    category: { target: "allys", effect: "buff" },
    ability: "atk",  magnification: 0.5,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 16
  },

  defUPall: {
    id: "defUP",  name: "オルアプルバ",
    mp: 25, sp: 5,
    category: { target: "allys", effect: "buff" },
    ability: "def",    magnification: 0.5,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 14
  },

  dexUPall: {
    id: "dexUP",    name: "オルアプティク",
    mp: 25, sp: 5,
    category: { target: "allys", effect: "buff" },
    ability: "dex",    magnification: 0.5,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 10
  },

  agiUPall: {
    id: "agiUP",    name: "オルアプジア",
    mp: 25, sp: 5,
    category: { target: "ally", effect: "buff" },
    ability: "agi",    magnification: 0.5,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 12
  },

  magUPall: {
    id: "magUP",    name: "オルアプリン",
    mp: 25, sp: 10,
    category: { target: "allys", effect: "buff" },
    ability: "mag",    magnification: 0.5,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 18
  },




  atkDOWNall: {
    id: "atkDOWN",  name: "オルディグス",
    mp: 18, sp: 5,
    category: { target: "enemys", effect: "debuff" },
    ability: "atk",  magnification: 0.05,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 26
  },

  defDOWNall: {
    id: "defDOWN",  name: "オルディルバ",
    mp: 18, sp: 5,
    category: { target: "enemys", effect: "debuff" },
    ability: "def",    magnification: 0.05,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 24
  },

  dexDOWNall: {
    id: "dexDOWN",    name: "ディティク",
    mp: 18, sp: 5,
    category: { target: "enemys", effect: "debuff" },
    ability: "dex",    magnification: 0.05,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 20
  },

  agiDOWNall: {
    id: "agiDOWN",    name: "ディジア",
    mp: 18, sp: 5,
    category: { target: "enemys", effect: "debuff" },
    ability: "agi",    magnification: 0.05,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 22
  },

  magDOWNall: {
    id: "magDOWN",    name: "ディリン",
    mp: 18, sp: 5,
    category: { target: "enemys", effect: "debuff" },
    ability: "mag",    magnification: 0.05,
    message: "を使った！",
    type: "active",
    require: (p) => p.lv >= 28
  },


  allcure: {
    id: "cure", name: "オルプ",
    mp: 30, sp: 3,
    category: { target: "allys", effect: "heal" },
    ability: "null", magnification: 0.3,
    message: "は回復魔法を使った！",
    type: "active",
    require: (p) => p.lv >= 15
  },

  aid: {
    id: "aid", name: "オラルプ",
    mp: 60, sp: 5,
    category: { target: "allys", effect: "heal" },
    ability: "null", magnification: 0.5,
    message: "は回復魔法を使った！",
    type: "active",
    require: (p) => p.lv >= 30
  },
  heal: {
    id: "heal", name: "オルファルプ",
    mp: 100, sp: 10,
    category: { target: "allys", effect: "heal" },
    ability: "null", magnification: 1,
    message: "は回復魔法を使った！",
    type: "active",
    require: (p) => p.lv >= 60
  },


  s_mindarrow: {
    id: "s_mindarrow",
    name: "インフェルノレイド",
    mp: 200, sp: 20,
    category: { target: "enemy", effect: "hybrid" },
    ability: "90-10",
    magnification: 3.0,
    message: "の 殺意で辺りが静まり返る……人智を超える一撃を叩き込んだ！",
    type: "active",
    require: (p) => p.lv >= 70
  },

  s_mindarrow: {
    id: "s_mindarrow",
    name: "ヘヴンズゲート",
    mp: 200, sp: 0,
    category: { target: "enemys", effect: "hybrid" },
    ability: "10-90",
    magnification: 2.0,
    message: "の 魔力が空間を超え、天蓋の星が広がる大空が広がる……一斉に降り注いだ！",
    type: "active",
    require: (p) => p.lv >= 70
  },

  analyze: { id: "analyze", name: "アナライズ", mp: 0, sp: 3, category: { target: "null", effect: "null" },
    ability: "null", magnification: 1.0, message: "error-analyze", type: "passive", require: () => true,
  },

  atkLore: { id: "atkLore", name: "アタックロア", mp: 0, sp: 5, category: { target: "atk", effect: "Lore" },
    ability: "null", magnification: 1.1, message: "error-atkLore", type: "passive", require: (p) => p.atk >= 50

  },

  defLore: { id: "defLore", name: "ガードロア", mp: 0, sp: 5, category: { target: "def", effect: "Lore" },
    ability: "null", magnification: 1.1, message: "error-attackLore", type: "passive", require: (p) => p.def >= 50

  },

  dexLore: { id: "dexLore", name: "デクスティロア", mp: 0, sp: 5, category: { target: "dex", effect: "Lore" },
    ability: "null", magnification: 1.1, message: "error-attackLore", type: "passive", require: (p) => p.dex >= 50

  },

  agiLore: { id: "agiLore", name: "アジリティロア", mp: 0, sp: 5, category: { target: "agi", effect: "Lore" },
    ability: "null", magnification: 1.1, message: "error-attackLore", type: "passive", require: (p) => p.agi >= 50

  },

  magLore: { id: "magLore", name: "マジックロア", mp: 0, sp: 5, category: { target: "mag", effect: "Lore" },
    ability: "null", magnification: 1.1, message: "error-attackLore", type: "passive", require: (p) => p.mag >= 5

  },

  allLore: { id: "allLore", name: "オムニロア", mp: 0, sp: 5, category: { target: "all", effect: "Lore" },
    ability: "null", magnification: 1.05, message: "error-attackLore", type: "passive", require: (p) => p.lv >= 10 

  },

  endurance: { id: "endurance", name: "エンデュランス", mp: 0, sp: 5, category: { target: "null", effect: "null" },
    ability: "null", magnification: 3, message: "error-attackLore", type: "passive", require: (p) => p.mmp >= 100  },


  s_mindarrow: {
    id: "s_mindarrow",
    name: "魔法攻撃",
    mp: 10, sp: 0, check:"NPC",
    category: { target: "enemy", effect: "hybrid" },
    ability: "90-10",
    magnification: 1.3,
    message: "は 魔法の矢を放った！",
    type: "active",
    require: () => false
  },




  steamcharge: {
    id: "steamcharge",
    name: "蓄蒸機",
    mp: 0, sp: 0,
    category: { target: "self", effect: "EnchantBuff" },
    ability: "蒸気",
    magnification: 0, chance: 2,
    message: "蒸気を蓄えた！",
    type: "active",
    require: () => false
  },
  steambastar: {
    id: "steambastar",
    name: "爆蒸弾",
    mp: 10, sp: 0, check:"蒸気",
    category: { target: "enemy", effect: "hybrid" },
    ability: "50-50",
    magnification: 0.6,
    message: "圧縮した蒸気を解き放った！",
    type: "active",
    require: () => false
  },
  steambomb: {
    id: "steambomb",
    name: "蒸機砲",
    mp: 20, sp: 0, check:"蒸気",
    category: { target: "enemys", effect: "hybrid" },
    ability: "50-50",
    magnification: 0.3,
    message: "圧縮した蒸気を解き放った！",
    type: "active",
    require: () => false
  },



  lastattack: { id: "lastattack", name: "わるあがき", mp: 0, sp: 0, category: { target: "enemy", effect: "physical" },
    ability: "atk", magnification: 0.1, message: "わるあがきした！", type: "active", require: () => false
  },

};










// ====================

// モーダル制御

// ====================



function openModal(id) {

  const modal = document.getElementById(id);

  if (!modal) return;



  modal.style.display = 'flex';



  if (id === 'weaponModal') generateWeaponList();

  if (id === 'armorModal')  generateArmorList();

  if (id === 'accessoryModal') generateAccessoryList();

  if (id === 'storageModal')   generateStorageList();

  if (id === 'itemModal')      generateItemList(); // ←追加

}





function closeModal(id) {

  const modal = document.getElementById(id);

  if (modal) modal.style.display = 'none';

}



// ボタン設置（既存 + 新規）

document.getElementById('weaponShopBtn').onclick =

  () => openModal('weaponModal');

document.getElementById('armorShopBtn').onclick =

  () => openModal('armorModal');

document.getElementById('accessoryShopBtn').onclick =

  () => openModal('accessoryModal');

document.getElementById('storageBtn').onclick =

  () => openModal('storageModal'); // 倉庫ボタン





// ====================
// 武器屋
// ====================

function generateWeaponList() {
  const list = document.getElementById('weaponList');
  if (!list) return;
  list.innerHTML = '';

  // === 購入リスト ===
  for (const key in weapons) {
    const w = weapons[key];

    // flagがshopのものだけ
    if (w.flag !== "shop") continue;

    const box = document.createElement('div');
    box.className = 'shop-item';

    // ステータス部分を動的に作る
    let stats = '';
    if (w.atk)    stats += `ATK +${w.atk} `;
    if (w.def)    stats += `DEF +${w.def} `;
    if (w.dex)    stats += `DEX +${w.dex} `;
    if (w.agi)    stats += `AGI +${w.agi} `;
    if (w.mag)    stats += `MAG +${w.mag} `;
    if (w.weight) stats += `重さ ${w.weight} `;
    if (w.custom) stats += `改造値 ${w.custom} `;

    box.innerHTML = `
      <div class="shop-item-header">
        <div class="shop-item-name">${w.name}</div>
        <div class="shop-item-price">${w.price}G</div>
        <button>購入</button>
      </div>
      <div class="shop-item-desc">${stats.trim()}</div>
    `;

    box.querySelector('button').onclick = () => buyWeapon(key);
    list.appendChild(box);
  }
}

function buyWeapon(key) {
  const base = weapons[key];
  if (!base) return;

  if (player.gold < base.price) {
    pushLog(`${base.name}は購入できない。お金が足りません。`);
    return;
  }

  player.gold -= base.price;

  // 元武器をクローン
  const weaponClone = structuredClone(base);

  // 店売りなので howard を内部的に付与
  applyWeaponAbility(weaponClone, "howard");

  let logMessages = [];

  // 既に装備中なら倉庫へ
  if (player.equippedWeapon) {
    player.weaponStorage.push(player.equippedWeapon);
    logMessages.push(`${player.equippedWeapon.name}を倉庫に移動`);
  }

  player.equippedWeapon = weaponClone;
  logMessages.push(`${weaponClone.name}を購入して装備`);

  renderStatus();
  autoSave();

  pushLog(logMessages.join('、') + `。残金: ${player.gold}G`);

  closeModal('weaponModal');
}




// ====================
// 防具屋
// ====================

function generateArmorList() {
  const list = document.getElementById('armorList');
  if (!list) return;
  list.innerHTML = '';

  // === 購入リスト ===
  for (const key in armors) {
    const a = armors[key];

    // shopフラグのみ
    if (a.flag !== "shop") continue;

    const box = document.createElement('div');
    box.className = 'shop-item';

    // ステータス表示を動的に作る
    let stats = '';
    if (a.def)    stats += `DEF +${a.def} `;
    if (a.mag)    stats += `MAG +${a.mag} `;
    if (a.weight) stats += `重さ ${a.weight} `;

    box.innerHTML = `
      <div class="shop-item-header">
        <div class="shop-item-name">${a.name}</div>
        <div class="shop-item-price">${a.price}G</div>
        <button>購入</button>
      </div>
      <div class="shop-item-desc">${stats.trim()}</div>
    `;

    box.querySelector('button').onclick = () => buyArmor(key);
    list.appendChild(box);
  }
}

function buyArmor(key) {
  const base = armors[key];
  if (!base) return;

  if (player.gold < base.price) {
    pushLog(`${base.name}は購入できない。お金が足りません。`);
    return;
  }

  player.gold -= base.price;

  // ステータスを動的にコピー
  const armorClone = structuredClone(base);

  let logMessages = [];

  // 既に装備中なら倉庫へ
  if (player.equippedArmor) {
    player.armorStorage.push(player.equippedArmor);
    logMessages.push(`${player.equippedArmor.name}を倉庫に移動`);
  }

  player.equippedArmor = armorClone;
  logMessages.push(`${armorClone.name}を購入して装備`);

  renderStatus();
  autoSave();
  pushLog(logMessages.join('、') + `。残金: ${player.gold}G`);

  closeModal('armorModal');
}



// ====================
// アクセサリーリスト生成（購入のみ）
// ====================
function generateAccessoryList() {
  const list = document.getElementById('accessoryList');
  if (!list) return;
  list.innerHTML = '';

  for (const key in accessories) {
    const a = accessories[key];

    let effectText = '';
    if (a.type === "Auto") {
      effectText = Object.entries(a.effect)
        .map(([k,v]) => `${k.toUpperCase()}+${v}`).join(', ');
    } else if (a.type === "Setup") {
      if (a.effect.hp) effectText += `HP+${a.effect.hp} `;
      if (a.effect.mp) effectText += `MP+${a.effect.mp}`;
    } else if (a.type === "Counter") {
      effectText = `反射 ${a.effect.reflect}`;
    } else if (a.type === "Damageroll") {
      if (a.effect.physical) effectText += `物理+${a.effect.physical} `;
      if (a.effect.magical)  effectText += `魔法+${a.effect.magical}`;
    }

    const box = document.createElement('div');
    box.className = 'shop-item';

    box.innerHTML = `
      <div class="shop-item-header">
        <span class="shop-item-name">${a.name}</span>
        <span class="shop-item-price">${a.price}G</span>
        <button>購入</button>
      </div>
      <div class="shop-item-desc">${a.type}：${effectText}</div>
    `;

    box.querySelector('button').onclick = () => buyAccessory(key);
    list.appendChild(box);
  }
}

// ====================
// アイテムリスト生成
// ====================

document.getElementById('itemShopBtn').onclick = () => openModal('itemModal');

function generateItemList() {
  const list = document.getElementById("itemList");
  if (!list) return;
  list.innerHTML = "";

  for (const key in ITEM_MASTER) {
    const item = ITEM_MASTER[key];
    const owned = player.item[key] ?? 0;

    const div = document.createElement("div");
    div.style.borderBottom = "1px solid #444";
    div.style.marginBottom = "4px";

    div.innerHTML = `
      <strong>${item.name}</strong>
      <div>${item.desc}</div>
      <div>
        価格：${item.price}G ／ 所持：${owned}
        <button>購入</button>
      </div>
    `;

    div.querySelector("button").onclick = () => {
      buyItem(key);
      generateItemList(); // 再描画
    };

    list.appendChild(div);
  }
}


// ====================
// 購入処理（武器・防具・アクセ・アイテム）
// ====================

function buyAccessory(key) {
  const a = accessories[key];
  if (!a) return;
  if (player.gold < a.price) {
    pushLog(`${a.name}は購入できない。お金が足りません。`);
    return;
  }

  player.gold -= a.price;

  let logMessages = [];

  if (player.equippedAccessory) {
    player.accessoryStorage.push(player.equippedAccessory);
    logMessages.push(`${player.equippedAccessory.name}を倉庫に移動`);
  }

  player.equippedAccessory = a;
  logMessages.push(`${a.name}を購入して装備`);

  renderStatus();
  autoSave();
  pushLog(logMessages.join('、') + `。残金: ${player.gold}G`);

  closeModal('accessoryModal');
}

function buyItem(itemKey) {
  const item = ITEM_MASTER[itemKey];
  if (!item) return;
  if (player.gold < item.price) {
    pushLog(`${item.name}は購入できない。お金が足りません。`);
    return;
  }

  player.gold -= item.price;
  player.item[itemKey] = (player.item[itemKey] || 0) + 1;

  pushLog(`【購入】${item.name} を ${item.price}G で購入した`);

  renderStatus();
  autoSave();
}









//   -----スキル管理UI-----



const LOCK_BUTTON_IDS = [

  "departBtn",

  "weaponShopBtn",

  "armorShopBtn",

  "accessoryShopBtn",

  "itemShopBtn",

  "saveBtn",

  "storageBtn",

  "signBtn",

  "resetBtn",

  "innBtn",

  "trainingBtn"



];



function setUILock(lock) {

  LOCK_BUTTON_IDS.forEach(id => {

    const btn = document.getElementById(id);

    if (btn) btn.disabled = lock;

  });

}





document.getElementById("trainingBtn").onclick = () => {

  setUILock(true); // ★ ロック

  document.getElementById("trainingArea").style.display = "block";

  renderTraining();

};





// ===== 枠タイプ定義 =====
const SKILL_SLOT_TYPE = [
  "active", "active", "active",  // 0〜2
  "passive", "passive",          // 3〜4
  "any", "any"                   // 5〜6
];

function renderTraining() {
  const area = document.getElementById("trainingArea");
  let html = "<h2>修練場</h2><h3>装備スキル</h3>";

  // ===== スキル装備枠 =====
  for (let i = 0; i < SKILL_SLOT_TYPE.length; i++) {
    const slotType = SKILL_SLOT_TYPE[i];

    html += `<select onchange="setSkillSlot(${i}, this.value)">
      <option value="">未設定</option>
      ${player.skill.map(id => {
        const skill = SKILL_MASTER[id];
        const disabled = (slotType !== "any" && skill.type !== slotType) ? "disabled" : "";
        const selected = player.skillSlot[i] === id ? "selected" : "";
        return `<option value="${id}" ${selected} ${disabled}>${skill.name}</option>`;
      }).join("")}
    </select>`;
  }

// ===== ステータス強化枠 =====
html += "<h3>ステータス強化</h3>";

// 共通スタイル
const btnStyle = "width:100px; height:20px; margin-right:1px;";

// HP・MP ボタン行
html += `<div style="display:flex; margin-bottom:4px;">`;
["mhp","mmp"].forEach(stat => {
  const maxValue = 999;
  const value = stat === "mhp" ? player.mhp : player.mmp;
  const canUpgrade = player.sp >= 1 && value < maxValue;

  html += `<button style="${btnStyle}" ${canUpgrade ? "" : "disabled"} onclick="upgradeStat('${stat}')">
    ${stat.toUpperCase()} +3
  </button>`;
});
html += `</div>`;

// ATK～MAG ボタン行
html += `<div style="display:flex;">`;
["atk","def","agi","mag"].forEach(stat => {
  const maxValue = 255;
  const value = player[stat];
  const canUpgrade = player.sp >= 1 && value < maxValue;

  html += `<button style="${btnStyle}" ${canUpgrade ? "" : "disabled"} onclick="upgradeStat('${stat}')">
    ${stat.toUpperCase()} +1
  </button>`;
});
html += `</div>`;



  // ===== 新スキル習得 =====
  html += "<h3>新しいスキル</h3>";
  html += renderLearnableSkills();

  // ===== 閉じる =====
  html += `<hr>
    <button onclick="
      document.getElementById('trainingArea').style.display='none';
      setUILock(false);
      autoSave();
    ">閉じる</button>`;

  area.innerHTML = html;
}


// ===== スキル習得ボタン描画 =====
function renderLearnableSkills() {
  return Object.values(SKILL_MASTER)
    .filter(s => !player.skill.includes(s.id) && s.require(player))
    .map(s => {
      const canLearn = player.sp >= s.sp;
      return `<button ${canLearn ? "" : "disabled"} onclick="learnSkill('${s.id}')">
        ${s.name} (${s.sp})
      </button>`;
    }).join("");

}

function setSkillSlot(index, skillId) {
  const slotType = SKILL_SLOT_TYPE[index];
  if (skillId) {
    const skill = SKILL_MASTER[skillId];
    if (slotType !== "any" && skill.type !== slotType) return; // タイプ違反なら設定不可
  }
  player.skillSlot[index] = skillId || null;
}

function learnSkill(skillId) {
  const skill = SKILL_MASTER[skillId];
  if (!skill) return;
  if (player.sp < skill.sp) return;

  player.sp -= skill.sp;
  player.skill.push(skillId);

  // ===== 空き枠に自動セット =====
  for (let i = 0; i < SKILL_SLOT_TYPE.length; i++) {
    const slotType = SKILL_SLOT_TYPE[i];
    const currentSkill = player.skillSlot[i];

    // 空き枠 && タイプが合う or 自由枠
    if (!currentSkill && (slotType === "any" || slotType === skill.type)) {
      player.skillSlot[i] = skillId;
      break; // 1枠だけセット
    }
  }

  renderTraining(); // 再描画
  renderStatus();
  autoSave();
}

function upgradeStat(stat) {
  if (player.sp < 1) return;

  player.sp -= 1;

  if (stat === "mhp") {
    player.mhp = Math.min(player.mhp + 3, 999);  // 最大値を増やす
    player.hp = Math.min(player.hp + 3, player.mhp); // 現在値も増やす
  } else if (stat === "mmp") {
    player.mmp = Math.min(player.mmp + 3, 999); 
    player.mp = Math.min(player.mp + 3, player.mmp);
  } else {
    player[stat] = Math.min(player[stat] + 1, 255);
  }

  pushLog(`${stat.toUpperCase()} を強化！`);

  renderTraining(); // 再描画
  renderStatus();
  autoSave();
}





//   -----NPC-----



const NPCS = {

  innGirl: {

    name: "リィナ",

    color: "#ff69b4",  // ← ピンク系、気の強い若い娘イメージ

    messages: {

      tease: [

        "冷やかし？ 迷宮に行って財宝でも見つけておいで！",

        "元気そうじゃないか。宿は逃げないよ？",

        "暇なら迷宮に行きな。ここは休む場所だよ"

      ],

      pity: [

        "……お金、無いんだね",

        "はぁ……しょうがないなぁ",

        "次はちゃんと稼いできなよ？"

      ]

    }

  },



  weaponShop: {

    name: "武器屋のオスカー",

    color: "#87ceeb",  // 青系

    messages: {

      welcome: ["いらっしゃい、見ていきな！"],

      poor: ["お金が足りないのか…また来いよ"]

    }

  }

};



function getRandom(arr) {

  return arr[Math.floor(Math.random() * arr.length)];

}



function pushNpcLog(npcKey, category) {

  const npc = NPCS[npcKey];

  if (!npc || !npc.messages[category]) return;



  const msg = getRandom(npc.messages[category]);



  // ★ 色付きHTMLでログに追加

  pushLog(`<span style="color: ${npc.color}; font-weight:bold;">${npc.name}</span>：「${msg}」`);

}





//   -----宿屋-----





function calcInnCost(player) {

  return Math.max(0, player.mhp - player.hp);

}



function updateInnButton() {

  const btn = document.getElementById("innBtn");

  if (!btn) return;



  const cost = calcInnCost(player);

  btn.textContent = `宿屋（${cost}G）`;

}



document.getElementById("innBtn").onclick = () => {

  const cost = calcInnCost(player);



  if (cost === 0) {

    pushNpcLog("innGirl", "tease");

    return;



  } else if (player.gold < cost) {

    pushNpcLog("innGirl", "pity");

  }



  if (cost > 0 && player.gold >= cost) {

    player.gold -= cost;

    pushLog(`宿屋に泊まった（${cost}G）`);

  }



  player.hp = player.mhp;

  player.mp = player.mmp;



  pushLog("HPとMPが全回復した");



  renderStatus();

  updateInnButton();

  autoSave();

};



// ====================

// 倉庫リスト生成

// ====================



let currentStorageCategory = 'weapon';



function showStorageCategory(category) {

    currentStorageCategory = category;

    generateStorageList();

}



function generateStorageList() {

    const list = document.getElementById('storageList');

    if (!list) return;



    list.innerHTML = '';

    let storageArray = [];



    if (currentStorageCategory === 'weapon') storageArray = player.weaponStorage;

    if (currentStorageCategory === 'armor') storageArray = player.armorStorage;

    if (currentStorageCategory === 'accessory') storageArray = player.accessoryStorage;



    if (storageArray.length === 0) {

        list.textContent = "倉庫には何もありません。";

        return;

    }



    storageArray.forEach((item) => {

        const itemDiv = document.createElement('div');

        itemDiv.style.display = 'flex';

        itemDiv.style.flexDirection = 'column';

        itemDiv.style.marginBottom = '6px';

        itemDiv.style.padding = '4px 6px';

        itemDiv.style.borderBottom = '1px solid #444';

        itemDiv.style.fontSize = '0.9em';

        itemDiv.style.color = '#eee';

        itemDiv.style.backgroundColor = 'transparent'; // 無色に変更



        // -----上段：名前 + 値段（右寄せ）-----

        const topDiv = document.createElement('div');

        topDiv.style.display = 'flex';

        topDiv.style.justifyContent = 'space-between';

        topDiv.style.alignItems = 'center';

        topDiv.style.marginBottom = '2px';



        const nameEl = document.createElement('div');

        nameEl.textContent = item.name;

        nameEl.style.fontWeight = '700';

        nameEl.style.fontSize = '1.05em';

        nameEl.style.color = '#fff'; // 上段は白



        const priceEl = document.createElement('div');

        priceEl.textContent = `${item.price}G`;

        priceEl.style.fontSize = '0.8em';

        priceEl.style.color = '#aaa';



        topDiv.appendChild(nameEl);

        topDiv.appendChild(priceEl);



        // -----下段：説明 + ボタン（右寄せ）-----

        const bottomDiv = document.createElement('div');

        bottomDiv.style.display = 'flex';

        bottomDiv.style.justifyContent = 'space-between';

        bottomDiv.style.alignItems = 'center';



        const descEl = document.createElement('div');

        let statsText = '';

        if (item.atk) statsText += `ATK+${item.atk} `;

        if (item.def) statsText += `DEF+${item.def} `;

        if (item.effect) {

            statsText += Object.entries(item.effect)

                .map(([k, v]) => `${k}+${v}`)

                .join(', ');

        }

        descEl.textContent = statsText || '特記事項なし';

        descEl.style.fontSize = '0.8em';

        descEl.style.color = '#ccc';



        const btnDiv = document.createElement('div');

        btnDiv.style.display = 'flex';

        btnDiv.style.gap = '5px';

        btnDiv.style.alignItems = 'center';



        const equipBtn = document.createElement('button');

        equipBtn.textContent = '装備';

        equipBtn.style.fontSize = '0.75em'; // 小さめ

        equipBtn.onclick = () => {

            if (currentStorageCategory === 'weapon') {

                if (player.equippedWeapon) player.weaponStorage.push(player.equippedWeapon);

                player.equippedWeapon = item;

            } else if (currentStorageCategory === 'armor') {

                if (player.equippedArmor) player.armorStorage.push(player.equippedArmor);

                player.equippedArmor = item;

            } else if (currentStorageCategory === 'accessory') {

                if (player.equippedAccessory) player.accessoryStorage.push(player.equippedAccessory);

                player.equippedAccessory = item;

            }

            storageArray.splice(storageArray.indexOf(item), 1);

            renderStatus();

            autoSave();

            pushLog(`${item.name}を倉庫から取り出して装備した`);

            generateStorageList();

        };



        const sellBtn = document.createElement('button');

        sellBtn.textContent = '売却';

        sellBtn.style.fontSize = '0.75em'; // 小さめ

        sellBtn.onclick = () => {

            const sellPrice = Math.floor(item.price * SELL_RATE);

            player.gold += sellPrice;

            storageArray.splice(storageArray.indexOf(item), 1);

            renderStatus();

            autoSave();

            pushLog(`${item.name}を倉庫から売却して${sellPrice}Gを獲得`);

            generateStorageList();

        };



        btnDiv.appendChild(equipBtn);

        btnDiv.appendChild(sellBtn);



        bottomDiv.appendChild(descEl);

        bottomDiv.appendChild(btnDiv);



        itemDiv.appendChild(topDiv);

        itemDiv.appendChild(bottomDiv);



        list.appendChild(itemDiv);

    });

}







//   -----符号の間-----

function getSeedString(name, date = new Date()) {

  const uname = (name || "noname")

    .normalize("NFKC")

    .trim()

    .toLowerCase();

  const y = date.getFullYear();

  const m = String(date.getMonth() + 1).padStart(2, "0");

  const d = String(date.getDate()).padStart(2, "0");

  return `${uname}_${y}-${m}-${d}`;

}

function seedToNumber(seed) {

  let h = 2166136261;

  for (const c of seed) {

    h ^= c.charCodeAt(0);

    h = Math.imul(h, 16777619);

  }

  return h >>> 0;

}

function seedToCode(seed) { return seed.toString(36).toUpperCase(); }

function formatCode(code, length = 8) { return code.padStart(length, "0").slice(-length); }

function prettifyCode(code) { return code.match(/.{1,4}/g).join("-"); }

function getTodayCode(name) {

  const seedStr = getSeedString(name, new Date());

  const seedNum = seedToNumber(seedStr);

  const rawCode = seedToCode(seedNum);

  const fixed = formatCode(rawCode, 8);

  return prettifyCode(fixed);

}

function checkDailyCode(inputCode) {

  const todayCode = getTodayCode(player.name);

  return inputCode.toUpperCase() === todayCode;

}

// ----- 名前偏り＋日付誤差で能力上昇 -----

function getStatBiasFlexible(name) {
  const seed = seedToNumber(getSeedString(name));
  const stats = ["mhp","mmp","atk","def","agi","mag"];
  const result = {};

  for (let i = 0; i < stats.length; i++) {
    // 名前で0〜31の値を取得
    const val = (seed >> (i*5)) & 0x1F;
    result[stats[i]] = val; // 正規化せず
  }

  return result;
}

function getDailyStatBoostFlexible(name, date = new Date()) {
  const base = getStatBiasFlexible(name);
  const dateSeed = seedToNumber(getSeedString(name, date));
  const stats = ["mhp","mmp","atk","def","agi","mag"];
  const result = {};

  for (let i = 0; i < stats.length; i++) {
    const key = stats[i];

    // 日付によるランダム誤差 -1〜+1
    const variance = ((dateSeed >> (i*4)) % 3) - 1;

    // 名前偏りをそのまま + 日付誤差
    let val = base[key] + variance;

    // 負の値は0に
    if (val < 0) val = 0;

    result[key] = val;
  }

  return result;
}

// =========================
// UI操作
// =========================

const signBtn = document.getElementById("signBtn");
const signArea = document.getElementById("signArea");
const submitCodeBtn = document.getElementById("submitCodeBtn");
const codeInput = document.getElementById("dailyCodeInput");

signBtn.addEventListener("click", () => {
  signArea.style.display = signArea.style.display === "none" ? "block" : "none";
  setUILock(true);
  pushLog("コード入力フォームを表示しました。");
});

// 正解時に20時間ロック付き
submitCodeBtn.addEventListener("click", () => {
  const userCode = codeInput.value.trim();
  if (!userCode) {
    setUILock(true);
    pushLog("コードを入力してください。");
    return;
  }

  const now = Date.now();

  // ロック中かチェック
  if (player.codeTimer && now < player.codeTimer) {
    const remainingHours = Math.ceil((player.codeTimer - now) / 1000 / 60 / 60);
    pushLog(`まだコードを入力できません。残り ${remainingHours}時間`);
    setUILock(false);
    return;
  }

  if (checkDailyCode(userCode)) {
    pushLog("正しいコード！報酬を付与しました。");

    // 20時間ロック
    player.codeTimer = now + 20 * 60 * 60 * 1000;

    // ステータス上昇（柔軟版）
    const boost = getDailyStatBoostFlexible(player.name);
    for (const key in boost) {
      if (typeof player[key] !== "number") player[key] = 0;
      player[key] += boost[key];
    }

    pushLog(`能力値が上昇！ ${Object.entries(boost)
      .map(([k,v]) => `${k.toUpperCase()}:${v}`)
      .join(", ")}`);

    // フォームを閉じる
    signArea.style.display = "none";
    setUILock(false);
    codeInput.value = "";
    renderStatus();
    autoSave();
  } else {
    setUILock(false);
    signArea.style.display = "none";
    pushLog("無効なコードです。");
  }
});






// -----幻想市場ボタン＆モーダル-----

const illusionShopBtn = document.getElementById("illusionShopBtn");

const illusionModal = document.getElementById("illusionShopModal");



illusionShopBtn.addEventListener("click", () => {

  illusionModal.style.display = "flex";

  showIllusionCategory("shop");

});



function closeModal(id) {

  document.getElementById(id).style.display = "none";

}



// シード乱数生成器

function mulberry32(a) {

  return function() {

    let t = a += 0x6D2B79F5;

    t = Math.imul(t ^ t >>> 15, t | 1);

    t ^= t + Math.imul(t ^ t >>> 7, t | 61);

    return ((t ^ t >>> 14) >>> 0) / 4294967296;

  }

}



// -----ショップアイテム生成（6時間固定）-----



function nameToSeed(name) {

  return [...name].reduce((a, c) => a + c.charCodeAt(0), 0);

}



function getShopItemWithVariance(baseItem, now) {

  const timeSeed = Math.floor(now / (6 * 60 * 60 * 1000));

  const seed = timeSeed + nameToSeed(baseItem.name);

  const rng = mulberry32(seed);



  const rate = 0.75 + rng() * 0.5; // 75%〜125%



  const item = structuredClone(baseItem);



  if (item.atk !== undefined)

    item.atk = Math.max(1, Math.round(item.atk * rate));

  if (item.def !== undefined)

    item.def = Math.max(1, Math.round(item.def * rate));



  // 表示＆保存用メタ

  item.shopRate = rate;

  item.isShopItem = true;



  return item;

}





function generateShopItems() {

  const now = Date.now();



  // 有効期限内

  if (player.phantasmFlag.shopItems.length > 0 && now < player.phantasmFlag.shopExpire) {

    return player.phantasmFlag.shopItems.map(name => {

      const base = Object.values({...weapons, ...armors, ...accessories})

        .find(i => i.name === name);

      return base ? getShopItemWithVariance(base, now) : null;

    }).filter(Boolean);

  }



  // 新規生成（ここだけ残す）

  const allItems = [...Object.values(weapons), ...Object.values(armors), ...Object.values(accessories)];

  const selected = [];



  const seed = Math.floor(now / (6 * 60 * 60 * 1000));

  const rng = mulberry32(seed);



  while (selected.length < 4 && allItems.length > 0) {

    const idx = Math.floor(rng() * allItems.length);

    selected.push(allItems[idx]);

    allItems.splice(idx, 1);

  }



  player.phantasmFlag.shopItems = selected.map(i => i.name);

  player.phantasmFlag.shopExpire = now + 6 * 60 * 60 * 1000;



  return selected.map(i => getShopItemWithVariance(i, now));

}





// -----冒険から戻ったときに5%で出現-----

function trySpawnIllusionShop() {

  if (player.phantasmFlag.shopActive) return; // すでに出現中



  if (Math.random() <= 0.05) {

    player.phantasmFlag.shopActive = true;

    generateShopItems();

    illusionShopBtn.style.display = "inline-block";

    pushLog("幻想市場が出現した！");

  }

}



// -----幻想市場 カテゴリ表示-----

function showIllusionCategory(category) {

  const list = document.getElementById("illusionList");

  list.innerHTML = "";



  let items = [];

  if (category === "weapon") items = player.weaponStorage;

  else if (category === "armor") items = player.armorStorage;

  else if (category === "accessory") items = player.accessoryStorage;

  else if (category === "shop") items = generateShopItems();



  if (items.length === 0) {

    const empty = document.createElement("p");

    empty.textContent = "アイテムがありません";

    list.appendChild(empty);

    return;

  }



  items.forEach(item => {

    const itemDiv = document.createElement('div');

    itemDiv.style.display = 'flex';

    itemDiv.style.flexDirection = 'column';

    itemDiv.style.marginBottom = '6px';

    itemDiv.style.padding = '4px 6px';

    itemDiv.style.borderBottom = '1px solid #444';

    itemDiv.style.fontSize = '0.9em';



    // 上段：装備名 + 値段

    const topDiv = document.createElement('div');

    topDiv.style.display = 'flex';

    topDiv.style.justifyContent = 'space-between';

    topDiv.style.alignItems = 'center';

    topDiv.style.marginBottom = '2px';



    const nameEl = document.createElement('div');

    nameEl.textContent = item.name || "無名";

    nameEl.style.fontWeight = '700';



    const priceEl = document.createElement('div');

    let topPrice = category === "shop" ? Math.floor((item.price || 0)/10) : Math.floor((item.price||0)/100);

    priceEl.textContent = `${topPrice} ⚛`;

    priceEl.style.fontSize = '0.8em';

    priceEl.style.color = '#aaa';



    topDiv.appendChild(nameEl);

    topDiv.appendChild(priceEl);



    // 下段：説明 + ボタン

    const bottomDiv = document.createElement('div');

    bottomDiv.style.display = 'flex';

    bottomDiv.style.justifyContent = 'space-between';

    bottomDiv.style.alignItems = 'center';



    const descEl = document.createElement('div');

    let effectText = '';

    if (item.point) effectText += `ポイント: ${item.point} `;

    if (item.atk) effectText += `ATK+${item.atk} `;

    if (item.def) effectText += `DEF+${item.def} `;

    if (item.effect) effectText += Object.entries(item.effect).map(([k,v])=>`${k}+${v}`).join(', ');

    descEl.textContent = effectText || '特記事項なし';

    descEl.style.fontSize = '0.8em';

    descEl.style.color = '#ccc';



    const btn = document.createElement('button');

    btn.style.fontSize = '0.75em';



    if (category === 'shop') {

      btn.textContent = '交換';

      btn.onclick = () => buyItem(item.name, category);

    } else {

      btn.textContent = '分解';

      btn.onclick = () => disassembleItem(item.name);

    } 



    bottomDiv.appendChild(descEl);

    bottomDiv.appendChild(btn);



    itemDiv.appendChild(topDiv);

    itemDiv.appendChild(bottomDiv);

    list.appendChild(itemDiv);

  });

}



// 分解処理（仮）

function disassembleItem(name) {

  pushLog(`${name}を分解しました（仮）`);

}



// 購入処理（仮）



function buyItem(name, category) {

  if (category !== "shop") return;



  const shopItems = generateShopItems();

  const shopItem = shopItems.find(i => i.name === name);

  if (!shopItem) return;



  const cost = Math.floor(shopItem.price / 10);

  if (player.phantasmCrystal < cost) {

    pushLog(`${name}を実体化できません（結晶不足）`);

    return;

  }



  player.phantasmCrystal -= cost;



// ★ ここが重要：完全コピーして保存

const ownedItem = structuredClone(shopItem);

delete ownedItem.isShopItem;  // 市場専用フラグ除去

delete ownedItem.shopRate;    // ショップ変動率も削除





  if (weapons[name.toLowerCase()]) player.weaponStorage.push(ownedItem);

  else if (armors[name.toLowerCase()]) player.armorStorage.push(ownedItem);

  else if (accessories[name.toLowerCase()]) player.accessoryStorage.push(ownedItem);



  pushLog(

    `幻水晶を使って${name}を実体化した！`

  );

  showIllusionCategory('shop');

}