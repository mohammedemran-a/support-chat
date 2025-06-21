
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search } from 'lucide-react';

const FAQ = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      id: '1',
      question_ar: 'كيف يمكنني بدء محادثة مع البوت؟',
      answer_ar: 'يمكنك بدء محادثة عن طريق الذهاب إلى صفحة الدردشة والنقر على زر "ابدأ المحادثة".',
      question_en: 'How can I start a chat with the bot?',
      answer_en: 'You can start a conversation by going to the chat page and clicking the "Start Chat" button.'
    },
    {
      id: '2',
      question_ar: 'هل الخدمة متاحة على مدار الساعة؟',
      answer_ar: 'نعم، البوت متاح للمساعدة 24/7 لتقديم الدعم الفني.',
      question_en: 'Is the service available 24/7?',
      answer_en: 'Yes, the bot is available 24/7 to provide technical support.'
    },
    {
      id: '3',
      question_ar: 'كيف يمكنني التحويل إلى موظف بشري؟',
      answer_ar: 'يمكنك النقر على زر "التحويل إلى موظف بشري" في صفحة الدردشة.',
      question_en: 'How can I transfer to a human agent?',
      answer_en: 'You can click the "Transfer to Human Agent" button in the chat page.'
    },
    {
      id: '4',
      question_ar: 'هل يمكنني تغيير اللغة أثناء المحادثة؟',
      answer_ar: 'نعم، يمكنك تغيير اللغة من الإعدادات في القائمة الجانبية.',
      question_en: 'Can I change the language during conversation?',
      answer_en: 'Yes, you can change the language from settings in the sidebar menu.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const question = language === 'ar' ? faq.question_ar : faq.question_en;
    const answer = language === 'ar' ? faq.answer_ar : faq.answer_en;
    return question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           answer.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('faq')}
              </h1>
              <p className="text-lg text-gray-600">
                {t('faqDescription') || 'تجد هنا إجابات للأسئلة الأكثر شيوعاً'}
              </p>
            </div>

            {/* Search Box */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={t('searchFAQ') || 'ابحث في الأسئلة الشائعة...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ Accordion */}
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        {language === 'ar' ? faq.question_ar : faq.question_en}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {language === 'ar' ? faq.answer_ar : faq.answer_en}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {t('noResults') || 'لم يتم العثور على نتائج'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
