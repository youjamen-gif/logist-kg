"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/context/auth-context";

type Bid = {
  id: string;
  freightId: string;
  driverId: string;
  companyId?: string | null;
  price: number;
  auction?: boolean;
  status?: string;
  createdAt?: unknown;
};

export default function BidsPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [bids, setBids] = useState<Bid[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (!loading && profile?.role && profile.role !== "driver") {
      router.push("/dashboard");
      return;
    }
  }, [loading, user, profile, router]);

  useEffect(() => {
    const fetchBids = async () => {
      if (!user) return;

      try {
        setPageLoading(true);
        setError("");

        const q = query(
          collection(db, "bids"),
          where("driverId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Bid[];

        setBids(data);
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки откликов");
      } finally {
        setPageLoading(false);
      }
    };

    if (!loading && user && profile?.role === "driver") {
      fetchBids();
    }
  }, [loading, user, profile]);

  if (loading || pageLoading) {
    return <main className="p-6">Загрузка...</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Мои отклики</h1>
        <p className="text-sm text-gray-600">
          Здесь отображаются все отклики, которые вы отправили.
        </p>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {bids.length === 0 ? (
        <div className="rounded border p-6">
          <p className="mb-4 text-gray-700">У вас пока нет откликов.</p>
          <Link
            href="/find-cargo"
            className="inline-block rounded bg-black px-4 py-2 text-white"
          >
            Найти груз
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bids.map((bid) => (
            <div key={bid.id} className="rounded border p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Отклик #{bid.id}</h2>
                <span className="rounded bg-gray-100 px-3 py-1 text-sm">
                  {bid.status || "pending"}
                </span>
              </div>

              <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-4">
                <p><strong>Груз:</strong> {bid.freightId}</p>
                <p><strong>Цена:</strong> {bid.price}</p>
                <p><strong>Аукцион:</strong> {bid.auction ? "Да" : "Нет"}</p>
                <p><strong>Статус:</strong> {bid.status || "pending"}</p>
              </div>

              <div className="mt-4">
                <Link
                  href={`/cargo/${bid.freightId}`}
                  className="inline-block rounded border px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Открыть груз
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
