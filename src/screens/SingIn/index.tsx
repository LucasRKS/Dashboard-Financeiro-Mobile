import React, { useCallback, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Image from 'react-native-scalable-image';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { logo_azul } from '../../assets/img';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { useAuth } from '../../hooks/auth';

import { LogoContainer, Container } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const { signIn } = useAuth();

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string().required('O e-mail é obrigatório'),
          password: Yup.string().required('A senha é obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const loginResponse = await signIn({
          email: data.email,
          password: data.password,
        });

        if (loginResponse.error) {
          formRef.current?.setFieldError('password', loginResponse.error);
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach(error => {
            if (error.path) {
              console.log(error.path);
              formRef.current?.setFieldError(error.path, error.message);
            }
          });
        }
      }
    },
    [signIn],
  );

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <Container>
        <LogoContainer>
          <Image width={180} source={logo_azul} />
        </LogoContainer>
        <Form ref={formRef} onSubmit={handleSignIn}>
          <Input
            name="email"
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            placeholder="E-mail"
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordInputRef.current?.focus();
            }}
          />
          <Input
            ref={passwordInputRef}
            name="password"
            secureTextEntry
            placeholder="Senha"
            returnKeyType="send"
            onSubmitEditing={() => {
              formRef.current?.submitForm();
            }}
          />
          {!loading ? (
            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Entrar
            </Button>
          ) : (
            <ActivityIndicator size="large" color="#F9F9F9" />
          )}
        </Form>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
