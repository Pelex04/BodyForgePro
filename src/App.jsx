/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Menu,
  X,
  Dumbbell,
  MapPin,
  Phone,
  Mail,
  User,
  LogOut,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  CreditCard,
  Lock,
  Shield,
  Smartphone,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import AdminApp from "./AdminApp";

import ReCAPTCHA from "react-google-recaptcha";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51Nf2d6SH8n2b3e4f5g6h7i8j9kLMNOPQRStuvwxyz1234567890"
);

const PAYCHANGU_API = "https://unipod-server-1.onrender.com/api";

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
    error: <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
    info: <Info className="w-4 h-4 sm:w-5 sm:h-5" />,
    warning: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />,
  };

  const styles = {
    success: "bg-emerald-600 border-emerald-500",
    error: "bg-red-600 border-red-500",
    info: "bg-blue-600 border-blue-500",
    warning: "bg-amber-600 border-amber-500",
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${styles[type]} border-l-4 text-white px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 w-full sm:min-w-[320px] sm:max-w-[400px]`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-xs sm:text-sm flex-1 leading-tight">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
      >
        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-16 sm:top-20 left-2 right-2 sm:left-auto sm:right-4 z-[120] space-y-2 sm:space-y-3 pointer-events-none">
      <div className="pointer-events-auto space-y-2 sm:space-y-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

const Navigation = ({ user, onAuthClick, onLogout, userMembership }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }
  };

  const getVisibleNavItems = () => {
    if (!user) {
      return ["HOME", "CONTACT", "MEMBERSHIPS"];
    } else if (user && !userMembership) {
      return ["HOME", "CONTACT", "MEMBERSHIPS", "CLASSES", "TRAINERS"];
    } else {
      return [
        "HOME",
        "CLASSES",
        "TRAINERS",
        "MEMBERSHIPS",
        "GALLERY",
        "CONTACT",
      ];
    }
  };

  const visibleItems = getVisibleNavItems();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/98 shadow-xl backdrop-blur-md" : "bg-black/95"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={(e) => handleLinkClick(e, "#home")}
          >
            <Dumbbell className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-black uppercase tracking-wider">
              <span className="text-red-500">BODY</span>
              <span className="text-white">FORGE</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {visibleItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => handleLinkClick(e, `#${item.toLowerCase()}`)}
                className="text-white hover:text-red-500 transition-colors text-sm font-bold tracking-wider relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">
                  Hello,{" "}
                  <span className="text-red-500 font-bold">
                    {user.email?.split("@")[0] || "User"}
                  </span>
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 text-white hover:text-red-500 transition-colors text-sm font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>LOGOUT</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-red-500/30"
              >
                <User className="w-4 h-4" />
                <span>LOGIN</span>
              </button>
            )}
          </nav>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {visibleItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => handleLinkClick(e, `#${item.toLowerCase()}`)}
                className="block text-white hover:text-red-500 transition-colors py-2 text-sm font-bold tracking-wider hover:bg-zinc-900 px-3 rounded"
              >
                {item}
              </a>
            ))}
            {user ? (
              <button
                onClick={onLogout}
                className="w-full text-left text-white hover:text-red-500 py-2 text-sm font-bold px-3"
              >
                LOGOUT
              </button>
            ) : (
              <button
                onClick={onAuthClick}
                className="w-full bg-red-500 text-white px-4 py-2 rounded font-bold text-sm uppercase"
              >
                LOGIN
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

const Hero = ({ onJoinClick }) => {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center text-center px-4 mt-16"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70"></div>
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 text-white leading-tight tracking-wide">
          FORGE YOUR STRENGTH.
          <br />
          OWN YOUR POTENTIAL.
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
          Transform your body and mind with expert training, cutting-edge
          equipment, and a community that pushes you to be your best.
        </p>
        <button
          onClick={onJoinClick}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12 py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-red-500/50"
        >
          START YOUR JOURNEY
        </button>
      </div>
    </section>
  );
};

const ClassesSection = ({
  user,
  userMembership,
  onAuthRequired,
  showToast,
}) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [bookingQuotas, setBookingQuotas] = useState({
    classes: 0,
    trainers: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: classesData } = await supabase
        .from("classes")
        .select("*")
        .order("created_at", { ascending: false });
      if (classesData) setClasses(classesData);

      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const calculateQuotas = async () => {
      if (!user) {
        setBookingQuotas({ classes: 0, trainers: 0 });
        return;
      }

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: classBookings } = await supabase
        .from("class_bookings")
        .select("*")
        .eq("user_id", user.id)
        .gte("booking_date", startOfMonth.toISOString().split("T")[0]);

      const { data: trainerBookings } = await supabase
        .from("trainer_sessions")
        .select("*")
        .eq("user_id", user.id)
        .gte("session_date", startOfMonth.toISOString().split("T")[0]);

      setBookingQuotas({
        classes: (classBookings || []).length,
        trainers: (trainerBookings || []).length,
      });
    };

    calculateQuotas();
  }, [user, userMembership]);

  const getMembershipLimits = () => {
    if (!userMembership || !userMembership.membership_plans) {
      return { classes: 0, trainers: 0 };
    }

    const plan = userMembership.membership_plans;

    const planName = plan.name.toLowerCase();

    if (planName.includes("basic") || planName.includes("boost")) {
      return { classes: 2, trainers: 0 };
    } else if (
      planName.includes("standard") ||
      planName.includes("pro") ||
      planName.includes("power")
    ) {
      return { classes: 2, trainers: 2 };
    } else if (
      planName.includes("premium") ||
      planName.includes("elite") ||
      planName.includes("evolve")
    ) {
      return { classes: 999, trainers: 4 };
    }

    return { classes: 0, trainers: 0 };
  };

  const handleBookClass = async (classItem) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    if (!userMembership) {
      showToast("You need an active membership to book classes!", "warning");
      document
        .querySelector("#memberships")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const limits = getMembershipLimits();

    if (bookingQuotas.classes >= limits.classes) {
      showToast(
        `You've reached your ${limits.classes} class limit for this month. Upgrade your plan for more!`,
        "warning"
      );
      return;
    }

    setSelectedClass(classItem);

    const bookingDate = new Date().toISOString().split("T")[0];
    const bookingTime = "10:00:00";

    const { error } = await supabase.from("class_bookings").insert([
      {
        user_id: user.id,
        class_id: classItem.id,
        booking_date: bookingDate,
        booking_time: bookingTime,
        payment_id: userMembership.payment_id,
      },
    ]);

    if (!error) {
      showToast(`${classItem.title} booked successfully!`, "success");

      setBookingQuotas({
        ...bookingQuotas,
        classes: bookingQuotas.classes + 1,
      });
    } else {
      showToast(`Booking failed: ${error.message}`, "error");
    }
  };

  const handlePaymentSuccess = async (paymentRecord) => {
    const bookingDate = new Date().toISOString().split("T")[0];
    const bookingTime = "10:00:00";

    const { error } = await supabase.from("class_bookings").insert([
      {
        user_id: user.id,
        class_id: selectedClass.id,
        booking_date: bookingDate,
        booking_time: bookingTime,
        payment_id: paymentRecord.id,
      },
    ]);

    if (!error) {
      showToast(`${selectedClass.title} booked successfully!`, "success");
      setBookingQuotas({
        ...bookingQuotas,
        classes: bookingQuotas.classes + 1,
      });
    } else {
      showToast(`Booking failed: ${error.message}`, "error");
    }
    setShowPayment(false);
  };

  if (loading) {
    return (
      <section id="classes" className="py-20 bg-black px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Loading classes...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return null;
  }

  const limits = getMembershipLimits();

  return (
    <>
      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
          amount={15000}
          title={`${selectedClass?.title} Class Booking`}
          type="class_booking"
          itemId={selectedClass?.id}
          showToast={showToast}
          user={user}
        />
      )}

      <section id="classes" className="py-20 bg-black px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 uppercase tracking-wider">
            OUR CLASSES
          </h2>

          {userMembership && (
            <div className="max-w-2xl mx-auto mb-8 bg-zinc-900/50 border border-zinc-700 rounded-xl p-4 text-center">
              <p className="text-gray-300 text-sm">
                Classes booked this month:{" "}
                <span className="text-red-500 font-bold">
                  {bookingQuotas.classes}
                </span>{" "}
                / {limits.classes === 999 ? "∞" : limits.classes}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-zinc-900 rounded-xl overflow-hidden group hover:transform hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-red-500 shadow-xl"
              >
                <div className="overflow-hidden relative">
                  <img
                    src={cls.image_url}
                    alt={cls.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {userMembership && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      INCLUDED
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black uppercase mb-3 text-red-500">
                    {cls.title}
                  </h3>
                  <p className="text-gray-400 mb-2 text-sm">
                    Duration: {cls.duration} min
                  </p>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    {cls.description}
                  </p>
                  <button
                    onClick={() => handleBookClass(cls)}
                    disabled={
                      !userMembership || bookingQuotas.classes >= limits.classes
                    }
                    className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all shadow-lg ${
                      !userMembership
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : bookingQuotas.classes >= limits.classes
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/30"
                    }`}
                  >
                    {!userMembership
                      ? "MEMBERSHIP REQUIRED"
                      : bookingQuotas.classes >= limits.classes
                      ? "QUOTA REACHED"
                      : "BOOK CLASS"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const TrainersSection = ({
  user,
  userMembership,
  onAuthRequired,
  showToast,
}) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [bookingQuotas, setBookingQuotas] = useState({
    classes: 0,
    trainers: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: trainersData } = await supabase
        .from("trainers")
        .select("*")
        .order("created_at", { ascending: false });
      if (trainersData) setTrainers(trainersData);

      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const calculateQuotas = async () => {
      if (!user) {
        setBookingQuotas({ classes: 0, trainers: 0 });
        return;
      }

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: classBookings } = await supabase
        .from("class_bookings")
        .select("*")
        .eq("user_id", user.id)
        .gte("booking_date", startOfMonth.toISOString().split("T")[0]);

      const { data: trainerBookings } = await supabase
        .from("trainer_sessions")
        .select("*")
        .eq("user_id", user.id)
        .gte("session_date", startOfMonth.toISOString().split("T")[0]);

      setBookingQuotas({
        classes: (classBookings || []).length,
        trainers: (trainerBookings || []).length,
      });
    };

    calculateQuotas();
  }, [user, userMembership]);

  const getMembershipLimits = () => {
    if (!userMembership || !userMembership.membership_plans) {
      return { classes: 0, trainers: 0 };
    }

    const plan = userMembership.membership_plans;

    const planName = plan.name.toLowerCase();

    if (planName.includes("basic") || planName.includes("boost")) {
      return { classes: 2, trainers: 0 };
    } else if (
      planName.includes("standard") ||
      planName.includes("pro") ||
      planName.includes("power")
    ) {
      return { classes: 2, trainers: 2 };
    } else if (
      planName.includes("premium") ||
      planName.includes("elite") ||
      planName.includes("evolve")
    ) {
      return { classes: 999, trainers: 4 };
    }

    return { classes: 0, trainers: 0 };
  };

  const handleBookSession = async (trainer) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    if (!userMembership) {
      showToast(
        "You need an active membership to book trainer sessions!",
        "warning"
      );
      document
        .querySelector("#memberships")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const limits = getMembershipLimits();

    if (limits.trainers === 0) {
      showToast(
        "Your current plan doesn't include trainer sessions. Please upgrade!",
        "warning"
      );
      document
        .querySelector("#memberships")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (bookingQuotas.trainers >= limits.trainers) {
      showToast(
        `You've reached your ${limits.trainers} trainer session limit for this month. Upgrade your plan for more!`,
        "warning"
      );
      return;
    }

    setSelectedTrainer(trainer);

    const sessionDate = new Date().toISOString().split("T")[0];
    const sessionTime = "14:00:00";

    const { error } = await supabase.from("trainer_sessions").insert([
      {
        user_id: user.id,
        trainer_id: trainer.id,
        session_date: sessionDate,
        session_time: sessionTime,
        notes: "Initial consultation",
        payment_id: userMembership.payment_id,
      },
    ]);

    if (!error) {
      showToast(`Session booked with ${trainer.name}!`, "success");
      setBookingQuotas({
        ...bookingQuotas,
        trainers: bookingQuotas.trainers + 1,
      });
    } else {
      showToast(`Booking failed: ${error.message}`, "error");
    }
  };

  const handlePaymentSuccess = async (paymentRecord) => {
    const sessionDate = new Date().toISOString().split("T")[0];
    const sessionTime = "14:00:00";

    const { error } = await supabase.from("trainer_sessions").insert([
      {
        user_id: user.id,
        trainer_id: selectedTrainer.id,
        session_date: sessionDate,
        session_time: sessionTime,
        notes: "Initial consultation",
        payment_id: paymentRecord.id,
      },
    ]);

    if (!error) {
      showToast(`Session booked with ${selectedTrainer.name}!`, "success");
      setBookingQuotas({
        ...bookingQuotas,
        trainers: bookingQuotas.trainers + 1,
      });
    } else {
      showToast(`Booking failed: ${error.message}`, "error");
    }
    setShowPayment(false);
  };

  if (loading) {
    return (
      <section id="trainers" className="py-20 bg-zinc-950 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Loading trainers...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return null;
  }

  const limits = getMembershipLimits();

  return (
    <>
      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
          amount={25000}
          title={`Personal Training with ${selectedTrainer?.name}`}
          type="trainer_session"
          itemId={selectedTrainer?.id}
          showToast={showToast}
          user={user}
        />
      )}

      <section id="trainers" className="py-20 bg-zinc-950 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 uppercase tracking-wider">
            MEET OUR TRAINERS
          </h2>

          {userMembership && (
            <div className="max-w-2xl mx-auto mb-8 bg-zinc-900/50 border border-zinc-700 rounded-xl p-4 text-center">
              <p className="text-gray-300 text-sm">
                Trainer sessions booked this month:{" "}
                <span className="text-red-500 font-bold">
                  {bookingQuotas.trainers}
                </span>{" "}
                / {limits.trainers === 0 ? "Not Available" : limits.trainers}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="bg-zinc-900 rounded-xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 shadow-xl"
              >
                <div className="relative">
                  <img
                    src={trainer.image_url}
                    alt={trainer.name}
                    className="w-full h-80 object-cover"
                  />
                  {userMembership && limits.trainers > 0 && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      INCLUDED
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-black uppercase mb-2">
                    {trainer.name}
                  </h3>
                  <p className="text-red-500 font-bold text-sm uppercase tracking-wider mb-3">
                    {trainer.specialty}
                  </p>
                  <p className="text-gray-400 mb-6 text-sm">
                    {trainer.description}
                  </p>
                  <button
                    onClick={() => handleBookSession(trainer)}
                    disabled={
                      !userMembership ||
                      limits.trainers === 0 ||
                      bookingQuotas.trainers >= limits.trainers
                    }
                    className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all shadow-lg ${
                      !userMembership || limits.trainers === 0
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : bookingQuotas.trainers >= limits.trainers
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/30"
                    }`}
                  >
                    {!userMembership
                      ? "MEMBERSHIP REQUIRED"
                      : limits.trainers === 0
                      ? "UPGRADE PLAN"
                      : bookingQuotas.trainers >= limits.trainers
                      ? "QUOTA REACHED"
                      : "BOOK SESSION"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
const MembershipSection = ({
  user,
  onAuthRequired,
  showToast,
  onMembershipChange,
}) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userMembership, setUserMembership] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: plansData } = await supabase
        .from("membership_plans")
        .select("*")
        .order("price", { ascending: true });
      if (plansData) setPlans(plansData);

      if (user) {
        const { data: membership } = await supabase
          .from("user_memberships")
          .select("*, membership_plans(*)")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (membership) setUserMembership(membership);
      }
      setLoading(false);
    };
    loadData();
  }, [user]);

  const handlePaymentSuccess = async (paymentRecord) => {
    const startDate = new Date().toISOString().split("T")[0];
    const endDateObj = new Date();
    endDateObj.setDate(endDateObj.getDate() + 30);
    const endDate = endDateObj.toISOString().split("T")[0];

    const { error } = await supabase.from("user_memberships").insert([
      {
        user_id: user.id,
        plan_id: selectedPlan.id,
        start_date: startDate,
        end_date: endDate,
        status: "active",
        payment_id: paymentRecord.id,
      },
    ]);

    if (!error) {
      showToast(`${selectedPlan.name} membership activated!`, "success");
      setUserMembership({ membership_plans: selectedPlan });

      if (onMembershipChange) {
        onMembershipChange();
      }
    } else {
      showToast(`Membership activation failed: ${error.message}`, "error");
    }
    setShowPayment(false);
  };
  const handleSelectPlan = (plan) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    if (userMembership?.membership_plans?.id === plan.id) {
      showToast("You already have this plan active!", "info");
      return;
    }

    setSelectedPlan(plan);
    setShowPayment(true);
  };
  if (loading) {
    return (
      <section id="memberships" className="py-20 bg-zinc-950 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Loading membership plans...</p>
        </div>
      </section>
    );
  }
  return (
    <>
      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
          amount={selectedPlan?.price}
          title={`${selectedPlan?.name} Membership`}
          type="membership"
          itemId={selectedPlan?.id}
          showToast={showToast}
          user={user}
        />
      )}
      <section id="memberships" className="py-20 bg-zinc-950 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 uppercase tracking-wider">
            OUR MEMBERSHIP TIERS
          </h2>

          {userMembership && (
            <div className="max-w-2xl mx-auto mb-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-black text-white uppercase">
                  Active Membership
                </h3>
              </div>
              <p className="text-green-400 font-bold text-2xl">
                {userMembership.membership_plans?.name}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                You can now book classes and trainer sessions!
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-zinc-900 p-8 rounded-xl border-2 transition-all hover:transform hover:-translate-y-2 relative ${
                  plan.is_popular
                    ? "border-orange-500 shadow-lg shadow-orange-500/20"
                    : "border-zinc-700 hover:border-red-500"
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-4 right-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider shadow-lg">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-3xl font-black uppercase mb-4 text-red-500">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-black">
                    {plan.currency} {plan.price?.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-lg">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features?.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start text-gray-300 text-sm"
                    >
                      <CheckCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={userMembership?.membership_plans?.id === plan.id}
                  className={`w-full py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-all ${
                    userMembership?.membership_plans?.id === plan.id
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30"
                  }`}
                >
                  {userMembership?.membership_plans?.id === plan.id
                    ? "CURRENT PLAN ✓"
                    : "SELECT PLAN"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
const GallerySection = ({ user, userMembership }) => {
  const images = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80",
    "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  ];

  if (!user || !userMembership) {
    return null;
  }
  return (
    <section id="gallery" className="py-20 bg-black px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 uppercase tracking-wider">
          GALLERY
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative h-64 rounded-xl overflow-hidden group cursor-pointer"
            >
              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-red-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
const ContactSection = ({ showToast, user }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast("Please login to send us a message", "warning");
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("contact_inquiries").insert([
      {
        id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      },
    ]);

    setSubmitting(false);

    if (error) {
      showToast(`Failed to send message: ${error.message}`, "error");
    } else {
      showToast("Thank you! We will get back to you soon", "success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };
  return (
    <section id="contact" className="py-20 bg-zinc-950 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 uppercase tracking-wider">
          GET IN TOUCH
        </h2>
        {!user && (
          <div className="mb-8 bg-amber-900/20 border-2 border-amber-500 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Lock className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-black text-white uppercase">
                Login Required
              </h3>
            </div>
            <p className="text-amber-300 text-sm">
              Please login to send us a message and get assistance with your
              fitness journey.
            </p>
          </div>
        )}

        <div className="bg-zinc-900 p-8 md:p-12 rounded-xl border border-zinc-800">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={!user}
                className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Your Name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!user}
                className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="youremail@example.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!user}
                className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="+265888414728"
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                disabled={!user}
                className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Tell us about your fitness goals..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting || !user}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting && (
                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span className={submitting ? "ml-2" : ""}>
                {submitting
                  ? "SENDING"
                  : !user
                  ? "LOGIN TO SEND"
                  : "SEND MESSAGE"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
const Footer = () => {
  return (
    <footer className="bg-black border-t border-zinc-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-black uppercase mb-4 text-red-500">
              BodyForge
            </h3>
            <p className="text-gray-400 text-sm">
              Your journey to strength starts here. Transform your body,
              transform your life.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-black uppercase mb-4 text-red-500">
              Quick Links
            </h3>
            <div className="space-y-2">
              {["Home", "Classes", "Trainers", "Memberships"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block text-gray-400 text-sm hover:text-red-500 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black uppercase mb-4 text-red-500">
              Contact Info
            </h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Nkhalango, Near Vito
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                (265) 888-414-728
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                rastakadema@gmail.com
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black uppercase mb-4 text-red-500">
              Hours
            </h3>
            <div className="space-y-1 text-gray-400 text-sm">
              <p>Monday - Friday: 5am - 11pm</p>
              <p>Saturday: 6am - 10pm</p>
              <p>Sunday: 7am - 9pm</p>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} BodyForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
const LoadingSpinner = ({ size = "md" }) => {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className={[
          sizes[size],
          "border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin",
        ].join(" ")}
      />
    </div>
  );
};
const StripeCardForm = ({ onSuccess, amount, processing, setProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    onSuccess(paymentMethod);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-black border-2 border-zinc-700 rounded-lg p-4 focus-within:border-red-500 transition-colors">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#fff",
                "::placeholder": { color: "#6b7280" },
              },
              invalid: { color: "#ef4444" },
            },
          }}
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-lg font-black uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 shadow-lg shadow-red-500/30"
      >
        {processing ? (
          <>
            <LoadingSpinner size="sm" />
            <span className="ml-2">PROCESSING</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>PAY MWK {amount.toLocaleString()}</span>
          </>
        )}
      </button>
    </form>
  );
};
const PaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  title,
  type,
  itemId,
  showToast,
  user,
}) => {
  const [paymentData, setPaymentData] = useState({
    phoneNumber: "",
    operator: "airtel",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  if (!isOpen) return null;
  const validateMobileMoney = () => {
    const newErrors = {};
    if (!paymentData.phoneNumber.match(/^(0|265)?(88|99|89|88|98)\d{7}$/)) {
      newErrors.phoneNumber = "Invalid phone number (e.g., 0888123456)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleStripeSuccess = async (paymentMethod) => {
    try {
      const { data: paymentRecord, error: paymentError } = await supabase
        .from("payments")
        .insert([
          {
            user_id: user.id,
            amount: amount,
            payment_method: "card",
            payment_type: type,
            item_id: itemId,
            status: "completed",
            transaction_id: `STRIPE-${Date.now()}`,
            card_last_four: paymentMethod.card.last4,
            card_brand: paymentMethod.card.brand,
          },
        ])
        .select()
        .single();
      if (paymentError) throw paymentError;

      showToast(
        `Payment of MWK ${amount.toLocaleString()} successful!`,
        "success"
      );
      onSuccess(paymentRecord);
      onClose();
    } catch (err) {
      showToast(`Payment failed: ${err.message}`, "error");
    } finally {
      setProcessing(false);
    }
  };
  const handleMobileMoneyPayment = async (e) => {
    e.preventDefault();
    if (!validateMobileMoney()) return;
    setProcessing(true);
    const transactionId = `GYM-${Date.now()}`;

    try {
      let phone = paymentData.phoneNumber;
      if (phone.startsWith("0")) {
        phone = "+265" + phone.substring(1);
      } else if (!phone.startsWith("+")) {
        phone = "+265" + phone;
      }

      const response = await fetch(`${PAYCHANGU_API}/process-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          currency: "MWK",
          email: user.email,
          method: paymentData.operator === "airtel" ? "Airtel Money" : "Mpamba",
          transaction_id: transactionId,
          phone_number: phone,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Payment failed");
      }

      const { data: paymentRecord, error: paymentError } = await supabase
        .from("payments")
        .insert([
          {
            user_id: user.id,
            amount: amount,
            payment_method: "mobile_money",
            payment_type: type,
            item_id: itemId,
            status: "pending",
            transaction_id: transactionId,
            phone_number: phone,
          },
        ])
        .select()
        .single();

      if (paymentError) throw paymentError;

      showToast("Payment initiated! Please authorize on your phone", "info");
      setTimeout(
        () => verifyPayment(transactionId, result.charge_id, paymentRecord),
        5000
      );
    } catch (err) {
      showToast(`Payment failed: ${err.message}`, "error");
      setProcessing(false);
    }
  };
  const verifyPayment = async (
    txRef,
    chargeId,
    paymentRecord,
    attemptCount = 0
  ) => {
    const maxAttempts = 20;
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await fetch(
        `${PAYCHANGU_API}/verify-payment?charge_id=${chargeId}&tx_ref=${txRef}`
      );
      const result = await response.json();

      const isSuccess =
        result.status === "success" ||
        result.status === "successful" ||
        (result.message &&
          (result.message.toLowerCase().includes("already") ||
            result.message.toLowerCase().includes("authenticated") ||
            result.message.toLowerCase().includes("completed") ||
            result.message.toLowerCase().includes("successful")));

      if (isSuccess) {
        await supabase
          .from("payments")
          .update({ status: "completed" })
          .eq("transaction_id", txRef);

        showToast(
          `Payment of MWK ${amount.toLocaleString()} successful!`,
          "success"
        );
        onSuccess(paymentRecord);
        onClose();
        setProcessing(false);
        return;
      }

      if (
        (result.status === "pending" || result.status === "processing") &&
        attemptCount < maxAttempts
      ) {
        const remainingTime = Math.round((maxAttempts - attemptCount) * 3);
        showToast(
          `Waiting for payment... (${remainingTime}s remaining)`,
          "info"
        );
        setTimeout(
          () => verifyPayment(txRef, chargeId, paymentRecord, attemptCount + 1),
          3000
        );
        return;
      }

      if (attemptCount >= maxAttempts) {
        throw new Error(
          "Payment verification timed out. Please check your payment status in your account."
        );
      } else {
        throw new Error(result.message || "Payment failed");
      }
    } catch (err) {
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("transaction_id", txRef);

      showToast(`Payment verification failed: ${err.message}`, "error");
      setProcessing(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/95 z-[110] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-8 max-w-lg w-full relative border border-zinc-800 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-red-500/20 p-3 rounded-xl">
            <CreditCard className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase text-white">
              SECURE PAYMENT
            </h2>
            <p className="text-gray-400 text-sm">Complete your {title}</p>
          </div>
        </div>

        <div className="bg-zinc-800/50 rounded-xl p-4 mb-6 border border-zinc-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Amount to Pay:</span>
            <span className="text-3xl font-black text-red-500">
              MWK {amount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex space-x-3 mb-6">
          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
              paymentMethod === "card"
                ? "bg-red-500 text-white"
                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
            }`}
          >
            <CreditCard className="w-4 h-4 inline mr-2" />
            CARD
          </button>
          <button
            onClick={() => setPaymentMethod("mobile")}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
              paymentMethod === "mobile"
                ? "bg-red-500 text-white"
                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
            }`}
            MContinue
          >
            <Smartphone className="w-4 h-4 inline mr-2" />
            MOBILE MONEY
          </button>
        </div>

        {paymentMethod === "card" ? (
          <Elements stripe={stripePromise}>
            <StripeCardForm
              onSuccess={handleStripeSuccess}
              amount={amount}
              processing={processing}
              setProcessing={setProcessing}
            />
          </Elements>
        ) : (
          <form onSubmit={handleMobileMoneyPayment} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                SELECT OPERATOR
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setPaymentData({ ...paymentData, operator: "airtel" })
                  }
                  className={`py-3 rounded-lg font-bold text-sm transition-all ${
                    paymentData.operator === "airtel"
                      ? "bg-red-500 text-white"
                      : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                  }`}
                >
                  AIRTEL MONEY
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPaymentData({ ...paymentData, operator: "mpamba" })
                  }
                  className={`py-3 rounded-lg font-bold text-sm transition-all ${
                    paymentData.operator === "mpamba"
                      ? "bg-red-500 text-white"
                      : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                  }`}
                >
                  TNM MPAMBA
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                MOBILE NUMBER
              </label>
              <input
                type="tel"
                value={paymentData.phoneNumber}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    phoneNumber: e.target.value,
                  })
                }
                className={`w-full px-4 py-3 bg-black border-2 ${
                  errors.phoneNumber ? "border-red-500" : "border-zinc-700"
                } rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors`}
                placeholder="0888414728"
              />
              {errors.phoneNumber && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                A payment request will be sent to your mobile money account
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-400 bg-zinc-900/50 p-3 rounded-lg">
              <Shield className="w-4 h-4 text-green-500" />
              <span>
                Secured by PayChangu - Your payment is encrypted and secure
              </span>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-lg font-black uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg shadow-red-500/30"
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>PROCESSING</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5" />
                  <span>PAY MWK {amount.toLocaleString()}</span>
                </div>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
const ForgotPasswordModal = ({ isOpen, onClose, showToast }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showToast("Please enter a valid email address", "warning");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Password reset error:", error);
        throw error;
      }

      setEmailSent(true);
      showToast(
        "Password reset link sent! Please check your email.",
        "success"
      );

      // Close modal after 3 seconds
      setTimeout(() => {
        setEmail("");
        setEmailSent(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Reset password error:", err);
      showToast(
        err.message || "Failed to send reset email. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[101] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-8 max-w-md w-full relative border border-zinc-800 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-red-500/20 p-3 rounded-xl">
            <Lock className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-2xl font-black uppercase text-white">
            RESET PASSWORD
          </h2>
        </div>

        {!emailSent ? (
          <>
            <p className="text-gray-400 text-sm mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span>SENDING</span>
                  </div>
                ) : (
                  <span>SEND RESET LINK</span>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-gray-400 hover:text-white text-sm transition-colors"
              >
                Back to Login
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Email Sent!</h3>
            <p className="text-gray-400 text-sm">
              Check your inbox for the password reset link.
              <br />
              Don't forget to check your spam folder.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
const AuthModal = ({ isOpen, onClose, onSuccess, showToast }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const recaptchaRef = useRef(null);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);
  if (!isOpen) return null;
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.phone.match(/^\+?265\d{9}$/)) {
        newErrors.phone = "Invalid phone number (+265xxxxxxxxx)";
      }
    }

    const token = recaptchaRef.current?.getValue();
    if (!token) {
      newErrors.recaptcha = "Please confirm you are not a robot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (isLogin) {
        console.log("Attempting login with:", formData.email);

        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error("Login error:", error);
          throw error;
        }

        console.log("Login response:", data);

        // Check if email is verified
        if (!data.user.email_confirmed_at) {
          console.log("Email not confirmed");
          await supabase.auth.signOut();
          throw new Error(
            "Please verify your email before logging in. Check your inbox for the verification link."
          );
        }

        // Check if account is deleted
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("deleted, deleted_at")
          .eq("id", data.user.id)
          .single();

        console.log("Profile check:", profile, profileError);

        if (profileError && profileError.code !== "PGRST116") {
          // PGRST116 means no rows returned, which is okay for new accounts
          console.error("Profile error:", profileError);
          await supabase.auth.signOut();
          throw new Error(
            "Unable to verify account status. Please contact support."
          );
        }

        if (profile && profile.deleted === true) {
          console.log("Account is deleted");
          await supabase.auth.signOut();
          throw new Error(
            "Your account has been deactivated. Please contact support at support@bodyforge.com for assistance."
          );
        }

        showToast("Welcome back! Login successful", "success");
        onSuccess(data.user);
        onClose();
      } else {
        // Signup - Check if email exists in profiles table
        console.log("Checking if email exists:", formData.email);

        const { data: existingProfile, error: profileCheckError } =
          await supabase
            .from("profiles")
            .select("id, email, deleted, deleted_at")
            .eq("email", formData.email)
            .maybeSingle();

        console.log(
          "Profile check result:",
          existingProfile,
          profileCheckError
        );

        if (existingProfile) {
          // Check if the account was deleted
          if (existingProfile.deleted) {
            throw new Error(
              "This email was previously registered but the account has been deleted. Please contact support at support@bodyforge.com to reactivate or use a different email."
            );
          }

          throw new Error(
            "This email is already registered. Please login instead or click 'Forgot Password' if you don't remember your password."
          );
        }

        // Email doesn't exist in profiles, proceed with signup
        console.log("Email available, proceeding with signup");

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              phone: formData.phone,
            },
            emailRedirectTo: `${window.location.origin}`,
          },
        });

        if (error) {
          console.error("Signup error:", error);

          // Handle specific Supabase error messages
          if (error.message.includes("User already registered")) {
            throw new Error(
              "This email is already registered. Please login instead."
            );
          }

          if (error.message.includes("unable to validate email address")) {
            throw new Error(
              "Invalid email address format. Please check and try again."
            );
          }

          if (error.message.includes("Password should be at least")) {
            throw new Error(
              "Password is too weak. Please use a stronger password."
            );
          }

          throw error;
        }

        console.log("Signup response:", data);

        // Verify user was actually created
        if (!data.user) {
          throw new Error(
            "Signup failed. The account could not be created. Please try again or contact support."
          );
        }

        // Check if email confirmation is required
        if (data.user && !data.user.email_confirmed_at) {
          showToast(
            "Account created successfully! Please check your email (including spam/junk folder) to verify your account before logging in.",
            "success"
          );
        } else {
          showToast(
            "Account created successfully! You can now log in.",
            "success"
          );
        }

        // Clear form and close modal
        setFormData({ email: "", password: "", name: "", phone: "" });
        onClose();
      }
    } catch (err) {
      console.error("Authentication error details:", {
        message: err.message,
        error: err,
        stack: err.stack,
      });

      // More user-friendly error messages
      let errorMessage = err.message;

      if (err.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (err.message?.includes("Email not confirmed")) {
        errorMessage =
          "Please verify your email before logging in. Check your inbox.";
      } else if (err.message?.includes("User already registered")) {
        errorMessage =
          "This email is already registered. Please login instead.";
      }

      showToast(errorMessage || "Authentication failed", "error");
    } finally {
      setLoading(false);
      recaptchaRef.current?.reset();
    }
  };
  return (
    <>
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        showToast={showToast}
      />
      <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
        <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-8 max-w-md w-full relative border border-zinc-800 shadow-2xl my-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-red-500/20 p-3 rounded-xl">
              <Dumbbell className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-2xl font-black uppercase text-white">
              {isLogin ? "LOGIN" : "SIGN UP"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-4 py-3 bg-black border-2 ${
                      errors.name ? "border-red-500" : "border-zinc-700"
                    } rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+265888414728"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={`w-full px-4 py-3 bg-black border-2 ${
                      errors.phone ? "border-red-500" : "border-zinc-700"
                    } rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors`}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full px-4 py-3 bg-black border-2 ${
                  errors.email ? "border-red-500" : "border-zinc-700"
                } rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full px-4 py-3 bg-black border-2 ${
                  errors.password ? "border-red-500" : "border-zinc-700"
                } rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors`}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Add this block */}
            {isLogin && (
              <div className="flex justify-end -mt-2 mb-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}
            <div className="mt-4 flex justify-center">
              <ReCAPTCHA
                sitekey="6Leu1xksAAAAAAAcZG-4IYM3eyy5v4O3td8GMiEV"
                ref={recaptchaRef}
              />
            </div>
            {errors.recaptcha && (
              <p className="text-red-400 text-xs mt-1 text-center">
                {errors.recaptcha}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>PROCESSING</span>
                </div>
              ) : (
                <span>{isLogin ? "LOGIN" : "SIGN UP"}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="w-full text-gray-400 hover:text-white text-sm transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const ResetPasswordPage = ({ showToast }) => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "warning");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      showToast("Password updated successfully! You can now login.", "success");

      // Redirect to home after 2 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      showToast(err.message || "Failed to reset password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl p-8 max-w-md w-full border border-zinc-800">
        <h2 className="text-2xl font-black uppercase text-white mb-6">
          SET NEW PASSWORD
        </h2>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-bold uppercase disabled:opacity-50"
          >
            {loading ? "UPDATING..." : "UPDATE PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [userMembership, setUserMembership] = useState(null);
  const [isResetPassword, setIsResetPassword] = useState(false); 
  // Add this inside the App component, before the first useEffect
   useEffect(() => {
    // Check if URL contains reset-password
    if (window.location.pathname === '/reset-password' || window.location.hash.includes('type=recovery')) {
      setIsResetPassword(true);
    }
  }, []);
  useEffect(() => {
    const checkSupabaseConfig = async () => {
      console.log("Supabase URL:", supabaseUrl);
      console.log("Supabase Anon Key exists:", !!supabaseAnonKey);

      // Test the connection
      const { data, error } = await supabase.auth.getSession();
      console.log("Supabase connection test:", { data, error });
    };

    checkSupabaseConfig();
  }, []);

  const refreshMembership = useCallback(async () => {
    if (!user) {
      setUserMembership(null);
      return;
    }

    const { data: membership } = await supabase
      .from("user_memberships")
      .select("*, membership_plans(*)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    setUserMembership(membership || null);
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshMembership();
    } else {
      setUserMembership(null);
    }
  }, [user, refreshMembership]);
  if (window.location.pathname === "/admin") {
    return <AdminApp />;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  useEffect(() => {
    const initAuth = async () => {
      // Check if this is a fresh page load (not from back/forward navigation)
      const isPageRefresh = performance.navigation.type === 1;
      const isBackForward = performance.navigation.type === 2;

      // If user navigated back or closed tab previously, clear session
      if (isBackForward || sessionStorage.getItem("tab_closed") === "true") {
        await supabase.auth.signOut();
        sessionStorage.removeItem("tab_closed");
        setUser(null);
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    initAuth();

    // Listen for tab/window close
    const handleBeforeUnload = () => {
      sessionStorage.setItem("tab_closed", "true");
    };

    // Listen for page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        sessionStorage.setItem("tab_closed", "true");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          sessionStorage.setItem("tab_closed", "true");
        }
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserMembership(null);
    showToast("Logged out successfully", "info");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  const handleAuthRequired = () => {
    showToast("Please login to continue", "warning");
    setShowAuthModal(true);
  };
  const handleJoinClick = () => {
    const membershipSection = document.querySelector("#memberships");
    if (membershipSection) {
      membershipSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  if (isResetPassword) {
  return (
    <div className="bg-black text-white min-h-screen">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ResetPasswordPage showToast={showToast} />
    </div>
  );
}
  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen">
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <Dumbbell className="w-16 h-16 mx-auto text-red-500 animate-pulse" />
            <p className="text-2xl font-black mt-6">BODYFORGE</p>
            <p className="text-gray-400">Loading your gym experience...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-black text-white min-h-screen">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        showToast={showToast}
      />

      <Navigation
        user={user}
        userMembership={userMembership}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      <Hero onJoinClick={handleJoinClick} />
      <MembershipSection
        user={user}
        onMembershipChange={refreshMembership}
        onAuthRequired={handleAuthRequired}
        showToast={showToast}
      />
      <ClassesSection
        user={user}
        userMembership={userMembership}
        onAuthRequired={handleAuthRequired}
        showToast={showToast}
      />
      <TrainersSection
        user={user}
        userMembership={userMembership}
        onAuthRequired={handleAuthRequired}
        showToast={showToast}
      />

      <section className="py-20 bg-gradient-to-br from-red-900/30 to-black px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 tracking-wider">
            READY TO START?
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Take control of your fitness journey today. Join thousands of
            members who have transformed their lives at BodyForge.
          </p>
          <button
            onClick={handleJoinClick}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12 py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-red-500/50"
          >
            JOIN NOW
          </button>
        </div>
      </section>

      <GallerySection user={user} userMembership={userMembership} />
      <ContactSection showToast={showToast} user={user} />
      <Footer />
    </div>
  );
}
