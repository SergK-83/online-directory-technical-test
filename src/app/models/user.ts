export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  picture_url: string;
  company_name: string;
  is_favorite: boolean;
}

export function instantiateAndValidateUserByJson(json: Partial<User>): User
{
  const requiredProps = [
    'id', 'first_name', 'last_name', 'email', 'phone_number', 'picture_url', 'company_name', 'is_favorite',
  ];

  for (const prop of requiredProps) {
    if (typeof json[prop] == 'undefined') {
      throw new Error(`Error during instantiate User: prop ${prop} is not defined`);
    }
  }

  return {...json} as User;
}
