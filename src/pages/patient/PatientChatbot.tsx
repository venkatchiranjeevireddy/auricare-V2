import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Bot, User, Send, Heart } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const PatientChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your personal AI Health Assistant. I can help you track symptoms, understand your treatment plan, answer health questions, and provide support. How are you feeling today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    'How am I progressing with my treatment?',
    'What should I do about side effects?',
    'Remind me about my medication schedule',
    'I\'m feeling anxious about my condition'
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response with more personalized content
    setTimeout(() => {
      const responses = [
        'Based on your recent progress reports, you\'re doing very well! Your health score has improved by 15% over the past month. Keep following your treatment plan.',
        'I understand your concern. It\'s normal to have questions about your treatment. Let me provide some guidance based on your medical history.',
        'Your symptoms seem to be improving according to your latest reports. Remember to take your medication as prescribed and maintain your healthy lifestyle.',
        'I\'m here to support you through your health journey. It\'s important to stay positive and follow your doctor\'s recommendations.'
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1500);
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Personal AI Health Assistant
        </h1>
        <p className="text-gray-600 mt-2">Get personalized health guidance and support</p>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="size-5 text-green-600" />
            Your Health Companion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gradient-to-b from-green-50/50 to-blue-50/50 rounded-lg">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`p-2 rounded-full ${message.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      {message.role === 'user' ? (
                        <User className="size-4 text-blue-600" />
                      ) : (
                        <Heart className="size-4 text-green-600" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border shadow-sm'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="p-2 rounded-full bg-green-100">
                    <Heart className="size-4 text-green-600" />
                  </div>
                  <div className="p-3 rounded-lg bg-white border shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your health, symptoms, or treatment..."
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="bg-white/50"
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-green-600 hover:bg-green-700">
                <Send className="size-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestion(suggestion)}
                  className="text-xs bg-white/50 hover:bg-white/80 border-green-200 hover:border-green-300"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <MessageSquare className="size-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Personalized Care</h3>
              <p className="text-sm text-green-700 mt-1">
                This AI assistant has access to your health progress and can provide personalized guidance. However, always consult with your healthcare provider for medical decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PatientChatbot;