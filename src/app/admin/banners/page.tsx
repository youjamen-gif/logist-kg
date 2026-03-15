"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/context/auth-context";

type BannerItem = {
  id: string;
  title?: string;
  imageUrl?: string;
  link?: string;
  active?: boolean;
  createdAt?: unknown;
};

export default function AdminBannersPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");

  const fetchBanners = async () => {
    try {
      setPageLoading(true);
      setError("");

      const q = query(
        collection(db, "banners"),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as BannerItem[];

      setBanners(data);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки баннеров");
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
      fetchBanners();
    }
  }, [loading, user, profile]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      await addDoc(collection(db, "banners"), {
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        link: link.trim(),
        active: true,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setImageUrl("");
      setLink("");

      await fetchBanners();
    } catch (err: any) {
      setError(err.message || "Ошибка создания баннера");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBanner = async (id: string, active: boolean) => {
    try {
      await updateDoc(doc(db, "banners", id), { active: !active });

      setBanners((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, active: !active } : item
        )
      );
    } catch (err: any) {
      setError(err.message || "Ошибка обновления баннера");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "banners", id));
      setBanners((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message || "Ошибка удаления баннера");
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
        <h1 className="text-2xl font-bold">Баннеры</h1>
        <p className="text-sm text-gray-600">
          Управление баннерами платформы.
        </p>
      </div>

      <div className="mb-8 rounded border p-5">
        <h2 className="mb-4 text-lg font-semibold">Создать баннер</h2>

        <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border p-3"
            required
          />

          <input
            type="text"
            placeholder="URL изображения"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded border p-3"
            required
          />

          <input
            type="text"
            placeholder="Ссылка"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full rounded border p-3"
          />

          {error ? <p className="text-sm text-red-600 md:col-span-3">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-black px-4 py-3 text-white disabled:opacity-50 md:col-span-3"
          >
            {submitting ? "Сохранение..." : "Создать баннер"}
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {banners.length === 0 ? (
          <div className="rounded border p-6">
            <p className="text-gray-600">Баннеров пока нет.</p>
          </div>
        ) : (
          banners.map((item) => (
            <div key={item.id} className="rounded border p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{item.title || "Без названия"}</h2>
                  <p className="text-sm text-gray-500">{item.link || "Без ссылки"}</p>
                </div>

                <span className="rounded bg-gray-100 px-3 py-1 text-xs">
                  {item.active ? "Активен" : "Выключен"}
                </span>
              </div>

              {item.imageUrl ? (
                <div className="mb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title || "banner"}
                    className="max-h-40 rounded border object-cover"
                  />
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleBanner(item.id, Boolean(item.active))}
                  className="rounded border px-3 py-1 hover:bg-gray-50"
                >
                  {item.active ? "Выключить" : "Включить"}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded border px-3 py-1 hover:bg-gray-50"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
