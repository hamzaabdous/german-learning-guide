import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Check, X, Play, Pause, Volume2 } from 'lucide-react';

const GermanA1App = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [germanVoices, setGermanVoices] = useState([]);

  // Initialize German voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const german = voices.filter(voice => 
        voice.lang.startsWith('de') || 
        voice.lang.includes('DE') || 
        voice.name.toLowerCase().includes('german') ||
        voice.name.toLowerCase().includes('deutsch')
      );
      setGermanVoices(german);
    };

    // Load voices immediately if available
    loadVoices();
    
    // Also load when voices change (some browsers load voices asynchronously)
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Extended vocabulary data from both PDFs
  const vocabularyData = {
    greetings: [
      { german: 'Hallo', arabic: 'مرحبا', pronunciation: 'هالو', context: 'Informal greeting' },
      { german: 'Guten Morgen', arabic: 'صباح الخير', pronunciation: 'غوتن مورغن', context: 'Good morning (until ~10 AM)' },
      { german: 'Guten Tag', arabic: 'نهارك سعيد', pronunciation: 'غوتن تاغ', context: 'Good day (10 AM - 6 PM)' },
      { german: 'Guten Abend', arabic: 'مساء الخير', pronunciation: 'غوتن آبنت', context: 'Good evening (after 6 PM)' },
      { german: 'Gute Nacht', arabic: 'ليلة سعيدة', pronunciation: 'غوته ناخت', context: 'Good night' },
      { german: 'Auf Wiedersehen', arabic: 'إلى اللقاء', pronunciation: 'أوف فيدرزهن', context: 'Formal goodbye' },
      { german: 'Tschüss', arabic: 'مع السلامة', pronunciation: 'تشووس', context: 'Informal goodbye' },
      { german: 'Bitte', arabic: 'من فضلك', pronunciation: 'بِته', context: 'Please' },
      { german: 'Danke', arabic: 'شكرا', pronunciation: 'دانكه', context: 'Thank you' },
      { german: 'Entschuldigung', arabic: 'عذرا', pronunciation: 'إنتشولديغونغ', context: 'Excuse me/Sorry' }
    ],
    personalInfo: [
      { german: 'Ich heiße...', arabic: 'اسمي...', pronunciation: 'إيخ هايسه...', context: 'My name is...' },
      { german: 'Wie heißen Sie?', arabic: 'ما اسمك؟', pronunciation: 'في هايسن زي؟', context: "What's your name? (formal)" },
      { german: 'Wie heißt du?', arabic: 'ما اسمك؟', pronunciation: 'في هايست دو؟', context: "What's your name? (informal)" },
      { german: 'Ich bin...', arabic: 'أنا...', pronunciation: 'إيخ بين...', context: 'I am...' },
      { german: 'Ich komme aus...', arabic: 'أنا من...', pronunciation: 'إيخ كوَمه أوس...', context: 'I come from...' },
      { german: 'Ich wohne in...', arabic: 'أسكن في...', pronunciation: 'إيخ فوهنه إين...', context: 'I live in...' },
      { german: 'Wie alt sind Sie?', arabic: 'كم عمرك؟', pronunciation: 'في ألت زينت زي؟', context: 'How old are you?' },
      { german: 'Ich bin ... Jahre alt', arabic: 'عمري ... سنة', pronunciation: 'إيخ بين ... ياهره ألت', context: 'I am ... years old' }
    ],
    family: [
      { german: 'die Familie', arabic: 'العائلة', pronunciation: 'دي فاميليه', context: 'Family' },
      { german: 'der Vater', arabic: 'الأب', pronunciation: 'دير فاتر', context: 'Father' },
      { german: 'die Mutter', arabic: 'الأم', pronunciation: 'دي موتر', context: 'Mother' },
      { german: 'der Sohn', arabic: 'الابن', pronunciation: 'دير زون', context: 'Son' },
      { german: 'die Tochter', arabic: 'البنت', pronunciation: 'دي توختر', context: 'Daughter' },
      { german: 'der Bruder', arabic: 'الأخ', pronunciation: 'دير برودر', context: 'Brother' },
      { german: 'die Schwester', arabic: 'الأخت', pronunciation: 'دي شفستر', context: 'Sister' },
      { german: 'die Eltern', arabic: 'الوالدان', pronunciation: 'دي إلترن', context: 'Parents' },
      { german: 'verheiratet', arabic: 'متزوج', pronunciation: 'فرهايراتت', context: 'Married' },
      { german: 'ledig', arabic: 'أعزب', pronunciation: 'لديخ', context: 'Single' }
    ],
    colors: [
      { german: 'rot', arabic: 'أحمر', pronunciation: 'روت', context: 'Red' },
      { german: 'blau', arabic: 'أزرق', pronunciation: 'بلاو', context: 'Blue' },
      { german: 'grün', arabic: 'أخضر', pronunciation: 'غروين', context: 'Green' },
      { german: 'gelb', arabic: 'أصفر', pronunciation: 'غِلب', context: 'Yellow' },
      { german: 'schwarz', arabic: 'أسود', pronunciation: 'شفارتس', context: 'Black' },
      { german: 'weiß', arabic: 'أبيض', pronunciation: 'فايس', context: 'White' },
      { german: 'grau', arabic: 'رمادي', pronunciation: 'غراو', context: 'Gray' },
      { german: 'braun', arabic: 'بني', pronunciation: 'براون', context: 'Brown' }
    ],
    daysOfWeek: [
      { german: 'Montag', arabic: 'الاثنين', pronunciation: 'مونتاغ', context: 'Monday' },
      { german: 'Dienstag', arabic: 'الثلاثاء', pronunciation: 'دينستاغ', context: 'Tuesday' },
      { german: 'Mittwoch', arabic: 'الأربعاء', pronunciation: 'ميتووخ', context: 'Wednesday' },
      { german: 'Donnerstag', arabic: 'الخميس', pronunciation: 'دونرشتاغ', context: 'Thursday' },
      { german: 'Freitag', arabic: 'الجمعة', pronunciation: 'فرايتاغ', context: 'Friday' },
      { german: 'Samstag', arabic: 'السبت', pronunciation: 'زامستاغ', context: 'Saturday' },
      { german: 'Sonntag', arabic: 'الأحد', pronunciation: 'زونتاغ', context: 'Sunday' }
    ],
    basicVerbs: [
      { german: 'sein', arabic: 'يكون', pronunciation: 'زاين', context: 'To be' },
      { german: 'haben', arabic: 'يملك', pronunciation: 'هابن', context: 'To have' },
      { german: 'gehen', arabic: 'يذهب', pronunciation: 'غيهن', context: 'To go' },
      { german: 'kommen', arabic: 'يأتي', pronunciation: 'كومن', context: 'To come' },
      { german: 'sprechen', arabic: 'يتكلم', pronunciation: 'شبريخن', context: 'To speak' },
      { german: 'verstehen', arabic: 'يفهم', pronunciation: 'فرشتيهن', context: 'To understand' },
      { german: 'lernen', arabic: 'يتعلم', pronunciation: 'ليرنن', context: 'To learn' },
      { german: 'arbeiten', arabic: 'يعمل', pronunciation: 'أربايتن', context: 'To work' },
      { german: 'wohnen', arabic: 'يسكن', pronunciation: 'فوهنن', context: 'To live/reside' },
      { german: 'heißen', arabic: 'يسمى', pronunciation: 'هايسن', context: 'To be called' }
    ],
    commonQuestions: [
      { german: 'Wie geht es Ihnen?', arabic: 'كيف حالك؟', pronunciation: 'في غيت إس إيهنن؟', context: 'How are you? (formal)' },
      { german: "Wie geht's?", arabic: 'كيف الحال؟', pronunciation: 'في غيتس؟', context: 'How are you? (informal)' },
      { german: 'Wo wohnen Sie?', arabic: 'أين تسكن؟', pronunciation: 'فو فوهنن زي؟', context: 'Where do you live?' },
      { german: 'Was machen Sie?', arabic: 'ماذا تعمل؟', pronunciation: 'فاس ماخن زي؟', context: 'What do you do?' },
      { german: 'Sprechen Sie Deutsch?', arabic: 'هل تتكلم الألمانية؟', pronunciation: 'شبريخن زي دويتش؟', context: 'Do you speak German?' },
      { german: 'Verstehen Sie?', arabic: 'هل تفهم؟', pronunciation: 'فرشتيهن زي؟', context: 'Do you understand?' }
    ],
    usefulPhrases: [
      { german: 'Ich verstehe nicht', arabic: 'لا أفهم', pronunciation: 'إيخ فرشتيهه نيخت', context: "I don't understand" },
      { german: 'Können Sie das wiederholen?', arabic: 'هل يمكنك التكرار؟', pronunciation: 'كونن زي داس فيدرهولن؟', context: 'Can you repeat that?' },
      { german: 'Sprechen Sie langsamer?', arabic: 'هل تتكلم ببطء؟', pronunciation: 'شبريخن زي لانغزامر؟', context: 'Can you speak slower?' },
      { german: 'Wie bitte?', arabic: 'عفوا؟', pronunciation: 'في بِته؟', context: 'Pardon? What?' },
      { german: 'Keine Ahnung', arabic: 'لا أعرف', pronunciation: 'كاينه آهنونغ', context: "No idea/I don't know" },
      { german: 'Es tut mir leid', arabic: 'أنا آسف', pronunciation: 'إس توت مير لايت', context: "I'm sorry" }
    ]
  };

  // Grammar data from the first PDF
  const grammarData = {
    auxiliaryVerbs: {
      sein: {
        conjugations: [
          { pronoun: 'ich', form: 'bin', arabic: 'أنا أكون', pronunciation: 'إيخ بين' },
          { pronoun: 'du', form: 'bist', arabic: 'أنت تكون', pronunciation: 'دو بِشت' },
          { pronoun: 'er/sie/es', form: 'ist', arabic: 'هو/هي يكون', pronunciation: 'إير/زي/إس إشت' },
          { pronoun: 'wir', form: 'sind', arabic: 'نحن نكون', pronunciation: 'فير زينت' },
          { pronoun: 'ihr', form: 'seid', arabic: 'أنتم تكونون', pronunciation: 'إير زايت' },
          { pronoun: 'sie/Sie', form: 'sind', arabic: 'هم يكونون', pronunciation: 'زي زينت' }
        ]
      },
      haben: {
        conjugations: [
          { pronoun: 'ich', form: 'habe', arabic: 'أنا أملك', pronunciation: 'إيخ هابه' },
          { pronoun: 'du', form: 'hast', arabic: 'أنت تملك', pronunciation: 'دو هاشت' },
          { pronoun: 'er/sie/es', form: 'hat', arabic: 'هو/هي يملك', pronunciation: 'إير/زي/إس هات' },
          { pronoun: 'wir', form: 'haben', arabic: 'نحن نملك', pronunciation: 'فير هابن' },
          { pronoun: 'ihr', form: 'habt', arabic: 'أنتم تملكون', pronunciation: 'إير هابت' },
          { pronoun: 'sie/Sie', form: 'haben', arabic: 'هم يملكون', pronunciation: 'زي هابن' }
        ]
      }
    },
    articles: {
      definite: [
        { gender: 'maskulin', singular: 'der', plural: 'die', pronunciation: 'دير/دي' },
        { gender: 'feminin', singular: 'die', plural: 'die', pronunciation: 'دي/دي' },
        { gender: 'neutral', singular: 'das', plural: 'die', pronunciation: 'داس/دي' }
      ],
      indefinite: [
        { gender: 'maskulin', form: 'ein', pronunciation: 'أين' },
        { gender: 'feminin', form: 'eine', pronunciation: 'أينه' },
        { gender: 'neutral', form: 'ein', pronunciation: 'أين' }
      ]
    },
    pronouns: [
      { german: 'ich', arabic: 'أنا', pronunciation: 'إيخ' },
      { german: 'du', arabic: 'أنت', pronunciation: 'دو' },
      { german: 'er', arabic: 'هو', pronunciation: 'إير' },
      { german: 'sie', arabic: 'هي', pronunciation: 'زي' },
      { german: 'es', arabic: 'هو (غير عاقل)', pronunciation: 'إس' },
      { german: 'wir', arabic: 'نحن', pronunciation: 'فير' },
      { german: 'ihr', arabic: 'أنتم', pronunciation: 'إير' },
      { german: 'sie/Sie', arabic: 'هم/أنتم (مهذب)', pronunciation: 'زي' }
    ],
    adjectives: [
      { german: 'groß', arabic: 'كبير', pronunciation: 'غروس' },
      { german: 'klein', arabic: 'صغير', pronunciation: 'كلاين' },
      { german: 'gut', arabic: 'جيد', pronunciation: 'غوت' },
      { german: 'schlecht', arabic: 'سيء', pronunciation: 'شلِخت' },
      { german: 'neu', arabic: 'جديد', pronunciation: 'نوي' },
      { german: 'alt', arabic: 'قديم', pronunciation: 'ألت' },
      { german: 'schön', arabic: 'جميل', pronunciation: 'شوين' },
      { german: 'schnell', arabic: 'سريع', pronunciation: 'شنِل' }
    ],
    numbers: [
      { number: 0, german: 'null', arabic: 'صفر', pronunciation: 'نول' },
      { number: 1, german: 'eins', arabic: 'واحد', pronunciation: 'أينس' },
      { number: 2, german: 'zwei', arabic: 'اثنان', pronunciation: 'تسفاي' },
      { number: 3, german: 'drei', arabic: 'ثلاثة', pronunciation: 'دراي' },
      { number: 4, german: 'vier', arabic: 'أربعة', pronunciation: 'فير' },
      { number: 5, german: 'fünf', arabic: 'خمسة', pronunciation: 'فونف' },
      { number: 6, german: 'sechs', arabic: 'ستة', pronunciation: 'زِكس' },
      { number: 7, german: 'sieben', arabic: 'سبعة', pronunciation: 'زيبن' },
      { number: 8, german: 'acht', arabic: 'ثمانية', pronunciation: 'أخت' },
      { number: 9, german: 'neun', arabic: 'تسعة', pronunciation: 'نوين' },
      { number: 10, german: 'zehn', arabic: 'عشرة', pronunciation: 'تسين' },
      { number: 11, german: 'elf', arabic: 'أحد عشر', pronunciation: 'إلف' },
      { number: 12, german: 'zwölf', arabic: 'اثنا عشر', pronunciation: 'تسفولف' },
      { number: 20, german: 'zwanzig', arabic: 'عشرون', pronunciation: 'تسفانتسيخ' }
    ]
  };

  const sections = [
    // Grammar sections
    {
      title: 'Auxiliary Verbs (الأفعال المساعدة)',
      content: 'auxiliaryVerbs',
      category: 'grammar',
      exercises: [
        {
          type: 'conjugation',
          question: 'Complete: Ich ___ Student.',
          options: ['bin', 'bist', 'ist', 'sind'],
          correct: 0,
          explanation: 'With "ich" we use "bin" - أنا طالب'
        },
        {
          type: 'conjugation',
          question: 'Complete: Du ___ schön.',
          options: ['bin', 'bist', 'ist', 'sind'],
          correct: 1,
          explanation: 'With "du" we use "bist" - أنت جميل'
        },
        {
          type: 'conjugation',
          question: 'Complete: Ich ___ einen Hund.',
          options: ['habe', 'hast', 'hat', 'haben'],
          correct: 0,
          explanation: 'With "ich" we use "habe" - أنا أملك كلباً'
        }
      ]
    },
    {
      title: 'Articles (الأدوات)',
      content: 'articles',
      category: 'grammar',
      exercises: [
        {
          type: 'article',
          question: 'Choose the correct article: ___ Mann',
          options: ['der', 'die', 'das'],
          correct: 0,
          explanation: 'Mann is masculine, so we use "der"'
        },
        {
          type: 'article',
          question: 'Choose the correct article: ___ Frau',
          options: ['der', 'die', 'das'],
          correct: 1,
          explanation: 'Frau is feminine, so we use "die"'
        }
      ]
    },
    {
      title: 'Pronouns (الضمائر)',
      content: 'pronouns',
      category: 'grammar',
      exercises: [
        {
          type: 'translation',
          question: 'What is the German for "أنا"?',
          options: ['ich', 'du', 'er', 'wir'],
          correct: 0,
          explanation: 'أنا = ich'
        }
      ]
    },
    {
      title: 'Adjectives (الصفات)',
      content: 'adjectives',
      category: 'grammar',
      exercises: [
        {
          type: 'translation',
          question: 'What is "big" in German?',
          options: ['klein', 'groß', 'gut', 'alt'],
          correct: 1,
          explanation: 'big = groß (غروس)'
        }
      ]
    },
    {
      title: 'Numbers (الأرقام)',
      content: 'numbers',
      category: 'grammar',
      exercises: [
        {
          type: 'number',
          question: 'What is "3" in German?',
          options: ['zwei', 'drei', 'vier', 'fünf'],
          correct: 1,
          explanation: '3 = drei (دراي)'
        }
      ]
    },
    // Vocabulary sections
    {
      title: 'Greetings (التحيات)',
      content: 'greetings',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'How do you say "Good morning" in German?',
          options: ['Guten Tag', 'Guten Morgen', 'Guten Abend', 'Gute Nacht'],
          correct: 1,
          explanation: 'Good morning = Guten Morgen (غوتن مورغن)'
        },
        {
          type: 'translation',
          question: 'What does "Auf Wiedersehen" mean?',
          options: ['Hello', 'Good night', 'Formal goodbye', 'Thank you'],
          correct: 2,
          explanation: 'Auf Wiedersehen = Formal goodbye (أوف فيدرزهن)'
        }
      ]
    },
    {
      title: 'Personal Info (المعلومات الشخصية)',
      content: 'personalInfo',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'How do you ask "What\'s your name?" formally?',
          options: ['Wie heißt du?', 'Wie heißen Sie?', 'Wie geht es?', 'Wo wohnen Sie?'],
          correct: 1,
          explanation: 'Formal: Wie heißen Sie? (في هايسن زي؟)'
        }
      ]
    },
    {
      title: 'Family (العائلة)',
      content: 'family',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'What is "mother" in German?',
          options: ['der Vater', 'die Mutter', 'die Schwester', 'die Tochter'],
          correct: 1,
          explanation: 'Mother = die Mutter (دي موتر)'
        }
      ]
    },
    {
      title: 'Colors (الألوان)',
      content: 'colors',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'What color is "blau"?',
          options: ['Red', 'Blue', 'Green', 'Yellow'],
          correct: 1,
          explanation: 'blau = blue (بلاو)'
        }
      ]
    },
    {
      title: 'Days of Week (أيام الأسبوع)',
      content: 'daysOfWeek',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'What day is "Montag"?',
          options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'],
          correct: 1,
          explanation: 'Montag = Monday (مونتاغ)'
        }
      ]
    },
    {
      title: 'Basic Verbs (الأفعال الأساسية)',
      content: 'basicVerbs',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'What does "verstehen" mean?',
          options: ['to speak', 'to understand', 'to learn', 'to work'],
          correct: 1,
          explanation: 'verstehen = to understand (فرشتيهن)'
        }
      ]
    },
    {
      title: 'Common Questions (الأسئلة الشائعة)',
      content: 'commonQuestions',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'What does "Wo wohnen Sie?" mean?',
          options: ['How are you?', 'What do you do?', 'Where do you live?', 'How old are you?'],
          correct: 2,
          explanation: 'Wo wohnen Sie? = Where do you live? (فو فوهنن زي؟)'
        }
      ]
    },
    {
      title: 'Useful Phrases (العبارات المفيدة)',
      content: 'usefulPhrases',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'How do you say "I don\'t understand"?',
          options: ['Ich verstehe nicht', 'Sprechen Sie langsamer?', 'Wie bitte?', 'Es tut mir leid'],
          correct: 0,
          explanation: 'I don\'t understand = Ich verstehe nicht (إيخ فرشتيهه نيخت)'
        }
      ]
    }
  ];

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set German language and voice preferences
      utterance.lang = 'de-DE';
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Use pre-loaded German voices
      if (germanVoices.length > 0) {
        // Prefer female voices for better pronunciation clarity
        const femaleGermanVoice = germanVoices.find(voice => 
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('anna') ||
          voice.name.toLowerCase().includes('petra') ||
          voice.name.toLowerCase().includes('gisela') ||
          voice.name.toLowerCase().includes('hedda') ||
          voice.name.toLowerCase().includes('katrin')
        );
        
        utterance.voice = femaleGermanVoice || germanVoices[0];
      }
      
      // Error handling
      utterance.onerror = (event) => {
        console.log('Speech synthesis error:', event.error);
        // Fallback: try without specific voice
        if (utterance.voice) {
          utterance.voice = null;
          window.speechSynthesis.speak(utterance);
        }
      };
      
      utterance.onend = () => {
        // Speech completed successfully
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.log('Speech synthesis not supported in this browser');
      // Could show a user-friendly message here
      alert('Audio pronunciation is not supported in your browser. Please try Chrome, Firefox, or Safari.');
    }
  };

  const handleAnswer = (answerIndex) => {
    const exerciseKey = `${currentSection}-${currentExercise}`;
    setUserAnswers({
      ...userAnswers,
      [exerciseKey]: answerIndex
    });
  };

  const checkAnswers = () => {
    let correctCount = 0;
    const currentExercises = sections[currentSection].exercises;
    
    currentExercises.forEach((exercise, index) => {
      const exerciseKey = `${currentSection}-${index}`;
      if (userAnswers[exerciseKey] === exercise.correct) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setShowResults(true);
  };

  const resetExercises = () => {
    setUserAnswers({});
    setShowResults(false);
    setCurrentExercise(0);
    setScore(0);
  };

  const renderVocabularyContent = (contentType) => {
    const data = vocabularyData[contentType] || [];

    return (
      <div className={`vocabulary-content ${contentType}-content`}>
        <div className="vocabulary-grid">
          {data.map((item, index) => (
            <div key={index} className="vocabulary-item">
              <div className="vocabulary-item-content">
                <div className="vocabulary-item-main">
                  <div className="german-word">{item.german}</div>
                  <div className="arabic-translation">{item.arabic}</div>
                  <div className="pronunciation">{item.pronunciation}</div>
                  <div className="context">{item.context}</div>
                </div>
                <button 
                  onClick={() => speak(item.german)}
                  className="audio-button"
                  title="Listen to pronunciation"
                >
                  <Volume2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGrammarContent = (contentType) => {
    switch (contentType) {
      case 'auxiliaryVerbs':
        return (
          <div className="grammar-content">
            <div className="verb-section sein-section">
              <h3 className="verb-title">sein (to be) - يكون</h3>
              <div className="conjugation-grid">
                {grammarData.auxiliaryVerbs.sein.conjugations.map((conj, index) => (
                  <div key={index} className="conjugation-item">
                    <span className="conjugation-text">{conj.pronoun} {conj.form}</span>
                    <span className="conjugation-arabic">{conj.arabic}</span>
                    <button 
                      onClick={() => speak(`${conj.pronoun} ${conj.form}`)}
                      className="audio-button"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="verb-section haben-section">
              <h3 className="verb-title">haben (to have) - يملك</h3>
              <div className="conjugation-grid">
                {grammarData.auxiliaryVerbs.haben.conjugations.map((conj, index) => (
                  <div key={index} className="conjugation-item">
                    <span className="conjugation-text">{conj.pronoun} {conj.form}</span>
                    <span className="conjugation-arabic">{conj.arabic}</span>
                    <button 
                      onClick={() => speak(`${conj.pronoun} ${conj.form}`)}
                      className="audio-button"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'articles':
        return (
          <div className="grammar-content">
            <div className="article-section definite-section">
              <h3 className="article-title">Definite Articles (أداة التعريف المحددة)</h3>
              <div className="article-grid">
                {grammarData.articles.definite.map((art, index) => (
                  <div key={index} className="article-item">
                    <span className="article-gender">{art.gender}</span>
                    <span className="article-forms">{art.singular} / {art.plural}</span>
                    <span className="article-pronunciation">{art.pronunciation}</span>
                    <button 
                      onClick={() => speak(art.singular)}
                      className="audio-button"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="article-section indefinite-section">
              <h3 className="article-title">Indefinite Articles (أداة التعريف غير المحددة)</h3>
              <div className="article-grid">
                {grammarData.articles.indefinite.map((art, index) => (
                  <div key={index} className="article-item">
                    <span className="article-gender">{art.gender}</span>
                    <span className="article-forms">{art.form}</span>
                    <span className="article-pronunciation">{art.pronunciation}</span>
                    <button 
                      onClick={() => speak(art.form)}
                      className="audio-button"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pronouns':
        return (
          <div className="grammar-content">
            <div className="pronoun-section">
              <h3 className="pronoun-title">Personal Pronouns (الضمائر الشخصية)</h3>
              <div className="pronoun-grid">
                {grammarData.pronouns.map((pronoun, index) => (
                  <div key={index} className="pronoun-item">
                    <span className="pronoun-german">{pronoun.german}</span>
                    <span className="pronoun-arabic">{pronoun.arabic}</span>
                    <span className="pronoun-pronunciation">{pronoun.pronunciation}</span>
                    <button 
                      onClick={() => speak(pronoun.german)}
                      className="audio-button"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'adjectives':
        return (
          <div className="grammar-content">
            <div className="adjective-section">
              <h3 className="adjective-title">Basic Adjectives (الصفات الأساسية)</h3>
              <div className="adjective-grid">
                {grammarData.adjectives.map((adj, index) => (
                  <div key={index} className="adjective-item">
                    <span className="adjective-german">{adj.german}</span>
                    <span className="adjective-arabic">{adj.arabic}</span>
                    <span className="adjective-pronunciation">{adj.pronunciation}</span>
                    <button 
                      onClick={() => speak(adj.german)}
                      className="audio-button"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'numbers':
        return (
          <div className="grammar-content">
            <div className="numbers-section">
              <h3 className="numbers-title">Numbers (الأرقام)</h3>
              <div className="numbers-grid">
                {grammarData.numbers.map((num, index) => (
                  <div key={index} className="number-item">
                    <span className="number-digit">{num.number}</span>
                    <span className="number-german">{num.german}</span>
                    <span className="number-arabic">{num.arabic}</span>
                    <span className="number-pronunciation">{num.pronunciation}</span>
                    <button 
                      onClick={() => speak(num.german)}
                      className="audio-button"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  const renderContent = () => {
    const section = sections[currentSection];
    const content = section.content;

    if (section.category === 'vocabulary') {
      return renderVocabularyContent(content);
    } else {
      return renderGrammarContent(content);
    }
  };

  const renderExercises = () => {
    const currentSectionData = sections[currentSection];
    const exercises = currentSectionData.exercises;

    if (showResults) {
      return (
        <div className="exercise-results">
          <h3 className="results-title">Results</h3>
          <div className="results-score">
            <div className="score-number">{score}/{exercises.length}</div>
            <div className="score-label">Correct Answers</div>
          </div>
          
          <div className="results-details">
            {exercises.map((exercise, index) => {
              const exerciseKey = `${currentSection}-${index}`;
              const userAnswer = userAnswers[exerciseKey];
              const isCorrect = userAnswer === exercise.correct;
              
              return (
                <div key={index} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="result-header">
                    {isCorrect ? <Check className="result-icon" size={16} /> : <X className="result-icon" size={16} />}
                    <span className="result-question">{exercise.question}</span>
                  </div>
                  <div className="result-answer">
                    Your answer: {exercise.options[userAnswer]} {!isCorrect && `(Correct: ${exercise.options[exercise.correct]})`}
                  </div>
                  <div className="result-explanation">{exercise.explanation}</div>
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={resetExercises}
            className="try-again-button"
          >
            <RotateCcw size={16} />
            Try Again
          </button>
        </div>
      );
    }

    const exercise = exercises[currentExercise];
    const exerciseKey = `${currentSection}-${currentExercise}`;
    const selectedAnswer = userAnswers[exerciseKey];

    return (
      <div className="exercise-container">
        <div className="exercise-header">
          <h3 className="exercise-title">Exercise {currentExercise + 1} of {exercises.length}</h3>
          <div className="exercise-navigation">
            <button 
              onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
              disabled={currentExercise === 0}
              className="nav-button"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentExercise(Math.min(exercises.length - 1, currentExercise + 1))}
              disabled={currentExercise === exercises.length - 1}
              className="nav-button"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="exercise-content">
          <h4 className="exercise-question">{exercise.question}</h4>
          <div className="exercise-options">
            {exercise.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`option-button ${selectedAnswer === index ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="exercise-footer">
          <div className="exercise-progress">
            {Object.keys(userAnswers).filter(key => key.startsWith(`${currentSection}-`)).length} / {exercises.length} answered
          </div>
          
          {Object.keys(userAnswers).filter(key => key.startsWith(`${currentSection}-`)).length === exercises.length && (
            <button 
              onClick={checkAnswers}
              className="check-button"
            >
              Check Answers
            </button>
          )}
        </div>
      </div>
    );
  };

  const filteredSections = sections.filter(section => 
    selectedCategory === 'all' || section.category === selectedCategory
  );

  return (
    <>
      <style>{`
        /* Main Container */
        .app-container {
          margin: 0 auto;
          padding: 30px;
          background-color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Header */
        .app-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .main-title {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .sub-title {
          font-size: 1.25rem;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .description {
          font-size: 0.875rem;
          color: #9ca3af;
        }

        /* Category Filter */
        .category-filter {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .category-buttons {
          display: flex;
          background-color: #f3f4f6;
          border-radius: 8px;
          padding: 4px;
        }

        .category-button {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-button.active {
          background-color: #2563eb;
          color: white;
        }

        .category-button:not(.active) {
          color: #6b7280;
          background-color: transparent;
        }

        .category-button:not(.active):hover {
          color: #1f2937;
        }

        /* Section Navigation */
        .section-navigation {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }

        .section-button {
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .section-button.active {
          background-color: #2563eb;
          color: white;
        }

        .section-button.grammar:not(.active) {
          background-color: #dcfce7;
          color: #166534;
        }

        .section-button.grammar:not(.active):hover {
          background-color: #bbf7d0;
        }

        .section-button.vocabulary:not(.active) {
          background-color: #fce7f3;
          color: #be185d;
        }

        .section-button.vocabulary:not(.active):hover {
          background-color: #fbcfe8;
        }

        /* Main Content Grid */
        .main-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
          }
        }

        /* Content Section */
        .content-section {
          
        }

        .content-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .content-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
        }

        .category-badge {
          margin-left: 12px;
          padding: 4px 8px;
          font-size: 0.75rem;
          border-radius: 9999px;
        }

        .category-badge.grammar {
          background-color: #dcfce7;
          color: #166534;
        }

        .category-badge.vocabulary {
          background-color: #fce7f3;
          color: #be185d;
        }

        /* Vocabulary Content */
        .vocabulary-content {
          padding: 16px;
          border-radius: 8px;
          border: 1px solid;
        }

        .greetings-content {
          background-color: #eff6ff;
          border-color: #bfdbfe;
        }

        .personalInfo-content {
          background-color: #f0fdf4;
          border-color: #bbf7d0;
        }

        .family-content {
          background-color: #faf5ff;
          border-color: #e9d5ff;
        }

        .colors-content {
          background-color: #fdf2f8;
          border-color: #fbcfe8;
        }

        .daysOfWeek-content {
          background-color: #fffbeb;
          border-color: #fed7aa;
        }

        .basicVerbs-content {
          background-color: #eef2ff;
          border-color: #c7d2fe;
        }

        .commonQuestions-content {
          background-color: #fef2f2;
          border-color: #fecaca;
        }

        .usefulPhrases-content {
          background-color: #fff7ed;
          border-color: #fed7aa;
        }

        .vocabulary-grid {
          display: grid;
          gap: 12px;
        }

        .vocabulary-item {
          background-color: white;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .vocabulary-item-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .vocabulary-item-main {
          flex: 1;
        }

        .german-word {
          font-weight: 600;
          font-size: 1.125rem;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .arabic-translation {
          color: #6b7280;
          margin-bottom: 4px;
        }

        .pronunciation {
          font-size: 0.875rem;
          color: #2563eb;
          margin-bottom: 4px;
        }

        .context {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        /* Grammar Content */
        .grammar-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .verb-section, .article-section, .pronoun-section, .adjective-section, .numbers-section {
          padding: 16px;
          border-radius: 8px;
        }

        .sein-section {
          background-color: #eff6ff;
        }

        .haben-section {
          background-color: #f0fdf4;
        }

        .definite-section {
          background-color: #faf5ff;
        }

        .indefinite-section {
          background-color: #fff7ed;
        }

        .pronoun-section {
          background-color: #eef2ff;
        }

        .adjective-section {
          background-color: #fef2f2;
        }

        .numbers-section {
          background-color: #fffbeb;
        }

        .verb-title, .article-title, .pronoun-title, .adjective-title, .numbers-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .sein-section .verb-title {
          color: #1e40af;
        }

        .haben-section .verb-title {
          color: #166534;
        }

        .definite-section .article-title {
          color: #7c2d12;
        }

        .indefinite-section .article-title {
          color: #ea580c;
        }

        .pronoun-title {
          color: #4338ca;
        }

        .adjective-title {
          color: #dc2626;
        }

        .numbers-title {
          color: #d97706;
        }

        .conjugation-grid, .article-grid, .pronoun-grid, .adjective-grid, .numbers-grid {
          display: grid;
          gap: 8px;
        }

        .conjugation-item, .article-item, .pronoun-item, .adjective-item, .number-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: white;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .conjugation-text, .article-gender, .pronoun-german, .adjective-german, .number-german {
          font-weight: 500;
          color: black;
        }

        .conjugation-arabic, .article-pronunciation, .pronoun-arabic, .adjective-arabic, .number-arabic {
          color: #6b7280;
        }

        .pronoun-pronunciation, .adjective-pronunciation, .number-pronunciation {
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .number-digit {
          font-weight: bold;
          font-size: 1.125rem;
        }

        /* Audio Button */
        .audio-button {
          padding: 8px;
          border: none;
          background-color: transparent;
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.2s;
          color: #2563eb;
        }

        .audio-button:hover {
          background-color: #f3f4f6;
        }

        /* Exercise Section */
        .exercise-section {
          
        }

        .exercise-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 16px;
        }

        .exercise-container, .exercise-results {
          background-color: #f9fafb;
          padding: 24px;
          border-radius: 8px;
        }

        .exercise-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .exercise-title {
          font-size: 1.125rem;
          font-weight: 600;
        }

        .exercise-navigation {
          display: flex;
          gap: 8px;
        }

        .nav-button {
          padding: 8px;
          background-color: #e5e7eb;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .nav-button:not(:disabled):hover {
          background-color: #d1d5db;
        }

        .exercise-content {
          margin-bottom: 24px;
        }

        .exercise-question {
          font-size: 1.125rem;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .exercise-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .option-button {
          width: 100%;
          padding: 12px;
          text-align: left;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          background-color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .option-button:hover {
          background-color: #f9fafb;
        }

        .option-button.selected {
          background-color: #dbeafe;
          border-color: #93c5fd;
        }

        .exercise-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .exercise-progress {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .check-button {
          background-color: #16a34a;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .check-button:hover {
          background-color: #15803d;
        }

        /* Results */
        .results-title {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .results-score {
          text-align: center;
          margin-bottom: 16px;
        }

        .score-number {
          font-size: 3rem;
          font-weight: bold;
          color: #2563eb;
        }

        .score-label {
          color: #6b7280;
        }

        .results-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .result-item {
          padding: 12px;
          border-radius: 6px;
          border: 1px solid;
        }

        .result-item.correct {
          background-color: #f0fdf4;
          border-color: #bbf7d0;
        }

        .result-item.incorrect {
          background-color: #fef2f2;
          border-color: #fecaca;
        }

        .result-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .result-icon {
          margin-right: 8px;
        }

        .result-item.correct .result-icon {
          color: #16a34a;
        }

        .result-item.incorrect .result-icon {
          color: #dc2626;
        }

        .result-question {
          font-weight: 500;
        }

        .result-answer {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .result-explanation {
          font-size: 0.875rem;
          color: #2563eb;
        }

        .try-again-button {
          width: 100%;
          background-color: #2563eb;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s;
        }

        .try-again-button:hover {
          background-color: #1d4ed8;
        }

        /* Footer */
        .app-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #9ca3af;
        }

        .footer-description {
          margin-bottom: 4px;
        }

        .footer-note {
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin-bottom: 8px;
        }

        .footer-audio-info {
          font-size: 0.75rem;
          color: #16a34a;
          margin: 0;
        }

        .footer-audio-warning {
          font-size: 0.75rem;
          color: #d97706;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .app-container {
            padding: 16px;
          }

          .main-title {
            font-size: 1.5rem;
          }

          .sub-title {
            font-size: 1rem;
          }

          .section-navigation {
            gap: 6px;
          }

          .section-button {
            padding: 6px 10px;
            font-size: 0.8rem;
          }

          .exercise-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .exercise-footer {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
        }
      `}</style>

      <div className="app-container">
        <div className="app-header">
          <h1 className="main-title">German A1 Complete Learning Guide</h1>
          <h2 className="sub-title">دليل تعلم اللغة الألمانية الشامل - المستوى الأول</h2>
          <p className="description">Grammar Rules & Essential Vocabulary with Audio Pronunciation</p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <div className="category-buttons">
            {[
              { key: 'all', label: 'All Topics' },
              { key: 'grammar', label: 'Grammar' },
              { key: 'vocabulary', label: 'Vocabulary' }
            ].map((category) => (
              <button
                key={category.key}
                onClick={() => {
                  setSelectedCategory(category.key);
                  setCurrentSection(0);
                  resetExercises();
                }}
                className={`category-button ${selectedCategory === category.key ? 'active' : ''}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Navigation */}
        <div className="section-navigation">
          {filteredSections.map((section, index) => {
            const actualIndex = sections.findIndex(s => s.title === section.title);
            return (
              <button
                key={index}
                onClick={() => {
                  setCurrentSection(actualIndex);
                  resetExercises();
                }}
                className={`section-button ${currentSection === actualIndex ? 'active' : section.category}`}
              >
                {section.title}
              </button>
            );
          })}
        </div>

        <div className="main-content">
          {/* Content Section */}
          <div className="content-section">
            <div className="content-header">
              <h2 className="content-title">{sections[currentSection].title}</h2>
              <span className={`category-badge ${sections[currentSection].category}`}>
                {sections[currentSection].category}
              </span>
            </div>
            {renderContent()}
          </div>

          {/* Exercises Section */}
          <div className="exercise-section">
            <h2 className="exercise-title">Practice Exercises</h2>
            {renderExercises()}
          </div>
        </div>

        {/* Footer */}
        <div className="app-footer">
          <p className="footer-description">Based on Deutsche Grammatik A1-Niveau & Deutsch-Arabisches Vokabular</p>
          <p className="footer-note">Click <Volume2 size={14} /> to hear German pronunciation • Grammar + Essential Vocabulary</p>
          {germanVoices.length > 0 ? (
            <p className="footer-audio-info">✓ German voice available: {germanVoices[0]?.name}</p>
          ) : (
            <p className="footer-audio-warning">⚠️ No German voice detected. Audio will use default browser voice.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default GermanA1App;