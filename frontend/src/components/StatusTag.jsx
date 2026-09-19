import { Tag } from 'antd';
import { STATUS_COLORS } from '../constants';

export default function StatusTag({ status }) {
  return <Tag color={STATUS_COLORS[status] || 'default'}>{status}</Tag>;
}
