import React, { useState } from 'react';
import { Bell, CheckCircle, Clock, AlertTriangle, ArrowLeft, MoreHorizontal } from 'lucide-react';

interface Message {
  id: string;
  type: 'task' | 'system' | 'workflow' | 'approval';
  title: string;
  content: string;
  time: string;
  read: boolean;
  sender?: {
    name: string;
    avatar: string;
  };
  relatedTask?: {
    id: string;
    title: string;
  };
}

interface MessageCenterProps {
  onBack?: () => void;
}

export default function MessageCenter({ onBack }: MessageCenterProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'task',
      title: '新任务分配',
      content: '您被分配了新任务"产品需求评审"，请及时处理',
      time: '2025-06-22T10:30:00',
      read: false,
      sender: {
        name: '产品经理',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      relatedTask: {
        id: '1',
        title: '产品需求评审'
      }
    },
    {
      id: '2',
      type: 'approval',
      title: '审批提醒',
      content: '您有3个工作流程待审批，请尽快处理',
      time: '2025-06-22T09:15:00',
      read: false
    },
    {
      id: '3',
      type: 'workflow',
      title: '流程状态更新',
      content: '用户界面设计流程已进入下一环节',
      time: '2025-06-22T08:45:00',
      read: true,
      sender: {
        name: '李四',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
      }
    },
    {
      id: '4',
      type: 'system',
      title: '系统维护通知',
      content: '系统将于今晚22:00-24:00进行维护，期间可能影响使用',
      time: '2025-06-21T16:00:00',
      read: true
    },
    {
      id: '5',
      type: 'task',
      title: '任务即将到期',
      content: '任务"移动端适配"将于明天到期，请注意及时完成',
      time: '2025-06-21T14:30:00',
      read: true,
      relatedTask: {
        id: '4',
        title: '移动端适配'
      }
    }
  ]);

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'approval':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'workflow':
        return <Bell className="h-4 w-4 text-green-500" />;
      case 'system':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMessageTypeText = (type: string) => {
    switch (type) {
      case 'task':
        return '任务';
      case 'approval':
        return '审批';
      case 'workflow':
        return '流程';
      case 'system':
        return '系统';
      default:
        return '消息';
    }
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)}小时前`;
    } else {
      return time.toLocaleDateString('zh-CN', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const markAllAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
  };

  const filterMessages = (messages: Message[], filter: string) => {
    if (filter === 'all') return messages;
    if (filter === 'unread') return messages.filter(msg => !msg.read);
    return messages.filter(msg => msg.type === filter);
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'unread', label: '未读' },
    { id: 'task', label: '任务' },
    { id: 'system', label: '系统' }
  ];

  const filteredMessages = filterMessages(messages, activeTab);

  return (
    <div className="pb-20">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h1 className="font-semibold text-gray-900">消息中心</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:hover:text-gray-400"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            全部已读
          </button>
        </div>
      </div>

      {/* 消息标签页 */}
      <div className="px-4 py-3">
        {/* 标签导航 */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 消息列表 */}
        <div className="space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>暂无消息</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-white rounded-lg p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  !message.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => !message.read && markAsRead(message.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {message.sender ? (
                      <img
                        src={message.sender.avatar}
                        alt={message.sender.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {getMessageIcon(message.type)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${!message.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {message.title}
                        </h3>
                        <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded">
                          {getMessageTypeText(message.type)}
                        </span>
                      </div>
                      {!message.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {message.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {message.sender && (
                          <>
                            <span>{message.sender.name}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{formatTime(message.time)}</span>
                      </div>
                      
                      {message.relatedTask && (
                        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                          查看任务
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}