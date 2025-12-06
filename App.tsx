import React, { useState, useCallback } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Message, MessageRole, MathResponse } from './types';
import { sendMessageToGemini } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Cairo']">
      <Sidebar 
        onExampleClick={(prompt) => handleSendMessage(prompt)}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-10">
          <button 
            onClick={toggleSidebar}
            className="p-2 -mr-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 text-center md:text-right">
             <h1 className="text-lg font-bold text-slate-800 md:hidden">الخوارزمي</h1>
             <p className="hidden md:block text-sm text-slate-500">مساعدك الذكي في الرياضيات</p>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <ChatArea 
            messages={messages}
            isLoading={isLoading}
            input={input}
            onInputChange={(e) => setInput(e.target.value)}
            onSubmit={handleSubmit}
            onRelatedTopicClick={(topic) => handleSendMessage(topic)}
          />
        </div>
      </main>
    </div>
  );
};

export default App;