import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToSection() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace("#", "");

    const scrollToEl = (behavior = "smooth") => {
      const el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior, block: "start", inline: "nearest" });
      return true;
    };

    // retry until element exists
    const interval = setInterval(() => {
      if (scrollToEl("smooth")) {
        clearInterval(interval);
      }
    }, 100);

    // After full load/layout shifts, correct position instantly (avoid repeated smooth animations)
    const onLoad = () => scrollToEl("auto");
    window.addEventListener("load", onLoad);

    const t1 = setTimeout(() => scrollToEl("auto"), 250);
    const t2 = setTimeout(() => scrollToEl("auto"), 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", onLoad);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [hash]);

  return null;
}
