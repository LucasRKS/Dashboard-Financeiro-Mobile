/* eslint-disable @typescript-eslint/no-empty-interface */
import normal from './themes/normal';

type Theme = typeof normal;

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
