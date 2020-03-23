import styled from 'styled-components'
import { get } from '~utils/theme'

export const H1 = styled.h1`
  ${get('styles.h1')};
  color: ${get(`colors.text`)};
`
