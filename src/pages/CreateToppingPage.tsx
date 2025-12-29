import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Form, Input, Button, InputNumber, Upload, Switch, Space, Row, Col } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Dragger } = Upload;

export const CreateToppingPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values: unknown) => {
    console.log("Form values:", values);
    // Handle form submission
  };

  const handleCancel = () => {
    navigate("/toppings");
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", margin: 0 }}>Create Toppings</h2>
        <Space>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" style={{ background: "#ff4d4f" }} onClick={() => form.submit()}>
            Save
          </Button>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Card
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<span style={{ fontWeight: "600" }}>Topping's info</span>}
            >
              <Form.Item
                label="Topping name"
                name="toppingName"
                rules={[{ required: true, message: "Please enter topping name" }]}
              >
                <Input placeholder="Enter topping name" />
              </Form.Item>
            </Card>

            <Card
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<span style={{ fontWeight: "600" }}>Topping's image</span>}
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

          <Col xs={24} lg={12}>
            <Card
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<span style={{ fontWeight: "600" }}>Topping's price</span>}
            >
              <Form.Item label="Price" name="price">
                <InputNumber prefix="₹" style={{ width: "100%" }} placeholder="300" min={0} />
              </Form.Item>
            </Card>

            <Card
              style={{ borderRadius: "12px" }}
              title={<span style={{ fontWeight: "600" }}>Other properties</span>}
            >
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
