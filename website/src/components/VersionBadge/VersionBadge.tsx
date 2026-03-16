'use client'

import { ChangeEvent } from 'react'
import styled from 'styled-components'
import { CARD_STYLES } from '@/utils/card'
import { SPACINGS } from '@/utils/spacings'
import { BORDER_RADIUSES } from '@/utils/border'
import { FONT_SIZES, FONT_WEIGHTS } from '@/utils/font-sizes'
import { COLORS } from '@/utils/theme'
import { usePathname, useRouter } from 'next/navigation'
import { getVersionFromPathname } from '@/utils/slug'
import { DOCS_LATEST_VERSION, DOCS_VERSIONS } from '@/utils/global-data'

const VersionBadgeWrapper = styled.div`
  ${CARD_STYLES};
  display: inline-flex;
  align-items: center;
  padding: 0.6rem ${SPACINGS.THREE};
  border-radius: ${BORDER_RADIUSES.SOFT};
  font-size: ${FONT_SIZES.COMPLEMENTARY};
  color: ${COLORS.TEXT_LOW_CONTRAST};
`

const VersionBadgeKey = styled.label`
  font-weight: ${FONT_WEIGHTS.SEMI_BOLD};
  margin-right: 0.4rem;
`

const VersionSelect = styled.select`
  appearance: none;
  background: transparent;
  border: none;
  padding: 0;
  width: 100%;
  cursor: pointer;
  font-weight: ${FONT_WEIGHTS.SEMI_BOLD};
  outline: none;

  &::-ms-expand {
    display: none;
  }
`

type PropType = {}

const DOCS_VERSION_SEGMENT_REGEX = /^v\d+$/

function getDocsSubPath(pathname = ''): string[] {
  if (!pathname.startsWith('/docs')) return []
  const [, ...docsSubPath] = pathname.split('/').filter(Boolean)

  return DOCS_VERSION_SEGMENT_REGEX.test(docsSubPath[0] ?? '')
    ? docsSubPath.slice(1)
    : docsSubPath
}

function getVersionPathname(pathname = '', major: number): string {
  const versionPrefix = major === DOCS_LATEST_VERSION.MAJOR ? [] : [`v${major}`]
  return ['docs', ...versionPrefix, ...getDocsSubPath(pathname)].join('/')
}

export function VersionBadge(props: PropType) {
  const { ...restProps } = props
  const router = useRouter()
  const pathname = usePathname()
  const version = getVersionFromPathname(pathname)

  function onVersionChange(event: ChangeEvent<HTMLSelectElement>) {
    const major = Number(event.target.value)
    const nextPathname = `/${getVersionPathname(pathname, major)}`

    if (nextPathname === pathname) return
    router.push(nextPathname)
  }

  return (
    <VersionBadgeWrapper {...restProps}>
      <VersionBadgeKey htmlFor="version">Version:</VersionBadgeKey>

      <VersionSelect
        aria-label="Select documentation version"
        value={String(version.MAJOR)}
        name="version"
        id="version"
        onChange={onVersionChange}
      >
        {DOCS_VERSIONS.map((docsVersion) => {
          const versionLabel = `v${docsVersion.MAJOR}`
          const versionSuffix = docsVersion.SUFFIX
            ? ` (${docsVersion.SUFFIX})`
            : ''

          return (
            <option key={versionLabel} value={docsVersion.MAJOR}>
              {versionLabel}
              {versionSuffix}
            </option>
          )
        })}
      </VersionSelect>
    </VersionBadgeWrapper>
  )
}
