import styled, { css } from 'styled-components/native';

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 60px;
  padding: 10px 16px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 8px;
  border-width: 2px;
  border-color: #f9f9f9;
  ${(props: { isErrored: boolean }) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}
  ${(props: { isFocused: boolean }) =>
    props.isFocused &&
    css`
      border-color: #989c9f;
    `}
`;

export const TextInput = styled.TextInput`
  font-family: ${({ theme }) => theme.fonts.textRegular};
  color: #3e4b5b;
  font-size: 16px;
`;

export const TextError = styled.Text`
  color: #c53030;
  font-size: 8px;
`;
