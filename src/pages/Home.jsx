import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import FadeIn from '../components/FadeIn';

export default function Home({ session }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const scrollRef = useRef(null);
  const [recentBids, setRecentBids] = useState([]);
  const [showQuizTooltip, setShowQuizTooltip] = useState(false);

  useEffect(() => {
    if (session) {
      fetchProfile();
      fetchRecentBids();
    }
  }, [session]);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (error) console.error("Profile error:", error);
      
      if (data) setProfile(data);
      else setProfile({ level: 1, quiz_completed: 0, bid_count: 0, win_count: 0, streak: 0 });
    } catch (err) {
      console.error("Fetch profile exception:", err);
      setProfile({ level: 1, quiz_completed: 0, bid_count: 0, win_count: 0, streak: 0 });
    }
  };

  const fetchRecentBids = async () => {
    if (!session?.user?.id) return;
    try {
      const { data } = await supabase.from('bid_history').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(3);
      if (data) setRecentBids(data);
    } catch (err) {
      console.error("Fetch bids exception:", err);
    }
  };


  // -------------------------------------------------------------
  // 비회원 랜딩 뷰 (Landing Page)
  // -------------------------------------------------------------
  if (!session) {
    const terms = ['말소기준권리', '권리분석', '감정가', '최저입찰가', '낙찰', '패찰', '유찰', '배당', '명도', '등기부등본', '근저당', '전세권', '대항력', '확정일자', 'LTV', 'DSR'];

    return (
      <div className="bg-[#121214] min-h-screen text-white font-['Inter'] relative overflow-x-hidden leading-[1.5]">
        {/* 1. Hero Section */}
        <section className="h-[400px] md:h-[460px] flex flex-col items-center justify-center text-center px-10 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a24] to-[#121214] opacity-50 z-0 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-0 pointer-events-none"></div>
          
          <div className="z-10 animate-fade-in-up mt-4 w-full px-4 flex flex-col items-center">
            <h1 
              className="text-4xl md:text-[48px] font-extrabold mb-4 tracking-tight break-keep text-center"
              style={{ lineHeight: 1.17 }}
            >
              돈 잃지 않는 <br />
              <span className="text-accent-blue bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-accent-blue inline-block mt-1">부동산 파트너, 부메이트</span>
            </h1>
            <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto font-medium break-keep text-center">
              위험 부담 없이 실전 감각을 키우세요<br/>
              <span className="text-sm md:text-base text-gray-500 mt-3 inline-block">5개 학습 단원 · 5개 실전 매물 · 16개 핵심 용어</span>
            </p>
            <button onClick={() => navigate('/login')} className="px-6 py-3 text-base md:px-10 md:py-5 bg-accent-blue hover:bg-blue-600 text-white font-bold rounded-2xl md:text-lg transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.3)] w-auto">
              무료로 시작하기
            </button>
          </div>
        </section>

        {/* 2. Trend Tags Section (★핵심) */}
        <FadeIn delay={300}>
          <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col items-center">
            <div className="flex flex-col items-center gap-2 mb-10">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight text-center">예비 투자자들이 가장 많이 찾는 경매 필수 용어</h2>
              <p className="text-sm md:text-base text-text-muted text-center m-0">궁금한 카테고리의 용어를 터치하여 확인해보세요!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {/* 카테고리 1 */}
              <div className="bg-bg-card border border-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-4 text-accent-light flex items-center gap-2"><span className="text-xl">🔍</span> 권리분석 기초</h3>
                <div className="flex flex-wrap gap-2">
                  {['말소기준권리', '권리분석', '등기부등본', '대항력'].map((term, i) => (
                    <span key={i} className="glossary-term cursor-pointer px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-lg text-text-muted text-sm font-medium transition-all hover:text-accent-blue hover:border-accent-blue hover:bg-accent-blue/10">#{term}</span>
                  ))}
                </div>
              </div>
              {/* 카테고리 2 */}
              <div className="bg-bg-card border border-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-4 text-success flex items-center gap-2"><span className="text-xl">⚖️</span> 입찰 및 낙찰</h3>
                <div className="flex flex-wrap gap-2">
                  {['감정가', '최저입찰가', '낙찰', '패찰', '유찰', '명도'].map((term, i) => (
                    <span key={i} className="glossary-term cursor-pointer px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-lg text-text-muted text-sm font-medium transition-all hover:text-accent-blue hover:border-accent-blue hover:bg-accent-blue/10">#{term}</span>
                  ))}
                </div>
              </div>
              {/* 카테고리 3 */}
              <div className="bg-bg-card border border-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-4 text-purple-400 flex items-center gap-2"><span className="text-xl">💰</span> 대출 및 배당</h3>
                <div className="flex flex-wrap gap-2">
                  {['배당', '근저당', '전세권', '확정일자', 'LTV', 'DSR'].map((term, i) => (
                    <span key={i} className="glossary-term cursor-pointer px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-lg text-text-muted text-sm font-medium transition-all hover:text-accent-blue hover:border-accent-blue hover:bg-accent-blue/10">#{term}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 3. 오늘의 부동산 지식 한 스푼 */}
        <FadeIn delay={600}>
          <section className="py-20 px-6 max-w-7xl mx-auto border-t border-gray-800/50">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
              오늘의 부동산 지식 한 스푼
            </h2>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 md:grid md:grid-cols-4 md:overflow-visible -mx-6 px-6 md:mx-0 md:px-0 md-hide-scrollbar">
              <div className="bg-bg-card p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-accent-blue/50 transition-colors shrink-0 w-[280px] md:w-auto snap-center flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-500/20 text-accent-blue rounded-xl flex items-center justify-center text-2xl mb-4">🏦</div>
                <h3 className="text-lg md:text-xl font-bold mb-3 break-keep">대출 용어 1분 요약</h3>
                <p className="text-text-muted leading-relaxed text-sm md:text-base break-keep">
                  집을 담보로 빌릴 수 있는 비율은 <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer">LTV</span>, 내 소득 대비 대출 원리금 상환 비율은 <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer">DSR</span>이라고 부릅니다.
                </p>
              </div>
              <div className="bg-bg-card p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-accent-blue/50 transition-colors shrink-0 w-[280px] md:w-auto snap-center flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center text-2xl mb-4">🛡️</div>
                <h3 className="text-lg md:text-xl font-bold mb-3 break-keep">전입신고의 중요성</h3>
                <p className="text-text-muted leading-relaxed text-sm md:text-base break-keep">
                  이사 후 <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer">전입신고</span>를 해야 제3자에게 임차권을 주장할 수 있는 <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer">대항력</span>이 생깁니다.
                </p>
              </div>
              <div 
                className="bg-bg-card p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-accent-blue/50 transition-colors shrink-0 w-[280px] md:w-auto snap-center flex flex-col items-center text-center cursor-pointer relative"
                onClick={() => setShowQuizTooltip(!showQuizTooltip)}
              >
                <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center text-2xl mb-4">📝</div>
                <h3 className="text-lg md:text-xl font-bold mb-3 break-keep">경매 OX 퀴즈</h3>
                <p className="text-text-muted leading-relaxed text-sm md:text-base break-keep">
                  "세입자가 있는 집이 경매로 넘어갔다. 내 보증금은 무조건 안전하다?" <br/>
                  <span className="text-accent-blue/80 text-sm mt-3 inline-block font-medium bg-accent-blue/10 px-3 py-1 rounded-full">눌러서 정답 확인하기</span>
                </p>
                
                {showQuizTooltip && (
                  <div className="absolute inset-0 bg-bg-card/95 backdrop-blur-md rounded-2xl border border-accent-blue p-6 flex flex-col items-center justify-center animate-fade-in z-10 shadow-lg">
                    <div className="text-3xl mb-3">❌</div>
                    <h4 className="text-lg font-bold text-white mb-2">정답은 X</h4>
                    <p className="text-sm text-gray-300 break-keep leading-relaxed">
                      <span 
                        className="glossary-term text-accent-light underline decoration-dotted cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >확정일자</span>와 선순위 권리를 꼭 확인해야 합니다.
                    </p>
                    <p className="text-xs text-gray-500 mt-4 font-medium">(닫으려면 터치)</p>
                  </div>
                )}
              </div>
              <div className="bg-bg-card p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-accent-blue/50 transition-colors shrink-0 w-[280px] md:w-auto snap-center flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-xl flex items-center justify-center text-2xl mb-4">🔑</div>
                <h3 className="text-lg md:text-xl font-bold mb-3 break-keep">말소기준권리란?</h3>
                <p className="text-text-muted leading-relaxed text-sm md:text-base break-keep">
                  등기부상에서 인수와 소멸의 기준이 되는 권리입니다. <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer">근저당</span>, 가압류 등이 주로 해당됩니다.
                </p>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 4. 가상 매물 미리보기 (Teaser) */}
        <FadeIn delay={900}>
          <section className="py-20 px-6 max-w-7xl mx-auto border-t border-gray-800/50 relative">
            <h2 className="text-3xl font-bold mb-12 text-center">지금 핫한 가상 경매 매물 🔥</h2>
            
            <div className="relative group max-w-full">
              {/* Left Gradient Overlay for smooth cutoff */}
              <div className="absolute top-0 bottom-0 left-0 w-8 md:w-16 bg-gradient-to-r from-[#121214] to-transparent z-10 pointer-events-none"></div>
              
              {/* Right Gradient Overlay for smooth cutoff */}
              <div className="absolute top-0 bottom-0 right-0 w-8 md:w-16 bg-gradient-to-l from-[#121214] to-transparent z-10 pointer-events-none"></div>

              {/* Desktop Left Arrow */}
              <button 
                onClick={() => scrollRef.current?.scrollBy({ left: -360, behavior: 'smooth' })}
                className="absolute -left-6 lg:-left-10 top-[40%] -translate-y-1/2 z-10 hidden md:flex items-center justify-center text-gray-600 hover:text-white transition-colors"
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              
              {/* Desktop Right Arrow */}
              <button 
                onClick={() => scrollRef.current?.scrollBy({ left: 360, behavior: 'smooth' })}
                className="absolute -right-6 lg:-right-10 top-[40%] -translate-y-1/2 z-10 hidden md:flex items-center justify-center text-gray-600 hover:text-white transition-colors"
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>

              <div 
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 pt-4 px-2 md:px-2 relative z-0 md-hide-scrollbar"
              >
                <style dangerouslySetInnerHTML={{__html: `
                  /* Mobile custom scrollbar (very thin) */
                  .md-hide-scrollbar::-webkit-scrollbar { height: 2px; }
                  .md-hide-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 2px; }
                  .md-hide-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
                  .md-hide-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) rgba(255,255,255,0.05); }

                  /* Desktop hide scrollbar */
                  @media (min-width: 768px) {
                    .md-hide-scrollbar::-webkit-scrollbar { display: none; }
                    .md-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                  }
                `}} />
              {[
                { id: 1, name: '서울 강남구 도곡동 아파트 34평형', status: '유찰 2회', statusColor: 'bg-danger/20 text-danger border-danger/30', appraised: '20.0억', minBid: '12.8억', icon: '🏢' },
                { id: 2, name: '경기 용인시 수지구 빌라', status: '신건', statusColor: 'bg-success/20 text-success border-success/30', appraised: '3.5억', minBid: '3.5억', icon: '🏘️' },
                { id: 3, name: '서울 마포구 공덕동 1층 상가', status: '유찰 1회', statusColor: 'bg-orange-500/20 text-orange-500 border-orange-500/30', appraised: '15.0억', minBid: '12.0억', icon: '🏪' },
                { id: 4, name: '부산 해운대구 오피스텔', status: '유찰 3회', statusColor: 'bg-danger/20 text-danger border-danger/30', appraised: '4.2억', minBid: '2.1억', icon: '🏙️' },
                { id: 5, name: '인천 연수구 송도동 아파트 40평형', status: '신건', statusColor: 'bg-success/20 text-success border-success/30', appraised: '11.5억', minBid: '11.5억', icon: '🏢' },
                { id: 6, name: '제주 서귀포시 타운하우스', status: '유찰 1회', statusColor: 'bg-orange-500/20 text-orange-500 border-orange-500/30', appraised: '8.0억', minBid: '6.4억', icon: '🏡' },
              ].map(item => (
                <div key={item.id} className="bg-bg-card rounded-2xl border border-gray-800 overflow-hidden flex flex-col shrink-0 w-[280px] md:w-[360px] snap-center shadow-lg transition-transform hover:-translate-y-1">
                  <div className="h-40 bg-gradient-to-tr from-gray-900 to-gray-800 flex items-center justify-center text-text-muted relative">
                    <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-lg border ${item.statusColor}`}>
                      {item.status}
                    </span>
                    <span className="absolute top-4 right-4 text-2xl">{item.icon}</span> 
                    <span className="font-semibold text-gray-200 text-base md:text-lg text-center px-6 break-keep">{item.name}</span>
                  </div>
                  <div className="p-5 md:p-6 relative">
                    <div className="flex justify-between items-end mb-4">
                      <div className="text-text-muted text-xs md:text-sm">감정가 <span className={item.status !== '신건' ? 'line-through block' : 'block'}>{item.appraised}</span></div>
                      <div className={`${item.status === '신건' ? 'text-white' : 'text-danger'} font-bold text-lg md:text-xl`}>최저가 {item.minBid}</div>
                    </div>
                    <div className="relative flex items-center justify-center py-2 h-[88px]">
                      {/* Background skeleton lines */}
                      <div className="absolute inset-0 space-y-2 opacity-30 pt-4 px-1 pointer-events-none">
                        <div className="h-4 bg-gray-600 rounded w-full"></div>
                        <div className="h-4 bg-gray-600 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-600 rounded w-4/6"></div>
                      </div>
                      {/* Glass button */}
                      <button onClick={() => navigate('/login')} className="w-full py-3 relative z-10 bg-gray-500/20 hover:bg-gray-500/30 backdrop-blur-md text-white text-xs md:text-sm font-semibold rounded-xl border border-gray-500/30 transition-all shadow-lg break-keep">
                        로그인 후 등기부 분석 🔒
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 5. 서비스 특장점 (미니멀) */}
        <FadeIn delay={1200}>
          <section className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-800/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-accent-blue mb-5">
                  <svg width="28" height="28" className="md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 break-keep">리스크 0, 연습</h3>
                <p className="text-text-muted text-sm md:text-base break-keep px-2">위험 부담 없는 가상 실전 연습</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-accent-blue mb-5">
                  <svg width="28" height="28" className="md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 break-keep">실제 데이터</h3>
                <p className="text-text-muted text-sm md:text-base break-keep px-2">실제 법원 경매 사건 100% 구현</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-accent-blue mb-5">
                  <svg width="28" height="28" className="md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 break-keep">게임같은 학습</h3>
                <p className="text-text-muted text-sm md:text-base break-keep px-2">미션을 통한 재미있는 경매 학습</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-accent-blue mb-5">
                  <svg width="28" height="28" className="md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 break-keep">권리분석 제공</h3>
                <p className="text-text-muted text-sm md:text-base break-keep px-2">복잡한 권리분석을 한눈에 파악</p>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 6. 푸터 CTA */}
        <FadeIn delay={1500}>
          <section className="py-24 md:py-32 px-6 text-center border-t border-gray-800/50 bg-gradient-to-b from-transparent to-accent-blue/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 break-keep">16개 핵심 경매 용어 · 실전 가상 입찰 훈련 시작하기</h2>
            <button onClick={() => navigate('/login')} className="px-6 py-3 text-base md:px-12 md:py-5 bg-accent-blue hover:bg-blue-600 text-white font-bold rounded-2xl md:text-xl transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.3)] w-auto min-w-[200px]">
              무료 가입하기
            </button>
          </section>
        </FadeIn>
      </div>
    );
  }

  if (!profile) return <div className="p-10 text-text-muted animate-pulse">데이터를 동기화 중입니다... (잠시만 기다려주세요)</div>;

  const winRate = profile.bid_count > 0 ? Math.round((profile.win_count / profile.bid_count) * 100) : 0;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-2">환영합니다, <span className="text-accent-blue">{session.user.user_metadata?.nickname || session.user.email?.split('@')[0]}</span>님! 👋</h2>
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
            <span className="text-white font-bold">{session.user.user_metadata?.streak || 1}일 🔥</span>
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
