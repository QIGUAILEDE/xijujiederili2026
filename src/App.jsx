import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Train, 
  Ticket, 
  Utensils, 
  Footprints, 
  Home, 
  Bus, 
  AlertTriangle,
  Edit3,
  CheckCircle,
  Map,
  ArrowDownCircle,
  BusFront,
  Navigation,
  Image as ImageIcon
} from 'lucide-react';

// 初始默认数据
const initialSchedule = [
  { id: '1', date: '4月10日', time: '下午', type: 'train', name: '北京 - 阿那亚', location: '高铁信息待补充' },
  { id: '2', date: '4月10日', time: '22:30', type: 'show', name: '奇墨开放麦', location: '阿那亚蜂巢剧场' },
  { id: '3', date: '4月11日', time: '09:30', type: 'activity', name: '“为爱起跑”3km公益跑活动', location: '阿那亚园区' },
  { id: '4', date: '4月11日', time: '13:00', type: 'activity', name: '海边读书会', location: 'naive理想国' },
  { id: '5', date: '4月11日', time: '14:00 - 15:30', type: 'show', name: '半决赛-1', location: '阿那亚A剧场' },
  { id: '6', date: '4月11日', time: '16:30 - 18:00', type: 'show', name: '半决赛-2', location: '阿那亚A剧场' },
  { id: '7', date: '4月11日', time: '19:30 - 21:00', type: 'show', name: '半决赛-3', location: '阿那亚A剧场' },
  { id: '8', date: '4月12日', time: '12:00', type: 'food', name: '王哥卤味', location: '码头鱼市西侧档口' },
  { id: '9', date: '4月12日', time: '12:00 - 14:00', type: 'activity', name: '开局桌游', location: '阿那亚艺术中心北岸馆2号展厅' },
  { id: '10', date: '4月12日', time: '14:30', type: 'show', name: '决赛', location: '阿那亚艺术中心北岸馆' },
  { id: '11', date: '4月12日', time: '18:00', type: 'show', name: '奇墨开放麦', location: '阿那亚蜂巢剧场' },
  { id: '12', date: '4月12日', time: '19:30', type: 'show', name: '天才的三个夜晚', location: '阿那亚艺术中心北岸馆' },
  { id: '13', date: '4月12日', time: '22:00', type: 'activity', name: 'HELLO KT & DJ BATTLE', location: '阿那亚社区灯光足球场地下车库' },
  { id: '14', date: '4月13日', time: '全天', type: 'train', name: '阿那亚 - 北京', location: '高铁信息待补充' }
];

const initialInfo = {
  hotel: '阿那亚六期21-206 (4.10 - 4.12 住宿)'
};

// 类型UI映射字典
const typeMap = {
  train: { icon: Train, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200', tag: '交通' },
  show: { icon: Ticket, color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200', tag: '演出' },
  food: { icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200', tag: '美食' },
  activity: { icon: Footprints, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200', tag: '活动' },
};

// 识别区域的辅助函数
const getZone = (location) => {
  if (!location) return null;
  if (location.includes('北岸') || location.includes('码头鱼市') || location.includes('跳海')) return '北岸';
  if (location.includes('A剧场') || location.includes('蜂巢') || location.includes('理想国') || 
      location.includes('苏卡') || location.includes('游乐场') || location.includes('足球场') || location.includes('图书馆')) return '南区';
  return '未知';
};

// 计算交通建议的组件
const TransitConnector = ({ curr, next }) => {
  if (!curr.location || !next.location || curr.type === 'train' || next.type === 'train' || curr.location === next.location) return null;

  const currZone = getZone(curr.location);
  const nextZone = getZone(next.location);
  
  let suggestion = null;

  // 1. 匹配 4.12 专属演出接驳车
  if (curr.date === '4月12日') {
    if (curr.location.includes('蜂巢') && next.location.includes('北岸')) {
      suggestion = { type: 'special', text: '演出专属接驳车：蜂巢剧场 ➔ 阿那亚艺术中心北岸馆', icon: BusFront, color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-200' };
    } else if (curr.location.includes('北岸') && (next.location.includes('游乐场') || next.location.includes('足球场'))) {
      suggestion = { type: 'special', text: '演出专属接驳车：北岸馆 ➔ DLR游乐场 (海边灯光足球场)', icon: BusFront, color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-200' };
    } else if (curr.location.includes('北岸') && next.location.includes('A剧场')) {
      suggestion = { type: 'special', text: '演出专属接驳车：北岸馆 ➔ A剧场', icon: BusFront, color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-200' };
    }
  }

  // 2. 匹配跨区穿梭巴士
  if (!suggestion && currZone !== nextZone && currZone !== '未知' && nextZone !== '未知') {
    suggestion = { 
      type: 'cross', 
      text: `乘坐南北区穿梭巴士 (${currZone} ➔ ${nextZone}，相距约4Km，预留30分+)`, 
      icon: Bus, 
      color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' 
    };
  }

  // 3. 匹配同区交通
  if (!suggestion && currZone === nextZone && currZone !== '未知') {
    suggestion = { 
      type: 'walk', 
      text: `同在${currZone}，可步行或乘免费园区接驳车`, 
      icon: Navigation, 
      color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200' 
    };
  }

  if (!suggestion) return null;

  const { icon: SuggestionIcon, color, bg, border, text, type } = suggestion;

  return (
    <div className="relative flex gap-3 sm:gap-5 mb-6 sm:mb-8 group">
      {/* 连接虚线 */}
      <div className="w-px border-l-2 border-dashed border-indigo-200 absolute left-[23px] sm:left-[39px] -top-8 bottom-[-8px] z-0"></div>
      
      {/* 左侧占位符保持对齐 */}
      <div className="w-12 sm:w-20 shrink-0"></div>
      
      {/* 提示内容 */}
      <div className={`z-10 relative flex-1 ${bg} ${border} border rounded-xl p-3 sm:p-4 shadow-sm flex items-start sm:items-center gap-3 ${type === 'special' ? 'ring-2 ring-purple-300 ring-offset-1' : ''}`}>
        <div className={`p-1.5 bg-white rounded-lg shadow-sm shrink-0 ${color}`}>
          <SuggestionIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className={`text-[14px] sm:text-base font-bold ${color} leading-snug break-words`}>
          {text}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [isEditMode, setIsEditMode] = useState(false);
  
  // 从本地存储加载数据或使用默认数据
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('aranya_schedule_v2');
    return saved ? JSON.parse(saved) : initialSchedule;
  });
  const [info, setInfo] = useState(() => {
    const saved = localStorage.getItem('aranya_info_v2');
    return saved ? JSON.parse(saved) : initialInfo;
  });

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem('aranya_schedule_v2', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('aranya_info_v2', JSON.stringify(info));
  }, [info]);

  // 按日期分组
  const groupedSchedule = schedule.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {});
  const dates = Object.keys(groupedSchedule);

  // 更新日程
  const handleUpdateSchedule = (id, field, value) => {
    setSchedule(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // 渲染日程卡片
  const EventCard = ({ event }) => {
    const { icon: Icon, color, bg, border, tag } = typeMap[event.type] || typeMap.activity;

    return (
      <div className={`relative flex gap-3 sm:gap-5 group mb-6 sm:mb-8`}>
        {/* 时间轴线 */}
        <div className="w-px bg-indigo-100 absolute left-[23px] sm:left-[39px] top-12 bottom-[-24px] z-0 hidden sm:block group-last:hidden"></div>
        
        {/* 左侧类型图标 */}
        <div className={`z-10 ${bg} ${color} border-2 ${border} rounded-2xl h-12 w-12 sm:h-20 sm:w-20 flex flex-col items-center justify-center shrink-0 shadow-sm transition-transform self-start sm:self-auto`}>
          <Icon className="w-5 h-5 sm:w-8 sm:h-8" />
        </div>

        {/* 卡片主体 */}
        <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-5 flex-1 relative overflow-hidden transition-all duration-200 ${isEditMode ? 'ring-2 ring-indigo-300 ring-offset-2' : 'hover:shadow-md'}`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 sm:mb-4">
            <div className="flex-1 w-full">
              {/* 时间与标签 */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold ${bg} ${color}`}>
                  {tag}
                </span>
                {isEditMode ? (
                  <input 
                    value={event.time} 
                    onChange={(e) => handleUpdateSchedule(event.id, 'time', e.target.value)}
                    className="font-mono text-base sm:text-base font-bold text-gray-700 bg-gray-50 border-b border-gray-300 focus:outline-none focus:border-indigo-500 px-1 w-32"
                  />
                ) : (
                  <span className="font-mono text-sm sm:text-base font-bold text-gray-500 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" /> {event.time}
                  </span>
                )}
              </div>
              
              {/* 名称 */}
              {isEditMode ? (
                <input 
                  value={event.name} 
                  onChange={(e) => handleUpdateSchedule(event.id, 'name', e.target.value)}
                  className="text-base sm:text-xl font-extrabold text-gray-800 w-full bg-gray-50 border-b border-gray-300 focus:outline-none focus:border-indigo-500 px-1 py-0.5 mb-1"
                />
              ) : (
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 tracking-tight leading-snug mb-1 break-words">
                  {event.name}
                </h3>
              )}
            </div>
          </div>

          {/* 地点信息 */}
          <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            {isEditMode ? (
              <textarea 
                value={event.location} 
                onChange={(e) => handleUpdateSchedule(event.id, 'location', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded p-1 text-base focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none min-h-[44px]"
                rows={2}
              />
            ) : (
              <span className="font-medium leading-relaxed break-words">{event.location}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-[calc(env(safe-area-inset-bottom)+6rem)]">
      
      {/* 顶部导航区 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 pt-[env(safe-area-inset-top)] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between py-3 sm:py-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-sm">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">我的阿那亚之旅</h1>
          </div>
          <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100 flex items-center">
            2026 喜剧节
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-6 pt-1">
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 text-[15px] sm:text-base font-bold transition-all border-b-2 ${
              activeTab === 'schedule' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            我的日程
          </button>
          <button 
            onClick={() => setActiveTab('transport')}
            className={`pb-3 text-[15px] sm:text-base font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'transport' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            交通 & 住宿
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-5 sm:mt-8">
        {/* ===================== 日程表 Tab ===================== */}
        {activeTab === 'schedule' && (
          <div className="animate-in fade-in duration-300">
            {dates.map((date) => (
              <div key={date} className="mb-10 sm:mb-14">
                {/* 日期头 */}
                <div className="flex items-center mb-6 sm:mb-8 sticky top-28 sm:top-32 z-40">
                  <div className="bg-indigo-900 text-white font-extrabold px-5 py-2 sm:py-2.5 rounded-xl text-lg sm:text-xl shadow-md border border-indigo-800 flex items-center gap-2">
                    {date}
                  </div>
                  <div className="h-px bg-gradient-to-r from-indigo-200 to-transparent flex-1 ml-4 sm:ml-6"></div>
                </div>

                {/* 列表 */}
                <div className="pl-0 sm:pl-4">
                  {groupedSchedule[date].map((event, index) => {
                    const nextEvent = groupedSchedule[date][index + 1];
                    return (
                      <React.Fragment key={event.id}>
                        <EventCard event={event} />
                        {nextEvent && <TransitConnector curr={event} next={nextEvent} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================== 交通与住宿 Tab ===================== */}
        {activeTab === 'transport' && (
          <div className="animate-in fade-in duration-300 space-y-6 sm:space-y-8">
            
            {/* 阿那亚园区地图占位图 */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-100">
               <div className="relative w-full rounded-2xl overflow-hidden bg-gray-100 flex flex-col items-center justify-center border border-gray-200 min-h-[250px] sm:min-h-[350px]">
                  {/* 当您的本地目录中有 map.png 时，这行代码会将其渲染出来 */}
                  <img 
                    src="./map.png" 
                    alt="阿那亚园区地图" 
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* 图片未加载时的 fallback 占位 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-6 text-center" style={{ display: 'none' }}>
                    <Map className="w-12 h-12 mb-3 text-gray-300" />
                    <p className="font-bold text-gray-500 mb-1">阿那亚园区地图</p>
                    <p className="text-sm">请将地图图片命名为 <code className="bg-gray-200 px-1 rounded text-rose-500">map.png</code></p>
                    <p className="text-sm">并放在项目根目录（与 src 同级）的 public 文件夹内</p>
                  </div>
               </div>
            </div>

            {/* 住宿信息卡片 */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4 text-indigo-900">
                <div className="bg-indigo-100 p-2.5 rounded-xl"><Home className="w-6 h-6 text-indigo-600" /></div>
                <h2 className="text-xl sm:text-2xl font-extrabold">住宿信息</h2>
              </div>
              <div className={`bg-indigo-50/50 rounded-2xl p-4 sm:p-5 border border-indigo-100 transition-all ${isEditMode ? 'ring-2 ring-indigo-300' : ''}`}>
                {isEditMode ? (
                  <input 
                    value={info.hotel} 
                    onChange={(e) => setInfo({...info, hotel: e.target.value})}
                    className="w-full text-base sm:text-lg font-bold text-gray-800 bg-white border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-indigo-500"
                    placeholder="请输入住宿信息"
                  />
                ) : (
                  <div className="text-lg font-bold text-gray-800 break-words">{info.hotel}</div>
                )}
              </div>
            </div>

            {/* 4.12 演出专属接驳车信息 */}
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-3xl p-6 sm:p-8 shadow-sm border border-purple-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 text-purple-900">
                  <div className="bg-purple-200 p-2.5 rounded-xl"><BusFront className="w-6 h-6 text-purple-700" /></div>
                  <h2 className="text-xl sm:text-2xl font-extrabold">4月12日 (周日) 演出专属接驳</h2>
                </div>
                <div className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold border border-purple-700 shrink-0 self-start sm:self-auto shadow-sm">
                  仅此日适用
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/80 rounded-2xl p-4 border border-purple-100 shadow-sm flex flex-col sm:flex-row gap-3">
                  <div className="font-bold text-purple-800 shrink-0 min-w-[140px]">14:30 - 16:00</div>
                  <div>
                    <div className="font-bold text-gray-800 flex items-center gap-2">
                       北岸馆 <span className="text-purple-400">➔</span> 浪浪演播厅 (苏卡酒店停车场)
                    </div>
                    <div className="text-sm text-gray-500 mt-1">《决赛》结束后接驳</div>
                  </div>
                </div>

                <div className="bg-white/80 rounded-2xl p-4 border border-purple-100 shadow-sm flex flex-col sm:flex-row gap-3">
                  <div className="font-bold text-purple-800 shrink-0 min-w-[140px]">18:00 - 19:30</div>
                  <div>
                    <div className="font-bold text-gray-800 flex items-center gap-2">
                       蜂巢剧场 <span className="text-purple-400">➔</span> 阿那亚艺术中心北岸馆
                    </div>
                    <div className="text-sm text-gray-500 mt-1">《奇墨开放麦》结束后接驳</div>
                  </div>
                </div>

                <div className="bg-white/80 rounded-2xl p-4 border border-purple-100 shadow-sm flex flex-col sm:flex-row gap-3">
                  <div className="font-bold text-purple-800 shrink-0 min-w-[140px]">19:30 - 21:00</div>
                  <div>
                    <div className="font-bold text-gray-800 flex items-center gap-2">
                       北岸馆 <span className="text-purple-400">➔</span> DLR游乐场 (海边灯光足球场)
                    </div>
                    <div className="text-sm text-gray-500 mt-1">《天才的三个夜晚》结束后接驳</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 园区交通指南 - 南北穿梭 (重点警告) */}
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 text-rose-900">
                  <div className="bg-rose-100 p-2.5 rounded-xl"><Bus className="w-6 h-6 text-rose-600" /></div>
                  <h2 className="text-xl sm:text-2xl font-extrabold">南北区穿梭巴士 (收费)</h2>
                </div>
                <div className="bg-white/60 px-3 py-1.5 rounded-lg text-sm font-bold text-rose-700 border border-rose-200 shrink-0 self-start sm:self-auto">
                  2元/人/次 · 间隔10-15分
                </div>
              </div>

              {/* 堵车预警 */}
              <div className="bg-white/80 rounded-2xl p-4 sm:p-5 border border-rose-200 flex gap-3 sm:gap-4 mb-6 shadow-sm">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-orange-900 text-base sm:text-lg mb-1">重点防堵塞预警！</div>
                  <div className="text-sm sm:text-base text-orange-800/80 leading-relaxed">
                    路线经过主干道，节假日车多极易堵车、延迟。<b>建议至少提前 30 分钟出发</b>，以免错过演出！
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium">
                <div className="flex items-center gap-2 bg-white/50 p-3 rounded-xl border border-rose-100/50">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" /> 南区苏卡酒店停车场 (邻里中心总站)
                </div>
                <div className="flex items-center gap-2 bg-white/50 p-3 rounded-xl border border-rose-100/50">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" /> 南区儿童农庄临时站点
                </div>
                <div className="flex items-center gap-2 bg-white/50 p-3 rounded-xl border border-rose-100/50">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" /> 北岸西门站
                </div>
                <div className="flex items-center gap-2 bg-white/50 p-3 rounded-xl border border-rose-100/50">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" /> 北岸雀跃镇站
                </div>
              </div>
            </div>

            {/* 园区交通指南 - 免费接驳 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center gap-3 mb-6 text-emerald-900">
                <div className="bg-emerald-100 p-2.5 rounded-xl"><Map className="w-6 h-6 text-emerald-600" /></div>
                <h2 className="text-xl sm:text-2xl font-extrabold">园区免费接驳车对应站点</h2>
              </div>

              <div className="space-y-6">
                {/* 南区 */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-6 bg-emerald-400 rounded-full block"></span> 目的地：南区
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="font-bold text-gray-700 min-w-[140px]">A剧场 / 蜂巢 / 酒神 / naive理想国</div>
                      <div className="hidden sm:block text-gray-300">➔</div>
                      <div className="text-emerald-700 font-medium bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 w-fit">剧场站 / 沙丘美术馆站 上下车</div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="font-bold text-gray-700 min-w-[140px]">浪浪演播厅 (苏卡)</div>
                      <div className="hidden sm:block text-gray-300">➔</div>
                      <div className="text-emerald-700 font-medium bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 w-fit">邻里中心站 / 邻里中心总站 上下车</div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="font-bold text-gray-700 min-w-[140px]">DLR游乐场</div>
                      <div className="hidden sm:block text-gray-300">➔</div>
                      <div className="text-emerald-700 font-medium bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 w-fit">灯光足球场站 上下车</div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="font-bold text-gray-700 min-w-[140px]">孤独图书馆</div>
                      <div className="hidden sm:block text-gray-300">➔</div>
                      <div className="text-emerald-700 font-medium bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 w-fit">礼堂站 上下车</div>
                    </div>
                  </div>
                </div>

                {/* 北岸 */}
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-400 rounded-full block"></span> 目的地：北岸
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="font-bold text-gray-700 min-w-[140px]">北岸馆 / 跳海hood / 码头鱼市</div>
                    <div className="hidden sm:block text-gray-300">➔</div>
                    <div className="text-blue-700 font-medium bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 w-fit">北岸西门站 / 北岸雀跃镇站 上下车</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </main>

      {/* 悬浮编辑按钮 */}
      <button
        onClick={() => setIsEditMode(!isEditMode)}
        className={`fixed bottom-8 sm:bottom-12 right-5 sm:right-8 z-50 flex items-center gap-2 px-5 py-3.5 rounded-full shadow-lg transition-all duration-300 font-bold text-white ${
          isEditMode 
            ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30 ring-4 ring-emerald-500/20' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
        }`}
      >
        {isEditMode ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>保存修改</span>
          </>
        ) : (
          <>
            <Edit3 className="w-5 h-5" />
            <span className="hidden sm:inline">编辑行程与信息</span>
            <span className="sm:hidden">编辑</span>
          </>
        )}
      </button>

      {/* 编辑模式提示横幅 */}
      {isEditMode && (
        <div className="fixed top-[env(safe-area-inset-top)] left-0 w-full bg-emerald-500 text-white text-center py-2 text-sm font-bold z-[60] shadow-md animate-in slide-in-from-top flex items-center justify-center gap-2">
          <Edit3 className="w-4 h-4" /> 
          已开启编辑模式，请直接在页面上点击文字进行修改（修改自动保存）
        </div>
      )}
    </div>
  );
}