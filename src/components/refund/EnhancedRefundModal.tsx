import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  InputNumber,
  Button,
  Space,
  Checkbox,
  Divider,
  Alert,
  Descriptions,
  Tag,
  message,
} from "antd";
import { WalletOutlined, CreditCardOutlined, WarningOutlined } from "@ant-design/icons";
import { refundApi } from "../../modules/wallet/api";
import type { RefundSplit } from "../../modules/wallet/types";

interface Order {
  _id: string;
  total: number;
  walletCreditsApplied?: number;
  finalTotal?: number;
  refundDetails?: {
    totalRefunded: number;
    walletRefunded: number;
    gatewayRefunded: number;
  };
}

interface EnhancedRefundModalProps {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EnhancedRefundModal = ({
  visible,
  order,
  onClose,
  onSuccess,
}: EnhancedRefundModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isFullRefund, setIsFullRefund] = useState(true);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundPreview, setRefundPreview] = useState<{
    walletRefund: number;
    gatewayRefund: number;
  } | null>(null);

  const walletUsed = order?.walletCreditsApplied || 0;
  const gatewayPaid = order?.finalTotal || order?.total || 0;
  const totalOrderAmount = order?.total || 0;
  const totalRefunded = order?.refundDetails?.totalRefunded || 0;
  const remainingRefundable = totalOrderAmount - totalRefunded;

  // Calculate refund split preview
  useEffect(() => {
    if (!order || refundAmount === 0) {
      setRefundPreview(null);
      return;
    }

    const amountToRefund = isFullRefund ? remainingRefundable : refundAmount;

    // Special case: 100% wallet payment
    if (gatewayPaid === 0) {
      setRefundPreview({
        walletRefund: amountToRefund,
        gatewayRefund: 0,
      });
      return;
    }

    // Proportional split
    if (walletUsed > 0) {
      const walletProportion = walletUsed / totalOrderAmount;
      const gatewayProportion = gatewayPaid / totalOrderAmount;

      const walletRefund = Math.round(amountToRefund * walletProportion * 100) / 100;
      let gatewayRefund = Math.round(amountToRefund * gatewayProportion * 100) / 100;

      // Handle rounding difference
      const totalCalculated = walletRefund + gatewayRefund;
      if (totalCalculated !== amountToRefund) {
        gatewayRefund = amountToRefund - walletRefund;
      }

      setRefundPreview({
        walletRefund,
        gatewayRefund,
      });
    } else {
      // No wallet used, full gateway refund
      setRefundPreview({
        walletRefund: 0,
        gatewayRefund: amountToRefund,
      });
    }
  }, [
    refundAmount,
    isFullRefund,
    order,
    walletUsed,
    gatewayPaid,
    totalOrderAmount,
    remainingRefundable,
  ]);

  const handleRefund = async () => {
    if (!order) return;

    try {
      setLoading(true);
      const idempotencyKey = `refund_${order._id}_${Date.now()}`;

      const result: RefundSplit = await refundApi.processRefund(
        order._id,
        isFullRefund ? undefined : refundAmount,
        idempotencyKey
      );

      message.success(
        `Refund successful! ₹${result.walletRefund.toFixed(2)} to wallet, ₹${result.gatewayRefund.toFixed(2)} to payment gateway`
      );

      onSuccess();
      onClose();
      form.resetFields();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || "Failed to process refund");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setIsFullRefund(true);
    setRefundAmount(0);
    form.resetFields();
  };

  if (!order) return null;

  return (
    <Modal title="Process Refund" open={visible} onCancel={handleCancel} width={600} footer={null}>
      <div className="space-y-4">
        {/* Payment Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Payment Breakdown</h4>
          <Descriptions column={1} size="small">
            <Descriptions.Item
              label={
                <>
                  <WalletOutlined /> Wallet Credits Used
                </>
              }
            >
              <Tag color="green">₹{walletUsed.toFixed(2)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <CreditCardOutlined /> Payment Gateway
                </>
              }
            >
              <Tag color="blue">₹{gatewayPaid.toFixed(2)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Order Total">
              <Tag>₹{totalOrderAmount.toFixed(2)}</Tag>
            </Descriptions.Item>
          </Descriptions>

          {totalRefunded > 0 && (
            <>
              <Divider style={{ margin: "12px 0" }} />
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Total Refunded">
                  <Tag color="orange">₹{totalRefunded.toFixed(2)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Wallet Refunded">
                  ₹{(order.refundDetails?.walletRefunded || 0).toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Gateway Refunded">
                  ₹{(order.refundDetails?.gatewayRefunded || 0).toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Remaining Refundable">
                  <Tag color="purple">₹{remainingRefundable.toFixed(2)}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </>
          )}
        </div>

        {/* Refund Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRefund}
          initialValues={{ isFullRefund: true }}
        >
          <Form.Item>
            <Checkbox
              checked={isFullRefund}
              onChange={(e) => {
                setIsFullRefund(e.target.checked);
                if (e.target.checked) {
                  setRefundAmount(remainingRefundable);
                  form.setFieldsValue({ amount: undefined });
                } else {
                  setRefundAmount(0);
                }
              }}
            >
              <span className="font-semibold">Full Refund</span>
            </Checkbox>
          </Form.Item>

          {!isFullRefund && (
            <Form.Item
              label="Partial Refund Amount"
              name="amount"
              rules={[
                {
                  required: !isFullRefund,
                  message: "Please enter refund amount",
                },
                {
                  type: "number",
                  min: 1,
                  max: remainingRefundable,
                  message: `Amount must be between ₹1 and ₹${remainingRefundable.toFixed(2)}`,
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter refund amount"
                prefix="₹"
                min={1}
                max={remainingRefundable}
                onChange={(value) => setRefundAmount(value || 0)}
              />
            </Form.Item>
          )}

          {/* Refund Split Preview */}
          {refundPreview && (refundAmount > 0 || isFullRefund) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <WarningOutlined className="text-blue-600" />
                Refund Split Preview
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <WalletOutlined className="text-green-600" />
                    Wallet Refund:
                  </span>
                  <span className="font-semibold text-green-600">
                    ₹{refundPreview.walletRefund.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <CreditCardOutlined className="text-blue-600" />
                    Gateway Refund:
                  </span>
                  <span className="font-semibold text-blue-600">
                    ₹{refundPreview.gatewayRefund.toFixed(2)}
                  </span>
                </div>
                <Divider style={{ margin: "8px 0" }} />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Refund:</span>
                  <span className="font-bold text-lg">
                    ₹{(refundPreview.walletRefund + refundPreview.gatewayRefund).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Over-refund Warning */}
          {refundAmount > remainingRefundable && (
            <Alert
              message="Invalid Refund Amount"
              description={`Cannot refund more than remaining amount: ₹${remainingRefundable.toFixed(2)}`}
              type="error"
              showIcon
            />
          )}

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                danger
                htmlType="submit"
                loading={loading}
                disabled={!isFullRefund && refundAmount === 0}
              >
                Process {isFullRefund ? "Full" : "Partial"} Refund
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
