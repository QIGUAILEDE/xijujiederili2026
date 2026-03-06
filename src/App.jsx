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
  Navigation,
  Swords,
  UserCircle2,
  PartyPopper
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
    <div className="mt-5 bg-indigo-50/50 rounded-xl p-4 sm:p-5 border border-indigo-100">
      <div className="flex items-center text-indigo-800 font-semibold mb-3.5 text-sm">
        <AlertCircle className="w-4 h-4 mr-1.5" /> 
        抢票日: <span className="text-indigo-600 ml-1">{event.ticketDate}</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {steps.map((step, idx) => (
          <div key={idx} className="flex-1 min-w-[125px] relative">
            <div className={`rounded-xl p-3 border text-center transition-all ${
              step.highlight 
                ? 'bg-white border-indigo-200 shadow-sm hover:border-indigo-400' 
                : 'bg-indigo-100/50 border-indigo-100 text-indigo-600'
            }`}>
              <div className={`text-lg sm:text-xl font-bold font-mono tracking-tight ${step.highlight ? 'text-indigo-600' : ''}`}>
                {step.time}
              </div>
              <div className="text-[11px] sm:text-xs text-gray-500 mt-1 font-medium leading-tight">
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

// W & Y 专属作战计划组件
const WYBattlePlan = () => {
  const planSteps = [
    { time: '12:00', type: 'shared', title: '检查大麦优先购资格', desc: '总决赛、奇墨开放麦、天才的三个夜晚' },
    { time: '14:00', type: 'shared', title: '抢「奇墨开放麦」优先购资格', desc: '⚠️ 提前登录单立人小程序\n路径：积分兑换 -> 积分兑换 -> 优先购#奇墨开放麦' },
    { time: '18:00', type: 'shared', title: '各自抢购 4.10 奇墨开放麦', desc: '4.10 22:30场次 / 180档 / 小程序' },
    { time: '18:02', type: 'split', wTask: '抢购 总决赛 (220档)', yTask: '抢购 天才的三个夜晚 (580档)', platform: '小程序' },
    { time: '19:00', type: 'shared', title: '各自抢购 4.12 奇墨开放麦', desc: '4.12 18:00场地 / 180档 / 小程序' },
    { time: '19:02', type: 'split', wTask: '抢购 半决赛-3 (180档)', yTask: '抢购 半决赛-1、半决赛-2 (180档)', platform: '小程序' },
    { time: '成功', type: 'finish', title: '快乐看演出！', desc: '抢票全部结束，准备去阿那亚看海听段子🌊' }
  ];

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-rose-100 overflow-hidden mb-10">
      {/* 头部标题区 */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-5 sm:p-6 text-white flex justify-between items-center shadow-inner">
        <h3 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5 tracking-tight">
          <Swords className="w-6 h-6 sm:w-7 sm:h-7" /> 
          W & Y 抢票作战计划
        </h3>
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm border border-white/20 hidden sm:block">
          3月7日 决战日
        </span>
      </div>

      {/* 时间轴主体 */}
      <div className="p-5 sm:p-8">
        <div className="relative border-l-[3px] border-rose-100 ml-3 sm:ml-5 space-y-8 pb-2">
          {planSteps.map((step, idx) => (
            <div key={idx} className="relative pl-6 sm:pl-8">
              {/* 时间轴圆点 */}
              <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                step.type === 'finish' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}>
              </div>

              {/* 任务内容 */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                {/* 时间标识 */}
                <div className={`text-lg sm:text-xl font-black font-mono tracking-tight shrink-0 mt-0.5 ${
                  step.type === 'finish' ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {step.time}
                </div>

                {/* 具体任务详情 */}
                <div className="flex-1 w-full">
                  {step.type === 'shared' && (
                    <div className="bg-rose-50/50 rounded-2xl p-4 sm:p-5 border border-rose-100/60">
                      <div className="font-bold text-gray-800 text-base sm:text-lg mb-1.5">{step.title}</div>
                      <div className="text-sm sm:text-base text-gray-600 whitespace-pre-line leading-relaxed">{step.desc}</div>
                    </div>
                  )}

                  {step.type === 'split' && (
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      {/* W 的任务 */}
                      <div className="flex-1 bg-blue-50/80 rounded-2xl p-4 sm:p-5 border border-blue-100">
                        <div className="font-bold text-blue-800 flex items-center gap-1.5 mb-2">
                          <UserCircle2 className="w-5 h-5" /> W 的任务
                        </div>
                        <div className="text-sm sm:text-base text-blue-900 font-medium leading-relaxed">{step.wTask}</div>
                        <div className="text-xs text-blue-500 mt-2 font-medium">平台: {step.platform}</div>
                      </div>
                      {/* Y 的任务 */}
                      <div className="flex-1 bg-purple-50/80 rounded-2xl p-4 sm:p-5 border border-purple-100">
                        <div className="font-bold text-purple-800 flex items-center gap-1.5 mb-2">
                          <UserCircle2 className="w-5 h-5" /> Y 的任务
                        </div>
                        <div className="text-sm sm:text-base text-purple-900 font-medium leading-relaxed">{step.yTask}</div>
                        <div className="text-xs text-purple-500 mt-2 font-medium">平台: {step.platform}</div>
                      </div>
                    </div>
                  )}

                  {step.type === 'finish' && (
                    <div className="bg-emerald-50 rounded-2xl p-4 sm:p-5 border border-emerald-100 mt-1">
                      <div className="font-bold text-emerald-800 text-lg flex items-center gap-2 mb-1">
                        <PartyPopper className="w-5 h-5" /> {step.title}
                      </div>
                      <div className="text-sm sm:text-base text-emerald-600">{step.desc}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-4 sm:p-5 flex-1 mb-6 flex items-center gap-3 text-gray-400">
           <Clock className="w-5 h-5" />
           <span className="font-medium">{event.time} - 演出待定 (无排期信息)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 relative group">
      {/* 桌面端时间轴线 */}
      <div className="w-px bg-indigo-100 absolute left-[39px] top-12 bottom-[-24px] z-0 hidden sm:block group-last:hidden"></div>
      
      {/* 时间气泡 */}
      <div className="z-10 bg-white border-2 border-indigo-500 text-indigo-700 font-bold rounded-2xl h-12 w-auto px-4 sm:px-0 sm:h-20 sm:w-20 flex flex-row sm:flex-col items-center justify-center shrink-0 shadow-sm sm:group-hover:scale-105 transition-transform self-start sm:self-auto">
        <Clock className="w-4 h-4 sm:hidden mr-2" />
        <span className="text-lg sm:text-xl tracking-tight">{event.time}</span>
      </div>

      {/* 卡片主体 */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 flex-1 mb-6 sm:mb-8 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        {/* 顶部装饰条 */}
        <div className={`absolute top-0 left-0 w-1.5 h-full ${
          event.priority === 'P0' ? 'bg-red-500' : 
          event.priority === 'P1' ? 'bg-orange-500' : 
          event.priority === 'P2' ? 'bg-amber-500' : 
          event.priority === 'default' ? 'bg-gray-300' : 'bg-blue-500'
        }`}></div>

        <div className="pl-2 sm:pl-3">
          {/* 标题行 */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight leading-snug">
                {event.name}
              </h3>
              {event.isDamaiPriority && (
                <div className="inline-flex items-center mt-2 px-2.5 py-1 rounded-md text-xs font-medium bg-pink-50 text-pink-600 border border-pink-100">
                  <Star className="w-3.5 h-3.5 mr-1 fill-pink-600" />
                  大麦优先购报名: 是
                </div>
              )}
            </div>
            <div className="flex gap-2 self-start">
              <PriorityBadge level={event.priority !== 'default' ? event.priority : null} />
            </div>
          </div>

          {/* 信息标签栏 (针对大屏适配更宽的间距) */}
          <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-600 bg-gray-50/80 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl">
            <div className="flex items-center gap-2 font-medium">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Ticket className="w-4 h-4" />
              </div>
              <span>{event.price === '待定' || !event.price ? '待定' : `¥${event.price}`}</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Users className="w-4 h-4" />
              </div>
              <span>{event.quantity === '-' || !event.quantity ? '-' : `${event.quantity}张`}</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Smartphone className="w-4 h-4" />
              </div>
              <span>{event.platform}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 font-medium w-full mt-1.5 sm:mt-0 sm:w-auto">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-tight">{event.location}</span>
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

const useUpcomingTicketing = (data) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const upcoming = useMemo(() => {
    const stepsMap = new Map();
    const year = new Date().getFullYear();

    data.forEach(event => {
      if (!event.ticketDate) return;

      const addStep = (timeStr, label) => {
        if (!timeStr) return;
        const match = event.ticketDate.match(/(\d+)月(\d+)日/);
        if (!match) return;
        const [, month, day] = match;
        
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

    const sortedSteps = Array.from(stepsMap.values()).sort((a, b) => a.timestamp - b.timestamp);
    return sortedSteps.find(step => step.timestamp > now);
  }, [data, now]);

  return upcoming;
};

export default function App() {
  const dates = Object.keys(groupedData).sort();
  const upcomingTask = useUpcomingTicketing(rawData);
  const [activeRound, setActiveRound] = useState('round1');

  return (
    // pb-[env(safe-area-inset-bottom)] 用于适配 iPhone 底部小黑条，防止内容被遮挡
    <div className="min-h-screen bg-slate-50 font-sans pb-[calc(env(safe-area-inset-bottom)+5rem)]">
      
      {/* 顶部导航区 (适配灵动岛和刘海屏：pt-[env(safe-area-inset-top)]) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 pt-[env(safe-area-inset-top)] shadow-sm">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-sm">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">单立人喜剧节</h1>
          </div>
          <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3.5 py-2 rounded-full border border-indigo-100 flex items-center hidden sm:flex">
            <Info className="w-4 h-4 mr-1.5" />
            统一开票日: 3月7日
          </div>
        </div>
      </header>

      {/* 主体内容区，适当增加左右内边距 px-5 */}
      <div className="max-w-4xl mx-auto px-5 sm:px-6 mt-6 sm:mt-8">
        {/* 轮次切换 Tabs */}
        <div className="flex space-x-2 sm:space-x-3 mb-6 p-1.5 bg-gray-200/70 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveRound('round1')}
            className={`px-6 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all duration-200 ${
              activeRound === 'round1' 
              ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-gray-900/5' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            第一轮开票
          </button>
          <button 
            onClick={() => setActiveRound('round2')}
            className={`px-6 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all duration-200 flex items-center gap-1.5 ${
              activeRound === 'round2' 
              ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-gray-900/5' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Timer className="w-4 h-4 sm:w-5 sm:h-5" /> 第二轮开票
          </button>
        </div>

        {/* 即将到来任务提示 */}
        {activeRound === 'round1' && upcomingTask && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-4 sm:p-5 rounded-2xl sm:rounded-3xl mb-4 flex items-start sm:items-center shadow-sm shadow-orange-100/50">
            <div className="bg-orange-100 p-3 rounded-full mr-4 shrink-0">
              <BellRing className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="text-orange-900 font-bold text-lg sm:text-xl flex flex-wrap items-center gap-2 mb-1.5">
                即将开启: {upcomingTask.dateStr} {upcomingTask.timeStr}
                <span className="bg-orange-600 text-white text-xs sm:text-sm px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                  {upcomingTask.label}
                </span>
              </div>
              <div className="text-orange-700/90 text-sm sm:text-base font-medium mt-2 sm:mt-0 leading-snug">
                涉及演出：{Array.from(upcomingTask.events).join('、')}
              </div>
            </div>
          </div>
        )}
      </div>

      {activeRound === 'round1' ? (
        <>
          {/* 加入 W & Y 专属作战计划 */}
          <div className="max-w-4xl mx-auto px-5 sm:px-6">
             <WYBattlePlan />
          </div>

          {/* 概览统计卡片 */}
          <div className="max-w-4xl mx-auto px-5 sm:px-6 mb-10">
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[2rem] p-6 sm:p-10 text-white shadow-xl shadow-indigo-900/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white/20 text-white px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wider border border-white/20 backdrop-blur-sm">
                    2026 单立人喜剧节
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 tracking-tight">第一轮开票概览</h2>
                <p className="text-indigo-200 mb-8 flex items-center gap-2 text-base sm:text-lg">
                  <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" /> 
                  <span className="font-medium text-white">明日开售！</span>演出单元首轮场次抢先看
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-white/10 flex items-start gap-4">
                    <Calendar className="w-7 h-7 text-indigo-300 shrink-0" />
                    <div>
                      <div className="text-indigo-200 text-sm sm:text-base mb-1">节展日期</div>
                      <div className="text-lg sm:text-xl font-bold">4月3日 - 4月12日</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-white/10 flex items-start gap-4">
                    <MapPin className="w-7 h-7 text-indigo-300 shrink-0" />
                    <div>
                      <div className="text-indigo-200 text-sm sm:text-base mb-1">举办地点</div>
                      <div className="text-lg sm:text-xl font-bold">阿那亚 · 秦皇岛</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-white/10 flex items-start gap-4">
                    <Smartphone className="w-7 h-7 text-indigo-300 shrink-0" />
                    <div>
                      <div className="text-indigo-200 text-sm sm:text-base mb-1">首轮购票平台</div>
                      <div className="text-sm sm:text-base font-bold leading-snug mt-1.5">单立人小程序 / 大麦 / 阿那亚App</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-white/10 flex items-start gap-4">
                    <Navigation className="w-7 h-7 text-yellow-300 shrink-0" />
                    <div>
                      <div className="text-yellow-200 text-sm sm:text-base mb-1.5 font-medium">场地温馨提示 (请预留时间)</div>
                      <div className="text-xs sm:text-sm font-bold text-white leading-relaxed">蜂巢剧场与A剧场相邻<br/>北岸馆较远，建议预留 30min 间隔</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 日程列表区 */}
          <main className="max-w-4xl mx-auto px-5 sm:px-6">
            {dates.map((date) => (
              <div key={date} className="mb-14">
                {/* 日期分隔头 */}
                <div className="flex items-center mb-8 sticky top-20 sm:top-24 z-40">
                  <div className="bg-indigo-100 text-indigo-800 font-extrabold px-5 py-2.5 rounded-xl text-lg sm:text-xl shadow-sm border border-indigo-200 flex items-center gap-2">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                    {date}
                  </div>
                  <div className="h-px bg-gradient-to-r from-indigo-200 to-transparent flex-1 ml-4 sm:ml-6"></div>
                </div>

                {/* 当日事件列表 */}
                <div className="pl-0 sm:pl-4">
                  {groupedData[date].map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </main>
        </>
      ) : (
        /* 第二轮开票占位页面 */
        <div className="max-w-4xl mx-auto px-5 sm:px-6 mt-8">
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center min-h-[500px] shadow-sm">
            <div className="bg-gray-100 p-6 rounded-full mb-6">
              <Timer className="w-14 h-14 text-gray-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">第二轮开票信息整理中</h3>
            <p className="text-gray-500 max-w-md leading-relaxed text-sm sm:text-base">
              第二轮的演出排期、抢票时间与座位图稍后公布，请留意后续更新，敬请期待！
            </p>
          </div>
        </div>
      )}
    </div>
  );
}