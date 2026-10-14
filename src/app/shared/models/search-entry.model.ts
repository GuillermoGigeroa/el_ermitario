export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  route?: string;
  fragment?: string;
  action?: 'cart';
  image?: string;
}
