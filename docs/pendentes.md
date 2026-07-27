# Pendentes

Estado em 26/07/2026. O catálogo está em 114 motos e 65 perfis, com o Supabase
sincronizado com o código.

---

## Para o próximo build (não chegam aos utilizadores sem ele)

**Cache de dados OEM — 7 dias, sem forma de forçar.**
O `initOemData` em `src/services/oem-data.ts` aplica o cache e faz `return` se ele
tiver menos de 7 dias. Só passado esse tempo é que vai ao Supabase. A `refreshOemData`
existe mas **nada a chama** — é código morto.

Consequência: qualquer moto nova leva até uma semana a chegar a quem já tem a app.
Já deu um utilizador a queixar-se de não ver a XT1200Z.

Correção proposta:
1. Revalidar sempre em segundo plano — aplicar o cache de imediato para o arranque
   ser rápido, e ir buscar dados novos a seguir.
2. Baixar o TTL, com o ponto 1 a fazer o trabalho.
3. Ligar a `refreshOemData` a um botão nas definições.

Entretanto, quem não vir dados novos: limpar dados da app (não basta reinstalar — no
Android a cópia de segurança da Google restaura o cache).

**Não há `expo-updates` instalado.** Sem atualizações OTA, toda a correção de código
passa por build e loja. Vale a pena ponderar instalar — era a diferença entre corrigir
em minutos ou em dias.

---

## Catálogo

**5 motos ocultas**, à espera de manual do proprietário: CFMoto 1000 SR-R,
QJ SRT 600 SX, Voge 650 DSX, Voge 525 R, Voge R625.

**BMW R1200GS LC (2013-2018) não existe no catálogo.** Só temos R1250 e R1300. É
provavelmente a maior lacuna BMW, há muitas na estrada.

**Modelos QJ vendidos em Portugal que faltam:** SRT 700 ON, SRT 900 S, SRK 700,
SRV 550. Ver `qjmotor.pt`.

**Yamaha XT1200ZE** — a versão de suspensão eletrónica da XT1200Z. Seria perfil com
tudo `na`, como a BMW com ESA.

Vale a pena, a certa altura, comparar o catálogo com as gamas atuais dos importadores
portugueses em vez de ir moto a moto.

---

## Código

**`BikeAdjusters` não sabe representar afinadores combinados** — um parafuso que mexe
na compressão e na extensão ao mesmo tempo. Aparece em forquilhas baratas; ainda não
houve caso confirmado. Marcar `fComp` e `fReb` a true faria a app pedir dois números
para um só parafuso.

---

## Comunicação

**O material de divulgação promete "os valores exatos".** Verdade para as 54 motos com
perfil; para as outras é heurística por categoria. Convém suavizar — foi o tipo de
promessa que levou um utilizador a perguntar qual era a fonte das curvas de
amortecimento.

Resposta a essa pergunta, para reutilizar: não usamos curvas de amortecimento e não o
afirmamos. Isso são dados força/velocidade do fabricante da suspensão, não publicados.
Usamos as regulações de fábrica do manual do proprietário, e tabelas de carga onde o
fabricante as publica.

---

## Ideias guardadas

- [Suspensão modificada (pós-venda)](./ideia-suspensao-modificada.md) — decidido
  avançar só depois do lançamento iOS.
