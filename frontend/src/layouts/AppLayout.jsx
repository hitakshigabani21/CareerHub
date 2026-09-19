import { Layout, Menu, Button, Typography } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  LogoutOutlined,
  RobotOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;

const items = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/applications', icon: <FolderOpenOutlined />, label: 'Applications' },
  { key: '/resumes', icon: <FileTextOutlined />, label: 'Resume Library' },
  { key: '/ai-tailor', icon: <RobotOutlined />, label: 'AI Resume Tailor' }
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const selected = items.find((item) => location.pathname.startsWith(item.key))?.key;

  const onLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Layout className="app-shell">
      <Sider breakpoint="lg" collapsedWidth="0" className="app-sider" width={240}>
        <Link to="/dashboard" className="app-logo">
          <span className="mark">C</span>
          CareerHub
        </Link>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selected || '/dashboard']}
          items={items}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent' }}
        />
      </Sider>
      <Layout>
        <Header className="app-header">
          <Typography.Text type="secondary">Welcome back, {user?.name}</Typography.Text>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button icon={<HomeOutlined />} onClick={() => navigate('/')}>
              Home
            </Button>
            <Button icon={<LogoutOutlined />} onClick={onLogout}>
              Logout
            </Button>
          </div>
        </Header>
        <Content>
          <div className="page">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
