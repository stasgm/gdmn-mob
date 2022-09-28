import { StatusType } from '@lib/types';

const statusColors = ['#E91E63', '#06567D', '#80B12C', '#FFA700'] as const;

const getStatusColor = (status: StatusType) => {
  let statusColor: typeof statusColors[number];

  switch (status) {
    case 'DRAFT':
      statusColor = statusColors[0];
      break;

    case 'PROCESSED':
      statusColor = statusColors[1];
      break;

    case 'READY':
      statusColor = statusColors[2];
      break;

    case 'SENT':
      statusColor = statusColors[3];
      break;

    default:
      statusColor = statusColors[0];
      break;
  }

  return statusColor;
};

const statusIcons = ['file-edit-outline', 'file-certificate-outline', 'file-outline', 'file-check-outline'] as const;

const getStatusIcon = (status: StatusType) => {
  let statusIcon: typeof statusIcons[number];

  // switch (status) {
  //   case 'DRAFT':
  //     statusIcon = statusIcons[0];
  //     break;

  //   case 'PROCESSED':
  //     statusIcon = statusIcons[1];
  //     break;

  //   case 'READY':
  //     statusIcon = statusIcons[2];
  //     break;

  //   case 'SENT':
  //     statusIcon = statusIcons[3];
  //     break;

  //   default:
  //     statusIcon = statusIcons[0];
  //     break;
  // }

  switch (status) {
    case 'DRAFT':
      statusIcon = statusIcons[0];
      break;

    case 'PROCESSED':
      statusIcon = statusIcons[1];
      break;

    case 'READY':
      statusIcon = statusIcons[2];
      break;

    case 'SENT':
      statusIcon = statusIcons[3];
      break;

    default:
      statusIcon = statusIcons[0];
      break;
  }

  return statusIcon;
};

export { getStatusColor, getStatusIcon };
