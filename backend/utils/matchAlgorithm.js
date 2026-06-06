const WEIGHTS = {
    religion:           { male: 8,  female: 8 },
    casteOrCommunity:   { male: 7,  female: 7 },
    motherTongue:       { male: 4,  female: 3 },  // Depends upon primary client and other candidate
    wantKids:           { male: 12, female: 12 },
    timelineToMarry:    { male: 6,  female: 6 },
    familyValues:       { male: 6,  female: 7 },  // Depends upon primary client and other candidate
    livingArrangement:  { male: 4,  female: 5 },  // Depends upon primary client and other candidate
    diet:               { male: 7,  female: 5 },  // Depends upon primary client and other candidate
    drinking:           { male: 3,  female: 4 },  // Depends upon primary client and other candidate
    smoking:            { male: 2,  female: 3 },  // Depends upon primary client and other candidate
    ageGap:             { male: 9,  female: 4 },  // Depends upon primary client and other candidate
    height:             { male: 6,  female: 2 },  // Depends upon primary client and other candidate
    education:          { male: 4,  female: 6 },  // Depends upon primary client and other candidate
    income:             { male: 5,  female: 11 }, // Depends upon primary client and other candidate
    workPostMarriage:   { male: 3,  female: 3 },
    cityRegion:         { male: 5,  female: 5 },
    relocation:         { male: 3,  female: 3 },
    manglik:            { male: 4,  female: 4 },
    horoscopeAlignment: { male: 2,  female: 2 }
};

// Helper to parse numbers from strings like "12 LPA", "50k"
const parseIncome = (incomeStr) => {
    if (!incomeStr) return 0;
    const match = incomeStr.toString().match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
};

// Helper to parse height to cm
const parseHeightCm = (heightStr) => {
    if (!heightStr) return 0;
    const match = heightStr.toString().match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
};

const evaluators = {
    religion: (p, c) => {
        const r1 = p.religion?.toLowerCase() || '';
        const r2 = c.religion?.toLowerCase() || '';
        
        if (r1 === r2) return { multiplier: 1.0 };
        
        const isDharmic1 = ['hindu', 'jain', 'sikh', 'buddhist'].includes(r1);
        const isDharmic2 = ['hindu', 'jain', 'sikh', 'buddhist'].includes(r2);
        if (isDharmic1 && isDharmic2) return { multiplier: 0.63 };

        const isSecular1 = ['secular', 'agnostic'].includes(r1);
        const isSecular2 = ['secular', 'agnostic'].includes(r2);
        
        if (isSecular1 && isSecular2) return { multiplier: 0.63 };
        if (isSecular1 || isSecular2) return { multiplier: 0.25 };
        
        return { multiplier: 0.0, dealbreaker: "religion_mismatch" };
    },
    casteOrCommunity: (p, c) => {
        if (p.religion !== c.religion) return { multiplier: 0.25 };
        const r = p.religion?.toLowerCase();

        if (r === 'hindu') {
            if (p.jati === c.jati && p.gotra !== c.gotra) return { multiplier: 1.0 };
            if (p.varna === c.varna && p.jati !== c.jati && p.gotra !== c.gotra) return { multiplier: 0.63 };
            if (p.jati === c.jati && p.gotra === c.gotra) return { multiplier: 0.25 }; // Gotra exogamy violation
            if (p.varna !== c.varna && p.gotra !== c.gotra) return { multiplier: 0.25 };
        } else if (r === 'muslim') {
            if (p.sect === c.sect && p.community === c.community) return { multiplier: 1.0 };
            if (p.sect === c.sect && p.community !== c.community) return { multiplier: 0.75 };
            if (p.sect !== c.sect) return { multiplier: 0.25 };
        } else if (r === 'christian') {
            if (p.denomination === c.denomination) return { multiplier: 1.0 };
            return { multiplier: 0.63 }; // Simplification for Christian denominations
        } else if (r === 'jain') {
            return p.sect === c.sect ? { multiplier: 1.0 } : { multiplier: 0.5 };
        } else if (r === 'sikh') {
            return p.subCommunity === c.subCommunity ? { multiplier: 1.0 } : { multiplier: 0.63 };
        }
        
        return { multiplier: 0.25 };
    },
    motherTongue: (p, c) => {
        if (p.motherTongue === c.motherTongue) return { multiplier: 1.0 };
        if (p.languageFamily === c.languageFamily) return { multiplier: 0.67 };
        if (p.fluentLanguages?.some(l => c.fluentLanguages?.includes(l))) return { multiplier: 0.33 };
        return { multiplier: 0.0 };
    },
    wantKids: (p, c) => {
        const map = { 'Yes': 2, 'Maybe': 1, 'No': 0 };
        const v1 = map[p.wantKids], v2 = map[c.wantKids];
        
        if (v1 === 2 && v2 === 2) return { multiplier: 1.0 };
        if (v1 === 0 && v2 === 0) return { multiplier: 1.0 };
        if (v1 === 1 && v2 === 1) return { multiplier: 0.6 };
        if ((v1 === 2 && v2 === 1) || (v1 === 1 && v2 === 2)) return { multiplier: 0.4 };
        if ((v1 === 0 && v2 === 1) || (v1 === 1 && v2 === 0)) return { multiplier: 0.3 };
        
        return { multiplier: 0.0, dealbreaker: "kids_mismatch" }; // One Yes, One No
    },
    timelineToMarry: (p, c) => {
        const brackets = ["< 6 months", "6-12 months", "1-2 years", "2+ years"];
        const i1 = brackets.indexOf(p.timelineToMarry);
        const i2 = brackets.indexOf(c.timelineToMarry);
        
        if (i1 === -1 || i2 === -1) return { multiplier: 0.5 }; // Fallback
        const diff = Math.abs(i1 - i2);
        
        if (diff === 0) return { multiplier: 1.0 };
        if (diff === 1) return { multiplier: 0.57 };
        if (diff === 2) return { multiplier: 0.14 };
        return { multiplier: 0.0 };
    },
    familyValues: (p, c) => {
        const v1 = p.familyValues, v2 = c.familyValues;
        if (v1 === v2) return { multiplier: 1.0 };
        if ((v1 === 'Traditional' && v2 === 'Liberal') || (v1 === 'Liberal' && v2 === 'Traditional')) return { multiplier: 0.0 };
        return { multiplier: 0.6 };
    },

    livingArrangement: (p, c) => {
        const l1 = p.livingArrangement, l2 = c.livingArrangement;
        if (l1 === l2) return { multiplier: 1.0 };
        if (l1 === 'Flexible' || l2 === 'Flexible') return { multiplier: 0.75 };
        return { multiplier: 0.0, dealbreaker: "living_arrangement_conflict" };
    },

    diet: (p, c) => {
        const r1 = p.religion?.toLowerCase();
        const r2 = c.religion?.toLowerCase();
        const d1 = p.diet, d2 = c.diet;

        if (r1 !== r2) {
            if (d1 === d2) return { multiplier: 0.63 };
            return { multiplier: 0.38 }; // Fallback compromise
        }

        if (r1 === 'hindu') {
            if (d1 === 'Pure Veg' && d2 === 'Pure Veg') return { multiplier: 1.0 };
            if (d1 === 'Veg' && d2 === 'Veg') return { multiplier: 0.88 };
            if ((d1 === 'Pure Veg' && d2 === 'Veg') || (d1 === 'Veg' && d2 === 'Pure Veg')) return { multiplier: 0.5 };
            if (d1 === 'Non-Veg' && d2 === 'Non-Veg') return { multiplier: 0.63 };
            if ((d1 === 'Veg' && d2 === 'Non-Veg') || (d1 === 'Non-Veg' && d2 === 'Veg')) return { multiplier: 0.13 };
            return { multiplier: 0.0, dealbreaker: "diet_conflict" };
        }

        if (r1 === 'jain') {
            if (d1 === 'Jain Veg' && d2 === 'Jain Veg') return { multiplier: 1.0 };
            if ((d1 === 'Jain Veg' && d2 === 'Pure Veg') || (d1 === 'Pure Veg' && d2 === 'Jain Veg')) return { multiplier: 0.63 };
            if (d1 === 'Pure Veg' && d2 === 'Pure Veg') return { multiplier: 0.5 };
            return { multiplier: 0.0, dealbreaker: "diet_conflict" };
        }

        if (r1 === 'muslim') {
            if (d1 === d2) return { multiplier: 1.0 };
            if (d1 === 'Non-Veg' && d2 === 'Non-Veg') return { multiplier: 0.88 };
            if ((d1 === 'Veg' && d2 === 'Non-Veg') || (d1 === 'Non-Veg' && d2 === 'Veg')) return { multiplier: 0.63 };
            return { multiplier: 0.13 };
        }

        // Christian, Sikh, Other
        if (d1 === d2) return { multiplier: 1.0 };
        if ((d1 === 'Veg' && d2 === 'Non-Veg') || (d1 === 'Non-Veg' && d2 === 'Veg')) return { multiplier: 0.5 };
        return { multiplier: 0.75 };
    },

    drinking: (p, c) => {
        const d1 = p.drinking, d2 = c.drinking;
        if (d1 === d2) {
            return (d1 === 'Regularly') ? { multiplier: 0.75 } : { multiplier: 1.0 };
        }
        if ((d1 === 'Abstain' && d2 === 'Regularly') || (d1 === 'Regularly' && d2 === 'Abstain')) return { multiplier: 0.0 };
        return { multiplier: 0.5 };
    },

    smoking: (p, c) => {
        const s1 = p.smoking, s2 = c.smoking;
        if (s1 === 'Non-smoker' && s2 === 'Non-smoker') return { multiplier: 1.0 };
        if (s1 === 'Smoker' && s2 === 'Smoker') return { multiplier: 0.5 };
        if ((s1 === 'Non-smoker' && s2 === 'Regular') || (s1 === 'Regular' && s2 === 'Non-smoker')) return { multiplier: 0.0 };
        return { multiplier: 0.25 };
    },

    ageGap: (p, c) => {
        const diff = p.age - c.age;
        if (p.gender === 'Male') {
            if (diff >= 2 && diff <= 5) return { multiplier: 1.0 };
            if (diff >= 0 && diff < 2) return { multiplier: 0.78 };
            if (diff > 5 && diff <= 10) return { multiplier: 0.56 };
            if (diff >= -1 && diff < 0) return { multiplier: 0.56 };
            if (diff >= -3 && diff < -1) return { multiplier: 0.33 };
            if (diff >= -7 && diff < -3) return { multiplier: 0.11 };
            return { multiplier: 0.0 };
        } else {
            // Female Primary
            if (diff >= -7 && diff <= -2) return { multiplier: 1.0 };
            if (diff > -2 && diff <= 0) return { multiplier: 0.75 };
            if (diff > 0 && diff <= 1) return { multiplier: 0.5 };
            if (diff >= -12 && diff < -7) return { multiplier: 0.5 };
            if (diff > 1 && diff <= 3) return { multiplier: 0.25 };
            return { multiplier: 0.0 };
        }
    },

    height: (p, c) => {
        const h1 = parseHeightCm(p.heightCm);
        const h2 = parseHeightCm(c.heightCm);
        const diff = h1 - h2;

        if (p.gender === 'Male') {
            if (diff > 10) return { multiplier: 1.0 };
            if (diff >= 5 && diff <= 10) return { multiplier: 0.83 };
            if (diff >= 0 && diff < 5) return { multiplier: 0.67 };
            if (diff >= -3 && diff < 0) return { multiplier: 0.5 };
            if (diff >= -8 && diff < -3) return { multiplier: 0.33 };
            return { multiplier: 0.0 };
        } else {
            // Female Primary
            if (diff < -8) return { multiplier: 1.0 };
            if (diff >= -8 && diff < -3) return { multiplier: 1.0 };
            if (diff >= -3 && diff <= 0) return { multiplier: 1.0 };
            if (diff > 0 && diff <= 3) return { multiplier: 0.5 };
            return { multiplier: 0.0 };
        }
    },

    education: (p, c) => {
        const tiers = { "High School": 0, "Diploma": 1, "Graduate": 2, "Postgraduate": 3, "PhD": 4 };
        let t1 = tiers[p.educationTier] ?? 2;
        let t2 = tiers[c.educationTier] ?? 2;
        
        // Handling B.Tech/B.E from top institution as Postgraduate
        if (p.isTopInstitution && t1 === 2) t1 = 3;
        if (c.isTopInstitution && t2 === 2) t2 = 3;

        const diff = Math.abs(t1 - t2);
        if (diff === 0) return { multiplier: 1.0 };
        if (diff === 1) return { multiplier: 0.75 };
        if (diff === 2) return { multiplier: 0.5 };
        return { multiplier: 0.0 };
    },

    income: (p, c) => {
        const i1 = parseIncome(p.income);
        const i2 = parseIncome(c.income);

        if (p.gender === 'Male') {
            if (i2 === 0) return { multiplier: 0.8 };
            if (i1 === 0) return { multiplier: 0.2 }; // Primary male has no income, penalty
            const ratio = i2 / i1;
            if (ratio < 0.5) return { multiplier: 1.0 };
            if (ratio >= 0.5 && ratio < 0.8) return { multiplier: 0.8 };
            if (ratio >= 0.8 && ratio <= 1.0) return { multiplier: 0.6 };
            if (ratio > 1.0 && ratio <= 1.3) return { multiplier: 0.4 };
            return { multiplier: 0.2 };
        } else {
            // Female Primary
            if (i2 === 0) return { multiplier: 0.0 };
            if (i1 === 0) return { multiplier: 1.0 }; // Female has no income, male earning anything is positive
            const ratio = i2 / i1;
            if (ratio >= 1.5) return { multiplier: 1.0 };
            if (ratio >= 1.2 && ratio < 1.5) return { multiplier: 0.82 };
            if (ratio >= 1.0 && ratio < 1.2) return { multiplier: 0.64 };
            if (ratio >= 0.9 && ratio < 1.0) return { multiplier: 0.45 };
            return { multiplier: 0.18 };
        }
    },

    workPostMarriage: (p, c) => {
        const p1 = p.workPostMarriageIntent, c1 = c.workPostMarriageIntent;
        if (p1 === 'Flexible') {
            return c1 === 'Wants to work' ? { multiplier: 1.0 } : { multiplier: 0.75 };
        }
        if (p1 === 'Supports partner working' && c1 === 'Wants to work') return { multiplier: 1.0 };
        if (p1 === 'Prefers homemaker' && c1 === 'Wants homemaker') return { multiplier: 1.0 };
        return { multiplier: 0.0 };
    },

    cityRegion: (p, c) => {
        if (p.city === c.city) return { multiplier: 1.0 };
        if (p.metroRegion === c.metroRegion) return { multiplier: 0.8 };
        if (p.state === c.state) return { multiplier: 0.6 };
        if (p.zone === c.zone) return { multiplier: 0.4 };
        if (p.country === c.country) return { multiplier: 0.2 };
        return { multiplier: 0.0 };
    },

    relocation: (p, c) => {
        const r1 = p.openToRelocation, r2 = c.openToRelocation;
        if (r1 && r2) return { multiplier: 1.0 };
        if (!r1 && !r2) {
            return p.city === c.city ? { multiplier: 1.0 } : { multiplier: 0.0 };
        }
        // One flexible
        return { multiplier: 0.67 };
    },

    manglik: (p, c) => {
        if (p.horoscopeMatchingRequired) {
            if (p.isManglik === c.isManglik) return { multiplier: 1.0 };
            return { multiplier: 0.0, dealbreaker: "manglik_conflict" };
        }
        return p.isManglik === c.isManglik ? { multiplier: 0.5 } : { multiplier: 0.25 };
    },

    horoscopeAlignment: (p, c) => {
        const h1 = p.horoscopeMatchingRequired, h2 = c.horoscopeMatchingRequired;
        if (h1 && h2) return { multiplier: 1.0 };
        if (!h1 && !h2) return { multiplier: 1.0 };
        return { multiplier: 0.5 };
    }
};

export const REASON_MAP = {
    religion: "Both share similar religious values",
    casteOrCommunity: "Strong cultural compatibility",
    motherTongue: "Shared language background",
    wantKids: "Aligned family planning goals",
    timelineToMarry: "Similar marriage timelines",
    familyValues: "Compatible family values",
    livingArrangement: "Similar lifestyle expectations",
    diet: "Compatible dietary preferences",
    drinking: "Similar lifestyle habits",
    smoking: "Similar lifestyle habits",
    ageGap: "Comfortable age compatibility",
    height: "Compatible physical preferences",
    education: "Similar educational background",
    income: "Financial compatibility",
    workPostMarriage: "Aligned career expectations",
    cityRegion: "Geographic compatibility",
    relocation: "Compatible relocation preferences",
    manglik: "Astrological compatibility",
    horoscopeAlignment: "Similar horoscope expectations"
};

export const calculateMatchScore = (primaryProfile, candidateProfile) => {
    // Determine gender context for both to fetch fair weights
    const pGender = primaryProfile.gender?.toLowerCase() === 'female' ? 'female' : 'male';
    const cGender = candidateProfile.gender?.toLowerCase() === 'female' ? 'female' : 'male';
    
    let totalScore = 0;
    let dealbreakers = [];
    let breakdown = {};

    // Evaluate each of the 19 fields
    for (const fieldName of Object.keys(WEIGHTS)) {
        const wP = WEIGHTS[fieldName][pGender];
        const wC = WEIGHTS[fieldName][cGender];
        const evaluate = evaluators[fieldName];
        
        let multiplier = 0;
        
        if (evaluate) {
            const result = evaluate(primaryProfile, candidateProfile);
            multiplier = result.multiplier;
            
            if (result.dealbreaker) {
                dealbreakers.push(result.dealbreaker);
            }
        }
        
        let points = 0;
        let effectiveWeight = wP; 
        
        // New Logic: Check if weights are the same or different
        if (wP === wC) {
            // Same weight: calculated the same as the original algorithm
            points = multiplier * wP;
        } else {
            // Different weights: calculate separate scores and take the average
            const scorePrimary = multiplier * wP;
            const scoreCandidate = multiplier * wC;
            points = (scorePrimary + scoreCandidate) / 2;
            effectiveWeight = (wP + wC) / 2; // Store the averaged weight for the breakdown
        }
        
        totalScore += points;

        breakdown[fieldName] = {
            multiplier: parseFloat(multiplier.toFixed(2)),
            weight: effectiveWeight, // Reflects the fair/averaged weight used
            primaryWeight: wP,
            candidateWeight: wC,
            points: parseFloat(points.toFixed(2))
        };
    }

    // Round total score to 1 decimal place
    totalScore = Math.round(totalScore * 10) / 10;

    // Determine Score Label
    let scoreLabel = "Poor";
    if (totalScore >= 85) scoreLabel = "Excellent";
    else if (totalScore >= 70) scoreLabel = "Good";
    else if (totalScore >= 55) scoreLabel = "Moderate";

    return {
        totalScore,
        scoreLabel,
        hasDealbreaker: dealbreakers.length > 0,
        dealbreakers,
        breakdown
    };
};

export const getTopReasons = (breakdown) => {
    return Object.entries(breakdown)
        .filter(([_, value]) => value.points > 0)
        .sort(
            (a, b) =>
                b[1].points - a[1].points
        )
        .slice(0, 5)
        .map(
            ([field]) =>
                REASON_MAP[field]
        );
};