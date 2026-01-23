export interface FAQ {
  uid: string
  title: string
  question: string
  answer: {
    html: string
    json?: any
  }
  category?: string
  order?: number
  is_active?: boolean
}
