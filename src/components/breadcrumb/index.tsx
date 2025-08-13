import React, { JSX, ReactNode, useCallback, useMemo } from 'react'
import BreadcrumbEllipsis from './breadcrumb-ellipsis'
import BreadcrumbItem from './breadcrumb-item'
import BreadcrumbLink from './breadcrumb-link'
import BreadcrumbList from './breadcrumb-list'
import BreadcrumbPage from './breadcrumb-page'
import BreadcrumbRoot from './breadcrumb-root'
import BreadcrumbSeparator from './breadcrumb-separator'

export interface BreadcrumbItem {
  label: string
  value: string
  icon?: JSX.Element
  href?: string
  disabled?: boolean
  target?: string
  redirect?: string
}

export interface BreadcrumbUI {
  root: string
  list: string
  ellipsis: string
  separator: string
  item: string
  link: string
  page: string
}

// 通用渲染函数类型
type RenderFunction<T> = (item: T) => ReactNode
type CustomRender<T> = ReactNode | RenderFunction<T>

// 工具函数：安全地渲染自定义内容
const renderCustomContent = <T,>(
  customRender: CustomRender<T> | undefined,
  item: T,
  fallback?: ReactNode
): ReactNode => {
  if (!customRender) return fallback
  return typeof customRender === 'function' ? customRender(item) : customRender
}

// 工具函数：渲染图标
const renderIcon = <T,>(icon?: JSX.Element, customLeading?: CustomRender<T>) => {
  if (customLeading) return null
  return icon ? <span className='inline-flex'>{icon}</span> : null
}

// 工具函数：渲染链接或页面内容
const renderLinkOrPage = <T extends BreadcrumbItem>(
  item: T,
  ui: { link: string; page: string },
  customLink?: CustomRender<T>,
  customLabel?: CustomRender<T>
) => {
  const label = renderCustomContent(customLabel, item, item.label)
  
  if (item.href) {
    return (
      <BreadcrumbLink
        className={ui.link}
        href={item.href}
        disabled={item.disabled}
        target={item.target}
      >
        {renderCustomContent(customLink, item, label)}
      </BreadcrumbLink>
    )
  }
  
  return (
    <BreadcrumbPage className={ui.page} disabled={item.disabled}>
      {label}
    </BreadcrumbPage>
  )
}

interface EllipsisProps<T> {
  ui: { ellipsis: string; separator: string }
  customEllipsis?: CustomRender<T[]>
  customEllipsisIcon?: ReactNode
  ellipsisItems: T[]
  customSeparator?: ReactNode
  onItemClick?: (item: T) => void
}

const Ellipsis = <T extends BreadcrumbItem>({
  ui,
  customEllipsis,
  customEllipsisIcon,
  ellipsisItems,
  customSeparator,
  onItemClick,
}: EllipsisProps<T>) => {
  const ellipsisContent = renderCustomContent(
    customEllipsis,
    ellipsisItems,
    <BreadcrumbEllipsis 
      className={ui.ellipsis}
      ellipsisItems={ellipsisItems}
      onItemClick={onItemClick as (item: BreadcrumbItem) => void}
    >
      {customEllipsisIcon}
    </BreadcrumbEllipsis>
  )

  return (
    <>
      {ellipsisContent}
      <BreadcrumbSeparator className={ui.separator}>
        {customSeparator}
      </BreadcrumbSeparator>
    </>
  )
}

interface BreadcrumbItemComponentProps<T> {
  item: T
  ui: { item: string; link: string; page: string; separator: string }
  showSeparator: boolean
  customLeading?: CustomRender<T>
  customTrailing?: CustomRender<T>
  customContent?: CustomRender<T>
  customLink?: CustomRender<T>
  customLabel?: CustomRender<T>
  customSeparator?: ReactNode
  onItemClick?: (item: T) => void
}

const BreadcrumbItemComponent = <T extends BreadcrumbItem>({
  item,
  ui,
  showSeparator,
  customLeading,
  customTrailing,
  customContent,
  customLink,
  customLabel,
  customSeparator,
  onItemClick,
}: BreadcrumbItemComponentProps<T>) => {
  const handleClick = useCallback(() => {
    onItemClick?.(item)
  }, [onItemClick, item])

  const content = renderCustomContent(
    customContent,
    item,
    renderLinkOrPage(item, ui, customLink, customLabel)
  )

  return (
    <>
      <BreadcrumbItem className={ui.item} onClick={handleClick}>
        {renderCustomContent(customLeading, item)}
        {renderIcon(item.icon, customLeading)}
        {content}
        {renderCustomContent(customTrailing, item)}
      </BreadcrumbItem>

      {showSeparator && (
        <BreadcrumbSeparator className={ui.separator}>
          {customSeparator}
        </BreadcrumbSeparator>
      )}
    </>
  )
}

// 面包屑项渲染器工厂
const createBreadcrumbItemRenderer = <T extends BreadcrumbItem>(
  ui: BreadcrumbUI,
  customProps: {
    customLeading?: CustomRender<T>
    customTrailing?: CustomRender<T>
    customContent?: CustomRender<T>
    customLink?: CustomRender<T>
    customLabel?: CustomRender<T>
    customSeparator?: ReactNode
    onItemClick?: (item: T) => void
  }
) => {
  return (item: T, index: number, items: T[]) => {
    const isLast = index === items.length - 1
    const showSeparator = !isLast

    return (
      <BreadcrumbItemComponent
        key={`${item.value}-${index}`}
        item={item}
        ui={ui}
        showSeparator={showSeparator}
        {...customProps}
      />
    )
  }
}

export interface BreadcrumbProps<T extends BreadcrumbItem> {
  ui?: BreadcrumbUI
  ellipsis?: true | [number, number] | null
  items: T[]
  customEllipsis?: CustomRender<T[]>
  customEllipsisIcon?: ReactNode
  customLeading?: CustomRender<T>
  customTrailing?: CustomRender<T>
  customContent?: CustomRender<T>
  customLink?: CustomRender<T>
  customLabel?: CustomRender<T>
  customSeparator?: ReactNode
  onItemClick?: (item: T) => void
}

export default function Breadcrumb<T extends BreadcrumbItem>({
  ui = {
    root: '',
    list: '',
    ellipsis: '',
    separator: '',
    item: '',
    link: '',
    page: '',
  },
  ellipsis,
  items,
  customEllipsis,
  customEllipsisIcon,
  customLeading,
  customTrailing,
  customContent,
  customLink,
  customLabel,
  customSeparator,
  onItemClick,
}: BreadcrumbProps<T>) {
  // 计算省略号范围
  const ellipsisRange = useMemo(() => {
    const MIN_ITEM_COUNT_WITH_ELLIPSIS = 5
    
    if (!ellipsis || items.length < MIN_ITEM_COUNT_WITH_ELLIPSIS) return null
    
    if (ellipsis === true) {
      return [1, items.length - 2]
    }
    
    let [start, end] = ellipsis
    if (start === 0) start = 1
    if (end === items.length) end = items.length - 1
    
    return [start, end]
  }, [ellipsis, items.length])

  // 过滤后的项目（排除省略号部分）
  const visibleItems = useMemo(() => {
    if (!ellipsisRange) return items
    const [start, end] = ellipsisRange
    return [...items.slice(0, start), ...items.slice(end)]
  }, [ellipsisRange, items])

  // 省略号项目
  const ellipsisItems = useMemo(() => {
    if (!ellipsisRange) return []
    const [start, end] = ellipsisRange
    return items.slice(start, end)
  }, [ellipsisRange, items])

  // 创建面包屑项渲染器
  const renderBreadcrumbItem = useMemo(
    () => createBreadcrumbItemRenderer(ui, {
      customLeading,
      customTrailing,
      customContent,
      customLink,
      customLabel,
      customSeparator,
      onItemClick,
    }),
    [ui, customLeading, customTrailing, customContent, customLink, customLabel, customSeparator, onItemClick]
  )

  // 渲染面包屑项
  const renderBreadcrumbItems = useMemo(() => {
    return visibleItems.map((item, index) => {
      const isLast = index === visibleItems.length - 1
      const showSeparator = !isLast

      // 检查是否需要插入省略号
      if (ellipsisRange && index === ellipsisRange[0]) {
        return (
          <React.Fragment key={`ellipsis-${index}-${item.value}`}>
            <Ellipsis
              ui={ui}
              customEllipsis={customEllipsis}
              customEllipsisIcon={customEllipsisIcon}
              ellipsisItems={ellipsisItems}
              customSeparator={customSeparator}
              onItemClick={onItemClick}
            />
            {showSeparator && (
              <BreadcrumbItemComponent
                key={`${item.value}-${index}`}
                item={item}
                ui={ui}
                showSeparator={showSeparator}
                customLeading={customLeading}
                customTrailing={customTrailing}
                customContent={customContent}
                customLink={customLink}
                customLabel={customLabel}
                customSeparator={customSeparator}
                onItemClick={onItemClick}
              />
            )}
          </React.Fragment>
        )
      }

      return renderBreadcrumbItem(item, index, visibleItems)
    })
  }, [
    visibleItems,
    ellipsisRange,
    ellipsisItems,
    ui,
    customEllipsis,
    customEllipsisIcon,
    customLeading,
    customTrailing,
    customContent,
    customLink,
    customLabel,
    customSeparator,
    onItemClick,
    renderBreadcrumbItem,
  ])

  return (
    <BreadcrumbRoot className={ui.root}>
      <BreadcrumbList className={ui.list}>
        {renderBreadcrumbItems}
      </BreadcrumbList>
    </BreadcrumbRoot>
  )
}
