# THAIBLOCK COMMUNITY Beta Tester Bot

บอท Discord สำหรับเปิดรับสมัคร BETA TESTER ของเซิร์ฟเวอร์ Minecraft `THAIBLOCK COMMUNITY`

## ความสามารถ

- ใช้คำสั่ง `/setup-beta-panel` เพื่อส่งข้อความประกาศรับสมัคร
- ผู้สมัครกดปุ่ม Emoji ใต้ข้อความเพื่อเปิด Discord Modal
- ตรวจรูปแบบชื่อ Minecraft Java และอายุเบื้องต้น
- ส่งใบสมัครเป็น Embed ไปยังห้อง Admin ที่กำหนด
- ป้องกัน `@everyone` และ `@here` จากข้อมูลที่ผู้ใช้กรอก

> หมายเหตุ: Discord Modal เปิดได้จาก Interaction เท่านั้น จึงใช้ปุ่มที่มี Emoji แทนการกด reaction แบบปกติ

## ติดตั้ง

ต้องใช้ Node.js 18.17 ขึ้นไป

```bash
npm install
```

คัดลอก `.env.example` เป็น `.env` แล้วใส่ค่าจริง:

```env
DISCORD_TOKEN=put-your-bot-token-here
CLIENT_ID=put-your-application-client-id-here
GUILD_ID=put-your-discord-server-id-here
ADMIN_CHANNEL_ID=put-admin-review-channel-id-here
REGISTER_EMOJI=📝
SERVER_NAME=THAIBLOCK COMMUNITY
```

## ตั้งค่า Discord Developer Portal

1. สร้าง Application และ Bot
2. เปิด OAuth2 URL ด้วย scopes:
   - `bot`
   - `applications.commands`
3. Bot permissions ที่แนะนำ:
   - `Send Messages`
   - `Embed Links`
   - `Use Slash Commands`
   - `Read Message History`
4. เชิญบอทเข้าเซิร์ฟเวอร์

## ลงทะเบียนคำสั่ง

```bash
npm run deploy
```

## เปิดใช้งานบอท

```bash
npm start
```

จากนั้นใช้คำสั่ง `/setup-beta-panel` ในห้องที่ต้องการให้แสดงฟอร์มสมัคร

## วิธีทดสอบ

1. รัน `npm run deploy`
2. รัน `npm start`
3. ใช้ `/setup-beta-panel`
4. กดปุ่ม `สมัคร BETA TESTER`
5. กรอกข้อมูลและส่งฟอร์ม
6. ตรวจว่าห้อง Admin ได้รับ Embed ใบสมัคร
