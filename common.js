/* 마음별 공통 스크립트 — 바닥글 SNS 아이콘 채우기 (site-config.js의 sns 값을 읽어요) */
(function(){
  "use strict";
  var ICON = {
    x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.3-8.3L2 3h6.3l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"/></svg>',
    instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 2.8h10A4.2 4.2 0 0 1 21.2 7v10a4.2 4.2 0 0 1-4.2 4.2H7A4.2 4.2 0 0 1 2.8 17V7A4.2 4.2 0 0 1 7 2.8Z"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/></svg>',
    youtube:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8ZM10 15.2V8.8l5.2 3.2-5.2 3.2Z"/></svg>',
    blog:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 4v2h10V7H7Zm0 4v2h10v-2H7Zm0 4v2h6v-2H7Z"/></svg>'
  };
  var NAME = {x:"X(트위터)", instagram:"인스타그램", youtube:"유튜브", blog:"블로그"};
  function esc(s){ return String(s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function fill(){
    var box = document.getElementById("gfSns"); if(!box) return;
    var s = (window.MAUMBYEOL_CONFIG && window.MAUMBYEOL_CONFIG.sns) || {};
    var html = Object.keys(ICON).filter(function(k){ return /^https?:\/\//.test(s[k]||""); }).map(function(k){
      return '<a href="'+esc(s[k])+'" target="_blank" rel="noopener" aria-label="'+NAME[k]+'">'+ICON[k]+'</a>';
    }).join("");
    box.innerHTML = html;
    if(!html){
      var t = document.getElementById("gfTitle"), sm = document.getElementById("gfSmall"), h = document.getElementById("gfHr");
      if(t) t.textContent = "MAUMBYEOL"; if(sm) sm.hidden = true; if(h) h.hidden = true; box.hidden = true;
    }
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill); else fill();
})();
