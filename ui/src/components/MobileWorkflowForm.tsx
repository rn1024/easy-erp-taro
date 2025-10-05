import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Calendar, 
  Users, 
  AlertCircle, 
  ChevronRight,
  X,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  steps: number;
  estimatedTime: string;
  category: string;
  popularity: number;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  department: string;
  position: string;
}

interface MobileWorkflowFormProps {
  template: WorkflowTemplate;
  onBack: () => void;
  onComplete: () => void;
}

export default function MobileWorkflowForm({ template, onBack, onComplete }: MobileWorkflowFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium',
    assignees: [] as string[],
    dueDate: '',
    startDate: ''
  });

  const [showMemberSelector, setShowMemberSelector] = useState(false);

  const teamMembers: TeamMember[] = [
    { 
      id: '1', 
      name: '张三', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      department: '产品部',
      position: '产品经理'
    },
    { 
      id: '2', 
      name: '李四', 
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      department: '设计部',
      position: 'UI设计师'
    },
    { 
      id: '3', 
      name: '王五', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      department: '技术部',
      position: '开发工程师'
    },
    { 
      id: '4', 
      name: '赵六', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      department: '测试部',
      position: '测试工程师'
    },
    { 
      id: '5', 
      name: '刘七', 
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      department: '运营部',
      position: '运营专员'
    },
    { 
      id: '6', 
      name: '陈八', 
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
      department: '市场部',
      position: '市场专员'
    }
  ];

  const steps = [
    { title: '基本信息', description: '设置流程名称和描述' },
    { title: '参与人员', description: '选择工作流程参与人员' },
    { title: '时间安排', description: '设置开始和截止时间' },
    { title: '确认创建', description: '检查信息并创建流程' }
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAssignee = (memberId: string) => {
    const isSelected = formData.assignees.includes(memberId);
    if (isSelected) {
      updateFormData('assignees', formData.assignees.filter(id => id !== memberId));
    } else {
      updateFormData('assignees', [...formData.assignees, memberId]);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim().length > 0;
      case 1:
        return formData.assignees.length > 0;
      case 2:
        return formData.dueDate !== '';
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      toast.error('请完成当前步骤的必填信息');
    }
  };

  const handleSubmit = () => {
    const workflowData = {
      ...formData,
      template: template.id,
      templateName: template.name,
      createdAt: new Date().toISOString()
    };
    
    console.log('Creating workflow:', workflowData);
    toast.success('工作流程创建成功！');
    onComplete();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <Card className="wechat-card border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${template.bgColor} flex items-center justify-center`}>
                    <template.icon className={`h-5 w-5 ${template.color}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.category} • {template.estimatedTime}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div>
                <Label htmlFor="workflowName" className="text-base">流程名称 *</Label>
                <Input
                  id="workflowName"
                  placeholder="请输入工作流程名称"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="mt-2 h-12 text-base"
                />
              </div>

              <div>
                <Label htmlFor="workflowDescription" className="text-base">流程描述</Label>
                <Textarea
                  id="workflowDescription"
                  placeholder="请描述这个工作流程的目的和内容"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={4}
                  className="mt-2 text-base"
                />
              </div>

              <div>
                <Label className="text-base">优先级</Label>
                <Select value={formData.priority} onValueChange={(value) => updateFormData('priority', value)}>
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">高优先级</SelectItem>
                    <SelectItem value="medium">中优先级</SelectItem>
                    <SelectItem value="low">低优先级</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">选择参与人员</h3>
              <Badge variant="outline" className="text-sm">
                已选 {formData.assignees.length} 人
              </Badge>
            </div>

            {formData.assignees.length > 0 && (
              <Card className="wechat-card border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">已选择的成员</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.assignees.map(assigneeId => {
                      const member = teamMembers.find(m => m.id === assigneeId);
                      return member ? (
                        <div key={member.id} className="flex items-center gap-2 bg-blue-50 rounded-full px-3 py-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="text-xs">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{member.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 hover:bg-red-100"
                            onClick={() => toggleAssignee(member.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="wechat-card border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">团队成员</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-80">
                  {teamMembers.map((member, index) => (
                    <div key={member.id}>
                      <div
                        className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                          formData.assignees.includes(member.id) 
                            ? 'bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleAssignee(member.id)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-500">{member.department} · {member.position}</p>
                        </div>
                        {formData.assignees.includes(member.id) && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      {index < teamMembers.length - 1 && (
                        <div className="mx-4 border-b border-gray-100" />
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="font-medium text-gray-900">设置时间安排</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="startDate" className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  开始日期
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                  className="mt-2 h-12 text-base"
                />
              </div>

              <div>
                <Label htmlFor="dueDate" className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  截止日期 *
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => updateFormData('dueDate', e.target.value)}
                  className="mt-2 h-12 text-base"
                />
              </div>
            </div>

            <Card className="wechat-card border-0 shadow-sm bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">预估工作时间</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      根据"{template.name}"模板，预估需要 {template.estimatedTime} 完成
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="font-medium text-gray-900">确认流程信息</h3>

            <Card className="wechat-card border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">流程概览</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">流程名称</span>
                  <span className="text-sm font-medium text-right max-w-48">
                    {formData.name || '未设置'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">使用模板</span>
                  <Badge variant="outline" className="text-xs">
                    {template.name}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">优先级</span>
                  <Badge 
                    variant={formData.priority === 'high' ? 'destructive' : formData.priority === 'medium' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {formData.priority === 'high' ? '高' : formData.priority === 'medium' ? '中' : '低'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">参与人员</span>
                  <span className="text-sm font-medium">{formData.assignees.length} 人</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">截止日期</span>
                  <span className="text-sm font-medium">
                    {formData.dueDate || '未设置'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {formData.assignees.length > 0 && (
              <Card className="wechat-card border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">参与成员</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.assignees.map(assigneeId => {
                      const member = teamMembers.find(m => m.id === assigneeId);
                      return member ? (
                        <div key={member.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="text-xs">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">温馨提示</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    流程创建后，系统将自动通知所有参与人员，并开始执行工作流程。
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
    <div className="pb-24">
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
          <h1 className="font-semibold text-gray-900">创建工作流程</h1>
        </div>
      </div>

      {/* 进度指示器 */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep 
                  ? index === currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-px ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div>
          <h2 className="font-medium text-gray-900">{steps[currentStep].title}</h2>
          <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
        </div>
      </div>

      {/* 步骤内容 */}
      <div className="px-4 py-6">
        {renderStepContent()}
      </div>

      {/* 底部操作按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 wechat-safe-area">
        <div className="max-w-sm mx-auto">
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                上一步
              </Button>
            )}
            
            <Button
              className={`h-12 ${currentStep === 0 ? 'w-full' : 'flex-1'}`}
              onClick={handleNext}
              disabled={!validateCurrentStep()}
            >
              {currentStep === steps.length - 1 ? '创建流程' : '下一步'}
              {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}