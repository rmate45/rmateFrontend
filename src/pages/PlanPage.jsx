import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "../planPage.css";

function PlanPage() {
  const { phone, id } = useParams();

  // decode phone number (from %2B917831022000 → +917831022000)
  const decodedPhone = decodeURIComponent(phone);

  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/user/${decodedPhone}/plan/${id}`);

        let htmlString = "";

        if (typeof data === "string") {
          htmlString = data;
        } else if (data && data.html) {
          htmlString = data.html;
        }

        // Extract only the HTML content between ```html and ```
        const htmlMatch = htmlString.match(/```html\s*([\s\S]*?)\s*```/i);

        if (htmlMatch && htmlMatch[1]) {
          // Use the captured HTML content
          htmlString = htmlMatch[1].trim();
        } else {
          // Fallback: try to clean unwanted text manually if regex doesn't match
          htmlString = htmlString
            .replace(/^.*?```html\s*/i, "")
            .replace(/\s*```[\s\S]*$/i, "")
            .trim();
        }

        setHtmlContent(htmlString);
      } catch (error) {
        console.error("Error fetching plan:", error);
        setHtmlContent(
          "<div>Error loading plan. Please try again later.</div>"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [decodedPhone, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading your plan...</div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="plainPagecontainer mx-auto p-4">
        {/* render raw HTML from API */}
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
      <Footer />
    </>
  );
}

export default PlanPage;
