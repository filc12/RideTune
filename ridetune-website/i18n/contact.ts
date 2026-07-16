/**
 * Dicionário da página de contactos, 6 idiomas.
 * Consumido por components/ContactPage.tsx.
 */
import type { Locale } from "./dictionaries";

export type ContactDict = {
  back: string;
  title: string;
  subtitle: string;
  emailUs: string;
  emailHint: string;
  getApp: string;
  greeting: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  sentTitle: string;
  sentBody: string;
  error: string;
  notConfigured: string;
};

const en: ContactDict = {
  back: "← Back to RideTune",
  title: "Get in touch",
  subtitle: "Questions, suggestions or a bike you'd love to see added? We read every message.",
  emailUs: "Email us",
  emailHint: "Prefer email? Write to us directly.",
  getApp: "Get the app on Google Play",
  greeting: "Hi 👋 How can we help? Tell us below and we'll get back to you by email.",
  nameLabel: "Name (optional)",
  namePlaceholder: "Your name",
  emailLabel: "Your email",
  emailPlaceholder: "name@example.com",
  messageLabel: "Message",
  messagePlaceholder: "Write your message…",
  send: "Send message",
  sending: "Sending…",
  sentTitle: "Message sent!",
  sentBody: "Thanks for reaching out — we'll reply to your email soon.",
  error: "Something went wrong. Please try again, or email us directly.",
  notConfigured: "The contact form isn't set up yet. Please email us directly for now.",
};

const pt: ContactDict = {
  back: "← Voltar à RideTune",
  title: "Fala connosco",
  subtitle: "Dúvidas, sugestões ou uma moto que gostavas de ver adicionada? Lemos todas as mensagens.",
  emailUs: "Envia-nos email",
  emailHint: "Preferes email? Escreve-nos diretamente.",
  getApp: "Obter a app na Google Play",
  greeting: "Olá 👋 Em que podemos ajudar? Escreve abaixo e respondemos por email.",
  nameLabel: "Nome (opcional)",
  namePlaceholder: "O teu nome",
  emailLabel: "O teu email",
  emailPlaceholder: "nome@exemplo.com",
  messageLabel: "Mensagem",
  messagePlaceholder: "Escreve a tua mensagem…",
  send: "Enviar mensagem",
  sending: "A enviar…",
  sentTitle: "Mensagem enviada!",
  sentBody: "Obrigado pelo contacto — respondemos ao teu email em breve.",
  error: "Algo correu mal. Tenta de novo, ou escreve-nos diretamente por email.",
  notConfigured: "O formulário de contacto ainda não está configurado. Por agora, escreve-nos diretamente por email.",
};

const es: ContactDict = {
  back: "← Volver a RideTune",
  title: "Contáctanos",
  subtitle: "¿Dudas, sugerencias o una moto que te gustaría ver añadida? Leemos todos los mensajes.",
  emailUs: "Escríbenos",
  emailHint: "¿Prefieres el correo? Escríbenos directamente.",
  getApp: "Consigue la app en Google Play",
  greeting: "Hola 👋 ¿En qué podemos ayudarte? Escríbenos abajo y te responderemos por correo.",
  nameLabel: "Nombre (opcional)",
  namePlaceholder: "Tu nombre",
  emailLabel: "Tu correo",
  emailPlaceholder: "nombre@ejemplo.com",
  messageLabel: "Mensaje",
  messagePlaceholder: "Escribe tu mensaje…",
  send: "Enviar mensaje",
  sending: "Enviando…",
  sentTitle: "¡Mensaje enviado!",
  sentBody: "Gracias por escribirnos — te responderemos por correo pronto.",
  error: "Algo salió mal. Inténtalo de nuevo o escríbenos directamente por correo.",
  notConfigured: "El formulario de contacto aún no está configurado. Por ahora, escríbenos directamente por correo.",
};

const fr: ContactDict = {
  back: "← Retour à RideTune",
  title: "Contactez-nous",
  subtitle: "Des questions, des suggestions ou une moto que vous aimeriez voir ajoutée ? Nous lisons chaque message.",
  emailUs: "Écrivez-nous",
  emailHint: "Vous préférez l'e-mail ? Écrivez-nous directement.",
  getApp: "Obtenir l'app sur Google Play",
  greeting: "Bonjour 👋 Comment pouvons-nous aider ? Écrivez ci-dessous et nous vous répondrons par e-mail.",
  nameLabel: "Nom (facultatif)",
  namePlaceholder: "Votre nom",
  emailLabel: "Votre e-mail",
  emailPlaceholder: "nom@exemple.com",
  messageLabel: "Message",
  messagePlaceholder: "Écrivez votre message…",
  send: "Envoyer le message",
  sending: "Envoi…",
  sentTitle: "Message envoyé !",
  sentBody: "Merci de nous avoir écrit — nous répondrons à votre e-mail bientôt.",
  error: "Une erreur est survenue. Réessayez, ou écrivez-nous directement par e-mail.",
  notConfigured: "Le formulaire de contact n'est pas encore configuré. Pour l'instant, écrivez-nous directement par e-mail.",
};

const de: ContactDict = {
  back: "← Zurück zu RideTune",
  title: "Kontakt",
  subtitle: "Fragen, Vorschläge oder ein Motorrad, das du gern ergänzt sähest? Wir lesen jede Nachricht.",
  emailUs: "Schreib uns",
  emailHint: "Lieber per E-Mail? Schreib uns direkt.",
  getApp: "Hol dir die App bei Google Play",
  greeting: "Hallo 👋 Wie können wir helfen? Schreib es unten und wir melden uns per E-Mail.",
  nameLabel: "Name (optional)",
  namePlaceholder: "Dein Name",
  emailLabel: "Deine E-Mail",
  emailPlaceholder: "name@beispiel.com",
  messageLabel: "Nachricht",
  messagePlaceholder: "Schreib deine Nachricht…",
  send: "Nachricht senden",
  sending: "Senden…",
  sentTitle: "Nachricht gesendet!",
  sentBody: "Danke für deine Nachricht — wir antworten bald per E-Mail.",
  error: "Etwas ist schiefgelaufen. Bitte versuche es erneut oder schreib uns direkt per E-Mail.",
  notConfigured: "Das Kontaktformular ist noch nicht eingerichtet. Schreib uns vorerst bitte direkt per E-Mail.",
};

const it: ContactDict = {
  back: "← Torna a RideTune",
  title: "Contattaci",
  subtitle: "Domande, suggerimenti o una moto che vorresti vedere aggiunta? Leggiamo ogni messaggio.",
  emailUs: "Scrivici",
  emailHint: "Preferisci l'email? Scrivici direttamente.",
  getApp: "Scarica l'app su Google Play",
  greeting: "Ciao 👋 Come possiamo aiutarti? Scrivi qui sotto e ti risponderemo via email.",
  nameLabel: "Nome (facoltativo)",
  namePlaceholder: "Il tuo nome",
  emailLabel: "La tua email",
  emailPlaceholder: "nome@esempio.com",
  messageLabel: "Messaggio",
  messagePlaceholder: "Scrivi il tuo messaggio…",
  send: "Invia messaggio",
  sending: "Invio…",
  sentTitle: "Messaggio inviato!",
  sentBody: "Grazie per averci scritto — risponderemo presto alla tua email.",
  error: "Qualcosa è andato storto. Riprova, oppure scrivici direttamente via email.",
  notConfigured: "Il modulo di contatto non è ancora configurato. Per ora scrivici direttamente via email.",
};

export const contactDictionaries: Record<Locale, ContactDict> = { en, pt, es, fr, de, it };
