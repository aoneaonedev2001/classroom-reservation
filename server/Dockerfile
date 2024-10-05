# Dockerfile

# ใช้ Node.js image
FROM node:18

# สร้างโฟลเดอร์ในคอนเทนเนอร์สำหรับเก็บ source code
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json เข้าไปในคอนเทนเนอร์
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมดไปยังคอนเทนเนอร์
COPY . .

# เปิดพอร์ต 8000
EXPOSE 8000

# รันไฟล์ server.js แทน
CMD ["node", "server.js"]
