import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import axios from 'axios';

// const apikey = import.meta.env.VITE_GEMINI_KEY;

// // Clean API call function
// const callGeminiapi = async (prompt, action) => {
//   try {
//     let userPrompt = "";

//     if (action === "explain") {
//       userPrompt = `Explain this concept clearly: ${prompt}`;
//     } else if (action === "qna") {
//       userPrompt = `Generate 5 question-answer pairs about "${prompt}" in JSON array format: [{"question": "...", "answer": "..."}]. Return ONLY JSON.`;
//     } else if (action === "topic-info") {
//       userPrompt = `Provide info about "${prompt}" in JSON format: {"title": "...", "overview": "...", "keyPoints": ["point1", "point2"], "importance": "..."}. Return ONLY JSON.`;
//     }

//     // Correct URL format for gemini-2.5-flash
//     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apikey}`;

//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             role: "user",
//             parts: [{ text: userPrompt }],
//           },
//         ],
//         generationConfig: {
//           temperature: 0.7,
//           maxOutputTokens: 1024,
//         },
//       }),
//     });

//     const data = await res.json();
//     console.log("RESPONSE:", data);

//     if (data.error) {
//       console.error("API Error:", data.error.message);
//       return { error: data.error.message };
//     }

//     const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

//     // Parse JSON for structured responses
//     if (action === "qna" || action === "topic-info") {
//       try {
//         const jsonMatch = output.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
//         if (jsonMatch) {
//           return JSON.parse(jsonMatch[0]);
//         }
//       } catch (parseErr) {
//         console.error("JSON Parse Error:", parseErr);
//         return output;
//       }
//     }

//     return output;
//   } catch (err) {
//     console.error("Gemini API Error:", err);
//     return { error: err.message };
//   }
// };
const API = import.meta.env.VITE_API_URL;

const askai=async(desc,action)=>{
  try{
  const res= await axios.post(`${API}/apii/genai/ask?topic=${desc}&action=${action}`)
  console.log(res.data)
  return res.data
  }
  catch(e){
  const status = e.status || e.response?.status;
  
    return "sorry your attempts re exhausted";
    console.log(e)
  }
}


export default function VAI() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    if (!input.trim()) {
      alert("Please enter a topic");
      return;
    }

    setLoading(true);
    const result = await askai(input,action);
    // console.log("AI Response:", result.data);
    // if(action=='qa'){
    //   const js=JSON.parse(result.data )
    //   console.log(js)
    // }
  //   console.log("result",result)
    
  //  let s=result.data.replace(/```json|```/g, "").trim();
  //  let c=s.replace('[',"").replace(']',"").trim();

  //  console.log(Array.isArray(c));
  
   console.log("res");

     setResponse(result?.data||"oops limit exhausted");
    setLoading(false);
  };


  return (
     <div className="min-h-screen bg-[var(--bg)] text-[var(--color-text)] p-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto bg-[var(--color-card)] rounded-lg shadow-lg p-6 border border-[var(--border)]">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">AI Learning Assistant</h1>

        {/* Input */}
        <div className="mb-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a topic (e.g., 'Photosynthesis', 'Machine Learning')"
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 resize-none bg-[var(--bg)] text-[var(--color-text)] placeholder-[var(--muted)] transition-colors duration-300"
            rows="3"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          <button
            onClick={() => handleAction("explain")}
            disabled={loading}
            className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg font-semibold transition-all duration-300"
          >
            {loading && currentAction === "explain" ? "Loading..." : "📖 Explain Topic"}
          </button>
          <button
            onClick={() => handleAction("qa")}
            disabled={loading}
            className="bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg font-semibold transition-all duration-300"
          >
            {loading && currentAction === "qa" ? "Loading..." : "❓ Generate Q&A"}
          </button>
        </div>

        {/* Response Display */}
        {loading && (
          <div className="flex items-center justify-center gap-2 p-6 bg-[var(--bg)] border border-[var(--border)] rounded-lg">
            <Loader className="animate-spin text-[var(--primary)]" size={20} />
            <p className="text-[var(--color-text)]">Processing your request...</p>
          </div>
        )}

        {response && !loading && (
          <div className="bg-[var(--bg)] p-6 rounded-lg border-l-4 border-[var(--primary)]">
            {/* EXPLAIN ACTION - Shows text explanation */}
            {typeof response === "string" && (
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">📖 Explanation</h2>
                <p className="text-[var(--color-text)] whitespace-pre-wrap leading-relaxed text-base">
                  {response}
                </p>
              </div>
            )}

            {/* Q&A ACTION - Shows question and answer pairs */}
            {Array.isArray(response) && (
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">❓ Questions & Answers</h2>
                <div className="space-y-3">
                  {response.map((qa, idx) => (
                    <details
                      key={idx}
                      className="border-2 border-[var(--border)] rounded-lg p-4 hover:border-[var(--primary)] transition-colors cursor-pointer bg-[var(--color-card)]"
                    >
                      <summary className="font-semibold text-[var(--color-text)] flex items-center gap-2 cursor-pointer">
                        <span className="bg-[var(--primary)] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="flex-1">{qa.question}</span>
                      </summary>
                      <div className="mt-3 ml-8 text-[var(--color-text)] border-t-2 border-[var(--border)] pt-3">
                        <p className="font-semibold mb-2">Answer:</p>
                        <p className="leading-relaxed">{qa.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* TOPIC INFO ACTION - Shows structured information */}
            {typeof response === "object" && !Array.isArray(response) && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-text)]">{response.title}</h2>
                  <p className="text-[var(--muted)] mt-2">{response.overview}</p>
                </div>

                {response.keyPoints && Array.isArray(response.keyPoints) && response.keyPoints.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">📌 Key Points:</h3>
                    <ul className="space-y-2">
                      {response.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-[var(--color-text)]">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-[var(--accent)]/20 text-[var(--accent)] rounded-full text-sm font-bold flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="pt-0.5">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {response.importance && (
                  <div className="bg-[var(--primary)]/10 border-l-4 border-[var(--primary)] p-4 rounded">
                    <h3 className="font-semibold text-[var(--primary)] mb-2">⚡ Why It Matters:</h3>
                    <p className="text-[var(--color-text)]">{response.importance}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!loading && !response && input && (
          <div className="text-center p-6 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
            <p className="text-[var(--muted)]">Select an action above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}