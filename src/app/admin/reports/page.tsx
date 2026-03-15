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
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/context/auth-context";

type ReportItem = {
  id: string;
  userId?: string;
  targetId?: string;
  type?: string;
  message?: string;
  status?: string;
  createdAt?: unknown;
};

export default function AdminReportsPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setPageLoading(true);
      setError("");

      const q = query(
        collection(db, "reports"),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as ReportItem[];

      setReports(data);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки жалоб");
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
      fetchReports();
    }
  }, [loading, user, profile]);

  const updateStatus = async (reportId: string, status: string) => {
    try {
      await updateDoc(doc(db, "reports", reportId), { status });

      setReports((prev) =>
        prev.map((item) =>
          item.id === reportId ? { ...item, status } : item
        )
      );
    } catch (err: any) {
      setError(err.message || "Ошибка обновления жалобы");
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
        <h1 className="text-2xl font-bold">Жалобы</h1>
        <p className="text-sm text-gray-600">
          Модерация жалоб пользователей.
        </p>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {reports.length === 0 ? (
        <div className="rounded border p-6">
          <p className="text-gray-600">Жалоб пока нет.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((item) => (
            <div key={item.id} className="rounded border p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Жалоба #{item.id}</h2>
                  <p className="text-sm text-gray-500">
                    Тип: {item.type || "—"}
                  </p>
                </div>

                <span className="rounded bg-gray-100 px-3 py-1 text-xs">
                  {item.status || "new"}
                </span>
              </div>

              <div className="mb-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                <p><strong>User:</strong> {item.userId || "—"}</p>
                <p><strong>Target:</strong> {item.targetId || "—"}</p>
              </div>

              <p className="mb-4 text-sm text-gray-700">
                {item.message || "Без описания"}
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateStatus(item.id, "in_progress")}
                  className="rounded border px-3 py-1 hover:bg-gray-50"
                >
                  В работу
                </button>

                <button
                  onClick={() => updateStatus(item.id, "resolved")}
                  className="rounded border px-3 py-1 hover:bg-gray-50"
                >
                  Решено
                </button>

                <button
                  onClick={() => updateStatus(item.id, "rejected")}
                  className="rounded border px-3 py-1 hover:bg-gray-50"
                >
                  Отклонить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
