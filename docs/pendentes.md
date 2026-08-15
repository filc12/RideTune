# Pendentes

Estado em 27/07/2026. O catálogo está em 114 motos e 65 perfis, com o Supabase
sincronizado com o código. A **1.1.5 (versionCode 22)** está em teste interno na
Play Store.

---

## Resolvido na 1.1.5

**Cache de dados OEM.** O `initOemData` aplicava o cache e fazia `return` se ele
tivesse menos de 7 dias, portanto nunca revalidava — uma moto nova levava até uma
semana a chegar a quem já tinha a app, e não havia forma de forçar. Agora aplica o
cache de imediato e revalida sempre em segundo plano, com um intervalo de 1 hora só
para não repetir o pedido em aberturas seguidas. A `refreshOemData`, que era código
morto, está ligada ao botão "Atualizar dados" nas definições.

**`expo-updates` instalado e configurado**, com `runtimeVersion` em `appVersion`.
A partir da 1.1.5 é possível corrigir JavaScript por OTA sem passar pela loja.
Atenção: como a política é `appVersion`, é preciso subir a versão no `app.json`
sempre que o nativo mude, senão pode empurrar-se um OTA incompativel.

**Canal OTA testado e a funcionar** (27/07/2026). Publicado com
`npx eas-cli update --channel production` a partir de `frontend/`, chegou ao
telemóvel ao fim de duas reaberturas completas — a primeira descarrega, a segunda
arranca já com o novo bundle.

Como confirmar qual o bundle em uso: a linha da versão nas Definições mostra
`v1.1.5 · OTA dd/mm` quando está a correr um update, e só `v1.1.5` quando está a
correr o que veio da Play Store. Serve para diagnóstico quando alguém reportar um
bug — diz que bundle é que o telemóvel dele tem.

**Armadilha do `appVersion`:** o update só chega a quem tem a versão nativa igual
à do `app.json` no momento da publicação. Se se subir a versão sem fazer build
nova, o OTA fica sem destinatários e não há erro nenhum a avisar.

Notas de ambiente, para não voltar a perder tempo:

- O projeto **não corre no Expo Go** (tem `react-native-purchases` e
  `@sentry/react-native`). É preciso development build.
- Os builds locais precisam de mais memória que a predefinição. Está em
  `~/.gradle/gradle.properties`: `org.gradle.jvmargs=-Xmx6g -XX:MaxMetaspaceSize=2g`.
  Sem isto, o `lintVitalAnalyzeRelease` rebenta com OutOfMemoryError: Metaspace.
- `eas build --local` não gasta a cota de builds da nuvem do plano gratuito.

---

## Catálogo

**Suzuki DR-Z4S (2025+) — fechada com o manual.** As duas dúvidas ficaram resolvidas:
a forquilha KYB **não tem precarga** (regula-se por pressão de ar, 0 kPa de fábrica) e a
precarga traseira **existe**, por anel roscado. A medida traseira é **120/80-18**, como
dizia a Suzuki — a transcrição de terceiros que dizia 120/90-18 estava errada.

Perfil `suzuki_drz4s_2025` criado com valores de fábrica reais e compressão traseira
separada em alta e baixa velocidade. Atenção ao reutilizar: o manual cobre a S e a SM
com valores diferentes, e os da SM não servem aqui.

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

**~~O material de divulgação promete "os valores exatos".~~ Corrigido.** Era verdade
para as 54 motos com perfil; para as outras é heurística por categoria. Passou a
"ponto de partida concreto ... a partir das regulações de fábrica do manual", nas
três línguas do `divulgacao-redes-v1.1.0.md`. Foi este tipo de promessa que levou um
utilizador a perguntar qual era a fonte das curvas de amortecimento.

Resposta a essa pergunta, para reutilizar: não usamos curvas de amortecimento e não o
afirmamos. Isso são dados força/velocidade do fabricante da suspensão, não publicados.
Usamos as regulações de fábrica do manual do proprietário, e tabelas de carga onde o
fabricante as publica.

---

## Ideias guardadas

- [Suspensão modificada (pós-venda)](./ideia-suspensao-modificada.md) — decidido
  avançar só depois do lançamento iOS.

---

## Website em telemovel — o que aprendemos

Quatro correcoes, todas a mesma causa: **um elemento em tamanho de desktop
que nao encolhe num ecra estreito**. Se aparecer outra pagina torta, e o
primeiro sitio a olhar.

- Cabecalho da /setups: menu sempre visivel, sem `hidden md:flex`
- Cartoes da /setups: `minmax(340px, 1fr)` nao cabe em 360px
- Tabela da pagina de moto: colunas `1fr` tem minimo em min-content
- Cabecalho da pagina principal: logotipo e botao em tamanho de desktop

Duas armadilhas que custaram tempo:

**Estilos inline ganham sempre ao Tailwind.** Um `style={{ display: "flex" }}`
anula um `className="hidden md:flex"`. Ao esconder algo, o `display` tem de
sair do inline.

**Elementos `position: fixed` nao aumentam o `scrollWidth` do documento.**
Cortam a vista mas nao deixam rasto mensuravel — uma analise automatica de
overflow nao os apanha. Foi por isso que dei a pagina principal como boa
quando estava cortada. Para cabecalhos fixos, ver com os olhos.

**Como medir sem telemovel:** forcar os tamanhos da versao mobile por
JavaScript e somar as larguras dos filhos do cabecalho. O alvo e caber em
360px, que e o telemovel Android mais estreito ainda comum.

---

## Pressões de pneus — o rótulo foi despromovido, falta verificar

**O que aconteceu.** Ao acrescentar a XT1200ZE reparei que o Supabase e o
codigo discordavam nas pressoes. A investigacao revelou pior: **101 das 107
motos no Supabase partilhavam apenas 6 combinacoes de valores, todas marcadas
`oem_manual`**. Um manual real nao produz isso.

Pior ainda, os dois lados discordam entre si e ambos discordam do manual:

| Africa Twin | frente solo | tras solo | tras carga |
|---|---|---|---|
| Manual Honda | 2,50 | 2,90 | 2,90 |
| Codigo | **2,00** | 2,50 | 2,90 |
| Supabase | 2,50 | 2,90 | **3,20** |

Verificado por pesquisa (mas ainda sem citacao de documento):
- **Yamaha Tenere 700**: 220/250 kPa. Tinhamos 2,3 a frente. Errado.
- **BMW R 1250 GS**: 2,5/2,9 **independentemente da carga**. Tinhamos 3,4 em
  carga. Inventado.
- **Honda Africa Twin**: 2,5/2,9. O nosso valor a solo esta certo no Supabase.
- **Ducati Multistrada V4**: fontes em conflito, nao verificavel.

**Padrao:** a coluna "em carga" e onde vive a invencao. Varios fabricantes dao
um so par de pressoes, sem distincao de carga. A tabela inventava sempre um
valor mais alto (3,2 / 3,4 / 2,8).

**O que foi feito.** So continua a afirmar `oem_manual` o que tem **citacao
concreta do documento** — o mesmo criterio que usamos na suspensao. Passaram de
106 para 3: Macbor Montana XR5 (manual PT, pag. 94) e as duas XT1200Z/ZE.
As restantes 104 estao `estimated_spec`, com a fonte marcada "— por confirmar".

**Os valores nao foram alterados**, so o rotulo. Continuam a ser o melhor
palpite; deixaram e' de ser apresentados como verdade verificada.

### O que a investigação de manuais já revelou (27/07)

**A BMW não publica as pressões no manual.** Confirmado no manual oficial da
R 1250 GS Adventure (`manuals.bmw-motorrad.com`, R_0M11_RM_0321_01.pdf): a lista
"debaixo do assento" inclui, no ponto 3, uma *Tyre pressures table* — um autocolante.
O texto do manual não contém um único valor em bar. Procurei por "bar", "kPa",
"2.5" e "2.9": zero ocorrências.

Consequência: **nenhuma BMW pode chegar a `oem_manual` por via do manual.** A única
fonte legítima é a foto do rótulo debaixo do assento. Isto também invalida a linha
que eu tinha escrito acima a dar a R 1250 GS como "verificada por pesquisa" — o que
encontrei foram sites de terceiros a repetir-se uns aos outros.

**Africa Twin: os dois lados estavam errados, e eu também.** O manual distingue
gerações, coisa que nenhum dos nossos conjuntos fazia:

| | frente | trás solo | trás 2 pessoas |
|---|---|---|---|
| CRF1000L (2016-2019) | 2,00 | 2,50 | 2,80 |
| CRF1100L (2020+) | 2,25 | 2,50 | 2,80 |
| *tínhamos no código* | 2,00 | 2,50 | 2,90 |
| *tínhamos no Supabase* | 2,50 | 2,90 | 3,20 |

O código tinha os valores da geração **anterior**; o Supabase não tinha os de
nenhuma. E a frente não muda com a carga — muda com o ano do modelo. Corrigido nos
dois lados para o CRF1100L (as nossas são 1084cc), incluindo a DCT, que não tinha
linha nenhuma. Fica em `estimated_spec` até eu conseguir citar a página: os PDF
oficiais da Honda são grandes demais para a ferramenta de leitura e a secção de
especificações fica sempre cortada.

**Lição de método:** um resumo de pesquisa não distingue gerações nem mercados. Foi
exatamente assim que a tabela original ganhou valores inventados. Só o documento
serve.

### Método que funciona (usar este)

O que falhou: procurar o PDF oficial. Os manuais têm 300-380 páginas e a
ferramenta de leitura corta a meio, sempre antes das especificações.

O que funciona: **`manualslib.com/manual/<id>/<Moto>.html?page=N`** devolve o texto
daquela página, com a tabela de pressões legível e o número de página para citar.
Procurar primeiro `manualslib <marca> <modelo> owner's manual tire pressure kPa`
para descobrir o N, depois ir buscar a página.

Verificadas assim (27/07), agora `oem_manual`:

| Moto | frente | trás solo | trás 2 pessoas | fonte |
|---|---|---|---|---|
| Ténéré 700 (2019-2024) | 2,20 | 2,50 | 2,50 | Manual de serviço 2020, pág. 82 |
| Tracer 9 | 2,50 | 2,90 | 2,90 | Manual MTT890D, pág. 85 |
| V-Strom 650 | 2,25 | 2,50 | **2,80** | Manual DL650A, pág. 92 |
| Tiger 900 / 900 GT | 2,50 | 2,90 | 2,90 | Manual Tiger 900 Series, pág. 189 |
| Tiger 900 Rally | **2,35** | 2,90 | 2,90 | Manual Tiger 900 Series, pág. 195 |
| V-Strom 800DE | 2,25 | 2,80 | 2,80 | Manual DL800DE, pág. 1-29 |
| Transalp XL750 | 2,25 | 2,50 | **2,80** | Etiqueta oficial Honda (webom) |
| Africa Twin (todas) | 2,25 | 2,50 | **2,80** | Etiqueta oficial Honda, MLN250 |
| 1290 Super Duke R | 2,50 | **2,50** | 2,90 | Manual KTM 3214331en, sec. 15.6 |
| YZF-R1 | 2,50 | 2,90 | 2,90 | Manual Yamaha B3L-28199-E0, pág. 7-20 |
| 890 Adventure | **2,40** | **2,90** | 2,90 | Manual KTM 3214267en, pág. 103 |
| 890 Adventure R | **2,40** | **2,90** | 2,90 | Manual KTM 3214269en, pág. 99 |
| 1290 Super Adventure S | 2,40 | **2,90** | 2,90 | Manual KTM 3214538en, sec. 15.7 |
| 1290 Super Adventure R | 2,40 | **2,90** | 2,90 | Manual KTM 3214297en, sec. 15.7 |
| 790 Adventure R | **2,40** | **2,90** | 2,90 | Manual KTM 3214533en |
| 690 SMC R | **2,30** | 2,50 | 2,50 | Manual KTM 3214530en, sec. 13.8 |
| 890 Duke R | **2,30** | **2,50** | **2,60** | Manual KTM 3214302en, pág. 78 |
| 790 Duke | 2,30 | 2,60 | 2,60 | Manual KTM 3213925en, pág. 72 |
| 790 Adventure | 2,40 → 2,60 | 2,40 → **2,90** | — | Manual KTM 3214950en, sec. 15.7 |
| 390 Adventure | **2,00** | **2,00** | **2,20** | Manual KTM 3214794en, sec. 15.7 |
| 390 Adventure R (2025) | 2,00 | 2,00 | 2,20 | Manual KTM 3240182en, sec. 15.7 |
| 390 Enduro R (2025) | 2,00 | 2,00 | 2,20 | Manual KTM 3240187en, sec. 14.7 |
| MT-09 | 2,50 | 2,90 | 2,90 | Manual Yamaha B7N-28199-E0 |
| MT-07 | **2,25** | **2,50** | — | Manual Yamaha 1WS-28199-E3, pág. 6-17 |
| XSR900 | 2,50 | 2,90 | 2,90 | Manual Yamaha BAE-28199-E0 |
| MT-10 | 2,50 | 2,90 | 2,90 | Manual Yamaha B67-28199-E0, pág. 7-19 |
| Ténéré 700 (2025+) | 2,20 | 2,50 | 2,50 | Manual Yamaha BRL-28199-70 (etiqueta) |
| YZF-R7 | **2,50** | **2,90** | 2,90 | Manual Yamaha BEB-28199-20, pág. 7-19 |
| Ténéré 700 World Raid | 2,20 | 2,50 | 2,50 | Manual Yamaha BXD-F819D-P0, pág. 7-19 |
| NT1100 | 2,50 | 2,90 | 2,90 | Etiqueta oficial Honda, MLF250 |
| X-ADV | **2,50** | **2,80** | 2,80 | Manual Honda 32MKT700 (2025) |
| CB650R | 2,50 | 2,90 | 2,90 | Manual Honda 32MKYH000 (2021) |
| CB1000R | 2,50 | 2,90 | 2,90 | Manual Honda CB1000RA, 32MKJ820 |
| CBR1000RR-R Fireblade | 2,50 | 2,90 | 2,90 | Manual Honda 2025, Specifications |
| NC750X | **2,50** | **2,90** | 2,90 | Etiqueta oficial Honda, MKW250 |

Correções que isto trouxe: a Ténéré tinha **2,25/2,50/2,90** — a frente errada e um
valor de carga inventado; o manual dá 220/250 iguais a solo e a dois, e **200/200
fora de estrada**, que não tínhamos. A V-Strom tinha a frente a variar com a carga,
quando não varia.

A T7 2025 e a World Raid ficaram com os valores corrigidos mas em
`estimated_spec` — são manuais diferentes e não li nenhum dos dois.

**Onde cada marca esconde os valores** (poupa uma leitura por moto):

- **Yamaha** — **`cdn2.yamaha-motor.eu/prod/owner-manuals/Motorcycles/P<código>E.PDF`**,
  com `<código>` a referência do manual sem hífenes (MT-09 = `B7N28199E0`, MT-07 =
  `1WS28199E3`, XSR900 = `BAE28199E0`, MT-10 = `B6728199E0`). O `28199` é fixo em
  todas as Yamaha, portanto o código sai de uma pesquisa por `<modelo> owner's manual
  28199`. Há uma segunda biblioteca oficial, `library.ymcapps.net/library/om/contents/`,
  que serve os modelos mais recentes — foi de lá que saiu a Ténéré 700 de 2025.
  PDF oficial da Yamaha, e a secção dos pneus fica dentro do
  alcance da leitura remota. Melhor que o ManualsLib: sem índice pelo meio.
- **Yamaha (alternativa)** — na secção "Tires" da manutenção, tabela «Cold tire air pressure»
  com 1 pessoa / 2 pessoas / off-road. A melhor documentada de todas.
- **Suzuki** — secção "Tire Pressure and Loading", tabela SOLO / DUAL RIDING.
- **Honda** — **usar `webom.hondamotopub.com`**. É o manual oficial em HTML,
  página a página, com a tabela da etiqueta «Tyre information & drive chain» em
  texto limpo. Resolve o problema dos PDF de 380 páginas que ficam sempre
  cortados. O caminho é `/webom/HMEE/<código>/html/index.html`; a etiqueta está
  em Vehicle Safety → Image Labels. Atenção que a Honda distingue geração.

  **Nem todos os modelos têm versão HTML.** A CB650R de 2024, por exemplo, só tem PDF
  no `hondamotopub` — a página do modelo mostra apenas "PDF Ver". Nesses casos o
  `webom` devolve a página de pesquisa em vez do manual, e é preciso o ficheiro.
  Códigos já descobertos: Transalp `MLC250` · Africa Twin `MLN250` · NC750X `MKW250` ·
  NT1100 `MLF250` · CB650R 2024 `MKY241` (só PDF).

  **Modelos fora da região europeia** (CB1000R, Fireblade) só existem em HPI ou nos
  EUA, e essas regiões não têm HTML nem PDF direto — só download com aceitação de
  termos. Resolvem-se com o ficheiro.

  **E os manuais americanos afinal servem, se se procurar no sítio certo:** na Fireblade
  a tabela não está na etiqueta, está na secção *Specifications* no fim, em psi primeiro.
  Procurar por `Tire air pressure` em vez de `kgf/cm`.

  **Cuidado com os manuais americanos** (`cdn.powersports.honda.com`): a extração de
  texto não devolve a tabela de pressões — nem em kPa nem em psi. Tentado no CB1000
  de 2025 e no CB1000R de 2024, sem resultado nos dois. Usar sempre os europeus.

  **Terceira via, a melhor de todas:** `2rom-prd-data.hondamotopub.com/om/HMEE/<MODELO>/
  <ano>/<ficheiro>.pdf` — o PDF direto, sem página de aceitação. Foi de lá que saiu o
  X-ADV. Encontra-se por pesquisa do nome do modelo com `hondamotopub` e `.pdf`.

  **Como encontrar o código do modelo:** procurar `hondamotopub.com/model/HMEE/<moto>`
  numa pesquisa. HMEE é a Europa. O código sai no URL (Transalp 2025 = MLC250,
  Africa Twin 2025 = MLN250). Depois é `webom.hondamotopub.com/webom/HMEE/<código>/html/`
  e a etiqueta está em `GMS005006` ou `GMS005007` — o número varia com o número de
  etiquetas do modelo, por isso convém abrir a primeira e seguir o índice.
- **Triumph** — a página "Tire Inflation Pressures" da manutenção **não tem
  valores**, só remete para a secção Specifications. Confirmado: no manual da
  Tiger 900 Series os valores estão na **pág. 189**, com as medidas dos pneus ao
  lado. Ir direto para lá; custou-me três leituras a descobrir.
  A Rally vem noutra página: o manual repete a secção Specifications por
  variante — pág. 189 para a 900/GT, pág. 195 para a Rally.
**Onde estão os manuais da KTM:** `ktmshop.se/bike-manuals/<AA>_<art>_en_OM.pdf`, com
`AA` o ano a dois dígitos. Descobre-se o número de artigo procurando
`ktmshop.se OWNER'S MANUAL <modelo> <ano> "Art. no."`. Já conhecidos:
890 Adventure 2021 `3214267en` · 890 Adventure R 2021 `3214269en` ·
890 Adventure 2022 `3214534en` · 890 Adventure R 2022 `3214536en` ·
890 Adventure R 2024 `3214932en` · 1290 Super Duke R 2021 `3214331en`.

**Limite confirmado, e como se contorna.** As 1290 Super Adventure não saem por leitura
remota: nos manuais de 2021 e 2022 o corte cai antes da secção das pressões (secção
15.7, pág. 140 no de 2022). Nas 890 deu porque o valor aparece cedo, no capítulo do
TPMS. **Com o PDF em disco resolve-se em segundos** — foi assim que ficaram as duas.

**Resultado da KTM: cinco motos lidas, cinco vezes 2,4 / 2,9.** 890 Adventure e R,
1290 Super Adventure S e R, 790 Adventure R. Rodas de 19 e de 21, pesos entre 190 e
250 kg, e a KTM dá o mesmo par a todas sem distinguir carga. A suspeita sobre as 790
confirmou-se na R.

**Porque é que umas KTM saem por leitura remota e outras não.** Não é o tamanho do
manual: é o **TPMS**. Nas motos com sensor de pressão, o valor aparece duas vezes — uma
no capítulo do quadro de instrumentos, a meio do manual, e outra na secção das rodas, no
fim. A leitura remota corta a meio, portanto só apanha a primeira. As motos **sem TPMS**
(390 Adventure, 790 Adventure base) só o têm no fim, e ficam fora de alcance.

Testado e confirmado em três: 390 Adventure 2023, 790 Adventure 2024 e 390 Adventure R
2025. Nenhuma dá nada por leitura remota; as três primeiras já foram feitas com o PDF
em disco.

**KTM: 13 de 14 verificadas.** Falta só a **1190 Adventure R** — modelo de 2013-2016,
e o arquivo do ktmshop só guarda de 2019 para cá. Procurar noutra via.

Nota: os manuais de 2025 mudaram de nomenclatura — passaram de `_OM.pdf` para `_BA.pdf`
e de "Art. no." para "Item no.". A pesquisa pelo formato antigo não os encontra.

**A KTM tem duas famílias, e agora sabe-se quais.** Nove motos lidas:

| família | frente | trás |
|---|---|---|
| Adventure grandes (890 ×2, 1290 SAdv ×2, 790 Adv R) | 2,4 | 2,9 |
| Naked e supermoto (690 SMC R, 890 Duke R, 790 Duke) | 2,3 | 2,5-2,6 |
| 1290 Super Duke R | 2,5 | 2,5 solo / 2,9 carga |

A 1290 Super Duke R não encaixa em nenhuma das duas — tem valor diferente a solo e em
carga. E a **790 Adventure base** também não: dá 2,4/2,4 a solo e com passageiro, e sobe
para **2,6/2,9** só com carga máxima — ao contrário da 790 Adventure **R**, que dá
2,4/2,9 sempre. Duas motos da mesma cilindrada e do mesmo ano, valores diferentes.

E a **390 Adventure** anda noutro mundo: **2,0/2,0** a solo. Tínhamos 2,3/2,5 — 0,5 bar
a mais atrás numa moto de 158 kg.

**Conclusão que fica:** na KTM não se extrapola nem por família, nem por cilindrada,
nem entre versões da mesma moto. Onze lidas, cinco combinações diferentes.

**E o padrão quebrou-se logo a seguir, como convinha.** A 690 SMC R dá **2,3 / 2,5**,
não 2,4 / 2,9. A KTM não tem um valor de casa: tem um valor por família. As grandes
partilham 2,4/2,9; a supermoto de um cilindro é outra coisa. Se eu tivesse aplicado o
padrão às restantes sem ler, tinha posto 0,4 bar a mais no traseiro de uma moto de 150 kg.

**Mesmo assim, não extrapolar.** Falta a 790 Adventure base (o manual de 2024,
`3214950en`, corta antes da secção) e as pequenas — 390 Adventure, 390 Enduro R,
690 SMC R. Uma 390 não tem por que levar a mesma pressão de uma 1290, e o padrão que
se confirmou é entre motos grandes da mesma família. As `3214950en`, `3214530en`
(690 SMC R 2022) e as 390 precisam do PDF em disco ou de outra via.

**Duas notas sobre a KTM, ganhas na 890 Adventure:**

- A KTM dá **um só par de valores** para solo, com passageiro e carga máxima. Não há
  coluna de carga — quem inventou a tabela original inventou-a aqui também.
- **O valor de fora de estrada não está onde eu esperava.** A página 103 não o traz, e
  a leitura corta antes da secção 15. Tirei os 1,8/1,8 que lá estavam em vez de os
  manter numa linha que passou a dizer "manual": não os li em lado nenhum.
  Fica por recuperar para as KTM de trilho.

- **KTM** — secção "Checking tire pressure" (15.6 no 1290 SDR), com solo e
  passageiro/carga máxima separados. Os PDF da KTM extraem-se sem espaços entre
  palavras, o que estraga a pesquisa por texto — procurar antes por `bar` ou `psi`.
- **BMW** — não publica. Só o autocolante debaixo do assento.

**Já há dois manuais na pasta de uploads** que resolveram duas motos sem uma única
pesquisa: o do 1290 Super Duke R e o da YZF-R1. Vale sempre a pena ver o que já lá
está antes de ir à internet.

**Códigos Honda já descobertos** (para não repetir a pesquisa):
Transalp 2025 `MLC250` · Africa Twin 2025 `MLN250` · NC750X 2025 `MKW250`.
Faltam: X-ADV, NT1100, CB1000R, CB650R, Fireblade.

**Custo real, medido:** cada moto Honda são 2 a 3 leituras — uma para achar o
código, uma ou duas para a etiqueta — e cada leitura traz o índice inteiro do
manual pelo meio. É por isso que isto não anda a 10 motos por sessão. Se houver
pressa, o caminho rápido continua a ser ter os PDF em disco.

### A base de dados arredondava (corrigido a 28/07)

As colunas de pressão no Supabase eram `numeric(3,1)` — **uma casa decimal**. Todos
os 2,25 que verifiquei contra manuais eram guardados como **2,3**. E como o Supabase
se sobrepõe ao código, era o 2,3 que chegava ao telemóvel.

Afetava 11 das 15 verificadas: Africa Twin (×3), Transalp (×3), as duas V-Strom, as
duas XT1200Z e a Tiger 900 Rally (2,35 → 2,4).

Corrigido para `numeric(4,2)` e os valores reescritos. **Ao acrescentar colunas
numéricas novas, verificar sempre a escala** — este erro é silencioso: não dá aviso,
não falha, só arredonda.

### Sobre listas geradas sem citação

Apareceu uma lista com as 96 motos "todas verificadas com citação oficial" que não
continha citação nenhuma. Recusada. Sinais que a denunciaram, úteis para a próxima:

- Dizia 2,75 atrás na Ténéré 700 a dois; o manual de serviço, pág. 82, diz 250 iguais
  a solo e a dois.
- Dava a BMW como verificada em manual, quando a BMW não publica pressões no manual.
- Juntava numa linha variantes com rodas diferentes (DesertX/Rally, Tiger 1200).
- Os mesmos pares repetiam-se dezenas de vezes — o padrão da tabela original.

Serve como lista de hipóteses. Não serve como fonte.

**Yamaha fechada: 12 de 12.** Primeira marca completa. Duas correções reais (MT-07 e
YZF-R7) e dez confirmações. A T7, a T7 2025 e a World Raid dão as três 220/250 — a
World Raid, apesar do depósito maior, não muda de pressão.

**Estado por marca** (verificadas / total): KTM 13/14 · **Yamaha 12/12** ·
**Honda 11/12** · Suzuki 4/7 · Triumph 2/7 · Macbor 1/1 · Ducati 0/11 · BMW 0/9 ·
QJ 0/9 · Voge 0/8 · CFMoto 0/8 · Kawasaki 0/6 · Aprilia 0/5 · Kove 0/4.

**Cuidado com os códigos de manual da Yamaha:** procurar "YZF-R7 owner's manual"
devolve `5FL-28199`, que é da R7 de **1998** (a OW-02, moto completamente diferente).
A de 2022, baseada na MT-07, é `BEB-28199-20`. Confirmar sempre o modelo na primeira
página do PDF antes de usar os valores.

### Ducati: duas entradas novas, e uma pista sobre as antigas

**Multistrada V4 RS e V4 Pikes Peak (2026)** acrescentadas, com pressões e suspensão do
manual PT: **2,5 bar à frente** (solo e plena carga), **2,5 → 2,9 atrás**. Suspensão
Öhlins Smart EC 2.0 semiativa — sem cliques, cinco modos no painel e quatro geometrias
de carga. Precarga da frente manual, a de trás elétrica.

**O que isto diz sobre as que já cá estavam.** Dois manuais Ducati independentes dão a
mesma estrutura: frente constante, traseiro a subir de 2,5 para 2,9. Nenhum usa 3,20.
Os **3,20 de carga que temos nas quatro Multistrada são quase de certeza invenção** —
mas não os mudo sem o manual dessas motos, porque a V4 e a V4 S levam roda de 19" à
frente e estas levam 17".

**Erro provável a confirmar:** a nossa V4 S tem pneu traseiro `190/55 ZR17`, que é a
medida do RS e da Pikes Peak. A V4 S de série leva 170/60 R17.

### Ducati: os manuais não saem por leitura remota

**O manualpdf.pt abre, mas não dá texto.** Não tem verificação anti-robô — a lista de
modelos lê-se bem e tem 207 manuais Ducati, muitos em português. Mas o manual em si é
mostrado **página a página como imagem**, com `?p=N`; a página não traz uma linha do
texto do manual. Serve para **encontrar e descarregar** o PDF certo, não para eu ler.

Bons candidatos que lá estão, em PT: Multistrada V4 (2023, 306 pág.), Multistrada V4 S
(2021/2022/2023/2024), Multistrada V2 (2025/2026), DesertX Rally (2025),
Streetfighter V4 (2023/2025), Panigale V4 (2022/2025), Monster (2026),
Hypermotard 950 (2025), Hypermotard 698 Mono (2026).

**O ownersmanuals2.com não serve para mim.** Tem verificação anti-robô ("Please wait…
Verifying…") em todas as páginas, incluindo as de modelo. Testado duas vezes, na Ténéré
e na Hypermotard 698. Abre bem num browser — portanto os links servem para **descarregar**,
não para eu ler diretamente.

Os manuais Ducati têm 400 a 430 páginas e as pressões vivem na secção *Technical data*,
no fim. A leitura corta muito antes — testado no Multistrada V4 RS de 2024. O índice
menciona "Tyre pressure" mas só como item do menu do painel, não como tabela.

Não há atalho tipo TPMS como na KTM: **as onze Ducati precisam do ficheiro em disco.**

**Como retomar.** Para cada moto: encontrar o manual do proprietario, ler a
tabela de pressoes, corrigir os valores se preciso, e so entao repor
`oem_manual` **com a citacao concreta** (documento, edicao, pagina). Comecar
pelas mais usadas. Nunca subir o rotulo com base num resumo de pesquisa — foi
assim que se chegou aqui.

## Ducati Multistrada V2 S Travel (2026) — manual lido, pág. 280-281

Terceiro manual Ducati lido, e o primeiro que traz uma coisa que nenhum outro
fabricante fez até agora: **a pressão depende do pneu montado**, não só da moto.

| Pneu | Frente (solo / carga) | Trás (solo / carga) |
|---|---|---|
| Pirelli Scorpion Trail II (série) | 2,4 / 2,4 | 2,5 / 2,9 |
| Pirelli Scorpion Rally STR (alternativa M+S) | 2,1 / 2,1 | 2,3 / 2,7 |

Medidas: 120/70 ZR19 à frente, 170/60 ZR17 atrás — as mesmas da Multistrada V2
de série. Guardámos os valores do Trail II, que é o pneu de origem, e o resto
ficou escrito na fonte da linha.

**Limitação do nosso modelo:** a tabela tem uma linha por moto, não por pneu.
Uma diferença de 0,3 bar à frente entre dois pneus homologados para a mesma moto
é grande de mais para se ignorar em silêncio. Se voltar a aparecer noutro
fabricante, a tabela precisa de uma coluna de pneu.

**Confirma o padrão Ducati pela terceira vez:** frente constante entre solo e
carga; trás sobe 0,4 bar. E pela terceira vez **não aparece nenhum 3,20** — os
3,20 que a tabela original tinha nas Multistrada são invenção.

A V2 de série ficou com estes valores mas continua `estimated_spec`: partilha
rodas e pneus com a S Travel, mas não li o manual dela.

## Aprilia — fonte encontrada, mas cara. E um aviso sobre motores de busca

**Descoberta útil:** no manualslib, os *instruction manuals* (manuais do proprietário)
servem o texto da página em HTML — dá para ler. Os *service station manuals* não:
são imagem. Isto inverte a nota antiga aqui do ficheiro, que dizia que o manualslib
era todo imagem. Era verdade para os manuais de oficina, não para os do proprietário.

Manual do proprietário da Tuareg 660: `manualslib.com/manual/3237661/Aprilia-Tuareg-660.html?page=N`

O custo é que cada página traz ~10 mil tokens de navegação à volta de meia dúzia de
linhas úteis. Só compensa quando já se sabe o número exato da página.

Índice do manual da Tuareg 660 (194 páginas):
- 110-113 — afinação do amortecedor traseiro (tabelas)
- 114-116 — afinação da forquilha (a tabela cai na 116, não na 115)
- 141 — pneus: SÓ AVISOS, sem um único número. As pressões estão em *Technical data*,
  páginas 175-176. Não repetir o erro de ir à página "Tyres" à procura de valores.

**Já lido e confirmado — amortecedor traseiro da Tuareg 660 (pág. 113):**

| | Só piloto | Com passageiro e/ou bagagem |
|---|---|---|
| Comprimento da mola (A) | 226,2 mm | 226,2 mm |
| Comprimento do amortecedor (B) | 399,5 mm | 399,5 mm |
| Pré-carga (manípulo 1) | fechar 10 cliques desde todo aberto | fechar 26 cliques |
| Compressão (parafuso 2) | abrir 2 voltas desde todo fechado | abrir 2 voltas |
| Extensão (regulador 3) | abrir 1,5 voltas desde todo fechado | abrir 1 volta |

Contam-se sempre a partir da posição mais dura (rotação completa no sentido horário).
Falta a tabela da frente (pág. 116) para o perfil ficar completo — não se cria meio perfil.

**AVISO, e é importante:** perguntei ao motor de busca pelos valores da FRENTE e ele
devolveu, com toda a confiança, os valores de TRÁS — os mesmos 10 cliques, 2 voltas,
1,5 voltas da tabela acima. Numa segunda pergunta inventou uns "6 mm, 8 cliques,
8 cliques" que não apareceram em documento nenhum que eu tenha aberto.
Resumo de motor de busca não é fonte. Só conta o que se lê na página do manual.

## Aprilia Tuareg 660 — FECHADA (manual do proprietário, Ed. 01_10/2021, cód. 2Q000498)

Manual completo em PDF, 194 páginas, texto extraível. Pneus e suspensão, tudo lá.

**Pressões (pág. 182-183) — e três coisas que contrariam padrões anteriores:**

| | Solo | Com passageiro | Fora de estrada |
|---|---|---|---|
| Frente 90/90-21 | 2,0 | 2,2 | 2,0 |
| Trás 150/70 R18 | 2,5 | 2,7 | 2,0 |

1. **A frente MUDA com a carga.** Em oito marcas lidas até aqui a frente era sempre
   constante. A Aprilia sobe 0,2 bar. O padrão não era regra, era coincidência de
   amostra — deixar de o usar como argumento.
2. **É a segunda fonte com pressões de todo-o-terreno**, depois do manual de oficina
   da Ténéré 700. E aqui é o manual normal, não o de oficina.
3. **O que lá tínhamos estava errado e do lado perigoso:** 2,2/2,4 na estrada, e
   1,5/1,6 fora de estrada. A Aprilia manda 2,0 nas duas rodas fora de estrada e
   avisa em maiúsculas que andar abaixo do prescrito é fortemente desaconselhado e
   pode danificar jantes e moto. Estávamos 0,4-0,5 bar abaixo do que o fabricante manda.

**Perfil de suspensão (pág. 113 e 116)** — perfil `aprilia_tuareg660_2021`, duas cargas:

| | Solo | Com passageiro e/ou bagagem |
|---|---|---|
| Pré-carga frente | desapertar 6 mm | desapertar 7 mm |
| Compressão frente | 8 cliques desde todo fechado | igual |
| Extensão frente | 8 cliques desde todo fechado | igual |
| Pré-carga trás | fechar 10 cliques desde todo aberto | 26 cliques |
| Compressão trás | 2 voltas desde todo fechado | igual |
| Extensão trás | 1,5 voltas | 1 volta |

Só a pré-carga e a extensão de trás mudam com a carga. A compressão fica igual nas duas.
Saliência das bengalas: 1 entalhe acima da mesa superior (excluindo a tampa).

Nota de método: os valores da frente que o motor de busca me tinha dado (6 mm, 8, 8)
acabaram por bater certo — mas isso foi sorte, porque na pergunta anterior o mesmo
motor tinha-me dado os valores de trás como se fossem da frente. Continua a valer:
só entra o que se lê no documento.

## Aprilia FECHADA — 5 de 5 (RS 660, Tuono 660, RSV4 1100, Tuono V4, Tuareg 660)

Quatro manuais do proprietário lidos em PDF, todos texto extraível.

| Moto | Frente | Trás | Manual |
|---|---|---|---|
| RS 660 | 2,5 / 2,5 | 2,8 / 2,8 | Ed. 03_11/2020, cód. 2Q000420, pág. 186 |
| Tuono 660 | 2,5 / 2,5 | 2,8 / 2,8 | Ed. 01_01/2021, cód. 2Q000426, pág. 188 |
| RSV4 1100 | 2,3 / 2,5 | 2,5 / 2,8 | Ed. 02_03/2021, cód. 2Q000439, pág. 200-201 |
| Tuono V4 1100 | 2,3 / 2,5 | 2,5 / 2,8 | Ed. 03_03/2015, pág. 150-151 |

Tínhamos 2,5/2,9 nas quatro, sem valores de carga. Os 2,9 atrás não existem em
manual nenhum. As desportivas de 1100 estavam 0,2 bar acima à frente.

**A frente volta a mudar com a carga nas 1100 (2,3 → 2,5), e não muda nas 660.**
Dentro da mesma marca, no mesmo ano. Confirma que não há regra transversal: lê-se
moto a moto.

**Tamanhos:** o manual das 1100 dá a mesma pressão para 190/50, 190/55 e 200/55 ZR17,
sendo que a de 200/55 só é permitida com Pirelli Diablo Supercorsa SP. Mantivemos
200/55 no catálogo, que é medida listada, e a alternativa ficou escrita na fonte.
As 660 admitem 180/55 ou 180/60 atrás, mesma pressão.

**Perfis novos** (afinação de estrada; a de pista fica de fora de propósito):
- `aprilia_rs660_2020` e `aprilia_tuono660_2021` — iguais. Frente: extensão 18 cliques,
  pré-carga toda desapertada, SEM compressão. Trás: extensão 5 cliques, SEM compressão,
  pré-carga por comprimento de mola (145,5 mm ± 2). Confirma os `adjusters` que já
  lá estavam com fComp/rComp a false — foi das poucas vezes que uma suposição antiga
  passou no teste do manual.
- `aprilia_rsv4_1100_2021` — frente: pré-carga 5 voltas a apertar desde toda aberta,
  compressão 6 cliques, extensão 10. Trás: compressão 2 voltas, extensão 20 cliques,
  pré-carga por mola a 148 mm. Amortecedor Sachs, versão sem ASC.

**Por fazer:** a Tuono V4 1100 (manual de 2015) tem as pressões mas a tabela de
afinação não apareceu na varredura das páginas 90-150. Fica sem perfil até se
localizar a página certa.

### Tuono V4 — perfil feito, com uma ressalva de hardware

A tabela estava nas páginas 80 e 85, fora do intervalo que eu tinha varrido.

O manual traz DUAS versões com números diferentes, e a nossa entrada de catálogo
é só "Tuono V4", sem distinguir:

| | RR (Sachs) | Factory (Öhlins) |
|---|---|---|
| Extensão frente | 10 cliques | 10 cliques |
| Compressão frente | 10 cliques | 15 cliques |
| Pré-carga frente | 5 voltas a apertar | 10 voltas |
| Extensão trás | 13 cliques | 17 cliques |
| Compressão trás | 2 cliques | 15 cliques |
| Mola trás | 148,5 mm | 148 mm, 303 entre centros |

Guardámos a **RR**, que é a base da gama, e os valores da Factory ficaram escritos
nas notas do perfil para quem tiver essa. A compressão traseira é o caso extremo:
2 cliques na RR contra 15 na Factory. Dar os números de uma a quem tem a outra
seria pior do que não dar nada.

**Regra que passa a valer para toda a marca:** a Aprilia publica sempre duas
afinações, estrada e pista, e proíbe expressamente a de pista fora de competição
autorizada. Só entra a de estrada. Isto vale para a RSV4, a Tuono V4 e as 660.

## Triumph — Tiger 1200 e Street Triple RS confirmadas

Dois Owner's Handbooks lidos. Os valores estão sempre na secção *Specifications*,
no fim, em tabela com uma coluna por variante.

**Tiger 1200 (pág. 211)** — o manual cobre quatro versões, em duas colunas:

| | GT Pro / GT Explorer | Rally Pro / Rally Explorer |
|---|---|---|
| Pneu frente | 120/70 R19 | 90/90-21 |
| Frente | 2,2 bar | **2,3 bar** |
| Trás | 2,9 bar | 2,9 bar |

A nossa é a Rally Pro, logo 2,3 — tínhamos 2,2, que é o valor da GT. Outra vez o
mesmo erro da Tiger 900: apanhar a coluna da variante errada. A roda dianteira
diferente (19" contra 21") vale 0,1 bar.

**Street Triple (pág. 232)**: 2,34 à frente e 2,9 atrás. Tínhamos 2,35. O manual
escreve «2.34 bar (34 lb/in²)» — a conversão dos 34 psi. As versões S, R e RS
levam todas exatamente o mesmo.

**Tiraram-se as pressões de todo-o-terreno da Tiger 1200** (tínhamos 1,6/1,8).
A Triumph não publica valores de fora de estrada em lado nenhum do manual; o que
diz é o contrário — que pressões reduzidas para fora de estrada prejudicam a
estabilidade na estrada, e que se deve usar sempre o valor da secção Specifications
para uso em estrada. Os 1,6/1,8 não vieram de lá.

**Padrão Triumph confirmado nos dois manuais:** um único valor por eixo, sem
distinção entre solo e com carga. Já são quatro manuais Triumph com este formato.

**A rever quando houver oportunidade:** a Tiger 900 Rally está com 2,35 e a Street
Triple com 2,34. Se as duas vierem dos mesmos 34 psi, uma delas está mal
transcrita. Não mexo sem reabrir o manual da Tiger 900.

### Triumph — Scrambler 1200 e Tiger Sport 660

**Scrambler 1200 XE (manual espanhol X/XE, pág. 236):** 2,5 / 2,9, com 90/90-21 54H
à frente e 150/70 R17 69V atrás. Era a única moto do catálogo **sem medidas de pneu
nenhumas** — tinha lá 2,2/2,5→2,9 e dois campos de todo-o-terreno (1,6/1,8) que a
Triumph não publica em manual nenhum. Estava tudo inventado, incluindo a ideia de
que a traseira variava com a carga. As versões X e XE levam exatamente o mesmo.

**Tiger Sport 660 (manual Trident/Tiger Sport 2023, pág. 168):** 2,3 / **2,5**.
Tínhamos 2,5/2,9 — a traseira estava **0,4 bar acima**, das maiores diferenças
encontradas até agora.

E este manual dá o melhor exemplo de por que é que não se pode copiar entre motos
parecidas: **a Trident e a Tiger Sport 660 partilham motor, quadro e exatamente os
mesmos pneus (120/70 ZR17 e 180/55 ZR17), e têm pressões diferentes** — 2,34/2,9
contra 2,3/2,5. Mesma coluna, mesma página, valores distintos. Quem preenchesse a
Tiger Sport por semelhança com a Trident errava 0,4 bar atrás.

Triumph: 6 de 7 verificadas. Falta a Speed Triple 1200 RS.

### Triumph FECHADA — 7 de 7

**Speed Triple 1200 RS (pág. 195):** 2,34 / 2,9, com 120/70 R17 e 190/55 R17.
Tínhamos 2,5 à frente. As versões RR e RS levam exatamente o mesmo.

Quadro final da marca:

| Moto | Frente | Trás |
|---|---|---|
| Tiger 1200 Rally Pro | 2,3 | 2,9 |
| Tiger 900 Rally Pro | 2,35 (a rever) | 2,9 |
| Tiger 900 GT | 2,5 | 2,9 |
| Tiger Sport 660 | 2,3 | 2,5 |
| Street Triple RS | 2,34 | 2,9 |
| Speed Triple 1200 RS | 2,34 | 2,9 |
| Scrambler 1200 XE | 2,5 | 2,9 |

**Nota de leitura destes manuais:** o `pdfplumber` não encontrou a tabela de pneus
da Speed Triple à primeira porque a busca por `ZR17` falhou — este manual escreve
`120/70 R17`, sem o Z. Procurar sempre por `Tyre Pressures`, que é constante em
todos os Owner's Handbooks, e nunca pela medida do pneu.

**Fica a rever, e agora com mais razão:** a Tiger 900 Rally está com 2,35. Quatro
manuais Triumph diferentes escrevem `2.34 bar (34 lb/in²)` — nenhum escreve 2,35.
É quase certo que os 2,35 são um erro meu de transcrição, mas não mexo sem reabrir
o manual da Tiger 900. Se aparecer, é a primeira coisa a confirmar.

### Triumph: os Owner's Handbooks NÃO trazem afinações de fábrica da suspensão

Varri o manual da Street Triple (255 páginas) à procura de `clicks from`,
`turns from`, `standard setting`, `preload` com números — zero resultados. O
capítulo *Maintenance and Adjustment* trata de embraiagem, corrente, travões e
rolamentos, e sobre suspensão só diz «verificar se há fugas e se opera suavemente».

O manual chega a listar o **afinador da forquilha no jogo de ferramentas** da R e
da RS, mas nunca diz em que posição vem de fábrica.

Conclusão prática, para não se repetir o trabalho: **na Triumph, o manual do
proprietário serve para pressões de pneus e mais nada.** As afinações de fábrica
da suspensão estão no manual de oficina. Isto é o oposto da Aprilia, onde o manual
normal traz as tabelas completas por carga.

Por isso as 6 Triumph sem perfil MFZ continuam sem ele, e não vale a pena pedir
mais Owner's Handbooks para esse fim. A única com perfil, a Tiger 1200, tem-no
porque é semiativa e o ajuste faz-se por menu.

### Manuais de oficina Triumph — o que se aprendeu (e o que NÃO está lá)

Três manuais de oficina lidos: Speed Triple RS, Tiger 1200 XCX e Tiger Sport 660.

**Nenhum traz afinações de fábrica da suspensão em cliques.** Nem o manual do
proprietário nem o de oficina. O que o de oficina dá é óleo da forquilha, cursos,
binários e a saliência das bengalas («groove 5 mm abaixo da mesa superior»).
A Triumph, ao contrário da Aprilia e da KTM, simplesmente não publica os valores
de fábrica dos afinadores. As 6 Triumph continuam sem perfil MFZ, e agora sabemos
que não é por falta do documento certo — é porque o número não existe em documento
nenhum ao público.

**Dois deles são de gerações diferentes das nossas motos:**
- «Service Manual - Speed Triple RS» é a **1050** (corrente RK 530, depósito 15,1 L,
  vela CR9EIA-9), não a 1200 RS que temos. Não se aplicou nada.
- «Tiger_1200_XCX» é a antiga Explorer de 1215cc, não a Tiger 1200 de 1160cc.

**A descoberta que interessa: a Triumph pensa em psi, e converte para bar de forma
inconsistente entre documentos.**

| Documento | Frente | Trás |
|---|---|---|
| Owner's Handbook Tiger Sport 660 | 2,3 bar (33 psi) | 2,5 bar (36 psi) |
| Manual de oficina Tiger Sport 660 | **2,27** bar (33 psi) | **2,48** bar (36 psi) |

São os mesmos 33 e 36 psi, arredondados de maneira diferente. O mesmo se passa com
os 34 psi: o manual de oficina da Speed Triple 1050 escreve **2,35 bar (34 lb/in²)**
e os Owner's Handbooks de 2023 escrevem **2,34 bar (34 lb/in²)**.

**Isto ilibou os 2,35 da Tiger 900 Rally.** Eu tinha-os marcado como provável erro
meu de transcrição, porque quatro manuais diziam 2,34. Não era erro: a Triumph
escreve as duas coisas. Fica como está.

Guardámos sempre os valores do manual do proprietário, que é o que o condutor lê.
A diferença entre 2,27 e 2,3 está abaixo da resolução de qualquer manómetro de
bomba, mas a proveniência ficou escrita na fonte da linha.

## Kawasaki — primeira verificada, e uma fonte nova que funciona

**FONTE NOVA: `manualowl.com`.** Ao contrário do manualslib (que só serve texto nos
manuais do proprietário) e do ownersmanuals2 (que tem verificação anti-robô e não
deixa ler), o manualowl entrega **o texto integral da página** num único pedido:

`manualowl.com/am/Kawasaki/<ANO>-<MODELO>/Manual/<id>?page=N`

O índice completo vem na mesma resposta, com o número de página de cada capítulo —
ou seja, um pedido dá a página E o mapa para as seguintes. Para a Kawasaki, a
tabela está sempre no capítulo *Wheels*, dentro de *Maintenance and Adjustment*.

**Versys 650 (manual 2015, pág. 136) — VERIFICADA:**

| Carga total | Frente | Trás |
|---|---|---|
| até 150 kg | 225 kPa (2,25) | 250 kPa (2,50) |
| 150 a 210 kg | 225 kPa (2,25) | 290 kPa (2,90) |

Tínhamos 2,25 à frente (certo, por sorte) e **2,9 atrás sem distinção de carga** —
ou seja, o valor de carga máxima aplicado a quem anda sozinho. 0,4 bar a mais.

**O formato Kawasaki é diferente de tudo o que vimos:** a tabela não é «solo» e
«com passageiro», é por **carga total em quilos**, com o corte aos 150 kg. Isso
encaixa melhor no nosso modelo do que o formato Ducati ou Triumph, porque a app
já raciocina por peso. A frente é constante, como na maioria.

Os 2,25 bar são também a prova viva de que a correção do `numeric(3,1)` para
`numeric(4,2)` no Supabase valeu a pena: antes, este valor teria sido gravado 2,3.

### Kawasaki: até onde dá para ir sem manuais teus — e onde bate na parede

**A parede:** o manualowl só tem Kawasaki até ~2015. Não tem Z900 (2017+), Z H2
(2020+) nem Ninja 1000SX (2020+). No manualslib só existe o manual de *montagem*
da Z900, que não traz pressões. Os manuais atuais da Kawasaki estão atrás do
Owner Center, que pede modelo e ano e não é acessível por fetch.

Para as pesquisas: o motor de busca devolveu 2,5/2,9 para a Z900 citando o
tyreplex e fóruns. **Não entra** — é o mesmo tipo de fonte de onde vieram os
valores errados que temos andado a corrigir.

**Versys 1000 (manual LT de 2015, pág. 149):** 250 kPa à frente, 290 atrás,
**valor único, sem tabela por carga**. Bate certo com o que já tínhamos.
Fica `estimated_spec` porque a nossa entrada é a SE de 2019+, outra geração —
mas a fonte da linha passou a nomear um documento real em vez de «por confirmar».

**Descoberta sobre a marca:** a Kawasaki não usa um formato só. A Versys 650 traz
tabela por carga total (corte aos 150 kg); a Versys 1000 traz um valor único.
Não se pode assumir o formato de uma a partir da outra.

**Faltam 5 e só se fecham com os manuais atuais:** Ninja 1000SX, Versys 1000 SE,
Z900, Z H2 e ZX-10R. Vêm do *Owner Center* da Kawasaki, escolhendo modelo e ano.

## Ducati DesertX — o manual mais completo lido até hoje

Manual do proprietário DesertX (EN, ed. 25 ED02), 300 páginas. Traz tudo:
pressões nas quatro combinações E tabelas de suspensão por carga e por tipo de uso.

**Pressões (pág. 278-279):**

| | Estrada solo | Estrada c/ passageiro | Fora de estrada solo | Fora de estrada c/ carga |
|---|---|---|---|---|
| Frente 90/90-21 | 2,0 | 2,2 | 1,8 | 2,0 |
| Trás 150/70 R18 | 2,2 | 2,5 | 1,8 | 2,2 |

Tínhamos 2,2/2,4 e fora de estrada 1,5/1,6. **A frente estava 0,2 acima e o
fora de estrada 0,3 abaixo do que a Ducati manda.**

É o **terceiro fabricante** a publicar pressões de todo-o-terreno, depois do manual
de oficina da Ténéré 700 e do manual da Tuareg 660. E é o primeiro a dar
todo-o-terreno *com carga*, o que dá as quatro combinações completas.

**Perfil `ducati_desertx_kayaba` (pág. 57-60), com três pontos de carga:**

| | Só piloto | Piloto + malas | Piloto + passageiro |
|---|---|---|---|
| Frente (retorno/comp/pré-carga) | 2 / 2 / 2 voltas | igual | igual |
| Trás retorno | 1,75 voltas | 1,75 | 1,5 |
| Trás compressão | 3 voltas | 2,5 | 2 |
| Trás pré-carga | 6 cliques | 17 | 26 |

**A frente não muda com a carga — só o amortecedor muda.** O manual traz ainda
afinações por tipo de uso (Off Road Standard e Off Road Sport), que ficaram nas
notas do perfil.

**Problema de catálogo que isto destapou:** o id `ducati-desertx` está rotulado
«DesertX V2 (2026+)», 890cc, e não tínhamos a DesertX de 937 (2022-2025), que é a
que quase toda a gente tem. Criou-se `ducati-desertx-937` com os valores
verificados. A V2 e a Rally ficam `estimated_spec` com os mesmos números e a fonte
a dizer porquê: partilham as medidas de pneu mas não são a mesma moto.

## Kawasaki: os manuais de oficina fecham a Z900 e destapam outra moto

Chegaram dois PDFs que resolvem o impasse do *Owner Center*: **manuais de oficina**,
não de proprietário. Servem igual — a pressão está no capítulo 2 (Periodic
Maintenance) e as afinações de suspensão no capítulo 13.

**Nota prática:** o da Z900 vem digitalizado, sem camada de texto. Foi preciso OCR
página a página e confirmar as frações à lupa em 300 dpi. O da Ninja tinha texto e
leu-se direto. Se aparecerem mais manuais Kawasaki, contar com esta diferença.

### Z900 — confirmada, e ganhou perfil de suspensão

Manual `99924-1525-31`, cobre ZR900AH e ZR900BH de **2017**.

Pressões (pág. 2-11 e 2-38): **250 kPa à frente e 290 kPa atrás**, a frio, carga
total até **180 kg**. Valor único. Era o que já tínhamos, agora com fonte —
`estimated_spec` passa a `oem_manual`. As medidas (120/70ZR17 e 180/55ZR17, pág.
1-11) também batem certo, e estavam a `null` no código.

Perfil novo `kawasaki_z900_2017` (pág. 13-6), a primeira suspensão Kawasaki com
números reais no catálogo:

| | Frente | Trás |
|---|---|---|
| Retorno | 7 cliques de 12, desde o mais duro | 1 1/4 voltas de 1 4/5, desde o mais duro |
| Pré-carga | 8 voltas de 30, a apertar desde solta | mola a **199,6 mm** (margem 190,5–200,5) |
| Compressão | não existe | não existe |

**A pré-carga traseira não se conta em cliques nem voltas:** mede-se o comprimento
da mola já montada. Ficou como `pos` com a célula a mostrar `199,6 mm`.

### Ninja 1000: o manual é de outra moto que não tínhamos

Manual `99924-1519-02` (2.ª ed., Jul. 2017), cobre **ZX1000WH (2017) e ZX1000WJ
(2018)** — a Ninja 1000 / Z1000SX. O traseiro é **190/50ZR17** (pág. 10-5). A nossa
`kawasaki-1000sx` tem 190/55, ou seja, é a Ninja 1000SX de 2020 em diante. **São
motos diferentes** — mesmo caso da DesertX.

Criada `kawasaki-1000-2017`, «Ninja 1000 / Z1000SX (2017-2019)», com tudo
verificado: 250/290 kPa até 195 kg, e perfil `kawasaki_ninja1000_2017` —

| | Frente | Trás |
|---|---|---|
| Retorno | 2 3/4 voltas de 3 1/2 | 2 1/2 voltas de 2 1/2 |
| Compressão | 1 3/4 voltas de 3 | não existe |
| Pré-carga | 5 voltas de 15, a apertar | 8 cliques de 40 |

**A compressão da frente existe só na bengala DIREITA.** Os `adjusters` que já lá
estavam na SX (`fComp: true`, `rComp: false`) batem certo com o manual — a estrutura
estava bem, faltavam os números.

Exceção registada nas notas: nas ZX1000WJ *early* do mercado brasileiro o retorno
traseiro são 2 voltas em vez de 2 1/2.

**Fica em aberto:** os 3,20 bar de trás com carga na SX 2020+ que estavam no
Supabase. Nenhum manual Kawasaki publica valor traseiro com passageiro nestes
modelos — o número ficou como estava, mas com a razão da dúvida escrita na fonte.

**Faltam 3 Kawasaki:** Ninja 1000SX (2020+), Z H2 e ZX-10R.

## Ducati: cinco manuais de uma vez, e a Panigale estava 0,8 bar errada

Cinco manuais do proprietário em PDF com texto — Hypermotard 698 Mono, Streetfighter
V4, Panigale V4, Multistrada V4 Rally e Multistrada V2. Todas fechadas, pressões e
suspensão.

### O erro que mais interessa: as desportivas a solo

Tínhamos 2,5/2,9 na Panigale e na Streetfighter. São os valores **com passageiro e
malas**. A solo a Ducati manda outra coisa, e no eixo traseiro a diferença é enorme:

| | Frente solo | Trás solo | Frente c/ carga | Trás c/ carga |
|---|---|---|---|---|
| Panigale V4 | 2,3 | **2,1** | 2,5 | 2,9 |
| Streetfighter V4 | 2,3 | **2,5** | 2,4 | 2,9 |
| Hypermotard 698 | 2,5 | **2,5** | 2,5 | 2,9 |

**A Panigale estava 0,8 bar acima atrás** — o maior desvio que apanhámos até hoje.

Isto derruba a regra que tínhamos escrito, de que a Ducati faz «frente constante e
trás 2,5 → 2,9». Isso é verdade nas Multistrada; nas desportivas a frente também
varia e o traseiro a solo desce muito. **Não extrapolar entre famílias.**

As duas desportivas dão ainda pressões de pista (Panigale 2,3/1,8; Streetfighter
2,3/2,1, com o pneu quente). Ficaram no texto da fonte: a coluna que temos é de
todo-o-terreno, e usá-la para pista seria mentira.

### Multistrada: três pneus, três tabelas

A V4 Rally homologa Scorpion Trail II, Scorpion Rally e Scorpion Rally Street, cada
um com a sua pressão:

| Pneu | Frente solo/carga | Trás solo/carga |
|---|---|---|
| Trail II (série) | 2,4 / 2,4 | 2,5 / 2,9 |
| Rally (tacos) | 1,6 / 1,8 | 1,6 / 2,2 |
| Rally Street | 2,1 / 2,1 | 2,2 / 2,7 |

As colunas de todo-o-terreno levam os 1,6/1,6 do Scorpion Rally, **com a ressalva
escrita na fonte de que só valem se a moto calçar mesmo o pneu de tacos**. Com os
Trail II de série não se desce a 1,6. Tínhamos 2,5/2,9/3,2 e fora de estrada 1,5/1,8.

A V2 confirmou ao valor os números que lhe tínhamos emprestado do manual da V2 S
Travel: 2,4/2,4 e 2,5/2,9. Passa de `estimated_spec` a `oem_manual` sem mudar um
algarismo — a primeira vez que um empréstimo entre modelos se confirma.

### Suspensão: cinco perfis novos

`ducati_hyper698_marzocchi`, `ducati_multi_v2_marzocchi`, `ducati_panigale_v4_showa`,
`ducati_sf_v4_showa` e `ducati_multi_v4_rally_dss`.

**O Hypermotard 698 trouxe uma coisa que nenhum manual tinha dito até agora: para
que piloto é que os valores foram calculados.** «Dressed rider weighing 80-90 kg».
Todos os outros perfis assumem 75 kg porque nunca ninguém disse. Este ficou a **85**,
e tem tabela por uso — Road Comfort (a de série), Road Sport, Track e Road com
passageiro, que é o segundo ponto de carga.

Padrão Ducati que se repete e vale a pena guardar: **os reguladores da frente estão
repartidos por bengala**. No Hypermotard e na Multistrada V2, compressão só na
esquerda e retorno só na direita; a pré-carga está nas duas e tem de ficar igual.
Já tínhamos visto isto na Kawasaki Ninja 1000, mas lá só a compressão é que era de
uma bengala.

A pré-carga traseira nas desportivas mede-se em **milímetros** desde a mola toda
solta (Panigale 8 mm, Streetfighter 11 mm), não em cliques nem voltas — é o tipo
`mm`, que já existia para as KTM EXC e a T7.

A V4 Rally é DSS eletrónico como a V4 S: tudo no painel, exceto a pré-carga da mola
da frente, que é mecânica (5 voltas, margem 5 a 20 mm) e o manual pede que seja feita
em concessionário.

## Auditoria da suspensão, e um guarda para não voltar a acontecer

Depois de apanhar 49 pressões desfasadas entre o bundle local e o Supabase, faltava
fazer a mesma pergunta à suspensão. **Está boa:** 85 perfis dos dois lados, com as
mesmas afinações valor a valor.

A única divergência eram **três acentos**: o Supabase tinha «Tenere 700» e o código
«Ténéré 700», nos perfis `yamaha_t700_2019`, `yamaha_t700_2025` e
`yamaha_t700_world_raid_2026`. Corrigido na base.

Ou seja, o desfasamento das pressões não era um padrão — foi um caso isolado, de
edições feitas na base que nunca voltaram ao ficheiro.

### `npm run verificar-sync`

Script novo em `frontend/scripts/verificar-sync.ts`. Vai buscar as duas tabelas ao
Supabase e compara-as com o `tirePressure.ts` e o `mfzSuspensionData.ts`, campo a
campo. Diz exatamente o que difere:

```
✗ Pressões: 1 de 119 com diferenças
  yamaha-r1
      medidaTras: código=190/55 ZR17  base=200/55 ZR17
```

Sai com código 1 se houver diferenças, para poder entrar num hook de pre-push ou em
CI. Lê as credenciais do ambiente ou do `frontend/.env.local`.

O cuidado que o script tem de ter, e tem: **o Postgres devolve os numéricos como
string** («2.50») e o TypeScript tem-nos como número (2.5). Sem normalizar as duas
pontas para o mesmo formato, dava 119 falsos positivos. As pré-cargas comparam-se
por valor *e* por tipo de contagem, senão trocar `cl_hard` por `cl_soft` passava
despercebido — e essa troca inverte o sentido da afinação.

### Um ponto por esclarecer nas Ténéré

Não é desfasamento (código e base concordam), mas as duas entradas não concordam
entre si: a `yamaha_t700_2025` conta a compressão e a extensão de trás em `cl_hard`,
e a `yamaha_t700_world_raid_2026` conta as mesmas em `cl_soft`. É o mesmo
amortecedor. Uma das duas está com o sentido invertido.

A World Raid é `oem_manual`, vinda do manual oficial XTZ690D; a de 2025 veio do
mfzstudio. **A suspeita recai sobre a de 2025**, mas isto só se fecha com o manual
da T7 de 2025 na mão — não vale a pena adivinhar, porque inverter o sentido de um
afinador é pior do que deixá-lo como está.

## «ANEL»: a tradução que faltava, e o afinador que estava invertido

Duas coisas fechadas com o manual de oficina da T7 2025.

### O comentário do utilizador

> *"Under rear suspension preload, my DRZ says «ANEL» — what does this mean?"*

Bug real, e da pior espécie: um utilizador inglês abria a DR-Z e via **uma palavra
portuguesa na casa onde esperava um número**.

A causa está em `app/index.tsx`, no `DataCell`. Quando um afinador é do tipo `pos`,
mostra-se um token curto se existir e só se não existir é que cai na palavra genérica:

```ts
const shown = isPos ? (cell || t("susp.cell.pos")) : value;
```

O `t(...)` está traduzido nas seis línguas. O `cell` **não** — vem dos dados, e os
dados OEM são todos escritos em português. Ou seja, sempre que havia token, ele
ganhava à tradução. Afetava cinco tokens: `ANEL`, `MANUAL`, `PAINEL`, `TODA SOLTA`
e `entrega`. Os tokens que são medidas (`199,6 mm`, `4/7`, `1-10`) leem-se em
qualquer língua e não têm problema.

**A tradução foi feita na app e NÃO nos dados**, de propósito. A mesma linha do
Supabase é servida às versões já instaladas: se o valor mudasse na base para uma
chave tipo `@ring`, quem tivesse a 1.1.5 passava a ver `@ring` em vez de `ANEL`.
Mapear na app deixa as versões antigas exatamente como estavam e corrige as novas.

Fica por resolver o problema maior de que isto é sintoma: **os `label`, `notes` e
`source` também são todos em português** e aparecem a toda a gente. O `cell` era o
caso mais gritante porque cabe numa casa de dois centímetros onde devia estar um
número, mas a app está a mostrar texto português a utilizadores ingleses em mais
sítios.

### A T7: eu tinha suspeitado da entrada errada

O manual de oficina (LIT-11616-38-67 / BRL-28197-10) dá as tabelas em Soft / STD /
Hard e diz, à frente e atrás:

> *Adjustment value from the start position (Hard): 0*
> *\*With the adjuster fully turned in direction "a"* — e a direção "a" é a que
> aumenta o amortecimento.

Portanto **a posição de partida é o mais duro** e conta-se para fora: `cl_hard`.
A exceção é a pré-carga traseira, onde o Soft é que é 0 — essa é `cl_soft`.

Isto confirma a `yamaha_t700_2025` como estando certa e apanha a
`yamaha_t700_world_raid_2026` com o retorno e a compressão traseiros invertidos.
A nota dessa entrada dizia «rear scale counts from soft: 0 = soft, 21 = hard» — é
uma leitura trocada da tabela, onde o 21 é a coluna **Soft** e o 0 é a **Hard**.

Na prática, 11 cliques contados do lado errado numa escala de 21 dá quase o extremo
oposto do que a Yamaha manda.

**Eu tinha escrito no commit anterior que a suspeita recaía sobre a de 2025**, por
ser a que vinha do mfzstudio e não de manual. Estava errado: a que estava mal era
justamente a marcada `oem_manual`. A pista que devia ter pesado mais era outra —
dentro da própria entrada da World Raid, a frente já estava em `cl_hard` e só o
trás é que divergia. Uma entrada que se contradiz a si própria é sinal mais forte
do que a proveniência.

Corrigido o sentido, mantidos os números, e a razão escrita na fonte e na nota.
A T7 2025 passou também de `mfzstudio` a `oem_manual`, com as margens completas.

### Continuação da DR-Z: traduzir o token não chegava

Traduzir `ANEL` para `RING` tira a palavra portuguesa do ecrã, mas **não responde à
pergunta que a pessoa fez**, que era «o que é que isto quer dizer?». `RING` sozinho
continua a não dizer o que fazer.

Ao ir ver porquê, apareceu a lacuna verdadeira. A caixa «Como afinar» mostra uma nota
por modelo, com a chave `count.<profileId>`, e cai numa frase genérica quando essa
chave não existe. **A DR-Z não tinha nota nenhuma.** E o `countNote` e o `notes` que
estão nos dados — onde está escrito que o anel precisa de ferramenta especial e que a
Suzuki manda ir ao concessionário — **não são mostrados em lado nenhum da app**. É
texto que existe na base e que o utilizador nunca vê.

Criadas as notas `count.suzuki_drz4s_2025` e `count.suzuki_drz4sm_2025` nas seis
línguas, a dizer o essencial: a frente não tem precarga (é por pressão de ar, 0 kPa),
a precarga de trás é por anel roscado sem escala de cliques, a Suzuki manda ir ao
concessionário, e acerta-se pelo sag.

**Fechado a seguir: os 18 perfis que faltavam.** Todos os 85 têm agora nota nas seis
línguas — 510 chaves `count.*`, zero lacunas. Eram estes:

`aprilia_rs660_2020`, `aprilia_rsv4_1100_2021`, `aprilia_tuareg660_2021`,
`aprilia_tuono660_2021`, `aprilia_tuono_v4_1100_rr`, `cfmoto_800mt`,
`ducati_desertx_kayaba`, `ducati_hyper698_marzocchi`, `ducati_multi_v2_marzocchi`,
`ducati_multi_v2s_dss_evo`, `ducati_multi_v4_ohlins_smartec`,
`ducati_multi_v4_rally_dss`, `ducati_panigale_v4_showa`, `ducati_sf_v4_showa`,
`honda_cb750_hornet_2023`, `kawasaki_ninja1000_2017`, `kawasaki_z900_2017`,
`macbor_xr5`.

As notas foram compostas por blocos, não escritas uma a uma: 27 fragmentos por língua
(«conta a partir do duro», «precarga por comprimento de mola», «não há compressão»…)
e uma receita por perfil. Assim a mesma mecânica é descrita sempre com as mesmas
palavras em todas as línguas, e uma correção num fragmento chega a todos os perfis
que o usam.

Um detalhe que a composição obrigou a separar: o **«1 mm por volta»** da pré-carga da
frente só está escrito nos manuais Ducati. Nas Aprilia V4 e nas duas Kawasaki o
manual dá as voltas mas nunca declara a razão em milímetros, por isso essas ficaram
com a versão sem o parêntese. Escrever lá «1 mm por volta» seria inventar.

## Multistrada V4, e a fonte deixa de ser um parágrafo português

### A V4 de série estava com os quatro valores errados

Manual do proprietário da Multistrada V4 (EN, 25 ED02), pág. 238-239. Com os Pirelli
Scorpion Trail II de série: **2,4 à frente** (igual só com piloto e com carga) e
**2,5 / 2,9 atrás**. Tínhamos 2,5/2,5 e 2,9/3,2 — os quatro acima do manual, e os
3,20 mais uma vez sem apoio em documento nenhum.

Perfil novo `ducati_multi_v4_marzocchi`, o da **V4 de série**, com Marzocchi mecânico:
frente 2 voltas de retorno, 2 de compressão e 5 de pré-carga; atrás 12 cliques de
retorno, 5 de compressão e 19 mm de pré-carga. Repare-se na mistura de unidades:
**voltas à frente, cliques atrás**.

**Armadilha deste manual:** a mesma página de especificações diz que a forquilha é
«fully manually adjustable» e, três linhas abaixo, «fully electronic hydraulic damping
adjustment». Não é contradição, é a página a cobrir a V4 e a V4 S ao mesmo tempo. Os
números de afinação que lá estão são os mecânicos, ou seja, os da V4 de série. A V4 S
continua com o perfil Skyhook.

### A fonte no ecrã de Pneus

O `pneus.tsx` mostrava a `source` em bruto. Como a investigação dos manuais é feita em
português, isso queria dizer que um utilizador inglês levava com um parágrafo português
por baixo dos valores — às vezes com 500 caracteres.

**Antes de mexer, fui verificar o que é mostrado mesmo**, porque tinha afirmado que os
`notes` também apareciam. Não aparecem: o `notes` dos perfis de suspensão não é
renderizado em lado nenhum, é texto interno. O problema era só a `source`, e só neste
ecrã. Convém corrigir o que eu próprio escrevi no documento anterior.

Cada fonte tem duas partes separadas por travessão: a **citação** (tipo de documento,
nome, edição, página — quase tudo nomes próprios) e o **detalhe**, que é prosa e que
quase sempre repete os números que já estão no ecrã.

Em português mostra-se tudo, como sempre. Nas outras línguas traduz-se a citação
mecanicamente — o tipo de documento, `pág.`, `secção`, `cód.` — e o detalhe fica de
fora. A ressalva que não se podia perder, a de o valor ainda não estar confirmado,
passou a ser uma linha própria e traduzida, decidida pelo `dataQuality` e não pelo
texto.

| | Antes (EN) | Agora (EN) |
|---|---|---|
| Panigale V4 | *Manual do proprietário Ducati Panigale V4 (EN, 26 ED02), secção «Tyre pressure» — estrada só piloto 2,3 à frente e 2,1 atrás; com passageiro e malas 2,5 e 2,9…* | Owner's manual: Ducati Panigale V4 (EN, 26 ED02), section «Tyre pressure» |
| M 1000 RR | *BMW M 1000 RR Rider Manual — por confirmar* | BMW M 1000 RR Rider Manual — not yet confirmed against the manufacturer's manual |

Custo por moto nova: **zero**. Nada disto precisa de tradução manual.

**Como foi verificado:** passei as 119 fontes reais pela função e procurei resíduo
português no resultado. À primeira tentativa saíram 23, e o teste apanhou três defeitos
que eu não tinha previsto — «Valores do manual **do proprietário**» ficava com o «do
proprietário» pendurado, e sobravam `secção` e `cód.`. Corrigidos, ficam 3 resíduos, e
os três são falsos positivos: é o acento de *Ténéré*, que é o nome da moto. O
comprimento mediano do texto caiu para 77 caracteres, contra os 493 do pior caso antes.

## OTA: o que verificar quando um update não chega ao telemóvel

Publicado com sucesso e o telemóvel não mudou nada. A confusão custou algumas voltas,
por isso fica aqui a ordem por que se deve verificar — da causa mais banal para a mais
rebuscada.

**1. Fechar a app duas vezes, a sério.** Com `EXPO_UPDATES_LAUNCH_WAIT_MS=0` a primeira
abertura depois de publicar só *descarrega* o bundle; continua a correr o antigo. É
preciso tirar dos recentes, abrir, tirar dos recentes outra vez e abrir. Só na segunda
é que troca. Minimizar não conta como fechar.

**2. Estás a olhar para uma coisa que muda?** Esta foi minha: a tradução da fonte no
ecrã de Pneus **não muda nada em português**, de propósito — em PT mantém-se o texto
completo. Para ver a diferença é preciso pôr a app noutra língua. Testar uma alteração
de i18n com a app em português não prova nada.

**3. O canal.** A build embute o canal do perfil com que foi construída. Uma build feita
com o perfil `preview` ouve o canal `preview` e ignora tudo o que for publicado em
`production`. Confirma-se com:

```
npx eas-cli channel:view production --json --non-interactive
npx eas-cli build:list --platform android --limit 3 --json --non-interactive
```

O campo `Profile` da build diz qual o canal que ela ouve.

**4. O `runtimeVersion`.** A política é `appVersion`: o update só chega a aparelhos cuja
app nativa tenha exatamente a mesma versão do `app.json` no momento da publicação. Uma
build 1.0.0 nunca vê um update 1.1.5, e não há erro nenhum a avisar — o update
simplesmente não existe para aquele aparelho.

**Armadilha relacionada, na pasta `android/`:** ela é gerada pelo prebuild e está no
`.gitignore`, mas fica em disco com a versão de quando foi gerada. A que está aqui
ficou em `expo_runtime_version = 1.1.4` e `versionName "1.1.4"`. Se se fizer
`eas build --local` sem correr `npx expo prebuild --clean` primeiro, sai uma build 1.1.4
que nunca poderá receber updates de 1.1.5.

**Diagnóstico no próprio telemóvel:** Definições → linha da versão. Mostra
`v1.1.5 · OTA dd/mm` quando está a correr um update, e só `v1.1.5` quando está a correr
o bundle que veio da loja. É a forma mais rápida de saber que bundle é que aquele
aparelho tem.

**Antes de publicar, construir o bundle.** O `tsc` passar não garante que o Metro
constrói, e um bundle partido enviado por OTA rebenta a app a toda a gente na mesma
versão nativa até se publicar outro por cima:

```
npx expo export --platform android --output-dir /tmp/bundle_check
```

## QJ Motor: sete manuais russos, e as nove estavam todas erradas

Os manuais do importador russo, que já tinham servido para os afinadores, resolvem
também as pressões. São PDF com texto — basta procurar `кПа`.

| Moto | Tínhamos | Manual | Desvio |
|---|---|---|---|
| SRK 600 | 2,5 / 2,9 | **2,2 / 2,5** | −0,3 / −0,4 |
| SRK 800 | 2,5 / 2,9 | **2,3 / 2,6** | −0,2 / −0,3 |
| SRK 900 | 2,5 / 2,9 | **2,2 / 2,5** | −0,3 / −0,4 |
| SRK 921 | 2,5 / 2,9 | **2,2 / 2,5** | −0,3 / −0,4 |
| SRT 450 RX | 2,3 / 2,5 | **2,2 / 2,2** | −0,1 / −0,3 |
| SRT 800 X | 2,3 / 2,5 | **2,2 / 2,5** | −0,1 / — |
| SRT 900 SX | 2,5 / 2,9 | **2,2 / 2,5** | −0,3 / −0,4 |

**A gama inteira anda nos 220/250 kPa**, com uma única exceção: a SRK 800, que leva
230/260. Todas dão valor único, sem distinção de carga.

**A SRT 450 RX é o caso mais invulgar do catálogo até hoje: a mesma pressão à frente
e atrás**, 220 nas duas rodas.

### Duas coisas que a leitura corrigiu

**As pressões de todo-o-terreno da SRT 450 RX eram inventadas.** Tinha 1,5/1,8, que
saíram da estimativa por categoria. **Nenhum dos sete manuais QJ publica pressões de
fora de estrada** — o campo foi limpo, aqui e na SRT 600 SX. Numa moto de rally, um
número errado de pressão baixa é como se fura o pneu.

**Os manuais das SRT 800 e 900 cobrem a S e a SX ao mesmo tempo.** As duas versões têm
rodas diferentes — a S calça 120/70ZR17 e 180/55ZR17, a SX leva 110/80R19 e 150/70R17
em raios — mas a tabela de pressão atravessa as duas colunas: **é a mesma para ambas**.
Na SRT 900 isso está explícito na tabela; na 800 a pressão aparece uma só vez no
capítulo de manutenção, com as duas fichas técnicas em páginas separadas.

Vale a pena reter isto, porque contraria a lição da DR-Z4S. Lá, um manual que cobria
duas motos dava valores **diferentes** para cada uma. Aqui dá o mesmo. Não se pode
assumir nem uma coisa nem outra: tem de se ler.

### As duas que faltam

A SRT 600 SX e a SRT 700X não estão na página do importador russo. Ficaram com
2,2/2,5 e `estimated_spec`, com a razão escrita na fonte: é o padrão da gama, medido
em seis manuais, não é um número tirado da categoria. É melhor do que estava, mas não
é confirmado.

Cuidado: a página tem uma **SRK 700**, que é a naked. Não serve para a SRT 700X.

### SRT 700X: a estimativa confirmou-se ao valor

Chegou o manual EN/IT da «SRT 700 & 700 X»: **220±10 kPa à frente e 250±10 atrás**,
exatamente o que a entrada já tinha por extrapolação do padrão da gama. Passa a
`oem_manual`.

Vale a pena registar porquê, porque é a segunda vez que um empréstimo se confirma sem
mudar um algarismo — a primeira foi a Multistrada V2 a partir do manual da V2 S Travel.
**O que distingue um empréstimo defensável de um palpite é a base:** aqui eram seis
manuais da mesma marca a dizer todos o mesmo número, com uma exceção conhecida e
identificada (a SRK 800). Não era a média de uma categoria.

Este manual também cobre duas versões: a 700 de estrada calça 120/70ZR17 e 160/60ZR17,
a 700 X leva 110/80 R19 e 150/70 R17. A pressão é a mesma para as duas — como nas SRT
800 e 900.

**Sobre a suspensão, não deu para fazer perfil.** O manual descreve os afinadores mas
não publica um único valor de fábrica, e avisa que a forquilha ajustável é **opcional**
neste modelo («Configuration I»). Fica a nota de que, nessa configuração, a compressão
está na bengala ESQUERDA e o retorno na DIREITA — o mesmo padrão repartido que já vimos
nas Ducati e na Kawasaki Ninja 1000. Sem números não se inventa um perfil.

### SRT 600 SX fecha a QJ: nove de nove

Manual multilíngue (EN/ES/IT/FR): **220±10 kPa à frente e 250±10 atrás**, confirmado
nas secções inglesa e francesa, com 110/80R19 e 150/70R17 na ficha técnica. Terceira
extrapolação do padrão da gama a confirmar-se sem mudar um algarismo.

**A QJ Motor passa a marca fechada.** As nove pressões vêm de manual.

**A moto continua oculta, e de propósito.** O manual documenta só o amortecedor:
pré-carga por manípulo com 10 mm de curso e estado de fábrica de **uma volta no
sentido horário**, e retorno em cliques com a posição de fábrica «marcada» mas sem
número publicado. Da forquilha não diz nada.

Isso não chega para fazer perfil, e sobretudo não autoriza a concluir que a forquilha
não tem afinadores — a regra que já está escrita neste documento aplica-se aqui:
*ausência de capítulo é prova fraca*, e a ficha do importador português diz
«Suspensões Marzocchi multi-reguláveis» sem separar frente de trás. Enquanto a dúvida
for essa, a moto fica fora do seletor.

Se aparecer confirmação de que a forquilha é fixa, há material para um perfil parcial:
a pré-carga traseira tem valor de fábrica real (1 volta) e o curso conhecido (10 mm).

## CFMoto e Kove: sete motos, e um valor que ninguém esperaria

Sete manuais de uma vez. Todas as sete estavam erradas.

| Moto | Tínhamos | Manual |
|---|---|---|
| CFMoto 800NK | 2,5 / 2,9 | **2,4 / 2,6** |
| CFMoto 800MT Sport e Explore | 2,5 / 2,9 | **2,4 / 2,8** |
| CFMoto 1000MT-X | 2,5 / 2,9 | **2,4 / 2,4** |
| Kove 450 Rally | 1,8 / 1,8 | **2,3 / 2,1** |
| Kove 800 Rally | 2,3 / 2,5 | **2,0 / 2,25** |
| Kove 800X Touring | *não existia* | **2,3 / 2,5** |

**O Kove 450 Rally leva mais pressão à frente do que atrás** — 230 contra 210 kPa. Não
é gralha do OCR: confirmei a 300 dpi. É o primeiro caso do catálogo em que o traseiro é
mais baixo, e vai contra o instinto de toda a gente.

**O Kove 800 Rally tem a pressão dianteira mais baixa de todo o catálogo**, 2,00 bar.

**A CFMoto 1000MT-X é o segundo caso de pressão igual nas duas rodas** (2,40), depois da
QJ SRT 450 RX. As duas são trail de roda de 21 polegadas — pode ser padrão da categoria,
mas com dois casos não passa de observação.

### Correções de medida que os manuais obrigaram

**CFMoto 800NK: a frente estava como 120/60 ZR17 e o manual diz 120/70 ZR17 (58W).**
Vale a pena registar como isto aconteceu: a medida certa estava no ficheiro do código, a
errada estava no Supabase, e quando ressincronizei os dois lados dei a base como boa e
escrevi 120/60 por cima do 120/70. Foi a escolha certa em 48 dos 49 casos, mas nesta
apaguei o valor bom. **Ressincronizar em bloco tem este custo, e só um manual o desfaz.**

**Kove 450 Rally: 90/90-21 e 140/80-18**, contra os 80/100-21 e 120/80-18 que lá
estavam. As duas versões do manual, CN4 e E5+, dão as mesmas medidas.

### O que estes manuais NÃO resolvem

**Kove 800X e 800X Pro continuam por confirmar.** Nenhum dos três manuais é dessa
versão, e não dá para emprestar: a 800X Rally e a 800X Touring têm rodas diferentes
entre si (21/18 contra 19/17) e nenhuma bate certo com as medidas que a nossa entrada
tem. Quando as rodas diferem, a pressão diferiu sempre.

**CFMoto 700MT não leva nada do manual da 700CL-X.** São motos diferentes: a CL-X é
roadster com 18 ou 17 à frente, a 700MT é trail com 19. O manual da CL-X ficou por usar.

**CFMoto 450MT, 800MT-X e 1000 SR-R continuam sem manual.** A 800MT-X tem roda de 21 e
o manual do IBEX 800 é das versões de 19 — não serve.

### Nota de método: onde está a pressão nos manuais Kove

Não está na ficha técnica, ao contrário de quase todos os outros fabricantes. Está numa
frase solta no meio da secção **«Tire (Inspection/Replacement)»**, na forma
*«The standard tire pressure is: Front tire: 230 kPa; Rear tire: 250 kPa»*.

Os manuais Kove são digitalizados sem camada de texto e é preciso OCR. Para não fazer
OCR a 100 páginas: o manual do 625X Pro tem texto e serve de mapa — a secção dos pneus
está por volta da página impressa 45. Nos outros, contar o desfasamento entre a
numeração impressa e a do PDF (no 450 Rally são 8 páginas de publicidade à frente) e
saltar direto para lá.

## Suspensão Kove confrontada com os manuais: quase toda certa, e um erro que interessa

Com os manuais Kove abertos, valia a pena confrontar os perfis de suspensão, que
tinham vindo todos do mfzstudio e não de manual. **Confirmei valor a valor.**

**Kove 450 Rally — os números estavam todos certos:**

| | Perfil | Manual |
|---|---|---|
| Frente compressão | 10 cliques do mais duro | 10, margem de 22 posições ✓ |
| Frente retorno | 10 cliques do mais duro | 10, margem de 22 ✓ |
| Trás retorno | 10 cliques | 10 ✓ |
| Trás compressão alta | 2 voltas | 2, margem ~4 voltas ✓ |
| Trás compressão baixa | 8 cliques | 8, margem de 16 ✓ |

**O erro estava noutro sítio: a pré-carga da FRENTE mostrava o comprimento da mola
TRASEIRA**, «215-230 mm». Era o valor do amortecedor colado à forquilha. O manual é
inequívoco: a secção da frente tem pressão de ar, compressão e retorno — **e mais
nada**. A 450 Rally não tem pré-carga de mola à frente; o que se regula é a pressão
de ar interna, e só para a purgar quando sobe com o uso.

É o mesmo caso da Suzuki DR-Z4S, que também tem forquilha por pressão de ar sem
pré-carga. Corrigido para `na` com a explicação, e a etiqueta de trás passou a dizer o
que é: comprimento de mola, 215-230 mm na versão de selim alto e 200-225 na de selim
baixo, com 1,5 mm por volta do afinador.

**Kove 800X Touring — confirmado a 100%**, à frente 18 e 18, atrás 10 e 10, com margens
de 24±2 à frente e 20±2 / 23±2 atrás. Passa a `oem_manual`.

Detalhe que vale a pena guardar: **na Touring os afinadores da frente estão repartidos
por bengala e vêm marcados no próprio amortecedor — COMP à direita, TEN à esquerda.**
É o mesmo padrão das Ducati, da Kawasaki Ninja 1000 e da QJ SRT 700X, e já vai em
quatro marcas diferentes. Deixou de ser curiosidade e passou a ser o normal.

**A 450 Rally Factory fica com os números da de série**, com a ressalva escrita: leva
suspensão de especificação mais alta e pode ter valores próprios. A correção da
pré-carga da frente aplica-se-lhe na mesma, porque o erro era de leitura, não de moto.

### Kove 800X Rally: os números certos, a mesma etiqueta errada

Confrontado com o manual (pág. 61-66), o perfil da 800X Rally está **todo certo**: à
frente 18 posições de compressão e **8** de retorno, atrás 8 de retorno, 2 voltas de
compressão de alta velocidade e 8 posições de baixa. Aquele comentário no código a
dizer que o retorno da frente era «different from other 800X» estava correto — são
mesmo 8 e não 18.

Mas repetia-se o erro do 450 Rally: a pré-carga da frente dizia «Fork marking». **Esta
forquilha também não tem pré-carga de mola** — é a mesma arquitetura por pressão de ar.

### A descoberta que isto trouxe: a Kove tem duas famílias de forquilha

| | Frente | Pré-carga à frente |
|---|---|---|
| 450 Rally | pressão de ar | **não existe** |
| 800X Rally | pressão de ar | **não existe** |
| 800X Touring | convencional, escalas gravadas | existe |

**As duas arquiteturas coexistem na mesma gama**, e a diferença não se adivinha pelo
nome. As três versões que ficam sem manual — `kove_800x_standard`, `kove_800x_pro_2026`
e `kove_800x_e5` — levam agora nota escrita a dizer que não se sabe de que lado caem.
Continuam com `pos('Fork marking')`, que pode estar certo ou errado; sem manual não há
como decidir, e trocar para `na` seria adivinhar na direção oposta.

**Balanço da verificação Kove:** sete perfis confrontados, **todos os valores numéricos
certos**, e dois erros de etiqueta na pré-carga da frente — os dois do mesmo tipo, os
dois nas versões Rally. O mfzstudio acertou nos números e falhou na natureza do
afinador.

## CFMoto: cada moto tem a sua convenção, e eu quase estraguei duas

Fui confrontar os perfis CFMoto com três manuais. O primeiro achado parecia claro: os
perfis diziam todos «ACW to fully soft, then CW count up» e as secções de procedimento
da 800MT e da 1000MT-X mandam o contrário — apertar até ao fim e depois abrir. Corrigi
as duas para contagem desde o duro.

**Numa delas estava errado, e o que me travou foi um comentário no próprio código.**

A entrada da 800MT tinha escrito: *«VERIFICADO contra o manual oficial: CF MOTO 800MT
Owner's Manual p.181»*. Antes de apagar a tabela de pesos fui procurar esse quadro. Ele
existe — «Suspension Adjustment Chart», pág. 205 do IBEX 800 — e traz em letra pequena:

> *«The above are all counterclockwise to the limit position, and then clockwise to
> increase the number of preload turns or damping segments.»*

**O mesmo manual dá duas convenções contraditórias.** A secção de procedimento conta do
duro; a tabela por carga conta do mole. No valor de fábrica não se nota, porque 10 numa
escala de 20±2 fica a meio e dá no mesmo dos dois lados. **Nas outras linhas nota-se:**
a tabela sobe para 15 e 19 com a carga, e isso só endurece contando do mole. Manda a
tabela, porque é a que traz os valores por carga — que é o que a app usa. Revertido.

A 1000MT-X é o caso oposto e a correção mantém-se: a tabela dela (pág. 205 do manual
português) diz *«primeiro no sentido horário até à posição limite e, em seguida, no
sentido contrário»* — do duro — e os números **descem** com a carga (10, 8, 7, 5), o
que só é coerente assim. As duas motos da mesma marca contam ao contrário uma da outra,
e cada manual é consistente consigo próprio na tabela.

### A pré-carga da 800NK: também estava certa

Cheguei a mudá-la para milímetros, porque a ficha técnica dá 11,5 mm de rosca à vista à
frente e 106,5 mm de mola atrás. Também revertido: a tabela da pág. 142 dá a mesma
pré-carga em **voltas do afinador** («circles»), 4 à frente e 3 atrás, e é essa a forma
que varia com a carga. **São a mesma afinação escrita de duas maneiras** — a medida
serve para conferir, as voltas servem para regular. Ficaram as duas escritas na nota.

### O que fica desta

Duas quase-asneiras seguidas, as duas do mesmo tipo: **li a secção de procedimento e
não procurei a tabela por carga.** As tabelas CFMoto estão noutro capítulo, dez páginas
à frente, e é nelas que está a convenção que interessa. O que salvou foi o comentário
que alguém deixou no código a dizer contra o que é que aquilo tinha sido verificado.

**Regra para a próxima:** quando um perfil tem `weightPoints` e a fonte diz que veio de
um chart, a convenção de contagem vem do chart, não da secção de procedimento. E antes
de apagar dados verificados, procurar o documento que a nota cita.

**Balanço real:** de seis perfis CFMoto confrontados, **um erro verdadeiro** — a
1000MT-X, com os quatro afinadores de amortecimento contados ao contrário. Os outros
cinco estavam certos.

## `npm run verificar-coerencia`: apanhar o erro do sentido sem precisar de manual

A CFMOTO 1000MT-X denunciou-se sozinha antes de eu abrir o manual: tinha os afinadores
marcados como contados desde o mole e a tabela por carga a **descer** com o peso. Isso
é impossível — se o número desce e conta do mole, a moto fica mais macia com o piloto
mais pesado.

**Isso dá para verificar em todo o catálogo sem ler manual nenhum**, e agora está num
script:

> Um afinador contado desde o MAIS DURO tem de DESCER com o peso. Contado desde o MAIS
> MOLE tem de SUBIR. Se a tabela anda ao contrário do `type` declarado, uma das duas
> coisas está errada.

Passei os 86 perfis: **67 afinadores com tabela por carga, mais 3 em milímetros** (esses
não dá para inferir, porque o sinal depende da peça — rosca à vista, folga, comprimento
de mola). **Duas suspeitas, as duas na mesma moto.**

### A Voge 625 DSX, e porque não lhe toquei

A compressão e a extensão traseiras estão como `cl_soft` e a curva desce: 10, 8, 6.

O que faz isto interessante é a moto do lado. A **Voge 800 DSX Rally**, do mesmo
fabricante e da mesma leva de manuais, tem a compressão traseira com a **curva idêntica**
— 10, 8, 6 — declarada como `cl_hard`. **Duas entradas da mesma marca, os mesmos números,
sentidos opostos.** Uma delas está errada.

A física diz que é a 625: números a descer com a carga só endurecem se se contar do duro.
Mas o `countNote` da 625 diz, com todas as letras, *«ao contrário das outras Voge, a
extensão e a compressão contam-se a partir do MOLE»*. Alguém escreveu isso a olhar para
alguma coisa.

**Não mexi, e é deliberado.** Acabei de reverter duas correções minhas nas CFMoto por
ter agido sobre uma leitura parcial, e o padrão repete-se aqui: tenho um argumento
físico forte e nenhum documento. Fica sinalizado no script, com a razão escrita, e
resolve-se com o manual da DS 625X à frente — a mesma fonte que gerou a entrada.

#### RESOLVIDO — agosto de 2026, com o manual DS 625X à frente

O manual apareceu e **não deu a resposta limpa que eu esperava**. Vale a pena escrever o
que ele diz mesmo, porque a conclusão não sai directamente do texto.

O que o manual **confirma sem ambiguidade** é a identidade dos afinadores traseiros:
ajustador **2** no corpo do amortecedor (lado esquerdo) é a **extensão**, ajustador **3**
no reservatório de gás é a **compressão**. Portanto **não havia troca entre os dois** — a
suspeita original, tal como estava formulada, estava errada. As curvas também batem
certo: extensão 10 / 8±1 / 6±1 e compressão 10 / 8 / 6, para só piloto, piloto com 3
malas e piloto com passageiro e 3 malas. Precarga na posição de entrega, +2 e +3 voltas.

O problema é o **sentido de contagem**, e aí o manual diz, literalmente, para os dois
afinadores: *«Turn the adjustor anti-clockwise to limit, then turn it clockwise by 10
positions»* — e antes disso já tinha dito que anti-horário alivia. Lido à letra, é
`cl_soft`, e a curva a descer significa que o manual manda **aliviar** o amortecimento à
medida que se carrega a moto. Isso não se sustenta.

**Decisão: `cl_hard`, alinhado com a 800 DSX Rally** (mesmo amortecedor, mesma curva
10/8/6). O que me deu confiança para assumir erro de tradução não foi só a física — foi
encontrar um **segundo erro do mesmo tipo na mesma página**: o título da secção diz
*«The compression damping for rear shock absorber is adjustable»* e as duas linhas
seguintes, a descrever o mesmo ajustador 3, dizem *«the returning damping gets weaker /
stronger»*. O inglês deste manual troca etiquetas. Já tínhamos o mesmo padrão a morder-nos
na 900 DSX, onde o 900dsx.com numerava os parafusos da forquilha ao contrário do manual.

Ficou escrito na nota do perfil que o texto literal diz o contrário, para quem lá voltar
não pensar que foi descuido. **Confirmar pelo sag** continua a ser a última palavra.

**Também saiu do manual:** as pressões reais — 220 kPa à frente e atrás em solo, 250 kPa
a dois. A tabela tinha estimativa de categoria com 2,9 bar atrás carregado, **0,7 bar a
mais**. Corrigido e promovido a `oem_manual`.

O `CONHECIDOS` do `verificar-coerencia` ficou vazio.

**Como o script se comporta:** lista os casos já investigados com a explicação, e só sai
com erro se aparecer uma suspeita **nova**. A lista de conhecidos não é para calar
avisos — só entra lá o que já foi olhado.

### Um falso alarme que vale a pena ter escrito

Ao mesmo tempo, comparei os `adjusters` declarados em cada moto com o que o perfil dela
diz existir. Deu **107 conflitos** — e não é bug nenhum.

O `adjusters` **só é lido nas motos SEM `mfzProfileId`** (`suspension.ts:305`, dentro
do caminho de fallback). Nas que têm perfil, manda o perfil, e o campo fica lá sem ser
consultado. Estava escrito no cabeçalho do `bikes.ts` e confirma-se no código.

Fica registado para o próximo que faça esta comparação não gastar tempo a persegui-la.

### Onde o `adjusters` conta mesmo, e o que isso revelou

Nas motos sem perfil o campo é a única coisa que impede a heurística por categoria de
inventar um número para um afinador que a moto não tem. **São 43 motos visíveis sem
perfil, e 21 delas nem sequer dizem que afinadores têm** — caem no default do nível
`adj`. O script passa agora a listá-las.

As 10 em `adj: "full"` são as mais expostas, porque o default assume que existem os
seis e a app mostra seis números inventados:

BMW S 1000 RR, S 1000 R e M 1000 RR · Ducati DesertX V2 · Kawasaki Ninja ZX-10R ·
Triumph Tiger 900 Rally Pro, Street Triple RS, Speed Triple 1200 RS e Scrambler
1200 XE · Yamaha MT-10.

Há ainda 6 em `adj: "fixed"` (assume só pré-carga traseira) e 5 em `"partial"`.

**Isto não é erro, é o limite de não sabermos.** Preencher o `adjusters` numa destas
exige fonte que diga que afinadores a moto tem — a ficha do fabricante chega, não é
preciso manual. A alternativa honesta, quando não houver, é `hidden: true`, que é o que
já se fez às cinco motos ocultas.

É provavelmente o trabalho de melhor relação esforço/resultado que resta: **22 fichas de
fabricante a ler**, sem OCR nem manuais de 300 páginas, e tira 21 motos de cima da
heurística.

### Tentativa falhada: as fichas oficiais não dão os afinadores

Tentei preencher os `adjusters` das 21 motos pelas fichas dos fabricantes. **Não trouxe
um único dado utilizável**, e vale a pena registar porquê para não se repetir a
tentativa.

As páginas de modelo da Triumph e da Yamaha são construídas por JavaScript e a tabela
de especificações vive dentro de acordeões que só se preenchem em interação. Testado:

- **HTML em bruto** (fetch): a secção «Tech spec» vem no documento como títulos vazios —
  «Engine & Transmission», «Chassis», «Dimensions» — sem conteúdo nenhum.
- **Browser com JavaScript**: a página carrega, mas o extrator de texto continua a
  devolver só os títulos.
- **Clicar no acordeão «Chassis»** e voltar a extrair: igual. A região fica vazia
  também na árvore de acessibilidade.
- **Yamaha**: a página do MT-10 nem sequer devolve texto — só imagens e vídeo.

**Não preenchi nada a partir de conhecimento próprio, e é de propósito.** Escrever
«fComp: true» na S 1000 RR porque toda a gente sabe que ela tem compressão à frente é
exatamente o tipo de dado inventado que este catálogo passou o dia a limpar. Sem fonte
citável, fica por preencher.

**Há ainda um problema de fundo com esta via**, mesmo que as fichas abrissem: as fichas
comerciais dizem «totalmente ajustável» sem separar os seis afinadores. Já apanhámos
isso na QJ SRT 900 SX, e é o motivo de a moto estar oculta.

**O caminho que funciona é o mesmo de sempre: o manual do proprietário.** Tem um
capítulo de afinação da suspensão que diz, afinador a afinador, o que existe — foi assim
que se fizeram as Ducati, as Kawasaki, as Kove e as QJ.

Para as 10 mais expostas (`adj: "full"` sem `adjusters`), os manuais que faltam são:

| Moto | Nota |
|---|---|
| Triumph Street Triple RS | O *Owner's Handbook* já foi usado para as pressões (pág. 232) |
| Triumph Speed Triple 1200 RS | Idem, ed. 2023, pág. 195 |
| Triumph Tiger 900 Rally Pro | Idem, pág. 195 |
| Triumph Scrambler 1200 XE | Idem, *Manual del propietario*, pág. 236 |
| BMW S 1000 RR / S 1000 R / M 1000 RR | A BMW não publica pressões no manual, mas publica afinações |
| Kawasaki Ninja ZX-10R | Manual de oficina `99924-xxxx-xx`, a via que já funcionou duas vezes |
| Yamaha MT-10 | O manual já foi usado para as pressões (B67-28199-E0) |
| Ducati DesertX V2 | Falta, e é a mesma que falta para as pressões |

**Quatro destes já passaram por aqui** — os quatro manuais Triumph e o da MT-10 foram a
fonte das pressões respetivas. Se voltarem a aparecer, fecham metade da lista sem
investigação nenhuma: é ir ao capítulo da suspensão em vez do das pressões.

## Triumph: três perfis novos dos manuais, e um afinador que não existia

Os manuais que faltavam apareceram e resolveram três das dez motos mais expostas —
não só os `adjusters`, mas o perfil inteiro, porque os *Owner's Handbooks* da Triumph
trazem **tabelas de afinação por condição de utilização**.

| Moto | Frente (retorno / compressão) | Trás (pré-carga / comp / retorno) |
|---|---|---|
| Scrambler 1200 XE | 3 / 3,5 voltas do duro | MIN / 2,5 / 1 volta |
| Tiger 900 Rally Pro | 8 / 8 cliques do duro | 10,5 voltas do mole / **não existe** / 1,25 voltas |
| Speed Triple 1200 RS | 15 / 15 cliques do duro | sem valor / 20 / 16 cliques |

**O achado que justifica o exercício: a Tiger 900 Rally Pro não tem regulação de
compressão atrás.** A tabela do amortecedor no manual só tem duas colunas, pré-carga e
retorno. A moto estava marcada `adj: "full"` sem `adjusters`, portanto a app assumia os
seis afinadores e a heurística inventava um número de compressão traseira para um
parafuso que não existe. Agora o perfil di-lo com `na`.

### Coisas que os manuais Triumph obrigaram a ter cuidado

**Cada manual cobre várias versões com colunas diferentes.** O da Tiger 900 traz a GT,
a GT Pro e a Rally Pro lado a lado, e os números não são os mesmos — a GT leva 10 de
retorno à frente onde a Rally Pro leva 8. O do Scrambler cobre a XE e a X, e **a X tem
a forquilha não regulável**. O da Speed Triple cobre a RR e a RS. Em todos, usei só a
coluna da moto que temos.

**As tabelas são por tipo de uso, não por peso.** Cada uma dá seis a sete linhas —
Comfort, Sport, Track, Off Road liso, Off Road partido, com passageiro, com malas. Só as
de carga entram na curva de peso; as outras ficaram escritas nas notas do perfil, porque
são afinações reais que a app não sabe representar.

**O primeiro batente conta como 1.** Está escrito nos manuais da Tiger e da Speed
Triple, e é do género de detalhe que faz um clique de diferença em cada afinação.

**Padrão que se repete: a compressão da frente está na bengala ESQUERDA** no Scrambler e
na Speed Triple. É a quinta e a sexta marca com afinadores repartidos por bengala.

### O que ficou de fora, e porquê

**Yamaha MT-10:** o manual que chegou é o da **MT-10 SP** (BGG-28199-21), que leva
Öhlins eletrónica com modos no painel. A nossa entrada é a MT-10 de série, com afinadores
mecânicos. **São suspensões diferentes e não dá para aproveitar** — ficaria pior do que
está. Falta o manual da MT-10 base.

**Triumph Street Triple RS:** o ficheiro que veio com esse nome é o *Service Manual* da
**Speed Triple** RS, que é outra moto. O manual da Street Triple continua a faltar.

Ficam **7 das 10** mais expostas por resolver: as três BMW, a ZX-10R, a DesertX V2, a
MT-10 e a Street Triple RS.

### E a Tiger 900 GT, do mesmo manual: só três afinadores dos seis

O manual da Tiger 900 traz três colunas e eu só tinha usado uma. A **GT** também está no
catálogo e também estava sem perfil, a correr no default do nível `partial`.

**Tem menos afinadores do que se assumia, e diferentes dos assumidos:**

| | Default `partial` assumia | O manual diz |
|---|---|---|
| Pré-carga frente | tem | **não tem** — a secção de pré-carga da frente é só da Rally Pro |
| Compressão frente | não tem | **tem**, 8 cliques |
| Retorno frente | tem | tem, 10 cliques |
| Pré-carga trás | tem | tem, mínimo a solo |
| Compressão trás | não tem | não tem ✓ |
| Retorno trás | tem | tem, 1,5 voltas |

**Dois erros em seis**, e em sentidos opostos: escondia a compressão da frente que existe
e mostrava uma pré-carga da frente que não existe.

A pré-carga de trás é o caso mais interessante: **mínimo a solo, 17 voltas com malas, 21
com passageiro e máximo com os dois.** É muita amplitude para caber num número só, por
isso ficou como posição com a escala escrita na etiqueta.

**Cuidado com a GT Pro:** é a terceira coluna do mesmo manual e tem pré-carga e retorno
**eletrónicos**, pelo menu do painel. Não está no catálogo, e se entrar precisa de
entrada própria — não se pode reaproveitar nem a da GT nem a da Rally Pro.

**Estado depois destas quatro:** 90 perfis, e as motos visíveis sem perfil caíram de 43
para 39. As que correm no default cru são agora 17, das quais 7 em `adj: "full"`.

### O buraco da Speed Triple: duas fontes, duas ausências

Fui ao *service manual* da Speed Triple RS fechar a única lacuna dos quatro perfis
Triumph — a pré-carga traseira, que o manual do proprietário não numera.

**Não fechou, mas trouxe duas coisas.**

A primeira é uma confirmação útil. O manual de oficina descreve a forquilha afinador a
afinador: *«The spring preload adjusters are located at the top of each fork. The
rebound damping adjuster is located at the top of the right hand fork and the
compression damping adjuster is located at the top of the left hand fork.»* Confirma a
compressão à esquerda, que eu já tinha do manual do proprietário, e acrescenta o
**retorno à direita**.

A segunda é a ausência. O capítulo da suspensão traseira, no manual de oficina, salta
dos desenhos em explosão direto para a desmontagem — **não tem secção de afinação
nenhuma**, ao contrário do da frente. E no manual do proprietário a tabela do amortecedor
só tem colunas de retorno e compressão.

**Duas ausências independentes é mais do que uma, mas continua a ser ausência.** Pode
perfeitamente ser um anel roscado que precisa de chave de gancho e que a Triumph não
documenta ao utilizador — é o que acontece na Kove 450 Rally e na CFMoto. Fica como
posição, sem número, até haver fonte que o afirme ou o negue. Marcá-lo `na` seria dizer
que não existe, e isso ninguém escreveu.

**Nota lateral sobre a RR:** a coluna dela no mesmo manual não é de cliques — a RR leva
**Öhlins Smart EC 2.0 semi-ativa**, com níveis de firmeza no painel. Se a RR entrar
alguma vez no catálogo, é entrada própria e do tipo eletrónico, como a Tiger 1200 e a
Multistrada V4 S.

### A ZX-10R fechada, e o manual da DesertX que era o manual errado

Duas motos da lista das sete que corriam no default `adj: "full"`. Uma fechou, a outra
nem devia ter começado.

**ZX-10R: os seis afinadores, todos com valor de fábrica.** O *service manual* 2021-2023
dá a página 13-6 inteira, e é dos manuais mais limpos que apanhei — sem ambiguidade
nenhuma no sentido de contagem. Tudo em **voltas**, compressão e retorno das duas pontas
contadas do duro, pré-carga da frente do mole (7 voltas), pré-carga de trás pelo
**comprimento da mola montada: 162,2 mm**. Passou a perfil `kawasaki_zx10r_2021`, com
`adjusters` explícitos no catálogo em vez do default.

Duas coisas que vale a pena não perder:

A primeira é que o manual cobre **duas motos** e é preciso ler o código. `ZX1002L/M` é a
ZX-10R, `ZX1002N` é a RR — separei-as pelos números de potência (203 PS às 13 200 contra
204 PS às 14 000). A RR sai de fábrica noutro sítio em quatro dos seis afinadores.
Ficaram escritos na nota do perfil, para o dia em que a RR entrar no catálogo.

A segunda é um aviso do próprio manual que passei para as notas: os afinadores da frente
estão repartidos pelas duas bengalas e a Kawasaki mete em caixa de aviso que **têm de
ficar iguais nas duas**. Não é conselho, é aviso de segurança.

As pressões confirmaram a estimativa que lá estava — 2,5 e 2,9 — mas o manual dá-as como
**valor único até 180 kg de carga**, sem coluna de a-dois. Preenchi as duas colunas com o
mesmo número em vez de deixar `null`, porque a ausência aqui não é falta de dado.

**DesertX V2: o manual não serve.** O ficheiro é o `OM_-_DesertX_-_EN_-_25_-_ED02`, que
é o manual da **937 de 2025** — exatamente a mesma fonte de onde já saiu o perfil
`ducati_desertx_kayaba`. Verifiquei linha a linha: os números batem todos certo com o que
já lá estava (frente 2/2/2 fixos com a carga, trás 6/17/26 de pré-carga em cliques e
compressão 3/2,5/2 voltas). **Zero informação nova.**

A entrada que falta é a **DesertX V2 de 2026, que é 890 cc e outra moto**. Continua sem
manual e continua a correr no default. É o mesmo erro que já tinha ficado escrito na
linha das pressões dela — a fonte diz, com todas as letras, «a nossa entrada é a V2 de
2026, que é outra moto». Da próxima vez leio a etiqueta da fonte antes de abrir o PDF.

**Estado:** 91 perfis. Motos visíveis sem perfil: 38, das quais 16 no default cru e 6 em
`adj: "full"`. Pressões: 85 de 120 verificadas por manual.

### Onde estão os manuais que faltam, e um caminho novo que funciona

Duas descobertas, e a segunda é a que interessa.

**As três BMW têm URL direto e estável.** O portal `manuals.bmw-motorrad.com` é uma
SPA e não se navega por fetch, mas os PDFs estão num caminho fixo e previsível:

```
https://manuals.bmw-motorrad.com/manuals/BA-Extern/IN/BA-INTERNET-COM/PDF/<ficheiro>
```

| Moto | Ficheiro |
|---|---|
| S 1000 RR | `S_0E21_RM_0520_01.pdf` |
| S 1000 R | `S_0E51_RM_1020_01.pdf` |
| M 1000 RR | `S_0E71_RM_0920_01.pdf` |

O padrão é `S_<código de tipo>_RM_<mês><ano>_<edição>.pdf`. Serve para qualquer BMW —
foi assim que já tinha saído o `R_0M11_RM_0321_01.pdf` da R 1250 GS Adventure.

**Estes PDFs abrem em texto por leitura remota, mas cortam antes da suspensão.** Testei
o da S 1000 RR: sai texto limpo, sem OCR, mas a extração pára por volta da página 103 de
~240. O capítulo de afinação está nas páginas **107 a 112** — falhou por quatro páginas.
Confirmei o que lá está pelo índice e pela vista geral: a S 1000 RR tem os seis
afinadores (`Rebound-stage damping` e `Compression-stage damping` à frente e atrás, mais
pré-carga nas duas pontas) e um **amortecedor de direção**. Isso já chega para o
`adjusters`, mas os valores de fábrica exigem o ficheiro em disco.

**A descoberta que muda o resto: o manualslib.com dá texto.** Isto contradiz o que estava
escrito acima sobre o manualpdf.pt (imagens) e o ownersmanuals2.com (anti-robô). O
manualslib serve **uma página por URL**, com `?page=N`, e o texto do manual vem no HTML —
tabelas incluídas. Sem verificação, sem OCR.

Testado na Street Triple: a página 160 do *Owner's Handbook* traz as **tabelas de afinação
da frente das três versões** (R, R-LRH e RS), com as cinco linhas de utilização — Track,
Sport, Solo Riding Road, Comfort, Rider and Passenger.

**Não copiei os números, e é de propósito.** A tabela vem achatada em texto corrido e a
ordem das colunas fica ambígua: os cabeçalhos «Compression Damping» e «Rebound Damping»
saem interleaved, e os expoentes das notas de rodapé (1 = voltas a apertar desde o
mole; 2 = voltas a abrir desde o duro) colam-se à coluna errada. São **quinze números por
versão** e trocar duas colunas dá exatamente o tipo de erro que a Tiger 900 e a Voge 625
já custaram. Precisa de ser lido com a página à vista, não inferido do texto achatado.

**O que isto abre:** as páginas de afinação de quase todas as motos que faltam estão
neste site, legíveis. O custo é um fetch por página e leitura cuidada das tabelas.
Índices já localizados na Street Triple (manual de 210 páginas):

| Página | Secção |
|---|---|
| 159 | Suspension |
| 160-161 | Front Suspension Spring Preload Adjustment |
| 162 | Front Suspension Rebound and Compression Damping Adjustment |
| 164 | Rear Suspension Spring Preload Adjustment |
| 165 | Rear Suspension Rebound Damping Adjustment |
| 166-167 | Rear Suspension Compression Damping Adjustment |

**Nota sobre a pré-carga traseira**, que é o buraco da Speed Triple e da Street Triple:
existe secção própria para ela (pág. 164), o que sugere que é ajustável e documentada.
Mas apareceu numa busca a frase de que na RS *não* é ajustável pelo condutor — vinda de
um resumo de motor de busca, não de página lida. **Não vale nada até alguém abrir a
página 164.** Fica como a primeira coisa a fazer por esta via.

### As três BMW fechadas, e a BMW não conta a precarga como toda a gente

Os três manuais chegaram e resolveram as três motos. O que demorou mais foi perceber que
a BMW **não usa a mesma unidade que as outras marcas** em duas das seis casas.

**A precarga não se conta.** Nem em voltas, nem em cliques, nem em milímetros de rosca à
vista. A BMW prescreve o **sag**, com piloto de 85 kg em cima, e manda regular até lá
chegar. Ficou como `pos` com o número na etiqueta, porque é o valor de fábrica e não uma
lacuna:

| | Sag à frente | Sag atrás |
|---|---|---|
| S 1000 RR | 40±2 mm | 35±2 mm (30±2 em pista) |
| S 1000 R | 50 mm | 40 mm |
| M 1000 RR | 35 mm | 30 mm |

**O amortecimento da frente também não são cliques a contar de um limite** — são escalas
graduadas pintadas nas bengalas, **amarela à esquerda para a compressão** e **vermelha à
direita para a extensão**. A BMW diz «posição 5», não «5 cliques do duro». `pos` outra
vez. Atrás é que se conta normalmente, a partir do duro: 5 cliques na RR e na M, 6 na R.

Vale a pena reparar no que a tabela acima diz: a **M 1000 RR sai de origem exatamente nos
valores que o manual da S 1000 RR reserva para a coluna de pista** — 35 e 30 mm. E a
S 1000 R é a mais macia por larga margem, com 50 mm à frente.

**Três avisos que ficaram nas notas:**

A **S 1000 RR e a S 1000 R têm DDC como opção de fábrica**. Com DDC, o amortecimento é
eletrónico e regula-se pelo menu — estes números não servem, só a precarga. A **M 1000 RR
não tem versão com DDC**: o capítulo de afinação dela não tem sequer as variantes
«with/without Dynamic Damping Control» que os outros dois manuais têm.

A coluna de **pista da S 1000 RR não entrou nos weightPoints**, de propósito. Pista não é
uma carga, é outra utilização, e misturar as duas coisas faria a app dar valores de pista
a quem só engordou a mochila. Ficou escrita na nota.

A **S 1000 R é a única com segunda carga**: a dois com bagagem, o amortecimento traseiro
passa a 5 cliques nas duas vias. A frente não muda e a precarga continua a ser pelo sag.

**Nota de método:** para mexer na precarga destas três é preciso elevador de motor — a
BMW mede o sag com a moto ao alto e depois com o piloto em cima, com ajuda de segunda
pessoa. Não é afinação de parque de estacionamento, e a app devia dizê-lo.

**Estado:** 94 perfis. Motos visíveis sem perfil: 35, das quais 13 no default cru. Em
`adj: "full"` sem `adjusters` sobram **três**: DesertX V2, Street Triple RS e MT-10.
Pressões continuam em 85 de 120 — a BMW não as publica no manual, o que já estava escrito.

### Street Triple RS: o manualslib abre, as tabelas não se leem, e apareceu um aviso

Fui pelo manualslib às páginas de suspensão do *Owner's Handbook* da Street Triple
(manual `2611112`, 245 páginas, o mesmo de onde saíram as pressões da pág. 232). O site
serve mesmo o texto. **Não escrevi um único número no catálogo, e explico porquê.**

**As tabelas saem achatadas e a ordem das colunas muda entre extrações.** Puxei a mesma
tabela da frente de duas edições diferentes do manual e os números vieram agrupados de
maneiras incompatíveis. Na edição de 210 páginas a coluna constante aparecia no meio; na
de 245 aparecia à cabeça. Os cabeçalhos «Compression Damping» e «Rebound Damping» vêm
partidos em pedaços («Compress», «ion», «Damp-», «ing») e espalhados, e os expoentes das
notas de rodapé desligam-se da coluna a que pertencem.

Dá para inferir **uma** coisa com segurança, e só uma: na Street Triple RS a coluna que
fica constante em **3,5** ao longo das cinco linhas é a pré-carga da frente — é a única
que não faz sentido variar por tipo de utilização. As outras duas, com valores 2 / 2 / 4 /
5,5 / 4 e 2 / 1 / 2 / 5 / 7, **não consigo atribuir**. Uma delas é compressão e a outra
extensão, e trocá-las é o erro da Tiger 900 outra vez, numa moto de 765 cc que anda em
pista. **Precisa da página à vista, não do texto achatado.**

**O que a página 175 deu, e isso sim é sólido:** a tabela traseira da **Street Triple R**
vem precedida de um aviso em caixa, citado à letra:

> *«The rear suspension unit spring preload is not rider adjustable. Any attempt to adjust
> the spring preload could result in a dangerous riding condition leading to loss of
> motorcycle control, and an accident.»*

E a tabela da R, ao contrário da da R-LRH que lhe está ao lado, **não tem coluna de
pré-carga** — só compressão e extensão. A R-LRH tem, e é Min/Min/Min/Min/Max.

**Porque é que isto interessa para lá da Street Triple:** é a primeira vez que apanhamos a
Triumph a dizer, por escrito, que uma pré-carga traseira **não é regulável pelo condutor**
em vez de simplesmente não a documentar. É exatamente o padrão do buraco da Speed Triple,
descrito mais acima — tabela do amortecedor só com retorno e compressão, e nada sobre
pré-carga. **Continua a não ser prova para a Speed Triple**, que é outra moto e outro
manual, mas muda a hipótese mais provável: em vez de «anel roscado não documentado», passa
a ser «pode simplesmente não existir». Vale a pena procurar este mesmo aviso no manual da
Speed Triple antes de assumir seja o que for.

**Não vi ainda a tabela traseira da RS** — está na página 176, e a 175 acaba na da R.

**Como continuar por aqui, se alguém quiser:** o caminho é descarregar o PDF do manualslib
(`/download/2611112/Triumph-Street-Triple-S.html`) e lê-lo em disco com extração por
layout, como se fez com os manuais BMW e Kawasaki. Aí as colunas mantêm-se alinhadas. Ler
página a página pelo HTML serve para **encontrar** e para **confirmar texto corrido** —
não serve para tabelas de afinação.

#### RESOLVIDO — o PDF em disco, e a tabela lê-se toda

Chegou o *Owner's Handbook* completo e confirmou o que estava escrito acima: **por HTML as
colunas não se leem, em disco leem-se todas**. A mesma tabela, extraída por layout, sai
com os cabeçalhos por cima dos números e as notas de rodapé no sítio.

E confirmou também que **eu tinha inferido bem a única coisa que me atrevi a inferir**: a
coluna constante em 3,5 é mesmo a pré-carga da frente. As outras duas eram
retorno 2/2/4/5,5/4 e compressão 1/2/5/7/5 — ou seja, se tivesse adivinhado, tinha 50%
de hipóteses de trocar Track (retorno 2, compressão 1) e de pôr a moto ao contrário em
pista.

**A pré-carga traseira não existe, e é oficial.** O aviso que tinha aparecido na página da
R aparece igual na da RS:

> *«The rear suspension unit spring preload is not rider adjustable. Any attempt to adjust
> the spring preload could result in a dangerous riding condition leading to loss of
> motorcycle control, and an accident.»*

Ficou `na` com a razão escrita, e o `adjusters` do catálogo passou a `rPre: false`. **A
ficha comercial da Triumph diz «fully adjustable» para o Öhlins STX40** — é o erro do
costume das fichas, e é o motivo pelo qual este catálogo se faz por manuais.

**Um detalhe que só o manual dá:** na **RS** os afinadores COM e TEN estão no topo das
DUAS bengalas; na **R** estão os dois só na bengala DIREITA. São motos diferentes na
mesma página, e quem trocar afina metade da forquilha.

Unidades: frente em **voltas**, trás em **cliques** com o primeiro batente a contar como 1
— a mesma convenção da Speed Triple. Colunas de uso, à frente (retorno/compressão) e
atrás: Track 2 e 1 / 8 e 7 · Sport 2 e 2 / 10 e 10 · Road 4 e 5 / 14 e 20 · Comfort 5,5 e
7 / 20 e 20 · A dois 4 e 5 / 9 e 9. A pré-carga da frente é 3,5 voltas em todas.

**Sobre a Speed Triple:** este manual reforça a hipótese mas continua a não a provar. A
Street Triple RS e a Speed Triple 1200 RS são motos e manuais diferentes. O que mudou é
que agora sabemos que a Triumph **escreve o aviso quando a pré-carga não existe** — logo,
a ausência de aviso no manual da Speed Triple é informação, não silêncio. Vale a pena
procurar a caixa de aviso lá antes de assumir.

**Estado:** 95 perfis, 88 afinadores com tabela por carga verificados. Motos visíveis sem
perfil: 34, das quais 12 no default cru. Em `adj: "full"` sem `adjusters` sobram **duas**:
DesertX V2 e MT-10.

### O buraco da Speed Triple fecha-se — e o manual que o fechou já cá estava

Depois de a Street Triple RS mostrar que a Triumph **escreve o aviso quando um afinador
não existe**, voltei ao manual da Speed Triple 1200 RR/RS que já tínhamos em disco desde o
início. Duas coisas.

**A primeira é um erro nosso.** O perfil dizia, na pré-carga da frente, «o manual não
publica um valor de fábrica». **Publica.** Está na página 141, numa tabela própria de
«Spring Preload Settings», separada da tabela de amortecimento — e é por isso que passou
despercebida na primeira leitura, que foi à tabela de compressão e retorno:

| | Pré-carga da frente |
|---|---|
| Speed Triple 1200 RS | **4 voltas** |
| Speed Triple 1200 RR | 7 voltas |

Constante nas cinco colunas, incluindo a dois — a Triumph não a faz variar. Corrigido de
`pos` para `tu_soft(4)` e acrescentado aos `weightPoints`.

**Lição de método:** a Triumph parte a afinação da frente em **duas tabelas separadas**,
uma só de pré-carga e outra de amortecimento. Quem for à segunda e parar, conclui que a
primeira não existe. Aconteceu-nos aqui, e provavelmente vale a pena reconferir os outros
perfis Triumph pela mesma razão.

**A segunda é a pré-carga traseira, que era o buraco.** Não apareceu número — mas deixou
de ser dúvida sobre se existe. O manual diz, na abertura da secção da RS:

> *«The Speed Triple 1200 RS front and rear suspension is manually adjustable for spring
> preload, rebound and compression damping.»*

E, ao contrário da Street Triple RS e da Street Triple R, **não há caixa de aviso** a dizer
que não é regulável pelo condutor. Agora que sabemos que a Triumph escreve esse aviso
quando o afinador não existe, a ausência dele aqui é **informação, não silêncio**.

**Conclusão: `pos` era a leitura certa, e agora tem fundamento em vez de ser prudência.**
A pré-carga traseira da Speed Triple RS existe, é manual, e a Triumph simplesmente não lhe
publica valor de fábrica em lado nenhum — nem na tabela do amortecedor, nem no capítulo de
afinação, nem no manual de oficina. Fica escrito na nota do perfil para quem lá voltar não
repetir a investigação.

**Estado:** 95 perfis, 89 afinadores com tabela por carga verificados (era 88). Motos
visíveis sem perfil: 34, das quais 12 no default cru. Em `adj: "full"` sem `adjusters`
sobram duas: DesertX V2 e MT-10.

### MT-10: à terceira, e tem seis afinadores mais um sétimo

Chegaram dois manuais errados antes deste — os dois da **MT-10 SP** (`MTN1000D` e
`MTN1000DP`), que é Öhlins ERS **eletrónica**, com compressão e extensão pelo painel
(`Fr COM`, `Fr REB`, `Rr COM`, `Rr REB`) e só a pré-carga à mão. O que serve é o
`MTN1000G`, código de publicação **B67-28199-200**. **A letra a seguir a MTN1000 é o que
distingue as duas motos** — vale a pena escrever isto, porque o nome do ficheiro não
distingue nada.

**A MT-10 de série tem sete afinadores, não seis.** Atrás, a compressão está partida em
**rápida** e **lenta**, com unidades diferentes: a rápida em **voltas** (3 do duro) e a
lenta em **cliques** (12 do duro). Foram para `hsComp` e `lsComp`, como nas Kove e nas
KTM de rali. O `comp` normal ficou com o valor da lenta, que é a que o condutor mexe.

E as unidades trocam de ponta para ponta, o que é típico da Yamaha:

| | Unidade | Padrão | Conta a partir de |
|---|---|---|---|
| Pré-carga frente | voltas | 9 | mole |
| Compressão frente | cliques | 17 | duro |
| Extensão frente | cliques | 6 | duro |
| Pré-carga trás | **milímetros** | 81,5 mm (distância A) | — |
| Compressão lenta trás | cliques | 12 | duro |
| Compressão rápida trás | voltas | 3 | duro |
| Extensão trás | cliques | 11 | duro |

A pré-carga traseira não se conta: mede-se o comprimento da mola montada, e mais comprida
é mais dura. Margens 77,5 a 85,5 mm. Precisa da chave especial do kit suplementar, e a
contraporca aperta a 25 Nm contra o anel.

**O manual não dá tabela por carga** — dá mole, padrão e duro. Este perfil leva os
PADRÃO, e por isso não tem `weightPoints`.

**Estado:** 96 perfis. Motos visíveis sem perfil: 33, das quais 11 no default cru. Em
`adj: "full"` sem `adjusters` sobra **uma**: a DesertX V2, que continua sem manual porque
é a 890 de 2026 e não existe ficheiro público que eu tenha encontrado.

### Duas auditorias sem manual nenhum, e um erro meu revertido

**Auditoria 1 — a lição da Speed Triple aplicada aos outros Triumph.** Depois de descobrir
que a Triumph parte a afinação da frente em duas tabelas separadas (uma só de pré-carga) e
que por isso tínhamos escrito «o manual não publica» quando publicava, varri os perfis
todos à procura de pré-cargas marcadas como `pos`.

**Nenhum outro Triumph tem o mesmo problema.** A Scrambler 1200 XE e a Tiger 900 Rally Pro
dizem «de fábrica no mínimo» e a Tiger 900 GT dá a escala por carga — são valores do
manual, não ausências. O único caso que restava era a pré-carga TRASEIRA da Speed Triple,
já resolvido acima.

De caminho ficou a lista completa das 60 e tal pré-cargas em `pos` no catálogo, e a maioria
são legítimas: comprimento de mola (Aprilia, Kawasaki, Macbor, QJ), posição numerada
(Suzuki, Honda, Yamaha XT1200Z), sag em mm (BMW) ou anel que exige ferramenta especial
(Suzuki DR-Z, GSX-R1000R). Só as Voge e três QJ é que são ausências verdadeiras.

**Auditoria 2 — e aqui apanhei-me a mim.** Ao rever as pressões, dei conta de que 21 linhas
já verificadas por manual têm a coluna de «carregado» a `null`. Fui ver se era lacuna.
**Não é: o `null` tem significado no código.**

```ts
frontLoadedBar:  number | null;  // null = igual ao solo
```

E o ecrã `pneus.tsx` usa-o mesmo: `{loadedBar !== null && (...)}` — com `null`, o cartão
«Carregado» **não aparece**; com valor, aparece a laranja de aviso (`C.warn`).

**Ou seja, a alteração que eu tinha feito à ZX-10R estava errada.** Tinha preenchido as
duas colunas com o mesmo número (2,5 e 2,9) achando que era mais honesto do que deixar
`null`. O efeito real na app é pior: mostra um cartão «Carregado» **a laranja de aviso**
com o mesmo valor do solo, o que sugere ao condutor que há uma pressão diferente a
respeitar quando não há. Revertido para `null`, que é a convenção da casa.

A Voge 625 DSX fica como está — ali os valores são mesmo diferentes (2,2 a solo, 2,5 a
dois), portanto o cartão deve aparecer.

**Lição:** antes de escolher entre `null` e um valor repetido, ver o que o consumidor faz
com o `null`. Neste projeto está documentado no tipo, à distância de um grep.

### As 11 sem `adjusters`: quatro fechadas por manual, e duas estavam ao contrário

Ataque às motos que corriam no default do nível `adj`. **Passaram de 11 para 7**, e o que
saiu não foi só preenchimento — **duas das quatro estavam com o oposto do que a moto tem**.

**Descoberta de método: dois portais servem PDFs oficiais por URL direto.**

- **Yamaha**, CDN oficial: `cdn2.yamaha-motor.eu/prod/owner-manuals/Motorcycles/P<código>E.PDF`,
  onde `<código>` é a referência sem hífenes. `B7N-28199-E0` → `PB7N28199E0E.PDF`. Serve
  para qualquer Yamaha de que se saiba a referência — e nós temos a referência de quase
  todas, porque foram a fonte das pressões.
- **KTM**, via ktmshop.se: `ktmshop.se/documents/<AA>_<artigo>_en_OM.pdf` e
  `ktmshop.se/bike-manuals/<AA>_<artigo>_en_OM.pdf`, com `AA` = ano de modelo. Os números
  de artigo já estavam registados neste documento, da altura das pressões.

Os dois abrem em texto por leitura remota. Cortam por volta de 100 000 caracteres, mas o
**índice vem sempre no princípio** — e nos manuais KTM o índice do capítulo «Tuning the
chassis» **lista todos os afinadores que a moto tem**. Isso chega para o `adjusters` sem
sequer chegar ao corpo do capítulo.

| Moto | O que a app assumia | O que o manual diz |
|---|---|---|
| **Yamaha MT-09** | frente precarga+extensão, trás precarga+extensão | frente as TRÊS (extensão à direita, compressão à esquerda), trás precarga+extensão |
| **KTM 790 Duke** | frente precarga+extensão, trás precarga+extensão | **só precarga traseira** |
| **KTM 890 Adventure** | frente precarga+extensão, trás precarga+extensão | frente NADA, trás precarga+extensão |
| **KTM 390 Adventure** | só precarga traseira | frente compressão+extensão e SEM precarga, trás precarga+extensão |

**As duas que estavam ao contrário** são a 390 Adventure e o 790 Duke, e em sentidos
opostos. A 390 estava marcada `fixed` e a app mostrava-lhe só precarga traseira, quando ela
tem compressão e extensão na forquilha e precarga é que não tem. O 790 Duke estava
`partial` e a app oferecia-lhe quatro afinadores quando a moto só tem um — o capítulo
inteiro de afinação do chassis do manual tem **uma única entrada**.

**Perfis completos que saíram de caminho:** MT-09 (`yamaha_mt09_2021`) e 390 Adventure
(`ktm_390_adv_2023`).

Duas coisas da MT-09 que vale a pena não perder: o amortecedor **não tem compressão**, e a
distância A da precarga da frente funciona **ao contrário da MT-10** — aqui mais curta é
mais dura (15 mm de fábrica), lá é o inverso. É o mesmo nome de medida a significar coisas
opostas em duas Yamaha da mesma gama.

Da 390 Adventure ficou **um número por ler**: a extensão traseira, secção 12.5, que caiu
na parte cortada do PDF. O afinador está confirmado pelo índice e pelo capítulo; falta o
valor. Está marcado como tal no perfil.

**As sete que restam, e porquê:**

| Moto | Obstáculo |
|---|---|
| Honda NC750X e X-ADV | A Honda não publica manuais em PDF aberto; as pressões vieram da etiqueta |
| Triumph Tiger Sport 660 | O handbook Trident/Tiger Sport existe mas só via manualslib, e por HTML não se leem tabelas |
| Voge 525 DSX e AC 525X | Sem manual; o site da Voge esteve à venda no GoDaddy |
| Kawasaki Versys 650 | Só resultados de fórum — nada citável |
| Ducati DesertX V2 | É a 890 de 2026; não encontrei manual publicado |

**Estado:** 98 perfis. Motos visíveis sem perfil: 31, das quais 7 no default cru.

### 390 Adventure fechada e Versys 650 com uma ausência confirmada

**390 Adventure: o número que faltava apareceu.** O manual de 2022 (art. 3214576en) tem a
secção 12.5 inteira. A extensão traseira é **10 cliques** do duro no standard — 15 em
Comfort, 5 em Sport, 10 com carga máxima. Os dois manuais lidos, 2022 e 2023, dão
exatamente os mesmos valores em todas as casas, o que é uma verificação cruzada de graça.

Ficou também uma nota que só o manual de 2022 traz: **a precarga traseira tem 10 posições**,
não é contínua. O perfil passou a `oem_manual` completo — só a precarga da frente é que
não existe, e isso é a moto, não é lacuna.

**Versys 650 (KLE650J): três afinadores, não quatro.** O manual do proprietário português
`99824-0018` é um daqueles calhamaços multi-modelo da Kawasaki, e a leitura tem de ser
feita com atenção aos códigos:

- **Frente**, pág. 1192-1193: precarga no topo da bengala **esquerda**, extensão no topo da
  **direita**. Sem compressão.
- **Trás**, pág. 1231: precarga por afinador no suporte do poisa-pés traseiro direito.

**A extensão traseira não existe**, e isto tem de ser lido com cuidado porque a evidência é
pela negativa. O bloco do amortecedor tem o título «Amortecedor da suspensão traseira
(KLE650J, KLZ1100A/B, ZX1100H)», mas a subsecção da extensão, **dentro desse mesmo bloco**,
é titulada «Afinação da força de recuperação do amortecedor **(KLZ1100A/B, ZX1100H)**» — e
omite a KLE650J. É a convenção do manual: quando uma subsecção só serve parte do grupo, os
códigos são repetidos. Noutro sítio, quando serve todos os equipados, escreve «(modelos
equipados)». A omissão aqui é deliberada.

O default `partial` acertava em três e falhava na quarta.

**Não saiu perfil da Versys 650**, e a razão é chata: os valores «Standard» deste manual
vivem dentro de figuras, não de texto, e saem em branco na extração. Ficam os afinadores,
que é o que estava a faltar. Para os números seria preciso o *service manual* Kawasaki,
que é a via que já funcionou três vezes.

**Estado:** 98 perfis. Motos visíveis sem perfil: 31, das quais **6** no default cru — as
duas Honda, as duas Voge, a Tiger Sport 660 e a DesertX V2.

### X-ADV e Tiger Sport 660: uma correção e uma confirmação

**Honda X-ADV: mais uma que estava ao contrário.** Estava em `fixed`, ou seja, a app
mostrava-lhe só precarga traseira. O manual (pág. 111-113) dá-lhe **precarga E extensão à
frente** — só a compressão é que não existe:

| | Unidade | Fábrica | Conta de |
|---|---|---|---|
| Precarga frente | voltas | 7 (de 15) | mole |
| Extensão frente | voltas | 2 | duro |
| Precarga trás | posição | 4 de 10 | — |

A extensão da frente tem uma marca de punção no afinador que deve ficar alinhada com uma
marca de referência quando está nas 2 voltas — dá para confirmar a olho sem contar.

Duas notas de ferramenta: a precarga da frente mexe-se com a chave de caixa do kit, a
extensão precisa do **afinador BFR**, também do kit. E o manual avisa para **não saltar
direto da posição 1 para a 10** da precarga traseira, nem ao contrário — passa-se pelas
intermédias ou estraga-se o amortecedor.

**Tiger Sport 660: o default estava certo, e agora tem fonte.** É a primeira vez nesta
série de auditorias que a heurística acerta. O manual não deixa margem: *«la suspensión
delantera no es ajustable»*. Só há um afinador na moto inteira, a precarga traseira, por
manípulo ao lado do amortecedor alcançável pelo lado esquerdo.

O manual dá quatro estados de carga: só piloto no **mínimo**, só piloto com carga a **30
cliques**, e com passageiro no **máximo** — com ou sem carga. Não publica o total de
cliques do afinador, por isso o mínimo e o máximo ficam sem número absoluto. Só o valor
do meio é que é numerado, e ficou no perfil.

**Armadilha deste manual:** cobre a **Trident e a Tiger Sport lado a lado**, com tabelas
uma por baixo da outra na mesma página, e **os dois sistemas são diferentes**. A Trident
usa anel roscado com chave em C e sete posições numeradas (1 mínimo, 7 máximo); a Tiger
Sport usa manípulo com cliques e escala não numerada. Quem leia a tabela errada põe «7»
numa moto que não tem posição 7.

**Estado:** 100 perfis. Motos visíveis sem perfil: 29, das quais **4** no default cru —
Honda NC750X, as duas Voge e a DesertX V2.

**Nota de manutenção deste documento e do `bikes.ts`:** o cabeçalho do `bikes.ts` ainda diz
que no manualslib «as páginas são imagem e o texto não é extraível». Isso é verdade para a
via que estava a ser usada na altura, mas já não é a história toda — ver a secção mais
acima: as páginas servidas em HTML **dão texto**, o que não dão são tabelas alinhadas.
Vale a pena corrigir esse comentário quando alguém lá mexer.

### Sync com o Supabase: e o bundle é que estava atrás em duas linhas

Corrido o `verificar-sync` depois do trabalho de hoje: 2 pressões e 14 perfis divergentes.
Doze eram o esperado — trabalho de hoje que ainda não tinha subido. **Duas andavam ao
contrário**, e essas é que interessam.

O `cfmoto_1000mtx` tinha, no bundle, `source: 'mfzstudio.com/moto/cfmoto/'`. No Supabase
já dizia **«Manual do proprietário CFMOTO 1000MT-X (PT, v260209), pág. 16 e 196-199»**.
Alguém verificou aquele perfil por manual, atualizou a base e nunca escreveu de volta no
código. Consequência prática: a app mostrava proveniência de **manual** quando estava
online e de **site** no primeiro arranque e offline — para a mesma moto e os mesmos
números. O `cfmoto_800nk` tinha a mesma doença, mais leve: faltava uma página na lista.

Corrigidos os dois no bundle, que era o lado errado.

**Isto é o `verificar-sync` a fazer exatamente o que foi escrito para fazer,** e vale a
pena sublinhar porque é fácil assumir que o código está sempre à frente da base. Não está.
Sempre que o relatório disser que uma linha diverge, a pergunta não é «o que falta subir»
mas «qual dos dois lados está certo» — que é, aliás, o que a mensagem final do script já
diz.

**Os restantes doze subiram para o Supabase:** dez perfis novos (as três BMW, ZX-10R,
X-ADV, 390 Adventure, Street Triple RS, Tiger Sport 660, MT-09 e MT-10) e dois alterados
(Speed Triple RS com a pré-carga da frente corrigida, Voge 625 DSX com o sentido de
contagem). Mais as duas linhas de pressão, ZX-10R e Voge 625 DSX.

Base e bundle ficam nos mesmos **100 perfis**, 74 deles por manual.

**Nota de ambiente:** o `tsx` nunca esteve instalado. Os dois scripts foram escritos a
chamá-lo diretamente mas a dependência não está no `package.json` — quem correr
`npm run verificar-sync` num clone limpo apanha `command not found`. Funciona com
`npx tsx`, mas o certo é `npm i -D tsx`.

## Quem usa mesmo a app — e porque é que o catálogo tem andado a crescer no sítio errado

**4 de agosto de 2026.** Primeira vez que se foi ao PostHog perguntar em vez de assumir.
As duas consultas estão em `docs/posthog-consultas.md`. O resultado reorganiza as
prioridades todas, por isso fica escrito aqui em vez de num comentário.

### Utilizadores por marca, 90 dias

| Marca | Pessoas | Motos no catálogo | Com perfil | Cobertura |
|---|---:|---:|---:|---:|
| **CF Moto** | **81** | 8 | 7 | 88% |
| **Voge** | **59** | 8 | 3 | **38%** |
| **QJ Motor** | **18** | 9 | 5 | 56% |
| KTM | 14 | 15 | 12 | 80% |
| Honda | 11 | 13 | 9 | 69% |
| Yamaha | 9 | 12 | 8 | 67% |
| Suzuki | 6 | 7 | 6 | 86% |
| BMW | 5 | 10 | 4 | 40% |
| Kove | 5 | 7 | 7 | 100% |
| Kawasaki | 4 | 7 | 4 | 57% |
| Triumph | 3 | 7 | 7 | 100% |
| Ducati | 2 | 15 | 11 | 73% |
| Aprilia | 1 | 5 | 3 | 60% |

**As quatro marcas chinesas são 163 dos 218 utilizadores — 75%.** CFMoto, Voge, QJ e
Kove. Não é uma tendência, é a base inteira.

### O que isto diz que ninguém tinha percebido

**A CFMoto é a prova de que o método funciona.** É a maior marca, com 81 pessoas, e não
aparece uma única vez na consulta das motos sem dados — 88% de cobertura, a única em
falta é a 1000 SR-R, que está oculta. Todo o esforço que se pôs nos manuais CFMoto
pagou-se. Isto é importante: o problema não é a abordagem, é para onde ela tem apontado.

**A Voge é a pior combinação possível.** Segunda marca com mais utilizadores, **38% de
cobertura**, e **3 das 8 motos ocultas**. A moto mais usada da app inteira é a
**Voge 900 DSX, com 45 pessoas** — 5,6× a segunda — e o perfil dela tem **quatro das
seis células sem número**: os três afinadores da frente e a compressão traseira.
A maior fatia da base olha para AJUSTA onde devia ver um valor.

**A Triumph e a Kove estão a 100% de cobertura, para 3 e 5 pessoas.**

### O teste que torna isto inatacável

As nove motos em que se trabalhou a 4 de agosto — ZX-10R, MT-10, MT-09, X-ADV,
Tiger Sport 660, S 1000 RR, S 1000 R, M 1000 RR, Street Triple RS — **estavam todas sem
perfil até essa data**. Logo, quem as tivesse escolhido apareceria na consulta das motos
sem dados. Aparece **uma pessoa**, na Street Triple RS. As outras oito: zero.

O trabalho foi bom e corrigiu erros reais — duas motos estavam descritas ao contrário do
que são. Mas serviu praticamente ninguém.

### Ordem de trabalhos que sai daqui

1. **Valores da frente da Voge 900 DSX.** 45 pessoas. Vale mais do que os nove perfis
   de 4 de agosto somados. O documento já regista as tentativas falhadas (manual PT,
   manual EN DS900X, OCR às figuras, fórum 900dsx.com) — mas nenhuma foi pela via dos
   importadores nacionais, que foi o que resolveu a QJ.
2. **As cinco Voge sem perfil**, três delas ocultas: 650 DSX, 525 DSX, 525 R, R625,
   AC 525X.
3. **QJ SRT 600 SX** — 8 pessoas, segunda moto mais escolhida sem dados, e está
   `hidden: true`. Hoje nem a encontram no seletor.
4. **Yamaha MT-07** — 6 pessoas, e é barata: temos a referência `1WS-28199-E3` e o
   padrão do CDN da Yamaha.

### Política de `hidden`, a rever

Esconder uma moto é a decisão certa quando a alternativa é inventar números. Mas a
SRT 600 SX tem 8 utilizadores conhecidos que a escolheram antes de ser ocultada, e hoje
não a encontram. Talvez a resposta certa não seja esconder, mas mostrar com um estado
honesto de «sem dados ainda» — a app já sabe dizer isso célula a célula. Fica como
questão de produto, não de dados.

### Voge 900 DSX: a frente não existe em lado nenhum, e a compressão traseira foi decidida

**A frente está encerrada, e a resposta é que a Voge nunca publicou aqueles valores.**
Depois da consulta do PostHog tentou-se a via que faltava — o **service manual em
espanhol** (`900dsx.com`, ed. 07/2025, Loncin). Não serve, e pela mesma razão que o
service manual da Speed Triple não serviu: **manuais de oficina têm desmontagem, não
afinação**. O capítulo 9 lista as peças da forquilha e como a tirar, e mais nada.

São agora **cinco documentos independentes** sem os valores da frente: manual do
proprietário português, manual inglês DS900X, OCR às figuras, fórum 900dsx.com e o
service manual espanhol. Acrescente-se que a **800 DSX Rally**, cujo manual é o mais
completo da gama Voge, também não prescreve amortecimento à frente — só dá a precarga,
19 mm. Não é lacuna nossa. **Não voltar a procurar.**

### A compressão traseira: valores importados, e porquê

Estava vazia — «existe, por parafuso no reservatório de gás, mas o manual omite-a».
Ficou preenchida com **10 / 8 / 6 cliques do duro**, importados do manual da
**800 DSX Rally**.

**A justificação, para quem lá voltar:** as duas motos têm o mesmo amortecedor, e a
precarga e a extensão batem certo **nos três pontos de carga** — 6/16/21 e 18/16/14,
iguais ao clique. Dois afinadores idênticos em três cargas é prova forte de ser a mesma
unidade com a mesma calibração. **Não é prova de que o terceiro também seja**, e por isso
o valor está etiquetado na própria célula («Inferido da 800 DSX Rally») e explicado na
nota do perfil.

**O que mudou face à decisão anterior de não copiar:** nada na evidência. Mudou o custo
de não decidir. Enquanto era uma célula vazia entre muitas, a prudência era barata.
Sabendo que esta é a moto mais usada da app e que são **45 pessoas** a olhar para um
AJUSTA num afinador que a moto tem, a prudência passou a ter preço. Se aparecer um manual
da 900 que contrarie estes números, ganha o manual.

**Nota de método:** este é o segundo caso em que a 800 DSX Rally serve de referência para
outra Voge — o primeiro foi o sentido de contagem da 625 DSX. É o manual mais completo da
gama e vale a pena tratá-lo como a fonte de recurso da marca, sempre com a inferência
escrita.

### Quatro Voge fechadas pelos importadores nacionais, e duas saem das ocultas

A via que destrancou a QJ — importadores nacionais em vez do site global — funciona
igual para a Voge. Ficam registados os dois sítios, porque são reutilizáveis:

- **`vogeitaly.it/wp-content/uploads/`** — ficheiros `UM-VOGE-<Modelo>_<data>.pdf`.
  **Atenção aos nomes:** a Voge Itália não usa a nomenclatura internacional. **Valico**
  é a gama DSX e **Trofeo** é a ACX. A AC 525X chama-se lá Trofeo 525ACX, e foi por isso
  que nunca aparecia nas buscas.
- **`vogespain.es/wp-content/uploads/`** — ficheiros `Manual-de-Propietario-Voge-*.pdf`.

Os dois servem PDF de texto, sem anti-robô e sem OCR.

**As quatro dizem exatamente a mesma coisa: um único afinador na moto inteira.**

| Moto | Manual | Afinadores |
|---|---|---|
| 650 DSX | Valico 650DSX ABS (IT, 08/2021), pág. 39 | só precarga traseira |
| 525 DSX | Valico 525DSX (IT, 07/2023), pág. 43 | só precarga traseira |
| AC 525X | Trofeo 525ACX (IT, 12/2022), pág. 37 | só precarga traseira |
| 525 R | Manual del propietario 525R (ES), pág. 42 | só precarga traseira |

Nenhuma tem capítulo de afinação da frente, e em nenhuma a forquilha é descrita como
regulável. As quatro passam a `adj: "fixed"` — a 650 DSX e a 525 R estavam em `partial`,
o que lhes atribuía quatro afinadores inexistentes.

**Duas saem das ocultas.** A 650 DSX e a 525 R estavam fora do seletor por falta de
fonte. A política do catálogo diz «tira-se o `hidden` assim que aparecer o manual» — foi
o que se fez. Fica só a **R625** oculta, de toda a marca.

### O detalhe que mais interessa: a 650 DSX roda ao contrário

Na **650 DSX**, o sentido horário **ALIVIA** a precarga:

> *«ruotare in senso orario per ridurre il precarico, ruotare in senso antiorario per
> aumentare il precarico»*

Nas **525 DSX**, **AC 525X** e **525 R** é exatamente o inverso — horário endurece.

Não é subtileza tipográfica: quem seguir a instrução errada amolece a moto quando queria
endurecê-la, precisamente ao carregá-la para viajar a dois. Está escrito no `countNote`
de cada uma das quatro, com aviso cruzado.

**É mais uma prova de que não se copia entre modelos da mesma marca sem ler.** Já
tínhamos o caso da 625 DSX, cujo manual inglês contradiz a física, e o da 900 DSX, cujo
fórum numera os parafusos da forquilha ao contrário do manual.

**A 525 R tem ainda um aviso que vale a pena a app repetir:** a Voge diz que a precarga
precisa de ferramenta especial e que o trabalho deve ser entregue a oficina autorizada,
com aviso de PERIGO a dizer que um ajuste ao acaso reduz o controlo da moto. A célula
mostra «OFICINA» em vez de um número.

**Estado:** 104 perfis. Motos visíveis sem perfil: 27, das quais **2** no default cru —
Honda NC750X e DesertX V2. Voge passa de 38% para **88% de cobertura**, com 59
utilizadores.

### CFMoto 700MT: o perfil mais usado da app estava errado em três coisas

Vinha da consulta 2 do PostHog. **53,4% dos cálculos corriam sobre dados do
`mfzstudio.com`** e não sobre manuais, e a suspeita caiu no 700MT: era o **único perfil
CFMoto sem manual**, na marca com **81 utilizadores**, a maior da app.

Confirmou-se, e pior do que se esperava. O manual oficial (**CF700-9F**, pág. 81-83,
em `a.storyblok.com/f/176629/x/03fd1938b7/700mt.pdf` — CDN da própria CFMOTO) contradiz
o perfil em três pontos:

| | O que lá estava (mfzstudio) | O que o manual diz |
|---|---|---|
| Compressão da frente | 10 cliques | **não existe** — a forquilha só tem extensão |
| Extensão traseira | 7 cliques do DURO | **4 cliques do MOLE** |
| Tabela por carga | quatro pontos de peso | **não existe** — valor único por afinador |

**O segundo erro é o mais instrutivo.** O manual diz «Factory setting: 4. Total available
settings: 7±1». O 7 que estava no perfil como valor de fábrica é, quase de certeza, o
**total de posições do afinador** lido como se fosse a afinação. E a direção estava
invertida por cima disso. O perfil trazia até um comentário a dizer «REVERSED vs other
CFMOTO», o que sugere que quem o escreveu reparou na anomalia e a racionalizou em vez de
a questionar. É exatamente o padrão que o `verificar-coerencia` foi feito para apanhar —
mas este passou-lhe ao lado, porque a curva inventada era internamente coerente.

**A forquilha do 700MT tem UM afinador.** Extensão, 6 cliques do mole, de 12±2 no total.
Sem compressão e sem precarga. O perfil antigo oferecia dois números para um afinador só.

**O que muda no `confidence`:** o perfil tinha `weightPoints` sem `dataQuality`, e a
`calcConfidence` classifica isso como `real_mfz` **em qualquer peso**. Ou seja, todos os
cálculos do 700MT — na marca com mais utilizadores — contavam para os 53,4%. Agora, com
manual e sem tabela por carga, dá `real_oem` ao peso base e `brand_formula` fora dele.
É a leitura honesta: a CFMOTO **não publica curva por peso** para esta moto.

**Efeito esperado na consulta 2:** o `real_mfz` deve cair de forma visível e o `real_oem`
subir. Vale a pena voltar a correr daqui a um mês e comparar com a leitura de agosto,
que ficou registada em `docs/posthog-consultas.md`.

**Nota sobre os totais:** os «afinadores com tabela por carga verificados» do
`verificar-coerencia` desceram de 90 para 86, e isso é bom — desapareceram quatro linhas
de uma curva que ninguém publicou.

**Sobram 18 perfis sem manual**, agora concentrados em marcas de baixa utilização: nove
KTM (14 pessoas), quatro Kove (5), dois Honda Transalp (11), dois Suzuki V-Strom (6) e um
Yamaha Ténéré (9). Nenhum tem o peso que o 700MT tinha.

### ERRO REVERTIDO: o 700MT foi reescrito a partir do manual de outra moto

**Aconteceu a 4 de agosto de 2026 e foi corrigido no mesmo dia.** Fica escrito com
detalhe porque a lição é mais valiosa do que o estrago.

**O que se fez.** A consulta 2 do PostHog mostrou 53,4% dos cálculos a correr sobre
dados do `mfzstudio.com`. A suspeita caiu no 700MT — único perfil CFMoto sem manual, na
marca com 81 utilizadores. Procurou-se o manual, encontrou-se
`a.storyblok.com/f/176629/x/03fd1938b7/700mt.pdf` — **na CDN da própria CFMOTO**, com a
capa a dizer «OWNER'S MANUAL CF700-9F» e, por baixo, «700MT». O perfil foi reescrito a
partir dele e subido para o Supabase.

**Como se apanhou.** Ao ir buscar as pressões ao mesmo manual, a linha dos pneus dizia
**120/70 ZR17 à frente e 160/60 ZR17 atrás**. Não é um pneu de trail. Foi isso que
levantou a dúvida.

**O manual é de outra moto.** Não é uma linha copiada por engano — são **cinco campos
independentes** a não bater com a ficha oficial da CFMOTO UK:

| | PDF «700MT» | 700MT real |
|---|---|---|
| Pneu à frente | 120/70 ZR17 | 110/80 R19 |
| Pneu atrás | 160/60 ZR17 | 150/70 R17 |
| Peso em ordem de marcha | 218 kg | 240 kg |
| Distância entre eixos | 1418 mm | 1445 mm |
| Potência | 49 kW @ 9000 | 50 kW @ 9500 |

O que batia certo — 693 cc, 11,6:1 de compressão — é a **mecânica**, que a CFMOTO
partilha entre modelos. O que não batia é tudo o que descreve o **chassis**.

**Revertido**, no código e no Supabase, para o estado anterior.

### As três lições

**1. A capa de um PDF não é prova de que modelo ele descreve.** Já tínhamos apanhado
nomes comerciais a divergir (Valico/DSX na Voge) e manuais multi-modelo a exigir leitura
de códigos (ZX1002L/M contra N, MTN1000G contra D). Isto é pior: o documento **afirma**
ser de um modelo e não é.

**2. O teste barato existe e não foi feito.** Antes de escrever qualquer valor tirado de
um manual, **confrontar dois ou três números de chassis** — medida de pneu, peso, distância
entre eixos — com a ficha do fabricante. Leva um minuto e teria apanhado isto antes de
tocar em dados. **Passa a ser regra.** Repare-se que a medida de pneu já estava no nosso
catálogo: bastava compará-la.

**3. O erro entrou justamente porque a investigação estava a correr bem.** Vinha de uma
consulta certeira, sobre a moto certa, com uma hipótese correta — e encontrou-se um
documento que parecia confirmá-la. Quanto melhor a pista, menos se questiona o que ela
devolve.

### O 700MT fica pior do que estava, e é preciso dizê-lo

O perfil voltou aos valores do mfzstudio, mas a investigação deixou **prova nova de que
esses também estão errados**: a ficha da CFMOTO UK diz que a moto tem forquilha de 43 mm
com **precarga e extensão**, e o perfil diz que não tem precarga à frente e tem
compressão. Um dos dois engana-se sobre que afinadores a moto tem.

O perfil ficou marcado como **SOB SUSPEIÇÃO** na nota, e o `adjusters` foi retirado do
catálogo em vez de se afirmar uma coisa que não sabemos.

**Continua a ser a moto número um a precisar de manual** — e agora sabe-se que o
candidato óbvio, o PDF da CDN da CFMOTO, não serve.

### Pressões Voge: quatro linhas corrigidas, e a regra de verificação a funcionar

Primeira aplicação da regra que saiu do erro do 700MT: **cada manual tem de provar que é
da moto certa antes de se lhe tirar um número.**

**Como se verificou cada uma.** Os manuais italianos da Voge **não têm ficha técnica lá
dentro** — não dá para confrontar internamente. Mas o mesmo importador publica **fichas
técnicas separadas por modelo**, e é esse o par de verificação:

```
vogeitaly.it/wp-content/uploads/UM-VOGE-<Modelo>_<data>.pdf   ← manual
vogeitaly.it/wp-content/uploads/<MODELO>_<data>.pdf           ← ficha técnica
```

| Moto | Medida confirmada | Fonte da confirmação |
|---|---|---|
| 650 DSX | 110/80 R19 · 150/70 R17 | ficha `VALICO-650DSX_2312` |
| 525 DSX | 110/80 R19 · 150/70 R17 | ficha `VALICO-525DSX_2312` |
| AC 525X | 110/80 R19 · 150/70 R17 | ficha `TROFEO-525ACX-Scrambler` |
| 525 R | 120/70 ZR17 · 160/60 ZR17 | imprensa espanhola, ficha do importador |

As quatro batem com as medidas que já estavam no catálogo. **Só depois disso é que se
escreveu.**

De caminho, as fichas confirmaram o trabalho de suspensão de hoje: tanto a do 525DSX como
a do 650DSX dizem «Ammortizzatore singolo a **precarico regolabile**», exatamente o que os
manuais tinham dito — um só afinador na moto.

### Os valores, e o erro que estava lá

**As quatro motos, mais a 625 DSX de manhã, dão todas o mesmo: 2,20 bar a solo e 2,50 com
passageiro, à frente e atrás.** Cinco modelos, quatro manuais, três línguas.

O que lá estava eram estimativas de categoria, e estavam mal na mesma direção:

| Moto | Estava (trás, solo) | Manual | Erro |
|---|---:|---:|---:|
| 650 DSX | 2,90 | 2,20 | **+0,70** |
| 525 DSX | 2,50 | 2,20 | +0,30 |
| AC 525X | 2,50 | 2,20 | +0,30 |
| 525 R | 2,90 | 2,20 | **+0,70** |

Setenta centésimas a mais num pneu traseiro não é detalhe — é menos borracha no chão numa
moto de trail.

### Conflito registado: a ficha técnica não serve para pressões

As fichas técnicas divergem dos manuais, e **divergem de maneira diferente conforme o
modelo**:

- **525 DSX** — ficha diz 2,30 à frente. Esse valor **não existe no manual**.
- **650 DSX** — ficha diz 2,20 à frente e 2,50 atrás. O 2,20 é o valor a solo do manual;
  o 2,50 é o valor **com passageiro**. A ficha mistura os dois estados de carga.

Conclusão para o futuro: **as fichas técnicas da Voge servem para confirmar a identidade
da moto — medidas, peso, tipo de suspensão — e não para tirar pressões.** Para pressões,
manda o manual, que é o único que distingue solo de com passageiro. Ficou escrito na
`source` de cada linha para ninguém "corrigir" isto mais tarde a partir da ficha.

**Estado:** 89 de 120 linhas de pressão por manual, contra 85 ao início do dia.

### 900 DSX: pressões corrigidas, e as Voge grandes NÃO usam os valores das pequenas

A moto mais usada da app tinha as quatro pressões erradas.

| | Estava | Manual | Erro |
|---|---:|---:|---:|
| Frente, solo | 2,50 | 2,20 | +0,30 |
| Frente, a dois | 2,50 | 2,50 | — |
| Trás, solo | 2,90 | 2,50 | **+0,40** |
| Trás, a dois | 3,20 | 2,90 | +0,30 |

**Lição que se teria perdido se não se lesse cada manual:** as quatro Voge pequenas
(625, 650, 525 DSX, AC 525X, 525 R) dão **2,20 / 2,50 nas duas pontas**. A 900 DSX dá
**2,20 / 2,50 à frente mas 2,50 / 2,90 atrás**. Se se tivesse assumido «a Voge usa sempre
2,2 e 2,5», a moto com mais utilizadores ficava com **0,3 e 0,4 bar a menos** atrás.
A regularidade dentro de uma marca é uma pista, nunca um atalho.

**Verificação de identidade**, pela regra nova: dois manuais independentes, o espanhol
«900DSX E5+» e o inglês «DS900X», batem em **cinco campos** — 90/90-21, 150/70 R17,
238 kg em ordem de marcha, 443 kg de peso máximo e 161 kg no eixo dianteiro. São a mesma
moto e são a nossa.

**Nota de método sobre os manuais Voge espanhóis:** têm ficha técnica **dentro** (ao
contrário dos italianos), o que permite verificar a identidade sem sair do documento. Mas
a tabela de pressões está lá para o fim — pág. 152 na 900 DSX, pág. 168 na 800 Rally — e
a leitura remota corta antes. **A saída é procurar a edição inglesa**, que costuma ser
mais compacta: no caso da 900 DSX, o `DS900X-Owner-manual.pdf` do importador italiano
chegou à página 78, onde está a tabela.

### Fica por fazer

**800 DSX Rally** — identidade já confirmada (90/90-21 e 150/70 R18, no próprio manual
espanhol), mas a tabela de pressões está na pág. 168 e nenhuma das edições encontradas
até agora lá chega. Falta a versão inglesa deste modelo.

**R625** — continua sem manual e sem perfil, a única Voge ainda oculta.

**Estado:** 90 de 120 linhas de pressão por manual, contra 85 ao início do dia.

### CFMoto 800MT-X e 450MT, e a fonte oficial que faltava

**`cfmotoitaly.it/wp-content/uploads/CFMOTO-<Modelo>-Owner-manual.pdf`** — o importador
italiano da CFMoto publica os manuais em PDF de texto, tal como o da Voge. Fica registado
porque é a via limpa para a marca com mais utilizadores da app, e porque **não é a mesma
que deu o desastre do 700MT** (essa era `a.storyblok.com`).

| Moto | Estava | Manual | Maior erro |
|---|---|---|---:|
| 800MT-X | 2,3/2,3 · 2,5/2,9 · off 1,8/2,0 | **2,40 nas duas pontas**, valor único | trás a dois: **+0,50** |
| 450MT | 2,3/2,3 · 2,5/2,9 | **2,25 nas duas pontas**, valor único | trás a dois: **+0,65** |

**Verificação de identidade, e desta vez com uma vantagem:** os manuais CFMoto trazem a
medida do pneu **duas vezes** — na ficha geral, ao princípio, e na secção «Tire
Specifications», ao fim. Nos dois casos as duas coincidem entre si e com o catálogo. Foi
exatamente essa coerência interna que **faltou** no PDF do 700MT, onde a ficha geral dava
120/70 ZR17 numa moto de 19 polegadas. **A dupla menção passa a ser o teste rápido nos
manuais CFMoto.**

**Um aviso sobre resultados de pesquisa:** a pesquisa que encontrou o manual do 800MT-X
resumia-o dizendo «220 kPa à frente, 250 kPa atrás». **O manual diz 240 nas duas.** Se se
tivesse escrito o resumo em vez de abrir o documento, ficavam duas casas erradas. Resumos
de motor de busca não são fonte.

### Valores fora de estrada retirados do 800MT-X

O 800MT-X tinha 1,8 e 2,0 bar de fora de estrada. **Não vêm de lado nenhum.** O manual
tem uma secção inteira sobre condução fora de estrada e diz, textualmente, que «reducing
the tire pressure appropriately can improve operating control, traction and stability» —
**sem dar um único número**.

Foram retirados. É uma perda de funcionalidade para quem tem essa moto, e é deliberada:
mais vale a app não mostrar o separador de fora de estrada do que mostrar uma pressão que
ninguém publicou, numa moto de 220 kg que vai para terra. A 800 DSX Rally da Voge tem o
mesmo problema por resolver (1,5 e 1,8, também estimados).

**Estado:** 92 de 120 linhas de pressão por manual, contra 85 ao início do dia.
Nas duas marcas que somam 140 utilizadores restam quatro linhas estimadas: CFMoto 700MT
e 1000 SR-R, Voge 800 DSX Rally e R625.

### 700MT: pressões resolvidas pelo importador italiano, e a contradição da suspensão explicada

Depois do desastre do PDF da storyblok, tentou-se a via que funcionou para o 800MT-X e a
450MT: **`cfmotoitaly.it`**. Lá estão **dois** manuais, e é isso que muda tudo:

- `UM-CFMOTO-700MT_230913.pdf` — a geração de 2023
- `UM-CFMOTO-700MT-ADV_250407.pdf` — a **700MT ADV** de 2025

**As pressões estão resolvidas, e com o melhor tipo de prova possível: as duas gerações
dão exatamente o mesmo.** 2,25 bar à frente e 2,50 atrás, iguais a solo e com passageiro.
Não é preciso decidir qual das gerações a app representa — para pressões, tanto faz.

O que lá estava eram 2,50/2,50 à frente e 2,90/3,20 atrás. **Atrás com passageiro estava
0,70 bar acima**, na moto mais usada da marca com mais utilizadores da app.

Identidade confirmada por três fontes independentes: CFMOTO UK, imprensa italiana e o
nosso próprio catálogo — 693 cc, 110/80 R19, 150/70 R17, 68 CV às 9500 rpm.

### E a contradição da suspensão tem explicação: são duas motos

A nota de suspeição do perfil dizia que a ficha da CFMOTO UK e o perfil do mfzstudio se
contradiziam sobre que afinadores a moto tem. **Provavelmente estavam ambos certos, sobre
gerações diferentes:**

| | Forquilha | Amortecedor |
|---|---|---|
| **700MT 2023** (manual IT, pág. 55-56) | só regulação **hidráulica**, uma roda por bengala. **Sem precarga** | precarga por anel **mais** regulação hidráulica |
| **700MT ADV 2025** (CFMOTO UK, imprensa IT) | regulável no **precarga** | regulável |

**E há um detalhe que desmente o mfzstudio nas duas leituras:** o manual italiano descreve
**uma única roda de regulação por bengala**, e nunca diz se é compressão ou extensão —
usa «frenatura» genericamente. O perfil do mfzstudio atribui **dois** afinadores
hidráulicos à frente, 10 cliques cada. Não pode estar certo em nenhuma das gerações.

O perfil continua **SOB SUSPEIÇÃO** e sem `adjusters`, porque continua a faltar a peça
decisiva: um manual que diga, para a geração que queremos representar, **qual dos
afinadores hidráulicos é qual**. Mas a nota deixou de dizer «não se sabe porquê» e passa
a dizer «sabe-se o quê e falta o quê».

**Nota de catálogo por decidir:** a entrada `cfmoto-700mt` tem `year: '2021+'` e não
distingue gerações. Se a 700MT ADV entrar como moto própria, esta divisão passa a
importar — para a suspensão, não para as pressões.

**Estado:** 93 de 120 linhas de pressão por manual, contra 85 ao início do dia.

### 800 DSX Rally fechada, e o padrão da Voge Itália completo

O manual espanhol tinha a tabela na pág. 168, fora do alcance. **A saída foi o italiano**,
`UM-VOGE-VALICO-800RALLY-250917.pdf`, onde a mesma tabela está na pág. 105 e o texto
chegou lá.

**2,20 bar a solo e 2,50 com passageiro, à frente e atrás** — os mesmos valores das cinco
Voge pequenas. O que lá estava era 2,3/2,3 e 2,5/2,9: **0,40 bar a mais atrás com
passageiro**.

Identidade cruzada em três pontos: o manual espanhol «800 DSX Rally» dá 90/90-21 e
150/70 R18 na ficha interna; a imprensa italiana confirma 21/18, 798 cc e **amortecedor de
direção**; e o próprio manual italiano descreve esse amortecedor de direção rotativo.

**Retirados os valores de fora de estrada** (1,5 e 1,8), pela mesma razão do 800MT-X: o
manual não os dá. Ficam duas motos de trail sem separador de fora de estrada, e é
deliberado.

### O padrão da Voge Itália, agora completo e reutilizável

Todos os manuais seguem `vogeitaly.it/wp-content/uploads/UM-VOGE-<NOME>_<data>.pdf`, e os
**nomes comerciais italianos** são a chave que faltava:

| Gama internacional | Nome italiano |
|---|---|
| DSX | **Valico** |
| ACX | **Trofeo** |
| DSX Rally | **Valico ...RALLY** |

Confirmados e usados hoje: Valico 525DSX, 625DSX, 650DSX, 900DSX, 800RALLY, Trofeo 525ACX,
e ainda existem Valico 500DS/500DSX e 300 RALLY para quando entrarem no catálogo.

**Vantagem dos italianos sobre os espanhóis:** a tabela de pressões aparece **muito mais
cedo** (pág. 73-105 em vez de 152-168), portanto sobrevive à leitura remota. **Desvantagem:**
não têm ficha técnica dentro, e a identidade tem de ser confirmada pela ficha separada ou
por imprensa. **Os espanhóis são o inverso** — ficha técnica dentro, tabela longe demais.
Usar os dois em conjunto é o que funciona.

**Estado:** 94 de 120 linhas de pressão por manual, contra 85 ao início do dia. Nas duas
marcas que somam 140 utilizadores restam **duas** linhas estimadas, e as duas são motos
ocultas: CFMoto 1000 SR-R e Voge R625.

### Limite descoberto: os manuais KTM grandes não se leem à distância

Tentou-se subir os nove perfis KTM de `mfzstudio` a manual, a começar pela 890 Adventure R.
**Não dá por leitura remota, e vale a pena perceber porquê para não se repetir.**

O manual (art. `3214269en`, 2021) abre bem em `ktmshop.se` e a identidade confirma-se
logo na capa e na linha «This document is valid for the following models: 890 ADVENTURE R
EU (F9703U7), 890 ADVENTURE R RALLY EU (F9703UD)». Mas o capítulo **12 «Tuning the
chassis» está na página 177**, e a extração remota chega por volta da **página 141**.

**A regra que sai daqui:** nos manuais KTM, o que decide não é a marca, é o **tamanho do
manual**. Na 390 Adventure o capítulo está na pág. 59 e leu-se inteiro; no 790 Duke está
na 130 e só se apanhou o índice; na 890 Adventure R está na 177 e nem isso adiantou.
**Motos pequenas leem-se, motos grandes não.**

**O que o índice dá, e não é nada:** confirma que afinadores a moto tem. Na 890 Adventure R
são as secções 12.2 a 12.10 — compressão, extensão e precarga à frente, e atrás precarga,
extensão e compressão **separada em alta e baixa velocidade**. Isso bate certo com o perfil
que já lá está, portanto não houve correção a fazer.

**Verificação de passagem, e está tudo bem:** o perfil marca a compressão traseira como
`na()` e enche o `hsComp` e o `lsComp`. Parecia poder mostrar «N/A» numa moto que tem dois
afinadores, mas não mostra — o `SuspensionBlock` passa `forceSet={hasHsLs}` e a célula
rende como ajustável. O `DataCell` já trata do caso.

**Os nove perfis KTM ficam como estão**, com 14 utilizadores entre eles. Para os subir a
manual é preciso o PDF em disco, não a leitura remota.

**Onde ficam as pressões:** 94 de 120 por manual. As 26 que faltam estão em marcas de
baixa utilização, e **nove são BMW, que não publica pressões no manual** — está
documentado mais acima e não é lacuna nossa. As restantes são cinco Ducati, três Kawasaki,
três Suzuki e seis avulsas.

### Bug meu: a nota do 700MT partiu o bundle

**Sintoma:** `npx eas-cli update` falhava com `SyntaxError: Unterminated string constant`
em `mfzSuspensionData.ts:218`. **A app não compilava**, portanto o OTA nunca chegou a ser
publicado — e o `verificar-coerencia` passava na mesma, porque o `tsx` tolerava.

**Causa:** ao acrescentar a «PISTA NOVA» à nota do `cfmoto_700mt`, o script usou uma
string de Python com `\n\n` lá dentro. Em Python isso são **quebras de linha a sério**, e
foram escritas como tal no meio de uma string TypeScript delimitada por plicas. Uma string
com plicas não pode atravessar linhas — e partiu-se ali.

**Correção:** as três linhas voltaram a ser uma só, com `\n\n` escapado.

**Como não repetir:** ao gerar TypeScript a partir de Python, o `\n` que se quer no
resultado tem de ir escapado (`\\n` no código Python) ou a string de Python tem de ser
`raw`. E, sobretudo, **o `verificar-coerencia` não é um teste de compilação** — passa
sobre ficheiros que o Metro rejeita.

**Verificação acrescentada de propósito depois disto:** varreram-se os quatro ficheiros de
dados à procura de campos de texto (`notes`, `countNote`, `source`, `label`) que abram
plica e não a fechem na mesma linha. Nenhum outro caso. Vale a pena repetir esse teste
sempre que se editar estes ficheiros por script.

**Lição de processo, que é a que interessa:** hoje já se tinha registado que o
`tsc --noEmit` nunca chegou a correr até ao fim dentro do sandbox. Este bug teria sido
apanhado por ele. **Compilar não é opcional antes de publicar.**

### CI: as verificações passam a correr sozinhas

Não havia CI, nem hooks, nem `test`. Os três scripts de verificação existiam e só corriam
quando alguém se lembrava — e o `verificar-sync` até tem escrito no cabeçalho que foi
feito «para poder entrar num hook ou em CI». Nunca tinha entrado.

**O que motivou:** dos três erros de 4 de agosto, dois teriam sido apanhados
automaticamente. O erro de sintaxe que partiu o bundle passou por duas revisões e só
apareceu no `eas update`, depois de duas tentativas falhadas. A divergência das fontes
CFMoto entre o bundle e o Supabase esteve escondida até alguém correr o script à mão.

**O que ficou:** `.github/workflows/verificar.yml`, a correr em cada push e em cada pull
request para `main`, mais arranque manual pelo separador Actions.

| Passo | Apanha |
|---|---|
| `npm ci` | `package.json` e `package-lock.json` dessincronizados |
| `npm run typecheck` | erros de sintaxe e de tipo — **o bug de 4 de agosto** |
| `npm run verificar-coerencia` | afinadores cuja curva por carga contradiz o tipo declarado |

Um a dois minutos, sem rede, sem tocar em builds nem em OTA. **Não gasta cota do EAS.**

**Dois atalhos novos no `package.json`**, para o mesmo estar à mão localmente:

```
npm run typecheck    # tsc --noEmit
npm run verificar    # typecheck + verificar-coerencia
```

O `verificar` é o que vale a pena correr antes de publicar um OTA.

**O que falta ligar, e é de propósito:** o `verificar-sync` está no ficheiro **comentado**.
Precisa de `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` em
*Settings → Secrets and variables → Actions*. Enquanto não estiver ligado, uma divergência
entre o código e a base continua a só se descobrir correndo o script à mão. Ficou de fora
da primeira versão para a Action arrancar sem depender de configuração no GitHub.

**Verificado antes de committar**, para a primeira execução não falhar por motivo tolo: o
`typescript` (5.9.3) e o `tsx` (4.23.5) estão em `devDependencies` **e** no
`package-lock.json`, e o `tsconfig.json` existe. O `npm ci` tem tudo o que precisa.

### O CI apanhou código morto ao primeiro arranque

A primeira execução da Action falhou com **10 erros de tipo**. Nenhum vinha do trabalho de
dados — vinham todos de **`src/components/SettingsScreen.tsx`, um ficheiro que ninguém
importa**.

**O que era:** um ecrã de definições com 24 `className=` de Tailwind, num projeto que
**não tem NativeWind instalado**. O ecrã a sério é o `app/settings.tsx`, que não usa
`className` nenhum. Entrou no repositório algures na altura do sistema freemium e nunca
foi ligado a nada. **Apagado.**

Não era só ruído: se alguém o reaproveitasse, os `className` **não fariam nada em tempo de
execução**, porque a biblioteca que os interpreta não existe no projeto. Era uma armadilha
à espera.

### Porque é que passava localmente e falhava no CI — vale a pena perceber

O `expo-env.d.ts` contém uma linha só:

```ts
/// <reference types="expo/types" />
```

É isso que puxa `expo/types/react-native-web.d.ts`, que **declara `className` em
componentes React Native** (para o suporte web). Com essa declaração activa, os 24
`className` do ficheiro morto eram aceites.

**E esse ficheiro está no `.gitignore`** — por indicação do próprio Expo, que escreve lá
dentro «this file should not be edited and should be in your git ignore». Existe em
qualquer máquina onde o Expo tenha corrido; **não existe num checkout limpo**.

**A lição é maior do que este caso:** o ambiente local tem ficheiros gerados que o CI não
tem — o `expo-env.d.ts` e o `.expo/types/router.d.ts`, ambos ignorados pelo git. Sempre
que o CI acusar erros que não se reproduzem localmente, **esta é a primeira hipótese a
verificar**, e não um defeito da Action.

### Correção minha, para registo

Ao longo do dia corri o `tsc` várias vezes e disse que passava. **Estava a filtrar a saída**
com `grep` pelos ficheiros de dados que tinha acabado de editar, portanto só via os erros
desses ficheiros. Os dez erros do `SettingsScreen.tsx` estavam lá o tempo todo e nunca
apareceram. **Filtrar a saída de um verificador transforma-o noutra coisa** — e foi
precisamente por isso que a Action valeu a pena logo no primeiro arranque.

### Fechado o último ponto cego: pesquisas sem resultados

Até agora a app media motos **que existem** no catálogo. Quem procurava uma que não existe
saía sem deixar rasto — e é assim que se descobrem lacunas como a BMW R1200GS LC, que veio
por comentário de um utilizador e não por medição.

Novo evento **`bike_search_empty`**, com o termo procurado. Consulta 9 no
`docs/posthog-consultas.md`. **Só tem dados depois do OTA.**

**As três salvaguardas, que são o que separa isto de ruído:**

- **Mínimo de 3 caracteres.** Com um ou dois quase tudo dá resultados, e o que não dá não
  é interpretável.
- **1,2 segundos depois da última tecla.** Sem isto, quem escreve «bmw» gerava três
  eventos falhados — «b», «bm» e «bmw» — e os dois primeiros não são pesquisas, são
  alguém a meio de escrever.
- **Não repete o mesmo termo** enquanto o seletor estiver aberto. Apagar uma letra e
  voltar a escrevê-la não conta como segunda procura. O conjunto limpa-se a cada abertura,
  portanto duas sessões separadas contam as duas.

**Sobre o texto guardado:** vem normalizado (sem acentos, minúsculas) e truncado a 40
caracteres. Na prática é sempre um nome de mota, mas é texto livre escrito pelo
utilizador — não há razão para guardar mais do que o necessário para identificar o modelo.

**Ao ler os resultados, não tratar tudo como pedido:** uma pesquisa falhada tanto pode ser
uma moto em falta como alguém a escrever mal o nome ou a procurar por cilindrada.

---

## 7 de agosto de 2026 — KTM: onde está a parede, e o primeiro manual a passá-la

O bloco KTM é o maior que resta por confirmar: **17 perfis** ainda sem manual, numa marca
com 14 utilizadores. O impedimento estava registado como «a leitura remota trunca antes do
capítulo de afinação». Hoje ficou percebido exatamente onde.

### A truncatura é por tamanho, e o corte cai por volta da página 62

O `web_fetch` devolve cerca de **100 000 caracteres** e corta. Nos manuais KTM recentes o
capítulo de afinação do chassis anda pela página 70 a 90 — **logo a seguir ao corte**. Não
é uma questão de tentar outra vez nem outro espelho do mesmo PDF: o `ktmshop.se`, o
`mobil.ktmshop.se` e o `print.ktm.com` servem o mesmo ficheiro.

**Mas não é regra para todos.** O manual do 690 Enduro R de 2019 tem menos matéria antes
do capítulo 10 e **coube**. Ou seja: vale sempre a pena tentar antes de pedir o ficheiro.
Os manuais de modelo único e mais antigos passam; os recentes e multi-modelo não.

### O documento «Setup instructions» não serve — e é bom saber para não o voltar a caçar

A KTM publica, a par do manual, um PDF pequeno com o nome **Setup instructions** (sufixo
`_SUI.pdf` em vez de `_OM.pdf`). Pelo nome parecia a resposta: pequeno, e sobre afinação.
**Não é.** É o guia de montagem em concessionário antes da entrega — desempacotar, apertar
o guiador, encher a bateria, regular o farol, binários de aperto. **Zero valores de
suspensão.** Verificado no `25_3240261en` do 390 Adventure R.

### 690 Enduro R 2019 — promovido a manual, e com uma correção

Perfil `ktm_690_enduro_2019`, agora `oem_manual`, do manual art. **3213909en**, capítulo 10.

**Os valores do mfzstudio batiam certo, todos.** Forquilha 15/15, amortecedor baixa 20,
alta 2 voltas, recuperação 20 — é linha por linha a coluna «Standard» do manual. Boa
notícia sobre a qualidade da fonte, mas não é razão para deixar de confirmar: foi
precisamente ao confirmar que apareceu o erro.

**A correção: a pré-carga traseira não existe.** O mfzstudio dava 18 mm. O manual não tem
secção nenhuma de pré-carga — o capítulo 10 tem sete secções, nenhuma de mola — e a lista
de comandos do capítulo 4 nomeia **quatro** afinadores: compressão e recuperação da
forquilha, compressão e recuperação do amortecedor.

**O teste que torna isto conclusivo em vez de argumento do silêncio:** no manual do 390
Adventure R a mesma lista do capítulo 4 diz, com todas as letras, «Shock absorber, spring
preload setting». **A KTM nomeia a pré-carga quando ela existe.** No 690 não a nomeia.

### Por resolver: as duas tabelas do manual contradizem-se

O manual dá quatro colunas — Comfort, Standard, Sport, Full payload — e diz «apertar
aumenta o amortecimento», contando-se sempre a abrir a partir do batente duro.

| | Comfort | Standard | Sport | Full payload |
|---|---|---|---|---|
| Forquilha comp. | 10 | 15 | 20 | 20 |
| Forquilha rec. | 10 | 15 | 20 | 20 |
| Amortecedor baixa | 25 | 20 | 10 | 10 |
| Amortecedor alta | 2,5 voltas | 2 | 1 | 1 |
| Amortecedor rec. | 25 | 20 | 10 | 10 |

**O amortecedor está como se espera** — mais cliques abertos no Comfort, menos no Sport.
**A forquilha está ao contrário**: 10 cliques no Comfort seria mais duro que os 20 do
Sport. Uma das duas tabelas conta a partir do outro extremo, e o manual não o diz.

**Não se inventou uma correção.** Ficou o valor Standard, que é 15 nas duas leituras
possíveis, e a contradição ficou escrita no `notes` do perfil. Resolve-se com um manual de
outro KTM que dê a mesma tabela com um afinador de sentido conhecido — não a palpite.

### As outras três colunas não viraram `weightPoints`, de propósito

Era tentador: quatro cenários parecem quatro pontos de carga. **Não são.** Comfort,
Standard e Sport são estilo de condução, não peso, e só o «Full payload» é sequer sobre
carga — e mesmo esse não diz a quantos quilos corresponde. Pôr-lhes quilos era inventar o
eixo todo. Ficaram escritos no `notes`, em texto, que é onde a informação é honesta.

**Uma coisa que a comparação deu de graça:** do Standard para o Full payload a forquilha
anda 5 cliques. A fórmula `ktm` do projeto usa delta/20, portanto 5 cliques correspondem a
+100 kg — que é mais ou menos o que «carga máxima» significa numa mota destas. **A fórmula
bate certo com o manual**, pelo menos à frente. Atrás anda 10 cliques para o mesmo delta,
ou seja o dobro. Não chega para mudar nada, mas é o primeiro sinal medido de que a fórmula
não é fantasia.

### Nota de ambiente

O `verificar-coerencia` **não corre no sandbox Linux**: o `node_modules` foi instalado no
macOS e o esbuild traz binário por plataforma. Corre na máquina do Filipe e corre no CI,
que faz `npm ci` no Linux. Não é avaria — é só onde se corre.

### Adenda: o 1190 Adventure R coube, e resolveu a dúvida do 690

O manual do **1190 Adventure R de 2014** (art. 3213107en) também passou por baixo do corte —
o capítulo 12 fica na página 87. **Os sete valores do mfzstudio batiam certo, um a um.** Nada
a corrigir; só promovido a `oem_manual` com a fonte a apontar para o manual.

**E fecha a dúvida que ficou aberta acima.** O manual do 1190 descreve o afinador da
forquilha com exatamente as mesmas palavras do 690 — apertar até ao batente, contar a abrir,
apertar aumenta o amortecimento — e dá **17 / 12 / 7 / 7**: Comfort mole, Sport duro, na
ordem esperada. Portanto **não existe uma convenção diferente para forquilhas KTM**. É o
manual do 690 que está fora do padrão da própria marca. Continua sem se lhe mexer, porque a
coluna Standard é a mesma nas duas leituras, mas já não é uma incógnita — é uma anomalia
identificada, e isso muda o que se faz com ela.

### Primeiro sinal medido de que a fórmula `ktm` falha na pré-carga

A comparação Standard → Full payload do 1190 dá um número que vale a pena guardar:

| | Standard | Full payload | Salto |
|---|---|---|---|
| Pré-carga da forquilha | 5 voltas | 8 voltas | +3 |
| Pré-carga do amortecedor | **4 voltas** | **16 voltas** | **+12** |
| Amortecimento (todos) | — | — | 2 a 5 cliques |

A fórmula `ktm` do projeto move a pré-carga a **delta/25 voltas**. Para chegar às 16 voltas
precisaria de **mais 300 kg** em cima da mota. Ou seja: **a app está a carregar muito pouco
a pré-carga traseira** de quem anda com bagagem ou com passageiro nesta mota.

**Não é caso para mudar a fórmula já,** por duas razões: é uma mota só, e o manual não diz a
quantos quilos corresponde «Full payload», portanto o denominador continua por medir. Mas é
a primeira evidência de manual — e não de intuição — de que a parte da pré-carga da fórmula
está subdimensionada. **Se aparecer o mesmo padrão no 890 ou no 1290, deixa de ser um caso
isolado e passa a ser um defeito a corrigir.** É a coisa concreta a verificar no próximo
manual KTM que se abrir.

### Onde ficou o bloco KTM

Confirmados por manual: **1190 Adventure R** e **690 Enduro R 2019**. Faltam quinze perfis.
Dos que se tentou, o **790 Adventure R 2019** não coube — o corte cai na página 140 e o
capítulo 12 começa na 168. Para esses, o caminho é o ficheiro em disco.

### A lista de manuais KTM a descarregar, com os links

Tentados e **não cabem** na leitura remota: 1290 Super Adventure R de 2021 e de 2018, 890
Adventure R de 2022, 790 Adventure R de 2019. Não é falta de sorte nem vale tentar outro
espelho — **todos os manuais KTM de 2018 para cá passam do corte**. Os dois que couberam
(690 Enduro R de 2019 e 1190 Adventure R de 2014) são os mais curtos da amostra.

Para os restantes o caminho é o ficheiro em disco. **Guardar em `~/dev/manuais-ktm/`**, que
é fora do repositório — são PDFs de vários MB e não têm de ir para o git.

| Perfil por confirmar | Manual | Ficheiro |
|---|---|---|
| `ktm_890_adv_r_2021` | 890 Adventure R 2022 | [`22_3214536_en_OM.pdf`](https://mobil.ktmshop.se/bike-manuals/22_3214536_en_OM.pdf) |
| `ktm_1290_adv_r_2021` | 1290 Super Adventure R 2021 | [`21_3214297_en_OM.pdf`](https://www.ktmshop.se/bike-manuals/21_3214297_en_OM.pdf) |
| `ktm_1290_sadv_s_electronic` | 1290 Super Adventure S 2021 | [`21_3214295_en_OM.pdf`](https://www.ktmshop.se/bike-manuals/21_3214295_en_OM.pdf) |
| `ktm_790_adv_r_2019` | 790 Adventure R 2019 | [`19_3213919_en_OM.pdf`](https://www.ktmshop.se/bike-manuals/19_3213919_en_OM.pdf) |
| `ktm_390_adv_r_2025` | 390 Adventure R 2025 | [`25_3240182_en_BA.pdf`](https://mobil.ktmshop.se/bike-manuals/25_3240182_en_BA.pdf) |
| `ktm_excf_4t_2024` | 350 EXC-F 2024 | [`24_3214840_en_OM.pdf`](https://www.ktmshop.se/bike-manuals/24_3214840_en_OM.pdf) |
| `ktm_exc_2t_2024` | 250/300 EXC 2024 | [`24_3214838_en_OM.pdf`](https://www.ktmshop.se/bike-manuals/24_3214838_en_OM.pdf) |

**Os dois primeiros são os que interessam mais**, e não por serem os mais usados: são os que
respondem à pergunta da pré-carga. Se o 890 e o 1290 mostrarem o mesmo salto que o 1190 —
pré-carga traseira a multiplicar-se por quatro entre Standard e carga máxima — deixa de ser
um caso isolado e a fórmula `ktm` tem defeito a corrigir. Se não mostrarem, o 1190 é uma
mota com um afinador de curso longo e não se mexe em nada.

**Nota sobre os anos.** Os manuais que aqui estão são do ano que se encontrou, nem sempre o
ano do perfil. Ao ler, confirmar primeiro a linha «This document is valid for the following
models» e dois ou três números de chassis contra a ficha do modelo — foi por saltar esse
passo que se escreveu um dia a CFMoto 700MT a partir da mota errada.

---

## 7 de agosto de 2026, parte II — a fórmula `ktm` está errada na pré-carga, e agora há prova

Chegaram os dois manuais que faltavam para responder à pergunta: **890 Adventure R de 2022**
(art. 3214536en) e **1290 Super Adventure R de 2021** (art. 3214297en). Nos dois, os valores
que lá estavam batiam certo com o manual, um a um. Promovidos a `oem_manual`. São 82 perfis
por manual em 104.

### A prova

O que se queria medir era o salto da pré-carga traseira entre a afinação normal e a de carga
máxima. Com o 1190 de ontem, são três motos:

| Mota | Standard | Full payload | Salto |
|---|---:|---:|---:|
| 890 Adventure R | 4 voltas | 10 voltas | **+6** |
| 1190 Adventure R | 4 voltas | 16 voltas | **+12** |
| 1290 Super Adventure R | 5 voltas (Street) | **26 voltas** | **+21** |

A fórmula `ktm` do projeto move a pré-carga a **delta/25 voltas**. Para uma carga máxima
realista — digamos mais 100 kg entre passageiro e bagagem — dá **+4 voltas**. Os manuais
pedem seis, doze e vinte e uma.

**Não é um caso isolado nem um afinador esquisito de uma mota.** São três motos de três
gerações diferentes, e o erro cresce com a cilindrada. No 1290 a app está a dar **um quinto**
da pré-carga que o fabricante manda pôr.

### Porque é que ainda não se mudou a fórmula

Duas razões, e a segunda é a séria.

**A primeira:** o «Full payload» dos manuais KTM **não diz a quantos quilos corresponde**.
Sem denominador, qualquer constante nova que se escolha é escolhida a olho — trocava-se um
número errado por outro número inventado, com a diferença de que o novo teria ar de fundado.

**A segunda:** a constante é partilhada por **todos** os perfis com `formula: 'ktm'`, e a
maioria ainda não foi confirmada por manual. Mudá-la agora mexe em motos sobre as quais não
se sabe nada, com base em três que se conhece bem.

### O que se sabe já, e que vale para a decisão

O amortecimento **não** tem este problema: os saltos são de 2 a 5 cliques, que é o que a
delta/20 dá. **É só a pré-carga.** E faz sentido físico — pré-carga é o que compensa peso;
amortecimento é o que controla o movimento. Uma fórmula só para as duas coisas era sempre
uma simplificação.

**Reparo do 890 que confirma isto pelo lado contrário:** naquela mota o amortecimento da
forquilha é **15/15 no Standard e 15/15 na carga máxima** — não mexe de todo. Só mexem as
pré-cargas e o amortecedor.

**A correção mínima defensável**, quando se decidir mexer, é separar a constante da pré-carga
da do amortecimento e deixá-la por mota em vez de por marca — as três que se conhece dão
constantes muito diferentes entre si, portanto uma constante única de marca vai continuar
errada em duas delas seja qual for o valor.

### Correção de dados aproveitada no 890

A pré-carga da frente estava como `pos('+0 factory baseline')` — texto, que a app mostra e
não ajusta. O manual descreve o afinador contável em voltas a partir do fim mole, com +0 no
Standard e +3 na carga máxima. Passou a `tu_soft(0)`, portanto **acompanha o peso** em vez de
ficar uma etiqueta fixa. O 790 Adventure R tem a mesma etiqueta e fica à espera do manual.

---

## 7 de agosto de 2026, parte III — a CFMoto 700MT sai de suspeição, e o desfecho é o contrário do esperado

Chegou o manual português da **700MT ADV** (`MP_700MT ADV_v250708`). Este perfil estava
marcado a vermelho desde o dia em que o reescrevi a partir da mota errada. **Estava certo o
tempo todo.** Todos os valores, incluindo os quatro pontos de carga.

### Primeiro o teste de identidade, que da outra vez se saltou

| | Este manual | O PDF errado de agosto |
|---|---|---|
| Pneus | 110/80 R19 · 150/70 R17 | 120/70 ZR17 · 160/60 ZR17 |
| Distância entre eixos | 1445 mm | 1418 mm |
| Tara | 240 kg | 218 kg |
| Potência | 50 kW às 9500 | 49 kW às 9000 |
| Código | **CF700-9A** | CF700-9F |

Cinco campos, todos a bater com a 700MT verdadeira. E a medida dos pneus aparece **duas
vezes** no documento — ficha geral e secção dos pneus — que é o teste de coerência interna
rápido dos manuais CFMoto.

### As duas dúvidas que puseram o perfil em causa, resolvidas em sentidos opostos

**A anomalia era verdadeira.** Duvidava-se de que a extensão traseira se contasse do lado
duro quando todas as outras CFMoto contam do mole. **Conta-se mesmo**, e o manual escreve as
duas instruções lado a lado, na mesma página, por baixo da tabela:

> «Rode a suspensão dianteira no sentido contrário ao dos ponteiros do relógio até ao fim e,
> em seguida, rode-a no sentido dos ponteiros do relógio para aumentar o amortecimento. Rode
> a suspensão traseira no sentido dos ponteiros do relógio até à mudança máxima e, em
> seguida, rode-a no sentido contrário ao dos ponteiros do relógio para diminuir.»

**Lição, e é a que fica:** o comentário original dizia «sentido inverso das outras CFMoto» e
eu li isso como sinal de que quem escreveu tinha racionalizado um erro. Era o contrário — era
alguém a registar uma irregularidade real. **Uma irregularidade assinalada não é a mesma
coisa que uma irregularidade inventada,** e não se distinguem sem a fonte.

**A outra dúvida caiu para o lado do manual.** A ficha da CFMOTO UK diz que a forquilha tem
pré-carga; a ficha técnica do manual diz, em duas linhas, **«Não ajustável»** — à frente na
pré-carga e atrás na compressão. Ficha comercial contra manual, ganha o manual.

### A tabela parece contraditória e é isso que prova que está bem lida

| Estado | Pré-carga trás | Extensão trás | Frente comp. | Frente ext. |
|---|---:|---:|---:|---:|
| Fábrica (solo, 75 kg) | 6 voltas | 7 | 10 | 10 |
| + carga (três caixas) | 9 | 4 | 10 | 10 |
| + passageiro | 10 | 3 | 14 | 14 |
| + passageiro + carga | 12 | 1 | 16 | 16 |

À frente os cliques **sobem** com o peso; atrás **descem**. Parece disparate — e não é: como
as duas pontas contam de extremos opostos, **as duas séries estão a endurecer** à medida que
a carga aumenta. Se estivessem ambas a subir é que havia problema.

**A pré-carga fecha por aritmética,** que é a melhor confirmação que há: 6 voltas de fábrica,
mola livre a 166 mm, cada volta vale 1,5 mm → 166 − 9 = **157 mm**, que é exactamente o
comprimento de fábrica que a ficha técnica indica noutra página.

**Ficou de fora a quinta linha** — «uma pessoa + estrada irregular contínua», que dá 6 voltas
de pré-carga e 8/8/8 de amortecimento. É modo de piso, não é peso, e não se interpola por
quilos. A 800MT-X tem uma linha do mesmo género e também ficou de fora, pela mesma razão.

### Estado

A CFMoto passa a **100 % por manual** — é a marca com mais utilizadores da app, 81, e era
este o único perfil dela por confirmar. A pressão já estava certa (2,25 / 2,50 bar) e ganhou
uma terceira fonte a confirmá-la.

**São 83 perfis por manual em 104.**

---

## 7 de agosto de 2026, parte IV — a pré-carga passa a ter ritmo próprio por mota

Implementada a correção que a parte II deixou em aberto. Mas primeiro:

### Correção ao que escrevi na parte II

Escrevi que no 1290 a app dava «um quinto da pré-carga que o fabricante manda». **O número
estava mal fundamentado.** Comparei o salto do manual contra o que a fórmula dá para «mais
100 kg» — e os 100 kg eram um palpite meu, porque o manual não diz a que carga corresponde
a coluna «Full payload».

**Passou a haver forma de saber.** Os manuais KTM dão, noutra página, o **peso máximo
autorizado** e o **peso da mota sem combustível**. A carga útil é a diferença, descontado o
depósito. É aritmética, não é estimativa:

| | Máx. autorizado | Sem combustível | Depósito | **Carga útil** |
|---|---:|---:|---:|---:|
| 890 Adventure R | 450 kg | 200 kg | 20 L (~15 kg) | **235 kg** |
| 1290 Super Adventure R | 450 kg | 228 kg | 23 L (~17 kg) | **205 kg** |

E com isso os kg por volta de pré-carga saem certos:

| | Voltas (frente / trás) | **kg por volta** |
|---|---|---|
| 890 Adventure R | +3 / +6 | 53 à frente, **27 atrás** |
| 1290 Super Adventure R | +6 / +21 | 22 à frente, **6 atrás** |

**O diagnóstico verdadeiro é mais estreito e mais interessante do que o que eu tinha dito.**
A fórmula usa 25 kg por volta. No 890 isso são os 27 do manual — **a fórmula estava certa**.
No 1290 são 6, e aí sim está errada por um factor de quatro.

Ou seja: **a constante não é uma propriedade da marca, é do afinador.** O manípulo do 1290
tem 26 voltas de curso útil e o do 890 tem 10; a mesma volta não move a mesma mola. Nenhum
número único de marca vai servir os dois, e é por isso que o defeito passou despercebido —
a KTM de aventura mais comum é justamente aquela em que a fórmula acerta.

### O que se fez

Campo novo e **opcional** no `MfzProfile`:

```ts
preloadKgPerTurn?: { front?: number; rear?: number }
```

Quando existe, manda; quando não existe, **nada muda** e a mota segue a fórmula da marca
como sempre seguiu. Preenchido em duas motas, as duas com número saído do manual. Frente e
trás separados porque as roscas são diferentes — no 890 a mesma carga pede 3 voltas à frente
e 6 atrás.

**Correção aproveitada no 1290, e é a que mais vale.** A pré-carga traseira estava como
`pos('Street: 5 turns / Offroad: 1 turn')` — texto. A app mostrava-o e **nunca ajustava
nada**: naquela mota a pré-carga traseira estava congelada em qualquer carga. Passou a
`tu_soft(5)`, o valor de estrada, com o modo de todo-o-terreno a viver nas notas. Agora
acompanha o peso, e ao ritmo do manual.

Portanto o defeito real, nesta mota, não era a fórmula estar curta — **era não haver fórmula
nenhuma a correr.**

### Script novo: `npm run verificar-precarga`

Um teste de regressão, ligado ao CI. Pega nos perfis com pré-carga medida, pede à app o
setup à carga máxima do manual, e compara com a coluna «Full payload». Sai com código 1 a
qualquer divergência.

Apanha três coisas que de outra forma passariam: alguém mexer na fórmula, alguém mexer no
valor base de um destes perfis, ou alguém pôr um `preloadKgPerTurn` mal calculado.

### Por fazer

O **1190 Adventure R** é o terceiro caso conhecido (+12 voltas) e ficou **sem** o campo, de
propósito: o peso máximo autorizado está na ficha técnica, que fica depois do corte da
leitura remota. Sem esse número, o kg por volta era escolhido a olho — que é exactamente o
erro que esta secção corrige. Fica à espera do PDF.

Vale a pena olhar para as outras marcas com o mesmo olho. A `honda` e a `suzuki` usam
também 25 kg por volta, herdado do mesmo sítio, e nunca foi medido contra manual nenhum.

### Sequela imediata: o script rebentou, e a razão valia a correção

O `npm run verificar-precarga` falhou logo à primeira, fora da app. Causa: importava o
`getRealSuspension`, que importa o `oem-data`, que importa o **armazenamento** e o
**Sentry** — coisas que só existem dentro da app.

**As fórmulas passaram para `src/utils/suspensionFormulas.ts`**, sem importar nada além dos
tipos dos dados. O `suspensionReal.ts` passa a chamá-las de lá.

Não é arrumação por gosto. **Enquanto a aritmética viveu enterrada num ficheiro que arrasta
metade da app, não havia forma de lhe passar um número e ver o que saía** — e foi assim que
um erro de pré-carga viveu meses sem ninguém dar por ele. Agora qualquer script lhe chama
directamente.

### E uma conta que não fechava

O ritmo do 1290 estava escrito como 6 kg por volta, arredondado de 130/21. Com 6 certos, a
conta dá 21,67 voltas, que arredonda para **22** — e o manual pede 21. O valor correcto é
**6,2**, e aí dá 20,97 → 21. Uma casa decimal a fazer a diferença entre bater certo com o
manual e falhar por uma volta.

**Foi o próprio teste a apanhá-lo, antes de chegar a correr.** É exactamente para isto que
ele existe: sem ele, o erro entrava no OTA e ninguém o via.

---

## 7 de agosto de 2026, parte V — a Honda não é mensurável, e apareceu uma contradição no código

Foi ao item «medir a `honda` e a `suzuki` com o mesmo método do KTM». **Não dá**, e a razão
vale a pena ficar escrita para não se voltar a tentar.

### A Honda não publica tabela de carga

Lido o manual do X-ADV, que está em disco. A Honda descreve o afinador ao pormenor — 15
voltas de curso à frente, 7 de fábrica a contar do mais mole; anel de 10 posições atrás,
a 4 de fábrica — e depois diz apenas **«to suit the load or the road surface»**. Não há
coluna de carga, não há «full payload», não há nada a partir de que se derive um ritmo.

O perfil do X-ADV está certo em tudo contra este manual. Simplesmente **não há como medir a
constante da Honda pelo caminho que funcionou com a KTM.**

### Mas o código tem uma contradição consigo próprio

A ver as fórmulas para isto, deu-se com isto no `adjustHonda`:

```
/** Honda formula — same damping as KTM, preload turns same as KTM */
case "tu_soft": return clamp(roundQuarter(base + Math.round(delta / 25) * 0.25), 0, 20);
```

Contra a da KTM:

```
case 'tu_soft': return clamp(base + Math.round(delta / 25), 0, 20);
```

**O comentário diz que são iguais e não são — a da Honda tem um `* 0.25`.** Para um
passageiro de 75 kg, a KTM abre 3 voltas de pré-carga e a Honda abre 0,75. **Quatro vezes
menos, para o mesmo tipo de afinador.** A `suzuki` tem a mesma linha, e serve de fórmula a
motas Ducati, Kawasaki, Aprilia e Suzuki — cerca de dezassete perfis ao todo.

**Não se uniformizou, e não por preguiça.** Não se sabe qual das duas está certa, e há uma
pista concreta de que a diferença pode ser deliberada: na tabela por carga do manual da
Ducati DesertX, a pré-carga da **frente não mexe nada** entre andar sozinho e andar com
passageiro — 2 voltas nas quatro linhas. Os manuais KTM mandam abrir 3 a 6. **Marcas
diferentes fazem coisas diferentes**, e uniformizar por gosto de simetria estragava metade
dos casos para arranjar a outra metade.

O que se fez foi **pôr os comentários a dizer a verdade** sobre o que o código faz, com o
número concreto do desvio. Um comentário errado é pior do que comentário nenhum: manda quem
lê para o lado errado com confiança.

**A saída não é escolher uma constante — é o `preloadKgPerTurn`,** que põe o ritmo por mota
a partir do manual e vai tornando a fórmula da marca cada vez menos usada. É o mesmo
caminho que resolveu a KTM.

### Correção de dados na DesertX

O manual da DesertX **tem** tabela por carga, e o perfil já a usava. Mas o ponto do meio
estava em **100 kg**, que não vinha de lado nenhum. O manual diz, na pág. 48, que a bagagem
não pode passar dos **30 kg** — 10 por mala lateral, 5 no top case, 5 na bolsa de depósito.
A linha «rider only + bags» é portanto **75 + 30 = 105 kg**. Corrigido.

**Porque é que 5 kg importam:** entre 75 e 105 a pré-carga traseira anda 11 cliques, e entre
105 e 150 anda 9. A resposta desta mota **não é linear** — é muito mais sensível em carga
baixa. Com o ponto mal colocado, todo o troço de baixo ficava inclinado a mais. É também a
melhor ilustração de por que razão uma constante única por marca nunca vai chegar: **nem
dentro da mesma mota a relação é constante.**

### O que fica em aberto

O `preloadKgPerTurn` só se aplica a `tu_soft`. A pré-carga da DesertX é `cl_soft`, e a de
várias Honda também. **Se o campo se mostrar útil, faz sentido alargá-lo aos cliques** — mas
só quando houver uma segunda mota a pedi-lo, não por antecipação.

---

## 7 de agosto de 2026, parte VI — de onde vêm os quilos dos pontos de carga

Depois da correção da DesertX ficou a pergunta óbvia: **e os outros pontos de carga, de onde
vieram?** A resposta é que havia uma convenção implícita, usada em toda a CFMoto, que nunca
esteve escrita em lado nenhum.

### A convenção 75 / 115 / 150 / 190

Os manuais CFMoto dão as linhas por descrição, não por quilos:

| Linha do manual | Quilos que o perfil usa |
|---|---:|
| «uma pessoa (75 kg)» | 75 |
| «uma pessoa (75 kg) + carga (três caixas)» | **115** |
| «uma pessoa (75 kg) + uma pessoa (75 kg)» | 150 |
| «duas pessoas + carga (três caixas)» | **190** |

**Os 75 e os 150 vêm do manual. Os 115 e os 190 assumem 40 kg de bagagem** — número que
nenhum manual CFMoto publica. É interpretação, e razoável, mas é interpretação. Está agora
escrita no tipo `WeightPoint`, que é onde quem for acrescentar pontos a vai ver.

### E a 700MT anda sobrecarregada na última linha — do manual, não nossa

Verificando essa assunção contra a ficha da 700MT: **405 kg de peso máximo total, 240 kg de
tara → 165 kg de carga útil.** O último ponto da tabela está em **190 kg**.

**Não é erro dos dados.** É a própria tabela de sugestões da CFMoto a descrever «duas
pessoas + três caixas», que com 40 kg de bagagem dá 190 kg — vinte e cinco acima do limite
que o mesmo manual publica noutra página. O manual contradiz-se.

Os valores ficam como estão: são o que o fabricante manda pôr nessa configuração, e alguém
que ande assim carregado precisa deles. O que se fez foi **escrevê-lo no perfil**, para que
o último ponto não seja lido como carga recomendada.

### Porque é que não se mexeu em mais nada

Foi tentador «corrigir» o ponto para 165. Seria errado por duas razões. A primeira é que os
valores de suspensão dessa linha são os da configuração que a CFMoto descreve, não os de
165 kg — mudar o rótulo sem mudar os valores inclinava a curva. A segunda é que não se sabe
quanto pesam as «três caixas»; os 40 kg são tão assumidos como os 15 que dariam para caber
no limite.

**A regra que fica**, e é a mesma que a DesertX ensinou: **os quilos de um ponto de carga
tiram-se do manual, não do hábito.** Quando o manual não os dá, a assunção escreve-se ao
lado. Foi por se ter copiado o hábito em silêncio que a DesertX passou meses com o ponto do
meio em 100 kg quando o manual limitava a bagagem a 30 e o valor era 105.

### Por verificar, quando os manuais aparecerem

A mesma conta — carga útil contra o ponto mais alto — falta fazer às outras CFMoto
(800MT, 800MT-X, 1000MT-X, 450MT) e às Kove e QJ que usem pontos de carga. Precisa do peso
máximo autorizado de cada uma, que vem na ficha técnica do respectivo manual.

---

## 7 de agosto de 2026, parte VII — a auditoria da carga útil passa a correr sozinha

Feita a verificação a todos os perfis com pontos de carga cujo manual está em disco. **São
24 perfis com pontos de carga; cinco tinham manual à mão.**

| Mota | Ponto mais alto | Carga útil do manual | |
|---|---:|---:|---|
| CFMoto 700MT | 190 kg | **165 kg** | excede |
| Voge 625 DSX | 190 kg | **183 kg** | excede |
| BMW S 1000 R | 190 kg | 208 kg | ok |
| Triumph Speed Triple 1200 RS | 150 kg | 195 kg | ok |
| Ducati DesertX | 150 kg | 242 kg | ok |

**A Voge repete o padrão da CFMoto**, e por isso deixou de ser anedota. O manual dá três
casos — condutor só, condutor com 3 malas, condutor com passageiro e 3 malas — e nunca diz
quanto pesam as malas. A convenção do projeto assume 40 kg, e com isso o caso mais pesado
dá 190, sete quilos acima da «loading capacity» de 183 que o mesmo manual publica.

Reparo lateral que confirma que o mapeamento está bem feito: **a Voge não tem caso de «dois
sem bagagem»**, e é por isso que os perfis Voge saltam de 115 para 190 sem passar por 150.
Não é lacuna, é fidelidade ao manual.

### Campo novo `payloadKg`, e a auditoria vira teste

Em vez de repetir isto à mão de cada vez que aparece um manual, a carga útil passou a ser
um campo do perfil e o `verificar-precarga` ganhou uma segunda verificação: compara-a com o
ponto de carga mais alto e **falha se aparecer um caso novo**. Os dois casos conhecidos
estão numa lista de exceções com a razão escrita, no mesmo estilo dos CONHECIDOS do
`verificar-coerencia`.

Preenchido em cinco perfis, todos com o número tirado do manual. Vem escrito de duas
maneiras conforme a marca — a Voge, a BMW e a Triumph dão-na directa; a CFMoto e a Ducati
dão o peso máximo e a tara, e subtrai-se.

**Porque é que isto importa e não é burocracia:** um ponto de carga acima do que a mota
aguenta estica o troço de cima da curva, e a interpolação passa a devolver **de menos a toda
a gente que ande carregada** — que é justamente quem mais precisa do ajuste.

### O que a BMW faz e obriga a pensar diferente

O manual da S 1000 R não dá cliques por carga. Dá **sag**: 50 mm à frente e 40 mm atrás, com
piloto de 85 kg. É por isso que os perfis BMW têm as pré-cargas como `pos` com a medida de
sag, e é a razão de o `baseKg` deles ser 85 e não 75 — vem do manual, não é arbitrário.

Vale a pena ter presente que **há marcas que não se deixam reduzir a uma tabela de cliques**,
e que forçá-las a isso seria inventar. Para essas, o ecrã de sag da app é o caminho certo.

---

# ESTADO EM 7 DE AGOSTO DE 2026 — o que fica aberto

Secção de fecho. As de cima contam como se chegou aqui; esta diz o que falta, e substitui
as listas soltas que ficaram espalhadas pelas partes I a VII.

**Onde estão os dados:** 104 perfis de suspensão, **85 confirmados por manual**. 120 linhas
de pressão, 94 por manual. Dez perfis com a carga útil do manual. Código e Supabase em
sincronia. (Números de 7 de agosto ao fim do dia — ver as partes VII a X.)

## 1. Manuais por abrir — é o que desbloqueia quase tudo

**Carga útil (`payloadKg`): faltam 19 dos 24 perfis com pontos de carga.** Basta a ficha
técnica. Por ordem de quanto rendem:

- **CFMoto** — 800MT, 800MT-X, 1000MT-X, 450MT, 800NK. Marca com mais utilizadores (81), e
  já mostrou o problema na 700MT.
- **Voge** — 900 DSX, 800 DSX Rally. Segunda marca (59), e as duas têm o ponto de cima em
  190 tal como a 625 DSX, que excedeu.
- **Honda Transalp** (3 perfis) — a mais intrigante das restantes: tem cinco pontos de carga
  (75/95/120/150/190) cuja origem não se conseguiu reconstituir. Ou a Honda publicou ali uma
  tabela mesmo — ao contrário do X-ADV, que não tem nenhuma — ou alguém os inventou.
- **Suzuki V-Strom 1050DE e 800DE** — pontos 80/100/155/175, números demasiado específicos
  para virem do hábito. Cheira a tabela real por confirmar.
- Restantes: BMW R 1200 GS LC, Triumph Tiger 900 GT e Rally Pro, Scrambler 1200 XE, Street
  Triple RS, Aprilia Tuareg 660, Ducati Hypermotard 698.

**Perfis de suspensão sem manual: 21**, dos quais **15 são KTM**. Os links diretos estão na
secção «A lista de manuais KTM a descarregar». Guardar em `~/dev/manuais-ktm/`.

**Dois casos à parte, que não são de carga:** a Honda NC750X e a Ducati DesertX V2 aparecem
no seletor sem `adjusters` — a app assume o default do nível `adj`. Se a DesertX V2 de 2026
não existir mesmo, o honesto é marcá-la `hidden` em vez de a deixar a correr sobre um
palpite.

## 2. Decisões por tomar, não trabalho por fazer

**A pré-carga da `honda` e da `suzuki`.** As duas movem `tu_soft` a um quarto do ritmo da
`ktm`, para o mesmo tipo de afinador. Não se sabe qual está certa e há indício de que a
diferença possa ser deliberada — na DesertX a pré-carga da frente não mexe nada com a carga,
na KTM mexe 3 a 6 voltas. **Não uniformizar por gosto de simetria.** O caminho é o
`preloadKgPerTurn`, mota a mota, à medida que os manuais aparecem.

**O 1190 Adventure R** é o terceiro caso conhecido do salto de pré-carga (+12 voltas) e ficou
sem `preloadKgPerTurn` de propósito: o peso máximo autorizado está na ficha técnica, que fica
depois do corte da leitura remota.

**Alargar o `preloadKgPerTurn` aos cliques** (`cl_soft`). Hoje só se aplica a voltas. A
DesertX e várias Honda têm a pré-carga em cliques. Fazer **quando houver uma segunda mota a
pedi-lo**, não por antecipação.

## 3. Infraestrutura

**`verificar-sync` continua desligado no CI.** Precisa de dois secrets em Settings → Secrets
and variables → Actions: `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
Depois é descomentar o último passo do `verificar.yml`. Enquanto não estiver ligado, uma
divergência entre o código e a base só se descobre correndo o script à mão.

## 4. Produto — o que os números pedem

**Reler as consultas 2, 3 e 9 do `posthog-consultas.md`** passadas duas a três semanas do OTA
de agosto. A 2 e a 3 dizem se o `real_oem` subiu à custa do `real_mfz`; a 9 é a primeira
leitura de sempre das motos que as pessoas procuram e não existem.

**A pergunta por responder:** pneus 38 % e sag 36 % contra diário 9 % e setups 6 %. Se a app
está a ser usada para consultar e não para registar, há duas funcionalidades a receber
trabalho que ninguém pediu. **Não se decide por opinião** — decide-se cruzando
`diary_entry_created` e `setup_saved` com quem abre esses ecrãs, que é uma consulta que
ainda não está escrita.

---

## 7 de agosto de 2026, parte VIII — mais três cargas úteis, buscadas em vez de pedidas

Em vez de esperar pelos manuais, foram buscados aos sites dos importadores. **Oito dos 24
perfis com pontos de carga têm agora a carga útil do manual.**

| Mota | Carga útil | Ponto mais alto | |
|---|---:|---:|---|
| CFMoto 700MT | 165 kg | 190 | excede (conhecido) |
| CFMoto 450MT | **170 kg** | 115 | ok |
| Voge 625 DSX | 183 kg | 190 | excede (conhecido) |
| Triumph Speed Triple 1200 RS | 195 kg | 150 | ok |
| Voge 900 DSX | **205 kg** | 190 | ok |
| Voge 800 DSX Rally | **205 kg** | 190 | ok |
| BMW S 1000 R | 208 kg | 190 | ok |
| Ducati DesertX | 242 kg | 150 | ok |

**A suspeita sobre os Voge não se confirmou, e ainda bem.** Achava-se que o 900 DSX e o 800
Rally repetissem o excesso do 625 por terem o mesmo ponto de 190. Não repetem: as duas
grandes têm 205 kg de carga útil e o ponto cabe. **O 625 é que é a mota pequena da família**,
com 183, e é só nela que os 190 passam. Palpite razoável, e errado — foi preciso ir ver.

### Onde estão os manuais, para a próxima

- **Voge**: os italianos (`vogeitaly.it/wp-content/uploads/UM-VOGE-VALICO-*.pdf`) têm a
  secção de suspensão mas **não têm ficha técnica**. Os espanhóis
  (`vogespain.es/wp-content/uploads/Manual-de-Propietario-Voge-*-Espanol.pdf`) **têm ficha
  técnica e dão a carga útil directa**. Para carga útil, usar sempre os espanhóis.
- **CFMoto**: o italiano do 450MT (`cfmotoitaly.it/wp-content/uploads/CFMOTO-450MT-Owner-manual.pdf`)
  dá o peso máximo e a tara. Os americanos estão em `cfmotousa.com/owners-manuals` **com
  outros nomes** — o 800MT é o **Ibex 800 S**, o 450MT é o **Ibex 450**.

### O manual do 800 DSX Rally contradiz-se, e a ficha ganha

O texto de segurança diz «carga máxima: 150 kg»; a ficha técnica diz «capacidad de carga
205 kg». **Vale a ficha**, e a razão é aritmética e não preferência: 227 kg de peso em ordem
de marcha mais 205 de carga dão exactamente os 432 de peso máximo que a mesma tabela publica,
e os pesos por roda (113 + 114) também somam 227. **O 150 não bate com nada** — parece
copiado de um modelo mais pequeno. Fica escrito no perfil.

### O que não se conseguiu, e porquê

**CFMoto 800MT, 800MT-X, 1000MT-X e 800NK.** O manual italiano do 800MT-X diz, com todas as
letras, que a carga máxima admissível está **numa etiqueta colada na mota** e não a publica.
Os manuais americanos dos equivalentes Ibex também não a trazem na ficha. Ou seja: **não é
falta de procurar, é a CFMoto a não publicar** — ao contrário do que faz na 700MT e na 450MT.

Para essas quatro, o caminho é fotografar a etiqueta da mota ou pedir a ficha de
homologação. Não vale a pena voltar a procurar nos manuais.

Continuam por confirmar, com manual por abrir: Honda Transalp (3), Suzuki V-Strom (2),
BMW R 1200 GS LC, Triumph Tiger 900 GT e Rally Pro, Scrambler 1200 XE, Street Triple RS,
Aprilia Tuareg 660, Ducati Hypermotard 698.

---

## 7 de agosto de 2026, parte IX — a V-Strom 800DE estava errada, e a irmã fica sob suspeição

Continuação da caça aos manuais. Apanhou-se o erro mais consequente do dia.

### Confirmados por manual, sem correções

- **Triumph Street Triple RS** — «Maximum Payload» 195 kg. Ponto de cima 150, cabe.
- **Honda XL750 Transalp 2025** — manual oficial 32MLC810. Pré-carga da frente 6 voltas de
  15 possíveis, traseira na posição 2 de 7. **Os dois valores base batem certo**, e o perfil
  passou a `oem_manual`. Carga útil 207 kg, com o limite de bagagem em 19,5 kg.

**MAS os pontos de carga da Transalp continuam a ser estimativa,** e agora sabe-se com
certeza: o manual diz apenas «to suit the load or the road surface» e **não traz tabela
nenhuma por carga**, tal como o do X-ADV. Os 95, 120, 150 e 190 kg não vêm de fonte nenhuma.
Está escrito no perfil, para ninguém os tomar por dados de fábrica.

### V-Strom 800DE: duas correções, uma delas grande

O manual oficial DL800DE deu as duas.

**A pequena:** a compressão da frente estava a 1,5 voltas. Esse é o valor da **extensão** —
o manual manda 2,25 para a compressão. Alguém copiou a linha errada.

**A grande, e é a que afecta gente:** a pré-carga traseira com passageiro. O manual é
inequívoco — «default setting (one passenger): **12 clicks**» e «reference setting (two
passengers): **28 clicks**». A tabela que lá estava dava **17** aos 155 kg. **Onze cliques a
menos** do que a Suzuki manda pôr, exactamente para quem anda a dois, que é quem mais precisa.

A tabela foi refeita com os dois pontos que o manual dá, e mais nenhum. **O amortecimento
deixou de variar com a carga** — não por descuido, mas porque o manual dá um valor padrão
único e a variação que lá estava não vinha de lado nenhum.

**Armadilha registada:** este manual cobre a **V-Strom 800 e a 800DE**, com secções separadas
e valores diferentes — a pré-carga da frente da 800 é 5 voltas e a da DE é 6. Ao ler, é
obrigatório confirmar o cabeçalho «(V-STROM 800DE)» antes de copiar seja o que for. É o
mesmo género de erro que estragou a CFMoto 700MT em agosto.

### V-Strom 1050DE: sob suspeição, com motivo

Não se lhe mexeu, mas ficou marcada. **A razão é concreta e não desconfiança geral:** tem uma
tabela de carga com exactamente a mesma forma da que se acabou de provar errada — os mesmos
quilos (80/100/155/175), o amortecimento a descer com a carga, a pré-carga traseira a subir
devagarinho. Mesma origem, mesmo desenho, e a irmã falhou por onze cliques.

**Segundo problema, este visível sem manual nenhum:** a pré-carga da frente está declarada
como `pos` (entalhe 1 a 7), e a app **não ajusta valores `pos`** — mas a tabela de carga traz
`fPre: 4/5/7/7`, que nunca chega a ser lido. São dados mortos a dar uma ideia de precisão que
não existe.

Falta o manual DL1050DE, secções 2-143 e 2-147. A leitura remota trunca antes.

### Estado dos números

**104 perfis, 85 por manual. 10 com carga útil do manual.**

---

## 7 de agosto de 2026, parte X — varredura às tabelas de carga, e o balanço

Depois de a V-Strom 800DE se ter revelado errada, a pergunta certa deixou de ser «que
manuais faltam» e passou a ser **«quantas outras tabelas de carga foram inventadas?»**.

### A varredura

Todos os 24 perfis com pontos de carga, cruzando duas coisas: se estão confirmados por
manual, e se o amortecimento varia com a carga — que é a assinatura da tabela inventada,
porque poucos fabricantes publicam isso.

**Resultado: 22 dos 24 estão confirmados por manual.** Os dois que não estão:

- **Suzuki V-Strom 1050DE** — já marcada sob suspeição na parte IX.
- **Honda XL750 Transalp 2023** — os pontos são estimativa assumida, e o próprio perfil
  sempre o disse («position estimated»). O amortecimento não varia, portanto o risco é só
  nos quilos.

**Não há problema sistémico.** A V-Strom era um perfil por confirmar, não a ponta de um
iceberg. Foi bom perguntar.

### Prova disso: a Speed Triple 1200 RS, verificada valor a valor

Para confirmar que as tabelas marcadas como «manual» são mesmo do manual, pegou-se numa ao
acaso e comparou-se com o handbook em disco. **Bate tudo:**

| | Solo (manual) | Perfil | Passageiro (manual) | Perfil |
|---|---:|---:|---:|---:|
| Pré-carga frente | 4 voltas | 4 | 4 voltas | 4 |
| Frente comp. / ext. | 15 / 15 | 15 / 15 | 15 / 15 | 15 / 15 |
| Trás compressão | 20 | 20 | 10 | 10 |
| Trás extensão | 16 | 16 | 10 | 10 |

Inclui o pormenor de a Triumph não publicar valor de pré-carga traseira nesta mota — o
perfil marca-a `pos` com a nota, em vez de inventar um número.

### O que ficou por fazer, e porquê — não é falta de procurar

**Carga útil, 14 perfis sem ela.** Divididos por razão:

- **CFMoto 800MT, 800MT-X, 1000MT-X, 800NK** — a CFMoto **não a publica** nos manuais destes
  modelos. O manual italiano do 800MT-X diz textualmente que está numa etiqueta colada na
  mota. Caminho: fotografar a etiqueta.
- **Triumph Tiger 900 GT e Rally Pro, Scrambler 1200 XE** — os handbooks estão em
  `api.triumphtechnicalinformation.com`, que **exige sessão** e devolve vazio a quem chega de
  fora. Caminho: descarregar pelo site da Triumph, com conta.
- **BMW R 1200 GS LC, Aprilia Tuareg 660, Ducati Hypermotard 698, Honda Transalp 2023 e 2026,
  Suzuki V-Strom 1050DE** — sem fonte aberta encontrada. Caminho: PDF em disco.

**Nota sobre fontes secundárias.** Apareceram valores de carga útil em sites de fichas
técnicas e em bases de manuais de terceiros. **Não foram usados.** Um número de carga útil
tirado de um agregador tem exactamente o mesmo estatuto que os números do mfzstudio que
passámos o dia a corrigir — e a Aprilia é bom exemplo: o agregador dava 75 kg de carga útil,
que é menos do que pesa o condutor, portanto está obviamente mal lido.

---

## 7 de agosto de 2026, parte XI — peso em libras, a pedido de um utilizador

### O que já lá estava, e mudou o âmbito

Antes de escrever seja o que for: **o ecrã de pneus já mostrava PSI** ao lado de bar. A
metade mais óbvia do pedido estava feita há muito. O que faltava era o peso — e o peso é
diferente das pressões por uma razão que decide o desenho todo: **não é só mostrado, é
escrito**. O utilizador põe o peso dele no onboarding, no ecrã de carga e no perfil.

### A regra: métrico por dentro, imperial nas pontas

Tudo o que está gravado continua em quilos — setups, perfis, diário, Supabase. A conversão
acontece só no que se mostra e no que se lê dos botões.

**Porquê, e não guardar na unidade escolhida:** quem já usa a app tem registos em quilos. Se
a unidade passasse a fazer parte do dado, um `75` gravado ficava ambíguo para sempre — 75
quilos ou 75 libras? — e não há forma de descobrir depois. Assim, mudar de unidade nas
Definições **nunca reescreve nada**.

### O erro que este desenho convida, e o teste que o impede

Converter nas pontas faz o número fugir se não se tiver cuidado: escolhe-se 165 lb, guarda-se
74,84 kg, e ao reabrir aparece 164 ou 166. **Ninguém reporta um bug assim** — assume que se
enganou — mas mina a confiança em tudo o resto.

A regra que o evita é não arredondar ao guardar. O valor em quilos fica fraccionário de
propósito; só o que se mostra é inteiro.

**`npm run verificar-unidades`**, ligado ao CI, percorre **as 287 libras e os 131 quilos que
a app deixa escolher, um a um**, e confirma que ir e voltar dá o mesmo número. Verifica
também que os limites convertidos não deixam sair do intervalo — o máximo do condutor dá
286 lb, que de volta são 129,7 kg e não 130,1 — e tem quatro âncoras de cabeça (75 kg = 165
lb) que apanham uma constante trocada, coisa que os outros dois testes não apanhariam:
**uma conversão consistentemente errada é consistentemente estável.**

### Decisões que vale a pena não reabrir sem razão

**Só o peso.** O sag fica em milímetros e os valores em mm dos manuais também. Esses números
são citações — convertê-los a polegadas é acrescentar arredondamento a dados que hoje estão
certos, e mesmo nos EUA quem afina suspensão mede o sag em mm.

**A predefinição vem da região do telemóvel**, mas usando o `Intl` do motor de JavaScript e
**não o `expo-localization`**. A razão é prática e não estética: o `expo-localization` é
módulo nativo, e acrescentá-lo obrigava a uma compilação nova em vez de uma actualização por
OTA. Se o `Intl` falhar, fica métrico, que é o que a app sempre fez.

**A preferência guardada distingue «nunca escolheu» de «escolheu métrico».** O valor por
omissão no armazenamento é string vazia. Sem isso, quem escolhesse métrico nos EUA voltava a
ver libras no arranque seguinte.

### Instrumentação

Evento `units_changed`, com `automatico: false` — consulta 11 no `posthog-consultas.md`. Só
dispara quando alguém vai às Definições mudar de propósito. **A escolha automática não
dispara evento**, porque contá-la seria confundir geografia com vontade.

---

## 7 de agosto de 2026, parte XII — auditoria às pressões de todo-o-terreno

A pergunta era se se podia acrescentar pressão de todo-o-terreno às restantes Adventure.
Ao ir ver de onde vinham as que já existiam, apareceu o contrário: **quatro das dez não
tinham fonte nenhuma.**

### O que havia, e o que era

| Mota | Estado |
|---|---|
| Aprilia Tuareg 660 | ✓ manual: «fora de estrada 2,0 nas duas rodas» |
| Ducati DesertX 937 | ✓ manual: «1,8 e 2,0 à frente; 1,8 e 2,2 atrás» |
| Ducati Multistrada V4 Rally | ✓ manual, **mas para outro pneu** — ver mais abaixo |
| Yamaha Ténéré 700 | ✓ manual: secção «Off-road riding», 200 kPa nas duas rodas |
| DesertX V2 e DesertX Rally | herdados do 937, já marcados `estimated_spec` |
| **Honda Africa Twin ×3** | **✗ sem fonte — RETIRADOS** |
| **KTM 1190 Adventure R** | **✗ sem fonte — RETIRADOS** |

### Porque é que as Honda saíram

A fonte citada é a etiqueta de pneus do manual, que dá **só pressões de estrada** — 225/250
kPa a solo e 225/280 a dois. Os 1,5 e 1,8 bar de todo-o-terreno não constavam dela nem de
mais lado nenhum, e a linha estava marcada `oem_manual`. Eram números sem origem
apresentados como dados de fábrica.

**Porque é que se retiraram em vez de se marcarem como estimativa:** a `dataQuality` é por
linha e não por campo, e as pressões de estrada destas motas **vêm mesmo do manual**.
Rebaixar a linha toda lançaria dúvida sobre dados que estão certos. Sem forma de marcar só
um campo, a escolha honesta é não publicar o que não se sabe.

### Porque é que a KTM saiu, e é a mais conclusiva

Não é «não encontrámos» — é que **a KTM não publica pressão de todo-o-terreno**. Nos
manuais do 890 Adventure R e do 1290 Super Adventure R, que são os modelos mais virados
para fora de estrada, a ficha dá uma pressão única: **2,4 à frente e 2,9 atrás, para solo,
com passageiro E com carga máxima.** Não há coluna de piso nenhuma. Dois manuais
independentes, mesma resposta.

### A resposta à pergunta original: não dá para alargar, e a razão é física

**A pressão de todo-o-terreno não é uma propriedade da mota.** Depende do pneu, do piso, da
velocidade e de haver ou não câmara-de-ar. A Ducati Multistrada V4 Rally prova-o dentro do
mesmo manual: os 1,6 bar são para o **Scorpion Rally**, o pneu de tacos, e não para o
Scorpion Trail II que a mota calça de série.

Qualquer regra do tipo «menos 25 % da pressão de estrada» seria o `category_estimate` outra
vez — mas desta vez num número onde errar tem consequência física: baixar demasiado num
pneu sem câmara descola-o da jante, e isso não avisa.

**Só quatro fabricantes de todo o catálogo publicam alguma coisa:** Aprilia, Ducati, Yamaha
e mais ninguém. Não é falta de procurar.

### Por resolver: o aviso do pneu não chega a quem não lê português

Encontrado ao investigar isto, e é um defeito real de honestidade do ecrã. O
`fonteLegivel()` do `app/pneus.tsx` corta a fonte no primeiro travessão para quem não está
em português — e é **depois** do travessão que vive a ressalva «estes valores são para o
pneu de tacos». Um utilizador inglês vê 1,6 bar na Multistrada Rally sem saber que é para
um pneu que ele provavelmente não tem.

Três saídas possíveis, por ordem de esforço: pôr a ressalva **antes** do travessão nas três
motas que têm dados reais; ou criar um campo próprio para a condição do pneu, mostrado no
separador de todo-o-terreno; ou traduzir as fontes, que é o problema de fundo e o maior.

---

## 7 de agosto de 2026, parte XIII — o pneu passa a aparecer, e o plano das marcas de pneus não pega

### O defeito de honestidade, corrigido

Campo novo `offroadTyre` na tabela de pressões: **o pneu a que as pressões de todo-o-terreno
se referem, tal como o manual o nomeia.** Aparece no separador de todo-o-terreno, num aviso
a amarelo.

Resolve o problema encontrado na parte XII: o `fonteLegivel()` corta a fonte no primeiro
travessão para quem não está em português, e era **depois** do travessão que vivia a ressalva
«estes valores são para o pneu de tacos». Um utilizador inglês via 1,6 bar na Multistrada
Rally sem saber que era para um pneu que provavelmente não tem.

**Porque é que um campo próprio e não mexer no texto da fonte:** o nome do pneu é nome
próprio — «Pirelli Scorpion Rally STR» é igual nas seis línguas. Só a frase de enquadramento
precisou de tradução. Mover a ressalva para antes do travessão resolvia num caso e deixava o
problema de fundo de pé.

Preenchido em quatro linhas, todas com o nome tirado do manual. A ficha da DesertX nomeia-o
explicitamente: «Make and type: Pirelli Scorpion Rally STR», e dá as pressões de todo-o-terreno
logo a seguir — 1,8 bar a solo, 2,0 à frente e 2,2 atrás com passageiro.

### O plano de cruzar com as marcas de pneus: não pega, e é bom sabê-lo antes

A ideia era boa — ir aos sites oficiais buscar o pneu de série e depois às marcas de pneus
buscar as pressões de todo-o-terreno. **A segunda metade não existe.**

As marcas de pneus **remetem para o fabricante da mota**. A Michelin di-lo directamente:
«recommended pressures are related to the bike and not the tires». A Pirelli, para os pneus
Rally, publica apenas **um mínimo — 1,6 bar (24 psi)** — e uma faixa genérica de trabalho de
2,2 a 2,5 bar a quente, com a nota de que a pressão depende da carga e do veículo.

E faz sentido: a pressão certa depende do peso que vai em cima, e disso o fabricante do pneu
não sabe nada. Quem sabe é quem fez a mota. **Não há tabela para cruzar.**

**O que daí se aproveita, e não é nada:** o mínimo da Pirelli explica os números que temos.
A Multistrada V4 Rally traz 1,6 bar, que é exactamente o mínimo do fabricante do pneu; a
DesertX traz 1,8, com folga. Ou seja, os manuais estão a trabalhar contra esse limite. Serve
de teste de sanidade a qualquer valor futuro: **abaixo de 1,6 bar não se escreve nada sem
fonte muito boa**, porque é território onde o pneu descola da jante.

### O que sobra, e é o caminho certo

Varrer os manuais das motas **Adventure** à procura de quem publique pressões de
todo-o-terreno, como fazem a Ducati, a Aprilia e a Yamaha. Pela amostra até agora, a maioria
não publica — a KTM está provada que não, a Honda também não, a CFMoto nem carga útil dá.

Não vai cobrir o catálogo. Mas cada mota que aparecer é dado real, e as que não aparecerem
ficam sem separador de todo-o-terreno, que é a resposta honesta.

---

## 7 de agosto de 2026, parte XIV — varredura às Adventure: quem publica pressão de todo-o-terreno

**73 motos Adventure no catálogo.** Varridos todos os manuais que estavam à mão — dez, de
nove marcas. O resultado é claro e poupa trabalho futuro.

### Publicam

| Marca | Prova |
|---|---|
| **Ducati** | Ficha da DesertX: «1,8 bar (off-road, rider only); 2,0 (off-road, rider and passenger)», com o pneu nomeado — Pirelli Scorpion Rally STR |
| **Yamaha** | Ténéré 700, secção «Off-road riding»: 200 kPa à frente e atrás |
| **Aprilia** | Tuareg 660: «fora de estrada 2,0 nas duas rodas» |

**Já estão todas no catálogo.** Não há nada por colher nestas três marcas além dos modelos
cujos manuais ainda não se abriram.

### Não publicam — verificado, não presumido

| Marca | O que o manual diz |
|---|---|
| **KTM** | 890 Adventure R e 1290 Super Adventure R: pressão única 2,4/2,9 para solo, com passageiro E carga máxima. Sem coluna de piso. |
| **Honda** | X-ADV, Transalp 2025 e Africa Twin: nada. Só a etiqueta com pressões de estrada. |
| **CFMoto** | 700MT: diz «reduzir a pressão dos pneus pode ajudar a obter melhor controlo» e **não dá valor nenhum**. 450MT: nada. |
| **Voge** | DS625X e 900DSX: nada. |
| **Suzuki** | V-Strom 800DE: nada. O G-Mode é regulação de tracção, não de pressão. |

O caso da CFMoto é o mais revelador: **sabe que se deve baixar e não diz quanto.** É a
posição da maioria da indústria — reconhecer a prática sem assumir responsabilidade por um
número.

### O que isto quer dizer, na prática

**A cobertura de todo-o-terreno vai ficar em três marcas.** Não por falta de trabalho: das
nove marcas verificadas, seis não publicam nada e duas dessas — CFMoto e Voge — são as que
têm mais utilizadores da app.

E as três que publicam já estão feitas. **O trabalho que resta não é varrer mais manuais, é
abrir os manuais Ducati que faltam** — a Ducati é a única marca com muitos modelos Adventure
no catálogo (dez) e o hábito de publicar. As quatro que têm dados são as DesertX e a
Multistrada V4 Rally; falta ver se as Multistrada V2 e V4 de estrada trazem coluna de
todo-o-terreno, o que é duvidoso por serem menos vocacionadas.

### A regra que fica escrita

**Não se inventa pressão de todo-o-terreno.** Sem valor no manual, a mota fica sem separador
— que é a resposta honesta e a que o utilizador merece. Se um dia se quiser dar orientação
genérica, que seja texto explicativo assumido como tal, com o mínimo de 1,6 bar da Pirelli
como limite inferior absoluto, e nunca um número por mota a fingir que veio de fábrica.

---

## 8 de agosto de 2026 — a app estava presa no iOS, e ninguém sabia

Ao preparar as capturas de ecrã para a App Store, correu-se a app **no simulador de iPhone
pela primeira vez**. Desenhava tudo bem e não respondia a um único toque.

### O diagnóstico, e como se distinguiu de um falso alarme

Primeiro confirmar que o problema era da app e não do simulador: o botão Home respondia,
os toques dentro da app não. Depois, o log do Metro deu a causa em texto:

```
[UIKitCore] Attempt to present <RCTFabricModalHostViewController: 0x1360c9400>
on <UIViewController: 0x106e09800> which is already presenting
<RCTFabricModalHostViewController: 0x1360c8a00>.
```

**Duas modais apresentadas ao mesmo tempo.** No iOS cada `Modal` do React Native é um view
controller, e o UIKit recusa apresentar o segundo enquanto o primeiro estiver no ar. A
segunda nunca aparece, a primeira fica montada — invisível, em ecrã inteiro, a engolir os
toques. O ecrã continua a desenhar-se e a app fica morta.

**Porque é que nunca deu no Android:** lá o mesmo código convive sem se queixar. O
`app.json` tem `newArchEnabled: true`, e é na arquitetura nova que o iOS aperta.

### Os dois sítios, ambos no `app/index.tsx`

**Trocar de mota.** O seletor está aberto, escolhe-se outra mota, e o código fazia
`setSwitchModal({ visible: true })` **sem nunca fechar o seletor**. Duas ao mesmo tempo.

**Gravar a troca sem premium.** Fechava-se a modal de troca e abria-se a premium no mesmo
ciclo — dispensar e apresentar em simultâneo, a mesma família de erro.

### A correção: as modais passam a ser servidas à vez

Uma fila. Fecha-se uma, guarda-se o que vem a seguir, e só se abre quando o `onDismiss`
confirmar que a primeira saiu de facto. O `onDismiss` foi acrescentado ao `BikePicker` e ao
`SwitchBikeModal`.

**A parte que quase corria mal:** o `onDismiss` **só existe no iOS**. Usar a fila nas duas
plataformas trocava um ecrã preso no iOS por uma janela que nunca abre no Android — pior,
porque não dá erro nenhum e ninguém repara. Por isso o `agendar()` só enfileira no iOS; no
Android abre já, como sempre fez.

### A regra que fica

**Nunca mudar duas modais no mesmo ciclo de render.** Está escrita em comentário no
`index.tsx`, junto à fila.

Varridos os outros seis ecrãs com modais — `carga`, `setups`, `profiles`, `diary`,
`settings` e `diagnostico`. **Nenhum tem o padrão perigoso:** as modais abrem sempre a
partir do ecrã principal, nunca de dentro de outra, e onde há premium existe um `return`
que impede a segunda.

### O que isto diz sobre o resto

**Foi a primeira vez que a app correu em iOS.** Encontrou-se um defeito que a tornava
inutilizável — e teria sido recusada pela Apple à primeira, porque «a app não responde» é
dos motivos de rejeição mais comuns.

Não há razão para acreditar que seja o único. As capturas de ecrã para a App Store obrigam
a passar por todos os ecrãs, e isso **é o teste de fumo que nunca se fez**. Vale a pena
fazê-lo com atenção em vez de à pressa.

**Como correr no simulador,** para não se voltar a perder tempo com isto:

```bash
xcodebuild -downloadPlatform iOS          # só na primeira vez, vários GB
xcrun simctl create "iPhone 16 Pro Max" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-16-Pro-Max \
  com.apple.CoreSimulator.SimRuntime.iOS-26-5
open -a Simulator
cd frontend && npx expo run:ios --device "iPhone 16 Pro Max"
```

O Xcode instalado não traz runtimes de iOS nem aparelhos criados — as duas primeiras linhas
resolvem isso, e o sintoma de faltarem é `xcrun simctl list devices available` vir vazio.

---

## 8 de agosto de 2026, parte II — a conta Apple saiu, e o iOS destrancou

A adesão ao Developer Program foi aprovada ao fim de dez dias. O que se fez a seguir, pela
ordem em que tem de ser feito — há dependências e a ordem errada faz perder tempo.

### Feito

| Passo | Resultado |
|---|---|
| App ID no portal Apple | `com.ridetune.app`, explícito, **sem capabilities** |
| App no App Store Connect | criada |
| Chave de compra integrada (.p8) | Key ID `2P4BB58NRH` |
| App iOS no RevenueCat | criada com a P8 |
| Chave pública iOS | `appl_TiOoTYmhcREKOiUeBtLAtoYiTQM`, nos quatro perfis do `eas.json` |

**Team ID: `B4MB4K336U`** — aparece no canto do portal e é preciso de vez em quando.

**Nenhuma capability foi marcada no App ID**, de propósito. A app não usa push, iCloud,
Sign in with Apple nem Apple Pay, e as compras integradas **não** precisam de capability —
funcionam por omissão. Marcar a mais complica a assinatura e gera avisos na submissão.

### O guarda que se pôs no código, e porquê

O teste de «tenho chave?» era `API_KEY.length > 0`. O marcador `POR_PREENCHER_appl_xxx`
não é vazio, portanto **passava**: a app dava as compras por disponíveis, mostrava o
paywall, e só falhava quando alguém tentasse pagar. É o pior sítio possível para falhar, e
na App Store é motivo de rejeição — há funcionalidade premium que ninguém consegue comprar.

Passou a verificar-se o **prefixo**: `appl_` no iOS, `goog_` no Android. Apanha o marcador
por preencher e apanha também a troca das chaves entre plataformas, que é o engano clássico
e que o comentário existente avisava sem conseguir impedir.

### `*.p8` no .gitignore

A chave privada da Apple descarrega-se **uma vez só** e não se pode voltar a obter — apenas
revogar e criar outra. Não tem lugar no repositório. Ficou ignorada por três padrões, para
apanhar os nomes que a Apple gera.

### A seguir

1. **Produto de compra** no App Store Connect: não-consumível, ID `ridetune_premium_lifetime`,
   igual ao do Android. Falta decidir o escalão de preço — a Apple trabalha por degraus, não
   aceita qualquer valor.
2. **Offering no RevenueCat** com esse produto, senão o `offerings.current.availablePackages[0]`
   que a app lê vem vazio e o paywall fica sem preço.
3. **Build e TestFlight.**
4. **Ficha da app**: textos já escritos em seis línguas no `app-store-ficha.md`, capturas
   já feitas a 1320×2868, política de privacidade e suporte já no ar.

---

## BMW: o manual publica suspensão, ao contrário das pressões (8 ago 2026)

Está escrito mais acima que as BMW ficam «tudo `na`, como a BMW com ESA». **Isso é
verdade para as pressões de pneus e falso para a suspensão.**

A BMW não publica pressões no manual — só o autocolante debaixo do assento, e isso
mantém-se. Mas publica **regulações de suspensão por estado de carga**, no formato que
o `weightPoints` usa. Verificado no manual da F 800 GS Adventure, secções «Spring
preload» e «Damping»:

| Estado | Precarga trás | Amortecimento trás |
|---|---|---|
| Um ocupante, sem carga | fim do curso anti-horário (0) | 1,5 voltas a abrir |
| Um ocupante, com carga | 12 voltas | 1,5 voltas a abrir |
| Dois ocupantes, com carga | até ao batente, **sem número** | 1 volta a abrir |

A R 1200 GS LC já estava assim, com 0/15/30 voltas. Ou seja: o padrão existe e
funciona para pelo menos duas BMW.

**Vale a pena varrer as restantes sete BMW do catálogo por este ângulo.** As que têm
Dynamic ESA continuam a ser `na` — aí a regulação é mesmo por ecrã — mas as de
suspensão convencional devem ter tabela.

### O buraco da F 800 GS Adventure

Para «dois ocupantes com carga» a BMW manda rodar o manípulo até ao batente e **não diz
quantas voltas**. O terceiro `weightPoint` ficou sem `rPre` de propósito: a interpolação
fixa nas 12 voltas do ponto anterior, que é MENOS do que a BMW manda, e o `countNote`
avisa disso por escrito.

Fecha-se de duas maneiras: medindo o curso total do manípulo numa moto a sério, ou
encontrando-o no manual de reparação (Reparaturanleitung), que costuma dá-lo. Enquanto
não se fechar, quem anda a dois e carregado recebe menos precarga do que devia.

### Pedidas por utilizador e ainda por fazer

Vieram as quatro no mesmo pedido; só a F 800 GS Adventure ficou feita.

- **BMW G 450 X (2008-2011)** — enduro, produção pequena, fora de linha
- **BMW G 650 Xchallenge (2007-2009)** — idem
- **Husaberg TE 300 (2013)** — obriga a criar uma 15.ª marca, e a Husaberg foi absorvida
  pela Husqvarna em 2014. Sendo enduro de competição, é provável que o manual dê
  regulações WP standard; a KTM e a Husaberg publicam-nas, ao contrário da BMW.

Nenhuma é comum, mas todas foram pedidas por alguém — e uma moto rara que alguém quer
vale mais do que uma comum que ninguém procura.

---

## Correcção: a BMW publica pressões — nos manuais antigos (8 ago 2026)

Está escrito mais acima, em maiúsculas, que **«nenhuma BMW pode chegar a `oem_manual`
por via do manual»** quanto a pressões. Isso foi concluído a partir de UM manual, o da
R 1250 GS Adventure, e generalizado a nove motos. Estava errado.

Os manuais da **G 450 X** e da **G 650 Xchallenge** publicam as pressões em texto, na
tabela de dados técnicos:

- **G 450 X** — 1,2 bar nas duas rodas, piloto sozinho, pneu frio. 1,0 bar para «sport
  riding». Não há valor com carga: a moto não leva passageiro.
- **G 650 Xchallenge** — frente 1,8 solo e 1,9 com passageiro ou carga; trás 2,0 e 2,2.

A leitura correcta não é «a BMW publica» nem «a BMW não publica», é: **os manuais
modernos remetem para o autocolante debaixo do assento; os de 2007-2009 traziam os
valores impressos.** Vale a pena reabrir os manuais das BMW mais antigas do catálogo
antes de as dar como impossíveis.

**A lição de método, que é a parte que interessa:** um manual não é uma marca. A
conclusão anterior tinha uma amostra de um e foi aplicada a nove.

### As duas motos, ambas do manual

Suspensão e pressões, tudo `oem_manual`. À frente as duas têm compressão e extensão em
cliques a contar do duro, e o manual não indica precarga.

**G 450 X** — Öhlins atrás. Precarga não se conta: regula-se pelo sag (35-40 mm estático,
105-110 mm com piloto de 85 kg), e o manual diz que para desvios grandes de peso se
**muda a mola**, não se aperta mais. Por isso o perfil não tem tabela por carga.

**G 650 Xchallenge** — não tem mola atrás. É o Air Damping System, uma câmara de ar
regulada com bomba, e o manual dá **três valores com pesos reais**: 6 bar para piloto de
65 kg, 6,7 bar para 85 kg, 10,5 bar para dois ocupantes a 150 kg. O amortecimento
traseiro tem duas posições apenas.

### Falta uma unidade `bar` no modelo de dados

A tabela do Air Damping System é dos melhores dados de carga que a app tem — pesos reais
e valores reais — e **não cabe no modelo**. Os `SuspVal` são cliques, voltas, milímetros,
posição ou N/A. Não há `bar`.

Ficou em `pos`, com a tabela escrita no rótulo. Funciona, mas não interpola: quem pesar
75 kg não recebe nada entre os 6 e os 6,7 bar.

Acrescentar um tipo `bar` toca nas fórmulas, no arredondamento e no ecrã. Por uma moto
não compensa; se aparecer outra com suspensão pneumática, compensa.

## 11 de agosto de 2026 — as pressões que faltavam: começou pela KTM 690 Enduro R

Regra nova, do dono da app: **toda a moto tem de mostrar pressões**. Primeiro o manual;
se não houver, fóruns e sítios de referência, com a app a assinalar que não são oficiais.

Cinco motos estavam sem qualquer linha: `ktm-690-enduro-r`, `kove-450-rally-factory`,
`kove-800x-e5`, `bmw-r1200gs-lc`, `bmw-f800-gs-adv`.

### 690 Enduro R — saiu oficial, e com os três estados

Manual do proprietário de 2021, secção **13.7 «Checking tire pressure»**:

| | Frente | Trás |
|---|---|---|
| Fora de estrada, solo | 1,5 bar | 1,5 bar |
| Estrada, solo | 1,8 bar | 1,8 bar |
| Com passageiro / carga máxima | 2,2 bar | 2,2 bar |

`oem_manual`, escrita no bundle e no Supabase. É das poucas fichas da app com valor de
fora de estrada vindo do fabricante.

**As medidas dos pneus ficaram vazias de propósito.** Aparecem no capítulo 21 do manual,
que não foi lido. 90/90-21 e 140/80-18 é o que toda a gente diz da 690 Enduro R, mas
«toda a gente diz» não é fonte. Preenche-se quando se abrir a página 120.

### O que voltou a falhar, e o atalho que resolveu

O PDF oficial (`19_3213909_en_OM.pdf`, art. 3213909en) foi buscado e **cortou outra vez
aos ~102 000 caracteres**, antes do capítulo 13. É o mesmo limite já documentado acima.

O que resolveu foi a **ManualsLib com a página exacta no URL** —
`.../Ktm-690-Enduro-R-2021.html?page=83` — que devolve o texto daquela página e mais nada.
Não é um blogue: é o manual da KTM alojado por terceiros, o mesmo caminho já usado para a
F 800 GS Adventure.

**Isto muda o método para os manuais grandes.** Em vez de puxar o PDF inteiro e torcer
para o corte cair depois da secção, procura-se `<marca> <modelo> checking tire pressure
manualslib`, tira-se o número da página do título do resultado e busca-se só essa página.
Uma ida à rede, sem PDF em disco, sem pedir o ficheiro ao dono da app.

### Continuam por resolver

**`bmw-r1200gs-lc` e `bmw-f800-gs-adv`** — a BMW moderna não publica pressões no manual,
já confirmado. Ficam pela **chapa debaixo do banco**, que é oficial e está na moto. Uma
fotografia resolve as duas.

**`kove-450-rally-factory` e `kove-800x-e5`** — manuais Kove por encontrar, e a Kove tem
pouca presença documental em inglês. Provável que acabem em fonte de terceiros com a nota
de não oficiais.

### A tabela da A&S Powersports, e como se validou uma fonte de terceiros

Chegou por fotografia uma tabela de pressões BMW de um concessionário americano, a **A&S
Powersports**. Fonte de terceiros — mas passou um teste que vale a pena registar, porque é
o método a repetir com qualquer tabela destas.

**Validou-se contra os manuais que a app já tem.** A tabela inclui a G450X e a
G650X-Challenge, cujos valores oficiais foram lidos dos manuais no dia anterior:

| | Tabela (psi) | Manual (bar → psi) |
|---|---|---|
| G450X solo | 17 / 17 | 1,2 / 1,2 → 17,4 / 17,4 |
| G650X solo | 26 / 29 | 1,8 / 2,0 → 26,1 / 29,0 |
| G650X a dois | 28 / 32 | 1,9 / 2,2 → 27,6 / 31,9 |

Seis valores, seis acertos ao psi. Não é um sítio a copiar de outro: é conversão fiel dos
manuais. **Uma tabela de terceiros que contenha motos já confirmadas pode ser auditada
assim** — e é melhor evidência do que a regra dos dois sítios independentes, que só prova
que duas pessoas leram a mesma coisa.

**Aviso sobre ler fotografias tortas.** A primeira imagem chegou desfocada e leram-se mal
dois valores: 28/30 em vez de 28/32 na G650X, e 32/36 e 32/42 em vez de 32/35 e 35/40 na
F800GS. Com os valores errados a tabela parecia ter uma discrepância de 2 psi que não
existia. **Pedir sempre a versão legível antes de concluir seja o que for.**

### F 800 GS Adventure — resolvida por analogia, e a analogia está na própria tabela

A tabela não tem a Adventure, só a **F800GS**: 32/35 psi a solo, 35/40 a dois — ou seja
**2,2 / 2,4 bar** a solo e **2,4 / 2,8** a dois.

A objeção óbvia é que a Adventure pesa mais 20 kg e leva depósito de 24 litros, logo podia
levar mais atrás. **A tabela responde sozinha:** a R1200GS e a R1200GS Adventure têm
valores idênticos, e a R1150GS e a R1150GS Adventure também. Em dois pares de modelos
independentes a BMW não distingue a versão Adventure. Somando que a F800GS e a GSA
partilham rodas e pneus, a transferência é defensável.

Ficou `estimated_spec`, com o raciocínio inteiro escrito no `source`. Não é oficial e a app
di-lo.

### R 1200 GS LC continua sem dados, e a tabela não serve

A tabela tem R1200GS, mas na secção **Hex-Head**, que acaba em 2012. A app tem a **LC**, de
2013 em diante — outra geração, outro motor, outra suspensão. Passar valores de uma para a
outra seria repetir o erro da regra das pressões BMW.

Fica à espera de fonte da geração certa ou de fotografia da chapa da moto.

### As duas Kove: uma saiu por manual, a outra teve de ser interpretada

**Kove 800X — `oem_manual`, e sem drama.** Manual do proprietário **KY800X**, secção
«Checking tire pressure»: **2,3 bar (33 psi) à frente, 2,5 bar (36 psi) atrás**, a solo.
Pneus 90/90-21 e 150/70-R18. O manual não dá valores com passageiro nem para fora de
estrada, portanto esses campos ficam vazios. Nota útil: **as jantes são para pneu sem
câmara e o manual proíbe montar câmara.**

**Kove 450 Rally — o manual dá números, mas não para a nossa versão.** Manual de manutenção
(276 páginas), pág. 61:

| Edição **Regular** | Frente | Trás |
|---|---|---|
| Pneu sem câmara | 200 kPa = 2,0 bar | 200 kPa = 2,0 bar |
| Pneu com câmara | 100 kPa = 1,0 bar | 100 kPa = 1,0 bar |

Duas armadilhas nisto:

1. **A app tem a edição Factory, e o manual só publica a Regular.** Não é distração a ler —
   o manual separa as duas edições noutros sítios, tem calendários de manutenção distintos
   nas páginas 34 e 35. Na secção dos pneus escreve «Regular edition» duas vezes e não diz
   nada da Factory.
2. **A diferença de 2,0 para 1,0 bar é o dobro, e não é estrada contra terra — é o tipo de
   pneu.** Sem câmara leva 2,0, com câmara leva 1,0.

**Decisão, tomada com o dono da app:** os 2,0 ficam como estrada e os 1,0 como fora de
estrada, em `estimated_spec`, com o raciocínio inteiro no `source`. É a leitura que dá ao
piloto os dois números certos em campos que ele percebe — mas **a separação por piso é
nossa, não do manual**, e isso tem de continuar escrito.

### O manual do proprietário e o manual de manutenção não trazem a mesma coisa

Na Kove 450 Rally o **manual do proprietário** (92 páginas) descreve como verificar a
pressão e **não dá um único número**. Quem dá é o **manual de manutenção** (276 páginas),
na pág. 61. Foram lidos os dois.

**Quando o manual do proprietário falha, procurar o de manutenção antes de desistir.** É o
oposto do hábito, que é ir sempre ao do proprietário e parar aí.

### Custo de uma página errada

Para chegar à pág. 61 gastou-se antes uma leitura da pág. 143, escolhida por ter no título
«Maintenance Information» — que era do sistema de arrefecimento. **O índice lateral da
ManualsLib traz o título de cada página; ler o índice antes custa uma linha e poupa uma ida
inteira à rede.**

### A BMW publica os manuais no site dela, e isso derruba uma crença deste projeto

Sem fotografia da chapa, procurou-se de novo — e apareceu **`manuals.bmw-motorrad.com`**,
o servidor de manuais da própria BMW Motorrad. Não é um espelho nem um revendedor: é a
fonte.

O manual da R 1200 GS LC é o **`R_0A11_RM_0213_R1200GS_07.pdf`**. Secção «Checking tire
pressure»:

| | Frio |
|---|---|
| Frente | **2,5 bar** (36,3 psi) |
| Trás | **2,9 bar** (42,1 psi) |

**Um único par, sem distinguir solo de dois ocupantes** — a BMW simplificou para o pior
caso. Encaixa no modelo com `frontLoadedBar` e `rearLoadedBar` a `null`, que já significa
«igual ao solo».

**Confirmou-se que é mesmo a LC e não a Hex-Head.** O manual tem indicador de nível de
refrigerante, depósito de refrigerante e indicação de temperatura do líquido — nada disso
existe na R 1200 GS arrefecida a ar e óleo. A data no nome do ficheiro, 0213, é o mês de
lançamento da LC.

**Fora de estrada: a BMW avisa mas não dá número.** Diz que uma pressão reduzida para fora
de estrada piora o comportamento em asfalto e manda repor a correta. Nunca escreve quanto.
Isto confirma, agora com o manual à frente, o que já se suspeitava.

### Nove BMW ficaram a 2,5 / 2,9 «por confirmar», e agora dá para confirmar

A descoberta do servidor da BMW abre a porta a estas, todas com o mesmo par assumido e a
mesma frase de fonte:

`bmw-1250-gs`, `bmw-f900-gs`, `bmw-f900-xr`, `bmw-m1000rr`, `bmw-r1250-rt`,
`bmw-r1300-gs`, `bmw-r1300-gs-adv`, `bmw-s1000r`, `bmw-s1000rr`.

A LC ter saído exatamente 2,5 / 2,9 é bom sinal para a suposição, mas **não a prova para as
outras nove** — prova só que o palpite acertou uma vez. São nove manuais a abrir no site da
BMW, e o método já está afinado: buscar o PDF e procurar `psi` com contexto, que a secção
aparece sempre com o valor em psi ao lado do bar.

**Correção a uma nota antiga deste ficheiro.** Ficou escrito que a BMW moderna não publica
pressões no manual. **É falso.** Publica, no servidor dela. O que aconteceu foi ter-se
procurado nos sítios errados.

### Estado final das pressões

**Zero motos sem pressões.** A regra do dono da app está cumprida em toda a base.

### As nove BMW não se resolvem pelo manual: a BMW mudou de prática em 2019

Abriram-se três manuais no servidor oficial, escolhidos para cobrir a gama: **R 1250 GS**
(`R_0M01_RM_0321_01`), **R 1300 GS** (`R_0M21_RM_0223_01`) e **S 1000 RR**
(`S_0E21_RM_0520_01`). Nos três, **procura por qualquer número seguido de «bar»: zero
ocorrências.** Não é o corte da leitura — é que o número não está lá.

O que está lá é isto, na vista geral do que há debaixo do banco da R 1250 GS:

```
1 Toolkit      2 Rider's manual      3 Tyre pressures table      4 Payload table
```

**A tabela de pressões é um autocolante debaixo do banco, e o manual limita-se a apontar
para ele.** É exactamente a prática que este ficheiro já tinha descrito — só que estava
descrita como se valesse para toda a BMW moderna.

### A regra correta, agora com a fronteira no sítio certo

- **Até à R 1200 GS LC (manual de 2013):** os valores vêm impressos no manual. Confirmado.
- **De 2019 em diante (R 1250 GS, R 1300 GS, S 1000 RR e a geração toda):** o manual manda
  ler a chapa. Confirmado em três modelos de classes diferentes.

Ficam por abrir cinco — F 900 GS, F 900 XR, M 1000 RR, R 1250 RT, S 1000 R. **Não foram
lidas**, e não se declara aqui que seguem o mesmo padrão; declara-se que são todas de 2019
para cá e usam o mesmo molde de manual, portanto a expectativa é baixa. Se alguém quiser
gastar as leituras, o método está aí.

### O palpite de 2,5 / 2,9 ganhou duas provas, e continua a não estar provado

As nove estão em `estimated_spec` com 2,5 / 2,9 assumido. Entretanto apareceram dois
documentos BMW reais com exactamente esse par:

1. **Manual da R 1200 GS LC** — 2,5 bar à frente, 2,9 atrás.
2. **Chapa fotografada de uma F 800 R** (pneu 120/70 ZR17) — 2,5 / 2,9, e igual nas três
   linhas de carga.

Duas classes de moto muito diferentes, o mesmo par. **É a figura de casa da BMW.** Isso
torna o palpite bastante mais sólido do que era — mas não prova nenhuma das nove em
concreto, e por isso **ficam como estão, em `estimated_spec` e com «por confirmar»**. Só a
chapa de cada moto fecha cada uma.

## 15 de agosto de 2026 — o paywall estava a anunciar um produto que não existe

Dois sintomas que pareciam separados e eram o mesmo estrago, os dois introduzidos a 8 de
agosto por mim.

**iOS: o paywall mostrava US$ 12,99**, com o produto na App Store a 14,99 €. Apareceu no
vídeo gravado para a revisão da Apple — ou seja, ia seguir para lá um preço que não existe
no App Store Connect.

Não havia preço fixo no código; procurou-se. O valor vinha do `priceString` de **um pacote
da Test Store**. O produto da App Store ainda não é resolúvel porque a app nunca foi
aprovada, o SDK deitou-o fora, e o `?? pacotes[0]` que eu tinha escrito como rede de
segurança serviu o primeiro que sobrou. A rede fazia o contrário do que o comentário dela
prometia: em vez de proteger, anunciava e teria cobrado o produto errado.

Removida. Sem produto certo, não há preço e a compra devolve `unavailable`. **Mais vale não
vender nada do que vender outra coisa.** Foi seguro removê-la porque o identificador é mesmo
igual nas duas lojas — confirmado na coluna `Sku Id` das quatro vendas reais de julho na
Google Play, e não por leitura de documentação.

**Android: o preço desapareceu de vez.** Causa diferente, mesma data. A 8 de agosto passou a
exigir-se o prefixo `goog_` na chave. As chaves estão corretas no `eas.json` e vão nas
builds do EAS — mas **o `eas update` corrido a partir do portátil não lê o `eas.json`, lê os
ficheiros `.env` locais**. E o `.env.local` só tinha a chave de iOS, acrescentada nesse
mesmo dia. Todos os OTA desde então foram para os telemóveis com a chave de Android vazia,
por cima de uma build da Play Store que estava boa.

Confirmação: `eas update:list` mostra o último update a 8 de agosto, e o `.env.local` tinha
uma única chave.

Chave de Android acrescentada ao `.env.local`, e a armadilha escrita no `.env.example`, que
esse está no git e é onde alguém vai olhar.

### Consequência incómoda para o vídeo da Apple

Com a rede removida, é provável que o paywall no TestFlight passe a **não mostrar preço
nenhum** até a app ser aprovada, porque é a aprovação que torna o produto resolúvel.
Troca-se um preço errado por preço nenhum.

É o certo para quem usa a app, e é discutível para a revisão, que quer ver título e preço.
Mas anunciar 12,99 dólares com 14,99 euros no App Store Connect é uma discrepância que eles
podem apanhar — e essa conversa acaba pior do que «o preço ainda não carrega em sandbox».
Se não aparecer preço na regravação, isso explica-se por escrito na resposta.

### O painel da RevenueCat confirmou tudo, e mostrou o que falta limpar

Projeto `1e67f8b5`, com **três apps** no catálogo:

| App | Produto | Estado | Criado |
|---|---|---|---|
| **RideTune** (Play) | `ridetune_premium_lifetime` | **Published** | 5/7/2026 |
| **RiideTune** (App Store) | `ridetune_premium_lifetime` | **In Review** | 8/8/2026 |
| **Test Store** | `lifetime`, `yearly`, `monthly` | — | 26/6/2026 |

**O produto da App Store está «In Review».** É por isso que não é resolúvel e o SDK o deita
fora — exactamente como o comentário no `purchases.ts` supunha, agora verificado.

**A offering `default` tem três pacotes**, e é aqui que estava o estrago:

- `$rc_monthly` → produto `monthly` (Test Store)
- `$rc_annual` → produto `yearly` (Test Store)
- `$rc_lifetime` → produto `lifetime` (Test Store) **e** `ridetune_premium_lifetime`

O pacote vitalício tem **os dois** produtos. No iPhone, sem o da App Store resolúvel, sobrou
o `lifetime` da Test Store — que tem identificador `lifetime`, não bate com o `PRODUCT_ID`,
e era servido pela rede `?? [0]`. Daí os **US$ 12,99**.

**Nota preocupante:** o `lifetime` da Test Store tem **2 entitlements** ligados. Ou seja, um
produto de teste dá acesso premium.

### Limpeza a fazer no painel, quando houver mão

1. Apagar os pacotes **Monthly** e **Yearly** da offering `default` — só têm produtos de teste.
2. No pacote **Lifetime**, retirar o produto `lifetime` da Test Store, deixando só o
   `ridetune_premium_lifetime`.
3. Desligar o `lifetime` do entitlement `premium`.

Não foi feito aqui de propósito: mexer numa offering ao vivo, com quatro clientes pagantes
e a app da Play a vender, é alteração que se faz com o dono à frente e não de repente.

### Vendas reais confirmadas

Quatro compras, todas Play Store, todas `ridetune_premium_lifetime`, sem expiração, entre
$13,74 e $17,52. **Zero na App Store**, coerente com o iOS nunca ter estado vivo. Todos os
`App User ID` são anónimos, porque a app não tem contas — a recuperação depende da conta da
loja, que é o que o `restorePurchases()` usa.

### Pormenor de higiene

A app da App Store está registada na RevenueCat como **«RiideTune»**, com dois ii. É nome
interno, não chega ao utilizador, mas convém corrigir antes que alguém o copie para sítio
visível.
