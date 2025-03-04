"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import kyInstance from "@/lib/ky";
import { MessageCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface MessagesButtonProps {
  initialState: MessageCountInfo;
}

export default function MessagesButton({ initialState }: MessagesButtonProps) {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasNotified = useRef(false); // Track if notification has been triggered once

  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<MessageCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  useEffect(() => {
    // Initialize audio only once
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/notification.mp3");
      audioRef.current.preload = "auto"; // Preload for reliability
    }

    // Trigger notification if there are unread notifications
    if (data.unreadCount) {
      // Only notify if we haven't already for this session
      if (!hasNotified.current) {
        toast({
          title: "🔔 New Notifications",
          description: `You have ${data.unreadCount} unread notifications.`,
          duration: 5000,
          action: (
            <Link href="/notifications">
              <Button variant="outline" className="ml-2">
                View
              </Button>
            </Link>
          ),
        });

        // Reset and play sound
        audioRef.current.currentTime = 0; // Ensure sound restarts
        audioRef.current
          .play()
          .catch((error) =>
            console.error("Error playing notification sound:", error),
          );

        // Mark as notified to prevent repeats until count changes or page reloads
        hasNotified.current = true;
      }
    } else {
      // Reset notification flag if unread count drops to 0
      hasNotified.current = false;
    }
  }, [data.unreadCount, toast]);

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Messages"
      asChild
    >
      <Link href="/messages">
        <div className="relative">
          <Mail />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  );
}
