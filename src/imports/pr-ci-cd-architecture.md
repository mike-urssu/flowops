아래 요구사항을 기반으로 홈서버 DevOps 인프라 아키텍처 다이어그램을 그려주세요.

목표는 개발자가 Pull Request를 생성하면 자동으로 PR 환경이 생성되는 CI/CD 인프라 흐름을 시각적으로 설명하는 것입니다.

이 다이어그램은 설명용(Architecture Overview) 이므로 복잡한 메트릭이나 수치는 포함하지 않고 흐름과 역할 중심으로 표현합니다.

디자인 스타일은 Modern DevOps Architecture Diagram 스타일로 구성합니다.

1. 전체 레이아웃 구조

화면을 좌 → 우 흐름의 CI/CD 파이프라인 구조로 구성합니다.

레이아웃은 다음 4개의 영역으로 나눕니다.

Developer Zone
↓
CI Control Node (Edge Server)
↓
Build Infrastructure
↓
Runtime Infrastructure

그리고 각 영역 안에 실제 Hardware 박스를 먼저 그리고
그 내부에 인프라 서비스 아이콘을 배치합니다.

2. Developer Zone

왼쪽에 Developer 영역을 배치합니다.

아이콘

Git Repository (GitHub 스타일 아이콘)

Git 아이콘 옆에 Branch → Pull Request 흐름을 표현합니다.

구성

Developer
   ↓
Feature Branch 생성
   ↓
Pull Request 생성

표현 방식

브랜치 아이콘에서 PR 아이콘으로 이어지는 화살표

설명 Tooltip

개발자가 Feature Branch를 생성하고 Pull Request를 생성한다.
PR 생성 시 Git Webhook 이벤트가 Jenkins로 전달된다.
3. Edge Node (CI Control Node)

Developer 영역 오른쪽에 Edge Node 서버 박스를 그립니다.

HW 이름

HW1 - Edge Node
Windows PC (WSL2)

이 HW 박스 내부에 다음 인프라를 배치합니다.

아이콘

Jenkins

Traefik

설명

Jenkins는 CI 파이프라인을 제어하는 Master 서버

Traefik은 Reverse Proxy + Dynamic Routing 역할

아이콘 배치

[ Jenkins ]
[ Traefik ]

기능 설명

Jenkins

Webhook을 통해 Pull Request 이벤트를 감지한다.
빌드 작업을 Build Agent로 전달한다.

Traefik

브랜치 기반 도메인 라우팅을 담당한다.
예: feature-login.dev.local
4. Build Infrastructure

Edge Node 오른쪽에 Build Infrastructure 영역을 배치합니다.

이 영역에는 MacBook Build Agent 서버를 배치합니다.

HW 이름

HW3 - Build Agent
MacBook

이 HW 박스 내부에는 다음 아이콘을 배치합니다.

아이콘

Docker

Build System

설명

Jenkins가 Build Agent에 빌드 작업을 전달한다.
Build Agent에서 애플리케이션을 빌드한다.
Docker 이미지를 생성한다.

시각적 표현

Source Code
↓
Application Build
↓
Docker Image Build
5. Docker Registry

Build Agent 오른쪽에 Docker Registry 영역을 배치합니다.

이 Registry는 GitHub Container Registry(GHCR) 입니다.

아이콘

GHCR

설명

Docker 이미지 저장소
Build Agent가 이미지를 Push 한다.
Runtime Server가 이미지를 Pull 한다.

화살표

Build Agent → GHCR (Push)
6. Runtime Infrastructure

Registry 오른쪽에 Runtime Infrastructure 영역을 배치합니다.

HW 이름

HW2 - Runtime Server
Mac Mini Home Server

이 HW 박스 내부에 다음 아이콘을 배치합니다.

아이콘

Docker Engine

PR Container

설명

Runtime Server는 Docker 이미지를 GHCR에서 Pull 한다.
Pull 받은 이미지를 기반으로 PR 환경 컨테이너를 실행한다.

시각적 구성

GHCR
 ↓ Pull
Docker Engine
 ↓
Branch Container

컨테이너 이름 예시

feature-login-container
feature-payment-container
7. Traefik Routing

Traefik은 Edge Node 내부에 있지만 Runtime Container로 트래픽을 라우팅합니다.

표현 방식

Traefik → PR Container 화살표

설명

Traefik이 브랜치 기반 도메인을 자동으로 라우팅한다.

예시 도메인

feature-login.dev.local
feature-payment.dev.local
8. 전체 CI/CD 흐름 (화살표 연결)

다이어그램의 주요 흐름은 다음과 같이 연결합니다.

Developer
  ↓
Pull Request 생성
  ↓
Webhook
  ↓
Jenkins
  ↓
Build Agent (MacBook)
  ↓
Docker Image Build
  ↓
Push
  ↓
GHCR (Docker Registry)
  ↓
Pull
  ↓
Runtime Server (Mac Mini)
  ↓
Docker Container 실행
  ↓
Traefik Routing
  ↓
PR 환경 접속
9. 인터랙션 (Hover 또는 Click)

각 아이콘에는 Hover 또는 Click 시 다음 설명이 표시됩니다.

Git

개발자가 Feature Branch를 생성하고 Pull Request를 생성한다.

Jenkins

Webhook을 통해 PR 이벤트를 감지하고
Build Agent에 빌드 작업을 전달한다.

Build Agent

애플리케이션을 빌드하고 Docker 이미지를 생성한다.

GHCR

Docker 이미지를 저장하는 Registry

Runtime Server

이미지를 Pull 받아 PR 환경 컨테이너를 실행한다.

Traefik

브랜치 기반 도메인을 자동 라우팅한다.
10. 디자인 스타일

다음 스타일을 사용합니다.

DevOps Architecture Diagram

컬러 스타일

Developer : Blue
CI Node : Purple
Build Node : Orange
Registry : Green
Runtime : Red
Networking : Cyan

아이콘 스타일

Flat DevOps Icon Style
Clean Modern Infrastructure Diagram
최종 목적

이 다이어그램은 다음 내용을 한눈에 설명할 수 있어야 합니다.

PR 생성 → 자동 빌드 → Docker 이미지 생성 → Registry Push → Runtime 배포 → Traefik 라우팅 → PR 환경 접속

그리고 각 인프라가 어떤 Hardware에서 동작하는지 명확히 표현해야 합니다.