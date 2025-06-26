import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Cell, Drag } from '@nutui/nutui-react-taro'
import { IconFont } from '@nutui/icons-react-taro'
import { Button, Card, Badge } from '../ui'
import { cn } from '../../utils/cn'
import './index.scss'

// 工作流节点类型
export interface WorkflowNode {
  id: string
  type: 'start' | 'action' | 'condition' | 'end'
  name: string
  description?: string
  config?: Record<string, any>
  position?: { x: number; y: number }
}

// 工作流连接
export interface WorkflowConnection {
  id: string
  from: string
  to: string
  label?: string
}

export interface CustomWorkflowBuilderProps {
  /**
   * 初始节点
   */
  initialNodes?: WorkflowNode[]

  /**
   * 初始连接
   */
  initialConnections?: WorkflowConnection[]

  /**
   * 节点变更回调
   */
  onNodesChange?: (nodes: WorkflowNode[]) => void

  /**
   * 连接变更回调
   */
  onConnectionsChange?: (connections: WorkflowConnection[]) => void

  /**
   * 自定义类名
   */
  className?: string
}

// 节点模板
const nodeTemplates: WorkflowNode[] = [
  { id: 'start', type: 'start', name: '开始', description: '工作流开始节点' },
  { id: 'action1', type: 'action', name: '审批', description: '需要审批的节点' },
  { id: 'action2', type: 'action', name: '通知', description: '发送通知消息' },
  { id: 'condition', type: 'condition', name: '条件判断', description: '根据条件分支' },
  { id: 'end', type: 'end', name: '结束', description: '工作流结束节点' }
]

/**
 * 自定义工作流构建器
 * 支持拖拽式工作流设计
 */
export const CustomWorkflowBuilder: React.FC<CustomWorkflowBuilderProps> = ({
  initialNodes = [],
  initialConnections = [],
  onNodesChange,
  onConnectionsChange,
  className
}) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes)
  const [connections, setConnections] = useState<WorkflowConnection[]>(initialConnections)
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)

  // 添加节点
  const addNode = (template: WorkflowNode) => {
    const newNode: WorkflowNode = {
      ...template,
      id: `${template.type}_${Date.now()}`,
      position: {
        x: Math.random() * 300 + 50,
        y: nodes.length * 100 + 50
      }
    }

    const newNodes = [...nodes, newNode]
    setNodes(newNodes)
    onNodesChange?.(newNodes)
  }

  // 删除节点
  const deleteNode = (nodeId: string) => {
    const newNodes = nodes.filter(n => n.id !== nodeId)
    const newConnections = connections.filter(
      c => c.from !== nodeId && c.to !== nodeId
    )

    setNodes(newNodes)
    setConnections(newConnections)
    onNodesChange?.(newNodes)
    onConnectionsChange?.(newConnections)
    setSelectedNode(null)
  }

  // 开始连接
  const startConnection = (nodeId: string) => {
    setIsConnecting(true)
    setConnectingFrom(nodeId)
  }

  // 完成连接
  const completeConnection = (nodeId: string) => {
    if (!connectingFrom || connectingFrom === nodeId) {
      setIsConnecting(false)
      setConnectingFrom(null)
      return
    }

    const newConnection: WorkflowConnection = {
      id: `conn_${Date.now()}`,
      from: connectingFrom,
      to: nodeId
    }

    const newConnections = [...connections, newConnection]
    setConnections(newConnections)
    onConnectionsChange?.(newConnections)

    setIsConnecting(false)
    setConnectingFrom(null)
  }

  // 获取节点样式
  const getNodeStyle = (type: WorkflowNode['type']) => {
    switch (type) {
      case 'start':
        return 'node--start'
      case 'end':
        return 'node--end'
      case 'condition':
        return 'node--condition'
      default:
        return 'node--action'
    }
  }

  // 获取节点图标
  const getNodeIcon = (type: WorkflowNode['type']) => {
    switch (type) {
      case 'start':
        return 'play-circle'
      case 'end':
        return 'stop-circle'
      case 'condition':
        return 'branch'
      default:
        return 'gear'
    }
  }

  return (
    <View className={cn('workflow-builder', className)}>
      {/* 工具栏 */}
      <View className="workflow-builder__toolbar">
        <Text className="workflow-builder__title">工作流设计器</Text>
        <View className="workflow-builder__actions">
          <Button
            size="small"
            variant="ghost"
            onClick={() => {
              setNodes([])
              setConnections([])
              setSelectedNode(null)
              onNodesChange?.([])
              onConnectionsChange?.([])
            }}
          >
            清空
          </Button>
        </View>
      </View>

      {/* 主体区域 */}
      <View className="workflow-builder__main">
        {/* 节点模板 */}
        <View className="workflow-builder__templates">
          <Text className="workflow-builder__section-title">节点模板</Text>
          <ScrollView scrollY className="workflow-builder__template-list">
            {nodeTemplates.map(template => (
              <Card
                key={template.id}
                className="workflow-builder__template"
                clickable
                onClick={() => addNode(template)}
                padding="small"
              >
                <View className="workflow-builder__template-content">
                  <IconFont
                    name={getNodeIcon(template.type)}
                    size="32"
                    className={cn('workflow-builder__template-icon', getNodeStyle(template.type))}
                  />
                  <View className="workflow-builder__template-info">
                    <Text className="workflow-builder__template-name">{template.name}</Text>
                    <Text className="workflow-builder__template-desc">{template.description}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* 画布区域 */}
        <View className="workflow-builder__canvas">
          <ScrollView scrollX scrollY className="workflow-builder__scroll">
            <View className="workflow-builder__workspace">
              {/* 连接线 */}
              {connections.map(conn => {
                const fromNode = nodes.find(n => n.id === conn.from)
                const toNode = nodes.find(n => n.id === conn.to)
                if (!fromNode || !toNode) return null

                return (
                  <View
                    key={conn.id}
                    className="workflow-builder__connection"
                    style={{
                      left: `${fromNode.position?.x || 0}px`,
                      top: `${(fromNode.position?.y || 0) + 40}px`,
                      width: `${Math.abs((toNode.position?.x || 0) - (fromNode.position?.x || 0))}px`,
                      height: `${Math.abs((toNode.position?.y || 0) - (fromNode.position?.y || 0))}px`
                    }}
                  />
                )
              })}

              {/* 节点 */}
              {nodes.map(node => (
                <View
                  key={node.id}
                  className={cn(
                    'workflow-builder__node',
                    getNodeStyle(node.type),
                    {
                      'workflow-builder__node--selected': selectedNode?.id === node.id,
                      'workflow-builder__node--connecting': isConnecting && connectingFrom === node.id
                    }
                  )}
                  style={{
                    left: `${node.position?.x || 0}px`,
                    top: `${node.position?.y || 0}px`
                  }}
                  onClick={() => {
                    if (isConnecting) {
                      completeConnection(node.id)
                    } else {
                      setSelectedNode(node)
                    }
                  }}
                >
                  <IconFont
                    name={getNodeIcon(node.type)}
                    size="24"
                    className="workflow-builder__node-icon"
                  />
                  <Text className="workflow-builder__node-name">{node.name}</Text>

                  {/* 连接点 */}
                  {node.type !== 'end' && (
                    <View
                      className="workflow-builder__node-connect"
                      onClick={(e) => {
                        e.stopPropagation()
                        startConnection(node.id)
                      }}
                    >
                      <IconFont name="link" size="16" />
                    </View>
                  )}
                </View>
              ))}

              {/* 空状态 */}
              {nodes.length === 0 && (
                <View className="workflow-builder__empty">
                  <IconFont name="branch" size="48" className="workflow-builder__empty-icon" />
                  <Text className="workflow-builder__empty-text">
                    点击左侧节点模板开始设计工作流
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        {/* 属性面板 */}
        {selectedNode && (
          <View className="workflow-builder__properties">
            <View className="workflow-builder__properties-header">
              <Text className="workflow-builder__section-title">节点属性</Text>
              <IconFont
                name="close"
                size="20"
                onClick={() => setSelectedNode(null)}
                className="workflow-builder__properties-close"
              />
            </View>

            <View className="workflow-builder__properties-content">
              <Cell title="节点类型">
                <Badge variant={selectedNode.type === 'start' ? 'success' : 'primary'}>
                  {selectedNode.type}
                </Badge>
              </Cell>
              <Cell title="节点名称" description={selectedNode.name} />
              <Cell title="节点ID" description={selectedNode.id} />

              <View className="workflow-builder__properties-actions">
                <Button
                  variant="danger"
                  size="small"
                  fullWidth
                  onClick={() => deleteNode(selectedNode.id)}
                >
                  删除节点
                </Button>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 连接提示 */}
      {isConnecting && (
        <View className="workflow-builder__connecting-hint">
          <IconFont name="link" size="16" />
          <Text>点击目标节点完成连接</Text>
        </View>
      )}
    </View>
  )
}
