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

  **A CB1000R não está na região europeia (HMEE).** Só aparece em HPI (Filipinas),
  código `MKJ221`, e essa região não tem versão HTML nem PDF direto — só o download com
  aceitação de termos. Fica a precisar do ficheiro. O mesmo vale provavelmente para a
  Fireblade, que também não apareceu em HMEE.

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

**Estado por marca** (verificadas / total): KTM 13/14 · **Yamaha 12/12** · Honda 6/12 ·
Suzuki 4/7 · Triumph 2/7 · Macbor 1/1 · Aprilia 0/5 · BMW 0/9 · Ducati 0/11 ·
Voge 0/8 · QJ 0/9 · CFMoto 0/8 · Kawasaki 0/6 · Kove 0/4.

**Cuidado com os códigos de manual da Yamaha:** procurar "YZF-R7 owner's manual"
devolve `5FL-28199`, que é da R7 de **1998** (a OW-02, moto completamente diferente).
A de 2022, baseada na MT-07, é `BEB-28199-20`. Confirmar sempre o modelo na primeira
página do PDF antes de usar os valores.

**Como retomar.** Para cada moto: encontrar o manual do proprietario, ler a
tabela de pressoes, corrigir os valores se preciso, e so entao repor
`oem_manual` **com a citacao concreta** (documento, edicao, pagina). Comecar
pelas mais usadas. Nunca subir o rotulo com base num resumo de pesquisa — foi
assim que se chegou aqui.
