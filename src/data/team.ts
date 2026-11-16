/** Team content is maintained here and published by deploying the site.
 * Photos belong in public/static/images/team/; their URLs omit public/.
 * Keep IDs and member keys unique and stable. Array order controls display order.
 * A member may be referenced in multiple departments; edit their details only once.
 */
export type TeamPhoto = {
  src: string
  alt: string
  width: number
  height: number
}
export type TeamMember = {
  id: string
  name: string
  role: string
  photo: TeamPhoto
  description?: string
  linkedin?: string
  github?: string
  webpage?: string
}
export type TeamDepartment = {
  id: string
  name: string
  priorityMembers: TeamMember[]
  members: TeamMember[]
}
export type Team = {
  id: string
  name: string
  year: string
  departments: TeamDepartment[]
}

// Add a member inside the members object below by copying this template:
// "firstname-lastname": {
//   id: "firstname-lastname", // Unique, stable identifier.
//   name: "First Last",
//   role: "Associate", // Existing filters recognize president, director, associate.
//   photo: {
//     src: "/static/images/team/firstname-lastname.jpg",
//     alt: "Photo of First Last",
//     width: 1200, // Actual image dimensions in pixels.
//     height: 1600,
//   },
//   description: "Write a short introduction here.", // Optional.
//   linkedin: "https://www.linkedin.com/in/username", // Optional; omit unused links.
//   github: "https://github.com/username",
//   webpage: "https://example.com",
// },
// Then reference members["firstname-lastname"] in a department below.
// priorityMembers renders the department's first row; members renders the regular rows.
// Add a department by copying this into team.departments:
// {
//   id: "new-department",
//   name: "New Department",
//   priorityMembers: [],
//   members: [members["firstname-lastname"]],
// },
// Keep existing department names/roles when editing: filters use their text,
// including the special "Senior Vice-President" department and SVP roles.
// List SVPs only in that department, never in the subteams they lead.

const members = {
  "ibrahim-kasim-172": {
    id: "172",
    name: "Ibrahim Kasim",
    role: "President",
    photo: {
      src: "/static/images/team/ibrahim-kasim-172.png",
      alt: "Photo of Ibrahim Kasim",
      width: 1237,
      height: 1816,
    },
    description:
      "Hi, I’m Ibrahim! This is my third year being part of AMACSS. I love being involved in this community and having the opportunity to make a difference. AMACSS has given me a real sense of belonging within the CMS community and has helped me make friends and connections that I know I’ll have for life.\n\nI love working on hard problems and building solutions through coding and technology. I’m also really interested in startups and building companies. Even though I’m in CS and software, I also love working with hardware, whether that’s building drones, electric skateboards, or modelling and 3D-printing different things.\n\nI’m also a huge car enthusiast, and my dream car is a Porsche 911 GT3 RS. Apart from that, I really love cats and coffee!",
    linkedin: "https://www.linkedin.com/in/ibrahimkasim/",
    github: "https://github.com/Ibrahimkasiim1",
    webpage: "https://ibrahimkasim.com",
  },
  "aseel-magzoub-145": {
    id: "145",
    name: "Aseel Magzoub",
    role: "Senior Vice-President Academics",
    photo: {
      src: "/static/images/team/aseel-magzoub-145.jpeg",
      alt: "Photo of Aseel Magzoub",
      width: 2035,
      height: 3268,
    },
    description:
      "My name is Aseel, and I am in my fourth year doing a Mathematics Specialist. I joined AMACSS because I wanted to be part of the CMS community and eventually serve within the community. I enjoy most physical activities, but most of all I’ve been climbing quite heavily!",
  },
  "ivan-semenov-146": {
    id: "146",
    name: "Ivan Semenov",
    role: "Senior Vice-President Operations",
    photo: {
      src: "/static/images/team/ivan-semenov-146.jpg",
      alt: "Photo of Ivan Semenov",
      width: 1017,
      height: 838,
    },
    description:
      "Hey! My name is Ivan! I love meeting new people, get involved, contribute & grow our community, and I love coffee!",
    linkedin: "https://linkedin.com/in/ivan-semenov-860722290",
    webpage: "https://g.dev/IvanSemenov",
  },
  "ferissa-dinata": {
    id: "ferissa-dinata",
    name: "Ferissa Dinata",
    role: "Vice-President CMS Lounge Operations",
    photo: {
      src: "/static/images/team/ferissa-dinata.jpg",
      alt: "Photo of Ferissa Dinata",
      width: 422,
      height: 528,
    },
    description:
      "Hi! I’m Ferissa Dinata, a software engineering student and your VP of CMS Lounge Operations. I joined AMACSS because I love running events, fostering a collaborative tech community, and having fun with fellow CMS students. Outside of my coursework and random jobs, you can usually find me playing the guitar or swimming laps. A fun fact about me is that I’m also a certified swim instructor! Feel free to say hi or connect if you see me around the lounge.",
    linkedin: "https://www.linkedin.com/in/ferissa-dinata-952663228",
    github: "https://github.com/ferissadi06",
  },
  "victoria-djedjeian-159": {
    id: "159",
    name: "Victoria Djedjeian",
    role: "Senior Vice-President Communications",
    photo: {
      src: "/static/images/team/victoria-djedjeian-159.jpg",
      alt: "Photo of Victoria Djedjeian",
      width: 1333,
      height: 2000,
    },
    description:
      "Hi! I’m Victoria! I first joined AMACSS as a First-Year Coordinator because I wanted to get more involved in the math and CS community and meet more people outside of my classes. Since then, I’ve taken on the role of SVP of Communications.\nOutside of AMACSS, I love music, travelling, and trying new things. A few fun facts about me: I’ve been skydiving, I’ve visited around 20 countries, and I speak three languages fluently! I’m always up for an adventure or discovering something new, and I’m excited for this new academic year!",
    linkedin: "https://www.linkedin.com/in/victoria-djedjeian",
  },

  "aisha-shaikh-162": {
    id: "162",
    name: "Aisha Shaikh",
    role: "Student Engagement Director",
    photo: {
      src: "/static/images/team/aisha-shaikh-162.jpg",
      alt: "Photo of Aisha Shaikh",
      width: 2000,
      height: 1500,
    },
    description:
      "My name is Aisha, I am currently in my second year, doing a double major in Public policy and Health policy. I decided to join AMACSS to put myself out there and experience different fields within the UTSC community, and meet with people I would most likely never see. This is my first time in AMACSS, and some hobbies I have are travelling, and baking. A fun fact about myself is that I'm really good at art and I enjoy painting.",
    linkedin: "https://www.linkedin.com/in/aisha-shaikh-66020726b",
  },
  "aaron-sunarto-139": {
    id: "139",
    name: "Aaron Sunarto",
    role: "Vice-President Review Seminar",
    photo: {
      src: "/static/images/team/aaron-sunarto-139.jpg",
      alt: "Photo of Aaron Sunarto",
      width: 832,
      height: 855,
    },
    description:
      "Helloo, my name's Aaron. I'm a third-year studying Mathematics Specialist and Computer Science Major, particularly interested in automatic proof verification and dependent type theory! My goal in life is to give back to the community what I've learned so far by teaching, and it's been a fun ride so far! It would be guilty of me if I didn't say Indomie was one of my favorite foods, but I should probably stay away from it...",
    linkedin: "https://www.linkedin.com/in/aaronbsunarto",
  },
  "avery-nie-156": {
    id: "156",
    name: "Avery Nie",
    role: "Mathematics Director",
    photo: {
      src: "/static/images/team/avery-nie-156.jpg",
      alt: "Photo of Avery Nie",
      width: 1340,
      height: 2000,
    },
    description:
      "I’m Avery Nie, a third-year math specialist at UTSC. I've been in AMACSS previously as a first-year representative and course rep. My favorite hobbies include making origami polyhedra and crocheting mathematical structures. In addition, I like playing violin, piano, table tennis, and the card game SET.",
    linkedin: "https://www.linkedin.com/in/avery-nie/",
    github: "https://github.com/avery-nie",
    webpage: "https://avery-nie.github.io/",
  },
  "jaagrit-gaur-157": {
    id: "157",
    name: "Jaagrit Gaur",
    role: "Statistics Director",
    photo: {
      src: "/static/images/team/jaagrit-gaur-157.jpg",
      alt: "Photo of Jaagrit Gaur",
      width: 1333,
      height: 2000,
    },
    description:
      "Hey everyone! 👋 I'm Jaagrit Gaur, a CS student at UTSC and an international student from India. I joined AMACSS because I want to give back to the community that supported me as a new student navigating UTSC alone. I'm passionate about helping others build confidence and find their place in CMS. Outside of class, I love cooking and playing card games. Excited to meet you all!",
    linkedin: "https://www.linkedin.com/in/jaagritgaur/",
  },
  "ness-schattman-158": {
    id: "158",
    name: "Ness Schattman",
    role: "Computer Science Director",
    photo: {
      src: "/static/images/team/ness-schattman-158.jpg",
      alt: "Photo of Ness Schattman",
      width: 1345,
      height: 2000,
    },
    description:
      "Hey, I'm Ness! \nYou might have seen me around as a TA, as an AMACSS course rep, or just hanging around the IA fourth floor yapping with professors. I love teaching, especially getting to chat with students and come up with new ways to present the material, which is why AMACSS is a great place to be.\nWhen I'm not doing math or CS, you can find me doing my biology major (ask me about mathematical ecology!), playing with string (ask me about loop braid groups!), singing/conducting in/for the Hart House Chorus, performing onstage with UTSC Improv and UofT Drag, and learning the constructed language Toki Pona.",
    linkedin: "https://www.linkedin.com/in/vanessa-schattman-ba1805260/",
    github: "https://github.com/nesssch",
    webpage: "https://nesssch.github.io/",
  },
  "zayaan-bhanwadia-140": {
    id: "140",
    name: "Zayaan Bhanwadia",
    role: "Vice-President Technology",
    photo: {
      src: "/static/images/team/zayaan-bhanwadia-140.jpg",
      alt: "Photo of Zayaan Bhanwadia",
      width: 677,
      height: 678,
    },
    description:
      "Hi, I'm Zayaan! I joined AMACSS last year as a First Year Associate and wanted to continue engaging with and helping the CMS community this year. I love watching horror movies and slice of life shows. My goal is to solve 500 LeetCode questions by the end of the school year, ask me where I am!",
    linkedin: "https://www.linkedin.com/in/zayaan-bhan/",
    github: "https://github.com/ZayaanB",
    webpage: "https://zayaanb.github.io/Zayaan/",
  },
  "jolie-zhu-153": {
    id: "153",
    name: "Jolie Zhu",
    role: "Technology Director",
    photo: {
      src: "/static/images/team/jolie-zhu-153.jpg",
      alt: "Photo of Jolie Zhu",
      width: 1394,
      height: 2000,
    },
    description:
      "Hi, I'm Jolie! I study computer science and statistics. I joined AMACSS in hopes of supporting our CMS community and students through technology, by improving the apps/tools we have now, and designing new ones. I enjoy binging manga, playing violin, and grinding typing tests. Fun fact: I have a black cat.",
    linkedin: "https://www.linkedin.com/in/jolie-z/",
    github: "https://github.com/JolieeZhuu",
    webpage: "https://www.joliezhu.me/",
  },
  "yathurshan-manoharan-155": {
    id: "155",
    name: "Yathurshan Manoharan",
    role: "Technology Director",
    photo: {
      src: "/static/images/team/yathurshan-manoharan-155.jpg",
      alt: "Photo of Yathurshan Manoharan",
      width: 2000,
      height: 2000,
    },
    description:
      "Hey, I'm Yathurshan, a 2nd-year Computer Science student @ UofT. I joined AMACSS to connect with other students in computer science and get involved in the community. In my free time, I'm probably playing chess, gaming, or doomscrolling.",
    linkedin: "https://www.linkedin.com/in/yathurshan-manoharan/",
    github: "https://github.com/Yathu2007",
  },
  "param-patel-149": {
    id: "149",
    name: "Param Patel",
    role: "Technology Associate",
    photo: {
      src: "/static/images/team/param-patel-149.jpg",
      alt: "Photo of Param Patel",
      width: 2000,
      height: 1897,
    },
    description:
      "Hi everyone I am Param Patel, I joined AMACSS because I love our CS community and really want to connect with more with like minded people.  On the tech side, I enjoy messing around with ML pipelines, or doing hackathons. When I'm away from my keyboard, you can usually find me at the gym or playing Rocket League. Fun fact I used to be a Gymnastics coach, and I love my extra pistachio pesto pasta..",
    linkedin: "https://www.linkedin.com/in/param-patel-9589b226a/",
    github: "https://github.com/ParamPate",
  },
  "sajan-pirithiviraj-164": {
    id: "164",
    name: "Sajan Pirithiviraj",
    role: "Technology Associate, Special Events Associate",
    photo: {
      src: "/static/images/team/sajan-pirithiviraj-164.jpg",
      alt: "Photo of Sajan Pirithiviraj",
      width: 2000,
      height: 2000,
    },
    description:
      "hi hi! i'm a third-year CS student who joined AMACSS to get more involved with the CMS community at UTSC (first time being in AMACSS). here's a list of things i enjoy: music (some \"rock stuff\" like weezer, mcr, ptv, paramore, strokes, blink, p!atd), games (indie stuff like undertale/deltarune, slay the spire, balatro, omori), working out (started going bouldering!), and also programming and building things (been trying to integrate the terminal in my everyday laptop use)!",
    linkedin: "https://www.linkedin.com/in/sajan-p",
    github: "https://github.com/sajan-p",
  },

  "daniel-joseph-161": {
    id: "161",
    name: "Daniel Joseph",
    role: "Vice-President Engagement",
    photo: {
      src: "/static/images/team/daniel-joseph-161.jpg",
      alt: "Photo of Daniel Joseph",
      width: 2000,
      height: 1171,
    },
    description:
      "Hi everyone! My name's Daniel and I'm a third year Computer Science student at UTSC. I'm extremely excited to join AMACSS this year as the Vice-President of Engagement. \n\nI decided to join AMACSS because CMS programs can feel academically demanding, making it easy for students to feel disconnected from the community. I wanted to take on an active role in bridging the gap between academics and community by creating welcoming and engaging spaces where students can connect, relax, and support one another.\n\nOutside of my studies, you can usually find me gaming, watching TV shows, sketching, playing basketball, or trying out new sports. A fun fact about me is that I know three different card tricks! My favourite drink (also the best drink ever made) is the Tim Hortons Peach Sparkling Quencher. If you ever see me around campus, feel free to say hi!",
    linkedin: "https://www.linkedin.com/in/daniel-joseph-932b95333/",
  },
  "jeel-patel-154": {
    id: "154",
    name: "Jeel Patel",
    role: "Campus Life Director",
    photo: {
      src: "/static/images/team/jeel-patel-154.jpg",
      alt: "Photo of Jeel Patel",
      width: 1473,
      height: 2000,
    },
    description:
      "Hi, I'm Jeel. I'm a third-year CS student, and this is my third year in AMACSS. In my free time, I'm usually playing or watching sports, or gaming.",
    linkedin: "https://www.linkedin.com/in/jeelp2312",
  },
  "raya-pourtehrani-151": {
    id: "151",
    name: "Raya Pourtehrani",
    role: "Vice-President Campus Life",
    photo: {
      src: "/static/images/team/raya-pourtehrani-151.jpg",
      alt: "Photo of Raya Pourtehrani",
      width: 1386,
      height: 2000,
    },
    description:
      "Hi! I’m Raya, a second-year student at UTSC. After serving as a Lounge Associate last year, I’m back with AMACSS to bring energy, fun, and great memories to our CMS community while connecting with new people. Outside of campus, you’ll usually find me playing basketball, eating sushi, sipping boba, or relaxing with a coloring book. Fun fact: I love learning languages and currently speak four!",
  },
  "shaghana-thangarajah-152": {
    id: "152",
    name: "Shaghana Thangarajah",
    role: "Campus Life Director",
    photo: {
      src: "/static/images/team/shaghana-thangarajah-152.jpg",
      alt: "Photo of Shaghana Thangarajah",
      width: 1499,
      height: 2000,
    },
    description:
      "Hello, my name is Shaghana! I am a second-year Computer Science Specialist in software engineering. I joined AMACSS to be involved in the campus life, connect with a diverse group of people, and create a lasting impact on future CMS students. This will be my first time in AMACSS so it's a completely new chapter in my life to explore. Some of my hobbies include baking, and watching anime in my free time, my favourite being The Apothecary Diaries! A fun fact about myself is that both my hands are double jointed. I'm excited to apart of AMACSS this year!",
    linkedin: "https://www.linkedin.com/in/shaghana-thangarajah-3ab627376",
  },
  "tonirika-das-150": {
    id: "150",
    name: "Tonirika Das",
    role: "CMS Lounge Director",
    photo: {
      src: "/static/images/team/tonirika-das-150.jpg",
      alt: "Photo of Tonirika Das",
      width: 1619,
      height: 2000,
    },
    description:
      "Hi! My name is Tonirika Das, and I’m a second-year Computer Science student at U of T Scarborough. I joined AMACSS because I wanted to get more involved in the CMS community, meet new people, and help create a welcoming environment for students. I’ve attended AMACSS events before, including Game Night and the Gala, and really enjoyed the supportive atmosphere.\n\nOutside of school, I enjoy binging shows, reading books, and hanging out with my friends. A fun fact about me is that I can't walk in a straight line! My favourite food is probably biryani, and my favourite drinks are coffee and Coke.\n\nI’m excited to be part of AMACSS and help make campus life more fun, welcoming, and connected for everyone!",
    linkedin: "https://www.linkedin.com/in/tonirika-das-13449642b",
  },
  "kavya-patel-165": {
    id: "165",
    name: "Kavya Patel",
    role: "Campus Life Associate",
    photo: {
      src: "/static/images/team/kavya-patel-165.jpg",
      alt: "Photo of Kavya Patel",
      width: 1125,
      height: 2000,
    },
    description:
      "Hi, my name is Kavya! I joined AMACSS because I wanted to gain experience, but more importantly, I wanted to become more involved in the community at UTSC, and especially the CMS community. This is my first time being apart of the AMACSS team so I am excited to have this opportunity. Some of my hobbies include card games, sports, and a few video games!",
    linkedin: "https://www.linkedin.com/in/kavya-patel-12a310384/",
    github: "https://github.com/patelkavya1225-afk",
  },
  "tahmeed-rahman-141": {
    id: "141",
    name: "Tahmeed Rahman",
    role: "Vice-President Special Events",
    photo: {
      src: "/static/images/team/tahmeed-rahman-141.jpeg",
      alt: "Photo of Tahmeed Rahman",
      width: 2316,
      height: 2632,
    },
    description:
      "Hi! I’m Tahmeed. I am a 3rd year Computer Science student specializing in Software Engineering at UTSC and I am the VP of Special Events at AMACSS. I joined AMACSS to get more involved in the CS community, meet new people, help create a welcoming environment for students and of course the GALA. Outside of school, I enjoy playing guitar, making music, and consuming high amounts of caffeine. A fun fact about me is that I used to produce beats and play drums for a couple of bands in Toronto. I’m excited to be part of AMACSS and get involved in the CMS community.",
    linkedin: "https://www.linkedin.com/in/tahmeed-rahman-9a3966322",
    github: "https://github.com/TahmeedRahman",
  },
  "khin-lay-kywe-169": {
    id: "169",
    name: "Khin Lay Kywe",
    role: "Vice-President Special Events",
    photo: {
      src: "/static/images/team/khin-lay-kywe-169.jpg",
      alt: "Photo of Khin Lay Kywe",
      width: 2000,
      height: 1891,
    },
    description:
      "Hello, I'm Khin and I'm a second year Math (co-op) and Biology double major. My interest lies in applications of machine learning for disease diagnosis and drug discovery. In my free time, I'm usually hunting for the most delicious food in downtown or reading manga.",
    linkedin: "https://www.linkedin.com/in/khin-lay-kywe",
    github: "https://github.com/kywekhin",
  },
  "alireza-pourreza-163": {
    id: "163",
    name: "Alireza Pourreza",
    role: "Special Events Director",
    photo: {
      src: "/static/images/team/alireza-pourreza-163.jpg",
      alt: "Photo of Alireza Pourreza",
      width: 2000,
      height: 2000,
    },
    description:
      "Hi! I’m Alireza, a 3rd-year Computer Science student at UTSC. I’m really excited to join AMACSS this year and contribute to the CMS community! Outside of school, I love bodybuilding, powerlifting, cooking, watching movies, finding hidden gems on Spotify, and learning to play my favourite songs on electric guitar. I’m looking forward to meeting everyone and being part of the AMACSS community :)",
    linkedin: "https://www.linkedin.com/in/alireza-pourrezaaa/",
    github: "https://github.com/AlirezaPrz",
    webpage: "https://alirezaprz.github.io/",
  },
  "rachel-tam-171": {
    id: "171",
    name: "Rachel Tam",
    role: "Vice-President Marketing",
    photo: {
      src: "/static/images/team/rachel-tam-171.jpg",
      alt: "Photo of Rachel Tam",
      width: 594,
      height: 482,
    },
    description:
      "Hi everyone! this is Rachel, and I am currently in my second year, double majoring in economics and statistics. I am joining AMACSS to share my passion for marketing and contribute to the CMS community! Outside of school, I love cooking, baking, playing volleyball, video games, and watching yaoi! A fun fact about me is that I’m probably the #1 dog lover in the world, bernese mountain dogs are the cutest dogs ever",
    linkedin:
      "https://www.linkedin.com/in/rachel-tam-24b98b431?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  "sanny-hu-143": {
    id: "143",
    name: "Sanny Hu",
    role: "Vice-President Finance",
    photo: {
      src: "/static/images/team/sanny-hu-143.jpg",
      alt: "Photo of Sanny Hu",
      width: 1170,
      height: 2080,
    },
    description:
      "Hi everyone! I’m Sanny, a 3rd-year student specializing in Quantitative Finance (Statistics) with a minor in Economics. I joined AMACSS to connect with more peers in the CMS department! When I'm not studying, you can usually find me playing badminton, practicing the flute, or cooking up something new. A fun fact about me is that I genuinely don't understand why people like pizza so much...",
  },
  "anson-148": {
    id: "148",
    name: "Anson",
    role: "Finance Director",
    photo: {
      src: "/static/images/team/anson-148.jpg",
      alt: "Photo of Anson",
      width: 1333,
      height: 2000,
    },
    description:
      "I am really excited to contribute to AMACSS for the coming year!",
    linkedin: "https://www.linkedin.com/in/ansonkwokys",
  },
  "siron-lee-zhao-147": {
    id: "147",
    name: "Siron Lee Zhao",
    role: "Finance Director",
    photo: {
      src: "/static/images/team/siron-lee-zhao-147.jpg",
      alt: "Photo of Siron Lee Zhao",
      width: 1333,
      height: 2000,
    },
    description:
      "Hi my name is Siron, I am a second year student in double degree. I joined AMACSS to contribute to the math community on campus!",
    linkedin:
      "https://www.linkedin.com/in/siron-zhao-185063239?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  "andrew-li-173": {
    id: "173",
    name: "Andrew Li",
    role: "Vice-President Outreach",
    photo: {
      src: "/static/images/team/andrew-li-173.jpeg",
      alt: "Photo of Andrew Li",
      width: 958,
      height: 1033,
    },
    description:
      "Hi! I’m Andrew, VP Outreach at AMACSS. I joined AMACSS to meet new people and help build meaningful connections with our community and industry partners. Outside of school, I enjoy travelling, badminton, and exploring good food!",
    linkedin: "https://www.linkedin.com/in/andrewyili",
  },
  "jino-lee-144": {
    id: "144",
    name: "Jino Lee",
    role: "Vice-President Academics",
    photo: {
      src: "/static/images/team/jino-lee-144.jpg",
      alt: "Photo of Jino Lee",
      width: 413,
      height: 531,
    },
    description:
      "Hello! My name is Jino and I am a 2nd year studying Math and Statistics. This is my first year at AMACSS and I will be serving as the VP Academics! I'm Korean and grew up in Hong Kong and I love rock climbing, watching movies, and am trying to touch more grass. Looking forward to a fun year with AMACSS!",
    linkedin: "https://www.linkedin.com/in/jino-lee-9744272b3/",
  },
  "kylie-lee-160": {
    id: "160",
    name: "Kylie Lee",
    role: "Academics Director",
    photo: {
      src: "/static/images/team/kylie-lee-160.jpg",
      alt: "Photo of Kylie Lee",
      width: 1427,
      height: 2000,
    },
    description:
      "Hi, my name is Kylie. I'm a second-year Statistics Co-op student at UTSC. I am really excited to be the Director of Academics for 2026-2027. I joined AMACSS to become more involved in the CMS community. I'd like to meet other CMS students and learn from them. I love travelling and cooking. I've also been obsessed with matcha lately, so if you know any good matcha spots, let me know!",
    linkedin: "https://www.linkedin.com/in/kylie-chaeyoung-lee",
  },
  "param-khurana-170": {
    id: "170",
    name: "Param Khurana",
    role: "Academics Director",
    photo: {
      src: "/static/images/team/param-khurana-170.jpg",
      alt: "Photo of Param Khurana",
      width: 271,
      height: 524,
    },
    description:
      "Hi, I'm Param! I am a second year student specializing in Computer Science(Software engineering stream) with a minor in Statistics. This is my first time on the AMACSS team, and I am very excited to be joining as the Academics Director. I joined AMACSS because I want to guide and help my fellow CMS students and help the community grow. When I'm not studying or coding, you'll usually find me at the gym or cooking in the kitchen.",
    linkedin: "https://www.linkedin.com/in/param-khurana",
    github: "https://github.com/itsmeparam09",
  },
  "samiha-hasan-166": {
    id: "166",
    name: "Samiha Hasan",
    role: "Academics Associate",
    photo: {
      src: "/static/images/team/samiha-hasan-166.jpg",
      alt: "Photo of Samiha Hasan",
      width: 889,
      height: 2000,
    },
    description:
      "Hi everyone! My name is Samiha Hasan, and I’m a 2nd-year student in the Statistical Sciences Specialist program with a minor in English.\n\nThis is my first year with AMACSS, and I joined to get more involved, meet fellow students in the CMS community, and help support everyone while making awesome connections along the way!\n\nWhen I’m not studying, you can usually find me reading books or catching up on movies and anime, and I’ve also picked up boxing recently for fun.\n\nFavorite Food and Drink: Biryani and a cold Mango Lassi.\n\nFun Fact: I have a massive soft spot for narrative stories in almost any format, whether it’s novels, films, or story-rich video games.",
    linkedin: "https://www.linkedin.com/in/h-samiha622",
    github: "https://github.com/Samiha622",
  },
  "summer-stormes-168": {
    id: "168",
    name: "Summer Stormes",
    role: "Academics Associate",
    photo: {
      src: "/static/images/team/summer-stormes-168.jpg",
      alt: "Photo of Summer Stormes",
      width: 2000,
      height: 1500,
    },
    description:
      "Hello :) My name is Summer and I'm a second year computer science student. In my free time I like to do photography (getting into film cameras now!) and paint silly birds. Additionally, I leave a trail of dragon doodles everywhere I go. Fun fact, I once lost two whole horses while working as a stable hand.",
    linkedin: "https://www.linkedin.com/in/summer-stormes-9a3859312",
    github: "https://github.com/summerbirds123-gif",
  },
  "yihang-wu-167": {
    id: "167",
    name: "Yihang Wu",
    role: "Academics Associate",
    photo: {
      src: "/static/images/team/yihang-wu-167.jpg",
      alt: "Photo of Yihang Wu",
      width: 2000,
      height: 1500,
    },
    description:
      "Hey, I am Yihang. I am doing a double major on biochemistry and math. This is my first time to join AMACSS and I am so excited to meet some new faces. I like to try something new, interesting and challenging to fulfill outside of classes, which is why I want to play a role in such a great family. Academically, I enjoy doing sciences research and discussing mathematical story with my friends. Outside of school, I like to play badminton, do running and hiking to motivate myself. Let's link up if we share some commons!",
    linkedin: "https://www.linkedin.com/in/yihang-wu-3420b539b/",
  },
  "chris-huang": {
    id: "chris-huang",
    name: "Chris Huang",
    role: "Community Associate",
    description:
      "Hello! My name is Chris Huang and I'm a third year studying computer science. This is my first time in AMACSS so I'm completely new here. I joined cause I wanted to get more in touch with the community and AMACSS seemed like a fun way to do so. I'm a big fan of music! I play the piano and listen to a lot of East Asian music and math rock. I also like playing games like Minecraft and Valorant (even tho i'm terrible...) and I've been learning how to speedrun Minecraft recently!",
    linkedin: "https://www.linkedin.com/in/chris-hx-huang",
    github: "https://github.com/VacuumBrain",
    photo: {
      src: "/static/images/team/chris-huang.jpg",
      alt: "Photo of Chris Huang",
      width: 1500,
      height: 2000,
    },
  },
  akash: {
    id: "akash",
    name: "Akash",
    role: "Course Representative",
    description:
      "My name is Akash Kalaranjan, and I am a fourth-year Mathematics Specialist student in the Statistics stream at UTSC. As a second-year AMACSS Course Representative, I want to help peers strengthen their understanding of course material by sharing resources and supporting their academic success. Last year, I represented MATB24 (Linear Algebra II). Outside of academics, I enjoy playing and watching basketball and going on nature walks.",
    linkedin: "https://www.linkedin.com/in/akash-kalaranjan-9aa895255/",
    github: "https://github.com/Akash-kalaranjan",
    photo: {
      src: "/static/images/team/akash.jpg",
      alt: "Photo of Akash",
      width: 1600,
      height: 1200,
    },
  },
  "lucia-giovani": {
    id: "lucia-giovani",
    name: "Lucia Giovani",
    role: "Outreach Associate",
    description:
      "Hey everyone! I’m Lucia. I joined AMACSS to meet new people and expand my network! I’m new to AMACSS, and in my free time, I enjoy playing the violin and listening to music. Excited to meet everyone and make new memories!",
    linkedin: "https://www.linkedin.com/in/lucia-giovani-5874a2334",
    github: "https://github.com/lucivani",
    photo: {
      src: "/static/images/team/lucia-giovani.jpg",
      alt: "Photo of Lucia Giovani",
      width: 1045,
      height: 1567,
    },
  },
  "ayse-nazli-onder": {
    id: "ayse-nazli-onder",
    name: "Ayse Nazli Onder",
    role: "Outreach Associate",
    description:
      "I’m Nazli, a Computer Science student at UTSC and an Outreach Associate at AMACSS. This is my first time in AMACSS, and I joined to meet more people.\n\nI’ve done karate for over 11 years and hold a black belt. Fun fact: I also play the violin. My favorite food is lasagne, and my comfort food is a Chick-fil-A spicy deluxe sandwich.",
    photo: {
      src: "/static/images/team/ayse-nazli-onder.jpg",
      alt: "Photo of Ayse Nazli Onder",
      width: 1500,
      height: 2000,
    },
  },
  "carey-hong": {
    id: "carey-hong",
    name: "Carey Hong",
    role: "Outreach Director",
    description:
      "I’m Carey, a second‑year Statistics & Quantitative Finance student serve as the Director of Outreach in AMACSS. I look forward to growing our community connections through outreach work. I enjoy badminton and piano in my spare time. Fun fact: I own a lovely 12‑year‑old cat.",
    linkedin: "https://www.linkedin.com/in/carey-hong922",
    github: "https://github.com/Carey922",
    photo: {
      src: "/static/images/team/carey-hong.jpg",
      alt: "Photo of Carey Hong",
      width: 1500,
      height: 2000,
    },
  },
  "mehreen-akter": {
    id: "mehreen-akter",
    name: "Mehreen Akter",
    role: "First Year Associate",
    description:
      "Hey everyone, I’m Mehreen, a first-year student in the double degree program! I joined AMACSS because being in my high school computer science club was one of my favourite parts of high school, where I made awesome friends and picked up so many cool things. I really wanted to build that same kind of vibrant community here at university on a larger scale and help make it super welcoming to everyone. I love reading a good book or catching up on movies, and I'm super excited to be a part of the team!",
    linkedin: "https://www.linkedin.com/in/mehreen-akter/",
    github: "https://github.com/mamehreen23",
    photo: {
      src: "/static/images/team/mehreen-akter.jpg",
      alt: "Photo of Mehreen Akter",
      width: 1000,
      height: 1218,
    },
  },
  "soham-chhabra": {
    id: "soham-chhabra",
    name: "Soham Chhabra",
    role: "First Year Coordinator",
    description:
      "Hey there! I’m Soham, a first-year Computer Science Co-op student and one of AMACSS’s First-Year Coordinators!\nI joined AMACSS because I’m genuinely excited about connecting with like-minded people across the CMS community and bringing together students who share an interest in using technology to solve meaningful problems. This is my first year being involved with AMACSS, and I’m looking forward to making the first-year experience a little more connected, collaborative, and fun!\nOutside academics, I’m usually exploring entrepreneurship, building things, experimenting with new ideas, or finding ways to bring technology and sustainability together. And of course, I’m always up for a late-night conversation over chai!\nSo, whether you have a big idea, a random question, a plant cutting to share, or simply want to chat, come say hi!",
    linkedin: "https://www.linkedin.com/in/soham-chhabra-746577279/",
    photo: {
      src: "/static/images/team/soham-chhabra.jpg",
      alt: "Photo of Soham Chhabra",
      width: 390,
      height: 510,
    },
  },
  "baneet-sarna": {
    id: "baneet-sarna",
    name: "Baneet Sarna",
    role: "First Year Coordinator",
    description:
      "Hello, I’m Baneet! I’m joining AMACSS as a First-year Coordinator to get involved with and expand our CMS community here at UTSC. Outside of class, I spend most of my time working on side projects, playing cards, and following sports (mostly basketball and cricket). A fun fact about me is that I can make a delicious plate of Chicken Alfredo Pasta.",
    github: "https://github.com/bssrna",
    photo: {
      src: "/static/images/team/baneet-sarna.jpg",
      alt: "Photo of Baneet Sarna",
      width: 1600,
      height: 1692,
    },
  },
  "bilal-akram-virk": {
    id: "bilal-akram-virk",
    name: "Bilal Akram Virk",
    role: "First Year Associate",
    description:
      "Hey, I’m Bilal Virk! \nI’m a first-year Math student at UTSC (co-op), planning to double major in Math and CS. I’m stoked to be one of AMACSS’s First Year Associates this year! I joined because AMACSS is basically the heart of the math and CS community here, and I wanted to help build that space for other first-years while meeting people who get just as excited as I do. Back home in Lahore I was Head Boy and Student Council President, and before that I ran the Robotics Society, so organizing events is very much my thing.\n\nOutside of class, you’ll catch me playing football or basketball. I’m also a big Formula 1 fan,  Dostoyevsky reader, and a sucker for crime and mystery movies. Long term, I’m into quant, research and machine learning.\n\nFun fact: I won bronze at the International Earth Science Olympiad, so yes, I can tell you way too much about rocks. 🪨",
    linkedin: "https://www.linkedin.com/in/bilalvirk-uoft",
    photo: {
      src: "/static/images/team/bilal-akram-virk.jpg",
      alt: "Photo of Bilal Akram Virk",
      width: 1500,
      height: 2000,
    },
  },
  "alankrit-verma": {
    id: "alankrit-verma",
    name: "Alankrit Verma",
    role: "Advisor / Former President",
    description:
      "Hey! I’m Alankrit, but you can call me Alan! I’m specializing in Computer Science and Entrepreneurship, and this is my fifth year with AMACSS. I started as First Year Coordinator, then served as VP Operations, Co-President, and Advisor. I joined to meet people and get involved in campus life, and the community has kept me coming back! Outside of school, I love playing chess and badminton, following F1, and building tech. Fun fact: GenAI Genesis, the AI hackathon I founded, started within AMACSS as AI Olympics! AMACSS is close to my heart, and I’m always happy to connect, share ideas, or help out :)",
    linkedin: "https://www.linkedin.com/in/alankritverma/",
    github: "https://github.com/AlankritVerma01",
    webpage: "https://alankrit.me/",
    photo: {
      src: "/static/images/team/alankrit-verma.jpg",
      alt: "Photo of Alankrit Verma",
      width: 886,
      height: 886,
    },
  },
  "jaia-kellett": {
    id: "jaia-kellett",
    name: "Jaia Kellett",
    role: "First Year Associate",
    description:
      "My name is Jaia, my program is math, and I am so excited to be joining the AMACSS team to be with people who are passionate about making CMS more accessible and an open helpful community. I have lived in seven countries, and I love hanging out with my friends.",
    linkedin: "https://www.linkedin.com/in/jaia-kellett-6b8765436/",
    photo: {
      src: "/static/images/team/jaia-kellett.jpg",
      alt: "Photo of Jaia Kellett",
      width: 513,
      height: 615,
    },
  },
  "ruwayfi-masum": {
    id: "ruwayfi-masum",
    name: "Ruwayfi Masum",
    role: "First Year Associate",
    description:
      "Hi, I'm Ruwayfi :) I joined AMACSS because I think it'll be really cool to work people who love CMS but also love helping people. Some other things I think are cool are badminton, hiking, and playing guitar.",
    linkedin: "https://linkedin.com/in/ruwayfi/",
    photo: {
      src: "/static/images/team/ruwayfi-masum.jpg",
      alt: "Photo of Ruwayfi Masum",
      width: 810,
      height: 810,
    },
  },
  "hamza-syed-shah": {
    id: "hamza-syed-shah",
    name: "Hamza Syed Shah",
    role: "Special Events Associate",
    description:
      "Hey everyone! My name is Hamza Syed, and I’m a first-year student at UTSC in the Management & Finance and Statistics – Quantitative Finance double degree program. I joined AMACSS as a First Year Associate of Special Events because I wanted to get more involved on campus, meet new people, and be part of a cool community.\n\nOutside of school, I enjoy hanging out with friends, trying different food spots, and probably spending more time scrolling on my phone than I should. My favourite food is definitely chicken and shrimp chow mein.",
    linkedin: "https://www.linkedin.com/in/hamzasyedshah",
    photo: {
      src: "/static/images/team/hamza-syed-shah.jpg",
      alt: "Photo of Hamza Syed Shah",
      width: 1600,
      height: 1940,
    },
  },
  "subhan-khan": {
    id: "subhan-khan",
    name: "Subhan Khan",
    role: "Marketing Associate",
    description:
      "Hi everyone! My name is Subhan Khan, and I am a first-year Computer Science student here at UTSC.\n\nI decided to jump into AMACSS because I wanted to connect with a passionate community of peers, dive right into campus tech culture, and help make the student experience a little better for everyone around me.\n\nWhen I am not drowning in classes or coding up projects, you can usually find me hanging out with friends and family, watching anime, playing basketball, reading comics, catching up on much-needed sleep, or scrolling through social media way more than I should admit. I am also heavily into sci-fi, especially anything Marvel and Star Wars, along with cars and checking out emerging tech. A fun fact about myself? I am secretly pretty dangerous at Mortal Kombat and mobile first-person shooters.\n\nI am super stoked to be on the team this year and cannot wait to meet you all!",
    linkedin:
      "https://www.linkedin.com/in/subhan-khan-6217bb357?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    github: "https://github.com/subhanskkhan01-commits",
    photo: {
      src: "/static/images/team/subhan-khan.jpg",
      alt: "Photo of Subhan Khan",
      width: 538,
      height: 538,
    },
  },
  jay: {
    id: "jay",
    name: "Jay",
    role: "Special Events Associate",
    description:
      "Hey everyone! I'm Jay! I'm super excited to be part of AMACSS this year and to meet some amazing people along the way! I joined because I wanted to get more involved in the UTSC community, make new friends, and hopefully make university life a little more fun for everyone. I love exploring new things, traveling, and spending time with friends. Looking forward to meeting you all and making some great memories together!",
    photo: {
      src: "/static/images/team/jay.jpg",
      alt: "Photo of Jay",
      width: 768,
      height: 672,
    },
  },
  "dakshita-sharma": {
    id: "dakshita-sharma",
    name: "Dakshita Sharma",
    role: "Special Events Associate",
    description:
      "Hey everyone! I'm Dakshita and I'm a first year CS student here at UTSC. I joined AMACCS to meet like-minded people, explore my interests in tech, organizing events and hopefully make some amazing memories along the way! Outside of academics, I love baking, listening to music and trying out new things. I'm always down for a good conversation, spontaneous adventure or anything involving something crafty. Fun fact: I once gave a TEDx talk! My current personality is probably 50% caffeine and 50% curiosity. Looking forward to meeting everyone:)",
    linkedin: "https://www.linkedin.com/in/dakshita-sharma-190932291",
    webpage: "https://dakshitasharma.netlify.app/",
    photo: {
      src: "/static/images/team/dakshita-sharma.jpg",
      alt: "Photo of Dakshita Sharma",
      width: 1049,
      height: 1600,
    },
  },
  "faiza-khan": {
    id: "faiza-khan",
    name: "Faiza Khan",
    role: "Special Events Director",
    description:
      "Hi everyone, I’m Faiza! I’m a third-year Statistics Specialist i nData Science and Machine Learning at utsc. I joined AMACSS because I wanted to be part of a community that brings math stats and cs students together and to help plan events like the 2027 Gala. Outside of class, I’m into product analytics, data visualization, and UI/UX design, and I love building things on the web.",
    linkedin: "https://www.linkedin.com/in/faiza-khanc",
    github: "https://github.com/faizackhan",
    webpage: "https://faizackhan.github.io/",
    photo: {
      src: "/static/images/team/faiza-khan.jpg",
      alt: "Photo of Faiza Khan",
      width: 1600,
      height: 1600,
    },
  },
  "kingsley-chan": {
    id: "kingsley-chan",
    name: "Kingsley Chan",
    role: "Course Representative",
    description:
      "Hi y’all! My name is Kingsley, I’m a third-year statistics specialist and creative writing minor. This is my first year in AMACSS, and I joined to get more involved in the CMS community and share my love of teaching and learning via hosting review seminars.\n\nAcademically, I have way too many interests, but some of them include machine learning applications, variational inference, Bayesian theory, and mathematical statistics. \n\nOutside of school, I love reading stats/ML research papers and trying to apply their models (with varying degrees of success), reading and writing high fantasy, running, and occasionally baking.\n\nMy favourite food is dumplings :>",
    linkedin: "https://www.linkedin.com/in/kingsley-chan-a2153325a/",
    github: "https://github.com/chankingsleykt/",
    photo: {
      src: "/static/images/team/kingsley-chan.jpg",
      alt: "Photo of Kingsley Chan",
      width: 574,
      height: 374,
    },
  },
  "angeleena-justine": {
    id: "angeleena-justine",
    name: "Angeleena Justine",
    role: "Outreach Associate",
    description:
      "Hi my name is Angeleena Justine and I am a first year in the double degree program! I joined AMACSS to get closer with the CMS community and to help create an inclusive environment. In my free time, I love watching different shows and listening to all kinds of music! I'm also trying to get back into chess. Other than that, I'm super excited to make new friends during my time at UofT :)",
    linkedin: "https://www.linkedin.com/in/angeleenajustine",
    github: "https://www.github.com/angeleenajustine",
    photo: {
      src: "/static/images/team/angeleena-justine.jpg",
      alt: "Photo of Angeleena Justine",
      width: 1084,
      height: 1084,
    },
  },
  "brasen-li": {
    id: "brasen-li",
    name: "Brasen Li",
    role: "STAB52 and STAB57 Course Representative",
    description:
      "Hi, I'm Brasen, a course rep for STAB52 and STAB57 at AMACSS. One day I decided I wanted to stop playing video games all day. I failed. But while I'm here, I do want to help students get through the same things I had to go through. If you ever want to play smash bros, I'll be here.",
    linkedin: "https://www.linkedin.com/in/brasen-qianli-li-6a34342a1/",
    github: "https://github.com/Brasenbrasen",
    photo: {
      src: "/static/images/team/brasen-li.jpg",
      alt: "Photo of Brasen Li",
      width: 1254,
      height: 1254,
    },
  },
  "joshua-crisologo": {
    id: "joshua-crisologo",
    name: "Joshua Crisologo",
    role: "CSCB36 Course Representative",
    description:
      "hi, i'm Josh and i'm a course rep for CSCB36. i thought it would be great to join AMACSS to host a review seminar for the course to add on to being a TA for it this sem! it's my third year in AMACSS and before i was a first year rep and a director of tech. my favourite food is sushi and my hobbies and interests include concerts, badminton and pokemon! a fun fact is the favourite concert i've been to was YOASOBI's!",
    linkedin: "https://www.linkedin.com/in/joshua-crisologo",
    github: "https://github.com/joshuacris",
    webpage: "https://www.joshuacrisologo.com/",
    photo: {
      src: "/static/images/team/joshua-crisologo.jpg",
      alt: "Photo of Joshua Crisologo",
      width: 1331,
      height: 2000,
    },
  },
  "muslima-ganieva": {
    id: "muslima-ganieva",
    name: "Muslima Ganieva",
    role: "Campus Life Associate",
    description:
      "Hello! I'm Muslima, I'm a second year Computer Science student specializing in Software Engineering. I joined AMACSS this year for the first time as a way of giving back to the community. During my first year, AMACSS was one of my biggest supports; I was able to connect with the CMS community, make new friends, and attend some of the most helpful review seminars. Some of the things I enjoy include travelling, playing volleyball, watching movies, baking, cooking, and bothering my cat. Fun fact, I am a coffee addict :D. I am very excited to be apart of AMACSS this year!",
    linkedin: "https://www.linkedin.com/in/muslima-ganieva-7176a43a2/",
    photo: {
      src: "/static/images/team/muslima-ganieva.jpg",
      alt: "Photo of Muslima Ganieva",
      width: 1500,
      height: 2000,
    },
  },
  "kaiser-de-morgan": {
    id: "kaiser-de-morgan",
    name: "Kaiser De Morgan",
    role: "Course Representative",
    description: "Hi",
    linkedin: "https://www.linkedin.com/in/kaiserdemorgan/",
    github: "https://github.com/KaiserDeMorgan",
    photo: {
      src: "/static/images/team/kaiser-de-morgan.jpg",
      alt: "Photo of Kaiser De Morgan",
      width: 828,
      height: 886,
    },
  },
  "aaron-wang": {
    id: "aaron-wang",
    name: "Aaron Wang",
    role: "MATA31 Course Representative",
    description:
      "Hi, I'm Aaron and I'm a course rep for MATA31 this year. I vibe heavy in classes, crack terrible jokes, and work on questionable personal projects. In spare time, I dream of sleeping, waking up, and sleeping some more.",
    linkedin: "https://www.linkedin.com/in/aaron-wang-046529318/",
    github: "https://github.com/Aaron-Wang4932",
    webpage: "https://aaron-wang4932.github.io/",
    photo: {
      src: "/static/images/team/aaron-wang.jpg",
      alt: "Photo of Aaron Wang",
      width: 1600,
      height: 1600,
    },
  },
  "omar-ayyad": {
    id: "omar-ayyad",
    name: "Omar Ayyad",
    role: "Course Representative",
    description:
      "Hey everyone! My name is Omar Ayyad, and I'm studying Statistics (Machine Learning & Data Science) and Computer Science at UTSC! I joined AMACSS because I love helping others understand challenging concepts and want to make math and statistics feel a little less intimidating. Outside of academics, I'm passionate about soccer, boxing, coding, and anything related to AI and technology. A fun fact about me is that I used to captain a soccer team in Jordan, and we won the national league! I'm excited to be part of AMACSS and look forward to meeting everyone!",
    linkedin: "https://www.linkedin.com/in/ayyadomar/",
    github: "https://github.com/AyyadOmar",
    photo: {
      src: "/static/images/team/omar-ayyad.jpg",
      alt: "Photo of Omar Ayyad",
      width: 1536,
      height: 1024,
    },
  },
  "taehyun-im": {
    id: "taehyun-im",
    name: "Taehyun Im",
    role: "Course Representative",
    description:
      "Hi, I'm Taehyun, or Tei! I'm a second-year CS Specialist student and your CSCA08 course rep. I joined AMACSS because I love helping people, and I want to help you get past the parts of CS that feel confusing at first. This is my first year with AMACSS, and I'm also a TA for CSCA08 this term! Outside of school, I like building personal projects and playing games. Come say hi at a review seminar!",
    linkedin: "https://www.linkedin.com/in/taehyunim",
    github: "https://github.com/taehyunnnnn",
    webpage: "https://taehyun.im",
    photo: {
      src: "/static/images/team/taehyun-im.jpg",
      alt: "Photo of Taehyun Im",
      width: 1086,
      height: 1448,
    },
  },
  "mary-zhang": {
    id: "mary-zhang",
    name: "Mary Zhang",
    role: "Course Representative",
    description:
      "Hi, I’m Mary. I’m a second-year student at UTSC, in the Math Comprehensive Stream and majoring in Statistics. This is my first time joining AMACSS. I joined AMACSS to give back to the community and take part in more campus activities. In my free time, I love playing piano and guitar. A fun fact about me is that I speak multiple languages.",
    linkedin: "https://linkedin.com/in/mary-zhang-0290a5395",
    photo: {
      src: "/static/images/team/mary-zhang.jpg",
      alt: "Photo of Mary Zhang",
      width: 884,
      height: 1268,
    },
  },
  "sufia-chowdhury": {
    id: "sufia-chowdhury",
    name: "Sufia Chowdhury",
    role: "Special Events Associate",
    description:
      "Hey! I'm Sufia Chowdhury, a first-year Computer Science Co-op student. \n\nI joined AMACSS to get more involved in the CS community and meet cool people who love building things as much as I do. \n\nWhen I'm not coding or stressing over problem sets, I'm probably playing visual novels like ZENO: Remake or spending way too much time on Honkai: Star Rail (I am Sunday's #1 defender, no questions asked). Always down to talk tech, games, or grab a good coffee!",
    linkedin: "https://www.linkedin.com/in/sufia-chowdhury-5bb8b5363/",
    github: "https://github.com/Sufia3108",
    photo: {
      src: "/static/images/team/sufia-chowdhury.jpg",
      alt: "Photo of Sufia Chowdhury",
      width: 294,
      height: 368,
    },
  },
  "muntaha-chowdhury": {
    id: "muntaha-chowdhury",
    name: "Muntaha Chowdhury",
    role: "Course Representative",
    description:
      'Hello, I am Muntaha! I am a 2nd year student in Computer Science, and this is my first time in AMACSS. I joined AMACSS because I wanted to flip the roles this time and be the one giving to the community. I like figuring out "how things work", so you might find me designing solutions to the most random pet peeves. Do I ever end up building them fully is a question we can get back to later. Excited to see how this term goes!',
    linkedin: "https://www.linkedin.com/in/muntaha-chowdhury/",
    github: "https://github.com/MuntahaChowdhury",
    photo: {
      src: "/static/images/team/muntaha-chowdhury.jpg",
      alt: "Photo of Muntaha Chowdhury",
      width: 200,
      height: 200,
    },
  },
  "faiza-ushna": {
    id: "faiza-ushna",
    name: "Faiza Ushna",
    role: "Director of Social Media",
    description:
      "Hello, I'm Faiza! I've joined AMACSS for the first time this year to help bring more visibility to the amazing events AMACSS hosts for the community. Participating in AMACSS events during my first year was essential to finding a community within the university and I am so excited to be a part of the team who had such a big impact on my university life! Outside of university, my hobbies include reading, watching tv shows, and bracelet making. \n\nFun Fact: I can understand 4 languages",
    linkedin: "https://www.linkedin.com/in/faiza-ushna/",
    photo: {
      src: "/static/images/team/faiza-ushna.jpg",
      alt: "Photo of Faiza Ushna",
      width: 576,
      height: 757,
    },
  },
  kian: {
    id: "kian",
    name: "Kian",
    role: "Course Representative",
    description:
      "I joined AMACSS because I wanted to help the community and make a difference for someone in anyway whether make them laugh or help with a course. I love to yap and chill and I always enjoy meeting new people especially if there’s pizza!",
    linkedin: "https://www.linkedin.com/in/kian-davoudi/",
    github: "https://github.com/kian-git07",
    photo: {
      src: "/static/images/team/kian.jpg",
      alt: "Photo of Kian",
      width: 1500,
      height: 2000,
    },
  },
  "shivani-viswanathan": {
    id: "shivani-viswanathan",
    name: "Shivani Viswanathan",
    role: "First Year Associate",
    description:
      "Hey, I’m Shivani! I’m a first-year Statistics student at UTSC and a First-Year Associate at AMACSS. I joined AMACSS because I love meeting new people and wanted to get more involved in the CMS community. When I’m not studying in one of the IA help rooms (probably with a chocolate chip cookie), I enjoy reading and baking, although university hasn't left much time for the latter. I’m always up for a good conversation, whether it's about something interesting or something completely random, and I’m looking forward to getting to know more people through AMACSS!",
    linkedin: "https://www.linkedin.com/in/shivani-viswanathan-4a3649392/",
    photo: {
      src: "/static/images/team/shivani-viswanathan.jpg",
      alt: "Photo of Shivani Viswanathan",
      width: 923,
      height: 2000,
    },
  },
} satisfies Record<string, TeamMember>

export const team: Team = {
  id: "4",
  name: "AMACSS",
  year: "2026",
  departments: [
    {
      id: "37",
      name: "Executive",
      priorityMembers: [members["ibrahim-kasim-172"]],
      members: [],
    },
    {
      id: "38",
      name: "Senior Vice-President",
      priorityMembers: [],
      members: [
        members["aseel-magzoub-145"],
        members["ivan-semenov-146"],
        members["victoria-djedjeian-159"],
      ],
    },
    {
      id: "25",
      name: "Engagement",
      priorityMembers: [members["daniel-joseph-161"]],
      members: [members["aisha-shaikh-162"], members["chris-huang"]],
    },

    {
      id: "27",
      name: "Volunteer",
      priorityMembers: [],
      members: [],
    },
    {
      id: "28",
      name: "Technology",
      priorityMembers: [members["zayaan-bhanwadia-140"]],
      members: [
        members["jolie-zhu-153"],
        members["yathurshan-manoharan-155"],
        members["param-patel-149"],
        members["sajan-pirithiviraj-164"],
      ],
    },
    {
      id: "29",
      name: "Operations",
      priorityMembers: [],
      members: [],
    },
    {
      id: "30",
      name: "Campus Life",
      priorityMembers: [members["raya-pourtehrani-151"], members["ferissa-dinata"]],
      members: [
        members["jeel-patel-154"],
        members["shaghana-thangarajah-152"],
        members["tonirika-das-150"],
        members["kavya-patel-165"],
        members["muslima-ganieva"],
      ],
    },
    {
      id: "31",
      name: "Special Events",
      priorityMembers: [
        members["tahmeed-rahman-141"],
        members["khin-lay-kywe-169"],
      ],
      members: [
        members["alireza-pourreza-163"],
        members["sajan-pirithiviraj-164"],
        members["hamza-syed-shah"],
        members["jay"],
        members["dakshita-sharma"],
        members["faiza-khan"],
        members["sufia-chowdhury"],
      ],
    },
    {
      id: "32",
      name: "Marketing",
      priorityMembers: [members["rachel-tam-171"]],
      members: [members["subhan-khan"], members["faiza-ushna"]],
    },
    {
      id: "33",
      name: "Finance",
      priorityMembers: [members["sanny-hu-143"]],
      members: [members["anson-148"], members["siron-lee-zhao-147"]],
    },
    {
      id: "34",
      name: "Outreach",
      priorityMembers: [members["andrew-li-173"]],
      members: [
        members["lucia-giovani"],
        members["ayse-nazli-onder"],
        members["carey-hong"],
        members["angeleena-justine"],
      ],
    },
    {
      id: "35",
      name: "Academics",
      priorityMembers: [members["jino-lee-144"]],
      members: [
        members["kylie-lee-160"],
        members["param-khurana-170"],
        members["samiha-hasan-166"],
        members["summer-stormes-168"],
        members["yihang-wu-167"],
      ],
    },
    {
      id: "26",
      name: "Review Seminar",
      priorityMembers: [members["aaron-sunarto-139"]],
      members: [
        members["avery-nie-156"],
        members["jaagrit-gaur-157"],
        members["ness-schattman-158"],
        members["akash"],
        members["kingsley-chan"],
        members["brasen-li"],
        members["joshua-crisologo"],
        members["kaiser-de-morgan"],
        members["aaron-wang"],
        members["omar-ayyad"],
        members["taehyun-im"],
        members["mary-zhang"],
        members["muntaha-chowdhury"],
        members["kian"],
      ],
    },
    {
      id: "36",
      name: "First Year",
      priorityMembers: [members["soham-chhabra"], members["baneet-sarna"]],
      members: [
        members["mehreen-akter"],
        members["bilal-akram-virk"],
        members["jaia-kellett"],
        members["ruwayfi-masum"],
        members["shivani-viswanathan"],
      ],
    },
    {
      id: "advisors",
      name: "Advisors",
      priorityMembers: [],
      members: [members["alankrit-verma"]],
    },
  ],
}
