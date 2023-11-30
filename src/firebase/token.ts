import jwt from 'jsonwebtoken';

export const verify = (token: string) => {
  const secretKey = 'SegredosDaFúria2023';
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
      const decodedToken = verify(JSON.parse(token));
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