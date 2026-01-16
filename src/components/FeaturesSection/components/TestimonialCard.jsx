import shareImage from '../../../assets/mdi_share-outline.svg'
import { shareViaSms } from "../../../utils/shareViaSms";
const TestimonialCard = ({ item }) => {

  console.log(item, "item-->")

  const handleClick = (e) => {
    e.stopPropagation();
    const idParam = encodeURIComponent(item.id || "");
    window.open(`/q/Top-Explore-Questions/persona/${idParam}?isPersona=true`, "_blank");
  };
  const handleClickWhatsApp = (e) => {
    e.stopPropagation();
    const idParam = encodeURIComponent(item.id || "");
    const fullUrl = `${window.location.origin}/q/Top-Explore-Questions/persona/${idParam}?isPersona=true`;

    shareViaSms({
      text: "click here to ask RetireMate",
      url: fullUrl,
    });
  };
  return (
    <div key={item?.idx} onClick={handleClick} className="cursor-pointer flex flex-col p-5 rounded-xl gap-4 bg-white text-black h-full" style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 4px 15px" }}>
      <div className="flex gap-3 items-center">
        <img
          src={item.img}
          alt="Avatar"
          className="w-14 h-14 rounded-full object-cover shrink-0"
        />
        <div className="grow text-left">

          <h2 className="text-lg whitespace-nowrap text-[#567257] font-semibold">
            {item.name}, {item.age}
          </h2>
          <span className="text-base mt-auto text-left jost font-medium text-[#6B7280]">
            {" "}
            {item.title}
          </span>
        </div>
      </div>

      <div className="flex gap-3 h-full items-start">

        <div className="flex flex-col justify-between h-full text-left items-start">
          <div className="h-full grow">
            <p className="text-wrap font-bold text-lg text-[#567257] grow-1 mb-3">{item.persona_question}</p>
            <p className="text-base  jost inline-block p-1.5 rounded text-[#6B7280]">
              {item.text}
            </p>
          </div>
          <div className="flex justify-between gap-2 w-full items-center mt-5 ">
            <button
              className="text-base rounded-lg px-4 py-2 bg-[#567257] text-white"
            >
             See what this plan looks like
            </button>
            <button onClick={handleClickWhatsApp}>
              <img src={shareImage} alt="Share" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
