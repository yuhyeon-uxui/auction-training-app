import { useEffect, useState } from 'react';

const glossaryData = {
  '말소기준권리': '부동산 경매에서 낙찰 시 인수주의와 잉여주의를 가르는 기준이 되는 권리입니다.',
  '권리분석': '경매 목적물에 설정된 권리의 인수 여부를 분석하여 위험을 회피하는 과정입니다.',
  '감정가': '감정평가사가 해당 부동산의 가치를 평가한 금액입니다.',
  '최저입찰가': '경매 법원에서 정한, 입찰할 수 있는 가장 낮은 금액입니다.',
  '낙찰': '경매에서 최고가 매수신고인으로 결정되어 해당 물건을 살 권리를 얻는 것입니다.',
  '패찰': '경매에 참여했으나 최고가를 쓰지 못해 탈락하는 것입니다.',
  '유찰': '경매기일에 입찰자가 아무도 없어 낙찰되지 않고 다음 기일로 미뤄지는 것입니다.',
  '배당': '낙찰대금으로 채권자들에게 순위에 따라 돈을 나누어 주는 절차입니다.',
  '명도': '낙찰 후 현재 점유자(채무자, 세입자 등)를 내보내고 부동산을 인도받는 과정입니다.',
  '등기부등본': '부동산의 권리관계를 공시하는 공적 장부입니다.',
  '근저당': '계속적인 거래관계에서 발생하는 불특정 다수의 채권을 장래의 결산기에 일정한 한도액까지 담보하기 위해 설정하는 저당권입니다.',
  '전세권': '전세금을 지급하고 타인의 부동산을 용도에 따라 사용, 수익하는 권리입니다.'
};

export default function GlossaryPopup() {
  const [popup, setPopup] = useState({ show: false, x: 0, y: 0, term: '', desc: '' });

  useEffect(() => {
    const handleMouseOver = (e) => {
      if (e.target.classList.contains('glossary-term')) {
        const term = e.target.textContent;
        const rect = e.target.getBoundingClientRect();
        if (glossaryData[term]) {
          setPopup({
            show: true,
            x: rect.left,
            y: rect.bottom + window.scrollY + 10,
            term,
            desc: glossaryData[term]
          });
        }
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.classList.contains('glossary-term')) {
        setPopup(p => ({ ...p, show: false }));
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (!popup.show) return null;

  return (
    <div 
      className="absolute bg-bg-card border border-accent-blue/50 rounded-xl p-5 shadow-2xl z-50 max-w-[320px] pointer-events-none transition-opacity duration-200"
      style={{ left: popup.x, top: popup.y }}
    >
      <h4 className="text-accent-blue font-bold mb-2 flex items-center gap-2">
        <span className="text-lg">📖</span> {popup.term}
      </h4>
      <p className="text-sm text-text-muted leading-relaxed break-keep">{popup.desc}</p>
    </div>
  );
}
