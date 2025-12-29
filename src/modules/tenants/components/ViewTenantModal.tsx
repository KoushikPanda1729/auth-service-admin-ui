import { useEffect } from "react";
import { Modal, Descriptions, Spin } from "antd";
import { useTenants } from "../hooks/useTenants";

interface ViewTenantModalProps {
  visible: boolean;
  tenantId: number | null;
  onClose: () => void;
}

export const ViewTenantModal = ({ visible, tenantId, onClose }: ViewTenantModalProps) => {
  const { selectedTenant, loadTenantById, loading, clearTenant } = useTenants();

  useEffect(() => {
    if (visible && tenantId) {
      loadTenantById(tenantId);
    }
  }, [visible, tenantId, loadTenantById]);

  const handleClose = () => {
    clearTenant();
    onClose();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      );
    }

    if (selectedTenant) {
      return (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{selectedTenant.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{selectedTenant.name}</Descriptions.Item>
          <Descriptions.Item label="Address">{selectedTenant.address}</Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(selectedTenant.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(selectedTenant.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      );
    }

    return null;
  };

  return (
    <Modal title="Tenant Details" open={visible} onCancel={handleClose} footer={null} width={600}>
      {renderContent()}
    </Modal>
  );
};
