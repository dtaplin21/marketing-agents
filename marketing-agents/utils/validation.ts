export const platformValidation = {
  twitter: {
    apiKey: (value: string) => value.length >= 25,
    apiSecret: (value: string) => value.length >= 50,
    accessToken: (value: string) => value.startsWith('Bearer '),
  },
  facebook: {
    accessToken: (value: string) => value.length >= 50,
    accountId: (value: string) => /^\d+$/.test(value),
  },
  instagram: {
    accessToken: (value: string) => value.length >= 50,
    accountId: (value: string) => /^\d+$/.test(value),
  },
  website: {
    websiteUrl: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    apiKey: (value: string) => value.length >= 32,
  },
  ecommerce: {
    apiKey: (value: string) => value.length >= 32,
    apiSecret: (value: string) => value.length >= 32,
    accountId: (value: string) => value.length >= 8,
  },
}; 