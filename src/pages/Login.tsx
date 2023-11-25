import { FC } from 'react';
import { Button, Input } from '../styled/components';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from '../styled/auth';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ADMIN_ROUTE } from '../utils/consts';

type Form = {
  email: string;
  password: string;
};

export const Login: FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        navigate(ADMIN_ROUTE);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`${errorCode}: ${errorMessage}`);
      });
  };

  return (
    <Auth.Wrapper>
      <Auth.Form onSubmit={handleSubmit(onSubmit)}>
        <Auth.Title>Авторизация</Auth.Title>
        <Input {...register('email')} type="email" placeholder="Email" />
        <Input {...register('password')} type="password" placeholder="Пароль" />
        <Button type="submit">Войти</Button>
        <Auth.Links>
          <Link to="/register">Регистрация</Link>
          <Link to="/reset-password">Забыли пароль?</Link>
        </Auth.Links>
      </Auth.Form>
    </Auth.Wrapper>
  );
};
