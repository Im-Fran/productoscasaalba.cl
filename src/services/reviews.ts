import axiosInstance from '@/utils/axios';

export interface WooCommerceStoreReview {
  id: number;
  date_created: string;
  date_created_gmt: string;
  product_id: number;
  product_name: string;
  product_permalink: string;
  status: string;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  verified: boolean;
  reviewer_avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
}

// Mantenemos compatibilidad con la interfaz anterior
export interface WooCommerceReview {
  id: number;
  date_created: string;
  date_created_gmt: string;
  product_id: number;
  product_name?: string;
  product_permalink?: string;
  status: string;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  verified: boolean;
  reviewer_avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
}

export interface ReviewsResponse {
  reviews: WooCommerceReview[];
  totalReviews: number;
  averageRating: number;
}

class ReviewsService {
  private BASE_URL = '/api/wp-json/wc/store/v1';

  /**
   * Obtiene todas las reseñas de productos usando la API Store
   */
  async getAllReviews(params?: {
    page?: number;
    per_page?: number;
    order?: 'asc' | 'desc';
    orderby?: 'date' | 'rating' | 'product';
    category_id?: string;
    product_id?: string;
  }): Promise<ReviewsResponse> {
    try {
      const response = await axiosInstance.get(`${this.BASE_URL}/products/reviews`, {
        params: {
          per_page: params?.per_page || 100,
          page: params?.page || 1,
          order: params?.order || 'desc',
          orderby: params?.orderby || 'date',
          category_id: params?.category_id,
          product_id: params?.product_id
        }
      });

      const reviews: WooCommerceReview[] = response.data;

      // Calculamos estadísticas
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

      return {
        reviews,
        totalReviews,
        averageRating
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  /**
   * Obtiene reseñas de un producto específico
   */
  async getProductReviews(productId: number): Promise<WooCommerceReview[]> {
    try {
      const response = await axiosInstance.get(`${this.BASE_URL}/products/reviews`, {
        params: {
          product_id: productId.toString(),
          per_page: 100,
          order: 'desc',
          orderby: 'date'
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene reseñas por categoría
   */
  async getCategoryReviews(categoryId: number): Promise<WooCommerceReview[]> {
    try {
      const response = await axiosInstance.get(`${this.BASE_URL}/products/reviews`, {
        params: {
          category_id: categoryId.toString(),
          per_page: 100,
          order: 'desc',
          orderby: 'date'
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for category ${categoryId}:`, error);
      throw error;
    }
  }
}

export const reviewsService = new ReviewsService();
