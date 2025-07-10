"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ReportChart({ data }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow w-[98%]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) =>
              typeof value === "number"
                ? new Intl.NumberFormat("id-ID").format(value)
                : value
            }
          />
          <Legend />
          <Bar dataKey="total_orders" fill="#8884d8" name="Jumlah Pesanan" />
          <Bar dataKey="total_pcs" fill="#82ca9d" name="Total Pcs" />
          <Bar dataKey="total_revenue" fill="#ffc658" name="Pendapatan" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

