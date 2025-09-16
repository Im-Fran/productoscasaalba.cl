import { useState, useEffect } from 'react';
import { reviewsService, type WooCommerceReview } from '@/services/reviews';

interface Review {
  id: number;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  productName?: string;
  productImage?: string;
  verified: boolean;
  helpful: number;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export default function ReviewsPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para transformar las reviews de WooCommerce al formato local
  const transformWooCommerceReview = (wooReview: WooCommerceReview): Review => ({
    id: wooReview.id,
    customerName: wooReview.reviewer,
    customerAvatar: wooReview.reviewer_avatar_urls?.['96'],
    rating: wooReview.rating,
    title: '', // WooCommerce no tiene título separado, podríamos extraer la primera línea
    comment: wooReview.review.replace(/<[^>]*>/g, ''), // Remover HTML tags
    date: wooReview.date_created,
    productName: wooReview.product_name,
    verified: wooReview.verified,
    helpful: 0 // WooCommerce no tiene sistema de "helpful" por defecto
  });

  // Función para calcular estadísticas
  const calculateStats = (reviewsData: Review[]): ReviewStats => {
    const totalReviews = reviewsData.length;
    const averageRating = totalReviews > 0
      ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach(review => {
      const rating = review.rating as keyof typeof ratingDistribution;
      if (ratingDistribution[rating] !== undefined) {
        ratingDistribution[rating]++;
      }
    });

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution
    };
  };

  // Cargar reviews desde WooCommerce
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const orderParam = sortBy === 'newest' ? 'desc' : sortBy === 'oldest' ? 'asc' : 'desc';
        const orderbyParam = (sortBy === 'highest' || sortBy === 'lowest') ? 'rating' : 'date';

        const response = await reviewsService.getAllReviews({
          per_page: 100,
          order: orderParam as 'asc' | 'desc',
          orderby: orderbyParam as 'date' | 'rating'
        });

        const transformedReviews = response.reviews.map(transformWooCommerceReview);
        setReviews(transformedReviews);
        setStats(calculateStats(transformedReviews));
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Error al cargar las reseñas. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [sortBy]);

  const filteredReviews = reviews.filter(review => {
    if (selectedFilter === 'all') return true;
    return review.rating === selectedFilter;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPercentage = (count: number) => {
    return ((count / stats.totalReviews) * 100).toFixed(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg
              className="animate-spin h-10 w-10 mx-auto mb-4 text-mint-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4.293 12.293a1 1 0 011.414 0L12 18.586l6.293-6.293a1 1 0 111.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414z"
              ></path>
            </svg>
            <p className="text-lg text-gray-600">
              Cargando reseñas, por favor espera...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ocurrió un error
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-mint-600 text-white px-6 py-3 rounded-lg hover:bg-mint-700 transition-colors font-medium"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Reseñas de Nuestros Clientes
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre lo que nuestros clientes dicen sobre la calidad de nuestros productos
            y servicios. Sus opiniones nos ayudan a mejorar cada día.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar con estadísticas y filtros */}
          <div className="lg:col-span-1 space-y-6">
            {/* Resumen de calificaciones */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumen de Calificaciones
              </h3>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stats.averageRating}
                </div>
                {renderStars(Math.round(stats.averageRating), 'lg')}
                <p className="text-sm text-gray-600 mt-2">
                  Basado en {stats.totalReviews} reseñas
                </p>
              </div>

              {/* Distribución de calificaciones */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 w-8">
                      {rating}★
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-mint-600 h-2 rounded-full"
                        style={{
                          width: `${getPercentage(stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution])}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Calificación</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedFilter === 'all'
                      ? 'bg-mint-100 text-mint-800 border border-mint-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Todas las reseñas
                </button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedFilter(rating as 1 | 2 | 3 | 4 | 5)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      selectedFilter === rating
                        ? 'bg-mint-100 text-mint-800 border border-mint-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {renderStars(rating, 'sm')}
                    <span className="ml-2">({stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ordenar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ordenar por</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="highest">Calificación más alta</option>
                <option value="lowest">Calificación más baja</option>
                <option value="helpful">Más útiles</option>
              </select>
            </div>
          </div>

          {/* Lista de reseñas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reseñas ({filteredReviews.length})
                </h2>
              </div>

              <div className="space-y-6">
                {sortedReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-mint-100 rounded-full flex items-center justify-center">
                          <span className="text-mint-600 font-semibold text-lg">
                            {review.customerName.charAt(0)}
                          </span>
                        </div>
                      </div>

                      {/* Contenido de la reseña */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 flex items-center">
                              {review.customerName}
                              {review.verified && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Verificado
                                </span>
                              )}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              {renderStars(review.rating, 'sm')}
                              <span className="text-sm text-gray-500">
                                {formatDate(review.date)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Título de la reseña */}
                        <h5 className="font-medium text-gray-900 mb-2">
                          {review.title}
                        </h5>

                        {/* Comentario */}
                        <p className="text-gray-700 leading-relaxed mb-3">
                          {review.comment}
                        </p>

                        {/* Producto asociado */}
                        {review.productName && (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-3">
                            {review.productImage && (
                              <img
                                src={review.productImage}
                                alt={review.productName}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {review.productName}
                              </p>
                              <p className="text-xs text-gray-500">Producto reseñado</p>
                            </div>
                          </div>
                        )}

                        {/* Acciones */}
                        <div className="flex items-center space-x-4 text-sm">
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-mint-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            <span>Útil ({review.helpful})</span>
                          </button>
                          <button className="text-gray-500 hover:text-mint-600 transition-colors">
                            Responder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to action */}
              <div className="mt-8 text-center p-6 bg-mint-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Ya probaste nuestros productos?
                </h3>
                <p className="text-gray-600 mb-4">
                  Comparte tu experiencia con otros clientes y ayúdanos a mejorar
                </p>
                <button className="bg-mint-600 text-white px-6 py-3 rounded-lg hover:bg-mint-700 transition-colors font-medium">
                  Escribir una reseña
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
