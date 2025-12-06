import React, { useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Message, MessageRole } from '../types';
import MathBlock from './MathBlock';
import PlotArea from './PlotArea';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onRelatedTopicClick: (topic: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  messages, 
  isLoading, 
  input, 
  onInputChange, 
  onSubmit,
  onRelatedTopicClick
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60 mt-10">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <Sparkles className="w-10 h-10 text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">مرحباً بك في الخوارزمي</h2>
            <p className="text-slate-500 max-w-md">
              اسأل أي سؤال رياضي، اطلب حل معادلة، أو ارسم دالة بيانية.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm
              ${msg.role === MessageRole.USER ? 'bg-indigo-600 text-white' : 'bg-white text-teal-600 border border-slate-100'}
            `}>
              {msg.role === MessageRole.USER ? <User size={20} /> : <Bot size={20} />}
            </div>

            <div className={`
              flex flex-col max-w-[85%] md:max-w-[75%]
              ${msg.role === MessageRole.USER ? 'items-end' : 'items-start'}
            `}>
              <div className={`
                p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed
                ${msg.role === MessageRole.USER 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}
              `}>
                {/* Main Text Response */}
                <div className="whitespace-pre-wrap mb-2">
                  {msg.content.text}
                </div>

                {/* LaTeX Block if present */}
                {msg.content.latex && (
                  <div className="my-4 p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-center overflow-x-auto">
                    <MathBlock latex={msg.content.latex} block />
                  </div>
                )}

                {/* Chart if present */}
                {msg.content.chartData && (
                  <PlotArea data={msg.content.chartData} label={msg.content.chartLabel || ''} />
                )}
              </div>

              {/* Related Topics Suggestions */}
              {msg.role === MessageRole.MODEL && msg.content.relatedTopics && msg.content.relatedTopics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.content.relatedTopics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => onRelatedTopicClick(topic)}
                      className="text-xs bg-white text-teal-700 px-3 py-1.5 rounded-full border border-teal-100 hover:bg-teal-50 hover:border-teal-200 transition-all shadow-sm"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 items-start">
             <div className="w-10 h-10 rounded-full bg-white text-teal-600 border border-slate-100 flex items-center justify-center shadow-sm">
               <Bot size={20} />
             </div>
             <div className="bg-white px-6 py-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
               <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
               <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form 
          onSubmit={onSubmit}
          className="max-w-4xl mx-auto relative flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={onInputChange}
            placeholder="اكتب معادلة أو اسأل سؤالاً رياضياً..."
            className="w-full h-12 pr-4 pl-12 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-all text-right placeholder-slate-400"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute left-2 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <Send size={18} className={isLoading ? 'opacity-0' : 'opacity-100'} />
            {isLoading && (
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               </div>
            )}
          </button>
        </form>
        <div className="max-w-4xl mx-auto mt-2 text-center">
            <p className="text-[10px] text-slate-400">
                قد يرتكب الذكاء الاصطناعي أخطاء. يرجى التحقق من المعلومات الهامة.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;