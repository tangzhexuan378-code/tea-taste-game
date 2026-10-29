/* Small, local compatibility helpers; no network or identity dependencies. */
(function () {
  'use strict';
  if (!Array.prototype.flatMap) Object.defineProperty(Array.prototype, 'flatMap', {
    configurable: true, writable: true,
    value: function (fn, thisArg) {
      return this.reduce(function (out, value, index, list) {
        return out.concat(fn.call(thisArg, value, index, list));
      }, []);
    }
  });
  if (!Object.hasOwn) Object.hasOwn = function (object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  };
  if (!String.prototype.padStart) Object.defineProperty(String.prototype, 'padStart', {
    configurable: true, writable: true,
    value: function (length, fill) {
      var str = String(this), pad = String(fill === undefined ? ' ' : fill);
      if (!pad) return str;
      var needed = length - str.length, prefix = '';
      while (prefix.length < needed) prefix += pad;
      return prefix.slice(0, Math.max(0, needed)) + str;
    }
  });
  if (window.NodeList && !NodeList.prototype.forEach) NodeList.prototype.forEach = Array.prototype.forEach;
  if (window.Element && !Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  if (window.Element && !Element.prototype.closest) Element.prototype.closest = function (selector) {
    var current = this;
    while (current && current.nodeType === 1) {
      if (current.matches(selector)) return current;
      current = current.parentElement;
    }
    return null;
  };
  var modal = document.getElementById('detail-dialog');
  if (modal && typeof modal.showModal !== 'function') {
    var backdrop = document.createElement('div');
    backdrop.className = 'fallback-backdrop';
    backdrop.hidden = true;
    document.body.appendChild(backdrop);
    modal.classList.add('fallback-dialog');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    if (!('open' in modal)) Object.defineProperty(modal, 'open', {
      get: function () { return modal.hasAttribute('open'); }
    });
    var previousFocus;
    modal.showModal = function () {
      previousFocus = document.activeElement;
      modal.setAttribute('open', '');
      backdrop.hidden = false;
      document.body.classList.add('modal-open');
      var close = modal.querySelector('.close-modal');
      if (close) close.focus();
    };
    modal.close = function () {
      modal.removeAttribute('open');
      backdrop.hidden = true;
      document.body.classList.remove('modal-open');
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    };
    backdrop.addEventListener('click', function () { modal.close(); });
    document.addEventListener('keydown', function (event) {
      if (!modal.open) return;
      if (event.key === 'Escape' || event.keyCode === 27) {
        event.preventDefault(); modal.close(); return;
      }
      if (event.key === 'Tab' || event.keyCode === 9) {
        var items = Array.prototype.slice.call(modal.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')).filter(function (item) { return item.offsetWidth || item.offsetHeight; });
        if (!items.length) return;
        var first = items[0], last = items[items.length - 1], active = document.activeElement;
        if (!modal.contains(active) || (!event.shiftKey && active === last)) { event.preventDefault(); first.focus(); }
        else if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
      }
    });
  }
})();
