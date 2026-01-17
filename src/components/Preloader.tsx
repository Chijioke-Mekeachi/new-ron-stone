import { useEffect, useState } from "react";

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide preloader after content loads
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="text-center">
        {/* Circular Spinner */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-24 h-24">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-accent/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin"></div>
            
            {/* Inner logo */}
            <div className="absolute inset-3 bg-gradient-to-br from-accent to-gold-light rounded-full flex items-center justify-center shadow-gold">
              <span className="text-primary font-bold text-2xl">RS</span>
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-muted-foreground font-medium">Loading your banking experience...</p>
      </div>
    </div>
  );
};

export default Preloader;
