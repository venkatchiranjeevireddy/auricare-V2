import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Bot, User, Send, Stethoscope, TrendingUp, Users } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const DoctorChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello Doctor! I\'m your AI Medical Assistant. I can help you with patient analysis, treatment recommendations, medical research, and administrative tasks. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    'Analyze patient symptoms and suggest diagnosis',
    'Recommend treatment protocols for hypertension',
    'Latest research on diabetes management',
    'Help me create a patient care plan',
    'Drug interaction checker',
    'Medical coding assistance'
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

    // Simulate AI response with medical context
    setTimeout(() => {
      const medicalResponses = [
        'Based on the symptoms you\'ve described, I recommend considering differential diagnoses including... Please note this is for informational purposes and should be combined with your clinical judgment.',
        'According to recent medical literature and guidelines, the recommended treatment approach would be... I can provide you with the latest research papers on this topic.',
        'The patient\'s lab results suggest... Here are some evidence-based treatment options to consider, along with monitoring parameters.',
        'For this condition, the standard of care includes... I\'ve also identified some recent clinical trials that might be relevant to your patient\'s case.',
        'Drug interaction analysis shows... Here are alternative medications to consider, along with dosing recommendations based on patient factors.'
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: medicalResponses[Math.floor(Math.random() * medicalResponses.length)],
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
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          AI Medical Assistant
        </h1>
        <p className="text-gray-600 mt-2">Advanced AI support for clinical decision making</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Stethoscope className="size-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Diagnostic Support</h3>
                <p className="text-sm text-gray-600">AI-powered symptom analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="size-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Treatment Plans</h3>
                <p className="text-sm text-gray-600">Evidence-based recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Users className="size-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Patient Insights</h3>
                <p className="text-sm text-gray-600">Comprehensive patient analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="size-5 text-purple-600" />
            Medical AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gradient-to-b from-purple-50/50 to-blue-50/50 rounded-lg">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`p-2 rounded-full ${message.role === 'user' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                      {message.role === 'user' ? (
                        <User className="size-4 text-blue-600" />
                      ) : (
                        <Stethoscope className="size-4 text-purple-600" />
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
                  <div className="p-2 rounded-full bg-purple-100">
                    <Stethoscope className="size-4 text-purple-600" />
                  </div>
                  <div className="p-3 rounded-lg bg-white border shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about diagnoses, treatments, drug interactions, or patient care..."
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="bg-white/50"
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-purple-600 hover:bg-purple-700">
                <Send className="size-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestion(suggestion)}
                  className="text-xs bg-white/50 hover:bg-white/80 border-purple-200 hover:border-purple-300 justify-start"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <MessageSquare className="size-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">Medical AI Disclaimer</h3>
              <p className="text-sm text-amber-700 mt-1">
                This AI assistant provides information for educational and decision-support purposes only. All recommendations should be validated with current medical literature and your clinical expertise. Always follow established medical protocols and guidelines.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DoctorChatbot;