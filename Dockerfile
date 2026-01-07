FROM node:24
WORKDIR /app/backEnd

COPY backEnd/package*.json ./
RUN npm install

# backEnd フォルダ内の全ファイル（prisma.config.ts を含む）をコピー
COPY backEnd/ ./

# ビルド時に Client を生成
RUN npx prisma generate

WORKDIR /app/frontEnd
COPY frontEnd/dist ./dist

WORKDIR /app/backEnd
# 重要：db push を CMD（実行時）に移動。Renderの環境変数を使えるようにする。
CMD npx prisma db push && npm start