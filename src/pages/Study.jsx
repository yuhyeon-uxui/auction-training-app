import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Study({ session }) {
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleQuiz = async (isCorrect) => {
    if (answered) return;
    setAnswered(true);

    if (isCorrect) {
      setFeedback({ type: 'success', text: '정답입니다! 보전가등기는 말소기준권리가 아닙니다.' });
      
      await supabase.from('quiz_attempts').insert([{ user_id: session.user.id, quiz_id: 1, is_correct: true }]);
      const { data: profile } = await supabase.from('profiles').select('quiz_completed, level').eq('id', session.user.id).single();
      if (profile) {
        const newQuiz = (profile.quiz_completed || 0) + 1;
        const newLevel = newQuiz % 3 === 0 ? (profile.level || 1) + 1 : (profile.level || 1);
        await supabase.from('profiles').update({ quiz_completed: newQuiz, level: newLevel }).eq('id', session.user.id);
      }
    } else {
      setFeedback({ type: 'danger', text: '오답입니다. 해설: 근저당, 가압류 등은 대표적인 말소기준권리입니다.' });
      await supabase.from('quiz_attempts').insert([{ user_id: session.user.id, quiz_id: 1, is_correct: false }]);
    }
  };

  const retry = () => {
    setAnswered(false);
    setFeedback(null);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold mb-6 border-l-4 border-accent-blue pl-2">개념 배움터</h3>
      
      <div className="card-style mb-8 text-lg leading-relaxed">
        <h3 className="text-xl font-bold text-accent-blue mb-4">권리분석의 핵심: 말소기준권리</h3>
        <p className="mb-4">경매에서 가장 중요한 것은 <span className="glossary-term text-accent-light underline decoration-dotted cursor-help hover:text-accent-blue transition-colors">권리분석</span>입니다. 등기부등본을 볼 때, 낙찰자에게 인수되는 권리와 소멸되는 권리를 구분해야 합니다.</p>
        <p className="mb-4">그 기준이 되는 것이 바로 <span className="glossary-term text-accent-light underline decoration-dotted cursor-help hover:text-accent-blue transition-colors">말소기준권리</span>입니다. 대표적으로 <span className="glossary-term text-accent-light underline decoration-dotted cursor-help hover:text-accent-blue transition-colors">근저당</span>, 가압류, 담보가등기, 강제경매개시결정등기 등이 있습니다.</p>
        <p>또한, 임차인의 <span className="glossary-term text-accent-light underline decoration-dotted cursor-help hover:text-accent-blue transition-colors">전세권</span>이나 대항력 여부도 반드시 확인해야 온전한 <span className="glossary-term text-accent-light underline decoration-dotted cursor-help hover:text-accent-blue transition-colors">명도</span>가 가능합니다.</p>
      </div>

      <div className="bg-bg-main p-8 border border-gray-800 rounded-xl">
        <h4 className="text-lg font-semibold mb-4">미니 퀴즈</h4>
        <p className="mb-6">다음 중 일반적으로 말소기준권리가 될 수 <strong>없는</strong> 것은 무엇일까요?</p>
        
        <div className="space-y-3">
          {[
            { id: 1, text: '1. 근저당', isCorrect: false },
            { id: 2, text: '2. 가압류', isCorrect: false },
            { id: 3, text: '3. 소유권이전청구권가등기 (담보가등기가 아닌 보전가등기)', isCorrect: true },
            { id: 4, text: '4. 강제경매개시결정등기', isCorrect: false }
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => handleQuiz(opt.isCorrect)}
              disabled={answered}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                answered 
                  ? opt.isCorrect ? 'bg-success/10 border-success text-white' : 'bg-bg-card border-gray-800 opacity-50'
                  : 'bg-bg-card border-gray-800 hover:border-accent-light hover:bg-bg-cardHover'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`mt-6 p-4 rounded-lg border ${feedback.type === 'success' ? 'bg-success/10 border-success text-success' : 'bg-danger/10 border-danger text-danger'}`}>
            {feedback.text}
            {feedback.type === 'danger' && (
              <button onClick={retry} className="ml-4 underline text-sm hover:text-white">재도전</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
