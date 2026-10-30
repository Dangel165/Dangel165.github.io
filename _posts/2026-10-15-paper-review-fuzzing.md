---
layout: post
title: "[논문 리뷰] AFL은 왜 강한가 — Coverage-guided Fuzzing 정리"
categories: [paper]
tags: [fuzzing, paper-review, afl]
---

> 예시 리뷰 템플릿입니다. 읽은 논문/발표로 채워 넣으세요.

## 한 줄 요약

**실행 경로 커버리지**를 피드백 삼아 입력을 변이시키면, 무작위 퍼징보다 훨씬 깊은 버그까지 도달한다.

## 핵심 아이디어

- 컴파일 시 계측(instrumentation)으로 분기 간 엣지를 비트맵에 기록
- 새로운 엣지를 밟은 입력만 큐에 보관 → 진화적 탐색
- 비트 플립, 산술 연산, 사전(dictionary) 기반 변이

## 내 생각

| 장점 | 한계 |
|---|---|
| 단순하고 빠름 | 매직 넘버/체크섬 통과가 어려움 |
| 범용성 | 상태가 있는 프로토콜엔 약함 |

## 더 읽을 거리

- AFL++, libFuzzer, 그리고 구조 인식(structure-aware) 퍼징
