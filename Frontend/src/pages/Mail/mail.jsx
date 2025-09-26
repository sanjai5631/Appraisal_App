import axios from "axios";

export const sendEmailNotification = async (to, subject, body) => {
  try {
    const res = await axios.post("https://localhost:7098/api/Notification/SendEmail", {
      to,
      subject,
      body,
    });
    console.log(res.data.message);
  } catch (err) {
    console.error("Email sending failed:", err.response?.data?.message || err.message);
  }
};
