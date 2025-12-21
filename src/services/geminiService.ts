import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserProfile, Job } from '../types';

let genAI: GoogleGenerativeAI | null = null;

// Initialize client safely
const getGenAI = () => {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      genAI = new GoogleGenerativeAI(apiKey);
      console.log('✅ Gemini AI initialized');
    } else {
      console.error('❌ VITE_GEMINI_API_KEY not found in .env.local');
    }
  }
  return genAI;
};

export const generateBioImprovement = async (currentBio: string, skills: string[]): Promise<string> => {
  const genAI = getGenAI();
  if (!genAI) return "AI Service Unavailable. Please check your API key in .env.local";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Act as a professional career coach for Ethiopian university students.
      Rewrite the following student bio to be more professional for LinkedIn and job applications.
      Highlight these skills: ${skills.join(', ')}.
      Keep it under 60 words.
      
      Current Bio: "${currentBio}"`;

    const result = await model.generateContent(prompt);
    return result.response.text() || currentBio;
  } catch (error) {
    console.error("Gemini Error (Bio):", error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

export const generateResume = async (profile: UserProfile): Promise<string> => {
  const genAI = getGenAI();
  if (!genAI) return "AI Service Unavailable";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Use escaped backticks or single quotes where possible to avoid template literal collisions
    const prompt = `Act as a Top-Tier Resume Writer with expertise in the international tech job market. 
      Write a professional resume for an Ethiopian University Student based on the data below.
      
      **Transformation Rules:**
      1. Use strong Action Verbs (e.g., "Architected," "Engineered," "Spearheaded").
      2. Quantify results where possible (even if inferred, e.g., "improving efficiency by 20%").
      3. Organize Skills into categories (Languages, Frameworks, Tools).
      4. Write a compelling Professional Summary that positions them as a rising talent.
      5. **Output strictly as a clean, styled HTML string** (do NOT use code blocks, just return the raw HTML string). Use <h3> for sections, <ul> for lists, <strong> for emphasis. Do not use <h1> or <h2>, start with <h3>.

      **Profile Data:**
      - Name: ${profile.name}
      - Education: ${profile.department} at ${profile.university} (Batch ${profile.batch})
      - Bio: ${profile.bio}
      - Skills: ${profile.skills.map(s => `${s.name} (${s.level})`).join(', ')}
      - Projects: ${profile.projects.map(p => `${p.title}: ${p.description}`).join('; ')}
      - Experience Examples (if any): ${profile.experience?.map(e => `${e.role} at ${e.company}`).join(', ') || 'None provided, focus on academic projects'}

      **Required Sections (HTML) inside a <div>:**
      <div class="resume-header">
         <h2 style="margin-bottom:0">${profile.name}</h2>
         <p><strong>${profile.department} Undergraduate | ${profile.university}</strong></p>
      </div>
      <hr/>
      <h3>Professional Summary</h3>
      ...
      <h3>Technical Skills</h3>
      ...
      <h3>Featured Projects</h3>
      ...
      <h3>Education</h3>
      ...`;

    const result = await model.generateContent(prompt);
    return result.response.text() || "Could not generate resume.";
  } catch (error) {
    console.error("Gemini Error (Resume):", error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

export const getJobMatchAdvice = async (profile: UserProfile, job: Job): Promise<string> => {
  const genAI = getGenAI();
  if (!genAI) return "AI Service Unavailable";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze the match between this student and this job. Give 3 short, actionable bullet points of advice on how they should apply.
      Student: ${profile.department} student, skills: ${profile.skills.map(s => s.name).join(', ')}.
      Job: ${job.title} at ${job.company}, seeking ${job.tags.join(', ')}. Description: ${job.description}.
      Context: Ethiopian job market.`;

    const result = await model.generateContent(prompt);
    return result.response.text() || "No advice generated.";
  } catch (error) {
    console.error("Gemini Error (Job Match):", error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

export const chatWithMentor = async (message: string, context: string): Promise<string> => {
  const genAI = getGenAI();
  if (!genAI) return "AI Service Unavailable. Please check your API key in .env.local";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `System: You are 'TemariGuide', a helpful AI mentor for Ethiopian students using the TemariWare app. Keep answers concise, encouraging, and culturally relevant to Ethiopia.
       
       Context: ${context}. 
       
       User: ${message}`;

    const result = await model.generateContent(prompt);
    return result.response.text() || "I didn't catch that.";
  } catch (error) {
    console.error("Gemini Error (Chat):", error);
    return `Sorry, I'm having trouble connecting. Please check your internet connection and try again.`;
  }
};

export const generateStudyPlan = async (topic: string): Promise<string> => {
  const genAI = getGenAI();
  if (!genAI) return "AI Service Unavailable";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a 3-day intense study plan for an Ethiopian university student covering: ${topic}.
      Break it down by hour. Include breaks for "Buna" (Coffee).
      Format as Markdown.`;

    const result = await model.generateContent(prompt);
    return result.response.text() || "Could not generate study plan.";
  } catch (error) {
    console.error("Gemini Error (Study Plan):", error);
    return "Error generating plan.";
  }
};

export const generateCareerRoadmap = async (profile: UserProfile): Promise<string> => {
  const genAI = getGenAI();
  if (!genAI) return "AI Service Unavailable";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a personalized career roadmap for an Ethiopian student with the following profile:
      Name: ${profile.name}
      Department: ${profile.department}
      Skills: ${profile.skills.map(s => s.name).join(', ')}
      Interests: ${profile.bio}

      The roadmap should be 3 stages (Short-term, Medium-term, Long-term).
      Focus on the Ethiopian tech ecosystem (remote work, local startups like Ride/Telebirr, outsourcing).
      Format as Markdown.`;

    const result = await model.generateContent(prompt);
    return result.response.text() || "Could not generate roadmap.";
  } catch (error) {
    console.error("Roadmap error:", error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

// Note: Audio transcription and Maps features require different setup
export const transcribeAudio = async (_audioBase64: string, _mimeType: string): Promise<string> => {
  return "Audio transcription coming soon!";
};

export const getMapsInfo = async (_query: string): Promise<{ text: string, chunks: any[] }> => {
  return { text: "Maps integration coming soon!", chunks: [] };
};
