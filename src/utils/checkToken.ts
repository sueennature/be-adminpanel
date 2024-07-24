// utils/checkToken.ts
import Cookies from 'js-cookie';

const checkToken = (): boolean => {
  const token = Cookies.get('access_token');
  console.log("TOKS", token)
  return !!token;
};

export default checkToken;

