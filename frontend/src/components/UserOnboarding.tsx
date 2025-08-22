import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from './ui/dialog';
import { 
  Wallet, 
  Award, 
  Users, 
  QrCode, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Play,
  BookOpen,
  Zap
} from 'lucide-react';
import { WalletConnection } from './WalletConnection';
import { usePolkadot } from '@/contexts/PolkadotContext';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  completed?: boolean;
}

interface UserOnboardingProps {
  trigger?: React.ReactNode;
  onComplete?: () => void;
}

export const UserOnboarding: React.FC<UserOnboardingProps> = ({ trigger, onComplete }) => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { isWalletConnected } = usePolkadot();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to DotPOAP',
      description: 'Learn how to collect and create POAPs on Polkadot',
      icon: <Award className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Welcome to DotPOAP!</h3>
            <p className="text-muted-foreground">
              DotPOAP brings Proof of Attendance Protocol to the Polkadot ecosystem. 
              Collect unique NFT badges that prove your participation in events and achievements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium">For Collectors</h4>
              <p className="text-sm text-muted-foreground">Discover events and collect POAPs</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium">For Creators</h4>
              <p className="text-sm text-muted-foreground">Create events and distribute POAPs</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <QrCode className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium">Easy Distribution</h4>
              <p className="text-sm text-muted-foreground">QR codes and claim links</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'wallet',
      title: 'Connect Your Wallet',
      description: 'Connect a Polkadot wallet to start collecting POAPs',
      icon: <Wallet className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <Wallet className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              To collect and manage POAPs, you'll need to connect a Polkadot-compatible wallet.
            </p>
          </div>

          {!isWalletConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Supported Wallets:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                  <div>• Polkadot.js Extension</div>
                  <div>• Talisman</div>
                  <div>• SubWallet</div>
                  <div>• Nova Wallet</div>
                </div>
              </div>
              
              <WalletConnection />
            </div>
          ) : (
            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h4 className="font-medium text-green-900 mb-2">Wallet Connected!</h4>
              <p className="text-sm text-green-800">
                Your wallet is connected and ready to use. You can now collect POAPs!
              </p>
            </div>
          )}
        </div>
      ),
      completed: isWalletConnected
    },
    {
      id: 'collecting',
      title: 'Collecting POAPs',
      description: 'Learn how to discover and collect POAPs',
      icon: <Award className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <Award className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">How to Collect POAPs</h3>
            <p className="text-muted-foreground">
              There are several ways to collect POAPs on DotPOAP
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Browse Events</h4>
                <p className="text-sm text-muted-foreground">
                  Visit the Events page to discover upcoming and ongoing events
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Attend Events</h4>
                <p className="text-sm text-muted-foreground">
                  Participate in physical or virtual events to become eligible for POAPs
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Claim Your POAP</h4>
                <p className="text-sm text-muted-foreground">
                  Scan QR codes or use claim links provided by event organizers
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'creating',
      title: 'Creating Events',
      description: 'Learn how to create events and distribute POAPs',
      icon: <Users className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <Users className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Creating Events</h3>
            <p className="text-muted-foreground">
              Organize events and distribute POAPs to your community
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Plan Your Event</h4>
                <p className="text-sm text-muted-foreground">
                  Define event details, dates, and POAP design
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Create Event</h4>
                <p className="text-sm text-muted-foreground">
                  Use the Create Event form to set up your event on-chain
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Distribute POAPs</h4>
                <p className="text-sm text-muted-foreground">
                  Generate QR codes or claim links to distribute to attendees
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOpen(false);
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <BookOpen className="h-4 w-4 mr-2" />
            Getting Started
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Getting Started with DotPOAP
          </DialogTitle>
          <DialogDescription>
            Learn how to use DotPOAP in just a few simple steps
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                index === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index < currentStep || step.completed
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {step.completed && index !== currentStep ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                step.icon
              )}
              <span className="hidden sm:inline">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStepData.icon}
              {currentStepData.title}
            </CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStepData.content}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
