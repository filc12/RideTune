/**
 * Dicionário das páginas legais (Privacidade + Termos de Submissão), 6 idiomas.
 * Separado de dictionaries.ts por ser texto longo. Consumido por components/LegalPage.tsx.
 */
import type { Locale } from "./dictionaries";

type Section = [string, string];

export type LegalDict = {
  back: string;
  lastUpdated: string;
  privacyTitle: string;
  privacySections: Section[];
  seeAlsoPre: string;
  submissionTerms: string;
  termsTitle: string;
  termsSections: Section[];
  privacyPolicy: string;
};

const en: LegalDict = {
  back: "← Back to RideTune",
  lastUpdated: "Last updated: July 2026",
  privacyTitle: "Privacy Policy",
  privacySections: [
    ["Overview", "RideTune is a motorcycle suspension setup app. We built it to work without accounts, without sign-ups and with as little data as possible. This page explains what little data the app touches and why."],
    ["Data stored on your device", "Your rider profiles, saved setups, Ride Diary entries and load preferences are stored locally on your device. They never leave your phone unless you explicitly use the Export Data feature, which creates a file that you control and share yourself."],
    ["No accounts", "RideTune does not require or offer user accounts. We do not collect your name, email address or any other identity information."],
    ["Purchases", "RideTune Premium Lifetime is a one-time purchase processed entirely by Google Play Billing. We use RevenueCat to validate purchases and restore them on reinstall. We receive an anonymous purchase record — never your payment details, which stay with Google."],
    ["Analytics", "The app sends anonymous usage events (for example, which screens are opened) via PostHog to help us understand which features matter. These events are tied to a random identifier, not to you. No precise location, contacts or personal content is ever collected."],
    ["Crash reports", "If the app crashes, an automatic crash report (stack trace and device model) is sent via Sentry so we can fix the problem. Crash reports do not include your setups, diary or personal information."],
    ["Motorcycle data", "The app downloads its motorcycle and suspension database from our servers. These requests are anonymous read-only downloads."],
    ["Community setups (shared by you)", "If you choose to share a setup to the community, that setup — your motorcycle, load, sag and clicker values, an optional country and an optional short note — is published on ridetune.app and inside the app as 'Anonymous rider'. It is tied only to a random device identifier generated on your phone, never to your name, email or any personal data. Sharing is always your choice and is confirmed each time. You can view and delete your shared setups at any time from the app, which removes them from our servers. Submissions may be checked automatically and lightly moderated to keep the library useful. Community data is stored with Supabase (our database provider). By sharing, you agree to the submission terms."],
    ["Data deletion", "Because your data lives on your device, deleting the app deletes your on-device data. Setups you shared to the community can be removed at any time from the app, which deletes them from our servers. Anonymous analytics and crash data are retained by our providers for a limited period and cannot be linked back to you."],
    ["Contact", "Questions about privacy? Email support@ridetune.app."],
  ],
  seeAlsoPre: "See also our",
  submissionTerms: "Submission Terms",
  termsTitle: "Submission Terms",
  termsSections: [
    ["About these terms", "These terms apply when you choose to share a suspension setup to the RideTune community from the app. Sharing is optional. If you don't share, these terms don't apply to you."],
    ["What you share", "A shared setup includes your motorcycle model, load (rider, passenger, luggage), sag and clicker values, an optional country and an optional short note. It does not include your name, email or any personal data, and it is published as 'Anonymous rider', tied only to a random device identifier on your phone."],
    ["Your content", "You confirm the setup is your own and, to the best of your knowledge, accurate. Don't submit anything you don't have the right to share, or content that is offensive, misleading, unlawful or unrelated to motorcycle suspension."],
    ["Licence to display", "By sharing, you grant RideTune a non-exclusive, worldwide, royalty-free licence to store, display and distribute the shared setup on ridetune.app and inside the app. You keep ownership of what you share; this licence exists only so we can show it to other riders."],
    ["Moderation", "Submissions may be validated automatically (for example, checking values against manufacturer sag ranges) and lightly moderated. An optional note may be held for review before it appears. We may remove or decline any submission that breaks these terms or is reported."],
    ["Removing your setups", "You can view and delete your shared setups at any time from the app. Deleting a setup removes it from our servers. Because setups are anonymous, deletion is handled through the app on the device that shared them."],
    ["No professional advice, ride safely", "Suspension setups — whether shared by riders or provided by RideTune as reference — are suggestions and starting points, not professional advice. Always measure your own sag and adjust to your exact motorcycle, load and riding conditions. Incorrect suspension settings can affect handling and safety. You are responsible for how you set up and ride your motorcycle, and RideTune is not liable for the use of community or reference setups."],
    ["Changes", "We may update these terms from time to time. The 'last updated' date below shows when they last changed."],
    ["Contact", "Questions about sharing or these terms? Email support@ridetune.app."],
  ],
  privacyPolicy: "Privacy Policy",
};

const pt: LegalDict = {
  back: "← Voltar à RideTune",
  lastUpdated: "Última atualização: julho de 2026",
  privacyTitle: "Política de Privacidade",
  privacySections: [
    ["Resumo", "A RideTune é uma app de afinação de suspensão de motos. Construímo-la para funcionar sem contas, sem registos e com o mínimo de dados possível. Esta página explica os poucos dados que a app usa e porquê."],
    ["Dados guardados no teu dispositivo", "Os teus perfis de condutor, setups guardados, entradas do Diário de Condução e preferências de carga são guardados localmente no teu dispositivo. Nunca saem do telemóvel a não ser que uses explicitamente a função Exportar Dados, que cria um ficheiro que controlas e partilhas tu."],
    ["Sem contas", "A RideTune não exige nem oferece contas de utilizador. Não recolhemos o teu nome, email ou qualquer outra informação de identidade."],
    ["Compras", "O RideTune Premium Vitalício é uma compra única processada inteiramente pela Faturação da Google Play. Usamos a RevenueCat para validar compras e restaurá-las ao reinstalar. Recebemos um registo de compra anónimo — nunca os teus dados de pagamento, que ficam com a Google."],
    ["Análises (analytics)", "A app envia eventos de utilização anónimos (por exemplo, que ecrãs são abertos) via PostHog para percebermos que funcionalidades importam. Estes eventos estão ligados a um identificador aleatório, não a ti. Nunca é recolhida localização precisa, contactos ou conteúdo pessoal."],
    ["Relatórios de falhas", "Se a app falhar, é enviado um relatório de falha automático (stack trace e modelo do dispositivo) via Sentry para podermos corrigir o problema. Os relatórios de falha não incluem os teus setups, diário ou informação pessoal."],
    ["Dados das motos", "A app descarrega a sua base de dados de motos e suspensão dos nossos servidores. Estes pedidos são descargas anónimas e de leitura apenas."],
    ["Setups da comunidade (partilhados por ti)", "Se optares por partilhar um setup para a comunidade, esse setup — a tua moto, carga, sag e valores de cliques, um país opcional e uma nota curta opcional — é publicado em ridetune.app e dentro da app como 'Condutor anónimo'. Está ligado apenas a um identificador de dispositivo aleatório gerado no teu telemóvel, nunca ao teu nome, email ou quaisquer dados pessoais. A partilha é sempre tua escolha e é confirmada de cada vez. Podes ver e apagar os teus setups partilhados a qualquer momento na app, o que os remove dos nossos servidores. As submissões podem ser verificadas automaticamente e ligeiramente moderadas para manter a biblioteca útil. Os dados da comunidade são guardados na Supabase (o nosso fornecedor de base de dados). Ao partilhar, aceitas os termos de submissão."],
    ["Eliminação de dados", "Como os teus dados vivem no teu dispositivo, apagar a app apaga os dados no dispositivo. Os setups que partilhaste para a comunidade podem ser removidos a qualquer momento na app, o que os elimina dos nossos servidores. Os dados anónimos de análise e de falhas são retidos pelos nossos fornecedores por um período limitado e não podem ser associados a ti."],
    ["Contacto", "Dúvidas sobre privacidade? Escreve para support@ridetune.app."],
  ],
  seeAlsoPre: "Vê também os nossos",
  submissionTerms: "Termos de Submissão",
  termsTitle: "Termos de Submissão",
  termsSections: [
    ["Sobre estes termos", "Estes termos aplicam-se quando optas por partilhar um setup de suspensão para a comunidade RideTune a partir da app. A partilha é opcional. Se não partilhares, estes termos não se aplicam a ti."],
    ["O que partilhas", "Um setup partilhado inclui o modelo da tua moto, a carga (condutor, passageiro, bagagem), o sag e os valores de cliques, um país opcional e uma nota curta opcional. Não inclui o teu nome, email ou quaisquer dados pessoais, e é publicado como 'Condutor anónimo', ligado apenas a um identificador de dispositivo aleatório no teu telemóvel."],
    ["O teu conteúdo", "Confirmas que o setup é teu e, tanto quanto sabes, exato. Não submetas nada que não tenhas o direito de partilhar, nem conteúdo ofensivo, enganador, ilegal ou não relacionado com suspensão de motos."],
    ["Licença de exibição", "Ao partilhar, concedes à RideTune uma licença não exclusiva, mundial e isenta de royalties para armazenar, exibir e distribuir o setup partilhado em ridetune.app e dentro da app. Mantens a propriedade do que partilhas; esta licença existe apenas para podermos mostrá-lo a outros condutores."],
    ["Moderação", "As submissões podem ser validadas automaticamente (por exemplo, comparando valores com os intervalos de sag do fabricante) e ligeiramente moderadas. Uma nota opcional pode ficar retida para revisão antes de aparecer. Podemos remover ou recusar qualquer submissão que viole estes termos ou que seja denunciada."],
    ["Remover os teus setups", "Podes ver e apagar os teus setups partilhados a qualquer momento na app. Apagar um setup remove-o dos nossos servidores. Como os setups são anónimos, a eliminação é feita através da app, no dispositivo que os partilhou."],
    ["Sem aconselhamento profissional, conduz em segurança", "Os setups de suspensão — quer partilhados por condutores, quer fornecidos pela RideTune como referência — são sugestões e pontos de partida, não aconselhamento profissional. Mede sempre o teu próprio sag e ajusta à tua moto, carga e condições de condução exatas. Afinações de suspensão incorretas podem afetar o comportamento e a segurança. És responsável pela forma como afinas e conduzes a tua moto, e a RideTune não é responsável pelo uso de setups da comunidade ou de referência."],
    ["Alterações", "Podemos atualizar estes termos de tempos a tempos. A data de 'última atualização' abaixo mostra quando mudaram pela última vez."],
    ["Contacto", "Dúvidas sobre partilha ou estes termos? Escreve para support@ridetune.app."],
  ],
  privacyPolicy: "Política de Privacidade",
};

const es: LegalDict = {
  back: "← Volver a RideTune",
  lastUpdated: "Última actualización: julio de 2026",
  privacyTitle: "Política de Privacidad",
  privacySections: [
    ["Resumen", "RideTune es una app de ajuste de suspensión de motos. La creamos para funcionar sin cuentas, sin registros y con la menor cantidad de datos posible. Esta página explica los pocos datos que la app utiliza y por qué."],
    ["Datos guardados en tu dispositivo", "Tus perfiles de piloto, ajustes guardados, entradas del Diario de Conducción y preferencias de carga se guardan localmente en tu dispositivo. Nunca salen de tu teléfono a menos que uses expresamente la función Exportar Datos, que crea un archivo que tú controlas y compartes."],
    ["Sin cuentas", "RideTune no requiere ni ofrece cuentas de usuario. No recopilamos tu nombre, correo electrónico ni ninguna otra información de identidad."],
    ["Compras", "RideTune Premium de por vida es una compra única procesada íntegramente por la Facturación de Google Play. Usamos RevenueCat para validar las compras y restaurarlas al reinstalar. Recibimos un registro de compra anónimo — nunca tus datos de pago, que se quedan con Google."],
    ["Analítica", "La app envía eventos de uso anónimos (por ejemplo, qué pantallas se abren) mediante PostHog para ayudarnos a entender qué funciones importan. Estos eventos están vinculados a un identificador aleatorio, no a ti. Nunca se recopila ubicación precisa, contactos ni contenido personal."],
    ["Informes de errores", "Si la app se cierra inesperadamente, se envía un informe de error automático (traza y modelo del dispositivo) mediante Sentry para poder solucionar el problema. Los informes de error no incluyen tus ajustes, diario ni información personal."],
    ["Datos de las motos", "La app descarga su base de datos de motos y suspensión desde nuestros servidores. Estas solicitudes son descargas anónimas y de solo lectura."],
    ["Ajustes de la comunidad (compartidos por ti)", "Si eliges compartir un ajuste con la comunidad, ese ajuste — tu moto, carga, sag y valores de clics, un país opcional y una nota corta opcional — se publica en ridetune.app y dentro de la app como 'Piloto anónimo'. Está vinculado solo a un identificador de dispositivo aleatorio generado en tu teléfono, nunca a tu nombre, correo ni datos personales. Compartir es siempre tu elección y se confirma cada vez. Puedes ver y eliminar tus ajustes compartidos en cualquier momento desde la app, lo que los elimina de nuestros servidores. Las publicaciones pueden verificarse automáticamente y moderarse ligeramente para mantener útil la biblioteca. Los datos de la comunidad se almacenan con Supabase (nuestro proveedor de base de datos). Al compartir, aceptas los términos de publicación."],
    ["Eliminación de datos", "Como tus datos residen en tu dispositivo, eliminar la app elimina los datos del dispositivo. Los ajustes que compartiste con la comunidad pueden eliminarse en cualquier momento desde la app, lo que los borra de nuestros servidores. Los datos anónimos de analítica y errores se conservan con nuestros proveedores durante un periodo limitado y no pueden vincularse a ti."],
    ["Contacto", "¿Dudas sobre privacidad? Escribe a support@ridetune.app."],
  ],
  seeAlsoPre: "Consulta también nuestros",
  submissionTerms: "Términos de Publicación",
  termsTitle: "Términos de Publicación",
  termsSections: [
    ["Sobre estos términos", "Estos términos se aplican cuando eliges compartir un ajuste de suspensión con la comunidad RideTune desde la app. Compartir es opcional. Si no compartes, estos términos no se aplican a ti."],
    ["Qué compartes", "Un ajuste compartido incluye el modelo de tu moto, la carga (piloto, pasajero, equipaje), el sag y los valores de clics, un país opcional y una nota corta opcional. No incluye tu nombre, correo ni datos personales, y se publica como 'Piloto anónimo', vinculado solo a un identificador de dispositivo aleatorio en tu teléfono."],
    ["Tu contenido", "Confirmas que el ajuste es tuyo y, hasta donde sabes, correcto. No envíes nada que no tengas derecho a compartir, ni contenido ofensivo, engañoso, ilegal o ajeno a la suspensión de motos."],
    ["Licencia de exhibición", "Al compartir, otorgas a RideTune una licencia no exclusiva, mundial y libre de regalías para almacenar, mostrar y distribuir el ajuste compartido en ridetune.app y dentro de la app. Conservas la propiedad de lo que compartes; esta licencia existe solo para poder mostrarlo a otros pilotos."],
    ["Moderación", "Las publicaciones pueden validarse automáticamente (por ejemplo, comparando valores con los rangos de sag del fabricante) y moderarse ligeramente. Una nota opcional puede quedar en revisión antes de aparecer. Podemos eliminar o rechazar cualquier publicación que infrinja estos términos o que sea denunciada."],
    ["Eliminar tus ajustes", "Puedes ver y eliminar tus ajustes compartidos en cualquier momento desde la app. Eliminar un ajuste lo borra de nuestros servidores. Como los ajustes son anónimos, la eliminación se gestiona a través de la app, en el dispositivo que los compartió."],
    ["Sin asesoramiento profesional, conduce con seguridad", "Los ajustes de suspensión — ya sean compartidos por pilotos o proporcionados por RideTune como referencia — son sugerencias y puntos de partida, no asesoramiento profesional. Mide siempre tu propio sag y ajusta a tu moto, carga y condiciones de conducción exactas. Unos ajustes de suspensión incorrectos pueden afectar al comportamiento y la seguridad. Eres responsable de cómo ajustas y conduces tu moto, y RideTune no se hace responsable del uso de ajustes de la comunidad o de referencia."],
    ["Cambios", "Podemos actualizar estos términos de vez en cuando. La fecha de 'última actualización' de abajo muestra cuándo cambiaron por última vez."],
    ["Contacto", "¿Dudas sobre compartir o estos términos? Escribe a support@ridetune.app."],
  ],
  privacyPolicy: "Política de Privacidad",
};

const fr: LegalDict = {
  back: "← Retour à RideTune",
  lastUpdated: "Dernière mise à jour : juillet 2026",
  privacyTitle: "Politique de confidentialité",
  privacySections: [
    ["Aperçu", "RideTune est une app de réglage de suspension moto. Nous l'avons conçue pour fonctionner sans comptes, sans inscription et avec le moins de données possible. Cette page explique les rares données que l'app utilise et pourquoi."],
    ["Données stockées sur votre appareil", "Vos profils de pilote, réglages enregistrés, entrées du carnet de route et préférences de charge sont stockés localement sur votre appareil. Ils ne quittent jamais votre téléphone, sauf si vous utilisez expressément la fonction Exporter les données, qui crée un fichier que vous contrôlez et partagez vous-même."],
    ["Aucun compte", "RideTune n'exige ni ne propose de comptes utilisateur. Nous ne collectons pas votre nom, votre e-mail ni aucune autre information d'identité."],
    ["Achats", "RideTune Premium à vie est un achat unique traité entièrement par la Facturation Google Play. Nous utilisons RevenueCat pour valider les achats et les restaurer lors d'une réinstallation. Nous recevons un enregistrement d'achat anonyme — jamais vos données de paiement, qui restent chez Google."],
    ["Statistiques", "L'app envoie des événements d'usage anonymes (par exemple, quels écrans sont ouverts) via PostHog pour nous aider à comprendre quelles fonctions comptent. Ces événements sont liés à un identifiant aléatoire, pas à vous. Aucune localisation précise, contact ou contenu personnel n'est jamais collecté."],
    ["Rapports de plantage", "Si l'app plante, un rapport de plantage automatique (trace et modèle de l'appareil) est envoyé via Sentry pour que nous puissions corriger le problème. Les rapports de plantage n'incluent pas vos réglages, votre carnet ni vos informations personnelles."],
    ["Données des motos", "L'app télécharge sa base de données de motos et de suspensions depuis nos serveurs. Ces requêtes sont des téléchargements anonymes en lecture seule."],
    ["Réglages de la communauté (partagés par vous)", "Si vous choisissez de partager un réglage avec la communauté, ce réglage — votre moto, la charge, le sag et les valeurs de clics, un pays optionnel et une courte note optionnelle — est publié sur ridetune.app et dans l'app en tant que 'Pilote anonyme'. Il est lié uniquement à un identifiant d'appareil aléatoire généré sur votre téléphone, jamais à votre nom, e-mail ou données personnelles. Le partage est toujours votre choix et est confirmé à chaque fois. Vous pouvez consulter et supprimer vos réglages partagés à tout moment depuis l'app, ce qui les retire de nos serveurs. Les soumissions peuvent être vérifiées automatiquement et légèrement modérées pour garder la bibliothèque utile. Les données de la communauté sont stockées chez Supabase (notre fournisseur de base de données). En partageant, vous acceptez les conditions de soumission."],
    ["Suppression des données", "Comme vos données résident sur votre appareil, supprimer l'app supprime les données de l'appareil. Les réglages que vous avez partagés avec la communauté peuvent être retirés à tout moment depuis l'app, ce qui les supprime de nos serveurs. Les données anonymes de statistiques et de plantage sont conservées par nos prestataires pendant une durée limitée et ne peuvent pas être rattachées à vous."],
    ["Contact", "Des questions sur la confidentialité ? Écrivez à support@ridetune.app."],
  ],
  seeAlsoPre: "Voir aussi nos",
  submissionTerms: "Conditions de soumission",
  termsTitle: "Conditions de soumission",
  termsSections: [
    ["À propos de ces conditions", "Ces conditions s'appliquent lorsque vous choisissez de partager un réglage de suspension avec la communauté RideTune depuis l'app. Le partage est facultatif. Si vous ne partagez pas, ces conditions ne s'appliquent pas à vous."],
    ["Ce que vous partagez", "Un réglage partagé inclut le modèle de votre moto, la charge (pilote, passager, bagages), le sag et les valeurs de clics, un pays optionnel et une courte note optionnelle. Il n'inclut pas votre nom, votre e-mail ni aucune donnée personnelle, et il est publié en tant que 'Pilote anonyme', lié uniquement à un identifiant d'appareil aléatoire sur votre téléphone."],
    ["Votre contenu", "Vous confirmez que le réglage est le vôtre et, à votre connaissance, exact. Ne soumettez rien que vous n'avez pas le droit de partager, ni de contenu offensant, trompeur, illégal ou sans rapport avec la suspension moto."],
    ["Licence d'affichage", "En partageant, vous accordez à RideTune une licence non exclusive, mondiale et gratuite pour stocker, afficher et distribuer le réglage partagé sur ridetune.app et dans l'app. Vous conservez la propriété de ce que vous partagez ; cette licence existe uniquement pour que nous puissions le montrer aux autres pilotes."],
    ["Modération", "Les soumissions peuvent être validées automatiquement (par exemple, en comparant les valeurs aux plages de sag du constructeur) et légèrement modérées. Une note optionnelle peut être retenue pour vérification avant d'apparaître. Nous pouvons retirer ou refuser toute soumission qui enfreint ces conditions ou qui est signalée."],
    ["Supprimer vos réglages", "Vous pouvez consulter et supprimer vos réglages partagés à tout moment depuis l'app. Supprimer un réglage le retire de nos serveurs. Comme les réglages sont anonymes, la suppression se fait via l'app, sur l'appareil qui les a partagés."],
    ["Pas de conseil professionnel, roulez prudemment", "Les réglages de suspension — qu'ils soient partagés par des pilotes ou fournis par RideTune à titre de référence — sont des suggestions et des points de départ, pas des conseils professionnels. Mesurez toujours votre propre sag et ajustez à votre moto, votre charge et vos conditions de conduite exactes. Des réglages de suspension incorrects peuvent affecter le comportement et la sécurité. Vous êtes responsable de la façon dont vous réglez et conduisez votre moto, et RideTune n'est pas responsable de l'utilisation des réglages de la communauté ou de référence."],
    ["Modifications", "Nous pouvons mettre à jour ces conditions de temps à autre. La date de 'dernière mise à jour' ci-dessous indique quand elles ont changé pour la dernière fois."],
    ["Contact", "Des questions sur le partage ou ces conditions ? Écrivez à support@ridetune.app."],
  ],
  privacyPolicy: "Politique de confidentialité",
};

const de: LegalDict = {
  back: "← Zurück zu RideTune",
  lastUpdated: "Zuletzt aktualisiert: Juli 2026",
  privacyTitle: "Datenschutzerklärung",
  privacySections: [
    ["Überblick", "RideTune ist eine App zur Fahrwerksabstimmung von Motorrädern. Wir haben sie so gebaut, dass sie ohne Konten, ohne Anmeldung und mit so wenig Daten wie möglich funktioniert. Diese Seite erklärt, welche wenigen Daten die App verwendet und warum."],
    ["Auf deinem Gerät gespeicherte Daten", "Deine Fahrerprofile, gespeicherten Setups, Fahrtenbuch-Einträge und Last-Einstellungen werden lokal auf deinem Gerät gespeichert. Sie verlassen dein Telefon nie, es sei denn, du nutzt ausdrücklich die Funktion Daten exportieren, die eine Datei erstellt, die du selbst kontrollierst und teilst."],
    ["Keine Konten", "RideTune benötigt oder bietet keine Benutzerkonten. Wir erfassen weder deinen Namen noch deine E-Mail-Adresse oder andere Identitätsdaten."],
    ["Käufe", "RideTune Premium Lifetime ist ein einmaliger Kauf, der vollständig über Google Play Billing abgewickelt wird. Wir nutzen RevenueCat, um Käufe zu validieren und bei einer Neuinstallation wiederherzustellen. Wir erhalten einen anonymen Kaufnachweis — niemals deine Zahlungsdaten, die bei Google bleiben."],
    ["Analyse", "Die App sendet anonyme Nutzungsereignisse (zum Beispiel, welche Bildschirme geöffnet werden) über PostHog, damit wir verstehen, welche Funktionen wichtig sind. Diese Ereignisse sind an eine zufällige Kennung gebunden, nicht an dich. Es werden nie genauer Standort, Kontakte oder persönliche Inhalte erfasst."],
    ["Absturzberichte", "Wenn die App abstürzt, wird über Sentry ein automatischer Absturzbericht (Stacktrace und Gerätemodell) gesendet, damit wir das Problem beheben können. Absturzberichte enthalten weder deine Setups noch dein Fahrtenbuch oder persönliche Informationen."],
    ["Motorraddaten", "Die App lädt ihre Motorrad- und Fahrwerksdatenbank von unseren Servern herunter. Diese Anfragen sind anonyme, rein lesende Downloads."],
    ["Community-Setups (von dir geteilt)", "Wenn du ein Setup mit der Community teilst, wird dieses Setup — dein Motorrad, die Last, Sag- und Klicker-Werte, ein optionales Land und eine optionale kurze Notiz — auf ridetune.app und in der App als 'Anonymer Fahrer' veröffentlicht. Es ist nur mit einer zufälligen, auf deinem Telefon erzeugten Gerätekennung verknüpft, niemals mit deinem Namen, deiner E-Mail oder persönlichen Daten. Das Teilen ist immer deine Entscheidung und wird jedes Mal bestätigt. Du kannst deine geteilten Setups jederzeit in der App ansehen und löschen, wodurch sie von unseren Servern entfernt werden. Einreichungen können automatisch geprüft und leicht moderiert werden, damit die Bibliothek nützlich bleibt. Community-Daten werden bei Supabase (unserem Datenbankanbieter) gespeichert. Mit dem Teilen akzeptierst du die Einreichungsbedingungen."],
    ["Datenlöschung", "Da deine Daten auf deinem Gerät liegen, löscht das Deinstallieren der App die Daten auf dem Gerät. Setups, die du mit der Community geteilt hast, können jederzeit in der App entfernt werden, wodurch sie von unseren Servern gelöscht werden. Anonyme Analyse- und Absturzdaten werden von unseren Anbietern für einen begrenzten Zeitraum aufbewahrt und können nicht mit dir verknüpft werden."],
    ["Kontakt", "Fragen zum Datenschutz? Schreibe an support@ridetune.app."],
  ],
  seeAlsoPre: "Siehe auch unsere",
  submissionTerms: "Einreichungsbedingungen",
  termsTitle: "Einreichungsbedingungen",
  termsSections: [
    ["Über diese Bedingungen", "Diese Bedingungen gelten, wenn du ein Fahrwerk-Setup aus der App mit der RideTune-Community teilst. Das Teilen ist freiwillig. Wenn du nicht teilst, gelten diese Bedingungen nicht für dich."],
    ["Was du teilst", "Ein geteiltes Setup umfasst dein Motorradmodell, die Last (Fahrer, Sozius, Gepäck), Sag- und Klicker-Werte, ein optionales Land und eine optionale kurze Notiz. Es enthält weder deinen Namen, deine E-Mail noch persönliche Daten und wird als 'Anonymer Fahrer' veröffentlicht, nur mit einer zufälligen Gerätekennung auf deinem Telefon verknüpft."],
    ["Deine Inhalte", "Du bestätigst, dass das Setup dein eigenes und nach bestem Wissen korrekt ist. Reiche nichts ein, wozu du kein Recht zum Teilen hast, oder Inhalte, die beleidigend, irreführend, rechtswidrig oder ohne Bezug zur Motorrad-Fahrwerksabstimmung sind."],
    ["Lizenz zur Anzeige", "Mit dem Teilen gewährst du RideTune eine nicht-exklusive, weltweite, lizenzgebührenfreie Lizenz zum Speichern, Anzeigen und Verbreiten des geteilten Setups auf ridetune.app und in der App. Du behältst das Eigentum an dem, was du teilst; diese Lizenz besteht nur, damit wir es anderen Fahrern zeigen können."],
    ["Moderation", "Einreichungen können automatisch validiert (zum Beispiel durch Abgleich der Werte mit den Sag-Bereichen des Herstellers) und leicht moderiert werden. Eine optionale Notiz kann vor der Anzeige zur Prüfung zurückgehalten werden. Wir können jede Einreichung entfernen oder ablehnen, die gegen diese Bedingungen verstößt oder gemeldet wird."],
    ["Deine Setups entfernen", "Du kannst deine geteilten Setups jederzeit in der App ansehen und löschen. Das Löschen eines Setups entfernt es von unseren Servern. Da Setups anonym sind, erfolgt die Löschung über die App, auf dem Gerät, das sie geteilt hat."],
    ["Keine professionelle Beratung, fahre sicher", "Fahrwerk-Setups — ob von Fahrern geteilt oder von RideTune als Referenz bereitgestellt — sind Vorschläge und Ausgangspunkte, keine professionelle Beratung. Miss immer deinen eigenen Sag und passe an dein genaues Motorrad, deine Last und deine Fahrbedingungen an. Falsche Fahrwerkseinstellungen können Handling und Sicherheit beeinträchtigen. Du bist dafür verantwortlich, wie du dein Motorrad einstellst und fährst, und RideTune haftet nicht für die Nutzung von Community- oder Referenz-Setups."],
    ["Änderungen", "Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Das Datum 'zuletzt aktualisiert' unten zeigt, wann sie zuletzt geändert wurden."],
    ["Kontakt", "Fragen zum Teilen oder zu diesen Bedingungen? Schreibe an support@ridetune.app."],
  ],
  privacyPolicy: "Datenschutzerklärung",
};

const it: LegalDict = {
  back: "← Torna a RideTune",
  lastUpdated: "Ultimo aggiornamento: luglio 2026",
  privacyTitle: "Informativa sulla privacy",
  privacySections: [
    ["Panoramica", "RideTune è un'app per la taratura della sospensione delle moto. L'abbiamo creata per funzionare senza account, senza registrazioni e con il minor numero di dati possibile. Questa pagina spiega i pochi dati che l'app utilizza e perché."],
    ["Dati salvati sul tuo dispositivo", "I tuoi profili pilota, i setup salvati, le voci del Diario di guida e le preferenze di carico sono salvati localmente sul tuo dispositivo. Non lasciano mai il telefono a meno che tu non usi espressamente la funzione Esporta dati, che crea un file che controlli e condividi tu."],
    ["Nessun account", "RideTune non richiede né offre account utente. Non raccogliamo il tuo nome, l'email o altre informazioni identificative."],
    ["Acquisti", "RideTune Premium a vita è un acquisto unico gestito interamente da Google Play Billing. Usiamo RevenueCat per convalidare gli acquisti e ripristinarli in caso di reinstallazione. Riceviamo una registrazione d'acquisto anonima — mai i tuoi dati di pagamento, che restano a Google."],
    ["Analisi", "L'app invia eventi d'uso anonimi (ad esempio, quali schermate vengono aperte) tramite PostHog per aiutarci a capire quali funzioni contano. Questi eventi sono legati a un identificatore casuale, non a te. Non vengono mai raccolti posizione precisa, contatti o contenuti personali."],
    ["Rapporti di crash", "Se l'app si blocca, viene inviato un rapporto di crash automatico (stack trace e modello del dispositivo) tramite Sentry per poter risolvere il problema. I rapporti di crash non includono i tuoi setup, il diario o informazioni personali."],
    ["Dati delle moto", "L'app scarica il suo database di moto e sospensioni dai nostri server. Queste richieste sono download anonimi e di sola lettura."],
    ["Setup della community (condivisi da te)", "Se scegli di condividere un setup con la community, quel setup — la tua moto, il carico, il sag e i valori di clic, un paese facoltativo e una breve nota facoltativa — viene pubblicato su ridetune.app e nell'app come 'Pilota anonimo'. È legato solo a un identificatore di dispositivo casuale generato sul tuo telefono, mai al tuo nome, email o dati personali. La condivisione è sempre una tua scelta ed è confermata ogni volta. Puoi vedere ed eliminare i tuoi setup condivisi in qualsiasi momento dall'app, il che li rimuove dai nostri server. Gli invii possono essere verificati automaticamente e moderati leggermente per mantenere utile la libreria. I dati della community sono conservati su Supabase (il nostro fornitore di database). Condividendo, accetti i termini di invio."],
    ["Eliminazione dei dati", "Poiché i tuoi dati risiedono sul tuo dispositivo, eliminare l'app elimina i dati sul dispositivo. I setup che hai condiviso con la community possono essere rimossi in qualsiasi momento dall'app, il che li elimina dai nostri server. I dati anonimi di analisi e crash sono conservati dai nostri fornitori per un periodo limitato e non possono essere ricollegati a te."],
    ["Contatto", "Domande sulla privacy? Scrivi a support@ridetune.app."],
  ],
  seeAlsoPre: "Vedi anche i nostri",
  submissionTerms: "Termini di invio",
  termsTitle: "Termini di invio",
  termsSections: [
    ["Su questi termini", "Questi termini si applicano quando scegli di condividere un setup di sospensione con la community RideTune dall'app. La condivisione è facoltativa. Se non condividi, questi termini non si applicano a te."],
    ["Cosa condividi", "Un setup condiviso include il modello della tua moto, il carico (pilota, passeggero, bagagli), il sag e i valori di clic, un paese facoltativo e una breve nota facoltativa. Non include il tuo nome, l'email o dati personali, e viene pubblicato come 'Pilota anonimo', legato solo a un identificatore di dispositivo casuale sul tuo telefono."],
    ["I tuoi contenuti", "Confermi che il setup è tuo e, per quanto ne sai, corretto. Non inviare nulla che non hai il diritto di condividere, né contenuti offensivi, ingannevoli, illeciti o non pertinenti alla sospensione delle moto."],
    ["Licenza di visualizzazione", "Condividendo, concedi a RideTune una licenza non esclusiva, mondiale e senza royalty per archiviare, mostrare e distribuire il setup condiviso su ridetune.app e nell'app. Mantieni la proprietà di ciò che condividi; questa licenza esiste solo affinché possiamo mostrarlo agli altri piloti."],
    ["Moderazione", "Gli invii possono essere convalidati automaticamente (ad esempio, confrontando i valori con gli intervalli di sag del produttore) e moderati leggermente. Una nota facoltativa può essere trattenuta per revisione prima di apparire. Possiamo rimuovere o rifiutare qualsiasi invio che violi questi termini o che venga segnalato."],
    ["Rimuovere i tuoi setup", "Puoi vedere ed eliminare i tuoi setup condivisi in qualsiasi momento dall'app. Eliminare un setup lo rimuove dai nostri server. Poiché i setup sono anonimi, l'eliminazione avviene tramite l'app, sul dispositivo che li ha condivisi."],
    ["Nessuna consulenza professionale, guida in sicurezza", "I setup di sospensione — sia condivisi dai piloti sia forniti da RideTune come riferimento — sono suggerimenti e punti di partenza, non consulenza professionale. Misura sempre il tuo sag e adatta alla tua moto, al carico e alle condizioni di guida esatte. Impostazioni di sospensione errate possono influire su comportamento e sicurezza. Sei responsabile di come imposti e guidi la tua moto, e RideTune non è responsabile dell'uso di setup della community o di riferimento."],
    ["Modifiche", "Possiamo aggiornare questi termini di tanto in tanto. La data di 'ultimo aggiornamento' qui sotto mostra quando sono cambiati l'ultima volta."],
    ["Contatto", "Domande sulla condivisione o su questi termini? Scrivi a support@ridetune.app."],
  ],
  privacyPolicy: "Informativa sulla privacy",
};

export const legalDictionaries: Record<Locale, LegalDict> = { en, pt, es, fr, de, it };
