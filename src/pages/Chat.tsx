
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useChatBot } from '@/hooks/useChatBot';
import { useIsMobile } from '@/hooks/use-mobile';
import { useConversations, useConversationMessages, useDeleteConversation, type Conversation as DBConversation, type Message as DBMessage } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Menu, Send, Settings, LogOut, MessageSquare, User, Plus, Loader2, Phone, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chat = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { generateBotResponse, isTyping } = useChatBot(i18n.language);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // State for current conversation
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
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

  // Hooks for data fetching
  const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
  const { data: conversationMessages = [], isLoading: messagesLoading } = useConversationMessages(currentConversationId || '');
  const deleteConversationMutation = useDeleteConversation();

  // Convert DB messages to UI messages format
  const convertMessagesToUI = (dbMessages: DBMessage[]): Message[] => {
    return dbMessages.map(msg => ({
      id: msg.id,
      text: msg.content,
      sender: msg.role === 'user' ? 'user' : 'bot',
      timestamp: new Date(msg.created_at)
    }));
  };

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId && conversationMessages.length > 0) {
      setMessages(convertMessagesToUI(conversationMessages));
    } else if (!currentConversationId) {
      // Show welcome message for new chat only if no messages exist
      setMessages(prev => {
        if (prev.length === 0 || (prev.length === 1 && prev[0].sender === 'bot' && prev[0].text !== t('chatWelcome'))) {
          return [
            {
              id: '1',
              text: t('chatWelcome'),
              sender: 'bot',
              timestamp: new Date()
            }
          ];
        }
        return prev;
      });
    }
  }, [conversationMessages, currentConversationId, t]);

  // Save message to database
  const saveMessageToDB = async (content: string, role: 'user' | 'assistant', conversationId?: string) => {
    if (!user) return null;

    let activeConversationId = conversationId;

    // Create new conversation if none exists
    if (!activeConversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
          status: 'active'
        })
        .select()
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        return null;
      }

      activeConversationId = newConversation.id;
      setCurrentConversationId(activeConversationId);
    }

    // Save message
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: activeConversationId,
        user_id: user.id,
        content,
        role
      })
      .select()
      .single();

    if (msgError) {
      console.error('Error saving message:', msgError);
      return null;
    }

    return message;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // تحديث رسالة الترحيب عند تغيير اللغة
  useEffect(() => {
    if (!currentConversationId) {
      setMessages(prev => prev.map((msg, index) => 
        index === 0 && msg.sender === 'bot' 
          ? { ...msg, text: t('chatWelcome') }
          : msg
      ));
    }
  }, [i18n.language, t, currentConversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping || !user) return;

    const messageText = inputMessage;
    setInputMessage('');

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    // إضافة الرسالة فوراً للواجهة مع الحفاظ على الرسائل الموجودة
    setMessages(prev => {
      // إذا كانت هذه أول رسالة من المستخدم، احتفظ برسالة الترحيب
      if (!currentConversationId && prev.length === 1 && prev[0].sender === 'bot') {
        return [...prev, userMessage];
      }
      return [...prev, userMessage];
    });

    try {
      // حفظ رسالة المستخدم في قاعدة البيانات أولاً
      const savedUserMessage = await saveMessageToDB(messageText, 'user', currentConversationId);
      
      // إذا تم إنشاء محادثة جديدة، نحديث الـ ID ولكن لا نعيد تحميل الرسائل
      if (savedUserMessage && !currentConversationId) {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }

      // إنتاج رد ذكي من البوت
      const botResponse = await generateBotResponse(messageText);
      setMessages(prev => [...prev, botResponse]);
      
      // حفظ رد البوت في قاعدة البيانات
      await saveMessageToDB(botResponse.text, 'assistant', currentConversationId);
      
      // تحديث المحادثات بعد إضافة الرسائل
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
    } catch (error) {
      console.error('Error generating bot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: i18n.language === 'ar' 
          ? 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.'
          : 'Sorry, a system error occurred. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // حفظ رسالة الخطأ في قاعدة البيانات
      try {
        await saveMessageToDB(errorMessage.text, 'assistant', currentConversationId);
      } catch (saveError) {
        console.error('Error saving error message:', saveError);
      }
    }
  };

  const handleTransferToHuman = () => {
    const supportNumber = "01337571";
    
    if (isMobile) {
      // فتح دليل الهاتف للاتصال
      window.location.href = `tel:${supportNumber}`;
    } else {
      // عرض نافذة مصغرة للكمبيوتر
      setShowTransferDialog(true);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast.error('خطأ في تسجيل الخروج');
      } else {
        toast.success('تم تسجيل الخروج بنجاح');
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('خطأ في تسجيل الخروج');
    }
  };

  const handleGoToSettings = () => {
    navigate('/settings');
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([
      {
        id: '1',
        text: t('chatWelcome'),
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setSidebarOpen(false); // إخفاء القائمة الجانبية
    toast.success(t('newChatStarted'));
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(i18n.language === 'ar' ? 'هل تريد حذف هذه المحادثة؟' : 'Are you sure you want to delete this conversation?')) {
      await deleteConversationMutation.mutateAsync(conversationId);
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([
          {
            id: '1',
            text: t('chatWelcome'),
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>{t('menu')}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* New Chat Button */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleNewChat}
                      className="w-full bg-brand-gradient text-white hover:opacity-90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {i18n.language === 'ar' ? 'محادثة جديدة' : 'New Chat'}
                    </Button>
                  </div>

                  {/* Settings and Actions */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">
                      {t('actions')}
                    </h3>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleGoToSettings}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {t('settings')}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('logout')}
                    </Button>
                  </div>

                   {/* Previous Conversations */}
                   <div className="space-y-3">
                     <h3 className="font-medium text-gray-900">
                       {t('previousChats')}
                     </h3>
                     <div className="space-y-2">
                       {conversationsLoading ? (
                         <div className="flex justify-center p-4">
                           <Loader2 className="w-4 h-4 animate-spin" />
                         </div>
                       ) : conversations.length > 0 ? (
                         conversations.map((conv) => (
                           <Card 
                             key={conv.id} 
                             className={`cursor-pointer hover:bg-gray-50 ${
                               currentConversationId === conv.id ? 'bg-blue-50 border-blue-200' : ''
                             }`}
                             onClick={() => handleSelectConversation(conv.id)}
                           >
                             <CardContent className="p-3">
                               <div className="flex items-start space-x-3">
                                 <MessageSquare className="h-4 w-4 mt-1 text-gray-400 flex-shrink-0" />
                                 <div className="flex-1 min-w-0">
                                   <p className="text-sm font-medium text-gray-900 truncate">
                                     {conv.title || (i18n.language === 'ar' ? 'محادثة بدون عنوان' : 'Untitled Conversation')}
                                   </p>
                                   <p className="text-xs text-gray-400">
                                     {new Date(conv.created_at).toLocaleDateString(
                                       i18n.language === 'ar' ? 'ar-SA' : 'en-US',
                                       { 
                                         year: 'numeric', 
                                         month: 'short', 
                                         day: 'numeric',
                                         hour: '2-digit',
                                         minute: '2-digit'
                                       }
                                     )}
                                   </p>
                                 </div>
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   className="p-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                   onClick={(e) => handleDeleteConversation(conv.id, e)}
                                 >
                                   <Trash2 className="h-3 w-3" />
                                 </Button>
                               </div>
                             </CardContent>
                           </Card>
                         ))
                       ) : (
                         <p className="text-sm text-gray-500 text-center py-4">
                           {i18n.language === 'ar' ? 'لا توجد محادثات سابقة' : 'No previous conversations'}
                         </p>
                       )}
                     </div>
                   </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {t('technicalSupport')}
              </h1>
              <p className="text-sm text-gray-500">
                {t('onlineNow')}
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
            {t('transferToHuman')}
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
              placeholder={t('typeMessage')}
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

      {/* Transfer to Human Dialog for Desktop */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              {i18n.language === 'ar' ? 'التحويل إلى موظف الدعم' : 'Transfer to Support Agent'}
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-gray-600">
              {i18n.language === 'ar' ? 'للحصول على مساعدة فورية من فريق الدعم' : 'For immediate assistance from our support team'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <Phone className="h-12 w-12 text-brand-blue-600" />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">
                {i18n.language === 'ar' ? 'يرجى الاتصال على الرقم المجاني' : 'Please call our toll-free number'}
              </p>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-2xl font-bold text-brand-blue-600" dir="ltr">
                  01337571
                </p>
              </div>
              <p className="text-sm text-gray-600">
                {i18n.language === 'ar' 
                  ? 'متاح 24/7 لخدمتكم' 
                  : 'Available 24/7 to serve you'}
              </p>
            </div>
            <Button 
              onClick={() => setShowTransferDialog(false)}
              className="w-full bg-brand-gradient hover:opacity-90"
            >
              {i18n.language === 'ar' ? 'حسناً' : 'OK'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
