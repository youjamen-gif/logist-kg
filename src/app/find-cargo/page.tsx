"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

type Freight = {
  id: string;
  originCity: string;
  destinationCity: string;
  originCountry?: string;
  destinationCountry?: string;
  weight: number;
  price: number;
  currency?: string;
  loadingDate?: string;
  truckType?: string;
  consolidation?: boolean;
  status?: string;
  createdAt?: unknown;
};

export default function FindCargoPage() {
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [truckType, setTruckType] = useState("");
  const [results, setResults] = useState<Freight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasFilters = useMemo(() => {
    return Boolean(originCity.trim() || destinationCity.trim() || truckType.trim());
  }, [originCity, destinationCity, truckType]);

  const fetchActiveFreights = async () => {
    setLoading(true);
    setError("");

    try {
      const q = query(
        collection(db, "freights"),
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
        limit(30)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Freight[];

      setResults(data);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки грузов");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let qRef: ReturnType<typeof query>;

      if (originCity.trim() && destinationCity.trim()) {
        qRef = query(
          collection(db, "freights"),
          where("status", "==", "active"),
          where("originCity", "==", originCity.trim()),
          where("destinationCity", "==", destinationCity.trim()),
          orderBy("createdAt", "desc"),
          limit(30)
        );
      } else if (originCity.trim()) {
        qRef = query(
          collection(db, "freights"),
          where("status", "==", "active"),
          where("originCity", "==", originCity.trim()),
          orderBy("createdAt", "desc"),
          limit(30)
        );
      } else if (destinationCity.trim()) {
        qRef = query(
          collection(db, "freights"),
          where("status", "==", "active"),
          where("destinationCity", "==", destinationCity.trim()),
          orderBy("createdAt", "desc"),
          limit(30)
        );
      } else {
        qRef = query(
          collection(db, "freights"),
          where("status", "==", "active"),
          orderBy("createdAt", "desc"),
          limit(30)
        );
      }

      const snapshot = await getDocs(qRef);
      let data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Freight[];

      if (truckType.trim()) {
        data = data.filter(
          (item) =>
            (item.truckType || "").toLowerCase() === truckType.trim().toLowerCase()
        );
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message || "Ошибка поиска грузов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveFreights();
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Поиск грузов</h1>

      <form onSubmit={handleSearch} className="mb-8 grid gap-4 rounded border p-4 md:grid-cols-4">
        <input
          type="text"
          placeholder="Город отправки"
          value={originCity}
          onChange={(e) => setOriginCity(e.target.value)}
          className="w-full rounded border p-3"
        />

        <input
          type="text"
          placeholder="Город доставки"
          value={destinationCity}
          onChange={(e) => setDestinationCity(e.target.value)}
          className="w-full rounded border p-3"
        />

        <input
          type="text"
          placeholder="Тип кузова"
          value={truckType}
          onChange={(e) => setTruckType(e.target.value)}
          className="w-full rounded border p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Поиск..." : "Найти"}
        </button>
      </form>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => {
            setOriginCity("");
            setDestinationCity("");
            setTruckType("");
            fetchActiveFreights();
          }}
          className="mb-6 rounded border px-4 py-2"
        >
          Сбросить фильтры
        </button>
      ) : null}

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <p>Загрузка...</p>
      ) : results.length === 0 ? (
        <p>Грузы не найдены.</p>
      ) : (
        <div className="grid gap-4">
          {results.map((freight) => (
            <Link
              key={freight.id}
              href={`/cargo/${freight.id}`}
              className="rounded border p-4 transition hover:bg-gray-50"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">
                  {freight.originCity} → {freight.destinationCity}
                </h2>
                <span className="rounded bg-gray-100 px-3 py-1 text-sm">
                  {freight.status || "active"}
                </span>
              </div>

              <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-4">
                <p><strong>Вес:</strong> {freight.weight || "—"}</p>
                <p><strong>Цена:</strong> {freight.price || "—"} {freight.currency || "KGS"}</p>
                <p><strong>Дата:</strong> {freight.loadingDate || "—"}</p>
                <p><strong>Кузов:</strong> {freight.truckType || "—"}</p>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                <p>
                  <strong>Консолидация:</strong> {freight.consolidation ? "Да" : "Нет"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
