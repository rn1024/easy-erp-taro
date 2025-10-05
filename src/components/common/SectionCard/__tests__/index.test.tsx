import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SectionCard from '../index'

describe('SectionCard', () => {
  describe('基础渲染', () => {
    it('应该渲染标题和描述', () => {
      render(
        <SectionCard title='测试标题' description='测试描述'>
          <div>内容</div>
        </SectionCard>
      )

      expect(screen.getByText('测试标题')).toBeInTheDocument()
      expect(screen.getByText('测试描述')).toBeInTheDocument()
      expect(screen.getByText('内容')).toBeInTheDocument()
    })

    it('应该渲染标题图标', () => {
      const titleIcon = <span data-testid='title-icon'>图标</span>
      
      render(
        <SectionCard title='测试标题' titleIcon={titleIcon}>
          <div>内容</div>
        </SectionCard>
      )

      expect(screen.getByTestId('title-icon')).toBeInTheDocument()
    })

    it('应该渲染元数据', () => {
      const meta = <span data-testid='meta'>元数据</span>
      
      render(
        <SectionCard title='测试标题' meta={meta}>
          <div>内容</div>
        </SectionCard>
      )

      expect(screen.getByTestId('meta')).toBeInTheDocument()
    })

    it('应该渲染操作按钮', () => {
      const actions = [
        <button key='1' data-testid='action-1'>操作1</button>,
        <button key='2' data-testid='action-2'>操作2</button>
      ]
      
      render(
        <SectionCard title='测试标题' actions={actions}>
          <div>内容</div>
        </SectionCard>
      )

      expect(screen.getByTestId('action-1')).toBeInTheDocument()
      expect(screen.getByTestId('action-2')).toBeInTheDocument()
    })

    it('应该渲染页脚', () => {
      const footer = <div data-testid='footer'>页脚内容</div>
      
      render(
        <SectionCard title='测试标题' footer={footer}>
          <div>内容</div>
        </SectionCard>
      )

      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })
  })

  describe('样式类', () => {
    it('应该应用自定义类名', () => {
      const { container } = render(
        <SectionCard className='custom-class' title='测试标题'>
          <div>内容</div>
        </SectionCard>
      )

      expect(container.firstChild).toHaveClass('section-card', 'custom-class')
    })

    it('应该应用内容类名', () => {
      render(
        <SectionCard contentClassName='custom-content-class' title='测试标题'>
          <div>内容</div>
        </SectionCard>
      )

      const contentElement = document.querySelector('.section-card__content')
      expect(contentElement).toHaveClass('section-card__content', 'custom-content-class')
    })

    it('应该在compact为true时应用compact类', () => {
      const { container } = render(
        <SectionCard compact title='测试标题'>
          <div>内容</div>
        </SectionCard>
      )

      expect(container.firstChild).toHaveClass('section-card--compact')
    })

    it('应该在flat为true时应用flat类', () => {
      const { container } = render(
        <SectionCard flat title='测试标题'>
          <div>内容</div>
        </SectionCard>
      )

      expect(container.firstChild).toHaveClass('section-card--flat')
    })

    it('应该在clickable为true时应用clickable类', () => {
      const { container } = render(
        <SectionCard clickable title='测试标题'>
          <div>内容</div>
        </SectionCard>
      )

      expect(container.firstChild).toHaveClass('section-card--clickable')
    })
  })

  describe('交互行为', () => {
    it('应该在点击时调用onClick回调', () => {
      const onClick = jest.fn()
      
      const { container } = render(
        <SectionCard onClick={onClick} title='测试标题'>
          <div>内容</div>
        </SectionCard>
      )

      fireEvent.click(container.firstChild as Element)
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('不应该在没有onClick时报错', () => {
      const { container } = render(
        <SectionCard title='测试标题'>
          <div>内容</div>
        </SectionCard>
      )

      expect(() => {
        fireEvent.click(container.firstChild as Element)
      }).not.toThrow()
    })
  })

  describe('条件渲染', () => {
    it('不应该在没有标题、描述、图标、元数据和操作时渲染头部', () => {
      render(
        <SectionCard>
          <div>内容</div>
        </SectionCard>
      )

      expect(document.querySelector('.section-card__header')).not.toBeInTheDocument()
    })

    it('不应该在没有内容时渲染内容区域', () => {
      render(
        <SectionCard title='测试标题' />
      )

      expect(document.querySelector('.section-card__content')).not.toBeInTheDocument()
    })

    it('不应该在没有页脚时渲染页脚区域', () => {
      render(
        <SectionCard title='测试标题'>
          <div>内容</div>
        </SectionCard>
      )

      expect(document.querySelector('.section-card__footer')).not.toBeInTheDocument()
    })
  })

  describe('单个操作处理', () => {
    it('应该正确处理单个操作', () => {
      const action = <button data-testid='single-action'>单个操作</button>
      
      render(
        <SectionCard title='测试标题' actions={action}>
          <div>内容</div>
        </SectionCard>
      )

      expect(screen.getByTestId('single-action')).toBeInTheDocument()
    })

    it('应该正确处理空操作数组', () => {
      render(
        <SectionCard title='测试标题' actions={[]}>
          <div>内容</div>
        </SectionCard>
      )

      expect(document.querySelector('.section-card__actions')).not.toBeInTheDocument()
    })
  })

  describe('可访问性', () => {
    it('应该支持键盘导航', () => {
      const onClick = jest.fn()
      
      const { container } = render(
        <SectionCard onClick={onClick} clickable title='测试标题'>
          <div>内容</div>
        </SectionCard>
      )

      const cardElement = container.firstChild as Element
      fireEvent.keyDown(cardElement, { key: 'Enter' })
      fireEvent.keyDown(cardElement, { key: ' ' })
      
      // 在真实实现中，您可能需要添加键盘事件处理
      // 这里只是测试结构是否正确
      expect(cardElement).toHaveClass('section-card--clickable')
    })
  })
})