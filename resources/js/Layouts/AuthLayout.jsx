import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Hero Image */}
            <div className="hidden lg:flex lg:w-2/3 relative overflow-hidden items-center justify-center">

                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat  bg-gradient-to-br from-[#7f0b1a] to-[#3f154f] "

                />

                <div className="relative  p-12 text-center text-white">

                    <div className="max-w-md flex flex-col justify-center items-center space-y-6 animate-float">
                        <ApplicationLogo className="relative w-60 h-full " />
                        <h1 className="text-4xl font-bold text-foreground">
                            Discover Amazing Events
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Join thousands of event enthusiasts and never miss out on incredible experiences
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span>10K+ Events</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                <span>50K+ Users</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-[#7f0b1a] to-[#3f154f]  lg:bg-white lg:bg-none">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>

    );
}
