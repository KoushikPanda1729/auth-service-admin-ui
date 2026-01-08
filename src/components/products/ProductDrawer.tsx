import { Drawer, Form, Input, Button, Select, Upload, Image, Radio, Card, Space } from "antd";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import type { Tenant } from "../../modules/tenants/api/types";
import type { Category } from "../../modules/categories/api/types";
import type { Product, CategoryReference } from "../../modules/products/api/types";
import { useEffect, useState } from "react";

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues, imageFile?: File) => Promise<void>;
  isAdmin: boolean;
  tenants: Tenant[];
  categories: Category[];
  editingProduct?: Product | null;
  uploadingImage: boolean;
}

export interface ProductFormValues {
  name: string;
  description: string;
  image: string;
  category: string;
  priceConfiguration: {
    [key: string]: {
      [option: string]: number;
    };
  };
  attributes: {
    name: string;
    value: string;
  }[];
  isPublished: boolean;
  tenantId?: string;
}

export const ProductDrawer = ({
  open,
  onClose,
  onSubmit,
  isAdmin,
  tenants,
  categories,
  editingProduct,
  uploadingImage,
}: ProductDrawerProps) => {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState<Category | CategoryReference | null>(
    null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId);
    setSelectedCategory(category || null);
  };

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

  // Reset form when editing product changes
  useEffect(() => {
    if (editingProduct && open) {
      // Transform price configuration for form
      const priceConfigForForm: { [key: string]: { [option: string]: number } } = {};
      if (editingProduct.priceConfiguration) {
        Object.entries(editingProduct.priceConfiguration).forEach(([key, config]) => {
          priceConfigForForm[key] = config.availableOptions;
        });
      }

      // Transform attributes for form
      const attributesForForm =
        editingProduct.attributes?.map((attr) => ({
          name: attr.name,
          value: attr.value,
        })) || [];

      form.setFieldsValue({
        name: editingProduct.name,
        description: editingProduct.description,
        category: editingProduct.category?._id || "",
        priceConfiguration: priceConfigForForm,
        attributes: attributesForForm,
        isPublished: editingProduct.isPublished,
      });

      if (editingProduct.category) {
        setSelectedCategory(editingProduct.category);
      }
      setPreviewImage(editingProduct.image);
    } else if (!editingProduct && open) {
      form.resetFields();
      setSelectedCategory(null);
      setImageFile(null);
      setPreviewImage(null);
    }
  }, [editingProduct, open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values, imageFile || undefined);
      form.resetFields();
      setImageFile(null);
      setPreviewImage(null);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setImageFile(null);
    setPreviewImage(null);
    setSelectedCategory(null);
    onClose();
  };

  return (
    <Drawer
      title={editingProduct ? "Edit Product" : "Create Product"}
      placement="right"
      onClose={handleClose}
      open={open}
      width={700}
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
            {editingProduct ? "Update" : "Create"}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        {/* Product Name */}
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input placeholder="e.g., Margherita Pizza" size="large" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea placeholder="Enter product description" rows={3} />
        </Form.Item>

        {/* Category Selection */}
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            placeholder="Select a category"
            size="large"
            showSearch
            optionFilterProp="children"
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Image Upload */}
        <Form.Item label="Product Image" required>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Upload listType="picture" maxCount={1} beforeUpload={handleImageChange}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
            {previewImage && (
              <Image
                src={previewImage}
                alt="Product preview"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            )}
          </Space>
        </Form.Item>

        {/* Tenant Selection (Admin Only) */}
        {isAdmin && !editingProduct && (
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

        {/* Price Configuration - Dynamic based on category */}
        {selectedCategory && (
          <Card size="small" style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
              Price Configuration
            </h3>
            {Object.entries(selectedCategory.priceCofigration).map(([key, config]) => (
              <Card key={key} type="inner" size="small" style={{ marginBottom: "12px" }}>
                <h4 style={{ marginBottom: "12px", textTransform: "capitalize" }}>{key}</h4>
                {config.availableOptions.map((option) => (
                  <Form.Item
                    key={`${key}-${option}`}
                    label={`${option} (Price)`}
                    name={["priceConfiguration", key, option]}
                    rules={[{ required: true, message: `Please enter price for ${option}` }]}
                  >
                    <Input type="number" prefix="$" placeholder="10" />
                  </Form.Item>
                ))}
              </Card>
            ))}
          </Card>
        )}

        {/* Attributes - Dynamic based on category */}
        {selectedCategory && selectedCategory.attributes.length > 0 && (
          <Card size="small" style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
              Attributes
            </h3>
            {selectedCategory.attributes.map((attr, index) => (
              <Form.Item
                key={attr._id}
                label={attr.name}
                name={["attributes", index, "value"]}
                rules={[{ required: true, message: `Please select ${attr.name}` }]}
              >
                <Radio.Group>
                  {attr.availableOptions.map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            ))}
            {/* Hidden field for attribute names */}
            {selectedCategory.attributes.map((attr, index) => (
              <Form.Item
                key={`name-${attr._id}`}
                name={["attributes", index, "name"]}
                initialValue={attr.name}
                hidden
              >
                <Input />
              </Form.Item>
            ))}
          </Card>
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
