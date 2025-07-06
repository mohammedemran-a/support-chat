
-- إنشاء جدول قاعدة المعرفة للأسئلة الشائعة
INSERT INTO public.knowledge_base (question, answer, language_code) VALUES
-- الأسئلة المحاسبية باللغة العربية
('ما هي القيود المحاسبية؟', 'القيود المحاسبية هي عملية تسجيل المعاملات المالية في دفاتر الحسابات بطريقة منظمة وفقاً لمبدأ القيد المزدوج، حيث يتم تسجيل كل معاملة في حساب مدين وحساب دائن.', 'ar'),
('كيف أحسب الضريبة المضافة؟', 'الضريبة المضافة = مبلغ السلعة × نسبة الضريبة ÷ 100. مثلاً إذا كان سعر السلعة 100 ريال ونسبة الضريبة 15%، فإن الضريبة المضافة = 100 × 15 ÷ 100 = 15 ريال.', 'ar'),
('ما الفرق بين الميزانية العمومية وقائمة الدخل؟', 'الميزانية العمومية تُظهر الوضع المالي للشركة في تاريخ محدد وتشمل الأصول والخصوم وحقوق الملكية، بينما قائمة الدخل تُظهر الإيرادات والمصروفات خلال فترة زمنية معينة.', 'ar'),
('كيف أسجل عملية البيع الآجل؟', 'لتسجيل البيع الآجل: من حـ/ المدينون إلى حـ/ المبيعات (بالمبلغ الأساسي)، ومن حـ/ المدينون إلى حـ/ ضريبة القيمة المضافة (بمبلغ الضريبة).', 'ar'),
('ما هي طرق حساب الاستهلاك؟', 'هناك عدة طرق لحساب الاستهلاك: 1) الطريقة المستقيمة: (التكلفة - القيمة التخريدية) ÷ العمر الإنتاجي، 2) طريقة الرصيد المتناقص، 3) طريقة وحدات الإنتاج.', 'ar'),
('كيف أعد التسوية البنكية؟', 'التسوية البنكية تتم بمقارنة كشف الحساب البنكي مع دفتر النقدية، وتسجيل الفروقات مثل الشيكات المودعة غير المحصلة، والشيكات المحررة غير المصروفة، والعمولات البنكية.', 'ar'),
('ما هو الفرق بين الدين قصير الأجل وطويل الأجل؟', 'الدين قصير الأجل هو الالتزامات المستحقة خلال سنة واحدة أو أقل، مثل أوراق الدفع والدائنون، بينما الدين طويل الأجل يستحق بعد أكثر من سنة مثل القروض طويلة الأجل.', 'ar'),
('كيف أحسب نسبة السيولة؟', 'نسبة السيولة السريعة = (الأصول المتداولة - المخزون) ÷ الخصوم المتداولة، ونسبة السيولة العامة = الأصول المتداولة ÷ الخصوم المتداولة.', 'ar'),

-- الأسئلة المحاسبية باللغة الإنجليزية
('What are accounting entries?', 'Accounting entries are the systematic recording of financial transactions in accounting books following the double-entry principle, where each transaction is recorded in both debit and credit accounts.', 'en'),
('How do I calculate VAT?', 'VAT = Item Amount × VAT Rate ÷ 100. For example, if an item costs 100 SAR and VAT rate is 15%, then VAT = 100 × 15 ÷ 100 = 15 SAR.', 'en'),
('What is the difference between Balance Sheet and Income Statement?', 'Balance Sheet shows the financial position of a company at a specific date including assets, liabilities, and equity, while Income Statement shows revenues and expenses over a specific period.', 'en'),
('How do I record a credit sale?', 'To record credit sale: Dr. Accounts Receivable Cr. Sales (for base amount), and Dr. Accounts Receivable Cr. VAT Payable (for VAT amount).', 'en'),
('What are the methods of calculating depreciation?', 'There are several depreciation methods: 1) Straight-line method: (Cost - Salvage Value) ÷ Useful Life, 2) Declining balance method, 3) Units of production method.', 'en'),
('How do I prepare bank reconciliation?', 'Bank reconciliation is done by comparing bank statement with cash book, and recording differences such as deposits in transit, outstanding checks, and bank charges.', 'en'),
('What is the difference between short-term and long-term debt?', 'Short-term debt consists of obligations due within one year or less, such as notes payable and accounts payable, while long-term debt is due after more than one year like long-term loans.', 'en'),
('How do I calculate liquidity ratios?', 'Quick ratio = (Current Assets - Inventory) ÷ Current Liabilities, and Current ratio = Current Assets ÷ Current Liabilities.', 'en');

-- تم حذف إدراج بيانات الترجمات لأنها لم تعد مستخدمة
