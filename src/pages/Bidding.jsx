import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Bidding({ session }) {
  const [properties, setProperties] = useState([]);
  const [bidInput, setBidInput] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const { data } = await supabase.from('properties').select('*').eq('is_active', true);
    if (data && data.length > 0) {
      setProperties(data);
    } else {
      setProperties([
        { id: 1, name: '서울 서초구 아파트 34평', appraised_value: 1500000000, min_bid: 1200000000, virtual_winning_bid: 1250000000, registry_status: '근저당 1건, 안전', explanation: '소멸되는 권리만 있으므로 낙찰 시 권리상 하자가 없는 안전한 물건입니다.' },
        { id: 2, name: '경기 성남시 오피스텔', appraised_value: 300000000, min_bid: 210000000, virtual_winning_bid: 215000000, registry_status: '임차인 대항력 있음 (주의)', explanation: '대항력 있는 임차인의 보증금을 인수해야 하므로 이를 감안하여 입찰가를 대폭 낮춰 써야 합니다.' }
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
      resText = '최저입찰가보다 낮게 쓰셨습니다.';
    } else if (bidAmount >= property.virtual_winning_bid) {
      isWin = true;
      resStatus = 'win';
      profitRate = ((property.appraised_value - bidAmount) / bidAmount) * 100;
      resText = `내부 경쟁자(${(property.virtual_winning_bid/100000000).toFixed(1)}억)를 이겼습니다! 예상 수익률: ${profitRate.toFixed(1)}%`;
    } else {
      resStatus = 'lose';
      resText = `경쟁자가 ${(property.virtual_winning_bid/100000000).toFixed(1)}억에 낙찰받았습니다.`;
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
    <div className="p-10 max-w-6xl mx-auto relative">
      <h3 className="text-xl font-semibold mb-6 border-l-4 border-accent-blue pl-2">가상 입찰 훈련소</h3>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {properties.map(p => (
          <div key={p.id} className="card-style flex flex-col p-0 overflow-hidden">
            <div className="h-40 bg-gradient-to-tr from-gray-900 to-gray-800 border-b border-gray-800 flex items-center justify-center text-text-muted text-lg">
              🏢 가상 매물 #{p.id}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h4 className="font-bold text-lg mb-6">{p.name}</h4>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-text-muted">감정가</span><span className="font-semibold text-white">{(p.appraised_value/100000000).toFixed(1)}억 원</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-muted">최저입찰가</span><span className="font-semibold text-danger">{(p.min_bid/100000000).toFixed(1)}억 원</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-muted">등기부 현황</span><span className="text-xs text-accent-light max-w-[60%] text-right font-medium">{p.registry_status}</span></div>
              </div>
              
              <div className="mt-auto flex gap-3">
                <input 
                  type="number" 
                  placeholder="입찰가 (만원 단위)" 
                  className="flex-1 bg-bg-main border border-gray-800 rounded-lg p-3 text-sm outline-none focus:border-accent-blue text-white"
                  value={bidInput[p.id] || ''}
                  onChange={(e) => setBidInput({...bidInput, [p.id]: e.target.value})}
                />
                <button onClick={() => handleBid(p)} className="bg-accent-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-blueHover shadow-lg shadow-accent-blue/20">입찰하기</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {result && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-bg-card p-10 rounded-2xl border border-gray-800 w-[500px] text-center shadow-2xl">
            <div className="text-5xl mb-4">
              {result.status === 'win' ? '🎉' : result.status === 'invalid' ? '❌' : '📉'}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">{result.status === 'win' ? '낙찰 성공!' : '패찰'}</h3>
            <p className="text-text-muted mb-6 text-sm">{result.text}</p>
            
            {result.status === 'lose' && (
              <div className="bg-bg-main p-5 rounded-lg mb-8 text-sm text-left border border-gray-800">
                <strong className="text-accent-blue block mb-2">오답 노트 해설:</strong> 
                <span className="text-text-muted leading-relaxed">{result.property.explanation}</span>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button onClick={() => setResult(null)} className="btn-primary w-1/2">확인</button>
              {result.status === 'lose' && (
                <button onClick={() => setResult(null)} className="w-1/2 py-3 border border-gray-700 rounded-lg hover:bg-bg-main text-sm font-semibold text-text-muted hover:text-white transition-all">다시 입찰</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
