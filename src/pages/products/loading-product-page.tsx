export const LoadingProductPage = () => <div className="container mx-auto px-4 py-8">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
    {/* Gallery skeleton */}
    <div className="space-y-4">
      <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="flex space-x-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>

    {/* Info skeleton */}
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
      </div>
    </div>
  </div>
</div>