import { Outlet, useLocation } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

const AuthLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname.includes('login');
  
  return (
    <div className="min-h-dvh w-full flex border-gray-600  ">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center relative overflow-hidden border-r border-border p-12 text-foreground w-[50%]">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
            <img 
                src="/auth-cover.png" 
                alt="Background" 
                className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90 backdrop-blur-sm" />
        </div>
        
        {/* Decorative Elements (Optional - kept subtle) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50 z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-50 z-0"></div>
        
        <div className="max-w-sm space-y-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 ring-4 ring-primary/10 backdrop-blur-md bg-white/10">
              <Logo className="w-9 h-9 text-primary-foreground" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-sm">
              Chattr
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              {isLogin 
                ? 'Welcome back! Sign in to continue your conversations.' 
                : 'Join today and start connecting with friends.'}
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <span className="px-4 py-2 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20 backdrop-blur-md">
              Secure
            </span>
            <span className="px-4 py-2 bg-accent/10 text-accent text-xs font-medium rounded-full border border-accent/20 backdrop-blur-md">
              Real-time
            </span>
            <span className="px-4 py-2 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20 backdrop-blur-md">
              Fast
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex items-center justify-center p-6 sm:p-12 w-full lg:w-[50%]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Logo className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Chattr</h2>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
