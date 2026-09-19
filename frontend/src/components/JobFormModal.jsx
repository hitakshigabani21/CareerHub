import { Modal, Form, Input, DatePicker, Select } from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { JOB_STATUSES } from '../constants';

export default function JobFormModal({ open, onCancel, onSubmit, loading, resumes, initial }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue({
        ...initial,
        dateApplied: initial.dateApplied ? dayjs(initial.dateApplied) : dayjs(),
        resume: initial.resume?._id || initial.resume || undefined
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: 'Saved', dateApplied: dayjs() });
    }
  }, [open, initial, form]);

  return (
    <Modal
      title={initial ? 'Edit application' : 'Add application'}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={initial ? 'Save changes' : 'Add application'}
      width={640}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) =>
          onSubmit({
            ...values,
            dateApplied: values.dateApplied ? values.dateApplied.toISOString() : undefined,
            resume: values.resume || null
          })
        }
      >
        <Form.Item name="company" label="Company" rules={[{ required: true, message: 'Company is required' }]}>
          <Input placeholder="Acme Inc." />
        </Form.Item>
        <Form.Item name="title" label="Job title / role" rules={[{ required: true, message: 'Title is required' }]}>
          <Input placeholder="Software Engineer Intern" />
        </Form.Item>
        <Form.Item name="location" label="Location">
          <Input placeholder="Remote / Bengaluru" />
        </Form.Item>
        <Form.Item name="jobUrl" label="Job URL">
          <Input placeholder="https://" />
        </Form.Item>
        <Form.Item name="dateApplied" label="Date applied">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select options={JOB_STATUSES.map((s) => ({ value: s, label: s }))} />
        </Form.Item>
        <Form.Item name="resume" label="Resume submitted">
          <Select
            allowClear
            placeholder="Select a resume version"
            options={(resumes || []).map((r) => ({
              value: r._id,
              label: `${r.name} (${r.version})`
            }))}
          />
        </Form.Item>
        <Form.Item name="description" label="Job description">
          <Input.TextArea rows={4} placeholder="Paste the JD or a short summary" />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={3} placeholder="Referral, recruiter name, next steps..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
