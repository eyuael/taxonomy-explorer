// app/page.tsx
import { Suspense } from 'react';
import { TaxonomyExplorer } from '@/components/TaxonomyExplorer/TaxonomyExplorer';
import { LoadingSpinner } from '@/components/layout/taxonomy/ui/LoadingSpinner';
import { Alert } from '@/components/layout/taxonomy/ui/Alert';
import { Card, CardContent } from '@/components/layout/taxonomy/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <Card className="mb-8">
        <CardContent className="prose max-w-none">
          <h2 className="text-2xl font-bold mb-4">Welcome to the Mammal Taxonomy Explorer</h2>
          <p className="text-gray-600">
            Explore the fascinating world of mammalian classification. Click on any taxonomic group 
            to see its subgroups and learn more about their characteristics, distribution, and 
            conservation status.
          </p>
        </CardContent>
      </Card>

      {/* Main Explorer Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Suspense fallback={
          <div className="flex items-center justify-center h-[600px]">
            <LoadingSpinner size="lg" />
          </div>
        }>
          <TaxonomyExplorer />
        </Suspense>
      </div>

      {/* Error Boundary (you'll need to implement this) */}
      <div className="mt-8">
        <Alert
          variant="error"
          title="Error"
          className="hidden"
        >
          An error occurred while loading the taxonomy data. Please try refreshing the page.
        </Alert>
      </div>
    </div>
  );
}

// app/error.tsx
