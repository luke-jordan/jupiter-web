export const userStatusMap = {
  CREATED: 'User created',
  PASSWORD_SET: 'User has password',
  ACCOUNT_OPENED: 'User account created',
  USER_HAS_INITIATED_SAVE: 'User has initiated save',
  USER_HAS_SAVED: 'User has cash in account',
  USER_HAS_WITHDRAWN: 'User has completed withdrawal',
  SUSPENDED_FOR_KYC: 'Suspended by failed KYC',
  SOFT_FLAGGED: 'Soft flagged for fraud/AML',
  HARD_FLAGGED: 'Hard flagged for fraud/AML',
  FLAG_CLEARED: 'Cleared of soft/hard flagged'
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

export const userRegulatoryStatusMap = {
  REQUIRES_AGREEMENT: 'Must still agree',
  HAS_GIVEN_AGREEMENT: 'Has agreed'
};

export const userHistoryEventTypeMap = {
  SAVING_PAYMENT_SUCCESSFUL: 'Saving payment successful',
  BOOST_REDEEMED: 'Boost redeemed',

  WITHDRAWAL_EVENT_CONFIRMED: 'Withdrawal confirmed',
  WITHDRAWAL_COMPLETED: 'Withdrawal completed',
  WITHDRAWAL_EVENT_CANCELLED: 'Withdrawal cancelled',

  USER_LOGIN: 'User logged in',
  PASSWORD_SET: 'Password changed',
  USER_REGISTERED: 'Profile created',
  USER_STATUS_UPDATED: 'User status changed',
  VERIFIED_AS_PERSON: 'KYC verification passed',
  FAILED_VERIFICATION: 'Failed KYC verification',
  USER_PROFILE_UPDATED: 'User changed profile',
  
  BANK_VERIFICATION_SUCCEEDED: 'Bank verification succeeded',
  BANK_VERIFICATION_FAILED: 'Bank verification failed',
  BANK_VERIFICATION_MANUAL: 'Manual bank verification required',

  ADMIN_STORED_DOCUMENT: 'Document stored',
};

export const userTransactionTypeMap = {
  USER_SAVING_EVENT: 'Deposit',
  WITHDRAWAL: 'Withdrawal'
};

export const boostTypeMap = {
  GAME: 'Game',
  SIMPLE: 'Simple',
  SOCIAL: 'Social',
  WITHDRAWAL: 'Withdrawal'
};

export const boostCategoryMap = {
  SIMPLE_SAVE: 'Simple save',
  ROUND_UP: 'Round up',
  TIME_LIMITED: 'Old simple',

  TAP_SCREEN: 'Tap screen',
  CHASE_ARROW: 'Chase arrow',
  BREAK_IMAGE: 'Break the image',
  MATCH_TILES: 'Match tiles',

  CANCEL_WITHDRAWAL: 'Cancel withdrawal',
  ABORT_WITHDRAWAL: 'Abort withdrawal'
};

export const messagePresentationTypeMap = {
  RECURRING: 'Recurring',
  EVENT_DRIVEN: 'Event-Driven',
  ONCE_OFF: 'Once-Off',
  ML_DETERMINED: 'ML determined'
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
