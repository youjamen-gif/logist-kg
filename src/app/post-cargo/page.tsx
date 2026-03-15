"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/context/auth-context";

export default function PostCargoPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [originCountry, setOriginCountry] = useState("KG");
  const [destinationCountry, setDestinationCountry] = useState("KG");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [price, setPrice] = useState("");
  const [loadingDate, setLoadingDate] = useState("");
  const [description, setDescription] = useState("");
  const [documentsRequired, setDocumentsRequired] = useState(false);
  const [consolidation, setConsolidation] = useState(false);
  const [truckType, setTruckType] = useState("");
  const [trucksNeeded, setTrucksNeeded] = useState("1");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (!loading && profile?.role && !["shipper", "dispatcher", "admin"].includes(profile.role)) {
      router.push("/dashboard");
    }
  }, [loading, user, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user || !profile) {
      setError("Пользователь не найден");
      return;
    }

    if (!["shipper", "dispatcher", "admin"].includes(profile.role || "")) {
      setError("У вас нет прав для размещения груза");
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, "freights"), {
        originCity: originCity.trim(),
        destinationCity: destinationCity.trim(),
        originCountry: originCountry.trim(),
        destinationCountry: destinationCountry.trim(),
        weight: Number(weight),
        dimensions: dimensions.trim(),
        price: Number(price),
        currency: "KGS",
        loadingDate,
        description: description.trim(),
        documentsRequired,
        consolidation,
        truckType: truckType.trim(),
        trucksNeeded: Number(trucksNeeded),
        companyId: user.uid,
        status: "active",
        views: 0,
        bidsCount: 0,
        createdAt: serverTimestamp(),
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Ошибка при создании груза");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <main className="p-6">Загрузка...</main>;
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Разместить груз</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Город отправки"
          value={originCity}
          onChange={(e) => setOriginCity(e.target.value)}
          className="w-full rounded border p-3"
          required
        />

        <input
          type="text"
          placeholder="Город доставки"
          value={destinationCity}
          onChange={(e) => setDestinationCity(e.target.value)}
          className="w-full rounded border p-3"
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Страна отправки"
            value={originCountry}
            onChange={(e) => setOriginCountry(e.target.value)}
            className="w-full rounded border p-3"
            required
          />

          <input
            type="text"
            placeholder="Страна доставки"
            value={destinationCountry}
            onChange={(e) => setDestinationCountry(e.target.value)}
            className="w-full rounded border p-3"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="number"
            placeholder="Вес"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded border p-3"
            required
          />

          <input
            type="number"
            placeholder="Цена"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded border p-3"
            required
          />
        </div>

        <input
          type="text"
          placeholder="Габариты"
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          className="w-full rounded border p-3"
        />

        <input
          type="date"
          value={loadingDate}
          onChange={(e) => setLoadingDate(e.target.value)}
          className="w-full rounded border p-3"
          required
        />

        <input
          type="text"
          placeholder="Тип кузова"
          value={truckType}
          onChange={(e) => setTruckType(e.target.value)}
          className="w-full rounded border p-3"
          required
        />

        <input
          type="number"
          min="1"
          placeholder="Количество машин"
          value={trucksNeeded}
          onChange={(e) => setTrucksNeeded(e.target.value)}
          className="w-full rounded border p-3"
          required
        />

        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px] w-full rounded border p-3"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={documentsRequired}
            onChange={(e) => setDocumentsRequired(e.target.checked)}
          />
          Наличие документов обязательно
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={consolidation}
            onChange={(e) => setConsolidation(e.target.checked)}
          />
          Консолидация
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-black px-4 py-3 text-white disabled:opacity-50"
        >
          {submitting ? "Сохранение..." : "Разместить груз"}
        </button>
      </form>
    </main>
  );
}
