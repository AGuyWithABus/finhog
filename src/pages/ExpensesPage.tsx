import React from "react";
import ExpenseTracker from "@/components/dashboard/ExpenseTracker";

const ExpensesPage = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">
            Track and categorize your business expenses
          </p>
        </div>
        <ExpenseTracker />
      </div>
    </div>
  );
};

export default ExpensesPage;
