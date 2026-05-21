import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';

export default function Home({ session }) {
  const [profile, setProfile] = useState(null);
  const [recentBids, setRecentBids] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      fetchProfile();
      fetchRecentBids();
    }
  }, [session]);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (data) setProfile(data);
  };

  const fetchRecentBids = async () => {
    if (!session?.user?.id) return;
    const { data } = await supabase.from('bid_history').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(3);
    if (data) setRecentBids(data);
  };

  if (!session) {
    return (
      <div className="p-10 max-w-6xl mx-auto flex flex-col items-center justify-center text-center min-h-[70vh]">
        <div className="text-6xl mb-6">🏘️</div>
        <h1 className="text-4xl font-extrabold text-white mb-6 leading-tight">
          실전 감각을 키우는 <br/><span className="text-accent-blue text-5xl">가상 부동산 경매 훈련소</span>
        </h1>
        <p className="text-lg text-text-muted mb-10 max-w-2xl">
          위험 부담 없이 실제 경매 데이터를 바탕으로 모의 입찰을 연습하고, 권리분석 능력을 키워보세요.
        </p>
        <button onClick={() => navigate('/login')} className="px-8 py-4 bg-accent-blue hover:bg-blue-600 text-white font-bold rounded-xl text-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          무료로 시작하기
        </button>
      </div>
    );
  }

  if (!profile) return <div className="p-10 text-text-muted animate-pulse">데이터를 불러오는 중입니다...</div>;

  const winRate = profile.bid_count > 0 ? Math.round((profile.win_count / profile.bid_count) * 100) : 0;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-2">환영합니다, <span className="text-accent-blue">{session.user.email?.split('@')[0]}</span>님! 👋</h2>
        <p className="text-text-muted text-lg">오늘도 경매 실전 감각을 키워볼까요?</p>
      </div>

      {/* 핵심 지표 요약 (KPI) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <DashboardCard title="현재 나의 레벨">
          <div className="flex items-end gap-3 mb-2">
            <div className="text-4xl font-extrabold text-white">Lv.{profile.level || 1}</div>
            <div className="text-sm text-accent-blue font-semibold mb-1">
              {profile.level >= 10 ? '고수' : profile.level >= 5 ? '중수' : '초보'}
            </div>
          </div>
          <div className="w-full bg-bg-main h-2 rounded-full mt-4 border border-gray-800">
            <div className="bg-accent-blue h-full rounded-full shadow-[0_0_10px_#3B82F6] transition-all duration-1000" style={{width: `${((profile.quiz_completed || 0) % 3) * 33.3}%`}}></div>
          </div>
          <div className="text-xs text-text-muted mt-3 flex justify-between">
            <span>연속 학습 스트릭</span>
            <span className="text-white font-bold">{profile.streak || 0}일 🔥</span>
          </div>
        </DashboardCard>
        
        <DashboardCard title="완료한 개념 퀴즈">
          <div className="text-4xl font-extrabold text-white">{profile.quiz_completed || 0}<span className="text-lg text-text-muted font-medium ml-1">개</span></div>
          <div className="text-xs text-text-muted mt-4">꾸준한 학습이 권리분석의 힘입니다.</div>
        </DashboardCard>

        <DashboardCard title="모의 입찰 성적">
          <div className="text-4xl font-extrabold text-white">{profile.bid_count || 0}<span className="text-lg text-text-muted font-medium ml-1">회 참여</span></div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-3">
            <span className="text-xs text-text-muted">누적 낙찰 성공률</span>
            <span className={`text-sm font-bold ${winRate >= 50 ? 'text-success drop-shadow-[0_0_5px_rgba(0,200,81,0.5)]' : 'text-danger'}`}>{winRate}%</span>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 바로가기 섹션 */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <span className="w-2 h-6 bg-accent-blue rounded-full shadow-[0_0_8px_#3B82F6]"></span>
            오늘 할 것 (투두 리스트)
          </h3>
          <div className="space-y-4">
            <div className="card-style flex justify-between items-center cursor-pointer group" onClick={() => navigate('/study')}>
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📚</div>
                <div>
                  <h4 className="font-bold text-white mb-1 group-hover:text-accent-blue transition-colors">개념 공부: 권리분석의 기초</h4>
                  <p className="text-sm text-text-muted">말소기준권리를 찾고 인수되는 권리를 파악하세요.</p>
                </div>
              </div>
              <button className="px-5 py-2 bg-bg-main border border-gray-700 text-white rounded-lg text-sm font-semibold group-hover:bg-accent-blue group-hover:border-accent-blue transition-all shadow-lg">시작하기</button>
            </div>

            <div className="card-style flex justify-between items-center cursor-pointer group" onClick={() => navigate('/bid')}>
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">⚖️</div>
                <div>
                  <h4 className="font-bold text-white mb-1 group-hover:text-success transition-colors">가상 입찰: 은마아파트 30평형</h4>
                  <p className="text-sm text-text-muted">감정가 대비 최저가 메리트를 분석하고 입찰하세요.</p>
                </div>
              </div>
              <button className="px-5 py-2 bg-bg-main border border-gray-700 text-white rounded-lg text-sm font-semibold group-hover:bg-success group-hover:border-success transition-all shadow-lg">도전하기</button>
            </div>
          </div>
        </div>
        
        {/* 최근 기록 섹션 */}
        <div className="card-style h-full bg-gradient-to-b from-bg-card to-bg-main">
          <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <span className="w-2 h-6 bg-gray-600 rounded-full"></span>
            최근 입찰 기록
          </h3>
          {recentBids.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="text-4xl mb-3 opacity-50">📭</div>
              <div className="text-sm text-text-muted">아직 입찰 기록이 없습니다.<br/>첫 가상 입찰에 도전해 보세요!</div>
            </div>
          ) : (
            <ul className="space-y-4">
              {recentBids.map(bid => (
                <li key={bid.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-800/50 transition-colors">
                  <div>
                    <div className="font-medium text-sm text-white mb-1">{bid.item_name}</div>
                    <div className="text-xs text-text-muted">{(bid.bid_amount / 100000000).toFixed(2)}억 원 입찰</div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide ${bid.result === 'win' ? 'bg-success/20 text-success border border-success/30' : 'bg-danger/10 text-danger border border-danger/30'}`}>
                    {bid.result === 'win' ? '낙찰' : '패찰'}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
