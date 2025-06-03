import React from "react";
import InvoiceManager from "@/components/dashboard/InvoiceManager";

const InvoicesPage = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">
            Create, manage, and track your invoices
          </p>
        </div>
        <InvoiceManager />
      </div>
    </div>
  );
};

export default InvoicesPage;
