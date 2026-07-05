/**
 * backup.ts — Exportação e importação de dados do utilizador.
 *
 * O que é exportado: perfis, setups, diário, preferência de carga.
 * O que NÃO é exportado: premium (não transferível), idioma (preferência do dispositivo).
 *
 * Dependências necessárias:
 *   npx expo install expo-file-system expo-sharing expo-document-picker
 */
import * as FileSystem from "expo-file-system";
// expo-sharing e expo-document-picker requerem development build.
// Lazy require evita crash em Expo Go.
const getSharing = () => require("expo-sharing") as typeof import("expo-sharing");
const getDocumentPicker = () => require("expo-document-picker") as typeof import("expo-document-picker");
import { storage } from "@/src/utils/storage";
import { captureError } from "@/src/services/sentry";

const BACKUP_VERSION = 1;

const KEYS = {
  profiles:        "ridetune.profiles",
  activeProfileId: "ridetune.profile.active",
  setups:          "ridetune.setups",
  diary:           "ridetune.diary",
  load:            "ridetune.load",
} as const;

export type BackupData = {
  version: number;
  exportedAt: string;
  data: {
    profiles:        string | null;
    activeProfileId: string | null;
    setups:          string | null;
    diary:           string | null;
    load:            string | null;
  };
};

// ─── Export ────────────────────────────────────────────────────────────────────

/**
 * Recolhe todos os dados do utilizador e partilha como ficheiro JSON.
 * Retorna true se o ficheiro foi partilhado, false se falhou.
 */
export async function exportBackup(): Promise<boolean> {
  try {
    const [profiles, activeProfileId, setups, diary, load] = await Promise.all([
      storage.getItem<string>(KEYS.profiles, ""),
      storage.getItem<string>(KEYS.activeProfileId, ""),
      storage.getItem<string>(KEYS.setups, ""),
      storage.getItem<string>(KEYS.diary, ""),
      storage.getItem<string>(KEYS.load, ""),
    ]);

    const backup: BackupData = {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      data: {
        profiles:        profiles ?? null,
        activeProfileId: activeProfileId ?? null,
        setups:          setups ?? null,
        diary:           diary ?? null,
        load:            load ?? null,
      },
    };

    const json = JSON.stringify(backup, null, 2);
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const fileName = `ridetune-backup-${date}.json`;
    const path = `${FileSystem.cacheDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(path, json, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const Sharing = getSharing();
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) return false;

    await Sharing.shareAsync(path, {
      mimeType: "application/json",
      dialogTitle: "Guardar backup RideTune",
      UTI: "public.json",
    });

    return true;
  } catch (e) {
    captureError(e, { context: "exportBackup" });
    return false;
  }
}

// ─── Import ────────────────────────────────────────────────────────────────────

export type ImportResult =
  | { ok: true }
  | { ok: false; reason: "cancelled" | "invalid_file" | "error" };

/**
 * Abre o seletor de ficheiros, lê o backup e restaura os dados.
 * Não substitui o premium nem o idioma.
 */
export async function importBackup(): Promise<ImportResult> {
  try {
    const DocumentPicker = getDocumentPicker();
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return { ok: false, reason: "cancelled" };

    const asset = result.assets?.[0];
    if (!asset?.uri) return { ok: false, reason: "invalid_file" };

    const raw = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const backup = JSON.parse(raw) as BackupData;

    // Validação mínima
    if (!backup.version || !backup.data) {
      return { ok: false, reason: "invalid_file" };
    }

    // Restaurar dados — escrever apenas o que existir no ficheiro
    const { data } = backup;
    const writes: Promise<boolean>[] = [];

    if (data.profiles)        writes.push(storage.setItem(KEYS.profiles, data.profiles));
    if (data.activeProfileId) writes.push(storage.setItem(KEYS.activeProfileId, data.activeProfileId));
    if (data.setups)          writes.push(storage.setItem(KEYS.setups, data.setups));
    if (data.diary)           writes.push(storage.setItem(KEYS.diary, data.diary));
    if (data.load)            writes.push(storage.setItem(KEYS.load, data.load));

    await Promise.all(writes);
    return { ok: true };
  } catch (e) {
    captureError(e, { context: "importBackup" });
    const msg = e instanceof SyntaxError ? "invalid_file" : "error";
    return { ok: false, reason: msg };
  }
}
