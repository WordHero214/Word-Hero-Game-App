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
    scenarioFil: 'Maraming hayop ang nawawalan ng tahanan dahil sa _______.',
    hint: 'When people cut down many trees in the forest. Starts with DE- and ends with -TION',
    hintFil: 'Kapag pinutol ng mga tao ang maraming puno sa kagubatan. Nagsisimula sa DE- at nagtatapos sa -TION'
  },
  { 
    id: 'h2', 
    term: 'POLLUTION', 
    difficulty: Difficulty.HARD, 
    category: 'Environment', 
    scenario: 'Throwing trash in rivers causes water _______.',
    scenarioFil: 'Ang pagtatapon ng basura sa ilog ay nagiging sanhi ng _______ sa tubig.',
    hint: 'When air, water, or land becomes dirty and harmful. Sounds like "POLL-U-SHUN"',
    hintFil: 'Kapag ang hangin, tubig, o lupa ay nagiging marumi at makasama. Tunog na "POLL-U-SHUN"'
  },
  { 
    id: 'h3', 
    term: 'RECYCLING', 
    difficulty: Difficulty.HARD, 
    category: 'Environment', 
    scenario: 'We can save the Earth by _______ our plastic bottles.',
    scenarioFil: 'Maaari nating iligtas ang Daigdig sa pamamagitan ng _______ ng ating mga plastik na bote.',
    hint: 'Using old things again to make new things. Starts with RE- (means "again") and has CYCLE in it',
    hintFil: 'Paggamit muli ng lumang bagay upang gumawa ng bago. Nagsisimula sa RE- (ibig sabihin "muli") at may CYCLE dito'
  },
  { 
    id: 'h4', 
    term: 'SUSTAINABILITY', 
    difficulty: Difficulty.HARD, 
    category: 'Environment', 
    scenario: 'Using solar energy is a great example of _______.',
    scenarioFil: 'Ang paggamit ng solar energy ay isang magandang halimbawa ng _______.',
    hint: 'Using resources carefully so they last forever. Has the word SUSTAIN (keep going) in it',
    hintFil: 'Paggamit ng mga yaman nang maingat upang tumagal magpakailanman. May salitang SUSTAIN (patuloy) dito'
  },
  { 
    id: 'h5', 
    term: 'PHOTOSYNTHESIS', 
    difficulty: Difficulty.HARD, 
    category: 'Science', 
    scenario: 'Plants make their own food through a process called _______.',
    scenarioFil: 'Ang mga halaman ay gumagawa ng kanilang sariling pagkain sa pamamagitan ng prosesong tinatawag na _______.',
    hint: 'How plants use sunlight to make food. PHOTO means light, SYNTHESIS means making',
    hintFil: 'Paano gumagamit ng liwanag ng araw ang halaman upang gumawa ng pagkain. PHOTO ay liwanag, SYNTHESIS ay paggawa'
  },
  { 
    id: 'h6', 
    term: 'ARCHITECTURE', 
    difficulty: Difficulty.HARD, 
    category: 'Arts', 
    scenario: 'The design and style of a building is called its _______.',
    scenarioFil: 'Ang disenyo at istilo ng isang gusali ay tinatawag na _______.',
    hint: 'The art of designing buildings and houses. Starts with ARCH- (like an arch or curve)',
    hintFil: 'Ang sining ng pagdidisenyo ng mga gusali at bahay. Nagsisimula sa ARCH- (tulad ng arko o kurba)'
  },
  { 
    id: 'h7', 
    term: 'PHILOSOPHY', 
    difficulty: Difficulty.HARD, 
    category: 'Social', 
    scenario: 'The study of the fundamental nature of knowledge is _______.',
    scenarioFil: 'Ang pag-aaral ng pangunahing kalikasan ng kaalaman ay _______.',
    hint: 'Thinking about big questions like "Why are we here?" Sounds like "FIL-OSS-OH-FEE"',
    hintFil: 'Pag-iisip tungkol sa malalaking tanong tulad ng "Bakit tayo nandito?" Tunog na "FIL-OSS-OH-FEE"'
  },
  { 
    id: 'h8', 
    term: 'HYPOTHESIS', 
    difficulty: Difficulty.HARD, 
    category: 'Science', 
    scenario: 'A scientist makes a _______ before starting an experiment.',
    scenarioFil: 'Ang isang siyentipiko ay gumagawa ng _______ bago magsimula ng eksperimento.',
    hint: 'A smart guess that you test in an experiment. Starts with HY- and sounds like "high-POTH-uh-sis"',
    hintFil: 'Isang matalinong hula na sinusubukan mo sa eksperimento. Nagsisimula sa HY- at tunog na "high-POTH-uh-sis"'
  },
  { 
    id: 'h9', 
    term: 'BIODIVERSITY', 
    difficulty: Difficulty.HARD, 
    category: 'Nature', 
    scenario: 'A rainforest has a lot of _______ because of its many species.',
    scenarioFil: 'Ang isang rainforest ay may maraming _______ dahil sa maraming uri ng hayop at halaman.',
    hint: 'Many different types of plants and animals. BIO means life, DIVERSITY means variety',
    hintFil: 'Maraming iba\'t ibang uri ng halaman at hayop. BIO ay buhay, DIVERSITY ay iba\'t iba'
  },
  { 
    id: 'h10', 
    term: 'ECOSYSTEM', 
    difficulty: Difficulty.HARD, 
    category: 'Nature', 
    scenario: 'A coral reef is a complex underwater _______.',
    scenarioFil: 'Ang coral reef ay isang kumplikadong _______ sa ilalim ng tubig.',
    hint: 'A place where plants, animals, and nature work together. ECO means environment, SYSTEM means working together',
    hintFil: 'Isang lugar kung saan ang halaman, hayop, at kalikasan ay nagtutulungan. ECO ay kapaligiran, SYSTEM ay nagtutulungan'
  },
  { 
    id: 'h11', 
    term: 'DEMOCRACY', 
    difficulty: Difficulty.HARD, 
    category: 'Government', 
    scenario: 'A system where people vote to choose their leaders is called _______.',
    scenarioFil: 'Ang sistema kung saan bumoboto ang mga tao upang pumili ng kanilang mga lider ay tinatawag na _______.',
    hint: 'A government where people vote and choose. DEMO means people, CRACY means rule',
    hintFil: 'Isang pamahalaan kung saan bumoboto at pumipili ang mga tao. DEMO ay tao, CRACY ay pamamahala'
  },
  { 
    id: 'h12', 
    term: 'TECHNOLOGY', 
    difficulty: Difficulty.HARD, 
    category: 'Science', 
    scenario: 'Computers and smartphones are examples of modern _______.',
    scenarioFil: 'Ang mga computer at smartphone ay mga halimbawa ng modernong _______.',
    hint: 'Machines and tools like computers, phones, and tablets. Sounds like "tek-NOL-oh-jee"',
    hintFil: 'Mga makina at kasangkapan tulad ng computer, telepono, at tablet. Tunog na "tek-NOL-oh-jee"'
  },
  { 
    id: 'h13', 
    term: 'IMAGINATION', 
    difficulty: Difficulty.HARD, 
    category: 'Mind', 
    scenario: 'The ability to create pictures and ideas in your mind is _______.',
    scenarioFil: 'Ang kakayahang lumikha ng mga larawan at ideya sa iyong isipan ay _______.',
    hint: 'Creating pictures and stories in your mind. Starts with IM- and has the word IMAGE in it',
    hintFil: 'Paglikha ng mga larawan at kuwento sa iyong isipan. Nagsisimula sa IM- at may salitang IMAGE dito'
  },
  { 
    id: 'h14', 
    term: 'RESPONSIBILITY', 
    difficulty: Difficulty.HARD, 
    category: 'Character', 
    scenario: 'Being trusted to do important tasks shows _______.',
    scenarioFil: 'Ang pagkakaroon ng tiwala upang gumawa ng mahahalagang gawain ay nagpapakita ng _______.',
    hint: 'Being trusted to do your duties. Has the word RESPONSE (answer) and ABILITY (can do) in it',
    hintFil: 'Ang pagiging mapagkakatiwalaan na gawin ang iyong mga tungkulin. May salitang RESPONSE (sagot) at ABILITY (kaya) dito'
  },
  { 
    id: 'h15', 
    term: 'COMMUNICATION', 
    difficulty: Difficulty.HARD, 
    category: 'Social', 
    scenario: 'Sharing ideas and feelings with others is called _______.',
    scenarioFil: 'Ang pagbabahagi ng mga ideya at damdamin sa iba ay tinatawag na _______.',
    hint: 'Talking and sharing with others. Starts with COM- (together) and sounds like "kuh-MYOO-nih-KAY-shun"',
    hintFil: 'Pakikipag-usap at pagbabahagi sa iba. Nagsisimula sa COM- (sama-sama) at tunog na "kuh-MYOO-nih-KAY-shun"'
  },
  { 
    id: 'h16', 
    term: 'CELEBRATION', 
    difficulty: Difficulty.HARD, 
    category: 'Events', 
    scenario: 'A party or special event to mark a happy occasion is a _______.',
    scenarioFil: 'Ang isang party o espesyal na kaganapan upang markahan ang isang masayang okasyon ay isang _______.',
    hint: 'A party for birthdays, holidays, or special days. Has the word CELEBRATE in it',
    hintFil: 'Isang party para sa kaarawan, pista, o espesyal na araw. May salitang CELEBRATE dito'
  },
  { 
    id: 'h17', 
    term: 'TEMPERATURE', 
    difficulty: Difficulty.HARD, 
    category: 'Science', 
    scenario: 'How hot or cold something is measured by its _______.',
    scenarioFil: 'Kung gaano kainit o kalamig ang isang bagay ay sinusukat sa pamamagitan ng _______.',
    hint: 'How hot or cold it is. We measure it with a thermometer. Sounds like "TEM-per-uh-chur"',
    hintFil: 'Kung gaano kainit o kalamig. Sinusukat natin ito gamit ang thermometer. Tunog na "TEM-per-uh-chur"'
  },
  { 
    id: 'h18', 
    term: 'ELECTRICITY', 
    difficulty: Difficulty.HARD, 
    category: 'Science', 
    scenario: 'The power that makes lights and computers work is _______.',
    scenarioFil: 'Ang kapangyarihang nagpapagana ng mga ilaw at computer ay _______.',
    hint: 'The power from outlets that makes lights work. Has the word ELECTRIC in it',
    hintFil: 'Ang kapangyarihan mula sa outlet na nagpapagana ng mga ilaw. May salitang ELECTRIC dito'
  },
  { 
    id: 'h19', 
    term: 'COOPERATION', 
    difficulty: Difficulty.HARD, 
    category: 'Social', 
    scenario: 'Working together as a team requires _______.',
    scenarioFil: 'Ang pagtutulungan bilang isang koponan ay nangangailangan ng _______.',
    hint: 'Working together as a team. CO means together, OPERATION means working',
    hintFil: 'Pagtutulungan bilang isang koponan. CO ay sama-sama, OPERATION ay paggawa'
  },
  { 
    id: 'h20', 
    term: 'MULTIPLICATION', 
    difficulty: Difficulty.HARD, 
    category: 'Math', 
    scenario: 'Repeated addition is also known as _______.',
    scenarioFil: 'Ang paulit-ulit na pagdagdag ay kilala rin bilang _______.',
    hint: 'Math with times tables like 3 × 4 = 12. Has the word MULTIPLY (times) in it',
    hintFil: 'Matematika na may times tables tulad ng 3 × 4 = 12. May salitang MULTIPLY (beses) dito'
  }
];
