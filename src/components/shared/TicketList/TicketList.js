import React from "react";
import ViewAllButton from "../ViewAllButton/ViewAllButton";
import TicketListCard from "@/components/cards/TicketListCard/TicketListCard";

const TicketList = () => {
  return (
    <div className="bg-white p-6 rounded-[10px] flex flex-col h-[450px]">
      {/* Header: static */}
      <div className="flex w-full justify-between mb-4 shrink-0">
        <h1 className="text-[#131313] font-semibold text-xl">Tickets</h1>
        <ViewAllButton />
      </div>

      {/* Scrollable Ticket List */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        <TicketListCard
          date="Nov 1 2025"
          name="Chris Friedkly"
          location="Broadway Heights"
          description="The air conditioning/heating system is not working properly. The unit is either not cooling/heating, making unusual noises, or has stopped functioning."
          avatarUrl="https://picsum.photos/id/237/200/300"
          imageUrl="https://picsum.photos/id/237/200/300"
        />
        <TicketListCard
          date="Nov 1 2025"
          name="Chris Friedkly"
          location="Broadway Heights"
          description="The air conditioning/heating system is not working properly. The unit is either not cooling/heating, making unusual noises, or has stopped functioning."
          avatarUrl="https://picsum.photos/id/237/200/300"
          imageUrl="https://picsum.photos/id/237/200/300"
        />
        <TicketListCard
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

export default TicketList;
