import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';

const apikey = import.meta.env.VITE_GEMINI_KEY;

// Clean API call function
const callGeminiapi = async (prompt, action) => {
  try {
    let userPrompt = "";

    if (action === "explain") {
      userPrompt = `Explain this concept clearly: ${prompt}`;
    } else if (action === "qna") {
      userPrompt = `Generate 5 question-answer pairs about "${prompt}" in JSON array format: [{"question": "...", "answer": "..."}]. Return ONLY JSON.`;
    } else if (action === "topic-info") {
      userPrompt = `Provide info about "${prompt}" in JSON format: {"title": "...", "overview": "...", "keyPoints": ["point1", "point2"], "importance": "..."}. Return ONLY JSON.`;
    }

    // Correct URL format for gemini-2.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apikey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await res.json();
    console.log("RESPONSE:", data);

    if (data.error) {
      console.error("API Error:", data.error.message);
      return { error: data.error.message };
    }

    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    // Parse JSON for structured responses
    if (action === "qna" || action === "topic-info") {
      try {
        const jsonMatch = output.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseErr) {
        console.error("JSON Parse Error:", parseErr);
        return output;
      }
    }

    return output;
  } catch (err) {
    console.error("Gemini API Error:", err);
    return { error: err.message };
  }
};

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
    const result = await callGeminiapi(input, action);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Learning Assistant</h1>

        {/* Input */}
        <div className="mb-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a topic (e.g., 'Photosynthesis', 'Machine Learning')"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows="3"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => handleAction("explain")}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Loading..." : "Explain"}
          </button>
          <button
            onClick={() => handleAction("qna")}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Loading..." : "Q&A"}
          </button>
          <button
            onClick={() => handleAction("topic-info")}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Loading..." : "Topic Info"}
          </button>
        </div>

        {/* Response Display */}
        {loading && (
          <div className="flex items-center justify-center gap-2 p-6 bg-blue-50 rounded-lg">
            <Loader className="animate-spin" size={20} />
            <p className="text-blue-700">Processing...</p>
          </div>
        )}

        {response && !loading && (
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-indigo-600">
            {/* EXPLAIN ACTION - Shows text explanation */}
            {typeof response === "string" && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Explanation</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                  {response}
                </p>
              </div>
            )}

            {/* Q&A ACTION - Shows question and answer pairs */}
            {Array.isArray(response) && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Questions & Answers</h2>
                <div className="space-y-3">
                  {response.map((qa, idx) => (
                    <details 
                      key={idx} 
                      className="border-2 border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition cursor-pointer bg-white"
                    >
                      <summary className="font-semibold text-gray-800 flex items-center gap-2">
                        <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                          {idx + 1}
                        </span>
                        {qa.question}
                      </summary>
                      <div className="mt-3 ml-8 text-gray-700 border-t-2 border-gray-200 pt-3">
                        <p className="font-semibold mb-2">Answer:</p>
                        <p>{qa.answer}</p>
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
                  <h2 className="text-2xl font-bold text-gray-800">{response.title}</h2>
                  <p className="text-gray-600 mt-2">{response.overview}</p>
                </div>

                {response.keyPoints && response.keyPoints.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">📌 Key Points:</h3>
                    <ul className="space-y-2">
                      {response.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 rounded-full text-sm font-bold flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {response.importance && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h3 className="font-semibold text-yellow-900 mb-2">⚡ Why It Matters:</h3>
                    <p className="text-yellow-800">{response.importance}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}