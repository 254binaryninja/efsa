import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Bot, Bold, Italic, Code, Link as LinkIcon } from "lucide-react";
import { handleQuestion } from "@/actions/generation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    role: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

interface FormatButton {
    label: string;
    icon: React.ReactNode;
    prefix: string;
    suffix: string;
}

const ChatBot = ({ isOpen, onClose }: ModalProps) => {
    const [isLoading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [selectedFormat, setSelectedFormat] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const formatButtons: FormatButton[] = [
        { label: 'Bold', icon: <Bold className="h-4 w-4" />, prefix: '**', suffix: '**' },
        { label: 'Italic', icon: <Italic className="h-4 w-4" />, prefix: '_', suffix: '_' },
        { label: 'Code', icon: <Code className="h-4 w-4" />, prefix: '`', suffix: '`' },
        { label: 'Link', icon: <LinkIcon className="h-4 w-4" />, prefix: '[', suffix: '](url)' },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const applyFormat = (format: FormatButton) => {
        if (!inputRef.current) return;

        const start = inputRef.current.selectionStart;
        const end = inputRef.current.selectionEnd;
        const text = userInput;

        const selectedText = text.substring(start as number, end as number);
        const newText = text.substring(0, start as number) +
            format.prefix + selectedText + format.suffix +
            text.substring(end as number);

        setUserInput(newText);

        // Reset focus and selection
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(
                start as number + format.prefix.length,
                end as number + format.prefix.length
            );
        }, 0);
    };

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
                    content: response.response!,
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
            console.log(error)
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
            <DialogContent className="flex h-[500px] w-full max-w-[700px] flex-col m-5 gap-0 p-0 bg-white dark:bg-gray-950">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-500" />
                        <span>Chat with Cjay</span>
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6 py-4">
                    <div className="flex flex-col gap-6">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex gap-3 ${
                                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                }`}
                            >
                                <Avatar className="w-8 h-8">
                                    {message.role === 'user' ? (
                                        <>
                                            <AvatarImage src="/placeholder-user.jpg" alt="User" />
                                            <AvatarFallback>U</AvatarFallback>
                                        </>
                                    ) : (
                                        <>
                                            <AvatarImage src="/cjay-bot.jpg" alt="Cjay" />
                                            <AvatarFallback>CJ</AvatarFallback>
                                        </>
                                    )}
                                </Avatar>
                                <div className={`flex flex-col max-w-[80%] ${
                                    message.role === 'user' ? 'items-end' : 'items-start'
                                }`}>
                                    <div className={`rounded-lg p-4 ${
                                        message.role === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800'
                                    }`}>
                                        <ReactMarkdown
                                            className="prose dark:prose-invert max-w-none"
                                            components={{
                                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                p: ({node, ...props}) => <p className="m-0" {...props} />,
                                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                code: ({node, ...props}) => <code className="bg-gray-800 dark:bg-gray-700 rounded px-1" {...props} />
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">
                    {formatTime(message.timestamp)}
                  </span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src="/cjay-bot.jpg" alt="Cjay" />
                                    <AvatarFallback>CJ</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Cjay is typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                <div className="border-t">
                    <ToggleGroup
                        type="multiple"
                        value={selectedFormat}
                        onValueChange={setSelectedFormat}
                        className="flex justify-start border-b p-2 gap-1"
                    >
                        {formatButtons.map((format) => (
                            <ToggleGroupItem
                                key={format.label}
                                value={format.label}
                                aria-label={format.label}
                                className="p-2 h-8 w-8"
                                onClick={() => applyFormat(format)}
                            >
                                {format.icon}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>

                    <form
                        onSubmit={handleSend}
                        className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900"
                    >
                        <Input
                            ref={inputRef}
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
                </div>

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