import {
  Table,
  TableBody,
 
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

export function OrderHistoryTable() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
      case 'pending':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
      case 'unpaid':
        return 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
      default:
        return 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20'
    }
  }

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-zinc-900 text-white overflow-hidden">
      <div className="p-2 md:p-6">
        <div className="max-h-[400px] overflow-y-auto rounded-lg">
          <Table className="w-full min-w-[600px] text-black">
            <TableHeader className="sticky top-0 bg-white z-10 rounded-t-lg">
              <TableRow className="border-b-0 [&>th:first-child]:rounded-tl-lg [&>th:last-child]:rounded-tr-lg">
                <TableHead className="w-[100px] py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider text-black">
                  Order ID
                </TableHead>
                <TableHead className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider text-black">
                  Status
                </TableHead>
                <TableHead className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider text-black">
                  Payment Method
                </TableHead>
                <TableHead className="py-4 px-6 text-right text-xs font-semibold uppercase tracking-wider text-black">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice, index) => (
                <TableRow 
                  key={invoice.invoice}
                  className={`border-b border-gray-100 hover:bg-zinc-100 transition-colors group
                    ${index === invoices.length - 1 ? '[&>td:first-child]:rounded-bl-lg [&>td:last-child]:rounded-br-lg' : ''}`}
                >
                  <TableCell className="py-4 px-6 text-sm font-medium text-white group-hover:text-black transition-colors">
                    #{invoice.invoice}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span 
                      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.paymentStatus)}`}
                    >
                      {invoice.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-sm text-white group-hover:text-black transition-colors">
                    {invoice.paymentMethod}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right text-sm font-semibold text-white group-hover:text-black transition-colors">
                    {invoice.totalAmount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
