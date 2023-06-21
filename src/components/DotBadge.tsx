import { Badge } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
type Status = 'approve' | 'refuse' | 'wait';

interface DotBadgeProps {
  status: Status;
}

const DotBadge: React.FC<DotBadgeProps> = ({ status }) => {
  let badgeColor: 'green' | 'red' | 'gray' = 'gray';
  let badgeIcon: React.ReactNode = null;

  switch (status) {
    case 'approve':
        badgeColor = 'green';
        badgeIcon = <CheckCircleOutlined/>;
        break;
    case 'refuse':
        badgeColor = 'red';
        badgeIcon = <ExclamationCircleOutlined/>;
        break;
    case 'wait':
        badgeColor = 'gray';
        badgeIcon = <CheckCircleOutlined/>;
        break;
    default:
        break;
  }

  return <Badge color={badgeColor} size="default"/>;
};


export default DotBadge;
