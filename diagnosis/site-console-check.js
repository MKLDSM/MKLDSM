// wellcommdesign.imweb.me 에서 F12 → Console 탭에 붙여넣고 Enter
(() => {
  const out = {};
  out.viewport = innerWidth + 'x' + innerHeight + ' (DPR ' + devicePixelRatio + ', zoom≈' + Math.round(outerWidth / innerWidth * 100) + '%)';
  out.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  out.videos = [...document.querySelectorAll('video')].map(v => ({
    src: v.currentSrc || v.src || (v.querySelector('source') || {}).src,
    paused: v.paused, muted: v.muted, autoplay: v.autoplay, playsinline: v.playsInline,
    readyState: v.readyState, networkState: v.networkState,
    error: v.error && v.error.code,
    display: getComputedStyle(v).display, visible: v.offsetWidth > 0 && v.offsetHeight > 0
  }));
  out.iframes = [...document.querySelectorAll('iframe')].map(f => f.src).filter(s => /youtu|vimeo|video/i.test(s));
  out.hiddenAnimText = [...document.querySelectorAll('[data-aos],[class*=animate],[class*=fade],[class*=reveal]')]
    .filter(e => getComputedStyle(e).opacity === '0').slice(0, 10).map(e => e.className.toString().slice(0, 80));
  out.failedResources = performance.getEntriesByType('resource')
    .filter(r => r.responseStatus >= 400 || (r.transferSize === 0 && r.decodedBodySize === 0 && r.duration > 0 && /\.(mp4|js)/.test(r.name)))
    .map(r => r.name).slice(0, 15);
  console.log(JSON.stringify(out, null, 2));
  document.querySelectorAll('video').forEach(v => { v.muted = true; v.play().then(() => console.log('수동 play 성공', v.currentSrc), e => console.log('수동 play 실패', e.name, e.message)); });
})();
