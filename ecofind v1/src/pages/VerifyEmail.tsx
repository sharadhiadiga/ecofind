import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Leaf, CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationEmail, user } = useAuth();
  const { toast } = useToast();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | 'expired'>('pending');
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      handleVerification();
    }
  }, [token]);

  const handleVerification = async () => {
    if (!token) return;
    
    setIsVerifying(true);
    try {
      const success = await verifyEmail(token);
      if (success) {
        setVerificationStatus('success');
        toast({
          title: "Email Verified!",
          description: "Your email has been successfully verified. You can now use all features of EcoFinds.",
        });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setVerificationStatus('error');
        toast({
          title: "Verification Failed",
          description: "The verification link is invalid or has expired. Please request a new one.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setVerificationStatus('error');
      toast({
        title: "Verification Error",
        description: "Something went wrong during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const success = await resendVerificationEmail();
      if (success) {
        toast({
          title: "Verification Email Sent",
          description: "A new verification email has been sent to your email address. Please check your inbox.",
        });
      } else {
        toast({
          title: "Failed to Send Email",
          description: "Unable to send verification email. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-eco-success mx-auto" />;
      case 'error':
      case 'expired':
        return <XCircle className="h-16 w-16 text-destructive mx-auto" />;
      default:
        return <Mail className="h-16 w-16 text-eco-primary mx-auto" />;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Email Verified Successfully!';
      case 'error':
        return 'Verification Failed';
      case 'expired':
        return 'Verification Link Expired';
      default:
        return 'Verifying Your Email...';
    }
  };

  const getStatusDescription = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Your email has been verified successfully. You will be redirected to the home page shortly.';
      case 'error':
        return 'The verification link is invalid or has expired. Please request a new verification email.';
      case 'expired':
        return 'This verification link has expired. Please request a new one to verify your email.';
      default:
        return 'Please wait while we verify your email address...';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4 py-8">
      <Card className="w-full max-w-md shadow-elevated animate-fade-in">
        <CardHeader className="space-y-8 pb-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-eco-primary/10 rounded-2xl">
              <Leaf className="h-12 w-12 text-eco-primary" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">
                {getStatusTitle()}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-2">
                {getStatusDescription()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <div className="flex flex-col items-center space-y-6">
            {getStatusIcon()}
            
            {verificationStatus === 'pending' && (
              <div className="flex items-center space-x-2 text-eco-primary">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Verifying...</span>
              </div>
            )}
            
            {(verificationStatus === 'error' || verificationStatus === 'expired') && (
              <div className="space-y-4 w-full">
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full h-12 bg-gradient-button hover:bg-gradient-button-hover text-white shadow-button hover:shadow-button-hover text-base font-semibold"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  className="w-full h-12"
                >
                  Back to Login
                </Button>
              </div>
            )}
            
            {verificationStatus === 'success' && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Redirecting you to the home page...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;