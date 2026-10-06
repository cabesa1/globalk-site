# Preparação de SEO e GEO

Esta branch prepara a publicação sem alterar o site em produção. O build gera 21 páginas em português, inglês e espanhol, com canonical próprio, hreflang recíproco no HTML e no sitemap, metadados sociais por idioma e dados estruturados que correspondem ao conteúdo visível. A página 404 não é indexável. Prévias da Vercel recebem `noindex` e `robots.txt` com `Disallow: /`.

## Domínio e migração

`globalk.com.br` ainda serve o site anterior. Antes de usá-lo como domínio canônico, conectar o novo projeto ao domínio e decidir o destino das URLs antigas. Se esse for o domínio final, definir `PUBLIC_SITE_URL=https://globalk.com.br` no ambiente de produção da Vercel somente junto da virada. Essa variável deve ser apenas uma origem HTTPS, sem caminho adicional. Em seguida, executar `npm run check` e conferir canonical, Open Graph, JSON-LD, sitemap e robots no domínio público.

Se o domínio antigo continuar servindo conteúdo em paralelo, haverá duas versões públicas da marca. Fazer o redirecionamento das URLs antigas relevantes para as novas equivalentes quando a migração for aprovada. Não anunciar o domínio novo no sitemap antes de ele servir as páginas novas.

## Verificação após publicação

1. Confirmar `200` para as 21 URLs do sitemap e `404` para uma URL inexistente.
2. Confirmar `https://<domínio>/robots.txt`, `sitemap.xml` e as alternativas PT/EN/ES em cada página.
3. Validar os dados estruturados e inspecionar as páginas principais no Google Search Console. Enviar o sitemap após a troca do domínio.
4. Conferir títulos, descrições e imagens ao compartilhar as três versões.
5. Acompanhar indexação, consultas e erros de cobertura; isso não pode ser garantido apenas por um build bem-sucedido.

## GEO

O arquivo `llms.txt` é um índice factual e opcional das páginas. Não substitui o conteúdo HTML. Não há marcação especial necessária para aparecer nas experiências de IA do Google; o foco aqui é manter páginas acessíveis, conteúdo claro e dados consistentes. Informações de contato, CNPJ e endereço vêm do próprio site da GlobalK e devem ser reconfirmadas pelo responsável antes da migração final.
