FROM ubuntu:latest

# Instale as dependências necessárias
RUN apt-get update && apt-get install -y curl git mysql-client npm

# Faça o clone do repositório
RUN git clone https://github.com/LucasZerino/boltmenu.git

# Defina o diretório de trabalho para a aplicação
WORKDIR /boltmenu

# Instale as dependências do projeto
RUN npm install

# Configure o banco de dados mysql
RUN apt-get install -y mysql-server
RUN service mysql start && mysql -uroot -e "CREATE DATABASE mydb"
ENV DATABASE_URL=mysql://root:example@localhost:3306/mydb
RUN npm install prisma -g && npx prisma migrate dev

# Compile o projeto
RUN npm run build

# Exponha a porta 3000 para acesso externo
EXPOSE 3000

# Execute a aplicação
CMD ["npm", "start"]
