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
  '전세권': '전세금을 지급하고 타인의 부동산을 용도에 따라 사용, 수익하는 권리입니다.',
  '대항력': '이미 발생하고 있는 법률관계를 제3자에 대하여 주장할 수 있는 효력입니다. 임차인이 대항력을 갖추면 집주인이 바뀌어도 임대차 기간 동안 거주할 수 있습니다.',
  '확정일자': '법원이나 동사무소 등에서 주택임대차계약을 체결한 날짜를 확인해주기 위해 계약서 여백에 찍어주는 도장입니다. 우선변제권의 기준이 됩니다.',
  'LTV': '주택담보대출비율(Loan to Value ratio). 집을 담보로 은행에서 돈을 빌릴 때, 집의 자산가치 대비 대출받을 수 있는 한도를 의미합니다.',
  'DSR': '총부채원리금상환비율(Debt Service Ratio). 대출 상환액이 연소득에서 차지하는 비중으로, 대출 상환 능력을 심사하는 기준입니다.'
};

export default function GlossaryPopup() {
  const [popup, setPopup] = useState({ show: false, x: 0, y: 0, term: '', desc: '' });

  useEffect(() => {
    const handleTrigger = (e) => {
      const target = e.target.classList.contains('glossary-term') ? e.target : e.target.closest('.glossary-term');
      if (!target) return;
      const term = target.textContent.trim().replace(/^#/, '');
      const rect = target.getBoundingClientRect();
      
      if (glossaryData[term]) {
        let leftPos = rect.left;
        if (leftPos + 320 > window.innerWidth) {
          leftPos = window.innerWidth - 340;
        }

        setPopup(prev => {
          if (prev.show && prev.term === term) {
            return { ...prev, show: false };
          }
          return {
            show: true,
            x: Math.max(10, leftPos),
            y: rect.bottom + window.scrollY + 10,
            term,
            desc: glossaryData[term]
          };
        });
      }
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest('.glossary-popup-container') && !e.target.closest('.glossary-term')) {
        setPopup(p => ({ ...p, show: false }));
      }
    };

    const terms = document.querySelectorAll('.glossary-term');
    terms.forEach(term => {
      term.addEventListener('click', handleTrigger);
    });

    document.addEventListener('click', handleClickOutside);
    return () => {
      terms.forEach(term => {
        term.removeEventListener('click', handleTrigger);
      });
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (!popup.show) return null;

  return (
    <div 
      className="glossary-popup-container absolute bg-bg-card border border-accent-blue/50 rounded-xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 max-w-[320px] transition-opacity duration-200"
      style={{ left: popup.x, top: popup.y }}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-accent-blue font-bold flex items-center gap-2">
          <span className="text-lg">📖</span> {popup.term}
        </h4>
        <button onClick={() => setPopup(p => ({...p, show: false}))} className="text-text-muted hover:text-white p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <p className="text-sm text-text-muted leading-relaxed break-keep">{popup.desc}</p>
    </div>
  );
}
