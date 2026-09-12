import { CourseSchedule, VisualTask, PortfolioItem, StudySession, UserSettings, UserProfile, CourseRPS } from '../types';

export const INITIAL_COURSES: CourseSchedule[] = [
  {
    id: 'course-1',
    courseCode: 'DKV301',
    courseName: 'Desain Komunikasi Visual Terpadu',
    lecturer: 'Baskara Adhitama, M.Sn.',
    day: 'Senin',
    startTime: '08:00',
    endTime: '11:45',
    room: 'Studio DKV 3 - Gedung B Lt. 2',
    studioType: 'Studio Desain',
    sks: 4,
    color: '#6366F1', // Indigo
    notes: 'Bawa draft moodboard kampanye sosial dan sketchbook A3.',
  },
  {
    id: 'course-2',
    courseCode: 'DKV204',
    courseName: 'Tipografi Eksperimental & Publikasi',
    lecturer: 'Dian Paramita, M.Ds.',
    day: 'Senin',
    startTime: '13:00',
    endTime: '15:30',
    room: 'Lab Grafis & Cetak',
    studioType: 'Lab Grafis & Cetak',
    sks: 3,
    color: '#EC4899', // Pink
    notes: 'Eksplorasi letterform nusantara berbasis riset budaya lokal.',
  },
  {
    id: 'course-3',
    courseCode: 'DKV312',
    courseName: 'UI/UX Design & Interaksi Digital',
    lecturer: 'Reza Pratama, S.Sn., M.Sc.',
    day: 'Selasa',
    startTime: '09:00',
    endTime: '12:15',
    room: 'Lab Komputer Macintosh 1',
    studioType: 'Lab Multimedia',
    sks: 4,
    color: '#06B6D4', // Cyan
    notes: 'Evaluasi wireframe high-fidelity di Figma & user testing.',
  },
  {
    id: 'course-4',
    courseCode: 'DKV218',
    courseName: 'Ilustrasi Digital & Concept Art',
    lecturer: 'Arya Nugroho, M.Sn.',
    day: 'Rabu',
    startTime: '10:00',
    endTime: '12:30',
    room: 'Studio Animasi & Cintiq',
    studioType: 'Lab Multimedia',
    sks: 3,
    color: '#10B981', // Emerald
    notes: 'Studi pencahayaan dramatis dan color script untuk narasi visual.',
  },
  {
    id: 'course-5',
    courseCode: 'DKV330',
    courseName: 'Animasi 2D & Motion Graphics',
    lecturer: 'Galih Wicaksana, M.Ds.',
    day: 'Kamis',
    startTime: '13:00',
    endTime: '16:30',
    room: 'Lab Render & Audio Video',
    studioType: 'Lab Multimedia',
    sks: 4,
    color: '#F59E0B', // Amber
    notes: 'Penerapan 12 prinsip animasi dalam bumper title video kreatif.',
  },
  {
    id: 'course-6',
    courseCode: 'DKV105',
    courseName: 'Nirmana Tiga Dimensi & Konstruksi',
    lecturer: 'Prof. Maya Lestari, M.Sn.',
    day: 'Jumat',
    startTime: '08:30',
    endTime: '11:00',
    room: 'Bengkel Kriya & Konstruksi Bahan',
    studioType: 'Bengkel & Modelling',
    sks: 3,
    color: '#8B5CF6', // Violet
    notes: 'Kompilasi mock-up skala 1:1 bahan akrilik & kayu balsa.',
  },
];

export const INITIAL_TASKS: VisualTask[] = [
  {
    id: 'task-1',
    title: 'Brand Identity & Packaging Jamu Modern "Soma"',
    courseId: 'course-1',
    courseName: 'Desain Komunikasi Visual Terpadu',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    stage: 'Rendering & Finalisasi',
    priority: 'Urgent!',
    deliverableType: 'Kemasan / Packaging',
    description: 'Redesain kemasan minuman herbal tradisional dengan sentuhan minimalis modern, logogram botani, dan die-cut ramah lingkungan.',
    moodboardImages: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    ],
    colorPalette: ['#1C2826', '#E2D4B7', '#A3B18A', '#E07A5F'],
    isCompleted: false,
    addToPortfolio: true,
  },
  {
    id: 'task-2',
    title: 'Editorial Poster Font Eksperimental "Aksara Kawi"',
    courseId: 'course-2',
    courseName: 'Tipografi Eksperimental & Publikasi',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    stage: 'Digital Asset & Wireframe',
    priority: 'Tinggi',
    deliverableType: 'Tipografi & Editorial',
    description: 'Eksplorasi tipografi display berakar dari prasasti kuno yang distilasi ke bentuk geometris brutalist kontemporer.',
    moodboardImages: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80',
    ],
    colorPalette: ['#0A0A0A', '#E63946', '#F1FAEE', '#457B9D'],
    isCompleted: false,
    addToPortfolio: true,
  },
  {
    id: 'task-3',
    title: 'Mobile App UX/UI "ArtisanMarket" - Local Crafts',
    courseId: 'course-3',
    courseName: 'UI/UX Design & Interaksi Digital',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    stage: 'Sketsa & Moodboard',
    priority: 'Sedang',
    deliverableType: 'UI/UX & Prototype',
    description: 'Rancangan aplikasi kurasi kriya lokal dengan sistem checkout ramah pengrajin dan visual storytelling interaktif.',
    moodboardImages: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
    ],
    colorPalette: ['#1F2937', '#6366F1', '#A5B4FC', '#F3F4F6'],
    isCompleted: false,
    addToPortfolio: false,
  },
  {
    id: 'task-4',
    title: 'Keyframe Concept Art "Metropolis Nusantara 2090"',
    courseId: 'course-4',
    courseName: 'Ilustrasi Digital & Concept Art',
    deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    stage: 'Brainstorm & Konsep',
    priority: 'Sedang',
    deliverableType: 'Ilustrasi & Karakter',
    description: 'Visualisasi kota masa depan bercorak arsitektur vernakular Nusantara dengan elemen cyberpunk dan kendaraan terbang otonom.',
    moodboardImages: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    ],
    colorPalette: ['#181926', '#FF007F', '#00F0FF', '#7928CA'],
    isCompleted: false,
    addToPortfolio: true,
  },
  {
    id: 'task-5',
    title: 'Title Sequence Animation "Festival Sinema Pelajar"',
    courseId: 'course-5',
    courseName: 'Animasi 2D & Motion Graphics',
    deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    stage: 'Selesai',
    priority: 'Tinggi',
    deliverableType: 'Animasi & Motion',
    description: 'Animasi opening 15 detik menggunakan After Effects dengan teknik kinetic typography dan masking dinamis.',
    moodboardImages: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    ],
    colorPalette: ['#000000', '#F59E0B', '#3B82F6', '#FFFFFF'],
    isCompleted: true,
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    addToPortfolio: true,
    portfolioItemId: 'port-1',
  },
];

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-1',
    taskId: 'task-5',
    title: 'Kinetic Opening "Festival Sinema Pelajar 2026"',
    category: 'Animasi & Motion',
    courseOrClient: 'Tugas Studio Animasi 2D & BEM FSRD',
    description: 'Sekuens animasi pembuka berdurasi 15 detik dengan transisi geometric masking dan sinkronisasi ritme audio berenergi tinggi.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    softwareUsed: ['After Effects', 'Illustrator', 'Premiere Pro'],
    tags: ['Motion Graphics', 'Kinetic Type', 'Festival', 'Opening'],
    completionDate: '2026-09-08',
    featured: true,
    behanceUrl: 'https://behance.net/sample-dkv-portfolio',
  },
  {
    id: 'port-2',
    title: 'Identitas Visual & Signage "Galeri Ruang Cerita"',
    category: 'Branding & Identitas',
    courseOrClient: 'Studio Desain Komunikasi Visual II',
    description: 'Sistem identitas terintegrasi meliputi logo adaptif, kartu identitas bertekstur, petunjuk arah ruang pameran, dan panduan grafis (GSM).',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    softwareUsed: ['Illustrator', 'InDesign', 'Photoshop'],
    tags: ['Branding', 'Wayfinding', 'GSM', 'Visual Identity'],
    completionDate: '2026-08-25',
    featured: true,
  },
  {
    id: 'port-3',
    title: 'Koleksi Ilustrasi Flora Endemik Indonesia',
    category: 'Ilustrasi & Karakter',
    courseOrClient: 'Eksplorasi Personal & Pameran Angkatan',
    description: 'Seri 5 lembar ilustrasi botani digital bergaya litografi klasik dengan palet earthy dan detail arsiran halus.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    softwareUsed: ['Photoshop', 'Procreate', 'Wacom'],
    tags: ['Botanical Art', 'Digital Painting', 'Engraving Style'],
    completionDate: '2026-07-30',
    featured: false,
  },
];

export const INITIAL_SESSIONS: StudySession[] = [
  {
    id: 'sess-1',
    taskTitle: 'Brand Identity Jamu Modern "Soma"',
    courseName: 'Desain Komunikasi Visual Terpadu',
    durationMinutes: 50,
    mode: 'deep_studio',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    dateString: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Eksplorasi die-cut kemasan dan 3D render botol di Blender.',
  },
  {
    id: 'sess-2',
    taskTitle: 'Aksara Kawi Display Type',
    courseName: 'Tipografi Eksperimental',
    durationMinutes: 45,
    mode: 'pomodoro',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    dateString: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Vektorisasi glif A-Z dan kerning pasangan huruf.',
  },
  {
    id: 'sess-3',
    taskTitle: 'Wireframing ArtisanMarket',
    courseName: 'UI/UX Design',
    durationMinutes: 60,
    mode: 'stopwatch',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dateString: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Desain alur checkout dan wireflow komponen.',
  },
  {
    id: 'sess-4',
    taskTitle: 'Metropolis Nusantara 2090 Concept Art',
    courseName: 'Ilustrasi Digital',
    durationMinutes: 50,
    mode: 'deep_studio',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    dateString: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Lighting pass dan penambahan atmospheric haze.',
  },
  {
    id: 'sess-5',
    taskTitle: 'Brand Identity Jamu Modern "Soma"',
    courseName: 'Desain Komunikasi Visual Terpadu',
    durationMinutes: 25,
    mode: 'pomodoro',
    timestamp: new Date().toISOString(),
    dateString: new Date().toISOString().split('T')[0],
    notes: 'Final touch di mock-up karton box.',
  },
];

export const INITIAL_SETTINGS: UserSettings = {
  darkMode: true, // Default to sleek minimalist dark mode for night work!
  autoCloudSync: true,
  googleDriveConnected: true,
  googleAccountEmail: 'nalakara.id@gmail.com',
  lastCloudSync: new Date().toISOString(),
  soundAlerts: true,
  browserNotifications: true,
  courseAlertMinutes: 30,
  taskAlertHours: 24,
};

export const INITIAL_PROFILE: UserProfile = {
  fullName: 'Arkananta Widya Pratama',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  university: 'Institut Seni Indonesia Yogyakarta',
  faculty: 'Fakultas Seni Rupa',
  major: 'Desain Komunikasi Visual (DKV)',
  nim: '22104589012',
  semester: 6,
  academicYear: '2025/2026 - Semester Genap',
  specialization: 'Branding, Identitas Visual & Media Interaktif',
  email: 'arkananta.dkv@student.isi.ac.id',
  bio: 'Mahasiswa DKV semester 6 dengan kecintaan mendalam pada eksplorasi tipografi vernakular, identitas merek berkelanjutan, dan interaktivitas desain visual modern.',
  advisor: 'Baskara Adhitama, M.Sn.',
  skills: [
    'Brand Identity & Guidelines',
    'Tipografi Nusantara',
    'UI/UX & Interactive Prototyping',
    'Design System Architecture',
    'Ilustrasi Digital & Concept Art',
    'Motion Graphics 2D'
  ],
  tools: [
    'Adobe Illustrator',
    'Adobe Photoshop',
    'Figma',
    'After Effects',
    'Blender 3D',
    'Procreate',
    'Adobe InDesign'
  ]
};

export const INITIAL_RPS: CourseRPS[] = [
  {
    id: 'rps-course-1',
    courseId: 'course-1',
    courseCode: 'DKV301',
    courseName: 'Desain Komunikasi Visual Terpadu',
    sks: 4,
    semester: 6,
    lecturer: 'Baskara Adhitama, M.Sn.',
    description: 'Mata kuliah studio utama yang mengintegrasikan perancangan kampanye komunikasi visual terpadu lintas media (cetak, digital, lingkungan) untuk penyelesaian isu sosial dan komersial.',
    learningObjectives: [
      'Mampu melakukan riset etnografi visual dan mengidentifikasi permasalahan komunikasi merek/sosial.',
      'Mampu menyusun strategi pesan kreatif dan konsep diferensiasi identitas visual komprehensif.',
      'Mampu mengeksekusi sistem identitas visual konsisten pada media konvensional dan digital interaktif.',
      'Mampu mempresentasikan konsep desain secara profesional di hadapan audiens dan penguji.'
    ],
    assessmentSystem: [
      { component: 'Tugas Studio & Asistensi Rutin', percentage: 40 },
      { component: 'Ujian Tengah Semester (UTS - Brand Book Draft)', percentage: 25 },
      { component: 'Ujian Akhir Semester (UAS - Kampanye Terpadu & Pameran)', percentage: 35 }
    ],
    meetings: [
      {
        week: 1,
        topic: 'Orientasi Perkuliahan & Kontrak Belajar DKV Terpadu',
        subTopics: ['Rencana RPS & Silabus', 'Pembentukan Kelompok & Studi Kasus', 'Standardisasi Format Asistensi'],
        learningMethod: 'Ceramah Interaktif & Diskusi Kelas',
        deliverable: 'Lembar Kontrak Belajar & Pembagian Topik Studi Kasus',
        isCompleted: true
      },
      {
        week: 2,
        topic: 'Riset Desain & Identifikasi Masalah Komunikasi',
        subTopics: ['Metode Riset Visual', 'Analisis PESTLE & SWOT untuk Brand', 'Observasi Lapangan'],
        learningMethod: 'Kuliah & Praktik Lapangan',
        deliverable: 'Dokumen Riset Awal & Mind Mapping',
        isCompleted: true
      },
      {
        week: 3,
        topic: 'Target Audience Profiling & Empathy Mapping',
        subTopics: ['User Persona Mahasiswa & Publik', 'Perumusan Key Message', 'Emotional & Rational Appeal'],
        learningMethod: 'Workshop Studio & Studi Kasus',
        deliverable: 'Persona Sheet & Perumusan Unique Value Proposition (UVP)',
        isCompleted: true
      },
      {
        week: 4,
        topic: 'Moodboard Konsep & Eksplorasi Visual Metaphor',
        subTopics: ['Color Theory for Campaigns', 'Gaya Grafis & Visual Tone of Voice', 'Kolase Aset Referensi'],
        learningMethod: 'Studio Asistensi 1',
        deliverable: 'Moodboard Fisik/Digital & 20 Sketsa Kasar Logotype',
        isCompleted: true
      },
      {
        week: 5,
        topic: 'Perancangan Core Visual Identity (Logo & Simbol)',
        subTopics: ['Geometri Logo & Grid System', 'Rasio Emas dalam Logo DKV', 'Tipografi Pendukung'],
        learningMethod: 'Studio Praktik Digital',
        deliverable: '3 Alternatif Logo Digital Vektor',
        isCompleted: true
      },
      {
        week: 6,
        topic: 'Review Progres Studio & Peer Critique 1',
        subTopics: ['Evaluasi Keterbacaan dan Skalabilitas Logo', 'Umpan Balik Antar Mahasiswa'],
        learningMethod: 'Critique Session Terbuka',
        deliverable: 'Logo Terpilih & Panduan Warna Utama',
        isCompleted: true
      },
      {
        week: 7,
        topic: 'Pengembangan Media Lini Atas (Above The Line - ATL)',
        subTopics: ['Billboard, Baliho & Poster Kampanye', 'Hierarki Tipografi Luar Ruang'],
        learningMethod: 'Asistensi Dosen Pengampu',
        deliverable: 'Mockup Poster Kampanye & Supergraphic',
        isCompleted: false
      },
      {
        week: 8,
        topic: 'UJIAN TENGAH SEMESTER (UTS): Presentasi Brand Book Draft',
        subTopics: ['Sidang Penilaian Tengah Semester', 'Evaluasi Karya Desain 50%'],
        learningMethod: 'Presentasi Panel & Evaluasi Terstruktur',
        deliverable: 'Buku Manual Identitas Visual (Draft 30 Halaman) & Video Pitching',
        isCompleted: false
      },
      {
        week: 9,
        topic: 'Pengembangan Media Lini Bawah (Below The Line - BTL)',
        subTopics: ['Desain Kemasan (Packaging)', 'Merchandise & Point of Sales Materials (POSM)', 'Die-cut Dieline'],
        learningMethod: 'Praktik Mockup 3D & Finishing Bahan',
        deliverable: 'Dieline Cetak Kemasan & 3 Dummy Fisik Produk',
        isCompleted: false
      },
      {
        week: 10,
        topic: 'Ekstensi Media Digital & Social Media Kit',
        subTopics: ['Instagram Carousel & Story Guidelines', 'Key Visual Motion Teaser', 'Digital Banner Responsive'],
        learningMethod: 'Lab Komputer Grafis',
        deliverable: 'Social Media Feed Kit (9 Post Grid) & Guideline Template',
        isCompleted: false
      },
      {
        week: 11,
        topic: 'Environmental Graphic Design (Wayfinding & Stand Pameran)',
        subTopics: ['Spatial Branding', 'Grafis Ruang Terbuka', 'Pencahayaan & Material Ramah Lingkungan'],
        learningMethod: 'Workshop 3D Spasial',
        deliverable: 'Desain 3D Booth Pameran & Wayfinding Signage',
        isCompleted: false
      },
      {
        week: 12,
        topic: 'Asistensi Komprehensif Lintas Media Terpadu',
        subTopics: ['Harmonisasi Seluruh Touchpoint Brand', 'Koreksi Warna CMYK/RGB & Overprint'],
        learningMethod: 'Studio Asistensi 2',
        deliverable: 'Checklist Konsistensi Media Terpadu',
        isCompleted: false
      },
      {
        week: 13,
        topic: 'Produksi Prototype Nyata & Uji Keterbacaan Lapangan',
        subTopics: ['Dummy Cetak Full Color', 'Pengujian User Acceptance Media'],
        learningMethod: 'Review Lapangan & Lab Cetak',
        deliverable: 'Bukti Dummy Cetak & Dokumentasi Foto Studio Produk',
        isCompleted: false
      },
      {
        week: 14,
        topic: 'Penyusunan Lembar Laporan Desain & Video Dokumenter',
        subTopics: ['Format Laporan Ilmiah Desain', 'Video Case Study / Showreel Kampanye'],
        learningMethod: 'Editing & Asistensi Naskah',
        deliverable: 'Draft Laporan Akhir & Video Studi Kasus 2 Menit',
        isCompleted: false
      },
      {
        week: 15,
        topic: 'Kurasi Display Pameran Akhir Studio DKV',
        subTopics: ['Layout Meja Display Pameran', 'Pencahayaan Spot & Print Display Board A1'],
        learningMethod: 'Simulasi Display Galeri Kampus',
        deliverable: 'Display Board A1 Busa Hati & Tata Letak Booth',
        isCompleted: false
      },
      {
        week: 16,
        topic: 'UJIAN AKHIR SEMESTER (UAS): Pameran & Sidang Karya Terbuka',
        subTopics: ['Sidang Terbuka Dewan Penguji & Kurator Industri', 'Penilaian Karya Akhir 100%'],
        learningMethod: 'Exhibition & Defense Session',
        deliverable: 'Portofolio Final, Master Brand Book Cetak & Sertifikat Display',
        isCompleted: false
      }
    ]
  },
  {
    id: 'rps-course-2',
    courseId: 'course-2',
    courseCode: 'DKV204',
    courseName: 'Tipografi Eksperimental & Publikasi',
    sks: 3,
    semester: 6,
    lecturer: 'Dian Paramita, M.Ds.',
    description: 'Eksplorasi bentuk huruf melebihi fungsi konvensional sebagai alat baca, menjadikannya medium ekspresi visual, identitas kultural nusantara, dan seni publikasi cetak/digital kontemporer.',
    learningObjectives: [
      'Memahami anatomi huruf dan prinsip legibilitas versus ekspresi emosional bentuk huruf.',
      'Mengeksplorasi tipografi vernakular dan aksara nusantara dalam perancangan font kontemporer.',
      'Menguasai grid layout editorial magazine dan publikasi experimental bookbinding.'
    ],
    assessmentSystem: [
      { component: 'Tugas Eksplorasi Huruf', percentage: 35 },
      { component: 'UTS (Custom Typeface A-Z)', percentage: 30 },
      { component: 'UAS (Buku Publikasi Eksperimental)', percentage: 35 }
    ],
    meetings: [
      { week: 1, topic: 'Sejarah & Perkembangan Tipografi Eksperimental', subTopics: ['Dadaisme hingga Dekonstruktivisme', 'Type as Image vs Type as Code'], learningMethod: 'Ceramah & Apresiasi Karya', deliverable: 'Analisis Visual 3 Karya Tipografi', isCompleted: true },
      { week: 2, topic: 'Anatomi Huruf & Eksplorasi Modifikasi Glif', subTopics: ['x-height, ascender, descender', 'Metode Deformasi & Modular'], learningMethod: 'Sketsa Manual Pensil & Tinta', deliverable: 'Lembar Sketsa Grid Huruf A-Z', isCompleted: true },
      { week: 3, topic: 'Tipografi Vernakular & Aksara Tradisional Nusantara', subTopics: ['Signage Jalan Tradisional', 'Integrasi Aksara Jawa/Bali/Batak ke Latin'], learningMethod: 'Studi Etnografi Visual', deliverable: 'Moodboard Huruf Vernakular', isCompleted: true },
      { week: 4, topic: 'Vektorisasi Typeface & Pengenalan Font Editing', subTopics: ['Pen Tool Masterclass', 'Software Glyphs / FontForge / Illustrator'], learningMethod: 'Lab Digital Font', deliverable: 'Karakter Huruf Vektor A-M', isCompleted: true },
      { week: 5, topic: 'Kerning Pairs, Tracking & Spacing Metrics', subTopics: ['Optical Kerning vs Metric', 'Pembuatan Karakter Angka & Pungtuasi'], learningMethod: 'Lab Digital', deliverable: 'Set Huruf Lengkap A-Z (Uppercase & Lowercase)', isCompleted: true },
      { week: 6, topic: 'Type Specimen Design & Testing Keterbacaan', subTopics: ['Poster Type Specimen', 'Pengujian Ukuran Mikro (6pt) hingga Display (72pt)'], learningMethod: 'Studio Asistensi', deliverable: 'Poster Type Specimen A2', isCompleted: true },
      { week: 7, topic: 'Persiapan Typeface File (.OTF / .TTF)', subTopics: ['Exporting Typeface', 'Instalasi Sistem & Troubleshooting Karakter'], learningMethod: 'Lab Komputer', deliverable: 'Berkas Font OTF/TTF Terpasang', isCompleted: false },
      { week: 8, topic: 'UJIAN TENGAH SEMESTER (UTS): Peluncuran Custom Font', subTopics: ['Presentasi Karya Font', 'Penilaian Anatomi & Orisinalitas'], learningMethod: 'Pameran Mini Kelas', deliverable: 'Koleksi Typeface Lengkap + Poster Specimen Cetak', isCompleted: false },
      { week: 9, topic: 'Prinsip Grid Systems Majalah & Buku Kontemporer', subTopics: ['Swiss Grid, Modular Grid, Hierarchical Grid'], learningMethod: 'Kuliah & Analisis Majalah Desain', deliverable: 'Sketsa Dummy Grid Buku', isCompleted: false },
      { week: 10, topic: 'Eksperimen Material & Teknik Binding (Jilid Buku)', subTopics: ['Japanese Stab Binding, Coptic Stitch, French Fold'], learningMethod: 'Workshop Manual Bookbinding', deliverable: '3 Mockup Jilid Fisik', isCompleted: false },
      { week: 11, topic: 'Perancangan Tata Letak Buku (Editorial Layout)', subTopics: ['InDesign Master Pages, Paragraph Styles, Grep Styles'], learningMethod: 'Lab Editorial InDesign', deliverable: '16 Halaman Layout Konten', isCompleted: false },
      { week: 12, topic: 'Tipografi Kinetik & Digital Motion Publication', subTopics: ['Animasi Karakter Huruf di After Effects', 'Interaktivitas Layar Sentuh'], learningMethod: 'Lab Animasi', deliverable: 'Video Animasi Tipografi 15 Detik', isCompleted: false },
      { week: 13, topic: 'Pemilihan Kertas, Finishing Foil, Emboss & Spot UV', subTopics: ['Karakter Kertas Fancy Paper, Gramatur, Tekstur'], learningMethod: 'Kunjungan Toko Kertas / Sampel Swatch', deliverable: 'Daftar Spesifikasi Cetak Buku', isCompleted: false },
      { week: 14, topic: 'Cetak Percobaan (Proofing) & Uji Warna', subTopics: ['Digital Offset vs Indigo Print', 'Koreksi Margin & Spine Lebar'], learningMethod: 'Evaluasi Proof Cetak', deliverable: 'Dummy Cetak Proofing Pertama', isCompleted: false },
      { week: 15, topic: 'Finishing & Penjilid Buku Seni Eksperimental', subTopics: ['Finishing Sampul Hardcover & Slipcase', 'Quality Control Akhir'], learningMethod: 'Studio Kerajinan Buku', deliverable: 'Buku Fisik Jadi Lengkap dengan Kemasan Kotak', isCompleted: false },
      { week: 16, topic: 'UJIAN AKHIR SEMESTER (UAS): Showcase Buku Eksperimental', subTopics: ['Pameran Seni Buku DKV', 'Evaluasi Karya Editorial'], learningMethod: 'Review Galeri Publik', deliverable: 'Buku Eksperimental Cetak + Typeface Book Showcase', isCompleted: false }
    ]
  },
  {
    id: 'rps-course-3',
    courseId: 'course-3',
    courseCode: 'DKV312',
    courseName: 'UI/UX Design & Interaksi Digital',
    sks: 4,
    semester: 6,
    lecturer: 'Reza Pratama, S.Sn., M.Sc.',
    description: 'Perancangan produk digital berbasis metode Design Thinking, User-Centered Design (UCD), pembuatan design system berskala industri di Figma, serta validasi usability testing.',
    learningObjectives: [
      'Menerapkan tahapan Design Thinking dalam merancang solusi digital untuk masalah nyata.',
      'Merancang arsitektur informasi, user flow, wireframe low-fidelity dan high-fidelity.',
      'Membangun Design System modular menggunakan token warna, tipografi, dan auto-layout.',
      'Melakukan usability testing interaktif dan analisis metrik kegunaan (SUS / System Usability Scale).'
    ],
    assessmentSystem: [
      { component: 'Tugas Riset UX & Wireframing', percentage: 30 },
      { component: 'UTS (Prototype Interaktif High-Fidelity Figma)', percentage: 35 },
      { component: 'UAS (Usability Testing Report & Design System)', percentage: 35 }
    ],
    meetings: [
      { week: 1, topic: 'Pengantar UI/UX & Paradigma Desain Produk Digital', subTopics: ['UI vs UX vs Product Design', 'Ekosistem Mobile & Web Apps'], learningMethod: 'Ceramah & Bedah Aplikasi', deliverable: 'Review UX 2 Aplikasi Lokal', isCompleted: true },
      { week: 2, topic: 'User Research & Discovery Phase', subTopics: ['Metode Wawancara Mendalam', 'Survei Kuantitatif & Qualitative Insight'], learningMethod: 'Praktik Riset Pengguna', deliverable: 'Interview Transcript & Affinity Diagram', isCompleted: true },
      { week: 3, topic: 'User Persona, Journey Map & Problem Statement', subTopics: ['How Might We (HMW) Questions', 'Mental Model Pengguna'], learningMethod: 'Workshop Kolaboratif Miro/FigJam', deliverable: 'User Journey Map & HMW Framework', isCompleted: true },
      { week: 4, topic: 'Arsitektur Informasi (IA) & User Flow Mapping', subTopics: ['Card Sorting Method', 'Tree Testing & Flowchart Interaksi'], learningMethod: 'Studio Praktik', deliverable: 'Sitemap & Happy Path User Flowchart', isCompleted: true },
      { week: 5, topic: 'Low-Fidelity Wireframing & Rapid Paper Prototyping', subTopics: ['Sketsa Antarmuka Kasar', 'Validasi Struktur Tanpa Distraksi Visual'], learningMethod: 'Studio Sketsa Manual & Figma Wireframe', deliverable: 'Wireframe 10 Layar Utama', isCompleted: true },
      { week: 6, topic: 'Dasar Visual UI & Fundamental Layout Digital', subTopics: ['8pt Grid System', 'Visual Hierarchy & Scanning Pattern (F/Z Pattern)'], learningMethod: 'Lab Figma', deliverable: 'Moodboard UI & Visual Style Tile', isCompleted: false },
      { week: 7, topic: 'Membangun Design System di Figma (Bagian 1)', subTopics: ['Design Tokens, Color Palettes, Accessible Contrast Ratio WCAG'], learningMethod: 'Lab Komputer Figma', deliverable: 'Figma Library: Color & Typography Tokens', isCompleted: false },
      { week: 8, topic: 'UJIAN TENGAH SEMESTER (UTS): High-Fidelity Prototype', subTopics: ['Presentasi Prototype Interaktif', 'Review Komponen UI'], learningMethod: 'Demo Interaktif Figma', deliverable: 'Prototype Figma Terhubung (15+ Layar Aktif)', isCompleted: false },
      { week: 9, topic: 'Design System Lanjutan: Components, Variants & Auto-Layout', subTopics: ['Button States, Input Fields, Modals, Responsive Breakpoints'], learningMethod: 'Lab Figma Advanced', deliverable: 'Komponen UI Modular dengan Auto-Layout', isCompleted: false },
      { week: 10, topic: 'Micro-Interactions & Smart Animate di Figma', subTopics: ['State Transitions, Loading Skeletons, Haptic & Motion Feedback'], learningMethod: 'Lab Animasi UI', deliverable: 'Prototype dengan Smart Animate Realistis', isCompleted: false },
      { week: 11, topic: 'Penyusunan Rencana Usability Testing (UT Plan)', subTopics: ['Penyusunan Skenario Tugas (Task Scenarios)', 'Metrik Penilaian: Task Success Rate, Time on Task'], learningMethod: 'Workshop Metodologi Pengujian', deliverable: 'Dokumen Panduan Skenario Usability Testing', isCompleted: false },
      { week: 12, topic: 'Eksekusi Usability Testing dengan Pengguna Riil', subTopics: ['Moderated vs Unmoderated Testing', 'Think-Aloud Protocol'], learningMethod: 'Sesi Pengujian Lab / Daring', deliverable: 'Rekaman Pengujian & Catatan Observasi', isCompleted: false },
      { week: 13, topic: 'Analisis Hasil Testing & Perhitungan Skor SUS', subTopics: ['System Usability Scale Calculation', 'Matriks Prioritas Perbaikan (MoSCoW)'], learningMethod: 'Analisis Data Kualitatif', deliverable: 'Laporan Skor SUS & Daftar Temuan Masalah', isCompleted: false },
      { week: 14, topic: 'Iterasi Desain Berdasarkan Masukan Pengguna', subTopics: ['Refining Edge Cases, Empty States & Error Handling'], learningMethod: 'Studio Perbaikan Desain', deliverable: 'Prototype Versi 2.0 (Hasil Iterasi)', isCompleted: false },
      { week: 15, topic: 'Penyusunan Case Study Portofolio UI/UX Standar Industri', subTopics: ['Format Studi Kasus Behance & Medium', 'Storytelling Desain'], learningMethod: 'Mentoring Penulisan Case Study', deliverable: 'Draft Case Study Portofolio Komprehensif', isCompleted: false },
      { week: 16, topic: 'UJIAN AKHIR SEMESTER (UAS): Pitching Produk Digital', subTopics: ['Presentasi Akhir ke Penguji Industri', 'Evaluasi Total Produk'], learningMethod: 'Pitching Panel', deliverable: 'Case Study Siap Tayang, File Figma Production, & Laporan UT', isCompleted: false }
    ]
  },
  {
    id: 'rps-course-4',
    courseId: 'course-4',
    courseCode: 'DKV218',
    courseName: 'Ilustrasi Digital & Concept Art',
    sks: 3,
    semester: 6,
    lecturer: 'Arya Nugroho, M.Sn.',
    description: 'Penciptaan karya ilustrasi digital naratif, concept art lingkungan (environment) dan karakter untuk kebutuhan industri kreatif, penerbitan buku, dan entertainment media.',
    learningObjectives: [
      'Menguasai teknik digital painting, kuas khusus, dan manajemen layer profesional.',
      'Memahami komposisi visual, rule of thirds, dynamic framing, dan focal points.',
      'Mengaplikasikan color theory, visual storytelling, dan atmospheric lighting.'
    ],
    assessmentSystem: [
      { component: 'Tugas Sketsa & Studi Nilai Nada (Values)', percentage: 30 },
      { component: 'UTS (Character Concept Art Sheet)', percentage: 35 },
      { component: 'UAS (Narrative Environment Keyframe Illustration)', percentage: 35 }
    ],
    meetings: [
      { week: 1, topic: 'Pengenalan Pipeline Concept Art & Digital Painting', subTopics: ['Hardware Setup (Tablet/Cintiq)', 'Custom Brush Management'], learningMethod: 'Demo Studio', deliverable: 'Koleksi Brush Pack & Uji Sapuan', isCompleted: true },
      { week: 2, topic: 'Studi Value (Nilai Nada Terang-Gelap) & Thumbnailing', subTopics: ['Grayscale Speedpainting', 'Siluet & Focal Point'], learningMethod: 'Studio Praktik', deliverable: '20 Thumbnail Siluet Lingkungan', isCompleted: true },
      { week: 3, topic: 'Teori Komposisi Dinamis & Visual Storytelling', subTopics: ['Leading Lines, Golden Ratio, Framing'], learningMethod: 'Diskusi & Sketsa Komposisi', deliverable: '4 Alternatif Komposisi A3', isCompleted: true },
      { week: 4, topic: 'Color Scripting & Lighting Schemes', subTopics: ['Direct Light, Ambient Light, Rim Light, Color Mood'], learningMethod: 'Lab Digital Painting', deliverable: 'Color Keys Studi 4 Waktu Berbeda', isCompleted: true },
      { week: 5, topic: 'Anatomi Karakter & Shape Language', subTopics: ['Proporsi Figuratif', 'Bentuk Dasar Karakter (Lingkaran, Segitiga, Kotak)'], learningMethod: 'Studio Asistensi', deliverable: 'Model Sheet Sketsa Karakter', isCompleted: true },
      { week: 6, topic: 'Rendering Tekstur Material (Kain, Logam, Kulit, Rambut)', subTopics: ['Karakteristik Refleksi Cahaya (Specularity)', 'Matte vs Glossy'], learningMethod: 'Lab Painting', deliverable: 'Studi Material Spheres', isCompleted: false },
      { week: 7, topic: 'Character Expression Sheet & Prop Design', subTopics: ['Ekspresi Emosional', 'Desain Kostum & Aksesori Tematik'], learningMethod: 'Studio Digital', deliverable: 'Lembar Turnaround Karakter 3 Sudut', isCompleted: false },
      { week: 8, topic: 'UJIAN TENGAH SEMESTER (UTS): Character Design Sheet', subTopics: ['Presentasi Desain Karakter', 'Evaluasi Kualitas Render'], learningMethod: 'Review Karya Kelas', deliverable: 'Character Production Sheet Resolusi Tinggi', isCompleted: false },
      { week: 9, topic: 'Perspektif Spasial 1, 2, & 3 Titik Hilang untuk Environment', subTopics: ['Grid Perspektif Digital', 'Kedalaman Atmosfer (Aerial Perspective)'], learningMethod: 'Lab Digital Perspektif', deliverable: 'Grid Lingkungan Kota / Alam', isCompleted: false },
      { week: 10, topic: 'Worldbuilding & Konsep Arsitektur Fantasi/Sci-Fi', subTopics: ['Kombinasi Elemen Lokal Nusantara & Futuristik', 'Sketsa Struktur'], learningMethod: 'Studio Asistensi', deliverable: 'Desain Bangunan Landmark Dunia Cerita', isCompleted: false },
      { week: 11, topic: 'Teknik Photobashing & Matte Painting Dasar', subTopics: ['Integrasi Foto Tekstur Legal', 'Paint-over & Color Matching'], learningMethod: 'Lab Komputer', deliverable: 'Eksperimen Photobash Environment', isCompleted: false },
      { week: 12, topic: 'Rendering Final Environment Keyframe', subTopics: ['Foliage Painting, Efek Partikel Debu/Cahaya', 'Gradasi Kabut'], learningMethod: 'Studio Painting Mendalam', deliverable: 'Rough Render Keyframe Penuh', isCompleted: false },
      { week: 13, topic: 'Pencahayaan Dramatis & Color Grading Akhir', subTopics: ['Adjustment Layers, Curves, Chromatic Aberration', 'Film Grain'], learningMethod: 'Lab Digital Post-Processing', deliverable: 'Final Color Graded Illustration', isCompleted: false },
      { week: 14, topic: 'Penyusunan Artbook Page & Format Resolusi Cetak', subTopics: ['DPI 300 CMYK vs sRGB', 'Tata Letak Halaman Artbook'], learningMethod: 'Studio Tata Letak', deliverable: 'Layout Halaman Artbook A4 Horizontal', isCompleted: false },
      { week: 15, topic: 'Proofing Cetak di Atas Kertas Fine Art (Giclee Print)', subTopics: ['Kertas Archival, Katun vs Kanvas', 'Kalibrasi Monitor ke Cetak'], learningMethod: 'Workshop Cetak Seni', deliverable: 'Hasil Cetak Seni A3 Fine Art', isCompleted: false },
      { week: 16, topic: 'UJIAN AKHIR SEMESTER (UAS): Galeri Pameran Ilustrasi', subTopics: ['Pameran Seni Visual', 'Penilaian Detail & Kedalaman Cerita'], learningMethod: 'Exhibition Showcase', deliverable: 'Karya Cetak Berbingkai + Artbook PDF Resolusi Penuh', isCompleted: false }
    ]
  },
  {
    id: 'rps-course-5',
    courseId: 'course-5',
    courseCode: 'DKV330',
    courseName: 'Animasi 2D & Motion Graphics',
    sks: 4,
    semester: 6,
    lecturer: 'Galih Wicaksana, M.Ds.',
    description: 'Penerapan 12 prinsip dasar animasi, perancangan storyboard, motion branding, dan animasi kinetik 2D untuk media periklanan, opening title, dan platform interaktif.',
    learningObjectives: [
      'Menerapkan 12 prinsip dasar animasi Disney (squash & stretch, anticipation, timing, easing).',
      'Merancang storyboard dan animatic yang komunikatif untuk format audio-visual.',
      'Menguasai software industri After Effects untuk animasi logo dan motion graphics kampanye.'
    ],
    assessmentSystem: [
      { component: 'Tugas Latihan 12 Prinsip Animasi', percentage: 30 },
      { component: 'UTS (Animatic & Animated Logo Bumper)', percentage: 35 },
      { component: 'UAS (Video Eksplanatori / Motion Campaign 60s)', percentage: 35 }
    ],
    meetings: [
      { week: 1, topic: 'Sejarah & 12 Prinsip Dasar Animasi', subTopics: ['Prinsip Timing & Spacing', 'Bouncing Ball Exercise'], learningMethod: 'Teori & Praktik Lab', deliverable: 'Animasi Bola Memantul dengan Easing Tepat', isCompleted: true },
      { week: 2, topic: 'Squash & Stretch, Anticipation, & Follow-Through', subTopics: ['Deformasi Massa Objek Bergerak', 'Secondary Action'], learningMethod: 'Lab Animasi Frame-by-Frame', deliverable: 'Animasi Karakter Objek Melompat', isCompleted: true },
      { week: 3, topic: 'Pengenalan Adobe After Effects & Graph Editor', subTopics: ['Keyframe Interpolation, Speed Graph vs Value Graph'], learningMethod: 'Lab After Effects', deliverable: 'Gerakan Objek Halus Menggunakan Graph Editor', isCompleted: true },
      { week: 4, topic: 'Perancangan Konsep & Storyboard Animasi', subTopics: ['Beat Board, Color Scripting, Frame Aspect Ratio (16:9 & 9:16)'], learningMethod: 'Studio Sketsa Storyboard', deliverable: 'Storyboard 12 Panel Lengkap dengan Arah Kamera', isCompleted: true },
      { week: 5, topic: 'Pembuatan Animatic & Audio Scratch Track', subTopics: ['Sync Animatic dengan Suara Narasi', 'Pengujian Durasi Waktu'], learningMethod: 'Editing Audio & Timeline', deliverable: 'Video Animatic 30 Detik', isCompleted: false },
      { week: 6, topic: 'Persiapan Aset Vektor (Illustrator ke After Effects)', subTopics: ['Layer Management, Overlord Extension, Convert to Shapes'], learningMethod: 'Lab Integrasi Software', deliverable: 'Aset Illustrator Terpisah Bersih Siap Animasi', isCompleted: false },
      { week: 7, topic: 'Motion Branding: Animasi Logo & Identitas Dinamis', subTopics: ['Morphing Shapes, Trim Paths, Masking Tricks'], learningMethod: 'Lab Motion Branding', deliverable: 'Logo Identitas Teranimasi (Bumper 5 Detik)', isCompleted: false },
      { week: 8, topic: 'UJIAN TENGAH SEMESTER (UTS): Logo Bumper & Animatic Review', subTopics: ['Sidang Penilaian UTS', 'Evaluasi Timing dan Dampak Visual'], learningMethod: 'Presentasi Screening Kelas', deliverable: 'Bumper Logo 4K + Animatic Final Disetujui', isCompleted: false },
      { week: 9, topic: 'Kinetic Typography & Text Animation', subTopics: ['Text Animators di AE, Range Selectors, Audio Sync'], learningMethod: 'Lab After Effects Text', deliverable: 'Kutipan Kinetik Teranimasi 15 Detik', isCompleted: false },
      { week: 10, topic: 'Rigging Karakter 2D dengan Duik Angela / Limber', subTopics: ['Inverse Kinematics (IK), Bone Rigging, Pin Puppet'], learningMethod: 'Lab Character Rigging', deliverable: 'Karakter Ter-rigging Siap Animasi Berjalan', isCompleted: false },
      { week: 11, topic: 'Animasi Siklus Berjalan (Walk Cycle) & Berlari', subTopics: ['Contact, Down, Passing, Up Positions', 'Weight Shift'], learningMethod: 'Studio Animasi Karakter', deliverable: 'Looping Walk Cycle Karakter', isCompleted: false },
      { week: 12, topic: 'Kamera Virtual 3D & Parallax Effect di After Effects', subTopics: ['3D Layers, Depth of Field, Camera Shake Rig'], learningMethod: 'Lab 3D Spasial', deliverable: 'Adegan Parallax 3D Bergerak', isCompleted: false },
      { week: 13, topic: 'Desain Suara (Sound Design) & Foley Effect', subTopics: ['Sound FX Layering, Penyelarasan Beat Musik, Audio Mixdown'], learningMethod: 'Lab Audio Editing', deliverable: 'Trek Audio Lengkap dengan Suara Efek', isCompleted: false },
      { week: 14, topic: 'Visual Effects (VFX), Glow, & Composite Finishing', subTopics: ['Particle Systems, Motion Blur, Color Correction LUTs'], learningMethod: 'Lab Compositing', deliverable: 'Render Kasar Video Penuh (Work In Progress 90%)', isCompleted: false },
      { week: 15, topic: 'Optimasi Render & Format Distribusi (ProRes, H.264, WebM)', subTopics: ['Media Encoder Queue, Bitrate Setting, Color Profiles'], learningMethod: 'Lab Rendering', deliverable: 'Master Video File Full HD/4K + GIF Version', isCompleted: false },
      { week: 16, topic: 'UJIAN AKHIR SEMESTER (UAS): Screening Festival Animasi', subTopics: ['Pemutaran Karya di Layar Bioskop Mini Kampus', 'Tanya Jawab Penguji'], learningMethod: 'Film Screening & Defense', deliverable: 'Motion Graphics Video 60 Detik + Production Bible/PDF', isCompleted: false }
    ]
  }
];
