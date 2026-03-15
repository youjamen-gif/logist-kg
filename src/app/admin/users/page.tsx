"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
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

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

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
    const fetchUsers = async () => {
      if (!user || profile?.role !== "admin") return;

      try {
        setPageLoading(true);
        setError("");

        const q = query(
          collection(db, "users"),
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

    if (!loading && user && profile?.role === "admin") {
      fetchUsers();
    }
  }, [loading, user, profile]);

  if (loading || pageLoading) {
    return <main className="p-6">Загрузка...</main>;
  }

  if (!user || profile?.role !== "admin") {
    return null;
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Пользователи</h1>
        <p className="text-sm text-gray-600">
          Список пользователей платформы.
        </p>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {users.length === 0 ? (
        <div className="rounded border p-6">
          <p className="text-gray-600">Пользователей пока нет.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Телефон</th>
                <th className="px-4 py-3">Роль</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Телефон</th>
                <th className="px-4 py-3">Документы</th>
              </tr>
            </thead>

            <tbody>
              {users.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-3">{item.name || "—"}</td>
                  <td className="px-4 py-3">{item.email || "—"}</td>
                  <td className="px-4 py-3">{item.phone || "—"}</td>
                  <td className="px-4 py-3">{item.role || "—"}</td>
                  <td className="px-4 py-3">{item.status || "active"}</td>
                  <td className="px-4 py-3">
                    {item.phoneVerified ? "Подтвержден" : "Нет"}
                  </td>
                  <td className="px-4 py-3">
                    {item.documentsVerified ? "Подтверждены" : "Нет"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
