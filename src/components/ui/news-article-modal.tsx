import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  category: string;
  published_date?: string;
  date?: string;
  read_time?: string;
  readTime?: string;
  image_url?: string;
}

interface NewsArticleModalProps {
  article: NewsArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewsArticleModal({ article, open, onOpenChange }: NewsArticleModalProps) {
  if (!article) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology':
        return 'bg-blue-100 text-blue-800';
      case 'Healthcare':
        return 'bg-green-100 text-green-800';
      case 'Mental Health':
        return 'bg-purple-100 text-purple-800';
      case 'Research':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/90 backdrop-blur max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getCategoryColor(article.category)}>
              {article.category}
            </Badge>
            <span className="text-xs text-gray-500">{article.read_time || article.readTime}</span>
          </div>
          <DialogTitle className="text-2xl leading-tight">
            {article.title}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {article.excerpt}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500 border-b pb-4">
            <div className="flex items-center gap-2">
              <User className="size-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>{new Date(article.published_date || article.date || '').toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>{article.read_time || article.readTime}</span>
            </div>
          </div>
          
          <div className="prose prose-gray max-w-none">
            {article.content ? (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {article.content}
              </div>
            ) : (
              <p className="text-gray-600">
                This is a preview of the article. The full content would be displayed here in a real implementation.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}