// __mocks__/useLogin.js
const useLogin = jest.fn(() => ({
  login: jest.fn(),
  isLoading: false,
  error: null,
}));

module.exports = useLogin;
