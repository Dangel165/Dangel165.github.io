---
layout: post
title: "GitHub Pages로 터미널 블로그 만들기"
categories: [docs]
tags: [github-pages, jekyll, blog]
---

이 블로그는 **GitHub Pages + Jekyll** 로 만들었습니다. 서버도, 호스팅 비용도 없습니다.
저장소에 push 하면 GitHub가 알아서 빌드해서 `https://<아이디>.github.io` 에 올려줍니다.

## GitHub Pages란?

GitHub 저장소의 정적 파일(HTML/CSS/JS, 또는 Jekyll 소스)을 그대로 웹사이트로 서비스해 주는 무료 호스팅입니다.

| 종류 | 저장소 이름 | 주소 |
|---|---|---|
| 사용자 사이트 | `<아이디>.github.io` | `https://<아이디>.github.io` |
| 프로젝트 사이트 | 아무 이름 (예: `blog`) | `https://<아이디>.github.io/blog` |

- 사용자당 사용자 사이트는 **1개**, 프로젝트 사이트는 저장소마다 만들 수 있습니다.
- 서버 코드(PHP, DB 등)는 돌릴 수 없고 **정적 사이트만** 가능합니다.
- Jekyll을 기본 지원해서 Markdown으로 글을 쓰면 HTML로 바꿔 줍니다.

## 배포 순서

```bash
# 1. <아이디>.github.io 이름으로 새 저장소 생성 후
git clone https://github.com/<아이디>/<아이디>.github.io.git
cd <아이디>.github.io

# 2. 블로그 파일 복사 → 커밋 → 푸시
git add .
git commit -m "init: dangel terminal blog"
git push origin main
```

3. 저장소 **Settings → Pages → Build and deployment** 에서 Source를 `Deploy from a branch`, 브랜치를 `main` / `/(root)` 로 지정
4. 1~2분 뒤 **Actions** 탭에서 빌드가 끝나면 접속!

## 새 글 쓰기

`_posts/YYYY-MM-DD-제목.md` 파일을 만들고 맨 위에 front matter를 적으면 끝입니다.

```yaml
---
layout: post
title: "글 제목"
categories: [ctf]        # dev | ctf | bugbounty | docs | paper | contest
tags: [pwn, bof]
---
```

> 팁: 아무 페이지에서나 <kbd>`</kbd> 키를 눌러 터미널을 열고 `ls`, `cd ctf`, `grep pwn` 을 쳐보세요.
