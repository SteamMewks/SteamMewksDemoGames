// 武器データ一覧

const weapons = { //customは1辺り+1補正　weightは+2補正

//軽量武器 合計10　custom10
  knife1:         { name: "ナイフ", price: 500,　atk:4, def:0, dex:5, agi:2, mag:0, weight:0, skills: [], custom:10, flag:"shop"},
  knife2:         { name: "ダガー", price: 500,　atk:2, def:0, dex:3, agi:5, mag:0, weight:0, skills: [], custom:10, },
  knife3:         { name: "クリス", price: 500,　atk:4, def:0, dex:2, agi:4, mag:0, weight:0, skills: [], custom:10, },
  knife4:         { name: "スティレット", price: 500,　atk:5, def:0, dex:3, agi:2, mag:0, weight:0, skills: [], custom:10, },

//重量武器 合計12+weight
  axe1:         { name: "アックス", price: 500,　atk:11, def:1, dex:1, agi:2, mag:0, weight:3, skills: [], custom:8, flag:"shop"},
  axe2:         { name: "ハンマー", price: 500,　atk:14, def:0, dex:3, agi:1, mag:0, weight:3, skills: [], custom:8,},
  axe3:         { name: "モール", price: 500,　atk:16, def:4, dex:2, agi:0, mag:0, weight:5, skills: [], custom:8,},
  axe4:         { name: "トマホーク", price: 500,　atk:12, def:3, dex:4, agi:3, mag:0, weight:5, skills: [], custom:8,},

//剣 合計8　合計8　custom12　weight2
  sword1:         { name: "ファルシオン", price: 500,　atk:6, def:2, dex:3, agi:0, mag:5, weight:2, skills: [], custom:12, flag:"shop"},
  sword2:         { name: "エストック", price: 500,　atk:7, def:1, dex:2, agi:0, mag:6, weight:2, skills: [], custom:12,},
  sword3:         { name: "ブロードソード", price: 500,　atk:5, def:0, dex:3, agi:1, mag:7, weight:2, skills: [], custom:12,},
  sword4:         { name: "ツヴァイハンダー", price: 500,　atk:8, def:1, dex:1, agi:1, mag:5, weight:2, skills: [], custom:12,},


//軽量魔法武器　合計6　custom14
  book1:         { name: "ノート", price: 500,　atk:0, def:0, dex:1, agi:1, mag:4, weight:0, skills: [], custom:14, flag:"shop"},
  book2:         { name: "ブック", price: 500,　atk:0, def:0, dex:2, agi:1, mag:3, weight:0, skills: [], custom:14,},
  book3:         { name: "コーデックス", price: 500,　atk:0, def:2, dex:1, agi:1, mag:2, weight:0, skills: [], custom:14,},
  book4:         { name: "グリモワル", price: 500,　atk:0, def:0, dex:1, agi:0, mag:5, weight:0, skills: [], custom:14,},

//重量魔法武器　合計12　custom8　weight3
  rod1:         { name: "スティック", price: 500,　atk:0, def:1, dex:3, agi:3, mag:11, weight:3, skills: [], custom:8, flag:"shop"},
  rod2:         { name: "ワンド", price: 500,　atk:0, def:3, dex:3, agi:2, mag:10, weight:3, skills: [], custom:8,},
  rod3:         { name: "スタッフ", price: 500,　atk:0, def:2, dex:7, agi:1, mag:8, weight:3, skills: [], custom:8,},
  rod4:         { name: "ロッド", price: 500,　atk:0, def:5, dex:0, agi:0, mag:13, weight:3, skills: [], custom:8,},

//特殊武器
steamgun: { name: "ガン", atk: 15, weight: 25, price: 3000, skills: ["steamcharge", "steambastar", "steambomb"], flag: "shop"},


};

const weaponsAbility = {

//店売り専用
  howard:   { rare:1, name: "ハワードの", price: 1.0, custom: 5, flag:"shop"},

//換金用
  bronze:    { rare:2, name: "ブロンズ", price: 3.0,},
  silver:    { rare:3, name: "シルバー", price: 5.0, },
  gold:      { rare:4, name: "ゴールド", price: 10.0, },
  platinum:  { rare:5, name: "プラチナ", price: 20.0, },

//特殊能力付与
  steam:    { rare:3, name: "蒸機動式の", price: 3.0, skills: ["steamcharge", "steambastar", "steambomb"], },

//ステータス変動

  down1:    { rare:1, name: "破損した", price: 0.75, all:0.8},
  down2:    { rare:1, name: "粗悪な", price: 0.5, all:0.5},

  atkup1:    { rare:2, name: "バトル", price: 1.1, atk:1.1},
  defup1:    { rare:2, name: "ガード", price: 1.1, def:1.1},
  dexup1:    { rare:2, name: "テクニカル", price: 1.1, dex:1.1},
  agiup1:    { rare:2, name: "スピード", price: 1.1, agi:1.1},
  magup1:    { rare:2, name: "ミスティック", price: 1.1, mag:1.1},

  mhpup1:    { rare:3, name: "バイタル", price: 1.2, mhp:1.2},
  mmpup1:    { rare:3, name: "マナ", price: 1.2, mmp:1.2},

  barrier1:    { rare:4, name: "バリア", price: 1.3, hp:1.1},
  reserve1:    { rare:4, name: "リザーブ", price: 1.3, mp:1.1},

  atkup2:    { rare:4, name: "剛力の", price: 1.3, atk:1.3},
  defup2:    { rare:4, name: "守護の", price: 1.3, def:1.3},
  dexup2:    { rare:4, name: "巧みの", price: 1.3, dex:1.3},
  agiup2:    { rare:4, name: "俊足の", price: 1.3, agi:1.3},
  magup2:    { rare:4, name: "知性の", price: 1.3, mag:1.3},

  barrier2:    { rare:5, name: "陽光の", price: 1.5, mhp:1.5, hp:1.3},
  reserve2:    { rare:5, name: "月光の", price: 1.5, mmp:1.5, mp:1.3},

};






// 防具データ一覧

const armors = {
//重防具
  iron:        { name: "鉄の鎧",      def: 10, weight:5,  price: 600, flag:"shop"},
//軽量防具
  leather:     { name: "革の鎧",      def: 5, weight:3,  price: 320, flag:"shop"},
//魔法防具
  robe:        { name: "符号の法衣",  def:3,  mag:1, weight:1, price: 720, flag:"shop"},

};



const accessories = {

  // Auto: ステータス固定値増加

  ringOfPower: { 

    name: "力の指輪", 

    price: 150, 

    type: "Auto", 

    effect: { atk: 3 } 

  },

  amuletOfDefense: { 

    name: "防御のアミュレット", 

    price: 180, 

    type: "Auto", 

    effect: { def: 3 } 

  },

  bootsOfAgility: { 

    name: "敏捷のブーツ", 

    price: 200, 

    type: "Auto", 

    effect: { agi: 3 } 

  },

  bootsOfdex: { 

    name: "技巧の指輪", 

    price: 200, 

    type: "Auto", 

    effect: { dex: 3 } 

  },

  bootsOfmhp: { 

    name: "生命の指輪", 

    price: 200, 

    type: "Auto", 

    effect: { mhp: 50,} 

  },

  bootsOfmmp: { 

    name: "魔力の指輪", 

    price: 200, 

    type: "Auto", 

    effect: { mmp: 30 } 

  },


  circletOfMagic: { 

    name: "魔力のサークレット", 

    price: 220, 

    type: "Auto", 

    effect: { mag: 3 } 

  },






  // 手番終了時: HP/MP回復

  healingPendant: { 

    name: "癒しのペンダント", 

    price: 250, 

    type: "Setup", 

    effect: { hp: 3, mp: 1 } 

  },

  rejuvenationCharm: { 

    name: "再生のチャーム", 

    price: 300, 

    type: "Setup", 

    effect: { hp: 20 } 

  },


  // 被ダメージ時: 反射

  thornsBracelet: { 

    name: "とげのブレスレット", 

    price: 400, 

    type: "Counter", 

    effect: { reflect: 5 }  // 被ダメージの5%を反射など

  },



  // ダメージロール時: 与えるダメージ加算

  warGloves: { 

    name: "戦闘の手袋", 

    price: 500, 

    type: "Damageroll", 

    effect: { physical: 5 }  // 物理ダメージ+5

  },

  sorcerersRing: { 

    name: "魔導の指輪", 

    price: 550, 

    type: "Damageroll", 

    effect: { magical: 7 }  // 魔法ダメージ+7

  },

};



const ITEM_MASTER = {

  heal_s: {

    name: "冒険者ラムネ",

    price: 200,

    desc: "戦闘中、HPを少し回復する"

  },

  heal_m: {

    name: "滋養クッキー",

    price: 500,

    desc: "戦闘中、HPを中程度回復する"

  },

  heal_l: {

    name: "霊糖カプセル",

    price: 1000,

    desc: "戦闘中、HPを大きく回復する"

  },

  reverse: {

    name: "帰還の羽",

    price: 800,

    desc: "拠点へ瞬時に戻る"

  },

  life: {

    name: "ポーション",

    price: 5000,

    desc: "HPとMPを全回復する。戦闘中は使えない。"

  }

};