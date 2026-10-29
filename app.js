"use strict";
const BRANDS = window.TEA_DATA || [];
const FLAVORS = { tea: "茶感", milk: "奶感", sweet: "甜感", texture: "咀嚼", fruit: "果香" };
const ALL = BRANDS.flatMap((b) => b.drinks.map((d) => ({ ...d, brand: b })));
const byId = new Map(ALL.map((d) => [d.id, d]));
const app = document.getElementById("app");
const dialog = document.getElementById("detail-dialog");
function readStore(key, fallback) {
  var _a;
  try {
    return (_a = JSON.parse(localStorage.getItem(key))) != null ? _a : fallback;
  } catch (e2) {
    return fallback;
  }
}
const storedSaved = readStore("tea-notebook-v1", {});
const state = { view: "home", mood: null, query: "", mode: "brands", category: "全部", city: "全部城市", region: "全部地区", sort: "default", limit: 12, saved: storedSaved && typeof storedSaved === "object" && !Array.isArray(storedSaved) ? storedSaved : {}, compare: [], savedFilter: "all", answers: readStore("tea-quiz-v1", {}), step: 0, resultLimit: 9 };
if (!state.answers || typeof state.answers !== "object" || Array.isArray(state.answers)) state.answers = {};
const CITIES = [...new Set(BRANDS.flatMap((b) => [...b.cities, ...b.stores.map((s) => s.city)]))].filter(Boolean).sort((a, b) => a.localeCompare(b, "zh-CN"));
const e = (s) => String(s != null ? s : "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const safeUrl = (u) => /^https?:\/\//i.test(u || "") ? e(u) : "#";
const cut = (s, n) => String(s || "").length > n ? String(s).slice(0, n) + "…" : String(s || "");
const money = (p, c) => p == null ? "价格待核实" : (c === "TWD" ? "NT$" : "¥") + p;
const priceHTML = (d) => {
  if (d.referencePriceRange) return '<span class="price-block"><span class="price">'.concat(e(d.brand.currency === "TWD" ? "NT$" : "¥")).concat(e(d.referencePriceRange.join("–")), '</span><small class="price-context">媒体区间 · ').concat(e(d.priceYear || "日期未注明"), "</small></span>");
  if (d.referencePrice == null) return '<span class="price unknown">价格待核实</span>';
  return '<span class="price-block"><span class="price">'.concat(e(money(d.referencePrice, d.brand.currency)), '</span><small class="price-context">').concat(e(d.priceKind || "菜单参考"), " · ").concat(e(d.priceYear || "日期未注明"), "</small></span>");
};
const colorSets = [["#eee2d3", "#b69575", "#e1cdb4"], ["#e5e9dd", "#9baf81", "#d5dfc5"], ["#ecdee1", "#c293a0", "#e4c8cf"], ["#e9e1d8", "#9a7c62", "#d1b896"], ["#e6e1eb", "#aa97b3", "#d8c7e0"], ["#e9e7d9", "#b1ab78", "#e0dcb5"]];
function theme(d) {
  const t = d.tags.join("");
  return /抹茶|茉莉|绿茶|青茶|花香/.test(t) ? colorSets[1] : /芋|紫/.test(t) ? colorSets[4] : /葡萄|莓|桃|玫瑰/.test(t) ? colorSets[2] : d.profile.fruit >= 4 ? colorSets[5] : d.profile.tea >= 4 ? colorSets[3] : colorSets[0];
}
let artSerial = 0;
function cup(d, label = "", hero = false) {
  const colors = theme(d), k = "c" + ++artSerial, milk = d.profile.milk, texture = d.profile.texture, fruit = d.profile.fruit;
  const base = milk >= 3 ? fruit >= 4 ? colors[2] : "#dcc4a1" : fruit >= 4 ? "#cfaa64" : colors[1];
  const pearls = texture >= 3 ? Array.from({ length: texture >= 4 ? 19 : 9 }, (_, i) => {
    const x = 52 + i % 5 * 21 + Math.floor(i / 5) % 2 * 7, y = 286 - Math.floor(i / 5) * 19;
    return '<circle cx="'.concat(x, '" cy="').concat(y, '" r="8.1" fill="').concat(/芋/.test(d.tags.join("")) ? "#a08a9c" : "#655043", '" opacity=".85"/><circle cx="').concat(x - 2, '" cy="').concat(y - 2, '" r="2.2" fill="#fff" opacity=".12"/>');
  }).join("") : "";
  const leaves = milk < 2 ? '<path d="M62 145q60 40 87 13M52 193q60-29 104 4" stroke="#80624c" stroke-width="2" fill="none" opacity=".13"/>' : "";
  return '<svg class="cup-art" viewBox="0 0 210 350" role="img" aria-label="'.concat(e(label || d.name), '风味示意插画"><defs><linearGradient id="').concat(k, 'g" x1="0" x2="1"><stop stop-color="#fff" stop-opacity=".45"/><stop offset=".35" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#4f3a26" stop-opacity=".14"/></linearGradient><linearGradient id="').concat(k, 'l" x1="0" y1="0" x2="0" y2="1"><stop stop-color="').concat(base, '"/><stop offset="1" stop-color="').concat(milk >= 4 ? "#e6cfac" : colors[1], '"/></linearGradient><clipPath id="').concat(k, 'c"><path d="M29 79h152l-16 228q-59 16-120 0z"/></clipPath></defs><path d="M118 10h13l-4 89h-13z" fill="').concat(hero ? "#68534d" : "#88716b", '"/><path d="M119 10h4l-4 89h-4z" fill="#fff" opacity=".18"/><g clip-path="url(#').concat(k, 'c)"><path d="M29 79h152l-16 228q-59 16-120 0z" fill="#f1e4ce"/><path d="M29 ').concat(milk >= 3 ? 102 : 92, 'h152v230H29z" fill="url(#').concat(k, 'l)"/>').concat(milk >= 3 ? '<path d="M24 93q35-13 73 0t90-2v48q-38-16-78-5t-85-8z" fill="#f4e8cd" opacity=".85"/>' : "").concat(leaves).concat(pearls, '<path d="M29 79h152l-16 228q-59 16-120 0z" fill="url(#').concat(k, 'g)"/><path d="M42 95l11 191" stroke="#fff" stroke-width="6" opacity=".2" stroke-linecap="round"/><ellipse cx="98" cy="183" rx="34" ry="37" fill="#f8f2e6" opacity=".94"/><text x="98" y="181" text-anchor="middle" fill="#725b58" font-size="24" font-family="serif">茶</text><text x="98" y="199" text-anchor="middle" fill="#9a8277" font-size="6" letter-spacing="2">THE NEXT SIP</text></g><path d="M29 79h152l-16 228q-59 16-120 0z" fill="none" stroke="#a7977b" stroke-opacity=".25" stroke-width="1.2"/><ellipse cx="105" cy="79" rx="81" ry="12" fill="#d5c6b1"/><ellipse cx="105" cy="75" rx="82" ry="12" fill="#f7f0e2"/><ellipse cx="105" cy="74" rx="76" ry="8" fill="#e7dbca"/><path d="M34 77q69 13 141 0" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/></svg>');
}
const example = (id, fallback) => {
  var _a;
  return ((_a = BRANDS.find((b) => b.name.includes(id))) == null ? void 0 : _a.drinks[0]) ? { ...BRANDS.find((b) => b.name.includes(id)).drinks[0], brand: BRANDS.find((b) => b.name.includes(id)) } : ALL[fallback || 0];
};
const sourceCount = BRANDS.reduce((n, b) => n + b.sources.length, 0);
const knownPrices = ALL.filter((d) => d.referencePrice != null || d.referencePriceRange).length;
const storeCount = BRANDS.reduce((n, b) => n + b.stores.length, 0);
function persist() {
  try {
    localStorage.setItem("tea-notebook-v1", JSON.stringify(state.saved));
    localStorage.setItem("tea-quiz-v1", JSON.stringify(state.answers));
  } catch (e2) {
    toast("浏览器存储暂不可用，本次选择仍保留在页面中");
  }
  updateSaveCount();
}
function updateSaveCount() {
  document.getElementById("save-count").textContent = Object.keys(state.saved).filter((id) => byId.has(id)).length;
}
function toast(s) {
  const t = document.getElementById("toast");
  t.textContent = s;
  t.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}
function navigate(v, opts = {}) {
  state.view = v;
  if (v === "atlas" && !Object.prototype.hasOwnProperty.call(opts, "mood")) state.mood = null;
  Object.assign(state, opts);
  state.limit = 12;
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
}
function render() {
  document.querySelector('[data-nav="atlas"] sup').textContent = BRANDS.length;
  document.querySelectorAll("[data-nav]").forEach((n) => n.classList.toggle("active", n.dataset.nav === (["quiz", "result", "duel"].includes(state.view) ? "home" : state.view)));
  app.innerHTML = ({ home, atlas, cities, saved, quiz, result: results, duel }[state.view] || home)();
  if (state.view === "result") app.querySelector(".result-hero").insertAdjacentHTML("afterend", '<section class="duel-invite"><div><span class="eyebrow">ONE MORE LITTLE GAME</span><h3>隐藏品牌，你还会选同一杯吗？</h3><p>三轮风味盲选，跟着描述选更想喝的一杯，让推荐再靠近你一点。</p></div><button class="btn primary" data-action="duel-start">来一场风味对决 ↗</button></section>');
  app.classList.add("fade-in");
  setTimeout(() => app.classList.remove("fade-in"), 400);
  updateSaveCount();
  renderTray();
}
function home() {
  const a = example("阿嬷", 0), b = example("霸王", 1), c = ALL.find((d) => d.profile.fruit >= 4) || ALL[2];
  if (!a) return '<div class="empty">饮品资料加载中，请稍后刷新。</div>';
  return '<section class="hero"><div class="hero-copy"><div class="eyebrow">一场关于口味的小小探险</div><h1>下一杯，<br>刚好是你的<em>那一杯。</em></h1><p class="hero-desc">茶香浓一点，还是奶香多一点？<br>从一颗珍珠到一缕茉莉，在 '.concat(BRANDS.length, ' 个茶饮品牌里，<br>找到与你的口味合拍的那杯奶茶。</p><div class="hero-buttons"><button class="btn primary" data-action="start">开启口味探险 <span class="arrow">↗</span></button><button class="btn" data-action="atlas">随心逛逛图鉴 <span>→</span></button></div><div class="hero-micro"><span class="status-dot"></span> 8 个小选择 · 约 2 分钟 · 认识自己的口味</div></div><div class="hero-art" aria-label="三杯不同风味的茶饮插画"><div class="art-oval"></div><span class="orbit-text">a little tea, a little happiness.</span><span class="floating-note one">茶香、奶香，和一点点心动</span><div class="hero-cup one">').concat(cup(a, "醇厚奶茶", true), '</div><div class="hero-cup two">').concat(cup(b, "清香鲜奶茶", true), '</div><div class="hero-cup three">').concat(cup(c, "清爽果茶", true), '</div><span class="floating-note two">总有一杯，正合你意</span><div class="stamp"><small>SIP & DISCOVER</small><strong>寻味</strong><small>EST. 2026</small></div></div></section>\n <div class="stats-strip"><div class="stat"><b>').concat(BRANDS.length, '</b><span>茶饮品牌<br>从熟悉到新发现</span></div><div class="stat"><b>').concat(ALL.length, '</b><span>代表饮品<br>每家精选 4 款</span></div><div class="stat"><b>5</b><span>口味维度<br>细细拆解你的偏好</span></div><div class="stat"><b>∞</b><span>喝茶的可能<br>每次都有新灵感</span></div></div>\n <section class="section"><div class="section-heading"><div><h2>今天，想喝哪种心情？</h2><p>跟着此刻的直觉，先打开一页风味图鉴。</p></div><button class="text-link" data-action="atlas">看看全部 <span>↗</span></button></div><div class="mood-grid">').concat([["TEA FIRST", "茶香清醒派", "让茶的香气先说话", "叶", "tea"], ["MILK MOMENT", "奶香治愈派", "一口醇厚，慢慢放松", "乳", "milk"], ["SOMETHING TO CHEW", "咀嚼快乐派", "每一口都有小小惊喜", "丸", "texture"], ["FRUIT ESCAPE", "果香放风派", "给今天加一点清爽", "果", "fruit"]].map((x) => '<button class="mood-card" data-mood="'.concat(x[4], '"><small>').concat(x[0], '</small><span class="mood-icon">').concat(x[3], "</span><h3>").concat(x[1], "</h3><p>").concat(x[2], '</p><span class="mood-arrow">↗</span></button>')).join(""), '</div></section>\n <div class="brand-band"><span>一点点</span><span>阿嬷手作</span><span style="font-family:Georgia,serif;font-size:24px">KOI Thé</span><span>喜茶 HEYTEA</span><span>霸王茶姬</span><span class="fine">还有 ').concat(BRANDS.length - 5, ' 个品牌，等你发现 ↗</span></div>\n <section class="section"><div class="section-heading"><div><h2>从这三杯，开始认识奶茶</h2><p>经典的意义，是让自己的口味有一个起点。</p></div><span class="eyebrow">THE EDITOR\'S PICKS</span></div><div class="editor-grid">').concat([a, example("一点点", 3), example("KOI", 4)].map((d, i) => '<button class="editor-card" data-drink="'.concat(e(d.id), '" style="--wash:').concat(theme(d)[0], '"><div class="mini-art">').concat(cup(d), '</div><div class="editor-info"><small>0').concat(i + 1, " / ").concat(e(d.brand.name), "</small><h3>").concat(e(d.name), "</h3><p>").concat(e(cut(d.description, 42)), "</p></div></button>")).join(""), '</div></section>\n <div class="editorial-note"><div><h3>一杯奶茶，值得多了解一点。</h3><p>图鉴收录中国大陆与台湾地区的代表茶饮。每款都可以查看口味分析、来源价格与门店记录，味觉描述来自编辑整理，帮你找到下次点单的方向。</p></div><button class="text-link" data-action="method">翻开研究手记 <span>↗</span></button></div>');
}
function cityOptions(value, allLabel = "全部城市") {
  return '<option value="'.concat(allLabel, '">').concat(allLabel, "</option>").concat(CITIES.map((c) => "<option ".concat(value === c ? "selected" : "", ">").concat(e(c), "</option>")).join(""));
}
function filters() {
  return '<div class="filter-toolbar"><label class="search-box"><span>⌕</span><input id="catalog-search" placeholder="搜索品牌、饮品或原料，例如：KOI、茉莉、芋泥" aria-label="搜索品牌饮品" value="'.concat(e(state.query), '"></label><select id="region-filter" aria-label="地区筛选">').concat(["全部地区", "中国大陆", "中国台湾"].map((x) => "<option ".concat(state.region === x ? "selected" : "", ">").concat(x, "</option>")).join(""), '</select><select id="city-filter" aria-label="城市筛选">').concat(cityOptions(state.city), '</select><select id="sort-filter" aria-label="排序">').concat([["default", "图鉴顺序"], ["price-up", "参考价从低到高"], ["price-down", "参考价从高到低"]].map((x) => '<option value="'.concat(x[0], '" ').concat(state.sort === x[0] ? "selected" : "", ">").concat(x[1], "</option>")).join(""), '</select><div class="segmented"><button data-mode="brands" class="').concat(state.mode === "brands" ? "active" : "", '">看品牌</button><button data-mode="drinks" class="').concat(state.mode === "drinks" ? "active" : "", '">看饮品</button></div></div><div class="chip-row">').concat(["全部", "鲜奶茶", "经典奶茶", "奶盖茶", "果茶", "纯茶", "厚乳茶", "咀嚼系"].map((x) => '<button class="chip '.concat(state.category === x ? "active" : "", '" data-category="').concat(x, '">').concat(x, "</button>")).join(""), "</div>");
}
function getFiltered() {
  let items = ALL.filter((d) => {
    const q = state.query.toLowerCase().trim();
    return (!state.mood || (state.mood === "tea" ? d.profile.tea >= 4 && d.profile.milk <= 3 : d.profile[state.mood] >= 4)) && (!q || [d.name, d.brand.name, d.brand.en, ...d.ingredients, ...d.tags].join(" ").toLowerCase().includes(q)) && (state.category === "全部" || d.category === state.category) && (state.region === "全部地区" || d.brand.region === state.region) && (state.city === "全部城市" || d.brand.cities.includes(state.city) || d.brand.stores.some((s) => s.city === state.city));
  });
  if (state.sort !== "default") items.sort((a, b) => {
    if (a.brand.currency !== b.brand.currency) return a.brand.currency === "CNY" ? -1 : 1;
    if (a.referencePrice == null) return 1;
    if (b.referencePrice == null) return -1;
    return state.sort === "price-up" ? a.referencePrice - b.referencePrice : b.referencePrice - a.referencePrice;
  });
  return items;
}
function atlas() {
  return '<div class="page-heading"><div><div class="eyebrow">THE SIP ENCYCLOPEDIA</div><h1>每一种喜欢，都有迹可循。</h1><p>'.concat(BRANDS.length, " 个品牌 · ").concat(ALL.length, ' 款代表茶饮 · 自己慢慢翻，也很好</p></div><button class="btn primary" data-action="start">帮我选一杯 ↗</button></div>').concat(filters(), '<div id="catalog-results">').concat(catalogResults(), "</div>");
}
function catalogResults() {
  const items = getFiltered(), brands = [...new Set(items.map((d) => d.brand))];
  return '<div class="results-meta"><span>'.concat(state.mood ? { tea: "茶香清醒派", milk: "奶香治愈派", texture: "咀嚼快乐派", fruit: "果香放风派" }[state.mood] + " · " : "", "找到 ").concat(brands.length, " 个品牌 · ").concat(items.length, " 款饮品").concat(state.city !== "全部城市" ? " · 城市为已收集记录，部分品牌仅收录代表门店" : "", "</span><span>币种分组排序 · 参考价详见原始菜单</span></div>").concat(items.length ? (state.mode === "brands" ? '<div class="brand-grid">'.concat(brands.slice(0, state.limit).map((b) => brandCard(b, items.filter((d) => d.brand === b))).join(""), "</div>") : '<div class="catalog-grid">'.concat(items.slice(0, state.limit).map((d) => drinkCard(d)).join(""), "</div>")) + ((state.mode === "brands" ? brands.length : items.length) > state.limit ? '<div class="load-more"><button class="btn" data-action="more">再翻一页 <span>↓</span></button></div>' : '<div class="load-more"><span class="results-meta">这一页风味，已经全部展开。</span></div>') : empty("这次还没遇到合拍的一杯", "换一个关键词或城市试试看。城市筛选基于来源记录，收录范围会影响结果。", "重置筛选", "reset-filters"));
}
function brandCard(b, items = b.drinks) {
  return '<article class="brand-card" style="--wash:'.concat(theme({ ...b.drinks[0] })[0], '"><div class="brand-card-top"><span class="brand-seal">').concat(e(b.name.slice(0, 1)), '</span><div><h3><button data-brand="').concat(e(b.id), '">').concat(e(b.name), '</button></h3><div class="en">').concat(e(b.en || b.focus), "</div></div></div><p>").concat(e(b.intro), '</p><div class="brand-drink-list">').concat(items.map((d) => '<button data-drink="'.concat(e(d.id), '">').concat(e(d.name), " ↗</button>")).join(""), '</div><div class="brand-footer"><span>').concat(b.priceRange ? e((b.currency === "TWD" ? "NT$" : "¥") + b.priceRange.join("–")) + " · 已收录参考价" : "价格待门店核实", '</span><button data-brand="').concat(e(b.id), '">品牌手记 ↗</button></div></article>');
}
function drinkCard(d, score = null) {
  var _a, _b;
  const saved2 = !!state.saved[d.id], compared = state.compare.includes(d.id);
  return '<article class="drink-card" style="--wash:'.concat(theme(d)[0], '"><div class="drink-picture" data-drink="').concat(e(d.id), '" role="button" tabindex="0" aria-label="查看').concat(e(d.name), '"><span class="type-label">').concat(e(d.category), '</span><div class="cup-wrap">').concat(cup(d), "</div>").concat(score !== null ? '<span class="score-badge">口味契合 '.concat(score, " / 100</span>") : "", '</div><button class="save-button ').concat(saved2 ? "saved" : "", '" data-save="').concat(e(d.id), '" aria-label="').concat(saved2 ? "取消收藏" : "收藏").concat(e(d.name), '" aria-pressed="').concat(saved2, '">').concat(saved2 ? "♥" : "♡", '</button><div class="drink-info"><div class="drink-top"><button data-brand="').concat(e(d.brand.id), '">').concat(e(d.brand.name), "</button><span>").concat(d.brand.currency === "TWD" ? "台湾地区" : "中国大陆", '</span></div><h3><button data-drink="').concat(e(d.id), '">').concat(e(d.name), '</button></h3><p class="desc">').concat(e(d.description), '</p><div class="tag-row">').concat(d.tags.slice(0, 3).map((t) => '<span class="tag">'.concat(e(t), "</span>")).join(""), "</div>").concat(score !== null ? '<div class="match-reason">'.concat(e(matchReason(d)), "</div>") : "", '<div class="card-bottom">').concat(priceHTML(d), '<button class="compare-btn ').concat(compared ? "selected" : "", '" data-compare="').concat(e(d.id), '">').concat(compared ? "✓ 已加入" : "＋ 比一比", "</button></div>").concat(state.view === "saved" ? '<button class="taste-button" data-taste="'.concat(e(d.id), '">').concat(((_a = state.saved[d.id]) == null ? void 0 : _a.tasted) ? "✦ 编辑喝后感" : "○ 标记喝过 / 写笔记", "</button>") : "", "</div>").concat(state.view === "saved" && ((_b = state.saved[d.id]) == null ? void 0 : _b.tasted) ? '<div class="tasted-bar"><span>已尝过 · '.concat("★".repeat(state.saved[d.id].rating || 0), "</span><span>茶本 +1</span></div>") : "", "</article>");
}
function empty(title, desc, label, action) {
  return '<div class="empty"><div class="big">✣</div><h3>'.concat(title, "</h3><p>").concat(desc, "</p>").concat(action ? '<button class="btn primary" data-action="'.concat(action, '">').concat(label, " ↗</button>") : "", "</div>");
}
function storeCard(s, b) {
  const q = encodeURIComponent(b.name + " " + s.name + " " + s.address), map = b.currency === "TWD" ? "https://www.google.com/maps/search/?api=1&query=".concat(q) : "https://uri.amap.com/search?keyword=".concat(q, "&city=").concat(encodeURIComponent(s.city), "&src=tea-lab&callnative=0");
  const source = b.sources.find((x) => x.id === s.sourceId);
  return '<article class="store-card"><div class="store-brand">'.concat(e(b.name), " · ").concat(e(s.city), "</div><h3>").concat(e(s.name || b.name), "</h3><p>").concat(e(s.address || "具体地址待核实"), "</p><small>").concat(e(s.status || "来源记录，出行前复核"), " ").concat((source == null ? void 0 : source.publishedAt) ? "· 来源日期 " + e(source.publishedAt) : "· 来源日期未注明", '</small><div class="store-links"><a href="').concat(safeUrl(map), '" target="_blank" rel="noopener noreferrer">地图搜索 ↗</a>').concat(source ? '<a href="'.concat(safeUrl(source.url), '" target="_blank" rel="noopener noreferrer">地址出处 ↗</a>') : "", '<button data-brand="').concat(e(b.id), '">看品牌</button></div></article>');
}
function getStores() {
  return BRANDS.flatMap((b) => b.stores.map((s) => ({ s, b }))).filter((entry) => (state.city === "全部城市" || entry.s.city === state.city) && (!state.query || [entry.b.name, entry.s.name, entry.s.address, entry.s.city].join(" ").toLowerCase().includes(state.query.toLowerCase())));
}
function storeResults() {
  const stores = getStores();
  return '<div class="results-meta">'.concat(stores.length, ' 条门店记录 · 地址按来源保留</div><div class="store-grid">').concat(stores.slice(0, state.limit).map((entry) => storeCard(entry.s, entry.b)).join(""), "</div>").concat(!stores.length ? empty("这座城市，等着补上更多茶香", "先试试全国探索，或从品牌手记进入官方门店查询。", "全国探索", "all-cities") : stores.length > state.limit ? '<div class="load-more"><button class="btn" data-action="more">继续探索 ↓</button></div>' : "");
}
function cities() {
  return '<div class="page-heading"><div><div class="eyebrow">TEA, AROUND THE CORNER</div><h1>带着口味，去一座城。</h1><p>把想喝的一杯，放进下一次出门的计划里。</p></div></div><div class="city-layout"><aside class="city-sidebar"><h3>想去哪个城市？</h3><div class="city-buttons"><button class="chip '.concat(state.city === "全部城市" ? "active" : "", '" data-city="全部城市">全国探索</button>').concat(CITIES.map((c) => '<button class="chip '.concat(state.city === c ? "active" : "", '" data-city="').concat(e(c), '">').concat(e(c), "</button>")).join(""), '</div><p class="city-info">这里收录的是有来源的代表门店，共 ').concat(storeCount, ' 条地址记录。地图链接会搜索该地址；营业时间与开店状态请在出行前向门店确认。</p></aside><div><label class="search-box" style="display:block;margin-bottom:18px"><span>⌕</span><input id="store-search" aria-label="搜索门店" value="').concat(e(state.query), '" placeholder="搜索品牌、商圈或街道"></label><div id="store-results">').concat(storeResults(), "</div></div></div>");
}
function saved() {
  const entries = ALL.filter((d) => state.saved[d.id]), tasted = entries.filter((d) => state.saved[d.id].tasted), brandN = new Set(tasted.map((d) => d.brand.id)).size;
  const items = entries.filter((d) => state.savedFilter === "all" || (state.savedFilter === "tasted" ? state.saved[d.id].tasted : !state.saved[d.id].tasted));
  return '<div class="page-heading"><div><div class="eyebrow">MY LITTLE TEA NOTEBOOK</div><h1>把每一次喜欢，慢慢记下来。</h1><p>收藏想喝的茶，留下自己的喝后感。茶本保存在当前浏览器。</p></div><button class="btn" data-action="atlas">再找一杯 ↗</button></div><div class="saved-summary"><div><h3>'.concat(entries.length ? "已经遇见 ".concat(entries.length, " 杯心动") : "你的第一杯心动，值得收藏", "</h3><p>想喝 ").concat(entries.length - tasted.length, " 杯 · 喝过 ").concat(tasted.length, " 杯 · 探访 ").concat(brandN, ' 个品牌</p></div><div class="badge-row">').concat([["✧", "初次心动", entries.length >= 1], ["葉", "尝茶新人", tasted.length >= 1], ["✣", "风味漫游", brandN >= 5], ["茶", "十杯茶客", tasted.length >= 10]].map((x) => '<div class="achievement '.concat(x[2] ? "earned" : "", '"><div class="badge">').concat(x[0], "</div>").concat(x[1], "</div>")).join(""), '</div></div><div class="chip-row">').concat([["all", "全部收藏"], ["wishlist", "想喝清单"], ["tasted", "我的喝后感"]].map((x) => '<button class="chip '.concat(state.savedFilter === x[0] ? "active" : "", '" data-saved-filter="').concat(x[0], '">').concat(x[1], "</button>")).join(""), "</div>").concat(items.length ? '<div class="catalog-grid">'.concat(items.map((d) => drinkCard(d)).join(""), '</div><div style="height:40px"></div>') : empty("先给一杯奶茶，留个位置", "在饮品卡片上点一下爱心，就能把它收进茶本。喝过以后，还可以写下评分和自己的口味笔记。", "去翻饮品图鉴", "atlas"));
}
const STEPS = [
  { key: "location", title: "这一杯，准备在哪里遇见？", desc: "全国探索默认使用人民币。台湾地区菜单以新台币单独记录。" },
  { key: "aroma", title: "哪一种茶香，会让你回头？", desc: "想象刚打开杯盖的那一刻，先选最吸引你的香气。", options: [["jasmine", "花香清雅", "茉莉、栀子与清新的绿茶香", "花"], ["oolong", "焙香悠长", "乌龙、铁观音与烘焙香", "焙"], ["black", "红茶醇香", "红茶、伯爵与熟成的茶韵", "红"], ["any", "都想尝一口", "给不同茶底一个机会", "✧"]] },
  { key: "milk", title: "茶与奶，你想怎么分配？", desc: "选的是风味偏好；具体乳制品成分以门店配方为准。", options: [[1, "让茶唱主角", "茶味清楚，奶香轻一点", "茶"], [3, "各占一半的默契", "茶香和奶感都能尝到", "和"], [5, "奶香把我包围", "饱满、柔和，像一份小甜点", "乳"]] },
  { key: "sweet", title: "今天，想要几分甜？", desc: "配料和果汁也会带来甜味，点单糖度可以再按自己习惯调整。", options: [[1, "清淡一些", "想把茶本身喝得清楚", "淡"], [2, "一点点甜就好", "微甜，喝起来轻松", "微"], [3, "刚刚好的日常甜", "甜味和茶香互相照应", "适"], [5, "给自己一口甜点", "浓郁甜香也很喜欢", "甜"]] },
  { key: "texture", title: "喝奶茶时，嘴巴也要忙起来吗？", desc: "从顺滑茶汤，到珍珠与芋泥，选自己的快乐。", options: [[1, "一口顺顺喝完", "更喜欢茶汤本身", "顺"], [3, "来一点小惊喜", "少量珍珠或茶冻就好", "冻"], [5, "每一口都想嚼", "珍珠、芋泥与多重小料", "丸"]] },
  { key: "fruit", title: "要不要，溜进一座小果园？", desc: "果茶也在候选里，给奶茶日常添一点变化。", options: [[1, "今天专心喝茶奶", "纯粹的茶香与奶香", "茗"], [3, "有一点果香就好", "茶和水果轻轻搭个伴", "柚"], [5, "果香越明显越开心", "鲜果、酸甜与清爽感", "果"]] },
  { key: "budget", title: "给这份小快乐，留多少预算？", desc: "预算按有出处的常规菜单参考价筛选。历史价、活动价和未知价暂时移开。" },
  { key: "adventure", title: "最后，想怎样遇见下一杯？", desc: "决定推荐里留多少位置，给还没尝试过的风味。", options: [["comfort", "熟悉的好喝", "先找最贴近当前偏好的味道", "稳"], ["discover", "给新口味一点位置", "前几杯合拍，也留一杯探索", "游"]] }
];
function quiz() {
  var _a;
  const q = STEPS[state.step], answer = state.answers[q.key], currency = ((_a = state.answers.location) == null ? void 0 : _a.currency) || "CNY";
  let body = "";
  if (q.key === "location") {
    const loc = answer || { city: "全国探索", currency: "CNY" };
    body = '<div class="quiz-city"><div class="eyebrow" style="justify-content:center">先给这杯茶一个坐标</div><select id="quiz-market" aria-label="选择菜单地区"><option value="CNY" '.concat(loc.currency === "CNY" ? "selected" : "", '>全国探索 · 人民币菜单</option><option value="TWD" ').concat(loc.currency === "TWD" ? "selected" : "", '>台湾地区探索 · 新台币菜单</option></select><br><select id="quiz-city" aria-label="选择喝茶城市"><option>全国探索</option>').concat(CITIES.filter((c) => BRANDS.some((b) => b.currency === loc.currency && (b.cities.includes(c) || b.stores.some((s) => s.city === c)))).map((c) => "<option ".concat(loc.city === c ? "selected" : "", ">").concat(e(c), "</option>")).join(""), "</select><p>城市筛选依据已收录的城市和代表门店，结果可能覆盖该品牌的部分门店。</p></div>");
  } else {
    let options = q.options;
    if (q.key === "budget") options = currency === "TWD" ? [[50, "NT$50 以内", "日常小预算", "小"], [80, "NT$80 以内", "给喜欢的奶茶多一点空间", "中"], [120, "NT$120 以内", "尝尝更丰富的选择", "丰"], [0, "随口味走", "也看看价格尚待核实的饮品", "∞"]] : [[10, "¥10 以内", "轻松日常，也有好喝的", "小"], [18, "¥18 以内", "大多数日子的快乐预算", "中"], [28, "¥28 以内", "试试手作与丰富的配料", "丰"], [0, "随口味走", "也看看价格尚待核实的饮品", "∞"]];
    body = '<div class="quiz-options">'.concat(options.map((o, i) => '<button class="quiz-option '.concat(answer === o[0] ? "selected" : "", '" data-answer="').concat(e(String(o[0])), '"><span class="option-icon" style="--optwash:').concat(colorSets[i % 6][0], '">').concat(o[3], "</span><span><h3>").concat(o[1], "</h3><p>").concat(o[2], '</p></span><span class="option-check">').concat(answer === o[0] ? "●" : "○", "</span></button>")).join(""), "</div>");
  }
  return '<section class="quiz-shell"><div class="quiz-topline"><button data-action="home">← 回事务所</button><span>口味探险 · '.concat(String(state.step + 1).padStart(2, "0"), ' / 08</span><button data-action="restart">重新选择 ↻</button></div><div class="progress-track"><div style="width:').concat((state.step + 1) / 8 * 100, '%"></div></div><div class="quiz-title"><div class="qnum">A little closer to your perfect sip</div><h1>').concat(q.title, "</h1><p>").concat(q.desc, "</p></div>").concat(body, '<div class="quiz-bottom"><button data-action="quiz-back" ').concat(state.step === 0 ? "disabled" : "", '>← 上一个选择</button><span>跟着直觉就好，稍后可以重新选择</span><button class="btn primary" data-action="quiz-next" ').concat(q.key !== "location" && answer === void 0 ? "disabled" : "", ">").concat(state.step === 7 ? "看看我的口味" : "下一个选择", " ↗</button></div></section>");
}
function targetProfile() {
  var _a, _b, _c, _d;
  return { tea: state.answers.aroma === "jasmine" ? 3 : state.answers.aroma === "any" ? 3 : 4, milk: Number((_a = state.answers.milk) != null ? _a : 3), sweet: Number((_b = state.answers.sweet) != null ? _b : 3), texture: Number((_c = state.answers.texture) != null ? _c : 3), fruit: Number((_d = state.answers.fruit) != null ? _d : 1) };
}
function aromaMatch(d) {
  const tags = d.tags.join(" "), key = state.answers.aroma;
  return key === "jasmine" ? /茉莉|栀子|桂花|花香|兰香|绿茶/.test(tags) : key === "oolong" ? /乌龙|铁观音|焙|岩|大红袍/.test(tags) : key === "black" ? /红茶|伯爵|熟成|正山/.test(tags) : true;
}
function scoreDrink(d) {
  const t = targetProfile(), weights = { tea: 1.1, milk: 1.4, sweet: 1.2, texture: 1.1, fruit: 1.2 };
  const delta = Object.keys(t).reduce((n, k) => n + Math.abs(d.profile[k] - t[k]) * weights[k], 0) / 24;
  let value = Math.round(100 - delta * 75 - (aromaMatch(d) ? 0 : 8));
  return Math.max(15, Math.min(99, value));
}
function ranked() {
  const loc = state.answers.location || { city: "全国探索", currency: "CNY" }, budget = Number(state.answers.budget || 0);
  return ALL.filter((d) => d.brand.currency === loc.currency && (loc.city === "全国探索" || d.brand.cities.includes(loc.city) || d.brand.stores.some((s) => s.city === loc.city)) && (!budget || d.budgetEligible && d.referencePrice <= budget)).map((d) => ({ d, score: scoreDrink(d) })).sort((a, b) => b.score - a.score || a.d.id.localeCompare(b.d.id));
}
function diverseRanked() {
  const items = ranked(), seen = /* @__PURE__ */ new Set(), selected = [];
  for (const x of items) {
    if (!seen.has(x.d.brand.id)) {
      seen.add(x.d.brand.id);
      selected.push(x);
    }
  }
  if (state.answers.adventure === "discover" && selected.length > 4) {
    const top = selected[0].score;
    const pick = selected.slice(3).find((x) => x.score >= top - 16 && x.d.category !== selected[0].d.category);
    if (pick) {
      selected.splice(selected.indexOf(pick), 1);
      selected.splice(3, 0, pick);
    }
  }
  return [...selected, ...items.filter((x) => !selected.some((s) => s.d.id === x.d.id))];
}
function matchReason(d) {
  const t = targetProfile(), reasons = Object.keys(t).filter((k) => Math.abs(t[k] - d.profile[k]) <= 1).map((k) => ({ milk: d.profile.milk >= 4 ? "奶感饱满" : d.profile.milk <= 2 ? "茶汤轻盈" : "茶奶平衡", tea: d.profile.tea >= 4 ? "茶感鲜明" : "茶香柔和", sweet: t.sweet <= 2 ? "甜感相对轻" : "甜香合拍", texture: t.texture >= 4 ? "配料有嚼头" : t.texture <= 1 ? "口感顺滑" : "口感有层次", fruit: t.fruit >= 4 ? "果香明显" : "茶奶风味为主" })[k]);
  return [.../* @__PURE__ */ new Set([...aromaMatch(d) && ["jasmine", "oolong", "black"].includes(state.answers.aroma) ? ["茶香方向相合"] : [], ...reasons])].slice(0, 3).join(" · ") || "换一个方向，试着发现新口味";
}
function radar(p) {
  const keys = Object.keys(FLAVORS), cx = 125, cy = 110, r = 75, pt = (i, v) => [cx + Math.sin(i * 2 * Math.PI / 5) * r * v / 5, cy - Math.cos(i * 2 * Math.PI / 5) * r * v / 5], poly = (v) => keys.map((_, i) => pt(i, v).join(",")).join(" ");
  return '<svg class="radar" viewBox="0 0 250 230" role="img" aria-label="口味画像：'.concat(keys.map((k) => FLAVORS[k] + p[k] + "分").join("，"), '">').concat([1, 2, 3, 4, 5].map((v) => '<polygon points="'.concat(poly(v), '" fill="none" stroke="#cdbabd" stroke-width=".6"/>')).join("")).concat(keys.map((_, i) => '<line x1="125" y1="110" x2="'.concat(pt(i, 5)[0], '" y2="').concat(pt(i, 5)[1], '" stroke="#cdbabd" stroke-width=".6"/>')).join(""), '<polygon points="').concat(keys.map((k, i) => pt(i, p[k]).join(",")).join(" "), '" fill="#956476" fill-opacity=".22" stroke="#875368" stroke-width="1.5"/>').concat(keys.map((k, i) => '<circle cx="'.concat(pt(i, p[k])[0], '" cy="').concat(pt(i, p[k])[1], '" r="3" fill="#875368"/><text x="').concat(pt(i, 6.1)[0], '" y="').concat(pt(i, 6.1)[1] + 4, '" text-anchor="middle" fill="#8e6b7c" font-size="10">').concat(FLAVORS[k], " ").concat(p[k], "</text>")).join(""), '<text x="125" y="222" text-anchor="middle" font-size="8" fill="#a18590">你的偏好画像 · 5 分制</text></svg>');
}
function personality() {
  const t = targetProfile();
  if (t.fruit >= 4) return ["果园漫游家", "你喜欢果香带来的明亮感。清爽的果茶可以是主角，奶香与茶味则给这一口留出层次。"];
  if (t.texture >= 4) return ["咀嚼收藏家", "你的快乐里，有珍珠的弹，也有芋泥的绵。丰富的配料，是每一杯里值得慢慢发现的小细节。"];
  if (t.milk >= 4) return ["奶香治愈派", "你偏爱饱满柔和的一口。醇厚奶感搭配清楚的茶香，会让这份日常的小快乐更踏实。"];
  if (t.milk <= 1) return ["茶香漫步者", "你愿意把注意力留给茶本身。茶汤的清香、焙香和回味，都有机会成为下一杯的主角。"];
  return ["茶奶平衡家", "你喜欢茶香和奶感互相照应。顺滑的入口之后，依然能找到茶底的性格，正是你的舒服区间。"];
}
function results() {
  const p = targetProfile(), person = personality(), r = diverseRanked(), loc = state.answers.location || { city: "全国探索", currency: "CNY" }, budget = Number(state.answers.budget || 0), allEligible = ALL.filter((d) => d.brand.currency === loc.currency && (loc.city === "全国探索" || d.brand.cities.includes(loc.city) || d.brand.stores.some((s) => s.city === loc.city))), unknown = allEligible.filter((d) => !d.budgetEligible).length;
  return '<div class="page-heading"><div><div class="eyebrow">YOUR TASTE, DISCOVERED</div><h1>原来，你喜欢这样的味道。</h1><p>先给自己一个方向，再让下一杯来验证。</p></div></div><section class="result-hero"><div><div class="eyebrow">你的口味身份</div><h1>'.concat(person[0], ' <span style="color:#a87a8d">✣</span></h1><p>').concat(person[1], '</p><div class="result-notes"><span class="tag">').concat(e(loc.city), '</span><span class="tag">').concat(budget ? money(budget, loc.currency) + "以内" : "预算随口味走", '</span><span class="tag">').concat(state.answers.adventure === "discover" ? "留一点探索空间" : "从最合拍的开始", '</span></div><div class="result-actions"><button class="btn primary" data-action="edit-quiz">调整我的口味 ↗</button><button class="btn" data-action="copy-result">复制口味卡片 ↗</button></div></div><div class="result-radar">').concat(radar(p), '</div></section><div class="section-heading"><div><h2>给你的下一杯候选</h2><p>').concat(r.length, ' 杯符合当前地区与预算条件 · 首轮优先展开不同品牌</p></div><button class="text-link" data-action="method">怎么算合拍？ ↗</button></div><div class="no-price-note">口味契合指数来自五维编辑评分与茶香标签，表示规则相似度。参考价格可能来自历史菜单，详见每杯出处。').concat(budget && unknown ? "当前范围有 ".concat(unknown, " 杯为历史价、活动价或价格待核实，已按预算条件暂时移开。") : "", "</div>").concat(r.length ? '<div class="result-ranking">'.concat(r.slice(0, state.resultLimit).map((entry) => drinkCard(entry.d, entry.score)).join(""), "</div>").concat(r.length > state.resultLimit ? '<div class="load-more"><button class="btn" data-action="result-more">再看看更多候选 ↓</button></div>' : '<div style="height:45px"></div>') : empty("这次的条件，让候选变少了", "试着扩大预算或选择全国探索。有限预算会排除历史价、活动价和价格待核实的饮品，门店收录范围也会影响城市结果。", "调整偏好", "edit-quiz"));
}
function openModal(html) {
  document.getElementById("modal-content").innerHTML = html;
  if (!dialog.open) dialog.showModal();
}
function modalFrame(label, body) {
  return '<div class="modal-head"><div class="eyebrow">'.concat(label, '</div><button class="close-modal" data-action="close-modal" aria-label="关闭弹窗">×</button></div><div class="modal-body">').concat(body, "</div>");
}
function sourceHTML(b, ids = null) {
  const src = ids ? b.sources.filter((s) => ids.includes(s.id)) : b.sources;
  return '<div class="source-list">'.concat(src.map((s) => '<div class="source-item"><span class="source-kind">'.concat(e(s.kind), '</span><div><a href="').concat(safeUrl(s.url), '" target="_blank" rel="noopener noreferrer">').concat(e(s.title), " ↗</a><small>来源日期：").concat(e(s.publishedAt || "页面未注明"), " · 检索日期：").concat(e(s.accessedAt || "2026-10-29"), "</small></div></div>")).join(""), "</div>");
}
function flavorBars(d) {
  return '<div class="flavor-bars">'.concat(Object.keys(FLAVORS).map((k) => '<div class="flavor-line"><span>'.concat(FLAVORS[k], '</span><div class="bar"><div style="width:').concat(d.profile[k] * 20, '%"></div></div><span>').concat(d.profile[k], "</span></div>")).join(""), "</div>");
}
function showDrink(id) {
  const d = byId.get(id);
  if (!d) return;
  openModal(modalFrame("DRINK FIELD NOTES / 饮品手记", '<div class="detail-layout"><div class="detail-art" style="--wash:'.concat(theme(d)[0], '"><div class="cup-wrap">').concat(cup(d), '</div></div><div><button class="text-link" data-brand="').concat(e(d.brand.id), '">').concat(e(d.brand.name), ' · 品牌手记 ↗</button><h2 class="detail-title">').concat(e(d.name), '</h2><div class="tag-row"><span class="tag">').concat(e(d.category), '</span><span class="tag">').concat(e(d.caffeine), "</span>").concat(d.tags.map((t) => '<span class="tag">'.concat(e(t), "</span>")).join(""), '</div><p class="detail-description">').concat(e(d.description), "</p>").concat(priceHTML(d), '<div class="detail-source-note">').concat(e(d.priceNote || "参考价格以来源菜单为准，具体门店和杯型可能不同。"), "<br>公开配料线索：").concat(e(d.ingredients.length ? d.ingredients.join(" / ") : "配方细节待门店确认"), '。成分记录用于风味理解，过敏原与配方请向门店核实。</div><div style="display:flex;gap:12px"><button class="btn primary" data-save="').concat(e(d.id), '">').concat(state.saved[d.id] ? "♥ 已放入茶本" : "♡ 放入我的茶本", '</button><button class="btn" data-compare="').concat(e(d.id), '">').concat(state.compare.includes(d.id) ? "✓ 从对比移出" : "加入对比 ＋", "</button></div></div></div>").concat(drinkDetails(d), '<div class="detail-block"><h3>拆开这一口风味</h3><p class="detail-description">').concat(e(matchReason(d)), "。下方为编辑根据配方与饮品定位整理的相对风味强度，5 分表示该维度更突出。</p>").concat(flavorBars(d), '<small class="detail-description" style="font-size:10px">甜感描述包含果汁、奶底与小料带来的口感印象，点单糖度会影响实际体验。</small></div><div class="detail-block"><h3>这杯茶的资料从哪里来？</h3>').concat(sourceHTML(d.brand, d.sourceIds), '</div><div class="detail-block"><h3>品牌代表门店</h3><div class="store-grid">').concat(d.brand.stores.slice(0, 2).map((s) => storeCard(s, d.brand)).join(""), "</div></div>")));
}
function showBrand(id) {
  const b = BRANDS.find((b2) => b2.id === id);
  if (!b) return;
  openModal(modalFrame("BRAND FIELD NOTES / 品牌手记", '<div class="eyebrow">'.concat(e(b.en), " · ").concat(e(b.region), '</div><h2 class="detail-title">').concat(e(b.name), '</h2><p class="detail-description">').concat(e(b.intro), '</p><div class="tag-row"><span class="tag">').concat(e(b.focus), '</span><span class="tag">').concat(b.currency === "CNY" ? "人民币 CNY" : "新台币 TWD", '</span><span class="tag">').concat(b.sources.length, " 条资料来源</span></div>").concat(brandDetails(b), '<div class="detail-block"><h3>四杯，读懂这个品牌</h3>').concat(b.drinks.map((d) => '<button class="modal-drink-row" data-drink="'.concat(e(d.id), '"><div><strong>').concat(e(d.name), "</strong><small>").concat(e(d.category), " / ").concat(e(d.tags.join(" · ")), "</small></div><p>").concat(e(d.description), "</p>").concat(priceHTML({ ...d, brand: b }), "</button>")).join(""), '</div><div class="detail-block"><h3>城市与代表门店</h3><p class="detail-description">已收集城市：').concat(e(b.cities.join(" / ")), '。以下为来源中的代表门店记录，出行前请复核开店状态。</p><div class="store-grid">').concat(b.stores.map((s) => storeCard(s, b)).join(""), '</div></div><div class="detail-block"><h3>资料来源</h3>').concat(sourceHTML(b), "</div>")));
}
function showMethod() {
  openModal(modalFrame("THE RESEARCH NOTEBOOK / 研究手记", '<h2 class="detail-title">认真看资料，也留一点味觉想象。</h2><div class="method-stats"><div class="method-stat"><b>'.concat(BRANDS.length, " / ").concat(ALL.length, '</b>品牌 / 代表饮品</div><div class="method-stat"><b>').concat(sourceCount, '</b>可追溯资料条目</div><div class="method-stat"><b>').concat(storeCount, '</b>代表门店地址</div></div><div class="method-text"><h3>资料范围</h3><p>本版检索日期为 2026 年 10 月 29 日。收录品牌官网、官方门店页及可读媒体与菜单记录。中国大陆菜单使用人民币，台湾地区菜单使用新台币；两种币种分别筛预算，排序时分组显示。图鉴每家选 4 款，共 ').concat(ALL.length, " 款，涵盖鲜奶茶、经典奶茶、奶盖茶、果茶与咀嚼系饮品。</p><h3>价格与地址，怎样阅读</h3><p>").concat(knownPrices, " 款饮品收录来源支持的单杯参考价格，").concat(ALL.length - knownPrices, ' 款标为“价格待核实”。品牌价位区间依据已收录参考价，或来源明确给出的区间。菜单年份、杯型和区域限度在每杯手记中说明。来源日期未知时按未知保留；检索日期表示本次查阅时间。门店均为有来源的地址记录，历史记录与当日营业状态需要分别理解。</p><h3>推荐是怎样算出来的</h3><p>先按菜单地区、已收录城市和预算筛选。有限预算仅纳入有常规菜单参考价的候选，历史价和活动价另作资料展示；不限预算保留价格未知项。奶感、甜感、咀嚼感和果香对应你选择的 1–5 分，茶感按茶香偏好设为 3 或 4 分。计算五维加权绝对差：茶感 1.1，奶感 1.4，甜感 1.2，咀嚼 1.1，果香 1.2。契合指数 = 100 − 75 × 加权差 / 24；茶香标签未匹配再减 8 分，结果限制为 15–99。它表示编辑规则的相似程度，供点单参考。</p><p>首次推荐优先展示不同品牌，再列出同品牌的其他候选。选择探索模式时，在前几杯保留一款得分相近且品类不同的饮品。盲选每轮将当前偏好按 40% 与选中饮品的风味分按 60% 混合，再取问卷中的最近档；同时按选中饮品的茶香标签更新偏好。图鉴风味向量来自配方与风格的编辑整理，杯子是风味示意插画。</p><h3>你的茶本</h3><p>收藏、评分和个人笔记保存在本浏览器的 localStorage。清理浏览器数据会清空茶本。口味选择可随时重做。</p></div><div class="detail-block"><h3>按品牌查阅全部来源</h3><div class="brand-drink-list">').concat(BRANDS.map((b) => '<button data-brand="'.concat(e(b.id), '">').concat(e(b.name), " (").concat(b.sources.length, ") ↗</button>")).join(""), "</div></div>")));
}
function renderTray() {
  const tray = document.getElementById("compare-tray");
  tray.hidden = !state.compare.length;
  tray.innerHTML = state.compare.length ? "<span>已选 ".concat(state.compare.length, ' / 3 杯</span><span class="tray-names">').concat(state.compare.map((id) => {
    var _a;
    return e((_a = byId.get(id)) == null ? void 0 : _a.name);
  }).join(" · "), '</span><button class="btn" data-action="compare-open">放在一起比一比 ↗</button><button data-action="compare-clear" aria-label="清空对比">×</button>') : "";
}
function showComparison() {
  const ds = state.compare.map((id) => byId.get(id)).filter(Boolean);
  if (!ds.length) return;
  const rows = [["品牌", (d) => e(d.brand.name)], ["参考价", (d) => priceHTML(d)], ["品类", (d) => e(d.category)], ...Object.keys(FLAVORS).map((k) => [FLAVORS[k], (d) => '<span class="comparison-score">' + d.profile[k] + "/5</span> " + "●".repeat(d.profile[k]) + '<span style="opacity:.25">' + "●".repeat(5 - d.profile[k]) + "</span>"]), ["公开配料线索", (d) => e(d.ingredients.join(" / ") || "待核实")], ["茶配方记录", (d) => e(d.caffeine)], ["点单参考", (d) => e(d.description)], ["价格说明", (d) => e(d.priceNote)], ["收藏", (d) => '<button class="btn" data-save="'.concat(e(d.id), '">').concat(state.saved[d.id] ? "♥ 已收藏" : "♡ 放进茶本", "</button>")]];
  openModal(modalFrame("SIDE BY SIDE / 把喜欢放在一起", '<h2 class="detail-title">这一杯，和那一杯。</h2><p class="detail-description">风味分为编辑相对评分。不同币种分别展示，价格各有对应的来源时间和杯型。</p><div class="comparison-scroll"><table><thead><tr><th>慢慢比较</th>'.concat(ds.map((d) => '<td><button data-drink="'.concat(e(d.id), '"><small>').concat(e(d.brand.name), "</small><h3>").concat(e(d.name), " ↗</h3></button></td>")).join(""), "</tr></thead><tbody>").concat(rows.map((entry) => "<tr><th>".concat(entry[0], "</th>").concat(ds.map((d) => "<td>".concat(entry[1](d), "</td>")).join(""), "</tr>")).join(""), "</tbody></table></div>")));
}
function showTaste(id) {
  const d = byId.get(id);
  if (!d) return;
  if (!state.saved[id]) state.saved[id] = {};
  const entry = state.saved[id];
  openModal(modalFrame("MY TASTING NOTE / 这一口，我记得", '<small class="detail-description">'.concat(e(d.brand.name), '</small><h2 class="detail-title">').concat(e(d.name), '</h2><p class="detail-description">给自己的真实体验留一页。你的评分只记录在本机茶本中。</p><div class="rating-stars" id="rating-stars" data-rating="').concat(entry.rating || 0, '">').concat([1, 2, 3, 4, 5].map((n) => '<button data-rating="'.concat(n, '" class="').concat(n <= (entry.rating || 0) ? "active" : "", '" aria-label="').concat(n, '星">★</button>')).join(""), '</div><textarea id="taste-note" aria-label="喝后感" maxlength="1000" placeholder="比如：茶味刚好，下次想试试微糖……">').concat(e(entry.note || ""), '</textarea><div style="display:flex;gap:12px;margin-top:20px"><button class="btn primary" data-taste-save="').concat(e(id), '">记下这一杯 ↗</button>').concat(entry.tasted ? '<button class="btn" data-taste-undo="'.concat(e(id), '">改为想喝</button>') : "", "</div>")));
}
function newDuelPair() {
  const pool = ranked().filter((x) => !state.duel.seen.includes(x.d.id)).slice(0, 45);
  if (pool.length < 2) return false;
  const first = pool[0].d;
  const other = pool.slice(1).sort((a, b) => {
    const distance = (d) => Object.keys(FLAVORS).reduce((n, k) => n + Math.abs(d.profile[k] - first.profile[k]), 0) + (d.brand.id !== first.brand.id ? 3 : 0);
    return distance(b.d) - distance(a.d);
  })[0].d;
  state.duel.pair = state.duel.round % 2 ? [other, first] : [first, other];
  state.duel.reveal = false;
  state.duel.selected = null;
  return true;
}
function startDuel() {
  if (ranked().length < 6) {
    toast("当前候选较少，先扩大预算或城市范围再来一局");
    return;
  }
  state.duel = { round: 0, seen: [], picks: [], pair: [] };
  newDuelPair();
  navigate("duel");
}
function duel() {
  if (!state.duel) return results();
  const g = state.duel;
  return '<section class="quiz-shell"><div class="quiz-topline"><button data-action="duel-exit">← 回到推荐</button><span>风味盲选 · '.concat(g.round + 1, ' / 3</span><span>先凭口味，再揭晓品牌</span></div><div class="progress-track"><div style="width:').concat((g.round + 1) / 3 * 100, '%"></div></div><div class="quiz-title"><div class="qnum">Let your taste do the choosing.</div><h1>').concat(g.reveal ? "这一口，原来是它。" : "这两杯，你更想带走哪一杯？", "</h1><p>").concat(g.reveal ? "我们已用这次选择微调你的口味画像，所有更新都可以重做。" : "两杯都来自当前候选。只看风味描述，选择更想喝的一杯。", '</p></div><div class="duel-grid">').concat(g.pair.map((d, i) => '<article class="duel-card '.concat(g.reveal && g.selected === i ? "chosen" : "", '" style="--wash:').concat(theme(d)[0], '"><div class="duel-letter">').concat(i === 0 ? "A" : "B", "<small>").concat(g.reveal && g.selected === i ? "本轮心动之选" : "一杯风味的可能", '</small></div><div class="duel-art"><div class="cup-wrap">').concat(cup(d, g.reveal ? d.name : "隐藏品牌候选"), '</div></div><div class="duel-copy"><h3>').concat(g.reveal ? e(d.name) : e(d.category) + " · " + e(d.tags.slice(0, 2).join("与")), "</h3><p>").concat(g.reveal ? e(d.brand.name) + " / " + e(d.description) : e(flavorDescription(d)), "</p>").concat(g.reveal ? '<div class="tag-row">'.concat(d.tags.map((t) => '<span class="tag">'.concat(e(t), "</span>")).join(""), "</div>") : "").concat(g.reveal ? '<button class="text-link" data-drink="'.concat(e(d.id), '" style="margin-top:18px">看看它的手记 ↗</button>') : '<button class="btn primary" data-duel-pick="'.concat(i, '">我更想喝这一杯 ↗</button>'), "</div></article>")).join(""), "</div>").concat(g.reveal ? '<div class="duel-next"><span>味觉线索 +1 · 已收集 '.concat(g.round + 1, ' / 3 次选择</span><button class="btn primary" data-action="duel-next">').concat(g.round === 2 ? "看看更新后的推荐" : "下一轮风味对决", " ↗</button></div>") : '<p class="duel-footnote">依据已收录配方整理的编辑风味描述 · 杯子为风味示意插画</p>', "</section>");
}
function flavorDescription(d) {
  const p = d.profile;
  return "".concat(p.tea >= 4 ? "茶感清楚，有鲜明的茶底性格。" : "茶香柔和，入口比较轻松。").concat(p.milk >= 4 ? "奶感饱满，适合想喝醇厚口感的时刻。" : p.milk >= 2 ? "奶香与茶味互相照应。" : "以茶汤或果茶风味为主。").concat(p.texture >= 4 ? "配料丰富，咀嚼感是这一杯的重点。" : p.texture >= 2 ? "有一点小料带来口感变化。" : "口感顺滑，适合直接喝茶汤。").concat(p.fruit >= 4 ? "明显的果香让风味更明亮。" : "");
}
function pickDuel(i) {
  var _a;
  const g = state.duel;
  if (!g || g.reveal) return;
  const winner = g.pair[i];
  if (!winner) return;
  for (const k of ["milk", "sweet", "texture", "fruit"]) {
    const value = Math.max(1, Math.min(5, Math.round(Number((_a = state.answers[k]) != null ? _a : 3) * 0.4 + winner.profile[k] * 0.6)));
    state.answers[k] = STEPS.find((s) => s.key === k).options.map((o) => o[0]).sort((a, b) => Math.abs(a - value) - Math.abs(b - value) || Math.abs(a - winner.profile[k]) - Math.abs(b - winner.profile[k]))[0];
  }
  const t = winner.tags.join(" ");
  state.answers.aroma = /茉莉|栀子|桂花|绿茶|花香/.test(t) ? "jasmine" : /乌龙|铁观音|焙|大红袍/.test(t) ? "oolong" : /红茶|伯爵/.test(t) ? "black" : state.answers.aroma;
  g.picks.push(winner.id);
  g.seen.push(...g.pair.map((d) => d.id));
  g.selected = i;
  g.reveal = true;
  persist();
  renderPreserve();
}
function onAction(action) {
  var _a;
  if (action === "duel-start") {
    startDuel();
    return;
  }
  if (action === "duel-exit") {
    navigate("result");
    return;
  }
  if (action === "duel-next") {
    if (state.duel.round < 2) {
      state.duel.round++;
      if (newDuelPair()) {
        render();
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }
    }
    toast("三次心动已记下，推荐已更新");
    navigate("result");
    return;
  }
  if (action === "home") navigate("home");
  else if (action === "atlas") navigate("atlas", { query: "", category: "全部", city: "全部城市", region: "全部地区" });
  else if (action === "start") {
    state.step = 0;
    navigate("quiz");
  } else if (action === "restart") {
    state.answers = {};
    state.step = 0;
    persist();
    render();
  } else if (action === "edit-quiz") {
    state.step = 0;
    navigate("quiz");
  } else if (action === "method") showMethod();
  else if (action === "close-modal") dialog.close();
  else if (action === "quiz-back") {
    if (state.step > 0) {
      state.step--;
      render();
    }
  } else if (action === "quiz-next") {
    const q = STEPS[state.step];
    if (q.key === "location") {
      const currency = document.getElementById("quiz-market").value, city = document.getElementById("quiz-city").value;
      if (currency !== ((_a = state.answers.location) == null ? void 0 : _a.currency)) delete state.answers.budget;
      state.answers.location = { currency, city };
    } else if (state.answers[q.key] === void 0) return;
    persist();
    if (state.step < 7) {
      state.step++;
      render();
      window.scrollTo({ top: 0, behavior: "auto" });
    } else navigate("result");
  } else if (action === "more") {
    state.limit += 12;
    renderPreserve();
  } else if (action === "result-more") {
    state.resultLimit += 9;
    renderPreserve();
  } else if (action === "reset-filters") {
    Object.assign(state, { mood: null, query: "", category: "全部", city: "全部城市", region: "全部地区", sort: "default" });
    render();
  } else if (action === "all-cities") {
    state.city = "全部城市";
    render();
  } else if (action === "compare-open") showComparison();
  else if (action === "compare-clear") {
    state.compare = [];
    renderTray();
    if (dialog.open) dialog.close();
    renderPreserve();
  } else if (action === "copy-result") copyResult();
}
function renderPreserve() {
  const y = window.scrollY;
  render();
  window.scrollTo({ top: y, behavior: "auto" });
}
function refreshCatalog() {
  document.getElementById("catalog-results").innerHTML = catalogResults();
}
async function copyResult() {
  const p = targetProfile(), r = diverseRanked().slice(0, 3);
  const text = "我的寻茶口味卡：".concat(personality()[0], "\n").concat(Object.keys(FLAVORS).map((k) => FLAVORS[k] + p[k] + "/5").join(" · "), "\n下一杯候选：").concat(r.map((x) => x.d.brand.name + " " + x.d.name).join(" / "), "\n价格为来源参考，具体以门店为准。");
  try {
    await navigator.clipboard.writeText(text);
    toast("口味卡片已复制，可以分享给朋友");
  } catch (e2) {
    openModal(modalFrame("YOUR TASTE CARD / 口味卡片", '<p class="detail-description">可选中下方文字复制。</p><textarea readonly style="height:200px">'.concat(e(text), "</textarea>")));
  }
}
document.addEventListener("click", (evt) => {
  const el = evt.target.closest("button,[data-drink],a[data-nav]");
  if (!el) return;
  if (el.dataset.nav) {
    navigate(el.dataset.nav, { query: "", city: "全部城市" });
    return;
  }
  if (el.dataset.action) {
    onAction(el.dataset.action);
    return;
  }
  if (el.dataset.save) {
    const id = el.dataset.save;
    if (state.saved[id]) delete state.saved[id];
    else state.saved[id] = { tasted: false, rating: 0, note: "" };
    persist();
    toast(state.saved[id] ? "这杯心动，已经放进茶本" : "已从茶本移出");
    if (dialog.open) {
      el.textContent = state.saved[id] ? "♥ 已放入茶本" : "♡ 放入我的茶本";
    }
    renderPreserve();
    return;
  }
  if (el.dataset.compare) {
    const id = el.dataset.compare;
    if (state.compare.includes(id)) state.compare = state.compare.filter((x) => x !== id);
    else if (state.compare.length < 3) {
      state.compare.push(id);
      toast("已加入对比，可以选最多 3 杯");
    } else {
      toast("已选 3 杯，先移出一杯再加入");
      return;
    }
    if (dialog.open) el.textContent = state.compare.includes(id) ? "✓ 从对比移出" : "加入对比 ＋";
    renderTray();
    renderPreserve();
    return;
  }
  if (el.dataset.duelPick !== void 0) {
    pickDuel(Number(el.dataset.duelPick));
    return;
  }
  if (el.dataset.drink) {
    showDrink(el.dataset.drink);
    return;
  }
  if (el.dataset.brand) {
    showBrand(el.dataset.brand);
    return;
  }
  if (el.dataset.mode) {
    state.mode = el.dataset.mode;
    state.limit = 12;
    renderPreserve();
    return;
  }
  if (el.dataset.category) {
    state.category = el.dataset.category;
    state.mood = null;
    state.limit = 12;
    renderPreserve();
    return;
  }
  if (el.dataset.mood) {
    const key = el.dataset.mood, cat = { tea: "纯茶", milk: "鲜奶茶", texture: "咀嚼系", fruit: "果茶" }[key];
    navigate("atlas", { mood: key, mode: "drinks", query: "", category: "全部", city: "全部城市", region: "全部地区" });
    return;
  }
  if (el.dataset.city) {
    state.city = el.dataset.city;
    state.limit = 12;
    renderPreserve();
    return;
  }
  if (el.dataset.savedFilter) {
    state.savedFilter = el.dataset.savedFilter;
    renderPreserve();
    return;
  }
  if (el.dataset.answer !== void 0) {
    const q = STEPS[state.step], raw = el.dataset.answer;
    state.answers[q.key] = ["milk", "sweet", "texture", "fruit", "budget"].includes(q.key) ? Number(raw) : raw;
    persist();
    render();
    return;
  }
  if (el.dataset.taste) {
    showTaste(el.dataset.taste);
    return;
  }
  if (el.dataset.rating) {
    const n = Number(el.dataset.rating);
    document.getElementById("rating-stars").dataset.rating = n;
    document.querySelectorAll("#rating-stars button").forEach((b, i) => b.classList.toggle("active", i < n));
    return;
  }
  if (el.dataset.tasteSave) {
    const id = el.dataset.tasteSave;
    state.saved[id] = { tasted: true, rating: Number(document.getElementById("rating-stars").dataset.rating), note: document.getElementById("taste-note").value, updatedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) };
    persist();
    dialog.close();
    toast("喝后感已记下，茶本又多了一页");
    renderPreserve();
    return;
  }
  if (el.dataset.tasteUndo) {
    state.saved[el.dataset.tasteUndo].tasted = false;
    persist();
    dialog.close();
    renderPreserve();
  }
});
let composingSearch = false;
function updateSearchInput(input) {
  if (!input || !["catalog-search", "store-search"].includes(input.id)) return;
  state.query = input.value;
  state.limit = 12;
  if (input.id === "catalog-search") refreshCatalog();
  else {
    const results2 = document.getElementById("store-results");
    if (results2) results2.innerHTML = storeResults();
  }
}
document.addEventListener("compositionstart", () => {
  composingSearch = true;
});
document.addEventListener("compositionend", (evt) => {
  composingSearch = false;
  updateSearchInput(evt.target);
});
document.addEventListener("input", (evt) => {
  if (evt.isComposing || composingSearch) return;
  updateSearchInput(evt.target);
});
document.addEventListener("change", (evt) => {
  const t = evt.target;
  if (t.id === "city-filter") {
    state.city = t.value;
    state.limit = 12;
    renderPreserve();
  }
  if (t.id === "region-filter") {
    state.region = t.value;
    state.city = "全部城市";
    state.limit = 12;
    renderPreserve();
  }
  if (t.id === "sort-filter") {
    state.sort = t.value;
    refreshCatalog();
  }
  if (t.id === "quiz-market") {
    state.answers.location = { currency: t.value, city: "全国探索" };
    delete state.answers.budget;
    persist();
    render();
  }
});
document.addEventListener("keydown", (evt) => {
  if (["Enter", " "].includes(evt.key) && evt.target.matches("div[data-drink]")) {
    evt.preventDefault();
    showDrink(evt.target.dataset.drink);
  }
});
document.getElementById("source-guide").addEventListener("click", showMethod);
document.getElementById("footer-method").addEventListener("click", showMethod);
document.querySelector(".wordmark").addEventListener("click", (evt) => {
  evt.preventDefault();
  navigate("home");
});
dialog.addEventListener("click", (evt) => {
  if (evt.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (evt.clientX < r.left || evt.clientX > r.right || evt.clientY < r.top || evt.clientY > r.bottom) dialog.close();
  }
});
if (!ALL.length) {
  app.innerHTML = empty("资料正在抵达", "请刷新页面以载入饮品图鉴。", "", "");
} else {
  render();
  window.TEA_GAME_READY = true;
  if (window.TEA_BOOT_DONE) window.TEA_BOOT_DONE();
}
