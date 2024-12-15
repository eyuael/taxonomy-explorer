// app/loading.tsx
import { LoadingSpinner } from '@/components/layout/taxonomy/ui/LoadingSpinner';

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );
}  
