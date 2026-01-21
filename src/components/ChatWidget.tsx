'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import {
  MessageCircle,
  Send,
  X,
  Paperclip,
  File,
  Image as ImageIcon,
  FileText,
  Video,
  Download,
  Check,
  CheckCheck,
  Clock,
  User,
  Shield,
  AlertCircle,
  Maximize2,
  Minimize2,
  HelpCircle,
  Settings,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Smile
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'file' | 'system';
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
  sender: {
    first_name: string;
    last_name: string;
    profile_picture: string | null;
    is_admin?: boolean;
  };
}

interface Conversation {
  id: string;
  user_id: string;
  admin_id: string | null;
  status: 'active' | 'resolved' | 'archived';
  subject: string | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  last_message_at: string;
}

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastMessageAtRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize conversation
  useEffect(() => {
    if (!user?.id) return;

    const initConversation = async () => {
      try {
        // Check for existing active conversation
        const { data: existingConversations } = await supabase
          .from('chat_conversations')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('last_message_at', { ascending: false })
          .limit(1);

        let conversationId: string;

        if (existingConversations && existingConversations.length > 0) {
          conversationId = existingConversations[0].id;
          setConversation(existingConversations[0]);
        } else {
          // Create new conversation
          const { data: newConversation, error } = await supabase
            .from('chat_conversations')
            .insert([{
              user_id: user.id,
              subject: 'General Support Request',
              priority: 'normal',
              status: 'active'
            }])
            .select()
            .single();

          if (error) throw error;
          conversationId = newConversation.id;
          setConversation(newConversation);
        }

        // Fetch messages for conversation
        await fetchMessages(conversationId);

        // Get unread count
        const { count } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conversationId)
          .eq('read', false)
          .eq('sender_id', 'admin-system');

        setUnreadCount(count || 0);
      } catch (error) {
        console.error('Error initializing conversation:', error);
        toast({
          title: "Error",
          description: "Failed to load chat. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initConversation();
  }, [user?.id]);

  // Fetch messages
  const fetchMessages = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:profiles (
          first_name,
          last_name,
          profile_picture
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    setMessages(data || []);

    if (data?.length) {
      lastMessageAtRef.current = data[data.length - 1].created_at;
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};


  // Mark messages as read
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('read', false)
        .eq('sender_id', 'admin-system');

      if (error) throw error;
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, []);

  // Send message
  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !conversation || isSending) return;

    setIsSending(true);

    try {
      let messageContent = newMessage;
      let fileUrl = null;
      let fileName = null;
      let fileSize = null;
      let messageType: 'text' | 'file' = 'text';

      // Handle file upload
      if (selectedFile) {
        setIsUploading(true);
        const fileExt = selectedFile.name.split('.').pop();
        const fileNameWithTimestamp = `${Date.now()}.${fileExt}`;
        const filePath = `chat-files/${conversation.id}/${fileNameWithTimestamp}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('chat-files')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('chat-files')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
        fileName = selectedFile.name;
        fileSize = selectedFile.size;
        messageType = 'file';
        messageContent = selectedFile.name;
      }

      // Create message
      const { data: messageData, error } = await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: conversation.id,
          sender_id: user!.id,
          message: messageContent,
          message_type: messageType,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          read: false
        }])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      if (messageData) {
        setMessages(prev => [...prev, {
          ...messageData,
          sender: {
            first_name: user!.firstName,
            last_name: user!.lastName,
            profile_picture: user!.profilePicture
          }
        }]);
      }

      // Clear inputs
      setNewMessage('');
      setSelectedFile(null);
      setUploadProgress(0);

      // Update conversation last message
      await supabase
        .from('chat_conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversation.id);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
      setIsUploading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'application/zip'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "File type not allowed",
        description: "Please upload a valid file type (images, PDF, documents, text, zip)",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  // Play notification sound
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(console.error);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  // Show browser notification
  const showBrowserNotification = (title: string, body: string) => {
    if (!notificationsEnabled || !('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body, icon: '/favicon.ico' });
        }
      });
    }
  };

  // Real-time subscription for new messages
  useEffect(() => {
  if (!conversation?.id) return;

  const interval = setInterval(async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:profiles (
          first_name,
          last_name,
          profile_picture
        )
      `)
      .eq('conversation_id', conversation.id)
      .gt('created_at', lastMessageAtRef.current ?? '1970-01-01')
      .order('created_at', { ascending: true });

    if (data?.length) {
      lastMessageAtRef.current = data[data.length - 1].created_at;

      setMessages(prev => {
        const seen = new Set(prev.map(m => m.id));
        const fresh = data.filter(m => !seen.has(m.id));
        return [...prev, ...fresh];
      });
    }
  }, 2000);

  return () => clearInterval(interval);
}, [conversation?.id]);


  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Get file icon based on type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="w-4 h-4" />;
    } else if (['pdf'].includes(extension || '')) {
      return <FileText className="w-4 h-4" />;
    } else if (['mp4', 'avi', 'mov'].includes(extension || '')) {
      return <Video className="w-4 h-4" />;
    } else {
      return <File className="w-4 h-4" />;
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      // Ctrl/Cmd + Enter to send message
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, sendMessage]);

  // Open chat and mark messages as read
  const handleOpenChat = () => {
    setIsOpen(true);
    if (conversation) {
      markAsRead(conversation.id);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed z-50 bg-card border border-border rounded-2xl shadow-elegant flex flex-col
          ${isExpanded 
            ? 'inset-4 lg:inset-20 rounded-2xl' 
            : 'bottom-20 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] max-w-[400px] h-[500px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-navy-light text-primary-foreground p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-xs text-primary-foreground/80">
                  {conversation?.status === 'resolved' ? 'Resolved • ' : ''}
                  We're here to help
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {conversation?.priority === 'urgent' && (
                <span className="px-2 py-1 text-xs bg-red-500/20 text-red-200 rounded-full">
                  Urgent
                </span>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary-foreground hover:bg-white/10 rounded-lg p-1 transition-colors"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-primary-foreground hover:bg-white/10 rounded-lg p-1 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-white/10 rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-secondary border-b border-border p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                    <span className="text-sm">Sound Notifications</span>
                  </div>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-10 h-6 rounded-full transition-colors ${soundEnabled ? 'bg-accent' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform transform ${soundEnabled ? 'translate-x-5' : 'translate-x-1'} mt-1`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {notificationsEnabled ? (
                      <Bell className="w-4 h-4" />
                    ) : (
                      <BellOff className="w-4 h-4" />
                    )}
                    <span className="text-sm">Browser Notifications</span>
                  </div>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-10 h-6 rounded-full transition-colors ${notificationsEnabled ? 'bg-accent' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-1'} mt-1`} />
                  </button>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Conversation ID: {conversation?.id?.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div 
            
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Start a Conversation
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Our support team is ready to help you with any questions or issues.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-secondary p-3 rounded-lg">
                    <p className="font-medium">Quick Response</p>
                    <p className="text-xs text-muted-foreground">Typically within 5 minutes</p>
                  </div>
                  <div className="bg-secondary p-3 rounded-lg">
                    <p className="font-medium">24/7 Support</p>
                    <p className="text-xs text-muted-foreground">Available anytime</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Welcome message */}
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground">
                    Conversation started {conversation && formatDate(conversation.last_message_at)}
                  </p>
                </div>

                {/* Messages */}
                {messages.map((msg, index) => {
                  const isUser = msg.sender_id === user.id;
                  const isAdmin = msg.sender.is_admin;
                  const showDate = index === 0 || 
                    new Date(msg.created_at).getDate() !== 
                    new Date(messages[index - 1].created_at).getDate();

                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <div className="bg-secondary px-3 py-1 rounded-full">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(msg.created_at)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
                          <div className={`rounded-2xl px-4 py-3 ${
                            isUser 
                              ? 'bg-accent text-accent-foreground rounded-br-none' 
                              : 'bg-secondary text-foreground rounded-bl-none'
                          }`}>
                            {/* Sender info for admin messages */}
                            {!isUser && (
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs font-medium">
                                    {msg.sender.first_name}
                                  </span>
                                  {isAdmin && (
                                    <Shield className="w-3 h-3 text-blue-500" />
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Message content */}
                            {msg.message_type === 'file' ? (
                              <div className={`flex items-center space-x-3 p-2 rounded-lg ${
                                isUser ? 'bg-accent/20' : 'bg-black/10'
                              }`}>
                                {getFileIcon(msg.file_name || '')}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {msg.file_name}
                                  </p>
                                  <p className="text-xs opacity-75">
                                    {formatFileSize(msg.file_size || 0)}
                                  </p>
                                </div>
                                <a
                                  href={msg.file_url || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`p-1 rounded ${
                                    isUser ? 'hover:bg-accent/30' : 'hover:bg-black/20'
                                  }`}
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              </div>
                            ) : (
                              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                            )}

                            {/* Message footer */}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-75">
                                {formatTime(msg.created_at)}
                              </span>
                              {isUser && (
                                <div className="flex items-center space-x-1">
                                  {msg.read ? (
                                    <CheckCheck className="w-3 h-3" />
                                  ) : msg.read_at ? (
                                    <Check className="w-3 h-3" />
                                  ) : (
                                    <Clock className="w-3 h-3" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Admin typing indicator */}
                {adminTyping && (
                  <div className="flex justify-start">
                    <div className="bg-secondary rounded-2xl rounded-bl-none px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Support agent is typing...
                      </p>
                    </div>
                  </div>
                )}

                {/* Conversation status */}
                {conversation?.status === 'resolved' && (
                  <div className="text-center my-4">
                    <div className="inline-flex items-center space-x-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">This conversation has been marked as resolved</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            {/* File Upload Preview */}
            {selectedFile && (
              <div className="mb-3 p-3 bg-accent/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(selectedFile.name)}
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadProgress(0);
                    }}
                    className="p-1 hover:bg-accent/20 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                title="Attach file"
                disabled={isSending || conversation?.status === 'resolved'}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={conversation?.status === 'resolved' 
                    ? "This conversation is resolved. Start a new one if you need more help."
                    : "Type your message here..."
                  }
                  className="w-full px-4 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                  disabled={isSending || conversation?.status === 'resolved'}
                />
              </div>
              
              <button
                onClick={sendMessage}
                disabled={isSending || (!newMessage.trim() && !selectedFile) || conversation?.status === 'resolved'}
                className="px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent-foreground border-t-transparent"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <div>
                Press <kbd className="px-1.5 py-0.5 bg-secondary rounded border">Ctrl/Cmd + Enter</kbd> to send
              </div>
              <div className="flex items-center space-x-4">
                <span>Max file size: 10MB</span>
                <button
                  onClick={() => {
                    const subject = prompt("Change conversation subject:", conversation?.subject || "");
                    if (subject !== null && conversation) {
                      supabase
                        .from('chat_conversations')
                        .update({ subject })
                        .eq('id', conversation.id);
                    }
                  }}
                  className="hover:text-foreground"
                >
                  Edit subject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={handleOpenChat}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-gradient-to-br from-accent to-gold-light text-accent-foreground rounded-full shadow-gold flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all duration-200 group"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-16 bottom-0 bg-card border border-border rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          <p className="text-sm font-medium">Customer Support</p>
          <p className="text-xs text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'Chat with support'}
          </p>
        </div>
      </button>
    </>
  );
}