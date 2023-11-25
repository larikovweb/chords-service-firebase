import { FC } from 'react';
import { Button, Input } from '../styled/components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../styled/auth';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ADMIN_ROUTE } from '../utils/consts';
import { InputField } from '../components/fields/InputField';

type Form = {
  email: string;
  password: string;
};

export const Login: FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();

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
        <InputField error={errors.email?.message}>
          <Input
            {...register('email', {
              required: 'Поле обязательно для заполнения',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Некорректный email',
              },
            })}
            type="email"
            placeholder="Email"
          />
        </InputField>
        <InputField error={errors.password?.message}>
          <Input
            {...register('password', { required: 'Поле обязательно для заполнения' })}
            type="password"
            placeholder="Пароль"
          />
        </InputField>
        <Button type="submit">Войти</Button>
        {/* <Auth.Links>
          <Link to="/register">Регистрация</Link>
          <Link to="/reset-password">Забыли пароль?</Link>
        </Auth.Links> */}
      </Auth.Form>
    </Auth.Wrapper>
  );
};
