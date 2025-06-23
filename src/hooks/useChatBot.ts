
import { useState } from 'react';
import { useKnowledgeBase } from './useKnowledgeBase';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const useChatBot = (language: string) => {
  const { data: knowledgeBase = [] } = useKnowledgeBase(language);
  const [isTyping, setIsTyping] = useState(false);

  const findBestAnswer = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // البحث عن أقرب سؤال في قاعدة المعرفة
    for (const item of knowledgeBase) {
      const lowerQuestion = item.question.toLowerCase();
      const lowerAnswer = item.answer.toLowerCase();
      
      // البحث بالكلمات المفتاحية
      const keywords = lowerMessage.split(' ').filter(word => word.length > 2);
      const questionKeywords = lowerQuestion.split(' ').filter(word => word.length > 2);
      
      // حساب التطابق
      let matchCount = 0;
      keywords.forEach(keyword => {
        if (lowerQuestion.includes(keyword) || lowerAnswer.includes(keyword)) {
          matchCount++;
        }
      });
      
      // إذا كان هناك تطابق جيد، إرجاع الإجابة
      if (matchCount > 0 && matchCount >= keywords.length * 0.3) {
        return item.answer;
      }
    }

    // إجابة افتراضية إذا لم يتم العثور على تطابق
    return language === 'ar' 
      ? 'عذراً، لم أتمكن من العثور على إجابة دقيقة لسؤالك. يمكنك تجربة إعادة صياغة السؤال أو التواصل مع فريق الدعم الفني.'
      : 'Sorry, I could not find a precise answer to your question. You can try rephrasing the question or contact technical support.';
  };

  const generateBotResponse = async (userMessage: string): Promise<Message> => {
    setIsTyping(true);
    
    // محاكاة وقت المعالجة
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const answer = findBestAnswer(userMessage);
    
    setIsTyping(false);
    
    return {
      id: (Date.now() + 1).toString(),
      text: answer,
      sender: 'bot',
      timestamp: new Date()
    };
  };

  return {
    generateBotResponse,
    isTyping,
    setIsTyping
  };
};
