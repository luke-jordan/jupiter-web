export const userStatusMap = {
  CREATED: 'User created',
  PASSWORD_SET: 'User has password',
  ACCOUNT_OPENED: 'User account created',
  USER_HAS_INITIATED_SAVE: 'User has initiated save',
  USER_HAS_SAVED: 'User has cash in account',
  USER_HAS_WITHDRAWN: 'User has completed withdrawal',
  SUSPENDED_FOR_KYC: 'Suspended by failed KYC'
};

export const userKycStatusMap = {
  NO_INFO: 'No information',
  CONTACT_VERIFIED: 'Phone number or email verified',
  PENDING_VERIFICATION_AS_PERSON: 'Pending verification',
  VERIFIED_AS_PERSON: 'Verified as person',
  FAILED_VERIFICATION: 'Verification failed',
  FLAGGED_FOR_REVIEW: 'Flagged for review',
  PENDING_INFORMATION: 'Pending information',
  REVIEW_CLEARED: 'Review cleared',
  REVIEW_FAILED: 'Review failed'
};

export const userHistoryEventTypeMap = {
  USER_LOGIN: 'User logged in',
  SAVING_PAYMENT_SUCCESSFUL: 'Saving payment successful',
  WITHDRAWAL_EVENT_CONFIRMED: 'Withdrawal confirmed',
  WITHDRAWAL_COMPLETED: 'Withdrawal completed',
  PASSWORD_SET: 'Password changed',
  USER_REGISTERED: 'Profile created',
  STATUS_CHANGED: 'User status changed'
};

export const boostTypeMap = {
  GAME: 'Game',
  SIMPLE: 'Simple'
};

export const boostCategoryMap = {
  TIME_LIMITED: 'Time limited'
};

export const messagePresentationTypeMap = {
  RECURRING: 'Recurring',
  EVENT_DRIVEN: 'Event-Driven',
  ONCE_OFF: 'Once-Off'
};

export const messageDisplayTypeMap = {
  CARD: 'Card',
  MODAL: 'Modal',
  PUSH: 'Push notification',
  EMAIL: 'Email'
};

export const referralCodeTypeMap = {
  CHANNEL: 'Marketing channel',
  BETA: 'Early access'
};
