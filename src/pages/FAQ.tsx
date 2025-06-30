
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useKnowledgeBase, useSearchKnowledgeBase } from '@/hooks/useKnowledgeBase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  // جلب جميع الأسئلة الشائعة من قاعدة البيانات
  const { data: allFaqs = [], isLoading: loadingAll } = useKnowledgeBase(i18n.language);
  
  // البحث في قاعدة البيانات
  const { data: searchResults = [], isLoading: loadingSearch } = useSearchKnowledgeBase(searchTerm, i18n.language);

  // استخدام نتائج البحث إذا كان هناك بحث، وإلا استخدام جميع الأسئلة
  const displayedFaqs = searchTerm.trim() ? searchResults : allFaqs;
  const isLoading = searchTerm.trim() ? loadingSearch : loadingAll;

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
                {t('faqDescription')}
              </p>
            </div>

            {/* Search Box */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={t('searchFAQ')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Accordion */}
            <Card>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-blue-600" />
                    <p className="text-gray-500">{t('loading')}</p>
                  </div>
                ) : (
                  <>
                    {displayedFaqs.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {displayedFaqs.map((faq) => (
                          <AccordionItem key={faq.id} value={faq.id}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          {t('noResults')}
                        </p>
                      </div>
                    )}
                  </>
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
