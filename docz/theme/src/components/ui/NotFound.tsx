import * as React from 'react'
import styled from 'styled-components'

import { Sidebar, Main } from '../shared'
import { get } from '~utils/theme'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  color: ${get('colors.text')};
  background: ${get('colors.background')};
`

const Title = styled.h1`
  margin: 0;
  font-size: 42px;
  font-weight: 400;
  color: ${get('colors.primary')};
`

const Subtitle = styled.p`
  margin: 0;
  font-size: 18px;
`

const GrayTitle = styled.p`
  margin: 0;
  font-size: 15px;
  color: #13161f;
`

export const NotFound = () => (
  <Main>
    <Sidebar />
    <Wrapper>
      <Title>- 你来到了空空如也的文档荒原 -</Title>
      <Subtitle>
        注意检查你是否更改了文档路由或者把它删掉了 
      </Subtitle>
      <GrayTitle>
        (还是你就想看这个页面？)
      </GrayTitle>
    </Wrapper>
  </Main>
)
