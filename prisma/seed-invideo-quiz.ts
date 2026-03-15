import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 2 questions per lesson, triggerPercent 30 and 65
const quizData: Record<string, { q: string; a: string; b: string; c: string; d: string; correct: 'A'|'B'|'C'|'D'; exp: string }[]> = {
  // ── AIAUTO ──────────────────────────────────────────────────────────
  'cmmo63eeh0025w6ufo6ibhgm4': [ // พื้นฐาน Business Automation และ AI
    { q: 'Business Automation หมายถึงอะไร?', a: 'การใช้เทคโนโลยีแทนแรงงานคนทั้งหมด', b: 'การใช้ซอฟต์แวร์หรือ AI ทำงานซ้ำๆ แทนมนุษย์', c: 'การจ้างพนักงานเพิ่มเพื่อเพิ่มประสิทธิภาพ', d: 'การลดจำนวนพนักงานในองค์กร', correct: 'B', exp: 'Business Automation คือการนำเทคโนโลยีมาทำงานซ้ำๆ แทนมนุษย์ เพื่อเพิ่มความเร็วและลดข้อผิดพลาด' },
    { q: 'ข้อดีหลักของ AI Automation ในธุรกิจคืออะไร?', a: 'ลดค่าใช้จ่ายด้านซอฟต์แวร์', b: 'เพิ่มความเร็วและความแม่นยำในงาน', c: 'ทำให้ธุรกิจไม่ต้องมีพนักงาน', d: 'ลดความต้องการของลูกค้า', correct: 'B', exp: 'AI Automation ช่วยเพิ่มความเร็ว ความแม่นยำ และลดข้อผิดพลาดในกระบวนการทำงาน' },
  ],
  'cmmo63eeh0027w6ufdgmsbmi0': [ // สร้าง Workflow อัตโนมัติด้วย Make.com
    { q: 'Make.com (เดิม Integromat) เป็นเครื่องมือประเภทใด?', a: 'ซอฟต์แวร์บัญชี', b: 'แพลตฟอร์ม No-code สำหรับเชื่อมต่อแอปและสร้าง Workflow', c: 'เครื่องมือออกแบบกราฟิก', d: 'ระบบ CRM', correct: 'B', exp: 'Make.com เป็น No-code platform ที่ช่วยเชื่อมต่อแอปต่างๆ และสร้าง Workflow อัตโนมัติโดยไม่ต้องเขียนโค้ด' },
    { q: 'ใน Make.com "Scenario" หมายถึงอะไร?', a: 'หน้าจอเริ่มต้นของแอป', b: 'ชุดของ Module ที่เชื่อมกันเพื่อทำงานอัตโนมัติ', c: 'รายงานผลการทำงาน', d: 'ไฟล์ข้อมูลที่นำเข้า', correct: 'B', exp: 'Scenario ใน Make.com คือกระบวนการทำงานอัตโนมัติที่ประกอบด้วย Module ต่างๆ เชื่อมต่อกัน' },
  ],
  'cmmo63eei0029w6ufm532nvm7': [ // n8n สำหรับ AI Automation
    { q: 'n8n แตกต่างจาก Make.com อย่างไร?', a: 'n8n ใช้ได้เฉพาะบน Windows', b: 'n8n เป็น Open-source และ self-host ได้', c: 'n8n ไม่รองรับ AI', d: 'n8n ต้องเขียนโค้ดทั้งหมด', correct: 'B', exp: 'n8n เป็น Open-source workflow automation ที่ self-host ได้ ทำให้ข้อมูลอยู่ใน server ของเราเอง' },
    { q: '"Node" ใน n8n คืออะไร?', a: 'เซิร์ฟเวอร์คลาวด์', b: 'แต่ละขั้นตอนในกระบวนการ Workflow', c: 'ฐานข้อมูลหลัก', d: 'ไฟล์การตั้งค่า', correct: 'B', exp: 'Node ใน n8n คือแต่ละขั้นตอนของกระบวนการ เช่น HTTP Request, Send Email, Transform Data' },
  ],
  'cmmo63eej002bw6ufnhra4vgu': [ // AI Agent และ Autonomous Workflow
    { q: 'AI Agent คืออะไร?', a: 'ตัวแทนขายที่ใช้ AI ช่วย', b: 'ระบบ AI ที่สามารถวางแผนและดำเนินการเองได้', c: 'Chatbot พื้นฐานที่ตอบคำถาม', d: 'ซอฟต์แวร์แปลภาษา', correct: 'B', exp: 'AI Agent คือระบบ AI ที่สามารถรับเป้าหมาย วางแผน และดำเนินการหลายขั้นตอนได้เองโดยไม่ต้องมีคนสั่งทุกขั้น' },
    { q: 'ReAct Framework ใน AI Agent ใช้วิธีการใด?', a: 'Random Action', b: 'Reasoning + Acting สลับกัน', c: 'Reactive Programming', d: 'Real-time Action', correct: 'B', exp: 'ReAct ย่อมาจาก Reasoning and Acting — AI คิดวิเคราะห์ก่อนแล้วดำเนินการ จากนั้นสังเกตผลและคิดต่อ' },
  ],
  'cmmo63eek002dw6uf9ox3itgh': [ // Case Study: ออกแบบระบบอัตโนมัติสำหรับธุรกิจ SME
    { q: 'ขั้นตอนแรกในการออกแบบระบบ Automation สำหรับ SME คืออะไร?', a: 'ซื้อซอฟต์แวร์ราคาแพง', b: 'ระบุกระบวนการที่ซ้ำซากและใช้เวลามาก', c: 'จ้างนักพัฒนา', d: 'อบรมพนักงานทุกคน', correct: 'B', exp: 'เริ่มต้นด้วยการ Map กระบวนการที่ทำซ้ำๆ และเสียเวลามาก เพื่อหาจุดที่ Automation จะให้ผลลัพธ์สูงสุด' },
    { q: 'ROI ของ Automation วัดจากอะไร?', a: 'จำนวนซอฟต์แวร์ที่ใช้', b: 'เวลาและค่าใช้จ่ายที่ประหยัดได้เทียบกับต้นทุนการลงทุน', c: 'จำนวนพนักงานที่ลดลง', d: 'ความเร็วอินเทอร์เน็ต', correct: 'B', exp: 'ROI = (ผลประโยชน์ที่ได้รับ - ต้นทุน) / ต้นทุน × 100 โดยนับทั้งเวลาที่ประหยัด ข้อผิดพลาดที่ลดลง และรายได้ที่เพิ่มขึ้น' },
  ],

  // ── AIMKT ────────────────────────────────────────────────────────────
  'cmmo63ee2001gw6ufwpo8jtrs': [ // AI กับการวิเคราะห์ตลาดและพฤติกรรมลูกค้า
    { q: 'AI ช่วยในการวิเคราะห์พฤติกรรมลูกค้าอย่างไร?', a: 'ทำนายราคาสินค้า', b: 'ประมวลผลข้อมูลขนาดใหญ่เพื่อหา Pattern และ Insight', c: 'สร้างโฆษณาอัตโนมัติ', d: 'ติดต่อลูกค้าทางโทรศัพท์', correct: 'B', exp: 'AI ช่วยวิเคราะห์ข้อมูลพฤติกรรมจำนวนมาก เพื่อหา Pattern การซื้อ ความชอบ และโอกาสในการขาย' },
    { q: 'Sentiment Analysis ในงาน Marketing ใช้ทำอะไร?', a: 'วิเคราะห์งบการเงิน', b: 'วิเคราะห์ความรู้สึกของลูกค้าจาก Review และ Social Media', c: 'ออกแบบโลโก้', d: 'จัดการ Supply Chain', correct: 'B', exp: 'Sentiment Analysis ใช้ NLP วิเคราะห์ว่าลูกค้ารู้สึก Positive / Negative / Neutral ต่อแบรนด์หรือสินค้า' },
  ],
  'cmmo63ee3001iw6uf21r0u2jd': [ // Content Marketing ด้วย Generative AI
    { q: 'Generative AI ช่วย Content Marketing อย่างไร?', a: 'แทนที่ทีมการตลาดทั้งหมด', b: 'สร้าง Draft เนื้อหาอย่างรวดเร็วเพื่อให้คนปรับแต่งต่อ', c: 'โพสต์โซเชียลมีเดียอัตโนมัติโดยไม่ต้องตรวจ', d: 'ลบคู่แข่งออกจากตลาด', correct: 'B', exp: 'Gen AI ช่วยร่างเนื้อหาเร็วขึ้น 5-10 เท่า ทีมงานยังคงต้องตรวจสอบ ปรับแต่ง และเพิ่มความเป็นแบรนด์' },
    { q: 'ข้อควรระวังในการใช้ AI สร้าง Content คืออะไร?', a: 'AI ใช้งานได้ยาก', b: 'เนื้อหาอาจมีข้อมูลผิดพลาดหรือขาดความเป็นมนุษย์', c: 'ค่าใช้จ่ายสูงเกินไป', d: 'AI ไม่สามารถเขียนภาษาไทยได้', correct: 'B', exp: 'AI อาจ Hallucinate ข้อมูล และเนื้อหาอาจดูเป็นกลๆ ไม่มีเอกลักษณ์ของแบรนด์ ต้องตรวจสอบและปรับแต่งเสมอ' },
  ],
  'cmmo63ee3001kw6ufdxkgm70m': [ // AI สำหรับ SEO และ Performance Marketing
    { q: 'AI ช่วย SEO อย่างไร?', a: 'Hack อัลกอริทึม Google', b: 'วิเคราะห์ Keyword, สร้าง Meta Tags, และปรับ Content Structure', c: 'ซื้อ Backlink อัตโนมัติ', d: 'ลบเว็บคู่แข่ง', correct: 'B', exp: 'AI ช่วยวิเคราะห์ Keyword Opportunity, สร้าง SEO-friendly Content, วิเคราะห์คู่แข่ง และแนะนำการปรับ On-page SEO' },
    { q: 'Performance Marketing ด้วย AI หมายถึงอะไร?', a: 'การจ้างนักกีฬาโฆษณา', b: 'การใช้ AI วิเคราะห์และปรับ Campaign โฆษณาแบบ Real-time', c: 'การแสดงโฆษณาบน TV', d: 'การวัดผลพนักงาน', correct: 'B', exp: 'Performance Marketing + AI คือการใช้ Machine Learning เพื่อ Target, Bid, และปรับ Ad Creative แบบอัตโนมัติเพื่อเพิ่ม ROAS' },
  ],
  'cmmo63ee4001mw6ufpv6avahl': [ // Personalization และ AI Chatbot ในงานขาย
    { q: 'Personalization ด้วย AI คืออะไร?', a: 'การส่งอีเมลหาลูกค้าทุกคนเหมือนกัน', b: 'การนำเสนอเนื้อหา สินค้า หรือข้อเสนอที่ตรงกับแต่ละบุคคล', c: 'การเปลี่ยนชื่อลูกค้าในอีเมล', d: 'การลดราคาสินค้าทุกชิ้น', correct: 'B', exp: 'AI Personalization วิเคราะห์ประวัติและพฤติกรรมของลูกค้าแต่ละคน เพื่อนำเสนอสิ่งที่เกี่ยวข้องและมีโอกาสซื้อสูงสุด' },
    { q: 'AI Chatbot ในงานขายช่วยอะไรได้บ้าง?', a: 'แทนที่ Sales Manager', b: 'ตอบคำถาม 24/7, Qualify Lead, และนัดหมายแบบอัตโนมัติ', c: 'ปิดการขายทุกรายการโดยไม่ต้องมีคน', d: 'จัดการ Supply Chain', correct: 'B', exp: 'AI Chatbot ช่วยตอบคำถามพื้นฐาน 24 ชั่วโมง, คัดกรอง Lead, และส่งต่อให้ Sales เมื่อลูกค้าพร้อมซื้อ' },
  ],
  'cmmo63ee5001ow6ufx09zbnq8': [ // สร้างแผนการตลาด AI แบบบูรณาการ
    { q: 'แผนการตลาด AI แบบบูรณาการควรเริ่มจากอะไร?', a: 'เลือก AI Tool ก่อน', b: 'กำหนดเป้าหมายธุรกิจและ KPI ที่ชัดเจน', c: 'ซื้อ Data จากภายนอก', d: 'สร้างโฆษณาทันที', correct: 'B', exp: 'ต้องเริ่มจากเป้าหมายและ KPI ที่ชัดเจน จากนั้นจึงเลือก AI Tools ที่เหมาะสม ไม่ใช่กลับกัน' },
    { q: 'การวัดผลแผนการตลาด AI ควรดูตัวชี้วัดใด?', a: 'จำนวน AI Tool ที่ใช้', b: 'CAC, CLV, ROAS, Conversion Rate', c: 'ขนาดไฟล์ข้อมูล', d: 'จำนวนพนักงานฝ่ายการตลาด', correct: 'B', exp: 'KPI สำคัญ: CAC (ต้นทุนหาลูกค้าใหม่), CLV (มูลค่าตลอดอายุลูกค้า), ROAS (ผลตอบแทนจากโฆษณา), และ Conversion Rate' },
  ],

  // ── AIHR ─────────────────────────────────────────────────────────────
  'cmmo63eda0002w6uf7ba8s79a': [ // แนะนำ AI ในงานทรัพยากรบุคคล
    { q: 'AI ในงาน HR ใช้กับงานด้านใดได้บ้าง?', a: 'เฉพาะงานเงินเดือน', b: 'สรรหา, ฝึกอบรม, วิเคราะห์ข้อมูลพนักงาน, และ Engagement', c: 'เฉพาะงานธุรการ', d: 'เฉพาะงานกฎหมาย', correct: 'B', exp: 'AI ในงาน HR ครอบคลุม: สรรหาบุคลากร, คัดกรอง Resume, วิเคราะห์ข้อมูลพนักงาน, ออกแบบการฝึกอบรม และวัด Engagement' },
    { q: 'HR Analytics คืออะไร?', a: 'ระบบจ่ายเงินเดือนออนไลน์', b: 'การวิเคราะห์ข้อมูลพนักงานเพื่อตัดสินใจเชิงกลยุทธ์', c: 'แบบฟอร์มประเมินผล', d: 'ซอฟต์แวร์ติดตามเวลา', correct: 'B', exp: 'HR Analytics คือการใช้ข้อมูลและสถิติวิเคราะห์พฤติกรรม ประสิทธิภาพ และแนวโน้มของพนักงาน เพื่อตัดสินใจ HR อย่างมีหลักฐาน' },
  ],
  'cmmo63edd0004w6ufkehieayq': [ // AI กับการสรรหาและคัดกรองผู้สมัคร
    { q: 'AI ช่วยในกระบวนการสรรหาอย่างไร?', a: 'สัมภาษณ์แทนผู้จัดการทั้งหมด', b: 'คัดกรอง Resume อัตโนมัติและจัดอันดับผู้สมัครที่เหมาะสม', c: 'ประกาศรับสมัครบน Social Media', d: 'กำหนดเงินเดือนให้พนักงาน', correct: 'B', exp: 'AI ATS (Applicant Tracking System) สแกนและคัดกรอง Resume ด้วย NLP เพื่อจัดอันดับผู้สมัครตาม JD โดยอัตโนมัติ' },
    { q: 'ความเสี่ยงของ AI ในการสรรหาบุคลากรคืออะไร?', a: 'ค่าใช้จ่ายสูง', b: 'อาจเกิด Bias จาก Training Data ที่ไม่สมดุล', c: 'ทำงานช้าเกินไป', d: 'ไม่สามารถอ่าน PDF ได้', correct: 'B', exp: 'AI อาจ Bias หากถูกเทรนด้วยข้อมูลประวัติศาสตร์ที่ไม่หลากหลาย ส่งผลให้เลือกปฏิบัติโดยไม่ตั้งใจ' },
  ],
  'cmmo63ede0006w6ufo3sjowpp': [ // การวิเคราะห์ข้อมูลพนักงานด้วย AI
    { q: 'People Analytics ช่วยอะไร?', a: 'ออกแบบสำนักงาน', b: 'ทำนายการลาออก ประสิทธิภาพทีม และความต้องการฝึกอบรม', c: 'จัดการ Payroll', d: 'สั่งซื้ออุปกรณ์สำนักงาน', correct: 'B', exp: 'People Analytics ใช้ ML วิเคราะห์ข้อมูลพนักงาน เพื่อทำนาย Turnover, วัด Engagement, และระบุ High Performers' },
    { q: 'Predictive Attrition Model คืออะไร?', a: 'โมเดลทำนายยอดขาย', b: 'โมเดล AI ที่ทำนายว่าพนักงานคนใดอาจลาออก', c: 'ระบบวัดผลงาน KPI', d: 'แบบประเมินความพอใจ', correct: 'B', exp: 'Predictive Attrition Model วิเคราะห์ปัจจัยต่างๆ เช่น ความถี่ขาดงาน คะแนน Engagement และเงินเดือน เพื่อทำนายการลาออก' },
  ],
  'cmmo63edf0008w6ufia6mqtmq': [ // AI สำหรับการฝึกอบรมและพัฒนาบุคลากร
    { q: 'Adaptive Learning ด้วย AI คืออะไร?', a: 'การเรียนออนไลน์ผ่านมือถือ', b: 'ระบบปรับเนื้อหาการเรียนรู้ให้เหมาะสมกับแต่ละบุคคล', c: 'การเรียนในห้องเรียนปกติ', d: 'การทดสอบพนักงานทุกเดือน', correct: 'B', exp: 'Adaptive Learning ใช้ AI วิเคราะห์ความก้าวหน้าและจุดอ่อนของผู้เรียนแต่ละคน แล้วปรับหลักสูตรให้เหมาะสมแบบ Real-time' },
    { q: 'AI ช่วยวัด Training Effectiveness อย่างไร?', a: 'นับจำนวนชั่วโมงเรียน', b: 'วิเคราะห์ผลทดสอบ, พฤติกรรมหลังเรียน, และ KPI ที่เปลี่ยนแปลง', c: 'ดูจำนวนผู้เข้าอบรม', d: 'วัดความพึงพอใจอย่างเดียว', correct: 'B', exp: 'AI วิเคราะห์ Kirkpatrick Level 3-4: พฤติกรรมที่เปลี่ยนแปลงหลังเรียนและผลลัพธ์ธุรกิจที่วัดได้' },
  ],
  'cmmo63edg000aw6uf63ce9afn': [ // จริยธรรมและอนาคตของ AI ในงาน HR
    { q: 'หลัก Ethical AI ใน HR ควรคำนึงถึงอะไร?', a: 'ความเร็วของระบบ', b: 'ความโปร่งใส, ความยุติธรรม, และความเป็นส่วนตัว', c: 'ต้นทุนซอฟต์แวร์', d: 'จำนวน Feature ของ AI', correct: 'B', exp: 'Ethical AI ใน HR ต้องโปร่งใส (explainable), ยุติธรรม (unbiased), ปกป้องข้อมูลส่วนตัว และเปิดโอกาสให้พนักงาน Appeal ผลได้' },
    { q: 'อนาคตของ HR ในยุค AI จะเปลี่ยนอย่างไร?', a: 'AI จะแทนที่ HR ทั้งหมด', b: 'HR จะมุ่งเน้นงานเชิงกลยุทธ์และ Human Touch มากขึ้น', c: 'HR จะหายไปจากองค์กร', d: 'ทุกอย่างจะเหมือนเดิม', correct: 'B', exp: 'AI รับงาน Transactional ไป ทำให้ HR ฟรีเวลาไปโฟกัสงาน Strategic เช่น Culture Building, Talent Strategy, และ Employee Experience' },
  ],

  // ── AIPROD ───────────────────────────────────────────────────────────
  'cmmn1t1nk0025w68fl3bgcxmw': [ // รู้จักเครื่องมือ AI สำหรับการทำงาน
    { q: 'เครื่องมือ AI สำหรับการทำงานที่นิยมในปัจจุบันคืออะไร?', a: 'Excel และ PowerPoint', b: 'ChatGPT, Copilot, Gemini, Claude', c: 'Google Search', d: 'Facebook และ Instagram', correct: 'B', exp: 'เครื่องมือ AI สำหรับงานที่นิยม ได้แก่ ChatGPT, Microsoft Copilot, Google Gemini, Claude โดยแต่ละตัวมีจุดเด่นต่างกัน' },
    { q: 'Large Language Model (LLM) คืออะไร?', a: 'ภาษาโปรแกรมมิ่งขนาดใหญ่', b: 'โมเดล AI ที่เทรนด้วยข้อความจำนวนมากเพื่อเข้าใจและสร้างภาษา', c: 'ซอฟต์แวร์แปลเอกสาร', d: 'ฐานข้อมูลคำศัพท์', correct: 'B', exp: 'LLM คือ AI Model ที่เทรนด้วย Text ขนาดใหญ่ ทำให้สามารถเข้าใจ สรุป แปล และสร้างเนื้อหาได้อย่างมีประสิทธิภาพ' },
  ],
  'cmmn1t1nl0027w68f8e99jtit': [ // Prompt Engineering สำหรับการทำงานจริง
    { q: 'Prompt Engineering คืออะไร?', a: 'การเขียนโปรแกรม AI', b: 'ศาสตร์การออกแบบคำสั่งให้ AI เพื่อให้ได้ผลลัพธ์ที่ต้องการ', c: 'การซ่อมแซม AI', d: 'การฝึก AI ใหม่', correct: 'B', exp: 'Prompt Engineering คือการเขียนคำสั่ง (Prompt) ให้ AI อย่างมีประสิทธิภาพ เพื่อให้ได้ Output ที่ถูกต้องและมีประโยชน์' },
    { q: 'เทคนิค Role Prompting คืออะไร?', a: 'การกำหนดบทบาทให้ตัวเอง', b: 'การบอก AI ให้แสดงบทบาทเป็นผู้เชี่ยวชาญ เช่น "Act as a marketing expert"', c: 'การสั่งงาน AI แบบเร่งด่วน', d: 'การใช้ Prompt หลายภาษา', correct: 'B', exp: 'Role Prompting ช่วยให้ AI ตอบในมุมมองของผู้เชี่ยวชาญ เพิ่มคุณภาพและความเกี่ยวข้องของคำตอบ' },
  ],
  'cmmn1t1nm0029w68f1t1o0h12': [ // AI สำหรับ Document & Presentation
    { q: 'AI ช่วยสร้างเอกสารธุรกิจอย่างไร?', a: 'Print เอกสารอัตโนมัติ', b: 'ร่างเนื้อหา, สรุป, แปลภาษา และปรับรูปแบบ', c: 'ออกแบบตรายาง', d: 'ส่งเอกสารทางอีเมล', correct: 'B', exp: 'AI ช่วยร่าง Draft เอกสาร, สรุปเอกสารยาวๆ, แปลภาษา, ปรับ Tone และ Format ให้เหมาะสมกับวัตถุประสงค์' },
    { q: 'Gamma.app ใช้ทำอะไร?', a: 'แก้ไขรูปภาพ', b: 'สร้าง Presentation และเว็บเพจด้วย AI แบบ No-code', c: 'จัดการฐานข้อมูล', d: 'เขียนโค้ด', correct: 'B', exp: 'Gamma.app เป็นเครื่องมือ AI ที่ช่วยสร้าง Presentation, Documents และ Webpages สวยงามจากแค่ Prompt ใน Seconds' },
  ],
  'cmmn1t1nm002bw68f4bbjsc32': [ // AI สำหรับ Data Analysis & Visualization
    { q: 'ChatGPT Code Interpreter ช่วย Data Analysis อย่างไร?', a: 'จัดการ Server', b: 'รับไฟล์ข้อมูล วิเคราะห์ สร้าง Chart และตีความผลโดยอัตโนมัติ', c: 'เขียน SQL เท่านั้น', d: 'Download ข้อมูลจากอินเทอร์เน็ต', correct: 'B', exp: 'Advanced Data Analysis ของ ChatGPT รับ Excel/CSV, รัน Python วิเคราะห์ข้อมูล, สร้าง Visualization และอธิบายผลเป็นภาษาธรรมดา' },
    { q: 'ข้อควรระวังในการใช้ AI วิเคราะห์ข้อมูลธุรกิจคืออะไร?', a: 'AI ใช้งานยากมาก', b: 'ข้อมูล Sensitive ไม่ควรอัปโหลดขึ้น AI สาธารณะ', c: 'AI ช้าเกินไป', d: 'AI ไม่สามารถอ่าน Excel ได้', correct: 'B', exp: 'ข้อมูลลูกค้า การเงิน หรือ IP ขององค์กรไม่ควรอัปโหลดขึ้น AI ภายนอก ควรใช้เวอร์ชัน Enterprise หรือ On-premise แทน' },
  ],
  'cmmn1t1nn002dw68fk0ftwmth': [ // สร้าง Personal AI Workflow ของคุณเอง
    { q: 'Personal AI Workflow คืออะไร?', a: 'ซอฟต์แวร์ที่บริษัทซื้อให้', b: 'ระบบการทำงานส่วนตัวที่ผสาน AI Tools เข้ากับงานประจำวัน', c: 'แอปโซเชียลมีเดีย', d: 'การเรียน AI Course', correct: 'B', exp: 'Personal AI Workflow คือการออกแบบกระบวนการทำงานของตัวเองที่ผสาน AI Tools ต่างๆ ให้ทำงานร่วมกันอย่างมีประสิทธิภาพ' },
    { q: 'ขั้นตอนแรกในการสร้าง Personal AI Workflow คืออะไร?', a: 'ซื้อ AI Tool ทุกตัว', b: 'ระบุงานที่ทำซ้ำหรือใช้เวลามาก แล้วหา AI Tool ที่แก้ได้', c: 'เรียน Programming', d: 'จ้าง Consultant', correct: 'B', exp: 'เริ่มจาก Pain Point: งานอะไรที่น่าเบื่อ ซ้ำๆ หรือใช้เวลามาก? แล้วค่อยหา AI Tool ที่เหมาะสมแก้ไขทีละงาน' },
  ],

  // ── AIPRO ────────────────────────────────────────────────────────────
  'cmmo63eds000rw6ufb5r734lb': [ // เริ่มต้นใช้งาน ChatGPT อย่างมืออาชีพ
    { q: 'ChatGPT ทำงานอย่างไร?', a: 'ค้นหาข้อมูลจากอินเทอร์เน็ตแบบ Real-time', b: 'ใช้ LLM ที่เทรนมาแล้วสร้างคำตอบจาก Pattern ในข้อมูล', c: 'เชื่อมต่อกับผู้เชี่ยวชาญมนุษย์', d: 'คัดลอกคำตอบจาก Wikipedia', correct: 'B', exp: 'ChatGPT ใช้ GPT Model ที่ถูก Pre-train ด้วยข้อมูลขนาดใหญ่ จากนั้น Fine-tune ด้วย RLHF เพื่อสร้างคำตอบที่เหมาะสม' },
    { q: 'System Prompt ใน ChatGPT คืออะไร?', a: 'โค้ดลับสำหรับ Hack ChatGPT', b: 'คำสั่งที่กำหนดบทบาทและกฎเกณฑ์ให้ AI ก่อนการสนทนา', c: 'ปุ่มเริ่มต้นการสนทนา', d: 'การตั้งค่าภาษา', correct: 'B', exp: 'System Prompt ช่วยกำหนด Persona, ขอบเขต และรูปแบบตอบของ AI ล่วงหน้า ทำให้ได้ผลลัพธ์ที่สอดคล้องกว่า' },
  ],
  'cmmo63eds000tw6ufwzhwuk73': [ // Microsoft Copilot สำหรับงานออฟฟิศ
    { q: 'Microsoft Copilot รวมอยู่ใน App ใดบ้าง?', a: 'เฉพาะ Word', b: 'Word, Excel, PowerPoint, Outlook, Teams', c: 'เฉพาะ Outlook', d: 'เฉพาะ Teams', correct: 'B', exp: 'Copilot for Microsoft 365 ฝังอยู่ใน Word (ร่างเนื้อหา), Excel (วิเคราะห์ข้อมูล), PowerPoint (สร้างสไลด์), Outlook (สรุปอีเมล) และ Teams' },
    { q: 'Copilot ใน Excel ช่วยทำอะไร?', a: 'พิมพ์ข้อมูลแทนเรา', b: 'วิเคราะห์ข้อมูล สร้าง Formula และแนะนำ Visualization', c: 'ส่งไฟล์ทางอีเมล', d: 'สร้างเอกสาร Word', correct: 'B', exp: 'Copilot ใน Excel สามารถวิเคราะห์ Trend, สร้าง Formula ซับซ้อน, ไฮไลต์ Insight สำคัญ และแนะนำ Chart Type ที่เหมาะสม' },
  ],
  'cmmo63edt000vw6ufyk58fuul': [ // Notion AI และเครื่องมือจัดการงาน
    { q: 'Notion AI ช่วยในการทำงานอย่างไร?', a: 'จัดตารางนัดหมาย', b: 'สรุปเนื้อหา, ร่างเอกสาร, แปลภาษา ภายใน Notion Workspace', c: 'ส่งอีเมลอัตโนมัติ', d: 'สร้างเว็บไซต์', correct: 'B', exp: 'Notion AI ฝังอยู่ใน Workspace ช่วย: สรุป Meeting Notes, ร่าง Task Description, แปลเนื้อหา, ตอบคำถามจาก Database โดยไม่ต้องออกจากหน้า' },
    { q: 'ประโยชน์ของการใช้ AI ใน Project Management คืออะไร?', a: 'แทนที่ Project Manager', b: 'ช่วย Prioritize งาน, ทำนาย Risk, และสรุป Progress', c: 'จัดการ Budget โดยอัตโนมัติ', d: 'สร้าง Team ให้', correct: 'B', exp: 'AI ใน Project Management ช่วย: เรียง Priority ของ Task, ทำนาย Bottleneck, สรุป Status Updates และแนะนำ Resource Allocation' },
  ],
  'cmmo63edt000xw6uf4c6guqf1': [ // AI สร้างงานนำเสนอด้วย Gamma & Canva AI
    { q: 'Gamma.app แตกต่างจาก PowerPoint อย่างไร?', a: 'ใช้ได้เฉพาะ Mac', b: 'สร้าง Presentation ด้วย AI จาก Prompt และ Responsive ใน Browser', c: 'ไม่มีการออกแบบ', d: 'เหมือนกันทุกอย่าง', correct: 'B', exp: 'Gamma สร้าง Presentation สวยงามจาก Prompt ใน 30 วินาที Responsive ดูได้ทุก Device และ Update ได้ง่าย ต่างจาก Static Slides' },
    { q: 'Canva AI Magic Write ช่วยอะไร?', a: 'สร้างรูปภาพเท่านั้น', b: 'สร้างข้อความและเนื้อหาสำหรับ Design โดยอัตโนมัติ', c: 'ตัดต่อวิดีโอ', d: 'จัดการไฟล์', correct: 'B', exp: 'Canva Magic Write ใช้ AI สร้าง Copy สำหรับ Presentation, Social Media, และ Document โดยแค่ใส่ Topic หรือ Outline' },
  ],
  'cmmo63edu000zw6uf5kta373q': [ // สร้างระบบทำงานอัตโนมัติส่วนตัวด้วย AI
    { q: 'Zapier แตกต่างจาก Make.com อย่างไร?', a: 'Zapier ใช้ไม่ได้', b: 'Zapier ใช้งานง่ายกว่า, Make.com มี Logic ซับซ้อนกว่าและราคาดีกว่า', c: 'เหมือนกันทุกอย่าง', d: 'Make.com ใช้ได้เฉพาะในไทย', correct: 'B', exp: 'Zapier เหมาะสำหรับ Automation ง่ายๆ ใช้งานง่าย แต่ราคาสูงกว่า Make.com ที่มี Logic ซับซ้อน, Loop และ Data Transformation ได้ดีกว่า' },
    { q: 'Webhook คืออะไรในระบบ Automation?', a: 'อุปกรณ์ Network', b: 'URL ที่รับ HTTP Request เพื่อ Trigger Workflow อัตโนมัติ', c: 'ไฟล์ Configuration', d: 'ระบบ Login', correct: 'B', exp: 'Webhook คือ Endpoint URL ที่แอปอื่นส่ง HTTP POST มาเพื่อ Trigger Automation เช่น เมื่อมี Form Submit, Payment สำเร็จ หรือ Event ใดๆ' },
  ],

  // ── AIPMT ────────────────────────────────────────────────────────────
  'cmmo63eet002uw6uftdsz4f5k': [ // พื้นฐาน Prompt Engineering
    { q: 'องค์ประกอบหลักของ Prompt ที่ดีมีอะไรบ้าง?', a: 'ความยาว, สี, และฟอนต์', b: 'Context, Instruction, Input Data, Output Format', c: 'เฉพาะคำถามสั้นๆ', d: 'ภาษาอังกฤษเท่านั้น', correct: 'B', exp: 'Prompt ที่ดีควรมี: Context (บริบท), Instruction (คำสั่งชัดเจน), Input Data (ข้อมูลที่เกี่ยวข้อง) และ Output Format (รูปแบบที่ต้องการ)' },
    { q: 'Zero-shot Prompting คืออะไร?', a: 'Prompt ที่ใช้ภาพ', b: 'การสั่ง AI โดยไม่มีตัวอย่างประกอบ', c: 'Prompt ที่ยาวมาก', d: 'การใช้ Prompt ซ้ำ 0 ครั้ง', correct: 'B', exp: 'Zero-shot Prompting คือการให้คำสั่ง AI โดยตรง โดยไม่ให้ตัวอย่าง (Examples) ประกอบ เหมาะสำหรับงานที่ตรงไปตรงมา' },
  ],
  'cmmo63eeu002ww6ufjtvrq083': [ // เทคนิค Prompt สำหรับงานเขียนธุรกิจ
    { q: 'Tone ใน Business Writing หมายถึงอะไร?', a: 'ขนาดตัวอักษร', b: 'ลักษณะน้ำเสียงและสไตล์การเขียน เช่น formal, friendly, persuasive', c: 'สีของข้อความ', d: 'ความยาวของเอกสาร', correct: 'B', exp: 'Tone ในการเขียนธุรกิจสำคัญมาก เช่น Executive Report ต้องการ Tone Formal, Email ลูกค้าต้องการ Friendly แต่ Professional' },
    { q: 'วิธีบอก AI ให้เขียน Email อย่างมืออาชีพควรระบุอะไร?', a: 'แค่บอกว่า "เขียน Email"', b: 'ระบุ: ผู้รับ, วัตถุประสงค์, Tone, ความยาว, CTA ที่ต้องการ', c: 'ให้ AI เดาเอง', d: 'ใช้ Template เก่าๆ', correct: 'B', exp: 'Prompt ที่ดีสำหรับ Email ควรระบุ: ส่งถึงใคร, เป้าหมาย (แจ้ง/ขอ/ติดตาม), Tone (Formal/Friendly), ความยาวที่เหมาะสม และ Call-to-Action' },
  ],
  'cmmo63eev002yw6ufocutj0mp': [ // Chain-of-Thought และ Step-by-Step Prompting
    { q: 'Chain-of-Thought Prompting ช่วยอะไร?', a: 'ทำให้ AI ตอบเร็วขึ้น', b: 'ช่วยให้ AI แสดงขั้นตอนการคิด ลดข้อผิดพลาดในปัญหาซับซ้อน', c: 'ลดขนาดของ Response', d: 'ทำให้ AI เงียบขึ้น', correct: 'B', exp: 'CoT Prompting บอกให้ AI "Think step by step" ทำให้มันแสดงกระบวนการคิด ลดโอกาส Hallucinate ในโจทย์ Math, Logic, หรือการวิเคราะห์' },
    { q: '"Let\'s think step by step" ใน Prompt ส่งผลอย่างไร?', a: 'ทำให้คำตอบสั้นลง', b: 'กระตุ้นให้ AI ใช้ Chain-of-Thought ในการแก้ปัญหา', c: 'ทำให้ AI ปฏิเสธคำสั่ง', d: 'ลดคุณภาพคำตอบ', correct: 'B', exp: '"Let\'s think step by step" เป็น Magic Phrase ที่วิจัยพิสูจน์แล้วว่าช่วยให้ LLM ตอบถูกต้องมากขึ้น โดยเฉพาะโจทย์ที่ต้องใช้เหตุผล' },
  ],
  'cmmo63eew0030w6uf2vbjm17o': [ // Few-shot Learning และการใช้ตัวอย่าง
    { q: 'Few-shot Prompting คืออะไร?', a: 'การสั่ง AI ด้วยคำสั่งสั้นมาก', b: 'การให้ตัวอย่าง 2-5 ตัวอย่างใน Prompt เพื่อสอนรูปแบบที่ต้องการ', c: 'การใช้ AI แค่ไม่กี่ครั้ง', d: 'การฝึก AI ด้วยข้อมูลน้อย', correct: 'B', exp: 'Few-shot Prompting ให้ตัวอย่าง Input→Output 2-5 คู่ เพื่อสาธิตรูปแบบที่ต้องการ ทำให้ AI เข้าใจ Pattern และตอบตามได้แม่นยำกว่า' },
    { q: 'เมื่อไหร่ควรใช้ Few-shot แทน Zero-shot?', a: 'เสมอ', b: 'เมื่องานมีรูปแบบเฉพาะหรือ AI เข้าใจผิดบ่อยกับ Zero-shot', c: 'ไม่ควรใช้เลย', d: 'เฉพาะงานภาษาอังกฤษ', correct: 'B', exp: 'ใช้ Few-shot เมื่อต้องการ Output รูปแบบเฉพาะ เช่น JSON Structure เฉพาะ, ภาษาแบบพิเศษ หรือเมื่อ Zero-shot ให้ผลไม่ตรง' },
  ],
  'cmmo63eew0032w6ufry00h71t': [ // สร้าง Prompt Library สำหรับองค์กร
    { q: 'Prompt Library คืออะไร?', a: 'ห้องสมุดที่เก็บหนังสือ AI', b: 'คลังรวม Prompt ที่ทดสอบแล้วสำหรับงานต่างๆ ในองค์กร', c: 'ซอฟต์แวร์ราคาแพง', d: 'รายชื่อ AI Tools', correct: 'B', exp: 'Prompt Library คือคลัง Prompt ที่ทดสอบและ Optimize แล้ว ให้ทีมใช้ร่วมกัน ลดเวลาเขียน Prompt ซ้ำ และมาตรฐาน Output สม่ำเสมอ' },
    { q: 'ประโยชน์ของ Prompt Library ในองค์กรคืออะไร?', a: 'ลดจำนวนพนักงาน', b: 'ลด Learning Curve, มาตรฐานเดียวกัน, แชร์ Best Practice', c: 'ทำให้ AI ฟรี', d: 'แทนที่ Training ทั้งหมด', correct: 'B', exp: 'Prompt Library ช่วยให้ทีมใช้ AI ได้ดีขึ้นเร็วขึ้น ลด Trial & Error, สร้าง Output สม่ำเสมอ และเก็บ Institutional Knowledge เกี่ยวกับการใช้ AI' },
  ],

  // ── AIPRES ───────────────────────────────────────────────────────────
  'cmmo63ef4003jw6uf7u9ectfs': [ // วางโครงสร้างงานนำเสนอด้วย AI
    { q: 'AI ช่วยวางโครงสร้าง Presentation อย่างไร?', a: 'สร้างสไลด์ทั้งหมดอัตโนมัติ', b: 'วิเคราะห์เนื้อหา เสนอ Outline และจัดลำดับข้อมูล', c: 'ออกแบบ Theme สี', d: 'นำเสนอแทนเรา', correct: 'B', exp: 'AI ช่วย Generate Outline จาก Topic, จัดลำดับข้อมูลตาม Storytelling Framework เช่น Problem-Solution หรือ STAR Method' },
    { q: 'หลัก Presentation Storytelling ที่ดีควรมีอะไร?', a: 'Bullet Point ให้มากที่สุด', b: 'Hook, Problem, Solution, Evidence, Call-to-Action', c: 'Text เยอะที่สุดในแต่ละสไลด์', d: 'ใช้สีหลายสีมากที่สุด', correct: 'B', exp: 'Presentation ที่ดีมีโครงสร้าง: Hook (ดึงความสนใจ), Problem (ปัญหา), Solution (วิธีแก้), Evidence (หลักฐาน), CTA (สิ่งที่ต้องการให้ทำ)' },
  ],
  'cmmo63ef5003lw6uf97myt494': [ // สร้างสไลด์ด้วย Gamma, Canva AI และ SlidesGo
    { q: 'ข้อดีของ Gamma.app เมื่อเทียบกับ PowerPoint คืออะไร?', a: 'มีฟีเจอร์มากกว่า', b: 'สร้าง Presentation ได้เร็วกว่ามาก, Responsive, และ Shareable ทาง Link', c: 'ใช้งานยากกว่า', d: 'Offline ได้', correct: 'B', exp: 'Gamma สร้าง Presentation จาก Prompt ใน 30 วินาที Share ทาง URL ได้ ดูได้ทุก Device โดยไม่ต้องส่งไฟล์' },
    { q: 'SlidesGo คืออะไร?', a: 'ซอฟต์แวร์ Presentation แบบ Offline', b: 'แพลตฟอร์ม Template Presentation ฟรี พร้อม AI Features', c: 'เครื่องมือ Video Editing', d: 'Platform โซเชียลมีเดีย', correct: 'B', exp: 'SlidesGo ให้ Template Presentation คุณภาพสูงฟรี พร้อมฟีเจอร์ AI ที่ช่วย Generate Presentation จาก Topic' },
  ],
  'cmmo63ef5003nw6uffyzuskk4': [ // ออกแบบ Infographic และ Visual ด้วย AI
    { q: 'AI Image Generator เช่น DALL-E, Midjourney ใช้เทคโนโลยีใด?', a: 'Copy-paste รูปจากอินเทอร์เน็ต', b: 'Diffusion Model ที่เรียนรู้การสร้างภาพจากข้อความ', c: 'ถ่ายรูปอัตโนมัติ', d: 'สแกนหนังสือ', correct: 'B', exp: 'AI Image Generators ใช้ Diffusion Model ที่เทรนด้วยภาพหลายพันล้านภาพ เรียนรู้ความสัมพันธ์ระหว่าง Text และ Image' },
    { q: 'Infographic ที่ดีควรมีองค์ประกอบอะไร?', a: 'ข้อมูลมากที่สุดเท่าที่ใส่ได้', b: 'Clear Message, Visual Hierarchy, Data Visualization, และ Brand Consistency', c: 'ใช้สีให้หลากหลาย', d: 'ข้อความน้อยที่สุด', correct: 'B', exp: 'Infographic ที่ดี: มี Message ชัดเจน, จัดลำดับความสำคัญ (Hierarchy), ใช้ Chart/Icon แทนตัวเลข และสอดคล้องกับ Brand' },
  ],
  'cmmo63ef6003pw6ufew51rykz': [ // AI สำหรับการสื่อสารทางธุรกิจ
    { q: 'AI ช่วย Business Communication อย่างไร?', a: 'แทนที่การสื่อสารระหว่างคน', b: 'ร่าง Email, ปรับ Tone, แปลภาษา, สรุป Meeting', c: 'จัดตาราง Meeting', d: 'ส่ง Notification', correct: 'B', exp: 'AI ช่วยร่าง Email/Report, ปรับ Tone ให้เหมาะสม, แปลข้อความ, สรุป Meeting Notes และตอบกลับ FAQ อัตโนมัติ' },
    { q: 'เมื่อใช้ AI เขียน Email ให้ลูกค้า ควรทำอะไรก่อนส่ง?', a: 'ส่งทันทีโดยไม่ต้องตรวจ', b: 'ตรวจสอบข้อมูล ปรับ Tone และเพิ่มความเป็นส่วนตัว', c: 'ให้ AI ส่งอัตโนมัติ', d: 'แปลเป็นภาษาอื่นก่อน', correct: 'B', exp: 'ต้องตรวจ: ข้อมูลถูกต้อง, Tone เหมาะสมกับความสัมพันธ์, เพิ่มรายละเอียดเฉพาะลูกค้าและ Signature ก่อนส่งเสมอ' },
  ],
  'cmmo63ef7003rw6ufzarys85s': [ // เทคนิคการนำเสนอและ AI Voice
    { q: 'AI Voice Tools ใช้ทำอะไรในงาน Presentation?', a: 'ฝึกซ้อมการพูด', b: 'สร้าง Voiceover, แปลงข้อความเป็นเสียง, ตัดต่อเสียง', c: 'บันทึกเสียงคนอื่น', d: 'สร้างเพลงพื้นหลัง', correct: 'B', exp: 'AI Voice เช่น ElevenLabs, Murf.ai ช่วยสร้าง Professional Voiceover ทาง Text-to-Speech สำหรับ Presentation, E-learning หรือ Video' },
    { q: 'เทคนิค "Rule of Three" ในการนำเสนอคืออะไร?', a: 'นำเสนอ 3 ครั้ง', b: 'สรุปประเด็นสำคัญเป็น 3 จุดหลักเพื่อให้จดจำได้ง่าย', c: 'พักทุก 3 สไลด์', d: 'ใช้ 3 สีเท่านั้น', correct: 'B', exp: '"Rule of Three" คือหลักการว่าสมองมนุษย์จำข้อมูลกลุ่ม 3 ได้ดี ควรสรุป Key Messages เป็น 3 จุดหลักเสมอ' },
  ],

  // ── AIMGR ────────────────────────────────────────────────────────────
  'cmmo63efh0048w6ufak8n68x2': [ // AI สำหรับการวางแผนกลยุทธ์และตัดสินใจ
    { q: 'AI ช่วยการตัดสินใจเชิงกลยุทธ์อย่างไร?', a: 'ตัดสินใจแทนผู้บริหาร', b: 'วิเคราะห์ข้อมูล เสนอ Scenario และประเมิน Risk', c: 'ลงนามสัญญา', d: 'จัดการประชุม Board', correct: 'B', exp: 'AI ช่วยผู้บริหาร: วิเคราะห์ข้อมูลตลาด, เปรียบเทียบ Scenario, ประเมิน Risk/Reward และ Simulate ผลลัพธ์ก่อนตัดสินใจ' },
    { q: 'SWOT Analysis ด้วย AI แตกต่างจากแบบดั้งเดิมอย่างไร?', a: 'ไม่แตกต่างกัน', b: 'AI วิเคราะห์ข้อมูลจำนวนมากได้เร็วกว่า และเสนอ Insight ที่มองข้ามได้', c: 'AI ทำได้เพียง Strengths', d: 'ใช้แทน Strategy Meeting ทั้งหมด', correct: 'B', exp: 'AI SWOT วิเคราะห์ Market Data, Competitor Reviews, Trend และ Internal Data พร้อมกันเพื่อเสนอ Insight ที่คนอาจมองข้าม' },
  ],
  'cmmo63efh004aw6uf272rpb4p': [ // การบริหารโปรเจกต์ด้วย AI
    { q: 'AI Project Management Tools ช่วยอะไร?', a: 'เขียน Code ให้', b: 'Auto-schedule, Risk Prediction, Resource Optimization', c: 'จ่ายเงินพนักงาน', d: 'สร้างทีมใหม่', correct: 'B', exp: 'AI PM Tools เช่น ClickUp AI, Notion AI ช่วย: สร้าง Task List อัตโนมัติ, ทำนาย Risk, แนะนำ Resource Allocation และ Generate Status Report' },
    { q: 'Critical Path Method (CPM) ด้วย AI คืออะไร?', a: 'การวิ่งรายงานเร่งด่วน', b: 'AI วิเคราะห์ลำดับงานที่ขั้นตอนใดล่าช้าจะกระทบ Deadline มากที่สุด', c: 'การจ้างงาน Emergency', d: 'เส้นทางไปสำนักงาน', correct: 'B', exp: 'CPM ระบุเส้นทางงานที่ยาวที่สุด AI ช่วย Visualize และแจ้งเตือนล่วงหน้าเมื่องานใน Critical Path เริ่มล่าช้า' },
  ],
  'cmmo63efi004cw6ufhfyfr7q3': [ // AI สำหรับการบริหารทีมและ Performance
    { q: 'AI ช่วย Performance Management อย่างไร?', a: 'ตัดสินให้คะแนนพนักงานเอง', b: 'วิเคราะห์ Data, ชี้ Gap, แนะนำ Development Plan', c: 'ไล่พนักงานออก', d: 'กำหนด KPI เพียงอย่างเดียว', correct: 'B', exp: 'AI ใน Performance Management: วิเคราะห์ Output Data, ระบุจุดแข็ง/จุดอ่อน, แนะนำ Training และ Career Path แบบ Personalized' },
    { q: 'OKR Framework เหมาะกับ AI Tools อย่างไร?', a: 'AI ไม่รองรับ OKR', b: 'AI ช่วย Track Progress, แจ้งเตือนเมื่อ KR เสี่ยงไม่ถึงเป้า', c: 'ใช้แทน OKR ได้เลย', d: 'OKR ต้องทำเอง', correct: 'B', exp: 'AI Integration กับ OKR: Auto-update KR Progress จากข้อมูลระบบต่างๆ, แจ้งเตือนล่วงหน้า และสรุปผล Quarter Review อัตโนมัติ' },
  ],
  'cmmo63efi004ew6uf15n1lzz4': [ // Dashboard และ Reporting ด้วย AI
    { q: 'AI ช่วย Business Dashboard อย่างไร?', a: 'ออกแบบหน้าตา Dashboard', b: 'วิเคราะห์ข้อมูล, สรุป Insight, ทำนาย Trend', c: 'ส่ง Report ทางอีเมล', d: 'สร้างฐานข้อมูล', correct: 'B', exp: 'AI Dashboard เช่น Power BI Copilot ช่วย: ถามคำถามเป็นภาษาธรรมดา, รับ Chart ตอบ, สรุป Anomaly และ Forecast Trend อัตโนมัติ' },
    { q: 'Natural Language Query ใน BI Tools คืออะไร?', a: 'การค้นหาด้วยเสียง', b: 'การถามคำถามข้อมูลเป็นภาษาธรรมดาแทนการเขียน SQL', c: 'การแปลรายงาน', d: 'การ Import ข้อมูล', correct: 'B', exp: 'NLQ ให้คุณถาม BI ว่า "ยอดขายเดือนนี้เทียบเดือนที่แล้วเป็นอย่างไร?" แล้วได้ Chart ตอบ โดยไม่ต้องเขียน SQL' },
  ],
  'cmmo63efj004gw6ufkl0dugsy': [ // ภาวะผู้นำในยุค AI
    { q: 'ผู้นำในยุค AI ควรมีทักษะอะไร?', a: 'เขียนโปรแกรม AI เองได้', b: 'AI Literacy, Critical Thinking, Human Skills, และ Change Management', c: 'เป็นวิศวกร Data Science', d: 'ใช้ AI ทุกอย่างได้', correct: 'B', exp: 'ผู้นำ AI Era ต้องการ: เข้าใจ AI ว่าทำอะไรได้/ไม่ได้ (AI Literacy), ตั้งคำถามถูก, รักษา Human Touch และนำ Change ได้' },
    { q: '"Augmented Intelligence" คืออะไร?', a: 'AI ที่ฉลาดขึ้นเรื่อยๆ', b: 'การผสาน AI เสริมพลังมนุษย์ ไม่ใช่แทนที่', c: 'Virtual Reality', d: 'AI แบบ Offline', correct: 'B', exp: 'Augmented Intelligence คือ Vision ที่ AI และมนุษย์ทำงานร่วมกัน AI ทำงาน Routine/Data ส่วนมนุษย์ทำ Creative/Strategic/Empathy' },
  ],

  // ── AIDATA ───────────────────────────────────────────────────────────
  'cmmo63efp004xw6ufg4leb01c': [ // พื้นฐาน Data Literacy สำหรับคนทำธุรกิจ
    { q: 'Data Literacy คืออะไร?', a: 'ความสามารถเขียน SQL', b: 'ความสามารถอ่าน ตีความ และสื่อสารข้อมูลได้อย่างถูกต้อง', c: 'การใช้ Excel ขั้นสูง', d: 'การเรียน Data Science', correct: 'B', exp: 'Data Literacy คือทักษะพื้นฐานในยุค Data-driven ที่ทุกคนในองค์กรควรมี: อ่าน Chart ได้, ตีความถูก, ตั้งคำถามจากข้อมูล' },
    { q: 'Correlation ≠ Causation หมายความว่าอะไร?', a: 'ข้อมูลทุกตัวเกี่ยวข้องกัน', b: 'ความสัมพันธ์ของข้อมูลไม่ได้หมายความว่าสิ่งหนึ่งเป็นสาเหตุของอีกสิ่ง', c: 'ข้อมูลผิดพลาด', d: 'ไม่มีความหมาย', correct: 'B', exp: 'ตัวอย่าง: ยอดขายไอศครีมและเหตุจมน้ำสูงพร้อมกัน ไม่ได้แปลว่าไอศครีมทำให้จมน้ำ แต่ทั้งคู่สูงในฤดูร้อน (สาเหตุคือ อากาศร้อน)' },
  ],
  'cmmo63efq004zw6uf7bl5ubq9': [ // วิเคราะห์ข้อมูล Excel ด้วย ChatGPT
    { q: 'ChatGPT ช่วย Excel อย่างไร?', a: 'แทนที่ Excel ทั้งหมด', b: 'สร้าง Formula, แก้ Error, อธิบาย Function, สร้าง Macro', c: 'Format ตาราง', d: 'Print Excel', correct: 'B', exp: 'ถาม ChatGPT: "เขียน VLOOKUP สำหรับ..." หรือ "ทำไม #VALUE! Error ถึงขึ้น?" หรือ "เขียน VBA Macro สำหรับ..." ได้เลย' },
    { q: 'ฟีเจอร์ "Analyze Data" ใน Excel ทำงานอย่างไร?', a: 'ตรวจสอบไวรัส', b: 'AI วิเคราะห์ข้อมูลและเสนอ Insight, Chart, PivotTable อัตโนมัติ', c: 'Backup ไฟล์', d: 'แปลงเป็น PDF', correct: 'B', exp: 'Analyze Data (Ideas) ใน Excel ใช้ AI สแกนข้อมูลและเสนอ: Trend ที่น่าสนใจ, คำถามที่ควรถาม และ Chart ที่เหมาะสม' },
  ],
  'cmmo63efq0051w6ufffpdl81b': [ // สร้าง Dashboard และ Visualization ด้วย AI
    { q: 'เครื่องมือ BI Dashboard ที่มี AI Features ได้แก่?', a: 'Photoshop, Illustrator', b: 'Power BI, Tableau, Looker Studio', c: 'Word, Excel เท่านั้น', d: 'Canva, Figma', correct: 'B', exp: 'Power BI มี Copilot, Tableau มี Einstein AI, Looker Studio มี Gemini AI ทำให้ถาม-ตอบข้อมูลได้เป็นภาษาธรรมดา' },
    { q: 'Dashboard ที่ดีควรมีหลัก "5-Second Rule" คืออะไร?', a: 'โหลดใน 5 วินาที', b: 'ผู้ดู Dashboard ต้องเข้าใจ Key Message หลักใน 5 วินาที', c: 'Update ทุก 5 วินาที', d: 'มีข้อมูลไม่เกิน 5 ตัว', correct: 'B', exp: '5-Second Rule: จัด Layout และ Highlight ให้ผู้ดูเห็นประเด็นสำคัญทันที ไม่ต้องค้นหา ใช้ Color, Size, และ Position ให้ถูกต้อง' },
  ],
  'cmmo63efq0053w6ufroynhwq8': [ // Predictive Analytics สำหรับธุรกิจ
    { q: 'Predictive Analytics คืออะไร?', a: 'การดูข้อมูลอดีต', b: 'การใช้ Statistical Model และ ML ทำนายเหตุการณ์ในอนาคต', c: 'การสร้าง Dashboard', d: 'การ Backup ข้อมูล', correct: 'B', exp: 'Predictive Analytics ใช้ Historical Data สร้าง Model ทำนาย: ยอดขายเดือนหน้า, ลูกค้าที่จะ Churn, สินค้าที่จะขายดี' },
    { q: 'Machine Learning Model ที่ใช้บ่อยใน Business Prediction คืออะไร?', a: 'Word Processor', b: 'Regression, Decision Tree, Random Forest', c: 'Spreadsheet Formula', d: 'Search Algorithm', correct: 'B', exp: 'Linear/Logistic Regression (ทำนายตัวเลข/หมวด), Decision Tree (ตัดสินใจ), Random Forest (แม่นยำสูง) เป็นโมเดลพื้นฐานที่ Business ใช้บ่อย' },
  ],
  'cmmo63efr0055w6ufnq448q0v': [ // Case Study: Data-driven Decision Making
    { q: 'Data-driven Decision Making คืออะไร?', a: 'ตัดสินใจตามประสบการณ์', b: 'ใช้ข้อมูลและหลักฐานเป็นหลักในการตัดสินใจ ไม่ใช่แค่ Intuition', c: 'ปรึกษาผู้เชี่ยวชาญ', d: 'ลงคะแนนเสียงทีม', correct: 'B', exp: 'DDDM คือการใช้ข้อมูล สถิติ และ Analysis เป็น Primary Input ในการตัดสินใจ ช่วยลด Bias และเพิ่มโอกาสประสบความสำเร็จ' },
    { q: 'A/B Testing ในธุรกิจใช้ทำอะไร?', a: 'ทดสอบซอฟต์แวร์', b: 'เปรียบเทียบ 2 Version เพื่อดูว่าอะไรให้ผลดีกว่า', c: 'ฝึกอบรมพนักงาน', d: 'ตรวจสอบบัญชี', correct: 'B', exp: 'A/B Testing: แสดง Version A ให้กลุ่มหนึ่ง Version B ให้อีกกลุ่ม วัดผล KPI เพื่อตัดสินใจด้วยข้อมูลว่าอะไรดีกว่า' },
  ],

  // ── AIORG ────────────────────────────────────────────────────────────
  'cmmo63efx005mw6ufmq3keouq': [ // แนวคิด Digital Organization และบทบาทของ AI
    { q: 'Digital Organization คืออะไร?', a: 'องค์กรที่ใช้คอมพิวเตอร์', b: 'องค์กรที่ผสาน Digital Technology เข้ากับทุก Process และ Culture', c: 'บริษัท IT', d: 'องค์กรที่ไม่มีสำนักงาน', correct: 'B', exp: 'Digital Organization ไม่ใช่แค่ใช้เทคโนโลยี แต่ฝัง Digital Thinking เข้ากับ Strategy, Process, Culture และ People' },
    { q: 'AI ช่วย Digital Organization อย่างไร?', a: 'ทำให้คนทำงานน้อยลง', b: 'เพิ่ม Agility, ลด Cycle Time, และ Personalize Customer Experience', c: 'ลดขนาดองค์กร', d: 'ลบ Process ทั้งหมด', correct: 'B', exp: 'AI ช่วย Digital Org: เร่งกระบวนการตัดสินใจ, Automate Routine, วิเคราะห์ข้อมูล Real-time และ Personalize ทั้ง Employee/Customer Experience' },
  ],
  'cmmo63efy005ow6ufi9qzpa00': [ // Knowledge Management ด้วย AI
    { q: 'Knowledge Management ด้วย AI แก้ปัญหาอะไร?', a: 'ลดขนาดไฟล์', b: 'หาข้อมูลได้เร็ว ไม่สูญเสียความรู้เมื่อพนักงานลาออก', c: 'จัดการอีเมล', d: 'ออกแบบระบบ IT', correct: 'B', exp: 'AI KM System เช่น Notion AI, Confluence AI ช่วย: ค้นหาข้อมูลด้วยภาษาธรรมดา, สรุป Document, และดึง Knowledge จาก Meeting Notes อัตโนมัติ' },
    { q: 'RAG (Retrieval-Augmented Generation) ใน Knowledge Base คืออะไร?', a: 'วิธีลบข้อมูลเก่า', b: 'AI ค้นหาข้อมูลจาก Knowledge Base ก่อน แล้วสร้างคำตอบที่แม่นยำ', c: 'การ Backup ข้อมูล', d: 'Algorithm จัดเรียงข้อมูล', correct: 'B', exp: 'RAG ทำให้ AI ตอบคำถามจาก Internal Knowledge ขององค์กรได้แม่นยำ โดยค้นหาข้อมูลที่เกี่ยวข้องก่อน แล้วสร้างคำตอบจากข้อมูลนั้น' },
  ],
  'cmmo63efy005qw6ufcx5ywe6d': [ // AI-ready Culture และ Change Management
    { q: 'อุปสรรคหลักในการ Adopt AI ในองค์กรคืออะไร?', a: 'ราคา AI แพงเกินไป', b: 'Fear of Change, ขาด AI Literacy และวัฒนธรรมองค์กรเก่า', c: 'อินเทอร์เน็ตช้า', d: 'AI ไม่เสถียร', correct: 'B', exp: 'ปัญหาหลักคือ People & Culture ไม่ใช่ Technology: กลัวถูก AI แทน, ไม่รู้จะใช้ AI อย่างไร และ Process เดิมต้านการเปลี่ยนแปลง' },
    { q: 'Change Management ในการนำ AI เข้าองค์กรควรเริ่มจากอะไร?', a: 'ติดตั้ง AI ทันที', b: 'สื่อสาร Why, ฝึกอบรม, สร้าง Quick Win และ Champion Network', c: 'บังคับใช้ AI ทุกแผนก', d: 'ปิด System เดิม', correct: 'B', exp: 'Kotter 8-Step: สร้างความเร่งด่วน → Coalition → Vision → Communicate → Empower → Quick Wins → Consolidate → Anchor ใน Culture' },
  ],
  'cmmo63efz005sw6ufg3n2rnoj': [ // AI Governance และกรอบจริยธรรม
    { q: 'AI Governance คืออะไร?', a: 'รัฐบาลควบคุม AI', b: 'กรอบนโยบาย กระบวนการ และมาตรฐานที่กำกับดูแลการใช้ AI ในองค์กร', c: 'ระบบ Login ของ AI', d: 'คณะกรรมการ IT', correct: 'B', exp: 'AI Governance ประกอบด้วย: Policy (นโยบาย), Accountability (ความรับผิดชอบ), Risk Management, Ethics Framework และ Audit Process' },
    { q: 'หลัก Responsible AI ขององค์กรใหญ่ๆ มีอะไรบ้าง?', a: 'Speed, Scale, Profit', b: 'Fairness, Reliability, Privacy, Inclusiveness, Transparency', c: 'Cost, Feature, Speed', d: 'Marketing, Sales, Support', correct: 'B', exp: "Microsoft's RAI Principles: Fairness (ไม่ Bias), Reliability (น่าเชื่อถือ), Privacy (ปกป้องข้อมูล), Inclusiveness (รวมทุกคน), Transparency (โปร่งใส), Accountability" },
  ],
  'cmmo63efz005uw6uf7jsnui6n': [ // วางแผน AI Strategy สำหรับองค์กร
    { q: 'AI Strategy ขององค์กรควรเริ่มจากอะไร?', a: 'เลือก AI Tool ก่อน', b: 'กำหนด Business Problem และ Value ที่ต้องการจาก AI', c: 'จ้าง Data Scientist', d: 'ซื้อ GPU Server', correct: 'B', exp: 'AI Strategy ต้องเริ่มจาก Business: ปัญหาอะไร? Value อะไร? จากนั้นค่อยออกแบบ Data, Technology, และ People Strategy' },
    { q: 'AI Roadmap ขององค์กรควรมีอะไร?', a: 'รายชื่อ AI Tools', b: 'Use Cases จัดตาม Impact/Feasibility, Timeline, Resource, KPI', c: 'งบประมาณเท่านั้น', d: 'แผนจ้างงาน', correct: 'B', exp: 'AI Roadmap: ระบุ Use Case ที่ Impact สูง/Feasibility ง่าย (Quick Win), วาง Timeline, กำหนด Resource ที่ต้องการ และ KPI วัดความสำเร็จ' },
  ],

  // ── AIDX ────────────────────────────────────────────────────────────
  'cmmo63eg6006bw6ufxl4689ih': [ // ภาพรวม Digital Transformation ในยุค AI
    { q: 'Digital Transformation คืออะไร?', a: 'การซื้อคอมพิวเตอร์ใหม่', b: 'การนำ Digital Technology มาปรับเปลี่ยน Business Model, Process และ Culture', c: 'การสร้างเว็บไซต์', d: 'การ Digitize เอกสาร', correct: 'B', exp: 'DX ไม่ใช่แค่ Digitize แต่คือการ Rethink ธุรกิจทั้งหมดด้วย Digital Technology เพื่อสร้างคุณค่าใหม่และ Competitive Advantage' },
    { q: 'AI เร่ง Digital Transformation อย่างไร?', a: 'ทำงานแทนพนักงานทุกคน', b: 'เพิ่ม Speed, Intelligence, และ Scale ให้ Digital Processes', c: 'ลด IT Budget', d: 'ยกเลิก Legacy System', correct: 'B', exp: 'AI เร่ง DX โดย: ทำ Intelligent Automation, Customer Intelligence, Product Innovation และ Operational Excellence ในระดับที่ไม่เคยทำได้มาก่อน' },
  ],
  'cmmo63eg7006dw6ufxg7l6z8o': [ // Business Model Innovation ด้วย AI
    { q: 'AI ช่วย Business Model Innovation อย่างไร?', a: 'ลดราคาสินค้า', b: 'สร้าง New Revenue Stream, Personalize Offering, ลด Cost Structure', c: 'เพิ่มจำนวนสาขา', d: 'ลด Product Line', correct: 'B', exp: 'AI เปิดโอกาส BM Innovation: Subscription + AI Recommendation (Netflix), AI-as-a-Service, Freemium + AI Premium, Platform + AI Matching' },
    { q: 'Platform Business Model ด้วย AI มีตัวอย่างอะไร?', a: 'ร้านค้าออนไลน์ธรรมดา', b: 'Grab/Airbnb ที่ AI ช่วย Match, Price, และ Predict Demand', c: 'ร้านสะดวกซื้อ', d: 'โรงงานผลิต', correct: 'B', exp: 'Platform + AI: Grab ใช้ AI Match คนขับกับผู้โดยสาร, Airbnb ใช้ AI กำหนดราคา Dynamic และ Recommend Listing' },
  ],
  'cmmo63eg7006fw6ufca1yjtd1': [ // AI Operating Model สำหรับองค์กร
    { q: 'AI Operating Model คืออะไร?', a: 'ระบบ OS ของ AI', b: 'โครงสร้างองค์กร Process และ Capability ที่ขับเคลื่อนด้วย AI', c: 'แผนผังองค์กร', d: 'ระบบ ERP', correct: 'B', exp: 'AI Operating Model กำหนด: Governance, Data Strategy, Technology Stack, Talent & Skills และ Process Redesign ที่ทำให้ AI Scale ได้' },
    { q: 'Center of Excellence (CoE) สำหรับ AI คือ?', a: 'ห้องปฏิบัติการ AI', b: 'ทีมกลางที่สร้าง AI Standards, Best Practice และ Support ทั้งองค์กร', c: 'บริษัท Outsource', d: 'แผนก IT ปกติ', correct: 'B', exp: 'AI CoE รวม Data Scientists, ML Engineers, Business Analysts ทำงานร่วมกัน เพื่อสร้าง Reusable AI Assets และ Drive Adoption ทั่วองค์กร' },
  ],
  'cmmo63eg8006hw6uffafkd7a6': [ // การวัด ROI ของ AI และ DX Investment
    { q: 'วิธีวัด ROI ของ AI Project คืออะไร?', a: 'นับจำนวน AI Tools', b: '(มูลค่าที่ได้รับ - ต้นทุน) / ต้นทุน × 100', c: 'วัดความเร็วระบบ', d: 'นับชั่วโมงอบรม', correct: 'B', exp: 'ROI = (Benefits - Costs) / Costs × 100 โดย Benefits รวม: ต้นทุนที่ประหยัด, รายได้เพิ่ม, ความเร็ว, คุณภาพ และลูกค้าที่ดีขึ้น' },
    { q: 'Intangible Benefits ของ AI ที่วัดยากได้แก่อะไร?', a: 'ยอดขาย', b: 'Brand Value, Employee Morale, Customer Trust, Innovation Culture', c: 'ค่าไฟฟ้า', d: 'จำนวนพนักงาน', correct: 'B', exp: 'Intangible ROI: องค์กรที่ใช้ AI ดี มี Culture Innovation สูงขึ้น, พนักงาน Engage มากขึ้น, และ Brand ดูทันสมัย ซึ่งมีมูลค่าจริงแต่วัดยาก' },
  ],
  'cmmo63eg8006jw6ufgil50los': [ // Case Study: DX Success Stories และ AI Roadmap
    { q: 'ปัจจัยความสำเร็จของ DX จาก Case Study ต่างๆ คืออะไร?', a: 'งบประมาณสูง', b: 'Leadership Commitment, Clear Vision, Agile Execution, People Focus', c: 'เทคโนโลยีล่าสุด', d: 'ที่ปรึกษาภายนอก', correct: 'B', exp: 'DX ที่สำเร็จ: CEO Champion + Clear Digital Vision + Agile/Iterative + ลงทุน People (Upskill) + วัดผล KPI ชัดเจน ไม่ใช่แค่ซื้อ Technology' },
    { q: 'AI Roadmap ที่ดีควรทบทวนบ่อยแค่ไหน?', a: 'ทุก 10 ปี', b: 'ทุกไตรมาสหรือทุกครึ่งปี เพราะ AI พัฒนาเร็วมาก', c: 'ทุกวัน', d: 'ไม่ต้องทบทวน', correct: 'B', exp: 'AI Landscape เปลี่ยนเร็วมาก Roadmap ควร Review ทุก Q เพื่อ: เพิ่ม Use Case ใหม่, ปรับ Priority, และรวม AI Tool ที่เพิ่งออกมา' },
  ],
};

async function main() {
  console.log('🌱 Starting in-video quiz seeding...');

  // Add 2 missing lessons to SPUBUS-AIHR-2026 course
  const aihrCourseId = 'cmmoe37y50002w6vmb8duejww';
  console.log('\n📚 Adding lessons 4 & 5 to SPUBUS-AIHR-2026...');

  const lesson4 = await prisma.lesson.upsert({
    where: { id: 'aihr26-lesson-4' },
    update: {},
    create: {
      id: 'aihr26-lesson-4',
      courseId: aihrCourseId,
      title: 'AI Tools for HR Analytics & Decision Making',
      subtitle: 'วิเคราะห์ข้อมูล HR ด้วย AI',
      description: 'เรียนรู้การใช้ AI เพื่อวิเคราะห์ข้อมูล HR วัด Employee Engagement ทำนายการลาออก และสร้าง People Dashboard สำหรับผู้บริหาร',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoTitle: 'AI Tools for HR Analytics',
      videoChannel: 'AI Academy SPU',
      durationText: '45 นาที',
      lessonOrder: 4,
      lessonLevel: 'INTERMEDIATE',
      summary: 'บทเรียนนี้ครอบคลุม People Analytics Tools, การวิเคราะห์ Turnover, Employee Engagement Dashboard และการใช้ AI สร้าง HR Reports',
      learningOutcomes: 'ใช้ People Analytics Tools ได้\nวิเคราะห์ข้อมูล HR เพื่อตัดสินใจเชิงกลยุทธ์\nสร้าง HR Dashboard ด้วย AI',
      keyTakeaways: 'People Analytics ช่วยทำนายการลาออกล่วงหน้า\nAI Dashboard ทำให้ HR Data Actionable\nData-driven HR ลด Bias ในการตัดสินใจ',
      isActive: true,
    },
  });

  const lesson5 = await prisma.lesson.upsert({
    where: { id: 'aihr26-lesson-5' },
    update: {},
    create: {
      id: 'aihr26-lesson-5',
      courseId: aihrCourseId,
      title: 'Future of HR: AI Strategy & Implementation',
      subtitle: 'วางกลยุทธ์ AI ในงาน HR',
      description: 'วางแผนกลยุทธ์การนำ AI มาใช้ในงาน HR อย่างครบวงจร ตั้งแต่การเลือก Tools, Change Management, จนถึงการวัด ROI',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoTitle: 'Future of HR: AI Strategy',
      videoChannel: 'AI Academy SPU',
      durationText: '50 นาที',
      lessonOrder: 5,
      lessonLevel: 'ADVANCED',
      summary: 'บทเรียนสุดท้ายรวม Workshop สร้าง AI-HR Strategy สำหรับองค์กร ครอบคลุม Use Case Selection, Implementation Roadmap และ ROI Measurement',
      learningOutcomes: 'สร้าง AI-HR Strategy ได้\nเลือก HR Tech Tools ที่เหมาะสมกับองค์กร\nวัด ROI ของ AI ใน HR',
      keyTakeaways: 'AI HR Strategy ต้องเริ่มจาก Business Problem\nChange Management คือกุญแจสำคัญ\nเริ่มจาก Quick Win เล็กๆ แล้วขยาย',
      isActive: true,
    },
  });

  console.log(`  ✅ Lesson 4: ${lesson4.title}`);
  console.log(`  ✅ Lesson 5: ${lesson5.title}`);

  // Seed in-video quiz questions for AIHR-2026 lesson 4 & 5
  quizData['aihr26-lesson-4'] = [
    { q: 'People Analytics ทำนายอะไรได้บ้างในงาน HR?', a: 'ราคาหุ้นบริษัท', b: 'การลาออก, ประสิทธิภาพทีม, ความต้องการฝึกอบรม', c: 'ยอดขายสินค้า', d: 'ต้นทุนการผลิต', correct: 'B', exp: 'People Analytics ใช้ ML วิเคราะห์ข้อมูลพนักงาน ทำนาย Turnover Risk, ระบุ High Potential, และคาดการณ์ Training Needs' },
    { q: 'HR Dashboard ที่ดีควรแสดงข้อมูลอะไร?', a: 'เฉพาะเงินเดือน', b: 'Headcount, Turnover, Engagement Score, Time-to-Hire, Training Completion', c: 'แค่จำนวนพนักงาน', d: 'เฉพาะข้อมูลประจำปี', correct: 'B', exp: 'HR Dashboard ที่ดีรวม: Workforce Metrics (Headcount/Turnover), Talent Metrics (Performance/Engagement) และ Operational Metrics (Cost/Time)' },
  ];
  quizData['aihr26-lesson-5'] = [
    { q: 'ขั้นตอนแรกในการวาง AI-HR Strategy คืออะไร?', a: 'ซื้อ HRIS ใหม่', b: 'ระบุ HR Pain Points ที่ AI แก้ได้และวัด Business Impact ได้', c: 'จ้าง Data Scientist', d: 'อบรมพนักงานทุกคน', correct: 'B', exp: 'เริ่มจาก Pain Point: งาน HR อะไรที่ใช้เวลามาก, ผิดพลาดบ่อย หรือมี Data แต่ไม่ได้ใช้ประโยชน์? แล้วหา AI Solution ที่แก้ได้' },
    { q: 'วิธีวัด ROI ของ AI ใน HR Recruitment คืออะไร?', a: 'นับจำนวนสมัครงาน', b: 'Time-to-Hire ลดลง, Quality of Hire สูงขึ้น, ค่าใช้จ่ายสรรหาลดลง', c: 'นับชั่วโมง HR', d: 'ดูความพึงพอใจ HR', correct: 'B', exp: 'ROI ใน AI Recruitment: เวลาคัดกรองลด X%, คุณภาพผู้สมัครสูงขึ้น (90-day Retention), ค่า Recruiting ต่อคนลดลง X บาท' },
  ];

  // Seed in-video quizzes for all lessons
  let total = 0;
  for (const [lessonId, questions] of Object.entries(quizData)) {
    // Check lesson exists
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      console.log(`  ⚠️  Lesson ${lessonId} not found, skipping...`);
      continue;
    }

    // Delete existing
    await prisma.inVideoQuizQuestion.deleteMany({ where: { lessonId } });

    // Create new
    const triggerPercents = [30, 65];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await prisma.inVideoQuizQuestion.create({
        data: {
          lessonId,
          question: q.q,
          optionA: q.a,
          optionB: q.b,
          optionC: q.c,
          optionD: q.d,
          correctAnswer: q.correct,
          explanation: q.exp,
          triggerPercent: triggerPercents[i] ?? 50,
          sortOrder: i,
        },
      });
      total++;
    }
    console.log(`  🎯 ${lessonId}: ${questions.length} questions`);
  }

  // Update SPUBUS-AIHR-2026 duration
  await prisma.course.update({
    where: { id: aihrCourseId },
    data: { duration: '5 ชั่วโมง' },
  });

  console.log(`\n✨ Done! Created ${total} in-video quiz questions across ${Object.keys(quizData).length} lessons`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
