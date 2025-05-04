"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Plus,
    Users,
    Bell,
    CheckCircle,
    X,
    Settings,
    Clock,
    MapPin,
    MessageCircle,
    User,
    Menu,
    XCircle,
    Info,
} from "lucide-react";
import { format, addMonths, subMonths, addDays, isToday, isSameMonth, isSameDay, parseISO } from "date-fns";

// Type definitions
interface Attendee {
    id: string;
    name: string;
    avatar: string;
    status: "going" | "maybe" | "declined";
}

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: "social" | "work" | "outdoor" | "cultural";
    creator: string;
    attendees: Attendee[];
}

interface Notification {
    id: string;
    message: string;
    time: string;
    read: boolean;
}

interface User {
    id: string;
    name: string;
    avatar: string;
    email?: string;
    role?: "admin" | "member";
}

interface CategoryColors {
    bg: string;
    text: string;
    border: string;
}

interface NewEventForm {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: "social" | "work" | "outdoor" | "cultural";
}

// Mock data with types
const MOCK_EVENTS: Event[] = [
    {
        id: "1",
        title: "Team Lunch",
        description: "Monthly team lunch at Italia Restaurant",
        date: "2025-05-10T12:30:00",
        location: "Italia Restaurant, Downtown",
        category: "social",
        creator: "Alex Morgan",
        attendees: [
            { id: "u1", name: "Alex Morgan", avatar: "https://randomuser.me/api/portraits/women/44.jpg", status: "going" },
            { id: "u2", name: "Jamie Smith", avatar: "https://randomuser.me/api/portraits/men/32.jpg", status: "going" },
            { id: "u3", name: "Taylor Reed", avatar: "https://randomuser.me/api/portraits/women/67.jpg", status: "maybe" },
            { id: "u4", name: "Jordan Blake", avatar: "https://randomuser.me/api/portraits/men/75.jpg", status: "going" },
            { id: "u5", name: "Casey Jones", avatar: "https://randomuser.me/api/portraits/women/25.jpg", status: "declined" },
        ],
    },
    // ... (other events remain the same, just with TypeScript type checking)
    {
        id: "2",
        title: "Project Planning",
        description: "Quarterly planning session for Q3 projects",
        date: "2025-05-15T10:00:00",
        location: "Conference Room A",
        category: "work",
        creator: "Jamie Smith",
        attendees: [
            { id: "u1", name: "Alex Morgan", avatar: "https://randomuser.me/api/portraits/women/44.jpg", status: "going" },
            { id: "u2", name: "Jamie Smith", avatar: "https://randomuser.me/api/portraits/men/32.jpg", status: "going" },
            { id: "u3", name: "Taylor Reed", avatar: "https://randomuser.me/api/portraits/women/67.jpg", status: "going" },
            { id: "u5", name: "Casey Jones", avatar: "https://randomuser.me/api/portraits/women/25.jpg", status: "going" },
        ],
    },
    {
        id: "3",
        title: "Game Night",
        description: "Board games and snacks at my place",
        date: "2025-05-18T18:00:00",
        location: "Alex's Apartment",
        category: "social",
        creator: "Taylor Reed",
        attendees: [
            { id: "u1", name: "Alex Morgan", avatar: "https://randomuser.me/api/portraits/women/44.jpg", status: "going" },
            { id: "u3", name: "Taylor Reed", avatar: "https://randomuser.me/api/portraits/women/67.jpg", status: "going" },
            { id: "u4", name: "Jordan Blake", avatar: "https://randomuser.me/api/portraits/men/75.jpg", status: "maybe" },
        ],
    },
    {
        id: "4",
        title: "Weekend Hike",
        description: "Easy trail with beautiful views, about 2 hours",
        date: "2025-05-20T09:00:00",
        location: "Sunset Trail, North Park",
        category: "outdoor",
        creator: "Jordan Blake",
        attendees: [
            { id: "u2", name: "Jamie Smith", avatar: "https://randomuser.me/api/portraits/men/32.jpg", status: "maybe" },
            { id: "u3", name: "Taylor Reed", avatar: "https://randomuser.me/api/portraits/women/67.jpg", status: "going" },
            { id: "u4", name: "Jordan Blake", avatar: "https://randomuser.me/api/portraits/men/75.jpg", status: "going" },
            { id: "u5", name: "Casey Jones", avatar: "https://randomuser.me/api/portraits/women/25.jpg", status: "declined" },
        ],
    },
    {
        id: "5",
        title: "Book Club",
        description: "Discussing 'The Midnight Library'",
        date: "2025-05-25T19:00:00",
        location: "City Library, Room 3",
        category: "cultural",
        creator: "Casey Jones",
        attendees: [
            { id: "u1", name: "Alex Morgan", avatar: "https://randomuser.me/api/portraits/women/44.jpg", status: "going" },
            { id: "u3", name: "Taylor Reed", avatar: "https://randomuser.me/api/portraits/women/67.jpg", status: "going" },
            { id: "u5", name: "Casey Jones", avatar: "https://randomuser.me/api/portraits/women/25.jpg", status: "going" },
        ],
    },
    {
        id: "6",
        title: "Morning Coffee Chat",
        description: "Casual coffee meetup to discuss upcoming projects",
        date: "2025-05-07T08:30:00",
        location: "Bean There Café",
        category: "social",
        creator: "Alex Morgan",
        attendees: [
            { id: "u1", name: "Alex Morgan", avatar: "https://randomuser.me/api/portraits/women/44.jpg", status: "going" },
            { id: "u2", name: "Jamie Smith", avatar: "https://randomuser.me/api/portraits/men/32.jpg", status: "going" },
        ],
    },
    {
        id: "7",
        title: "Product Demo",
        description: "Demo of the new features from the dev team",
        date: "2025-05-12T14:00:00",
        location: "Meeting Room B",
        category: "work",
        creator: "Jamie Smith",
        attendees: [
            { id: "u1", name: "Alex Morgan", avatar: "https://randomuser.me/api/portraits/women/44.jpg", status: "going" },
            { id: "u2", name: "Jamie Smith", avatar: "https://randomuser.me/api/portraits/men/32.jpg", status: "going" },
            { id: "u3", name: "Taylor Reed", avatar: "https://randomuser.me/api/portraits/women/67.jpg", status: "going" },
            { id: "u4", name: "Jordan Blake", avatar: "https://randomuser.me/api/portraits/men/75.jpg", status: "going" },
            { id: "u5", name: "Casey Jones", avatar: "https://randomuser.me/api/portraits/women/25.jpg", status: "maybe" },
        ],
    },
];

const CURRENT_USER: User = {
    id: "u1",
    name: "Alex Morgan",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    email: "alex.morgan@example.com",
};

const GROUP_MEMBERS: User[] = [
    {
        id: "u1",
        name: "Alex Morgan",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        role: "admin",
    },
    {
        id: "u2",
        name: "Jamie Smith",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        role: "member",
    },
    {
        id: "u3",
        name: "Taylor Reed",
        avatar: "https://randomuser.me/api/portraits/women/67.jpg",
        role: "member",
    },
    {
        id: "u4",
        name: "Jordan Blake",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
        role: "member",
    },
    {
        id: "u5",
        name: "Casey Jones",
        avatar: "https://randomuser.me/api/portraits/women/25.jpg",
        role: "member",
    },
];

// Color utilities
const categoryColors: Record<string, CategoryColors> = {
    social: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
    work: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
    outdoor: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
    cultural: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
};

const getCategoryColors = (category: string): CategoryColors => {
    return categoryColors[category] || { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" };
};

const statusColors: Record<string, string> = {
    going: "bg-green-500",
    maybe: "bg-yellow-500",
    declined: "bg-red-500",
};

// Component
const GroupEventPlanner: React.FC = () => {
    // State with TypeScript types
    const [currentView, setCurrentView] = useState<"calendar" | "events" | "suggestions">("calendar");
    const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showEventForm, setShowEventForm] = useState<boolean>(false);
    const [showEventDetails, setShowEventDetails] = useState<boolean>(false);
    const [newEvent, setNewEvent] = useState<NewEventForm>({
        title: "",
        description: "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "12:00",
        location: "",
        category: "social",
    });
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "n1",
            message: "Jamie Smith RSVP'd to Team Lunch",
            time: "5 minutes ago",
            read: false,
        },
        {
            id: "n2",
            message: "New event: Game Night created by Taylor",
            time: "1 hour ago",
            read: false,
        },
        {
            id: "n3",
            message: "Reminder: Project Planning tomorrow at 10 AM",
            time: "3 hours ago",
            read: true,
        },
    ]);
    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

    // Handler for RSVP status changes
    const handleRSVP = (eventId: string, status: "going" | "maybe" | "declined"): void => {
        setEvents(
            events.map((event) => {
                if (event.id === eventId) {
                    const updatedAttendees = event.attendees.map((attendee) => {
                        if (attendee.id === CURRENT_USER.id) {
                            return { ...attendee, status };
                        }
                        return attendee;
                    });
                    return { ...event, attendees: updatedAttendees };
                }
                return event;
            })
        );
        setShowEventDetails(false);

        const event = events.find(e => e.id === eventId);
        if (event) {
            const newNotification: Notification = {
                id: `n${Date.now()}`,
                message: `You RSVP'd ${status} to ${event.title}`,
                time: "Just now",
                read: false
            };
            setNotifications([newNotification, ...notifications]);
        }
    };

    // Function to navigate between months
    const navigateMonth = (direction: "next" | "prev"): void => {
        setCurrentMonth(direction === "next" ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1));
    };

    // Function to handle new event submission
    const handleSubmitEvent = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const eventDateTime = `${newEvent.date}T${newEvent.time}:00`;
        const newEventObj: Event = {
            id: `${events.length + 1}`,
            title: newEvent.title,
            description: newEvent.description,
            date: eventDateTime,
            location: newEvent.location,
            category: newEvent.category,
            creator: CURRENT_USER.name,
            attendees: [{ ...CURRENT_USER, status: "going" }],
        };

        setEvents([...events, newEventObj]);

        setNewEvent({
            title: "",
            description: "",
            date: format(new Date(), "yyyy-MM-dd"),
            time: "12:00",
            location: "",
            category: "social",
        });
        setShowEventForm(false);

        const newNotification: Notification = {
            id: `n${Date.now()}`,
            message: `You created a new event: ${newEventObj.title}`,
            time: "Just now",
            read: false
        };
        setNotifications([newNotification, ...notifications]);
    };

    // Mark all notifications as read
    const markAllNotificationsAsRead = (): void => {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    };

    // Generate calendar days
    const generateCalendarDays = (): Date[] => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const days: Date[] = [];
        let day = startDate;

        for (let i = 0; i < 42; i++) {
            days.push(new Date(day));
            day = addDays(day, 1);
        }

        return days;
    };

    // Filter events for a specific day
    const getEventsForDay = (day: Date): Event[] => {
        return events.filter(event => {
            const eventDate = parseISO(event.date);
            return isSameDay(eventDate, day);
        });
    };

    const getEventStatusCounts = (event: Event): { going: number; maybe: number; declined: number } => {
        const going = event.attendees.filter(a => a.status === "going").length;
        const maybe = event.attendees.filter(a => a.status === "maybe").length;
        const declined = event.attendees.filter(a => a.status === "declined").length;
        return { going, maybe, declined };
    };

    const getCurrentUserRSVP = (event: Event): string | null => {
        const attendee = event.attendees.find(a => a.id === CURRENT_USER.id);
        return attendee ? attendee.status : null;
    };

    // Handle clicking on a date in the calendar
    const handleDateClick = (day: Date): void => {
        setSelectedDate(day);
        const eventsOnDay = getEventsForDay(day);
        if (eventsOnDay.length === 1) {
            setSelectedEvent(eventsOnDay[0]);
            setShowEventDetails(true);
        } else if (eventsOnDay.length > 1) {
            setCurrentView("events");
        }
    };

    // Filter upcoming events
    const upcomingEvents: Event[] = events
        .filter(event => {
            const eventDate = parseISO(event.date);
            return eventDate >= new Date(new Date().setHours(0, 0, 0, 0));
        })
        .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-black">
            {/* Mobile Menu */}
            <AnimatePresence>
                {showMobileMenu && (
                    <motion.div
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        className="fixed inset-0 z-50 bg-white shadow-xl md:hidden"
                    >
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b flex justify-between items-center">
                                <div className="text-xl font-semibold text-purple-800">GroupGather</div>
                                <button
                                    onClick={() => setShowMobileMenu(false)}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex flex-col p-4 space-y-4">
                                <button
                                    onClick={() => {
                                        setCurrentView("calendar");
                                        setShowMobileMenu(false);
                                    }}
                                    className={`flex items-center cursor-pointer space-x-2 p-3 rounded-lg ${currentView === "calendar" ? "bg-purple-100 text-purple-800" : "hover:bg-gray-100"}`}
                                >
                                    <Calendar size={20} />
                                    <span>Calendar</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setCurrentView("events");
                                        setShowMobileMenu(false);
                                    }}
                                    className={`flex items-center space-x-2 p-3 rounded-lg ${currentView === "events" ? "bg-purple-100 text-purple-800" : "hover:bg-gray-100"}`}
                                >
                                    <Users size={20} />
                                    <span>Events</span>
                                </button>
                                <hr className="my-2" />
                                <button
                                    onClick={() => {
                                        setShowEventForm(true);
                                        setShowMobileMenu(false);
                                    }}
                                    className="flex items-center space-x-2 p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                                >
                                    <Plus size={20} />
                                    <span>New Event</span>
                                </button>
                            </div>
                            <div className="mt-auto p-4 border-t">
                                <div className="flex items-center space-x-3">
                                    <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <div className="font-medium">{CURRENT_USER.name}</div>
                                        <div className="text-sm text-gray-500">{CURRENT_USER.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="bg-white border-b shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowMobileMenu(true)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                            >
                                <Menu size={24} />
                            </button>
                            <h1 className="text-xl font-semibold text-purple-800">GroupGather</h1>
                        </div>
                        <nav className="hidden md:flex space-x-1">
                            <button
                                onClick={() => setCurrentView("calendar")}
                                className={`px-4 py-2 rounded-lg cursor-pointer ${currentView === "calendar" ? "bg-purple-100 text-purple-800" : "hover:bg-gray-100"}`}
                            >
                                Calendar
                            </button>
                            <button
                                onClick={() => setCurrentView("events")}
                                className={`px-4 py-2 rounded-lg cursor-pointer ${currentView === "events" ? "bg-purple-100 text-purple-800" : "hover:bg-gray-100"}`}
                            >
                                Events
                            </button>
                        </nav>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="p-2 cursor-pointer rounded-full hover:bg-gray-100 relative"
                                >
                                    <Bell size={20} />
                                    {notifications.some(n => !n.read) && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                </button>
                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-30 overflow-hidden"
                                        >
                                            <div className="p-3 border-b flex justify-between items-center">
                                                <h3 className="font-medium">Notifications</h3>
                                                <button
                                                    onClick={markAllNotificationsAsRead}
                                                    className="text-sm text-purple-600 hover:text-purple-800"
                                                >
                                                    Mark all as read
                                                </button>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map(notification => (
                                                        <div
                                                            key={notification.id}
                                                            className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? "bg-purple-50" : ""}`}
                                                        >
                                                            <div className="text-sm">{notification.message}</div>
                                                            <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-gray-500">No notifications</div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="p-2 cursor-pointer rounded-full hover:bg-gray-100"
                                >
                                    <Settings size={20} />
                                </button>
                                <AnimatePresence>
                                    {showSettings && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-30"
                                        >
                                            <div className="p-2">
                                                <div className="p-3 mb-1 flex items-center space-x-3 rounded-lg">
                                                    <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="w-10 h-10 rounded-full" />
                                                    <div>
                                                        <div className="font-medium">{CURRENT_USER.name}</div>
                                                        <div className="text-xs text-gray-500">{CURRENT_USER.email}</div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center space-x-2">
                                                    <User size={16} />
                                                    <span>Profile</span>
                                                </button>
                                                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center space-x-2">
                                                    <Users size={16} />
                                                    <span>Group Members</span>
                                                </button>
                                                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center space-x-2">
                                                    <Settings size={16} />
                                                    <span>Settings</span>
                                                </button>
                                                <hr className="my-1" />
                                                <button className="w-full text-left p-3 text-red-600 hover:bg-gray-50 rounded-lg flex items-center space-x-2">
                                                    <XCircle size={16} />
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <button
                                onClick={() => setShowEventForm(true)}
                                className="hidden cursor-pointer md:flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                <Plus size={18} />
                                <span>New Event</span>
                            </button>
                            <button
                                onClick={() => setShowEventForm(true)}
                                className="md:hidden p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-4">
                {currentView === "calendar" && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 flex justify-between items-center border-b">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => navigateMonth("prev")}
                                    className="p-1 rounded-full cursor-pointer hover:bg-gray-100"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
                                <button
                                    onClick={() => navigateMonth("next")}
                                    className="p-1 rounded-full cursor-pointer hover:bg-gray-100"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                            <div className="hidden md:flex space-x-2">
                                <div className="flex items-center space-x-1">
                                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                    <span className="text-xs text-gray-600">Social</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    <span className="text-xs text-gray-600">Work</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    <span className="text-xs text-gray-600">Outdoor</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                                    <span className="text-xs text-gray-600">Cultural</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 text-center">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className="py-2 border-b font-medium text-gray-500">
                                    {day}
                                </div>
                            ))}
                            {generateCalendarDays().map((day, i) => {
                                const eventsOnDay = getEventsForDay(day);
                                const isCurrentMonth = isSameMonth(day, currentMonth);

                                return (
                                    <div
                                        key={i}
                                        onClick={() => isCurrentMonth && handleDateClick(day)}
                                        className={`min-h-24 p-1 border-b border-r relative ${!isCurrentMonth ? "bg-gray-50" : ""} ${isToday(day) ? "bg-blue-50" : ""} ${isCurrentMonth ? "hover:bg-gray-50 cursor-pointer" : ""}`}
                                    >
                                        <div
                                            className={`text-right text-sm p-1 ${isToday(day) ? "font-bold text-blue-600" : !isCurrentMonth ? "text-gray-400" : ""}`}
                                        >
                                            {format(day, "d")}
                                        </div>
                                        <div className="text-left">
                                            {eventsOnDay.slice(0, 2).map(event => {
                                                const eventColors = getCategoryColors(event.category);
                                                return (
                                                    <div
                                                        key={event.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedEvent(event);
                                                            setShowEventDetails(true);
                                                        }}
                                                        className={`text-xs truncate mb-1 rounded px-1.5 py-0.5 ${eventColors.bg} ${eventColors.text}`}
                                                    >
                                                        {format(parseISO(event.date), "h:mm a")} {event.title}
                                                    </div>
                                                );
                                            })}
                                            {eventsOnDay.length > 2 && (
                                                <div className="text-xs text-gray-500 pl-1.5">
                                                    + {eventsOnDay.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {currentView === "events" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Upcoming Events</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentView("calendar")}
                                    className="flex items-center space-x-1 px-3 py-1.5 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                >
                                    <Calendar size={16} />
                                    <span>Calendar</span>
                                </button>
                                <button
                                    onClick={() => setShowEventForm(true)}
                                    className="flex items-center cursor-pointer space-x-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    <Plus size={16} />
                                    <span>New Event</span>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map(event => {
                                    const eventColors = getCategoryColors(event.category);
                                    const { going } = getEventStatusCounts(event);
                                    const userRSVP = getCurrentUserRSVP(event);

                                    return (
                                        <motion.div
                                            key={event.id}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className={`p-4 rounded-xl border ${eventColors.border} ${eventColors.bg} cursor-pointer hover:shadow-md transition-shadow`}
                                            onClick={() => {
                                                setSelectedEvent(event);
                                                setShowEventDetails(true);
                                            }}
                                        >
                                            <div className="md:flex justify-between">
                                                <div className="md:w-2/3">
                                                    <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                                                    <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                                                    <div className="flex flex-wrap gap-3 mb-3">
                                                        <div className="flex items-center text-gray-600 text-sm">
                                                            <Clock size={16} className="mr-1" />
                                                            <span>{format(parseISO(event.date), "E, MMM d, yyyy · h:mm a")}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-600 text-sm">
                                                            <MapPin size={16} className="mr-1" />
                                                            <span>{event.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-end mt-4 md:mt-0">
                                                    <div className="flex -space-x-2 mr-4">
                                                        {event.attendees
                                                            .filter(a => a.status === "going")
                                                            .slice(0, 3)
                                                            .map(attendee => (
                                                                <img
                                                                    key={attendee.id}
                                                                    src={attendee.avatar}
                                                                    alt={attendee.name}
                                                                    className="w-8 h-8 rounded-full border-2 border-white"
                                                                />
                                                            ))}
                                                        {going > 3 && (
                                                            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs border-2 border-white">
                                                                +{going - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        {userRSVP ? (
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${userRSVP === "going" ? "bg-green-100 text-green-800" : userRSVP === "maybe" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                                                                {userRSVP === "going" && <CheckCircle size={12} className="mr-1" />}
                                                                {userRSVP === "going" ? "Going" : userRSVP === "maybe" ? "Maybe" : "Declined"}
                                                            </span>
                                                        ) : (
                                                            <button className="text-sm text-purple-600 hover:text-purple-800">
                                                                RSVP
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <div className="mb-4">No upcoming events</div>
                                    <button
                                        onClick={() => setShowEventForm(true)}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        Create your first event
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t bg-white py-6">
                <div className="container mx-auto px-4">
                    <div className="md:flex md:justify-between">
                        <div className="mb-6 md:mb-0">
                            <h3 className="text-lg font-semibold text-purple-800">GroupGather</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                Simple event planning for small groups
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-8 md:gap-16">
                            <div>
                                <h3 className="text-sm font-semibold mb-3">Features</h3>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>Calendar</li>
                                    <li>Event Planning</li>
                                    <li>RSVP Management</li>
                                    <li>Notifications</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-3">Resources</h3>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>Help Center</li>
                                    <li>Privacy Policy</li>
                                    <li>Terms of Service</li>
                                    <li>Contact</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 border-t pt-4 flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-gray-500">
                            © 2025 GroupGather. All rights reserved.
                        </div>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a href="#" className="text-gray-500 hover:text-gray-800">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-800">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-800">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* New Event Form Modal */}
            <AnimatePresence>
                {showEventForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-md"
                        >
                            <div className="p-5 border-b flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Create New Event</h3>
                                <button
                                    onClick={() => setShowEventForm(false)}
                                    className="p-1 rounded-full hover:bg-gray-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmitEvent} className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Event Title</label>
                                    <input
                                        type="text"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Add a title"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Add a description"
                                        rows={3}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={newEvent.date}
                                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Time</label>
                                        <input
                                            type="time"
                                            value={newEvent.time}
                                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Add a location"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select
                                        value={newEvent.category}
                                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as NewEventForm["category"] })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    >
                                        <option value="social">Social</option>
                                        <option value="work">Work</option>
                                        <option value="outdoor">Outdoor</option>
                                        <option value="cultural">Cultural</option>
                                    </select>
                                </div>
                                <div className="pt-3 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowEventForm(false)}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        Create Event
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Event Details Modal */}
            <AnimatePresence>
                {showEventDetails && selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-md"
                        >
                            <div className="p-5 border-b flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Event Details</h3>
                                <button
                                    onClick={() => setShowEventDetails(false)}
                                    className="p-1 rounded-full cursor-pointer hover:bg-gray-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-5">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
                                    <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <Clock size={18} className="mr-3 text-gray-500 mt-0.5" />
                                            <div>
                                                <div className="font-medium">Date & Time</div>
                                                <div className="text-sm text-gray-600">
                                                    {format(parseISO(selectedEvent.date), "EEEE, MMMM d, yyyy")}
                                                    <br />
                                                    {format(parseISO(selectedEvent.date), "h:mm a")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <MapPin size={18} className="mr-3 text-gray-500 mt-0.5" />
                                            <div>
                                                <div className="font-medium">Location</div>
                                                <div className="text-sm text-gray-600">{selectedEvent.location}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <User size={18} className="mr-3 text-gray-500 mt-0.5" />
                                            <div>
                                                <div className="font-medium">Organized by</div>
                                                <div className="text-sm text-gray-600">{selectedEvent.creator}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                                        Attendees ({selectedEvent.attendees.length})
                                    </h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                        {selectedEvent.attendees.map(attendee => (
                                            <div key={attendee.id} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <img
                                                        src={attendee.avatar}
                                                        alt={attendee.name}
                                                        className="w-8 h-8 rounded-full mr-3"
                                                    />
                                                    <span>{attendee.name}</span>
                                                </div>
                                                <span className={`inline-block w-2 h-2 rounded-full ${statusColors[attendee.status]}`}></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <h4 className="text-sm font-semibold text-gray-500 mb-3">Your Response</h4>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleRSVP(selectedEvent.id, "going")}
                                            className={`flex-1 cursor-pointer py-2 px-3 rounded-lg border ${getCurrentUserRSVP(selectedEvent) === "going" ? "bg-green-100 border-green-300 text-green-800" : "hover:bg-gray-100"}`}
                                        >
                                            Going
                                        </button>
                                        <button
                                            onClick={() => handleRSVP(selectedEvent.id, "maybe")}
                                            className={`flex-1 cursor-pointer py-2 px-3 rounded-lg border ${getCurrentUserRSVP(selectedEvent) === "maybe" ? "bg-yellow-100 border-yellow-300 text-yellow-800" : "hover:bg-gray-100"}`}
                                        >
                                            Maybe
                                        </button>
                                        <button
                                            onClick={() => handleRSVP(selectedEvent.id, "declined")}
                                            className={`flex-1 cursor-pointer py-2 px-3 rounded-lg border ${getCurrentUserRSVP(selectedEvent) === "declined" ? "bg-red-100 border-red-300 text-red-800" : "hover:bg-gray-100"}`}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Action Button */}
            <div className="fixed bottom-6 right-6 md:hidden">
                <button
                    onClick={() => setShowEventForm(true)}
                    className="w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700"
                >
                    <Plus size={24} />
                </button>
            </div>
        </div>
    );
};

export default GroupEventPlanner;