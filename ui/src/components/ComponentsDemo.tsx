import React, { useState } from 'react';
import { ArrowLeft, Palette, Grid, Layout, Settings, FileText, Navigation, CreditCard, User, Bell, Workflow, Lock, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import TaskCard from './TaskCard';
import WorkflowStatus from './WorkflowStatus';
import QuickActions from './QuickActions';
import BottomNavigation from './BottomNavigation';
import TopNavigation from './TopNavigation';
import MobileLayout from './MobileLayout';

// Mock data
const mockTask = {
  id: '1',
  title: '产品需求评审',
  description: '对新版本产品功能进行需求评审，确认技术实现方案',
  status: 'progress' as const,
  priority: 'high' as const,
  assignee: {
    name: '张三',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  },
  dueDate: '2025-06-25',
  createdAt: '2025-06-20',
  workflow: {
    currentStep: 2,
    totalSteps: 4,
    stepName: '技术评审'
  }
};

const mockWorkflowSteps = [
  {
    id: '1',
    name: '需求确认',
    status: 'completed' as const,
    assignee: {
      name: '产品经理',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    completedAt: '2025-06-20T10:30:00',
    comment: '需求已确认，可以进入下一步'
  },
  {
    id: '2',
    name: '技术评审',
    status: 'current' as const,
    assignee: {
      name: '技术负责人',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    }
  },
  {
    id: '3',
    name: '开发实现',
    status: 'pending' as const,
    assignee: {
      name: '开发工程师',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    }
  }
];

interface ComponentsDemoProps {
  onBack: () => void;
}

export default function ComponentsDemo({ onBack }: ComponentsDemoProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [sliderValue, setSliderValue] = useState([50]);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [radioValue, setRadioValue] = useState('option1');

  const componentSections = [
    {
      id: 'basic',
      title: '基础组件',
      icon: Grid,
      description: '按钮、输入框、标签等基础UI元素'
    },
    {
      id: 'form',
      title: '表单组件',
      icon: FileText,
      description: '表单控件、选择器、开关等交互元素'
    },
    {
      id: 'data',
      title: '数据展示',
      icon: CreditCard,
      description: '卡片、表格、列表等数据展示组件'
    },
    {
      id: 'navigation',
      title: '导航组件',
      icon: Navigation,
      description: '菜单、导航栏、面包屑等导航元素'
    },
    {
      id: 'feedback',
      title: '反馈组件',
      icon: Bell,
      description: '弹窗、提示、加载等反馈组件'
    },
    {
      id: 'business',
      title: '业务组件',
      icon: Workflow,
      description: '任务卡片、工作流状态等业务专用组件'
    }
  ];

  const colorPalette = [
    { name: 'Primary', value: 'bg-wechat-green', hex: '#07c160' },
    { name: 'Blue', value: 'bg-wechat-blue', hex: '#576b95' },
    { name: 'Orange', value: 'bg-wechat-orange', hex: '#fa9d3b' },
    { name: 'Red', value: 'bg-wechat-red', hex: '#fa5151' },
    { name: 'Gray', value: 'bg-wechat-gray', hex: '#888888' },
    { name: 'Background', value: 'bg-wechat-bg', hex: '#f5f5f7' },
    { name: 'Card', value: 'bg-wechat-card', hex: '#ffffff' }
  ];

  const statusColors = [
    { name: 'Pending', value: 'bg-status-pending', hex: '#f59e0b' },
    { name: 'Progress', value: 'bg-status-progress', hex: '#3b82f6' },
    { name: 'Completed', value: 'bg-status-completed', hex: '#10b981' },
    { name: 'Rejected', value: 'bg-status-rejected', hex: '#ef4444' }
  ];

  const renderBasicComponents = () => (
    <div className="space-y-6">
      {/* 颜色规范 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">颜色规范</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">主题色彩</h4>
            <div className="grid grid-cols-2 gap-3">
              {colorPalette.map((color) => (
                <div key={color.name} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <div className={`w-8 h-8 rounded-full ${color.value} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{color.name}</p>
                    <p className="text-xs text-gray-500 truncate">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">状态色彩</h4>
            <div className="grid grid-cols-2 gap-3">
              {statusColors.map((color) => (
                <div key={color.name} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <div className={`w-8 h-8 rounded-full ${color.value} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{color.name}</p>
                    <p className="text-xs text-gray-500 truncate">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 按钮组件 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">按钮组件</h3>
        <div className="grid grid-cols-2 gap-4">
          <Button className="w-full">默认按钮</Button>
          <Button variant="secondary" className="w-full">次要按钮</Button>
          <Button variant="outline" className="w-full">边框按钮</Button>
          <Button variant="destructive" className="w-full">危险按钮</Button>
          <Button variant="ghost" className="w-full">幽灵按钮</Button>
          <Button variant="link" className="w-full">链接按钮</Button>
        </div>
        <div className="space-y-2">
          <Button size="sm" className="w-full">小尺寸</Button>
          <Button size="default" className="w-full">默认尺寸</Button>
          <Button size="lg" className="w-full">大尺寸</Button>
        </div>
      </div>

      {/* 徽章组件 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">徽章组件</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>默认</Badge>
          <Badge variant="secondary">次要</Badge>
          <Badge variant="destructive">重要</Badge>
          <Badge variant="outline">轮廓</Badge>
          <Badge className="bg-wechat-green text-white">自定义</Badge>
        </div>
      </div>

      {/* 头像组件 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">头像组件</h3>
        <div className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
            <AvatarFallback>小</AvatarFallback>
          </Avatar>
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" />
            <AvatarFallback>中</AvatarFallback>
          </Avatar>
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face" />
            <AvatarFallback>大</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );

  const renderFormComponents = () => (
    <div className="space-y-6">
      {/* 输入框 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">输入框组件</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="input-default">默认输入框</Label>
            <Input id="input-default" placeholder="请输入内容" />
          </div>
          <div>
            <Label htmlFor="input-disabled">禁用状态</Label>
            <Input id="input-disabled" placeholder="禁用状态" disabled />
          </div>
          <div>
            <Label htmlFor="textarea">文本域</Label>
            <Textarea id="textarea" placeholder="请输入多行文本" />
          </div>
        </div>
      </div>

      {/* 选择器 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">选择器组件</h3>
        <div className="space-y-3">
          <div>
            <Label>下拉选择</Label>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger>
                <SelectValue placeholder="请选择选项" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">选项一</SelectItem>
                <SelectItem value="option2">选项二</SelectItem>
                <SelectItem value="option3">选项三</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>单选按钮组</Label>
            <RadioGroup value={radioValue} onValueChange={setRadioValue}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="r1" />
                <Label htmlFor="r1">选项一</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="r2" />
                <Label htmlFor="r2">选项二</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option3" id="r3" />
                <Label htmlFor="r3">选项三</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* 开关和复选框 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">开关组件</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} />
            <Label>开关状态: {switchChecked ? '开启' : '关闭'}</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox checked={checkboxChecked} onCheckedChange={setCheckboxChecked} />
            <Label>复选框选项</Label>
          </div>
        </div>
      </div>

      {/* 滑块 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">滑块组件</h3>
        <div className="space-y-3">
          <Label>数值滑块: {sliderValue[0]}</Label>
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* 进度条 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">进度条组件</h3>
        <div className="space-y-3">
          <div>
            <Label>进度条 25%</Label>
            <Progress value={25} className="w-full" />
          </div>
          <div>
            <Label>进度条 60%</Label>
            <Progress value={60} className="w-full" />
          </div>
          <div>
            <Label>进度条 85%</Label>
            <Progress value={85} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataComponents = () => (
    <div className="space-y-6">
      {/* 卡片组件 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">卡片组件</h3>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>卡片标题</CardTitle>
              <CardDescription>这是卡片的描述信息</CardDescription>
            </CardHeader>
            <CardContent>
              <p>卡片内容区域，可以放置任何内容</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-wechat-green to-wechat-blue text-white">
            <CardHeader>
              <CardTitle>渐变卡片</CardTitle>
              <CardDescription className="text-white/80">具有渐变背景的卡片</CardDescription>
            </CardHeader>
            <CardContent>
              <p>支持自定义样式和颜色</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 表格组件 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">表格组件</h3>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>职位</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>张三</TableCell>
                <TableCell>产品经理</TableCell>
                <TableCell><Badge className="bg-status-completed text-white">在线</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>李四</TableCell>
                <TableCell>UI设计师</TableCell>
                <TableCell><Badge className="bg-status-pending text-white">忙碌</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>王五</TableCell>
                <TableCell>开发工程师</TableCell>
                <TableCell><Badge className="bg-status-rejected text-white">离线</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 骨架屏 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">骨架屏组件</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNavigationComponents = () => (
    <div className="space-y-6">
      {/* 选项卡 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">选项卡组件</h3>
        <Tabs defaultValue="tab1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tab1">选项卡1</TabsTrigger>
            <TabsTrigger value="tab2">选项卡2</TabsTrigger>
            <TabsTrigger value="tab3">选项卡3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="p-4 bg-white rounded-lg border">
            <h4 className="font-medium mb-2">选项卡1内容</h4>
            <p className="text-sm text-gray-600">这是第一个选项卡的内容区域</p>
          </TabsContent>
          <TabsContent value="tab2" className="p-4 bg-white rounded-lg border">
            <h4 className="font-medium mb-2">选项卡2内容</h4>
            <p className="text-sm text-gray-600">这是第二个选项卡的内容区域</p>
          </TabsContent>
          <TabsContent value="tab3" className="p-4 bg-white rounded-lg border">
            <h4 className="font-medium mb-2">选项卡3内容</h4>
            <p className="text-sm text-gray-600">这是第三个选项卡的内容区域</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* 折叠面板 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">折叠面板组件</h3>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>常见问题1</AccordionTrigger>
            <AccordionContent>
              这是第一个常见问题的答案内容，可以包含详细的说明和解释。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>常见问题2</AccordionTrigger>
            <AccordionContent>
              这是第二个常见问题的答案内容，支持多行文本和富文本格式。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>常见问题3</AccordionTrigger>
            <AccordionContent>
              这是第三个常见问题的答案内容，可以根据需要添加更多信息。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* 分隔符 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">分隔符组件</h3>
        <div>
          <p>上方内容</p>
          <Separator className="my-4" />
          <p>下方内容</p>
        </div>
      </div>
    </div>
  );

  const renderFeedbackComponents = () => (
    <div className="space-y-6">
      {/* 提示组件 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">提示组件</h3>
        <div className="space-y-3">
          <Alert>
            <AlertTitle>提示</AlertTitle>
            <AlertDescription>这是一个普通的提示信息</AlertDescription>
          </Alert>
          
          <Alert className="border-wechat-green bg-green-50">
            <AlertTitle className="text-wechat-green">成功</AlertTitle>
            <AlertDescription className="text-green-700">操作已成功完成</AlertDescription>
          </Alert>
          
          <Alert className="border-wechat-orange bg-orange-50">
            <AlertTitle className="text-wechat-orange">警告</AlertTitle>
            <AlertDescription className="text-orange-700">请注意相关风险</AlertDescription>
          </Alert>
          
          <Alert className="border-wechat-red bg-red-50">
            <AlertTitle className="text-wechat-red">错误</AlertTitle>
            <AlertDescription className="text-red-700">操作失败，请重试</AlertDescription>
          </Alert>
        </div>
      </div>

      {/* 弹窗组件 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">弹窗组件</h3>
        <div className="grid grid-cols-2 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">打开对话框</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>对话框标题</DialogTitle>
                <DialogDescription>这是对话框的描述信息</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>对话框内容区域</p>
              </div>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">打开侧边栏</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>侧边栏标题</SheetTitle>
                <SheetDescription>这是侧边栏的描述信息</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <p>侧边栏内容区域</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* 气泡提示 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">气泡提示组件</h3>
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">显示气泡提示</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">气泡提示</h4>
                <p className="text-sm text-gray-600">这是一个气泡提示的内容示例</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );

  const renderBusinessComponents = () => (
    <div className="space-y-6">
      {/* 任务卡片 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">任务卡片组件</h3>
        <TaskCard task={mockTask} onTaskClick={() => {}} />
      </div>

      {/* 工作流状态 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">工作流状态组件</h3>
        <div className="bg-white rounded-lg p-4">
          <WorkflowStatus steps={mockWorkflowSteps} title="审批流程" />
        </div>
      </div>

      {/* 快速操作 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">快速操作组件</h3>
        <QuickActions onActionClick={() => {}} />
      </div>

      {/* 顶部导航 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">顶部导航组件</h3>
        <div className="bg-white rounded-lg overflow-hidden">
          <TopNavigation 
            onSearch={() => {}}
            onFilter={() => {}}
            activeFilters={2}
          />
        </div>
      </div>

      {/* 底部导航 */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">底部导航组件</h3>
        <div className="bg-white rounded-lg overflow-hidden">
          <BottomNavigation 
            activeTab="home"
            onTabChange={() => {}}
            messageCount={5}
          />
        </div>
      </div>
    </div>
  );

  return (
    <MobileLayout>
      {/* 头部 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="font-medium text-gray-900">组件展示</h1>
            <p className="text-sm text-gray-500">Easy ERP 设计系统</p>
          </div>
          <Palette className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* 组件分类选项卡 */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="flex space-x-1 overflow-x-auto">
          {componentSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === section.id
                    ? 'bg-wechat-green text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{section.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 px-4 py-4 pb-20">
        <div className="mb-4">
          <h2 className="font-medium text-gray-900 mb-1">
            {componentSections.find(s => s.id === activeTab)?.title}
          </h2>
          <p className="text-sm text-gray-500">
            {componentSections.find(s => s.id === activeTab)?.description}
          </p>
        </div>

        <div className="space-y-8">
          {activeTab === 'basic' && renderBasicComponents()}
          {activeTab === 'form' && renderFormComponents()}
          {activeTab === 'data' && renderDataComponents()}
          {activeTab === 'navigation' && renderNavigationComponents()}
          {activeTab === 'feedback' && renderFeedbackComponents()}
          {activeTab === 'business' && renderBusinessComponents()}
        </div>
      </div>
    </MobileLayout>
  );
}