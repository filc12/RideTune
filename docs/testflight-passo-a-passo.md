# Instalar a RideTune no iPhone de um amigo e gravar o vídeo para a Apple

Objetivo: obter a gravação de ecrã **num dispositivo físico** que a Apple pediu no ponto 1
do pedido de informação (Guideline 2.1).

Tempo real: cerca de 20 minutos, dos quais 5 são à espera de emails.

---

## Antes de começar

**Pergunta-lhe qual é o Apple ID dele.** É o endereço com que ele entra na App Store, e
pode não ser o email que ele usa no dia a dia. Se puseres o endereço errado, o convite
chega a um sítio onde ele não o pode aceitar, e não é óbvio porquê.

**Confirma que o iPhone dele está atualizado.** Definições → Geral → Atualização de
software. A Apple pediu explicitamente *«running the latest operating system»*, e um iOS
antigo dá-lhes motivo para devolver o pedido outra vez.

---

## Parte 1 — Tu convidas (2 minutos)

1. Abre `appstoreconnect.apple.com/access/users`.
   Também lá chegas pelo ícone da tua conta, no canto superior direito → **Utilizadores e
   Acesso**. Não é dentro do TestFlight.

2. Clica no **+** azul, ao lado de *Utilizadores*.

3. Preenche nome, apelido e o **email do Apple ID dele**.

4. Escolhe o papel. **Marketing** é o mais limitado dos papéis que dão acesso ao TestFlight.
   Se por algum motivo a app não lhe aparecer no fim, muda para **Developer** — mas começa
   pelo Marketing.

5. Onde diz que apps ele pode ver, escolhe **só a RideTune**, não todas.

6. Envia o convite.

---

## Parte 2 — Ele aceita (2 minutos, mais o tempo até ver o email)

7. Ele recebe um email da Apple a convidá-lo para a tua equipa. Clica em **Accept** ou
   **Aceitar convite**.

8. Entra com o Apple ID dele. Pode ter de aceitar uns termos e ativar a autenticação de dois
   fatores, se ainda não a tiver.

**Não avances sem ele te confirmar que aceitou.** Se o adicionares ao grupo antes disso, não
acontece nada e ficas a pensar que está avariado.

---

## Parte 3 — Tu dás-lhe a app (1 minuto)

9. Na página da RideTune, separador **TestFlight**, em cima, ao lado de *Distribuição* e
   *Análise*.

10. Na barra da esquerda, grupo **Interno**.

11. Separador **Testadores** → **+** → escolhe-o na lista. Ele já lá está, porque aceitou o
    convite.

12. Confirma que a **build 1** está atribuída ao grupo. Se não estiver, adiciona-a.

Como é grupo interno, não há revisão nenhuma pelo meio — fica disponível de imediato.

---

## Parte 4 — Ele instala (3 minutos)

13. No iPhone dele, App Store → procurar **TestFlight** → instalar. É uma app da Apple,
    gratuita. A RideTune **não** aparece na App Store normal.

14. Abrir a TestFlight e entrar com o Apple ID dele — o mesmo do convite.

15. A **RideTune** aparece na lista. **Instalar**.

Ele também recebe um email do TestFlight com um botão para abrir direto. Tanto faz o
caminho.

---

## Parte 5 — A gravação

Podes ser tu a gravar com o telemóvel na mão, ou ele. Se for ele, manda-lhe o guião.

**Preparar:**

16. Se o ícone de gravação não estiver no Centro de Controlo: Definições → **Centro de
    Controlo** → adicionar **Gravação de Ecrã**.

17. **Fecha a RideTune por completo** — deslizar para cima e arrastar o cartão da app para
    fora. A Apple pede que a gravação *comece no arranque da app*.

18. Abrir o Centro de Controlo, tocar no botão de gravação, esperar a contagem de 3, e
    fechar o Centro de Controlo.

**Guião, três a quatro minutos, sem pressa:**

19. Ecrã inicial do iOS. Tocar no ícone da RideTune. Deixar correr o onboarding até ao fim.

20. **Escolher mota** → percorrer a lista devagar → escolher uma conhecida, por exemplo a
    BMW R 1250 GS.

21. Introduzir o peso do piloto com equipamento. **Parar dois segundos com os valores de
    suspensão à vista.** É isto que a Apple não percebeu que a app faz — é a razão de ser
    do produto.

22. Abrir **Tyre Pressure**. Mostrar os valores.

23. Abrir o **guia de sag** e percorrer os passos.

24. **O passo mais importante.** Tocar num modo de carga bloqueado — *Passageiro* ou
    *Bagagem*. Deixar aparecer a folha de compra e mostrá-la **inteira**: título, preço,
    botão de restaurar. **Não é preciso comprar.** Fechar a folha.

25. **Definições** → mostrar a secção da comunidade e a partilha de um setup.

26. Parar a gravação, tocando na barra vermelha em cima.

Não são precisos ecrãs de registo, de login, de eliminação de conta nem pedidos de
permissão. Não existem na app, e a resposta escrita já o explica.

---

## Parte 6 — Enviar

27. Ele passa-te o vídeo. AirDrop se tiveres Mac por perto; senão WeTransfer, Drive ou
    WhatsApp em qualidade original.

28. Vê o vídeo do princípio ao fim antes de o enviares. Confirma que se vê o arranque da
    app e que a folha de compra aparece legível.

29. App Store Connect → **Revisão de apps** → responder à mensagem, anexar o vídeo e colar
    o texto do `apple-2.1-resposta.md`.

30. Cola o mesmo texto em **Revisão de apps → Notas**, para não voltares a passar por isto
    nas versões seguintes.

---

## Depois de estar feito

31. Ele pode apagar a RideTune e a TestFlight.

32. Em **Utilizadores e Acesso**, remove-lhe o acesso. Não fica preso a nada.

---

## O que não fazer

**Não removas a versão de revisão.** O aviso azul na página da versão diz que para enviar
nova compilação é preciso removê-la — mas tu não precisas de compilação nova, precisas de
responder. Remover fazia-te voltar ao fim da fila.

**Não uses gravação de simulador.** A Apple pediu dispositivo físico, e uma gravação de
simulador reconhece-se. Custava-te outra ronda do mesmo pedido.
