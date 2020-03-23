import * as React from 'react'
import { SFC, Fragment } from 'react'
import { PageProps } from 'docz'
import Edit from 'react-feather/dist/icons/edit-2'
import styled from 'styled-components'

import { ButtonLink } from './Button'
import { Sidebar, Main } from '../shared'
import { get } from '~utils/theme'
import { mq } from '~styles/responsive'

const Wrapper = styled.div`
  flex: 1;
  color: ${get('colors.text')};
  background: ${get('colors.background')};
  min-width: 0;
  position: relative;
`

export const Container = styled.div`
  box-sizing: border-box;
  margin: 0 auto;

  ${({ fullpage }) =>
    mq({
      width: fullpage
        ? ['100%', '100%', '100%']
        : ['100%', 'calc(100% - 113px)', 'calc(100% - 113px)'],
      // 仅仅只在宽度420-920时留出多余右padding，用于展示如锚点导航等
      padding: ['20px', '0 24px 24px', '0 124px 24px 24px', '0 24px 24px'],
    })}

  ${get('styles.container')};
`

const EditPage = styled(ButtonLink.withComponent('a'))`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 2px 8px;
  margin: 8px;
  border-radius: ${get('radii')};
  border: 1px solid ${get('colors.border')};
  opacity: 0.7;
  transition: opacity 0.4s;
  font-size: 14px;
  color: ${get('colors.text')};
  text-decoration: none;
  text-transform: uppercase;

  &:hover {
    opacity: 1;
    background: ${get('colors.border')};
  }

  ${mq({
    visibility: ['hidden', 'hidden', 'visible'],
    top: [0, -60, 32],
    right: [0, 0, 40],
  })};
`

const EditIcon = styled(Edit)<{ width: number }>`
  margin-right: 5px;
`

export const Page: SFC<PageProps> = ({
  children,
  doc: { source, fullpage, edit = true },
}) => {
  const content = (
    <Fragment>
      {source && edit && (
        <EditPage href={source} target="_blank">
          <EditIcon width={14} /> 编辑此页
        </EditPage>
      )}
      {children}
    </Fragment>
  )

  return (
    <Main>
      {!fullpage && <Sidebar />}
      <Wrapper>
        {fullpage ? (
          <Container fullpage={fullpage}>{content}</Container>
        ) : (
          <Container>{content}</Container>
        )}
      </Wrapper>
    </Main>
  )
}
