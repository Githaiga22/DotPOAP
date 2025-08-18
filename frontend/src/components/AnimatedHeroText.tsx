import { useState, useEffect } from "react";

const AnimatedHeroText = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);
  
  const words = ["Celebrate,", "Collect,", "and Verify Your", "Web3 Journey"];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWordIndex((prev) => {
        if (prev < words.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => setShowSubtitle(true), 500);
          return prev;
        }
      });
    }, 800);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight min-h-[200px] md:min-h-[240px] lg:min-h-[288px]">
        {words.map((word, index) => (
          <span key={index} className="block">
            <span 
              className={`
                inline-block transition-all duration-500 ease-out
                ${index <= currentWordIndex 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
                }
                ${index === 0 || index === 3 
                  ? 'bg-gradient-primary bg-clip-text text-transparent' 
                  : 'text-foreground'
                }
              `}
            >
              {word}
            </span>
          </span>
        ))}
      </h1>
      <p 
        className={`
          text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 transition-all duration-700 ease-out
          ${showSubtitle 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
          }
        `}
      >
      on Polkadot
      </p>
    </div>
  );
};

export default AnimatedHeroText;