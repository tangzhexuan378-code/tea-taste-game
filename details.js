/* Facts follow cited recipe records. Tasting notes are explicitly editorial. */
function sourceLink(brand, ids) {
  var source = brand.sources.find(function (s) { return ids && ids.indexOf(s.id) !== -1; });
  return source ? '<a class="detail-citation" href="' + safeUrl(source.url) + '" target="_blank" rel="noopener noreferrer">资料出处 ↗</a>' : '';
}
function drinkDetails(d) {
  var detail = d.detail;
  if (!detail) return '';
  return '<section class="detail-block"><div class="detail-section-title"><h3>这一杯，具体在哪里不同？</h3>' + sourceLink(d.brand, detail.sourceIds) + '</div>' +
    '<div class="recipe-grid"><div><small>茶底线索</small><p>' + e(detail.teaBase) + '</p></div><div><small>奶底线索</small><p>' + e(detail.milkBase) + '</p></div></div>' +
    '<div class="tasting-note"><small>风味层次 · 编辑品评</small><p>' + e(detail.flavorJourney) + '</p></div>' +
    '<div class="detail-tip-grid"><div><h4>小料与质感</h4><p>' + e(detail.textureNotes) + '</p></div><div><h4>怎么点更接近你</h4><p>' + e(detail.orderingTip) + '</p></div></div>' +
    '<p class="supply-note"><span>供应记录</span> ' + e(detail.supplyNote) + '</p><small class="editorial-caption">风味笔记根据公开配方整理，实际体验随门店配方、糖度和冰量变化。</small></section>';
}
function brandDetails(b) {
  var guide = b.detail;
  if (!guide) return '';
  return '<section class="detail-block"><h3>这个品牌的专属线索</h3><div class="signature-grid">' + guide.highlights.map(function (h, i) {
    return '<article><span class="signature-number">0' + (i + 1) + '</span><h4>' + e(h.title) + '</h4><p>' + e(h.text) + '</p>' + sourceLink(b, h.sourceIds) + '</article>';
  }).join('') + '</div><div class="brand-guide-note"><h4>四杯怎么选？</h4><p>' + e(guide.comparisonGuide) + '</p><h4>点单前的小提示</h4><p>' + e(guide.orderingGuide) + '</p></div></section>';
}
