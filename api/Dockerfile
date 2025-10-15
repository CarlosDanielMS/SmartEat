# 1. Imagem base
FROM node:20-alpine

# 2. Diretório de trabalho
WORKDIR /app

# 3. Instale as ferramentas de build
RUN apk add --no-cache python3 make g++

# 4. Copie os arquivos de configuração e o schema
COPY package*.json ./
COPY prisma ./prisma/

# 5. GARANTA A LIMPEZA e instale as dependências
RUN rm -rf node_modules && npm ci

# 6. Copie o resto do código da sua aplicação
COPY . .

# 7. Exponha a porta
EXPOSE 4000

# 8. Comando de inicialização
CMD [ "npm", "start" ]