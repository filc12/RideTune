/**
 * purchases.ts — RideTune in-app purchases via RevenueCat.
 *
 * Produto: compra única vitalícia (ridetune_premium_lifetime).
 * Entitlement no RevenueCat: "premium".
 *
 * O módulo nativo (react-native-purchases) é carregado com lazy require
 * para a app não crashar em Expo Go — no Expo Go as funções degradam
 * graciosamente (isBillingAvailable() === false).
 *
 * Fonte de verdade: entitlement do RevenueCat. A flag local (premium.ts)
 * funciona como cache offline e é sincronizada em cada arranque.
 */
import { Platform } from "react-native";
import { isForceFreeBuild, setPremiumStatusFromStore } from "@/src/services/premium";

export const ENTITLEMENT_ID = "premium";

/**
 * O identificador do produto nas duas lojas. É o mesmo na App Store e na Google Play,
 * de propósito — poupa um `Platform.select` e evita que as duas divirjam com o tempo.
 */
export const PRODUCT_ID = "ridetune_premium_lifetime";

/**
 * O pacote vitalício dentro da offering actual.
 *
 * PORQUE É QUE ISTO NÃO É `availablePackages[0]`. Era, até 8 de agosto de 2026. A offering
 * `default` da RevenueCat foi criada a partir do modelo deles e ficou com três pacotes:
 * `$rc_monthly`, `$rc_annual` e `$rc_lifetime`, por esta ordem. Os dois primeiros só têm
 * produtos da Test Store, que a App Store e a Google Play não sabem resolver — por isso o
 * SDK deita-os fora e o vitalício acaba mesmo na posição 0. Funcionava por acidente.
 *
 * O acidente desfaz-se sozinho no dia em que alguém acrescentar um pacote real acima do
 * vitalício, ou ligar a Test Store numa build de teste. Nesse dia a app cobra o produto
 * errado, e é o pior sítio possível para descobrir um bug. Procurar pelo identificador do
 * produto custa uma linha e não depende de ordem nenhuma.
 *
 * O `?? [0]` fica como rede: se um dia o identificador mudar de um lado e não do outro, a
 * app continua a vender alguma coisa em vez de dizer "unavailable" a toda a gente.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pacoteVitalicio(offerings: any): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pacotes: any[] | undefined = offerings?.current?.availablePackages;
  if (!pacotes?.length) return null;
  return pacotes.find(p => p?.product?.identifier === PRODUCT_ID) ?? pacotes[0];
}

/**
 * A RevenueCat tem uma chave por loja — a de Android não funciona na App Store.
 * Sem a chave certa, `isBillingAvailable()` devolve false e a app fica sem compras:
 * em iOS isso e' motivo de rejeicao, porque ha funcionalidade premium que ninguem
 * consegue comprar. Por isso a escolha e' explicita por plataforma.
 */
const API_KEY = Platform.select({
  ios:     process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
  default: undefined,
}) ?? "";

/**
 * A chave é mesmo uma chave, ou é um marcador por preencher?
 *
 * PORQUE É QUE ISTO EXISTE. Até 8 de agosto de 2026 o teste era só `API_KEY.length > 0`,
 * e a chave de iOS no `eas.json` era o literal `POR_PREENCHER_appl_xxx`. Isso não é vazio,
 * portanto passava: a app dava as compras por disponíveis, mostrava o paywall, e só
 * falhava no momento em que alguém tentava pagar. É o pior sítio possível para falhar —
 * e na App Store é motivo de rejeição, porque há funcionalidade premium que ninguém
 * consegue comprar.
 *
 * A RevenueCat prefixa as chaves por loja: `appl_` para a App Store, `goog_` para a Google
 * Play. Verificar o prefixo apanha duas coisas de uma vez — o marcador por preencher, e a
 * troca das chaves entre plataformas, que é o engano clássico e que o comentário aqui em
 * cima já avisava sem conseguir impedir.
 */
function chaveValida(k: string): boolean {
  const prefixo = Platform.OS === "ios" ? "appl_" : "goog_";
  return k.startsWith(prefixo);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PurchasesModule = any;

let configured = false;
let available: boolean | null = null;

function getPurchases(): PurchasesModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("react-native-purchases");
    return mod.default ?? mod;
  } catch {
    return null; // Expo Go / módulo nativo ausente
  }
}

export function isBillingAvailable(): boolean {
  if (available === null) available = getPurchases() !== null && chaveValida(API_KEY);
  return available;
}

/** Chamar uma vez no arranque da app (não bloqueia; falha em silêncio). */
export async function initPurchases(): Promise<void> {
  if (isForceFreeBuild) {
    await setPremiumStatusFromStore(false);
    return;
  }
  const Purchases = getPurchases();
  if (!Purchases || !chaveValida(API_KEY) || configured) return;
  try {
    Purchases.configure({ apiKey: API_KEY });
    configured = true;
    // sync do estado real → cache local (cobre reinstalações e refunds)
    await syncPremiumFromStore();
  } catch {
    /* offline no arranque — cache local mantém-se */
  }
}

async function applyCustomerInfo(info: { entitlements: { active: Record<string, unknown> } }): Promise<boolean> {
  const active = !!info?.entitlements?.active?.[ENTITLEMENT_ID];
  await setPremiumStatusFromStore(active);
  return active;
}

/** Revalida o entitlement junto do RevenueCat e atualiza a cache local. */
export async function syncPremiumFromStore(): Promise<boolean> {
  const Purchases = getPurchases();
  if (!Purchases || !configured) return false;
  try {
    const info = await Purchases.getCustomerInfo();
    return await applyCustomerInfo(info);
  } catch {
    return false;
  }
}

/** Preço localizado do produto vitalício (ex.: "14,99 €"), ou null se indisponível. */
export async function getLifetimePrice(): Promise<string | null> {
  const Purchases = getPurchases();
  if (!Purchases || !configured) return null;
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = pacoteVitalicio(offerings);
    return pkg?.product?.priceString ?? null;
  } catch {
    return null;
  }
}

export type PurchaseResult = "purchased" | "cancelled" | "error" | "unavailable";

/** Fluxo de compra do vitalício. Atualiza a flag premium em caso de sucesso. */
export async function purchaseLifetime(): Promise<PurchaseResult> {
  const Purchases = getPurchases();
  if (!Purchases || !configured) return "unavailable";
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = pacoteVitalicio(offerings);
    if (!pkg) return "unavailable";
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const active = await applyCustomerInfo(customerInfo);
    return active ? "purchased" : "error";
  } catch (e) {
    const err = e as { userCancelled?: boolean };
    if (err?.userCancelled) return "cancelled";
    return "error";
  }
}

/** Restaurar compras (reinstalação / novo dispositivo). */
export async function restorePurchases(): Promise<boolean> {
  const Purchases = getPurchases();
  if (!Purchases || !configured) return false;
  try {
    const info = await Purchases.restorePurchases();
    return await applyCustomerInfo(info);
  } catch {
    return false;
  }
}
