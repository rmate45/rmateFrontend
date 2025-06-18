"use client";

import React from "react";

import { useState } from "react";
import Image from "next/image";

export default function ChatLayout({ ticket }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been",
      sender: "other",
      timestamp: new Date(),
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      text: "Lorem Ipsum is simply dummy text of",
      sender: "user",
      timestamp: new Date(),
    },
    {
      id: "3",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been",
      sender: "other",
      timestamp: new Date(),
    },
    {
      id: "4",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been",
      sender: "user",
      timestamp: new Date(),
    },
    {
      id: "5",
      text: "Lorem Ipsum is simply dummy text of",
      sender: "other",
      timestamp: new Date(),
    },
    {
      id: "6",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been",
      sender: "user",
      timestamp: new Date(),
    },
    {
      id: "7",
      text: "Lorem Ipsum is simply dummy text of",
      sender: "other",
      timestamp: new Date(),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage("");

      // Simulate receiving a response after a short delay
      setTimeout(() => {
        const response = {
          id: (Date.now() + 1).toString(),
          text: "Thanks for your message! This is an automated response.",
          sender: "other",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, response]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-screen poppins mx-auto bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src="https://picsum.photos/seed/1/400/300"
              alt="Ryan Levin"
              width={40}
              height={40}
              className="rounded-full w-10 h-10"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-activegreen border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className=" text-primary text-sm">Ryan Levin</h3>
            <p className="text-xs text-subheadline">Owner</p>
          </div>
        </div>
        <div className="flex items-center  space-x-2">
          <div className="flex items-center flex-col justify-center space-x-1">
            <span className="text-xs underline text-primary font-normal">
              Anika Press
            </span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-activegreen rounded-full"></div>
              <span className="text-xs font-medium text-activegreen">
                Resolved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === "user"
                  ? "bg-primary text-white rounded-br-md"
                  : "bg-gray-100 text-gray-900 rounded-bl-md"
              }`}
            >
              {message.image && (
                <div className="mb-2">
                  <Image
                    src={message.image || "/placeholder.svg"}
                    alt="Shared image"
                    width={250}
                    height={150}
                    className="rounded-lg"
                  />
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={1}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-primary text-white rounded-full hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* <Send className="w-5 h-5" /> */}
          </button>
        </div>
      </div>
    </div>
  );
}
