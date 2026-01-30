"use client"

import { Header } from "./Header"
import { Footer } from "./Footer"
import {
  CreditCard,
  FileText,
  BarChart3,
  AlertTriangle,
  Settings,
  HelpCircle,
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0054A6] to-[#003d7a] text-white py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-1">
              Welcome back, John Doe
            </h2>
            <p className="text-blue-200">
              Customer ID: MNGL-2024-78542 | Last Login: Jan 28, 2025, 10:30 AM
            </p>
          </div>
        </div>

        {/* Account Summary */}
        <div className="container mx-auto px-4 -mt-4">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-500 text-sm">Current Bill Amount</p>
                <p className="text-3xl font-bold text-[#0054A6]">₹2,450</p>
                <p className="text-xs text-gray-400">
                  Due Date: Feb 15, 2025
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Last Payment</p>
                <p className="text-3xl font-bold text-green-600">₹2,180</p>
                <p className="text-xs text-gray-400">
                  Paid on: Jan 10, 2025
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">This Month Usage</p>
                <p className="text-3xl font-bold text-gray-800">45 SCM</p>
                <p className="text-xs text-gray-400">
                  Avg: 42 SCM/month
                </p>
              </div>

              <div className="flex items-center justify-end">
                <button className="bg-[#0054A6] hover:bg-[#003d7a] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Pay Bill Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="container mx-auto px-4 py-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: CreditCard, label: "Pay Bill", bg: "blue" },
              { icon: FileText, label: "View Bills", bg: "green" },
              { icon: BarChart3, label: "Usage History", bg: "purple" },
              { icon: AlertTriangle, label: "Complaints", bg: "red" },
              { icon: Settings, label: "Settings", bg: "orange" },
              { icon: HelpCircle, label: "Help & Support", bg: "teal" },
            ].map(({ icon: Icon, label }, i) => (
              <a
                key={i}
                href="#"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-6 w-6 text-[#0054A6]" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {label}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="container mx-auto px-4 py-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Recent Activity
          </h3>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm text-gray-600">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm text-gray-600">
                    Activity
                  </th>
                  <th className="py-3 px-4 text-left text-sm text-gray-600">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left text-sm text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 px-4">Jan 10, 2025</td>
                  <td className="py-3 px-4">
                    Bill Payment - December 2024
                  </td>
                  <td className="py-3 px-4">₹2,180</td>
                  <td className="py-3 px-4">
                    <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs">
                      Paid
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
