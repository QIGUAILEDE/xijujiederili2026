import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Ticket, 
  AlertCircle, 
  Smartphone, 
  Users, 
  Star,
  Flame,
  CheckCircle2,
  Info,
  BellRing,
  Timer,
  MapPin,
  Megaphone,
  Navigation
} from 'lucide-react';

// 解析并提取图片中的数据
const rawData = [
  { id: 101, date: '4月5日', time: '19:30', name: '刘仁铖专场《小刘的奇妙冒险》', isDamaiPriority: false, ticketDate: '3月7日', mpPriorityTime: '', priorityTicketTime: '18:00', ticketTime: '19:00', price: '待定', quantity: '-', priority: 'default', platform: '多平台', location: '阿那亚艺术中心北岸馆' },
  { id: 102, date: '4月6日', time: '18:30', name: '子龙专场《渎》', isDamaiPriority: false, ticketDate: '3月7日', mpPriorityTime: '', priorityTicketTime: '18:00', ticketTime: '19:00', price: '待定', quantity: '-', priority: 'default', platform: '多平台', location: '阿那亚A剧场' },
  { id: 1, date: '4月10日', time: '22:30', name: '奇墨开放麦', isDamaiPriority: true, ticketDate: '3月7日', mpPriorityTime: '14:00', priorityTicketTime: '18:00', ticketTime: '19:00', price: '180', quantity: '2', priority: 'P0', platform: '小程序', location: '阿那亚蜂巢剧场' },
  { id: 2, date: '4月11日', time: '14:00', name: '半决赛-1', isDamaiPriority: false, ticketDate: '3月7日', mpPriorityTime: '', priorityTicketTime: '', ticketTime: '19:00', price: '180', quantity: '2', priority: 'P3', platform: '小程序', location: '阿那亚A剧场' },
  { id: 3, date: '4月11日', time: '16:30', name: '半决赛-2', isDamaiPriority: false, ticketDate: '3月7日', mpPriorityTime: '', priorityTicketTime: '', ticketTime: '19:00', price: '180', quantity: '2', priority: 'P3', platform: '小程序', location: '阿那亚A剧场' },
  { id: 4, date: '4月11日', time: '19:30', name: '半决赛-3', isDamaiPriority: false, ticketDate: '3月7日', mpPriorityTime: '', priorityTicketTime: '', ticketTime: '19:00', price: '180', quantity: '2', priority: 'P3', platform: '小程序', location: '阿那亚A剧场' },
  { id: 103, date: '4月11日', time: '19:30', name: '高寒林简七双拼《两小儿辩日》', isDamaiPriority: false, ticketDate: '3月7日', mpPriorityTime: '', priorityTicketTime: '18:00', ticketTime: '19:00', price: '待定', quantity: '-', priority: 'default', platform: '多平台', location: '阿那亚艺术中心北岸馆' },
  { id: 5, date: '4月12日', time: '14:30', name: '总决赛', isDamaiPriority: true, ticketDate: '3月7日', mpPriorityTime: '', priorityTicketTime: '18:00', ticketTime: '19:00', price: '220', quantity: '2', priority: 'P1', platform: '小程序', location: '阿那亚艺术中心北岸馆' },
  { id: 6, date: '4月12日', time: '16:30', name: '', isDamaiPriority: false, ticketDate: '', mpPriorityTime: '', priorityTicketTime: '', ticketTime: '', price: '', quantity: '', priority: '', platform: '', location: '' },
  { id: 7, date: '4月12日', time: '18:00', name: '奇墨开放麦', isDamaiPriority: true, ticketDate: '3月7日', mpPriorityTime: '14:00', priorityTicketTime: '18:00', ticketTime: '19:00', price: '180', quantity: '2', priority: 'P0', platform: '小程序', location: '阿那亚蜂巢剧场' },
  { id: 8, date: '4月12日', time: '19:30', name: '天才的三个夜晚', isDamaiPriority: true, ticketDate: '3月7日', mpPriorityTime: '', priorityTicketTime: '18:00', ticketTime: '19:00', price: '580', quantity: '2', priority: 'P2', platform: '小程序', location: '阿那亚艺术中心北岸馆' }
];

// 将数据按日期分组
const groupedData = rawData.reduce((acc, curr) => {
  if (!acc[curr.date]) acc[curr.date] = [];
  acc[curr.date].push(curr);
  return acc;
}, {});

// 优先级颜色映射
const priorityStyles = {
  'P0': 'bg-red-100 text-red-700 border-red-200 shadow-red-100',
  'P1': 'bg-orange-100 text-orange-700 border-orange-200 shadow-orange-100',
  'P2': 'bg-amber-100 text-amber-700 border-amber-200 shadow-amber-100',
  'P3': 'bg-blue-100 text-blue-700 border-blue-200 shadow-blue-100',
  'default': 'bg-gray-100 text-gray-700 border-gray-200'
};

const PriorityBadge = ({ level }) => {
  if (!level) return null;
  const style = priorityStyles[level] || priorityStyles['default'];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 shadow-sm ${style}`}>
      <Flame className="w-3 h-3" /> {level} 级优先
    </span>
  );
};

const TicketingTimeline = ({ event }) => {
  if (!event.ticketDate) return null;

  const steps = [];
  if (event.mpPriorityTime) steps.push({ time: event.mpPriorityTime, label: '小程序优先购名额', highlight: true });
  if (event.priorityTicketTime) steps.push({ time: event.priorityTicketTime, label: '优先购开票', highlight: true });
  if (event.ticketTime) steps.push({ time: event.ticketTime, label: '全面开票', highlight: false });

  if (steps.length === 0) return null;

  return (
    <div className="mt-4 bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
      <div className="flex items-center text-indigo-800 font-semibold mb-3 text-sm">
        <AlertCircle className="w-4 h-4 mr-1.5" /> 
        抢票日: <span className="text-indigo-600 ml-1">{event.ticketDate}</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {steps.map((step, idx) => (
          <div key={idx} className="flex-1 min-w-[120px] relative">
            <div className={`rounded-lg p-2.5 border text-center transition-all ${
              step.highlight 
                ? 'bg-white border-indigo-200 shadow-sm hover:border-indigo-400' 
                : 'bg-indigo-100/50 border-indigo-100 text-indigo-600'
            }`}>
              <div className={`text-lg font-bold font-mono ${step.highlight ? 'text-indigo-600' : ''}`}>
                {step.time}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5 font-medium leading-tight">
                {step.label}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className="hidden sm:block absolute top-1/2 -right-2 w-4 h-px bg-indigo-200 -translate-y-1/2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const EventCard = ({ event }) => {
  const isTBA = !event.name;

  if (isTBA) {
    return (
      <div className="flex gap-4 relative opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
        <div className="w-px bg-gray-200 absolute left-[39px] top-10 bottom-[-24px] z-0 hidden sm:block"></div>
        <div className="z-10 bg-gray-50 border-2 border-gray-200 text-gray-400 font-bold rounded-2xl h-16 w-20 flex flex-col items-center justify-center shrink-0 shadow-sm hidden sm:flex">
          <span className="text-sm">{event.time}</span>
        </div>
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-4 flex-1 mb-6 flex items-center gap-3 text-gray-400">
           <Clock className="w-5 h-5" />
           <span className="font-medium">{event.time} - 演出待定 (无排期信息)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 relative group">
      {/* 桌面端时间轴线 */}
      <div className="w-px bg-indigo-100 absolute left-[39px] top-12 bottom-[-24px] z-0 hidden sm:block group-last:hidden"></div>
      
      {/* 时间气泡 */}
      <div className="z-10 bg-white border-2 border-indigo-500 text-indigo-700 font-bold rounded-2xl h-12 w-auto px-4 sm:px-0 sm:h-20 sm:w-20 flex flex-row sm:flex-col items-center justify-center shrink-0 shadow-sm sm:group-hover:scale-105 transition-transform self-start sm:self-auto">
        <Clock className="w-4 h-4 sm:hidden mr-2" />
        <span className="text-lg sm:text-xl tracking-tight">{event.time}</span>
      </div>

      {/* 卡片主体 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex-1 mb-6 sm:mb-8 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        {/* 顶部装饰条 */}
        <div className={`absolute top-0 left-0 w-1 h-full ${
          event.priority === 'P0' ? 'bg-red-500' : 
          event.priority === 'P1' ? 'bg-orange-500' : 
          event.priority === 'P2' ? 'bg-amber-500' : 'bg-blue-500'
        }`}></div>

        <div className="pl-2">
          {/* 标题行 */}
          <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
            <div>
              <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
                {event.name}
              </h3>
              {event.isDamaiPriority && (
                <div className="inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs bg-pink-50 text-pink-600 border border-pink-100">
                  <Star className="w-3 h-3 mr-1 fill-pink-600" />
                  大麦优先购报名: 是
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <PriorityBadge level={event.priority} />
            </div>
          </div>

          {/* 信息标签栏 */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 bg-gray-50/80 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 font-medium">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Ticket className="w-4 h-4" />
              </div>
              <span>{event.price === '待定' || !event.price ? '待定' : `¥${event.price}`}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Users className="w-4 h-4" />
              </div>
              <span>{event.quantity === '-' || !event.quantity ? '-' : `${event.quantity}张`}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Smartphone className="w-4 h-4" />
              </div>
              <span>{event.platform}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-1.5 font-medium w-full sm:w-auto mt-1 sm:mt-0">
                <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* 抢票时间线 */}
          <TicketingTimeline event={event} />
        </div>
      </div>
    </div>
  );
};

// --- 新增：识别即将到来的抢票任务的 Hook ---
const useUpcomingTicketing = (data) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // 每分钟更新一次当前时间
    const timer = setInterval(() => setNow(Date.now()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const upcoming = useMemo(() => {
    const stepsMap = new Map();
    const year = new Date().getFullYear();

    data.forEach(event => {
      if (!event.ticketDate) return;

      // 解析时间点并归类的辅助函数
      const addStep = (timeStr, label) => {
        if (!timeStr) return;
        const match = event.ticketDate.match(/(\d+)月(\d+)日/);
        if (!match) return;
        const [, month, day] = match;
        
        // 组装成标准时间格式用于比较，兼容各类浏览器 (YYYY/MM/DD HH:mm:00)
        const timestamp = new Date(`${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')} ${timeStr}:00`).getTime();
        
        if (!stepsMap.has(timestamp)) {
          stepsMap.set(timestamp, {
            timestamp,
            dateStr: event.ticketDate,
            timeStr,
            label,
            events: new Set()
          });
        }
        stepsMap.get(timestamp).events.add(event.name || '待定演出');
      };

      addStep(event.mpPriorityTime, '小程序优先购');
      addStep(event.priorityTicketTime, '优先购开票');
      addStep(event.ticketTime, '全面开票');
    });

    // 将时间点按先后排序
    const sortedSteps = Array.from(stepsMap.values()).sort((a, b) => a.timestamp - b.timestamp);
    
    // 找到第一个晚于“现在”的时间点
    return sortedSteps.find(step => step.timestamp > now);
  }, [data, now]);

  return upcoming;
};

export default function App() {
  const dates = Object.keys(groupedData).sort();
  const upcomingTask = useUpcomingTicketing(rawData);
  const [activeRound, setActiveRound] = useState('round1'); // 第一轮/第二轮的状态切换

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* 顶部导航区 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">单立人喜剧节</h1>
          </div>
          <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 flex items-center hidden sm:flex">
            <Info className="w-4 h-4 mr-1.5" />
            统一开票日: 3月7日
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
        {/* 轮次切换 Tabs */}
        <div className="flex space-x-2 sm:space-x-3 mb-6 p-1.5 bg-gray-200/60 rounded-xl w-fit">
          <button 
            onClick={() => setActiveRound('round1')}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeRound === 'round1' 
              ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-gray-900/5' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            第一轮开票
          </button>
          <button 
            onClick={() => setActiveRound('round2')}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
              activeRound === 'round2' 
              ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-gray-900/5' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Timer className="w-4 h-4" /> 第二轮开票
          </button>
        </div>

        {/* 即将到来任务提示 (仅在有任务且在第一轮时显示) */}
        {activeRound === 'round1' && upcomingTask && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-4 rounded-2xl mb-2 flex items-start sm:items-center shadow-sm shadow-orange-100/50">
            <div className="bg-orange-100 p-2.5 rounded-full mr-4 shrink-0">
              <BellRing className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="text-orange-900 font-bold text-lg flex flex-wrap items-center gap-2 mb-1">
                即将开启: {upcomingTask.dateStr} {upcomingTask.timeStr}
                <span className="bg-orange-600 text-white text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                  {upcomingTask.label}
                </span>
              </div>
              <div className="text-orange-700/90 text-sm font-medium mt-1.5 sm:mt-0">
                涉及演出：{Array.from(upcomingTask.events).join('、')}
              </div>
            </div>
          </div>
        )}
      </div>

      {activeRound === 'round1' ? (
        <>
          {/* 第一轮开票内容（原有的统计和列表） */}
          {/* 概览统计卡片 */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 mb-8">
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider border border-white/20">
                    2026 单立人喜剧节
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">第一轮开票</h2>
                <p className="text-indigo-200 mb-6 flex items-center gap-2 text-lg">
                  <Megaphone className="w-5 h-5 text-yellow-400" /> 
                  <span className="font-medium text-white">明日开售！</span>演出单元首轮场次抢先看
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-start gap-3">
                    <Calendar className="w-6 h-6 text-indigo-300 shrink-0" />
                    <div>
                      <div className="text-indigo-200 text-sm mb-1">节展日期</div>
                      <div className="text-lg font-bold">4月3日 - 4月12日</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-indigo-300 shrink-0" />
                    <div>
                      <div className="text-indigo-200 text-sm mb-1">举办地点</div>
                      <div className="text-lg font-bold">阿那亚 · 秦皇岛</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-start gap-3">
                    <Smartphone className="w-6 h-6 text-indigo-300 shrink-0" />
                    <div>
                      <div className="text-indigo-200 text-sm mb-1">首轮购票平台</div>
                      <div className="text-sm font-bold leading-snug mt-1">单立人小程序 / 大麦 / 阿那亚App</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-start gap-3">
                    <Navigation className="w-6 h-6 text-yellow-300 shrink-0" />
                    <div>
                      <div className="text-yellow-200 text-sm mb-1 font-medium">场地温馨提示 (请预留时间)</div>
                      <div className="text-xs font-bold text-white leading-relaxed">蜂巢剧场与A剧场相邻<br/>北岸馆较远，建议预留 30min 间隔</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 日程列表区 */}
          <main className="max-w-4xl mx-auto px-4 sm:px-6">
            {dates.map((date, index) => (
              <div key={date} className="mb-12">
                {/* 日期分隔头 */}
                <div className="flex items-center mb-8 sticky top-20 z-40">
                  <div className="bg-indigo-100 text-indigo-800 font-bold px-4 py-2 rounded-xl text-lg shadow-sm border border-indigo-200 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {date}
                  </div>
                  <div className="h-px bg-gradient-to-r from-indigo-200 to-transparent flex-1 ml-4"></div>
                </div>

                {/* 当日事件列表 */}
                <div className="pl-0 sm:pl-4">
                  {groupedData[date].map((event, idx) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </main>
        </>
      ) : (
        /* 第二轮开票占位页面 */
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center min-h-[500px] shadow-sm">
            <div className="bg-gray-100 p-5 rounded-full mb-6">
              <Timer className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">第二轮开票信息整理中</h3>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              第二轮的演出排期、抢票时间与座位图稍后公布，请留意后续更新，敬请期待！
            </p>
          </div>
        </div>
      )}
    </div>
  );
}