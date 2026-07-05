# RideTune — Monetização: Premium Lifetime

Slogan: **"RideTune — Buy once. Ride forever."**
Modelo: **Premium Lifetime** por compra única.
Preço de tabela: **19,99 €** · Lançamento com promo: **14,99 €**.
Billing: **RevenueCat** (grátis até ~2.500 US$/mês de receita).

## O que já está no código

- `src/services/purchases.ts` — init, preço localizado, compra, restore, sync do entitlement `premium` para a flag local (`premium.ts`). Lazy require: em Expo Go a app não crasha, o modal mostra "em breve".
- `src/components/PremiumModal.tsx` — botão de compra com preço real da loja, link "Restaurar compras", estados de loading/erro. Prop opcional `onPurchased` para refrescar o ecrã que abriu o modal.
- `app/_layout.tsx` — `initPurchases()` no arranque (sincroniza o estado real da compra, cobre reinstalações e refunds).
- `package.json` — `react-native-purchases` adicionado. Correr `npm install` e fazer novo dev build (`eas build --profile development`), porque é módulo nativo.
- i18n — chaves novas nos 6 idiomas: `premium.buy`, `premium.buy.noprice`, `premium.lifetime`, `premium.restore`, `premium.norestore`, `premium.error`.
- O unlock de developer (7 taps + código) continua a funcionar como antes — necessário para a revisão da Google.

## Passos na Play Console (uma vez)

1. **Perfil de pagamentos**: Configurações → Perfil de pagamentos — criar/associar conta de comerciante (necessário NIF e IBAN). Sem isto não podes criar produtos.
2. **Criar o produto**: Monetizar → Produtos → Produtos no app → Criar produto:
   - ID do produto: `ridetune_premium_lifetime` (não pode ser alterado depois)
   - Nome: "RideTune Premium Lifetime"
   - Descrição: "Buy once. Ride forever. All motorcycles, smart diagnostics, unlimited Ride Diary and lifetime updates."
   - Preço: **14,99 €** (promo de lançamento; sobe para 19,99 € mais tarde em Editar preço — quem comprou não é afetado)
   - Estado: **Ativo**
3. A app precisa da permissão `com.android.vending.BILLING` — o plugin do react-native-purchases adiciona-a automaticamente no build.

## Passos no RevenueCat (uma vez)

1. Criar conta em app.revenuecat.com → novo projeto "RideTune".
2. Adicionar app Android com o package name da app (ver `app.json` → `android.package`).
3. **Ligar à Play Store**: Project settings → Integrations → Google Play — carregar a service account JSON (a consola do RevenueCat tem o passo-a-passo para criar a service account na Google Cloud; precisa de acesso à API da Play Console).
4. **Produto**: Products → adicionar `ridetune_premium_lifetime` (importa da Play depois do passo 2 da consola).
5. **Entitlement**: criar com ID exatamente **`premium`** e associar o produto.
6. **Offering**: criar offering `default` com um package (tipo Lifetime) a apontar para o produto.
7. Copiar a **API key pública Android** (começa por `goog_`) → adicionar ao `.env` / EAS secrets:
   ```
   EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxx
   ```
   Em EAS: `eas env:create --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value goog_xxx --environment production` (e também para preview/development se quiseres testar).

## Testar antes de publicar

1. `npm install` + novo build (`eas build -p android --profile development`).
2. Na Play Console: Testes → Teste interno → adicionar o teu email como testador e publicar um AAB com o billing incluído.
3. **License testing**: Play Console (nível da conta) → Configurações → Teste de licença → adicionar o teu email → as compras de teste não são cobradas.
4. Na app: abrir o PremiumModal → deve mostrar "Desbloquear por 14,99 €" → comprar → confirmar que os limites desaparecem → desinstalar/reinstalar → "Restaurar compras" deve devolver o Premium.

## Notas

- A flag local continua a ser a cache offline; o RevenueCat é a fonte de verdade e re-sincroniza em cada arranque.
- Quando subires o preço para 19,99 €, muda só na Play Console — nada a alterar no código (o preço mostrado vem da loja).
- Depois do billing estar live, atualiza a declaração de "Detalhes de início de sessão" na Play Console se removeres o dev unlock, e considera trocar o código 121276.
