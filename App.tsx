import React, { useState, useCallback, useEffect } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Message, MessageRole, MathResponse } from './types';
import { sendMessageToGemini } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Initialize dark mode from localStorage or default to true (Dark Mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return saved === 'true';
      }
      // Default to Dark Mode if no preference is saved
      return true;
    }
    return true;
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Apply dark mode class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: { text: text },
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for API
      const history = messages.map(m => ({
        role: m.role === MessageRole.USER ? 'user' : 'model',
        parts: [{ text: m.content.text }]
      }));

      const response: MathResponse = await sendMessageToGemini(text, history);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        content: response,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Failed to get response", error);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-['Cairo'] transition-colors duration-300`}>
      <Sidebar 
        onExampleClick={(prompt) => handleSendMessage(prompt)}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shadow-sm z-10 transition-colors duration-300">
          <button 
            onClick={toggleSidebar}
            className="p-2 -mr-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 text-center md:text-right">
             <h1 className="text-lg font-bold text-slate-800 dark:text-white md:hidden">الخوارزمي</h1>
             <p className="hidden md:block text-sm text-slate-500 dark:text-slate-400">مساعدك الذكي في الرياضيات</p>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={isDarkMode ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <ChatArea 
            messages={messages}
            isLoading={isLoading}
            input={input}
            onInputChange={(e) => setInput(e.target.value)}
            onSubmit={handleSubmit}
            onRelatedTopicClick={(topic) => handleSendMessage(topic)}
            isDarkMode={isDarkMode}
          />
        </div>
      </main>
    </div>
  );
};

export default App;