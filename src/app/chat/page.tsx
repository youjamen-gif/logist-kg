"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/context/auth-context";

type Conversation = {
  id: string;
  freightId?: string;
  participants: string[];
  lastMessage?: string;
  updatedAt?: unknown;
};

export default function ChatPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [items, setItems] = useState<Conversation[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setPageLoading(true);
      setError("");

      const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", user.uid),
        orderBy("updatedAt", "desc"),
        limit(20)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Conversation[];

      setItems(data);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки чатов");
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
    if (!loading && user) {
      fetchConversations();
    }
  }, [loading, user]);

  if (loading || pageLoading) {
    return <main className="p-6">Загрузка...</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Чаты</h1>
        <p className="text-sm text-gray-600">
          Здесь отображаются ваши диалоги.
        </p>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {items.length === 0 ? (
        <div className="rounded border p-6">
          <p className="text-gray-600">Чатов пока нет.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/chat/${conversation.id}`}
              className="rounded border p-4 transition hover:bg-gray-50"
            >
              <div className="mb-2 flex items-center justify-between gap-4">
                <h2 className="font-semibold">
                  Чат #{conversation.id}
                </h2>

                {conversation.freightId ? (
                  <span className="rounded bg-gray-100 px-3 py-1 text-xs">
                    Груз: {conversation.freightId}
                  </span>
                ) : null}
              </div>

              <p className="text-sm text-gray-700">
                {conversation.lastMessage || "Сообщений пока нет"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
