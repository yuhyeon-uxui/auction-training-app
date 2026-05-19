import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';

export default function Home({ session }) {
  const [profile, setProfile] = useState(null);
  const [recentBids, setRecentBids] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchRecentBids();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (data) setProfile(data);
  };

  const fetchRecentBids = async () => {
    const { data } = await supabase.from('bid_history').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(3);
    if (data) setRecentBids(data);
  };

  if (!profile) return <div className="p-10">Loading...</div>;

  const winRate = profile.bid_count > 0 ? Math.round((profile.win_count / profile.bid_count) * 100) : 0;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8">환영합니다, <span className="text-accent-blue">{session.user.email?.split('@')[0]}</span>님!</h2>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <DashboardCard title="나의 레벨">
          <div className="text-3xl font-bold text-accent-blue mb-2">Lv. {profile.level || 1}</div>
          <div className="w-full bg-bg-main h-1.5 rounded-full mt-4">
            <div className="bg-accent-blue h-full rounded-full shadow-[0_0_10px_#3B82F6]" style={{width: `${((profile.quiz_completed || 0) % 3) * 33.3}%`}}></div>
          </div>
          <div className="text-xs text-text-muted mt-2">연속 학습: <span className="text-white">{profile.streak || 0}일</span></div>
        </DashboardCard>
        
        <DashboardCard title="퀴즈 완료 개수">
          <div className="text-3xl font-bold">{profile.quiz_completed || 0}</div>
        </DashboardCard>

        <DashboardCard title="입찰 참여 횟수">
          <div className="text-3xl font-bold">{profile.bid_count || 0}</div>
          <div className="text-xs text-text-muted mt-2">낙찰 성공률: <span className={winRate >= 50 ? 'text-success' : 'text-danger'}>{winRate}%</span></div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-4 border-l-4 border-accent-blue pl-2">오늘 할 것</h3>
          <div className="space-y-4">
            <div className="card-style flex justify-between items-center cursor-pointer hover:border-accent-blue" onClick={() => navigate('/study')}>
              <div>
                <h4 className="font-semibold mb-1">개념 공부: 권리분석의 기초</h4>
                <p className="text-sm text-text-muted">말소기준권리를 찾고 인수되는 권리를 파악하세요.</p>
              </div>
              <button className="px-4 py-2 bg-accent-blue text-white rounded-lg text-sm font-semibold hover:bg-accent-blueHover transition-colors">바로가기</button>
            </div>
            <div className="card-style flex justify-between items-center cursor-pointer hover:border-accent-blue" onClick={() => navigate('/bid')}>
              <div>
                <h4 className="font-semibold mb-1">가상 입찰: 은마아파트 30평형</h4>
                <p className="text-sm text-text-muted">감정가 대비 최저입찰가 메리트를 분석하고 입찰가를 산정하세요.</p>
              </div>
              <button className="px-4 py-2 bg-accent-blue text-white rounded-lg text-sm font-semibold hover:bg-accent-blueHover transition-colors">바로가기</button>
            </div>
          </div>
        </div>
        
        <div className="card-style h-full">
          <h3 className="text-lg font-semibold mb-4 border-l-4 border-accent-blue pl-2">최근 입찰 기록</h3>
          {recentBids.length === 0 ? (
            <div className="text-center text-text-muted mt-10 text-sm">기록이 없습니다.</div>
          ) : (
            <ul className="space-y-4">
              {recentBids.map(bid => (
                <li key={bid.id} className="flex justify-between items-center border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium text-sm">{bid.item_name}</div>
                    <div className="text-xs text-text-muted">{(bid.bid_amount / 100000000).toFixed(2)}억 원 입찰</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${bid.result === 'win' ? 'bg-success/10 text-success border border-success/30' : 'bg-danger/10 text-danger border border-danger/30'}`}>
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
