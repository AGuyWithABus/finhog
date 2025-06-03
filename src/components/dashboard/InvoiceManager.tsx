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
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  AlertCircle,
  Check,
  X,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Invoice {
  id: string;
  client: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "draft";
  email?: string;
  items?: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  notes?: string;
  terms?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

const InvoiceManager = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [reminderMessage, setReminderMessage] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  const [invoicesData, setInvoicesData] = useState<Invoice[]>([]);
  const [newInvoiceItems, setNewInvoiceItems] = useState<
    Array<{
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }>
  >([
    {
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ]);
  const [editInvoiceItems, setEditInvoiceItems] = useState<
    Array<{
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }>
  >([]);

  // Mock data
  const initialInvoices: Invoice[] = [
    {
      id: "INV-001",
      client: "Acme Corp",
      amount: 1250.0,
      date: "2023-05-15",
      dueDate: "2023-06-15",
      status: "paid",
      email: "billing@acme.com",
      items: [
        {
          description: "Website Design",
          quantity: 1,
          rate: 1250,
          amount: 1250,
        },
      ],
      notes: "Thank you for your business!",
      terms: "Payment due within 30 days.",
    },
    {
      id: "INV-002",
      client: "Globex Inc",
      amount: 3450.75,
      date: "2023-05-20",
      dueDate: "2023-06-20",
      status: "pending",
      email: "accounts@globex.com",
      items: [
        {
          description: "Consulting Services",
          quantity: 15,
          rate: 230.05,
          amount: 3450.75,
        },
      ],
      notes: "Please process this invoice at your earliest convenience.",
      terms: "Payment due within 30 days.",
    },
    {
      id: "INV-003",
      client: "Stark Industries",
      amount: 5000.0,
      date: "2023-05-01",
      dueDate: "2023-06-01",
      status: "overdue",
      email: "tony@stark.com",
      items: [
        {
          description: "Product Development",
          quantity: 1,
          rate: 5000,
          amount: 5000,
        },
      ],
      notes: "This invoice is now overdue. Please remit payment immediately.",
      terms: "Payment due within 30 days. Late fees apply after due date.",
    },
    {
      id: "INV-004",
      client: "Wayne Enterprises",
      amount: 2100.5,
      date: "2023-05-25",
      dueDate: "2023-06-25",
      status: "draft",
      email: "bruce@wayne.com",
      items: [
        {
          description: "Security Consultation",
          quantity: 1,
          rate: 2100.5,
          amount: 2100.5,
        },
      ],
      notes: "Draft invoice - not yet sent.",
      terms: "Payment due within 30 days.",
    },
    {
      id: "INV-005",
      client: "Pied Piper",
      amount: 1800.25,
      date: "2023-05-10",
      dueDate: "2023-06-10",
      status: "pending",
      email: "richard@piedpiper.com",
      items: [
        {
          description: "Algorithm Optimization",
          quantity: 1,
          rate: 1800.25,
          amount: 1800.25,
        },
      ],
      notes: "Thank you for your business!",
      terms: "Payment due within 30 days.",
    },
  ];

  // Initialize invoices state with the mock data
  React.useEffect(() => {
    setInvoicesData(initialInvoices);
  }, []);

  React.useEffect(() => {
    if (selectedInvoice && selectedInvoice.items) {
      setEditInvoiceItems([...selectedInvoice.items]);
    }
  }, [selectedInvoice]);

  const clients: Client[] = [
    { id: "client-1", name: "Acme Corp", email: "billing@acme.com" },
    { id: "client-2", name: "Globex Inc", email: "accounts@globex.com" },
    { id: "client-3", name: "Stark Industries", email: "tony@stark.com" },
    { id: "client-4", name: "Wayne Enterprises", email: "bruce@wayne.com" },
    { id: "client-5", name: "Pied Piper", email: "richard@piedpiper.com" },
  ];

  const filteredInvoices = invoicesData.filter((invoice) => {
    if (activeTab !== "all" && invoice.status !== activeTab) return false;
    if (
      searchQuery &&
      !invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "overdue":
        return "destructive";
      case "draft":
        return "outline";
      default:
        return "default";
    }
  };

  // Action handlers
  const handleSendInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setSendMessage(
      `Dear ${invoice.client},\n\nI hope this message finds you well. Please find attached invoice ${invoice.id} for ${invoice.amount.toFixed(2)} USD, due on ${new Date(invoice.dueDate).toLocaleDateString()}.\n\nPlease don't hesitate to contact us if you have any questions.\n\nBest regards,\nYour Company`,
    );
    setSendDialogOpen(true);
  };

  const handleSendConfirm = () => {
    if (!selectedInvoice) return;

    // Update invoice status if it's a draft
    if (selectedInvoice.status === "draft") {
      const updatedInvoices = invoicesData.map((inv) =>
        inv.id === selectedInvoice.id ? { ...inv, status: "pending" } : inv,
      );
      setInvoicesData(updatedInvoices);
    }

    setSendDialogOpen(false);
    toast({
      title: "Invoice Sent",
      description: `Invoice ${selectedInvoice.id} has been sent to ${selectedInvoice.client}.`,
      duration: 3000,
    });
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    if (invoice.items) {
      setEditInvoiceItems([...invoice.items]);
    } else {
      setEditInvoiceItems([
        {
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
        },
      ]);
    }
    setEditDialogOpen(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // In a real app, this would generate a PDF
    toast({
      title: "Invoice Downloaded",
      description: `Invoice ${invoice.id} has been downloaded as PDF.`,
      duration: 3000,
    });
  };

  const handleSendReminder = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setReminderMessage(
      `Dear ${invoice.client},\n\nThis is a friendly reminder that invoice ${invoice.id} for ${invoice.amount.toFixed(2)} USD is due on ${new Date(invoice.dueDate).toLocaleDateString()}.\n\nPlease process this payment at your earliest convenience.\n\nBest regards,\nYour Company`,
    );
    setReminderDialogOpen(true);
  };

  const handleReminderConfirm = () => {
    if (!selectedInvoice) return;
    setReminderDialogOpen(false);
    toast({
      title: "Reminder Sent",
      description: `Payment reminder for invoice ${selectedInvoice.id} has been sent to ${selectedInvoice.client}.`,
      duration: 3000,
    });
  };

  const handleDeletePrompt = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedInvoice) return;
    const updatedInvoices = invoicesData.filter(
      (inv) => inv.id !== selectedInvoice.id,
    );
    setInvoicesData(updatedInvoices);
    setDeleteDialogOpen(false);
    toast({
      title: "Invoice Deleted",
      description: `Invoice ${selectedInvoice.id} has been deleted.`,
      duration: 3000,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Invoice Manager</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
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
            <TabsTrigger value="pending" className="text-xs sm:text-sm">
              Pending
            </TabsTrigger>
            <TabsTrigger value="paid" className="text-xs sm:text-sm">
              Paid
            </TabsTrigger>
            <TabsTrigger value="overdue" className="text-xs sm:text-sm">
              Overdue
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoices..."
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
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(invoice.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </Badge>
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
                            onClick={() => handleSendInvoice(invoice)}
                          >
                            <Send className="mr-2 h-4 w-4" /> Send
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditInvoice(invoice)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadInvoice(invoice)}
                          >
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSendReminder(invoice)}
                          >
                            <AlertCircle className="mr-2 h-4 w-4" /> Send
                            Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeletePrompt(invoice)}
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
                    No invoices found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredInvoices.length} of {invoicesData.length} invoices
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" /> Set Up Recurring
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Create Invoice Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new invoice.
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
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  defaultValue={`INV-${String(invoicesData.length + 1).padStart(3, "0")}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes or payment instructions"
                  className="h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  placeholder="Add your terms and conditions"
                  className="h-[80px]"
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
                    <TableHead>Rate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newInvoiceItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => {
                            const updatedItems = [...newInvoiceItems];
                            updatedItems[index].description = e.target.value;
                            setNewInvoiceItems(updatedItems);
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
                            const updatedItems = [...newInvoiceItems];
                            const quantity = parseInt(e.target.value) || 0;
                            updatedItems[index].quantity = quantity;
                            updatedItems[index].amount =
                              quantity * updatedItems[index].rate;
                            setNewInvoiceItems(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.rate}
                          min="0"
                          step="0.01"
                          className="w-24"
                          onChange={(e) => {
                            const updatedItems = [...newInvoiceItems];
                            const rate = parseFloat(e.target.value) || 0;
                            updatedItems[index].rate = rate;
                            updatedItems[index].amount =
                              updatedItems[index].quantity * rate;
                            setNewInvoiceItems(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>${item.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (newInvoiceItems.length > 1) {
                              const updatedItems = newInvoiceItems.filter(
                                (_, i) => i !== index,
                              );
                              setNewInvoiceItems(updatedItems);
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
                  setNewInvoiceItems([
                    ...newInvoiceItems,
                    {
                      description: "",
                      quantity: 1,
                      rate: 0,
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
                    {newInvoiceItems
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
                    {newInvoiceItems
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
                setNewInvoiceItems([
                  {
                    description: "",
                    quantity: 1,
                    rate: 0,
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
                // Save as draft logic would go here
                setCreateDialogOpen(false);
                toast({
                  title: "Invoice Saved",
                  description: "Invoice has been saved as draft.",
                  duration: 3000,
                });
                setNewInvoiceItems([
                  {
                    description: "",
                    quantity: 1,
                    rate: 0,
                    amount: 0,
                  },
                ]);
              }}
            >
              Save as Draft
            </Button>
            <Button
              onClick={() => {
                // Create and send logic would go here
                setCreateDialogOpen(false);
                toast({
                  title: "Invoice Created",
                  description: "Invoice has been created and sent.",
                  duration: 3000,
                });
                setNewInvoiceItems([
                  {
                    description: "",
                    quantity: 1,
                    rate: 0,
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

      {/* Edit Invoice Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Invoice {selectedInvoice?.id}</DialogTitle>
            <DialogDescription>
              Update the invoice details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-client">Client</Label>
                <Select defaultValue={selectedInvoice?.client}>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedInvoice?.client} />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-issueDate">Issue Date</Label>
                  <Input
                    id="edit-issueDate"
                    type="date"
                    defaultValue={selectedInvoice?.date}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dueDate">Due Date</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    defaultValue={selectedInvoice?.dueDate}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedInvoice?.status}>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedInvoice?.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Add any additional notes or payment instructions"
                  className="h-[120px]"
                  defaultValue={selectedInvoice?.notes}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-terms">Terms & Conditions</Label>
                <Textarea
                  id="edit-terms"
                  placeholder="Add your terms and conditions"
                  className="h-[80px]"
                  defaultValue={selectedInvoice?.terms}
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
                    <TableHead>Rate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editInvoiceItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => {
                            const updatedItems = [...editInvoiceItems];
                            updatedItems[index].description = e.target.value;
                            setEditInvoiceItems(updatedItems);
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
                            const updatedItems = [...editInvoiceItems];
                            const quantity = parseInt(e.target.value) || 0;
                            updatedItems[index].quantity = quantity;
                            updatedItems[index].amount =
                              quantity * updatedItems[index].rate;
                            setEditInvoiceItems(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.rate}
                          min="0"
                          step="0.01"
                          className="w-24"
                          onChange={(e) => {
                            const updatedItems = [...editInvoiceItems];
                            const rate = parseFloat(e.target.value) || 0;
                            updatedItems[index].rate = rate;
                            updatedItems[index].amount =
                              updatedItems[index].quantity * rate;
                            setEditInvoiceItems(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>${item.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (editInvoiceItems.length > 1) {
                              const updatedItems = editInvoiceItems.filter(
                                (_, i) => i !== index,
                              );
                              setEditInvoiceItems(updatedItems);
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
                  setEditInvoiceItems([
                    ...editInvoiceItems,
                    {
                      description: "",
                      quantity: 1,
                      rate: 0,
                      amount: 0,
                    },
                  ]);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Update the invoice with the edited items
                if (selectedInvoice) {
                  const updatedInvoices = invoicesData.map((inv) =>
                    inv.id === selectedInvoice.id
                      ? { ...inv, items: editInvoiceItems }
                      : inv,
                  );
                  setInvoicesData(updatedInvoices);
                }
                setEditDialogOpen(false);
                toast({
                  title: "Invoice Updated",
                  description: `Invoice ${selectedInvoice?.id} has been updated successfully.`,
                  duration: 3000,
                });
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete invoice {selectedInvoice?.id} for{" "}
              {selectedInvoice?.client}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Reminder Dialog */}
      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Payment Reminder</DialogTitle>
            <DialogDescription>
              Send a payment reminder for invoice {selectedInvoice?.id} to{" "}
              {selectedInvoice?.client}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reminder-to">To</Label>
                <Input
                  id="reminder-to"
                  value={selectedInvoice?.email}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminder-subject">Subject</Label>
                <Input
                  id="reminder-subject"
                  defaultValue={`Payment Reminder: Invoice ${selectedInvoice?.id}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-message">Message</Label>
              <Textarea
                id="reminder-message"
                className="h-[200px]"
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReminderDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleReminderConfirm}>
              <Send className="mr-2 h-4 w-4" /> Send Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Invoice Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Invoice</DialogTitle>
            <DialogDescription>
              Send invoice {selectedInvoice?.id} to {selectedInvoice?.client}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="send-to">To</Label>
                <Input id="send-to" value={selectedInvoice?.email} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="send-subject">Subject</Label>
                <Input
                  id="send-subject"
                  defaultValue={`Invoice ${selectedInvoice?.id} from Your Company`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-message">Message</Label>
              <Textarea
                id="send-message"
                className="h-[200px]"
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/50">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">
                {selectedInvoice?.id}.pdf
              </span>
              <Badge variant="outline" className="ml-auto">
                Invoice PDF
              </Badge>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendConfirm}>
              <Mail className="mr-2 h-4 w-4" /> Send Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
};

export default InvoiceManager;
