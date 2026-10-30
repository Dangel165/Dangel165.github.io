---
layout: post
title: "첫 버그바운티 제보 회고 — IDOR 하나 찾기까지"
categories: [bugbounty]
tags: [idor, web, report]
---

> 예시 글입니다. 실제 제보 건은 **프로그램 정책상 공개가 허용된 경우에만**, 민감 정보를 가린 뒤 게시하세요.

## 타깃 선정

처음에는 범위(scope)가 넓고 응답이 빠른 프로그램을 골랐습니다. 정책 문서를 먼저 꼼꼼히 읽는 게 1순위.

## 발견

`GET /api/orders/{id}` 에서 `id` 만 바꿔도 다른 사용자의 주문이 조회되는 **IDOR**.

```http
GET /api/orders/10422 HTTP/1.1
Authorization: Bearer <내 토큰>
```

## 리포트 작성 팁

1. 재현 절차를 누구나 따라 할 수 있게 번호로
2. 영향도(어떤 데이터가, 몇 명에게) 명확히
3. 수정 방안 제안 — 서버 측 소유권 검증

## 결과

`Triaged → Resolved`. 금액보다 "내가 찾은 게 실제로 고쳐졌다"는 경험이 더 컸습니다.
