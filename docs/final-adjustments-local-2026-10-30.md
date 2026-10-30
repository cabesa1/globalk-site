# Ajustes finais GlobalK — revisão local de 30/10/2026

Projeto: `C:\Users\gui\Documents\Codex\2026-09-17\globalk`.
Revisão: <http://localhost:5173/>. Sem commit, push, deploy ou envio de contatos reais.

## Corrigido e verificado

- Idioma selecionado: branco sobre vermelho `#cc0d0d`, contraste calculado com as cores renderizadas de **5,78:1** no estado normal. Hover e foco usam `#a80c0c`, **7,71:1**. O foco mantém contorno visível.
- Nomes acessíveis dos idiomas contêm PT, EN e ES. Links sociais contêm Instagram e o perfil visível, seguidos pelo aviso de nova aba. O nome do botão do menu também contém seu rótulo visível.
- Menu: abertura com Enter, ciclo de Tab/Shift+Tab, Escape, atualização de `aria-expanded` e retorno do foco ao botão foram testados em PT/EN/ES, em 390 e 1400 px.
- Safe-K e Trade-K: CTA específico repetido depois dos serviços e antes de “Continue explorando o grupo”. Destinos oficiais existentes, nova aba, `noopener noreferrer` e avisos acessíveis preservados. Cliques reais dos links foram abertos no Chrome de teste, sem envio de informações.
- Multi-K: CTA de produtos preservado. O texto explica a abertura do aplicativo de e-mail e a seleção prévia da Multi-K. Seleção e assunto confirmados no navegador nos três idiomas; nenhum e-mail enviado. O aviso de ausência de catálogo público continua explícito.
- Home: contato após a árvore e antes da trajetória, usando `#contato`. A árvore e o primeiro acesso às unidades foram preservados. Âncoras chegam abaixo do cabeçalho.
- Economize: guia oficial de condições junto à explicação da condição de cada item, sem duplicar políticas ou prometer prazos e garantias. Link confirmado: <https://economize.vc/condition-guide>. CTA da loja continua em <https://economize.vc/>. Ambos abertos e conferidos no navegador de teste.
- Economize no celular: iframe de 230 para 180 px; foto em proporção horizontal com máximo de 280 px. Endereço e acesso ao Google Maps continuam disponíveis. Desktop preservado.
- Safe-K: usadas as três fotografias do NOVO projeto `SAFEK/como-funciona.html`: safek-guardar-tratada.webp, safek-viva-momento-tratada.webp e safek-desbloquear-tratada.webp. As ilustrações do site antigo foram substituídas após correção do usuário. WebP de 360 e 720 px, carregamento lazy, dimensões e legendas traduzidas. A foto do meio mostra a pessoa permanecendo com a bolsa, sem afirmar que retrata o ato de acionar a trava. Foto atual do produto no topo preservada.
- GlobalK, Nanium e Realize: conteúdo principal das nove páginas comparado ao HTML anterior, sem diferenças de conteúdo. Só nomes acessíveis compartilhados e whitespace técnico mudaram. Nenhum asset dessas marcas foi trocado.
- Canonical, hreflang, sitemap, robots, redirecionamentos e 404 preservados pelos checks. Foi corrigida uma expectativa de teste antiga da 404: o atalho correto é `/#contato`, pois a 404 não tem bloco de contato.

## Evidências

- `npm.cmd run check`: build das 24 páginas e **12/12 testes** aprovados.
- `node scripts/audit-browser.mjs`: **24 rotas × 4 larguras = 96 layouts**, em PT/EN/ES, 360/390/768/1400 px. Sem overflow horizontal ou imagens quebradas na área visível. CLS observado = 0. Capturas em 390 e 1400 px.
- `node scripts/audit-browser.mjs --motion-only`: árvore, linha do tempo, entradas de texto e imagens acompanham a rolagem e param com ela. Testes em 390/1400 px e nas três homes traduzidas. Caminho com movimento reduzido também validado pela auditoria normal.
- `node scripts/audit-final-adjustments.mjs`: 48 layouts adicionais, seis percursos de teclado, 18 estados de contraste, quatro destinos externos e leitura dos nomes na árvore de acessibilidade do Chrome. Multi-K e contato da home chegam abaixo do cabeçalho. As fotos finais foram verificadas depois pela auditoria específica Safe-K.
- `node scripts/audit-final-adjustments.mjs --destinations-only`: quatro destinos abertos por clique no CTA: Safe-K, Trade-K, guia de condições e loja Economize. Títulos e conteúdo carregado confirmados. Nenhum formulário enviado.
- Inspeção visual das capturas de Safe-K mobile, Economize mobile e Trade-K desktop. Após compactar o bloco do guia, auditoria específica da Economize repetida.

Saídas de evidência nesta máquina:

- Antes: `%TEMP%\globalk-audit-1793387251930`.
- Auditoria geral após alterações: `%TEMP%\globalk-audit-1793387419961`.
- Animações: `%TEMP%\globalk-audit-1793387515463`.
- Teclado, contraste e destinos: `%TEMP%\globalk-audit-1793387586002\final-adjustments.json`.
- Quatro destinos externos: `%TEMP%\globalk-audit-1793387663782\final-adjustments.json`.
- Economize final: `%TEMP%\globalk-audit-1793387671199`.
- Safe-K corrigida com três fotos do novo site, PT/EN/ES em quatro larguras: `%TEMP%\globalk-audit-1793388087352`.
- Verificação final de teclado, contraste e quatro destinos: `%TEMP%\globalk-audit-1793387840760\final-adjustments.json`.

São medições locais de laboratório, sem representar experiência de usuários reais. Não houve medição de INP de campo nem nova auditoria PageSpeed. Na amostra comum de 60 layouts antes/depois, CLS permaneceu 0, sem novas imagens quebradas ou overflow. Nenhuma dependência ou regra de cache foi acrescentada.

## Implementado, mas não verificado

- Publicação em produção: não executada por instrução do usuário. Os ajustes estão apenas no local.
- Não foi feita validação manual com leitores de tela ou aparelhos físicos; a verificação usou Chrome, árvore de acessibilidade e emulação de viewport.

## Dependente de material

O usuário informou que não há vídeo e esclareceu que queria as três fotos do NOVO site Safe-K. As três fotos foram reutilizadas do projeto novo. Não há pendência para essa seleção de imagens. A foto do meio mostra o aparelho guardado e a bolsa com a pessoa, sem demonstrar diretamente o acionamento da trava; uma eventual filmagem dessa ação dependerá de material adicional.

Nenhuma política de troca, devolução ou garantia foi inventada ou copiada para a GlobalK. Só o guia oficial de condições foi acrescentado, depois de confirmar seu conteúdo e destino.

## Arquivos alterados

- `src/components.mjs`: nomes acessíveis compartilhados.
- `src/unit-guidance.mjs`: continuidade dos CTAs, orientação de compra, contato junto à árvore e legendas traduzidas das fotografias.
- `scripts/build.mjs`: inserção dos blocos e explicação do contato Multi-K.
- `public/styles.css`: contraste, acabamento dos novos blocos e mídia compacta na Economize mobile.
- `public/assets/sources.json`: origem e processamento das três fotos do novo site Safe-K.
- `public/assets/safek-{guardar,bloquear,liberar}-{360,720}.webp`: imagens otimizadas.
- `scripts/audit-final-adjustments.mjs`: verificação reproduzível de teclado, contraste, CTAs e destinos externos.
- `tests/site.test.mjs`: expectativas dos CTAs, nomes acessíveis e recuperação da 404.
- Este relatório.
