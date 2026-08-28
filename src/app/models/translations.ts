export type Language = 'ta' | 'en';

export interface Translations {
  appName: string;
  appSubName: string;
  tagline: string;
  offlineReady: string;
  
  // Navigation
  navHome: string;
  navSearch: string;
  navRegister: string;
  navAdmin: string;
  
  // Home Page
  homeHeroTitle: string;
  homeHeroDesc: string;
  homeFindBtn: string;
  homeRegisterBtn: string;
  homeCategoriesTitle: string;
  homeFeaturedTitle: string;
  homeWhyTitle: string;
  homeWhy1Title: string;
  homeWhy1Desc: string;
  homeWhy2Title: string;
  homeWhy2Desc: string;
  homeWhy3Title: string;
  homeWhy3Desc: string;

  // Search & Filter
  searchTitle: string;
  searchPlaceholder: string;
  filterLocationAll: string;
  filterSkillAll: string;
  filterAvailabilityAll: string;
  clearFilters: string;
  resultsCount: string;
  noProvidersFound: string;
  noProvidersHint: string;
  resetSearch: string;
  
  // Provider Card
  contactBtn: string;
  hideContactBtn: string;
  callNow: string;
  whatsappMsg: string;
  rateAndReview: string;
  reviewsCountText: string;
  verifiedBadge: string;
  availableLabel: string;
  locationLabel: string;

  // Provider Registration
  regTitle: string;
  regSubtitle: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneHelper: string;
  photoLabel: string;
  photoUploadPrompt: string;
  photoChangePrompt: string;
  photoRemovePrompt: string;
  skillLabel: string;
  customSkillLabel: string;
  customSkillPlaceholder: string;
  locationInputLabel: string;
  locationInputPlaceholder: string;
  availabilityLabel: string;
  experienceLabel: string;
  experiencePlaceholder: string;
  bioLabel: string;
  bioPlaceholder: string;
  submitRegistration: string;
  submitting: string;
  regSuccessTitle: string;
  regSuccessDesc: string;
  backToHome: string;
  viewStatusBtn: string;
  errorNameRequired: string;
  errorPhoneInvalid: string;
  errorPhoneDuplicate: string;
  errorSkillRequired: string;
  errorLocationRequired: string;

  // Rating & Review Modal
  reviewsTitle: string;
  addReviewTitle: string;
  ratingSelectPrompt: string;
  reviewerNameLabel: string;
  reviewerNamePlaceholder: string;
  reviewCommentLabel: string;
  reviewCommentPlaceholder: string;
  submitReviewBtn: string;
  closeModal: string;
  noReviewsYet: string;
  reviewAddedSuccess: string;
  errorRatingRequired: string;
  errorReviewerNameRequired: string;

  // Admin Panel
  adminTitle: string;
  adminSubtitle: string;
  adminPasswordPrompt: string;
  adminPasswordPlaceholder: string;
  adminLoginBtn: string;
  adminLogoutBtn: string;
  adminInvalidPassword: string;
  adminPasswordHint: string;
  adminTabPending: string;
  adminTabApproved: string;
  adminTabStats: string;
  adminApproveBtn: string;
  adminRejectBtn: string;
  adminDeleteBtn: string;
  adminApprovedSuccess: string;
  adminRejectedSuccess: string;
  adminNoPending: string;
  adminNoApproved: string;
  adminResetSeedBtn: string;
  adminResetSeedConfirm: string;
  adminResetSeedSuccess: string;
  adminTotalProviders: string;
  adminTotalApproved: string;
  adminTotalPending: string;
  adminTotalReviews: string;

  // Skills
  skillElectrician: string;
  skillPlumber: string;
  skillTailor: string;
  skillTutor: string;
  skillCarpenter: string;
  skillAutoDriver: string;
  skillOther: string;

  // Availability
  availNow: string;
  availToday: string;
  availThisWeek: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ta: {
    appName: 'LocalConnect',
    appSubName: 'namma ஊர் சேவைகள்',
    tagline: 'நம்பகமான ஊர் சேவை வல்லுநர்களை எளிதாகக் கண்டறிந்து தொடர்புகொள்ளுங்கள்',
    offlineReady: 'இணையமின்றியும் இயங்கும் (Offline Ready)',

    // Navigation
    navHome: 'முகப்பு',
    navSearch: 'சேவைகளைத் தேடுக',
    navRegister: 'சேவை வழங்க பதிவு செய்க',
    navAdmin: 'நிர்வாகம்',

    // Home Page
    homeHeroTitle: 'உங்கள் ஊரில் நம்பகமான உள்ளூர் சேவை வல்லுநர்களை உடனே கண்டறியுங்கள்',
    homeHeroDesc: 'மின்சாரப் பணியாளர், குழாய் பழுதுபார்ப்பவர், தையல்காரர், ஆசிரியர், தச்சர், ஆட்டோ ஓட்டுநர் மற்றும் பலரை ஒரு நொடியில் தொடர்பு கொள்ளுங்கள்.',
    homeFindBtn: 'சேவையைத் தேடுங்கள்',
    homeRegisterBtn: 'சேவை வழங்குநராக இணையுங்கள்',
    homeCategoriesTitle: 'முக்கிய ஊர் சேவைகள்',
    homeFeaturedTitle: 'அதிக மதிப்பீடு பெற்ற ஊர் வல்லுநர்கள்',
    homeWhyTitle: 'ஏன் LocalConnect ஊர் சேவைப் பட்டியல்?',
    homeWhy1Title: 'நேரடித் தொடர்பு',
    homeWhy1Desc: 'எந்த இடைத்தரகரும் இன்றி உங்கள் ஊர் தொழிலாளர்களை நேரடியாக ஃபோன் மூலம் அழைக்கலாம்.',
    homeWhy2Title: 'ஊர் மக்கள் மதிப்பீடு',
    homeWhy2Desc: 'உண்மையான உள்ளூர் மக்கள் வழங்கிய 1 முதல் 5 நட்சத்திர மதிப்பீடுகளைப் பார்த்துத் தேர்ந்தெடுக்கலாம்.',
    homeWhy3Title: 'ஆஃப்லைனிலும் இயங்கும்',
    homeWhy3Desc: 'இன்டர்நெட் சிக்னல் குறைவாக இருந்தாலும் உங்கள் ஃபோனில் எப்போதும் இயங்கும்.',

    // Search & Filter
    searchTitle: 'ஊர் சேவை வழங்குநர்களைத் தேடுங்கள்',
    searchPlaceholder: 'சேவை வகை, பெயர் அல்லது ஊரைத் தேடுங்கள்...',
    filterLocationAll: 'அனைத்து ஊர்களும்',
    filterSkillAll: 'அனைத்து சேவைகளும்',
    filterAvailabilityAll: 'அனைத்து நிலைகளும்',
    clearFilters: 'வடிப்பான்களை நீக்குக',
    resultsCount: 'சரிபார்க்கப்பட்ட சேவை வழங்குநர்கள்',
    noProvidersFound: 'சேவை வழங்குநர்கள் எதுவும் கிடைக்கவில்லை',
    noProvidersHint: 'உங்கள் தேடல் அல்லது ஊர் தேர்வை மாற்றி மீண்டும் முயற்சிக்கவும்.',
    resetSearch: 'அனைத்து சேவைகளையும் காட்டுக',

    // Provider Card
    contactBtn: 'தொடர்பு எண் காண்க',
    hideContactBtn: 'மறைக்க',
    callNow: 'அழைக்க',
    whatsappMsg: 'வாட்ஸ்அப் செய்தி',
    rateAndReview: 'மதிப்பீடு & கருத்து',
    reviewsCountText: 'மதிப்புரைகள்',
    verifiedBadge: 'சரிபார்க்கப்பட்டது',
    availableLabel: 'கிடைக்கும் நிலை',
    locationLabel: 'ஊர் / பகுதி',

    // Provider Registration
    regTitle: 'உள்ளூர் சேவை வழங்குநராகப் பதிவு செய்க',
    regSubtitle: 'உங்கள் ஊர் மக்களுடன் இணைந்து அதிக வாடிக்கையாளர்களைப் பெறுங்கள். கிராம நிர்வாக ஒப்புதலுக்குப் பின் உங்கள் விவரங்கள் வெளியிடப்படும்.',
    fullNameLabel: 'முழுப் பெயர்',
    fullNamePlaceholder: 'எ.கா: மு. முருகன்',
    phoneLabel: 'கைபேசி / தொலைபேசி எண்',
    phonePlaceholder: 'எ.கா: 9876543210',
    phoneHelper: '10 இலக்க தொலைபேசி எண். வாடிக்கையாளர்கள் இந்த எண்ணில் உங்களைத் தொடர்புகொள்வார்கள்.',
    photoLabel: 'புகைப்படம் (விருப்பம்)',
    photoUploadPrompt: 'புகைப்படத்தை இங்கே பதிவேற்றவும் அல்லது தேர்ந்தெடுக்கவும்',
    photoChangePrompt: 'புகைப்படத்தை மாற்ற',
    photoRemovePrompt: 'நீக்க',
    skillLabel: 'தொழில் / சேவை வகை',
    customSkillLabel: 'உங்கள் தனிப்பயன் தொழிலைக் குறிப்பிடவும்',
    customSkillPlaceholder: 'எ.கா: பெயிண்டர், கொத்தனார், மெக்கானிக்',
    locationInputLabel: 'உங்கள் ஊர் அல்லது நகரம்',
    locationInputPlaceholder: 'எ.கா: தஞ்சாவூர், பொள்ளாச்சி, காரைக்குடி',
    availabilityLabel: 'கிடைக்கும் நிலை',
    experienceLabel: 'தொழில் அனுபவம் (ஆண்டுகள்)',
    experiencePlaceholder: 'எ.கா: 5',
    bioLabel: 'உங்களைப் பற்றிய சிறு குறிப்பு (விருப்பம்)',
    bioPlaceholder: 'எ.கா: 10 வருட அனுபவம் கொண்ட நம்பகமான வீடுகள் மற்றும் கடைகளுக்கான மின்சார வேலைகள்.',
    submitRegistration: 'பதிவு விண்ணப்பத்தைச் சமர்ப்பிக்கவும்',
    submitting: 'சமர்ப்பிக்கப்படுகிறது...',
    regSuccessTitle: 'விண்ணப்பம் வெற்றிகரமாகச் சமர்ப்பிக்கப்பட்டது!',
    regSuccessDesc: 'உங்கள் சுயவிவரம் ஊர் நிர்வாகியின் ஒப்புதலுக்காக நிலுவையில் உள்ளது. ஒப்புதல் அளிக்கப்பட்டதும் பொதுத் தேடலில் தோன்றும்.',
    backToHome: 'முகப்பிற்குச் செல்ல',
    viewStatusBtn: 'விவரங்களைக் காண்க',
    errorNameRequired: 'முழுப் பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துகள்)',
    errorPhoneInvalid: 'சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்',
    errorPhoneDuplicate: 'இந்த தொலைபேசி எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது! தயவுசெய்து சரிபார்க்கவும்.',
    errorSkillRequired: 'தொழில் அல்லது சேவை வகையைத் தேர்ந்தெடுக்கவும்',
    errorLocationRequired: 'ஊர் அல்லது நகரத்தின் பெயரை உள்ளிடவும்',

    // Rating & Review Modal
    reviewsTitle: 'மதிப்பீடுகள் மற்றும் மக்கள் கருத்துகள்',
    addReviewTitle: 'உங்கள் மதிப்பீட்டை வழங்குக',
    ratingSelectPrompt: 'மதிப்பிட நட்சத்திரத்தைத் தொடவும்:',
    reviewerNameLabel: 'உங்கள் பெயர்',
    reviewerNamePlaceholder: 'எ.கா: சுந்தரம் அல்லது ஊர்வாசி',
    reviewCommentLabel: 'கருத்து / அனுபவம் (விருப்பம்)',
    reviewCommentPlaceholder: 'வேலை தரம், சரியான நேரம், அணுகுமுறை பற்றி எழுதவும்...',
    submitReviewBtn: 'மதிப்பீட்டைச் சேமி',
    closeModal: 'மூடுக',
    noReviewsYet: 'இதுவரை மதிப்புரைகள் எதுவும் இல்லை. உங்கள் முதல் மதிப்பீட்டை வழங்குங்கள்!',
    reviewAddedSuccess: 'உங்கள் மதிப்பீடு வெற்றிகரமாகப் பதிவு செய்யப்பட்டது. நன்றி!',
    errorRatingRequired: 'தயவுசெய்து 1 முதல் 5 நட்சத்திரங்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்',
    errorReviewerNameRequired: 'உங்கள் பெயரை உள்ளிடவும்',

    // Admin Panel
    adminTitle: 'ஊர் சேவை நிர்வாகப் பலகை (Admin Panel)',
    adminSubtitle: 'புதிய சேவை வழங்குநர் விண்ணப்பங்களைச் சரிபார்த்து பொதுப் பட்டியலில் ஒப்புதல் அளிக்கவும்.',
    adminPasswordPrompt: 'நிர்வாக கடவுச்சொல்லை உள்ளிடவும்',
    adminPasswordPlaceholder: 'கடவுச்சொல்',
    adminLoginBtn: 'உள்நுழைக',
    adminLogoutBtn: 'வெளியேறு',
    adminInvalidPassword: 'தவறான கடவுச்சொல்! டெமோ கடவுச்சொல்: admin123',
    adminPasswordHint: 'டெமோ கடவுச்சொல் (Demo Password): admin123',
    adminTabPending: 'நிலுவையில் உள்ளவை (Pending)',
    adminTabApproved: 'அங்கீகரிக்கப்பட்டவை (Approved)',
    adminTabStats: 'புள்ளிவிவரங்கள் (Overview)',
    adminApproveBtn: 'ஒப்புதல் அளி (Approve)',
    adminRejectBtn: 'நிராகரி (Reject)',
    adminDeleteBtn: 'நீக்கு (Delete)',
    adminApprovedSuccess: 'சேவை வழங்குநருக்கு ஒப்புதல் அளிக்கப்பட்டது. இப்போது பொதுப் பட்டியலில் தோன்றும்.',
    adminRejectedSuccess: 'விண்ணப்பம் நிராகரிக்கப்பட்டு நீக்கப்பட்டது.',
    adminNoPending: 'தற்போது ஒப்புதலுக்காக நிலுவையில் விண்ணப்பங்கள் எதுவும் இல்லை!',
    adminNoApproved: 'அங்கீகரிக்கப்பட்ட வழங்குநர்கள் எதுவும் இல்லை.',
    adminResetSeedBtn: 'மாதிரித் தரவுகளை மீட்டமை (Reset Demo Seed Data)',
    adminResetSeedConfirm: 'மாதிரித் தரவை மீட்டமைக்க விரும்புகிறீர்களா? இது அனைத்து முந்தைய மாற்றங்களையும் மீட்டமைக்கும்.',
    adminResetSeedSuccess: 'மாதிரித் தரவுகள் வெற்றிகரமாக மீட்டமைக்கப்பட்டன!',
    adminTotalProviders: 'மொத்த சேவை வழங்குநர்கள்',
    adminTotalApproved: 'அங்கீகரிக்கப்பட்டவர்கள்',
    adminTotalPending: 'ஒப்புதல் நிலுவை',
    adminTotalReviews: 'மொத்த மதிப்புரைகள்',

    // Skills
    skillElectrician: 'மின்சாரப் பணியாளர் (Electrician)',
    skillPlumber: 'குழாய் பழுதுபார்ப்பவர் (Plumber)',
    skillTailor: 'தையல்காரர் (Tailor)',
    skillTutor: 'ஆசிரியர் / டியூஷன் (Tutor)',
    skillCarpenter: 'தச்சர் (Carpenter)',
    skillAutoDriver: 'ஆட்டோ ஓட்டுநர் (Auto Driver)',
    skillOther: 'மற்றவை (Other)',

    // Availability
    availNow: 'இப்போது கிடைக்கும் (Available Now)',
    availToday: 'இன்று கிடைக்கும் (Available Today)',
    availThisWeek: 'இந்த வாரம் கிடைக்கும் (Available This Week)'
  },
  en: {
    appName: 'LocalConnect',
    appSubName: 'namma ஊர் சேவைகள்',
    tagline: 'Connect with trusted local service providers in your village or town',
    offlineReady: 'Offline Ready (Local Storage)',

    // Navigation
    navHome: 'Home',
    navSearch: 'Find Services',
    navRegister: 'Register as Provider',
    navAdmin: 'Admin',

    // Home Page
    homeHeroTitle: 'Find Trusted Local Service Providers in Your Village & Town',
    homeHeroDesc: 'Electricians, plumbers, tailors, tutors, carpenters, auto drivers, and more — trusted community handypersons a phone call away.',
    homeFindBtn: 'Find a Service',
    homeRegisterBtn: 'Register as Provider',
    homeCategoriesTitle: 'Popular Village Services',
    homeFeaturedTitle: 'Top-Rated Local Providers',
    homeWhyTitle: 'Why LocalConnect Village Directory?',
    homeWhy1Title: 'Direct Contact',
    homeWhy1Desc: 'Zero middlemen fees. Call or message local village workers directly on their personal phone.',
    homeWhy2Title: 'Community Ratings',
    homeWhy2Desc: 'Honest 1–5 star ratings and reviews written by your neighbors and fellow residents.',
    homeWhy3Title: 'Works Offline',
    homeWhy3Desc: 'Fully operational even in low-connectivity areas. Persists in your local browser storage.',

    // Search & Filter
    searchTitle: 'Search Local Service Providers',
    searchPlaceholder: 'Search by skill, name, or service...',
    filterLocationAll: 'All Locations',
    filterSkillAll: 'All Services',
    filterAvailabilityAll: 'All Availability',
    clearFilters: 'Clear Filters',
    resultsCount: 'verified local providers found',
    noProvidersFound: 'No service providers found',
    noProvidersHint: 'Try searching with a different skill keyword or changing your village filter.',
    resetSearch: 'Show all providers',

    // Provider Card
    contactBtn: 'Contact Provider',
    hideContactBtn: 'Hide Contact',
    callNow: 'Call Direct',
    whatsappMsg: 'WhatsApp Message',
    rateAndReview: 'Rate & Review',
    reviewsCountText: 'reviews',
    verifiedBadge: 'Verified',
    availableLabel: 'Availability',
    locationLabel: 'Location',

    // Provider Registration
    regTitle: 'Register as a Local Service Provider',
    regSubtitle: 'List your skills in the community directory and connect with residents needing your work. Subject to quick community admin review.',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'e.g. K. Murugan',
    phoneLabel: 'Mobile / Phone Number',
    phonePlaceholder: 'e.g. 9876543210',
    phoneHelper: '10-digit mobile number. Residents will use this to call you for jobs.',
    photoLabel: 'Profile Photo (Optional)',
    photoUploadPrompt: 'Click or drag & drop to upload profile photo',
    photoChangePrompt: 'Change Photo',
    photoRemovePrompt: 'Remove',
    skillLabel: 'Skill / Service Category',
    customSkillLabel: 'Specify Your Skill',
    customSkillPlaceholder: 'e.g. Painter, Mason, Two-Wheeler Mechanic',
    locationInputLabel: 'Village or Town Name',
    locationInputPlaceholder: 'e.g. Thanjavur, Pollachi, Karaikudi',
    availabilityLabel: 'Current Availability',
    experienceLabel: 'Experience in Years (Optional)',
    experiencePlaceholder: 'e.g. 8',
    bioLabel: 'Short Bio / Specialization (Optional)',
    bioPlaceholder: 'e.g. Specializing in domestic wiring, motor pump connections, and quick emergency repairs.',
    submitRegistration: 'Submit Provider Registration',
    submitting: 'Submitting...',
    regSuccessTitle: 'Registration Submitted Successfully!',
    regSuccessDesc: 'Your profile has been saved with status "pending". It will appear in the public search directory once approved by the village admin.',
    backToHome: 'Return to Home',
    viewStatusBtn: 'View Public Directory',
    errorNameRequired: 'Full name is required (minimum 2 characters)',
    errorPhoneInvalid: 'Please enter a valid 10-digit mobile number',
    errorPhoneDuplicate: 'This phone number is already registered! Please check or contact admin.',
    errorSkillRequired: 'Please select a skill / service category',
    errorLocationRequired: 'Please enter your village or town name',

    // Rating & Review Modal
    reviewsTitle: 'Ratings & Community Reviews',
    addReviewTitle: 'Leave a Rating & Review',
    ratingSelectPrompt: 'Select rating (1 to 5 stars):',
    reviewerNameLabel: 'Your Name',
    reviewerNamePlaceholder: 'e.g. Sundaram or Village Resident',
    reviewCommentLabel: 'Short Comment (Optional)',
    reviewCommentPlaceholder: 'Comment on punctuality, pricing, quality of work...',
    submitReviewBtn: 'Submit Review',
    closeModal: 'Close',
    noReviewsYet: 'No reviews yet for this provider. Be the first neighbor to leave feedback!',
    reviewAddedSuccess: 'Your review has been saved! Thank you for supporting local workers.',
    errorRatingRequired: 'Please select a rating between 1 and 5 stars',
    errorReviewerNameRequired: 'Please enter your name',

    // Admin Panel
    adminTitle: 'Village Community Admin Panel',
    adminSubtitle: 'Review and approve/reject newly submitted service provider profiles before they appear in public search.',
    adminPasswordPrompt: 'Enter Admin Password',
    adminPasswordPlaceholder: 'Password',
    adminLoginBtn: 'Sign In as Admin',
    adminLogoutBtn: 'Sign Out',
    adminInvalidPassword: 'Incorrect password! Use the demo password: admin123',
    adminPasswordHint: 'Demo Password: admin123',
    adminTabPending: 'Pending Approval',
    adminTabApproved: 'Approved Directory',
    adminTabStats: 'System Stats',
    adminApproveBtn: 'Approve Profile',
    adminRejectBtn: 'Reject / Remove',
    adminDeleteBtn: 'Delete Profile',
    adminApprovedSuccess: 'Provider has been approved and is now live in search!',
    adminRejectedSuccess: 'Provider has been rejected and removed.',
    adminNoPending: 'No pending provider signups at the moment. All caught up!',
    adminNoApproved: 'No approved providers found.',
    adminResetSeedBtn: 'Reset to Sample Seed Data',
    adminResetSeedConfirm: 'Are you sure you want to reset to the default 9 sample providers and initial reviews? All local edits will be reset.',
    adminResetSeedSuccess: 'Sample seed data has been restored successfully!',
    adminTotalProviders: 'Total Providers',
    adminTotalApproved: 'Approved Providers',
    adminTotalPending: 'Pending Approval',
    adminTotalReviews: 'Total Reviews Recorded',

    // Skills
    skillElectrician: 'Electrician',
    skillPlumber: 'Plumber',
    skillTailor: 'Tailor',
    skillTutor: 'Tutor',
    skillCarpenter: 'Carpenter',
    skillAutoDriver: 'Auto Driver',
    skillOther: 'Other',

    // Availability
    availNow: 'Available Now',
    availToday: 'Available Today',
    availThisWeek: 'Available This Week'
  }
};
