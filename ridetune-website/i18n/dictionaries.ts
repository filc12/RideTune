/**
 * Dicionário de traduções do site (seletor de idioma client-side).
 * `en` define a forma canónica; os restantes idiomas seguem o mesmo tipo.
 * Etapa 1: nav + página /setups + footer. Homepage e páginas legais nas etapas seguintes.
 */

export const LOCALES = ["en", "pt", "es", "fr", "de", "it"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
};

export const en = {
  nav: {
    features: "Features",
    how: "How it works",
    setups: "Setups",
    premium: "Premium",
    download: "Download",
  },
  setups: {
    eyebrow: "SETUP LIBRARY · VERIFIED AGAINST OEM",
    titleA: "Suspension setups,",
    titleB: "for your exact bike.",
    subtitle:
      "Reference starting points for sag, preload, rebound and compression — by model and by how you ride. Browse and contribute for free.",
    searchPlaceholder: "Search a model…",
    all: "All",
    modelsFound: "MODELS FOUND",
    front: "FRONT",
    rear: "REAR",
    isNew: "NEW",
    modalTitle: "Confirm setup share",
    modalDesc:
      "We received your setup from the RideTune app. Do you want to publish it to the community?",
    cancel: "Cancel",
    publish: "Publish setup",
  },
  footer: {
    disclaimer:
      "The setups shown are reference starting points, based on OEM data and calculations. The mechanical condition of the bike, component wear and safe riding are the rider's responsibility. Always check the manufacturer's official manual.",
    rights: "All rights reserved.",
    privacy: "Privacy",
    terms: "Terms & Conditions",
    support: "Support",
    contact: "Contact",
  },
};

export type Dict = typeof en;

export const pt: Dict = {
  nav: {
    features: "Funcionalidades",
    how: "Como funciona",
    setups: "Setups",
    premium: "Premium",
    download: "Descarregar",
  },
  setups: {
    eyebrow: "BIBLIOTECA DE SETUPS · VERIFICADO CONTRA OEM",
    titleA: "Setups de suspensão,",
    titleB: "para a tua moto exata.",
    subtitle:
      "Pontos de partida de referência para SAG, pré-carga, rebound e compressão — por modelo e pela forma como conduzes. Explora e contribui gratuitamente.",
    searchPlaceholder: "Procurar um modelo…",
    all: "Todas",
    modelsFound: "MODELOS ENCONTRADOS",
    front: "FRENTE",
    rear: "TRÁS",
    isNew: "NOVO",
    modalTitle: "Confirmar partilha de setup",
    modalDesc:
      "Recebemos a tua afinação da app RideTune. Confirmas a publicação para a comunidade?",
    cancel: "Cancelar",
    publish: "Publicar setup",
  },
  footer: {
    disclaimer:
      "Os setups apresentados são pontos de partida de referência, baseados em dados OEM e cálculos. O estado mecânico da moto, o desgaste dos componentes e a condução em segurança são da responsabilidade do piloto. Verifica sempre o manual oficial do fabricante.",
    rights: "Todos os direitos reservados.",
    privacy: "Privacidade",
    terms: "Termos e Condições",
    support: "Apoio ao Cliente",
    contact: "Contacto",
  },
};

export const es: Dict = {
  nav: {
    features: "Funciones",
    how: "Cómo funciona",
    setups: "Ajustes",
    premium: "Premium",
    download: "Descargar",
  },
  setups: {
    eyebrow: "BIBLIOTECA DE AJUSTES · VERIFICADO CONTRA OEM",
    titleA: "Ajustes de suspensión,",
    titleB: "para tu moto exacta.",
    subtitle:
      "Puntos de partida de referencia para SAG, precarga, rebote y compresión — por modelo y según cómo conduces. Explora y contribuye gratis.",
    searchPlaceholder: "Buscar un modelo…",
    all: "Todas",
    modelsFound: "MODELOS ENCONTRADOS",
    front: "DELANTERA",
    rear: "TRASERA",
    isNew: "NUEVO",
    modalTitle: "Confirmar compartir ajuste",
    modalDesc:
      "Recibimos tu ajuste desde la app RideTune. ¿Confirmas la publicación para la comunidad?",
    cancel: "Cancelar",
    publish: "Publicar ajuste",
  },
  footer: {
    disclaimer:
      "Los ajustes mostrados son puntos de partida de referencia, basados en datos OEM y cálculos. El estado mecánico de la moto, el desgaste de los componentes y la conducción segura son responsabilidad del piloto. Consulta siempre el manual oficial del fabricante.",
    rights: "Todos los derechos reservados.",
    privacy: "Privacidad",
    terms: "Términos y Condiciones",
    support: "Soporte",
    contact: "Contacto",
  },
};

export const fr: Dict = {
  nav: {
    features: "Fonctionnalités",
    how: "Comment ça marche",
    setups: "Réglages",
    premium: "Premium",
    download: "Télécharger",
  },
  setups: {
    eyebrow: "BIBLIOTHÈQUE DE RÉGLAGES · VÉRIFIÉ SELON OEM",
    titleA: "Réglages de suspension,",
    titleB: "pour votre moto exacte.",
    subtitle:
      "Points de départ de référence pour le SAG, la précharge, la détente et la compression — par modèle et selon votre conduite. Explorez et contribuez gratuitement.",
    searchPlaceholder: "Rechercher un modèle…",
    all: "Toutes",
    modelsFound: "MODÈLES TROUVÉS",
    front: "AVANT",
    rear: "ARRIÈRE",
    isNew: "NOUVEAU",
    modalTitle: "Confirmer le partage du réglage",
    modalDesc:
      "Nous avons reçu votre réglage depuis l'app RideTune. Confirmez-vous la publication pour la communauté ?",
    cancel: "Annuler",
    publish: "Publier le réglage",
  },
  footer: {
    disclaimer:
      "Les réglages présentés sont des points de départ de référence, basés sur des données OEM et des calculs. L'état mécanique de la moto, l'usure des composants et la conduite en sécurité relèvent de la responsabilité du pilote. Consultez toujours le manuel officiel du constructeur.",
    rights: "Tous droits réservés.",
    privacy: "Confidentialité",
    terms: "Conditions générales",
    support: "Assistance",
    contact: "Contact",
  },
};

export const de: Dict = {
  nav: {
    features: "Funktionen",
    how: "So funktioniert's",
    setups: "Setups",
    premium: "Premium",
    download: "Herunterladen",
  },
  setups: {
    eyebrow: "SETUP-BIBLIOTHEK · GEPRÜFT NACH OEM",
    titleA: "Fahrwerk-Setups,",
    titleB: "für dein genaues Motorrad.",
    subtitle:
      "Referenz-Ausgangspunkte für SAG, Vorspannung, Zugstufe und Druckstufe — nach Modell und nach deinem Fahrstil. Kostenlos stöbern und beitragen.",
    searchPlaceholder: "Modell suchen…",
    all: "Alle",
    modelsFound: "MODELLE GEFUNDEN",
    front: "VORNE",
    rear: "HINTEN",
    isNew: "NEU",
    modalTitle: "Setup-Freigabe bestätigen",
    modalDesc:
      "Wir haben dein Setup aus der RideTune-App erhalten. Möchtest du es für die Community veröffentlichen?",
    cancel: "Abbrechen",
    publish: "Setup veröffentlichen",
  },
  footer: {
    disclaimer:
      "Die gezeigten Setups sind Referenz-Ausgangspunkte, basierend auf OEM-Daten und Berechnungen. Der mechanische Zustand des Motorrads, der Verschleiß der Komponenten und das sichere Fahren liegen in der Verantwortung des Fahrers. Prüfe immer das offizielle Handbuch des Herstellers.",
    rights: "Alle Rechte vorbehalten.",
    privacy: "Datenschutz",
    terms: "AGB",
    support: "Support",
    contact: "Kontakt",
  },
};

export const it: Dict = {
  nav: {
    features: "Funzionalità",
    how: "Come funziona",
    setups: "Setup",
    premium: "Premium",
    download: "Scarica",
  },
  setups: {
    eyebrow: "LIBRERIA DI SETUP · VERIFICATO SU DATI OEM",
    titleA: "Setup della sospensione,",
    titleB: "per la tua moto esatta.",
    subtitle:
      "Punti di partenza di riferimento per SAG, precarico, ritorno e compressione — per modello e per come guidi. Esplora e contribuisci gratis.",
    searchPlaceholder: "Cerca un modello…",
    all: "Tutte",
    modelsFound: "MODELLI TROVATI",
    front: "ANTERIORE",
    rear: "POSTERIORE",
    isNew: "NUOVO",
    modalTitle: "Conferma condivisione setup",
    modalDesc:
      "Abbiamo ricevuto il tuo setup dall'app RideTune. Confermi la pubblicazione per la community?",
    cancel: "Annulla",
    publish: "Pubblica setup",
  },
  footer: {
    disclaimer:
      "I setup mostrati sono punti di partenza di riferimento, basati su dati OEM e calcoli. Le condizioni meccaniche della moto, l'usura dei componenti e la guida sicura sono responsabilità del pilota. Consulta sempre il manuale ufficiale del produttore.",
    rights: "Tutti i diritti riservati.",
    privacy: "Privacy",
    terms: "Termini e Condizioni",
    support: "Assistenza",
    contact: "Contatto",
  },
};

export const dictionaries: Record<Locale, Dict> = { en, pt, es, fr, de, it };
