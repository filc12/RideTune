# Resposta à Apple — Guideline 2.1, Information Needed

Submissão `94900ef8-5fdf-41f1-9763-e53fac6e35f8`, versão 1.1.5, 8 de agosto de 2026.

**Isto não é uma rejeição por defeito nem por política.** A Apple não encontrou bug nem
violação: pediu contexto que faltava no campo *App Review Information → Notes*, que foi
submetido vazio. Os pontos 2 a 8 respondem-se com texto. O ponto 1 exige uma gravação de
ecrã **num dispositivo físico** e não há maneira de contornar isso.

---

## O texto para colar

Colar em **App Store Connect → Distribuição → Revisão de apps → Notas**, e enviar a mesma
coisa como resposta na página *App Review*. Está em inglês porque é a língua da revisão.

---

RideTune gives motorcyclists the factory suspension settings and tyre pressures for their
specific bike, adjusted for their actual rider weight and load. Answers below follow the
numbering of your message.

**2. Devices and operating systems tested**

<!-- PREENCHER antes de enviar. Exemplo do formato esperado:
- iPhone 14 Pro, iOS 26.0 (physical device)
- iPhone SE (3rd generation), iOS 26.0 (physical device)
- iPhone 17 Pro simulator, iOS 26.0 (Xcode 26)
Listar apenas o que foi mesmo testado. -->

**3. What the app does, and who it is for**

Motorcycle manufacturers publish suspension settings and tyre pressures in the owner's
manual, but almost always for a single reference case: one rider of an assumed weight, no
luggage, no passenger. Most riders do not match that case. The manual is also a 300-page
PDF that nobody carries in a tank bag.

RideTune solves both problems. The rider selects their motorcycle, enters their weight in
full riding gear and what they are carrying, and the app returns the suspension adjuster
positions and tyre pressures for that real situation, expressed the same way the bike's
adjusters are marked — clicks, turns, millimetres or scale positions, whichever the
manufacturer uses.

The target audience is owners of adventure, touring, sport and off-road motorcycles who
want to set up their own bike correctly without a workshop visit. It is used by riders
preparing for a trip, riders who have just changed their load, and riders who have never
touched their suspension and do not know where to start.

The data comes from manufacturer owner's manuals, read one by one. Every motorcycle in the
app carries the source of its numbers, and values that could not be confirmed against a
manual are explicitly labelled as unconfirmed inside the app.

**4. How to set up and reach the main features**

No account, no login, no registration. There is nothing to sign up for and no credentials
are needed. The app is fully usable from first launch.

1. Launch the app. A short onboarding appears once.
2. Tap **Choose bike** and pick any motorcycle, for example *BMW R 1250 GS*.
3. Enter rider weight including gear. The suspension values on the main screen recalculate
   immediately.
4. **Tyre Pressure** on the main screen shows the pressures for that bike and load.
5. **Sag guide** walks through measuring static and rider sag.
6. **How it works** explains what each adjuster does.

**5. External services used**

- **Supabase** — hosts the motorcycle database (suspension specifications, tyre pressures)
  and the community setups API. The app ships with a bundled copy of the data and fetches
  updates from Supabase so corrections reach riders without an app update.
- **RevenueCat** — manages the in-app purchase entitlement. Payment itself is handled
  entirely by Apple's In-App Purchase system.
- **Sentry** — crash reporting.
- **PostHog** — anonymous product analytics.
- **Expo / EAS** — build tooling and over-the-air updates.

No AI services. No third-party authentication. No payment processor other than Apple.

**6. Regional differences**

None. The app behaves identically in every region and every motorcycle is available
everywhere. It is localised into six languages — English, Portuguese, Spanish, French,
German and Italian — and the language follows the device setting. The underlying data is
the same in all of them. Units can be switched between metric and imperial by the user,
independently of region.

**7. Regulated industry and third-party material**

RideTune does not operate in a regulated industry.

Regarding third-party material: the app publishes factory specification *values* —
numbers such as "12 clicks from fully closed" or "2.5 bar" — sourced from publicly
available manufacturer owner's manuals, with the source document cited for each
motorcycle. No manual text is reproduced, no manufacturer images, diagrams, logos or
trademarks are used, and the app is not affiliated with or endorsed by any manufacturer.
Manufacturer names appear only to identify which motorcycle a set of values belongs to.

**8. In-app purchase: what it unlocks and how to reach it**

There is one in-app purchase: **RideTune Premium**, product identifier
`ridetune_premium_lifetime`. It is a **non-consumable, one-time purchase granting lifetime
access. It is not a subscription and does not auto-renew.**

Without it the app is fully functional for a single motorcycle and a solo rider: suspension
settings, tyre pressures, the sag guide and the explanations are all free.

Premium unlocks:

- Multiple motorcycles in the garage
- Passenger and luggage load modes
- Saved setups
- Diagnostics recommendations
- Unlimited riding diary entries
- Manual language selection

How to reach the purchase during review — any of these:

- Main screen → **Choose bike** → try to add a second motorcycle
- Main screen → switch load mode to **Passenger** or **Luggage**
- **Saved setups** → try to save a setup
- **Diagnostics** → tap the locked card

Each opens the purchase sheet showing the title, the one-time price and the restore option.

**On user-generated content**

The app allows a rider to optionally share their own suspension setup, with a short free
text note, to a community collection. Relevant details for review:

- Sharing is entirely optional and is never required to use the app.
- There are no user accounts and no user profiles. The only identifier is an anonymous,
  randomly generated device ID stored locally. No personal data is attached to a submission.
- Every submission is **held for moderation and is not published until approved**. The app
  only ever reads approved entries.
- Submissions are additionally checked automatically against the manufacturer values and
  rate-limited before reaching moderation.
- Community setups are **not displayed inside the app**. The app links out to the website,
  ridetune.app/setups.
- Riders can request removal of anything they shared by emailing support@ridetune.app,
  which is stated in the privacy policy.

**Permissions**

The app requests no sensitive permissions. There are no prompts for location, camera,
microphone, contacts, photos, notifications or App Tracking Transparency at any point.

---

## Ponto 1 — a gravação de ecrã

**É o único bloqueio real, e exige um iPhone.** A Apple escreve *"captured on a physical
device, running the latest operating system"*. Uma gravação de simulador é reconhecível e
arrisca uma segunda ronda do mesmo pedido — o que custa mais dias do que arranjar um
telefone emprestado durante um quarto de hora.

O grupo **Interno** do TestFlight já está pronto com a build 1. Instalar leva minutos.

Gravar com o gravador de ecrã do próprio iOS. **Começar com a app fechada**, porque a Apple
pede explicitamente que a gravação comece no arranque.

Guião, três a quatro minutos:

1. Ecrã inicial do iOS, tocar no ícone da RideTune. Deixar correr o onboarding.
2. Escolher uma mota. Mostrar a lista a percorrer e escolher uma conhecida.
3. Introduzir o peso do piloto com equipamento. **Parar um segundo nos valores de suspensão
   a mudarem** — é isto que a Apple não percebeu que a app faz.
4. Abrir **Tyre Pressure**. Mostrar os valores.
5. Abrir o **guia de sag** e percorrer os passos.
6. **A parte que a Apple mais quer ver:** tocar num modo de carga bloqueado, deixar aparecer
   a folha de compra, e mostrá-la **inteira** — título, preço, botão de restaurar. Não é
   preciso comprar. Fechar a folha.
7. Abrir **Definições** e mostrar a secção da comunidade e a partilha de um setup, com a
   nota de moderação.

Não são precisos flows de conta, nem de eliminação de conta, nem pedidos de permissão —
não existem, e a resposta escrita já o diz.

---

## Depois de enviar

Não é preciso build nova. A resposta vai pela página *App Review* e a versão volta à fila
com a informação em falta. **Não remover a versão de revisão** — isso obrigaria a
ressubmeter do zero.

Preencher o campo **Notas** com o mesmo texto evita que isto se repita nas versões futuras.
Foi ele estar vazio que gerou este pedido.
