import { Button, Form, Input, Typography, App } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = async (values) => {
    try {
      await login(values);
      message.success('Welcome back');
      navigate('/dashboard');
    } catch (err) {
      message.error(getErrorMessage(err, 'Login failed'));
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <div>
          <div className="section-kicker" style={{ color: '#9ad7d0' }}>
            CareerHub
          </div>
          <h1>Your applications, with the resume that actually went out.</h1>
          <p style={{ opacity: 0.85, lineHeight: 1.6 }}>
            Sign in to manage resume versions, track jobs, and tailor PDFs for each description.
          </p>
        </div>
        <p style={{ opacity: 0.7 }}>MVP for students and early-career applicants</p>
      </div>
      <div className="auth-form">
        <div className="auth-form-inner">
          <Typography.Title level={3}>Log in</Typography.Title>
          <Typography.Paragraph type="secondary">Use the email you registered with.</Typography.Paragraph>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="you@example.com" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log in
            </Button>
          </Form>
          <Typography.Paragraph style={{ marginTop: 16 }}>
            New here? <Link to="/register">Create an account</Link>
          </Typography.Paragraph>
          <Link to="/">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
