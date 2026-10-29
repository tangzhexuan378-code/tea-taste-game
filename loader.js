(function () {
  'use strict';
  var target = document.getElementById('app');
  var version = 'abcfaa5636ea';
  var finished = false;
  function showFailure() {
    if (window.TEA_GAME_READY || finished) return;
    target.innerHTML = '<section class="boot-state"><span class="boot-mark">✣</span><h1>这杯茶，正在路上。</h1><p>页面暂时未能加载完成。请点重新加载，或下载完整离线版后打开。</p><div class="boot-actions"><button class="btn primary" id="retry-game">重新加载 ↻</button><a class="btn" href="tea-offline.html" download="寻茶事务所.html">下载离线版 ↓</a></div></section>';
    document.getElementById('retry-game').onclick = function () { window.location.reload(); };
  }
  function load(name, next) {
    var script = document.createElement('script');
    script.src = name + '?v=' + version;
    script.async = true;
    script.onload = next;
    script.onerror = showFailure;
    document.body.appendChild(script);
  }
  window.TEA_BOOT_DONE = function () { finished = true; window.TEA_GAME_READY = true; };
  load('compat.js', function () {
    load('data.js', function () {
      load('details.js', function () {
        load('app.js', function () { if (!window.TEA_GAME_READY) showFailure(); });
      });
    });
  });
  window.setTimeout(showFailure, 20000);
})();
