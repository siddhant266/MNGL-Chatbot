import { Bell, ChevronDown, Menu, Search, User } from "lucide-react";

export function Header() {
    return (
        <header className="bg-[#0054A6] text-white shadow-lg sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-[#003d7a] py-2">
                <div className="container mx-auto px-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-300">24x7 Helpline: 1800-123-4567</span>
                        <span className="hidden md:inline text-gray-300">|</span>
                        <span className="hidden md:inline text-gray-300">Emergency: 1800-222-4567</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">
                            Contact Us
                        </a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">
                            FAQ
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <span className="text-[#0054A6] font-bold text-lg">MNGL</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="font-bold text-lg leading-tight">Maharashtra Natural Gas</h1>
                            <p className="text-xs text-blue-200">Fueling Progress, Powering Lives</p>
                        </div>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search services, bills, complaints..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Mobile Menu Button */}
                        <button className="lg:hidden text-white hover:bg-white/10 p-2 rounded-md transition-colors">
                            <Menu className="h-5 w-5" />
                        </button>

                        {/* Notifications */}
                        <button className="relative text-white hover:bg-white/10 p-2 rounded-md transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                                3
                            </span>
                        </button>

                        {/* User Menu */}
                        <div className="relative">
                            <button className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="hidden md:inline">John Doe</span>
                                <ChevronDown className="h-4 w-4" />
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    My Profile
                                </a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Account Settings
                                </a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Billing History
                                </a>
                                <div className="border-t my-1"></div>
                                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                    Logout
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className="bg-[#004080] hidden lg:block">
                <div className="container mx-auto px-4">
                    <ul className="flex items-center gap-1">
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors border-b-2 border-orange-400"
                            >
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors">
                                Pay Bill
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors">
                                Consumption History
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors">
                                Register Complaint
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors">
                                Safety Tips
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors">
                                Support
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className="lg:hidden bg-[#004080] p-4">
                <div className="space-y-2">
                    <a href="#" className="block py-2 px-4 text-sm font-medium hover:bg-white/10 rounded transition-colors border-l-2 border-orange-400">
                        Dashboard
                    </a>
                    <a href="#" className="block py-2 px-4 text-sm font-medium hover:bg-white/10 rounded transition-colors">
                        Pay Bill
                    </a>
                    <a href="#" className="block py-2 px-4 text-sm font-medium hover:bg-white/10 rounded transition-colors">
                        Consumption History
                    </a>
                    <a href="#" className="block py-2 px-4 text-sm font-medium hover:bg-white/10 rounded transition-colors">
                        Register Complaint
                    </a>
                    <a href="#" className="block py-2 px-4 text-sm font-medium hover:bg-white/10 rounded transition-colors">
                        Safety Tips
                    </a>
                    <a href="#" className="block py-2 px-4 text-sm font-medium hover:bg-white/10 rounded transition-colors">
                        Support
                    </a>
                </div>
            </div>
        </header>
    );
}