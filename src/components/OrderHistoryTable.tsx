import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { IndianRupee } from 'lucide-react';
interface OrderHistoryTableProps {
  orders: Array<{
    orderId: string;
    purchaseDate: string;
    totalAmount: number;
    status: string;
    items: Array<{
      diamondQuantity: number;
      quantity: number;
      totalPrice: number;
    }>;
  }>;
}

export function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  return (
    <div className="relative border rounded-md border-white/20 h-[60vh]">
      <div className="absolute inset-0 overflow-scroll">
        <div className="inline-block min-w-full align-middle">
          <Table>
            <TableHeader className="sticky top-0 bg-black/80 backdrop-blur-sm z-10">
              <TableRow>
                <TableHead className="min-w-[120px]">Order ID</TableHead>
                <TableHead className="min-w-[120px]">Date</TableHead>
                <TableHead className="min-w-[120px]">Diamonds</TableHead>
                <TableHead className="min-w-[120px]">Amount</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>
                    {new Date(order.purchaseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {order.items.reduce((total, item) => 
                      total + (item.diamondQuantity * item.quantity), 0
                    )}
                  </TableCell>
                  <TableCell><span className="flex gap-1 items-center"><IndianRupee className="h-4 w-4" />{order.totalAmount.toFixed(2)}</span></TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400'
                        : order.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
