// backend/tests/helpers/mocks.js
module.exports = {
    mockRequest: (props = {}) => ({
      headers: {},
      ...props,
    }),
    mockResponse: () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res); // Ajout crucial
      res.send = jest.fn().mockReturnValue(res);
      return res;
    }
  };