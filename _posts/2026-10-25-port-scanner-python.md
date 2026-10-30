---
layout: post
title: "asyncio로 초간단 포트 스캐너 만들기"
categories: [dev]
tags: [python, asyncio, tool]
---

> 예시 글입니다. 본인 프로젝트 기록으로 바꿔 쓰세요. 스캔은 **허가된 대상에만**!

## 왜 만들었나

nmap은 훌륭하지만, 동작 원리를 이해하려면 직접 만들어보는 게 제일 빠릅니다.

## 코드

```python
import asyncio

async def check(host, port, timeout=1.0):
    try:
        _, w = await asyncio.wait_for(asyncio.open_connection(host, port), timeout)
        w.close()
        return port
    except Exception:
        return None

async def scan(host, ports):
    results = await asyncio.gather(*(check(host, p) for p in ports))
    return [p for p in results if p]

print(asyncio.run(scan("127.0.0.1", range(1, 1025))))
```

## 다음 할 일

- 동시 연결 수 제한(`asyncio.Semaphore`)
- 배너 그래빙으로 서비스 식별
