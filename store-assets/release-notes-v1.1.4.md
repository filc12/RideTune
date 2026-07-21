# RideTune v1.1.4 (versionCode 21) — Notas de versão

> Limite da Play Store: 500 caracteres por idioma. Os textos abaixo já respeitam esse limite.

---

## 🇵🇹 Português

```
Correções importantes:

• CFMOTO: as afinações não mudavam com a carga. Já respondem ao passageiro e à bagagem, à frente e atrás.
• 450MT e 800MT-X revistas com os manuais oficiais CFMOTO.
• Premium: deixa de se perder o acesso ao abrir a app sem internet.
• Os valores deixam de mostrar meios cliques — só valores que dá mesmo para pôr no amortecedor.
• Diário de viagem e Definições totalmente traduzidos.

Obrigado a quem reportou. Continuem a mandar feedback!
```

## 🇬🇧 English

```
Important fixes:

• CFMOTO: setups weren't changing with load. They now respond to pillion and luggage, front and rear.
• 450MT and 800MT-X rebuilt from the official CFMOTO manuals.
• Premium: you no longer lose access when opening the app offline.
• No more half-clicks — only values you can actually dial into the suspension.
• Ride diary and Settings fully translated.

Thanks to everyone who reported these. Keep the feedback coming!
```

## 🇪🇸 Español

```
Correcciones importantes:

• CFMOTO: los ajustes no cambiaban con la carga. Ya responden al pasajero y al equipaje, delante y detrás.
• 450MT y 800MT-X revisadas con los manuales oficiales CFMOTO.
• Premium: ya no se pierde el acceso al abrir la app sin internet.
• Se acabaron los medios clics — solo valores que puedes aplicar de verdad.
• Diario de viaje y Ajustes totalmente traducidos.

Gracias a quienes lo reportaron. ¡Seguid enviando comentarios!
```

## 🇫🇷 Français

```
Corrections importantes :

• CFMOTO : les réglages ne changeaient pas selon la charge. Ils réagissent désormais au passager et aux bagages, à l'avant comme à l'arrière.
• 450MT et 800MT-X revues d'après les manuels officiels CFMOTO.
• Premium : l'accès n'est plus perdu à l'ouverture hors connexion.
• Fini les demi-crans — uniquement des valeurs réellement réglables.
• Carnet de route et Réglages entièrement traduits.

Merci à ceux qui ont signalé ces problèmes !
```

## 🇩🇪 Deutsch

```
Wichtige Korrekturen:

• CFMOTO: Die Einstellungen änderten sich nicht mit der Zuladung. Sie reagieren jetzt auf Sozius und Gepäck, vorne wie hinten.
• 450MT und 800MT-X anhand der offiziellen CFMOTO-Handbücher überarbeitet.
• Premium: Der Zugang geht beim Offline-Start nicht mehr verloren.
• Keine halben Klicks mehr — nur Werte, die sich wirklich einstellen lassen.
• Tourenbuch und Einstellungen vollständig übersetzt.

Danke an alle, die das gemeldet haben!
```

## 🇮🇹 Italiano

```
Correzioni importanti:

• CFMOTO: le regolazioni non cambiavano con il carico. Ora rispondono a passeggero e bagagli, davanti e dietro.
• 450MT e 800MT-X riviste sui manuali ufficiali CFMOTO.
• Premium: l'accesso non si perde più aprendo l'app offline.
• Niente più mezzi scatti — solo valori davvero impostabili.
• Diario di viaggio e Impostazioni completamente tradotti.

Grazie a chi ha segnalato. Continuate con i feedback!
```

---

## Notas internas (não publicar)

**O que foi realmente corrigido nesta versão:**

1. **`oem-data.ts` — snake_case → camelCase** (commit `765fd74`). As linhas de `oem_suspension` vindas do Supabase eram atribuídas cruas a `MfzProfile[]`, sem a conversão que já existia para `oem_bikes` e `oem_tire_pressure`. Em runtime `weightPoints` ficava `undefined`, os 11 perfis com `formula: 'cfmoto_interp'` caíam no `applyFormula` (que não tem branch para essa fórmula) e devolviam sempre o valor base. Resultado: setup congelado em todas as CFMOTO. Cache bumpado para `v2` para descartar o cache já gravado sem `weightPoints`.

2. **`applyFormula` — `default` deixa de devolver `base`** silenciosamente; usa a fórmula genérica como rede de segurança para não voltar a congelar valores em silêncio.

3. **450MT reconstruída** do manual oficial (p.140): só a pré-carga traseira muda com a carga; o amortecimento fica em 10 gears em todos os cenários. Os valores anteriores (11/12/14) eram estimativas sem fonte. Adicionadas as advertências oficiais: amortecedor só para 1 ocupante, e não passar dos 75 mph / 120 km/h com as três malas.

4. **800MT / 800MT-X verificados** contra os charts oficiais — batem certo valor a valor, incluindo a compressão traseira do MT-X. `source` e `dataQuality` atualizados.

5. **Arredondamento por tipo de afinador** — clicks para inteiro, voltas para 1/4, mm para 0,5. Antes saíam valores impossíveis de aplicar como `8.5 clicks`.

6. **Premium offline** — `storePremiumVerifiedThisSession` arrancava a `false` em cada sessão e só ficava `true` se o RevenueCat respondesse. Sem rede, quem tinha pago era tratado como gratuito. Adicionado período de tolerância de 14 dias (`ridetune.premium.verified_at`); refunds e cancelamentos confirmados pela loja continuam a cortar o acesso de imediato.

**Por fazer:**

- Modo "piso irregular" — o chart oficial do 800MT-X tem uma 5.ª linha (mesmo peso, amortecimento mais firme) que a app não modela por só interpolar por quilos.
- Mostrar a tolerância ±2 dos manuais em vez de um valor exato.
- 700MT, 800NK e 1000MT-X ainda por verificar contra manuais oficiais (800NK tem lacuna de pontos intermédios).
- Instrumentação `screen_viewed` já está em todos os ecrãs (desde a 1.1.3) — o tile "Ecrãs mais abertos" no PostHog só faz sentido depois desta versão ter adesão.
