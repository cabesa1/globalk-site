# Auditoria local GlobalK — 28/10/2026

Atualização de estrutura em 29/10/2026: a linha do tempo completa passou para a home, substituindo a seção de cartões das unidades e o resumo da história. A árvore de unidades continua levando às páginas individuais. O site agora tem 18 páginas; as três antigas rotas de história redirecionam para a seção na home. Os resultados abaixo de 21 rotas registram a auditoria anterior.

Escopo: sete páginas em PT, EN e ES, total de 21 rotas. Alterações apenas neste repositório e no servidor local. Nenhum commit, push, deploy ou mensagem enviada.

## Corrigido e verificado

- Home: síntese das atividades na primeira dobra, navegação por cinco necessidades, públicos e ação explícita na faixa vermelha.
- GlobalK: serviços e consulta mais claros; fotografia de contêiner identificada como ilustrativa; vínculo com a história.
- Economize: caminhos separados para compra na loja oficial e parceria comercial no contato GlobalK; condições e políticas remetidas à própria Economize.
- Multi-K: foto de organizador em uso no hero e CTA honesto para perguntar sobre os produtos por e-mail.
- Safe-K: imagem física no hero, explicação guardar/bloquear/liberar e acesso ao site oficial.
- Trade-K: importação e consulta comercial expressas diretamente, com ressalva de avaliação individual.
- História: sete marcos preservados, vínculos para unidades atuais e linha do tempo com progresso na rolagem em PT/EN/ES. O conteúdo permanece legível sem animação.
- Contato: avisa sobre abertura do aplicativo de e-mail, não sugere envio automático e orienta o próximo passo.
- SEO: 21 respostas HTTP 200, um H1 e canonical por página; robots, sitemap e 404 acessíveis localmente. Metadados e dados estruturados cobertos pelos testes do projeto.
- Mobile: capturas completas em 390 e 1400 px; inspeção automática em 360, 390, 768 e 1400 px para as 21 rotas; sem overflow horizontal ou imagens visíveis quebradas. Âncora de contato aparece abaixo do cabeçalho.
- Desempenho: fonte principal pré-carregada; CLS observado no laboratório local foi 0 após a correção. LCP local foi medido, mas os valores em cache quente não representam usuários reais.

## Implementado, mas ainda não verificado em produção

- Todas as mudanças deste ramo são locais. Após um deploy autorizado, verificar HTML servido, 404, sitemap, robots, canonical, hreflang, redes sociais e navegação em dispositivos reais.
- Animações normais e experiência em redes lentas não foram avaliadas integralmente nesta rodada. A auditoria visual automatizada usou `prefers-reduced-motion: reduce`.

## Dependente de conteúdo ou infraestrutura

- GlobalK/Trade-K: fotos comprovadas da operação, exemplos autorizados, responsabilidades, entregáveis e informações necessárias à consulta.
- Economize: links oficiais diretos para políticas de condição, garantia e devolução, se desejados; hoje a loja oficial é o destino seguro.
- Multi-K: catálogo atual, linhas de produtos confirmadas, canal ou instrução de compra.
- Safe-K: fotos ou vídeo reais da sequência de travamento e liberação, e detalhes confirmados de implantação e responsabilidades.
- Contato: não há backend de recebimento no projeto. Um formulário real requer serviço de envio, configuração segura de credenciais e fluxo de confirmação/erro; o site usa os contatos existentes.
- Métricas de campo e INP: exigem tráfego real ou ferramenta de monitoramento apropriada. Os números locais não substituem Core Web Vitals de usuários.

## Não aplicável

- Formulário de envio simulado, depoimentos, clientes, números, preços, avaliações e garantias sem comprovação não foram adicionados.
- Datas `lastmod` não foram inventadas para o sitemap; política de indexação de staging e domínio canônico permanecem como estavam.
