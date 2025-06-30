
import React from 'react';
import { MessageSquare, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="text-white w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-2xl block">
                  {isRTL ? 'نظام الدعم الفني' : 'Technical Support System'}
                </span>
                <span className="text-gray-300 text-sm">
                  {isRTL ? 'خدمة عملاء متميزة 24/7' : '24/7 Premium Customer Service'}
                </span>
              </div>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed mb-6">
              {isRTL 
                ? 'نقدم أفضل خدمات الدعم الفني مع فريق متخصص لمساعدتك في حل جميع مشاكلك التقنية بسرعة وكفاءة.'
                : 'We provide the best technical support services with a specialized team to help you solve all your technical problems quickly and efficiently.'
              }
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-blue-600 transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-blue-600 transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-blue-600 transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                  <span>{isRTL ? 'الرئيسية' : 'Home'}</span>
                </a>
              </li>
              <li>
                <a href="/chat" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                  <span>{isRTL ? 'الدردشة' : 'Chat'}</span>
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                  <span>{isRTL ? 'الأسئلة الشائعة' : 'FAQ'}</span>
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                  <span>{isRTL ? 'تسجيل الدخول' : 'Login'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300">
                <Mail className="w-5 h-5 text-brand-blue-400" />
                <span>support@techsupport.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300">
                <Phone className="w-5 h-5 text-brand-blue-400" />
                <span>+967 783251951</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300">
                <MapPin className="w-5 h-5 text-brand-blue-400" />
                <span>
                  {isRTL 
                    ? 'صنعاء، اليمن' 
                    : 'Sana\'a, Yemen'
                  }
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              © 2025 {isRTL ? 'نظام الدعم الفني' : 'Technical Support System'}. 
              {isRTL ? ' جميع الحقوق محفوظة.' : ' All rights reserved.'}
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                {isRTL ? 'شروط الخدمة' : 'Terms of Service'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
