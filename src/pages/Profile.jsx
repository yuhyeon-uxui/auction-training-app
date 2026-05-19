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

  if (!profile) return <div className="p-10 text-text-muted">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8 border-l-4 border-accent-blue pl-2">나의 성장 보고서</h2>

      {/* Header Summary */}
      <div className="card-style flex items-center justify-between mb-8 bg-gradient-to-r from-gray-900 to-bg-card border-accent-blue/30">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full border-2 border-accent-blue flex items-center justify-center text-2xl bg-bg-main shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            {profile.level >= 10 ? '👑' : profile.level >= 5 ? '🎖️' : '🌱'}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Lv. {profile.level} 입찰자</h3>
            <p className="text-sm text-text-muted">현재 연속 {profile.streak}일 학습 중입니다! 🔥</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-text-muted mb-1">총 입찰 참여</div>
          <div className="text-2xl font-bold text-white">{profile.bid_count}회</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardCard title="주간 학습량 (퀴즈 완료)">
          <WeeklyStudyChart data={weeklyData} />
        </DashboardCard>
        
        <DashboardCard title="최근 10회 입찰 정확도 (0에 가까울수록 완벽)">
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
      <div className="card-style">
        <h3 className="text-lg font-semibold mb-6">전체 입찰 기록</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-text-muted border-b border-gray-800">
                <th className="pb-3 font-medium">날짜</th>
                <th className="pb-3 font-medium">물건명</th>
                <th className="pb-3 font-medium">나의 입찰가</th>
                <th className="pb-3 font-medium">실제 낙찰가</th>
                <th className="pb-3 font-medium">정확도(오차)</th>
                <th className="pb-3 font-medium text-right">결과</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((b, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors">
                  <td className="py-4 text-text-muted">{new Date(b.created_at).toLocaleDateString()}</td>
                  <td className="py-4 font-medium text-white">{b.item_name}</td>
                  <td className="py-4 text-white">{(b.bid_amount/100000000).toFixed(2)}억</td>
                  <td className="py-4 text-text-muted">{(b.winning_bid/100000000).toFixed(2)}억</td>
                  <td className="py-4 font-medium text-white">{b.accuracy_rate ? `${b.accuracy_rate.toFixed(1)}%` : '-'}</td>
                  <td className="py-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.result === 'win' ? 'bg-success/10 text-success border border-success/30' : 'bg-danger/10 text-danger border border-danger/30'}`}>
                      {b.result === 'win' ? '낙찰' : '패찰'}
                    </span>
                  </td>
                </tr>
              ))}
              {bids.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-text-muted">입찰 기록이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
