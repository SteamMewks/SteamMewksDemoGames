// ====================
// ログテスト
// ====================

function testLogs() {
  pushLog('通常攻撃！12ダメージを与えた');
  pushLog('スキル攻撃！30ダメージを与えた');
  pushLog('<span style="color:red">装備</span>を購入し装備した。残金: 100G');
  pushLog('ゴールド50Gを手に入れた');
}

document.getElementById('logTestBtn').onclick = () => {
  testLogs();

  // -----幻想市場フラグを強制ON-----


player.atk += 4;
player.def += 4;
player.dex += 4;
player.agi += 4;
player.mag += 4;
player.mhp += 15;
player.mmp += 15;
player.level += 1;
player.sp += 1;

player.phantasmFlag.shopActive = true;       // フラグON
illusionShopBtn.style.display = "inline-block"; // ボタン表示
  pushLog('★ 幻想市場フラグを強制ONしました ★');

};
