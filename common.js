/* ==================================================================
   마음별 공통 스크립트
   - 머리글, 모바일 메뉴, 페이지 머리, 바닥글을 세 페이지에 똑같이 그려요
   - 새 질문 숫자(관리자), 화면 밝기, 바닥글 SNS
   ================================================================== */
(function(){
  "use strict";
  var body = document.body;
  var PAGE = body.dataset.page || "index";

  /* ---------- 큰 판(frame)으로 감싸기 ---------- */
  var cid = 0;
  function coil(n,w){
    var id = "cg"+(++cid), h = 30+n*15, s = '<svg viewBox="-8 -4 116 '+(h+8)+'" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9BEFFF"/><stop offset=".45" stop-color="#4F86FF"/><stop offset="1" stop-color="#3A2BC9"/></linearGradient></defs>';
    for(var i=n-1;i>=0;i--) s += '<ellipse cx="50" cy="'+(16+i*15)+'" rx="44" ry="15" fill="none" stroke="url(#'+id+')" stroke-width="'+(w||10)+'"/>';
    return s+'</svg>';
  }
  (function wrap(){
    var fr = document.createElement("div"); fr.className = "frame";
    var kids = Array.prototype.slice.call(body.children).filter(function(el){ return el.tagName!=="SCRIPT" && !el.classList.contains("skip") && !el.classList.contains("toast"); });
    body.insertBefore(fr, kids[0]||null);
    fr.innerHTML = '<div class="frame-haze" aria-hidden="true"></div>';
    kids.forEach(function(el){ fr.appendChild(el); });
  })();
  var IS_INDEX = PAGE === "index";

  /* ---------- 메뉴: 큰 메뉴 4개 + 위쪽 작은 링크 ---------- */
  var MENU = [
    {k:"tests", t:"검사하기", sub:[["tests","전체 검사"]]},
    {k:"mine", t:"내 결과 · 상담", sub:[["results","내 결과"],["consult","상담 신청"],["my","내 상담 신청"]]},
    {k:"ask", t:"ASK", sub:[["ask","ASK"]]},
    {k:"today", t:"오늘의 기록", sub:[["today","오늘의 기록"]]}
  ];
  var INFO = {k:"info", t:"안내", sub:[["notice","공지사항"],["guide","이용 안내"],["search","검색"]]};
  function href(r){ return r.charAt(0)==="@" ? r.slice(1) : (IS_INDEX ? "#" : "index.html#") + r; }
  var HOME = IS_INDEX ? "#home" : "index.html";
  function secOf(k){ if(k==="info") return INFO; for(var i=0;i<MENU.length;i++) if(MENU[i].k===k) return MENU[i]; return null; }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

  var MARK = '<span class="bm" aria-hidden="true"></span>';
  function ORBS_(){ return '<div class="subv-art" aria-hidden="true"><span class="ring3d" style="width:132px;height:132px;left:44px;top:6px"></span><span class="sph" style="width:84px;height:84px;left:68px;top:30px"></span></div>'; }
  var THEME = '<button class="theme-btn" type="button" role="switch" data-theme-toggle aria-label="다크 모드"><span class="knob"><svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></span></button>';
  var IC_SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>';
  var IC_BACK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg>';

  /* ---------- 머리글 ---------- */
  function renderHeader(){
    var gh = document.getElementById("gh"); if(!gh) return;
    gh.className = "gh";
    gh.innerHTML = '<div class="gh-in">'+
      '<a class="brand" href="'+HOME+'" aria-label="마음별 처음 화면">'+MARK+'마음별</a>'+
      '<nav class="gnb" aria-label="주요 메뉴">'+MENU.map(function(m){ return '<a href="'+href(m.sub[0][0])+'" data-sec="'+m.k+'">'+m.t+'</a>'; }).join("")+'</nav>'+
      '<div class="util"><a class="u-lnk" href="'+href("notice")+'">공지</a><a class="u-lnk" href="'+href("guide")+'">이용 안내</a>'+
      '<a class="u-ic" href="'+href("search")+'" aria-label="검색">'+IC_SEARCH+'</a>'+THEME+
      '<a class="btn btn-main btn-sm u-cta" href="'+href("consult")+'">상담 신청</a>'+
      '<button class="ham" type="button" id="hamBtn" aria-label="메뉴 열기" aria-expanded="false" aria-controls="sitemap"><i></i><i></i><i></i></button></div></div>';
    document.getElementById("hamBtn").addEventListener("click", openSitemap);
  }

  /* ---------- 모바일 메뉴 ---------- */
  var smPrev = null;
  function renderSitemap(){
    var sm = document.createElement("div");
    sm.className = "sitemap"; sm.id = "sitemap"; sm.hidden = true;
    sm.setAttribute("role","dialog"); sm.setAttribute("aria-modal","true"); sm.setAttribute("aria-label","메뉴");
    sm.innerHTML = '<div class="sm-h"><a class="brand" href="'+HOME+'">'+MARK+'마음별</a>'+
      '<button class="sm-x" type="button" id="smX" aria-label="메뉴 닫기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg></button></div>'+
      '<nav class="sm-grid" aria-label="전체 메뉴">'+MENU.concat([INFO]).map(function(m){
        return '<div class="sm-col"><h2><a href="'+href(m.sub[0][0])+'" data-sm="'+m.k+'">'+m.t+'</a></h2>'+(m.sub.length>1?'<ul>'+m.sub.map(function(s){ return '<li><a href="'+href(s[0])+'">'+s[1]+'</a></li>'; }).join("")+'</ul>':'')+'</div>';
      }).join("")+'</nav>'+
      '<div class="sm-foot">'+THEME+'<span>다크 모드</span><a href="'+href("admin")+'">관리자</a><p class="crisis-s">지금 많이 힘들다면 자살예방 상담전화 <b>109</b> · 정신건강 위기상담 <b>1577-0199</b> (24시간)</p></div>';
    body.appendChild(sm);
    sm.addEventListener("click", function(e){ if(e.target.closest("a")) closeSitemap(); });
    document.getElementById("smX").addEventListener("click", closeSitemap);
    sm.addEventListener("keydown", function(e){
      if(e.key==="Escape"){ closeSitemap(); return; }
      if(e.key!=="Tab") return;
      var f = sm.querySelectorAll("a,button"), a=f[0], z=f[f.length-1];
      if(e.shiftKey && document.activeElement===a){ e.preventDefault(); z.focus(); }
      else if(!e.shiftKey && document.activeElement===z){ e.preventDefault(); a.focus(); }
    });
  }
  function openSitemap(){
    var sm = document.getElementById("sitemap"); if(!sm) return;
    smPrev = document.activeElement; sm.hidden = false; document.documentElement.classList.add("sm-open");
    document.getElementById("hamBtn").setAttribute("aria-expanded","true");
    document.getElementById("smX").focus(); label(); applyBadge();
  }
  function closeSitemap(){
    var sm = document.getElementById("sitemap"); if(!sm || sm.hidden) return;
    sm.hidden = true; document.documentElement.classList.remove("sm-open");
    document.getElementById("hamBtn").setAttribute("aria-expanded","false");
    if(smPrev && smPrev.focus && document.contains(smPrev)) smPrev.focus();
  }

  /* ---------- 현재 메뉴 표시 ---------- */
  function setCurrent(sec){
    document.querySelectorAll(".gnb a").forEach(function(a){ if(a.dataset.sec===sec) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });
  }

  /* ---------- 새 질문 숫자 (관리자에게만) ---------- */
  var badgeN = 0;
  function applyBadge(){
    var txt = badgeN > 99 ? "99+" : String(badgeN);
    var targets = Array.prototype.slice.call(document.querySelectorAll('.gnb a[data-sec="ask"], .sitemap a[data-sm="ask"]'));
    var ham = document.getElementById("hamBtn"); if(ham) targets.push(ham);
    targets.forEach(function(el){
      var b = el.querySelector(":scope > .nbadge");
      if(!badgeN){ if(b) b.remove(); return; }
      if(!b){ b = document.createElement("span"); b.className = "nbadge"; el.appendChild(b); }
      b.textContent = txt;
      b.setAttribute("aria-label", "새 질문 "+badgeN+"개");
    });
    var t = document.title.replace(/^\(\d+\+?\) /, "");
    document.title = badgeN ? "("+txt+") "+t : t;
  }
  function setBadge(n){ badgeN = Math.max(0, n|0); applyBadge(); }

  /* ---------- 페이지 머리 ---------- */
  function subv(o){
    var S = secOf(o.sec) || {t:"", sub:[]};
    var tabs = o.tabs != null ? o.tabs :
      ((!o.notabs && S.sub.length>1) ? S.sub.map(function(s){ return '<a href="'+href(s[0])+'"'+(s[0]===o.act?' aria-current="page"':'')+'>'+s[1]+'</a>'; }).join("") : "");
    var back = o.back ? '<a class="ph-back" href="'+href(o.back[0])+'">'+IC_BACK+esc(o.back[1])+'</a>' : "";
    return '<section class="subv'+(o.compact?' compact':'')+(tabs?'':' no-tabs')+'"><div class="subv-in">'+back+(o.compact?'':ORBS_())+
      '<h1 class="subv-title">'+esc(o.title)+'</h1>'+(o.desc?'<p class="subv-desc">'+esc(o.desc)+'</p>':'')+
      (tabs?'<nav class="ph-tabs" aria-label="'+esc(o.tabsLabel||S.t||o.title)+'">'+tabs+'</nav>':'')+'</div></section>';
  }
  /* egogram · love: <div id="subv" data-sec data-title data-desc> 를 채워요 */
  function renderStaticSubv(){
    var el = document.getElementById("subv"); if(!el || !el.dataset.title) return;
    el.innerHTML = subv({sec:el.dataset.sec, title:el.dataset.title, desc:el.dataset.desc, back:["tests","검사 목록"], notabs:true});
    setCurrent(el.dataset.sec);
  }

  /* ---------- 바닥글 ---------- */
  function renderFooter(){
    var gf = document.getElementById("gf"); if(!gf) return;
    var note = gf.dataset.note || "마음별의 검사는 자기 이해를 돕기 위한 것으로, 의학적·임상적 진단이 아니에요. 답변은 이 브라우저에만 저장되고, 상담을 신청할 때 고른 결과만 운영자에게 전달돼요.";
    function col(t,list){ return '<div class="gf-col"><h3>'+t+'</h3><ul>'+list.map(function(x){ return '<li><a href="'+href(x[0])+'">'+x[1]+'</a></li>'; }).join("")+'</ul></div>'; }
    gf.className = "gf";
    gf.innerHTML = '<div class="gf-w"><div class="gf-brand"><a class="brand" href="'+HOME+'">'+MARK+'마음별</a><p>'+note+'</p></div>'+
      col("검사",[["big5","Big5 성격검사"],["@egogram.html","이고그램 검사"],["@love.html","사랑의 삼각형"],["@orb.html","마음 구슬"],["tests","전체 검사"]])+
      col("마음별",[["results","내 결과"],["consult","해석 상담 신청"],["ask","ASK"],["today","오늘의 기록"]])+
      col("안내",[["notice","공지사항"],["guide","이용 안내"],["guide","개인정보 처리 안내"],["admin","관리자"]])+
      '<div class="gf-side"><div class="gf-sns" id="gfSns"></div><div class="gf-mode">'+THEME+'<span>다크 모드</span></div></div></div>'+
      '<div class="gf-bottom"><p class="help-line">지금 많이 힘들다면 자살예방 상담전화 <b>109</b> · 정신건강 위기상담 <b>1577-0199</b> (24시간)</p><p>© '+new Date().getFullYear()+' 마음별</p></div>';
  }

  /* ---------- SNS ---------- */
  var ICON = {
    x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.3-8.3L2 3h6.3l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"/></svg>',
    instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 2.8h10A4.2 4.2 0 0 1 21.2 7v10a4.2 4.2 0 0 1-4.2 4.2H7A4.2 4.2 0 0 1 2.8 17V7A4.2 4.2 0 0 1 7 2.8Z"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/></svg>',
    youtube:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8ZM10 15.2V8.8l5.2 3.2-5.2 3.2Z"/></svg>',
    blog:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 4v2h10V7H7Zm0 4v2h10v-2H7Zm0 4v2h6v-2H7Z"/></svg>'
  };
  var NAME = {x:"X(트위터)", instagram:"인스타그램", youtube:"유튜브", blog:"블로그"};
  function fillSns(){
    var box = document.getElementById("gfSns"); if(!box) return;
    var s = (window.MAUMBYEOL_CONFIG && window.MAUMBYEOL_CONFIG.sns) || {};
    box.innerHTML = Object.keys(ICON).filter(function(k){ return /^https?:\/\//.test(s[k]||""); }).map(function(k){
      return '<a href="'+esc(s[k])+'" target="_blank" rel="noopener" aria-label="'+NAME[k]+'">'+ICON[k]+'</a>';
    }).join("");
    box.hidden = !box.innerHTML;
  }

  /* ---------- 화면 밝기 ---------- */
  var root = document.documentElement;
  function label(){
    var dark = root.dataset.theme === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach(function(b){
      b.setAttribute("aria-checked", dark ? "true" : "false");
      b.setAttribute("title", dark ? "다크 모드 켜짐" : "다크 모드 꺼짐");
    });
  }
  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-theme-toggle]"); if(!b) return;
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try{ localStorage.setItem("mb.theme", next); }catch(x){}
    label();
    document.dispatchEvent(new CustomEvent("mb:theme", {detail:next}));
  });

  /* ---------- 시작 ---------- */
  renderHeader();
  (function(){ var gh=document.getElementById("gh"); if(!gh) return; function f(){ gh.classList.toggle("scrolled", window.scrollY>12); } window.addEventListener("scroll", f, {passive:true}); f(); })();
  renderSitemap();
  renderFooter();
  renderStaticSubv();
  fillSns();
  label();
  window.mbThemeLabel = label;
  window.MB = {coil:coil, orbs:ORBS_, menu:MENU, info:INFO, href:href, home:HOME, subv:subv, setCurrent:setCurrent, mark:MARK, theme:THEME, openSitemap:openSitemap, closeSitemap:closeSitemap, badge:setBadge, applyBadge:applyBadge};
})();
