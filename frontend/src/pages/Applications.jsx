import { useEffect, useState } from 'react';
import { Button, Empty, Popconfirm, Select, Space, Table, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import api, { getErrorMessage } from '../services/api';
import JobFormModal from '../components/JobFormModal';
import StatusTag from '../components/StatusTag';
import { JOB_STATUSES } from '../constants';

export default function Applications() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const load = async (nextStatus = status) => {
    setLoading(true);
    try {
      const query = nextStatus ? `?status=${encodeURIComponent(nextStatus)}` : '';
      const [jobsRes, resumesRes] = await Promise.all([
        api.get(`/jobs${query}`),
        api.get('/resumes')
      ]);
      setJobs(jobsRes.data.jobs);
      setResumes(resumesRes.data.resumes);
    } catch (err) {
      message.error(getErrorMessage(err, 'Could not load applications'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (values) => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/jobs/${editing._id}`, values);
        message.success('Application updated');
      } else {
        await api.post('/jobs', values);
        message.success('Application added');
      }
      setOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      message.error(getErrorMessage(err, 'Could not save application'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      message.success('Application deleted');
      load();
    } catch (err) {
      message.error(getErrorMessage(err, 'Could not delete application'));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-sub">Jobs and internships you are tracking.</p>
        </div>
        <Space>
          <Select
            allowClear
            placeholder="Filter by status"
            style={{ width: 180 }}
            value={status}
            options={JOB_STATUSES.map((s) => ({ value: s, label: s }))}
            onChange={(value) => {
              setStatus(value);
              load(value);
            }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Add application
          </Button>
        </Space>
      </div>

      <Table
        loading={loading}
        rowKey="_id"
        dataSource={jobs}
        locale={{ emptyText: <Empty description="No applications yet. Add your first job." /> }}
        columns={[
          {
            title: 'Company',
            dataIndex: 'company',
            render: (value, row) => (
              <Button type="link" onClick={() => navigate(`/applications/${row._id}`)} style={{ padding: 0 }}>
                {value}
              </Button>
            )
          },
          { title: 'Role', dataIndex: 'title' },
          { title: 'Location', dataIndex: 'location', render: (v) => v || '—' },
          {
            title: 'Applied',
            dataIndex: 'dateApplied',
            render: (v) => (v ? dayjs(v).format('D MMM YYYY') : '—')
          },
          { title: 'Status', dataIndex: 'status', render: (v) => <StatusTag status={v} /> },
          {
            title: 'Resume',
            dataIndex: 'resume',
            render: (resume) => (resume ? `${resume.name} (${resume.version})` : 'Not linked')
          },
          {
            title: '',
            render: (_, row) => (
              <Space>
                <Button
                  size="small"
                  onClick={() => {
                    setEditing(row);
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Popconfirm title="Delete this application?" onConfirm={() => remove(row._id)}>
                  <Button size="small" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            )
          }
        ]}
      />

      <JobFormModal
        open={open}
        initial={editing}
        resumes={resumes}
        loading={saving}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSubmit={save}
      />
    </div>
  );
}
