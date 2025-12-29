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
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values: unknown) => {
    console.log("Form values:", values);
    // Handle form submission
  };

  const handleCancel = () => {
    navigate("/menu");
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", margin: 0 }}>Create Product</h2>
        <Space>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" style={{ background: "#ff4d4f" }} onClick={() => form.submit()}>
            Save
          </Button>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
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
            </Card>

            <Card
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<span style={{ fontWeight: "600" }}>Product Image</span>}
            >
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
              <Form.Item name="spiciness" initialValue="medium">
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
              style={{ borderRadius: "12px" }}
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
                    <Switch defaultChecked />
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
                    <Switch defaultChecked />
                  </div>
                </Form.Item>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </DashboardLayout>
  );
};
