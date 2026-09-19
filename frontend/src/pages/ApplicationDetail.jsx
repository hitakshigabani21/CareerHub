import { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Empty, Popconfirm, Select, Space, Spin, App } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import api, { downloadFile, getErrorMessage } from '../services/api';
import JobFormModal from '../components/JobFormModal';
import StatusTag from '../components/StatusTag';
import { JOB_STATUSES } from '../constants';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [jobRes, resumesRes] = await Promise.all([api.get(`/jobs/${id}`), api.get('/resumes')]);
      setJob(jobRes.data.job);
      setResumes(resumesRes.data.resumes);
    } catch (err) {
      message.error(getErrorMessage(err, 'Could not load application'));
      navigate('/applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const changeStatus = async (status) => {
    try {
      const { data } = await api.put(`/jobs/${id}`, { status });
      setJob(data.job);
      message.success('Status updated');
    } catch (err) {
      message.error(getErrorMessage(err, 'Could not update status'));
    }
  };

  const save = async (values) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/jobs/${id}`, values);
      setJob(data.job);
      setOpen(false);
      message.success('Application updated');
    } catch (err) {
      message.error(getErrorMessage(err, 'Could not save application'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/jobs/${id}`);
      message.success('Application deleted');
      navigate('/applications');
    } catch (err) {
      message.error(getErrorMessage(err, 'Could not delete application'));
    }
  };

  if (loading || !job) {
    return (
      <div className="center-screen">
        <Spin size="large" />
      </div>
    );
  }

  const resume = job.resume;

  return (
    <div>
      <Button onClick={() => navigate('/applications')} style={{ marginBottom: 12 }}>
        Back
      </Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">{job.company}</h1>
          <p className="page-sub">{job.title}</p>
        </div>
        <Space wrap>
          <Select
            value={job.status}
            options={JOB_STATUSES.map((s) => ({ value: s, label: s }))}
            onChange={changeStatus}
            style={{ width: 160 }}
          />
          <Button onClick={() => setOpen(true)}>Edit</Button>
          <Popconfirm title="Delete this application?" onConfirm={remove}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      </div>

      <div className="detail-grid">
        <Card>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Status">
              <StatusTag status={job.status} />
            </Descriptions.Item>
            <Descriptions.Item label="Location">{job.location || '—'}</Descriptions.Item>
            <Descriptions.Item label="Date applied">
              {job.dateApplied ? dayjs(job.dateApplied).format('D MMMM YYYY') : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Job URL">
              {job.jobUrl ? (
                <a href={job.jobUrl} target="_blank" rel="noreferrer">
                  {job.jobUrl}
                </a>
              ) : (
                '—'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Resume submitted">
              {resume ? `${resume.name} (${resume.version})` : 'No resume linked'}
            </Descriptions.Item>
            <Descriptions.Item label="Notes">{job.notes || '—'}</Descriptions.Item>
            <Descriptions.Item label="Job description">
              <div style={{ whiteSpace: 'pre-wrap' }}>{job.description || '—'}</div>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Submitted resume">
          {resume ? (
            <>
              <p>
                <strong>{resume.name}</strong> · {resume.version}
              </p>
              <Space wrap>
                <Button type="primary" href={resume.fileUrl} target="_blank" rel="noreferrer">
                  View PDF
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      await downloadFile(`/resumes/${resume._id}/download`, `${resume.name}.pdf`);
                    } catch (err) {
                      message.error(getErrorMessage(err, 'Download failed'));
                    }
                  }}
                >
                  Download
                </Button>
              </Space>
              <iframe className="pdf-frame" style={{ marginTop: 16 }} title="Resume PDF" src={resume.fileUrl} />
            </>
          ) : (
            <Empty description="Link a resume version when you edit this application." />
          )}
        </Card>
      </div>

      <JobFormModal
        open={open}
        initial={job}
        resumes={resumes}
        loading={saving}
        onCancel={() => setOpen(false)}
        onSubmit={save}
      />
    </div>
  );
}
