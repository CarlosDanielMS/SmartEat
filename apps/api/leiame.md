[TOC]

# DOCUMENTAÇÃO MVC DA INFOCEPT
Este manual se refere a utilização do template MVC versão 2.0 da InfoCept. Antes de mais nada leia a [documentação](link) da loja InfoCept, e não esqueça de criar o Bando de Dados antes de iniciar o MVC. No mínimo o nome da tabela, mas de preferência e crie o Banco de dados inteiro baseado no mapa mental.

# REQUISITOS 

## FERRAMENTAS (SUGESTÕES) 

Iremos realizar uma list de programas e ferramentas que geralmente são utilizadas em todos projetos não sendo obrigatório o uso em todos projetos:
- [Laragon](https://laragon.org/) - (servidor local)
- [VSCode](https://code.visualstudio.com/) - (editor de códigos)
- [Chrome Developer](https://www.google.com/intl/pt-BR/chrome/dev/) - (Navegador que permite abrir nossas aplicações web)
- [Git](https://git-scm.com/) - (atualmente estamos realizando tomada de decisões sobre essa ferramenta, sua funções e os versionamentos do projeto)
- [Bitrix](https://infocept.bitrix24.com.br/) - (Projetos planejados pela Bitrix, nossa ferramenta SCRUM)
- [Trello](https://trello.com/) - (Projetos planejados pelo Trello, nossa ferramenta SCRUM)

# LIBs e TEMPLATES INTERNOS
- [MVC](https://gitlab.com/infoceptdeveloper/template_mvc.git)
- [LARAVEL](link_git)
- [EXCEL TO XML](link_git)
- [MERCADO_PAGO](link_git)
- [PHP-MAILER](link_git)


# CONFIGURAÇÕES BÁSICAS

- [config.php](#configphp)
- [htacess](#htaccess)
- [environment](#configphp)
- [index.php](#indexphp)
- [.gitignore](#gitignore)
- [controler](#Controller)
- [model](#Model)
- [view](#View)

## CONFIG.PHP

### BANCO DE DADOS
| RECURSO  | EXPLICAÇÃO | EXEMPLO |
| ------------- | ------------- | ------------- |
| BASE_URL  | Altere para a base_url online e offline do seu projeto, geralmente o que mudamos é apenas o termo template_mvc, e online, basta copiar a sua url online, não esqueça de colocar a / no final de ambas url.  | http://localhost/infocept/ <br> https://infocept.com.br/ |
| dbname  | Insira o nome do bd_offline e bd_online  | infocept |
| host  | Insira o nome do servidor off-line e online  | localhost |
| dbuser  | Insira o nome do usuário off-line e online  | root |
| dbpass  | Insira a senha do usuário off-line e online  | "" |

**NOTA:** as configurações online, sempre ficarão no else, você precisa pegar ela na hospedagem ou com gestor do projeto.

### E-MAIL
| RECURSO  | EXPLICAÇÃO | EXEMPLO |
| ------------- | ------------- | ------------- |
| host_mail  | Nome do servidor de email  | brxxx.hostgator.com.br |
| user_mail  | E-mail  | developer@infocept.com.br |
| user_name  | Nome do usuário  | InfoCept Developer |
| password  | Senha do e-mail  | password1234 |
| port  | coloque a porta SMTP do servidor de email  | 465 |

**NOTA:** essas informações podemos pegar na hospedagem, servidor de e-mail ou gestor do projeto.

### TRANSPORTE
| RECURSO  | EXPLICAÇÃO | EXEMPLO |
| ------------- | ------------- | ------------- |
| zip_code_origin  | Insira o cep de origem do produto  | 36570000 |

**NOTA:** somente nos projetos necessários.

### GATEWAY DE PAGAMENTO
| RECURSO  | EXPLICAÇÃO | EXEMPLO |
| ------------- | ------------- | ------------- |
| api_key  | Chave da api de pagamento  | api-key-78745484445 |

**NOTA:** somente nos projetos necessários.

### TRY CATCH
O trycatch testa a conexão de banco de dados e se ocorrer um erro ele cria um arquivo error_bd.log, se necessário ajuste, só faça a documentação do projeto informando.

### .gitignore
Insira arquivos ou pastas que devem ser ignorados pelo GIT. Recomendo ignorar o config, após puxar o template, remova o comentário no gitignore.

## htaccess

| RECURSO  | EXPLICAÇÃO | EXEMPLO |
| ------------- | ------------- | ------------- |
| template_mvc  | alterar para o nome do seu projeto  | /infocept/index.php |

## environment

| RECURSO  | EXPLICAÇÃO | 
| ------------- | ------------- | 
| development  | usado para o site em desenvolvimento  | 
| production  | usado para o site em produção (online)  |

## index.php
| RECURSO  | EXPLICAÇÃO | EXEMPLO |
| ------------- | ------------- | ------------- |
| timezone  | Região da timezone | ``` <?php date_default_timezone_set('America/Sao_Paulo'); ?> ``` |
| //require_once 'vendor/autoload.php';  | Habilita o autoload em projetos que precisa do composer  | basta 

## .gitignore
Insira nesse arquivos o nome dos arquivos e pastas que precisam ser ignorados no git, por padrão, ignoramos .config.

## Controller
| Controller  | EXPLICAÇÃO | 
| ------------- | ------------- | 
| Admin  | quando necessário utilizar painel administrativo (excluir se não)   | 
| Authenticator  | quando necessário utilizar autenticação de usuário (login, register, recuperar senha...) (excluir se não)  |
| ExampleTable  | utilizar como exemplo para criar os controllers, geralmente cada tabela principal do banco de dados vira um controller, avaliem tabelas que se originam de outra tabela se há necessidade.  |

## Model
| Model  | EXPLICAÇÃO | 
| ------------- | ------------- | 
| Example  | utilizar como exemplo para criar os controllers, geralmente cada tabela principal do banco de dados vira um model, avaliem tabelas que se originam de outra tabela se há necessidade.  |

## View
| View  | EXPLICAÇÃO | 
| ------------- | ------------- | 
| Pasta - Admin  | Utilizar essa pasta para todas as views do Admin (excluir se não)  |
| Pasta - authenticator  | Utilizar essa pasta para todas as views de autenticação (excluir se não)  |
| Pasta - Tabela BD  | geralmente cada tabela principal do banco de dados vira uma pasta na view, avaliem tabelas que se originam de outra tabela se há necessidade.  |

# CONSIDERAÇÕES FINAIS
Não inicie nenhum projeto sem antes ler a documentação.

