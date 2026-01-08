import { Drawer, Form, Input, Button, Upload, Image, Radio, Space, Select } from "antd";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import type { Tenant } from "../../modules/tenants/api/types";
import type { Topping } from "../../modules/toppings/api/types";
import { useEffect, useState } from "react";

interface ToppingDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ToppingFormValues, imageFile?: File) => Promise<void>;
  isAdmin: boolean;
  tenants: Tenant[];
  editingTopping?: Topping | null;
  uploadingImage: boolean;
}

export interface ToppingFormValues {
  name: string;
  image: string;
  price: number;
  isPublished: boolean;
  tenantId?: string;
}

export const ToppingDrawer = ({
  open,
  onClose,
  onSubmit,
  isAdmin,
  tenants,
  editingTopping,
  uploadingImage,
}: ToppingDrawerProps) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Handle image upload
  const handleImageChange = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false; // Prevent auto upload
  };

  // Reset form when editing topping changes
  useEffect(() => {
    if (editingTopping && open) {
      form.setFieldsValue({
        name: editingTopping.name,
        price: editingTopping.price,
        isPublished: editingTopping.isPublished,
      });
      setPreviewImage(editingTopping.image);
    } else if (!editingTopping && open) {
      form.resetFields();
      setImageFile(null);
      setPreviewImage(null);
    }
  }, [editingTopping, open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values, imageFile || undefined);
      form.resetFields();
      setImageFile(null);
      setPreviewImage(null);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setImageFile(null);
    setPreviewImage(null);
    onClose();
  };

  return (
    <Drawer
      title={editingTopping ? "Edit Topping" : "Create Topping"}
      placement="right"
      onClose={handleClose}
      open={open}
      width={600}
      closeIcon={<CloseOutlined />}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={uploadingImage}
            style={{ background: "#ff4d4f" }}
          >
            {editingTopping ? "Update" : "Create"}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        {/* Topping Name */}
        <Form.Item
          label="Topping Name"
          name="name"
          rules={[{ required: true, message: "Please enter topping name" }]}
        >
          <Input placeholder="e.g., Extra Cheese" size="large" />
        </Form.Item>

        {/* Price */}
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <Input type="number" prefix="$" placeholder="50" size="large" />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item label="Topping Image" required>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Upload listType="picture" maxCount={1} beforeUpload={handleImageChange}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
            {previewImage && (
              <Image
                src={previewImage}
                alt="Topping preview"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            )}
          </Space>
        </Form.Item>

        {/* Tenant Selection (Admin Only) */}
        {isAdmin && !editingTopping && (
          <Form.Item
            label="Tenant"
            name="tenantId"
            rules={[{ required: true, message: "Please select a tenant" }]}
          >
            <Select
              placeholder="Select a tenant"
              size="large"
              showSearch
              optionFilterProp="children"
            >
              {tenants.map((tenant) => (
                <Select.Option key={tenant.id} value={tenant.id.toString()}>
                  {tenant.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Published Status */}
        <Form.Item
          label="Publish Status"
          name="isPublished"
          initialValue={true}
          rules={[{ required: true, message: "Please select publish status" }]}
        >
          <Radio.Group>
            <Radio value={true}>Published</Radio>
            <Radio value={false}>Draft</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
