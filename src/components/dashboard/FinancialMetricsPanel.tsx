import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  DollarSignIcon,
  AlertCircleIcon,
  BarChart3Icon,
} from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const MetricCard = (
  { title, value, change, isPositive, icon }: MetricCardProps = {
    title: "Revenue",
    value: "$24,780",
    change: "+12.5%",
    isPositive: true,
    icon: <DollarSignIcon className="h-4 w-4" />,
  },
) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <div className="flex items-center mt-1">
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {change} from last period
              </span>
            </div>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ChartProps {
  timeframe: string;
}

const RevenueChart = ({ timeframe = "monthly" }: ChartProps) => {
  // This is a placeholder for an actual chart component
  return (
    <div className="h-64 bg-white rounded-md border p-4 flex items-center justify-center">
      <div className="text-center">
        <BarChart3Icon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">
          Revenue chart for {timeframe} view would render here
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Integrate with a chart library like Recharts or Chart.js
        </p>
      </div>
    </div>
  );
};

interface InsightProps {
  title: string;
  description: string;
  type: "info" | "warning" | "success";
}

const AIInsight = (
  { title, description, type }: InsightProps = {
    title: "Cash Flow Alert",
    description:
      "Your expenses have increased by 15% this month. Consider reviewing your subscription services.",
    type: "warning",
  },
) => {
  const bgColor = {
    info: "bg-blue-50 border-blue-200",
    warning: "bg-amber-50 border-amber-200",
    success: "bg-green-50 border-green-200",
  };

  const textColor = {
    info: "text-blue-700",
    warning: "text-amber-700",
    success: "text-green-700",
  };

  const iconColor = {
    info: "text-blue-500",
    warning: "text-amber-500",
    success: "text-green-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-md border ${bgColor[type]} mb-3`}
    >
      <div className="flex items-start">
        <div className={`p-1 rounded-full ${iconColor[type]} mr-3 mt-0.5`}>
          <AlertCircleIcon className="h-4 w-4" />
        </div>
        <div>
          <h4 className={`font-medium ${textColor[type]}`}>{title}</h4>
          <p className="text-sm mt-1">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

interface FinancialMetricsPanelProps {
  metrics?: {
    revenue: { value: string; change: string; isPositive: boolean };
    expenses: { value: string; change: string; isPositive: boolean };
    cashFlow: { value: string; change: string; isPositive: boolean };
    profit: { value: string; change: string; isPositive: boolean };
  };
  insights?: InsightProps[];
}

const FinancialMetricsPanel = ({
  metrics = {
    revenue: { value: "$24,780", change: "+12.5%", isPositive: true },
    expenses: { value: "$12,450", change: "+8.2%", isPositive: false },
    cashFlow: { value: "$12,330", change: "+4.3%", isPositive: true },
    profit: { value: "$8,540", change: "+15.3%", isPositive: true },
  },
  insights = [
    {
      title: "Cash Flow Alert",
      description:
        "Your expenses have increased by 15% this month. Consider reviewing your subscription services.",
      type: "warning" as const,
    },
    {
      title: "Revenue Opportunity",
      description:
        "Based on your client history, it's a good time to follow up with Client XYZ for potential new projects.",
      type: "success" as const,
    },
    {
      title: "Tax Reminder",
      description:
        "Quarterly tax payment deadline approaching in 15 days. Ensure your financial records are up to date.",
      type: "info" as const,
    },
  ],
}: FinancialMetricsPanelProps) => {
  return (
    <div className="w-full bg-background">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Financial Overview
        </h2>
        <p className="text-muted-foreground">
          Track your key financial metrics and insights
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Revenue"
          value={metrics.revenue.value}
          change={metrics.revenue.change}
          isPositive={metrics.revenue.isPositive}
          icon={<DollarSignIcon className="h-4 w-4" />}
        />
        <MetricCard
          title="Expenses"
          value={metrics.expenses.value}
          change={metrics.expenses.change}
          isPositive={metrics.expenses.isPositive}
          icon={<ArrowDownIcon className="h-4 w-4" />}
        />
        <MetricCard
          title="Cash Flow"
          value={metrics.cashFlow.value}
          change={metrics.cashFlow.change}
          isPositive={metrics.cashFlow.isPositive}
          icon={<TrendingUpIcon className="h-4 w-4" />}
        />
        <MetricCard
          title="Profit"
          value={metrics.profit.value}
          change={metrics.profit.change}
          isPositive={metrics.profit.isPositive}
          icon={<DollarSignIcon className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="monthly">
                <TabsList className="mb-4">
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
                <TabsContent value="weekly">
                  <RevenueChart timeframe="weekly" />
                </TabsContent>
                <TabsContent value="monthly">
                  <RevenueChart timeframe="monthly" />
                </TabsContent>
                <TabsContent value="quarterly">
                  <RevenueChart timeframe="quarterly" />
                </TabsContent>
                <TabsContent value="yearly">
                  <RevenueChart timeframe="yearly" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <AIInsight
                    key={index}
                    title={insight.title}
                    description={insight.description}
                    type={insight.type}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialMetricsPanel;
