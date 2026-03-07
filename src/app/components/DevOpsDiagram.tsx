import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Laptop2, Server, Globe, GitBranch, GitPullRequest,
  CheckCircle2, ArrowRight, Container, User, Zap, Terminal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Canvas Constants ────────────────────────────────────────────────────────
const CW = 1500;
const CH = 600;

// ─── Icons ───────────────────────────────────────────────────────────────────
const GitHubIcon = ({ size = 28, color = '#c9d1d9' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const JenkinsIcon = ({ size = 28, color = '#d33833' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M11.9998 1C6.47629 1 1.99984 5.47645 1.99984 11C1.99984 13.8487 3.13099 16.4378 5.00001 18.3137V21C5.00001 21.5523 5.44773 22 6.00001 22H18C18.5523 22 19 21.5523 19 21V18.3137C20.869 16.4378 22 13.8487 22 11C22 5.47645 17.5236 1 11.9998 1ZM12 3C16.4183 3 20 6.58172 20 11C20 13.2091 19.1045 15.2091 17.6569 16.6569L17 17.3137V20H7.00001V17.3137L6.34314 16.6569C4.89544 15.2091 4 13.2091 4 11C4 6.58172 7.58172 3 12 3Z" />
    <circle cx="9" cy="10" r="1.5" fill={color} />
    <circle cx="15" cy="10" r="1.5" fill={color} />
    <path d="M9 14C9 14 10.5 16 12 16C13.5 16 15 14 15 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

const DockerIcon = ({ size = 28, color = '#2496ed' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.186.186 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288-.11-.099z" />
  </svg>
);

const TraefikIcon = ({ size = 28, color = '#06b6d4' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M12 2L12 22" stroke={color} strokeWidth="1.5" opacity="0.4" />
    <path d="M3 7L21 17" stroke={color} strokeWidth="1.5" opacity="0.4" />
    <path d="M21 7L3 17" stroke={color} strokeWidth="1.5" opacity="0.4" />
    <circle cx="12" cy="12" r="3" fill={color} opacity="0.8" />
  </svg>
);

const BuildIcon = ({ size = 28, color = '#f59e0b' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

// ─── Zone / Service Data ──────────────────────────────────────────────────────

interface ServiceNode {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  accent: string;
  Icon: React.FC<{ size?: number; color?: string }>;
  tooltip: {
    title: string;
    body: string;
    steps: string[];
  };
}

interface HardwareZone {
  id: string;
  zoneLabel: string;
  hwName: string;
  hwSpec: string;
  color: string;
  bgTint: string;
  x: number;
  y: number;
  w: number;
  h: number;
  services: ServiceNode[];
}

const ZONES: HardwareZone[] = [
  {
    id: 'developer',
    zoneLabel: 'DEVELOPER ZONE',
    hwName: '',
    hwSpec: '',
    color: '#3b82f6',
    bgTint: 'rgba(59,130,246,0.04)',
    x: 30, y: 70, w: 230, h: 380,
    services: [
      {
        id: 'developer',
        label: 'Developer',
        sublabel: 'Feature Branch',
        color: '#3b82f6',
        accent: '#60a5fa',
        Icon: ({ size, color }) => <User size={size} color={color} strokeWidth={1.5} />,
        tooltip: {
          title: 'Developer',
          body: '개발자가 Feature Branch를 생성하고 Pull Request를 생성합니다.',
          steps: ['Feature Branch 생성', 'Pull Request 오픈'],
        },
      },
      {
        id: 'git',
        label: 'Git Repository',
        sublabel: 'GitHub',
        color: '#c9d1d9',
        accent: '#e2e8f0',
        Icon: GitHubIcon,
        tooltip: {
          title: 'GitHub Repository',
          body: 'PR 생성 시 Git Webhook 이벤트가 Jenkins로 전달됩니다.',
          steps: ['PR 생성 감지', 'Webhook 이벤트 발송', 'CI Pipeline 트리거'],
        },
      },
    ],
  },
  {
    id: 'edge',
    zoneLabel: 'CI CONTROL NODE',
    hwName: 'HW1 — Edge Node',
    hwSpec: 'Windows PC (WSL2)',
    color: '#a855f7',
    bgTint: 'rgba(168,85,247,0.04)',
    x: 320, y: 70, w: 260, h: 380,
    services: [
      {
        id: 'jenkins',
        label: 'Jenkins',
        sublabel: 'CI Master',
        color: '#ef4444',
        accent: '#f87171',
        Icon: JenkinsIcon,
        tooltip: {
          title: 'Jenkins CI Server',
          body: 'Webhook을 통해 PR 이벤트를 감지하고 빌드 작업을 Build Agent로 전달합니다.',
          steps: ['Webhook 이벤트 수신', 'Pipeline 스크립트 실행', 'Build Agent 디스패치'],
        },
      },
      {
        id: 'traefik',
        label: 'Traefik',
        sublabel: 'Reverse Proxy',
        color: '#06b6d4',
        accent: '#22d3ee',
        Icon: TraefikIcon,
        tooltip: {
          title: 'Traefik Reverse Proxy',
          body: '브랜치 기반 도메인 라우팅을 담당합니다. 예: feature-login.dev.local',
          steps: ['Docker 레이블 자동 감지', '서브도메인 동적 생성', 'SSL/TLS 자동 발급'],
        },
      },
    ],
  },
  {
    id: 'build',
    zoneLabel: 'BUILD INFRASTRUCTURE',
    hwName: 'HW3 — Build Agent',
    hwSpec: 'MacBook',
    color: '#f59e0b',
    bgTint: 'rgba(245,158,11,0.04)',
    x: 640, y: 70, w: 260, h: 380,
    services: [
      {
        id: 'build-system',
        label: 'Build System',
        sublabel: 'Application Build',
        color: '#f59e0b',
        accent: '#fbbf24',
        Icon: BuildIcon,
        tooltip: {
          title: 'Build System',
          body: 'Jenkins가 Build Agent에 빌드 작업을 전달합니다. 소스 빌드 및 테스트를 수행합니다.',
          steps: ['소스 코드 빌드', '유닛 테스트 실행'],
        },
      },
      {
        id: 'docker-build',
        label: 'Docker',
        sublabel: 'Image Build',
        color: '#2496ed',
        accent: '#60a5fa',
        Icon: DockerIcon,
        tooltip: {
          title: 'Docker Image Build',
          body: '애플리케이션을 빌드한 후 Docker 이미지를 생성합니다.',
          steps: ['Dockerfile 기반 빌드', 'Docker Image 생성', 'GHCR Push 준비'],
        },
      },
    ],
  },
  {
    id: 'registry',
    zoneLabel: 'DOCKER REGISTRY',
    hwName: '',
    hwSpec: 'Cloud Service',
    color: '#10b981',
    bgTint: 'rgba(16,185,129,0.04)',
    x: 960, y: 70, w: 200, h: 380,
    services: [
      {
        id: 'ghcr',
        label: 'GHCR',
        sublabel: 'Container Registry',
        color: '#10b981',
        accent: '#34d399',
        Icon: ({ size, color }) => <Container size={size} color={color} strokeWidth={1.5} />,
        tooltip: {
          title: 'GitHub Container Registry',
          body: 'Docker 이미지 저장소. Build Agent가 이미지를 Push하고, Runtime Server가 Pull합니다.',
          steps: ['Docker Image Push', '브랜치 기반 태그 관리', '이미지 버전 히스토리'],
        },
      },
    ],
  },
  {
    id: 'runtime',
    zoneLabel: 'RUNTIME INFRASTRUCTURE',
    hwName: 'HW2 — Runtime Server',
    hwSpec: 'Mac Mini Home Server',
    color: '#ef4444',
    bgTint: 'rgba(239,68,68,0.04)',
    x: 1220, y: 70, w: 250, h: 380,
    services: [
      {
        id: 'docker-engine',
        label: 'Docker Engine',
        sublabel: 'Container Runtime',
        color: '#ef4444',
        accent: '#f87171',
        Icon: DockerIcon,
        tooltip: {
          title: 'Docker Engine',
          body: 'Runtime Server는 Docker 이미지를 GHCR에서 Pull 받아 실행합니다.',
          steps: ['GHCR에서 이미지 Pull', '컨테이너 실행'],
        },
      },
      {
        id: 'pr-container',
        label: 'PR Containers',
        sublabel: 'Preview Environments',
        color: '#f97316',
        accent: '#fb923c',
        Icon: ({ size, color }) => <Globe size={size} color={color} strokeWidth={1.5} />,
        tooltip: {
          title: 'PR Containers',
          body: 'Pull 받은 이미지를 기반으로 PR 환경 컨테이너를 실행합니다.',
          steps: ['feature-login-container', 'feature-payment-container', 'PR 종료 시 자동 삭제'],
        },
      },
    ],
  },
];

// ─── Event Chain (전체 파이프라인 이벤트 흐름) ─────────────────────────────────
interface EventStep {
  from: string;
  to: string;
  emoji: string;
  text: string;
  detail: string;
  color: string;
  duration: number; // animation duration in ms
}

const EVENT_CHAIN: EventStep[] = [
  {
    from: 'developer', to: 'git',
    emoji: '📝', text: 'PR 생성', detail: 'Feature Branch에서 Pull Request를 생성합니다',
    color: '#3b82f6', duration: 800,
  },
  {
    from: 'git', to: 'jenkins',
    emoji: '📨', text: 'Webhook 이벤트 발송', detail: 'GitHub → Jenkins로 Webhook 이벤트 전달',
    color: '#a855f7', duration: 1000,
  },
  {
    from: 'jenkins', to: 'build-system',
    emoji: '🔧', text: 'Build 작업 디스패치', detail: 'Jenkins가 Build Agent에 빌드 작업을 전달',
    color: '#f59e0b', duration: 1000,
  },
  {
    from: 'build-system', to: 'docker-build',
    emoji: '📦', text: 'Docker Image 빌드', detail: '소스 빌드 완료 → Docker 이미지 생성 시작',
    color: '#2496ed', duration: 800,
  },
  {
    from: 'docker-build', to: 'ghcr',
    emoji: '⬆️', text: 'Image Push', detail: 'Docker 이미지를 GHCR에 Push',
    color: '#10b981', duration: 1000,
  },
  {
    from: 'ghcr', to: 'docker-engine',
    emoji: '⬇️', text: 'Image Pull', detail: 'Runtime Server가 GHCR에서 이미지 Pull',
    color: '#ef4444', duration: 1000,
  },
  {
    from: 'docker-engine', to: 'pr-container',
    emoji: '🚀', text: 'Container 실행', detail: 'PR 브랜치 기반 컨테이너를 실행',
    color: '#f97316', duration: 800,
  },
  {
    from: 'pr-container', to: 'traefik',
    emoji: '🌐', text: 'Traefik 라우팅 등록', detail: '브랜치 기반 도메인이 자동 생성됨',
    color: '#06b6d4', duration: 1200,
  },
];

// ─── Connection flow data ─────────────────────────────────────────────────────
interface FlowConnection {
  fromService: string;
  toService: string;
  label: string;
  delay: number;
  color: string;
}

const FLOWS: FlowConnection[] = [
  { fromService: 'git', toService: 'jenkins', label: 'Webhook', delay: 0, color: '#a855f7' },
  { fromService: 'jenkins', toService: 'build-system', label: 'Build Trigger', delay: 0.4, color: '#f59e0b' },
  { fromService: 'docker-build', toService: 'ghcr', label: 'Push', delay: 0.8, color: '#10b981' },
  { fromService: 'ghcr', toService: 'docker-engine', label: 'Pull', delay: 1.2, color: '#ef4444' },
  { fromService: 'docker-engine', toService: 'pr-container', label: 'Run', delay: 1.6, color: '#f97316' },
];

// ─── Position helpers ─────────────────────────────────────────────────────────
function getServicePos(serviceId: string): { x: number; y: number } {
  for (const zone of ZONES) {
    const sIdx = zone.services.findIndex(s => s.id === serviceId);
    if (sIdx >= 0) {
      const serviceCount = zone.services.length;
      const serviceH = 90;
      const gap = 16;
      const totalH = serviceCount * serviceH + (serviceCount - 1) * gap;
      const startY = zone.y + 70 + (zone.h - 70 - 40 - totalH) / 2;
      const sy = startY + sIdx * (serviceH + gap) + serviceH / 2;
      return { x: zone.x + zone.w / 2, y: sy };
    }
  }
  return { x: 0, y: 0 };
}

function getFlowPath(from: FlowConnection): string {
  const fp = getServicePos(from.fromService);
  const tp = getServicePos(from.toService);

  if (Math.abs(fp.x - tp.x) < 50) {
    const midY = (fp.y + tp.y) / 2;
    return `M ${fp.x} ${fp.y + 20} C ${fp.x} ${midY}, ${tp.x} ${midY}, ${tp.x} ${tp.y - 20}`;
  }

  let fromZone: HardwareZone | undefined;
  let toZone: HardwareZone | undefined;
  for (const z of ZONES) {
    if (z.services.some(s => s.id === from.fromService)) fromZone = z;
    if (z.services.some(s => s.id === from.toService)) toZone = z;
  }

  const sx = fromZone ? fromZone.x + fromZone.w : fp.x + 50;
  const ex = toZone ? toZone.x : tp.x - 50;
  const sy = fp.y;
  const ey = tp.y;
  const cpx1 = sx + (ex - sx) * 0.35;
  const cpx2 = sx + (ex - sx) * 0.65;

  return `M ${sx} ${sy} C ${cpx1} ${sy}, ${cpx2} ${ey}, ${ex} ${ey}`;
}

function getTraefikRoutingPath(): string {
  const traefikPos = getServicePos('traefik');
  const containerPos = getServicePos('pr-container');

  const fromZone = ZONES.find(z => z.services.some(s => s.id === 'traefik'))!;
  const toZone = ZONES.find(z => z.services.some(s => s.id === 'pr-container'))!;

  const sx = fromZone.x + fromZone.w;
  const ex = toZone.x;
  const sy = traefikPos.y;
  const ey = containerPos.y;

  const midX = (sx + ex) / 2;
  const belowY = Math.max(sy, ey) + 100;

  return `M ${sx} ${sy} C ${sx + 60} ${sy}, ${sx + 60} ${belowY}, ${midX} ${belowY} C ${ex - 60} ${belowY}, ${ex - 60} ${ey}, ${ex} ${ey}`;
}

// Compute animated event path endpoints (card center coordinates)
function getEventAnimationEndpoints(from: string, to: string): { sx: number; sy: number; ex: number; ey: number } {
  const fp = getServicePos(from);
  const tp = getServicePos(to);
  return { sx: fp.x, sy: fp.y, ex: tp.x, ey: tp.y };
}

// ─── Pipeline Steps ───────────────────────────────────────────────────────────
const PIPELINE_STEPS = [
  { label: 'PR Created', color: '#3b82f6', done: true },
  { label: 'Webhook', color: '#a855f7', done: true },
  { label: 'Build', color: '#f59e0b', done: true },
  { label: 'Docker Push', color: '#10b981', done: true },
  { label: 'Deploy', color: '#ef4444', done: true },
  { label: 'Routing', color: '#06b6d4', done: true },
  { label: 'Preview', color: '#3b82f6', done: true },
];

// ─── Service Card Component ──────────────────────────────────────────────────
interface ServiceCardProps {
  service: ServiceNode;
  isHovered: boolean;
  isReceiving: boolean;
  isAnimating: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service, isHovered, isReceiving, isAnimating, onMouseEnter, onMouseLeave, onClick,
}) => {
  const { Icon } = service;
  const active = isHovered || isReceiving;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{
        background: active
          ? `linear-gradient(135deg, ${service.color}15, rgba(30,41,59,0.95))`
          : 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))',
        border: `1px solid ${isReceiving ? service.accent : active ? service.color + '80' : '#334155'}`,
        borderRadius: 12,
        padding: '12px 14px',
        cursor: isAnimating ? 'not-allowed' : 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isReceiving ? 'translateY(-3px) scale(1.04)' : active ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isReceiving
          ? `0 0 30px ${service.accent}50, 0 0 60px ${service.accent}25, inset 0 0 20px ${service.accent}10`
          : active
            ? `0 0 20px ${service.accent}30, 0 0 40px ${service.accent}15`
            : '0 2px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Click ripple overlay */}
      {isReceiving && (
        <motion.div
          initial={{ opacity: 0.6, scale: 0 }}
          animate={{ opacity: 0, scale: 2.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 12,
            background: `radial-gradient(circle, ${service.accent}40, transparent 70%)`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {/* Accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: '3px 0 0 3px',
        background: isReceiving ? service.accent : active ? service.color : `${service.color}60`,
        transition: 'background 0.25s',
        zIndex: 1,
      }} />

      {/* Icon */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${service.color}15`,
        border: `1px solid ${isReceiving ? service.accent : service.color + '30'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, position: 'relative', zIndex: 1,
      }}>
        <Icon size={22} color={active ? service.accent : service.color} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: active ? '#f1f5f9' : '#e2e8f0', lineHeight: 1.3 }}>
          {service.label}
        </div>
        <div style={{ fontSize: 9.5, color: `${service.color}cc`, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>
          {service.sublabel}
        </div>
      </div>

      {/* Status / Click hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, position: 'relative', zIndex: 1 }}>
        {!isAnimating && (
          <Zap size={10} color={active ? service.accent : '#475569'} style={{ opacity: active ? 1 : 0.5 }} />
        )}
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: isReceiving ? service.accent : '#10b981',
          boxShadow: `0 0 6px ${isReceiving ? service.accent : '#10b981'}aa`,
          animation: 'pulse-dot 2s ease-in-out infinite',
        }} />
      </div>
    </div>
  );
};

// ─── Event Bubble (animated packet moving between services) ──────────────────
interface EventBubbleProps {
  event: EventStep;
  onComplete: () => void;
}

const EventBubble: React.FC<EventBubbleProps> = ({ event, onComplete }) => {
  const { sx, sy, ex, ey } = getEventAnimationEndpoints(event.from, event.to);

  return (
    <motion.div
      initial={{ left: sx - 90, top: sy - 18, opacity: 0, scale: 0.5 }}
      animate={{
        left: [sx - 90, (sx + ex) / 2 - 90, ex - 90],
        top: [sy - 18, Math.min(sy, ey) - 50, ey - 18],
        opacity: [0, 1, 1, 0.8],
        scale: [0.5, 1, 1, 0.9],
      }}
      transition={{
        duration: event.duration / 1000,
        ease: [0.4, 0, 0.2, 1],
        times: [0, 0.3, 0.85, 1],
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        width: 180,
        zIndex: 500,
        pointerEvents: 'none',
      }}
    >
      <div style={{
        background: 'rgba(15,23,42,0.95)',
        border: `1.5px solid ${event.color}`,
        borderRadius: 10,
        padding: '8px 12px',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 0 24px ${event.color}50, 0 4px 20px rgba(0,0,0,0.5)`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        {/* Glow pulse behind */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{
            position: 'absolute', inset: -4,
            borderRadius: 14,
            background: `radial-gradient(ellipse, ${event.color}20, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>{event.emoji}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: event.color, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
            {event.text}
          </div>
          <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 1, lineHeight: 1.3 }}>
            {event.detail}
          </div>
        </div>
      </div>
      {/* Trail particle */}
      <motion.div
        animate={{ opacity: [0.6, 0], scaleX: [1, 0.3], x: [-10, -30] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: 20, height: 3, borderRadius: 2,
          background: `linear-gradient(90deg, ${event.color}60, transparent)`,
        }}
      />
    </motion.div>
  );
};

// ─── Event Log Entry ─────────────────────────────────────────────────────────
interface LogEntry {
  id: number;
  time: string;
  emoji: string;
  text: string;
  detail: string;
  color: string;
  from: string;
  to: string;
}

// ─── Service Tooltip ──────────────────────────────────────────────────────────
interface ServiceTooltipProps {
  service: ServiceNode;
  zone: HardwareZone;
  serviceIndex: number;
  visible: boolean;
}

const ServiceTooltip: React.FC<ServiceTooltipProps> = ({ service, zone, serviceIndex, visible }) => {
  const serviceCount = zone.services.length;
  const serviceH = 90;
  const gap = 16;
  const totalH = serviceCount * serviceH + (serviceCount - 1) * gap;
  const startY = zone.y + 70 + (zone.h - 70 - 40 - totalH) / 2;
  const sy = startY + serviceIndex * (serviceH + gap);

  const tipWidth = 260;
  const tipLeft = zone.x + zone.w + 12;
  const tipTop = sy - 10;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -8, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -4, scale: 0.97 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: tipLeft,
            top: tipTop,
            width: tipWidth,
            background: 'rgba(15,23,42,0.97)',
            border: `1px solid ${service.color}50`,
            borderRadius: 12,
            padding: '14px 16px',
            zIndex: 200,
            backdropFilter: 'blur(12px)',
            boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 16px ${service.accent}20`,
            pointerEvents: 'none',
          }}
        >
          <div style={{
            position: 'absolute', left: -6, top: 20,
            width: 6, height: 10,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderRight: `6px solid ${service.color}50`,
          }} />
          <div style={{ fontSize: 12, fontWeight: 700, color: service.accent, marginBottom: 6, letterSpacing: '0.02em' }}>
            {service.tooltip.title}
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.6, marginBottom: 10 }}>
            {service.tooltip.body}
          </div>
          <div style={{ borderTop: `1px solid ${service.color}25`, paddingTop: 8 }}>
            {service.tooltip.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', background: `${service.color}20`,
                  border: `1px solid ${service.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontSize: 8, color: service.color, fontWeight: 700 }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 9.5, color: '#cbd5e1' }}>{step}</span>
              </div>
            ))}
          </div>
          {/* Click hint */}
          <div style={{
            marginTop: 8, paddingTop: 8,
            borderTop: `1px solid ${service.color}15`,
            fontSize: 9, color: '#475569', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Zap size={9} color="#475569" />
            클릭하면 이벤트 전파를 시작합니다
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function DevOpsDiagram() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  // Event animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentEventIdx, setCurrentEventIdx] = useState(-1);
  const [receivingService, setReceivingService] = useState<string | null>(null);
  const [activatedServices, setActivatedServices] = useState<Set<string>>(new Set());
  const [eventLogs, setEventLogs] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [eventLogs]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatLogTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 } as Intl.DateTimeFormatOptions);
  };

  const getServiceLabel = (id: string): string => {
    for (const z of ZONES) {
      const s = z.services.find(sv => sv.id === id);
      if (s) return s.label;
    }
    return id;
  };

  // Start event chain from a clicked service
  const handleServiceClick = useCallback((serviceId: string) => {
    if (isAnimating) return;

    // Find the first event in the chain that starts from this service
    const startIdx = EVENT_CHAIN.findIndex(e => e.from === serviceId);
    if (startIdx === -1) return;

    setIsAnimating(true);
    setActivatedServices(new Set([serviceId]));
    setCurrentEventIdx(startIdx);
    setEventLogs([]);

    // Add initial log
    logIdRef.current = 0;
    const sLabel = getServiceLabel(serviceId);
    setEventLogs([{
      id: logIdRef.current++,
      time: formatLogTime(),
      emoji: '▶',
      text: `이벤트 전파 시작`,
      detail: `${sLabel}에서 파이프라인 시작`,
      color: '#10b981',
      from: serviceId,
      to: '',
    }]);
  }, [isAnimating]);

  // When an event bubble animation completes
  const handleEventComplete = useCallback(() => {
    const event = EVENT_CHAIN[currentEventIdx];
    if (!event) return;

    // Mark destination as "receiving"
    setReceivingService(event.to);
    setActivatedServices(prev => new Set([...prev, event.to]));

    // Add log entry
    setEventLogs(prev => [...prev, {
      id: logIdRef.current++,
      time: formatLogTime(),
      emoji: event.emoji,
      text: event.text,
      detail: `${getServiceLabel(event.from)} → ${getServiceLabel(event.to)}`,
      color: event.color,
      from: event.from,
      to: event.to,
    }]);

    // After a brief "received" flash, fire the next event
    setTimeout(() => {
      setReceivingService(null);

      const nextIdx = currentEventIdx + 1;
      if (nextIdx < EVENT_CHAIN.length) {
        setCurrentEventIdx(nextIdx);
      } else {
        // Chain complete
        setCurrentEventIdx(-1);
        setEventLogs(prev => [...prev, {
          id: logIdRef.current++,
          time: formatLogTime(),
          emoji: '✅',
          text: '파이프라인 완료',
          detail: 'PR Preview 환경이 성공적으로 생성되었습니다',
          color: '#10b981',
          from: '',
          to: '',
        }]);

        setTimeout(() => {
          setIsAnimating(false);
          setActivatedServices(new Set());
        }, 2000);
      }
    }, 400);
  }, [currentEventIdx]);

  const activeEvent = currentEventIdx >= 0 ? EVENT_CHAIN[currentEventIdx] : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0a1628 0%, #0f172a 40%, #0d1b2e 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: '#e2e8f0',
    }}>
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes flow-dash { to { stroke-dashoffset: -24; } }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        padding: '20px 40px 0',
        borderBottom: '1px solid rgba(51,65,85,0.6)',
        background: 'rgba(15,23,42,0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 300,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: isAnimating ? '#f59e0b' : '#10b981',
                boxShadow: `0 0 8px ${isAnimating ? '#f59e0b' : '#10b981'}`,
                animation: isAnimating ? 'pulse-dot 0.8s ease-in-out infinite' : undefined,
              }} />
              <span style={{
                fontSize: 10,
                color: isAnimating ? '#f59e0b' : '#10b981',
                letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600,
              }}>
                {isAnimating ? 'Event Propagation in Progress...' : 'Architecture Overview — Click any service to simulate'}
              </span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', margin: 0 }}>
              PR-Based CI/CD Infrastructure Architecture
            </h1>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
              각 서비스 아이콘을 클릭하면 이벤트가 다음 시스템으로 전파되는 과정을 시각적으로 확인할 수 있습니다
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* Propagation indicator */}
            <AnimatePresence>
              {isAnimating && activeEvent && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    background: `${activeEvent.color}15`,
                    border: `1px solid ${activeEvent.color}50`,
                    borderRadius: 10, padding: '8px 14px', textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: activeEvent.color, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{activeEvent.emoji}</span> {activeEvent.text}
                  </div>
                  <div style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>{activeEvent.detail}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Clock */}
            <div style={{
              background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(51,65,85,0.8)',
              borderRadius: 10, padding: '8px 14px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>
                {formatTime(time)}
              </div>
              <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.06em', marginTop: 1 }}>UTC+09:00</div>
            </div>
          </div>
        </div>

        {/* Pipeline step progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, paddingBottom: 0, overflowX: 'auto' }}>
          {PIPELINE_STEPS.map((step, i) => (
            <React.Fragment key={i}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                borderBottom: `2px solid ${step.color}`,
                background: `${step.color}08`,
                borderRadius: '4px 4px 0 0',
                whiteSpace: 'nowrap',
              }}>
                <CheckCircle2 size={11} color={step.color} />
                <span style={{ fontSize: 10, color: '#94a3b8', letterSpacing: '0.04em' }}>{step.label}</span>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <ArrowRight size={10} color="#334155" style={{ flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Diagram Canvas ── */}
      <div style={{ overflowX: 'auto', overflowY: 'visible', padding: '30px 0 20px' }}>
        <div style={{ position: 'relative', width: CW, height: CH, margin: '0 auto' }}>

          {/* SVG Layer */}
          <svg
            width={CW} height={CH}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
          >
            <defs>
              <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="0.8" fill="#1e3a5f" opacity="0.5" />
              </pattern>
              <filter id="glow-conn" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-strong" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {['#a855f7', '#f59e0b', '#10b981', '#ef4444', '#f97316', '#06b6d4'].map(c => (
                <marker key={c} id={`arrow-${c.replace('#', '')}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill={c} opacity="0.9" />
                </marker>
              ))}
            </defs>

            <rect width={CW} height={CH} fill="url(#dot-grid)" />

            {/* Zone backgrounds */}
            {ZONES.map((zone) => (
              <g key={zone.id}>
                <rect
                  x={zone.x} y={zone.y}
                  width={zone.w} height={zone.h}
                  rx={16} ry={16}
                  fill={zone.bgTint}
                  stroke={`${zone.color}25`}
                  strokeWidth={1}
                  strokeDasharray="6 4"
                />
                <text
                  x={zone.x + zone.w / 2} y={zone.y + 20}
                  textAnchor="middle"
                  fill={zone.color}
                  fontSize={9}
                  fontFamily="'Inter', monospace"
                  letterSpacing="0.14em"
                  opacity={0.8}
                  fontWeight={700}
                >
                  {zone.zoneLabel}
                </text>
                {zone.hwName && (
                  <>
                    <rect
                      x={zone.x + 10} y={zone.y + 32}
                      width={zone.w - 20} height={30}
                      rx={6} ry={6}
                      fill={`${zone.color}08`}
                      stroke={`${zone.color}20`}
                      strokeWidth={0.5}
                    />
                    <text
                      x={zone.x + zone.w / 2} y={zone.y + 47}
                      textAnchor="middle"
                      fill={zone.color}
                      fontSize={9}
                      fontFamily="monospace"
                      opacity={0.7}
                      fontWeight={600}
                    >
                      {zone.hwName}
                    </text>
                    <text
                      x={zone.x + zone.w / 2} y={zone.y + 57}
                      textAnchor="middle"
                      fill="#475569"
                      fontSize={8}
                      fontFamily="monospace"
                    >
                      {zone.hwSpec}
                    </text>
                  </>
                )}
              </g>
            ))}

            {/* Internal zone flows */}
            {[ZONES[0], ZONES[2], ZONES[4]].map((zone) => {
              if (zone.services.length < 2) return null;
              const serviceH = 90;
              const gap = 16;
              const totalH = zone.services.length * serviceH + (zone.services.length - 1) * gap;
              const startY = zone.y + 70 + (zone.h - 70 - 40 - totalH) / 2;
              const y1 = startY + serviceH;
              const y2 = startY + serviceH + gap;
              const cx = zone.x + zone.w / 2;
              return (
                <g key={zone.id + '-internal'}>
                  <line x1={cx} y1={y1 - 2} x2={cx} y2={y2 + 2} stroke={`${zone.color}50`} strokeWidth={1} strokeDasharray="3 3" />
                  <polygon points={`${cx - 3},${y2 - 2} ${cx + 3},${y2 - 2} ${cx},${y2 + 3}`} fill={`${zone.color}80`} />
                </g>
              );
            })}

            {/* Flow connections between zones */}
            {FLOWS.map((flow, fi) => {
              const pathD = getFlowPath(flow);
              // Dim connections when animating and not yet activated
              const isEventActive = isAnimating;
              const fromActivated = activatedServices.has(flow.fromService);
              const toActivated = activatedServices.has(flow.toService);
              const connActive = !isEventActive || (fromActivated && toActivated);
              const connOpacity = isEventActive ? (connActive ? 1 : 0.2) : 1;

              return (
                <g key={fi} style={{ opacity: connOpacity, transition: 'opacity 0.3s' }}>
                  <path d={pathD} fill="none" stroke={flow.color} strokeWidth={4} opacity={0.1} filter="url(#glow-strong)" />
                  <path
                    d={pathD} fill="none" stroke={flow.color} strokeWidth={1.2}
                    strokeDasharray="6 4" opacity={0.25}
                    style={{ animation: `flow-dash ${1.5 + fi * 0.1}s linear infinite` }}
                  />
                  <path
                    d={pathD} fill="none" stroke={flow.color} strokeWidth={1.5}
                    markerEnd={`url(#arrow-${flow.color.replace('#', '')})`}
                    opacity={0.8} filter="url(#glow-conn)"
                  />
                  {!isEventActive && (
                    <>
                      <circle r="3" fill={flow.color} filter="url(#glow-conn)" opacity="0.9">
                        <animateMotion path={pathD} dur="2.4s" repeatCount="indefinite" begin={`${flow.delay}s`} />
                      </circle>
                      <circle r="1.8" fill={flow.color} opacity="0.4">
                        <animateMotion path={pathD} dur="2.4s" repeatCount="indefinite" begin={`${flow.delay + 0.15}s`} />
                      </circle>
                    </>
                  )}

                  {/* Label */}
                  {(() => {
                    const fp = getServicePos(flow.fromService);
                    const tp = getServicePos(flow.toService);
                    if (Math.abs(fp.x - tp.x) < 50) return null;
                    const fromZone = ZONES.find(z => z.services.some(s => s.id === flow.fromService));
                    const toZone = ZONES.find(z => z.services.some(s => s.id === flow.toService));
                    if (!fromZone || !toZone) return null;
                    const midX = (fromZone.x + fromZone.w + toZone.x) / 2;
                    const midY = (fp.y + tp.y) / 2;
                    const labelW = flow.label.length * 6.5 + 16;
                    return (
                      <g>
                        <rect
                          x={midX - labelW / 2} y={midY - 9}
                          width={labelW} height={18}
                          rx={4} ry={4}
                          fill="rgba(15,23,42,0.9)"
                          stroke={`${flow.color}50`}
                          strokeWidth={0.8}
                        />
                        <text
                          x={midX} y={midY + 3.5}
                          textAnchor="middle"
                          fill={flow.color}
                          fontSize={8.5}
                          fontFamily="'Inter', monospace"
                          letterSpacing="0.04em"
                          fontWeight="600"
                        >
                          {flow.label}
                        </text>
                      </g>
                    );
                  })()}
                </g>
              );
            })}

            {/* Traefik → PR Container routing */}
            {(() => {
              const pathD = getTraefikRoutingPath();
              const color = '#06b6d4';
              const trafikActivated = !isAnimating || (activatedServices.has('traefik') && activatedServices.has('pr-container'));
              const op = isAnimating ? (trafikActivated ? 1 : 0.2) : 1;
              return (
                <g style={{ opacity: op, transition: 'opacity 0.3s' }}>
                  <path d={pathD} fill="none" stroke={color} strokeWidth={3} opacity={0.08} filter="url(#glow-strong)" />
                  <path
                    d={pathD} fill="none" stroke={color} strokeWidth={1}
                    strokeDasharray="8 5" opacity={0.3}
                    style={{ animation: 'flow-dash 2s linear infinite' }}
                  />
                  <path
                    d={pathD} fill="none" stroke={color} strokeWidth={1.2}
                    markerEnd="url(#arrow-06b6d4)"
                    opacity={0.6}
                  />
                  {!isAnimating && (
                    <circle r="2.5" fill={color} opacity="0.7">
                      <animateMotion path={pathD} dur="3.5s" repeatCount="indefinite" begin="0.5s" />
                    </circle>
                  )}

                  {(() => {
                    const traefikPos = getServicePos('traefik');
                    const containerPos = getServicePos('pr-container');
                    const midX = (ZONES[1].x + ZONES[1].w + ZONES[4].x) / 2;
                    const labelY = Math.max(traefikPos.y, containerPos.y) + 108;
                    return (
                      <g>
                        <rect
                          x={midX - 50} y={labelY - 9}
                          width={100} height={18}
                          rx={4} ry={4}
                          fill="rgba(15,23,42,0.9)"
                          stroke={`${color}40`}
                          strokeWidth={0.8}
                        />
                        <text
                          x={midX} y={labelY + 3.5}
                          textAnchor="middle"
                          fill={color}
                          fontSize={8.5}
                          fontFamily="'Inter', monospace"
                          letterSpacing="0.04em"
                          fontWeight="600"
                        >
                          Traffic Routing
                        </text>
                      </g>
                    );
                  })()}
                </g>
              );
            })()}
          </svg>

          {/* HTML Layer — Zone service cards */}
          {ZONES.map((zone) => {
            const serviceH = 90;
            const gap = 16;
            const totalH = zone.services.length * serviceH + (zone.services.length - 1) * gap;
            const startY = zone.y + 70 + (zone.h - 70 - 40 - totalH) / 2;

            return (
              <React.Fragment key={zone.id}>
                {zone.services.map((service, si) => {
                  const sy = startY + si * (serviceH + gap);
                  const isDimmed = isAnimating && !activatedServices.has(service.id);
                  return (
                    <div
                      key={service.id}
                      style={{
                        position: 'absolute',
                        left: zone.x + 14,
                        top: sy,
                        width: zone.w - 28,
                        zIndex: hoveredService === service.id ? 30 : 10,
                        opacity: isDimmed ? 0.35 : 1,
                        transition: 'opacity 0.4s',
                      }}
                    >
                      <ServiceCard
                        service={service}
                        isHovered={hoveredService === service.id}
                        isReceiving={receivingService === service.id}
                        isAnimating={isAnimating}
                        onMouseEnter={() => !isAnimating && setHoveredService(service.id)}
                        onMouseLeave={() => !isAnimating && setHoveredService(null)}
                        onClick={() => handleServiceClick(service.id)}
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}

          {/* Tooltips */}
          {!isAnimating && ZONES.map((zone) =>
            zone.services.map((service, si) => (
              <ServiceTooltip
                key={service.id}
                service={service}
                zone={zone}
                serviceIndex={si}
                visible={hoveredService === service.id}
              />
            ))
          )}

          {/* Animated Event Bubble */}
          <AnimatePresence>
            {activeEvent && (
              <EventBubble
                key={`event-${currentEventIdx}`}
                event={activeEvent}
                onComplete={handleEventComplete}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Event Log Panel ── */}
      <AnimatePresence>
        {eventLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              margin: '0 40px 16px',
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(51,65,85,0.6)',
              borderRadius: 14,
              overflow: 'hidden',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Log header */}
            <div style={{
              padding: '10px 20px',
              borderBottom: '1px solid rgba(51,65,85,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(30,41,59,0.5)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Terminal size={13} color="#10b981" />
                <span style={{ fontSize: 10, color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                  Event Propagation Log
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {isAnimating && (
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ fontSize: 9, color: '#f59e0b', fontFamily: 'monospace' }}
                  >
                    ● PROPAGATING
                  </motion.div>
                )}
                <span style={{ fontSize: 9, color: '#475569', fontFamily: 'monospace' }}>
                  {eventLogs.length} events
                </span>
              </div>
            </div>

            {/* Log entries */}
            <div
              ref={logContainerRef}
              style={{
                padding: '8px 0',
                maxHeight: 180,
                overflowY: 'auto',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              {eventLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    padding: '5px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    borderLeft: `3px solid ${log.color}`,
                    marginLeft: 0,
                  }}
                >
                  <span style={{ fontSize: 9, color: '#475569', minWidth: 80, fontFamily: 'monospace' }}>
                    {log.time}
                  </span>
                  <span style={{ fontSize: 12, lineHeight: 1, width: 18, textAlign: 'center' }}>{log.emoji}</span>
                  <span style={{ fontSize: 10, color: log.color, fontWeight: 600, minWidth: 140 }}>
                    {log.text}
                  </span>
                  <span style={{ fontSize: 9, color: '#64748b' }}>{log.detail}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Legend ── */}
      <div style={{
        margin: '0 40px 16px',
        padding: '14px 24px',
        background: 'rgba(15,23,42,0.6)',
        border: '1px solid rgba(51,65,85,0.5)',
        borderRadius: 14,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            Color Legend
          </span>
          {[
            { color: '#3b82f6', label: 'Developer' },
            { color: '#a855f7', label: 'CI Node' },
            { color: '#f59e0b', label: 'Build Node' },
            { color: '#10b981', label: 'Registry' },
            { color: '#ef4444', label: 'Runtime' },
            { color: '#06b6d4', label: 'Networking' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 10, height: 10, borderRadius: 3,
                background: `${item.color}30`,
                border: `1.5px solid ${item.color}`,
              }} />
              <span style={{ fontSize: 10, color: '#64748b' }}>{item.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            Hardware
          </span>
          {['HW1: Edge Node (WSL2)', 'HW2: Mac Mini', 'HW3: MacBook'].map((hw, i) => (
            <span key={i} style={{
              fontSize: 9, color: '#64748b',
              background: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(51,65,85,0.7)',
              borderRadius: 5, padding: '2px 8px',
              fontFamily: 'monospace', letterSpacing: '0.03em',
            }}>
              {hw}
            </span>
          ))}
        </div>

        <div style={{ fontSize: 9, color: '#475569', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={9} color="#f59e0b" />
          서비스 클릭 → 이벤트 전파 시뮬레이션
        </div>
      </div>

      {/* ── Preview URLs ── */}
      <div style={{
        margin: '0 40px 32px',
        padding: '16px 24px',
        background: 'rgba(15,23,42,0.6)',
        border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: 14,
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ fontSize: 10, color: '#06b6d4', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Globe size={12} color="#06b6d4" />
          Active Preview Environments — Traefik Dynamic Routing
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { branch: 'feature/login', url: 'feature-login.dev.local', status: 'running', time: '2m ago' },
            { branch: 'feature/payment', url: 'feature-payment.dev.local', status: 'running', time: '15m ago' },
            { branch: 'feature/dashboard', url: 'feature-dashboard.dev.local', status: 'building', time: 'now' },
            { branch: 'feature/auth-v2', url: 'feature-auth-v2.dev.local', status: 'running', time: '1h ago' },
          ].map((env, i) => (
            <div key={i} style={{
              background: 'rgba(30,41,59,0.7)',
              border: `1px solid ${env.status === 'building' ? '#f59e0b40' : '#10b98140'}`,
              borderRadius: 10,
              padding: '10px 14px',
              minWidth: 200,
              flex: '1 1 200px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 9, color: '#a855f7', fontFamily: 'monospace' }}>
                  <GitBranch size={9} color="#a855f7" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  {env.branch}
                </span>
                <span style={{
                  fontSize: 8, color: env.status === 'building' ? '#f59e0b' : '#10b981',
                  background: env.status === 'building' ? '#f59e0b18' : '#10b98118',
                  border: `1px solid ${env.status === 'building' ? '#f59e0b30' : '#10b98130'}`,
                  borderRadius: 4, padding: '1px 5px',
                }}>
                  {env.status === 'building' ? '⟳ building' : '● running'}
                </span>
              </div>
              <div style={{ fontSize: 9.5, color: '#06b6d4', fontFamily: 'monospace', marginBottom: 3, wordBreak: 'break-all' }}>
                https://{env.url}
              </div>
              <div style={{ fontSize: 8, color: '#475569' }}>Deployed {env.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
