# Imagem base
FROM ubuntu:latest

# Atualiza o sistema operacional e instala as dependências necessárias
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get install -y mysql-server && \
    apt-get install -y nodejs && \
    apt-get install -y npm

# Baixa o arquivo com a aplicação e instala as dependências do Node.js
RUN curl -o boltmenu.tar.gz "https://www.dropbox.com/s/3urkkp7ebka65yd/boltmenu.tar.gz?dl=1" && \
    tar -xzf boltmenu.tar.gz && \
    cd boltmenu/ && \
    npm install

# Copia o arquivo docker-compose.yml para dentro da imagem
COPY docker-compose.yml /app/docker-compose.yml

# Define o diretório de trabalho
WORKDIR /app

# Inicia o serviço do MySQL
RUN service mysql start && \
    mysql -u root -pexample -e "CREATE DATABASE mydb"

# Executa as migrações do banco de dados e compila a aplicação
RUN cd boltmenu/ && \
    npx prisma migrate dev && \
    npm run build

# Define o comando que será executado quando o container for iniciado
CMD ["npm", "start"]
