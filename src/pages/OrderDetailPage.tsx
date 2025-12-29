import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Row, Col, Typography, Steps, List, Avatar, Tag } from "antd";
import { useParams } from "react-router-dom";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CheckOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface OrderItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  image: string;
}

export const OrderDetailPage = () => {
  const { orderId } = useParams();

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

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "16px" }}>
        <Title level={3} style={{ margin: 0 }}>
          Order #{orderId}
        </Title>
      </div>

      <Card bordered={false} style={{ marginBottom: "16px", borderRadius: "12px" }}>
        <Steps
          current={2}
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
      </Card>

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
          </Card>

          <Card
            bordered={false}
            style={{ borderRadius: "12px" }}
            title={<Text strong>Comment</Text>}
          >
            <Text type="secondary" style={{ fontStyle: "italic" }}>
              {customerDetails.comment}
            </Text>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};
