
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { useChatBot } from '@/hooks/useChatBot';
import { Menu, Send, Settings, LogOut, MessageSquare, User, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { generateBotResponse, isTyping } = useChatBot(language);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chatWelcome'),
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations: Conversation[] = [
    {
      id: '1',
      title: language === 'ar' ? 'استفسار عن القيود المحاسبية' : 'Accounting Entries Inquiry',
      lastMessage: language === 'ar' ? 'شكراً لك على المساعدة' : 'Thank you for the help',
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      title: language === 'ar' ? 'حساب الضريبة المضافة' : 'VAT Calculation',
      lastMessage: language === 'ar' ? 'كيف أحسب الضريبة؟' : 'How do I calculate VAT?',
      timestamp: new Date(Date.now() - 172800000)
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // تحديث رسالة الترحيب عند تغيير اللغة
  useEffect(() => {
    setMessages(prev => prev.map((msg, index) => 
      index === 0 && msg.sender === 'bot' 
        ? { ...msg, text: t('chatWelcome') }
        : msg
    ));
  }, [language, t]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // إنتاج رد ذكي من البوت
    try {
      const botResponse = await generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error generating bot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'ar' 
          ? 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.'
          : 'Sorry, a system error occurred. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleTransferToHuman = () => {
    toast.success(t('transferringToHuman') || 'جاري التحويل إلى موظف بشري...');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  const handleGoToSettings = () => {
    navigate('/settings');
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: '1',
        text: t('chatWelcome'),
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    toast.success(t('newChatStarted'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>{t('menu') || 'القائمة'}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* New Chat Button */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleNewChat}
                      className="w-full bg-brand-gradient text-white hover:opacity-90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {language === 'ar' ? 'محادثة جديدة' : 'New Chat'}
                    </Button>
                  </div>

                  {/* Settings and Actions */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">
                      {t('actions') || 'الإجراءات'}
                    </h3>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleGoToSettings}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {t('settings') || 'الإعدادات'}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('logout') || 'تسجيل الخروج'}
                    </Button>
                  </div>

                  {/* Previous Conversations */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">
                      {t('previousChats') || 'المحادثات السابقة'}
                    </h3>
                    <div className="space-y-2">
                      {conversations.map((conv) => (
                        <Card key={conv.id} className="cursor-pointer hover:bg-gray-50">
                          <CardContent className="p-3">
                            <div className="flex items-start space-x-3">
                              <MessageSquare className="h-4 w-4 mt-1 text-gray-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {conv.title}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {conv.lastMessage}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {conv.timestamp.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {t('technicalSupport') || 'المساعد المحاسبي الذكي'}
              </h1>
              <p className="text-sm text-gray-500">
                {t('onlineNow') || 'متصل الآن'}
              </p>
            </div>
          </div>

          <Button
            onClick={handleTransferToHuman}
            variant="outline"
            size="sm"
            className="text-brand-blue-600 border-brand-blue-600 hover:bg-brand-blue-50"
          >
            <User className="mr-2 h-4 w-4" />
            {t('transferToHuman') || 'التحويل إلى موظف بشري'}
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-brand-gradient text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">{t('botTyping')}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t('typeMessage') || 'اكتب رسالتك هنا...'}
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              className="bg-brand-gradient hover:opacity-90"
              disabled={!inputMessage.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  return (
    <LanguageProvider>
      <ChatInterface />
    </LanguageProvider>
  );
};

export default Chat;
