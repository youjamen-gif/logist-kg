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
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/context/auth-context";

type FreightItem = {
  id: string;
  originCity?: string;
  destinationCity?: string;
  originCountry?: string;
  destinationCountry?: string;
  weight?: number;
  price?: number;
  currency?: string;
  truckType?: string;
  companyId?: string;
  status?: string;
  bidsCount?: number;
  views?: number;
};

export default function AdminFreightsPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [freights, setFreights] = useState<FreightItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFreights = async () => {
    try {
      setPageLoading(true);
      setError("");

      const q = query(
        collection(db, "freights"),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as FreightItem[];

      setFreights(data);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки грузов");
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
      fetchFreights();
    }
  }, [loading, user, profile]);

  const updateStatus = async (freightId: string, status: string) => {
    try {
      await updateDoc(doc(db, "freights", freightId), { status });

      setFreights((prev) =>
        prev.map((item) =>
          item.id === freightId ? { ...item, status } : item
        )
      );
    } catch (err: any) {
      setError(err.message || "Ошибка обновления статуса");
    }
  };

  if (loading || pageLoading) {
    return <main className="p-6">Загрузка...</main>;
  }

  if (!user || profile?.role !== "admin") {
    return null;
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Грузы</h1>
        <p className="text-sm text-gray-600">
          Управление грузами платформы.
        </p>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {freights.length === 0 ? (
        <div className="rounded border p-6">
          <p className="text-gray-600">Грузов пока нет.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Маршрут</th>
                <th className="px-4 py-3">Вес</th>
                <th className="px-4 py-3">Цена</th>
                <th className="px-4 py-3">Кузов</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Отклики</th>
                <th className="px-4 py-3">Просмотры</th>
                <th className="px-4 py-3">Действия</th>
              </tr>
            </thead>

            <tbody>
              {freights.map((item) => (
                <tr key={item.id} className="border-b align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {item.originCity || "—"} → {item.destinationCity || "—"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.originCountry || "—"} / {item.destinationCountry || "—"}
                    </div>
                  </td>

                  <td className="px-4 py-3">{item.weight || "—"}</td>

                  <td className="px-4 py-3">
                    {item.price || "—"} {item.currency || "KGS"}
                  </td>

                  <td className="px-4 py-3">{item.truckType || "—"}</td>

                  <td className="px-4 py-3">{item.status || "active"}</td>

                  <td className="px-4 py-3">{item.bidsCount || 0}</td>

                  <td className="px-4 py-3">{item.views || 0}</td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/cargo/${item.id}`}
                        className="rounded border px-3 py-1 hover:bg-gray-50"
                      >
                        Открыть
                      </Link>

                      <button
                        onClick={() => updateStatus(item.id, "blocked")}
                        className="rounded border px-3 py-1 hover:bg-gray-50"
                      >
                        Блок
                      </button>

                      <button
                        onClick={() => updateStatus(item.id, "active")}
                        className="rounded border px-3 py-1 hover:bg-gray-50"
                      >
                        Актив
                      </button>

                      <button
                        onClick={() => updateStatus(item.id, "completed")}
                        className="rounded border px-3 py-1 hover:bg-gray-50"
                      >
                        Завершён
                      </button>
                    </div>
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
