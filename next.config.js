module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: '/api/login',
        destination: 'http://localhost:5000/login',
      },
    ];
  };
  return {
    rewrites,
  };
};
