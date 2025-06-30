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
    monthsAndSeasons: [
      { german: 'Januar', arabic: 'يناير', pronunciation: 'يانوار', context: 'January' },
      { german: 'Februar', arabic: 'فبراير', pronunciation: 'فيبروار', context: 'February' },
      { german: 'März', arabic: 'مارس', pronunciation: 'مارتس', context: 'March' },
      { german: 'April', arabic: 'أبريل', pronunciation: 'أبريل', context: 'April' },
      { german: 'Mai', arabic: 'مايو', pronunciation: 'ماي', context: 'May' },
      { german: 'Juni', arabic: 'يونيو', pronunciation: 'يوني', context: 'June' },
      { german: 'Juli', arabic: 'يوليو', pronunciation: 'يولي', context: 'July' },
      { german: 'August', arabic: 'أغسطس', pronunciation: 'أوغوست', context: 'August' },
      { german: 'September', arabic: 'سبتمبر', pronunciation: 'زيبتيمبر', context: 'September' },
      { german: 'Oktober', arabic: 'أكتوبر', pronunciation: 'أوكتوبر', context: 'October' },
      { german: 'November', arabic: 'نوفمبر', pronunciation: 'نوفيمبر', context: 'November' },
      { german: 'Dezember', arabic: 'ديسمبر', pronunciation: 'ديتسيمبر', context: 'December' },
      { german: 'der Frühling', arabic: 'الربيع', pronunciation: 'دير فروهلينغ', context: 'Spring' },
      { german: 'der Sommer', arabic: 'الصيف', pronunciation: 'دير زومر', context: 'Summer' },
      { german: 'der Herbst', arabic: 'الخريف', pronunciation: 'دير هيربست', context: 'Autumn' },
      { german: 'der Winter', arabic: 'الشتاء', pronunciation: 'دير فينتر', context: 'Winter' }
    ],
    countriesAndNationalities: [
      { german: 'Deutschland', arabic: 'ألمانيا', pronunciation: 'دويتشلاند', context: 'Germany' },
      { german: 'deutsch', arabic: 'ألماني', pronunciation: 'دويتش', context: 'German (nationality)' },
      { german: 'Frankreich', arabic: 'فرنسا', pronunciation: 'فرانكرايخ', context: 'France' },
      { german: 'französisch', arabic: 'فرنسي', pronunciation: 'فرانتسوزيش', context: 'French (nationality)' },
      { german: 'England', arabic: 'إنجلترا', pronunciation: 'إنغلاند', context: 'England' },
      { german: 'englisch', arabic: 'إنجليزي', pronunciation: 'إنغليش', context: 'English (nationality)' },
      { german: 'Spanien', arabic: 'إسبانيا', pronunciation: 'شبانين', context: 'Spain' },
      { german: 'spanisch', arabic: 'إسباني', pronunciation: 'شبانيش', context: 'Spanish (nationality)' },
      { german: 'Italien', arabic: 'إيطاليا', pronunciation: 'إيتالين', context: 'Italy' },
      { german: 'italienisch', arabic: 'إيطالي', pronunciation: 'إيتالينيش', context: 'Italian (nationality)' },
      { german: 'Amerika', arabic: 'أمريكا', pronunciation: 'أميريكا', context: 'America' },
      { german: 'amerikanisch', arabic: 'أمريكي', pronunciation: 'أميريكانيش', context: 'American (nationality)' }
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
    shoppingAndMoney: [
      { german: 'das Geld', arabic: 'المال', pronunciation: 'داس غيلد', context: 'Money' },
      { german: 'der Euro', arabic: 'اليورو', pronunciation: 'دير أويرو', context: 'Euro' },
      { german: 'der Cent', arabic: 'السنت', pronunciation: 'دير تسنت', context: 'Cent' },
      { german: 'kaufen', arabic: 'يشتري', pronunciation: 'كاوفن', context: 'To buy' },
      { german: 'verkaufen', arabic: 'يبيع', pronunciation: 'فيركاوفن', context: 'To sell' },
      { german: 'der Laden', arabic: 'المتجر', pronunciation: 'دير لادن', context: 'Shop' },
      { german: 'der Supermarkt', arabic: 'السوبر ماركت', pronunciation: 'دير زوبرماركت', context: 'Supermarket' },
      { german: 'die Kasse', arabic: 'الصندوق', pronunciation: 'دي كاسه', context: 'Cash register' },
      { german: 'bezahlen', arabic: 'يدفع', pronunciation: 'بتسالن', context: 'To pay' },
      { german: 'teuer', arabic: 'غالي', pronunciation: 'تويير', context: 'Expensive' },
      { german: 'billig', arabic: 'رخيص', pronunciation: 'بيليخ', context: 'Cheap' },
      { german: 'die Rechnung', arabic: 'الفاتورة', pronunciation: 'دي ريخنونغ', context: 'Bill/Receipt' }
    ],
    hobbiesAndActivities: [
      { german: 'das Hobby', arabic: 'الهواية', pronunciation: 'داس هوبي', context: 'Hobby' },
      { german: 'Sport machen', arabic: 'يمارس الرياضة', pronunciation: 'شبورت ماخن', context: 'To do sports' },
      { german: 'lesen', arabic: 'يقرأ', pronunciation: 'ليزن', context: 'To read' },
      { german: 'Musik hören', arabic: 'يستمع للموسيقى', pronunciation: 'موزيك هورن', context: 'To listen to music' },
      { german: 'fernsehen', arabic: 'يشاهد التلفزيون', pronunciation: 'فيرنزيهن', context: 'To watch TV' },
      { german: 'kochen', arabic: 'يطبخ', pronunciation: 'كوخن', context: 'To cook' },
      { german: 'tanzen', arabic: 'يرقص', pronunciation: 'تانتسن', context: 'To dance' },
      { german: 'schwimmen', arabic: 'يسبح', pronunciation: 'شفيمن', context: 'To swim' },
      { german: 'reisen', arabic: 'يسافر', pronunciation: 'رايزن', context: 'To travel' },
      { german: 'fotografieren', arabic: 'يصور', pronunciation: 'فوتوغرافيرن', context: 'To photograph' },
      { german: 'spielen', arabic: 'يلعب', pronunciation: 'شبيلن', context: 'To play' },
      { german: 'wandern', arabic: 'يتنزه', pronunciation: 'فاندرن', context: 'To hike' }
    ],
    emotionsAndFeelings: [
      { german: 'glücklich', arabic: 'سعيد', pronunciation: 'غلوكليخ', context: 'Happy' },
      { german: 'traurig', arabic: 'حزين', pronunciation: 'تراوريخ', context: 'Sad' },
      { german: 'müde', arabic: 'متعب', pronunciation: 'مودي', context: 'Tired' },
      { german: 'wütend', arabic: 'غاضب', pronunciation: 'فوتند', context: 'Angry' },
      { german: 'nervös', arabic: 'عصبي', pronunciation: 'نيرفوس', context: 'Nervous' },
      { german: 'ruhig', arabic: 'هادئ', pronunciation: 'روهيخ', context: 'Calm' },
      { german: 'aufgeregt', arabic: 'متحمس', pronunciation: 'أوفغيريغت', context: 'Excited' },
      { german: 'langweilig', arabic: 'مملّ', pronunciation: 'لانغفايليخ', context: 'Boring' },
      { german: 'interessant', arabic: 'مثير للاهتمام', pronunciation: 'إنتيريسانت', context: 'Interesting' },
      { german: 'zufrieden', arabic: 'راضٍ', pronunciation: 'تسوفريدن', context: 'Satisfied' }
    ],
    schoolSubjects: [
      { german: 'die Schule', arabic: 'المدرسة', pronunciation: 'دي شوله', context: 'School' },
      { german: 'Deutsch', arabic: 'الألمانية', pronunciation: 'دويتش', context: 'German (subject)' },
      { german: 'Englisch', arabic: 'الإنجليزية', pronunciation: 'إنغليش', context: 'English (subject)' },
      { german: 'Mathematik', arabic: 'الرياضيات', pronunciation: 'ماتيماتيك', context: 'Mathematics' },
      { german: 'Geschichte', arabic: 'التاريخ', pronunciation: 'غيشيخته', context: 'History' },
      { german: 'Biologie', arabic: 'علم الأحياء', pronunciation: 'بيولوغي', context: 'Biology' },
      { german: 'Physik', arabic: 'الفيزياء', pronunciation: 'فوزيك', context: 'Physics' },
      { german: 'Chemie', arabic: 'الكيمياء', pronunciation: 'خيمي', context: 'Chemistry' },
      { german: 'Kunst', arabic: 'الفن', pronunciation: 'كونست', context: 'Art' },
      { german: 'Musik', arabic: 'الموسيقى', pronunciation: 'موزيك', context: 'Music' },
      { german: 'Sport', arabic: 'الرياضة', pronunciation: 'شبورت', context: 'Sports/PE' },
      { german: 'Geografie', arabic: 'الجغرافيا', pronunciation: 'غيوغرافي', context: 'Geography' }
    ],
    foodAndDrinks: [
      { german: 'das Brot', arabic: 'الخبز', pronunciation: 'داس بروت', context: 'Bread' },
      { german: 'die Milch', arabic: 'الحليب', pronunciation: 'دي ميلخ', context: 'Milk' },
      { german: 'das Wasser', arabic: 'الماء', pronunciation: 'داس فاسر', context: 'Water' },
      { german: 'der Kaffee', arabic: 'القهوة', pronunciation: 'دير كافيه', context: 'Coffee' },
      { german: 'der Tee', arabic: 'الشاي', pronunciation: 'دير تي', context: 'Tea' },
      { german: 'das Bier', arabic: 'البيرة', pronunciation: 'داس بير', context: 'Beer' },
      { german: 'der Apfel', arabic: 'التفاح', pronunciation: 'دير آبفل', context: 'Apple' },
      { german: 'die Banane', arabic: 'الموز', pronunciation: 'دي بانانه', context: 'Banana' },
      { german: 'das Fleisch', arabic: 'اللحم', pronunciation: 'داس فلايش', context: 'Meat' },
      { german: 'der Fisch', arabic: 'السمك', pronunciation: 'دير فيش', context: 'Fish' },
      { german: 'lecker', arabic: 'لذيذ', pronunciation: 'ليكر', context: 'Delicious' },
      { german: 'süß', arabic: 'حلو', pronunciation: 'زوس', context: 'Sweet' },
      { german: 'sauer', arabic: 'حامض', pronunciation: 'زاور', context: 'Sour' },
      { german: 'salzig', arabic: 'مالح', pronunciation: 'زالتسيخ', context: 'Salty' }
    ],
    clothing: [
      { german: 'die Kleidung', arabic: 'الملابس', pronunciation: 'دي كلايدونغ', context: 'Clothing' },
      { german: 'das Hemd', arabic: 'القميص', pronunciation: 'داس هيمت', context: 'Shirt' },
      { german: 'die Hose', arabic: 'البنطلون', pronunciation: 'دي هوزه', context: 'Pants/Trousers' },
      { german: 'das Kleid', arabic: 'الفستان', pronunciation: 'داس كلايت', context: 'Dress' },
      { german: 'der Rock', arabic: 'التنورة', pronunciation: 'دير روك', context: 'Skirt' },
      { german: 'die Jacke', arabic: 'السترة', pronunciation: 'دي ياكه', context: 'Jacket' },
      { german: 'der Mantel', arabic: 'المعطف', pronunciation: 'دير مانتل', context: 'Coat' },
      { german: 'die Schuhe', arabic: 'الأحذية', pronunciation: 'دي شوهه', context: 'Shoes' },
      { german: 'die Socken', arabic: 'الجوارب', pronunciation: 'دي زوكن', context: 'Socks' },
      { german: 'der Hut', arabic: 'القبعة', pronunciation: 'دير هوت', context: 'Hat' }
    ],
    bodyParts: [
      { german: 'der Körper', arabic: 'الجسم', pronunciation: 'دير كوربر', context: 'Body' },
      { german: 'der Kopf', arabic: 'الرأس', pronunciation: 'دير كوبف', context: 'Head' },
      { german: 'das Gesicht', arabic: 'الوجه', pronunciation: 'داس غزيخت', context: 'Face' },
      { german: 'die Augen', arabic: 'العيون', pronunciation: 'دي أوغن', context: 'Eyes' },
      { german: 'die Nase', arabic: 'الأنف', pronunciation: 'دي نازه', context: 'Nose' },
      { german: 'der Mund', arabic: 'الفم', pronunciation: 'دير موند', context: 'Mouth' },
      { german: 'die Ohren', arabic: 'الأذنان', pronunciation: 'دي أوهرن', context: 'Ears' },
      { german: 'die Hand', arabic: 'اليد', pronunciation: 'دي هاند', context: 'Hand' },
      { german: 'der Fuß', arabic: 'القدم', pronunciation: 'دير فوس', context: 'Foot' },
      { german: 'das Bein', arabic: 'الساق', pronunciation: 'داس باين', context: 'Leg' }
    ],
    house: [
      { german: 'das Haus', arabic: 'البيت', pronunciation: 'داس هاوس', context: 'House' },
      { german: 'die Wohnung', arabic: 'الشقة', pronunciation: 'دي فوهنونغ', context: 'Apartment' },
      { german: 'das Zimmer', arabic: 'الغرفة', pronunciation: 'داس تسيمر', context: 'Room' },
      { german: 'die Küche', arabic: 'المطبخ', pronunciation: 'دي كوخه', context: 'Kitchen' },
      { german: 'das Badezimmer', arabic: 'الحمام', pronunciation: 'داس بادتسيمر', context: 'Bathroom' },
      { german: 'das Schlafzimmer', arabic: 'غرفة النوم', pronunciation: 'داس شلافتسيمر', context: 'Bedroom' },
      { german: 'das Wohnzimmer', arabic: 'غرفة المعيشة', pronunciation: 'داس فوهنتسيمر', context: 'Living room' },
      { german: 'der Garten', arabic: 'الحديقة', pronunciation: 'دير غارتن', context: 'Garden' },
      { german: 'die Tür', arabic: 'الباب', pronunciation: 'دي توير', context: 'Door' },
      { german: 'das Fenster', arabic: 'النافذة', pronunciation: 'داس فينستر', context: 'Window' }
    ],
    transportation: [
      { german: 'das Auto', arabic: 'السيارة', pronunciation: 'داس أوتو', context: 'Car' },
      { german: 'der Bus', arabic: 'الحافلة', pronunciation: 'دير بوس', context: 'Bus' },
      { german: 'der Zug', arabic: 'القطار', pronunciation: 'دير تسوغ', context: 'Train' },
      { german: 'das Flugzeug', arabic: 'الطائرة', pronunciation: 'داس فلوغتسويغ', context: 'Airplane' },
      { german: 'das Fahrrad', arabic: 'الدراجة', pronunciation: 'داس فاهرات', context: 'Bicycle' },
      { german: 'das Motorrad', arabic: 'الدراجة النارية', pronunciation: 'داس موتورات', context: 'Motorcycle' },
      { german: 'das Taxi', arabic: 'التاكسي', pronunciation: 'داس تاكسي', context: 'Taxi' },
      { german: 'die U-Bahn', arabic: 'المترو', pronunciation: 'دي أو-بان', context: 'Subway' },
      { german: 'das Schiff', arabic: 'السفينة', pronunciation: 'داس شيف', context: 'Ship' },
      { german: 'die Straßenbahn', arabic: 'الترام', pronunciation: 'دي شتراسنبان', context: 'Tram' }
    ],
    weather: [
      { german: 'das Wetter', arabic: 'الطقس', pronunciation: 'داس فيتر', context: 'Weather' },
      { german: 'die Sonne', arabic: 'الشمس', pronunciation: 'دي زونه', context: 'Sun' },
      { german: 'der Regen', arabic: 'المطر', pronunciation: 'دير ريغن', context: 'Rain' },
      { german: 'der Schnee', arabic: 'الثلج', pronunciation: 'دير شني', context: 'Snow' },
      { german: 'der Wind', arabic: 'الرياح', pronunciation: 'دير فيند', context: 'Wind' },
      { german: 'die Wolke', arabic: 'السحابة', pronunciation: 'دي فولكه', context: 'Cloud' },
      { german: 'warm', arabic: 'دافئ', pronunciation: 'فارم', context: 'Warm' },
      { german: 'kalt', arabic: 'بارد', pronunciation: 'كالت', context: 'Cold' },
      { german: 'heiß', arabic: 'حار', pronunciation: 'هايس', context: 'Hot' },
      { german: 'kühl', arabic: 'بارد قليلاً', pronunciation: 'كول', context: 'Cool' }
    ],
    timeAndDate: [
      { german: 'die Zeit', arabic: 'الوقت', pronunciation: 'دي تسايت', context: 'Time' },
      { german: 'die Uhr', arabic: 'الساعة', pronunciation: 'دي أوهر', context: 'Clock/Watch' },
      { german: 'heute', arabic: 'اليوم', pronunciation: 'هويته', context: 'Today' },
      { german: 'gestern', arabic: 'أمس', pronunciation: 'غيسترن', context: 'Yesterday' },
      { german: 'morgen', arabic: 'غداً', pronunciation: 'مورغن', context: 'Tomorrow' },
      { german: 'jetzt', arabic: 'الآن', pronunciation: 'يتست', context: 'Now' },
      { german: 'früh', arabic: 'مبكراً', pronunciation: 'فرو', context: 'Early' },
      { german: 'spät', arabic: 'متأخراً', pronunciation: 'شبات', context: 'Late' },
      { german: 'der Morgen', arabic: 'الصباح', pronunciation: 'دير مورغن', context: 'Morning' },
      { german: 'der Abend', arabic: 'المساء', pronunciation: 'دير آبند', context: 'Evening' }
    ],
    professions: [
      { german: 'der Beruf', arabic: 'المهنة', pronunciation: 'دير بروف', context: 'Profession' },
      { german: 'der Arzt', arabic: 'الطبيب', pronunciation: 'دير آرتست', context: 'Doctor (male)' },
      { german: 'die Ärztin', arabic: 'الطبيبة', pronunciation: 'دي آرتستين', context: 'Doctor (female)' },
      { german: 'der Lehrer', arabic: 'المعلم', pronunciation: 'دير ليهرر', context: 'Teacher (male)' },
      { german: 'die Lehrerin', arabic: 'المعلمة', pronunciation: 'دي ليهرين', context: 'Teacher (female)' },
      { german: 'der Student', arabic: 'الطالب', pronunciation: 'دير شتودنت', context: 'Student (male)' },
      { german: 'die Studentin', arabic: 'الطالبة', pronunciation: 'دي شتودنتين', context: 'Student (female)' },
      { german: 'der Koch', arabic: 'الطباخ', pronunciation: 'دير كوخ', context: 'Cook (male)' },
      { german: 'die Köchin', arabic: 'الطباخة', pronunciation: 'دي كوخين', context: 'Cook (female)' },
      { german: 'der Polizist', arabic: 'الشرطي', pronunciation: 'دير بوليتسيست', context: 'Police officer (male)' }
    ],
    technologyAndMedia: [
      { german: 'der Computer', arabic: 'الكمبيوتر', pronunciation: 'دير كومبيوتر', context: 'Computer' },
      { german: 'das Handy', arabic: 'الهاتف المحمول', pronunciation: 'داس هاندي', context: 'Mobile phone' },
      { german: 'das Internet', arabic: 'الإنترنت', pronunciation: 'داس إنترنت', context: 'Internet' },
      { german: 'die E-Mail', arabic: 'البريد الإلكتروني', pronunciation: 'دي إي-مايل', context: 'Email' },
      { german: 'das Fernsehen', arabic: 'التلفزيون', pronunciation: 'داس فيرنزيهن', context: 'Television' },
      { german: 'das Radio', arabic: 'الراديو', pronunciation: 'داس راديو', context: 'Radio' },
      { german: 'die Zeitung', arabic: 'الجريدة', pronunciation: 'دي تسايتونغ', context: 'Newspaper' },
      { german: 'das Buch', arabic: 'الكتاب', pronunciation: 'داس بوخ', context: 'Book' },
      { german: 'die Musik', arabic: 'الموسيقى', pronunciation: 'دي موزيك', context: 'Music' },
      { german: 'der Film', arabic: 'الفيلم', pronunciation: 'دير فيلم', context: 'Movie' }
    ],
    directionsAndLocations: [
      { german: 'links', arabic: 'يسار', pronunciation: 'لينكس', context: 'Left' },
      { german: 'rechts', arabic: 'يمين', pronunciation: 'ريختس', context: 'Right' },
      { german: 'geradeaus', arabic: 'مستقيم', pronunciation: 'غيرادياوس', context: 'Straight ahead' },
      { german: 'hier', arabic: 'هنا', pronunciation: 'هير', context: 'Here' },
      { german: 'dort', arabic: 'هناك', pronunciation: 'دورت', context: 'There' },
      { german: 'oben', arabic: 'فوق', pronunciation: 'أوبن', context: 'Above/Up' },
      { german: 'unten', arabic: 'تحت', pronunciation: 'أونتن', context: 'Below/Down' },
      { german: 'die Straße', arabic: 'الشارع', pronunciation: 'دي شتراسه', context: 'Street' },
      { german: 'der Platz', arabic: 'الساحة', pronunciation: 'دير بلاتس', context: 'Square/Place' },
      { german: 'die Adresse', arabic: 'العنوان', pronunciation: 'دي أدريسه', context: 'Address' },
      { german: 'der Weg', arabic: 'الطريق', pronunciation: 'دير فيغ', context: 'Way/Path' },
      { german: 'die Ecke', arabic: 'الزاوية', pronunciation: 'دي إكه', context: 'Corner' }
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
    modalVerbs: {
      können: {
        conjugations: [
          { pronoun: 'ich', form: 'kann', arabic: 'أنا أستطيع', pronunciation: 'إيخ كان' },
          { pronoun: 'du', form: 'kannst', arabic: 'أنت تستطيع', pronunciation: 'دو كانست' },
          { pronoun: 'er/sie/es', form: 'kann', arabic: 'هو/هي يستطيع', pronunciation: 'إير/زي/إس كان' },
          { pronoun: 'wir', form: 'können', arabic: 'نحن نستطيع', pronunciation: 'فير كونن' },
          { pronoun: 'ihr', form: 'könnt', arabic: 'أنتم تستطيعون', pronunciation: 'إير كونت' },
          { pronoun: 'sie/Sie', form: 'können', arabic: 'هم يستطيعون', pronunciation: 'زي كونن' }
        ]
      },
      wollen: {
        conjugations: [
          { pronoun: 'ich', form: 'will', arabic: 'أنا أريد', pronunciation: 'إيخ فيل' },
          { pronoun: 'du', form: 'willst', arabic: 'أنت تريد', pronunciation: 'دو فيلست' },
          { pronoun: 'er/sie/es', form: 'will', arabic: 'هو/هي يريد', pronunciation: 'إير/زي/إس فيل' },
          { pronoun: 'wir', form: 'wollen', arabic: 'نحن نريد', pronunciation: 'فير فولن' },
          { pronoun: 'ihr', form: 'wollt', arabic: 'أنتم تريدون', pronunciation: 'إير فولت' },
          { pronoun: 'sie/Sie', form: 'wollen', arabic: 'هم يريدون', pronunciation: 'زي فولن' }
        ]
      },
      müssen: {
        conjugations: [
          { pronoun: 'ich', form: 'muss', arabic: 'أنا يجب أن', pronunciation: 'إيخ موس' },
          { pronoun: 'du', form: 'musst', arabic: 'أنت يجب أن', pronunciation: 'دو موست' },
          { pronoun: 'er/sie/es', form: 'muss', arabic: 'هو/هي يجب أن', pronunciation: 'إير/زي/إس موس' },
          { pronoun: 'wir', form: 'müssen', arabic: 'نحن يجب أن', pronunciation: 'فير موسن' },
          { pronoun: 'ihr', form: 'müsst', arabic: 'أنتم يجب أن', pronunciation: 'إير موست' },
          { pronoun: 'sie/Sie', form: 'müssen', arabic: 'هم يجب أن', pronunciation: 'زي موسن' }
        ]
      }
    },
    regularVerbs: {
      lernen: {
        conjugations: [
          { pronoun: 'ich', form: 'lerne', arabic: 'أنا أتعلم', pronunciation: 'إيخ ليرنه' },
          { pronoun: 'du', form: 'lernst', arabic: 'أنت تتعلم', pronunciation: 'دو ليرنست' },
          { pronoun: 'er/sie/es', form: 'lernt', arabic: 'هو/هي يتعلم', pronunciation: 'إير/زي/إس ليرنت' },
          { pronoun: 'wir', form: 'lernen', arabic: 'نحن نتعلم', pronunciation: 'فير ليرنن' },
          { pronoun: 'ihr', form: 'lernt', arabic: 'أنتم تتعلمون', pronunciation: 'إير ليرنت' },
          { pronoun: 'sie/Sie', form: 'lernen', arabic: 'هم يتعلمون', pronunciation: 'زي ليرنن' }
        ]
      },
      arbeiten: {
        conjugations: [
          { pronoun: 'ich', form: 'arbeite', arabic: 'أنا أعمل', pronunciation: 'إيخ أربايته' },
          { pronoun: 'du', form: 'arbeitest', arabic: 'أنت تعمل', pronunciation: 'دو أربايتست' },
          { pronoun: 'er/sie/es', form: 'arbeitet', arabic: 'هو/هي يعمل', pronunciation: 'إير/زي/إس أربايتت' },
          { pronoun: 'wir', form: 'arbeiten', arabic: 'نحن نعمل', pronunciation: 'فير أربايتن' },
          { pronoun: 'ihr', form: 'arbeitet', arabic: 'أنتم تعملون', pronunciation: 'إير أربايتت' },
          { pronoun: 'sie/Sie', form: 'arbeiten', arabic: 'هم يعملون', pronunciation: 'زي أربايتن' }
        ]
      }
    },
    irregularVerbs: {
      gehen: {
        conjugations: [
          { pronoun: 'ich', form: 'gehe', arabic: 'أنا أذهب', pronunciation: 'إيخ غيهه' },
          { pronoun: 'du', form: 'gehst', arabic: 'أنت تذهب', pronunciation: 'دو غيهست' },
          { pronoun: 'er/sie/es', form: 'geht', arabic: 'هو/هي يذهب', pronunciation: 'إير/زي/إس غيهت' },
          { pronoun: 'wir', form: 'gehen', arabic: 'نحن نذهب', pronunciation: 'فير غيهن' },
          { pronoun: 'ihr', form: 'geht', arabic: 'أنتم تذهبون', pronunciation: 'إير غيهت' },
          { pronoun: 'sie/Sie', form: 'gehen', arabic: 'هم يذهبون', pronunciation: 'زي غيهن' }
        ]
      },
      fahren: {
        conjugations: [
          { pronoun: 'ich', form: 'fahre', arabic: 'أنا أقود/أسافر', pronunciation: 'إيخ فاهره' },
          { pronoun: 'du', form: 'fährst', arabic: 'أنت تقود/تسافر', pronunciation: 'دو فيهرست' },
          { pronoun: 'er/sie/es', form: 'fährt', arabic: 'هو/هي يقود/يسافر', pronunciation: 'إير/زي/إس فيهرت' },
          { pronoun: 'wir', form: 'fahren', arabic: 'نحن نقود/نسافر', pronunciation: 'فير فاهرن' },
          { pronoun: 'ihr', form: 'fahrt', arabic: 'أنتم تقودون/تسافرون', pronunciation: 'إير فاهرت' },
          { pronoun: 'sie/Sie', form: 'fahren', arabic: 'هم يقودون/يسافرون', pronunciation: 'زي فاهرن' }
        ]
      }
    },
    negation: [
      { german: 'nicht', arabic: 'ليس/لا', pronunciation: 'نيختالوذات', context: 'Not (for verbs and adjectives)' },
      { german: 'kein', arabic: 'لا يوجد/ليس هناك', pronunciation: 'كاين', context: 'No/not a (for nouns with indefinite articles)' },
      { german: 'keine', arabic: 'لا توجد/ليست هناك', pronunciation: 'كاينه', context: 'No/not a (feminine/plural)' },
      { german: 'niemand', arabic: 'لا أحد', pronunciation: 'نيماند', context: 'Nobody' },
      { german: 'nichts', arabic: 'لا شيء', pronunciation: 'نيختس', context: 'Nothing' },
      { german: 'nie', arabic: 'أبداً', pronunciation: 'ني', context: 'Never' }
    ],
    wordOrder: [
      { rule: 'Subject + Verb + Object', german: 'Ich trinke Kaffee.', arabic: 'أنا أشرب القهوة', pronunciation: 'إيخ ترينكه كافيه', context: 'Basic sentence structure' },
      { rule: 'Question: Verb + Subject + Object?', german: 'Trinkst du Kaffee?', arabic: 'هل تشرب القهوة؟', pronunciation: 'ترينكست دو كافيه؟', context: 'Yes/No question' },
      { rule: 'W-Question: W-word + Verb + Subject?', german: 'Was trinkst du?', arabic: 'ماذا تشرب؟', pronunciation: 'فاس ترينكست دو؟', context: 'W-question' },
      { rule: 'Modal Verb: Subject + Modal + Object + Infinitive', german: 'Ich kann Deutsch sprechen.', arabic: 'أنا أستطيع أن أتكلم الألمانية', pronunciation: 'إيخ كان دويتش شبريخن', context: 'Modal verb construction' }
    ],
    pluralForms: [
      { german: 'der Mann → die Männer', arabic: 'الرجل ← الرجال', pronunciation: 'دير مان ← دي مينر', context: 'Umlaut + er' },
      { german: 'das Kind → die Kinder', arabic: 'الطفل ← الأطفال', pronunciation: 'داس كيند ← دي كيندر', context: 'Add er' },
      { german: 'die Frau → die Frauen', arabic: 'المرأة ← النساء', pronunciation: 'دي فراو ← دي فراون', context: 'Add en' },
      { german: 'das Auto → die Autos', arabic: 'السيارة ← السيارات', pronunciation: 'داس أوتو ← دي أوتوس', context: 'Add s' },
      { german: 'der Lehrer → die Lehrer', arabic: 'المعلم ← المعلمون', pronunciation: 'دير ليهرر ← دي ليهرر', context: 'No change' }
    ],
    basicCases: [
      { case: 'Nominativ', usage: 'Subject', german: 'Der Mann ist groß.', arabic: 'الرجل طويل', pronunciation: 'دير مان إست غروس', context: 'Who/What does the action?' },
      { case: 'Akkusativ', usage: 'Direct Object', german: 'Ich sehe den Mann.', arabic: 'أنا أرى الرجل', pronunciation: 'إيخ زيهه دين مان', context: 'Who/What receives the action?' },
      { case: 'Dativ', usage: 'Indirect Object', german: 'Ich gebe dem Mann das Buch.', arabic: 'أنا أعطي الرجل الكتاب', pronunciation: 'إيخ غيبه ديم مان داس بوخ', context: 'To whom/for whom?' }
    ],
    imperative: [
      { german: 'Geh! (informal)', arabic: 'اذهب!', pronunciation: 'غيه!', context: 'Command to one person (du)' },
      { german: 'Gehen Sie! (formal)', arabic: 'اذهبوا!', pronunciation: 'غيهن زي!', context: 'Command to one/several people (Sie)' },
      { german: 'Geht! (plural)', arabic: 'اذهبوا!', pronunciation: 'غيهت!', context: 'Command to several people (ihr)' },
      { german: 'Komm her!', arabic: 'تعال هنا!', pronunciation: 'كوم هير!', context: 'Come here!' },
      { german: 'Hör zu!', arabic: 'استمع!', pronunciation: 'هور تسو!', context: 'Listen!' },
      { german: 'Sprich langsam!', arabic: 'تكلم ببطء!', pronunciation: 'شبريخ لانغزام!', context: 'Speak slowly!' }
    ],
    possessivePronouns: [
      { german: 'mein', arabic: 'ملكي (مذكر)', pronunciation: 'ماين', context: 'my (masculine)' },
      { german: 'meine', arabic: 'ملكي (مؤنث)', pronunciation: 'ماينه', context: 'my (feminine)' },
      { german: 'dein', arabic: 'ملكك (مذكر)', pronunciation: 'داين', context: 'your (informal, masculine)' },
      { german: 'deine', arabic: 'ملكك (مؤنث)', pronunciation: 'داينه', context: 'your (informal, feminine)' },
      { german: 'sein', arabic: 'ملكه (مذكر)', pronunciation: 'زاين', context: 'his/its (masculine)' },
      { german: 'seine', arabic: 'ملكه (مؤنث)', pronunciation: 'زاينه', context: 'his/its (feminine)' },
      { german: 'ihr', arabic: 'ملكها (مذكر)', pronunciation: 'إيهر', context: 'her (masculine)' },
      { german: 'ihre', arabic: 'ملكها (مؤنث)', pronunciation: 'إيهره', context: 'her (feminine)' },
      { german: 'unser', arabic: 'ملكنا (مذكر)', pronunciation: 'أونزر', context: 'our (masculine)' },
      { german: 'unsere', arabic: 'ملكنا (مؤنث)', pronunciation: 'أونزره', context: 'our (feminine)' }
    ],
    prepositions: [
      { german: 'in', arabic: 'في', pronunciation: 'إين', context: 'in, into' },
      { german: 'auf', arabic: 'على', pronunciation: 'أوف', context: 'on, onto' },
      { german: 'unter', arabic: 'تحت', pronunciation: 'أونتر', context: 'under, below' },
      { german: 'über', arabic: 'فوق', pronunciation: 'أوبر', context: 'above, over' },
      { german: 'vor', arabic: 'أمام/قبل', pronunciation: 'فور', context: 'in front of, before' },
      { german: 'hinter', arabic: 'خلف', pronunciation: 'هينتر', context: 'behind' },
      { german: 'neben', arabic: 'بجانب', pronunciation: 'نيبن', context: 'next to, beside' },
      { german: 'zwischen', arabic: 'بين', pronunciation: 'تسفيشن', context: 'between' },
      { german: 'mit', arabic: 'مع', pronunciation: 'ميت', context: 'with' },
      { german: 'ohne', arabic: 'بدون', pronunciation: 'أوهنه', context: 'without' }
    ],
    questionWords: [
      { german: 'was', arabic: 'ماذا', pronunciation: 'فاس', context: 'what' },
      { german: 'wer', arabic: 'من', pronunciation: 'فير', context: 'who' },
      { german: 'wie', arabic: 'كيف', pronunciation: 'في', context: 'how' },
      { german: 'wo', arabic: 'أين', pronunciation: 'فو', context: 'where' },
      { german: 'wann', arabic: 'متى', pronunciation: 'فان', context: 'when' },
      { german: 'warum', arabic: 'لماذا', pronunciation: 'فاروم', context: 'why' },
      { german: 'welche(r/s)', arabic: 'أي', pronunciation: 'فيلخه', context: 'which' },
      { german: 'wie viel', arabic: 'كم', pronunciation: 'في فيل', context: 'how much/many' },
      { german: 'wie lange', arabic: 'كم المدة', pronunciation: 'في لانغه', context: 'how long' },
      { german: 'woher', arabic: 'من أين', pronunciation: 'فوهير', context: 'where from' }
    ],
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
      { number: 20, german: 'zwanzig', arabic: 'عشرون', pronunciation: 'تسفانتسيخ' },
      { number: 30, german: 'dreißig', arabic: 'ثلاثون', pronunciation: 'درايسيخ' },
      { number: 50, german: 'fünfzig', arabic: 'خمسون', pronunciation: 'فونفتسيخ' },
      { number: 100, german: 'hundert', arabic: 'مئة', pronunciation: 'هوندرت' }
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
      title: 'Modal Verbs (الأفعال الشرطية)',
      content: 'modalVerbs',
      category: 'grammar',
      exercises: [
        {
          type: 'conjugation',
          question: 'Complete: Ich ___ Deutsch sprechen.',
          options: ['kann', 'kannst', 'können', 'könnt'],
          correct: 0,
          explanation: 'With "ich" we use "kann" - أنا أستطيع أن أتكلم الألمانية'
        },
        {
          type: 'conjugation',
          question: 'Complete: Wir ___ ins Kino gehen.',
          options: ['will', 'willst', 'wollen', 'wollt'],
          correct: 2,
          explanation: 'With "wir" we use "wollen" - نحن نريد أن نذهب إلى السينما'
        }
      ]
    },
    {
      title: 'Regular Verbs (الأفعال النظامية)',
      content: 'regularVerbs',
      category: 'grammar',
      exercises: [
        {
          type: 'conjugation',
          question: 'Complete: Sie ___ in der Schule.',
          options: ['lernen', 'lernst', 'lernt', 'lerne'],
          correct: 0,
          explanation: 'With "sie" (they) we use "lernen" - هم يتعلمون في المدرسة'
        },
        {
          type: 'conjugation',
          question: 'Complete: Du ___ im Büro.',
          options: ['arbeite', 'arbeitest', 'arbeitet', 'arbeiten'],
          correct: 1,
          explanation: 'With "du" we use "arbeitest" - أنت تعمل في المكتب'
        }
      ]
    },
    {
      title: 'Possessive Pronouns (ضمائر الملكية)',
      content: 'possessivePronouns',
      category: 'grammar',
      exercises: [
        {
          type: 'translation',
          question: 'How do you say "my car" in German?',
          options: ['mein Auto', 'dein Auto', 'sein Auto', 'ihr Auto'],
          correct: 0,
          explanation: 'my car = mein Auto (ماين أوتو)'
        },
        {
          type: 'translation',
          question: 'What does "ihre Katze" mean?',
          options: ['his cat', 'her cat', 'our cat', 'their cat'],
          correct: 1,
          explanation: 'ihre Katze = her cat (إيهره كاتسه)'
        }
      ]
    },
    {
      title: 'Prepositions (حروف الجر)',
      content: 'prepositions',
      category: 'grammar',
      exercises: [
        {
          type: 'translation',
          question: 'What does "auf dem Tisch" mean?',
          options: ['under the table', 'on the table', 'beside the table', 'behind the table'],
          correct: 1,
          explanation: 'auf dem Tisch = on the table (أوف ديم تيش)'
        },
        {
          type: 'translation',
          question: 'How do you say "with friends" in German?',
          options: ['ohne Freunde', 'mit Freunden', 'für Freunde', 'bei Freunden'],
          correct: 1,
          explanation: 'with friends = mit Freunden (ميت فرويندن)'
        }
      ]
    },
    {
      title: 'Question Words (أدوات الاستفهام)',
      content: 'questionWords',
      category: 'grammar',
      exercises: [
        {
          type: 'translation',
          question: 'What question word means "where"?',
          options: ['was', 'wer', 'wo', 'wann'],
          correct: 2,
          explanation: 'where = wo (فو)'
        },
        {
          type: 'translation',
          question: 'What does "warum" mean?',
          options: ['what', 'when', 'why', 'who'],
          correct: 2,
          explanation: 'warum = why (فاروم)'
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
      title: 'Food & Drinks (الطعام والشراب)',
      content: 'foodAndDrinks',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'What is "bread" in German?',
          options: ['die Milch', 'das Brot', 'der Kaffee', 'das Wasser'],
          correct: 1,
          explanation: 'Bread = das Brot (داس بروت)'
        },
        {
          type: 'translation',
          question: 'What does "der Kaffee" mean?',
          options: ['Tea', 'Milk', 'Coffee', 'Water'],
          correct: 2,
          explanation: 'der Kaffee = Coffee (دير كافيه)'
        }
      ]
    },
    {
      title: 'Clothing (الملابس)',
      content: 'clothing',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'What is "shirt" in German?',
          options: ['die Hose', 'das Hemd', 'das Kleid', 'die Jacke'],
          correct: 1,
          explanation: 'Shirt = das Hemd (داس هيمت)'
        },
        {
          type: 'translation',
          question: 'What does "die Schuhe" mean?',
          options: ['Socks', 'Shoes', 'Hat', 'Pants'],
          correct: 1,
          explanation: 'die Schuhe = Shoes (دي شوهه)'
        }
      ]
    },
    {
      title: 'Body Parts (أجزاء الجسم)',
      content: 'bodyParts',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'What is "head" in German?',
          options: ['das Gesicht', 'der Kopf', 'die Nase', 'der Mund'],
          correct: 1,
          explanation: 'Head = der Kopf (دير كوبف)'
        },
        {
          type: 'translation',
          question: 'What does "die Hand" mean?',
          options: ['Foot', 'Leg', 'Hand', 'Arm'],
          correct: 2,
          explanation: 'die Hand = Hand (دي هاند)'
        }
      ]
    },
    {
      title: 'House & Home (البيت والمنزل)',
      content: 'house',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'What is "kitchen" in German?',
          options: ['das Badezimmer', 'die Küche', 'das Schlafzimmer', 'das Wohnzimmer'],
          correct: 1,
          explanation: 'Kitchen = die Küche (دي كوخه)'
        },
        {
          type: 'translation',
          question: 'What does "das Fenster" mean?',
          options: ['Door', 'Window', 'Garden', 'Room'],
          correct: 1,
          explanation: 'das Fenster = Window (داس فينستر)'
        }
      ]
    },
    {
      title: 'Transportation (المواصلات)',
      content: 'transportation',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'What is "car" in German?',
          options: ['der Bus', 'das Auto', 'der Zug', 'das Taxi'],
          correct: 1,
          explanation: 'Car = das Auto (داس أوتو)'
        },
        {
          type: 'translation',
          question: 'What does "der Zug" mean?',
          options: ['Bus', 'Car', 'Train', 'Airplane'],
          correct: 2,
          explanation: 'der Zug = Train (دير تسوغ)'
        }
      ]
    },
    {
      title: 'Weather (الطقس)',
      content: 'weather',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'What is "sun" in German?',
          options: ['der Regen', 'die Sonne', 'der Schnee', 'der Wind'],
          correct: 1,
          explanation: 'Sun = die Sonne (دي زونه)'
        },
        {
          type: 'translation',
          question: 'What does "kalt" mean?',
          options: ['Hot', 'Warm', 'Cold', 'Cool'],
          correct: 2,
          explanation: 'kalt = Cold (كالت)'
        }
      ]
    },
    {
      title: 'Time & Date (الوقت والتاريخ)',
      content: 'timeAndDate',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'What is "today" in German?',
          options: ['gestern', 'heute', 'morgen', 'jetzt'],
          correct: 1,
          explanation: 'Today = heute (هويته)'
        },
        {
          type: 'translation',
          question: 'What does "spät" mean?',
          options: ['Early', 'Now', 'Late', 'Yesterday'],
          correct: 2,
          explanation: 'spät = Late (شبات)'
        }
      ]
    },
    {
      title: 'Professions (المهن)',
      content: 'professions',
      category: 'vocabulary',
      exercises: [
        {
          type: 'translation',
          question: 'What is "doctor (male)" in German?',
          options: ['der Lehrer', 'der Arzt', 'der Student', 'der Koch'],
          correct: 1,
          explanation: 'Doctor (male) = der Arzt (دير آرتست)'
        },
        {
          type: 'translation',
          question: 'What does "die Lehrerin" mean?',
          options: ['Female student', 'Female teacher', 'Female doctor', 'Female cook'],
          correct: 1,
          explanation: 'die Lehrerin = Female teacher (دي ليهرين)'
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