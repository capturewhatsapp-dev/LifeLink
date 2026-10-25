import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, BloodRequest, DonorProfile } from '../types/index.ts';
import {
  X,
  Send,
  ShieldCheck,
  AlertCircle,
  Heart,
  MapPin,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface RealtimeChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRequest?: BloodRequest | null;
  targetDonor?: DonorProfile | null;
  currentUserRole?: 'seeker' | 'donor' | 'hospital_rep';
  currentUserId?: string;
  currentUserName?: string;
  onRequestUpdated?: (updated: BloodRequest) => void;
}

export const RealtimeChatModal: React.FC<RealtimeChatModalProps> = ({
  isOpen,
  onClose,
  targetRequest,
  targetDonor,
  currentUserRole = 'donor',
  currentUserId = 'current_user',
  currentUserName = 'Volunteer Donor',
  onRequestUpdated,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [remoteTypingUser, setRemoteTypingUser] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const roomId = targetRequest
    ? targetRequest.id
    : targetDonor
    ? `chat_donor_${targetDonor.id}`
    : 'general_coordination';

  const roomTitle = targetRequest
    ? `${targetRequest.bloodGroup} Blood Request · ${targetRequest.patientCode}`
    : targetDonor
    ? `Direct Coordination · ${targetDonor.maskedIdentifier}`
    : 'Blood Coordination Center';

  const roomSubtitle = targetRequest
    ? `${targetRequest.hospitalName}, ${targetRequest.city}`
    : targetDonor
    ? `${targetDonor.bloodGroup} · ${targetDonor.city}`
    : 'Secure encrypted coordination channel';

  // Fetch initial history via REST, then connect to WebSocket
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    // Load history
    fetch(`/api/chat/${roomId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (isMounted) {
          setMessages(data);
        }
      })
      .catch((err) => console.error('Failed to load chat history:', err));

    // WebSocket Connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      if (!isMounted) return;
      setIsConnected(true);
      // Join Room
      ws.send(
        JSON.stringify({
          type: 'join',
          roomId,
          user: {
            id: currentUserId,
            name: currentUserName,
            role: currentUserRole,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'history' && payload.roomId === roomId) {
          setMessages(payload.messages);
        } else if (payload.type === 'message' && payload.roomId === roomId) {
          setMessages((prev) => {
            // Guard duplicate ID
            if (prev.some((m) => m.id === payload.message.id)) {
              return prev;
            }
            return [...prev, payload.message];
          });

          if (payload.requestUpdate && onRequestUpdated) {
            onRequestUpdated(payload.requestUpdate);
          }
        } else if (payload.type === 'typing' && payload.roomId === roomId) {
          if (payload.isTyping) {
            setRemoteTypingUser(payload.userName);
          } else {
            setRemoteTypingUser(null);
          }
        }
      } catch (e) {
        console.error('WS parse error:', e);
      }
    };

    ws.onclose = () => {
      if (isMounted) setIsConnected(false);
    };

    ws.onerror = (e) => {
      console.warn('WS error or fallback:', e);
      if (isMounted) setIsConnected(false);
    };

    return () => {
      isMounted = false;
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [isOpen, roomId, currentUserId, currentUserName, currentUserRole, onRequestUpdated]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, remoteTypingUser]);

  if (!isOpen) return null;

  const handleSendMessage = (e?: React.FormEvent, actionType?: ChatMessage['actionType'], overrideText?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideText || inputText.trim();
    if (!textToSend && !actionType) return;

    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'message',
          roomId,
          message: {
            text: textToSend,
            senderRole: currentUserRole,
            actionType,
          },
        })
      );
    } else {
      // Fallback local optimistic append if WS reconnecting
      const fallbackMsg: ChatMessage = {
        id: `msg_local_${Date.now()}`,
        roomId,
        senderId: currentUserId,
        senderName: currentUserName,
        senderRole: currentUserRole,
        text: textToSend,
        timestamp: new Date().toISOString(),
        actionType,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }

    setInputText('');

    // Clear typing
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'typing',
          roomId,
          isTyping: false,
        })
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'typing',
          roomId,
          isTyping: true,
        })
      );

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: 'typing',
              roomId,
              isTyping: false,
            })
          );
        }
      }, 1500);
    }
  };

  const sendPledgeAction = () => {
    handleSendMessage(
      undefined,
      'pledge',
      `🩸 I hereby pledge to donate for this request. I am in good health and heading to the hospital blood bank.`
    );
  };

  const sendArrivedAction = () => {
    handleSendMessage(
      undefined,
      'arrived',
      `🏥 I have arrived at the hospital blood bank reception counter.`
    );
  };

  const sendFulfilledAction = () => {
    handleSendMessage(
      undefined,
      'fulfilled',
      `✅ Transfusion / Donation completed successfully at the authorized center.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl h-[90vh] max-h-[720px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shrink-0 font-bold text-white shadow-xs">
              {targetRequest ? targetRequest.bloodGroup : 'LL'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate">{roomTitle}</h3>
                <span
                  title={isConnected ? 'Live WebSocket Connected' : 'Connecting to Server'}
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
              </div>
              <p className="text-xs text-slate-300 truncate">{roomSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1 text-[11px] bg-slate-800 text-emerald-300 px-2.5 py-1 rounded-full border border-slate-700">
              <Lock className="w-3 h-3" />
              <span>Direct Coordination</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Medical Safety Disclaimer Strip */}
        <div className="bg-rose-50 border-b border-rose-100 px-4 py-2 flex items-center gap-2 text-xs text-rose-900 shrink-0">
          <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="truncate">
            <strong>Voluntary Non-Remunerated Donation:</strong> Never exchange money. Hospital will conduct standard screening tests.
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-slate-50/70">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">No messages in this coordination room yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Say hello or confirm your availability to assist the patient.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              if (msg.isSystemNotice) {
                return (
                  <div
                    key={msg.id}
                    className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">{msg.senderName}</div>
                      <div>{msg.text}</div>
                    </div>
                  </div>
                );
              }

              const isMe = msg.senderId === currentUserId;
              const isPledge = msg.actionType === 'pledge';
              const isArrived = msg.actionType === 'arrived';
              const isFulfilled = msg.actionType === 'fulfilled';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1 px-1">
                    <span className="font-semibold text-slate-700">{msg.senderName}</span>
                    <span>·</span>
                    <span className="capitalize">{msg.senderRole}</span>
                    <span>·</span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                      isPledge
                        ? 'bg-rose-600 text-white font-medium rounded-tr-xs'
                        : isArrived
                        ? 'bg-sky-600 text-white font-medium'
                        : isFulfilled
                        ? 'bg-emerald-600 text-white font-medium'
                        : isMe
                        ? 'bg-slate-900 text-white rounded-tr-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    {isPledge && (
                      <div className="flex items-center gap-1.5 text-xs text-rose-200 font-bold mb-1 border-b border-rose-500 pb-1">
                        <Heart className="w-3.5 h-3.5 fill-rose-200" />
                        <span>Official Donation Pledge</span>
                      </div>
                    )}
                    {isArrived && (
                      <div className="flex items-center gap-1.5 text-xs text-sky-200 font-bold mb-1 border-b border-sky-500 pb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Donor Arrived at Facility</span>
                      </div>
                    )}
                    {isFulfilled && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-bold mb-1 border-b border-emerald-500 pb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Donation Confirmed Fulfilled</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}

          {remoteTypingUser && (
            <div className="text-xs text-slate-400 italic px-2 flex items-center gap-1">
              <span>{remoteTypingUser} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Triggers */}
        {targetRequest && (
          <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide shrink-0">
              Actions:
            </span>
            <button
              onClick={sendPledgeAction}
              className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg shrink-0 transition-colors flex items-center gap-1"
            >
              <Heart className="w-3 h-3 fill-rose-600" />
              <span>Pledge Blood</span>
            </button>
            <button
              onClick={sendArrivedAction}
              className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg shrink-0 transition-colors flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              <span>Arrived at Hospital</span>
            </button>
            <button
              onClick={sendFulfilledAction}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shrink-0 transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Confirm Fulfilled</span>
            </button>
          </div>
        )}

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => handleSendMessage(e)}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your secure coordination message..."
            className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:hover:bg-rose-600 text-white rounded-xl transition-colors shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
