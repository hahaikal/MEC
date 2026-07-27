"use client";

import { useState, useEffect, useRef } from "react";
import { Pin, Megaphone, Send, Users, CheckCircle2, ChevronLeft, MessageSquare } from "lucide-react";
import { useActiveGalleryItems } from "@/lib/hooks/use-gallery";
import { useActiveClasses } from "@/lib/hooks/use-classes";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";

export default function CommunicationPage() {
  const [session, setSession] = useState<any>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Load session
  useEffect(() => {
    const raw = sessionStorage.getItem("parent-hub-session");
    if (raw) {
      try { setSession(JSON.parse(raw)); } catch {}
    }
  }, []);

  const { data: events } = useActiveGalleryItems("event");
  const { data: dynamicClasses = [] } = useActiveClasses();

  // Filter classes based on session
  let filteredClasses = [];
  if (session?.type === 'staff') {
    const roles = session?.roles || [];
    const isTeacherOnly = roles.includes('teacher') && !roles.includes('admin') && !roles.includes('director') && !roles.includes('Principal');
    if (isTeacherOnly) {
      filteredClasses = dynamicClasses.filter((c: any) => 
        c.teachers?.some((t: any) => t.id === session.userId)
      );
    } else {
      filteredClasses = dynamicClasses; // admin, director, principal see all
    }
  } else {
    const enrolledClassIds = session?.enrollments?.map((e: any) => e.class_id) || [];
    filteredClasses = dynamicClasses.filter((c: any) => enrolledClassIds.includes(c.id));
  }

  const selectedClass = filteredClasses.find((c: any) => c.id === selectedClassId);

  // Auto-select if only 1 class is available
  useEffect(() => {
    if (filteredClasses.length === 1 && !selectedClassId) {
      setSelectedClassId(filteredClasses[0].id);
    }
  }, [filteredClasses, selectedClassId]);

  // Fetch messages and subscribe to realtime updates
  useEffect(() => {
    if (!selectedClassId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('class_id', selectedClassId)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
      scrollToBottom();
    };

    fetchMessages();

    const channel = supabase.channel('chat_updates')
      .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `class_id=eq.${selectedClassId}` }, 
          (payload) => {
            setMessages((prev) => {
              // Avoid duplicates if we already added it optimistically (though we don't do optimistic yet)
              if (prev.find(m => m.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
            setTimeout(scrollToBottom, 100);
          }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedClassId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !session || !selectedClassId) return;

    const senderId = session.type === 'staff' ? session.userId : session.studentId;
    const senderName = session.type === 'staff' ? session.userName : session.studentName;
    const text = messageText.trim();
    
    setMessageText(""); // Optimistic clear

    await supabase.from('chat_messages').insert({
      class_id: selectedClassId,
      sender_id: senderId,
      sender_type: session.type,
      sender_name: senderName,
      message: text
    });
  };

  const announcements = events || [];

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-6 pb-6">
      {/* Top Section: Announcements */}
      <section className="shrink-0">
        <div className="mb-4">
          <h1 className="font-display text-2xl font-extrabold text-[#111111]">Notice Board</h1>
          <p className="text-sm text-neutral-600">Important upcoming events and announcements.</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {announcements.length === 0 ? (
             <div className="text-sm text-neutral-500 italic">No special events scheduled.</div>
          ) : announcements.map((ann: any) => (
            <div 
              key={ann.id} 
              className={`relative flex w-80 shrink-0 flex-col gap-2 rounded-2xl p-5 transition-transform hover:-translate-y-1 bg-mec-yellow/10 ring-1 ring-mec-yellow/50 h-full`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Pin className="h-4 w-4 text-mec-yellow" fill="currentColor" />
                  <span className="text-xs font-bold text-neutral-500">
                    {ann.event_date ? format(new Date(ann.event_date), 'MMM d, yyyy') : format(new Date(ann.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              <h3 className="font-display font-bold text-[#111111] leading-tight line-clamp-2">{ann.title}</h3>
              <p className="text-sm text-neutral-600 line-clamp-2">{ann.description || "School event"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Class Selection or Chat */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl bg-white shadow-card relative">
        {!selectedClassId && filteredClasses.length > 1 ? (
          // Class Selection View
          <div className="flex flex-1 flex-col p-8 bg-[#F2F2F2]/30">
            <h2 className="font-display text-2xl font-bold text-[#111111] mb-6">Select a Class to Join Chat</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClassId(c.id)}
                  className="group flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-neutral-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-mec-blue/30"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mec-blue/10 text-mec-blue group-hover:bg-mec-blue group-hover:text-white transition-colors">
                    <MessageSquare className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#111111]">{c.name}</h3>
                </button>
              ))}
            </div>
          </div>
        ) : selectedClassId ? (
          // Chat View
          <>
            <header className="flex items-center justify-between border-b border-neutral-100 bg-[#F2F2F2]/50 px-6 py-4">
              <div className="flex items-center gap-4">
                {filteredClasses.length > 1 && (
                  <button 
                    onClick={() => setSelectedClassId(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mec-blue text-white shadow-sm">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-[#111111]">{selectedClass?.name || 'Class Chat'}</h2>
                  <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500" /> Active Chat
                  </p>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-neutral-400">
                  <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                  <p>No messages yet.</p>
                  <p className="text-sm">Be the first to send a message!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const currentSenderId = session?.type === 'staff' ? session?.userId : session?.studentId;
                  const isMe = msg.sender_id === currentSenderId;
                  
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-500">{msg.sender_name}</span>
                        {msg.sender_type === 'staff' && (
                          <span className="rounded bg-mec-blue/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-mec-blue">
                            Teacher
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-400">{format(new Date(msg.created_at), 'hh:mm a')}</span>
                      </div>
                      <div 
                        className={`relative max-w-[80%] rounded-2xl px-5 py-3 text-sm md:max-w-[60%] ${
                          isMe 
                            ? "bg-mec-blue text-white rounded-tr-sm" 
                            : msg.sender_type === "staff"
                              ? "bg-mec-yellow/20 text-[#111111] border border-mec-yellow/30 rounded-tl-sm"
                              : "bg-[#F2F2F2] text-[#111111] rounded-tl-sm"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-neutral-100 p-4 bg-white shrink-0">
              <form 
                onSubmit={sendMessage}
                className="flex items-center gap-3 rounded-full bg-[#F2F2F2] px-4 py-2 ring-1 ring-inset ring-transparent focus-within:ring-mec-blue/30"
              >
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent py-2 text-sm text-[#111111] outline-none placeholder:text-neutral-500"
                />
                <button 
                  type="submit"
                  disabled={!messageText.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mec-blue text-white shadow-sm transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-neutral-400">
             You are not enrolled in any classes yet.
          </div>
        )}
      </section>
    </div>
  );
}
