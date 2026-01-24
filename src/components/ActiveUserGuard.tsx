import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Shield, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ActiveUserGuardProps {
  children: ReactNode;
  requireActive?: boolean;
}

export const ActiveUserGuard = ({ 
  children, 
  requireActive = true 
}: ActiveUserGuardProps) => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading your account...</p>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  // If user is not active and we require active status
  if (requireActive && !user.isActive) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Account Suspended</CardTitle>
            <CardDescription>
              Your account has been temporarily suspended
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Hello <span className="font-semibold">{user.firstName} {user.lastName}</span>, 
                your account access has been restricted.
              </p>
              <p className="text-sm text-muted-foreground">
                Account: {user.accountNumber} • Status: Suspended
              </p>
            </div>

            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm mb-2">What does this mean?</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>You can log in and view your account information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>You cannot make transfers or withdrawals</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>You cannot request new cards or services</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Your existing cards may be temporarily frozen</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Common reasons for suspension:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Unusual account activity detected</li>
                <li>• Required verification documents pending</li>
                <li>• Account under security review</li>
                <li>• Payment or fee overdue</li>
                <li>• Terms of service compliance issue</li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-3">Contact Support</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email Support</p>
                    <p className="text-xs text-muted-foreground">support@ronstonebank.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone Support</p>
                    <p className="text-xs text-muted-foreground">1-800-555-1234 (24/7)</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => navigate('/support')}
            >
              Contact Support Center
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={logout}
            >
              Log Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If user is active, render children
  return <>{children}</>;
};