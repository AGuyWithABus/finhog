import React from "react";
import QuotationManager from "@/components/dashboard/QuotationManager";

const QuotationsPage = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Quotations</h1>
          <p className="text-muted-foreground">
            Create and manage professional quotes for your clients
          </p>
        </div>
        <QuotationManager />
      </div>
    </div>
  );
};

export default QuotationsPage;
