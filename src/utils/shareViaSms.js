// utils/shareViaSms.js
export const shareViaSms = ({ text, url }) => {
  const message = `${text}\n${url}`.trim();
  const encoded = encodeURIComponent(message);
  const smsLink = `sms:?&body=${encoded}`;
  window.location.href = smsLink;
};
