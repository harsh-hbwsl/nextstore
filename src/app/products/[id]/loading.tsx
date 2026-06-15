export default function ProductDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-4 w-48 bg-gray-200 rounded mb-10" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="h-[420px] bg-gray-200 rounded-2xl" />
        <div className="space-y-5">
          <div className="h-5 w-24 bg-gray-200 rounded-full" />
          <div className="h-7 bg-gray-200 rounded" />
          <div className="h-7 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-28 bg-gray-200 rounded" />
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
          <div className="h-14 bg-gray-200 rounded-xl mt-6" />
        </div>
      </div>
    </div>
  );
}
