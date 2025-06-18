// components/TicketSection.js
import Image from "next/image";
import TicketCard from "../../cards/TicketCard/TicketCard";
import ViewAllButton from "../ViewAllButton/ViewAllButton";

const TicketSection = ({ title = "Tickets", total = 999, onViewAll }) => {
  return (
    <div className="my-4 relative flex flex-col gap-8 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="poppins text-[#454545] text-xl font-semibold">
          {title} ({total})
        </h2>
        <ViewAllButton onClick={onViewAll} />
      </div>

      {/* Single Ticket (you can later map over an array) */}
      <div className="flex justify-center items-center bg-gray-100 py-6 rounded-xl">
        <TicketCard
          date="Nov 1 2025"
          name="Chris Friedkly"
          location="Broadway Heights"
          description="The air conditioning/heating system is not working properly. The unit is either not cooling/heating, making unusual noises, or has stopped functioning."
          avatarUrl="https://picsum.photos/id/237/200/300"
          imageUrl="https://picsum.photos/id/237/200/300"
        />
      </div>
    </div>
  );
};

export default TicketSection;
