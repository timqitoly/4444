export interface News {
  id: string
  title: string
  summary: string
  content: string
  author: string
  publishedAt: Date
  updatedAt: Date
  imageUrl?: string
  category: string
}
