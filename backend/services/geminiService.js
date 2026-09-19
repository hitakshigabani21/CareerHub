const { GoogleGenerativeAI } = require('@google/generative-ai');

const SYSTEM_RULES = `You are editing an existing resume. Never fabricate information. Use only information explicitly present in the provided resume. You may reorder, shorten, rewrite, emphasize or improve wording, but you must not add unsupported experience, skills, projects, achievements, technologies, certifications or metrics.

Hard rules:
- Do NOT invent skills, projects, work experience, companies, technologies, achievements, certifications, metrics, education, or responsibilities.
- You may reorder sections and bullets so the most JD-relevant existing content appears first.
- You may rewrite wording for clarity and impact using only facts already in the resume.
- If the JD asks for something that is not in the resume, list it under missingFromResume. Do not add it to the tailored resume.
- Keep names, companies, dates, schools, and metrics exactly as they appear unless you are only tightening grammar.

Return ONLY valid JSON matching this shape (no markdown):
{
  "tailoredResume": {
    "name": "",
    "contact": "",
    "summary": "",
    "skills": [],
    "experience": [{ "title": "", "company": "", "dates": "", "bullets": [] }],
    "projects": [{ "name": "", "description": "", "bullets": [] }],
    "education": [{ "degree": "", "school": "", "dates": "", "details": "" }],
    "certifications": [],
    "other": ""
  },
  "explanation": {
    "changes": ["what changed"],
    "why": ["why it changed"],
    "jdInfluences": ["which JD requirements influenced the edits"],
    "prioritized": ["which existing skills/projects were prioritized"],
    "missingFromResume": ["important JD requirements missing from the resume"]
  }
}

If a section has no content in the original resume, use an empty array or empty string. Do not fill gaps with guesses.`;

function extractJson(text) {
  const cleaned = text.replace(/```json/gi, '```').replace(/```/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    throw Object.assign(new Error('The AI returned an unreadable response. Please try again.'), {
      statusCode: 502
    });
  }
  try {
    return JSON.parse(match[0]);
  } catch {
    throw Object.assign(new Error('The AI returned invalid JSON. Please try again.'), {
      statusCode: 502
    });
  }
}

function emptyResume() {
  return {
    name: '',
    contact: '',
    summary: '',
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    other: ''
  };
}

function normalizeResult(parsed) {
  const tailored = parsed.tailoredResume || {};
  const explanation = parsed.explanation || {};

  return {
    tailoredResume: {
      ...emptyResume(),
      ...tailored,
      skills: Array.isArray(tailored.skills) ? tailored.skills : [],
      experience: Array.isArray(tailored.experience) ? tailored.experience : [],
      projects: Array.isArray(tailored.projects) ? tailored.projects : [],
      education: Array.isArray(tailored.education) ? tailored.education : [],
      certifications: Array.isArray(tailored.certifications) ? tailored.certifications : []
    },
    explanation: {
      changes: Array.isArray(explanation.changes) ? explanation.changes : [],
      why: Array.isArray(explanation.why) ? explanation.why : [],
      jdInfluences: Array.isArray(explanation.jdInfluences) ? explanation.jdInfluences : [],
      prioritized: Array.isArray(explanation.prioritized) ? explanation.prioritized : [],
      missingFromResume: Array.isArray(explanation.missingFromResume)
        ? explanation.missingFromResume
        : []
    }
  };
}

async function tailorResume(jobDescription, resumeText) {
  if (!process.env.GEMINI_API_KEY) {
    throw Object.assign(new Error('GEMINI_API_KEY is not configured on the server'), {
      statusCode: 500
    });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json'
    }
  });

  const prompt = `${SYSTEM_RULES}

JOB DESCRIPTION:
${jobDescription}

EXISTING RESUME TEXT:
${resumeText}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return normalizeResult(extractJson(text));
  } catch (err) {
    if (err.statusCode) throw err;
    throw Object.assign(
      new Error(err.message || 'Gemini could not tailor this resume. Please try again.'),
      { statusCode: 502 }
    );
  }
}

module.exports = { tailorResume };
