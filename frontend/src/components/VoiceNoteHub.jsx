// // FILE: src/components/VoiceNoteHub.jsx
// // Install dependencies first:
// // npm install @vapi-ai/web lucide-react

// import React, { useState, useEffect, useCallback } from 'react';
// import Vapi from '@vapi-ai/web';
// import { Mic, MicOff, Trash2, Search } from 'lucide-react';

// const VoiceNoteHub = () => {
//   const [notes, setNotes] = useState([]);
//   const [isCallActive, setIsCallActive] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [vapiClient, setVapiClient] = useState(null);
//   const [status, setStatus] = useState('Ready');
//   const [isProcessing, setIsProcessing] = useState(false);
  
//   // VITE uses import.meta.env instead of process.env
//   const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_KEY;
//   const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;

//   // Check if API keys are configured
//   useEffect(() => {
//     if (!VAPI_PUBLIC_KEY || !GEMINI_API_KEY) {
//       console.error('Missing API keys! Check your .env file');
//       setStatus('⚠️ Missing API keys - check console');
//     }
//   }, []);

//   // Initialize Vapi Client (runs once)
//   useEffect(() => {
//     if (!VAPI_PUBLIC_KEY) return;

//     const client = new Vapi(VAPI_PUBLIC_KEY);
    
//     // Event: Call started
//     client.on('call-start', () => {
     
//       setStatus('🎤 Listening - Speak now!');
//       setIsCallActive(true);
//     });

//     // Event: Call ended
//     client.on('call-end', () => {
//       console.log('Call ended');
//       setStatus('Call ended');
//       setIsCallActive(false);
//       setIsProcessing(false);
//     });

//     // Event: User starts speaking
//     client.on('speech-start', () => {
//       console.log('User started speaking');
//       setStatus('👂 Listening...');
//     });

//     // Event: User stops speaking
//     client.on('speech-end', () => {
//       console.log('User stopped speaking');
//       setStatus('🤔 Processing your command...');
//       setIsProcessing(true);
//     });

//     // Event: Message received (transcripts)
//     client.on('message', (message) => {
//       console.log('Message received:', message);
//       handleVapiMessage(message);
//     });

//     // Event: Error occurred
//     client.on('error', (error) => {
//       console.error('Vapi error:', error);
//       setStatus(`❌ Error: ${error.message}`);
//       setIsProcessing(false);
//     });

//     // Event: Volume level (for visual feedback)
//     client.on('volume-level', (level) => {
//       // You can use this for visual indicators
//       // console.log('Volume:', level);
//     });

//     setVapiClient(client);

//     // Cleanup on unmount
//     return () => {
//       if (client) {
//         client.stop();
//       }
//     };
//   }, [VAPI_PUBLIC_KEY]);

//   // Handle incoming messages from Vapi
//   const handleVapiMessage = useCallback(async (message) => {
//     // Only process user transcripts
//     if (message.type === 'transcript' && message.role === 'user') {
//       const userText = message.transcript;
//       console.log('User said:', userText);
      
//       setStatus(`You: "${userText}"`);
      
//       // Process command with Gemini
//       const actionResponse = await processWithGemini(userText);
      
//       // Execute the action
//       await executeAction(actionResponse);
      
//       setIsProcessing(false);
//     }

//     // Handle assistant responses
//     if (message.type === 'transcript' && message.role === 'assistant') {
//       console.log('Assistant said:', message.transcript);
//     }
//   }, [notes]);

//   // Process natural language with Gemini
// //   const processWithGemini = async (userInput) => {
// //     if (!GEMINI_API_KEY) {
// //       return { action: 'error', message: 'Gemini API key not configured' };
// //     }

// //     try {
// //       const response = await fetch(
// //         `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
// //         {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify({
// //             contents: [{
// //               parts: [{
// //                 text: `You are a voice assistant for a note-taking application. 
// // Analyze the user's voice command and return ONLY valid JSON with no additional text.

// // User command: "${userInput}"

// // Return one of these JSON formats:

// // 1. Create a note:
// // {"action": "create", "title": "extracted title", "content": "extracted content"}

// // 2. Search notes:
// // {"action": "search", "query": "search term"}

// // 3. Delete a note:
// // {"action": "delete", "title": "note title to delete"}

// // 4. List all notes:
// // {"action": "list"}

// // 5. Update a note:
// // {"action": "update", "title": "note title", "content": "new content"}

// // 6. Clear all notes:
// // {"action": "clear"}

// // 7. Help/Unknown:
// // {"action": "help", "message": "brief explanation"}

// // Examples:
// // - "Create a note called Shopping List with buy milk and bread" → {"action": "create", "title": "Shopping List", "content": "buy milk and bread"}
// // - "Find notes about meetings" → {"action": "search", "query": "meetings"}
// // - "Delete my shopping list" → {"action": "delete", "title": "Shopping List"}

// // Respond with ONLY the JSON object, no markdown, no explanations.`
// //               }]
// //             }],
// //             generationConfig: {
// //               temperature: 0.1,
// //               maxOutputTokens: 256
// //             }
// //           })
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(`Gemini API error: ${response.status}`);
// //       }

// //       const data = await response.json();
// //       const textResponse = data.candidates[0].content.parts[0].text;
      
// //       // Extract JSON from response (handles markdown code blocks)
// //       const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      
// //       if (!jsonMatch) {
// //         throw new Error('No valid JSON found in response');
// //       }

// //       const parsedAction = JSON.parse(jsonMatch[0]);
// //       console.log('Parsed action:', parsedAction);
      
// //       return parsedAction;

// //     } catch (error) {
// //       console.error('Gemini processing error:', error);
// //       return {
// //         action: 'error',
// //         message: 'Failed to understand command. Please try again.'
// //       };
// //     }
// //   };

// const processWithGemini = async (userInput) => {
//   if (!GEMINI_API_KEY) {
//     return { action: "error", message: "Gemini API key not configured" };
//   }

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `
// You are a **voice teaching assistant** for a learning app.
// You behave like a **friendly teacher/tutor**.
// Your role is to explain topics, answer questions, summarize lessons, give definitions, and help with studying.

// User said: "${userInput}"

// You MUST return ONLY one of these JSON objects:

// 1️⃣ Teach or explain something:
// {"action": "teach", "answer": "your clear explanation here"}

// 2️⃣ If the user's command is unclear:
// {"action": "help", "message": "short clarification question"}

// IMPORTANT RULES:
// - Output ONLY JSON.  
// - No markdown.  
// - No extra sentences outside JSON.  
// - Keep explanations simple, clear, and student-friendly.

// Examples:
// "Explain deadlock in OS" → {"action":"teach","answer":"Deadlock is..."}
// "What is AI?" → {"action":"teach","answer":"Artificial Intelligence is..."}
// "What do you mean by normalization?" → {"action":"teach","answer":"Normalization is..."}
// "If unclear" → {"action":"help","message":"Can you please repeat that?"}
// `
//                 }
//               ]
//             }
//           ],
//           generationConfig: {
//             temperature: 0.2,
//             maxOutputTokens: 300
//           }
//         })
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Gemini API error: ${response.status}`);
//     }

//     const data = await response.json();

//     const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

//     if (!jsonMatch) {
//       throw new Error("No valid JSON found in response");
//     }

//     return JSON.parse(jsonMatch[0]);

//   } catch (error) {
//     console.error("Gemini processing error:", error);
//     return { action: "error", message: "Failed to understand. Please try again." };
//   }
// };


//   // Execute actions based on Gemini's interpretation
//   const executeAction = async (action) => {
//     let responseText = '';

//     switch (action.action) {
//       case 'create':
//         const newNote = {
//           id: Date.now(),
//           title: action.title || 'Untitled Note',
//           content: action.content || '',
//           timestamp: new Date().toLocaleString(),
//           createdAt: Date.now()
//         };
        
//         setNotes(prev => [newNote, ...prev]);
//         responseText = `Note created: ${newNote.title}`;
//         setStatus(`✅ ${responseText}`);
//         break;

//       case 'search':
//         setSearchQuery(action.query);
//         const results = notes.filter(n => 
//           n.title.toLowerCase().includes(action.query.toLowerCase()) ||
//           n.content.toLowerCase().includes(action.query.toLowerCase())
//         );
        
//         responseText = results.length === 0 
//           ? `No notes found for "${action.query}"`
//           : `Found ${results.length} note${results.length > 1 ? 's' : ''} about ${action.query}. ${results.slice(0, 2).map(n => n.title).join(', ')}`;
        
//         setStatus(`🔍 ${responseText}`);
//         break;

//       case 'delete':
//         const toDelete = notes.find(n => 
//           n.title.toLowerCase().includes(action.title.toLowerCase())
//         );
        
//         if (toDelete) {
//           setNotes(prev => prev.filter(n => n.id !== toDelete.id));
//           responseText = `Deleted note: ${toDelete.title}`;
//           setStatus(`🗑️ ${responseText}`);
//         } else {
//           responseText = `Could not find a note called "${action.title}"`;
//           setStatus(`❌ ${responseText}`);
//         }
//         break;

//       case 'list':
//         if (notes.length === 0) {
//           responseText = 'You have no notes yet. Create one by saying: create a note';
//         } else {
//           const notesList = notes.slice(0, 5).map(n => n.title).join(', ');
//           responseText = `You have ${notes.length} note${notes.length > 1 ? 's' : ''}. Recent notes: ${notesList}`;
//         }
//         setStatus(`📋 ${responseText}`);
//         break;

//       case 'clear':
//         const count = notes.length;
//         setNotes([]);
//         responseText = `Cleared all ${count} notes`;
//         setStatus(`🧹 ${responseText}`);
//         break;

//       case 'help':
//         responseText = action.message || 'I can help you create notes, search notes, delete notes, or list all notes. Just speak naturally!';
//         setStatus(`💡 ${responseText}`);
//         break;

//       case 'error':
//         responseText = action.message || 'Sorry, I did not understand that. Try saying: create a note, search for notes, or list my notes.';
//         setStatus(`❌ ${responseText}`);
//         break;

//       default:
//         responseText = 'I did not understand that command. Say "help" for available commands.';
//         setStatus(`❓ ${responseText}`);
//     }

//     // Send voice response back to user
//     if (vapiClient && responseText) {
//       speakResponse(responseText);
//     }
//   };

//   // Send text-to-speech response via Vapi
//   const speakResponse = (text) => {
//     if (!vapiClient) return;

//     try {
//       vapiClient.send({
//         type: 'add-message',
//         message: {
//           role: 'system',
//           content: text
//         }
//       });
//     } catch (error) {
//       console.error('Failed to speak response:', error);
//     }
//   };

//   // Start voice call
//   const startVoiceCall = async () => {
//     if (!vapiClient) {
//       setStatus('❌ Vapi client not initialized');
//       return;
//     }

//     try {
//       setStatus('📞 Starting call...');
      
//       await vapiClient.start({
//         // Transcriber configuration (Speech-to-Text)
//         transcriber: {
//           provider: 'deepgram',
//           model: 'nova-2',
//           language: 'en-US',
//           smartFormat: true
//         },
        
//         // Model configuration (Conversation AI)
//         model: {
//           provider: 'openai',
//           model: 'gpt-4',
//           messages: [
//             {
//               role: 'system',
//               content: `
// You are a **friendly teaching assistant** for a learning app.
// You act like a knowledgeable **teacher/tutor** who explains any topic clearly.

// Rules:
// - Keep answers short (1–2 sentences only).
// - Speak clearly in simple language.
// - Give quick explanations, definitions, meanings, or summaries.
// - You do NOT manage notes or files.
// - If the user asks anything unrelated to studying, still answer politely in 1–2 sentences.

// Examples:
// User: "Explain operating system deadlock."
// You: "Deadlock is a state where processes get stuck waiting for each other, and none can proceed."

// User: "What is machine learning?"
// You: "Machine learning is a field where computers learn patterns from data instead of being manually programmed."

// User: "Tell me about Java multithreading."
// You: "Multithreading in Java lets a program run multiple tasks at the same time for better performance."

// If the question is unclear:
// Say: "Could you please repeat that?"`
//             }
//           ],
//           temperature: 0.7
//         },
        
//         // Voice configuration (Text-to-Speech)
//         voice: {
//           provider: 'playht',
//           voiceId: 'jennifer'
//         }
//       });

//       console.log('Call started successfully');
      
//     } catch (error) {
//       console.error('Failed to start call:', error);
//       setStatus(`❌ Failed to start: ${error.message}`);
//       setIsCallActive(false);
//     }
//   };

//   // Stop voice call
//   const stopVoiceCall = () => {
//     if (vapiClient) {
//       vapiClient.stop();
//       setStatus('Call stopped');
//     }
//   };

//   // Filter notes based on search
//   const filteredNotes = notes.filter(note =>
//     note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     note.content.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     // <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
//     //   <div className="max-w-7xl mx-auto">
        
//     //     {/* Header */}
//     //     <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-purple-100">
//     //       <div className="flex items-center justify-between mb-6">
//     //         <div>
//     //           <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//     //             🎤 Voice NoteHub
//     //           </h1>
//     //           <p className="text-gray-600 mt-2">Speak naturally to manage your notes</p>
//     //         </div>
            
//     //         <div className="text-right">
//     //           <div className="text-3xl font-bold text-purple-600">{notes.length}</div>
//     //           <div className="text-sm text-gray-500">Total Notes</div>
//     //         </div>
//     //       </div>

//     //       {/* Voice Control Section */}
//     //       <div className="flex items-center gap-6 mb-6">
//     //         <button
//     //           onClick={isCallActive ? stopVoiceCall : startVoiceCall}
//     //           disabled={!VAPI_PUBLIC_KEY || !GEMINI_API_KEY}
//     //           className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg ${
//     //             isCallActive
//     //               ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
//     //               : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed'
//     //           }`}
//     //         >
//     //           {isCallActive ? (
//     //             <>
//     //               <MicOff size={24} />
//     //               Stop Voice
//     //             </>
//     //           ) : (
//     //             <>
//     //               <Mic size={24} />
//     //               Start Voice Assistant
//     //             </>
//     //           )}
//     //         </button>
            
//     //         <div className="flex-1">
//     //           <div className="flex items-center gap-3 mb-2">
//     //             <div className={`w-4 h-4 rounded-full ${
//     //               isCallActive ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
//     //             }`} />
//     //             <span className="font-medium text-gray-700">{status}</span>
//     //           </div>
              
//     //           {isProcessing && (
//     //             <div className="flex gap-1">
//     //               <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
//     //               <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
//     //               <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
//     //             </div>
//     //           )}
//     //         </div>
//     //       </div>

//     //       {/* Command Examples */}
//     //       <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
//     //         <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
//     //           <span>💬</span> Try saying:
//     //         </h3>
//     //         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//     //           <div className="bg-white/60 rounded-lg p-3 border border-purple-100">
//     //             <span className="font-semibold text-purple-700">Create:</span>
//     //             <div className="text-gray-700 mt-1">"Create a note called Project Ideas with brainstorm new features"</div>
//     //           </div>
//     //           <div className="bg-white/60 rounded-lg p-3 border border-purple-100">
//     //             <span className="font-semibold text-pink-700">Search:</span>
//     //             <div className="text-gray-700 mt-1">"Find notes about meetings"</div>
//     //           </div>
//     //           <div className="bg-white/60 rounded-lg p-3 border border-purple-100">
//     //             <span className="font-semibold text-indigo-700">Delete:</span>
//     //             <div className="text-gray-700 mt-1">"Delete the note called Shopping List"</div>
//     //           </div>
//     //           <div className="bg-white/60 rounded-lg p-3 border border-purple-100">
//     //             <span className="font-semibold text-purple-700">List:</span>
//     //             <div className="text-gray-700 mt-1">"List all my notes"</div>
//     //           </div>
//     //         </div>
//     //       </div>

//     //       {/* Search Bar */}
//     //       <div className="relative mt-6">
//     //         <Search className="absolute left-4 top-4 text-gray-400" size={20} />
//     //         <input
//     //           type="text"
//     //           placeholder="Search your notes..."
//     //           value={searchQuery}
//     //           onChange={(e) => setSearchQuery(e.target.value)}
//     //           className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all"
//     //         />
//     //       </div>
//     //     </div>

//     //     {/* Notes Grid */}
//     //     {filteredNotes.length > 0 ? (
//     //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//     //         {filteredNotes.map((note) => (
//     //           <div
//     //             key={note.id}
//     //             className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-purple-100"
//     //           >
//     //             <div className="flex items-start justify-between mb-3">
//     //               <h3 className="font-bold text-gray-800 text-xl flex-1 pr-2">
//     //                 {note.title}
//     //               </h3>
//     //               <button
//     //                 onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
//     //                 className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
//     //                 title="Delete note"
//     //               >
//     //                 <Trash2 size={18} />
//     //               </button>
//     //             </div>
                
//     //             <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//     //               {note.content || 'No content'}
//     //             </p>
                
//     //             <div className="flex items-center justify-between text-xs text-gray-400">
//     //               <span>{note.timestamp}</span>
//     //             </div>
//     //           </div>
//     //         ))}
//     //       </div>
//     //     ) : (
//     //       <div className="text-center py-20">
//     //         <div className="bg-white/60 backdrop-blur rounded-3xl p-12 max-w-md mx-auto border-2 border-dashed border-purple-200">
//     //           <Mic size={64} className="mx-auto text-purple-300 mb-6" />
//     //           <h3 className="text-2xl font-bold text-gray-700 mb-3">
//     //             No notes yet
//     //           </h3>
//     //           <p className="text-gray-500">
//     //             Click "Start Voice Assistant" and say:<br />
//     //             <span className="font-semibold text-purple-600">
//     //               "Create a note called My First Note"
//     //             </span>
//     //           </p>
//     //         </div>
//     //       </div>
//     //     )}
//     //   </div>
//     // </div>
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
//   <div className="max-w-7xl mx-auto">

//     {/* Header */}
//     <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 mb-10 border border-purple-100">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//             🎤 Voice NoteHub
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Speak naturally to manage your notes
//           </p>
//         </div>

//         <div className="text-right">
//           <div className="text-4xl font-extrabold text-purple-700">{notes.length}</div>
//           <div className="text-sm text-gray-500">Total Notes</div>
//         </div>
//       </div>

//       {/* Voice Control Button */}
//       <div className="flex items-center gap-6 mb-8">
//         <button
//           onClick={isCallActive ? stopVoiceCall : startVoiceCall}
//           disabled={!VAPI_PUBLIC_KEY || !GEMINI_API_KEY}
//           className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg 
//             ${isCallActive
//               ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:scale-105"
//               : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 disabled:opacity-50"}
//           `}
//         >
//           {isCallActive ? (
//             <>
//               <MicOff size={24} />
//               Stop Voice
//             </>
//           ) : (
//             <>
//               <Mic size={24} />
//               Start Voice Assistant
//             </>
//           )}
//         </button>

//         {/* Status + Loader */}
//         <div className="flex-1">
//           <div className="flex items-center gap-3 mb-2">
//             <div
//               className={`w-4 h-4 rounded-full ${
//                 isCallActive ? "bg-red-500 animate-pulse" : "bg-gray-300"
//               }`}
//             />
//             <span className="font-medium text-gray-700">{status}</span>
//           </div>

//           {isProcessing && (
//             <div className="flex gap-1 mt-1">
//               <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
//               <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150" />
//               <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300" />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Command Examples */}
//       <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
//         <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
//           💬 Try saying:
//         </h3>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           {[
//             {
//               label: "Create",
//               color: "text-purple-700",
//               text: `"Create a note called Project Ideas with brainstorm new features"`,
//             },
//             {
//               label: "Search",
//               color: "text-pink-700",
//               text: `"Find notes about meetings"`,
//             },
//             {
//               label: "Delete",
//               color: "text-indigo-700",
//               text: `"Delete the note called Shopping List"`,
//             },
//             {
//               label: "List",
//               color: "text-purple-700",
//               text: `"List all my notes"`,
//             },
//           ].map((item, index) => (
//             <div
//               key={index}
//               className="bg-white/70 rounded-xl p-4 border border-purple-100"
//             >
//               <span className={`font-semibold ${item.color}`}>{item.label}:</span>
//               <div className="text-gray-700 mt-1">{item.text}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Search */}
//       <div className="relative mt-6">
//         <Search className="absolute left-4 top-4 text-gray-400" size={20} />
//         <input
//           type="text"
//           placeholder="Search your notes..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl
//                      focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all"
//         />
//       </div>
//     </div>

//     {/* Notes Grid */}
//     {filteredNotes.length > 0 ? (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredNotes.map((note) => (
//           <div
//             key={note.id}
//             className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-purple-100
//                        hover:shadow-2xl hover:-translate-y-1 transition-all"
//           >
//             <div className="flex items-start justify-between mb-4">
//               <h3 className="font-bold text-gray-800 text-xl pr-2">{note.title}</h3>

//               <button
//                 onClick={() =>
//                   setNotes(notes.filter((n) => n.id !== note.id))
//                 }
//                 className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
//                 title="Delete note"
//               >
//                 <Trash2 size={18} />
//               </button>
//             </div>

//             <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//               {note.content || "No content"}
//             </p>

//             <div className="flex items-center justify-between text-xs text-gray-400">
//               <span>{note.timestamp}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="text-center py-20">
//         <div className="bg-white/70 backdrop-blur rounded-3xl p-12 max-w-md mx-auto border-2 border-dashed border-purple-200">
//           <Mic size={64} className="mx-auto text-purple-300 mb-6" />
//           <h3 className="text-2xl font-bold text-gray-700 mb-3">No notes yet</h3>
//           <p className="text-gray-500">
//             Click "Start Voice Assistant" and say:
//             <br />
//             <span className="font-semibold text-purple-600">
//               "Create a note called My First Note"
//             </span>
//           </p>
//         </div>
//       </div>
//     )}
//   </div>
// </div>

//   );
// };

// export default VoiceNoteHub;


import React, { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";

function VoiceNoteHub() {
  const [vapiClient, setVapiClient] = useState(null);
  const [status, setStatus] = useState("Idle");
  const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_KEY;

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY) {
      console.error("VAPI key not found!");
      return;
    }

    const client = new Vapi(VAPI_PUBLIC_KEY);
    setVapiClient(client);

    // Event listeners
    client.on("call-start", () => {
      console.log("📞 Call started");
      setStatus("Call started");
    });

    client.on("call-end", () => {
      console.log("❌ Call ended");
      setStatus("Call ended");
    });

    client.on("transcription", (text) => {
      console.log("📝 Transcription:", text);
    });

    client.on("error", (err) => {
      console.error("VAPI ERROR:", err);
      setStatus("Error: " + err.message);
    });
  }, []);

  const startVapiClient = async () => {
    if (!vapiClient) {
      console.warn("VAPI client not initialized yet!");
      return;
    }

    try {
      setStatus("Starting call...");
      await vapiClient.start({
        assistant: {
          model: "gpt-4o-mini-tts",
          voice: "alloy",
          instructions: "You are a helpful assistant.",
        },
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          smartFormat: true,
        },
      });
      console.log("✅ VAPI client started");
      setStatus("Call started");
    } catch (err) {
      console.error("VAPI ERROR:", err);
      setStatus("Error starting call");
    }
  };

  const stopVapiClient = async () => {
    if (!vapiClient) return;
    try {
      await vapiClient.stop();
      setStatus("Call stopped");
    } catch (err) {
      console.error("Error stopping VAPI client:", err);
      setStatus("Error stopping call");
    }
  };

  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={startVapiClient}>Start Call</button>
      <button onClick={stopVapiClient}>Stop Call</button>
    </div>
  );
}

export default VoiceNoteHub;


