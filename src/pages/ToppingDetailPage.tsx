import { DashboardLayout } from "../components/layout/DashboardLayout";
import {
  Card,
  Form,
  Input,
  Button,
  InputNumber,
  Upload,
  Switch,
  Space,
  Row,
  Col,
  Modal,
  message,
} from "antd";
import { InboxOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const { Dragger } = Upload;

export const ToppingDetailPage = () => {
  const navigate = useNavigate();
  const { toppingId } = useParams();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - replace with actual API call
  const toppingData = {
    id: toppingId,
    name: "Cheddar",
    price: 50,
    image: "🧀",
    publish: true,
    available: true,
  };

  const onFinish = (values: unknown) => {
    console.log("Form values:", values);
    message.success("Topping updated successfully!");
    setIsEditing(false);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Topping",
      content: "Are you sure you want to delete this topping? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        console.log("Deleting topping:", toppingId);
        message.success("Topping deleted successfully!");
        navigate("/toppings");
      },
    });
  };

  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false);
      form.resetFields();
    } else {
      navigate("/toppings");
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", margin: 0 }}>
          Topping Details - {toppingData.name}
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
        initialValues={toppingData}
        disabled={!isEditing}
      >
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Card
              bordered={false}
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<span style={{ fontWeight: "600" }}>Topping's info</span>}
            >
              <Form.Item
                label="Topping name"
                name="name"
                rules={[{ required: true, message: "Please enter topping name" }]}
              >
                <Input placeholder="Enter topping name" />
              </Form.Item>

              <Form.Item label="Topping ID" name="id">
                <Input disabled placeholder="Auto-generated" />
              </Form.Item>
            </Card>

            <Card
              bordered={false}
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<span style={{ fontWeight: "600" }}>Topping's image</span>}
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
                  {toppingData.image}
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

          <Col xs={24} lg={12}>
            <Card
              bordered={false}
              style={{ borderRadius: "12px", marginBottom: "16px" }}
              title={<span style={{ fontWeight: "600" }}>Topping's price</span>}
            >
              <Form.Item label="Price" name="price">
                <InputNumber prefix="₹" style={{ width: "100%" }} placeholder="300" min={0} />
              </Form.Item>
            </Card>

            <Card
              bordered={false}
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
                bordered={false}
                style={{ borderRadius: "12px", marginTop: "16px" }}
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
