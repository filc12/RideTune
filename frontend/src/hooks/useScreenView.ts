import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Analytics } from "@/src/services/analytics";

/**
 * Envia o evento `screen_viewed` sempre que o ecrã ganha foco.
 * Usar no topo de cada ecrã principal: useScreenView("carga");
 */
export function useScreenView(screen: string): void {
  useFocusEffect(
    useCallback(() => {
      Analytics.screenViewed({ screen });
    }, [screen])
  );
}
