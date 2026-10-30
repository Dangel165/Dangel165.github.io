# root@dangel:~# — Dangel's Terminal Blog

GitHub Pages + Jekyll로 만든 **터미널/CLI 컨셉 블로그**입니다.
메뉴는 `./dev`, `./ctf` 처럼 디렉터리로, 글 목록은 `ls -la` 로, 코드블록은 미니 터미널 창으로 보이고,
홈과 모든 페이지(<kbd>`</kbd> 키)에서 **실제로 명령어를 입력할 수 있는 셸**이 동작합니다.

```
dangel@blog:~$ ls
drwxr-xr-x  dev/        1 posts · 개발
drwxr-xr-x  ctf/        1 posts · CTF/Wargame
drwxr-xr-x  bugbounty/  1 posts · Bug Bounty
drwxr-xr-x  docs/       1 posts · 블로그/기술문서
drwxr-xr-x  paper/      1 posts · 논문/컨퍼런스
drwxr-xr-x  contest/    1 posts · 공모전/자격증
-rw-r--r--  about.md
```

---

## 1. GitHub Pages란?

GitHub 저장소에 올린 **정적 파일(HTML·CSS·JS)** 을 무료로 웹사이트로 호스팅해 주는 서비스입니다.

- **무료 · 서버 불필요** — push 만 하면 배포 끝. HTTPS 자동 적용.
- **Jekyll 내장** — Markdown(`.md`)으로 글을 쓰면 GitHub가 HTML로 빌드해 줍니다.
- **제약** — 서버 코드(PHP, Node 서버, DB)는 실행 불가. 정적 사이트만. 저장소 1GB / 월 100GB 트래픽 권장 한도.

| 사이트 종류 | 저장소 이름 | 접속 주소 | `_config.yml` 의 `baseurl` |
|---|---|---|---|
| 사용자 사이트 (1개) | `<아이디>.github.io` | `https://<아이디>.github.io` | `""` |
| 프로젝트 사이트 | 아무 이름 (예: `blog`) | `https://<아이디>.github.io/blog` | `"/blog"` |

**동작 원리**: 저장소에 push → GitHub Actions가 Jekyll로 빌드 → 결과물(`_site`)을 `github.io` 도메인에 배포.

## 2. 배포 방법

1. GitHub에서 **`<아이디>.github.io`** 이름으로 Public 저장소를 만듭니다.
2. `_config.yml` 에서 아래 값을 본인 것으로 바꿉니다.
   ```yaml
   github_username: "내아이디"
   url: "https://내아이디.github.io"
   email: "me@example.com"   # 선택
   ```
3. 이 폴더를 저장소에 올립니다.
   ```bash
   git init
   git add .
   git commit -m "init: terminal blog"
   git branch -M main
   git remote add origin https://github.com/<아이디>/<아이디>.github.io.git
   git push -u origin main
   ```
4. 저장소 **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/(root)** → Save
5. **Actions** 탭에서 `pages build and deployment` 가 초록색이 되면 `https://<아이디>.github.io` 접속.

### (선택) 로컬 미리보기

Ruby 설치 후:

```bash
bundle install
bundle exec jekyll serve
```

→ http://localhost:4000

## 3. 글 쓰기

`_posts/YYYY-MM-DD-영문-슬러그.md` 파일을 만듭니다.

```markdown
---
layout: post
title: "[pwnable] 문제 이름 write-up"
categories: [ctf]
tags: [pwn, rop]
---

본문은 Markdown으로 작성합니다.
```

`categories` 에는 아래 슬러그 중 **하나**를 넣으세요.

| 슬러그 | 메뉴 | URL |
|---|---|---|
| `dev` | 개발 | `/dev/` |
| `ctf` | CTF/Wargame | `/ctf/` |
| `bugbounty` | Bug Bounty | `/bugbounty/` |
| `docs` | 블로그/기술문서 | `/docs/` |
| `paper` | 논문/컨퍼런스 | `/paper/` |
| `contest` | 공모전/자격증 | `/contest/` |

이미지는 `assets/img/` 에 넣고 `![설명](/assets/img/파일.png)` 로 씁니다.

## 4. 커스터마이징

| 바꿀 것 | 파일 |
|---|---|
| 블로그 이름·설명·카테고리 이름/아이콘/설명 | `_config.yml` |
| 자기소개, 스킬 바, 이력(history), 목표(plan) | `about.html` |
| 홈 화면 ASCII 로고·소개 문구 | `index.html` |
| 색상 테마 (green / amber / dracula / paper) | `assets/css/style.css` 상단 `:root` |
| 터미널 명령어 추가 | `assets/js/terminal.js` 의 `COMMANDS` |

카테고리를 추가하려면 `_config.yml` 의 `blog_categories` 에 항목을 추가하고, 같은 이름의 폴더에 `index.html` 을 만들면 됩니다 (기존 `dev/index.html` 복사).

## 5. 터미널 명령어

| 명령어 | 동작 |
|---|---|
| `help` | 명령어 목록 |
| `ls` / `ls ctf` | 카테고리 / 해당 카테고리 글 목록 |
| `cd ctf` · `cd ~` · `cd about` | 페이지 이동 |
| `open 2` | 직전 목록의 2번째 글 열기 |
| `grep pwn` | 제목·태그 검색 |
| `recent` | 최근 글 5개 |
| `whoami` · `neofetch` | 소개 / 블로그 정보 |
| `theme` · `theme amber` | 테마 순환 / 지정 (선택은 브라우저에 저장) |
| `history` · `clear` · `date` · `echo` · `exit` | 기본 명령 |

<kbd>Tab</kbd> 자동완성 · <kbd>↑</kbd><kbd>↓</kbd> 히스토리 · <kbd>Ctrl</kbd>+<kbd>L</kbd> 화면 지우기 · 아무 페이지에서 <kbd>`</kbd> 로 드롭다운 터미널. 숨은 명령어도 몇 개 있습니다 (`sudo`, `cat flag`).

## 폴더 구조

```
├── _config.yml          # 사이트 설정 + 카테고리 정의
├── _layouts/            # default / post / category
├── _includes/           # head / header(프롬프트+메뉴) / footer(상태바)
├── _posts/              # 글 (Markdown)
├── assets/css/style.css # 터미널 테마
├── assets/js/terminal.js# 인터랙티브 셸
├── index.html           # 홈
├── about.html           # whoami
├── 404.html
└── dev/ ctf/ bugbounty/ docs/ paper/ contest/   # 카테고리 페이지
```
