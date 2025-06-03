import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import {
  Menu,
  Home,
  FileText,
  DollarSign,
  CheckSquare,
  Users,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

const MobileNavigation = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
        <div className="flex flex-col h-full bg-card">
          <div className="flex items-center p-4 border-b">
            <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold">FM</span>
            </div>
            <h1 className="ml-2 font-bold text-xl">FinanceManager</h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link to="/invoices" className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Invoices
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link to="/quotations" className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Quotations
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link to="/expenses" className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Expenses
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link to="/tasks" className="flex items-center">
                <CheckSquare className="mr-2 h-5 w-5" />
                Tasks
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link to="/clients" className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Clients
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link to="/reports" className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                Reports
              </Link>
            </Button>
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link to="/settings" className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
