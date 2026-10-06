# GlobalK

Site institucional mobile first, em português, inglês e espanhol, com 21 páginas estáticas. O seletor PT | EN | ES no cabeçalho mantém o visitante na página equivalente. Direção editorial em preto e vermelho, tipografia Satoshi e materiais de marca provenientes do site original.

## Executar localmente

Requer Node.js 22 ou superior.

```sh
npm install
npm run build
npm run dev
```

Abra **http://localhost:5173**. No PowerShell, use `npm.cmd` se a política de execução bloquear `npm.ps1`.

O servidor lê `dist`. Após alterar conteúdo, CSS ou JavaScript, rode `npm run build` e atualize o navegador. Para usar outra porta, defina a variável `PORT` antes de iniciar o servidor.

## Páginas

| URL | Conteúdo |
| --- | --- |
| `/` | Grupo, unidades de negócio, resumo da trajetória e contato |
| `/globalk/` | Entrada e operação no mercado brasileiro |
| `/economize/` | Open Box e operação comercial |
| `/multik/` | Organização e utilidades |
| `/safek/` | Ambientes livres de celulares |
| `/tradek/` | Importação e financiamento |
| `/our-history/` | Trajetória do grupo |

As sete versões em inglês usam o prefixo `/en/`; as sete em espanhol usam `/es/` (por exemplo, `/es/tradek/` e `/es/our-history/`).

## Estrutura

- `src/content.mjs`: textos e informações das unidades e da história.
- `src/english.mjs`: traduções das unidades e da história.
- `src/spanish.mjs`: traduções em espanhol das unidades e da história.
- `src/seo.mjs`: domínio canônico, hreflang, sitemap, robots e dados estruturados.
- `src/components.mjs`: cabeçalho, menu, contatos, rodapé, imagens e estrutura das páginas.
- `scripts/build.mjs`: geração do HTML, sitemap, robots, página 404 e imagem de compartilhamento.
- `public/styles.css`: estilos, começando pelo layout de celular e expandindo em 600, 960 e 1400 px.
- `public/app.js`: menu acessível, animações progressivas e assunto do contato.
- `public/assets/`: imagens WebP otimizadas e fontes locais.
- `public/assets/brand-*.png`: logos oficiais da Multi-K, Safe-K e Trade-K fornecidos para esta revisão; os arquivos originais foram preservados.
- `public/assets/sources.json`: procedência dos materiais visuais do site original.
- `scripts/prepare-assets.mjs`: atualização opcional dos materiais a partir das fontes públicas. Não é necessário para o build normal.
- `scripts/serve.mjs`: servidor local de arquivos estáticos.
- `tests/site.test.mjs`: verificações automatizadas de integridade e comportamento de contato.
- `dist/`: resultado pronto para hospedagem estática; ignorado pelo Git.

## Decisões de implementação

- HTML completo por página: o conteúdo principal funciona sem JavaScript.
- Sem dependências de JavaScript em produção, vídeo automático, analytics ou fontes remotas.
- Menu com `dialog`, Escape, contenção de foco e retorno ao controle de abertura.
- Navegação alternativa sem JavaScript.
- Animações discretas respeitam a preferência por movimento reduzido.
- Imagens responsivas em duas larguras, dimensões explícitas e carregamento adiado fora do hero.
- Contatos reais por `mailto:` e `tel:`. A seleção da unidade preenche o assunto do e-mail.
- **Não há backend de formulário nem promessa de entrega de mensagens.** O link abre o aplicativo de e-mail do visitante, que controla o envio.
- O link externo não validado da Multi-K foi excluído. A Trade-K mantém o contato dentro do site institucional.
- Não foram reutilizados contadores sem confirmação atual, meta de liderança em 2026, logos de criptomoedas ou conteúdo copiado entre unidades.
- A cronologia usa como fonte a página institucional original; não constitui verificação independente dos marcos comerciais.

## Verificações

```sh
npm run check
```

Os testes verificam as 21 páginas, troca PT/EN/ES, destinos locais, âncoras, IDs, semântica, SEO básico, recursos, limites de peso, correções editoriais e a atualização do assunto do e-mail em um DOM de teste.

Na entrega inicial, as sete rotas em português e os principais recursos foram testados por HTTP no servidor local, incluindo a resposta 404. As rotas em inglês passaram nos testes de build e integridade do DOM.

**Limite de validação:** não havia navegador conectado à sessão. A inspeção visual renderizada, o comportamento real do menu por teclado e os testes de toque em dispositivos permanecem pendentes. Os testes de DOM não substituem essa revisão. O envio/recebimento de e-mail não foi testado.

Revisão recomendada: 360, 390, 768, 1024 e 1440 px; navegação de teclado; zoom de 200%; movimento reduzido; JavaScript desativado; e-mail/telefone em dispositivo real.

## Publicação

O diretório `dist` pode ser hospedado em um servidor estático. `vercel.json` configura o build e as URLs com barra final. O projeto está publicado em [globalk-site.vercel.app](https://globalk-site.vercel.app/); o domínio `globalk.com.br` não foi alterado.

URLs canônicas, sitemap e Open Graph usam `https://globalk-site.vercel.app` por padrão. Defina `PUBLIC_SITE_URL` com a origem HTTPS definitiva no build de produção quando o novo site assumir o domínio. Builds da Vercel com `VERCEL_ENV=preview` geram `noindex` e `robots.txt` bloqueado. Veja [a preparação de SEO/GEO](docs/seo-geo.md) antes da troca do domínio.

## Fontes e materiais

- Informações e fotografias: [GlobalK](https://globalk.com.br/), com URLs individuais em `public/assets/sources.json`. Os novos logos da Multi-K, Safe-K e Trade-K foram fornecidos pelo usuário.
- Satoshi: [Fontshare](https://www.fontshare.com/fonts/satoshi).
- O globo editorial e o favicon são SVGs locais. Não são mapas de precisão nem uma reformulação do logotipo oficial.

Os materiais e as informações comerciais devem ser aprovados pelo responsável pela marca antes da publicação.
