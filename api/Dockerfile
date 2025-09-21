# 1. Escolha a imagem base oficial do Node.js. 
# A versão 'alpine' é mais leve, o que é ótimo para produção.
FROM node:20-alpine

# 2. Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# 3. Copie os arquivos de dependência. 
# O '*' garante que tanto o package.json quanto o package-lock.json sejam copiados.
COPY package*.json ./

# 4. Instale as dependências do projeto
# Usamos 'npm ci' que é otimizado para ambientes de automação e mais rápido que 'npm install'
RUN npm ci

# 5. Copie o resto do código da sua aplicação para o diretório de trabalho no contêiner
COPY . .

# 6. Exponha a porta que sua API usa. 
# Se sua API roda em outra porta (ex: 3333), altere aqui.
EXPOSE 4000

# 7. Defina o comando para iniciar a aplicação quando o contêiner for executado
CMD [ "npm", "start" ]