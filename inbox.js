/* ==================================================================
   질문함 받은 편지함 — 새 질문을 Firebase에 모아 두고,
   관리자에게만 메뉴 옆 숫자(배지)로 알려 줘요.
   - 방문자: 질문을 보낼 때 Firebase에 한 줄 저장 (읽기 권한 없음)
   - 관리자: Firebase 계정으로 로그인하면 답하지 않은 질문 수가 실시간으로 떠요
   site-config.js 의 firebase 값이 비어 있으면 아무것도 하지 않아요.
   ================================================================== */
(function(){
  "use strict";
  var CFG = window.MAUMBYEOL_CONFIG || {}, FB = CFG.firebase || {};
  var READY = !!(FB.apiKey && FB.projectId);
  var BASE = "https://www.gstatic.com/firebasejs/10.12.2/";
  var loading = null, unsub = null, authUnsub = null, user = null, pending = [], listeners = [], started = false;

  function load(src){ return new Promise(function(res, rej){ var s=document.createElement("script"); s.src=src; s.async=false; s.onload=res; s.onerror=function(){ rej(new Error("load")); }; document.head.appendChild(s); }); }
  function sdk(){
    if(!READY) return Promise.reject(new Error("noconfig"));
    loading = loading || Promise.all([load(BASE+"firebase-app-compat.js"), load(BASE+"firebase-auth-compat.js"), load(BASE+"firebase-firestore-compat.js")])
      .then(function(){ if(!firebase.apps.length) firebase.initializeApp(FB); return firebase; });
    return loading;
  }
  function isAdmin(){ try{ return !!sessionStorage.getItem("mb.admin"); }catch(e){ return false; } }
  function emit(){ listeners.forEach(function(f){ try{ f(pending, user); }catch(e){} }); if(window.MB && MB.badge) MB.badge(user ? pending.length : 0); }

  function watch(){
    if(unsub){ unsub(); unsub = null; }
    if(!user){ pending = []; emit(); return; }
    unsub = firebase.firestore().collection("questions").where("answered","==",false).onSnapshot(function(snap){
      pending = snap.docs.map(function(d){ var x=d.data(); return {id:d.id, q:x.q||"", nick:x.nick||"", date:x.createdAt && x.createdAt.toMillis ? x.createdAt.toMillis() : Date.now()}; })
        .sort(function(a,b){ return b.date - a.date; });
      emit();
    }, function(){ pending = []; emit(); });
  }

  var API = {
    ready: READY,
    /* 방문자: 질문 저장 */
    send: function(id, q, nick){
      return sdk().then(function(fb){ return fb.firestore().collection("questions").doc(id).set({q:q, nick:nick||"", createdAt:fb.firestore.FieldValue.serverTimestamp(), answered:false}); });
    },
    /* 관리자: 시작 (관리자 코드를 넣은 탭에서만) */
    start: function(){
      if(!READY || !isAdmin() || started) return;
      started = true;
      sdk().then(function(fb){ authUnsub = fb.auth().onAuthStateChanged(function(u){ user = u; watch(); }); }).catch(function(){ started = false; });
    },
    stop: function(){ if(unsub){ unsub(); unsub = null; } if(authUnsub){ authUnsub(); authUnsub = null; } started = false; pending = []; emit(); },
    signIn: function(email, pw){ return sdk().then(function(fb){ return fb.auth().signInWithEmailAndPassword(email, pw); }).then(function(){ API.start(); }); },
    signOut: function(){ return sdk().then(function(fb){ return fb.auth().signOut(); }); },
    markAnswered: function(id){ return sdk().then(function(fb){ return fb.firestore().collection("questions").doc(id).update({answered:true}); }); },
    remove: function(id){ return sdk().then(function(fb){ return fb.firestore().collection("questions").doc(id).delete(); }); },
    user: function(){ return user; },
    list: function(){ return pending.slice(); },
    on: function(f){ listeners.push(f); return function(){ listeners = listeners.filter(function(x){ return x !== f; }); }; }
  };
  window.MBInbox = API;
  API.start();
})();
