import sendIcon from "../../assets/send.svg";
import { useState, useEffect } from "react";
import api from "../../api/api";
import { useRef } from "react";

export const TextInput = ({
  value,
  onChange,
  onSubmit,
  validateAsZip = false,
  onValidationError,
  isAgeInput = false,
  scrollToBottom,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [isDOMReady, setIsDOMReady] = useState(false);
  const [hasAttemptedFocus, setHasAttemptedFocus] = useState(false);

  // Wait for DOM to be fully ready
  useEffect(() => {
    const checkDOMReady = () => {
      if (document.readyState === 'complete') {
        setIsDOMReady(true);
      } else {
        const handleLoad = () => {
          setIsDOMReady(true);
          document.removeEventListener('DOMContentLoaded', handleLoad);
          window.removeEventListener('load', handleLoad);
        };
        
        document.addEventListener('DOMContentLoaded', handleLoad);
        window.addEventListener('load', handleLoad);
        
        return () => {
          document.removeEventListener('DOMContentLoaded', handleLoad);
          window.removeEventListener('load', handleLoad);
        };
      }
    };

    checkDOMReady();
  }, []);

  // Enhanced focus handling that waits for DOM readiness
  useEffect(() => {
    if (!isDOMReady || !inputRef.current || hasAttemptedFocus) return;

    const focusInput = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      if (isMobile) {
        // Strategy 1: Immediate focus attempt
        inputRef.current.focus();
        
        // Strategy 2: User interaction listener
        const handleInteraction = (e) => {
          if (inputRef.current && document.activeElement !== inputRef.current) {
            e.preventDefault();
            inputRef.current.focus();
          }
          document.removeEventListener('touchstart', handleInteraction, { capture: true });
          document.removeEventListener('click', handleInteraction, { capture: true });
        };

        document.addEventListener('touchstart', handleInteraction, { 
          capture: true, 
          once: true,
          passive: false 
        });
        document.addEventListener('click', handleInteraction, { 
          capture: true, 
          once: true 
        });

        // Strategy 3: Delayed attempts with increasing intervals
        const delays = [100, 300, 600, 1000];
        delays.forEach((delay) => {
          setTimeout(() => {
            if (inputRef.current && document.activeElement !== inputRef.current) {
              inputRef.current.focus();
              inputRef.current.click();
            }
          }, delay);
        });

        // Strategy 4: Intersection Observer for when input comes into view
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && inputRef.current) {
              setTimeout(() => {
                inputRef.current.focus();
              }, 100);
              observer.disconnect();
            }
          },
          { threshold: 0.1 }
        );

        if (inputRef.current) {
          observer.observe(inputRef.current);
        }

      } else {
        // Desktop - simpler approach
        inputRef.current.focus();
      }

      setHasAttemptedFocus(true);
    };

    // Use multiple timing strategies
    requestAnimationFrame(() => {
      setTimeout(focusInput, 50);
    });

  }, [isDOMReady, hasAttemptedFocus]);

  // Re-attempt focus when component becomes visible (for chat switching)
  useEffect(() => {
    if (hasAttemptedFocus) return;

    const handleVisibilityChange = () => {
      if (!document.hidden && inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasAttemptedFocus]);

  useEffect(() => {
    if (validationMessage && scrollToBottom) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [validationMessage, scrollToBottom]);

  const validateZip = async (zip) => {
    if (!zip || zip.length < 3 || zip.length > 6) {
      setIsValid(false);
      setValidationMessage("ZIP code must be between 3 and 6 digits.");
      onValidationError?.();
      return false;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/check-valid-zipcode", { zipcode: zip });
      setIsValid(data?.type === "success");

      if (data?.type !== "success") {
        setValidationMessage("Invalid ZIP code.");
        onValidationError?.();
        return false;
      }

      setValidationMessage(null);
      return true;
    } catch (error) {
      console.error("ZIP code validation failed", error);
      setValidationMessage(
        error?.response?.data?.message || "ZIP code validation failed."
      );
      setIsValid(false);
      onValidationError?.();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (rawValue) => {
    let cleaned = rawValue;

    if (validateAsZip) {
      cleaned = rawValue.replace(/\D/g, ""); // only digits
    } else if (isAgeInput) {
      cleaned = rawValue.replace(/\D/g, ""); // only digits for age too
      // enforce max 3 digits for age
      if (cleaned.length > 3) {
        cleaned = cleaned.slice(0, 3);
      }
    }

    onChange(cleaned);
    setIsValid(true);
    setValidationMessage(null);
  };

  const handleSubmit = async () => {
    if (validateAsZip) {
      const isZipValid = await validateZip(value);
      if (isZipValid) onSubmit();
    } else if (isAgeInput) {
      const age = parseInt(value, 10);
      if (!age || isNaN(age) || age < 18 || age > 110) {
        setIsValid(false);
        setValidationMessage("Age must be a number between 18 and 110.");
        onValidationError?.();
        if (scrollToBottom) {
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      } else {
        setIsValid(true);
        onSubmit();
      }
    } else {
      if (value.trim()) {
        setIsValid(true);
        onSubmit();
      } else {
        setIsValid(false);
        setValidationMessage("This field is required.");
        onValidationError?.();
        if (scrollToBottom) {
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    // Block non-digit input for age (prevents 'e', '+', '-', '.')
    if (isAgeInput) {
      const allowedControlKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Home",
        "End",
      ];
      if (allowedControlKeys.includes(e.key)) return;
      if (e.ctrlKey || e.metaKey) return; // allow copy/paste shortcuts; paste sanitized below

      // prevent non-digits
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        return;
      }

      // enforce max length 3 at keydown
      const current = String(value || "");
      if (current.length >= 3) {
        e.preventDefault();
        return;
      }
    }

    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handlePaste = (e) => {
    if (!isAgeInput) return;
    const text = (e.clipboardData || window.clipboardData)?.getData("text") || "";
    const digits = text.replace(/\D/g, "");
    const current = String(value || "");
    if (!digits) {
      e.preventDefault();
      return;
    }
    const room = Math.max(0, 3 - current.length);
    const toInsert = digits.slice(0, room);
    e.preventDefault();
    if (toInsert) {
      handleChange(current + toInsert);
    }
  };

  // Handle container tap for mobile focus
  const handleContainerTap = () => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col gap-2" onTouchStart={handleContainerTap}>
      {validationMessage && (
        <p className="text-red-500 jost text-sm">{validationMessage}</p>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type={isAgeInput ? "number" : "text"}
          inputMode={validateAsZip || isAgeInput ? "numeric" : "text"}
          pattern={validateAsZip || isAgeInput ? "\\d*" : undefined}
          disabled={loading }
          maxLength={validateAsZip ? 6 : isAgeInput ? 3 : undefined}
          min={isAgeInput ? 18 : undefined}
          max={isAgeInput ? 110 : undefined}
          step={isAgeInput ? 1 : undefined}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={(e) => {
            // Ensure the input stays focused and scrolls into view
            e.target.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }}
          onBlur={(e) => {
            // Immediately refocus on blur (prevents keyboard closing accidentally)
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            );
            
            if (isMobile && !hasAttemptedFocus) {
              setTimeout(() => {
                if (inputRef.current && document.activeElement !== inputRef.current) {
                  inputRef.current.focus();
                }
              }, 500);
            }
          }}
          placeholder={
            validateAsZip
              ? "Enter ZIP code (3–6 digits)"
              : isAgeInput
              ? "Enter your age (18–110)"
              : "Type your answer here..."
          }
          style={{ 
            fontSize: '16px', // Prevent iOS zoom
            WebkitAppearance: 'none' // Remove iOS styling
          }}
          className={`w-full px-4 py-3 pr-10 border-2 jost rounded-xl text-sm focus:outline-none focus:border-secondary ${
            isValid ? "border-gray-300" : "border-red-500"
          }`}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0 text-blue disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <img src={sendIcon} alt="send" className="w-6 mt-4 mb-4" />
        </button>
      </div>
    </div>
  );
};