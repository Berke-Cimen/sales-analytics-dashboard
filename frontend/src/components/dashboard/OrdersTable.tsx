import { Card, Title, Text, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge } from '@tremor/react';
import type { Order } from '../../types';

interface OrdersTableProps {
  orders?: Order[];
  total?: number;
  page?: number;
  limit?: number;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
}

export default function OrdersTable({
  orders = [],
  total = 0,
  page = 1,
  limit = 50,
  isLoading = false,
  onPageChange,
}: OrdersTableProps) {
  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  const totalPages = Math.ceil(total / limit);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'emerald';
      case 'pending':
        return 'yellow';
      case 'cancelled':
        return 'rose';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-tremor-card rounded-tremor-default">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Title className="text-gray-900 dark:text-white">Recent Orders</Title>
          <Text className="text-gray-500 dark:text-gray-400">
            {total.toLocaleString()} total orders
          </Text>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Order ID</TableHeaderCell>
              <TableHeaderCell>Customer</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Region</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm text-gray-900 dark:text-white">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-400">
                    {order.customerId.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    ${order.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge color={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {order.region}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {order.category}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                    {formatDate(order.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            Page {page} of {totalPages}
          </Text>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
