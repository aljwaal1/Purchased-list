(()=>{
  const standalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  if(standalone)return;

  document.documentElement.classList.add('safari-shortcut-mode');

  const style=document.createElement('style');
  style.textContent=`
    html.safari-shortcut-mode,html.safari-shortcut-mode body{min-height:100dvh;overscroll-behavior-y:none}
    html.safari-shortcut-mode body{padding-top:0}
    html.safari-shortcut-mode .app{padding-top:10px;padding-bottom:calc(106px + env(safe-area-inset-bottom))}
    html.safari-shortcut-mode .hero{border-radius:28px;padding-top:20px}
    html.safari-shortcut-mode .install{display:none!important}
    html.safari-shortcut-mode .tabs{padding-bottom:calc(8px + env(safe-area-inset-bottom))}
    .safari-focus-btn{position:fixed;top:10px;left:10px;z-index:170;width:44px;height:44px;padding:0;border-radius:16px;background:rgba(15,23,42,.88);color:#fff;box-shadow:0 10px 28px #0003;font-size:20px;display:grid;place-items:center}
    .safari-focus-hint{position:fixed;top:10px;right:10px;left:64px;z-index:165;background:rgba(15,23,42,.92);color:#fff;border-radius:18px;padding:10px 12px;font-size:12px;line-height:1.55;box-shadow:0 10px 28px #0003;transition:.25s}
    .safari-focus-hint.hide{opacity:0;transform:translateY(-10px);pointer-events:none}
    @media(min-width:700px){.safari-focus-btn,.safari-focus-hint{display:none}}
  `;
  document.head.appendChild(style);

  const hint=document.createElement('div');
  hint.className='safari-focus-hint';
  hint.textContent='اسحب الصفحة قليلًا للأعلى ليصغر شريط Safari وتظهر مساحة أكبر للقائمة.';

  const btn=document.createElement('button');
  btn.type='button';
  btn.className='safari-focus-btn';
  btn.setAttribute('aria-label','توسيع مساحة العرض');
  btn.textContent='↕️';
  btn.addEventListener('click',()=>{
    window.scrollTo({top:Math.max(1,window.scrollY+70),behavior:'smooth'});
    hint.classList.add('hide');
  });

  document.body.append(hint,btn);
  const hideHint=()=>hint.classList.add('hide');
  addEventListener('scroll',hideHint,{once:true,passive:true});
  addEventListener('touchstart',()=>setTimeout(hideHint,1400),{once:true,passive:true});
  setTimeout(hideHint,6500);

  const pill=document.querySelector('.pill');
  if(pill)pill.textContent='✨ Safari • نفس بيانات الاختصار';

  const setViewport=()=>document.documentElement.style.setProperty('--app-height',`${window.visualViewport?.height||window.innerHeight}px`);
  setViewport();
  window.visualViewport?.addEventListener('resize',setViewport,{passive:true});
})();
