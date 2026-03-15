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
  doc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/context/auth-context";

type UserItem = {
  id: string;
  uid?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  phoneVerified?: boolean;
  documentsVerified?: boolean;
};

export default function AdminVerificationPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setPageLoading(true);
      setError("");

      const q = query(
        collection(db, "users"),
        where("documentsVerified", "==", false),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as UserItem[];

      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки пользователей");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (!loading && profile?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [loading, user, profile, router]);

  useEffect(() => {
    if (!loading && user && profile?.role === "admin") {
      fetchUsers();
    }
  }, [loading, user, profile]);

  const verifyDocuments = async (userId: string, value: boolean) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        documentsVerified: value,
      });

      setUsers((prev) =>
        prev.map((item) =>
          item.id === userId ? { ...item, documentsVerified: value } : item
        )
      );
    } catch (err: any) {
      setError(err.message || "Ошибка обновления проверки документов");
    }
  };

  const verifyPhone = async (userId: string, value: boolean) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        phoneVerified: value,
      });

      setUsers((prev) =>
        prev.map((item) =>
          item.id === userId ? { ...item, phoneVerified: value } : item
        )
      );
    } catch (err: any) {
      setError(err.message || "Ошибка обновления проверки телефона");
    }
  };

  if (loading || pageLoading) {
    return <main className="p-6">Загрузка...</main>;
  }

  if (!user || profile?.role !== "admin") {
    return null;
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Проверка документов</h1>
        <p className="text-sm text-gray-600">
          Подтверждение документов и телефона пользователей.
        </p>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {users.length === 0 ? (
        <div className="rounded border p-6">
          <p className="text-gray-600">Пользователей на проверке нет.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((item) => (
            <div key={item.id} className="rounded border p-4">
              <div className="mb-3">
                <h2 className="font-semibold">{item.name || "Без имени"}</h2>
                <p className="text-sm text-gray-500">
                  {item.email || "—"} · {item.role || "—"}
                </p>
              </div>

              <div className="mb-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-4">
                <p><strong>Телефон:</strong> {item.phone || "—"}</p>
                <p>
                  <strong>Телефон подтвержден:</strong>{" "}
                  {item.phoneVerified ? "Да" : "Нет"}
                </p>
                <p>
                  <strong>Документы подтверждены:</strong>{" "}
                  {item.documentsVerified ? "Да" : "Нет"}
                </p>
                <p><strong>Статус:</strong> {item.status || "active"}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => verifyDocuments(item.id, true)}
                  className="rounded border px-3 py-1 hover:bg-gray-50"
                >
                  Подтвердить документы
                </button>

                <button
                  onClick={() => verifyDocuments(item.id, false)}
                  className="rounded border px-3 py-1 hover:bg-gray-50"
                >
                  Снять подтверждение
                </button>

                <button
                  onClick={() => verifyPhone(item.id, true)}
                  className="rounded border px-3 py-1 hover:bg-gray-50"
                >
                  Подтвердить телефон
                </button>

                <button
                  onClick={() => verifyPhone(item.id, false)}
                  className="rounded border px-3 py-1 hover:bg-gray-50"
                >
                  Снять телефон
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
