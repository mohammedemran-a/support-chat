
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';
import { 
  Send, 
  Menu, 
  MessageCircle, 
  Plus, 
  Trash2, 
  Settings,
  LogOut 
} from 'lucide-react';
import { toast } from 'sonner';
import { useChatBot } from '@/hooks/useChatBot';
import { useConversationManager } from '@/hooks/useConversationManager';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { sendMessage } = useChatBot(i18n.language);
  const { 
    conversations, 
    createConversation, 
    saveMessage, 
    loadConversation,
    deleteConversation,
    conversationsLoading 
  } = useConversationManager();

  // Welcome message
  const welcomeMessage: Message = {
    id: 'welcome',
    role: 'assistant',
    content: t('chatWelcome') || 'أهلاً بك! كيف يمكنني مساعدتك اليوم؟',
    timestamp: new Date()
  };

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    // Add user message to UI
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Create conversation if first message
      let conversationId = currentConversationId;
      if (!conversationId) {
        console.log('Chat - Creating new conversation');
        conversationId = await createConversation(inputMessage.trim().substring(0, 50));
        setCurrentConversationId(conversationId);
      }

      // Save user message
      if (conversationId) {
        await saveMessage({
          conversationId,
          content: userMessage.content,
          role: 'user'
        });
      }

      // Get bot response
      const botResponse = await sendMessage(inputMessage.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botResponse,
        timestamp: new Date()
      };

      // Add bot response to UI
      setMessages(prev => [...prev, assistantMessage]);

      // Save bot message
      if (conversationId) {
        await saveMessage({
          conversationId,
          content: botResponse,
          role: 'assistant'
        });
      }

      toast.success(t('messageSent') || 'تم إرسال الرسالة');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('messageError') || 'خطأ في إرسال الرسالة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([welcomeMessage]);
    setCurrentConversationId(null);
    setIsSidebarOpen(false);
    toast.success(t('newChatStarted') || 'تم بدء محادثة جديدة');
  };

  const handleLoadConversation = async (conversationId: string) => {
    try {
      const conversationMessages = await loadConversation(conversationId);
      const formattedMessages: Message[] = [
        welcomeMessage,
        ...conversationMessages.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at)
        }))
      ];
      
      setMessages(formattedMessages);
      setCurrentConversationId(conversationId);
      setIsSidebarOpen(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error(t('loadConversationError') || 'خطأ في تحميل المحادثة');
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
      if (currentConversationId === conversationId) {
        handleNewChat();
      }
      toast.success(t('conversationDeleted') || 'تم حذف المحادثة');
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error(t('deleteConversationError') || 'خطأ في حذف المحادثة');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success(t('logoutSuccess') || 'تم تسجيل الخروج بنجاح');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(t('logoutError') || 'خطأ في تسجيل الخروج');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-80 dark:bg-gray-800 dark:border-gray-700">
          <SheetHeader>
            <SheetTitle className="dark:text-white">{t('menu') || 'القائمة'}</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            {/* New Chat Button */}
            <Button
              onClick={handleNewChat}
              className="w-full mb-4 bg-brand-gradient hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('newChat') || 'محادثة جديدة'}
            </Button>

            {/* Previous Conversations */}
            <div className="flex-1 overflow-hidden">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('previousChats') || 'المحادثات السابقة'}
              </h3>
              
              <ScrollArea className="h-[400px]">
                {conversationsLoading ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    {t('loading') || 'جار التحميل...'}
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    {t('noConversations') || 'لا توجد محادثات سابقة'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          currentConversationId === conversation.id
                            ? 'bg-brand-blue-50 border-brand-blue-200 dark:bg-gray-700 dark:border-gray-600'
                            : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
                        }`}
                      >
                        <button
                          onClick={() => handleLoadConversation(conversation.id)}
                          className="flex-1 text-left"
                        >
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="w-4 h-4 text-brand-blue-600 dark:text-brand-blue-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {conversation.title || t('untitledChat') || 'محادثة بلا عنوان'}
                            </span>
                          </div>
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteConversation(conversation.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <Button
                variant="outline"
                onClick={() => navigate('/settings')}
                className="w-full justify-start dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t('settings') || 'الإعدادات'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('logout') || 'تسجيل الخروج'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-brand-gradient rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900 dark:text-white">
                    {t('technicalSupport') || 'الدعم الفني'}
                  </h1>
                  <p className="text-sm text-brand-green-600 dark:text-brand-green-400">
                    {t('onlineNow') || 'متصل الآن'}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleNewChat}
              variant="outline"
              size="sm"
              className="hidden sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('newChat') || 'محادثة جديدة'}
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-brand-gradient text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}>
                  <CardContent className="p-4">
                    <p className={`text-sm ${
                      message.role === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {message.content}
                    </p>
                    <span className={`text-xs mt-2 block ${
                      message.role === 'user' 
                        ? 'text-white/80' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('botTyping') || 'البوت يكتب...'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex space-x-2"
            >
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('typeMessage') || 'اكتب رسالتك هنا...'}
                disabled={isLoading}
                className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <Button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-brand-gradient hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
