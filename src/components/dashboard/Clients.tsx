import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Edit,
  Trash,
  Eye,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "active" | "inactive" | "pending";
  totalInvoiced: number;
  lastInvoice: string;
}

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newClientDialogOpen, setNewClientDialogOpen] = useState(false);
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);
  const [editClientDialogOpen, setEditClientDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Client>>({});
  const { toast } = useToast();

  // Mock data
  const clients: Client[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@acme.com",
      phone: "+1 (555) 123-4567",
      company: "Acme Corp",
      status: "active",
      totalInvoiced: 15420.5,
      lastInvoice: "2023-06-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@globex.com",
      phone: "+1 (555) 987-6543",
      company: "Globex Inc",
      status: "active",
      totalInvoiced: 28750.0,
      lastInvoice: "2023-06-20",
    },
    {
      id: "3",
      name: "Tony Stark",
      email: "tony@stark.com",
      phone: "+1 (555) 555-0001",
      company: "Stark Industries",
      status: "active",
      totalInvoiced: 45000.0,
      lastInvoice: "2023-06-01",
    },
    {
      id: "4",
      name: "Bruce Wayne",
      email: "bruce@wayne.com",
      phone: "+1 (555) 555-0002",
      company: "Wayne Enterprises",
      status: "pending",
      totalInvoiced: 0,
      lastInvoice: "Never",
    },
    {
      id: "5",
      name: "Richard Hendricks",
      email: "richard@piedpiper.com",
      phone: "+1 (555) 555-0003",
      company: "Pied Piper",
      status: "inactive",
      totalInvoiced: 12500.0,
      lastInvoice: "2023-05-10",
    },
  ];

  const filteredClients = clients.filter(
    (client) =>
      searchQuery === "" ||
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "inactive":
        return "outline";
      default:
        return "default";
    }
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setViewDetailsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setEditFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      status: client.status,
    });
    setEditClientDialogOpen(true);
  };

  const handleSendEmail = (client: Client) => {
    // Simulate sending email
    const subject = encodeURIComponent(`Hello ${client.name}`);
    const body = encodeURIComponent(
      `Dear ${client.name},\n\nI hope this email finds you well.\n\nBest regards`,
    );
    const mailtoLink = `mailto:${client.email}?subject=${subject}&body=${body}`;

    window.open(mailtoLink, "_blank");

    toast({
      title: "Email Client",
      description: `Opening email client to send message to ${client.name}`,
    });
  };

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    setDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedClient) {
      // In a real app, you would delete from your backend/state management
      toast({
        title: "Client Deleted",
        description: `${selectedClient.name} has been removed from your client list.`,
        variant: "destructive",
      });
      setDeleteAlertOpen(false);
      setSelectedClient(null);
    }
  };

  const handleSaveEdit = () => {
    if (selectedClient && editFormData) {
      // In a real app, you would update your backend/state management
      toast({
        title: "Client Updated",
        description: `${editFormData.name || selectedClient.name}'s information has been updated.`,
      });
      setEditClientDialogOpen(false);
      setSelectedClient(null);
      setEditFormData({});
    }
  };

  const handleEditFormChange = (field: keyof Client, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Clients</h1>
            <p className="text-muted-foreground">
              Manage your client relationships and contact information
            </p>
          </div>
          <Dialog
            open={newClientDialogOpen}
            onOpenChange={setNewClientDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Full Name</Label>
                  <Input id="client-name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-phone">Phone</Label>
                  <Input
                    id="client-phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-company">Company</Label>
                  <Input id="client-company" placeholder="Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-status">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="client-notes">Notes</Label>
                  <Textarea
                    id="client-notes"
                    placeholder="Additional notes about the client"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setNewClientDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setNewClientDialogOpen(false)}>
                  Add Client
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Client Directory</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search clients..."
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Invoiced</TableHead>
                  <TableHead>Last Invoice</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.name}
                      </TableCell>
                      <TableCell>{client.company}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="mr-1 h-3 w-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="mr-1 h-3 w-3" />
                            {client.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(client.status)}>
                          {client.status.charAt(0).toUpperCase() +
                            client.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        ${client.totalInvoiced.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {client.lastInvoice === "Never"
                          ? "Never"
                          : new Date(client.lastInvoice).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(client)}
                            >
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClient(client)}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSendEmail(client)}
                            >
                              <Mail className="mr-2 h-4 w-4" /> Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteClient(client)}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No clients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Details Dialog */}
        <Dialog
          open={viewDetailsDialogOpen}
          onOpenChange={setViewDetailsDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Client Details</DialogTitle>
            </DialogHeader>
            {selectedClient && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </Label>
                    <p className="text-lg font-semibold">
                      {selectedClient.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Company
                    </Label>
                    <p className="text-lg font-semibold">
                      {selectedClient.company}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <p className="text-lg">{selectedClient.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Phone
                    </Label>
                    <p className="text-lg">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Status
                    </Label>
                    <div className="mt-1">
                      <Badge
                        variant={getStatusBadgeVariant(selectedClient.status)}
                      >
                        {selectedClient.status.charAt(0).toUpperCase() +
                          selectedClient.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Total Invoiced
                    </Label>
                    <p className="text-lg font-semibold">
                      ${selectedClient.totalInvoiced.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Last Invoice Date
                  </Label>
                  <p className="text-lg">
                    {selectedClient.lastInvoice === "Never"
                      ? "Never"
                      : new Date(
                          selectedClient.lastInvoice,
                        ).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSendEmail(selectedClient)}
                  >
                    <Mail className="mr-2 h-4 w-4" /> Send Email
                  </Button>
                  <Button
                    onClick={() => {
                      setViewDetailsDialogOpen(false);
                      handleEditClient(selectedClient);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit Client
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Client Dialog */}
        <Dialog
          open={editClientDialogOpen}
          onOpenChange={setEditClientDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-client-name">Full Name</Label>
                <Input
                  id="edit-client-name"
                  value={editFormData.name || ""}
                  onChange={(e) => handleEditFormChange("name", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-client-email">Email</Label>
                <Input
                  id="edit-client-email"
                  type="email"
                  value={editFormData.email || ""}
                  onChange={(e) =>
                    handleEditFormChange("email", e.target.value)
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-client-phone">Phone</Label>
                <Input
                  id="edit-client-phone"
                  type="tel"
                  value={editFormData.phone || ""}
                  onChange={(e) =>
                    handleEditFormChange("phone", e.target.value)
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-client-company">Company</Label>
                <Input
                  id="edit-client-company"
                  value={editFormData.company || ""}
                  onChange={(e) =>
                    handleEditFormChange("company", e.target.value)
                  }
                  placeholder="Acme Corp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-client-status">Status</Label>
                <Select
                  value={editFormData.status || ""}
                  onValueChange={(value) =>
                    handleEditFormChange("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setEditClientDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Alert */}
        <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Client</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedClient?.name}? This
                action cannot be undone. All associated invoices and data will
                remain but will no longer be linked to this client.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Client
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Clients;
