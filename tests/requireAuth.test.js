const requireAuth = require('../middleware/requireAuth');
const jwt = require('jsonwebtoken');

describe('requireAuth middleware', () => {
  const mockReq = () => ({
    headers: {}
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no Authorization header', () => {
    const req = mockReq();
    const res = mockRes();

    requireAuth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authorization token required' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 for malformed Authorization header', () => {
    const req = mockReq();
    req.headers.authorization = 'Token abc123';
    const res = mockRes();

    requireAuth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authorization token required' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 for invalid token', () => {
    const req = mockReq();
    req.headers.authorization = 'Bearer invalid.token';
    const res = mockRes();

    requireAuth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next() and attach userId for valid token', () => {
    process.env.JWT_SECRET = 'testsecret'; 

    const userId = '12345';
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };
    const res = {};
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(req.userId).toBe(userId);
    expect(next).toHaveBeenCalled();
  });
});
