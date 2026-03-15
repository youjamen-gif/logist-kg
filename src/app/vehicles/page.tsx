"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/context/auth-context";

type Vehicle = {
  id: string;
  driverId: string;
  plateNumber: string;
  trailerNumber?: string;
  truckType: string;
  capacity: number;
  dimensions?: string;
  createdAt?: unknown;
};

export default function VehiclesPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [plateNumber, setPlateNumber] = useState("");
  const [trailerNumber, setTrailerNumber] = useState("");
  const [truckType, setTruckType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [dimensions, setDimensions] = useState("");

  const fetchVehicles = async () => {
    if (!user) return;

    try {
      setPageLoading(true);
      setError("");

      const q = query(
        collection(db, "vehicles"),
        where("driverId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Vehicle[];

      setVehicles(data);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки машин");
    } finally {
      setPageLoading(false);
    }
  };

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
    if (!loading && user && profile?.role === "driver") {
      fetchVehicles();
    }
  }, [loading, user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) return;

    try {
      setSubmitting(true);

      await addDoc(collection(db, "vehicles"), {
        driverId: user.uid,
        plateNumber: plateNumber.trim(),
        trailerNumber: trailerNumber.trim(),
        truckType: truckType.trim(),
        capacity: Number(capacity),
        dimensions: dimensions.trim(),
        createdAt: serverTimestamp(),
      });

      setPlateNumber("");
      setTrailerNumber("");
      setTruckType("");
      setCapacity("");
      setDimensions("");

      await fetchVehicles();
    } catch (err: any) {
      setError(err.message || "Ошибка добавления машины");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (vehicleId: string) => {
    try {
      await deleteDoc(doc(db, "vehicles", vehicleId));
      await fetchVehicles();
    } catch (err: any) {
      setError(err.message || "Ошибка удаления машины");
    }
  };

  if (loading || pageLoading) {
    return <main className="p-6">Загрузка...</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Мои машины</h1>
        <p className="text-sm text-gray-600">
          Добавляйте и управляйте транспортом водителя.
        </p>
      </div>

      <div className="mb-8 rounded border p-5">
        <h2 className="mb-4 text-lg font-semibold">Добавить машину</h2>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Номер ТС"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            className="w-full rounded border p-3"
            required
          />

          <input
            type="text"
            placeholder="Номер прицепа"
            value={trailerNumber}
            onChange={(e) => setTrailerNumber(e.target.value)}
            className="w-full rounded border p-3"
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
            placeholder="Грузоподъёмность"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full rounded border p-3"
            required
          />

          <input
            type="text"
            placeholder="Габариты"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            className="w-full rounded border p-3 md:col-span-2"
          />

          {error ? <p className="text-sm text-red-600 md:col-span-2">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-black px-4 py-3 text-white disabled:opacity-50 md:col-span-2"
          >
            {submitting ? "Сохранение..." : "Добавить машину"}
          </button>
        </form>
      </div>

      <div className="rounded border p-5">
        <h2 className="mb-4 text-lg font-semibold">Список машин</h2>

        {vehicles.length === 0 ? (
          <p className="text-gray-600">Машин пока нет.</p>
        ) : (
          <div className="grid gap-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex flex-col gap-4 rounded border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-4">
                  <p><strong>Номер ТС:</strong> {vehicle.plateNumber}</p>
                  <p><strong>Прицеп:</strong> {vehicle.trailerNumber || "—"}</p>
                  <p><strong>Кузов:</strong> {vehicle.truckType}</p>
                  <p><strong>Грузоподъёмность:</strong> {vehicle.capacity}</p>
                  <p><strong>Габариты:</strong> {vehicle.dimensions || "—"}</p>
                </div>

                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
