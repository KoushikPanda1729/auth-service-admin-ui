import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Table, Tag, Button, Input, Select, Space, Avatar, Image } from "antd";
import { SearchOutlined, PlusOutlined, CloseCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnType } from "antd/es/table";
import { useProducts } from "../modules/products/hooks/useProducts";
import type { Product } from "../modules/products/api/types";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const { Option } = Select;

interface ProductTableData extends Product {
  key: string;
}

export const MenuPage = () => {
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState("");

  const { products, loading, currentPage, pageSize, total, loadProducts, handlePageChange } =
    useProducts();

  useEffect(() => {
    loadProducts(1, pageSize, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnType<ProductTableData>[] = [
    {
      title: "Product name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: ProductTableData) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {record.image ? (
            <Image
              src={record.image}
              alt={name}
              width={48}
              height={48}
              style={{ objectFit: "cover", borderRadius: "4px" }}
              preview={false}
            />
          ) : (
            <Avatar size={48}>{name.charAt(0)}</Avatar>
          )}
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "30%",
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId: string) => categoryId || "N/A",
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (isPublished: boolean) => (
        <Tag color={isPublished ? "green" : "default"}>{isPublished ? "Published" : "Draft"}</Tag>
      ),
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD MMMM YYYY"),
    },
  ];

  const tableData: ProductTableData[] = products.map((product) => ({
    ...product,
    key: product._id,
  }));

  return (
    <DashboardLayout>
      <Card
        style={{ borderRadius: "12px" }}
        title={<span style={{ fontSize: "20px", fontWeight: "600" }}>Products</span>}
        extra={
          <Space>
            <div style={{ position: "relative" }}>
              <Input
                placeholder="Search products..."
                prefix={<SearchOutlined />}
                style={{ width: 200, paddingRight: localSearch ? "30px" : "11px" }}
                value={localSearch}
                onChange={(e) => {
                  const newSearchValue = e.target.value ?? "";
                  console.log("========== INPUT onChange ==========");
                  console.log(
                    "New value:",
                    `"${newSearchValue}"`,
                    "Length:",
                    newSearchValue.length
                  );
                  setLocalSearch(newSearchValue);
                  loadProducts(1, pageSize, newSearchValue);
                }}
                onKeyDown={(e) => {
                  console.log("Key pressed:", e.key);
                }}
              />
              {localSearch && (
                <CloseCircleFilled
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("CLEAR CLICKED!");
                    setLocalSearch("");
                    loadProducts(1, pageSize, "");
                  }}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(0,0,0,.45)",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                />
              )}
            </div>
            <Select placeholder="Category" style={{ width: 150 }}>
              <Option value="all">All Categories</Option>
              <Option value="pizza">Pizza</Option>
              <Option value="drinks">Cold drinks</Option>
            </Select>
            <Select placeholder="Status" style={{ width: 150 }}>
              <Option value="all">All Status</Option>
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: "#ff4d4f" }}
              onClick={() => navigate("/products/create")}
            >
              Create product
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: false,
            onChange: handlePageChange,
          }}
          onRow={(record) => ({
            onClick: () => {
              navigate(`/products/${record._id}`);
            },
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </DashboardLayout>
  );
};
