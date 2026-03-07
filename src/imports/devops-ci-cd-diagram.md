DevOps 홈서버 인프라 구조를 설명하는 인터랙티브 아키텍처 다이어그램 UI를 디자인한다.
이 UI는 React 웹 애플리케이션으로 구현될 예정이며, 사용자가 CI/CD 파이프라인 흐름을 직관적으로 이해할 수 있도록 시각화하는 것이 목적이다.

이 다이어그램은 Pull Request 기반 CI/CD 파이프라인과 Preview Environment 배포 구조를 설명해야 한다.

전체 스타일은 다음과 같은 디자인을 따른다.

modern DevOps dashboard 스타일

dark theme 기반 UI

cloud infrastructure diagram 스타일

개발자 문서 또는 DevOps 발표 자료에 사용할 수 있는 전문적인 아키텍처 다이어그램

전체 레이아웃

화면은 가로 방향 아키텍처 다이어그램으로 구성한다.

데이터 흐름 방향은 다음과 같다.

왼쪽 → 오른쪽

파이프라인 흐름은 다음과 같다.

Developer / GitHub
→ Jenkins CI
→ Jenkins Build Agent
→ GitHub Container Registry (GHCR)
→ Runtime Server (Mac Mini)
→ Traefik Reverse Proxy
→ Preview Web Environment

각 인프라 시스템은 아이콘과 카드 형태의 노드로 표현한다.

노드 사이에는 화살표를 사용하여 데이터 흐름과 CI/CD 파이프라인을 표현한다.

노드들은 균등한 간격으로 중앙에 정렬된 형태로 배치한다.

캔버스 설정

캔버스 크기

1920 x 1080

배경 스타일

Dark DevOps Dashboard 스타일

배경 색상

#0f172a

그리드 시스템

12 column grid
24px spacing

아키텍처 다이어그램은 화면 중앙 영역에 배치한다.

노드 디자인

각 인프라 시스템은 카드 스타일 노드로 표현한다.

카드 스타일

width: 240px
height: 130px
border radius: 16px
background: #1e293b
border: 1px solid #334155
soft shadow
padding: 16px

각 노드는 다음 요소로 구성한다.

아이콘
노드 제목
간단한 설명
인프라 메타 정보

노드 1 — GitHub

아이콘

GitHub 로고

제목

GitHub Repository

설명

개발자가 feature 브랜치를 생성하고 Pull Request를 생성한다.

메타 정보

Source Control
Pull Request Workflow

시각적 요소

브랜치 아이콘 또는 브랜치 흐름 그래픽을 사용하여
feature branch → Pull Request 흐름을 표현한다.

노드 2 — Jenkins CI

아이콘

Jenkins 로고

제목

Jenkins CI Server

설명

GitHub에서 Pull Request가 생성되면 Webhook 이벤트를 통해 Jenkins가 이를 감지한다.

메타 정보

Edge Node
Windows WSL2

GitHub → Jenkins 연결 라벨

Webhook Event

노드 3 — Jenkins Build Agent

아이콘

노트북 또는 빌드 서버 아이콘

제목

Jenkins Build Agent

설명

MacBook Build Agent가 CI 파이프라인을 실행하고 애플리케이션을 빌드한다.

메타 정보

Build
Test
Docker Image Build

연결 라벨

Build Trigger

노드 4 — Container Registry

아이콘

컨테이너 레지스트리 또는 Docker registry 스타일 아이콘

제목

GitHub Container Registry

설명

CI 파이프라인에서 생성된 Docker 이미지가 GHCR에 Push 된다.

메타 정보

Image Storage
Version Management

연결 라벨

Docker Push

노드 5 — Runtime Server

아이콘

서버 랙 아이콘

제목

Runtime Server (Mac Mini)

설명

Runtime 서버가 Container Registry에서 Docker 이미지를 Pull 받아 브랜치 기반 컨테이너를 실행한다.

메타 정보

Docker Runtime
Preview Environment

연결 라벨

Docker Pull

노드 6 — Reverse Proxy

아이콘

네트워크 라우팅 또는 로드밸런서 아이콘

제목

Traefik Reverse Proxy

설명

Traefik이 브랜치 기반 도메인을 자동으로 라우팅하여 해당 컨테이너로 트래픽을 전달한다.

메타 정보

Dynamic Routing
Auto Domain Mapping

연결 라벨

Traffic Routing

노드 7 — Preview Environment

아이콘

웹 브라우저 아이콘

제목

Preview Environment

설명

각 Pull Request마다 독립적인 Preview 환경이 생성된다.

예시 도메인

feature-login.dev.example.com
feature-payment.dev.example.com

연결 디자인

각 노드는 곡선 화살표(curved arrow) 로 연결한다.

화살표 스타일

밝은 파란색
soft glow
DevOps pipeline 스타일

각 연결선에는 작업을 설명하는 라벨을 표시한다.

예시

Webhook
Build Trigger
Docker Push
Docker Pull
Traffic Routing

인터랙션 디자인

이 UI는 인터랙티브 아키텍처 다이어그램으로 디자인한다.

각 노드에 마우스를 올리면 다음 인터랙션이 발생한다.

노드 강조 표시
툴팁 표시

툴팁에는 해당 인프라 시스템의 자세한 설명을 표시한다.

예시 (Jenkins)

Jenkins는 GitHub Pull Request 이벤트를 Webhook으로 감지하고 CI/CD 파이프라인을 실행한다.

디자인 스타일

전체 디자인 스타일은 다음 특징을 가진다.

DevOps 대시보드 스타일
Cloud infrastructure diagram 스타일
현대적인 다크 테마
개발자 문서 스타일 UI
깔끔하고 전문적인 아키텍처 다이어그램

참고 스타일

Cloud architecture diagrams
GitHub engineering diagrams
Kubernetes infrastructure diagrams

색상 시스템

Primary Color

#2563eb

GitHub

#ffffff

Jenkins

#d33833

Docker

#0db7ed

Container Registry

#8b5cf6

Runtime Server

#10b981

Traefik

#f59e0b

애니메이션 (선택 사항)

CI/CD 흐름을 표현하기 위해 화살표 위에 데이터 흐름 애니메이션을 추가한다.

예시

화살표를 따라 이동하는 작은 점
파이프라인 흐름 애니메이션

흐름 순서

GitHub
→ Jenkins
→ Build Agent
→ Container Registry
→ Runtime Server
→ Traefik
→ Preview Environment

최종 목표

이 디자인은 다음 내용을 시각적으로 설명해야 한다.

Pull Request 기반 CI/CD 파이프라인
Docker 이미지 빌드 과정
Container Registry 저장 과정
Runtime 서버 배포 과정
Traefik 기반 도메인 라우팅
Preview Environment 생성 구조

결과 디자인은 개발자 문서나 DevOps 발표 자료에 사용할 수 있는 전문적인 인프라 아키텍처 다이어그램 UI여야 한다.