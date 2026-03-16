import React, { useState } from 'react';
import {
  HeartPulse, Home, Dog, ShieldAlert, ChevronRight, Star,
  MapPin, Clock, Camera, CheckCircle2, User,
  BellRing, PhoneCall, AlertTriangle, GraduationCap,
  Award, Stethoscope, FileBadge, Video, Coffee, Loader2
} from 'lucide-react';

// --- Shared Components (Clarified) ---
function TierCard({ title, desc, icon, active, onClick, price }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-start gap-3 ${active
          ? 'border-teal-600 bg-teal-50 shadow-md'
          : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-sm'
        }`}
    >
      <div className="flex justify-between items-center w-full">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
          }`}>
          {icon}
        </div>
        <span className={`text-sm font-bold px-2 py-1 rounded-lg ${active ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
          }`}>{price}</span>
      </div>
      <div>
        <h3 className={`text-base font-bold ${active ? 'text-teal-900' : 'text-slate-800'}`}>{title}</h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function SosOverlay({ source, onDismiss }) {
  return (
    <div className="absolute inset-0 z-50 bg-red-600 flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-300">
      <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse text-red-600">
        <AlertTriangle className="w-16 h-16" />
      </div>
      <h2 className="text-4xl font-black mb-4 tracking-wide text-center">SOS<br />ฉุกเฉิน!</h2>
      <p className="text-center text-red-50 mb-8 text-xl leading-relaxed">
        {source === 'client' ? 'ญาติได้ขอความช่วยเหลือด่วน' : 'ผู้ดูแลได้ขอความช่วยเหลือด่วน'}
        <br /><span className="text-base mt-4 block opacity-90">ระบบกำลังส่งพิกัดให้รถพยาบาล 1669</span>
      </p>
      <div className="w-full max-w-xs space-y-4">
        <button className="w-full bg-white text-red-700 font-bold text-lg py-4 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition">
          <PhoneCall className="w-6 h-6 mr-3" /> โทร 1669 ทันที
        </button>
        <button onClick={onDismiss} className="w-full bg-red-800 text-white font-medium py-4 rounded-2xl text-lg active:bg-red-900 transition">
          ยกเลิกการแจ้งเตือน
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // States: idle -> requesting -> accepted -> active -> checkout
  const [status, setStatus] = useState('idle');
  const [tier, setTier] = useState('cert');
  const [isTrial, setIsTrial] = useState(true);
  const [addons, setAddons] = useState({ cleaning: false });
  const [logs, setLogs] = useState([]);
  const [sosActive, setSosActive] = useState(null);

  const calculatePrice = () => {
    let base = 0;
    if (tier === 'student') base = 500;
    if (tier === 'cert') base = 800;
    if (tier === 'pro') base = 1200;
    if (tier === 'rn') base = 2000;
    if (addons.cleaning) base += 300;
    return base;
  };

  const caregiverProfiles = {
    student: { name: "น้องบีม (นักศึกษา)", role: "เพื่อนคุย/ดูแลเบื้องต้น", icon: <GraduationCap className="w-6 h-6" /> },
    cert: { name: "คุณอารี (NA/PN)", role: "ดูแลกิจวัตรประจำวัน", icon: <FileBadge className="w-6 h-6" /> },
    pro: { name: "คุณสมปอง (มืออาชีพ)", role: "ผู้ดูแลผู้ป่วยติดเตียง", icon: <Award className="w-6 h-6" /> },
    rn: { name: "พยาบาลก้อย (RN)", role: "พยาบาลวิชาชีพ", icon: <Stethoscope className="w-6 h-6" /> }
  };

  const addLog = (message, type = 'text') => {
    const time = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [...prev, { time, message, type }]);
  };

  const resetApp = () => {
    setStatus('idle');
    setLogs([]);
    setSosActive(null);
  };

  // ==========================================
  // 📱 CLIENT VIEW (แอปฝั่งลูกค้า) - CLARIFY UI
  // ==========================================
  const renderClientView = () => {
    const profile = caregiverProfiles[tier];

    return (
      <div className="flex flex-col h-full bg-slate-50 relative">
        {sosActive && <SosOverlay source={sosActive} onDismiss={() => setSosActive(null)} />}

        {/* State 1: IDLE */}
        {status === 'idle' && (
          <div className="flex flex-col h-full animate-in fade-in">
            <div className="bg-white px-6 py-8 shadow-sm z-10">
              <h1 className="text-3xl font-black text-teal-800 tracking-tight">Homy</h1>
              <p className="text-slate-500 mt-2 text-base">แพลตฟอร์มดูแลผู้สูงอายุที่ไว้ใจได้</p>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <h2 className="text-lg font-bold text-slate-800 mb-4">1. เลือกระดับผู้ดูแล</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <TierCard title="นักศึกษา" desc="อยู่เป็นเพื่อน" icon={<GraduationCap className="w-6 h-6" />} active={tier === 'student'} onClick={() => setTier('student')} price="฿500" />
                <TierCard title="มีใบเซอร์" desc="ดูแลกิจวัตร" icon={<FileBadge className="w-6 h-6" />} active={tier === 'cert'} onClick={() => setTier('cert')} price="฿800" />
                <TierCard title="มืออาชีพ" desc="รับมือผู้ป่วย" icon={<Award className="w-6 h-6" />} active={tier === 'pro'} onClick={() => setTier('pro')} price="฿1200" />
                <TierCard title="พยาบาล" desc="ดูแลเฉพาะทาง" icon={<Stethoscope className="w-6 h-6" />} active={tier === 'rn'} onClick={() => setTier('rn')} price="฿2000" />
              </div>

              <h2 className="text-lg font-bold text-slate-800 mb-4">2. บริการเพิ่มเติม</h2>
              <button
                onClick={() => setAddons({ cleaning: !addons.cleaning })}
                className={`w-full p-4 rounded-xl flex justify-between items-center border-2 transition-all ${addons.cleaning ? 'border-teal-600 bg-teal-50 text-teal-900' : 'border-slate-200 bg-white text-slate-600'}`}
              >
                <span className="font-medium text-base flex items-center"><Home className="w-5 h-5 mr-3" /> ทำความสะอาดบ้าน</span>
                <span className="font-bold">+ ฿300</span>
              </button>

              <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
                <label className="flex items-start cursor-pointer">
                  <input type="checkbox" checked={isTrial} onChange={(e) => setIsTrial(e.target.checked)} className="mt-1 w-5 h-5 text-teal-600 rounded border-slate-300" />
                  <div className="ml-3">
                    <span className="font-bold text-amber-900 text-base block">ทดลองใช้บริการ 1 วัน (Trial)</span>
                    <span className="text-sm text-amber-700 mt-1 block">ทดลองงานก่อนทำสัญญาระยะยาว</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white p-6 border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500 text-base">งบประมาณโดยประเมิน:</span>
                <span className="text-3xl font-black text-teal-800">฿{calculatePrice()}</span>
              </div>
              <button onClick={() => setStatus('requesting')} className="w-full bg-teal-700 text-white font-bold text-lg py-4 rounded-2xl active:bg-teal-800 transition shadow-lg flex justify-center items-center">
                ค้นหาผู้ดูแล <ChevronRight className="w-6 h-6 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* State 2: REQUESTING */}
        {status === 'requesting' && (
          <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-white animate-in fade-in">
            <Loader2 className="w-20 h-20 text-teal-600 animate-spin mb-8" />
            <h2 className="text-2xl font-black text-slate-800 mb-4">กำลังค้นหาผู้ดูแล...</h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              ระบบกำลังค้นหาและส่งคำขอไปยังผู้ดูแลระดับ <span className="font-bold text-teal-700">{profile.role}</span> ในพื้นที่ของคุณ
              <br /><br />(กรุณากดรับงานที่หน้าจอฝั่งผู้ดูแล)
            </p>
          </div>
        )}

        {/* State 3: ACCEPTED */}
        {status === 'accepted' && (
          <div className="flex flex-col h-full animate-in slide-in-from-right-4">
            <div className="bg-white px-6 py-6 shadow-sm z-10 border-b border-slate-200">
              <h1 className="text-2xl font-black text-teal-800">ผู้ดูแลตอบรับแล้ว!</h1>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-teal-500">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 mr-4">
                    {profile.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{profile.name}</h3>
                    <p className="text-teal-600 font-medium">{profile.role}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
                  <p className="text-slate-600 text-base mb-2">เพื่อยืนยันการเริ่มงาน กรุณาชำระเงินมัดจำผ่านระบบปลอดภัย (Escrow)</p>
                  <p className="text-xs text-slate-400">เงินจะถูกโอนให้ผู้ดูแลเมื่อจบงานเท่านั้น</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 border-t border-slate-200">
              <button
                onClick={() => {
                  setStatus('active');
                  addLog('ชำระเงินมัดจำสำเร็จ ระบบบันทึกเวลาเริ่มทำงาน', 'system');
                }}
                className="w-full bg-teal-700 text-white font-bold text-xl py-4 rounded-2xl active:bg-teal-800 transition shadow-lg"
              >
                ชำระมัดจำ ฿{calculatePrice()}
              </button>
            </div>
          </div>
        )}

        {/* State 4: ACTIVE */}
        {status === 'active' && (
          <div className="flex flex-col h-full bg-slate-50 relative animate-in fade-in">
            <div className="bg-white px-6 py-8 border-b border-slate-200 shadow-sm z-10 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-slate-800">สถานะปัจจุบัน</h1>
                <p className="text-teal-600 font-bold text-base mt-1 flex items-center">
                  <span className="w-2.5 h-2.5 bg-teal-500 rounded-full mr-2 animate-pulse"></span> กำลังให้บริการ
                </p>
              </div>
              <button className="bg-blue-50 text-blue-700 p-3 rounded-xl flex flex-col items-center border border-blue-200 active:bg-blue-100">
                <Video className="w-6 h-6 mb-1" />
                <span className="text-xs font-bold">คุยกับหมอ</span>
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto pb-32">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="font-bold text-slate-800 text-lg mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-teal-600" /> บันทึกการดูแล (Live)
                </h2>

                <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
                  {logs.length === 0 ? (
                    <p className="text-base text-slate-400 ml-6 italic">รอการอัปเดตจากผู้ดูแล...</p>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} className="relative pl-6 animate-in slide-in-from-left-4">
                        <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1.5 border-4 border-white ${log.type === 'system' ? 'bg-blue-500' : 'bg-teal-500'}`}></div>
                        <p className="text-sm font-bold text-slate-400 mb-1">{log.time}</p>
                        <p className="text-base font-medium text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 inline-block">{log.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex gap-4">
              <button onClick={() => setSosActive('client')} className="bg-red-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg shadow-red-600/30 active:scale-95 transition shrink-0">
                <AlertTriangle className="w-8 h-8" />
              </button>
              <button onClick={() => setStatus('checkout')} className="flex-1 bg-slate-800 text-white font-bold text-lg rounded-2xl shadow-lg active:bg-slate-900 transition flex items-center justify-center">
                จบงาน (Check-out)
              </button>
            </div>
          </div>
        )}

        {/* State 5: CHECKOUT */}
        {status === 'checkout' && (
          <div className="flex flex-col h-full bg-white p-8 items-center justify-center text-center animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">บริการเสร็จสิ้น</h2>
            <p className="text-lg text-slate-500 mb-12">ขอบคุณที่ไว้วางใจให้ Homy ดูแลคนที่คุณรัก</p>
            <button onClick={resetApp} className="w-full bg-slate-100 text-slate-700 font-bold text-lg py-4 rounded-2xl active:bg-slate-200 transition">
              กลับหน้าแรก
            </button>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // 📱 CAREGIVER VIEW (แอปฝั่งผู้ดูแล) - CLARIFY UI
  // ==========================================
  const renderCaregiverView = () => {
    const profile = caregiverProfiles[tier];

    return (
      <div className="flex flex-col h-full bg-slate-100 relative">
        {sosActive && <SosOverlay source={sosActive} onDismiss={() => setSosActive(null)} />}

        <div className="bg-slate-900 text-white px-6 py-8 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-black">Partner</h1>
            <span className="bg-green-500/20 text-green-400 text-sm font-bold px-3 py-1 rounded-full border border-green-500/30">
              ● Online
            </span>
          </div>
          <p className="text-slate-300 text-base">{profile.name}</p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* State 1: IDLE */}
          {status === 'idle' && (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">รอรับงาน</h2>
              <p className="text-slate-500 text-base">ระบบกำลังค้นหางานในพื้นที่ให้คุณ</p>
            </div>
          )}

          {/* State 2: REQUESTING */}
          {status === 'requesting' && (
            <div className="h-full flex flex-col justify-center animate-in slide-in-from-bottom-8">
              <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-teal-500">
                <h3 className="text-2xl font-black text-teal-700 mb-6 flex items-center">
                  <BellRing className="w-8 h-8 mr-3 animate-bounce" /> มีงานใหม่เข้า!
                </h3>
                <div className="space-y-4 mb-8">
                  <p className="text-slate-700 text-lg flex items-center bg-slate-50 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 mr-3 text-slate-400" /> สุขุมวิท 50 (ห่าง 2 กม.)
                  </p>
                  <p className="text-slate-700 text-lg flex items-center bg-slate-50 p-3 rounded-xl">
                    <Clock className="w-6 h-6 mr-3 text-slate-400" /> ต้องการเริ่มงานทันที
                  </p>
                  <p className="text-slate-800 text-xl font-bold bg-teal-50 p-4 rounded-xl text-center border border-teal-200">
                    รายได้สุทธิ: ฿{tier === 'student' ? calculatePrice() : calculatePrice() * 0.9}
                  </p>
                </div>
                <button onClick={() => setStatus('accepted')} className="w-full bg-teal-600 text-white font-bold text-xl py-5 rounded-2xl active:bg-teal-700 transition shadow-lg">
                  กดรับงานนี้
                </button>
              </div>
            </div>
          )}

          {/* State 3: ACCEPTED */}
          {status === 'accepted' && (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in">
              <Loader2 className="w-20 h-20 text-teal-600 animate-spin mb-6" />
              <h2 className="text-2xl font-bold text-slate-800 mb-4">รอญาติชำระเงิน...</h2>
              <p className="text-slate-500 text-lg">กรุณารอสักครู่ ระบบกำลังพักรอการชำระมัดจำจากญาติเพื่อยืนยันการเริ่มงาน</p>
            </div>
          )}

          {/* State 4: ACTIVE */}
          {status === 'active' && (
            <div className="flex flex-col h-full animate-in fade-in">
              <div className="bg-blue-100 text-blue-800 p-4 rounded-xl mb-6 text-base font-bold flex items-center justify-center border border-blue-200 shadow-sm">
                <Clock className="w-5 h-5 mr-2" /> กำลังบันทึกเวลาทำงาน
              </div>

              <h3 className="font-bold text-slate-800 mb-4 text-lg">รายงานสถานะให้ญาติทราบ</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button onClick={() => addLog('Check-in ถึงบ้านเรียบร้อย')} className="bg-white border-2 border-slate-200 p-4 rounded-2xl hover:border-teal-500 flex flex-col items-center justify-center transition shadow-sm active:bg-slate-50 h-28">
                  <MapPin className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-bold text-slate-700">ถึงบ้านแล้ว</span>
                </button>
                <button onClick={() => addLog('ทานอาหารและยาตามเวลา')} className="bg-white border-2 border-slate-200 p-4 rounded-2xl hover:border-teal-500 flex flex-col items-center justify-center transition shadow-sm active:bg-slate-50 h-28">
                  <HeartPulse className="w-8 h-8 text-rose-500 mb-2" />
                  <span className="text-sm font-bold text-slate-700">ให้ยา/อาหาร</span>
                </button>
                <button onClick={() => addLog('อัปเดตภาพถ่ายสถานการณ์')} className="bg-white border-2 border-slate-200 p-4 rounded-2xl hover:border-teal-500 flex flex-col items-center justify-center transition shadow-sm active:bg-slate-50 col-span-2 h-24">
                  <Camera className="w-8 h-8 text-teal-600 mb-2" />
                  <span className="text-base font-bold text-slate-700">ถ่ายรูปส่งให้ญาติ</span>
                </button>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-200">
                <button onClick={() => setSosActive('caregiver')} className="w-full bg-red-100 text-red-700 font-bold text-lg py-4 rounded-2xl border-2 border-red-200 active:bg-red-200 flex items-center justify-center transition">
                  <AlertTriangle className="w-6 h-6 mr-3" /> แจ้งเหตุฉุกเฉิน (SOS)
                </button>
              </div>
            </div>
          )}

          {/* State 5: CHECKOUT */}
          {status === 'checkout' && (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95">
              <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-4">จบงานเรียบร้อย</h2>
              <p className="text-lg text-slate-500 mb-2">เงินค่าบริการถูกโอนเข้าบัญชีของคุณแล้ว</p>
              <p className="text-2xl font-bold text-teal-700 mb-10">฿{tier === 'student' ? calculatePrice() : calculatePrice() * 0.9}</p>
              <button onClick={resetApp} className="w-full bg-slate-200 text-slate-800 font-bold text-lg py-4 rounded-2xl active:bg-slate-300 transition">
                เปิดรับงานถัดไป
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col items-center py-10 px-4 font-sans">
      <div className="w-full max-w-6xl flex justify-between items-end mb-10 text-white">
        <div>
          <h1 className="text-3xl font-black text-teal-400 tracking-tight">Homy UI: Clarify Edition (Realistic Flow)</h1>
          <p className="text-slate-400 mt-2 text-base">ระบบจำลองการทำงาน 2 หน้าจอ (โปรดลองกดปุ่มตามลำดับการทำงานจริง)</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl">
        {/* Client Phone */}
        <div className="flex flex-col items-center">
          <div className="bg-teal-700 text-white px-8 py-2 rounded-t-2xl font-bold text-sm mb-3 shadow-xl z-10 uppercase tracking-widest">Client App</div>
          <div className="w-[380px] h-[800px] bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border-[12px] border-slate-900">
            <div className="absolute top-0 inset-x-0 h-7 bg-slate-900 rounded-b-3xl w-40 mx-auto z-50"></div>
            {renderClientView()}
          </div>
        </div>

        {/* Sync Arrow Indicator */}
        <div className="hidden lg:flex flex-col items-center justify-center text-slate-500">
          <div className="animate-pulse flex gap-2">
            <ChevronRight className="w-10 h-10" />
            <ChevronRight className="w-10 h-10 -ml-5" />
            <ChevronRight className="w-10 h-10 -ml-5" />
          </div>
          <span className="text-xs font-bold tracking-widest mt-2 uppercase">Real-time</span>
        </div>

        {/* Caregiver Phone */}
        <div className="flex flex-col items-center">
          <div className="bg-slate-600 text-white px-8 py-2 rounded-t-2xl font-bold text-sm mb-3 shadow-xl z-10 uppercase tracking-widest">Caregiver App</div>
          <div className="w-[380px] h-[800px] bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border-[12px] border-slate-900">
            <div className="absolute top-0 inset-x-0 h-7 bg-slate-900 rounded-b-3xl w-40 mx-auto z-50"></div>
            {renderCaregiverView()}
          </div>
        </div>
      </div>
    </div>
  );
}