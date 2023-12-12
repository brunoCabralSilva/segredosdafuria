import jwt from 'jsonwebtoken';

export const verify = (token: string) => {
  const secretKey: any = process.env.NEXT_PUBLIC_SECRET_KEY;
  try {
    return jwt.verify(token, secretKey);
  } catch(error) {
    return false;
  }
};

export const testToken = () => {
  const token = localStorage.getItem('Segredos Da Fúria');
  if (token) {
    try {
      const tokenV = JSON.parse(token);
      const decodedToken = verify(tokenV);
      if (decodedToken) return true;
      else {
        localStorage.removeItem('Segredos Da Fúria');
        return false;
      }
    } catch(error) {
      localStorage.removeItem('Segredos Da Fúria');
      return false;
    }
  } else {
    localStorage.removeItem('Segredos Da Fúria');
    return false;
  }
}