import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Plus, DollarSign, CreditCard } from 'lucide-react';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits: number;
  requiredCredits: number;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ 
  isOpen, 
  onClose, 
  currentCredits, 
  requiredCredits 
}) => {
  const shortBy = requiredCredits - currentCredits;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            积分不足
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            生成此图像需要 {requiredCredits} 积分，但您目前只有 {currentCredits} 积分。
          </p>
          
          {/* 积分详情 */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">当前积分:</span>
              <span className="font-semibold">{currentCredits}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">需要积分:</span>
              <span className="font-semibold text-red-600">{requiredCredits}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">缺少:</span>
              <span className="font-semibold text-red-600">{shortBy}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => {
                // 跳转到定价页面
                window.location.href = '/pricing';
                onClose();
              }}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              选择订阅方案
            </Button>
            
            <div className="text-center text-gray-500 text-sm">或</div>
            
            <Button
              onClick={() => {
                // 跳转到定价页面
                window.location.href = '/pricing';
                onClose();
              }}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              购买积分包
            </Button>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              稍后再说
            </Button>
            <Button 
              onClick={() => {
                window.location.href = '/pricing';
                onClose();
              }}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              立即购买
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
