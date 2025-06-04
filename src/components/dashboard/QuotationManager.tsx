import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Plus,
  FileText,
  Clock,
  Send,
  MoreHorizontal,
  Download,
  Trash,
  Edit,
  Copy,
  CheckCircle,
  AlertCircle,
  Calendar,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Quotation {
  id: string;
  client: string;
  amount: number;
  date: string;
  expiryDate: string;
  status: "draft" | "sent" | "accepted" | "declined" | "expired";
  description: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
}

const QuotationManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 30)),
  );
  const [quotationItems, setQuotationItems] = useState<
    Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      amount: number;
    }>
  >([
    {
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    },
  ]);
  const [editQuotationItems, setEditQuotationItems] = useState<
    Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      amount: number;
    }>
  >([]);
  const [sendEmail, setSendEmail] = useState("");
  const [sendMessage, setSendMessage] = useState("");

  // Mock data with state management
  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: "QT-001",
      client: "Acme Corp",
      amount: 5250.0,
      date: "2023-06-01",
      expiryDate: "2023-07-01",
      status: "accepted",
      description: "Website redesign and development",
    },
    {
      id: "QT-002",
      client: "Globex Inc",
      amount: 3750.75,
      date: "2023-06-05",
      expiryDate: "2023-07-05",
      status: "sent",
      description: "Marketing campaign strategy",
    },
    {
      id: "QT-003",
      client: "Stark Industries",
      amount: 12000.0,
      date: "2023-06-10",
      expiryDate: "2023-07-10",
      status: "draft",
      description: "Custom software development",
    },
    {
      id: "QT-004",
      client: "Wayne Enterprises",
      amount: 8500.5,
      date: "2023-05-15",
      expiryDate: "2023-06-15",
      status: "expired",
      description: "IT infrastructure upgrade",
    },
    {
      id: "QT-005",
      client: "Pied Piper",
      amount: 4200.25,
      date: "2023-06-12",
      expiryDate: "2023-07-12",
      status: "declined",
      description: "Data compression solution",
    },
  ]);

  const clients: Client[] = [
    {
      id: "client-1",
      name: "Acme Corp",
      email: "contact@acme.com",
      company: "Acme Corporation",
    },
    {
      id: "client-2",
      name: "Globex Inc",
      email: "info@globex.com",
      company: "Globex Incorporated",
    },
    {
      id: "client-3",
      name: "Stark Industries",
      email: "sales@stark.com",
      company: "Stark Industries",
    },
    {
      id: "client-4",
      name: "Wayne Enterprises",
      email: "business@wayne.com",
      company: "Wayne Enterprises",
    },
    {
      id: "client-5",
      name: "Pied Piper",
      email: "hello@piedpiper.com",
      company: "Pied Piper",
    },
  ];

  const filteredQuotations = quotations.filter((quotation) => {
    if (activeTab !== "all" && quotation.status !== activeTab) return false;
    if (
      searchQuery &&
      !quotation.client.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !quotation.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !quotation.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "default";
      case "sent":
        return "secondary";
      case "draft":
        return "outline";
      case "declined":
        return "destructive";
      case "expired":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500 mr-1" />;
      case "declined":
        return <AlertCircle className="h-4 w-4 text-red-500 mr-1" />;
      case "expired":
        return <Clock className="h-4 w-4 text-gray-500 mr-1" />;
      default:
        return null;
    }
  };

  const handleSendQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    const client = clients.find((c) => c.name === quotation.client);
    setSendEmail(client?.email || "");
    setSendMessage(
      `Hi ${quotation.client},\n\nPlease find attached your quotation ${quotation.id} for ${quotation.description}.\n\nBest regards`,
    );
    setSendDialogOpen(true);
  };

  const handleEditQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setEditQuotationItems([
      {
        description: quotation.description,
        quantity: 1,
        unitPrice: quotation.amount,
        amount: quotation.amount,
      },
    ]);
    setEditDialogOpen(true);
  };

  const handleDuplicateQuotation = (quotation: Quotation) => {
    const newQuotation = {
      ...quotation,
      id: `QT-${String(quotations.length + 1).padStart(3, "0")}`,
      status: "draft" as const,
      date: new Date().toISOString().split("T")[0],
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 30))
        .toISOString()
        .split("T")[0],
    };
    setQuotations((prev) => [...prev, newQuotation]);
    toast({
      title: "Quotation Duplicated",
      description: `Quotation ${newQuotation.id} has been created as a draft.`,
    });
  };

  const handleDownloadPDF = (quotation: Quotation) => {
    // Simulate PDF download
    toast({
      title: "PDF Downloaded",
      description: `Quotation ${quotation.id} has been downloaded as PDF.`,
    });
  };

  const handleDeleteQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setDeleteDialogOpen(true);
  };

  const confirmSendQuotation = () => {
    if (selectedQuotation) {
      // Update quotation status to 'sent'
      setQuotations((prev) =>
        prev.map((q) =>
          q.id === selectedQuotation.id ? { ...q, status: "sent" as const } : q,
        ),
      );
      toast({
        title: "Quotation Sent",
        description: `Quotation ${selectedQuotation.id} has been sent to ${selectedQuotation.client}.`,
      });
      setSendDialogOpen(false);
      setSelectedQuotation(null);
      setSendEmail("");
      setSendMessage("");
    }
  };

  const confirmEditQuotation = () => {
    if (selectedQuotation) {
      const totalAmount = editQuotationItems.reduce(
        (sum, item) => sum + item.amount,
        0,
      );
      setQuotations((prev) =>
        prev.map((q) =>
          q.id === selectedQuotation.id
            ? {
                ...q,
                amount: totalAmount,
                description:
                  editQuotationItems[0]?.description || q.description,
              }
            : q,
        ),
      );
      toast({
        title: "Quotation Updated",
        description: `Quotation ${selectedQuotation.id} has been successfully updated.`,
      });
      setEditDialogOpen(false);
      setSelectedQuotation(null);
      setEditQuotationItems([]);
    }
  };

  const confirmDeleteQuotation = () => {
    if (selectedQuotation) {
      setQuotations((prev) =>
        prev.filter((q) => q.id !== selectedQuotation.id),
      );
      toast({
        title: "Quotation Deleted",
        description: `Quotation ${selectedQuotation.id} has been permanently deleted.`,
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      setSelectedQuotation(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Quotation Manager</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Quotation
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Tabs
          defaultValue="all"
          className="w-full sm:w-[400px]"
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="draft" className="text-xs sm:text-sm">
              Drafts
            </TabsTrigger>
            <TabsTrigger value="sent" className="text-xs sm:text-sm">
              Sent
            </TabsTrigger>
            <TabsTrigger value="accepted" className="text-xs sm:text-sm">
              Accepted
            </TabsTrigger>
            <TabsTrigger value="declined" className="text-xs sm:text-sm">
              Declined
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search quotations..."
            className="pl-8 w-full sm:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.length > 0 ? (
                filteredQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">
                      {quotation.id}
                    </TableCell>
                    <TableCell>{quotation.client}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {quotation.description}
                    </TableCell>
                    <TableCell>${quotation.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(quotation.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(quotation.expiryDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(quotation.status)}
                        <Badge
                          variant={getStatusBadgeVariant(quotation.status)}
                        >
                          {quotation.status.charAt(0).toUpperCase() +
                            quotation.status.slice(1)}
                        </Badge>
                      </div>
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
                            onClick={() => handleSendQuotation(quotation)}
                          >
                            <Send className="mr-2 h-4 w-4" /> Send
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditQuotation(quotation)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicateQuotation(quotation)}
                          >
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadPDF(quotation)}
                          >
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteQuotation(quotation)}
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
                    colSpan={8}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No quotations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredQuotations.length} of {quotations.length}{" "}
            quotations
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" /> Bulk Actions
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Create Quotation Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Quotation</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new quotation for your
              client.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quotationNumber">Quotation Number</Label>
                <Input
                  id="quotationNumber"
                  defaultValue={`QT-${String(quotations.length + 1).padStart(3, "0")}`}
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {expiryDate ? (
                          format(expiryDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={expiryDate}
                        onSelect={setExpiryDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the quotation"
                  className="h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes or terms"
                  className="h-[120px]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Line Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotationItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => {
                            const updatedItems = [...quotationItems];
                            updatedItems[index].description = e.target.value;
                            setQuotationItems(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          min="1"
                          className="w-20"
                          onChange={(e) => {
                            const updatedItems = [...quotationItems];
                            const quantity = parseInt(e.target.value) || 0;
                            updatedItems[index].quantity = quantity;
                            updatedItems[index].amount =
                              quantity * updatedItems[index].unitPrice;
                            setQuotationItems(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          min="0"
                          step="0.01"
                          className="w-24"
                          onChange={(e) => {
                            const updatedItems = [...quotationItems];
                            const unitPrice = parseFloat(e.target.value) || 0;
                            updatedItems[index].unitPrice = unitPrice;
                            updatedItems[index].amount =
                              updatedItems[index].quantity * unitPrice;
                            setQuotationItems(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>${item.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (quotationItems.length > 1) {
                              const updatedItems = quotationItems.filter(
                                (_, i) => i !== index,
                              );
                              setQuotationItems(updatedItems);
                            }
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setQuotationItems([
                    ...quotationItems,
                    {
                      description: "",
                      quantity: 1,
                      unitPrice: 0,
                      amount: 0,
                    },
                  ]);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>

            <div className="flex justify-end space-x-2">
              <div className="w-1/3 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    $
                    {quotationItems
                      .reduce((sum, item) => sum + item.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (0%):</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>
                    $
                    {quotationItems
                      .reduce((sum, item) => sum + item.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setQuotationItems([
                  {
                    description: "",
                    quantity: 1,
                    unitPrice: 0,
                    amount: 0,
                  },
                ]);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Create new quotation as draft
                const totalAmount = quotationItems.reduce(
                  (sum, item) => sum + item.amount,
                  0,
                );
                const newQuotation: Quotation = {
                  id: `QT-${String(quotations.length + 1).padStart(3, "0")}`,
                  client: "Selected Client", // This would come from the form
                  amount: totalAmount,
                  date:
                    selectedDate?.toISOString().split("T")[0] ||
                    new Date().toISOString().split("T")[0],
                  expiryDate:
                    expiryDate?.toISOString().split("T")[0] ||
                    new Date(new Date().setDate(new Date().getDate() + 30))
                      .toISOString()
                      .split("T")[0],
                  status: "draft",
                  description:
                    quotationItems[0]?.description || "New quotation",
                };
                setQuotations((prev) => [newQuotation, ...prev]);
                toast({
                  title: "Quotation Saved as Draft",
                  description: `Quotation ${newQuotation.id} has been saved as a draft.`,
                });
                setCreateDialogOpen(false);
                setQuotationItems([
                  {
                    description: "",
                    quantity: 1,
                    unitPrice: 0,
                    amount: 0,
                  },
                ]);
              }}
            >
              Save as Draft
            </Button>
            <Button
              onClick={() => {
                // Create new quotation
                const totalAmount = quotationItems.reduce(
                  (sum, item) => sum + item.amount,
                  0,
                );
                const newQuotation: Quotation = {
                  id: `QT-${String(quotations.length + 1).padStart(3, "0")}`,
                  client: "Selected Client", // This would come from the form
                  amount: totalAmount,
                  date:
                    selectedDate?.toISOString().split("T")[0] ||
                    new Date().toISOString().split("T")[0],
                  expiryDate:
                    expiryDate?.toISOString().split("T")[0] ||
                    new Date(new Date().setDate(new Date().getDate() + 30))
                      .toISOString()
                      .split("T")[0],
                  status: "sent",
                  description:
                    quotationItems[0]?.description || "New quotation",
                };
                setQuotations((prev) => [newQuotation, ...prev]);
                toast({
                  title: "Quotation Created & Sent",
                  description: `Quotation ${newQuotation.id} has been created and sent.`,
                });
                setCreateDialogOpen(false);
                setQuotationItems([
                  {
                    description: "",
                    quantity: 1,
                    unitPrice: 0,
                    amount: 0,
                  },
                ]);
              }}
            >
              Create & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Quotation Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Quotation {selectedQuotation?.id}</DialogTitle>
            <DialogDescription>
              Update the details of this quotation.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editClient">Client</Label>
                <Select defaultValue={selectedQuotation?.client}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.name}>
                        {client.name} - {client.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editQuotationNumber">Quotation Number</Label>
                <Input
                  id="editQuotationNumber"
                  defaultValue={selectedQuotation?.id}
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editIssueDate">Issue Date</Label>
                  <Input type="date" defaultValue={selectedQuotation?.date} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editExpiryDate">Expiry Date</Label>
                  <Input
                    type="date"
                    defaultValue={selectedQuotation?.expiryDate}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  defaultValue={selectedQuotation?.description}
                  className="h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editNotes">Notes</Label>
                <Textarea
                  id="editNotes"
                  placeholder="Add any additional notes or terms"
                  className="h-[120px]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Line Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editQuotationItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => {
                            const updatedItems = [...editQuotationItems];
                            updatedItems[index].description = e.target.value;
                            setEditQuotationItems(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          min="1"
                          className="w-20"
                          onChange={(e) => {
                            const updatedItems = [...editQuotationItems];
                            const quantity = parseInt(e.target.value) || 0;
                            updatedItems[index].quantity = quantity;
                            updatedItems[index].amount =
                              quantity * updatedItems[index].unitPrice;
                            setEditQuotationItems(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          min="0"
                          step="0.01"
                          className="w-24"
                          onChange={(e) => {
                            const updatedItems = [...editQuotationItems];
                            const unitPrice = parseFloat(e.target.value) || 0;
                            updatedItems[index].unitPrice = unitPrice;
                            updatedItems[index].amount =
                              updatedItems[index].quantity * unitPrice;
                            setEditQuotationItems(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>${item.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (editQuotationItems.length > 1) {
                              const updatedItems = editQuotationItems.filter(
                                (_, i) => i !== index,
                              );
                              setEditQuotationItems(updatedItems);
                            }
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setEditQuotationItems([
                    ...editQuotationItems,
                    {
                      description: "",
                      quantity: 1,
                      unitPrice: 0,
                      amount: 0,
                    },
                  ]);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>

            <div className="flex justify-end space-x-2">
              <div className="w-1/3 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    $
                    {editQuotationItems
                      .reduce((sum, item) => sum + item.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (0%):</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>
                    $
                    {editQuotationItems
                      .reduce((sum, item) => sum + item.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setSelectedQuotation(null);
                setEditQuotationItems([]);
              }}
            >
              Cancel
            </Button>
            <Button onClick={confirmEditQuotation}>Update Quotation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Quotation Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Quotation {selectedQuotation?.id}</DialogTitle>
            <DialogDescription>
              Send this quotation to your client via email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sendEmail">Client Email</Label>
              <Input
                id="sendEmail"
                type="email"
                value={sendEmail}
                onChange={(e) => setSendEmail(e.target.value)}
                placeholder="client@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sendMessage">Message</Label>
              <Textarea
                id="sendMessage"
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
                placeholder="Add a personal message..."
                className="h-[120px]"
              />
            </div>

            <div className="bg-muted p-3 rounded-md">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Quotation PDF will be attached automatically</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSendDialogOpen(false);
                setSelectedQuotation(null);
                setSendEmail("");
                setSendMessage("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={confirmSendQuotation}>
              <Send className="mr-2 h-4 w-4" />
              Send Quotation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete quotation {selectedQuotation?.id}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedQuotation(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteQuotation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Quotation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuotationManager;
