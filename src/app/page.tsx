import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-block rounded-full border px-4 py-1 text-sm">
              Logist.kg
            </p>

            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">
              Платформа для поиска и размещения грузов
            </h1>

            <p className="mb-8 text-lg text-gray-600">
              Находите грузы, размещайте объявления, управляйте откликами
              и общайтесь внутри платформы в одной системе.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/find-cargo"
                className="rounded bg-black px-6 py-3 text-white"
              >
                Найти груз
              </Link>

              <Link
                href="/post-cargo"
                className="rounded border px-6 py-3 hover:bg-gray-50"
              >
                Разместить груз
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border bg-gray-50 p-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Что умеет платформа
            </h2>

            <div className="grid gap-4">
              <div className="rounded border bg-white p-4">
                <h3 className="mb-2 font-semibold">Поиск грузов</h3>
                <p className="text-sm text-gray-600">
                  Поиск по маршруту, стране, весу, дате и типу кузова.
                </p>
              </div>

              <div className="rounded border bg-white p-4">
                <h3 className="mb-2 font-semibold">Отклики водителей</h3>
                <p className="text-sm text-gray-600">
                  Водители могут быстро оставлять предложения по перевозке.
                </p>
              </div>

              <div className="rounded border bg-white p-4">
                <h3 className="mb-2 font-semibold">Чат и уведомления</h3>
                <p className="text-sm text-gray-600">
                  Общение и системные уведомления внутри платформы.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="mb-8 text-3xl font-bold">Для кого платформа</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded border p-6">
              <h3 className="mb-3 text-xl font-semibold">Водители</h3>
              <p className="text-sm text-gray-600">
                Находят подходящие грузы и отправляют отклики.
              </p>
            </div>

            <div className="rounded border p-6">
              <h3 className="mb-3 text-xl font-semibold">Отправители</h3>
              <p className="text-sm text-gray-600">
                Размещают грузы и выбирают перевозчиков.
              </p>
            </div>

            <div className="rounded border p-6">
              <h3 className="mb-3 text-xl font-semibold">Диспетчеры</h3>
              <p className="text-sm text-gray-600">
                Управляют процессом перевозок и координацией.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="rounded-2xl bg-black p-8 text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Начните работать с Logist.kg
            </h2>

            <p className="mb-6 max-w-2xl text-white/80">
              Зарегистрируйтесь и получите доступ к поиску грузов, размещению
              объявлений и управлению перевозками.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded bg-white px-6 py-3 text-black"
              >
                Регистрация
              </Link>

              <Link
                href="/login"
                className="rounded border border-white px-6 py-3 text-white"
              >
                Войти
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
