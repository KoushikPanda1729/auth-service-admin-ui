import { message } from "antd";

export const notification = {
  success: (content: string, duration = 3) => {
    message.success(content, duration);
  },

  error: (content: string, duration = 3) => {
    message.error(content, duration);
  },

  info: (content: string, duration = 3) => {
    message.info(content, duration);
  },

  warning: (content: string, duration = 3) => {
    message.warning(content, duration);
  },

  loading: (content: string, duration = 0) => {
    return message.loading(content, duration);
  },
};
