import { DashboardLayout } from "../components/layout/DashboardLayout";
import {
  Card,
  Row,
  Col,
  Typography,
  Steps,
  List,
  Avatar,
  Select,
  Spin,
  Descriptions,
  Divider,
  Space,
  Button,
  Modal,
  Form,
  InputNumber,
  message,
  Checkbox,
  Tag,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useOrders } from "../modules/orders/hooks/useOrders";
import { paymentsApi } from "../modules/payments/api";
import { RefundDetails } from "../modules/payments/api/types";

const { Title, Text } = Typography;
const { Option } = Select;

export const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { selectedOrder, loading, loadOrderById, handleUpdateStatus } = useOrders();
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [isFullRefund, setIsFullRefund] = useState(true);
  const [refunds, setRefunds] = useState<RefundDetails[]>([]);
  const [loadingRefunds, setLoadingRefunds] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (orderId) {
      loadOrderById(orderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Fetch payment details and refunds when order is loaded
  useEffect(() => {
    const fetchPaymentAndRefunds = async () => {
      if (!selectedOrder) return;

      // Fetch refunds
      setLoadingRefunds(true);
      try {
        const refundsData = await paymentsApi.getRefunds(orderId!);
        setRefunds(refundsData.refunds || []);
      } catch (error) {
        console.error("Failed to fetch refunds:", error);
      } finally {
        setLoadingRefunds(false);
      }

      // Fetch payment details if there's a payment session
      // Note: You'll need to store stripeSessionId in the order or get it from somewhere
      // For now, we'll skip this until we know where to get the session ID from
    };

    if (selectedOrder && orderId) {
      fetchPaymentAndRefunds();
    }
  }, [selectedOrder, orderId]);

  // Calculate total refunded amount
  const totalRefunded = refunds.reduce((sum, refund) => sum + (refund.amount || 0), 0) / 100;
  const isFullyRefunded = selectedOrder && totalRefunded >= selectedOrder.total;

  const handleStatusChange = async (newStatus: string) => {
    if (orderId && newStatus) {
      await handleUpdateStatus(
        orderId,
        newStatus as "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered"
      );
    }
  };

  const handleRefund = async (values: { amount?: number }) => {
    if (!orderId) return;

    setRefundLoading(true);
    try {
      // Call appropriate API based on whether amount is provided
      if (values.amount) {
        // Partial refund
        await paymentsApi.partialRefund(orderId, values.amount);
        message.success(`Partial refund of ₹${values.amount} initiated successfully`);
      } else {
        // Full refund
        await paymentsApi.fullRefund(orderId);
        message.success("Full refund initiated successfully");
      }

      setRefundModalVisible(false);
      form.resetFields();
      // Reload order and refunds to get updated data
      loadOrderById(orderId);
      // Reload refunds
      try {
        const refundsData = await paymentsApi.getRefunds(orderId);
        setRefunds(refundsData.refunds || []);
      } catch (error) {
        console.error("Failed to reload refunds:", error);
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || "Failed to process refund");
    } finally {
      setRefundLoading(false);
    }
  };

  const getStatusStep = (status: string): number => {
    const statusMap: Record<string, number> = {
      pending: 0,
      confirmed: 1,
      preparing: 2,
      out_for_delivery: 3,
      delivered: 4,
    };
    return statusMap[status] || 0;
  };

  if (loading && !selectedOrder) {
    return (
      <DashboardLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (!selectedOrder) {
    return (
      <DashboardLayout>
        <Card>
          <Text>Order not found</Text>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space>
          <ArrowLeftOutlined
            onClick={() => navigate("/orders")}
            style={{ cursor: "pointer", fontSize: "18px" }}
          />
          <Title level={3} style={{ margin: 0 }}>
            Order #{orderId}
          </Title>
        </Space>
        <Button
          type="primary"
          danger
          icon={<DollarOutlined />}
          onClick={() => setRefundModalVisible(true)}
          disabled={selectedOrder?.paymentStatus !== "paid" || !!isFullyRefunded}
          title={
            isFullyRefunded
              ? "Order has been fully refunded"
              : selectedOrder?.paymentStatus !== "paid"
                ? "Payment must be completed to refund"
                : "Refund order"
          }
        >
          Refund
        </Button>
      </div>

      <Card style={{ marginBottom: "16px", borderRadius: "12px" }}>
        <div style={{ marginBottom: "16px" }}>
          <Text strong>Update Order Status:</Text>
        </div>
        <Select
          value={selectedOrder.status}
          onChange={handleStatusChange}
          style={{ width: "100%", maxWidth: "300px" }}
        >
          <Option value="pending">Pending</Option>
          <Option value="confirmed">Confirmed</Option>
          <Option value="preparing">Preparing</Option>
          <Option value="out_for_delivery">Out for Delivery</Option>
          <Option value="delivered">Delivered</Option>
        </Select>

        <Divider />

        <Steps
          current={getStatusStep(selectedOrder.status)}
          items={[
            {
              title: "Pending",
              icon: <CheckCircleOutlined />,
            },
            {
              title: "Confirmed",
              icon: <CheckCircleOutlined />,
            },
            {
              title: "Preparing",
              icon: <ClockCircleOutlined />,
            },
            {
              title: "Out for Delivery",
              icon: <CarOutlined />,
            },
            {
              title: "Delivered",
              icon: <CheckOutlined />,
            },
          ]}
        />
      </Card>

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card
            style={{ borderRadius: "12px", marginBottom: "16px" }}
            title={<Text strong>Order Items</Text>}
          >
            <List
              itemLayout="horizontal"
              dataSource={selectedOrder.items}
              renderItem={(item) => (
                <List.Item
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    padding: "16px 0",
                    display: "block",
                  }}
                >
                  <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                    <Avatar
                      size={80}
                      src={item.image}
                      shape="square"
                      style={{
                        background: "#f0f0f0",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <Text
                        strong
                        style={{ fontSize: "16px", display: "block", marginBottom: "4px" }}
                      >
                        {item.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "13px", display: "block" }}>
                        Size: {Object.values(item.priceConfiguration).join(", ")}
                      </Text>
                      <Text strong style={{ fontSize: "14px", display: "block", marginTop: "8px" }}>
                        Qty: {item.qty} × ₹{item.totalPrice} = ₹{item.qty * item.totalPrice}
                      </Text>
                    </div>
                  </div>

                  {item.toppings && item.toppings.length > 0 && (
                    <div style={{ marginTop: "12px", paddingLeft: "96px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "8px", fontSize: "13px" }}
                      >
                        Toppings:
                      </Text>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                        {item.toppings.map((topping) => (
                          <div
                            key={topping._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "6px 12px",
                              background: "#f5f5f5",
                              borderRadius: "8px",
                              border: "1px solid #e8e8e8",
                            }}
                          >
                            <Avatar size={32} src={topping.image} shape="square" />
                            <div>
                              <Text style={{ fontSize: "12px", display: "block" }}>
                                {topping.name}
                              </Text>
                              <Text strong style={{ fontSize: "12px", color: "#ff4d4f" }}>
                                +₹{topping.price}
                              </Text>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            style={{ borderRadius: "12px", marginBottom: "16px" }}
            title={<Text strong>Order Summary</Text>}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Subtotal">₹{selectedOrder.subTotal}</Descriptions.Item>
              {selectedOrder.couponCode && (
                <Descriptions.Item label="Coupon">
                  {selectedOrder.couponCode} (-₹{selectedOrder.discount})
                </Descriptions.Item>
              )}
              {!selectedOrder.couponCode && selectedOrder.discount > 0 && (
                <Descriptions.Item label="Discount">-₹{selectedOrder.discount}</Descriptions.Item>
              )}
              <Descriptions.Item label="Delivery Charge">
                ₹{selectedOrder.deliveryCharge}
              </Descriptions.Item>
              {selectedOrder.taxes.map((tax, idx) => (
                <Descriptions.Item key={idx} label={`${tax.name} (${tax.rate}%)`}>
                  ₹{tax.amount.toFixed(2)}
                </Descriptions.Item>
              ))}
              <Descriptions.Item label="Tax Total">
                ₹{selectedOrder.taxTotal.toFixed(2)}
              </Descriptions.Item>
            </Descriptions>
            <Divider style={{ margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text strong style={{ fontSize: "16px" }}>
                Total:
              </Text>
              <Text strong style={{ fontSize: "18px", color: "#ff4d4f" }}>
                ₹{selectedOrder.total.toFixed(2)}
              </Text>
            </div>
          </Card>

          <Card
            style={{ borderRadius: "12px", marginBottom: "16px" }}
            title={<Text strong>Customer Details</Text>}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Customer ID">{selectedOrder.customerId}</Descriptions.Item>
              <Descriptions.Item label="Address">{selectedOrder.address}</Descriptions.Item>
              <Descriptions.Item label="Payment Mode">
                {selectedOrder.paymentMode.charAt(0).toUpperCase() +
                  selectedOrder.paymentMode.slice(1)}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                {selectedOrder.paymentStatus.charAt(0).toUpperCase() +
                  selectedOrder.paymentStatus.slice(1)}
              </Descriptions.Item>
              <Descriptions.Item label="Tenant ID">{selectedOrder.tenantId}</Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Refund History */}
          {refunds.length > 0 && (
            <Card
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<Text strong>Refund History</Text>}
              loading={loadingRefunds}
            >
              <List
                dataSource={refunds}
                renderItem={(refund: RefundDetails) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>Refund ID: {refund.id}</Text>
                          <Tag color={refund.status === "succeeded" ? "success" : "processing"}>
                            {refund.status?.toUpperCase() || "PENDING"}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text>Amount: ₹{((refund.amount || 0) / 100).toFixed(2)}</Text>
                          <Text type="secondary">Payment ID: {refund.paymentId}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Col>
      </Row>

      {/* Refund Modal */}
      <Modal
        title="Refund Order"
        open={refundModalVisible}
        onCancel={() => {
          setRefundModalVisible(false);
          setIsFullRefund(true);
          form.resetFields();
        }}
        footer={null}
      >
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
                  form.setFieldsValue({ amount: undefined });
                }
              }}
            >
              <Text strong>Full Refund</Text>
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
                  max: selectedOrder?.total || 0,
                  message: `Amount must be between ₹1 and ₹${selectedOrder?.total || 0}`,
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter refund amount"
                prefix="₹"
                min={1}
                max={selectedOrder?.total || 0}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setRefundModalVisible(false);
                  setIsFullRefund(true);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" danger htmlType="submit" loading={refundLoading}>
                Process {isFullRefund ? "Full" : "Partial"} Refund
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};
