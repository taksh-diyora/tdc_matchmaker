import fs from 'fs';

// 1. Read the existing clients.json
const rawData = fs.readFileSync('./data/clients.json', 'utf-8');
const clients = JSON.parse(rawData);

// Helpers to map existing nested data to the strict flat enums required by matchAlgorithm.js
const getZone = (state) => {
    const zones = {
        "Delhi": "North", "Punjab": "North", "Haryana": "North", "Rajasthan": "North", "Uttar Pradesh": "North", "Bihar": "East", "Jharkhand": "East", "Chandigarh": "North",
        "Maharashtra": "West", "Gujarat": "West", "Goa": "West",
        "Karnataka": "South", "Telangana": "South", "Tamil Nadu": "South", "Kerala": "South", "Andhra Pradesh": "South",
        "West Bengal": "East", "Assam": "East", "Odisha": "East",
        "Madhya Pradesh": "Central", "Chhattisgarh": "Central"
    };
    return zones[state] || "Unknown";
};

const getLanguageFamily = (lang) => {
    const dravidian = ["Telugu", "Tamil", "Kannada", "Malayalam"];
    return dravidian.includes(lang) ? "Dravidian" : "Indo-Aryan";
};

const getEducationTier = (ug, pg) => {
    if (!pg || pg === "None") return "Graduate"; // Defaults for B.Tech, B.Com, BA, etc.
    const pgTier = ["MBA", "M.Sc", "M.Com", "MA", "MCA", "PGDM", "LLM", "MD", "M.Ed", "CA", "M.Tech", "MS"];
    const phdTier = ["Ph.D", "PhD"];

    if (phdTier.includes(pg)) return "PhD";
    if (pgTier.some(tier => pg.includes(tier))) return "Postgraduate";
    return "Graduate"; 
};

const getTimeline = (timelineStr) => {
    if (!timelineStr) return "1-2 years";
    if (timelineStr.includes("6 months")) return "< 6 months";
    if (timelineStr.includes("1 year")) return "6-12 months";
    if (timelineStr.includes("1-2") || timelineStr.includes("2 years")) return "1-2 years";
    return "2+ years";
};

const getLivingArrangement = (arrangement) => {
    if (arrangement === "Nuclear family post-marriage") return "Nuclear";
    if (arrangement === "Joint Family") return "Joint";
    return "Flexible";
};

const getSmoking = (smoking) => {
    if (smoking === "No") return "Non-smoker";
    if (smoking === "Regularly") return "Regular";
    return "Occasional";
};

const getDrinking = (drinking) => {
    if (drinking === "No") return "Abstain";
    if (drinking === "Regularly") return "Regularly";
    return "Occasionally";
};

const getWorkIntent = (gender, intent) => {
    if (intent !== "Yes") return "Flexible";
    return gender === "Male" ? "Supports partner working" : "Wants to work";
};

// 2. Map and flatten the properties
const modifiedClients = clients.map(client => {
    return {
        // Core Identity
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        fullName: client.fullName,
        age: client.age,
        dateOfBirth: client.dateOfBirth,
        gender: client.gender,
        maritalStatus: client.maritalStatus,
        wantKids: client.wantKids,
        about: client.about,
        contact: client.contact,

        // --- FLATTENED & ALIGNED FIELDS FOR matchAlgorithm.js ---
        
        // Religion & Community
        religion: client.culturalBackground.religion,
        varna: client.culturalBackground.caste, 
        jati: client.culturalBackground.subCaste !== "Not Specified" ? client.culturalBackground.subCaste : client.culturalBackground.caste,
        gotra: client.culturalBackground.gotra !== "Not Specified" ? client.culturalBackground.gotra : null,
        sect: client.culturalBackground.subCaste !== "Not Specified" ? client.culturalBackground.subCaste : null,
        
        // Languages
        motherTongue: client.culturalBackground.motherTongue,
        languageFamily: getLanguageFamily(client.culturalBackground.motherTongue),
        fluentLanguages: client.culturalBackground.languages,
        
        // Timeline & Values
        timelineToMarry: getTimeline(client.platformMetadata.timelineToMarry),
        familyValues: client.familyDetails.familyValues,
        livingArrangement: getLivingArrangement(client.familyDetails.livingArrangementPreference),
        
        // Lifestyle
        diet: client.lifestyleAndHabits.diet === "Jain" ? "Jain Veg" : client.lifestyleAndHabits.diet,
        drinking: getDrinking(client.lifestyleAndHabits.drinkingHabits),
        smoking: getSmoking(client.lifestyleAndHabits.smokingHabits),
                 
        // Physical Attributes
        heightCm: client.physicalAttributes.height, // String format handled safely by `parseHeightCm` in algorithm
        openToPets: client.physicalAttributes.openToPets === "Yes",
        
        // Education & Career
        educationTier: getEducationTier(client.educationAndCareer.degree, client.educationAndCareer.pgDegree),
        isTopInstitution: ["IIT", "NIT", "BITS", "IIM", "NID", "NLU", "SRCC", "VJTI", "Medical College"].some(top => client.educationAndCareer.ugCollege.includes(top)),
        income: client.educationAndCareer.income, // Handled safely by `parseIncome`
        workPostMarriageIntent: getWorkIntent(client.gender, client.educationAndCareer.workingPostMarriage),
        
        // Location specifics
        city: client.location.city,
        metroRegion: client.location.city, 
        state: client.location.state,
        zone: getZone(client.location.state),
        country: "India",
        openToRelocation: client.location.relocationFlexibility.toLowerCase().includes("flexible") || client.location.relocationFlexibility.toLowerCase().includes("open"),
        
        // Astrology
        horoscopeMatchingRequired: client.astrology.horoscopeMatchingRequired,
        isManglik: client.astrology.manglikStatus === "Yes",

        // --- PLATFORM METADATA ---
        platformMetadata: client.platformMetadata
    };
});

// 3. Save the modified JSON
fs.writeFileSync('./data/clients_modified.json', JSON.stringify(modifiedClients, null, 2));
console.log(`Successfully migrated ${modifiedClients.length} profiles to align with matchAlgorithm.js!`);