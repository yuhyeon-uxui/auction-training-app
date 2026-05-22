import { useState } from 'react';
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
  }
];

export default function Study({ session }) {
  const [activeModule, setActiveModule] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [completedQuizzes, setCompletedQuizzes] = useState({});

  const handleQuiz = async (moduleId, isCorrect) => {
    if (completedQuizzes[moduleId]) return;
    
    setCompletedQuizzes(prev => ({...prev, [moduleId]: true}));

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
      
      <div className="grid gap-6">
        {modules.map((mod) => {
          const isActive = activeModule === mod.id;
          const isCompleted = completedQuizzes[mod.id] && feedback.type === 'success';

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
                        const showDanger = isSelected && !opt.isCorrect && feedback.type === 'danger'; // Simplistic feedback logic
                        
                        let btnClass = 'bg-bg-card border-gray-700 hover:border-accent-blue hover:bg-gray-800 text-text-muted hover:text-white';
                        if (isSelected) {
                          if (opt.isCorrect) btnClass = 'bg-success/20 border-success text-white shadow-[0_0_15px_rgba(0,200,81,0.2)]';
                          else btnClass = 'bg-bg-main border-gray-800 opacity-40 cursor-not-allowed';
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
                    {completedQuizzes[mod.id] && feedback.moduleId === mod.id && (
                      <div className={`mt-6 p-5 rounded-xl border animate-fade-in-up flex flex-col gap-3 ${feedback.type === 'success' ? 'bg-success/10 border-success/50 text-success' : 'bg-danger/10 border-danger/50 text-danger'}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg">{feedback.text}</span>
                          {feedback.type === 'danger' && (
                            <button onClick={() => retry(mod.id)} className="px-4 py-1.5 bg-danger/20 hover:bg-danger text-white rounded-lg text-sm transition-colors font-semibold">
                              다시 도전
                            </button>
                          )}
                        </div>
                        {feedback.type === 'success' && (
                          <div className="text-sm text-text-muted bg-black/20 p-4 rounded-lg border border-success/20">
                            <strong>💡 해설:</strong> {mod.quiz.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
