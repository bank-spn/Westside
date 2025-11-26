import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Parcel() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState<any>(null);
  const [expandedParcel, setExpandedParcel] = useState<number | null>(null);

  const { data: parcels, isLoading } = trpc.parcel.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.parcel.create.useMutation({
    onSuccess: () => {
      utils.parcel.list.invalidate();
      setIsAddOpen(false);
      toast.success("Parcel added successfully!");
    },
    onError: () => {
      toast.error("Failed to add parcel");
    },
  });

  const updateMutation = trpc.parcel.update.useMutation({
    onSuccess: () => {
      utils.parcel.list.invalidate();
      setIsEditOpen(false);
      setEditingParcel(null);
      toast.success("Parcel updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update parcel");
    },
  });

  const deleteMutation = trpc.parcel.delete.useMutation({
    onSuccess: () => {
      utils.parcel.list.invalidate();
      toast.success("Parcel deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete parcel");
    },
  });

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      trackingNumber: formData.get("trackingNumber") as string,
      parcelName: formData.get("parcelName") as string,
      destination: formData.get("destination") as string,
      dateSent: formData.get("dateSent") as string,
      note: formData.get("note") as string,
      statusDescription: "Pending",
    });
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateMutation.mutate({
      id: editingParcel.id,
      trackingNumber: formData.get("trackingNumber") as string,
      parcelName: formData.get("parcelName") as string,
      destination: formData.get("destination") as string,
      dateSent: formData.get("dateSent") as string,
      note: formData.get("note") as string,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this parcel?")) {
      deleteMutation.mutate({ id });
    }
  };

  const getStatusColor = (status?: string | null) => {
    if (!status) return { bg: "#f3f4f6", text: "#6b7280" };
    const statusLower = status.toLowerCase();
    if (statusLower.includes("delivered")) return { bg: "#d1fae5", text: "#065f46" };
    if (statusLower.includes("customs")) return { bg: "#fef3c7", text: "#92400e" };
    if (statusLower.includes("transit")) return { bg: "#dbeafe", text: "#1e40af" };
    return { bg: "#f3f4f6", text: "#6b7280" };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Parcels</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Parcels</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Parcel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Parcel</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <Label htmlFor="trackingNumber">Tracking Number *</Label>
                <Input id="trackingNumber" name="trackingNumber" required />
              </div>
              <div>
                <Label htmlFor="parcelName">Parcel Name</Label>
                <Input id="parcelName" name="parcelName" />
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" name="destination" />
              </div>
              <div>
                <Label htmlFor="dateSent">Date Sent</Label>
                <Input id="dateSent" name="dateSent" type="date" />
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea id="note" name="note" />
              </div>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Adding..." : "Add Parcel"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!parcels || parcels.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              No parcels yet. Click "Add Parcel" to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {parcels.map((parcel) => {
            const statusColor = getStatusColor(parcel.statusDescription);
            const isExpanded = expandedParcel === parcel.id;

            return (
              <Card key={parcel.id} className="hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-lg mb-1">
                        {parcel.trackingNumber}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {parcel.parcelName || "Unnamed Parcel"}
                        {parcel.destination && ` • ${parcel.destination}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {parcel.statusDescription || "Unknown"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {parcel.location || "Location unknown"} •{" "}
                        {parcel.statusDate
                          ? new Date(parcel.statusDate).toLocaleDateString()
                          : "Date unknown"}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          border: `1px solid ${statusColor.text}`,
                        }}
                      >
                        {parcel.status || "N/A"}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toast.info("Refresh feature coming soon")}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingParcel(parcel);
                            setIsEditOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(parcel.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setExpandedParcel(isExpanded ? null : parcel.id)
                          }
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        {parcel.dateSent && (
                          <div className="text-sm">
                            <strong>Date Sent:</strong>{" "}
                            {new Date(parcel.dateSent).toLocaleDateString()}
                          </div>
                        )}
                        {parcel.note && (
                          <div className="text-sm">
                            <strong>Note:</strong> {parcel.note}
                          </div>
                        )}
                        {!parcel.dateSent && !parcel.note && (
                          <div className="text-sm text-muted-foreground text-center">
                            No additional details
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Parcel</DialogTitle>
          </DialogHeader>
          {editingParcel && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-trackingNumber">Tracking Number *</Label>
                <Input
                  id="edit-trackingNumber"
                  name="trackingNumber"
                  defaultValue={editingParcel.trackingNumber}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-parcelName">Parcel Name</Label>
                <Input
                  id="edit-parcelName"
                  name="parcelName"
                  defaultValue={editingParcel.parcelName || ""}
                />
              </div>
              <div>
                <Label htmlFor="edit-destination">Destination</Label>
                <Input
                  id="edit-destination"
                  name="destination"
                  defaultValue={editingParcel.destination || ""}
                />
              </div>
              <div>
                <Label htmlFor="edit-dateSent">Date Sent</Label>
                <Input
                  id="edit-dateSent"
                  name="dateSent"
                  type="date"
                  defaultValue={
                    editingParcel.dateSent
                      ? new Date(editingParcel.dateSent).toISOString().split("T")[0]
                      : ""
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-note">Note</Label>
                <Textarea
                  id="edit-note"
                  name="note"
                  defaultValue={editingParcel.note || ""}
                />
              </div>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update Parcel"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
