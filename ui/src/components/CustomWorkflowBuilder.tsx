import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  Clock, 
  ArrowRight, 
  Check,
  Circle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  assigneeType: 'single' | 'multiple' | 'any';
  assignees: string[];
  estimatedDays: number;
  isRequired: boolean;
  approvalType: 'sequential' | 'parallel';
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  department: string;
  position: string;
}

interface CustomWorkflowBuilderProps {
  onBack: () => void;
  onSave?: (workflow: any) => void;
}

export default function CustomWorkflowBuilder({ onBack, onSave }: CustomWorkflowBuilderProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [workflowData, setWorkflowData] = useState({
    name: '',
    description: '',
    priority: 'medium',
    category: '',
    estimatedTotalDays: 0
  });

  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: '1',
      name: '流程开始',
      description: '工作流程启动',
      assigneeType: 'single',
      assignees: [],
      estimatedDays: 1,
      isRequired: true,
      approvalType: 'sequential'
    }
  ]);

  const [showStepEditor, setShowStepEditor] = useState(false);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [showMemberSelector, setShowMemberSelector] = useState(false);

  const teamMembers: TeamMember[] = [
    { id: '1', name: '张三', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', department: '产品部', position: '产品经理' },
    { id: '2', name: '李四', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face', department: '设计部', position: 'UI设计师' },
    { id: '3', name: '王五', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', department: '技术部', position: '开发工程师' },
    { id: '4', name: '赵六', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face', department: '测试部', position: '测试工程师' },
    { id: '5', name: '刘七', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face', department: '运营部', position: '运营专员' },
    { id: '6', name: '陈八', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face', department: '市场部', position: '市场专员' }
  ];

  const steps = [
    { title: '基本信息', description: '设置工作流名称和描述' },
    { title: '流程设计', description: '设计工作流程步骤' },
    { title: '确认创建', description: '检查并创建工作流程' }
  ];

  const addWorkflowStep = () => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      name: `步骤 ${workflowSteps.length + 1}`,
      description: '',
      assigneeType: 'single',
      assignees: [],
      estimatedDays: 1,
      isRequired: true,
      approvalType: 'sequential'
    };
    setWorkflowSteps([...workflowSteps, newStep]);
    setEditingStep(newStep);
    setShowStepEditor(true);
  };

  const editWorkflowStep = (step: WorkflowStep) => {
    setEditingStep(step);
    setShowStepEditor(true);
  };

  const deleteWorkflowStep = (stepId: string) => {
    if (workflowSteps.length <= 1) {
      toast.error('至少需要保留一个步骤');
      return;
    }
    setWorkflowSteps(workflowSteps.filter(step => step.id !== stepId));
  };

  const updateWorkflowStep = (updatedStep: WorkflowStep) => {
    setWorkflowSteps(workflowSteps.map(step => 
      step.id === updatedStep.id ? updatedStep : step
    ));
    setShowStepEditor(false);
    setEditingStep(null);
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const currentIndex = workflowSteps.findIndex(step => step.id === stepId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === workflowSteps.length - 1)
    ) {
      return;
    }

    const newSteps = [...workflowSteps];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newSteps[currentIndex], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[currentIndex]];
    setWorkflowSteps(newSteps);
  };

  const calculateTotalDays = () => {
    return workflowSteps.reduce((total, step) => total + step.estimatedDays, 0);
  };

  const handleSaveWorkflow = () => {
    if (!workflowData.name.trim()) {
      toast.error('请输入工作流程名称');
      return;
    }

    const workflow = {
      ...workflowData,
      steps: workflowSteps,
      estimatedTotalDays: calculateTotalDays(),
      createdAt: new Date().toISOString()
    };

    if (onSave) {
      onSave(workflow);
    }
    
    toast.success('工作流程创建成功！');
    onBack();
  };

  const renderStepContent = () => {
    switch (currentStepIndex) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="workflowName">流程名称 *</Label>
              <Input
                id="workflowName"
                placeholder="请输入工作流程名称"
                value={workflowData.name}
                onChange={(e) => setWorkflowData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="workflowDescription">流程描述</Label>
              <Textarea
                id="workflowDescription"
                placeholder="请描述这个工作流程的用途和目标"
                value={workflowData.description}
                onChange={(e) => setWorkflowData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="priority">优先级</Label>
              <Select value={workflowData.priority} onValueChange={(value) => setWorkflowData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">流程分类</Label>
              <Select value={workflowData.category} onValueChange={(value) => setWorkflowData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="选择流程分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">产品开发</SelectItem>
                  <SelectItem value="design">设计审核</SelectItem>
                  <SelectItem value="technical">技术评审</SelectItem>
                  <SelectItem value="operation">运营推广</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">流程步骤设计</h3>
              <Button onClick={addWorkflowStep} size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                添加步骤
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {workflowSteps.map((step, index) => (
                  <Card key={step.id} className="wechat-card border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          {index < workflowSteps.length - 1 && (
                            <div className="w-px h-8 bg-gray-200" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{step.name}</h4>
                            <div className="flex items-center gap-1">
                              {index > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => moveStep(step.id, 'up')}
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </Button>
                              )}
                              {index < workflowSteps.length - 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => moveStep(step.id, 'down')}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => editWorkflowStep(step)}
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              {workflowSteps.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                                  onClick={() => deleteWorkflowStep(step.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {step.description && (
                            <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{step.assignees.length > 0 ? `${step.assignees.length}人` : '未分配'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{step.estimatedDays}天</span>
                            </div>
                            {step.isRequired && (
                              <Badge variant="outline" className="text-xs h-5">
                                必需
                              </Badge>
                            )}
                          </div>

                          {step.assignees.length > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              {step.assignees.slice(0, 3).map(assigneeId => {
                                const member = teamMembers.find(m => m.id === assigneeId);
                                return member ? (
                                  <Avatar key={member.id} className="h-5 w-5">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback className="text-xs">
                                      {member.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : null;
                              })}
                              {step.assignees.length > 3 && (
                                <span className="text-xs text-gray-500 ml-1">
                                  +{step.assignees.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            <Card className="wechat-card border-0 shadow-sm bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">预估总时间</h4>
                    <p className="text-sm text-gray-600">根据各步骤时间计算</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold text-blue-600">
                      {calculateTotalDays()}天
                    </div>
                    <div className="text-xs text-gray-500">
                      {workflowSteps.length}个步骤
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Card className="wechat-card border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">流程信息确认</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">流程名称</span>
                    <span className="text-sm font-medium">{workflowData.name || '未设置'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">优先级</span>
                    <Badge variant="outline" className="text-xs">
                      {workflowData.priority === 'high' ? '高' : workflowData.priority === 'medium' ? '中' : '低'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">步骤数量</span>
                    <span className="text-sm font-medium">{workflowSteps.length}个</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">预估时间</span>
                    <span className="text-sm font-medium">{calculateTotalDays()}天</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="wechat-card border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">流程步骤预览</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {workflowSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{step.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{step.assignees.length}人参与</span>
                          <span>•</span>
                          <span>{step.estimatedDays}天</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">注意事项</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    创建后，您可以在流程管理中继续修改步骤设置和参与人员。请确认信息无误后点击创建。
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pb-20">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-semibold text-gray-900">自定义工作流程</h1>
        </div>
      </div>

      {/* 进度指示器 */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStepIndex 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index < currentStepIndex ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-px ${
                  index < currentStepIndex ? 'bg-blue-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div>
          <h2 className="font-medium text-gray-900">{steps[currentStepIndex].title}</h2>
          <p className="text-sm text-gray-600">{steps[currentStepIndex].description}</p>
        </div>
        <Progress value={((currentStepIndex + 1) / steps.length) * 100} className="mt-3" />
      </div>

      {/* 步骤内容 */}
      <div className="px-4 py-6">
        {renderStepContent()}
      </div>

      {/* 底部操作按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 wechat-safe-area">
        <div className="max-w-sm mx-auto">
          <div className="flex gap-3">
            {currentStepIndex > 0 && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
              >
                上一步
              </Button>
            )}
            
            {currentStepIndex < steps.length - 1 ? (
              <Button
                className="flex-1"
                onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                disabled={currentStepIndex === 0 && !workflowData.name.trim()}
              >
                下一步
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                className="flex-1"
                onClick={handleSaveWorkflow}
                disabled={!workflowData.name.trim()}
              >
                创建流程
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 步骤编辑弹窗 */}
      {editingStep && (
        <StepEditor
          step={editingStep}
          teamMembers={teamMembers}
          isOpen={showStepEditor}
          onClose={() => {
            setShowStepEditor(false);
            setEditingStep(null);
          }}
          onSave={updateWorkflowStep}
        />
      )}
    </div>
  );
}

interface StepEditorProps {
  step: WorkflowStep;
  teamMembers: TeamMember[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (step: WorkflowStep) => void;
}

function StepEditor({ step, teamMembers, isOpen, onClose, onSave }: StepEditorProps) {
  const [editedStep, setEditedStep] = useState<WorkflowStep>(step);
  const [showMemberSelector, setShowMemberSelector] = useState(false);

  const handleSave = () => {
    if (!editedStep.name.trim()) {
      toast.error('请输入步骤名称');
      return;
    }
    onSave(editedStep);
  };

  const toggleAssignee = (memberId: string) => {
    const isSelected = editedStep.assignees.includes(memberId);
    if (isSelected) {
      setEditedStep(prev => ({
        ...prev,
        assignees: prev.assignees.filter(id => id !== memberId)
      }));
    } else {
      if (editedStep.assigneeType === 'single' && editedStep.assignees.length >= 1) {
        setEditedStep(prev => ({
          ...prev,
          assignees: [memberId]
        }));
      } else {
        setEditedStep(prev => ({
          ...prev,
          assignees: [...prev.assignees, memberId]
        }));
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑步骤</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="stepName">步骤名称 *</Label>
            <Input
              id="stepName"
              placeholder="请输入步骤名称"
              value={editedStep.name}
              onChange={(e) => setEditedStep(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="stepDescription">步骤描述</Label>
            <Textarea
              id="stepDescription"
              placeholder="请描述这个步骤的具体内容"
              value={editedStep.description}
              onChange={(e) => setEditedStep(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>
          
          <div>
            <Label>预估时间</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                value={editedStep.estimatedDays}
                onChange={(e) => setEditedStep(prev => ({ ...prev, estimatedDays: parseInt(e.target.value) || 1 }))}
                className="w-20"
              />
              <span className="text-sm text-gray-600">天</span>
            </div>
          </div>
          
          <div>
            <Label>执行人设置</Label>
            <Select 
              value={editedStep.assigneeType} 
              onValueChange={(value: 'single' | 'multiple' | 'any') => {
                setEditedStep(prev => ({ 
                  ...prev, 
                  assigneeType: value,
                  assignees: value === 'single' ? prev.assignees.slice(0, 1) : prev.assignees
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">单人执行</SelectItem>
                <SelectItem value="multiple">多人协作</SelectItem>
                <SelectItem value="any">任意一人</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>参与人员</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMemberSelector(!showMemberSelector)}
              >
                选择人员
              </Button>
            </div>
            
            {editedStep.assignees.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {editedStep.assignees.map(assigneeId => {
                  const member = teamMembers.find(m => m.id === assigneeId);
                  return member ? (
                    <div key={member.id} className="flex items-center gap-2 bg-blue-50 rounded-full px-3 py-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-red-100"
                        onClick={() => toggleAssignee(member.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
            
            {showMemberSelector && (
              <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                {teamMembers.map(member => (
                  <div
                    key={member.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                      editedStep.assignees.includes(member.id) ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                    onClick={() => toggleAssignee(member.id)}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-xs">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.department} · {member.position}</p>
                    </div>
                    {editedStep.assignees.includes(member.id) && (
                      <Check className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <Label>必需步骤</Label>
            <Switch
              checked={editedStep.isRequired}
              onCheckedChange={(checked) => setEditedStep(prev => ({ ...prev, isRequired: checked }))}
            />
          </div>
          
          {editedStep.assigneeType === 'multiple' && (
            <div>
              <Label>审批方式</Label>
              <Select 
                value={editedStep.approvalType} 
                onValueChange={(value: 'sequential' | 'parallel') => 
                  setEditedStep(prev => ({ ...prev, approvalType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">依次审批</SelectItem>
                  <SelectItem value="parallel">同时审批</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              取消
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
            >
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}