import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { data: parcels, isLoading } = trpc.parcel.list.useQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalParcels = parcels?.length || 0;
  const deliveredCount = parcels?.filter(p => 
    p.status === '501' || p.statusDescription?.toLowerCase().includes('delivered')
  ).length || 0;
  const customsCount = parcels?.filter(p => 
    p.statusDescription?.toLowerCase().includes('customs')
  ).length || 0;
  const inTransitCount = parcels?.filter(p => 
    !p.statusDescription?.toLowerCase().includes('delivered') && 
    !p.statusDescription?.toLowerCase().includes('customs')
  ).length || 0;

  const recentParcels = [...(parcels || [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status?: string | null) => {
    if (!status) return { bg: '#f3f4f6', text: '#6b7280' };
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered')) return { bg: '#d1fae5', text: '#065f46' };
    if (statusLower.includes('customs')) return { bg: '#fef3c7', text: '#92400e' };
    if (statusLower.includes('transit')) return { bg: '#dbeafe', text: '#1e40af' };
    return { bg: '#f3f4f6', text: '#6b7280' };
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Parcels</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParcels}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customs Clearance</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransitCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Parcels</CardTitle>
        </CardHeader>
        <CardContent>
          {recentParcels.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No parcels yet. Add your first tracking number!
            </p>
          ) : (
            <div className="space-y-4">
              {recentParcels.map((parcel) => {
                const statusColor = getStatusColor(parcel.statusDescription);
                return (
                  <div
                    key={parcel.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{parcel.trackingNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {parcel.parcelName || 'Unnamed Parcel'}
                        {parcel.destination && ` • ${parcel.destination}`}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {parcel.statusDescription || 'Unknown'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {parcel.location || 'Location unknown'} • {' '}
                        {parcel.statusDate 
                          ? new Date(parcel.statusDate).toLocaleDateString() 
                          : 'Date unknown'}
                      </div>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        border: `1px solid ${statusColor.text}`,
                      }}
                    >
                      {parcel.status || 'N/A'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
