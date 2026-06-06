import axios from "axios";

export const generateIntroEmail = async (req, res) => {
    try {

        const {
            client,
            match,
            compatibilityScore,
            reasons = []
        } = req.body;

        if (!client || !match) {
            return res.status(400).json({
                success: false,
                message: "Client and match data are required"
            });
        }

        const prompt = `
You are a professional matrimonial matchmaker.

Write an email to the primary client informing them about a potential match.

PRIMARY CLIENT

Name: ${client.fullName}
Age: ${client.age}
City: ${client.city}
Profession: ${client.designation || client.profession || "Not specified"}

SUGGESTED MATCH

Name: ${match.fullName}
Age: ${match.age}
City: ${match.city}
Profession: ${match.designation || match.profession || "Not specified"}

ADDITIONAL MATCH DETAILS

Religion: ${match.religion}
Education: ${match.degree}
Income: ${match.income}
Family Values: ${match.familyValues}
Want Kids: ${match.wantKids}

COMPATIBILITY SCORE

${compatibilityScore}/100

WHY THIS MATCH WAS SELECTED

${reasons.map(reason => `- ${reason}`).join("\n")}

INSTRUCTIONS

1. Address the email directly to ${client.fullName}.
2. Introduce ${match.fullName} as a potential match.
3. Mention key details about the suggested match naturally.
4. Explain why the match was selected using the compatibility reasons above.
5. Mention the compatibility score naturally.
6. Keep the tone warm, professional and encouraging.
7. Do NOT include placeholders such as [Your Name].
8. Do NOT include contact information.
9. Do NOT ask both parties to contact each other.
10. Return ONLY the email body.
11. Length should be approximately 100-120 words.

Generate the email now.
`;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "meta-llama/llama-3.3-70b-instruct",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const emailBody =
            response.data.choices?.[0]?.message?.content ||
            "Unable to generate email.";

        return res.status(200).json({
            success: true,
            emailSubject: `Potential Match for ${client.fullName}`,
            emailBody
        });

    } catch (error) {

        console.log(
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "AI generation failed"
        });
    }
};