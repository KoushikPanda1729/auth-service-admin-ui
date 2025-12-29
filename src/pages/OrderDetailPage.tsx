import { DashboardLayout } from "../components/layout/DashboardLayout";
import {
  Card,
  Row,
  Col,
  Typography,
  Steps,
  List,
  Avatar,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Select,
  Form,
  Input,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CheckOutlined,
  CreditCardOutlined,
  DeleteOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

interface OrderItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  image: string;
}

export const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [orderStatus, setOrderStatus] = useState(2); // Default: Out for delivery

  const orderItems: OrderItem[] = [
    {
      id: "1",
      name: "Pepperoni Pizza",
      description: "Small, Toppings: Mushroom, Chicken, Jalapeno, Cheddar",
      quantity: 2,
      image: "🍕",
    },
    {
      id: "2",
      name: "Margarita",
      description: "Large, Toppings: Mushroom, Chicken, Jalapeno, Cheddar",
      quantity: 3,
      image: "🍕",
    },
    {
      id: "3",
      name: "Margarita",
      description: "Large, Toppings: Mushroom, Chicken, Jalapeno, Cheddar",
      quantity: 3,
      image: "🍕",
    },
    {
      id: "4",
      name: "Margarita",
      description: "Medium, Toppings: Mushroom, Chicken, Jalapeno, Cheddar",
      quantity: 2,
      image: "🍕",
    },
    {
      id: "5",
      name: "Margarita",
      description: "Large, Toppings: Mushroom, Chicken, Jalapeno, Cheddar",
      quantity: 1,
      image: "🍕",
    },
  ];

  const customerDetails = {
    name: "Rakesh Kohali",
    address: "Main street, Bandra, Mumbai 403 515",
    paymentType: "Debit Card",
    orderAmount: 1250,
    comment:
      "Please, make it as spicy as possible. Don't ring the bell, my baby is sleeping. Call me when you reach. 😊",
  };

  const onFinish = (values: unknown) => {
    console.log("Form values:", values);
    message.success("Order updated successfully!");
    setIsEditing(false);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Order",
      content: "Are you sure you want to delete this order? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        console.log("Deleting order:", orderId);
        message.success("Order deleted successfully!");
        navigate("/orders");
      },
    });
  };

  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false);
      form.resetFields();
    } else {
      navigate("/orders");
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
        <Title level={3} style={{ margin: 0 }}>
          Order #{orderId}
        </Title>
        <Space>
          {isEditing ? (
            <>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                style={{ background: "#ff4d4f" }}
                onClick={() => form.submit()}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleCancel}>Back</Button>
              <Button
                type="primary"
                style={{ background: "#1890ff" }}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </Space>
      </div>

      <Card bordered={false} style={{ marginBottom: "16px", borderRadius: "12px" }}>
        {isEditing ? (
          <Form.Item label="Order Status" style={{ marginBottom: 0 }}>
            <Select value={orderStatus} onChange={setOrderStatus} style={{ width: "100%" }}>
              <Option value={0}>Received</Option>
              <Option value={1}>Prepared</Option>
              <Option value={2}>Out for delivery</Option>
              <Option value={3}>Completed</Option>
            </Select>
          </Form.Item>
        ) : (
          <Steps
            current={orderStatus}
            items={[
              {
                title: "Received",
                icon: <CheckCircleOutlined />,
              },
              {
                title: "Prepared",
                icon: <ClockCircleOutlined />,
              },
              {
                title: "Out for delivery",
                icon: <CarOutlined />,
              },
              {
                title: "Completed",
                icon: <CheckOutlined />,
              },
            ]}
          />
        )}
      </Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={customerDetails}
        disabled={!isEditing}
      >
        <Row gutter={16}>
          <Col xs={24} lg={16}>
            <Card
              bordered={false}
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<Text strong>Order Details</Text>}
            >
              <List
                itemLayout="horizontal"
                dataSource={orderItems}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      padding: "16px 0",
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size={64}
                          style={{
                            background: "#fff1f0",
                            fontSize: "32px",
                          }}
                        >
                          {item.image}
                        </Avatar>
                      }
                      title={<Text strong>{item.name}</Text>}
                      description={
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          {item.description}
                        </Text>
                      }
                    />
                    <div>
                      <Tag color="blue">{item.quantity} items</Tag>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<Text strong>Customer Details</Text>}
            >
              {isEditing ? (
                <>
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter customer name" }]}
                  >
                    <Input placeholder="Customer name" />
                  </Form.Item>

                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: "Please enter address" }]}
                  >
                    <Input placeholder="Delivery address" />
                  </Form.Item>

                  <Form.Item
                    label="Payment type"
                    name="paymentType"
                    rules={[{ required: true, message: "Please select payment type" }]}
                  >
                    <Select placeholder="Select payment type">
                      <Option value="Debit Card">Debit Card</Option>
                      <Option value="Credit Card">Credit Card</Option>
                      <Option value="Cash">Cash</Option>
                      <Option value="UPI">UPI</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Order amount"
                    name="orderAmount"
                    rules={[{ required: true, message: "Please enter order amount" }]}
                  >
                    <Input prefix="₹" placeholder="Order amount" type="number" />
                  </Form.Item>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <Text type="secondary" style={{ display: "block", marginBottom: "4px" }}>
                      Name
                    </Text>
                    <Text strong>{customerDetails.name}</Text>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <Text type="secondary" style={{ display: "block", marginBottom: "4px" }}>
                      Address
                    </Text>
                    <Text>{customerDetails.address}</Text>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <Text type="secondary" style={{ display: "block", marginBottom: "4px" }}>
                      Payment type
                    </Text>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <CreditCardOutlined />
                      <Text strong>{customerDetails.paymentType}</Text>
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <Text type="secondary" style={{ display: "block", marginBottom: "4px" }}>
                      Order amount
                    </Text>
                    <Text strong style={{ fontSize: "18px" }}>
                      ₹ {customerDetails.orderAmount}
                    </Text>
                  </div>
                </>
              )}
            </Card>

            <Card
              bordered={false}
              style={{ borderRadius: "12px" }}
              title={<Text strong>Comment</Text>}
            >
              {isEditing ? (
                <Form.Item name="comment" style={{ marginBottom: 0 }}>
                  <Input.TextArea
                    rows={4}
                    placeholder="Customer comments"
                    style={{ resize: "none" }}
                  />
                </Form.Item>
              ) : (
                <Text type="secondary" style={{ fontStyle: "italic" }}>
                  {customerDetails.comment}
                </Text>
              )}
            </Card>
          </Col>
        </Row>
      </Form>
    </DashboardLayout>
  );
};
