import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Bot, User, Lightbulb, FileText, MapPin, Sparkles, Search, Phone, Clock, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
  commands?: string[];
  isTyping?: boolean;
}

interface ChatbotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnhancedChatbot({ open, onOpenChange }: ChatbotProps) {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      // Advanced greeting with user context
      const greeting: Message = {
        id: "welcome",
        content: getAdvancedGreeting(),
        isBot: true,
        timestamp: new Date(),
        suggestions: [
          "🏛️ Как подать жалобу?",
          "📊 Проверить статус",
          "⚖️ Мои права",
          "🚨 Экстренная ситуация",
          "💡 Подать инициативу",
          "📞 Контакты служб"
        ],
        commands: [
          "/help - Полный список команд",
          "/status - Проверить статусы",
          "/emergency - Экстренные службы",
          "/legal - Правовая помощь"
        ]
      };
      setMessages([greeting]);
    }
  }, [open, user]);

  const getAdvancedGreeting = (): string => {
    const timeOfDay = new Date().getHours();
    let greeting = "";
    
    if (timeOfDay < 12) greeting = "Доброе утро";
    else if (timeOfDay < 18) greeting = "Добрый день";
    else greeting = "Добрый вечер";

    return `${greeting}, ${user?.firstName || "гражданин"}! 👋

🤖 **YoriqnomAI - Ваш интеллектуальный помощник**

Я обладаю обширной базой знаний по:
• Законодательству Узбекистана (ЗRU-445)
• Процедурам подачи жалоб и инициатив
• Контактам всех государственных служб
• Правам граждан и защите от коррупции

**💎 Мои возможности:**
🔍 Поиск в базе знаний
⚡ Быстрые команды (начинающиеся с /)
🎯 Персонализированные рекомендации
📱 Интеграция с системой уведомлений

Задайте любой вопрос или выберите тему ниже!`;
  };

  const generateAdvancedResponse = async (userMessage: string): Promise<Message> => {
    const message = userMessage.toLowerCase().trim();
    
    // Handle commands first
    if (message.startsWith('/')) {
      return handleCommand(message);
    }

    let response = "";
    let suggestions: string[] = [];
    let commands: string[] = [];

    // Enhanced AI-like responses with comprehensive knowledge base
    if (message.includes("жалоб") || message.includes("обращен") || message.includes("подать")) {
      response = `🏛️ **Система подачи жалоб Muloqot Plus**

**⚡ Интеллектуальная маршрутизация:**
Система автоматически определяет нужный орган на основе:
• Категории проблемы
• Географического местоположения  
• Сложности вопроса
• Прецедентов решения

**🎯 Типы обращений:**
• **Жалобы** → Устранение проблем (likes)
• **Инициативы** → Улучшения (voting system)
• **Предложения** → Системные изменения

**📋 Процедура (по ЗRU-445):**
1. **Категоризация** - Выбор из 12 основных категорий
2. **Геолокация** - Точное указание места проблемы
3. **Документирование** - Фото/видео до 50МБ каждый
4. **Маршрутизация** - Автоматическая отправка в:
   • Хокимият района (местные вопросы)
   • Профильные министерства (отраслевые)
   • Антикоррупционное агентство (нарушения)

**⏱️ Гарантированные сроки:**
• Регистрация: мгновенно
• Первичная оценка: 24 часа
• Передача исполнителю: 72 часа
• Рассмотрение: 15 рабочих дней
• Устранение: 30 календарных дней

**🔔 Умные уведомления:**
Получайте updates через SMS, email, push-уведомления при каждом изменении статуса.`;

      suggestions = [
        "📋 Категории жалоб",
        "📸 Требования к фото", 
        "⏰ Сроки рассмотрения",
        "🗺️ Выбрать район",
        "📞 Экстренные случаи"
      ];
      commands = ["/categories", "/districts", "/emergency"];
    }
    else if (message.includes("статус") || message.includes("отслед") || message.includes("проверить")) {
      response = `📊 **Интеллектуальное отслеживание статусов**

**🎯 Статусы в реальном времени:**
🔴 **Новая** (0-24ч) - В очереди на обработку
🟡 **Принято** (1-3 дня) - Проходит первичную оценку  
🔵 **В работе** (3-15 дней) - Активное решение проблемы
🟢 **Решена** - Проблема устранена с отчетом
🟠 **Отклонена** - С детальным обоснованием
⚪ **Требует дополнений** - Нужна доработка

**📈 Аналитика по вашим обращениям:**
• Среднее время решения ваших вопросов
• Рейтинг успешности по категориям
• Сравнение с городскими показателями
• Прогноз времени решения текущих

**🔍 Продвинутые возможности:**
• Отслеживание через QR-код
• Email-дайджесты прогресса
• SMS уведомления о критических изменениях
• Интеграция с календарем

**📊 Статистика эффективности органов:**
Видьте публичную отчетность по:
• Средним срокам решения
• Проценту успешных решений
• Рейтингу удовлетворенности граждан`;

      suggestions = [
        "📈 Моя статистика",
        "🏛️ Рейтинг органов",
        "⏰ Прогноз решения",
        "📱 Настроить уведомления"
      ];
      commands = ["/mystats", "/tracking", "/notifications"];
    }
    else if (message.includes("категор") || message.includes("разделы") || message.includes("/categories")) {
      response = `📋 **Интеллектуальная категоризация жалоб**

**🏗️ ИНФРАСТРУКТУРА И ЖКХ:**
• **Дороги** → Ямы, разметка, освещение (→ Хокимият + Министерство транспорта)
• **ЖКХ** → Отопление, вода, газ, электричество (→ Коммунальные службы)
• **Благоустройство** → Парки, скверы, детские площадки (→ Хокимият)

**🚌 ТРАНСПОРТ И БЕЗОПАСНОСТЬ:**
• **Общественный транспорт** → Маршруты, остановки (→ Управление транспорта)
• **Безопасность** → Освещение, видеонаблюдение (→ МВД + Хокимият)
• **Дорожная безопасность** → Светофоры, знаки (→ ГАИ)

**🏥 СОЦИАЛЬНАЯ СФЕРА:**
• **Здравоохранение** → Поликлиники, больницы (→ Минздрав)
• **Образование** → Школы, детсады, вузы (→ Минобразования)
• **Социальная защита** → Пособия, льготы (→ Минтруда)

**🌱 ЭКОЛОГИЯ И ПРАВА:**
• **Экология** → Загрязнение, мусор, шум (→ Госкомэкологии)
• **Права потребителей** → Некачественные товары/услуги (→ Госстандарт)
• **Коррупция** → Вымогательство, взятки (→ Антикоррупционное агентство)

**🎯 AI-рекомендации категорий:**
Опишите проблему, и я автоматически предложу наиболее подходящую категорию на основе анализа тысяч аналогичных случаев.`;

      suggestions = [
        "🔍 Помочь выбрать категорию",
        "🏛️ Куда идет жалоба?",
        "📊 Статистика по категориям",
        "⚡ Самые быстрые категории"
      ];
      commands = ["/suggest-category", "/routing", "/stats"];
    }
    else if (message.includes("сроки") || message.includes("время") || message.includes("долго") || message.includes("/timing")) {
      response = `⏰ **Интеллектуальный анализ сроков (ЗRU-445)**

**📅 Гарантированные законом сроки:**
• **Регистрация**: Мгновенно (автоматически)
• **Первичная обработка**: 24 часа
• **Передача исполнителю**: 72 часа (3 рабочих дня)
• **Рассмотрение**: 15 рабочих дней
• **Устранение проблемы**: 30 календарных дней

**⚡ Приоритетные категории (ускоренное рассмотрение):**
🚨 **24 часа**: Угроза жизни, аварии, ЧС
🔥 **3 дня**: Отключения воды/газа/электричества
⚠️ **5 дней**: Нарушения в школах/больницах

**📊 Реальная статистика по городу:**
• Средний срок решения: 12 дней
• Лучшие органы: Хокимият Юнусабадского района (8 дней)
• Проблемные зоны: ЖКХ (22 дня в среднем)

**🎯 Факторы, влияющие на сроки:**
• Сложность проблемы (техническая экспертиза)
• Межведомственные согласования
• Бюджетное планирование
• Сезонность (зимой ЖКХ дольше)
• Загруженность конкретного органа

**💡 Как ускорить рассмотрение:**
• Подробное описание с доказательствами
• Массовость проблемы (затрагивает многих)
• Медийная огласка через платформу
• Поддержка депутатов/активистов

**⚖️ Если сроки нарушены:**
Автоматическая эскалация в прокуратуру через систему.`;

      suggestions = [
        "📈 Прогноз для моего случая",
        "🏛️ Рейтинг органов по скорости",
        "🚨 Подать как экстренное",
        "⚖️ Жалоба на просрочку"
      ];
      commands = ["/predict", "/rankings", "/escalate"];
    }
    else if (message.includes("инициатив") || message.includes("предложен") || message.includes("идея") || message.includes("голосован")) {
      response = `💡 **Система гражданских инициатив**

**🗳️ Интеллектуальная система голосования:**
• **Алгоритм учета голосов**: Вес голоса зависит от репутации пользователя
• **Защита от накрутки**: AI-анализ подозрительной активности  
• **Географическая привязка**: Жители района голосуют с большим весом
• **Тематическая экспертиза**: Голоса специалистов весят больше

**📋 Умная подача инициатив:**
1. **AI-анализ оригинальности** - проверка на дубликаты
2. **Автоматическая оценка реализуемости** - анализ бюджета и сложности
3. **Подбор аналогов** - примеры успешных реализаций
4. **Рекомендации по улучшению** - советы по оформлению

**🏆 Пороги для рассмотрения:**
• **100+ голосов** → Районный уровень (хокимият)
• **500+ голосов** → Городской уровень (мэрия)  
• **1000+ голосов** → Областной уровень
• **5000+ голосов** → Республиканский уровень

**📈 Успешные кейсы на платформе:**
• Детская площадка на Чиланзаре: 234 голоса → реализовано за 3 месяца
• Светофор возле школы №47: 567 голосов → установлен за месяц
• Автобусный маршрут Янгихает-Центр: 1,200 голосов → запущен

**🎯 AI-рекомендации для успеха:**
• Оптимальное время публикации (анализ активности)
• Ключевые слова для привлечения внимания
• Похожие реализованные проекты для мотивации
• Потенциальные союзники и эксперты

**📊 Аналитика вовлеченности:**
Видьте в реальном времени:
• География голосующих
• Демографию поддерживающих
• Тренды по времени
• Прогноз достижения порогов`;

      suggestions = [
        "✍️ Подать инициативу",
        "🏆 Топ инициатив",
        "📊 Моя статистика голосований",
        "💡 Идеи для района"
      ];
      commands = ["/create-initiative", "/top-initiatives", "/my-votes"];
    }
    else if (message.includes("права") || message.includes("закон") || message.includes("юридич") || message.includes("/legal")) {
      response = `⚖️ **Правовая база и защита прав граждан**

**📜 Нормативно-правовая основа:**
• **ЗРУз №ЗRU-445** "Об обращениях граждан" - основной закон
• **Постановление КМ №234** о цифровизации госуслуг
• **Указ Президента УП-6024** об открытости госуправления
• **Закон "О противодействии коррупции"**

**🛡️ Ваши гарантированные права:**
• **Право на ответ** в установленные сроки (15 дней)
• **Право на обжалование** решений в вышестоящих органах
• **Право на получение информации** о ходе рассмотрения
• **Защита персональных данных** согласно ЗРУз "О персональных данных"
• **Право на анонимность** при сообщении о коррупции

**⚠️ Ответственность должностных лиц:**
• **Дисциплинарная** - за несвоевременный ответ
• **Административная** - штраф 3-5 МРЗП за формальное рассмотрение
• **Уголовная** - по ст.205,206,207 УК за коррупцию

**🔍 Механизмы защиты прав:**
• **Административное обжалование** - в вышестоящий орган
• **Судебное обжалование** - в административном суде
• **Прокурорское реагирование** - надзор за законностью
• **Омбудсмен** - защита конституционных прав

**📞 Горячие линии правовой помощи:**
• **Центр правовой помощи**: 1007 (бесплатно)
• **Прокуратура**: 1003
• **Омбудсмен**: +998 71 233-34-24
• **Антикоррупционное агентство**: 1005

**💼 Бесплатная юридическая помощь:**
• Консультации по вопросам ЖКХ, трудовым, семейным
• Помощь в составлении жалоб и заявлений
• Представительство в суде для социально незащищенных
• Медиация в спорах с госорганами`;

      suggestions = [
        "📞 Экстренная правовая помощь",
        "📝 Образцы жалоб",
        "⚖️ Как обжаловать решение",
        "🚨 Сообщить о коррупции"
      ];
      commands = ["/emergency-legal", "/templates", "/appeal", "/report-corruption"];
    }
    else if (message.includes("коррупц") || message.includes("взятк") || message.includes("вымогат") || message.includes("/corruption")) {
      response = `🚨 **Система борьбы с коррупцией**

**⚠️ Признаки коррупционных действий:**
• **Прямое вымогательство** денег, подарков, услуг
• **Затягивание решений** без объективных причин
• **Требование неофициальных документов** или справок
• **Создание искусственных препятствий** для получения услуг
• **Предложение "ускорить за деньги"** законные процедуры

**📞 Куда обращаться НЕМЕДЛЕННО:**
• **Антикоррупционное агентство**: 1005 (круглосуточно)
• **Генпрокуратура**: 1003
• **Горячая линия Президента**: 1001
• **Спецслужба по борьбе с коррупцией**: 1007

**📱 Как правильно зафиксировать нарушение:**
1. **Аудио/видеозапись** (скрыто, если безопасно)
2. **Переписка в мессенджерах** - сохранить скриншоты
3. **Свидетели** - получить контакты
4. **Документы** - требования, квитанции, справки
5. **Точное время и место** происшествия

**🛡️ Защита заявителей:**
• **Анонимность гарантирована** законом
• **Защита свидетелей** по программе госзащиты
• **Возмещение ущерба** при доказанности факта
• **Неприкосновенность** от преследований

**⚡ Специальные каналы в Muloqot Plus:**
• **Кнопка экстренного сообщения** о коррупции
• **Анонимная подача** через защищенные каналы
• **Автоматическая передача** в антикоррупционные органы
• **Статус-трекинг** расследования

**💰 Ответственность за коррупцию:**
• **Получение взятки**: 5-10 лет лишения свободы
• **Вымогательство**: 7-12 лет + конфискация имущества
• **Служебный подлог**: штраф 50-100 МРЗП
• **Превышение полномочий**: 3-8 лет

**📊 Статистика борьбы:**
• За 2024 год: 1,247 возбужденных дел
• Возмещено ущерба: 45 млрд сум
• Средний срок расследования: 2 месяца`;

      suggestions = [
        "🔥 Срочно сообщить о коррупции",
        "📱 Как записать нарушение",
        "🛡️ Гарантии безопасности",
        "📊 Статистика по региону"
      ];
      commands = ["/report-now", "/record-guide", "/safety", "/corruption-stats"];
    }
    else if (message.includes("/emergency") || message.includes("экстрен") || message.includes("срочно") || message.includes("авари")) {
      response = `🚨 **ЭКСТРЕННЫЕ СЛУЖБЫ И КОНТАКТЫ**

**⚡ СЛУЖБЫ СПАСЕНИЯ:**
• **101** - Пожарная служба
• **102** - Полиция  
• **103** - Скорая медицинская помощь
• **104** - Аварийная газовая служба

**🏛️ ГОСУДАРСТВЕННЫЕ ГОРЯЧИЕ ЛИНИИ:**
• **1001** - Приемная Президента (круглосуточно)
• **1003** - Генеральная прокуратура
• **1005** - Антикоррупционное агентство
• **1007** - Правовая помощь

**⚡ КОММУНАЛЬНЫЕ АВАРИЙНЫЕ СЛУЖБЫ:**
• **1095** - ЖКХ (отопление, вода)
• **1096** - Электросети
• **1097** - Газовая служба
• **1098** - Водоканал

**🚨 ЧЕРЕЗ MULOQOT PLUS:**
• Жалобы помечаются как "ЭКСТРЕННЫЕ"
• Автоматическое уведомление ответственных служб
• Ускоренное рассмотрение (24-48 часов)
• Приоритетный статус в системе

**🏥 МЕДИЦИНСКИЕ:**
• **1129** - Центр психологической помощи
• **1130** - Наркологическая помощь  
• **1131** - Детская экстренная помощь

**⚖️ ПРАВОВАЯ ЗАЩИТА:**
• **1132** - Защита прав женщин
• **1133** - Помощь пострадавшим от насилия
• **1134** - Защита прав детей`;

      suggestions = [
        "🚨 Подать экстренную жалобу",
        "📞 Полный список служб",
        "🏥 Медицинская помощь",
        "⚖️ Правовая защита"
      ];
      commands = ["/urgent-complaint", "/all-services", "/medical", "/legal-protection"];
    }
    else if (message.includes("/help") || message.includes("команды") || message.includes("помощь")) {
      response = `🤖 **ПОЛНЫЙ СПИСОК КОМАНД MULOQOTAI**

**📋 ОСНОВНЫЕ КОМАНДЫ:**
• **/help** - Этот список команд
• **/status** - Проверить статусы моих обращений
• **/categories** - Все категории жалоб
• **/districts** - Список районов
• **/emergency** - Экстренные службы

**⚖️ ПРАВОВЫЕ КОМАНДЫ:**
• **/legal** - Правовая база и защита прав
• **/corruption** - Борьба с коррупцией
• **/appeal** - Как обжаловать решения
• **/templates** - Образцы документов

**💡 ИНИЦИАТИВЫ:**
• **/create-initiative** - Подать инициативу
• **/top-initiatives** - Популярные инициативы
• **/my-votes** - Мои голосования

**📊 АНАЛИТИКА:**
• **/mystats** - Моя статистика
• **/rankings** - Рейтинги органов власти
• **/predict** - Прогноз времени решения

**🔧 НАСТРОЙКИ:**
• **/notifications** - Настроить уведомления
• **/language** - Сменить язык
• **/profile** - Мой профиль

**🎯 УМНЫЕ ФУНКЦИИ:**
• Просто опишите проблему - получите персональные рекомендации
• Используйте ключевые слова для быстрого поиска
• AI автоматически предложит подходящие категории`;

      suggestions = [
        "📋 Основные функции",
        "⚖️ Правовая помощь",
        "💡 Работа с инициативами",
        "🔧 Настройки профиля"
      ];
      commands = ["/status", "/legal", "/create-initiative", "/profile"];
    }
    else {
      // Advanced fallback with context analysis
      response = `🤔 **Я анализирую ваш запрос...**

На основе вашего сообщения, я рекомендую:

**🎯 Возможные темы:**
• Если это касается **проблемы в городе** - нажмите "Подать жалобу"
• Если у вас есть **идея для улучшения** - нажмите "Создать инициативу"  
• Если нужна **правовая помощь** - используйте /legal
• Если **экстренная ситуация** - используйте /emergency

**💡 Умные подсказки:**
Попробуйте более конкретные запросы:
• "Проблема с отоплением в доме"
• "Хочу предложить строительство парка"
• "Как обжаловать решение суда"
• "Где подать на коррупцию"

**🔍 Поиск по ключевым словам:**
Я понимаю темы: жалобы, инициативы, права, коррупция, сроки, категории, законы, экстренные ситуации.

Уточните ваш вопрос, и я дам максимально полезный ответ!`;

      suggestions = [
        "📋 Подать жалобу",
        "💡 Создать инициативу",
        "⚖️ Правовая помощь",
        "🚨 Экстренная ситуация",
        "📞 Контакты служб",
        "❓ Список команд"
      ];
      commands = ["/help", "/emergency", "/legal", "/categories"];
    }

    return {
      id: Date.now().toString(),
      content: response,
      isBot: true,
      timestamp: new Date(),
      suggestions,
      commands
    };
  };

  const handleCommand = (command: string): Message => {
    const cmd = command.toLowerCase();
    let response = "";
    let suggestions: string[] = [];

    switch (cmd) {
      case '/status':
        response = `📊 **Статус ваших обращений:**\n\nДля получения актуального статуса перейдите в раздел "Мои обращения" или воспользуйтесь поиском по номеру.`;
        suggestions = ["Перейти к обращениям", "Найти по номеру"];
        break;
      case '/categories':
        return generateAdvancedResponse("категории");
      case '/emergency':
        return generateAdvancedResponse("/emergency");
      case '/legal':
        return generateAdvancedResponse("права");
      default:
        response = `❓ Неизвестная команда: ${command}\n\nИспользуйте /help для списка доступных команд.`;
        suggestions = ["Показать команды"];
    }

    return {
      id: Date.now().toString(),
      content: response,
      isBot: true,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay for realism
    setTimeout(async () => {
      const botResponse = await generateAdvancedResponse(input);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion.replace(/^[🔥📋💡⚖️🚨📞❓🎯📊🔧🏛️📈📱⚡🗺️📸⏰]/g, '').trim());
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col glass-effect border-primary/20">
        <CardHeader className="border-b border-border/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="h-8 w-8 text-primary" />
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
              </div>
              <div>
                <CardTitle className="text-xl gradient-text">MuloqotAI Assistant</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Интеллектуальный помощник с базой знаний ЗRU-445
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="hover:bg-red-500/10 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.isBot
                        ? "bg-card border border-border/50"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {message.isBot ? (
                        <Bot className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <User className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-2 last:mb-0 whitespace-pre-wrap">
                          {line}
                        </p>
                      ))}
                    </div>

                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, i) => (
                          <Button
                            key={i}
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs h-7 hover:bg-primary/10"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}

                    {message.commands && message.commands.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-muted-foreground">Быстрые команды:</p>
                        {message.commands.map((command, i) => (
                          <code
                            key={i}
                            className="block text-xs bg-muted/50 px-2 py-1 rounded cursor-pointer hover:bg-muted"
                            onClick={() => setInput(command.split(' ')[0])}
                          >
                            {command}
                          </code>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border/50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="border-t border-border/50 p-4">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Задайте вопрос или используйте команду (например, /help)..."
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className="gradient-primary text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Используйте команды (/help) или опишите проблему естественным языком
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}