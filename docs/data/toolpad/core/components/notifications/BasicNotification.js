import * as React from 'react';
import {
  NotificationsProvider,
  useNotifications,
} from '@toolpad/core/useNotifications';
import Button from '@mui/material/Button';

export default function BasicNotification() {
  const notifications = useNotifications();
  return (
    <div>
      <NotificationsProvider />
      <Button
        onClick={async () => {
          // preview-start
          await notifications.show('Consider yourself notified!', {
            autoHideDuration: 3000,
          });
          // preview-end
        }}
      >
        Notify me
      </Button>
    </div>
  );
}