import { FC } from 'react';
import useSWR from 'swr';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Segment } from '@/types';
import { fetcher } from '@/lib/fetcher';

const SegmentsPage: FC = () => {
  const { data: segments, error } = useSWR<Segment[]>('/api/segments', fetcher);

  if (error) return <div>Failed to load segments</div>;
  if (!segments) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer Segments</h1>
        <Button>Create Segment</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Segments</CardTitle>
            <CardDescription>Active customer segments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{segments.length}</p>
          </CardContent>
        </Card>
        {/* Add more summary cards */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Segment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { accessorKey: 'name', header: 'Name' },
              { accessorKey: 'customerCount', header: 'Customers' },
              { accessorKey: 'churnRisk', header: 'Churn Risk' },
              { accessorKey: 'valueScore', header: 'Value Score' }
            ]}
            data={segments}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SegmentsPage; 