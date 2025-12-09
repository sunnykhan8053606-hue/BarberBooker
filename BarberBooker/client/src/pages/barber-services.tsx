import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useUser } from "@/lib/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getBarberShopFromLocalStorage, saveBarberShopToLocalStorage, BarberService } from "@/lib/services";
import { toast } from "sonner";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function BarberServices() {
  const { user } = useUser();
  const [, navigate] = useLocation();
  const [shopName, setShopName] = useState("");
  const [services, setServices] = useState<BarberService[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("30");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!user || user.role !== "barber") {
      navigate("/signin");
      return;
    }

    const shop = getBarberShopFromLocalStorage(user.id);
    if (!shop) {
      navigate("/barber-onboarding");
      return;
    }

    setShopName(shop.shopName);
    setServices(shop.services);
  }, [user, navigate]);

  const handleAddService = () => {
    if (!serviceName.trim() || !price.trim()) {
      toast("Please fill in service name and price");
      return;
    }

    const newService: BarberService = {
      id: editingId || `service_${Math.random().toString()}`,
      name: serviceName,
      description,
      duration: parseInt(duration),
      price: parseFloat(price),
    };

    let updatedServices;
    if (editingId) {
      updatedServices = services.map((s) => (s.id === editingId ? newService : s));
      toast("Service updated!");
    } else {
      updatedServices = [...services, newService];
      toast("Service added!");
    }

    setServices(updatedServices);

    // Save to localStorage
    const shop = getBarberShopFromLocalStorage(user!.id);
    if (shop) {
      saveBarberShopToLocalStorage({
        ...shop,
        services: updatedServices,
      });
    }

    // Reset form
    setServiceName("");
    setDescription("");
    setDuration("30");
    setPrice("");
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEditService = (service: BarberService) => {
    setServiceName(service.name);
    setDescription(service.description);
    setDuration(service.duration.toString());
    setPrice(service.price.toString());
    setEditingId(service.id);
    setIsDialogOpen(true);
  };

  const handleDeleteService = (id: string) => {
    const updatedServices = services.filter((s) => s.id !== id);
    setServices(updatedServices);

    const shop = getBarberShopFromLocalStorage(user!.id);
    if (shop) {
      saveBarberShopToLocalStorage({
        ...shop,
        services: updatedServices,
      });
    }

    toast("Service deleted!");
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setServiceName("");
    setDescription("");
    setDuration("30");
    setPrice("");
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">Manage Services</h1>
            <p className="text-muted-foreground">{shopName}</p>
          </div>

          {/* Add Service Button */}
          <div className="mb-8">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="rounded-full h-11 px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Service
            </Button>
          </div>

          {/* Services List */}
          {services.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-6 flex items-start justify-between">
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold">{service.name}</h3>
                      {service.description && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {service.description}
                        </p>
                      )}
                      <div className="flex gap-4 mt-4">
                        <Badge variant="outline">
                          ⏱️ {service.duration} min
                        </Badge>
                        <Badge variant="outline" className="text-accent">
                          💰 ${service.price}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground text-lg mb-4">
                  No services added yet. Create your first service to start receiving bookings!
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="rounded-full"
                >
                  Add First Service
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add/Edit Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              {editingId ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              Add details about your service and pricing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="svc-name" className="text-sm font-medium">
                Service Name *
              </Label>
              <Input
                id="svc-name"
                placeholder="e.g., Classic Haircut"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="svc-description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="svc-description"
                placeholder="Describe what this service includes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5 min-h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="svc-duration" className="text-sm font-medium">
                  Duration (minutes) *
                </Label>
                <Input
                  id="svc-duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="svc-price" className="text-sm font-medium">
                  Price ($) *
                </Label>
                <Input
                  id="svc-price"
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1.5"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleAddService}>
              {editingId ? "Update Service" : "Add Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
