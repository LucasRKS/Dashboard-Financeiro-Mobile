import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

export const ContainerData = styled.View`
  flex: 1;
`;

export const Container = styled.View`
  padding: 60px 20px 10px 20px;
`;

export const TextFilterPlaceholder = styled.Text`
  font-size: 10px;
  margin-bottom: ${Platform.OS === 'android' ? -8 : 5}px;
  margin-top: ${Platform.OS === 'android' ? 0 : 12}px;
  font-weight: bold;
`;

export const DataText = styled.Text`
  font-size: 15px;
`;

export const ButtonDataFiltro = styled(RectButton)`
  height: 40px;
  padding: ${Platform.OS === 'android' ? 8 : 0}px;
  width: 100px;
  color: black;
  margin-top: ${Platform.OS === 'android' ? 8 : 0}px;
`;

export const ActionsContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  width: 100%;
`;

export const FilterButton = styled.View`
  padding: 16px;
  width: 70px;
  margin-bottom: 6px;
  margin-right: 2px;
`;

export const SignOutButton = styled.View`
  padding: 16px;
  width: 70px;
  margin-bottom: 6px;
`;

export const TextPercentage = styled.Text`
  color: #fff;
  font-size: 8px;
`;

export const CardIconContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-self: flex-end;
  width: 40px;
  border-radius: 8px;
  padding: 4px;
  ${(props: { color: string }) =>
    props.color === 'blue' &&
    css`
      border: 1px solid #047bf8;
      background-color: #047bf8;
    `}
  ${(props: { color: string }) =>
    props.color === 'red' &&
    css`
      border: 1px solid #e65252;
      background-color: #e65252;
    `}
`;

export const FilterContainer = styled.View`
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 6px;

  ${(props: { isOpen: boolean }) =>
    !props.isOpen &&
    css`
      display: none;
    `}
`;

export const MainCardContainer = styled.View`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 20px 30px 20px;
  text-align: center;
  margin-bottom: 10px;
`;

export const CardContainer = styled.View`
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 10px;
`;

export const MainCardTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.textBold};
  margin-bottom: 30px;
  ${(props: { loading: boolean }) =>
    !props.loading &&
    css`
      margin-top: -36px;
    `}
  font-size: 30px;
`;

export const CardTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.textBold};
  margin-bottom: 10px;
  ${(props: { loading: boolean }) =>
    !props.loading &&
    css`
      margin-top: -36px;
    `}
  font-size: 18px;
  color: black;
`;

export const CardData = styled.Text`
  color: black;
  font-family: ${({ theme }) => theme.fonts.textRegular};
  font-size: 16px;
  ${(props: { color: string }) =>
    props.color === 'black' &&
    css`
      color: black;
    `}
  ${(props: { color: string }) =>
    props.color === 'blue' &&
    css`
      color: #047bf8;
    `}
  ${(props: { color: string }) =>
    props.color === 'red' &&
    css`
      color: #e65252;
    `}
`;
