import oneImage from "../../assets/testimonial-2.jpeg"
import twoImage from "../../assets/imageTwo.jpg"
import threeImage from "../../assets/testimonial-2.jpeg"

const UserCard = ({ item }) => {
    console.log(item,"item");
    
    return (
        <div className="mb-3 px-4 flex items-start justify-start  ">
            <div className="relative  rounded-2xl p-5 bg-white flex flex-col max-w-xs w-full" style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 4px 15px" }}>
                <div className="shrink-0 text-center flex gap-4">
                    <img
                        src={oneImage}
                        alt="Joel"
                        className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                    />
                    <div className="grow text-left">
                        <p className="text-introPrimary text-base font-semibold mb-1.5 mt-3">
                            {item?.name}, <span className="text-base whitespace-nowrap text-introPrimary font-semibold">{item?.age}</span>
                        </p>
                        <p className="text-base mt-auto text-left jost font-medium text-[#6B7280]">{item?.profession}</p>
                    </div>
                </div>
                <div className="grow flex flex-col mt-3 items-start">
                    <p className="text-base jost grow  text-[#6B7280] text-left">
                        {item?.question || item?.persona_description}
                    </p>

                </div>
            </div>
        </div>
    );
};
export default UserCard;