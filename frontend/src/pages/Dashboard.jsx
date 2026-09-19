import { useEffect, useState } from 'react';
import { Button, Empty, Table, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import api, { getErrorMessage } from '../services/api';
import StatusTag from '../components/StatusTag';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/jobs/dashboard');
        setData(res.data);
      } catch (err) {
        message.error(getErrorMessage(err, 'Could not load dashboard'));
      } finally {
        setLoading(false);
      }
    })();
  }, [message]);

  const stats = data?.stats || {};
  const cards = [
    { label: 'Total applications', value: stats.total ?? '—' },
    { label: 'This month', value: stats.thisMonth ?? '—' },
    { label: 'Interviews', value: stats.interviews ?? '—' },
    { label: 'Rejected', value: stats.rejected ?? '—' },
    { label: 'Selected', value: stats.selected ?? '—' },
    { label: 'Resume versions', value: stats.resumes ?? '—' }
  ];

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-sub">A simple snapshot of your search.</p>

      <div className="stat-grid">
        {cards.map((card) => (
          <div className="stat-card" key={card.label}>
            <div className="label">{card.label}</div>
            <div className="value">{loading ? '…' : card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Recent applications</h2>
        <Button type="primary" onClick={() => navigate('/applications')}>
          View all
        </Button>
      </div>

      <Table
        loading={loading}
        rowKey="_id"
        dataSource={data?.recent || []}
        locale={{ emptyText: <Empty description="No applications yet" /> }}
        pagination={false}
        onRow={(row) => ({ onClick: () => navigate(`/applications/${row._id}`), style: { cursor: 'pointer' } })}
        columns={[
          { title: 'Company', dataIndex: 'company' },
          { title: 'Role', dataIndex: 'title' },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (value) => <StatusTag status={value} />
          },
          {
            title: 'Resume',
            dataIndex: 'resume',
            render: (resume) => (resume ? `${resume.name} (${resume.version})` : '—')
          },
          {
            title: 'Updated',
            dataIndex: 'updatedAt',
            render: (value) => dayjs(value).format('D MMM YYYY')
          }
        ]}
      />
    </div>
  );
}
