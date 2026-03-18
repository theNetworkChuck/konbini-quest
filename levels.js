/* Konbini Quest - All 12 Levels Data */

// Writing system display modes per level:
// 'romaji'      — Levels 1-4: Show romaji with kana in parentheses for exposure
// 'kana_assist' — Levels 5-8: Show kana primarily, [B] peeks at romaji
// 'kana_only'   — Levels 9-12: Kana/kanji only, no romaji at all
const LEVEL_DISPLAY_MODES = {
  1: 'romaji', 2: 'romaji', 3: 'romaji', 4: 'romaji',
  5: 'kana_assist', 6: 'kana_assist', 7: 'kana_assist', 8: 'kana_assist',
  9: 'kana_only', 10: 'kana_only', 11: 'kana_only', 12: 'kana_only'
};

const LEVELS = [
  // LEVEL 1: "Welcome!" - The Greeting (7-Eleven)
  {
    id: 1,
    name: 'Welcome!',
    nameJp: 'いらっしゃいませ',
    store: '7-Eleven',
    difficulty: 1,
    interactions: [
      {
        clerkJp: 'いらっしゃいませ！',
        clerkRomaji: 'Irasshaimase!',
        clerkEn: 'Welcome!',
        tip: "In Japan, you don't need to respond to this greeting. It's a ritual welcome, not a personal hello.",
        options: [
          { text: '[Stay Silent]', textJp: '[何も言わない]', correct: true },
          { text: 'ありがとう！', romaji: 'Arigatō!', en: 'Thank you!', correct: false },
          { text: 'こんにちは！', romaji: 'Konnichiwa!', en: 'Hello!', correct: false },
          { text: 'いらっしゃいませ！', romaji: 'Irasshaimase!', en: '(Echo it back)', correct: false }
        ],
        correctExplanation: "Perfect! Japanese etiquette says you just walk in. A small nod is fine, but no verbal response is needed.",
        wrongExplanation: "Actually, Japanese people don't respond to いらっしゃいませ. It's like background noise — the clerk may not even be looking at you!"
      }
    ]
  },

  // LEVEL 2: "Thank You!" - Saying Goodbye (Lawson)
  {
    id: 2,
    name: 'Thank You!',
    nameJp: 'ありがとう',
    store: 'Lawson',
    difficulty: 1,
    interactions: [
      {
        clerkJp: 'ありがとうございました！',
        clerkRomaji: 'Arigatō gozaimashita!',
        clerkEn: 'Thank you very much!',
        tip: "The clerk uses past tense (ました/mashita) because the transaction is done. You use present tense (ます/masu) because you're thanking them now.",
        options: [
          { text: 'ありがとうございます', romaji: 'Arigatō gozaimasu', en: 'Thank you', correct: true },
          { text: 'さようなら', romaji: 'Sayōnara', en: 'Goodbye (too formal)', correct: false },
          { text: '[Stay Silent]', textJp: '[何も言わない]', en: 'Walk away silently', correct: false },
          { text: 'バイバイ！', romaji: 'Baibai!', en: 'Bye-bye! (too casual)', correct: false }
        ],
        correctExplanation: "Great! ありがとうございます is the perfect polite response. Notice the present tense!",
        wrongExplanation: "The best response is ありがとうございます (present tense). さようなら is too formal for a konbini, and バイバイ is too casual!"
      }
    ]
  },

  // LEVEL 3: "Do You Want a Bag?" (FamilyMart)
  {
    id: 3,
    name: 'The Bag',
    nameJp: 'レジ袋',
    store: 'FamilyMart',
    difficulty: 1,
    interactions: [
      {
        clerkJp: 'レジ袋はご利用ですか？',
        clerkRomaji: 'Reji-bukuro wa go-riyō desu ka?',
        clerkEn: 'Will you be using a plastic bag?',
        tip: "Since 2020, bags cost ¥3-5. Most Japanese people bring their own bag (マイバッグ). Both yes and no are valid!",
        options: [
          { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
          { text: '大丈夫です', romaji: 'Daijōbu desu', en: "I'm fine / No thanks", correct: true },
          { text: 'はい', romaji: 'Hai', en: 'Yes (too short)', correct: false },
          { text: 'No, thank you', en: '(in English)', correct: false }
        ],
        correctExplanation: "はい、お願いします and 大丈夫です are the two magic phrases that answer almost ANY yes/no question at a konbini!",
        wrongExplanation: "Try はい、お願いします (yes, please) or 大丈夫です (I'm fine). These two phrases will get you through 90% of konbini interactions!"
      }
    ]
  },

  // LEVEL 4: "Point Card?" (7-Eleven)
  {
    id: 4,
    name: 'Point Card?',
    nameJp: 'ポイントカード',
    store: '7-Eleven',
    difficulty: 2,
    interactions: [
      {
        clerkJp: 'ポイントカードはお持ちですか？',
        clerkRomaji: 'Pointo kādo wa o-mochi desu ka?',
        clerkEn: 'Do you have a point card?',
        tip: "7-Eleven uses nanaco, Lawson has Ponta, FamilyMart has dポイント. Listen for ポイント (pointo)!",
        options: [
          { text: '大丈夫です', romaji: 'Daijōbu desu', en: "I'm fine (meaning no)", correct: true },
          { text: '持っていません', romaji: 'Motte imasen', en: "I don't have one", correct: true },
          { text: 'はい', romaji: 'Hai', en: "Yes (but you don't have one!)", correct: false },
          { text: 'ポイント？', romaji: 'Pointo?', en: '(Confused echo)', correct: false }
        ],
        correctExplanation: "Both 大丈夫です and 持っていません work perfectly. 大丈夫です is the easier catch-all response!",
        wrongExplanation: "Since you don't have a point card, say 大丈夫です (I'm fine) or 持っていません (I don't have one)."
      }
    ]
  },

  // LEVEL 5: "Heat It Up?" (Lawson)
  {
    id: 5,
    name: 'Heat It Up?',
    nameJp: '温めますか',
    store: 'Lawson',
    difficulty: 2,
    interactions: [
      {
        clerkJp: 'お弁当、温めますか？',
        clerkRomaji: 'O-bentō, atatamemasu ka?',
        clerkEn: 'Shall I heat up your bento?',
        tip: "Clerks ask this for bento, onigiri, and ready meals. The microwave is behind the counter.",
        options: [
          { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
          { text: '大丈夫です', romaji: 'Daijōbu desu', en: "No thanks", correct: false },
          { text: '温めます', romaji: 'Atatamemasu', en: "I'll heat it (wrong grammar)", correct: false },
          { text: 'ホット', romaji: 'Hotto', en: 'Hot (English)', correct: false }
        ],
        correctExplanation: "はい、お願いします — the magic yes phrase! The clerk will microwave it for you.",
        wrongExplanation: "For this level, you want your bento heated! Say はい、お願いします (yes, please)."
      },
      {
        clerkJp: '少々お待ちください',
        clerkRomaji: 'Shōshō omachi kudasai',
        clerkEn: 'Please wait just a moment',
        tip: "The clerk is being polite. Just wait patiently!",
        options: [
          { text: '[Nod and wait]', textJp: '[うなずいて待つ]', correct: true },
          { text: '急いでください', romaji: 'Isoide kudasai', en: 'Please hurry', correct: false },
          { text: 'ありがとう', romaji: 'Arigatō', en: 'Thanks (not yet!)', correct: false }
        ],
        correctExplanation: "Just wait patiently! The clerk will be back shortly with your warmed bento.",
        wrongExplanation: "Just nod and wait! Saying 急いでください (please hurry) would be very rude in Japan."
      },
      {
        clerkJp: 'お待たせいたしました',
        clerkRomaji: 'O-matase itashimashita',
        clerkEn: 'Thank you for your patience',
        tip: "This is a very polite way of saying 'sorry for the wait.' A thank you or nod is perfect.",
        options: [
          { text: 'ありがとうございます', romaji: 'Arigatō gozaimasu', en: 'Thank you', correct: true },
          { text: '[Slight nod]', textJp: '[軽く頷く]', en: 'Also fine', correct: true },
          { text: '遅い！', romaji: 'Osoi!', en: 'Slow! (VERY rude)', correct: false }
        ],
        correctExplanation: "Perfect! A polite ありがとうございます or a simple nod shows good manners.",
        wrongExplanation: "Never say 遅い (slow) — that's extremely rude! A thank you or nod is the right response."
      }
    ]
  },

  // LEVEL 6: "Chopsticks?" (FamilyMart)
  {
    id: 6,
    name: 'Chopsticks?',
    nameJp: 'お箸',
    store: 'FamilyMart',
    difficulty: 2,
    interactions: [
      {
        clerkJp: 'お箸はお付けしますか？',
        clerkRomaji: 'O-hashi wa o-tsuke shimasu ka?',
        clerkEn: 'Shall I add chopsticks?',
        tip: "You bought soup! Chopsticks won't work. Ask for a spoon: スプーン (supūn). For a fork: フォーク (fōku).",
        options: [
          { text: 'スプーンをお願いします', romaji: 'Supūn o onegaishimasu', en: 'A spoon, please', correct: true },
          { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes please (chopsticks for soup?)', correct: false },
          { text: 'フォーク', romaji: 'Fōku', en: 'Fork (incomplete sentence)', correct: false },
          { text: '大丈夫です', romaji: 'Daijōbu desu', en: 'No utensils', correct: false }
        ],
        correctExplanation: "Smart! You asked for a spoon since you bought soup. Pattern: [item] を お願いします.",
        wrongExplanation: "You bought soup! Chopsticks won't work well. Say スプーンをお願いします (a spoon, please)."
      }
    ]
  },

  // LEVEL 7: "How Much?" - The Total (7-Eleven)
  {
    id: 7,
    name: 'How Much?',
    nameJp: 'いくら',
    store: '7-Eleven',
    difficulty: 2,
    interactions: [
      {
        clerkJp: '以上で七百五十円でございます',
        clerkRomaji: 'Ijō de nana-hyaku go-jū-en de gozaimasu',
        clerkEn: 'That will be 750 yen',
        tip: "七百 (nana-hyaku) = 700, 五十 (go-jū) = 50. Listen for the numbers!",
        question: 'How much did the clerk say?',
        options: [
          { text: '¥750', correct: true },
          { text: '¥570', correct: false },
          { text: '¥1,750', correct: false },
          { text: '¥75', correct: false }
        ],
        correctExplanation: "Correct! 七百五十円 = 750 yen. 七(nana)=7, 百(hyaku)=100, 五(go)=5, 十(jū)=10.",
        wrongExplanation: "The answer is ¥750! 七百(nana-hyaku)=700 + 五十(go-jū)=50 = 750."
      },
      {
        clerkJp: 'お支払い方法は？',
        clerkRomaji: 'O-shiharai hōhō wa?',
        clerkEn: 'Payment method?',
        tip: "Pattern: [method] + で + お願いします. Cash=現金, Card=カード, Suica=Suica",
        options: [
          { text: '現金でお願いします', romaji: 'Genkin de onegaishimasu', en: 'Cash, please', correct: true },
          { text: 'カードでお願いします', romaji: 'Kādo de onegaishimasu', en: 'Card, please', correct: true },
          { text: 'Suicaでお願いします', romaji: 'Suica de onegaishimasu', en: 'Suica, please', correct: true },
          { text: '[Hold up credit card silently]', textJp: '[カードを無言で出す]', en: 'Silent', correct: false }
        ],
        correctExplanation: "Any verbal payment method works! The pattern is: [method] + で + お願いします.",
        wrongExplanation: "Use words! The pattern is [method]でお願いします. Cash=現金, Card=カード, Suica=Suica."
      }
    ]
  },

  // LEVEL 8: "Where Is It?" - Asking for Help (Lawson)
  {
    id: 8,
    name: 'Where Is It?',
    nameJp: 'どこですか',
    store: 'Lawson',
    difficulty: 2,
    interactions: [
      {
        clerkJp: '',
        playerPrompt: 'You need to find the onigiri. Ask the clerk!',
        clerkRomaji: '',
        clerkEn: '',
        tip: "すみません (sumimasen) gets the clerk's attention. Then: [item] + はどこですか？ = Where is [item]?",
        options: [
          { text: 'すみません、おにぎりはどこですか？', romaji: 'Sumimasen, onigiri wa doko desu ka?', en: 'Excuse me, where are the onigiri?', correct: true },
          { text: 'おにぎり？', romaji: 'Onigiri?', en: 'Just the word', correct: false },
          { text: 'おにぎりをください', romaji: 'Onigiri o kudasai', en: 'Give me onigiri (find them first!)', correct: false },
          { text: 'Where is onigiri?', en: '(in English)', correct: false }
        ],
        correctExplanation: "Perfect! すみません gets attention, then [item]はどこですか asks where it is.",
        wrongExplanation: "Use the full phrase: すみません、おにぎりはどこですか？ (Excuse me, where are the onigiri?)"
      },
      {
        clerkJp: 'あちらにございます',
        clerkRomaji: 'Achira ni gozaimasu',
        clerkEn: "It's over there",
        tip: "The clerk is pointing to where the onigiri are. Thank them!",
        options: [
          { text: 'ありがとうございます', romaji: 'Arigatō gozaimasu', en: 'Thank you', correct: true },
          { text: 'はい', romaji: 'Hai', en: "Yes (doesn't make sense)", correct: false },
          { text: '[Look confused]', textJp: '[困った顔]', en: 'Look confused', correct: false }
        ],
        correctExplanation: "ありがとうございます is always the right response when someone helps you!",
        wrongExplanation: "When someone helps you, say ありがとうございます (thank you)!"
      }
    ]
  },

  // LEVEL 9: "One Famichiki Please!" - Counter Orders (FamilyMart)
  {
    id: 9,
    name: 'Famichiki!',
    nameJp: 'ファミチキ',
    store: 'FamilyMart',
    difficulty: 3,
    interactions: [
      {
        clerkJp: '',
        playerPrompt: 'Order one Famichiki from the hot food counter!',
        clerkRomaji: '',
        clerkEn: '',
        tip: "Counting things: ひとつ (hitotsu)=1, ふたつ (futatsu)=2, みっつ (mittsu)=3. Pattern: [item] を [number] ください",
        options: [
          { text: 'ファミチキをひとつください', romaji: 'Famichiki o hitotsu kudasai', en: 'One Famichiki please', correct: true },
          { text: 'チキンをください', romaji: 'Chikin o kudasai', en: 'Chicken please (no counter)', correct: false },
          { text: 'これ', romaji: 'Kore', en: 'This (too vague)', correct: false },
          { text: 'ファミチキ二つ', romaji: 'Famichiki futatsu', en: 'Two Famichiki (wrong amount)', correct: false }
        ],
        correctExplanation: "ファミチキをひとつください — perfect counter food order!",
        wrongExplanation: "Use the pattern: [item]を[number]ください. One = ひとつ. So: ファミチキをひとつください"
      },
      {
        clerkJp: 'こちらでよろしいですか？',
        clerkRomaji: 'Kochira de yoroshii desu ka?',
        clerkEn: 'Is this one okay?',
        tip: "The clerk is confirming your order. A simple yes is all you need!",
        options: [
          { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
          { text: 'いいえ', romaji: 'Iie', en: 'No', correct: false },
          { text: 'もう一つ', romaji: 'Mō hitotsu', en: 'One more', correct: false }
        ],
        correctExplanation: "はい、お願いします confirms the order. Enjoy your Famichiki!",
        wrongExplanation: "The clerk is showing you the Famichiki. Confirm with はい、お願いします (yes, please)!"
      }
    ]
  },

  // LEVEL 10: "The Full Checkout" (7-Eleven)
  {
    id: 10,
    name: 'Full Checkout',
    nameJp: 'お会計',
    store: '7-Eleven',
    difficulty: 3,
    interactions: [
      {
        clerkJp: 'ポイントカードはお持ちですか？',
        clerkRomaji: 'Pointo kādo wa o-mochi desu ka?',
        clerkEn: 'Do you have a point card?',
        tip: "You don't have a point card. Use 大丈夫です!",
        options: [
          { text: '大丈夫です', romaji: 'Daijōbu desu', en: "I'm fine", correct: true },
          { text: 'はい', romaji: 'Hai', en: 'Yes', correct: false },
          { text: 'ポイント？', romaji: 'Pointo?', en: 'Point?', correct: false }
        ],
        correctExplanation: "大丈夫です — the universal 'no' at a konbini!",
        wrongExplanation: "You don't have one! Say 大丈夫です (I'm fine)."
      },
      {
        clerkJp: 'お弁当、温めますか？',
        clerkRomaji: 'O-bentō, atatamemasu ka?',
        clerkEn: 'Shall I heat up your bento?',
        tip: "You want your bento warm! Say yes!",
        options: [
          { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
          { text: '大丈夫です', romaji: 'Daijōbu desu', en: 'No thanks', correct: false }
        ],
        correctExplanation: "The clerk will heat it up for you!",
        wrongExplanation: "You want it heated! Say はい、お願いします (yes, please)."
      },
      {
        clerkJp: 'お箸はお付けしますか？',
        clerkRomaji: 'O-hashi wa o-tsuke shimasu ka?',
        clerkEn: 'Shall I add chopsticks?',
        tip: "You'll need chopsticks for your bento!",
        options: [
          { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
          { text: '大丈夫です', romaji: 'Daijōbu desu', en: 'No thanks', correct: false }
        ],
        correctExplanation: "Chopsticks for your bento! Good choice.",
        wrongExplanation: "You need chopsticks for your bento! Say はい、お願いします."
      },
      {
        clerkJp: 'レジ袋はご利用ですか？',
        clerkRomaji: 'Reji-bukuro wa go-riyō desu ka?',
        clerkEn: 'Will you be using a plastic bag?',
        tip: "You have your own bag, so no need!",
        options: [
          { text: '大丈夫です', romaji: 'Daijōbu desu', en: "No thanks", correct: true },
          { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: false }
        ],
        correctExplanation: "Good! You're saving ¥3-5 and helping the environment!",
        wrongExplanation: "You have your own bag! Say 大丈夫です (I'm fine)."
      },
      {
        clerkJp: '以上で八百二十円でございます',
        clerkRomaji: 'Ijō de happyaku ni-jū-en de gozaimasu',
        clerkEn: 'That will be 820 yen',
        tip: "八百 (happyaku) = 800, 二十 (ni-jū) = 20. Total: 820 yen.",
        question: 'How much is the total?',
        options: [
          { text: '¥820', correct: true },
          { text: '¥280', correct: false },
          { text: '¥8,200', correct: false },
          { text: '¥620', correct: false }
        ],
        correctExplanation: "Correct! 八百二十円 = 820 yen.",
        wrongExplanation: "It's ¥820! 八百(happyaku)=800 + 二十(ni-jū)=20."
      },
      {
        clerkJp: 'お支払い方法は？',
        clerkRomaji: 'O-shiharai hōhō wa?',
        clerkEn: 'Payment method?',
        tip: "Time to pay! Cash = 現金 (genkin).",
        options: [
          { text: '現金でお願いします', romaji: 'Genkin de onegaishimasu', en: 'Cash, please', correct: true },
          { text: '[Stay silent]', textJp: '[何も言わない]', en: 'Say nothing', correct: false }
        ],
        correctExplanation: "現金でお願いします — paying with cash!",
        wrongExplanation: "Tell the clerk how you want to pay! 現金でお願いします (cash, please)."
      },
      {
        clerkJp: 'レシートはよろしいですか？',
        clerkRomaji: 'Reshīto wa yoroshii desu ka?',
        clerkEn: 'Would you like the receipt?',
        tip: "よろしいですか means 'is this okay?' — they're asking about the receipt.",
        options: [
          { text: '大丈夫です', romaji: 'Daijōbu desu', en: 'No thanks', correct: true },
          { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true }
        ],
        correctExplanation: "Both answers work! Most Japanese people decline the receipt.",
        wrongExplanation: "Say 大丈夫です (no thanks) or はい、お願いします (yes please)."
      },
      {
        clerkJp: 'ありがとうございました！',
        clerkRomaji: 'Arigatō gozaimashita!',
        clerkEn: 'Thank you very much!',
        tip: "Transaction complete! Thank the clerk before leaving.",
        options: [
          { text: 'ありがとうございます', romaji: 'Arigatō gozaimasu', en: 'Thank you', correct: true },
          { text: '[Walk away silently]', textJp: '[無言で去る]', en: 'Leave silently', correct: false }
        ],
        correctExplanation: "ありがとうございます — you completed the full checkout! Well done!",
        wrongExplanation: "Don't leave silently! A polite ありがとうございます (thank you) goes a long way."
      }
    ]
  },

  // LEVEL 11: "Age Check" - Buying Alcohol (Lawson)
  {
    id: 11,
    name: 'Age Check',
    nameJp: '年齢確認',
    store: 'Lawson',
    difficulty: 3,
    interactions: [
      {
        clerkJp: '年齢確認をお願いします。画面のタッチをお願いします',
        clerkRomaji: 'Nenrei kakunin o onegai shimasu. Gamen no tacchi o onegai shimasu',
        clerkEn: 'Age confirmation please. Please touch the screen.',
        tip: "You MUST touch the screen yourself. The clerk cannot do it for you — it's a legal requirement.",
        options: [
          { text: '[Touch はい on screen]', textJp: '[画面の「はい」をタッチ]', en: 'Tap yes on screen', correct: true },
          { text: 'はい、二十歳です', romaji: 'Hai, hatachi desu', en: "Yes, I'm 20 (verbal isn't enough)", correct: false },
          { text: '[Show passport]', textJp: '[パスポートを見せる]', en: 'Show passport', correct: false },
          { text: '[Do nothing]', textJp: '[何もしない]', en: 'Do nothing', correct: false }
        ],
        correctExplanation: "Correct! You must physically touch the screen. The clerk cannot do it for you — it's a legal liability transfer.",
        wrongExplanation: "You must touch the はい button on the screen yourself! The clerk cannot do it for you — it's the law."
      },
      {
        clerkJp: 'レジ袋はご利用ですか？',
        clerkRomaji: 'Reji-bukuro wa go-riyō desu ka?',
        clerkEn: 'Will you be using a plastic bag?',
        tip: "Standard bag question — you know this one!",
        options: [
          { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
          { text: '大丈夫です', romaji: 'Daijōbu desu', en: 'No thanks', correct: true }
        ],
        correctExplanation: "You've mastered the bag question!",
        wrongExplanation: "Use はい、お願いします or 大丈夫です for the bag question."
      },
      {
        clerkJp: '以上で六百三十円でございます',
        clerkRomaji: 'Ijō de roppyaku san-jū-en de gozaimasu',
        clerkEn: 'That will be 630 yen',
        tip: "六百 (roppyaku) = 600, 三十 (san-jū) = 30.",
        question: 'How much?',
        options: [
          { text: '¥630', correct: true },
          { text: '¥360', correct: false },
          { text: '¥6,300', correct: false }
        ],
        correctExplanation: "六百三十円 = 630 yen!",
        wrongExplanation: "It's ¥630! 六百(roppyaku)=600 + 三十(san-jū)=30."
      },
      {
        clerkJp: 'ありがとうございました！',
        clerkRomaji: 'Arigatō gozaimashita!',
        clerkEn: 'Thank you very much!',
        tip: "You know the drill!",
        options: [
          { text: 'ありがとうございます', romaji: 'Arigatō gozaimasu', en: 'Thank you', correct: true },
          { text: '[Leave silently]', textJp: '[無言で去る]', en: 'Leave silently', correct: false }
        ],
        correctExplanation: "Perfect! You handled the age check like a pro!",
        wrongExplanation: "Always say ありがとうございます when leaving!"
      }
    ]
  },

  // LEVEL 12: "Master Level" - Full Immersion (FamilyMart)
  {
    id: 12,
    name: 'Master!',
    nameJp: 'マスター',
    store: 'FamilyMart',
    difficulty: 3,
    isJapaneseOnly: true,
    interactions: [
      {
        clerkJp: 'いらっしゃいませ！',
        clerkRomaji: '',
        clerkEn: '',
        tip: '',
        options: [
          { text: '[何も言わない]', correct: true },
          { text: 'こんにちは！', correct: false },
          { text: 'ありがとう！', correct: false }
        ],
        correctExplanation: "いらっしゃいませには返事しなくて大丈夫！",
        wrongExplanation: "いらっしゃいませには返事不要です。"
      },
      {
        clerkJp: '',
        playerPrompt: 'ファミチキを注文しよう！',
        clerkRomaji: '',
        clerkEn: '',
        tip: '',
        options: [
          { text: 'ファミチキをひとつください', correct: true },
          { text: 'チキンください', correct: false },
          { text: 'これ', correct: false }
        ],
        correctExplanation: "ファミチキをひとつください — 完璧！",
        wrongExplanation: "[item]を[number]ください のパターンを使いましょう。"
      },
      {
        clerkJp: '',
        playerPrompt: 'おにぎりを探そう！',
        clerkRomaji: '',
        clerkEn: '',
        tip: '',
        options: [
          { text: 'すみません、おにぎりはどこですか？', correct: true },
          { text: 'おにぎり？', correct: false },
          { text: 'おにぎりをください', correct: false }
        ],
        correctExplanation: "すみません、[item]はどこですか？ — 完璧！",
        wrongExplanation: "すみません、[item]はどこですか？ を使いましょう。"
      },
      {
        clerkJp: 'ポイントカードはお持ちですか？',
        clerkRomaji: '',
        clerkEn: '',
        tip: '',
        options: [
          { text: '大丈夫です', correct: true },
          { text: '持っていません', correct: true },
          { text: 'はい', correct: false }
        ],
        correctExplanation: "大丈夫です — 万能フレーズ！",
        wrongExplanation: "大丈夫です か 持っていません が正解です。"
      },
      {
        clerkJp: 'お弁当、温めますか？',
        clerkRomaji: '',
        clerkEn: '',
        tip: '',
        options: [
          { text: 'はい、お願いします', correct: true },
          { text: '大丈夫です', correct: false },
          { text: 'ホット', correct: false }
        ],
        correctExplanation: "はい、お願いします！",
        wrongExplanation: "はい、お願いします が正解です。"
      },
      {
        clerkJp: 'お箸はお付けしますか？',
        clerkRomaji: '',
        clerkEn: '',
        tip: '',
        options: [
          { text: 'はい、お願いします', correct: true },
          { text: '大丈夫です', correct: true },
          { text: 'フォーク', correct: false }
        ],
        correctExplanation: "完璧！",
        wrongExplanation: "はい、お願いします か 大丈夫です が正解です。"
      },
      {
        clerkJp: 'レジ袋はご利用ですか？',
        clerkRomaji: '',
        clerkEn: '',
        tip: '',
        options: [
          { text: '大丈夫です', correct: true },
          { text: 'はい、お願いします', correct: true },
          { text: 'いいえ', correct: false }
        ],
        correctExplanation: "完璧！",
        wrongExplanation: "大丈夫です か はい、お願いします を使いましょう。"
      },
      {
        clerkJp: 'お支払い方法は？',
        clerkRomaji: '',
        clerkEn: '',
        tip: '',
        options: [
          { text: '現金でお願いします', correct: true },
          { text: 'カードでお願いします', correct: true },
          { text: '[無言]', correct: false }
        ],
        correctExplanation: "[method]でお願いします — 完璧！",
        wrongExplanation: "[method]でお願いします のパターンです。"
      },
      {
        clerkJp: 'ありがとうございました！',
        clerkRomaji: '',
        clerkEn: '',
        tip: '',
        options: [
          { text: 'ありがとうございます', correct: true },
          { text: '[無言で去る]', correct: false }
        ],
        correctExplanation: "おめでとうございます！コンビニマスターです！🎉",
        wrongExplanation: "ありがとうございます を忘れずに！"
      }
    ]
  }
];
