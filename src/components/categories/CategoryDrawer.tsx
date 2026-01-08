import { Drawer, Form, Input, Button, Select, Divider, Card, Radio } from "antd";
import { PlusOutlined, MinusCircleOutlined, CloseOutlined } from "@ant-design/icons";
import type { Tenant } from "../../modules/tenants/api/types";
import type { Category } from "../../modules/categories/api/types";
import { useEffect } from "react";

interface CategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  isAdmin: boolean;
  tenants: Tenant[];
  editingCategory?: Category | null;
}

export interface CategoryFormValues {
  name: string;
  tenantId?: string;
  priceConfigurations: {
    name: string;
    priceType: "base" | "additional";
    availableOptions: string[];
  }[];
  attributes: {
    name: string;
    widgetType: "radio" | "switch";
    defaultValue: string;
    availableOptions: string[];
  }[];
}

export const CategoryDrawer = ({
  open,
  onClose,
  onSubmit,
  isAdmin,
  tenants,
  editingCategory,
}: CategoryDrawerProps) => {
  const [form] = Form.useForm();

  // Transform category data for form when editing
  useEffect(() => {
    if (editingCategory && open) {
      // Transform priceCofigration object to priceConfigurations array
      const priceConfigurations = Object.entries(editingCategory.priceCofigration).map(
        ([name, config]) => ({
          name,
          priceType: config.priceType,
          availableOptions: config.availableOptions,
        })
      );

      // Transform attributes (convert wigetType to widgetType)
      const attributes = editingCategory.attributes.map((attr) => ({
        name: attr.name,
        widgetType: attr.wigetType,
        defaultValue: attr.defaultValue,
        availableOptions: attr.availableOptions,
      }));

      form.setFieldsValue({
        name: editingCategory.name,
        tenantId: editingCategory.tenantId,
        priceConfigurations,
        attributes,
      });
    } else if (!editingCategory && open) {
      // Reset to default values for create mode
      form.setFieldsValue({
        name: undefined,
        tenantId: undefined,
        priceConfigurations: [
          {
            name: "size",
            priceType: "base",
            availableOptions: ["small", "medium", "large"],
          },
        ],
        attributes: [],
      });
    }
  }, [editingCategory, open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={editingCategory ? "Edit Category" : "Create Category"}
      placement="right"
      onClose={handleClose}
      open={open}
      width={600}
      closeIcon={<CloseOutlined />}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit} style={{ background: "#ff4d4f" }}>
            {editingCategory ? "Update" : "Create"}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          priceConfigurations: [
            {
              name: "size",
              priceType: "base",
              availableOptions: ["small", "medium", "large"],
            },
          ],
          attributes: [],
        }}
      >
        {/* Category Name */}
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true, message: "Please enter category name" }]}
        >
          <Input placeholder="e.g., Pizza, Burger" size="large" />
        </Form.Item>

        {/* Tenant Selection (Admin Only) */}
        {isAdmin && !editingCategory && (
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

        <Divider />

        {/* Price Configuration */}
        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
          Price Configuration
        </h3>
        <Form.List name="priceConfigurations">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  style={{ marginBottom: "16px", position: "relative" }}
                  extra={
                    fields.length > 1 ? (
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ color: "#ff4d4f", cursor: "pointer" }}
                      />
                    ) : null
                  }
                >
                  <Form.Item
                    {...restField}
                    label="Configuration Name"
                    name={[name, "name"]}
                    rules={[{ required: true, message: "Please enter name" }]}
                  >
                    <Input placeholder="e.g., size, toppings, crust" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="Price Type"
                    name={[name, "priceType"]}
                    rules={[{ required: true, message: "Please select price type" }]}
                  >
                    <Radio.Group>
                      <Radio value="base">Base Price</Radio>
                      <Radio value="additional">Additional Price</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="Available Options"
                    name={[name, "availableOptions"]}
                    rules={[{ required: true, message: "Please enter at least one option" }]}
                  >
                    <Select
                      mode="tags"
                      placeholder="Type and press Enter to add options"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Card>
              ))}
              <Button
                type="dashed"
                onClick={() =>
                  add({
                    name: "",
                    priceType: "base",
                    availableOptions: [],
                  })
                }
                block
                icon={<PlusOutlined />}
              >
                Add Price Configuration
              </Button>
            </>
          )}
        </Form.List>

        <Divider />

        {/* Attributes */}
        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Attributes</h3>
        <Form.List name="attributes">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  style={{ marginBottom: "16px" }}
                  extra={
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ color: "#ff4d4f", cursor: "pointer" }}
                    />
                  }
                >
                  <Form.Item
                    {...restField}
                    label="Attribute Name"
                    name={[name, "name"]}
                    rules={[{ required: true, message: "Please enter attribute name" }]}
                  >
                    <Input placeholder="e.g., Crust, Spice Level" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="Widget Type"
                    name={[name, "widgetType"]}
                    rules={[{ required: true, message: "Please select widget type" }]}
                  >
                    <Radio.Group>
                      <Radio value="radio">Radio</Radio>
                      <Radio value="switch">Switch</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="Default Value"
                    name={[name, "defaultValue"]}
                    rules={[{ required: true, message: "Please enter default value" }]}
                  >
                    <Input placeholder="e.g., thin, medium" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="Available Options"
                    name={[name, "availableOptions"]}
                    rules={[{ required: true, message: "Please enter at least one option" }]}
                  >
                    <Select
                      mode="tags"
                      placeholder="Type and press Enter to add options"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Card>
              ))}
              <Button
                type="dashed"
                onClick={() =>
                  add({
                    name: "",
                    widgetType: "radio",
                    defaultValue: "",
                    availableOptions: [],
                  })
                }
                block
                icon={<PlusOutlined />}
              >
                Add Attribute
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Drawer>
  );
};
