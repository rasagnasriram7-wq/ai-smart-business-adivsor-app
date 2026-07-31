import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { Sparkles, Send, Mic, MicOff, Volume2, VolumeX, Trash2, Copy, Check, Lightbulb, AlertCircle } from 'lucide-react';
import { getStoredChatHistory, saveChatHistory } from '../utils/storage';
import { getApiUrl } from '../config';

interface AIChatViewProps {
  userProfile: UserProfile;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

const PRESET_QUESTIONS = [
  'Which business should I start in ' + 'my city' + '?',
  'How can I earn ₹1 lakh per month?',
  'How can I increase sales and footfall?',
  'Why am I losing money or having low margin?',
  'Which business is most profitable for beginners?',
  'How much investment do I need for a small shop?',
];

const getSpeechLangCode = (prefLang?: string) => {
  switch (prefLang) {
    case 'Telugu':
      return 'te-IN';
    case 'Hindi':
      return 'hi-IN';
    case 'Tamil':
      return 'ta-IN';
    case 'Kannada':
      return 'kn-IN';
    case 'Malayalam':
      return 'ml-IN';
    case 'Marathi':
      return 'mr-IN';
    case 'English':
    default:
      return 'en-IN';
  }
};

export const AIChatView: React.FC<AIChatViewProps> = ({
  userProfile,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(getStoredChatHistory());
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    saveChatHistory(messages);
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  // Handle auto-trigger if launched from dashboard prompt
  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const toggleListening = () => {
    setSpeechError(null);

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getSpeechLangCode(userProfile.preferredLanguage);

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in browser settings.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech was detected. Please try speaking again.');
        } else {
          setSpeechError('Voice input error. Please try again or type your question.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setSpeechError('Could not start microphone. Please check permissions.');
      setIsListening(false);
    }
  };

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/ai/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          userProfile,
          chatHistory: newMessages.slice(-8), // Send recent context
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Failed response');
      }
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'I am experiencing a temporary connection issue. Please check your internet or retry your business query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Clear all chat history with AI Business Mentor?')) {
      const initial: ChatMessage[] = [
        {
          id: 'welcome-reset',
          sender: 'ai',
          text: `Namaste ${userProfile.fullName.split(' ')[0]}! I am your AI Business Advisor (Gemma 4). Ready to assist with your target in ${userProfile.city}! What business question is on your mind?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      setMessages(initial);
      saveChatHistory(initial);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] pb-20 text-slate-100">
      {/* Top Chat Header */}
      <div className="flex items-center justify-between p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl mb-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center font-bold text-slate-950">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-100">Gemma 4 Business Mentor</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">
              Language: <span className="text-emerald-400 font-semibold">{userProfile.preferredLanguage}</span> • City:{' '}
              {userProfile.city}
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          title="Clear Chat History"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto space-y-3.5 p-2 pr-1 custom-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[90%] ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                <span>{isUser ? 'You' : 'Gemma 4 AI Mentor'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`rounded-2xl p-4 text-xs md:text-sm leading-relaxed shadow-lg relative group ${
                  isUser
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* AI Message Action bar */}
                {!isUser && (
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <button
                      onClick={() => speakText(msg.text)}
                      className="hover:text-emerald-400 flex items-center gap-1 transition"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                    </button>

                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="hover:text-emerald-400 flex items-center gap-1 transition ml-2"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-slate-900/80 border border-slate-800 rounded-2xl p-3 max-w-xs animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Analyzing business parameters in {userProfile.preferredLanguage}...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="pt-2 pb-1 overflow-x-auto flex gap-2 no-scrollbar">
        {PRESET_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(q)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-[11px] font-medium text-slate-300 hover:text-white whitespace-nowrap transition"
          >
            💡 {q}
          </button>
        ))}
      </div>

      {/* Speech Recognition Error Banner */}
      {speechError && (
        <div className="mt-2 px-3 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{speechError}</span>
          </div>
          <button
            onClick={() => setSpeechError(null)}
            className="text-slate-400 hover:text-white font-bold ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Active Speech Listening Indicator */}
      {isListening && (
        <div className="mt-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs flex items-center justify-between text-rose-300 animate-pulse">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Listening in {userProfile.preferredLanguage}... Speak now!</span>
          </div>
          <button
            onClick={toggleListening}
            className="text-xs bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 px-2 py-0.5 rounded-lg transition"
          >
            Stop
          </button>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="mt-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center gap-2 shadow-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={
            isListening
              ? `Listening in ${userProfile.preferredLanguage}...`
              : `Ask anything about business in ${userProfile.preferredLanguage}...`
          }
          className="flex-1 bg-transparent px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none placeholder:text-slate-500"
        />

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={toggleListening}
          title={isListening ? 'Stop listening' : `Speak question in ${userProfile.preferredLanguage}`}
          className={`p-2.5 rounded-xl font-bold transition flex items-center justify-center shrink-0 ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className={`p-2.5 rounded-xl font-bold transition flex items-center justify-center ${
            input.trim() && !loading
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
