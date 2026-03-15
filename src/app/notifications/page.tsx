"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/context/auth-context";

type NotificationItem = {
  id: string;
  userId: string;
  type: string;
  title?: string;
  message?: string;
  read?: boolean;
  createdAt?: unknown;
};

export default function NotificationsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [items, setItems] = useState<NotificationItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setPageLoading(true);
      setError("");

      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(20)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as NotificationItem[];

      setItems(data);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки уведомлений");
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
      fetchNotifications();
    }
  }, [loading, user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), {
        read: true,
      });

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, read: true } : item
        )
      );
    } catch (err: any) {
      setError(err.message || "Ошибка обновления уведомления");
    }
  };

  if (loading || pageLoading) {
    return <main className="p-6">Загрузка...</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Уведомления</h1>
        <p className="text-sm text-gray-600">
          Здесь отображаются последние уведомления пользователя.
        </p>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {items.length === 0 ? (
        <div className="rounded border p-6">
          <p className="text-gray-600">Уведомлений пока нет.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded border p-4 ${
                item.read ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold">
                    {item.title || "Уведомление"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Тип: {item.type || "system"}
                  </p>
                </div>

                <span className="rounded bg-gray-100 px-3 py-1 text-xs">
                  {item.read ? "Прочитано" : "Новое"}
                </span>
              </div>

              <p className="mb-4 text-sm text-gray-700">
                {item.message || "Без текста"}
              </p>

              {!item.read ? (
                <button
                  onClick={() => markAsRead(item.id)}
                  className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Отметить как прочитанное
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
