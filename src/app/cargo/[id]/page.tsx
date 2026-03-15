"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/context/auth-context";

type Freight = {
  id: string;
  originCity: string;
  destinationCity: string;
  originCountry?: string;
  destinationCountry?: string;
  weight?: number;
  dimensions?: string;
  price?: number;
  currency?: string;
  loadingDate?: string;
  description?: string;
  documentsRequired?: boolean;
  consolidation?: boolean;
  truckType?: string;
  trucksNeeded?: number;
  companyId?: string;
  status?: string;
  views?: number;
  bidsCount?: number;
};

export default function CargoDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();

  const [freight, setFreight] = useState<Freight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bidPrice, setBidPrice] = useState("");
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");

  const freightId = params?.id as string;

  useEffect(() => {
    const fetchFreight = async () => {
      if (!freightId) return;

      try {
        setLoading(true);
        setError("");

        const freightRef = doc(db, "freights", freightId);
        const freightSnap = await getDoc(freightRef);

        if (!freightSnap.exists()) {
          setError("Груз не найден");
          setFreight(null);
          return;
        }

        const data = {
          id: freightSnap.id,
          ...freightSnap.data(),
        } as Freight;

        setFreight(data);

        await updateDoc(freightRef, {
          views: increment(1),
        });
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки груза");
      } finally {
        setLoading(false);
      }
    };

    fetchFreight();
  }, [freightId]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBidError("");
    setBidSuccess("");

    if (!user) {
      router.push("/login");
      return;
    }

    if (profile?.role !== "driver") {
      setBidError("Отклик может оставить только водитель");
      return;
    }

    if (!bidPrice || Number(bidPrice) <= 0) {
      setBidError("Укажите корректную цену");
      return;
    }

    if (!freight) {
      setBidError("Груз не найден");
      return;
    }

    try {
      setBidLoading(true);

      await addDoc(collection(db, "bids"), {
        freightId: freight.id,
        driverId: user.uid,
        companyId: freight.companyId || null,
        price: Number(bidPrice),
        auction: true,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "freights", freight.id), {
        bidsCount: increment(1),
      });

      setBidPrice("");
      setBidSuccess("Отклик успешно отправлен");
    } catch (err: any) {
      setBidError(err.message || "Ошибка отправки отклика");
    } finally {
      setBidLoading(false);
    }
  };

  if (loading) {
    return <main className="p-6">Загрузка...</main>;
  }

  if (error || !freight) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-red-600">{error || "Груз не найден"}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {freight.originCity} → {freight.destinationCity}
        </h1>

        <span className="rounded bg-gray-100 px-3 py-1 text-sm">
          {freight.status || "active"}
        </span>
      </div>

      <div className="mb-8 grid gap-4 rounded border p-5 sm:grid-cols-2">
        <p><strong>Страна отправки:</strong> {freight.originCountry || "—"}</p>
        <p><strong>Страна доставки:</strong> {freight.destinationCountry || "—"}</p>
        <p><strong>Вес:</strong> {freight.weight || "—"}</p>
        <p><strong>Габариты:</strong> {freight.dimensions || "—"}</p>
        <p><strong>Цена:</strong> {freight.price || "—"} {freight.currency || "KGS"}</p>
        <p><strong>Дата загрузки:</strong> {freight.loadingDate || "—"}</p>
        <p><strong>Тип кузова:</strong> {freight.truckType || "—"}</p>
        <p><strong>Количество машин:</strong> {freight.trucksNeeded || "—"}</p>
        <p><strong>Документы:</strong> {freight.documentsRequired ? "Требуются" : "Не требуются"}</p>
        <p><strong>Консолидация:</strong> {freight.consolidation ? "Да" : "Нет"}</p>
        <p><strong>Просмотры:</strong> {freight.views || 0}</p>
        <p><strong>Отклики:</strong> {freight.bidsCount || 0}</p>
      </div>

      <div className="mb-8 rounded border p-5">
        <h2 className="mb-3 text-lg font-semibold">Описание</h2>
        <p className="whitespace-pre-line text-gray-700">
          {freight.description || "Описание отсутствует"}
        </p>
      </div>

      <div className="rounded border p-5">
        <h2 className="mb-4 text-lg font-semibold">Оставить отклик</h2>

        {!user ? (
          <p className="text-sm text-gray-600">
            Для отклика нужно <button onClick={() => router.push("/login")} className="underline">войти</button>.
          </p>
        ) : profile?.role !== "driver" ? (
          <p className="text-sm text-gray-600">
            Отклики могут оставлять только водители.
          </p>
        ) : (
          <form onSubmit={handleBidSubmit} className="space-y-4">
            <input
              type="number"
              placeholder="Ваша цена"
              value={bidPrice}
              onChange={(e) => setBidPrice(e.target.value)}
              className="w-full rounded border p-3"
              required
            />

            {bidError ? <p className="text-sm text-red-600">{bidError}</p> : null}
            {bidSuccess ? <p className="text-sm text-green-600">{bidSuccess}</p> : null}

            <button
              type="submit"
              disabled={bidLoading}
              className="rounded bg-black px-4 py-3 text-white disabled:opacity-50"
            >
              {bidLoading ? "Отправка..." : "Отправить отклик"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
