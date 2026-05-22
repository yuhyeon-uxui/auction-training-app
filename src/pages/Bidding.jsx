import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Bidding({ session }) {
  const [properties, setProperties] = useState([]);
  const [bidInput, setBidInput] = useState({});
  const [result, setResult] = useState(null);

  // 간단한 흔들림 애니메이션용 CSS 주입
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const { data } = await supabase.from('properties').select('*').eq('is_active', true);
    if (data && data.length > 0) {
      setProperties(data);
    } else {
      setProperties([
        { 
          id: 1, 
          name: '서울 서초구 아파트 34평형', 
          appraised_value: 1500000000, 
          min_bid: 1200000000, 
          virtual_winning_bid: 1250000000, 
          registry_status: '근저당 1건 (인수 권리 없음)', 
          explanation: '소멸되는 권리만 있으므로 낙찰 시 권리상 하자가 없는 깨끗하고 안전한 물건입니다.',
          badge: '안전',
          badgeColor: 'bg-success/20 text-success border-success/30',
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80'
        },
        { 
          id: 2, 
          name: '경기 성남시 분당구 오피스텔', 
          appraised_value: 300000000, 
          min_bid: 210000000, 
          virtual_winning_bid: 215000000, 
          registry_status: '임차인 대항력 있음 (주의)', 
          explanation: '대항력 있는 임차인의 보증금을 낙찰자가 전액 인수해야 하므로, 이를 감안하여 입찰가를 대폭 낮춰 쓰거나 입찰을 포기해야 합니다.',
          badge: '위험',
          badgeColor: 'bg-danger/20 text-danger border-danger/30',
          image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=500&q=80'
        },
        { 
          id: 3, 
          name: '서울 강남구 역삼동 상가', 
          appraised_value: 2000000000, 
          min_bid: 1600000000, 
          virtual_winning_bid: 1750000000, 
          registry_status: '가압류 2건, 선순위 전세권 (배당요구함)', 
          explanation: '선순위 전세권자가 배당을 요구했으므로 매각으로 소멸됩니다. 수익률 분석에 집중하면 되는 물건입니다.',
          badge: '보통',
          badgeColor: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
          image: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?auto=format&fit=crop&w=500&q=80'
        },
        { 
          id: 4, 
          name: '인천 연수구 송도동 아파트 40평형', 
          appraised_value: 900000000, 
          min_bid: 630000000, 
          virtual_winning_bid: 780000000, 
          registry_status: '유치권 신고 있음', 
          explanation: '유치권이 신고되어 있으나, 현장 조사 결과 성립 요건을 갖추지 못한 허위 유치권일 확률이 높습니다. 정확한 조사가 필요합니다.',
          badge: '주의',
          badgeColor: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
          image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=80'
        },
        { 
          id: 5, 
          name: '부산 해운대구 우동 빌라', 
          appraised_value: 250000000, 
          min_bid: 160000000, 
          virtual_winning_bid: 195000000, 
          registry_status: '소유자 점유 중 (인수 권리 없음)', 
          explanation: '권리상 하자가 전혀 없고 소유자가 점유 중이므로, 인도명령을 통해 수월하게 명도가 가능한 우량 물건입니다.',
          badge: '안전',
          badgeColor: 'bg-success/20 text-success border-success/30',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80'
        }
      ]);
    }
  };

  const handleBid = async (property) => {
    const val = bidInput[property.id];
    if (!val) return;
    const bidAmount = parseInt(val) * 10000;
    
    let isWin = false;
    let resStatus = '';
    let resText = '';
    let profitRate = 0;
    const accuracy = Math.abs(property.virtual_winning_bid - bidAmount) / property.virtual_winning_bid * 100;

    if (bidAmount < property.min_bid) {
      resStatus = 'invalid';
      resText = '앗! 최저입찰가보다 낮게 쓰셨습니다. (입찰 무효)';
    } else if (bidAmount >= property.virtual_winning_bid) {
      isWin = true;
      resStatus = 'win';
      profitRate = ((property.appraised_value - bidAmount) / bidAmount) * 100;
      resText = `가상의 경쟁자(${(property.virtual_winning_bid/100000000).toFixed(2)}억)를 이겼습니다! 예상 수익률: ${profitRate.toFixed(1)}%`;
    } else {
      resStatus = 'lose';
      resText = `가상의 경쟁자가 ${(property.virtual_winning_bid/100000000).toFixed(2)}억에 낙찰받았습니다.`;
    }

    setResult({ property, status: resStatus, text: resText, profitRate, isWin });

    await supabase.from('bid_history').insert([{
      user_id: session.user.id,
      property_id: property.id,
      item_name: property.name,
      bid_amount: bidAmount,
      winning_bid: property.virtual_winning_bid,
      accuracy_rate: accuracy,
      result: resStatus === 'win' ? 'win' : 'lose',
      profit_rate: isWin ? profitRate : 0
    }]);

    const { data: profile } = await supabase.from('profiles').select('bid_count, win_count').eq('id', session.user.id).single();
    if (profile) {
      await supabase.from('profiles').update({
        bid_count: (profile.bid_count || 0) + 1,
        win_count: isWin ? (profile.win_count || 0) + 1 : (profile.win_count || 0)
      }).eq('id', session.user.id);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto relative">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold mb-3 flex items-center gap-3">
          <span className="w-2 h-8 bg-accent-blue rounded-full shadow-[0_0_10px_#3B82F6]"></span>
          가상 입찰 훈련소
        </h2>
        <p className="text-text-muted text-lg">가상의 실전 매물에 직접 입찰가를 적어보고 경쟁에서 승리해 보세요!</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {properties.map(p => (
          <div key={p.id} className="bg-bg-card rounded-2xl border border-gray-800 flex flex-col overflow-hidden hover:border-accent-blue/40 transition-colors shadow-lg hover:shadow-accent-blue/10">
            {/* Property Image Thumbnail */}
            <div 
              className="h-56 bg-cover bg-center relative border-b border-gray-800" 
              style={{ backgroundImage: `url('${p.image || ''}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-1.5 rounded-lg text-sm font-bold border backdrop-blur-md ${p.badgeColor || 'bg-accent-blue/20 text-accent-blue border-accent-blue/30'}`}>
                  {p.badge || '경매 진행중'}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="font-bold text-2xl text-white drop-shadow-md">{p.name}</h4>
              </div>
            </div>
            
            {/* Property Details */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="bg-gray-900/50 rounded-xl p-4 space-y-3 mb-6 border border-gray-800/50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">감정가</span>
                  <span className="font-bold text-white text-lg">{(p.appraised_value/100000000).toFixed(1)}억 원</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">최저입찰가</span>
                  <span className="font-bold text-danger text-lg">{(p.min_bid/100000000).toFixed(1)}억 원</span>
                </div>
                <div className="w-full h-px bg-gray-800 my-2"></div>
                <div className="flex justify-between items-start text-sm">
                  <span className="text-gray-400 whitespace-nowrap mr-4">등기부 현황</span>
                  <span className={`text-right font-medium ${p.badge === '위험' ? 'text-danger' : 'text-accent-blue'}`}>
                    {p.registry_status}
                  </span>
                </div>
              </div>
              
              {/* Bid Input */}
              <div className="mt-auto flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">만원</span>
                  <input 
                    type="number" 
                    placeholder="입찰가를 입력하세요" 
                    className="w-full bg-bg-main border border-gray-700 rounded-xl p-4 pr-12 text-base outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue text-white transition-all"
                    value={bidInput[p.id] || ''}
                    onChange={(e) => setBidInput({...bidInput, [p.id]: e.target.value})}
                  />
                </div>
                <button 
                  onClick={() => handleBid(p)} 
                  className="bg-accent-blue text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all hover:-translate-y-0.5 whitespace-nowrap"
                >
                  입찰하기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Result Modal */}
      {result && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`bg-bg-card p-8 md:p-10 rounded-2xl border ${result.status === 'win' ? 'border-success shadow-[0_0_50px_rgba(0,200,81,0.2)]' : 'border-danger shadow-[0_0_50px_rgba(255,68,68,0.2)]'} w-full max-w-lg text-center transform transition-all ${result.status === 'win' ? 'animate-bounce' : 'animate-shake'}`} style={{ animationIterationCount: 1 }}>
            <div className="text-6xl mb-6 drop-shadow-xl">
              {result.status === 'win' ? '🎉' : result.status === 'invalid' ? '⚠️' : '💸'}
            </div>
            <h3 className={`text-3xl font-extrabold mb-4 ${result.status === 'win' ? 'text-success' : 'text-danger'}`}>
              {result.status === 'win' ? '축하합니다! 낙찰 성공' : result.status === 'invalid' ? '입찰 무효' : '아쉬운 패찰'}
            </h3>
            <p className="text-white text-lg font-medium mb-8 leading-relaxed break-keep">{result.text}</p>
            
            {/* 오답 노트 / 해설 */}
            {(result.status === 'lose' || result.status === 'invalid' || result.status === 'win') && (
              <div className="bg-bg-main p-5 rounded-xl mb-8 text-sm text-left border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">💡</span>
                  <strong className="text-accent-blue text-base">전문가의 피드백</strong> 
                </div>
                <span className="text-gray-300 leading-relaxed block mt-2">
                  {result.property.explanation}
                </span>
                {result.status === 'win' && result.property.badge === '위험' && (
                  <div className="mt-3 text-danger font-bold">
                    ⚠️ 주의: 대항력 있는 세입자의 보증금을 물어주게 되어 오히려 손해를 볼 수 있습니다!
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setResult(null)} 
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-bold transition-all border border-gray-700"
              >
                닫기
              </button>
              {(result.status === 'lose' || result.status === 'invalid') && (
                <button 
                  onClick={() => setResult(null)} 
                  className="flex-1 bg-accent-blue hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                >
                  재도전
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
