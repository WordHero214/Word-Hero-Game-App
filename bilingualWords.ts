import { Word, Difficulty } from './types';

// Bilingual words with English and Filipino (Tagalog) translations
export const BILINGUAL_WORDS: Word[] = [
  // EASY - 20 Words (Elementary Level)
  { 
    id: 'e1', 
    term: 'APPLE', 
    difficulty: Difficulty.EASY, 
    category: 'Fruits', 
    hint: 'A crunchy red or green fruit that keeps the doctor away!',
    hintFil: 'Isang malutong na pula o berdeng prutas na nakakaiwas sa doktor!'
  },
  { 
    id: 'e2', 
    term: 'HOUSE', 
    difficulty: Difficulty.EASY, 
    category: 'Places', 
    hint: 'A building where a family lives together.',
    hintFil: 'Isang gusali kung saan nakatira ang isang pamilya.'
  },
  { 
    id: 'e3', 
    term: 'BREAD', 
    difficulty: Difficulty.EASY, 
    category: 'Food', 
    hint: 'A soft food made from flour, used to make sandwiches.',
    hintFil: 'Isang malambot na pagkain na gawa sa harina, ginagamit sa paggawa ng sandwich.'
  },
  { 
    id: 'e4', 
    term: 'WATER', 
    difficulty: Difficulty.EASY, 
    category: 'Nature', 
    hint: 'A clear liquid we drink when we are thirsty.',
    hintFil: 'Isang malinaw na likido na iniinom natin kapag nauuhaw.'
  },
  { 
    id: 'e5', 
    term: 'SCHOOL', 
    difficulty: Difficulty.EASY, 
    category: 'Places', 
    hint: 'A place where children go to learn and play with friends.',
    hintFil: 'Isang lugar kung saan pumupunta ang mga bata para mag-aral at maglaro kasama ang mga kaibigan.'
  },
  { 
    id: 'e6', 
    term: 'GARDEN', 
    difficulty: Difficulty.EASY, 
    category: 'Nature', 
    hint: 'An outdoor area with flowers, plants, and grass.',
    hintFil: 'Isang lugar sa labas na may mga bulaklak, halaman, at damo.'
  },
  { 
    id: 'e7', 
    term: 'FAMILY', 
    difficulty: Difficulty.EASY, 
    category: 'Social', 
    hint: 'A group of people like mom, dad, and siblings.',
    hintFil: 'Isang grupo ng mga tao tulad ng nanay, tatay, at mga kapatid.'
  },
  { 
    id: 'e8', 
    term: 'FRIEND', 
    difficulty: Difficulty.EASY, 
    category: 'Social', 
    hint: 'Someone you like to play and share secrets with.',
    hintFil: 'Isang tao na gusto mong maglaro at magbahagi ng mga lihim.'
  },
  { 
    id: 'e9', 
    term: 'ORANGE', 
    difficulty: Difficulty.EASY, 
    category: 'Fruits', 
    hint: 'A round citrus fruit that is the same name as its color.',
    hintFil: 'Isang bilog na prutas na may asim na pareho ang pangalan sa kulay nito.'
  },
  { 
    id: 'e10', 
    term: 'SMILE', 
    difficulty: Difficulty.EASY, 
    category: 'Social', 
    hint: 'What you do with your mouth when you are happy.',
    hintFil: 'Ang ginagawa mo sa iyong bibig kapag masaya ka.'
  },
  { 
    id: 'e11', 
    term: 'HAPPY', 
    difficulty: Difficulty.EASY, 
    category: 'Emotions', 
    hint: 'The feeling you get when something good happens.',
    hintFil: 'Ang nararamdaman mo kapag may magandang nangyari.'
  },
  { 
    id: 'e12', 
    term: 'CHAIR', 
    difficulty: Difficulty.EASY, 
    category: 'Furniture', 
    hint: 'Something you sit on with four legs and a back.',
    hintFil: 'Isang bagay na inuupuan na may apat na binti at sandalan.'
  },
  { 
    id: 'e13', 
    term: 'TABLE', 
    difficulty: Difficulty.EASY, 
    category: 'Furniture', 
    hint: 'A flat surface where you eat or do homework.',
    hintFil: 'Isang patag na ibabaw kung saan kumakain o gumagawa ng takdang-aralin.'
  },
  { 
    id: 'e14', 
    term: 'PENCIL', 
    difficulty: Difficulty.EASY, 
    category: 'School', 
    hint: 'A tool you use to write that can be erased.',
    hintFil: 'Isang gamit na ginagamit sa pagsulat na maaaring burahin.'
  },
  { 
    id: 'e15', 
    term: 'BOOK', 
    difficulty: Difficulty.EASY, 
    category: 'School', 
    hint: 'Something with pages that you read for stories.',
    hintFil: 'Isang bagay na may mga pahina na binabasa para sa mga kuwento.'
  },
  { 
    id: 'e16', 
    term: 'FLOWER', 
    difficulty: Difficulty.EASY, 
    category: 'Nature', 
    hint: 'A colorful plant that smells nice and grows in gardens.',
    hintFil: 'Isang makulay na halaman na mabango at tumutubo sa hardin.'
  },
  { 
    id: 'e17', 
    term: 'CLOUD', 
    difficulty: Difficulty.EASY, 
    category: 'Nature', 
    hint: 'White fluffy things in the sky that bring rain.',
    hintFil: 'Puting malambot na bagay sa langit na nagdadala ng ulan.'
  },
  { 
    id: 'e18', 
    term: 'MOON', 
    difficulty: Difficulty.EASY, 
    category: 'Space', 
    hint: 'A bright circle in the night sky.',
    hintFil: 'Isang maliwanag na bilog sa gabi sa langit.'
  },
  { 
    id: 'e19', 
    term: 'STAR', 
    difficulty: Difficulty.EASY, 
    category: 'Space', 
    hint: 'Tiny lights that twinkle in the night sky.',
    hintFil: 'Maliliit na ilaw na kumikislap sa gabi sa langit.'
  },
  { 
    id: 'e20', 
    term: 'HEART', 
    difficulty: Difficulty.EASY, 
    category: 'Body', 
    hint: 'The shape of love, also an organ that pumps blood.',
    hintFil: 'Ang hugis ng pag-ibig, at isang organo na pumapadaloy ng dugo.'
  },

  // MEDIUM - 20 Words (Intermediate Level)
  { 
    id: 'm1', 
    term: 'GUITAR', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Music', 
    hint: 'A musical instrument with strings you strum.',
    hintFil: 'Isang instrumentong pangmusika na may mga kuwerdas na kinakalabit.'
  },
  { 
    id: 'm2', 
    term: 'BICYCLE', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Transport', 
    hint: 'A two-wheeled vehicle you pedal with your feet.',
    hintFil: 'Isang sasakyan na may dalawang gulong na pinepedal ng paa.'
  },
  { 
    id: 'm3', 
    term: 'CALENDAR', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Time', 
    hint: 'Shows all the days, weeks, and months of the year.',
    hintFil: 'Nagpapakita ng lahat ng araw, linggo, at buwan ng taon.'
  },
  { 
    id: 'm4', 
    term: 'JOURNEY', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Action', 
    hint: 'A long trip from one place to another.',
    hintFil: 'Isang mahabang biyahe mula sa isang lugar patungo sa iba.'
  },
  { 
    id: 'm5', 
    term: 'MYSTERY', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Books', 
    hint: 'A puzzle or secret that needs to be solved.',
    hintFil: 'Isang palaisipan o lihim na kailangang lutasin.'
  },
  { 
    id: 'm6', 
    term: 'WEATHER', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Nature', 
    hint: 'The condition outside: sunny, rainy, or cloudy.',
    hintFil: 'Ang kalagayan sa labas: maaraw, maulan, o maulap.'
  },
  { 
    id: 'm7', 
    term: 'SCIENCE', 
    difficulty: Difficulty.MEDIUM, 
    category: 'School', 
    hint: 'The study of how things work in nature.',
    hintFil: 'Ang pag-aaral kung paano gumagana ang mga bagay sa kalikasan.'
  },
  { 
    id: 'm8', 
    term: 'HISTORY', 
    difficulty: Difficulty.MEDIUM, 
    category: 'School', 
    hint: 'The study of events that happened in the past.',
    hintFil: 'Ang pag-aaral ng mga pangyayaring naganap noong nakaraan.'
  },
  { 
    id: 'm9', 
    term: 'THROUGH', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Common', 
    hint: 'Going from one side to the other side.',
    hintFil: 'Pagdaan mula sa isang gilid patungo sa kabilang gilid.'
  },
  { 
    id: 'm10', 
    term: 'ALTHOUGH', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Common', 
    hint: 'A word meaning "even though" or "despite".',
    hintFil: 'Isang salitang nangangahulugang "kahit na" o "sa kabila ng".'
  },
  { 
    id: 'm11', 
    term: 'MOUNTAIN', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Nature', 
    hint: 'A very tall natural landform with a peak.',
    hintFil: 'Isang napakataas na natural na anyong lupa na may tuktok.'
  },
  { 
    id: 'm12', 
    term: 'LIBRARY', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Places', 
    hint: 'A quiet place with many books to read.',
    hintFil: 'Isang tahimik na lugar na may maraming aklat na babasahin.'
  },
  { 
    id: 'm13', 
    term: 'KITCHEN', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Home', 
    hint: 'The room where food is cooked and prepared.',
    hintFil: 'Ang silid kung saan niluluto at inihahanda ang pagkain.'
  },
  { 
    id: 'm14', 
    term: 'PICTURE', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Art', 
    hint: 'An image or drawing that shows something.',
    hintFil: 'Isang larawan o guhit na nagpapakita ng isang bagay.'
  },
  { 
    id: 'm15', 
    term: 'QUESTION', 
    difficulty: Difficulty.MEDIUM, 
    category: 'School', 
    hint: 'Something you ask when you want to know more.',
    hintFil: 'Isang bagay na itinatanong mo kapag gusto mong malaman ang higit pa.'
  },
  { 
    id: 'm16', 
    term: 'ANSWER', 
    difficulty: Difficulty.MEDIUM, 
    category: 'School', 
    hint: 'The response or solution to a question.',
    hintFil: 'Ang tugon o solusyon sa isang tanong.'
  },
  { 
    id: 'm17', 
    term: 'BIRTHDAY', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Events', 
    hint: 'The day you were born, celebrated every year.',
    hintFil: 'Ang araw na ipinanganak ka, ipinagdiriwang bawat taon.'
  },
  { 
    id: 'm18', 
    term: 'RAINBOW', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Nature', 
    hint: 'Colorful arc in the sky after rain.',
    hintFil: 'Makulay na arko sa langit pagkatapos ng ulan.'
  },
  { 
    id: 'm19', 
    term: 'ELEPHANT', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Animals', 
    hint: 'A huge gray animal with a long trunk.',
    hintFil: 'Isang napakalaking kulay-abong hayop na may mahabang nguso.'
  },
  { 
    id: 'm20', 
    term: 'BUTTERFLY', 
    difficulty: Difficulty.MEDIUM, 
    category: 'Animals', 
    hint: 'A colorful insect with beautiful wings.',
    hintFil: 'Isang makulay na insekto na may magagandang pakpak.'
  },

  // HARD - 20 Words (Advanced Level)
  { 
    id: 'h1', 
    term: 'DEFORESTATION', 
    difficulty: Difficulty.HARD, 
    category: 'Environment', 
    scenario: 'Many animals lose their homes because of _______.',
    scenarioFil: 'Maraming hayop ang nawawalan ng tahanan dahil sa _______.'
  },
  { 
    id: 'h2', 
    term: 'POLLUTION', 
    difficulty: Difficulty.HARD, 
    category: 'Environment', 
    scenario: 'Throwing trash in rivers causes water _______.',
    scenarioFil: 'Ang pagtatapon ng basura sa ilog ay nagiging sanhi ng _______ sa tubig.'
  },
  { 
    id: 'h3', 
    term: 'RECYCLING', 
    difficulty: Difficulty.HARD, 
    category: 'Environment', 
    scenario: 'We can save the Earth by _______ our plastic bottles.',
    scenarioFil: 'Maaari nating iligtas ang Daigdig sa pamamagitan ng _______ ng ating mga plastik na bote.'
  },
  { 
    id: 'h4', 
    term: 'SUSTAINABILITY', 
    difficulty: Difficulty.HARD, 
    category: 'Environment', 
    scenario: 'Using solar energy is a great example of _______.',
    scenarioFil: 'Ang paggamit ng solar energy ay isang magandang halimbawa ng _______.'
  },
  { 
    id: 'h5', 
    term: 'PHOTOSYNTHESIS', 
    difficulty: Difficulty.HARD, 
    category: 'Science', 
    scenario: 'Plants make their own food through a process called _______.',
    scenarioFil: 'Ang mga halaman ay gumagawa ng kanilang sariling pagkain sa pamamagitan ng prosesong tinatawag na _______.'
  },
  { 
    id: 'h6', 
    term: 'ARCHITECTURE', 
    difficulty: Difficulty.HARD, 
    category: 'Arts', 
    scenario: 'The design and style of a building is called its _______.',
    scenarioFil: 'Ang disenyo at istilo ng isang gusali ay tinatawag na _______.'
  },
  { 
    id: 'h7', 
    term: 'PHILOSOPHY', 
    difficulty: Difficulty.HARD, 
    category: 'Social', 
    scenario: 'The study of the fundamental nature of knowledge is _______.',
    scenarioFil: 'Ang pag-aaral ng pangunahing kalikasan ng kaalaman ay _______.'
  },
  { 
    id: 'h8', 
    term: 'HYPOTHESIS', 
    difficulty: Difficulty.HARD, 
    category: 'Science', 
    scenario: 'A scientist makes a _______ before starting an experiment.',
    scenarioFil: 'Ang isang siyentipiko ay gumagawa ng _______ bago magsimula ng eksperimento.'
  },
  { 
    id: 'h9', 
    term: 'BIODIVERSITY', 
    difficulty: Difficulty.HARD, 
    category: 'Nature', 
    scenario: 'A rainforest has a lot of _______ because of its many species.',
    scenarioFil: 'Ang isang rainforest ay may maraming _______ dahil sa maraming uri ng hayop at halaman.'
  },
  { 
    id: 'h10', 
    term: 'ECOSYSTEM', 
    difficulty: Difficulty.HARD, 
    category: 'Nature', 
    scenario: 'A coral reef is a complex underwater _______.',
    scenarioFil: 'Ang coral reef ay isang kumplikadong _______ sa ilalim ng tubig.'
  },
  { 
    id: 'h11', 
    term: 'DEMOCRACY', 
    difficulty: Difficulty.HARD, 
    category: 'Government', 
    scenario: 'A system where people vote to choose their leaders is called _______.',
    scenarioFil: 'Ang sistema kung saan bumoboto ang mga tao upang pumili ng kanilang mga lider ay tinatawag na _______.'
  },
  { 
    id: 'h12', 
    term: 'TECHNOLOGY', 
    difficulty: Difficulty.HARD, 
    category: 'Science', 
    scenario: 'Computers and smartphones are examples of modern _______.',
    scenarioFil: 'Ang mga computer at smartphone ay mga halimbawa ng modernong _______.'
  },
  { 
    id: 'h13', 
    term: 'IMAGINATION', 
    difficulty: Difficulty.HARD, 
    category: 'Mind', 
    scenario: 'The ability to create pictures and ideas in your mind is _______.',
    scenarioFil: 'Ang kakayahang lumikha ng mga larawan at ideya sa iyong isipan ay _______.'
  },
  { 
    id: 'h14', 
    term: 'RESPONSIBILITY', 
    difficulty: Difficulty.HARD, 
    category: 'Character', 
    scenario: 'Being trusted to do important tasks shows _______.',
    scenarioFil: 'Ang pagkakaroon ng tiwala upang gumawa ng mahahalagang gawain ay nagpapakita ng _______.'
  },
  { 
    id: 'h15', 
    term: 'COMMUNICATION', 
    difficulty: Difficulty.HARD, 
    category: 'Social', 
    scenario: 'Sharing ideas and feelings with others is called _______.',
    scenarioFil: 'Ang pagbabahagi ng mga ideya at damdamin sa iba ay tinatawag na _______.'
  },
  { 
    id: 'h16', 
    term: 'CELEBRATION', 
    difficulty: Difficulty.HARD, 
    category: 'Events', 
    scenario: 'A party or special event to mark a happy occasion is a _______.',
    scenarioFil: 'Ang isang party o espesyal na kaganapan upang markahan ang isang masayang okasyon ay isang _______.'
  },
  { 
    id: 'h17', 
    term: 'TEMPERATURE', 
    difficulty: Difficulty.HARD, 
    category: 'Science', 
    scenario: 'How hot or cold something is measured by its _______.',
    scenarioFil: 'Kung gaano kainit o kalamig ang isang bagay ay sinusukat sa pamamagitan ng _______.'
  },
  { 
    id: 'h18', 
    term: 'ELECTRICITY', 
    difficulty: Difficulty.HARD, 
    category: 'Science', 
    scenario: 'The power that makes lights and computers work is _______.',
    scenarioFil: 'Ang kapangyarihang nagpapagana ng mga ilaw at computer ay _______.'
  },
  { 
    id: 'h19', 
    term: 'COOPERATION', 
    difficulty: Difficulty.HARD, 
    category: 'Social', 
    scenario: 'Working together as a team requires _______.',
    scenarioFil: 'Ang pagtutulungan bilang isang koponan ay nangangailangan ng _______.'
  },
  { 
    id: 'h20', 
    term: 'MULTIPLICATION', 
    difficulty: Difficulty.HARD, 
    category: 'Math', 
    scenario: 'Repeated addition is also known as _______.',
    scenarioFil: 'Ang paulit-ulit na pagdagdag ay kilala rin bilang _______.'
  }
];
