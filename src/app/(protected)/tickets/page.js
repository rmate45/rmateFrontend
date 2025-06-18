"use client";

import ChatLayout from "@/components/layout/ChatLayout/ChatLayout";
import TicketListLayout from "@/components/layout/TicketListLayout/TicketListLayout";
import { useState } from "react";

export default function Ticket() {
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <div className="min-h-screen">
      <div className="flex gap-4">
        <TicketListLayout onSelectTicket={setSelectedTicket} />
        {selectedTicket && <div className="w-2/3"> <ChatLayout ticket={selectedTicket} /> </div>}
      </div>
    </div>
  );
}
