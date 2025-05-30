
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, MessageSquare, HelpCircle, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

interface ChatRecord {
  id: string;
  user: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: 'completed' | 'ongoing';
}

interface FAQ {
  id: string;
  question_ar: string;
  answer_ar: string;
  question_en: string;
  answer_en: string;
}

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const [users] = useState<User[]>([
    { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', joinDate: '2024-01-15', status: 'active' },
    { id: '2', name: 'فاطمة علي', email: 'fatima@example.com', joinDate: '2024-01-20', status: 'active' },
    { id: '3', name: 'محمد أحمد', email: 'mohamed@example.com', joinDate: '2024-01-25', status: 'inactive' }
  ]);

  const [chats] = useState<ChatRecord[]>([
    { id: '1', user: 'أحمد محمد', startTime: '10:30', endTime: '10:45', duration: '15 دقيقة', status: 'completed' },
    { id: '2', user: 'فاطمة علي', startTime: '11:00', endTime: '11:20', duration: '20 دقيقة', status: 'completed' },
    { id: '3', user: 'محمد أحمد', startTime: '11:30', endTime: '-', duration: '-', status: 'ongoing' }
  ]);

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question_ar: 'كيف يمكنني بدء محادثة مع البوت؟',
      answer_ar: 'يمكنك بدء محادثة عن طريق الذهاب إلى صفحة الدردشة والنقر على زر "ابدأ المحادثة".',
      question_en: 'How can I start a chat with the bot?',
      answer_en: 'You can start a conversation by going to the chat page and clicking the "Start Chat" button.'
    }
  ]);

  const [newFAQ, setNewFAQ] = useState({
    question_ar: '',
    answer_ar: '',
    question_en: '',
    answer_en: ''
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddFAQ = () => {
    if (!newFAQ.question_ar || !newFAQ.answer_ar || !newFAQ.question_en || !newFAQ.answer_en) {
      toast.error(t('fillAllFields'));
      return;
    }

    const faq: FAQ = {
      id: Date.now().toString(),
      ...newFAQ
    };

    setFaqs(prev => [...prev, faq]);
    setNewFAQ({ question_ar: '', answer_ar: '', question_en: '', answer_en: '' });
    setIsAddDialogOpen(false);
    toast.success(t('faqAdded'));
  };

  const handleDeleteFAQ = (id: string) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
    toast.success(t('faqDeleted'));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('adminDashboard')}
        </h1>
        <p className="text-gray-600">
          {t('manageSystemSettings')}
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{t('users')}</span>
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>{t('chats')}</span>
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center space-x-2">
            <HelpCircle className="h-4 w-4" />
            <span>{t('faqs')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Users Management */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>{t('usersManagement')}</CardTitle>
              <CardDescription>
                {t('manageRegisteredUsers')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('email')}</TableHead>
                    <TableHead>{t('joinDate')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? t('active') : t('inactive')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chats Management */}
        <TabsContent value="chats">
          <Card>
            <CardHeader>
              <CardTitle>{t('chatsManagement')}</CardTitle>
              <CardDescription>
                {t('viewAllChats')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('user')}</TableHead>
                    <TableHead>{t('startTime')}</TableHead>
                    <TableHead>{t('endTime')}</TableHead>
                    <TableHead>{t('duration')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chats.map((chat) => (
                    <TableRow key={chat.id}>
                      <TableCell>{chat.user}</TableCell>
                      <TableCell>{chat.startTime}</TableCell>
                      <TableCell>{chat.endTime}</TableCell>
                      <TableCell>{chat.duration}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          chat.status === 'completed' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {chat.status === 'completed' ? t('completed') : t('ongoing')}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Management */}
        <TabsContent value="faqs">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('faqsManagement')}</CardTitle>
                  <CardDescription>
                    {t('manageFAQDatabase')}
                  </CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-brand-gradient hover:opacity-90">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('addQuestion')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{t('addNewQuestion')}</DialogTitle>
                      <DialogDescription>
                        {t('fillQuestionInBothLanguages')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="question_ar">{t('questionArabic')}</Label>
                        <Input
                          id="question_ar"
                          value={newFAQ.question_ar}
                          onChange={(e) => setNewFAQ({...newFAQ, question_ar: e.target.value})}
                          placeholder={t('enterQuestionArabic')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="answer_ar">{t('answerArabic')}</Label>
                        <Textarea
                          id="answer_ar"
                          value={newFAQ.answer_ar}
                          onChange={(e) => setNewFAQ({...newFAQ, answer_ar: e.target.value})}
                          placeholder={t('enterAnswerArabic')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="question_en">{t('questionEnglish')}</Label>
                        <Input
                          id="question_en"
                          value={newFAQ.question_en}
                          onChange={(e) => setNewFAQ({...newFAQ, question_en: e.target.value})}
                          placeholder={t('enterQuestionEnglish')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="answer_en">{t('answerEnglish')}</Label>
                        <Textarea
                          id="answer_en"
                          value={newFAQ.answer_en}
                          onChange={(e) => setNewFAQ({...newFAQ, answer_en: e.target.value})}
                          placeholder={t('enterAnswerEnglish')}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        {t('cancel')}
                      </Button>
                      <Button onClick={handleAddFAQ} className="bg-brand-gradient hover:opacity-90">
                        {t('save')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('questionArabic')}</TableHead>
                    <TableHead>{t('questionEnglish')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell className="max-w-xs truncate">{faq.question_ar}</TableCell>
                      <TableCell className="max-w-xs truncate">{faq.question_en}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteFAQ(faq.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Admin = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
          <AdminDashboard />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Admin;
