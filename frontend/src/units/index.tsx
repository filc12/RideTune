/**
 * units/index.tsx — o sistema de unidades escolhido, disponível em toda a app.
 *
 * Segue de propósito o mesmo desenho do `src/i18n/index.tsx`: um contexto, um provider que
 * lê a preferência guardada no arranque, e um hook. Quem já percebeu como funciona o idioma
 * percebe isto sem ler nada.
 *
 * A aritmética não está aqui — está no `src/utils/units.ts`, sem dependências, para poder
 * ser verificada por um script fora da app.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { storage } from '@/src/utils/storage';
import { sistemaPorRegiao, type UnitSystem } from '@/src/utils/units';

const K_UNITS = 'ridetune.units';

type Ctx = {
  units: UnitSystem;
  setUnits: (u: UnitSystem) => void;
  /** True enquanto a preferência guardada ainda não foi lida do disco. */
  loading: boolean;
};

const UnitsContext = createContext<Ctx>({
  units: 'metric',
  setUnits: () => {},
  loading: true,
});

export function UnitsProvider({ children }: { children: React.ReactNode }) {
  const [units, setUnitsState] = useState<UnitSystem>('metric');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // O fallback é uma string vazia e não 'metric' de propósito: assim distingue-se
        // «nunca escolheu» de «escolheu métrico». No primeiro caso vale a região do
        // telemóvel; no segundo, respeita-se a escolha e não se volta a adivinhar.
        const guardado = await storage.getItem<string>(K_UNITS, '');
        if (guardado === 'metric' || guardado === 'imperial') {
          setUnitsState(guardado);
        } else {
          setUnitsState(sistemaPorRegiao());
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setUnits = useCallback((u: UnitSystem) => {
    setUnitsState(u);
    storage.setItem(K_UNITS, u);
  }, []);

  const value = useMemo(() => ({ units, setUnits, loading }), [units, setUnits, loading]);
  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>;
}

export function useUnits() {
  return useContext(UnitsContext);
}
