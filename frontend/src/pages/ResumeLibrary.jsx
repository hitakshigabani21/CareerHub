import { useEffect, useState } from 'react';
import { Button, Empty, Popconfirm, Space, Typography, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api, { downloadFile, getErrorMessage } from '../services/api';
import ResumeUploadModal from '../components/ResumeUploadModal';

export default function ResumeLibrary() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { message } = App.useApp();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/resumes');
      setResumes(data.resumes);
    } catch (err) {
      message.error(getErrorMessage(err, 'Could not load resumes'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upload = async (values) => {
    const file = values.resume?.[0]?.originFileObj;
    if (!file) {
      message.error('Please choose a PDF');
      return;
    }
    const form = new FormData();
    form.append('name', values.name);
    form.append('version', values.version || 'v1');
    form.append('resume', file);
    setSaving(true);
    try {
      await api.post('/resumes', form);
      message.success('Resume uploaded');
      setOpen(false);
      load();
    } catch (err) {
      message.error(getErrorMessage(err, 'Upload failed'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/resumes/${id}`);
      message.success('Resume deleted');
      load();
    } catch (err) {
      message.error(getErrorMessage(err, 'Could not delete resume'));
    }
  };

  const download = async (resume) => {
    try {
      await downloadFile(`/resumes/${resume._id}/download`, `${resume.name}.pdf`);
    } catch (err) {
      message.error(getErrorMessage(err, 'Download failed'));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Resume Library</h1>
          <p className="page-sub">Every version you might send — named so you can find it later.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Upload resume
        </Button>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : resumes.length === 0 ? (
        <Empty description="No resume versions yet. Upload a PDF to get started." />
      ) : (
        <div className="card-grid">
          {resumes.map((resume) => (
            <article className="resume-card" key={resume._id}>
              <h3>{resume.name}</h3>
              <Typography.Text type="secondary">
                {resume.version} · {resume.fileType} · {dayjs(resume.createdAt).format('D MMM YYYY')}
              </Typography.Text>
              <p className="muted" style={{ margin: 0 }}>
                Used for {resume.usedCount || 0} application{resume.usedCount === 1 ? '' : 's'}
              </p>
              <Space wrap>
                <Button type="primary" href={resume.fileUrl} target="_blank" rel="noreferrer">
                  View PDF
                </Button>
                <Button onClick={() => download(resume)}>Download</Button>
                <Popconfirm
                  title="Delete this resume?"
                  description="Applications that used it will keep the job, but the resume link will be removed."
                  onConfirm={() => remove(resume._id)}
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
              </Space>
            </article>
          ))}
        </div>
      )}

      <ResumeUploadModal open={open} loading={saving} onCancel={() => setOpen(false)} onSubmit={upload} />
    </div>
  );
}
