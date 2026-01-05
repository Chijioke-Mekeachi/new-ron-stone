import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    toast({
      title: "Message Sent",
      description: "Our support team will get back to you shortly!",
    });

    setMessage("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-[350px] max-w-[350px] bg-card border border-border rounded-2xl shadow-elegant z-50 animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-navy-light text-primary-foreground p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-xs text-primary-foreground/80">We're here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-white/10 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Content */}
          <div className="p-4 h-[300px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              <div className="bg-secondary p-3 rounded-lg rounded-tl-none max-w-[80%]">
                <p className="text-sm text-secondary-foreground">
                  Hello! How can we help you today?
                </p>
                <p className="text-xs text-muted-foreground mt-1">Support Team</p>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-accent to-gold-light text-accent-foreground rounded-full shadow-gold flex items-center justify-center z-50 hover:scale-110 transition-transform duration-200"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </>
  );
};

export default ChatWidget;
