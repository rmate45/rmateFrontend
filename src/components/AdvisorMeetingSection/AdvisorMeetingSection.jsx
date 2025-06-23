import { useEffect, useState } from "react";
import Slider from "react-slick";
import { AdvisorCard } from "../AdvisorCard/AdvisorCard";
import api from "../../api/api";

export const AdvisorMeetingSection = ({ onScheduleMeeting }) => {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const fetchAdvisors = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/get-financial-advisors?page=${pageNumber}&limit=30`);
      const newAdvisors = data?.data?.financialAdvisors || [];

      setAdvisors((prev) => [...prev, ...newAdvisors]);

      const totalPages = data?.data?.pagination?.totalPages;
      const currentPage = data?.data?.pagination?.currentPage;

      if (currentPage >= totalPages || newAdvisors.length < 3) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching financial advisors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisors(1);
  }, []);

  const handleAfterChange = (index) => {
    setCurrentSlide(index);

    if (index >= advisors.length - 1 && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAdvisors(nextPage);
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,       // ✅ show 1 slide at a time
    slidesToScroll: 1,     // ✅ scroll 1 at a time
    arrows: false,
    afterChange: handleAfterChange,
    appendDots: (dots) => {
      const start = Math.max(0, currentSlide - 1);
      const visibleDots = dots.slice(start, start + 3);
      return <ul className="slick-dots">{visibleDots}</ul>;
    },
    customPaging: (i) => <button>{i + 1}</button>,
  };

  return (
    <div className="p-6 border rounded-xl shadow-md bg-[#ffffff] pb-12">
      <h2 className="text-xl font-semibold text-center mb-4">
        Our AI has matched you with financial advisors.
      </h2>

      {loading && advisors.length === 0 ? (
        <div className="text-center py-8 font-medium text-gray-500">
          Loading advisors...
        </div>
      ) : (
        <Slider {...settings}>
          {advisors.map((advisor, index) => (
            <div key={index} className="px-2">
              <AdvisorCard
                name={advisor.primary_business_name}
                location={`${advisor.main_office_city}, ${advisor.main_office_state}` || '---------'}
                onConsult={onScheduleMeeting}
              />
            </div>
          ))}
        </Slider>
      )}

      {loading && advisors.length > 0 && (
        <div className="text-center mt-4 text-sm text-gray-400">
          Loading more...
        </div>
      )}
    </div>
  );
};
