import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const formatCurrencyKRW = (amount) => {
  if (!amount || isNaN(amount)) return '0원';
  
  const EOK = 100000000;
  const MAN = 10000;
  
  if (amount >= EOK) {
    const eokPart = Math.floor(amount / EOK);
    const manPart = Math.floor((amount % EOK) / MAN);
    if (manPart > 0) {
      return `${eokPart.toLocaleString()}억 ${manPart.toLocaleString()}만원`;
    }
    return `${eokPart.toLocaleString()}억원`;
  } else if (amount >= MAN) {
    return `${Math.floor(amount / MAN).toLocaleString()}만원`;
  }
  return `${amount.toLocaleString()}원`;
};

export default function Bidding({ session }) {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bidInput, setBidInput] = useState('');
  const [result, setResult] = useState(null);
  const [completedPropertyIds, setCompletedPropertyIds] = useState([]);

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
          case_number: '2023타경10234',
          court: '서울중앙지방법원 [경매1계]',
          name: '서울 서초구 반포동 아파트 34평형', 
          appraised_value: 1500000000, 
          min_bid: 1200000000, 
          virtual_winning_bid: 1250000000, 
          registry_status: '근저당 1건 (인수 권리 없음)', 
          usage: '아파트',
          land_area: '34.2㎡ (10.3평)',
          building_area: '84.9㎡ (25.7평)',
          appraisal_date: '2023-10-15',
          bid_date: '2024-05-30',
          feedback: {
            win: '권리상 하자가 없는 깨끗한 물건을 적절한 가격에 낙찰받으셨네요! 명도만 신속하게 진행하면 훌륭한 투자가 될 것입니다.',
            lose: '안전한 물건이라 경쟁이 치열했습니다. 권리 하자가 없는 만큼 수익률 눈높이를 조금 낮춰 입찰하는 전략이 필요합니다.',
            invalid: '최저입찰가 미만으로는 입찰할 수 없습니다! 법원에서 정한 최저가 이상으로 적어야 유효합니다.'
          },
          badge: '안전',
          badgeColor: 'bg-success/20 text-success border-success/30',
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 2, 
          case_number: '2023타경8471',
          court: '수원지방법원 성남지원 [경매3계]',
          name: '경기 성남시 분당구 정자동 오피스텔', 
          appraised_value: 300000000, 
          min_bid: 210000000, 
          virtual_winning_bid: 215000000, 
          registry_status: '임차인 대항력 있음 (전입: 2021.05.10)', 
          usage: '오피스텔',
          land_area: '15.5㎡ (4.7평)',
          building_area: '45.2㎡ (13.7평)',
          appraisal_date: '2023-08-20',
          bid_date: '2024-06-15',
          feedback: {
            win: '앗! 대항력 있는 임차인의 보증금을 전액 인수해야 합니다. 겉보기엔 싸게 낙찰받은 것 같지만, 보증금 인수액을 합치면 오히려 손해일 수 있습니다.',
            lose: '다행입니다! 대항력 있는 임차인이 있는 물건은 인수해야 할 보증금을 정확히 파악하기 전까지는 입찰을 피하는 것이 상책입니다.',
            invalid: '최저입찰가 미만으로는 입찰할 수 없습니다. 하지만 이 물건은 대항력 임차인이 있으므로 차라리 무효가 된 것이 다행일지도 모릅니다!'
          },
          badge: '위험',
          badgeColor: 'bg-danger/20 text-danger border-danger/30',
          image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 3, 
          case_number: '2022타경57388',
          court: '서울동부지방법원 본원 [경매4계]',
          name: '서울 강동구 천호동 다세대 빌라', 
          appraised_value: 463000000, 
          min_bid: 130320000, 
          virtual_winning_bid: 145000000, 
          registry_status: '가압류 2건, 선순위 전세권 (배당요구함)', 
          usage: '다세대',
          land_area: '26.4㎡ (7.9평)',
          building_area: '38.6㎡ (11.6평)',
          appraisal_date: '2022-12-05',
          bid_date: '2024-08-15',
          feedback: {
            win: '성공입니다! 선순위 전세권자가 배당을 요구했으므로 매각으로 소멸됩니다. 권리 분석을 정확히 하셨군요.',
            lose: '선순위 전세권이 배당요구로 소멸된다는 사실을 눈치챈 경쟁자들이 많았습니다. 다음에는 좀 더 과감히 베팅해 보세요.',
            invalid: '유찰이 많이 되어 최저입찰가가 매우 낮습니다만, 그 이하로는 입찰할 수 없습니다.'
          },
          badge: '기회',
          badgeColor: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
          image: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 4, 
          case_number: '2024타경58264',
          court: '서울서부지방법원 [경매5계]',
          name: '서울 마포구 신공덕동 모던하우스', 
          appraised_value: 594000000, 
          min_bid: 32656000, 
          virtual_winning_bid: 50000000, 
          registry_status: '유찰 13회, 임차권등기, 선순위임차인', 
          usage: '상가',
          land_area: '44.01㎡ (13.3평)',
          building_area: '51.14㎡ (15.5평)',
          appraisal_date: '2024-01-10',
          bid_date: '2026-06-23',
          feedback: {
            win: '유찰이 많이 된 데에는 이유가 있습니다. 선순위 임차인의 보증금 액수를 파악하셨나요? 명도 비용과 합치면 배보다 배꼽이 더 클 수 있습니다.',
            lose: '다행입니다. 이런 복잡한 권리 관계를 가진 상가는 초보자가 접근하기에 매우 위험합니다.',
            invalid: '유찰 횟수가 많아 최저입찰가가 매우 낮지만 법정 최저가 밑으로는 쓸 수 없습니다.'
          },
          badge: '위험',
          badgeColor: 'bg-danger/20 text-danger border-danger/30',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 5, 
          case_number: '2024타경130570',
          court: '서울남부지방법원 [경매2계]',
          name: '서울 영등포구 신길동 보라매SK뷰', 
          appraised_value: 1360000000, 
          min_bid: 557056000, 
          virtual_winning_bid: 950000000, 
          registry_status: '특별매각조건 (주의 필요)', 
          usage: '아파트',
          land_area: '71.24㎡ (21.5평)',
          building_area: '136.74㎡ (41.4평)',
          appraisal_date: '2024-02-15',
          bid_date: '2026-06-04',
          feedback: {
            win: '낙찰 축하합니다. 하지만 특별매각조건이 붙은 물건은 대출이 안 나오거나 예상치 못한 인수 금액이 있을 수 있으니 자금 조달 계획을 꼼꼼히 세워야 합니다.',
            lose: '특별매각조건 때문에 입찰을 망설이셨나요? 철저히 분석된 경우 엄청난 기회가 되기도 합니다.',
            invalid: '최저입찰가 규칙을 위반했습니다. 다시 도전해 보세요.'
          },
          badge: '주의',
          badgeColor: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
          image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 6, 
          case_number: '2023타경58135',
          court: '서울동부지방법원 [경매1계]',
          name: '서울 송파구 송파동 성보팰리채', 
          appraised_value: 360000000, 
          min_bid: 12666000, 
          virtual_winning_bid: 250000000, 
          registry_status: '유찰 15회, 선순위위장전입 의심', 
          usage: '단독주택',
          land_area: '30㎡ (9.1평)',
          building_area: '20.39㎡ (6.2평)',
          appraisal_date: '2023-11-20',
          bid_date: '2026-06-08',
          feedback: {
            win: '과감한 베팅! 선순위 위장 전입을 확신하셨다면 대박 물건입니다. 하지만 진짜 임차인이었다면 큰 손실이 날 수 있습니다.',
            lose: '너무 신중하셨네요! 특수 물건은 수익률이 높지만 리스크가 크므로 입찰가 산정에 더욱 신경 써야 합니다.',
            invalid: '입찰 무효입니다. 15회나 유찰된 물건이지만 최저가 이상을 입력해 주세요.'
          },
          badge: '기회',
          badgeColor: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 7, 
          case_number: '2024타경121266',
          court: '서울중앙지방법원 [경매7계]',
          name: '서울 서초구 양재동 피카소', 
          appraised_value: 599000000, 
          min_bid: 51454000, 
          virtual_winning_bid: 250000000, 
          registry_status: '임차권등기, 선순위임차인', 
          usage: '아파트',
          land_area: '19.04㎡ (5.8평)',
          building_area: '29.81㎡ (9평)',
          appraisal_date: '2024-01-05',
          bid_date: '2026-06-18',
          feedback: {
            win: '선순위 임차인이 존재하므로 낙찰 대금 외에 보증금을 인수해야 할 수 있습니다. 권리 분석을 다시 한 번 확인해보세요.',
            lose: '선순위 임차인 리스크를 잘 피하셨거나, 보증금 인수액을 고려해 보수적으로 접근하신 것이 패인일 수 있습니다.',
            invalid: '최저 입찰가를 확인해 주세요.'
          },
          badge: '위험',
          badgeColor: 'bg-danger/20 text-danger border-danger/30',
          image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 8, 
          case_number: '2025타경51835',
          court: '서울서부지방법원 [경매3계]',
          name: '서울 용산구 한강로1가 용산파크자이', 
          appraised_value: 628000000, 
          min_bid: 401920000, 
          virtual_winning_bid: 480000000, 
          registry_status: '유찰2회 (권리상 하자 없음)', 
          usage: '아파트',
          land_area: '8.71㎡ (2.6평)',
          building_area: '52.58㎡ (15.9평)',
          appraisal_date: '2024-03-10',
          bid_date: '2026-06-16',
          feedback: {
            win: '안전하고 수요가 많은 아파트를 적절한 가격에 낙찰받았습니다! 좋은 투자입니다.',
            lose: '경쟁이 치열한 인기 물건입니다. 시세 조사를 꼼꼼히 하여 입찰가를 조금 더 과감하게 써보세요.',
            invalid: '입찰가 입력 오류입니다. 단위와 금액을 다시 확인해 보세요.'
          },
          badge: '안전',
          badgeColor: 'bg-success/20 text-success border-success/30',
          image: 'https://images.unsplash.com/photo-1542314831-c6a4d14092b3?auto=format&fit=crop&w=800&q=80'
        },
        { 
          id: 9, 
          case_number: '2024타경105680',
          court: '서울남부지방법원 [경매1계]',
          name: '서울 영등포구 양평동4가 코쿤빌', 
          appraised_value: 121000000, 
          min_bid: 61952000, 
          virtual_winning_bid: 85000000, 
          registry_status: '대항력포기 세대 (안전)', 
          usage: '연립',
          land_area: '8.12㎡ (2.5평)',
          building_area: '14.77㎡ (4.5평)',
          appraisal_date: '2024-02-01',
          bid_date: '2026-06-02',
          feedback: {
            win: '임차인이 대항력을 포기한 확약서가 제출된 매우 안전한 물건을 잘 찾으셨네요! 훌륭합니다.',
            lose: '대항력 포기 물건은 겉보기엔 위험해 보이지만 실제론 안전해서 인기가 많습니다. 더 공격적으로 베팅해 보세요.',
            invalid: '최저 입찰가에 미달하여 무효 처리되었습니다.'
          },
          badge: '안전',
          badgeColor: 'bg-success/20 text-success border-success/30',
          image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80'
        }
      ]);
    }
  };

  const handleBid = async () => {
    if (!bidInput) return;
    const bidAmount = parseInt(bidInput) * 10000;
    
    if (isNaN(bidAmount) || bidAmount <= 0) {
      return;
    }
    if (bidAmount > selectedProperty.appraised_value * 2) {
      return;
    }
    
    let isWin = false;
    let resStatus = '';
    let resText = '';
    let profitRate = 0;
    let feedbackText = '';
    const accuracy = Math.abs(selectedProperty.virtual_winning_bid - bidAmount) / selectedProperty.virtual_winning_bid * 100;

    if (bidAmount < selectedProperty.min_bid) {
      resStatus = 'invalid';
      resText = '앗! 최저입찰가보다 낮게 쓰셨습니다. (입찰 무효)';
      feedbackText = selectedProperty.feedback.invalid;
    } else if (bidAmount >= selectedProperty.virtual_winning_bid) {
      isWin = true;
      resStatus = 'win';
      // 수정된 수익률 로직: (감정가 - 낙찰가) / 감정가 * 100
      profitRate = ((selectedProperty.appraised_value - bidAmount) / selectedProperty.appraised_value) * 100;
      resText = `가상의 경쟁자(${(selectedProperty.virtual_winning_bid/100000000).toFixed(2)}억)를 이겼습니다! 예상 수익률: ${profitRate.toFixed(1)}%`;
      feedbackText = selectedProperty.feedback.win;
    } else {
      resStatus = 'lose';
      resText = `가상의 경쟁자가 ${(selectedProperty.virtual_winning_bid/100000000).toFixed(2)}억에 낙찰받았습니다.`;
      feedbackText = selectedProperty.feedback.lose;
    }

    const competitors = Math.floor(Math.random() * 21) + 15; // 15 ~ 35명

    setResult({ 
      property: selectedProperty, 
      status: resStatus, 
      text: resText, 
      profitRate, 
      isWin, 
      feedbackText,
      bidAmount,
      competitors
    });

    await supabase.from('bid_history').insert([{
      user_id: session.user.id,
      property_id: selectedProperty.id,
      item_name: selectedProperty.name,
      bid_amount: bidAmount,
      winning_bid: selectedProperty.virtual_winning_bid,
      accuracy_rate: accuracy,
      result: resStatus === 'win' ? 'win' : 'lose',
      profit_rate: isWin ? profitRate : 0
    }]);

    if (isWin && !completedPropertyIds.includes(selectedProperty.id)) {
      setCompletedPropertyIds([...completedPropertyIds, selectedProperty.id]);
    }

    const { data: profile } = await supabase.from('profiles').select('bid_count, win_count').eq('id', session.user.id).single();
    if (profile) {
      await supabase.from('profiles').update({
        bid_count: (profile.bid_count || 0) + 1,
        win_count: isWin ? (profile.win_count || 0) + 1 : (profile.win_count || 0)
      }).eq('id', session.user.id);
    }
  };

  const closeResult = () => {
    setResult(null);
    setBidInput('');
    setSelectedProperty(null);
  };

  // List View
  if (!selectedProperty) {
    return (
      <div className="p-6 md:p-10 max-w-6xl mx-auto relative">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold mb-3 flex items-center gap-3">
            <span className="w-2 h-8 bg-accent-blue rounded-full shadow-[0_0_10px_#3B82F6]"></span>
            가상 입찰 훈련소
          </h2>
          <p className="text-text-muted text-lg">가상의 실전 매물에 직접 입찰가를 적어보고 경쟁에서 승리해 보세요!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => {
            const isCompleted = completedPropertyIds.includes(p.id);
            return (
            <div 
              key={p.id} 
              onClick={() => setSelectedProperty(p)}
              className={`bg-bg-card rounded-2xl border border-gray-800 flex flex-col overflow-hidden hover:border-accent-blue transition-all cursor-pointer shadow-lg hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] group relative ${isCompleted ? 'opacity-60' : ''}`}
            >
              {isCompleted && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-30 flex items-center justify-center">
                  <div className="bg-success text-white px-5 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 transform -rotate-12 scale-110">
                    🎉 낙찰 완료
                  </div>
                </div>
              )}
              <div 
                className="h-48 bg-cover bg-center relative border-b border-gray-800 group-hover:scale-105 transition-transform duration-500" 
                style={{ backgroundImage: `url('${p.image || ''}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold border backdrop-blur-md ${p.badgeColor}`}>
                    {p.badge || '진행중'}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col relative z-10 bg-bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-300 bg-gray-800 px-2 py-1 rounded-md">{p.usage}</span>
                  <span className="text-xs text-accent-blue font-semibold truncate">{p.court}</span>
                </div>
                <h4 className="font-bold text-lg text-white mb-4 line-clamp-1">{p.name}</h4>
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">감정가</span>
                    <span className="text-gray-300">{formatCurrencyKRW(p.appraised_value)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">최저가</span>
                    <span className="font-bold text-danger">{formatCurrencyKRW(p.min_bid)}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-400 line-clamp-1">
                    <span className="font-semibold text-gray-300 mr-2">핵심현황:</span>
                    {p.registry_status}
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    );
  }

  // Detail View
  return (
    <div className="min-h-screen bg-bg-main text-text-main pb-24">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-bg-main/80 backdrop-blur-lg border-b border-gray-800 px-4 md:px-10 py-4 flex items-center justify-between">
        <button 
          onClick={() => { setSelectedProperty(null); setBidInput(''); setResult(null); }}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span className="font-medium">목록으로 돌아가기</span>
        </button>
        <span className="text-sm font-bold text-gray-500">모의 입찰 모드</span>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-gray-800 text-gray-300 px-2.5 py-1 rounded text-sm font-bold">{selectedProperty.court}</span>
              <span className="text-accent-blue font-bold">{selectedProperty.case_number}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">{selectedProperty.name}</h1>
          </div>

          {/* Main Image */}
          <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
            <img src={selectedProperty.image} alt={selectedProperty.name} className="w-full h-80 md:h-[400px] object-cover" />
          </div>

          {/* Property Detail Grid */}
          <div className="bg-bg-card border border-gray-800 rounded-2xl p-6 md:p-8 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent-blue rounded-full"></span>
              물건 기본 정보
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 border-t border-b border-gray-800 py-6">
              <div>
                <div className="text-gray-500 text-sm mb-1">용도</div>
                <div className="font-semibold text-white">{selectedProperty.usage}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">토지면적</div>
                <div className="font-semibold text-white">{selectedProperty.land_area}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">건물면적</div>
                <div className="font-semibold text-white">{selectedProperty.building_area}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">매각기일</div>
                <div className="font-semibold text-white">{selectedProperty.bid_date}</div>
              </div>
            </div>
          </div>

          {/* Registry & Rights Analysis */}
          <div className="bg-bg-card border border-gray-800 rounded-2xl p-6 md:p-8 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
              권리 분석 정보
            </h3>
            <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 font-medium">등기부 현황 (요약)</span>
                <span className={`px-3 py-1 rounded text-sm font-bold ${selectedProperty.badgeColor}`}>{selectedProperty.badge} 매물</span>
              </div>
              <p className="text-lg text-white font-medium break-keep leading-relaxed">
                {selectedProperty.registry_status}
              </p>
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar (Bidding Area) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-bg-card border border-accent-blue/30 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-xl font-bold mb-6 text-white text-center">모의 입찰표 작성</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <span className="text-gray-400">감정가</span>
                <span className="text-xl font-bold text-white">{formatCurrencyKRW(selectedProperty.appraised_value)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-danger/10 rounded-xl border border-danger/20">
                <span className="text-danger font-medium">최저입찰가</span>
                <span className="text-xl font-bold text-danger">{formatCurrencyKRW(selectedProperty.min_bid)}</span>
              </div>
            </div>

            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-gray-400 mb-2">나의 입찰가 (단위: 만원)</label>
              <div className="relative">
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="예: 125000" 
                  value={bidInput}
                  onChange={(e) => setBidInput(e.target.value)}
                  className={`w-full bg-gray-900 border-2 rounded-xl px-4 py-4 pr-16 text-base md:text-xl font-bold outline-none transition-all text-right ${(bidInput && !/^\d+$/.test(bidInput)) || (bidInput && /^\d+$/.test(bidInput) && parseInt(bidInput) * 10000 > selectedProperty.appraised_value * 2) ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger text-danger' : 'border-gray-700 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue text-white'}`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">만원</span>
              </div>
              {!bidInput && (
                <div className="mt-2 text-right text-xs text-gray-500">
                  * 만원 단위로 숫자만 입력해 주세요.
                </div>
              )}
              {bidInput && !/^\d+$/.test(bidInput) ? (
                <div className="mt-2 text-right text-sm text-danger font-bold">
                  ⚠️ 올바른 숫자만 입력해 주세요.
                </div>
              ) : bidInput && parseInt(bidInput) * 10000 > selectedProperty.appraised_value * 2 ? (
                <div className="mt-2 text-right text-sm text-danger font-bold break-keep">
                  ⚠️ 입찰가가 감정가보다 2배 이상입니다. 다시 확인해주세요.
                </div>
              ) : bidInput && (
                <div className="mt-2 text-right text-sm text-accent-blue font-bold">
                  입력 금액: {formatCurrencyKRW(parseInt(bidInput) * 10000)}
                </div>
              )}
            </div>

            <button 
              onClick={handleBid}
              disabled={!bidInput || !/^\d+$/.test(bidInput) || parseInt(bidInput) * 10000 > selectedProperty.appraised_value * 2}
              className="w-full bg-accent-blue disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all transform hover:-translate-y-1"
            >
              입찰 제출하기
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              실제 입찰이 아닌 모의 훈련용 데이터입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {result && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`bg-bg-card p-8 md:p-10 rounded-2xl border ${result.status === 'win' ? 'border-success shadow-[0_0_50px_rgba(0,200,81,0.2)]' : 'border-danger shadow-[0_0_50px_rgba(255,68,68,0.2)]'} w-full max-w-lg text-center transform transition-all ${result.status === 'win' ? 'animate-bounce' : 'animate-shake'}`} style={{ animationIterationCount: 1 }}>
            <div className="text-6xl mb-6 drop-shadow-xl">
              {result.status === 'win' ? '🎉' : result.status === 'invalid' ? '⚠️' : '💸'}
            </div>
            <h3 className={`text-3xl font-extrabold mb-4 ${result.status === 'win' ? 'text-success' : 'text-danger'}`}>
              {result.status === 'win' ? '낙찰 성공!' : result.status === 'invalid' ? '입찰 무효' : '아쉬운 패찰'}
            </h3>
            
            {result.status === 'win' ? (
              <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800 text-left mb-6 space-y-3">
                <div className="flex justify-between border-b border-gray-800 pb-3">
                  <span className="text-gray-400">내 입찰가</span>
                  <span className="font-bold text-white">{formatCurrencyKRW(result.bidAmount)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-3">
                  <span className="text-gray-400">가상 낙찰가</span>
                  <span className="font-bold text-white">{formatCurrencyKRW(result.bidAmount)}</span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-gray-400">감정가 대비</span>
                  <span className="font-bold text-success">{-Math.abs(result.profitRate).toFixed(1)}% 절약</span>
                </div>
                <div className="pt-2 text-center text-accent-blue font-bold text-lg bg-accent-blue/10 py-3 rounded-lg mt-2">
                  👥 가상 경쟁자 {result.competitors}명을 꺾고 낙찰!
                </div>
              </div>
            ) : (
              <p className="text-white text-lg font-medium mb-8 leading-relaxed break-keep">{result.text}</p>
            )}
            {/* 오답 노트 / 해설 */}
            <div className="bg-bg-main p-5 rounded-xl mb-8 text-sm text-left border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <strong className="text-accent-blue text-base">전문가의 피드백</strong> 
              </div>
              <span className="text-gray-300 leading-relaxed block mt-2">
                {result.feedbackText}
              </span>
            </div>

            <div className="flex gap-4 justify-center">
              {result.status === 'win' ? (
                <button 
                  onClick={closeResult} 
                  className="w-full bg-accent-blue hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                  이 매물은 완료! 다음 도전 매물 보러가기
                </button>
              ) : (
                <>
                  <button 
                    onClick={closeResult} 
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-bold transition-all border border-gray-700"
                  >
                    목록으로
                  </button>
                  <button 
                    onClick={() => setResult(null)} 
                    className="flex-1 bg-accent-blue hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  >
                    재도전
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
