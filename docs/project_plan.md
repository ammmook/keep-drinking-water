# แผนการทำงานและความต้องการของโปรเจค AquaFlow (Water Tracker)

## ภาพรวมของโปรเจค (Project Overview)
**AquaFlow** เป็นเว็บแอปพลิเคชันสำหรับบันทึกและติดตามการดื่มน้ำในแต่ละวัน เพื่อช่วยส่งเสริมสุขภาพและสร้างนิสัยการดื่มน้ำให้เพียงพอ ตัวแอปพลิเคชันถูกออกแบบให้มีความสวยงาม น่าใช้งาน (Glassmorphism) ใช้งานง่าย และตอบสนองต่อทุกขนาดหน้าจอ (Responsive Design)

**เทคโนโลยีที่ใช้:**
- React (เวอร์ชัน 19)
- TypeScript
- Vite
- Tailwind CSS
- Data Persistence: `localStorage` (ไม่ต้องใช้ Backend/Database ภายนอก)

---

## ความต้องการของระบบ (System Requirements)

### 1. ฟีเจอร์หลัก (Core Features)
- **Onboarding:** สำหรับผู้ใช้งานครั้งแรก สามารถตั้งเป้าหมายการดื่มน้ำ (Daily Goal) เป็นมิลลิลิตร (ml) ได้ โดยมีตัวเลือกที่แนะนำ (1.5L, 2L, 2.5L, 3L) หรือกำหนดเองได้
- **Dashboard:**
  - แสดงภาพจำลองขวดน้ำและปริมาณน้ำที่ดื่มไปแล้วเทียบกับเป้าหมายในรูปแบบเปอร์เซ็นต์ (Animation ขวดน้ำ)
  - ปุ่มเพิ่มน้ำอย่างรวดเร็ว (Quick Add: 250ml, 500ml, 1000ml)
  - สรุปข้อมูลรายวัน: จำนวนครั้งที่ดื่ม, ปริมาณรวม, เปอร์เซ็นต์ที่ทำได้, ปริมาณที่ต้องดื่มเพิ่ม
  - รายการบันทึกการดื่มน้ำของวันนี้ พร้อมปุ่มลบรายการ
- **Log Water (บันทึกการดื่มน้ำ):**
  - เลือกวันที่และเวลา
  - เลือกปริมาณ (Preset หรือระบุเอง)
  - เลือกหน่วย (ml, แก้ว, ขวด)
  - เลือกประเภทเครื่องดื่ม (น้ำเปล่า, น้ำหวาน, อื่นๆ)
  - เพิ่มหมายเหตุ (Note) ได้
- **History (ประวัติการดื่มน้ำ):**
  - ดูประวัติย้อนหลังได้ 3 รูปแบบ: รายวัน (Day), รายเดือน (Month), รายปี (Year)
  - แสดงภาพรวมความสำเร็จของแต่ละวัน/เดือน/ปีด้วย Mini Bottle
- **Statistics (สถิติ):**
  - สรุปรวม: ปริมาณทั้งหมด, เฉลี่ยต่อวัน, อัตราความสำเร็จ (%), จำนวนวันที่ทำได้ต่อเนื่อง (Streak)
  - กราฟแท่งแสดงปริมาณการดื่มน้ำในสัปดาห์ปัจจุบัน
  - วิเคราะห์ช่วงเวลาที่ดื่ม (เช้า, บ่าย, เย็น)
  - สัดส่วนประเภทเครื่องดื่ม (น้ำเปล่า, น้ำหวาน, อื่นๆ)
- **Settings (ตั้งค่า):**
  - แก้ไขเป้าหมายรายวัน
  - ลบข้อมูลทั้งหมด (Clear Data)

### 2. ความต้องการด้านการออกแบบ (Design Requirements)
- **Aesthetics:** ดีไซน์ทันสมัย สไตล์ Glassmorphism (การใช้พื้นหลังแบบกึ่งโปร่งใส และการเบลอ)
- **Animations:** มีแอนิเมชันตอนขวดน้ำเต็ม, คลื่นน้ำขยับ, อีโมจิแสดงความรู้สึก, และ Transition ต่างๆ
- **Responsive:** รองรับการใช้งานทั้งบน Desktop และ Mobile โดย Mobile จะมี Navigation Bar อยู่ด้านล่าง

---

## โครงสร้างโปรเจค (Project Structure)
```
src/
├── components/          # React Components ย่อยๆ
│   ├── Dashboard.tsx    # หน้าหลักแสดงสถานะการดื่มน้ำ
│   ├── History.tsx      # หน้าประวัติการดื่มน้ำ
│   ├── LogWaterModal.tsx# Modal สำหรับกรอกข้อมูลดื่มน้ำ
│   ├── Onboarding.tsx   # หน้าตั้งค่าเริ่มต้น
│   ├── Settings.tsx     # หน้าตั้งค่า
│   ├── Sidebar.tsx      # เมนูด้านข้าง (และเมนูด้านล่างสำหรับมือถือ)
│   ├── Statistics.tsx   # หน้าสถิติ
│   └── WaterBottle.tsx  # Component วาดขวดน้ำ (SVG)
├── hooks/
│   └── useWaterData.ts  # Custom Hook จัดการ State และ LocalStorage
├── App.tsx              # Component หลัก จัดการ Routing พื้นฐาน
├── index.css            # Global CSS & Tailwind & Animations
├── main.tsx             # Entry Point
└── types.ts             # TypeScript Interfaces/Types
```

---

## แผนการพัฒนาและปรับปรุง (Development Plan & Future Enhancements)

### Phase 1: การปรับปรุงโค้ดปัจจุบัน (Refactoring & Polish)
- [ ] **Code Splitting / Lazy Loading:** ถ้าแอปมีขนาดใหญ่ขึ้น ควรทำ Lazy load สำหรับหน้า History และ Statistics
- [ ] **Accessibility (a11y):** เพิ่ม `aria-labels` ให้กับปุ่มต่างๆ และตรวจสอบ Contrast ของสี
- [ ] **State Management Optimization:** ถ้าข้อมูลเริ่มใหญ่ อาจพิจารณาใช้ Context API หรือ Zustand แทนการส่ง Props หลายทอด (Prop Drilling) ใน `App.tsx`
- [ ] **Theme Support:** เพิ่ม Dark Mode เนื่องจากปัจจุบันมีการระบุสีโทนสว่างไว้ค่อนข้างชัดเจน

### Phase 2: ฟีเจอร์ใหม่ที่น่าสนใจ (New Features)
- [ ] **Achievements / Badges:** ระบบเหรียญรางวัลเมื่อทำเป้าหมายสำเร็จต่อเนื่อง (เช่น ต่อเนื่อง 7 วัน, 30 วัน)
- [ ] **Reminders (แจ้งเตือน):** เพิ่มการแจ้งเตือน (Push Notification / Browser Notification) ถ้าระยะเวลาผ่านไปนานแล้วยังไม่ได้ดื่มน้ำ
- [ ] **Export/Import Data:** เนื่องจากใช้ `localStorage` ถ้าผู้ใช้เปลี่ยนเบราว์เซอร์ ข้อมูลจะหายไป ควรมีระบบ Export ข้อมูลเป็น JSON และ Import กลับเข้ามาได้
- [ ] **PWA (Progressive Web App):** ทำให้แอปสามารถติดตั้งลงบนมือถือ หรือ Desktop ได้ และทำงานแบบออฟไลน์ได้ดีขึ้น

### Phase 3: การจัดการข้อมูลแบบถาวร (Backend Integration - *Optional*)
- [ ] **Cloud Sync:** นำ Firebase หรือ Supabase มาใช้ในการเก็บข้อมูล เพื่อให้สามารถ Sync ข้อมูลข้ามอุปกรณ์ได้
- [ ] **Authentication:** ระบบ Login สำหรับผู้ใช้งาน
