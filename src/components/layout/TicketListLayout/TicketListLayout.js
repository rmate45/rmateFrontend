"use client";

import Image from "next/image";
import { useState } from "react";

const TicketListLayout = ({ onSelectTicket }) => {
  const [activeTab, setActiveTab] = useState("new");

  // Sample ticket data
  const ticketsData = {
    new: [
      {
        id: "Ticket# 2023-C3123",
        owner: "Rachel Jenkins (racheljenkins@gmail.com)",
        postedAt: "10:45 AM",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, of type and scrambled when an unknown printer took a galley of type and scrambled it to make a type specimen book, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        avatar: "https://picsum.photos/id/237/200/300",
      },
      {
        id: "Ticket# 2023-C3124",
        owner: "Rachel Jenkins (racheljenkins@gmail.com)",
        postedAt: "10:30 AM",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, of type and scrambled when an unknown printer took a galley of type and scrambled it to make a type specimen book, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        avatar: "https://picsum.photos/id/237/200/300",
      },
      {
        id: "Ticket# 2023-C3125",
        owner: "Rachel Jenkins (racheljenkins@gmail.com)",
        postedAt: "09:45 AM",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, of type and scrambled when an unknown printer took a galley of type and scrambled it to make a type specimen book, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        avatar: "https://picsum.photos/id/237/200/300",
      },
    ],
    inProgress: [
      {
        id: "Ticket# 2023-C3120",
        owner: "John Smith (johnsmith@gmail.com)",
        postedAt: "08:30 AM",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, of type and scrambled when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        avatar: "https://picsum.photos/id/237/200/300",
      },
      {
        id: "Ticket# 2023-C3121",
        owner: "Sarah Wilson (sarahwilson@gmail.com)",
        postedAt: "07:15 AM",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, of type and scrambled when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        avatar: "https://picsum.photos/id/237/200/300",
      },
    ],
    resolved: [
      {
        id: "Ticket# 2023-C3118",
        owner: "Mike Johnson (mikejohnson@gmail.com)",
        postedAt: "Yesterday",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, of type and scrambled when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        avatar: "https://picsum.photos/id/237/200/300",
      },
      {
        id: "Ticket# 2023-C3119",
        owner: "Emily Davis (emilydavis@gmail.com)",
        postedAt: "Yesterday",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, of type and scrambled when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        avatar: "https://picsum.photos/id/237/200/300",
      },
    ],
  };

  const tabs = [
    {
      id: "new",
      label: "New Tickets",
      activeIcon: "/inProgress-tickets.svg",
      inActiveIcon: "/inProgress-tickets-inactive.svg",
    },
    {
      id: "inProgress",
      label: "In Progress",
      activeIcon: "/new-tickets.svg",
      inActiveIcon: "/new-tickets-inactive.svg",
    },
    {
      id: "resolved",
      label: "Resolved",
      activeIcon: "/resolved-tickets.svg",
      inActiveIcon: "/resolved-tickets-inactive.svg",
    },
  ];

  const currentTickets = ticketsData[activeTab] || [];

  return (
    <div className="w-full p-6 bg-white poppins">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Image
                  src={activeTab === tab.id ? tab.activeIcon : tab.inActiveIcon}
                  alt="status"
                  height={30}
                  width={30}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Ticket List */}
      <div className="divide-y mt-4 divide-gray-200">
        {currentTickets.map((ticket, index) => (
          <div
            key={index}
            onClick={() => onSelectTicket(ticket)}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col items-start justify-between">
              <div className="flex-1 w-full">
                {/* Ticket Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-sm font-semibold text-dark">
                      {ticket.id}
                    </h3>
                    <span className="text-xs text-gray-500 bg-[#A934BD1A] px-8 py-1 rounded">
                      Owner
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#84818A]">
                    Posted at {ticket.postedAt}
                  </span>
                </div>

                {/* Owner Info */}
                <div className="mb-3 ml-auto">
                  <p className="text-base  font-semibold text-dark">
                    {ticket.owner}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-normal text-[#84818A] leading-relaxed">
                  {ticket.description}
                </div>

                {/* Avatar */}
                <div className="ml-4 flex-shrink-0">
                  <Image
                    src={ticket.avatar}
                    alt="ticket"
                    width={60}
                    height={60}
                    className="w-12 h-12 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {currentTickets.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-2">
              {/* <MessageSquare className="w-12 h-12 mx-auto" /> */}
            </div>
            <p className="text-gray-500">No tickets found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketListLayout;
