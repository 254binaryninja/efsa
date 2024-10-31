import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Bot } from "lucide-react";
import { handleQuestion } from "@/actions/generation";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    role: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

const ChatBot = ({ isOpen, onClose }: ModalProps) => {
    const [isLoading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userInput.trim() || isLoading) return;

        const newMessage: Message = {
            role: 'user',
            content: userInput,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setUserInput('');
        setLoading(true);

        try {
            const response = await handleQuestion(userInput);

            if (response.success) {
                const botMessage: Message = {
                    role: 'bot',
                    content: response.response,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            const errorMessage: Message = {
                role: 'bot',
                content: "I apologize, but I'm having trouble processing your request. Please try again.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex h-[600px] w-full max-w-[500px] flex-col gap-0 p-0 bg-white dark:bg-gray-950">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-500" />
                        <span>Chat with Cjay</span>
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6 py-4">
                    <div className="flex flex-col gap-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex flex-col ${
                                    message.role === 'user' ? 'items-end' : 'items-start'
                                }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                        message.role === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800'
                                    }`}
                                >
                                    {message.content}
                                </div>
                                <span className="text-xs text-gray-500 mt-1">
                  {formatTime(message.timestamp)}
                </span>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-2 text-gray-500">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Cjay is typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                <form
                    onSubmit={handleSend}
                    className="flex items-center gap-2 border-t p-4 bg-gray-50 dark:bg-gray-900"
                >
                    <Input
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !userInput.trim()}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>

                <div className="px-4 py-2 text-center border-t">
                    <p className="text-xs text-gray-500">
                        Powered by Gemini AI • Responses may contain inaccuracies
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChatBot;