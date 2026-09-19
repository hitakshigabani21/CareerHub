import { Button, Form, Input, Typography, App } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = async (values) => {
    try {
      await register(values);
      message.success('Account created');
      navigate('/dashboard');
    } catch (err) {
      message.error(getErrorMessage(err, 'Registration failed'));
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <div>
          <div className="section-kicker" style={{ color: '#9ad7d0' }}>
            CareerHub
          </div>
          <h1>Set up a library before the next deadline.</h1>
          <p style={{ opacity: 0.85, lineHeight: 1.6 }}>
            One account keeps your PDFs, job tracker, and AI tailor together.
          </p>
        </div>
        <p style={{ opacity: 0.7 }}>Passwords are hashed. Sessions use HTTP-only cookies.</p>
      </div>
      <div className="auth-form">
        <div className="auth-form-inner">
          <Typography.Title level={3}>Create account</Typography.Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
              <Input placeholder="Your name" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="you@example.com" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, min: 6, message: 'At least 6 characters' }]}
            >
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form>
          <Typography.Paragraph style={{ marginTop: 16 }}>
            Already have an account? <Link to="/login">Log in</Link>
          </Typography.Paragraph>
          <Link to="/">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
