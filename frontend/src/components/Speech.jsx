import React, { useState, useEffect, useCallback } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { toast } from "react-toastify";

export default function Speech({ setshow, desc }) {
    const quotes = [
        "Most people do not listen with the intent to understand; they listen with the intent to reply. — Stephen R. Covey",
        "Listening is being able to be changed by the other person. — Alan Alda",
        "When people talk, listen completely. Most people never listen. — Ernest Hemingway",
        "One of the most sincere forms of respect is actually listening to what another has to say. — Bryant H. McGill",
        "To listen well is as powerful a means of communication and influence as to talk well. — John Marshall",
        "The quieter you become, the more you can hear. — Ram Dass",
        "Wisdom is the reward you get for a lifetime of listening when you'd have preferred to talk. — Doug Larson",
        "Listening is often the only thing needed to help someone. — Unknown",
    ];

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [quote, setQuote] = useState("");
    const [isSupported, setIsSupported] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [forceStop, setForceStop] = useState(false);

    // Initialize component on mount
    useEffect(() => {
        const initializeComponent = async () => {
            setIsLoading(true);
            
            // Check browser support
            const hasWebkit = 'webkitSpeechRecognition' in window;
            const hasNative = 'SpeechRecognition' in window;
            const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
            const supported = (hasWebkit || hasNative) && isHTTPS && browserSupportsSpeechRecognition;
            
            setIsSupported(supported);
            
            // Try to get initial microphone permission status
            if (supported && navigator.permissions) {
                try {
                    const permission = await navigator.permissions.query({ name: 'microphone' });
                    setPermissionGranted(permission.state === 'granted');
                } catch (error) {
                    console.log('Permission query not supported');
                }
            }
            
            // Set random quote
            const quoteIdx = Math.floor(Math.random() * quotes.length);
            setQuote(quotes[quoteIdx]);
            
            setIsLoading(false);
        };

        initializeComponent();
    }, [browserSupportsSpeechRecognition]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            try {
                SpeechRecognition.stopListening();
                if (SpeechRecognition.abortListening) {
                    SpeechRecognition.abortListening();
                }
            } catch (error) {
                console.error('Cleanup error:', error);
            }
        };
    }, []);

    // Debug logging (remove in production)
    useEffect(() => {
        console.log('Speech state:', { listening, transcriptLength: transcript.length, forceStop });
    }, [listening, transcript.length, forceStop]);

    const requestMicrophonePermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            setPermissionGranted(true);
            return true;
        } catch (error) {
            console.error('Microphone permission denied:', error);
            toast.error("Microphone permission is required for speech recognition");
            setPermissionGranted(false);
            return false;
        }
    };

    const handleStart = useCallback(async () => {
        if (!isSupported) {
            toast.error("Speech recognition is not supported in this browser");
            return;
        }

        if (!permissionGranted) {
            const granted = await requestMicrophonePermission();
            if (!granted) return;
        }

        try {
            setForceStop(false);
            console.log("Starting speech recognition...");
            
            SpeechRecognition.startListening({ 
                continuous: true,
                language: "en-IN",
                interimResults: true
            });
            
            toast.info("🎤 Listening... Start speaking!");
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
            toast.error("Failed to start speech recognition. Please try again.");
        }
    }, [isSupported, permissionGranted]);

    const handleStop = useCallback(() => {
        console.log("Stopping speech recognition...");
        
        try {
            setForceStop(true);
            SpeechRecognition.stopListening();
            
            // Try abort as fallback
            setTimeout(() => {
                if (SpeechRecognition.abortListening) {
                    SpeechRecognition.abortListening();
                }
            }, 100);
            
            // Reset force stop after a delay
            setTimeout(() => {
                setForceStop(false);
            }, 1000);
            
            toast.info("⏹️ Stopped listening");
        } catch (error) {
            console.error('Error stopping speech recognition:', error);
            toast.error("Error stopping speech recognition");
            setForceStop(false);
        }
    }, []);

    const handleReset = useCallback(() => {
        try {
            console.log("Resetting transcript...");
            
            // Stop listening first
            setForceStop(true);
            SpeechRecognition.stopListening();
            
            if (SpeechRecognition.abortListening) {
                SpeechRecognition.abortListening();
            }
            
            // Reset transcript after a short delay
            setTimeout(() => {
                resetTranscript();
                setForceStop(false);
                toast.info("🗑️ Text cleared");
            }, 200);
            
        } catch (error) {
            console.error('Error resetting:', error);
            // Force reset even if there's an error
            resetTranscript();
            setForceStop(false);
            toast.info("🗑️ Text cleared");
        }
    }, [resetTranscript]);

    const handleSave = useCallback(() => {
        if (!transcript.trim()) {
            toast.warning("No text to save");
            return;
        }

        try {
            console.log("Saving transcript...");
            
            // Stop listening first
            setForceStop(true);
            SpeechRecognition.stopListening();
            
            if (SpeechRecognition.abortListening) {
                SpeechRecognition.abortListening();
            }
            
            // Save the transcript
            desc((prev) => ({
                ...prev,
                desc: transcript
            }));
            
            toast.success("✅ Saved successfully!");
            
            // Clean up and close
            setTimeout(() => {
                resetTranscript();
                setshow(false);
            }, 500);
            
        } catch (error) {
            console.error('Error saving:', error);
            toast.error("Error saving, but text was captured");
            
            // Still save even if there's an error
            desc((prev) => ({
                ...prev,
                desc: transcript
            }));
            setshow(false);
        }
    }, [transcript, desc, setshow, resetTranscript]);

    const handleClose = useCallback(() => {
        try {
            console.log("Closing speech component...");
            
            setForceStop(true);
            SpeechRecognition.stopListening();
            
            if (SpeechRecognition.abortListening) {
                SpeechRecognition.abortListening();
            }
            
            setTimeout(() => {
                resetTranscript();
                setshow(false);
            }, 200);
            
        } catch (error) {
            console.error('Error closing:', error);
            // Force close even if there's an error
            resetTranscript();
            setshow(false);
        }
    }, [setshow, resetTranscript]);

    // Determine current listening state
    const isCurrentlyListening = listening && !forceStop;

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full max-w-[500px] min-w-[300px] bg-[#302D2D] text-white p-4 sm:p-6 rounded-xl shadow-xl mx-auto my-4">
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span className="ml-3 text-lg">Loading speech recognition...</span>
                </div>
            </div>
        );
    }

    // Unsupported browser
    if (!isSupported) {
        return (
            <div className="w-full max-w-[500px] min-w-[300px] bg-[#302D2D] text-white p-4 sm:p-6 rounded-xl shadow-xl mx-auto my-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl sm:text-2xl font-bold">Speech Recognition</h1>
                    <button 
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors px-3 py-1 rounded"
                    >
                        ✕ close
                    </button>
                </div>
                <div className="text-center py-8">
                    <FaMicrophoneSlash className="mx-auto text-4xl text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-3 text-red-400">Not Supported</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                        Speech recognition is not supported in this browser or environment.
                    </p>
                    <div className="text-sm text-gray-400 bg-gray-700 p-4 rounded-lg">
                        <p className="font-semibold mb-2">Requirements:</p>
                        <ul className="list-disc list-inside space-y-1 text-left">
                            <li>Chrome, Edge, or Safari browser</li>
                            <li>HTTPS connection (secure site)</li>
                            <li>Microphone permissions allowed</li>
                            <li>Modern browser version</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[500px] min-w-[300px] bg-[#302D2D] text-white p-4 sm:p-6 rounded-xl shadow-xl mx-auto my-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Let ME write for u 😊
                    </h1>
                    <button 
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors px-3 py-1 rounded hover:bg-gray-600"
                    >
                        ✕ close
                    </button>
                </div>
                
                {/* Quote */}
                <p className="text-sm text-gray-400 italic leading-relaxed border-l-2 border-blue-500 pl-3">
                    {quote}
                </p>
                
                {/* Status indicators */}
                {isCurrentlyListening && (
                    <div className="flex items-center gap-2 mt-3 animate-pulse text-green-400 font-semibold bg-green-900/20 p-2 rounded-lg">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
                        🎤 Listening... Speak now!
                    </div>
                )}
                
                {!permissionGranted && isSupported && (
                    <div className="flex items-center gap-2 mt-3 text-yellow-400 text-sm bg-yellow-900/20 p-2 rounded-lg">
                        <span>⚠️</span>
                        Microphone permission required - click Start to grant access
                    </div>
                )}
            </div>

            {/* Transcript area */}
            <div className="mb-4">
                <h2 className="font-bold text-md mb-2 flex items-center gap-2">
                    📝 Your Speech Text
                    {transcript.trim() && (
                        <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">
                            {transcript.trim().length} chars
                        </span>
                    )}
                </h2>
                <textarea
                    className="w-full h-40 p-3 rounded-lg bg-white text-black resize-none text-sm sm:text-base border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder={isCurrentlyListening ? "Listening... speak now!" : "Click 'Start' and begin speaking..."}
                    value={transcript}
                    readOnly
                />
            </div>

            {/* Control buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
                <button
                    onClick={handleStart}
                    disabled={isCurrentlyListening || (!permissionGranted && !isSupported)}
                    className={`flex items-center justify-center gap-2 w-full sm:w-[120px] px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isCurrentlyListening || (!permissionGranted && !isSupported)
                            ? 'bg-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-green-600 hover:bg-green-700 hover:scale-105 shadow-lg'
                    } text-white`}
                >
                    <FaMicrophone /> 
                    {isCurrentlyListening ? 'Recording...' : 'Start'}
                </button>
                
                <button
                    onClick={handleStop}
                    disabled={!isCurrentlyListening}
                    className={`w-full sm:w-[120px] px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        !isCurrentlyListening
                            ? 'bg-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-red-600 hover:bg-red-700 hover:scale-105 shadow-lg'
                    } text-white`}
                >
                    ⏹️ Stop
                </button>
                
                <button
                    onClick={handleReset}
                    disabled={!transcript.trim()}
                    className={`w-full sm:w-[120px] px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        !transcript.trim()
                            ? 'bg-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-yellow-500 hover:bg-yellow-600 hover:scale-105 shadow-lg'
                    } text-white`}
                >
                    🗑️ Reset
                </button>
            </div>

            {/* Save button */}
            <button
                onClick={handleSave}
                disabled={!transcript.trim()}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                    !transcript.trim()
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 shadow-lg'
                } text-white`}
            >
                💾 Save Text {transcript.trim() && `(${transcript.trim().length} characters)`}
            </button>
            
            {/* Help text */}
            <p className="text-xs text-gray-500 text-center mt-3">
                💡 Tip: Speak clearly and pause briefly between sentences for better accuracy
            </p>
        </div>
    );
}