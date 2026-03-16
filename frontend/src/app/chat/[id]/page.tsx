"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/context/auth-context";

type Conversation = {
  id: string;
  freightId?: string;
  participants: string[];
  lastMessage?: string;
};

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt?: unknown;
};

export default function ChatDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  const conversationId = params?.id as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const fetchConversation = async () => {
    if (!conversationId || !user) return;

    try {
      setPageLoading(true);
      setError("");

      const conversationRef = doc(db, "conversations", conversationId);
      const conversationSnap = await getDoc(conversationRef);

      if (!conversationSnap.exists()) {
        setError("Чат не найден");
        setConversation(null);
        return;
      }

      const conversationData = {
        id: conversationSnap.id,
        ...conversationSnap.data(),
      } as Conversation;

      if (!conversationData.participants?.includes(user.uid)) {
        setError("У вас нет доступа к этому чату");
        setConversation(null);
        return;
      }

      setConversation(conversationData);

      const messagesQuery = query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        orderBy("createdAt", "asc"),
        limit(50)
      );

      const messagesSnap = await getDocs(messagesQuery);
      const messagesData = messagesSnap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Message[];

      setMessages(messagesData);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки чата");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user && conversationId) {
      fetchConversation();
    }
  }, [loading, user, conversationId]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user || !conversation) return;

    if (!text.trim()) {
      return;
    }

    try {
      setSending(true);

      await addDoc(collection(db, "messages"), {
        conversationId,
        senderId: user.uid,
        text: text.trim(),
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "conversations", conversationId), {
        lastMessage: text.trim(),
        updatedAt: serverTimestamp(),
      });

      setText("");
      await fetchConversation();
    } catch (err: any) {
      setError(err.message || "Ошибка отправки сообщения");
    } finally {
      setSending(false);
    }
  };

  if (loading || pageLoading) {
    return <main className="p-6">Загрузка...</main>;
  }

  if (!user) {
    return null;
  }

  if (error || !conversation) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">{error || "Чат не найден"}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 rounded border p-4">
        <h1 className="text-2xl font-bold">Чат #{conversation.id}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {conversation.freightId
            ? `Связан с грузом: ${conversation.freightId}`
            : "Обычный диалог"}
        </p>
      </div>

      <div className="mb-6 rounded border p-4">
        <h2 className="mb-4 text-lg font-semibold">Сообщения</h2>

        {messages.length === 0 ? (
          <p className="text-sm text-gray-600">Сообщений пока нет.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const isMine = message.senderId === user.uid;

              return (
                <div
                  key={message.id}
                  className={`rounded p-3 ${
                    isMine ? "bg-black text-white" : "bg-gray-100 text-black"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {isMine ? "Вы" : message.senderId}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="rounded border p-4">
        <h2 className="mb-4 text-lg font-semibold">Новое сообщение</h2>

        <textarea
          placeholder="Введите сообщение"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mb-4 min-h-[120px] w-full rounded border p-3"
          required
        />

        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={sending}
          className="rounded bg-black px-4 py-3 text-white disabled:opacity-50"
        >
          {sending ? "Отправка..." : "Отправить"}
        </button>
      </form>
    </main>
  );
}
