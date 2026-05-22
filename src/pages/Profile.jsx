import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import DashboardCard from '../components/DashboardCard';
import WeeklyStudyChart from '../components/charts/WeeklyStudyChart';
import BidAccuracyChart from '../components/charts/BidAccuracyChart';
import WinRateChart from '../components/charts/WinRateChart';
import LevelHistoryChart from '../components/charts/LevelHistoryChart';

export default function Profile({ session }) {
  const [profile, setProfile] = useState(null);
  const [bids, setBids] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [accuracyData, setAccuracyData] = useState([]);
  const [winRateData, setWinRateData] = useState([]);
  const [levelData, setLevelData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 1. Fetch Profile
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (prof) {
      setProfile(prof);
      setLevelData(prof.level_history || [{ level: 1, date: prof.created_at }]);
    }

    // 2. Fetch Bids for Accuracy, WinRate, and List
    const { data: bidData } = await supabase.from('bid_history').select('*').eq('user_id', session.user.id).order('created_at', { ascending: true });
    if (bidData) {
      // Reverse for list display (newest first)
      setBids([...bidData].reverse());

      // Prepare Accuracy Data (last 10)
      const acc = bidData.slice(-10).map((b, i) => ({
        name: `${i+1}회`,
        accuracy: b.accuracy_rate ? parseFloat(b.accuracy_rate.toFixed(1)) : 0
      }));
      setAccuracyData(acc);

      // Prepare Win Rate Data
      let wins = 0;
      const wr = bidData.map((b, i) => {
        if (b.result === 'win') wins++;
        return {
          date: new Date(b.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
          rate: Math.round((wins / (i + 1)) * 100)
        };
      });
      setWinRateData(wr);
    }

    // 3. Fetch Quiz for Weekly
    const { data: quizData } = await supabase.from('quiz_attempts').select('created_at').eq('user_id', session.user.id);
    if (quizData) {
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const counts = [0,0,0,0,0,0,0];
      // Only count last 7 days roughly
      const now = new Date();
      quizData.forEach(q => {
        const d = new Date(q.created_at);
        if ((now - d) / (1000 * 60 * 60 * 24) < 7) {
          counts[d.getDay()]++;
        }
      });
      
      const chartData = [];
      for(let i=6; i>=0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        chartData.push({
          name: days[d.getDay()],
          count: counts[d.getDay()]
        });
      }
      setWeeklyData(chartData);
    }
  };

  if (!profile) return <div className="p-10 text-text-muted flex items-center justify-center min-h-[50vh]"><div className="animate-pulse text-xl">데이터를 불러오는 중입니다...</div></div>;

  const achievements = [
    { id: 1, title: '첫 낙찰 달성', desc: '가상 경매 첫 승리', icon: '🏆', achieved: true },
    { id: 2, title: '권리분석 루키', desc: '퀴즈 3회 정답', icon: '🤓', achieved: true },
    { id: 3, title: '연속 7일 접속', desc: '꾸준한 학습 증명', icon: '🔥', achieved: false },
    { id: 4, title: '수익률 20%', desc: '날카로운 분석', icon: '📈', achieved: false },
    { id: 5, title: '특수물건 마스터', desc: '위험 매물 낙찰', icon: '🛡️', achieved: false },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold mb-3 flex items-center gap-3">
          <span className="w-2 h-8 bg-accent-blue rounded-full shadow-[0_0_10px_#3B82F6]"></span>
          나의 성장 보고서
        </h2>
        <p className="text-text-muted text-lg">모의 입찰과 학습으로 쌓아올린 실력을 확인해 보세요.</p>
      </div>

      {/* Header Summary */}
      <div className="bg-bg-card border border-gray-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between mb-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="flex items-center gap-6 mb-6 md:mb-0 relative z-10">
          <div className="w-20 h-20 rounded-full border-2 border-accent-blue flex items-center justify-center text-4xl bg-bg-main shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            {profile.level >= 10 ? '👑' : profile.level >= 5 ? '🎖️' : '🌱'}
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-1 text-white">Lv. {profile.level} <span className="text-accent-blue">예비 투자자</span></h3>
            <p className="text-text-muted font-medium">현재 연속 <span className="text-white font-bold">{profile.streak || 1}일</span> 학습 중입니다! 🔥</p>
          </div>
        </div>
        <div className="flex gap-10 text-center relative z-10">
          <div>
            <div className="text-sm text-gray-500 mb-1 font-medium">총 입찰 참여</div>
            <div className="text-3xl font-extrabold text-white">{profile.bid_count}회</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1 font-medium">낙찰 성공</div>
            <div className="text-3xl font-extrabold text-success">{profile.win_count || 0}회</div>
          </div>
        </div>
      </div>

      {/* Achievements / Badges Section (v1: Hardcoded visualization) */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
          <span>🏅</span> 나의 업적 뱃지
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {achievements.map(badge => (
            <div 
              key={badge.id} 
              className={`flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-300 ${
                badge.achieved 
                  ? 'bg-bg-card border-accent-blue/40 shadow-[0_4px_20px_rgba(59,130,246,0.15)] hover:-translate-y-1' 
                  : 'bg-gray-900/50 border-gray-800 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 cursor-not-allowed'
              }`}
            >
              <div className={`text-4xl mb-3 ${badge.achieved ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : ''}`}>
                {badge.icon}
              </div>
              <h4 className="font-bold text-sm text-white mb-1">{badge.title}</h4>
              <p className="text-xs text-gray-500">{badge.desc}</p>
              {!badge.achieved && (
                <div className="mt-3 bg-gray-800 text-xs px-2 py-1 rounded text-gray-400 font-semibold flex items-center gap-1">
                  <span>🔒</span> 잠김
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <DashboardCard title="주간 학습량 (퀴즈 완료)">
          <WeeklyStudyChart data={weeklyData} />
        </DashboardCard>
        
        <DashboardCard title="최근 입찰 오차율 (0%에 가까울수록 완벽)">
          <BidAccuracyChart data={accuracyData} />
        </DashboardCard>

        <DashboardCard title="누적 낙찰 성공률 추이">
          <WinRateChart data={winRateData} />
        </DashboardCard>

        <DashboardCard title="레벨 성장 히스토리">
          <LevelHistoryChart data={levelData} />
        </DashboardCard>
      </div>

      {/* Full Bid History Table */}
      <div className="bg-bg-card border border-gray-800 rounded-2xl p-6 md:p-8 shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-white">전체 입찰 기록</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="pb-4 font-medium px-4">날짜</th>
                <th className="pb-4 font-medium px-4">물건명</th>
                <th className="pb-4 font-medium px-4">나의 입찰가</th>
                <th className="pb-4 font-medium px-4">실제 낙찰가</th>
                <th className="pb-4 font-medium px-4">오차율</th>
                <th className="pb-4 font-medium px-4 text-right">결과</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((b, i) => (
                <tr key={i} className="border-b border-gray-800/40 hover:bg-gray-800/30 transition-colors">
                  <td className="py-5 px-4 text-gray-500 font-medium">{new Date(b.created_at).toLocaleDateString('ko-KR')}</td>
                  <td className="py-5 px-4 font-bold text-white">{b.item_name}</td>
                  <td className="py-5 px-4 text-gray-300">{(b.bid_amount/100000000).toFixed(2)}억</td>
                  <td className="py-5 px-4 text-gray-500">{(b.winning_bid/100000000).toFixed(2)}억</td>
                  <td className="py-5 px-4 font-semibold text-accent-light">{b.accuracy_rate ? `${b.accuracy_rate.toFixed(1)}%` : '-'}</td>
                  <td className="py-5 px-4 text-right">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${b.result === 'win' ? 'bg-success/10 text-success border-success/30 shadow-[0_0_10px_rgba(0,200,81,0.1)]' : 'bg-danger/10 text-danger border-danger/30'}`}>
                      {b.result === 'win' ? '낙찰 성공' : '패찰'}
                    </span>
                  </td>
                </tr>
              ))}
              {bids.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500 font-medium">입찰 기록이 없습니다. 가상 입찰 훈련소에서 실력을 테스트해 보세요!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
