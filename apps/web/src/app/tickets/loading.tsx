export default function Loading() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="h-4 w-24 rounded bg-white/10 animate-pulse"></div>
            <div className="mt-2 h-10 w-64 rounded bg-white/10 animate-pulse md:w-96 md:h-12"></div>
            <div className="mt-3 h-12 w-full max-w-xl rounded bg-white/10 animate-pulse"></div>
          </div>
        </div>

        <div className="mb-10 flex flex-col gap-4">
          <div className="h-12 w-full max-w-md rounded-full bg-white/10 animate-pulse"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-24 rounded-full bg-white/10 animate-pulse"></div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
              <div className="h-48 w-full bg-white/5 animate-pulse"></div>
              <div className="p-5">
                <div className="h-6 w-3/4 rounded bg-white/10 animate-pulse"></div>
                <div className="mt-2 h-4 w-1/2 rounded bg-white/10 animate-pulse"></div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-4 w-1/4 rounded bg-white/10 animate-pulse"></div>
                  <div className="h-4 w-1/4 rounded bg-white/10 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
