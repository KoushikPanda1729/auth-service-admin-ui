import { useState, useEffect } from "react";
import { Card, Descriptions, List, Tag, Spin, Empty, Divider } from "antd";
import { WalletOutlined, GiftOutlined, MinusCircleOutlined, UndoOutlined } from "@ant-design/icons";
import { walletApi } from "../../modules/wallet/api";
import type { Wallet, WalletTransaction } from "../../modules/wallet/types";
import dayjs from "dayjs";

interface CustomerWalletProps {
  customerId: string;
}

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "cashback":
      return <GiftOutlined className="text-green-500" />;
    case "redemption":
      return <MinusCircleOutlined className="text-orange-500" />;
    case "refund":
      return <UndoOutlined className="text-blue-500" />;
    default:
      return null;
  }
};

export const CustomerWallet = ({ customerId }: CustomerWalletProps) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const walletData = await walletApi.getCustomerBalance(customerId);
        setWallet(walletData);

        setTransactionsLoading(true);
        const transData = await walletApi.getCustomerTransactions(customerId, 1, 10);
        setTransactions(transData.transactions);
      } catch (error) {
        console.error("Failed to fetch wallet data:", error);
      } finally {
        setLoading(false);
        setTransactionsLoading(false);
      }
    };

    if (customerId) {
      fetchWalletData();
    }
  }, [customerId]);

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card>
        <Empty description="No wallet found for this customer" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" bordered>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WalletOutlined className="text-3xl text-green-600" />
            <div>
              <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
              <p className="text-3xl font-bold text-green-700">
                {wallet.currency === "INR" ? "₹" : wallet.currency} {wallet.balance.toFixed(2)}
              </p>
            </div>
          </div>
          <Tag color={wallet.status === "active" ? "success" : "error"}>
            {wallet.status.toUpperCase()}
          </Tag>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <Descriptions column={2} size="small">
          <Descriptions.Item label="Customer ID">{wallet.userId}</Descriptions.Item>
          <Descriptions.Item label="Currency">{wallet.currency}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Recent Transactions */}
      <Card
        title={
          <span className="flex items-center gap-2">
            <WalletOutlined /> Recent Transactions
          </span>
        }
      >
        {transactionsLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : transactions.length === 0 ? (
          <Empty description="No transactions yet" />
        ) : (
          <List
            dataSource={transactions}
            renderItem={(transaction) => (
              <List.Item>
                <List.Item.Meta
                  avatar={getTransactionIcon(transaction.type)}
                  title={
                    <div className="flex items-center gap-2">
                      <Tag
                        color={
                          transaction.type === "cashback"
                            ? "success"
                            : transaction.type === "redemption"
                              ? "warning"
                              : "processing"
                        }
                      >
                        {transaction.type.toUpperCase()}
                      </Tag>
                      <span className="text-sm text-gray-600">Order: {transaction.orderId}</span>
                    </div>
                  }
                  description={
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">
                        {dayjs(transaction.createdAt).format("MMM DD, YYYY • hh:mm A")}
                      </p>
                      <p className="text-xs text-gray-600">
                        Balance: ₹{transaction.balanceBefore.toFixed(2)} → ₹
                        {transaction.balanceAfter.toFixed(2)}
                      </p>
                      <Tag
                        color={
                          transaction.status === "completed"
                            ? "success"
                            : transaction.status === "failed"
                              ? "error"
                              : "default"
                        }
                      >
                        {transaction.status}
                      </Tag>
                    </div>
                  }
                />
                <div className="text-right">
                  <p
                    className={`text-lg font-semibold ${
                      transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.amount >= 0 ? "+" : ""}₹{Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};
