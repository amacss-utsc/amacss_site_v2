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
  "abdullah-khalid-138": {
    id: "138",
    name: "Abdullah Khalid",
    role: "Vice-President Engagement",
    photo: {
      src: "/static/images/team/abdullah-khalid-138.jpeg",
      alt: "Photo of Abdullah Khalid",
      width: 878,
      height: 1560,
    },
    description:
      "Hi! I’m Abdullah! I joined AMACSS to meet more people, get involved on campus, and contribute to making UTSC life a little more fun and a little less “I have three deadlines at 11:59.” I’m into computer science, AI, cars, and the gym. My favourite food is pasta, and I firmly believe there is no situation that can’t be improved by a good plate of it.",
    linkedin: "https://linkedin.com/in/abdullah-khalid-bashir/",
    github: "https://github.com/AbdullahK1973",
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
  "lisa-142": {
    id: "142",
    name: "Lisa",
    role: "Vice-President Campus Life",
    photo: {
      src: "/static/images/team/lisa-142.jpeg",
      alt: "Photo of Lisa",
      width: 3088,
      height: 2316,
    },
    description:
      "Hello! My name is Lisa and I am a third year maths student at UTSC. Some things I enjoy are gaming, hiking, scrapbooking, and I am a huge cat person. I hope to meet many new people in the CMS community at AMACSS and connect like minded students as VP of campus life!",
    linkedin: "https://www.linkedin.com/in/bilinwang?trk=contact-info",
    github: "https://github.com/BiLinW",
    webpage: "https://www.linkedin.com/in/bilinwang?trk=contact-info",
  },
  "daniel-joseph-161": {
    id: "161",
    name: "Daniel Joseph",
    role: "Community Director",
    photo: {
      src: "/static/images/team/daniel-joseph-161.jpg",
      alt: "Photo of Daniel Joseph",
      width: 2000,
      height: 1171,
    },
    description:
      "Hi everyone! My name's Daniel and I'm a third year Computer Science student at UTSC. I'm extremely excited to join AMACSS this year as the Director of Community. \n\nI decided to join AMACSS because CMS programs can feel academically demanding, making it easy for students to feel disconnected from the community. I wanted to take on an active role in bridging the gap between academics and community by creating welcoming and engaging spaces where students can connect, relax, and support one another.\n\nOutside of my studies, you can usually find me gaming, watching TV shows, sketching, playing basketball, or trying out new sports. A fun fact about me is that I know three different card tricks! My favourite drink (also the best drink ever made) is the Tim Hortons Peach Sparkling Quencher. If you ever see me around campus, feel free to say hi!",
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
    role: "Campus Life Director",
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
      priorityMembers: [
        members["victoria-djedjeian-159"],
        members["abdullah-khalid-138"],
      ],
      members: [members["aisha-shaikh-162"]],
    },
    {
      id: "26",
      name: "Review Seminar",
      priorityMembers: [members["aaron-sunarto-139"]],
      members: [
        members["avery-nie-156"],
        members["jaagrit-gaur-157"],
        members["ness-schattman-158"],
      ],
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
      priorityMembers: [members["ivan-semenov-146"]],
      members: [],
    },
    {
      id: "30",
      name: "Campus Life",
      priorityMembers: [members["lisa-142"]],
      members: [
        members["daniel-joseph-161"],
        members["jeel-patel-154"],
        members["raya-pourtehrani-151"],
        members["shaghana-thangarajah-152"],
        members["tonirika-das-150"],
        members["kavya-patel-165"],
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
      ],
    },
    {
      id: "32",
      name: "Marketing",
      priorityMembers: [
        members["victoria-djedjeian-159"],
        members["rachel-tam-171"],
      ],
      members: [],
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
      priorityMembers: [
        members["victoria-djedjeian-159"],
        members["andrew-li-173"],
      ],
      members: [],
    },
    {
      id: "35",
      name: "Academics",
      priorityMembers: [members["aseel-magzoub-145"], members["jino-lee-144"]],
      members: [
        members["kylie-lee-160"],
        members["param-khurana-170"],
        members["samiha-hasan-166"],
        members["summer-stormes-168"],
        members["yihang-wu-167"],
      ],
    },
    {
      id: "36",
      name: "First Year",
      priorityMembers: [],
      members: [],
    },
  ],
}
