import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const modules = [
  {
    id: 1,
    title: '1강. 권리분석의 핵심: 말소기준권리',
    icon: '📚',
    content: (
      <>
        <p className="mb-4">경매에서 가장 중요한 것은 <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer hover:text-accent-blue transition-colors">권리분석</span>입니다. 등기부등본을 볼 때, 낙찰자에게 인수되는 권리와 소멸되는 권리를 구분해야 합니다.</p>
        <p className="mb-4">그 기준이 되는 것이 바로 <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer hover:text-accent-blue transition-colors">말소기준권리</span>입니다. 대표적으로 <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer hover:text-accent-blue transition-colors">근저당</span>, 가압류, 담보가등기, 강제경매개시결정등기 등이 있습니다.</p>
        <p>또한, 임차인의 전세권이나 <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer hover:text-accent-blue transition-colors">대항력</span> 여부도 반드시 확인해야 온전한 명도가 가능합니다.</p>
      </>
    ),
    quiz: {
      question: '다음 중 일반적으로 말소기준권리가 될 수 없는 것은 무엇일까요?',
      options: [
        { id: 1, text: '근저당', isCorrect: false },
        { id: 2, text: '가압류', isCorrect: false },
        { id: 3, text: '보전 목적의 가등기 (소유권이전청구권가등기)', isCorrect: true },
        { id: 4, text: '강제경매개시결정등기', isCorrect: false }
      ],
      explanation: '정답은 3번입니다. 보전가등기는 말소기준권리가 아닙니다. 근저당, 가압류 등은 대표적인 말소기준권리로 그 밑의 권리들은 모두 소멸합니다.'
    }
  },
  {
    id: 2,
    title: '2강. 세입자 보증금 인수 위험: 대항력',
    icon: '🛡️',
    content: (
      <>
        <p className="mb-4">세입자가 있는 집을 낙찰받을 때는 반드시 <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer hover:text-accent-blue transition-colors">대항력</span> 여부를 확인해야 합니다.</p>
        <p className="mb-4">말소기준권리보다 먼저 주택을 점유하고 전입신고를 마친 임차인은 대항력이 발생하며, 낙찰자가 보증금을 전액 물어줘야 할 수도 있어 입찰 시 주의가 필요합니다.</p>
        <p><span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer hover:text-accent-blue transition-colors">확정일자</span>는 우선변제권(배당받을 순서)의 요건일 뿐, 대항력 발생 자체와는 무관합니다.</p>
      </>
    ),
    quiz: {
      question: '임차인이 대항력을 갖추기 위해 반드시 필요한 두 가지 요건은 무엇일까요?',
      options: [
        { id: 1, text: '전입신고 + 확정일자', isCorrect: false },
        { id: 2, text: '주택의 인도(점유) + 전입신고', isCorrect: true },
        { id: 3, text: '확정일자 + 전세권설정', isCorrect: false },
        { id: 4, text: '주택의 인도 + 확정일자', isCorrect: false }
      ],
      explanation: '정답은 2번입니다. 대항력의 발생 요건은 주택의 인도(점유)와 주민등록(전입신고)입니다. 확정일자는 배당 시 우선변제를 받기 위한 요건입니다.'
    }
  },
  {
    id: 3,
    title: '3강. 경매의 꽃: 명도',
    icon: '🗝️',
    content: (
      <>
        <p className="mb-4">낙찰 후 가장 부담스러워하는 과정이 바로 <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer hover:text-accent-blue transition-colors">명도</span>입니다. 점유자를 내보내는 일련의 과정을 의미합니다.</p>
        <p className="mb-4">대부분의 명도는 협상으로 원만하게 마무리되지만, 최악의 경우 법원의 강제집행을 활용할 수도 있습니다.</p>
        <p>명도를 원활하게 하기 위해서는 낙찰 직후 신속하게 점유자와 소통을 시작하고 이사비 등의 협상 카드를 적절히 사용하는 것이 중요합니다.</p>
      </>
    ),
    quiz: {
      question: '명도 시 점유자와 협상이 결렬되었을 때 법원에 신청하여 강제로 점유를 이전받는 제도는 무엇일까요?',
      options: [
        { id: 1, text: '명도소송', isCorrect: false },
        { id: 2, text: '부동산 인도명령', isCorrect: true },
        { id: 3, text: '가압류', isCorrect: false },
        { id: 4, text: '경매개시결정', isCorrect: false }
      ],
      explanation: '정답은 2번입니다. 대항력 없는 점유자의 경우, 낙찰 대금 납부 후 6개월 이내에 비교적 빠르고 간편한 인도명령 제도를 활용할 수 있습니다.'
    }
  },
  {
    id: 4,
    title: '4강. 입찰 전 필수 확인: 매각물건명세서',
    icon: '📄',
    content: (
      <>
        <p className="mb-4">경매 법원에서 제공하는 공식 문서 중 가장 중요한 것이 바로 <strong>매각물건명세서</strong>입니다.</p>
        <p className="mb-4">이 문서에는 <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer hover:text-accent-blue transition-colors">최저입찰가</span>, 임차인의 전입일자, 확정일자, 배당요구 여부 등 권리분석의 핵심 정보가 모두 담겨 있습니다.</p>
        <p>매각기일 1주일 전부터 법원에 비치되며, 대법원 법원경매정보 사이트에서도 확인할 수 있습니다.</p>
      </>
    ),
    quiz: {
      question: '다음 중 매각물건명세서에 기재되지 않는 사항은 무엇일까요?',
      options: [
        { id: 1, text: '최저매각가격', isCorrect: false },
        { id: 2, text: '임차인의 배당요구 여부', isCorrect: false },
        { id: 3, text: '향후 부동산 가격 상승 예측치', isCorrect: true },
        { id: 4, text: '매각으로 소멸되지 않는 권리', isCorrect: false }
      ],
      explanation: '정답은 3번입니다. 매각물건명세서는 객관적인 권리관계와 현황만을 기재할 뿐, 향후 시세 예측과 같은 주관적 정보는 담지 않습니다.'
    }
  },
  {
    id: 5,
    title: '5강. 자금 조달 계획: 경락잔금대출',
    icon: '💰',
    content: (
      <>
        <p className="mb-4">경매로 <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer hover:text-accent-blue transition-colors">낙찰</span>받은 후, 매각대금 잔금을 납부하기 위해 활용하는 대출이 바로 경락잔금대출입니다.</p>
        <p className="mb-4">일반 주택담보대출과 비슷하지만, <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer hover:text-accent-blue transition-colors">감정가</span>와 낙찰가 중 낮은 금액을 기준으로 한도가 산정되는 특징이 있습니다.</p>
        <p><span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer hover:text-accent-blue transition-colors">LTV</span>, <span className="glossary-term text-accent-light underline decoration-dotted cursor-pointer hover:text-accent-blue transition-colors">DSR</span> 규제가 동일하게 적용되므로, 입찰 전 본인의 대출 가능 금액을 꼼꼼히 확인해야 합니다.</p>
      </>
    ),
    quiz: {
      question: '다음 중 경락잔금대출의 한도를 산정하는 일반적인 기준은 무엇일까요?',
      options: [
        { id: 1, text: '무조건 감정가의 100%', isCorrect: false },
        { id: 2, text: '무조건 낙찰가의 100%', isCorrect: false },
        { id: 3, text: '낙찰가의 80% 또는 감정가의 70% 중 낮은 금액 (대략적 기준)', isCorrect: true },
        { id: 4, text: '입찰자의 연소득의 10배', isCorrect: false }
      ],
      explanation: '정답은 3번입니다. 대출 한도는 규제에 따라 다르지만, 통상 낙찰가의 80%와 감정가의 70% 중 낮은 금액을 기준으로 합니다.'
    }
  }
];

const categories = [
  { id: 'auction', label: '경매', active: true },
  { id: 'rental', label: '임대사업', active: false },
  { id: 'trade', label: '갈아타기', active: false },
  { id: 'cheongyak', label: '청약', active: false },
];

const coreTerms = ['말소기준권리', '대항력', '최저입찰가', '명도', '유치권'];

export default function Study({ session }) {
  const [activeModule, setActiveModule] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [completedQuizzes, setCompletedQuizzes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('auction');
  const [savedTerms, setSavedTerms] = useState([]);

  useEffect(() => {
    if (session) {
      fetchSavedTerms();
      fetchQuizzes();
    }
    const handleGlossaryUpdated = () => {
      if (session) fetchSavedTerms();
    };
    window.addEventListener('glossaryUpdated', handleGlossaryUpdated);
    return () => window.removeEventListener('glossaryUpdated', handleGlossaryUpdated);
  }, [session]);

  const fetchQuizzes = async () => {
    if (!session) return;
    const { data } = await supabase.from('quiz_attempts').select('quiz_id, is_correct').eq('user_id', session.user.id);
    if (data) {
      const state = {};
      data.forEach(d => {
        if (d.is_correct) state[d.quiz_id] = 'success';
      });
      setCompletedQuizzes(state);
    }
  };

  const fetchSavedTerms = async () => {
    const { data, error } = await supabase
      .from('saved_terms')
      .select('term')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
      
    if (data && !error) {
      setSavedTerms(data.map(d => d.term));
    }
  };

  const handleQuiz = async (moduleId, isCorrect) => {
    if (completedQuizzes[moduleId]) return;
    
    setCompletedQuizzes(prev => ({...prev, [moduleId]: isCorrect ? 'success' : 'danger'}));

    if (isCorrect) {
      setFeedback({ moduleId, type: 'success', text: '정답입니다! 🎉' });
      
      // Update DB
      await supabase.from('quiz_attempts').insert([{ user_id: session.user.id, quiz_id: moduleId, is_correct: true }]);
      const { data: profile } = await supabase.from('profiles').select('quiz_completed, level').eq('id', session.user.id).single();
      if (profile) {
        const newQuiz = (profile.quiz_completed || 0) + 1;
        const newLevel = newQuiz % 3 === 0 ? (profile.level || 1) + 1 : (profile.level || 1);
        await supabase.from('profiles').update({ quiz_completed: newQuiz, level: newLevel }).eq('id', session.user.id);
      }
    } else {
      setFeedback({ moduleId, type: 'danger', text: '오답입니다. ❌ 다시 한번 생각해 보세요!' });
      await supabase.from('quiz_attempts').insert([{ user_id: session.user.id, quiz_id: moduleId, is_correct: false }]);
    }
  };

  const retry = (moduleId) => {
    setCompletedQuizzes(prev => {
      const newState = {...prev};
      delete newState[moduleId];
      return newState;
    });
    setFeedback({});
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold mb-3 flex items-center gap-3">
          <span className="w-2 h-8 bg-accent-blue rounded-full shadow-[0_0_10px_#3B82F6]"></span>
          개념 배움터
        </h2>
        <p className="text-text-muted text-lg">경매의 필수 지식을 익히고 퀴즈를 풀어 레벨을 올리세요!</p>
      </div>

      {/* Category Selection UI */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => cat.active && setSelectedCategory(cat.id)}
            disabled={!cat.active}
            className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-accent-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : cat.active
                  ? 'bg-bg-card border border-gray-800 text-text-muted hover:text-white hover:border-gray-500'
                  : 'bg-gray-900/50 border border-gray-800/50 text-gray-600 cursor-not-allowed'
            }`}
          >
            {cat.label} {!cat.active && <span className="text-xs font-normal ml-1 bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">준비중</span>}
          </button>
        ))}
      </div>
      
      {selectedCategory === 'auction' && (
        <>
          {/* Core Terms Section */}
          <div className="mb-10 bg-bg-card border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent-blue">💡</span> 미리 알면 좋을 핵심 용어
            </h3>
            <div className="flex flex-wrap gap-3">
              {coreTerms.map((term, idx) => (
                <button
                  key={idx}
                  className="glossary-term px-4 py-2 bg-[#1a1a24] border border-gray-700 hover:border-accent-blue hover:text-accent-blue rounded-full text-sm transition-colors"
                >
                  #{term}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 mb-12">
            <h3 className="text-2xl font-bold mb-2">📚 경매 강의 리스트</h3>
            {modules.map((mod) => {
              const isActive = activeModule === mod.id;
              const isCompleted = completedQuizzes[mod.id] === 'success';

              return (
                <div key={mod.id} className={`bg-bg-card border ${isActive ? 'border-accent-blue shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-gray-800'} rounded-2xl overflow-hidden transition-all duration-300`}>
                  {/* Card Header */}
                  <div 
                    className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-800/30"
                    onClick={() => setActiveModule(isActive ? null : mod.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isCompleted ? 'bg-success/20 text-success' : 'bg-bg-main text-white'}`}>
                        {isCompleted ? '✅' : mod.icon}
                      </div>
                      <h3 className={`text-xl font-bold ${isActive ? 'text-accent-blue' : 'text-white'}`}>{mod.title}</h3>
                    </div>
                    <div className="text-gray-500">
                      <svg className={`w-6 h-6 transform transition-transform duration-300 ${isActive ? 'rotate-180 text-accent-blue' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>

                  {/* Card Body (Expandable) */}
                  {isActive && (
                    <div className="p-6 pt-0 border-t border-gray-800 mt-4 bg-gray-900/20">
                      <div className="text-lg leading-relaxed text-text-muted mt-6 mb-8 px-2">
                        {mod.content}
                      </div>

                      {/* Quiz Section */}
                      <div className="bg-[#1a1a24] p-8 border border-gray-800 rounded-xl">
                        <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                          <span className="text-accent-blue">Q.</span> 실전 확인 퀴즈
                        </h4>
                        <p className="mb-6 text-white font-medium">{mod.quiz.question}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {mod.quiz.options.map(opt => {
                            const isSelected = completedQuizzes[mod.id];
                            const showSuccess = isSelected && opt.isCorrect;
                            const showDanger = isSelected && !opt.isCorrect && feedback.type === 'danger';
                            
                            let btnClass = 'bg-bg-card border-gray-700 hover:border-accent-blue hover:bg-gray-800 text-text-muted hover:text-white';
                            if (isSelected) {
                              if (completedQuizzes[mod.id] === 'success' && opt.isCorrect) {
                                btnClass = 'bg-success/20 border-success text-white shadow-[0_0_15px_rgba(0,200,81,0.2)]';
                              } else {
                                btnClass = 'bg-bg-main border-gray-800 opacity-40 cursor-not-allowed';
                              }
                            }

                            return (
                              <button 
                                key={opt.id}
                                onClick={() => handleQuiz(mod.id, opt.isCorrect)}
                                disabled={completedQuizzes[mod.id]}
                                className={`p-4 rounded-xl border-2 text-left font-medium transition-all duration-300 ${btnClass}`}
                              >
                                {opt.text}
                              </button>
                            );
                          })}
                        </div>

                        {/* Feedback Alert */}
                        {(completedQuizzes[mod.id] === 'danger' && feedback.moduleId === mod.id) && (
                          <div className="mt-6 p-5 rounded-xl border animate-fade-in-up flex flex-col gap-3 bg-danger/10 border-danger/50 text-danger">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-lg">{feedback.text}</span>
                              <button onClick={() => retry(mod.id)} className="px-4 py-1.5 bg-danger/20 hover:bg-danger text-white rounded-lg text-sm transition-colors font-semibold">
                                다시 도전
                              </button>
                            </div>
                          </div>
                        )}
                        {(completedQuizzes[mod.id] === 'success') && (
                          <div className="mt-6 p-5 rounded-xl border animate-fade-in-up flex flex-col gap-3 bg-success/10 border-success/50 text-success">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-lg">정답입니다! 🎉</span>
                            </div>
                            <div className="text-sm text-text-muted bg-black/20 p-4 rounded-lg border border-success/20">
                              <strong>💡 해설:</strong> {mod.quiz.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Success Banner when all modules are completed */}
            {Object.values(completedQuizzes).filter(v => v === 'success').length === modules.length && (
              <div className="mt-6 p-8 bg-gradient-to-r from-accent-blue/20 to-purple-600/20 border border-accent-blue/50 rounded-2xl text-center shadow-[0_0_30px_rgba(59,130,246,0.15)] animate-fade-in-up">
                <h3 className="text-2xl font-bold text-white mb-2">🎉 경매 기초 완주!</h3>
                <p className="text-text-muted mb-6">모든 기초 개념을 마스터하셨습니다. 나의 성장 기록을 확인해 볼까요?</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button 
                    onClick={() => {
                      const scrollContainer = document.querySelector('.overflow-y-auto');
                      if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="w-full sm:w-auto px-8 py-3 rounded-full font-bold bg-[#1a1a24] border border-gray-700 text-text-muted hover:text-white hover:border-gray-500 transition-colors"
                  >
                    🔄 다시 복습하기
                  </button>
                  <button 
                    onClick={() => window.location.href = '/profile'} 
                    className="w-full sm:w-auto btn-primary inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold"
                  >
                    내 성장 확인하기 <span>📈</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* My Saved Words Section */}
          <div className="bg-[#121214] border border-accent-blue/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent pointer-events-none"></div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 relative z-10">
              <span className="text-accent-blue">🔖</span> 내가 저장한 단어
            </h3>
            <p className="text-text-muted text-sm mb-4 relative z-10">강의를 보며 저장한 단어들을 모아볼 수 있습니다.</p>
            
            {savedTerms.length > 0 ? (
              <div className="flex flex-wrap gap-2 relative z-10">
                {savedTerms.map((term, idx) => (
                  <button
                    key={idx}
                    className="glossary-term px-3 py-1.5 bg-bg-main border border-accent-blue/50 text-accent-light hover:bg-accent-blue hover:text-white rounded-lg text-sm transition-colors shadow-[0_2px_8px_rgba(59,130,246,0.15)]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 bg-black/20 rounded-xl relative z-10">
                아직 저장한 단어가 없습니다.<br/>단어를 클릭하고 🔖 아이콘을 눌러보세요!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
