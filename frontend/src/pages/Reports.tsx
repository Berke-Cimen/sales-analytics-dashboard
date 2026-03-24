import { useState } from 'react';
import { Card, Title, Text, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Select, SelectItem, TextInput } from '@tremor/react';
import { useOrders } from '../services/api';
import type { Order } from '../types';

export default function Reports() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useOrders(page, limit);

  const filteredOrders = data?.orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (regionFilter && order.region !== regionFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.customerId.toLowerCase().includes(query) ||
        order.category.toLowerCase().includes(query)
      );
    }
    return true;
  }) ?? [];

  const regions = [...new Set(data?.orders.map((o) => o.region) ?? [])];

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
    });
  };

  const totalPages = Math.ceil((data?.total ?? 0) / limit);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.amount, 0);
  const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <Title className="text-2xl text-gray-900 dark:text-white">Reports</Title>
          <Text className="text-gray-500 dark:text-gray-400">
            Order and customer reports
          </Text>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-800 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Search</label>
            <TextInput
              placeholder="Search orders..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Region</label>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectItem value="">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Per Page</label>
            <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800">
          <Text className="text-gray-500 dark:text-gray-400">Total Orders</Text>
          <Title className="text-2xl text-gray-900 dark:text-white">{filteredOrders.length}</Title>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <Text className="text-gray-500 dark:text-gray-400">Total Revenue</Text>
          <Title className="text-2xl text-gray-900 dark:text-white">${totalRevenue.toLocaleString()}</Title>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <Text className="text-gray-500 dark:text-gray-400">Avg Order Value</Text>
          <Title className="text-2xl text-gray-900 dark:text-white">${avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Title>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="bg-white dark:bg-gray-800 shadow-tremor-card rounded-tremor-default">
        {error ? (
          <div className="text-center py-8 text-rose-500">
            Failed to load orders. Please try again.
          </div>
        ) : isLoading ? (
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Order ID</TableHeaderCell>
                    <TableHeaderCell>Customer ID</TableHeaderCell>
                    <TableHeaderCell>Amount</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Region</TableHeaderCell>
                    <TableHeaderCell>Category</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm text-gray-900 dark:text-white">
                          {order.id}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-400">
                          {order.customerId}
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
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data?.total ?? 0)} of {data?.total ?? 0} results
                </Text>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
