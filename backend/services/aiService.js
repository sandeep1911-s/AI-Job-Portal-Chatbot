const Groq = require('groq-sdk');

function getClient() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;
    return new Groq({ apiKey });
}

// ─── Generate AI CV Summary ──────────────────────────────────────
async function generateCVSummary(cvData) {
    const client = getClient();
    if (!client) return 'AI service unavailable. Please set GROQ_API_KEY.';

    const prompt = `You are an expert professional resume writer. Based on the following candidate details, write a compelling 3-4 sentence professional summary for their CV/resume. Make it concise, impactful, and suitable for job applications.

Candidate Details:
- Name: ${cvData.full_name}
- Education: ${JSON.stringify(cvData.education)}
- Skills: ${(cvData.skills || []).join(', ')}
- Experience: ${JSON.stringify(cvData.experience)}
- Career Goals: ${cvData.career_goals || 'Not specified'}

Write ONLY the professional summary text, nothing else. No labels, no headers.`;

    try {
        const completion = await client.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
        });
        return completion.choices[0].message.content.trim();
    } catch (err) {
        console.error('AI CV Summary error:', err.message);
        return 'Experienced professional with a diverse skill set seeking opportunities for growth and impact.';
    }
}

// ─── Get Job Suggestions Based on Skills ─────────────────────────
async function getJobSuggestions(skills, experience, availableJobs) {
    const client = getClient();
    if (!client) return getMockJobSuggestions();

    const prompt = `You are an expert career advisor. Based on the candidate's skills and experience, suggest job roles that would be a great fit.

To ensure varied and diverse suggestions, please consider different angles or aspects of the candidate's profile and do not suggest the exact same roles every time. (Randomization Seed: ${Math.random()})

Candidate Skills: ${(skills || []).join(', ')}
Candidate Experience: ${JSON.stringify(experience || [])}

Available Job Openings:
${availableJobs.map((j, i) => `${i + 1}. "${j.title}" at ${j.company} - Required: ${(j.skills_required || []).join(', ')}`).join('\n')}

Return a JSON object with this exact structure:
{
  "suggestions": [
    {
      "job_id": <number or null if general suggestion>,
      "title": "<job title>",
      "company": "<company or 'Various'>",
      "match_score": <1-100>,
      "reason": "<1 sentence why this is a good fit>"
    }
  ]
}

Include matches from available jobs first, then suggest 2-3 general roles. Return ONLY valid JSON.`;

    try {
        const completion = await client.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.9,
            response_format: { type: 'json_object' },
        });
        return JSON.parse(completion.choices[0].message.content);
    } catch (err) {
        console.error('AI Job Suggestions error:', err.message);
        return getMockJobSuggestions();
    }
}

// ─── Get Skill Suggestions for Future Growth ─────────────────────
async function getSkillSuggestions(currentSkills, careerGoals) {
    const client = getClient();
    if (!client) return getMockSkillSuggestions();

    const prompt = `You are an expert career advisor and industry analyst. Based on the candidate's current skills and career goals, suggest skills they should learn for future career growth.

Current Skills: ${(currentSkills || []).join(', ')}
Career Goals: ${careerGoals || 'General career growth'}

Return a JSON object with this exact structure:
{
  "skill_suggestions": [
    {
      "skill": "<skill name>",
      "category": "<Technical/Soft/Domain>",
      "priority": "<High/Medium/Low>",
      "reason": "<1-2 sentences why this skill is valuable>",
      "resources": "<1 recommended learning resource>"
    }
  ]
}

Suggest 6-8 skills. Focus on trending, future-proof skills. Return ONLY valid JSON.`;

    try {
        const completion = await client.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' },
        });
        return JSON.parse(completion.choices[0].message.content);
    } catch (err) {
        console.error('AI Skill Suggestions error:', err.message);
        return getMockSkillSuggestions();
    }
}

// ─── Chat with AI ────────────────────────────────────────────────
async function getChatResponse(message, history = []) {
    const client = getClient();
    if (!client) return 'AI Service Unavailable: API Key not found.';

    const messages = [
        { role: 'system', content: 'You are a helpful AI Career Counselor for a job portal. Help users with career advice, resume tips, interview preparation, and job search strategies.' },
    ];

    for (const msg of history) {
        const role = msg.role === 'model' ? 'assistant' : msg.role;
        const content = Array.isArray(msg.parts) ? msg.parts.join(' ') : String(msg.parts || msg.content || '');
        messages.push({ role, content });
    }

    messages.push({ role: 'user', content: message });

    try {
        const completion = await client.chat.completions.create({
            messages,
            model: 'llama-3.3-70b-versatile',
        });
        return completion.choices[0].message.content;
    } catch (err) {
        console.error('AI Chat error:', err.message);
        return 'Sorry, I am having trouble connecting right now. Please try again later.';
    }
}

// ─── Mock Data ───────────────────────────────────────────────────
function getMockJobSuggestions() {
    const allSuggestions = [
        { job_id: null, title: 'Full Stack Developer', company: 'Various', match_score: 85, reason: 'Strong match with your technical skills.' },
        { job_id: null, title: 'Software Engineer', company: 'Various', match_score: 80, reason: 'Good fit for your experience level.' },
        { job_id: null, title: 'Frontend Developer', company: 'Various', match_score: 75, reason: 'Aligns with your UI/UX interests.' },
        { job_id: null, title: 'Backend Developer', company: 'Various', match_score: 78, reason: 'Matches your server-side programming skills.' },
        { job_id: null, title: 'DevOps Engineer', company: 'Various', match_score: 70, reason: 'Good alignment with your infrastructure knowledge.' },
        { job_id: null, title: 'Product Manager', company: 'Various', match_score: 65, reason: 'Leverages your combined technical and business acumen.' }
    ];
    // Shuffle and pick 3
    const shuffled = allSuggestions.sort(() => 0.5 - Math.random());
    return {
        suggestions: shuffled.slice(0, 3)
    };
}

function getMockSkillSuggestions() {
    return {
        skill_suggestions: [
            { skill: 'Cloud Computing (AWS/Azure)', category: 'Technical', priority: 'High', reason: 'Cloud skills are in high demand across all industries.', resources: 'AWS Free Tier + Coursera' },
            { skill: 'System Design', category: 'Technical', priority: 'High', reason: 'Essential for senior engineering roles.', resources: 'Designing Data-Intensive Applications book' },
            { skill: 'Communication', category: 'Soft', priority: 'Medium', reason: 'Critical for team collaboration and leadership.', resources: 'Toastmasters or Dale Carnegie courses' },
        ],
    };
}

module.exports = { generateCVSummary, getJobSuggestions, getSkillSuggestions, getChatResponse };
