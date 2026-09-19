import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Spin,
  Typography,
  Upload,
  App
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import api, { downloadBlob, getErrorMessage } from '../services/api';

function ListBlock({ title, items }) {
  if (!items?.length) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <Typography.Title level={5}>{title}</Typography.Title>
      <ul>
        {items.map((item, i) => (
          <li key={`${title}-${i}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AiTailor() {
  const [form] = Form.useForm();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { message } = App.useApp();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/resumes');
        setResumes(data.resumes);
      } catch (err) {
        message.error(getErrorMessage(err, 'Could not load resume library'));
      }
    })();
  }, [message]);

  const tailor = async (values) => {
    const formData = new FormData();
    if (values.jobDescription) formData.append('jobDescription', values.jobDescription);
    if (values.resumeId) formData.append('resumeId', values.resumeId);
    const jdFile = values.jdFile?.[0]?.originFileObj;
    const resumeFile = values.resumeFile?.[0]?.originFileObj;
    if (jdFile) formData.append('jdFile', jdFile);
    if (resumeFile) formData.append('resume', resumeFile);

    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/ai/tailor', formData);
      setResult(data);
      message.success('Tailored resume ready');
    } catch (err) {
      message.error(getErrorMessage(err, 'AI tailoring failed'));
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    if (!result?.tailoredResume) return;
    try {
      const name = result.tailoredResume.name || 'tailored-resume';
      await downloadBlob('/ai/download', `${name}.pdf`, { tailoredResume: result.tailoredResume });
      message.success('PDF downloaded');
    } catch (err) {
      message.error(getErrorMessage(err, 'Could not generate PDF'));
    }
  };

  const r = result?.tailoredResume;
  const exp = result?.explanation;

  return (
    <div>
      <h1 className="page-title">AI Resume Tailor</h1>
      <p className="page-sub">
        Gemini rewrites and reorders only what already exists on your resume. It will not invent
        experience.
      </p>

      <Alert
        style={{ marginBottom: 16 }}
        type="info"
        showIcon
        message="Accuracy rule"
        description="The model is instructed never to add skills, projects, companies, metrics, or certifications that are not in the source resume. Missing JD requirements are listed separately."
      />

      <div className="ai-grid">
        <Card title="Inputs">
          <Form form={form} layout="vertical" onFinish={tailor}>
            <Form.Item name="jobDescription" label="Paste job description">
              <Input.TextArea rows={8} placeholder="Paste the JD here…" />
            </Form.Item>
            <Form.Item
              name="jdFile"
              label="Or upload JD (PDF or TXT)"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
            >
              <Upload accept=".pdf,.txt,application/pdf,text/plain" maxCount={1} beforeUpload={() => false}>
                <Button icon={<InboxOutlined />}>Choose JD file</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="resumeId" label="Resume from library">
              <Select
                allowClear
                placeholder="Select an uploaded resume"
                options={resumes.map((item) => ({
                  value: item._id,
                  label: `${item.name} (${item.version})`
                }))}
              />
            </Form.Item>
            <Form.Item
              name="resumeFile"
              label="Or upload a resume PDF instead"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
            >
              <Upload accept="application/pdf" maxCount={1} beforeUpload={() => false}>
                <Button icon={<InboxOutlined />}>Choose resume PDF</Button>
              </Upload>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Tailor resume
            </Button>
          </Form>
        </Card>

        <Card
          title="Result"
          extra={
            result ? (
              <Button type="primary" onClick={download}>
                Download PDF
              </Button>
            ) : null
          }
        >
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <Spin />
              <p className="muted">Reading the JD and resume…</p>
            </div>
          ) : !result ? (
            <p className="muted">Run the tailor to see a structured resume and a short explanation.</p>
          ) : (
            <div>
              <Typography.Title level={4}>{r.name || 'Tailored resume'}</Typography.Title>
              {r.contact ? <p className="muted">{r.contact}</p> : null}
              {r.summary ? (
                <>
                  <Typography.Title level={5}>Summary</Typography.Title>
                  <p>{r.summary}</p>
                </>
              ) : null}
              {r.skills?.length ? (
                <>
                  <Typography.Title level={5}>Skills</Typography.Title>
                  <p>{r.skills.join(' · ')}</p>
                </>
              ) : null}
              {r.experience?.length ? (
                <>
                  <Typography.Title level={5}>Experience</Typography.Title>
                  {r.experience.map((item, i) => (
                    <div key={`exp-${i}`} style={{ marginBottom: 12 }}>
                      <strong>{item.title}</strong>
                      <div className="muted">
                        {[item.company, item.dates].filter(Boolean).join(' | ')}
                      </div>
                      <ul>
                        {(item.bullets || []).map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              ) : null}
              {r.projects?.length ? (
                <>
                  <Typography.Title level={5}>Projects</Typography.Title>
                  {r.projects.map((item, i) => (
                    <div key={`proj-${i}`} style={{ marginBottom: 12 }}>
                      <strong>{item.name}</strong>
                      {item.description ? <p>{item.description}</p> : null}
                      <ul>
                        {(item.bullets || []).map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              ) : null}
              {r.education?.length ? (
                <>
                  <Typography.Title level={5}>Education</Typography.Title>
                  {r.education.map((item, i) => (
                    <p key={`ed-${i}`}>
                      <strong>{item.degree}</strong>
                      <br />
                      {[item.school, item.dates].filter(Boolean).join(' | ')}
                      {item.details ? (
                        <>
                          <br />
                          {item.details}
                        </>
                      ) : null}
                    </p>
                  ))}
                </>
              ) : null}
              {r.certifications?.length ? (
                <ListBlock title="Certifications" items={r.certifications} />
              ) : null}
              {r.other ? (
                <>
                  <Typography.Title level={5}>Additional</Typography.Title>
                  <p>{r.other}</p>
                </>
              ) : null}

              <Typography.Title level={4} style={{ marginTop: 24 }}>
                What changed
              </Typography.Title>
              <ListBlock title="Changes" items={exp.changes} />
              <ListBlock title="Why" items={exp.why} />
              <ListBlock title="JD requirements that influenced this" items={exp.jdInfluences} />
              <ListBlock title="Existing content prioritized" items={exp.prioritized} />
              <ListBlock title="Important JD gaps" items={exp.missingFromResume} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
