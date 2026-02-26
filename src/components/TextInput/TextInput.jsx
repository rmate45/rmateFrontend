import sendIcon from "../../assets/send.svg";
import { useState, useEffect, useRef } from "react";
import api from "../../api/api";

export const TextInput = ({
  value,
  onChange,
  onSubmit,
  validateAsZip = false,
  onValidationError,
  isAgeInput = false,
  isEmailInput = false,
  scrollToBottom,
  setUserAge,
  question,
  questionNumber,
  sessionId,
  trackAnswer,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [isDOMReady, setIsDOMReady] = useState(false);
  const [hasAttemptedFocus, setHasAttemptedFocus] = useState(false);

  // ---- all your focus/useEffect logic stays the same ----
  useEffect(() => {
    const checkDOMReady = () => {
      if (document.readyState === "complete") {
        setIsDOMReady(true);
      } else {
        const handleLoad = () => {
          setIsDOMReady(true);
          document.removeEventListener("DOMContentLoaded", handleLoad);
          window.removeEventListener("load", handleLoad);
        };

        document.addEventListener("DOMContentLoaded", handleLoad);
        window.addEventListener("load", handleLoad);

        return () => {
          document.removeEventListener("DOMContentLoaded", handleLoad);
          window.removeEventListener("load", handleLoad);
        };
      }
    };

    checkDOMReady();
  }, []);

  useEffect(() => {
    if (!isDOMReady || !inputRef.current || hasAttemptedFocus) return;

    const focusInput = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      if (isMobile) {
        inputRef.current.focus();

        const handleInteraction = (e) => {
          if (inputRef.current && document.activeElement !== inputRef.current) {
            e.preventDefault();
            inputRef.current.focus();
          }
          document.removeEventListener("touchstart", handleInteraction, {
            capture: true,
          });
          document.removeEventListener("click", handleInteraction, {
            capture: true,
          });
        };

        document.addEventListener("touchstart", handleInteraction, {
          capture: true,
          once: true,
          passive: false,
        });
        document.addEventListener("click", handleInteraction, {
          capture: true,
          once: true,
        });

        const delays = [100, 300, 600, 1000];
        delays.forEach((delay) => {
          setTimeout(() => {
            if (inputRef.current && document.activeElement !== inputRef.current) {
              inputRef.current.focus();
              inputRef.current.click();
            }
          }, delay);
        });

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
        inputRef.current.focus();
      }

      setHasAttemptedFocus(true);
    };

    requestAnimationFrame(() => {
      setTimeout(focusInput, 50);
    });
  }, [isDOMReady, hasAttemptedFocus]);

  useEffect(() => {
    if (hasAttemptedFocus) return;

    const handleVisibilityChange = () => {
      if (!document.hidden && inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
      cleaned = rawValue.replace(/\D/g, "");
    } else if (isAgeInput) {
      cleaned = rawValue.replace(/\D/g, "");
      setUserAge(cleaned);
      if (cleaned.length > 3) {
        cleaned = cleaned.slice(0, 3);
      }
    }

    onChange(cleaned);
    setIsValid(true);
    setValidationMessage(null);
  };

  const handleSubmit = async () => {
    if (loading) return;

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
         if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: "quiz_answer",
            quiz_question_number: questionNumber,
            quiz_question_text: question,
            quiz_answer_text: value,
          });
          console.log('GTM Event Pushed:', {
            event: "quiz_answer",
            quiz_question_number: questionNumber,
            quiz_question_text: question,
            quiz_answer_text: value,
          });
        }
        
        // Track answer in session
        if (trackAnswer) {
          trackAnswer(questionNumber, question, value);
        }
        
        onSubmit();
      }
    } else if (isEmailInput) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        setIsValid(false);
        setValidationMessage("Please enter a valid email address.");
        onValidationError?.();
        if (scrollToBottom) {
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
        return;
      }

      // Send email to API
      try {
        setLoading(true);
        await api.post("/send-thanks-email", { email: value.trim() });
        console.log('Thanks email sent to:', value.trim());
        
        // Push to GTM
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: "quiz_answer",
            quiz_question_number: questionNumber,
            quiz_question_text: question,
            quiz_answer_text: value,
          });
          console.log('GTM Event Pushed (Email):', {
            event: "quiz_answer",
            quiz_question_number: questionNumber,
            quiz_question_text: question,
            quiz_answer_text: value,
          });
        }
        
        // Track answer in session
        if (trackAnswer) {
          trackAnswer(questionNumber, question, value.trim());
        }
        
        setIsValid(true);
        onSubmit();
      } catch (error) {
        console.error('Failed to send thanks email:', error);
        // Still proceed even if email API fails
        setIsValid(true);
        onSubmit();
      } finally {
        setLoading(false);
      }
    } else {
      if (value.trim()) {
        setIsValid(true);
        // Push to Google Tag Manager dataLayer
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: "quiz_answer",
            quiz_question_number: questionNumber,
            quiz_question_text: question,
            quiz_answer_text: value,
          });
          console.log('GTM Event Pushed:', {
            event: "quiz_answer",
            quiz_question_number: questionNumber,
            quiz_question_text: question,
            quiz_answer_text: value,
          });
        }
        
        // Track answer in session
        if (trackAnswer) {
          trackAnswer(questionNumber, question, value);
        }
        
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
    // ✅ Handle Enter / NumpadEnter for submit (run this first)
    if (e.key === "Enter" || e.key === "NumpadEnter") {
      e.preventDefault(); // stop parent form submit / page reload
      handleSubmit();
      return;
    }

    // Age-only digit restriction
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
      if (e.ctrlKey || e.metaKey) return;

      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        return;
      }

      const current = String(value || "");
      if (current.length >= 3) {
        e.preventDefault();
        return;
      }
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
          type={isAgeInput ? "number" : isEmailInput ? "email" : "text"}
          inputMode={validateAsZip || isAgeInput ? "numeric" : isEmailInput ? "email" : "text"}
          pattern={validateAsZip || isAgeInput ? "\\d*" : undefined}
          disabled={loading}
          maxLength={validateAsZip ? 6 : isAgeInput ? 3 : undefined}
          min={isAgeInput ? 18 : undefined}
          max={isAgeInput ? 110 : undefined}
          step={isAgeInput ? 1 : undefined}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={(e) => {
            e.target.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }}
          onBlur={() => {
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
              ? "Enter your age"
              : isEmailInput
              ? "Enter your email address"
              : "Type your answer here..."
          }
          style={{
            fontSize: "16px",
            WebkitAppearance: "none",
          }}
          className={`w-full px-4 py-3 pr-10 border-2 jost rounded-xl text-sm focus:outline-none focus:border-secondary ${
            isValid ? "border-gray-300" : "border-red-500"
          }`}
        />

        {/* ✅ Button explicitly calls handleSubmit */}
        <button
          type="button"
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
