import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  BarChart2,
  Upload,
  Plus,
  Search,
  Download,
  Filter,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  receiptUrl?: string;
}

const ExpenseTracker = ({
  expenses = mockExpenses,
}: {
  expenses?: Expense[];
}) => {
  const [activeTab, setActiveTab] = useState("add-expense");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate total expenses by category for the chart
  const expensesByCategory: Record<string, number> = {};
  expenses.forEach((expense) => {
    if (expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] += expense.amount;
    } else {
      expensesByCategory[expense.category] = expense.amount;
    }
  });

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      searchQuery === "" ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || expense.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Expense Tracker</CardTitle>
            <CardDescription>
              Track, categorize, and manage your business expenses
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="add-expense">Add Expense</TabsTrigger>
            <TabsTrigger value="expense-reports">Expense Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="add-expense" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-amount">Amount</Label>
                  <Input id="expense-amount" type="number" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-date">Date</Label>
                  <Input id="expense-date" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-category">Category</Label>
                  <Select>
                    <SelectTrigger id="expense-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Office Supplies</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="meals">
                        Meals & Entertainment
                      </SelectItem>
                      <SelectItem value="software">
                        Software & Subscriptions
                      </SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-description">Description</Label>
                  <Textarea
                    id="expense-description"
                    placeholder="Enter expense details"
                  />
                </div>

                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>

              <div className="border rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">Upload Receipt</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click to upload
                  </p>
                </div>

                <div className="border-2 border-dashed rounded-lg p-8 w-full flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or PDF, up to 10MB
                  </p>
                  <Button variant="outline" className="mt-4">
                    Select File
                  </Button>
                </div>

                <div className="mt-4 w-full">
                  <p className="text-sm font-medium mb-1">
                    AI Receipt Processing
                  </p>
                  <div className="flex items-center">
                    <Progress value={0} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground ml-2">
                      Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expense-reports" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-2/3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Recent Expenses</h3>
                  <div className="flex gap-2 items-center">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search expenses..."
                        className="pl-8 w-[200px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        <SelectItem value="Office Supplies">
                          Office Supplies
                        </SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Meals & Entertainment">
                          Meals & Entertainment
                        </SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell>{expense.date}</TableCell>
                            <TableCell>{expense.category}</TableCell>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell>${expense.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  expense.status === "approved"
                                    ? "default"
                                    : expense.status === "rejected"
                                      ? "destructive"
                                      : "outline"
                                }
                              >
                                {expense.status.charAt(0).toUpperCase() +
                                  expense.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-4 text-muted-foreground"
                          >
                            No expenses found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="w-full lg:w-1/3 space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Expense Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center py-4">
                      <PieChart className="h-32 w-32 text-primary" />
                    </div>
                    <div className="space-y-2">
                      {Object.entries(expensesByCategory).map(
                        ([category, amount]) => (
                          <div
                            key={category}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-3 h-3 rounded-full bg-primary mr-2 opacity-${Math.floor((amount / totalExpenses) * 100)}`}
                              />
                              <span className="text-sm">{category}</span>
                            </div>
                            <span className="text-sm font-medium">
                              ${amount.toFixed(2)}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Monthly Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center py-4">
                      <BarChart2 className="h-32 w-32 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm text-muted-foreground">
            Last updated: Today at 2:30 PM
          </p>
          <Button variant="link" size="sm" className="text-primary">
            View All Expenses
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Mock data for demonstration
const mockExpenses: Expense[] = [
  {
    id: "1",
    date: "2023-06-15",
    category: "Office Supplies",
    amount: 125.5,
    description: "Printer ink and paper",
    status: "approved",
    receiptUrl: "https://example.com/receipt1.jpg",
  },
  {
    id: "2",
    date: "2023-06-12",
    category: "Travel",
    amount: 350.75,
    description: "Flight to client meeting",
    status: "approved",
    receiptUrl: "https://example.com/receipt2.jpg",
  },
  {
    id: "3",
    date: "2023-06-10",
    category: "Meals & Entertainment",
    amount: 85.2,
    description: "Client lunch meeting",
    status: "pending",
    receiptUrl: "https://example.com/receipt3.jpg",
  },
  {
    id: "4",
    date: "2023-06-08",
    category: "Software",
    amount: 49.99,
    description: "Monthly subscription",
    status: "approved",
    receiptUrl: "https://example.com/receipt4.jpg",
  },
  {
    id: "5",
    date: "2023-06-05",
    category: "Equipment",
    amount: 899.99,
    description: "New laptop",
    status: "rejected",
    receiptUrl: "https://example.com/receipt5.jpg",
  },
];

export default ExpenseTracker;
