type TError = string;

export const validateLogin = (value: string): TError | null => {
  if (value.length < 5) {
    return 'Слишком короткий логин! (Допустимо от 5 до 10 символов)';
  } else if (value.length > 10) {
    return 'Слишком длинный логин! (Допустимо от 5 до 10 символов)';
  }

  return null;
}

export const validatePassword = (value: string): TError | null => {
  if (value.length < 5) {
    return 'Слишком короткий пароль! (Допустимо от 5 до 10 символов)';
  } else if (value.length > 10) {
    return 'Слишком длинный пароль! (Допустимо от 5 до 10 символов)';
  }

  return null;
}
