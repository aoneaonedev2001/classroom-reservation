# ใช้ Node.js image
FROM node:18

# สร้างโฟลเดอร์ในคอนเทนเนอร์สำหรับเก็บ source code
WORKDIR /app

# คัดลอกเฉพาะไฟล์ dependencies ก่อน เพื่อช่วย cache layer
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอก source code ทั้งหมดที่เหลือเข้าไป
COPY . .

# เปิดพอร์ต 8000
EXPOSE 8000

# รันไฟล์ server.js
CMD ["node", "server.js"]
