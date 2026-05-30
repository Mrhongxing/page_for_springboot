
# 使用官方 Node.js 运行时作为基础镜像
#FROM node:22-alpine as build

# 设置工作目录
#WORKDIR /app

# 复制 package.json 和 package-lock.json
#COPY package*.json ./

# 安装依赖
#RUN npm ci

# 复制源代码
#COPY . .

# 构建应用 - 跳过类型检查
#RUN npm run build-only

# 使用 nginx 作为生产服务器
#FROM nginx:alpine

# 复制构建结果到 nginx（注意：从构建阶段的 /app/dist 复制）
#COPY --from=build /app/dist /usr/share/nginx/html

# 暴露端口
#EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]

# 暴露端口
#EXPOSE 3000

# 启动应用
#CMD ["serve", "-s", "dist", "-l", "3000"]

FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# 重要：确保环境变量设置为生产环境
ENV NODE_ENV=production

RUN npm run build-only

FROM nginx:alpine

# 复制构建结果
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义 nginx 配置（推荐）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]