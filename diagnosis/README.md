# Hero 영상 · 텍스트 애니메이션 재생 불가 진단 (노트북)

대상: https://wellcommdesign.imweb.me/ — 작성일 2026-10-05

## 확인한 것
- 사이트 직접 접속: **불가** (작업 환경의 네트워크 정책이 `wellcommdesign.imweb.me` 차단) → 실제 페이지 코드는 아직 못 봄
- 저장소의 영상 파일 분석 (ffprobe):

| 파일 | 코덱 | 해상도 | 길이 | moov 위치 | 오디오 |
|---|---|---|---|---|---|
| WellCommHERO-web.mp4 | H.264 High@4.0, yuv420p | 832×464 | 5.0s | 앞쪽(faststart) | 없음 |
| WellCommVIDEO02-web.mp4 | H.264 High@4.0, yuv420p | 1280×720 | 21.5s | 앞쪽(faststart) | 없음 |

→ **영상 파일 자체는 정상.** 모든 브라우저에서 재생 가능한 형식이고, 소리가 없어 자동재생 정책에도 걸리지 않음.

- GitHub raw 주소 응답: `content-type: application/octet-stream` + `nosniff`
  → video/mp4로 내려주지 않음. Chrome은 대개 재생하지만 Safari·일부 보안 프로그램/회사망에서는 막힐 수 있음.

## 영상과 텍스트 애니메이션이 "둘 다" 노트북에서만 안 될 때 가장 유력한 원인
1. **Windows "애니메이션 효과" 꺼짐 / macOS "동작 줄이기" 켜짐**
   - 브라우저에 `prefers-reduced-motion: reduce` 가 전달됨 → 아임웹/AOS/GSAP 등의 애니메이션이 꺼지고, 테마에 따라 배경영상 자동재생도 중단됨.
   - 노트북은 절전·성능 설정으로 이게 꺼져 있는 경우가 많음.
   - 확인: Windows 설정 → 접근성 → 시각 효과 → **애니메이션 효과 켬** / macOS 설정 → 손쉬운 사용 → 디스플레이 → **동작 줄이기 끔**
2. **절전 모드 (배터리 사용 중)** — Chrome 에너지 절약 모드, macOS 저전력 모드, Safari는 저전력 시 자동재생 차단.
3. **브라우저 자동재생 설정** — Chrome `chrome://settings/content/sound`, Safari "이 웹사이트에 대한 설정 → 자동 재생: 모든 미디어 자동 재생 허용".
4. **확장 프로그램(광고 차단기)·백신·회사망**이 raw.githubusercontent.com 영상 주소를 차단.
5. **하드웨어 가속 꺼짐** — Chrome 설정 → 시스템 → "가능한 경우 그래픽 가속 사용" 켬.

## 노트북에서 바로 확인하는 방법
`hero-check.html` 을 노트북에 다운로드 → 더블클릭으로 열기 → 표시되는 결과를 캡처해서 보내주세요.
(애니메이션 줄이기 여부, 코덱 지원, 자동재생 차단 여부를 자동으로 표시)

## 권장 수정 (사이트 쪽)
- 영상 태그는 반드시 `autoplay muted loop playsinline` 모두 포함, `poster` 이미지 지정.
- 영상은 GitHub raw 대신 **아임웹 파일 업로드** 또는 `video/mp4` 로 서비스하는 CDN에 올리기.
- 커스텀 애니메이션 코드에 reduced-motion 처리가 있다면, 텍스트가 "숨김 상태로 멈추지" 않도록 최종 상태(opacity:1)를 보여주기.
- 자동재생이 막혔을 때를 대비한 보조 코드:
```html
<script>
document.querySelectorAll('video[autoplay]').forEach(v=>{
  v.muted=true; v.playsInline=true;
  const p=v.play(); if(p) p.catch(()=>{
    const go=()=>{v.play();removeEventListener('pointerdown',go);};
    addEventListener('pointerdown',go,{once:true});
  });
});
</script>
```

## 다음 단계
사이트를 직접 열어 코드를 확인하려면 작업 환경 네트워크 설정에 `wellcommdesign.imweb.me` 를 허용해 주세요.
