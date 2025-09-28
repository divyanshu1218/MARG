import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '../types';
import { sendMessageToAI, startChat } from '../services/geminiService';

// A simple component to render markdown (bold and lists) from the AI's response.
const MarkdownMessage: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  const processInlineMarkdown = (line: string) => {
    // Bold: **text**
    return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const elements: React.ReactNode[] = [];
  let currentListItems: string[] = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1">
          {currentListItems.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: processInlineMarkdown(item) }} />
          ))}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('• ')) {
      currentListItems.push(trimmedLine.substring(2));
    } else {
      flushList(); // End any existing list
      if (trimmedLine) {
        elements.push(
          <p key={`p-${index}`} dangerouslySetInnerHTML={{ __html: processInlineMarkdown(line) }} />
        );
      }
    }
  });

  flushList(); // Flush any list at the very end

  return <div className="text-sm space-y-2">{elements}</div>;
};


const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    startChat().then(() => {
        setMessages([
            {
                role: 'model',
                text: "Hello! I'm MARG, your AI guide. I can help you find your way around. For example, you can say:\n\n• \"Show me careers in Technology\"\n• \"Let's see the career paths\"\n• \"Go to my student dashboard\"",
            },
        ]);
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSmartNavigation = (text: string) => {
    const lowerCaseText = text.toLowerCase();
    
    // Regex to find a career name after specific phrases
    const careerRegex = /(?:colleges for|details for|details about|information on|tell me about)\s(?:an?|the\s)?(.+)/i;
    const careerMatch = lowerCaseText.match(careerRegex);

    if (careerMatch && careerMatch[1]) {
        // Capitalize each word for better matching, e.g., "software engineer" -> "Software Engineer"
        const careerQuery = careerMatch[1].trim()
            .replace(/\?$/, '') // remove trailing question mark
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        navigate(`/careers?search=${encodeURIComponent(careerQuery)}`);
        return; // Prioritize this match
    }

    // General navigation keywords
    if (lowerCaseText.includes('quiz')) navigate('/quiz');
    else if (lowerCaseText.includes('student') || (lowerCaseText.includes('my') && lowerCaseText.includes('dashboard'))) navigate('/student');
    else if (lowerCaseText.includes('parent')) navigate('/parent');
    else if (lowerCaseText.includes('teacher')) navigate('/teacher');
    else if (lowerCaseText.includes('careers') || lowerCaseText.includes('jobs')) navigate('/careers');
    else if (lowerCaseText.includes('paths') || lowerCaseText.includes('roadmap')) navigate('/paths');
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    const currentInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    handleSmartNavigation(currentInput);

    try {
      const response = await sendMessageToAI(currentInput, messages);
      const modelMessage: ChatMessage = { role: 'model', text: response };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const quickActions = ["Take the Quiz", "Explore Careers", "Student Dashboard", "Parent Dashboard"];

  const handleQuickAction = (action: string) => {
    setInput(action);
    // Mimic sending after a short delay to allow state update
    setTimeout(() => document.getElementById('send-button')?.click(), 100);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 bg-marg-primary text-white px-6 py-3 rounded-full shadow-lg font-semibold text-sm hover:bg-marg-primary/90 focus:outline-none focus:ring-2 focus:ring-marg-primary focus:ring-opacity-50 transition-transform hover:scale-110"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        MARG AI
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-5 w-full max-w-sm h-[70vh] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-out transform scale-100 origin-bottom-right">
          <div className="p-4 bg-marg-primary text-white rounded-t-xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">MARG AI</h3>
              <p className="text-sm text-white/80">Your personal career guide</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white" aria-label="Close chat">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-marg-bg">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                <div className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-sm ${msg.role === 'user' ? 'bg-marg-accent text-white' : 'bg-marg-bg-light text-marg-text-primary'}`}>
                  {msg.role === 'model' 
                    ? <MarkdownMessage text={msg.text} /> 
                    : <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  }
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                 <div className="rounded-lg px-4 py-2 bg-marg-bg-light text-marg-text-primary">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-marg-secondary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-marg-secondary rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-marg-secondary rounded-full animate-bounce delay-150"></div>
                    </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-200 bg-marg-bg rounded-b-xl">
             <div className="grid grid-cols-2 gap-2 mb-3">
                {quickActions.map(action => (
                    <button key={action} onClick={() => handleQuickAction(action)} className="text-xs text-center bg-marg-bg-light border border-marg-secondary/30 text-marg-primary p-2 rounded-lg hover:bg-marg-secondary/10 transition-colors font-semibold">
                        {action}
                    </button>
                ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-marg-text-primary focus:ring-2 focus:ring-marg-accent focus:outline-none"
              />
              <button id="send-button" onClick={handleSend} className="bg-marg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-marg-primary/90 transition-opacity disabled:opacity-50" disabled={isLoading}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;