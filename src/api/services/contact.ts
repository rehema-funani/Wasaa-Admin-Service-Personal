import contactaxios from "../contact-axios";

export const contactService = {
  getReportedUsers: async () => {
    const response = await contactaxios.get('/contacts/reported-contacts');
    return response.data;
  }
};
