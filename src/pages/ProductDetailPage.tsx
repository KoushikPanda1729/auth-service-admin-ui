import { DashboardLayout } from "../components/layout/DashboardLayout";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  InputNumber,
  Radio,
  Upload,
  Switch,
  Space,
  Modal,
  message,
} from "antd";
import { InboxOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

export const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - replace with actual API call
  const productData = {
    id: productId,
    productName: "Pepperoni Pizza",
    category: "pizza",
    description: "Juicy chicken fillet and crispy bacon combined with fresh vegetables and cheese",
    priceSmall: 300,
    priceMedium: 500,
    priceLarge: 600,
    spiciness: "medium",
    image: "🍕",
    showAsHit: false,
    publish: true,
    available: true,
  };

  const onFinish = (values: unknown) => {
    console.log("Form values:", values);
    message.success("Product updated successfully!");
    setIsEditing(false);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Product",
      content: "Are you sure you want to delete this product? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        console.log("Deleting product:", productId);
        message.success("Product deleted successfully!");
        navigate("/menu");
      },
    });
  };

  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false);
      form.resetFields();
    } else {
      navigate("/menu");
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", margin: 0 }}>
          Product Details - {productData.productName}
        </h2>
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

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={productData}
        disabled={!isEditing}
      >
        <Row gutter={16}>
          <Col xs={24} lg={16}>
            <Card
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<span style={{ fontWeight: "600" }}>Product Info</span>}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Product name"
                    name="productName"
                    rules={[{ required: true, message: "Please enter product name" }]}
                  >
                    <Input placeholder="Enter product name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Product category"
                    name="category"
                    rules={[{ required: true, message: "Please select category" }]}
                  >
                    <Select placeholder="Select category">
                      <Option value="pizza">Pizza</Option>
                      <Option value="cold-drinks">Cold drinks</Option>
                      <Option value="hot-drinks">Hot drinks</Option>
                      <Option value="dessert">Dessert</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Description" name="description">
                <TextArea
                  rows={4}
                  placeholder="Tell something about the product"
                  style={{ resize: "none" }}
                />
              </Form.Item>

              <Form.Item label="Product ID" name="id">
                <Input disabled placeholder="Auto-generated" />
              </Form.Item>
            </Card>

            <Card
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<span style={{ fontWeight: "600" }}>Product Image</span>}
            >
              <div style={{ marginBottom: "16px", textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "64px",
                    padding: "20px",
                    background: "#f5f5f5",
                    borderRadius: "8px",
                  }}
                >
                  {productData.image}
                </div>
              </div>

              {isEditing && (
                <Form.Item name="image">
                  <Dragger
                    name="file"
                    multiple={false}
                    showUploadList={false}
                    style={{ background: "#fafafa" }}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ fontSize: "48px", color: "#ff4d4f" }} />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">Support only single file</p>
                  </Dragger>
                </Form.Item>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<span style={{ fontWeight: "600" }}>Product price</span>}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Small" name="priceSmall">
                    <InputNumber prefix="₹" style={{ width: "100%" }} placeholder="300" min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Medium" name="priceMedium">
                    <InputNumber prefix="₹" style={{ width: "100%" }} placeholder="500" min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Large" name="priceLarge">
                    <InputNumber prefix="₹" style={{ width: "100%" }} placeholder="600" min={0} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<span style={{ fontWeight: "600" }}>Spiciness</span>}
            >
              <Form.Item name="spiciness">
                <Radio.Group style={{ width: "100%" }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Radio value="less">
                      Less spicy <span style={{ color: "#ff4d4f" }}>🌶</span>
                    </Radio>
                    <Radio value="medium">
                      Medium spicy <span style={{ color: "#ff4d4f" }}>🌶🌶</span>
                    </Radio>
                    <Radio value="not">Not spicy</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Card>

            <Card
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<span style={{ fontWeight: "600" }}>Other properties</span>}
            >
              <div style={{ marginBottom: "16px" }}>
                <Form.Item name="showAsHit" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Show as hit product</span>
                    <Switch />
                  </div>
                </Form.Item>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <Form.Item name="publish" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Publish</span>
                    <Switch />
                  </div>
                </Form.Item>
              </div>

              <div>
                <Form.Item name="available" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Available</span>
                    <Switch />
                  </div>
                </Form.Item>
              </div>
            </Card>

            {!isEditing && (
              <Card
                style={{ borderRadius: "12px" }}
                title={<span style={{ fontWeight: "600" }}>Metadata</span>}
              >
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ color: "#8c8c8c", fontSize: "12px" }}>Created at</div>
                  <div style={{ fontWeight: "500" }}>25 July 2022, 11:30 PM</div>
                </div>
                <div>
                  <div style={{ color: "#8c8c8c", fontSize: "12px" }}>Last updated</div>
                  <div style={{ fontWeight: "500" }}>26 July 2022, 02:15 PM</div>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </Form>
    </DashboardLayout>
  );
};
