import { Modal, Form, Input, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

export default function ResumeUploadModal({ open, onCancel, onSubmit, loading }) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Upload resume version"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Upload"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields();
        }}
      >
        <Form.Item name="name" label="Resume name" rules={[{ required: true, message: 'Give this version a name' }]}>
          <Input placeholder="Java-focused Software Resume" />
        </Form.Item>
        <Form.Item name="version" label="Version label" initialValue="v1">
          <Input placeholder="v3" />
        </Form.Item>
        <Form.Item
          name="resume"
          label="PDF file"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
          rules={[{ required: true, message: 'Upload a PDF' }]}
        >
          <Upload.Dragger accept="application/pdf" maxCount={1} beforeUpload={() => false}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p>Click or drag a PDF here. Max 5MB.</p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
}
