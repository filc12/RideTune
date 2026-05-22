# RideTune — PRD

## Visão
App mobile premium para sugerir um ponto de partida seguro de afinação de suspensão a motociclistas, em função da carga real (piloto, passageiro, bagagem).

## Estado atual (Home redesenhado)
Redesign completo do ecrã inicial em PT-PT.

### Ecrã Home (`app/index.tsx`)
- **Header**: logo tipográfico "RideTune" (Ride + Tune accent) com barra neon · ícone settings pequeno e discreto.
- **Hero**: headline "Afina a suspensão à tua carga real" + subheadline.
- **CTAs**: primário "Escolher mota" (gradient electric blue) + secundário "Como funciona" (ghost).
- **Dashboard card (glass)**:
  - Estado vazio: "Sem mota selecionada" · badge "Por configurar" (âmbar) · "Ainda não escolheste uma mota." + botão inline.
  - Estado ativo: nome da mota · badge "Ativo" (verde) · Modo de carga · Setup "Pronto" · Suspensão Frente (Preload/Rebound/Compression) · Suspensão Trás (idem) · Sag recomendado com badge "Dentro da gama".
- **Cenários rápidos** (chips): Solo · Com malas · 2 pessoas · 2 pessoas + malas. Activo a verde, restantes a glass.
- **Ferramentas**: 3 feature cards — Guia de Sag · Diagnóstico · Setups guardados.
- **Bottom nav** (blur glass): Home (activo, azul) · Carga · Diagnóstico · Sag.

### Ecrã "Como funciona" (`app/how-it-works.tsx`)
4 passos do método RideTune + nota informativa + CTA "Começar agora".

## Persistência
- AsyncStorage via `@/src/utils/storage`:
  - `ridetune.bike` — id da mota selecionada
  - `ridetune.loadMode` — cenário de carga

## Design system
- BG: `#070A0F` com gradient azulado e ambient glows
- Accent principal: electric blue `#3DA9FF`
- Active/positive only: green `#22D08A`
- Warning: amber `#F4B23E`
- Glassmorphism com `expo-blur` em iOS, surface translúcida com border `rgba(255,255,255,0.08)`
- Tipografia: pesos 700/800 para headlines, kickers uppercase letter-spaced

## Próximos passos sugeridos
- Implementar ecrãs Carga, Diagnóstico, Sag e ligá-los ao bottom nav
- Catálogo real de motos (backend MongoDB)
- Cálculo real de valores de suspensão por modelo + carga
- Guardar múltiplos setups por viagem/utilizador
