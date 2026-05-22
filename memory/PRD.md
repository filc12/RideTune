# RideTune — PRD

## Visão
App mobile premium para sugerir um ponto de partida seguro de afinação de suspensão a motociclistas, em função da carga real (piloto, passageiro, bagagem).

## Estrutura
- `app/_layout.tsx` — `LanguageProvider` + Stack (headers ocultos)
- `app/index.tsx` — Home
- `app/how-it-works.tsx` — Como funciona (4 passos)
- `app/carga.tsx` — Inserção de pesos (piloto/passageiro/bagagem)
- `app/sag.tsx` — Guia de medição de sag (4 passos)
- `app/diagnostico.tsx` — Questionário + Sintomas
- `app/setups.tsx` — Setups guardados (CRUD local)
- `app/settings.tsx` — Idioma + acesso a Informações
- `app/informacoes.tsx` — Sobre, Termos, Privacidade, Avisos legais (colapsáveis)

## Utils
- `src/i18n/index.tsx` — PT/EN/ES/FR via Context
- `src/utils/suspension.ts` — `calcSetup(load)` heurística + getLoad/saveLoad + deriveMode
- `src/utils/setups.ts` — list/save/delete em AsyncStorage
- `src/utils/storage` — wrapper já existente
- `src/components/ScreenHeader.tsx` — header partilhado com back

## Persistência (AsyncStorage)
- `ridetune.bike` — id da mota selecionada
- `ridetune.load` — { rider, passenger, luggage }
- `ridetune.lang` — pt/en/es/fr
- `ridetune.setups` — array de SavedSetup

## Funcionalidades principais
1. **Home**: dashboard glass com setup atual derivado da carga via fórmula heurística; cenários rápidos pré-preenchem a carga; bottom nav navega para Carga/Diagnóstico/Sag; ícone settings → /settings; feature cards → ecrãs respetivos.
2. **Carga**: 3 linhas (piloto/passageiro/bagagem) com barra de progresso, botões ±1/±5, total kg + preview Sag e Preload Frente/Trás em tempo real. Botão "Guardar carga" persiste e volta ao Home.
3. **Fórmula heurística**: baseline 75kg solo → ajustes lineares por delta peso e bias traseiro (passageiro+bagagem). Preload, Rebound, Compression e Sag em ranges seguros.
4. **Sag**: 4 passos guiados de medição estática/dinâmica.
5. **Diagnóstico**: tab Questionário (5 perguntas Sim/Não → recomendações específicas) + tab Sintomas (lista visual com fix sugerido).
6. **Setups guardados**: guardar setup atual com nome + bike + load + valores calculados; lista persistida; apagar.
7. **Settings + Informações**: troca de idioma instantânea (PT/EN/ES/FR); Informações com 4 secções colapsáveis (Sobre, Termos, Privacidade, Avisos legais) em todas as línguas.

## Design system
- BG: `#070A0F` com gradient + ambient glows
- Accent: electric blue `#3DA9FF` · Verde só para activo/positivo `#22D08A` · Âmbar para pendente `#F4B23E`
- Glassmorphism: surfaces `rgba(255,255,255,0.04)`, borders `rgba(255,255,255,0.08)`, blur via `expo-blur`
- Tipografia: 700/800 para headlines, kickers uppercase letter-spaced
