# Como Rodar

Siga as etapas abaixo para executar o projeto:

1. Baixe o repositório para o seu ambiente local.
2. Crie um arquivo chamado `.env` na raiz do projeto e configure as variáveis de ambiente necessárias.
3. Execute o comando `npm install` para instalar as dependências do projeto.
4. Navegue até a pasta `docker` e execute o comando `docker-compose up -d` para iniciar o contêiner do MySQL em segundo plano.
5. Após o contêiner do MySQL estar em execução, execute o comando `npx prisma db push` para aplicar as migrações do banco de dados utilizando o Prisma.
6. Execute o comando `npm run build` para criar uma versão otimizada do projeto.
7. Execute o comando `npm start` para iniciar o servidor. Se estiver utilizando o PM2, atualize-o para iniciar o servidor corretamente.

Certifique-se de ter todas as dependências e configurações corretas para o projeto antes de executá-lo.
