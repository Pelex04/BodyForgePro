
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, Settings, MessageSquare, Calendar, CreditCard, Dumbbell, 
  UserCheck, X, Plus, Search, Filter, Edit2, Trash2, Eye, Ban, 
  CheckCircle, XCircle, Mail, Phone, LogOut, BarChart3, TrendingUp,
  Shield, Clock, MapPin, DollarSign, Activity, Send
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Add this helper function at the top of AdminApp.jsx after imports
const createNotification = async (userId, type, title, message, relatedId = null, relatedType = null) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        type,
        title,
        message,
        related_id: relatedId,
        related_type: relatedType,
        status: 'unread'
      }]);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Failed to create notification:', err);
    return { success: false, error: err.message };
  }
};
const sendBookingEmail = async (userEmail, bookingDetails, status) => {
  try {
    const emailSubject = status === 'completed' 
      ? '✅ Booking Completed - BodyForge'
      : status === 'cancelled' 
      ? '❌ Booking Cancelled - BodyForge'
      : '📋 Booking Updated - BodyForge';

    const emailBody = `Dear Member,

Your booking has been ${status.toUpperCase()}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${bookingDetails.type === 'class' ? '🏋️ Class' : '👤 Trainer'}: ${bookingDetails.name}
📅 Date: ${bookingDetails.date}
🕐 Time: ${bookingDetails.time}
📊 Status: ${status.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${status === 'completed' 
  ? '🎉 Thank you for attending! We hope you had a great session.\n\nYour dedication to fitness is inspiring. Keep pushing your limits!' 
  : status === 'cancelled' 
  ? 'Your booking has been cancelled. If this was a mistake or you have any questions, please contact us immediately.\n\nWe hope to see you soon!' 
  : 'Your booking status has been updated. Check your account for more details.'
}

Need help? Reply to this email or contact our support team.

Stay strong! 💪

Best regards,
The BodyForge Team`;

    

    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: userEmail,
        subject: emailSubject,
        body: emailBody,
        type: 'booking'
      }
    });

    if (error) {
      
      throw error;
    }

    
    if (data && data.success) {
      
      return { success: true, data };
    } else {
      
      return { success: false, error: data?.error || 'Unknown error' };
    }
  } catch (err) {
  
    return { success: false, error: err.message };
  }
};


const sendMembershipEmail = async (userEmail, membershipDetails, action) => {
  try {
    const subject = action === 'attached' 
      ? 'Membership Activated - BodyForge'
      : 'Membership Deactivated - BodyForge';

    const body = `Dear Member,

Your membership has been ${action.toUpperCase()}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 MEMBERSHIP DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Plan: ${membershipDetails.planName}
Status: ${membershipDetails.status}
Start Date: ${membershipDetails.startDate}
End Date: ${membershipDetails.endDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${action === 'attached' 
  ? 'Welcome to BodyForge! Your membership is now active.\n\nYou can now book classes, schedule trainer sessions, and access all our facilities.\n\nLet\'s start your fitness journey!' 
  : 'Your membership has been deactivated. If you believe this is an error, please contact us immediately.'
}

Questions? Contact our support team anytime.

Best regards,
The BodyForge Team`;

    

    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: userEmail,
        subject: subject,
        body: body,
        type: 'membership'
      }
    });

    if (error) {
      
      throw error;
    }
    
    return { success: true, data };
  } catch (err) {
    
    return { success: false, error: err.message };
  }
};


const sendInquiryResponseEmail = async (userEmail, userName, responseMessage) => {
  try {
    const subject = '📧 Response to Your Inquiry - BodyForge';

    const body = `Dear ${userName},

Thank you for contacting BodyForge!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 OUR RESPONSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${responseMessage}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We're here to help you achieve your fitness goals. If you have any more questions, don't hesitate to reach out.

Looking forward to seeing you at BodyForge! 💪

Best regards,
The BodyForge Team`;

  

    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: userEmail,
        subject: subject,
        body: body,
        type: 'inquiry'
      }
    });

    if (error) {
      
      throw error;
    }
    
    return { success: true, data };
  } catch (err) {
    
    return { success: false, error: err.message };
  }
};





const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);


const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
  };

  const styles = {
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 min-w-[320px]`}>
      {icons[type]}
      <p className="flex-1 font-semibold text-sm">{message}</p>
      <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1.5">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-[100] space-y-3">
    {toasts.map(toast => <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />)}
  </div>
);


const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return <div className={`${sizes[size]} border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin`} />;
};


const StatsCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-red-500/50 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}-500/20`}>
        <Icon className={`w-6 h-6 text-${color}-500`} />
      </div>
    </div>
    <h3 className="text-3xl font-black text-white mb-1">{value}</h3>
    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">{title}</p>
    {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
  </div>
);


const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className={`bg-gradient-to-br from-zinc-900 to-black rounded-2xl ${sizes[size]} w-full max-h-[90vh] overflow-y-auto border border-zinc-800`}>
        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};


const AdminLogin = ({ onLoginSuccess, showToast }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });
    
    if (authError) throw authError;

    const userId = authData.user.id;

    
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .maybeSingle(); 

    if (adminError) throw adminError;
    
    if (!adminData) {
     
      await supabase.auth.signOut();
      throw new Error('Unauthorized: Admin access only');
    }

   
    showToast('Admin login successful!', 'success');
    onLoginSuccess(authData.user);

  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-8 max-w-md w-full border border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-red-500/20 p-4 rounded-xl">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-center mb-2 uppercase text-white">Admin Access</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">BodyForge Management Portal</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Email</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              placeholder="admin@bodyforge.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-bold uppercase tracking-wider disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : <Shield className="w-5 h-5" />}
            <span>{loading ? 'AUTHENTICATING...' : 'LOGIN'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};


const UsersManagement = ({ showToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showAttachMembership, setShowAttachMembership] = useState(false);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');

  useEffect(() => {
    loadUsers();
    loadMembershipPlans();
  }, []);

  const loadMembershipPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('membership_plans')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      setMembershipPlans(data || []);
    } catch (err) {
      showToast('Load plans error:', err);
    }
  };

  const loadUsers = async () => {
  try {
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) throw profilesError;

    
    const { data: memberships, error: membError } = await supabase
      .from('user_memberships')
      .select(`
        *,
        membership_plans(*)
      `)
      .order('created_at', { ascending: false });

    if (membError) throw membError;

   
    const usersList = profiles.map(profile => {
      const userMembership = memberships?.find(m => 
        m.user_id === profile.id && m.status === 'active'
      );

      return {
        id: profile.id,
        email: profile.email,
        created_at: profile.created_at,
        deleted: profile.deleted || false,
        deleted_at: profile.deleted_at,
        membership: userMembership || null,
        plan: userMembership?.membership_plans || null
      };
    });

    setUsers(usersList);
  } catch (err) {
    
    showToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
};

  const viewUserDetails = async (user) => {
    try {
      
      const [bookingsRes, sessionsRes] = await Promise.all([
        supabase.from('class_bookings').select('*, classes(*)').eq('user_id', user.id),
        supabase.from('trainer_sessions').select('*, trainers(*)').eq('user_id', user.id)
      ]);

      setSelectedUser({
        ...user,
        bookings: bookingsRes.data || [],
        sessions: sessionsRes.data || []
      });
      setShowUserDetails(true);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  
const disableUser = async (userId, userEmail) => {
  if (!confirm(`Are you sure you want to disable ${userEmail}? They will not be able to access their account.`)) return;

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;

    showToast('User disabled successfully', 'success');
    loadUsers();
    setShowUserDetails(false);
  } catch (err) {
    showToast(err.message, 'error');
  }
};


const enableUser = async (userId, userEmail) => {
  if (!confirm(`Reactivate account for ${userEmail}?`)) return;

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        deleted: false,
        deleted_at: null
      })
      .eq('id', userId);

    if (error) throw error;

    showToast('User reactivated successfully', 'success');
    loadUsers();
    setShowUserDetails(false);
  } catch (err) {
    showToast(err.message, 'error');
  }
};

const deleteUserPermanently = async (userId, userEmail) => {
  const confirmText = `DELETE`;
  const userInput = prompt(
    ` WARNING: This will PERMANENTLY delete all data for ${userEmail}\n\n` +
    `This includes:\n` +
    `- Profile information\n` +
    `- All bookings and sessions\n` +
    `- Payment records\n` +
    `- Membership data\n\n` +
    `This action CANNOT be undone!\n\n` +
    `Type "${confirmText}" to confirm:`
  );

  if (userInput !== confirmText) {
    showToast('Deletion cancelled', 'error');
    return;
  }

 

  try {
   
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .delete()
      .eq('user_id', userId)
      .select();
    
    

    
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('class_bookings')
      .delete()
      .eq('user_id', userId)
      .select();
    
   
    if (bookingsError) throw bookingsError;

    
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('trainer_sessions')
      .delete()
      .eq('user_id', userId)
      .select();
    
   
    if (sessionsError) throw sessionsError;

   
    const { data: paymentsData, error: paymentsError } = await supabase
      .from('payments')
      .delete()
      .eq('user_id', userId)
      .select();
    
    
    if (paymentsError) throw paymentsError;

    
    const { data: membershipsData, error: membershipsError } = await supabase
      .from('user_memberships')
      .delete()
      .eq('user_id', userId)
      .select();
    
    
    if (membershipsError) throw membershipsError;
    

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
      .select();

    
    if (profileError) throw profileError;

    if (!profileData || profileData.length === 0) {
      throw new Error('Profile was not deleted - check RLS policies');
    }

    showToast('User permanently deleted successfully', 'success');
    

    setShowUserDetails(false);
    setSelectedUser(null);
    
 
    await loadUsers();
    
  } catch (err) {
    
    showToast(`Delete failed: ${err.message}`, 'error');
  }
};  
  const deactivateMembership = async (userId, membershipId) => {
    try {
      const { error } = await supabase
        .from('user_memberships')
        .update({ status: 'cancelled' })
        .eq('id', membershipId);

      if (error) throw error;
      showToast('Membership deactivated successfully', 'success');
      loadUsers();
      setShowUserDetails(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

const attachMembership = async (e) => {
  e.preventDefault();
  if (!selectedPlan) {
    showToast('Please select a membership plan', 'error');
    return;
  }

  try {
    const startDate = new Date().toISOString().split('T')[0];
    const endDateObj = new Date();
    endDateObj.setDate(endDateObj.getDate() + 30);
    const endDate = endDateObj.toISOString().split('T')[0];

    const { error } = await supabase.from('user_memberships').insert([
      {
        user_id: selectedUser.id,
        plan_id: selectedPlan,
        start_date: startDate,
        end_date: endDate,
        status: 'active',
        payment_id: null 
      },
    ]);

    if (error) throw error;

  
    const plan = membershipPlans.find(p => p.id === selectedPlan);
    
  
    const emailResult = await sendMembershipEmail(selectedUser.email, {
      planName: plan?.name || 'Premium',
      status: 'ACTIVE',
      startDate: new Date(startDate).toLocaleDateString(),
      endDate: new Date(endDate).toLocaleDateString()
    }, 'attached');

    if (emailResult.success) {
      showToast('Membership attached and email sent successfully! 📧', 'success');
    } else {
      showToast('Membership attached but email failed to send', 'error');
    }
    
 
    setShowAttachMembership(false);
    setSelectedPlan('');
    setShowUserDetails(false);
    
    setTimeout(() => {
      loadUsers();
    }, 100);
    
  } catch (err) {
    
    showToast(err.message, 'error');
  }
};

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-950 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">User ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
           <tbody className="divide-y divide-zinc-800">
  {filteredUsers.map((user) => (
    <tr key={user.id} className={`hover:bg-zinc-800/50 transition-colors ${user.deleted ? 'opacity-50' : ''}`}>
      <td className="px-6 py-4 text-sm text-white font-bold">
        {user.email}
        {user.deleted && <span className="ml-2 text-xs text-red-500 font-bold">(DISABLED)</span>}
      </td>
      <td className="px-6 py-4 text-sm text-gray-300">{user.id.substring(0, 8)}...</td>
      <td className="px-6 py-4">
        {user.plan ? (
          <span className="text-sm font-bold text-red-500">{user.plan.name}</span>
        ) : (
          <span className="text-sm text-gray-500">No Membership</span>
        )}
      </td>
      <td className="px-6 py-4">
        {user.deleted ? (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-500">
            DISABLED
          </span>
        ) : user.membership ? (
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            user.membership.status === 'active' 
              ? 'bg-green-500/20 text-green-500' 
              : 'bg-red-500/20 text-red-500'
          }`}>
            {user.membership.status.toUpperCase()}
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-500">
            NO PLAN
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-400">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => viewUserDetails(user)}
          className="text-red-500 hover:text-red-400 font-bold text-sm"
        >
          VIEW DETAILS
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={showUserDetails}
        onClose={() => setShowUserDetails(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-black text-white mb-4 uppercase">User Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-white font-bold">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">User ID</p>
                  <p className="text-white font-bold">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-gray-400">Current Plan</p>
                  <p className="text-red-500 font-bold">{selectedUser.plan?.name || 'No Membership'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Joined Date</p>
                  <p className="text-white font-bold">
                    {new Date(selectedUser.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Membership */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-white uppercase">Membership</h3>
                <div className="flex space-x-2">
                  {!selectedUser.membership && (
                    <button
                      onClick={() => setShowAttachMembership(true)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-xs uppercase flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ATTACH</span>
                    </button>
                  )}
                  {selectedUser.membership?.status === 'active' && (
                    <button
                      onClick={() => deactivateMembership(selectedUser.id, selectedUser.membership.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-xs uppercase flex items-center space-x-2"
                    >
                      <Ban className="w-4 h-4" />
                      <span>DEACTIVATE</span>
                    </button>
                  )}
                </div>
              </div>
              {selectedUser.membership ? (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Status</p>
                    <p className="text-white font-bold">{selectedUser.membership.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Start Date</p>
                    <p className="text-white font-bold">
                      {new Date(selectedUser.membership.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">End Date</p>
                    <p className="text-white font-bold">
                      {new Date(selectedUser.membership.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No active membership</p>
              )}
            </div>

            {/* Class Bookings */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-black text-white mb-4 uppercase">Class Bookings ({selectedUser.bookings?.length})</h3>
              {selectedUser.bookings?.length > 0 ? (
                <div className="space-y-2">
                  {selectedUser.bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                      <div>
                        <p className="text-white font-bold">{booking.classes?.title}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No class bookings</p>
              )}
            </div>

            {/* Trainer Sessions */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-black text-white mb-4 uppercase">Trainer Sessions ({selectedUser.sessions?.length})</h3>
              {selectedUser.sessions?.length > 0 ? (
                <div className="space-y-2">
                  {selectedUser.sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                      <div>
                        <p className="text-white font-bold">{session.trainers?.name}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(session.session_date).toLocaleDateString()} at {session.session_time}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        session.status === 'scheduled' 
                          ? 'bg-blue-500/20 text-blue-500' 
                          : session.status === 'completed'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No trainer sessions</p>
              )}
            </div>

 {/* Disable/Enable and Delete User Buttons */}
<div className="border-t border-zinc-700 pt-4 space-y-3">
  {selectedUser.deleted ? (
    <button
      onClick={() => enableUser(selectedUser.id, selectedUser.email)}
      className="w-full py-3 bg-green-500/20 hover:bg-green-500 text-green-500 hover:text-white rounded-lg font-bold text-sm uppercase transition-all flex items-center justify-center space-x-2"
    >
      <CheckCircle className="w-5 h-5" />
      <span>REACTIVATE USER</span>
    </button>
  ) : (
    <button
      onClick={() => disableUser(selectedUser.id, selectedUser.email)}
      className="w-full py-3 bg-orange-500/20 hover:bg-orange-500 text-orange-500 hover:text-white rounded-lg font-bold text-sm uppercase transition-all flex items-center justify-center space-x-2"
    >
      <Ban className="w-5 h-5" />
      <span>DISABLE USER</span>
    </button>
  )}
  
  {/* Permanent Dlete Button */}
  <button
    onClick={() => deleteUserPermanently(selectedUser.id, selectedUser.email)}
    className="w-full py-3 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg font-bold text-sm uppercase transition-all flex items-center justify-center space-x-2 border-2 border-red-500/50"
  >
    <Trash2 className="w-5 h-5" />
    <span> DELETE PERMANENTLY</span>
  </button>
</div>
          </div>
        )}
      </Modal>

      {/* Attach Membership Modal */}
      <Modal
        isOpen={showAttachMembership}
        onClose={() => {
          setShowAttachMembership(false);
          setSelectedPlan('');
        }}
        title="Attach Membership Plan"
      >
        <form onSubmit={attachMembership} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
              Select Membership Plan
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              required
            >
              <option value="">-- Select Plan --</option>
              {membershipPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - MWK {plan.price.toLocaleString()}/month
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Membership will be active for 30 days from today
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-bold uppercase"
          >
            ATTACH MEMBERSHIP
          </button>
        </form>
      </Modal>
    </>
  );
};


const ClassesManagement = ({ showToast }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddClass, setShowAddClass] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    max_capacity: '',
    image_url: ''
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClasses(data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('classes')
        .insert([formData]);

      if (error) throw error;
      showToast('Class added successfully! 🎉', 'success');
      setShowAddClass(false);
      setFormData({ title: '', description: '', duration: '', max_capacity: '', image_url: '' });
      loadClasses();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteClass = async (id) => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Class deleted successfully', 'success');
      loadClasses();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-white uppercase">Classes Management</h2>
        <button
          onClick={() => setShowAddClass(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-bold text-sm uppercase flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>ADD CLASS</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-red-500/50 transition-all">
            <img src={cls.image_url} alt={cls.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-black text-red-500 uppercase mb-2">{cls.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{cls.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{cls.duration} min</span>
                <span>Max: {cls.max_capacity}</span>
              </div>
              <button
                onClick={() => handleDeleteClass(cls.id)}
                className="w-full py-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg font-bold text-xs uppercase transition-all flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>DELETE</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      <Modal isOpen={showAddClass} onClose={() => setShowAddClass(false)} title="Add New Class">
        <form onSubmit={handleAddClass} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Class Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none resize-none"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Duration (min)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Max Capacity</label>
              <input
                type="number"
                value={formData.max_capacity}
                onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
                className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              placeholder="https://images.unsplash.com/..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-bold uppercase"
          >
            ADD CLASS
          </button>
        </form>
      </Modal>
    </>
  );
};


const TrainersManagement = ({ showToast }) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    description: '',
    experience_years: '',
    image_url: ''
  });

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrainers(data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrainer = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('trainers')
        .insert([formData]);

      if (error) throw error;
      showToast('Trainer added successfully! 🎉', 'success');
      setShowAddTrainer(false);
      setFormData({ name: '', specialty: '', description: '', experience_years: '', image_url: '' });
      loadTrainers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteTrainer = async (id) => {
    if (!confirm('Are you sure you want to delete this trainer?')) return;

    try {
      const { error } = await supabase
        .from('trainers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Trainer deleted successfully', 'success');
      loadTrainers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-white uppercase">Trainers Management</h2>
        <button
          onClick={() => setShowAddTrainer(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-bold text-sm uppercase flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>ADD TRAINER</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-red-500/50 transition-all">
            <img src={trainer.image_url} alt={trainer.name} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-black text-white uppercase mb-1">{trainer.name}</h3>
              <p className="text-red-500 font-bold text-sm mb-3">{trainer.specialty}</p>
              <p className="text-gray-400 text-sm mb-4">{trainer.description}</p>
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <Activity className="w-4 h-4 mr-2" />
                <span>{trainer.experience_years} years experience</span>
              </div>
              <button
                onClick={() => handleDeleteTrainer(trainer.id)}
                className="w-full py-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg font-bold text-xs uppercase transition-all flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>DELETE</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Trainer Modal */}
      <Modal isOpen={showAddTrainer} onClose={() => setShowAddTrainer(false)} title="Add New Trainer">
        <form onSubmit={handleAddTrainer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Trainer Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Specialty</label>
            <input
              type="text"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              placeholder="e.g., Strength Coach, HIIT Specialist"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none resize-none"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Years of Experience</label>
            <input
              type="number"
              value={formData.experience_years}
              onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
              className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              placeholder="https://images.unsplash.com/..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-bold uppercase"
          >
            ADD TRAINER
          </button>
        </form>
      </Modal>
    </>
  );
};


const BookingsManagement = ({ showToast }) => {
  const [bookings, setBookings] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('classes');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

 
const deleteBooking = async (id, type) => {
  if (!confirm('Are you sure you want to permanently delete this booking?')) return;

  try {
    const table = type === 'class' ? 'class_bookings' : 'trainer_sessions';
    
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    showToast('Booking deleted successfully', 'success');
    
   
    setShowDetailsModal(false);
    setSelectedItem(null);
    await loadBookings();
    
  } catch (err) {
    
    showToast(err.message, 'error');
  }
};

const updateBookingStatus = async (id, status, type) => {
  try {
    const table = type === 'class' ? 'class_bookings' : 'trainer_sessions';
    const { error } = await supabase
      .from(table)
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    // Send email (existing code)
    const bookingDetails = {
      type,
      name: type === 'class' ? selectedItem.classes?.title : selectedItem.trainers?.name,
      date: new Date(type === 'class' ? selectedItem.booking_date : selectedItem.session_date).toLocaleDateString(),
      time: type === 'class' ? selectedItem.booking_time : selectedItem.session_time
    };

    const emailResult = await sendBookingEmail(selectedItem.user_email, bookingDetails, status);
    
    // Create notification for user
    let notificationTitle = '';
    let notificationMessage = '';

    if (status === 'completed') {
      notificationTitle = `${type === 'class' ? 'Class' : 'Session'} Completed`;
      notificationMessage = `Your ${type === 'class' ? 'class' : 'training session'} "${bookingDetails.name}" on ${bookingDetails.date} has been marked as completed. Thank you for attending!`;
    } else if (status === 'cancelled') {
      notificationTitle = `${type === 'class' ? 'Class' : 'Session'} Cancelled`;
      notificationMessage = `Your ${type === 'class' ? 'class' : 'training session'} "${bookingDetails.name}" on ${bookingDetails.date} has been cancelled. Please contact us if you have any questions.`;
    } else if (status === 'confirmed' || status === 'scheduled') {
      notificationTitle = `${type === 'class' ? 'Class' : 'Session'} Confirmed`;
      notificationMessage = `Great news! Your ${type === 'class' ? 'class' : 'training session'} "${bookingDetails.name}" on ${bookingDetails.date} at ${bookingDetails.time} has been confirmed. See you there!`;
    }

    await createNotification(
      selectedItem.user_id,
      'status_update',
      notificationTitle,
      notificationMessage,
      id,
      type === 'class' ? 'class_booking' : 'trainer_session'
    );
    
    if (emailResult.success) {
      showToast('Status updated, email and notification sent! 📧', 'success');
    } else {
      showToast('Status updated but email failed to send', 'error');
    }
    
    setShowDetailsModal(false);
    setSelectedItem(null);
    
    setTimeout(() => {
      loadBookings();
    }, 100);
    
  } catch (err) {
    showToast(err.message, 'error');
  }
};
  useEffect(() => {
    loadBookings();
  }, []);

const loadBookings = async () => {
  try {
   
    const { data: classBookings, error: classError } = await supabase
      .from('class_bookings')
      .select(`
        *,
        classes(*),
        payments(*)
      `)
      .order('created_at', { ascending: false });

   
    const { data: trainerSessions, error: sessionError } = await supabase
      .from('trainer_sessions')
      .select(`
        *,
        trainers(*),
        payments(*)
      `)
      .order('created_at', { ascending: false });

    if (classError) throw classError;
    if (sessionError) throw sessionError;

   
    const bookingsWithEmails = await Promise.all(
      (classBookings || []).map(async (booking) => {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', booking.user_id)
          .maybeSingle(); 
        
        return {
          ...booking,
          user_email: profile?.email || 'Unknown'
        };
      })
    );

    const sessionsWithEmails = await Promise.all(
      (trainerSessions || []).map(async (session) => {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', session.user_id)
          .maybeSingle(); 
        
        return {
          ...session,
          user_email: profile?.email || 'Unknown'
        };
      })
    );

    setBookings(bookingsWithEmails);
    setSessions(sessionsWithEmails);
  } catch (err) {
    
    showToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
};

const viewDetails = async (item, type) => {
  try {
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', item.user_id)
      .maybeSingle(); 
    
    if (error) throw error;
    
    setSelectedItem({
      ...item,
      type,
      full_user: profile || { email: 'Unknown' }
    });
    setShowDetailsModal(true);
  } catch (err) {
    showToast(err.message, 'error');
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex space-x-4 border-b border-zinc-800">
        <button
          onClick={() => setActiveSubTab('classes')}
          className={`px-6 py-3 font-bold text-sm uppercase ${
            activeSubTab === 'classes'
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Class Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveSubTab('sessions')}
          className={`px-6 py-3 font-bold text-sm uppercase ${
            activeSubTab === 'sessions'
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Trainer Sessions ({sessions.length})
        </button>
      </div>

      {activeSubTab === 'classes' ? (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-950 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Class</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-white">{booking.user_email}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-red-500">{booking.classes?.title}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{booking.booking_time}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {booking.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => viewDetails(booking, 'class')}
                        className="text-red-500 hover:text-red-400 font-bold text-sm"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-950 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Trainer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-white">{session.user_email}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-red-500">{session.trainers?.name}</span>
                      <p className="text-xs text-gray-500">{session.trainers?.specialty}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(session.session_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{session.session_time}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        session.status === 'scheduled' 
                          ? 'bg-blue-500/20 text-blue-500' 
                          : session.status === 'completed'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {session.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => viewDetails(session, 'trainer')}
                        className="text-red-500 hover:text-red-400 font-bold text-sm"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={selectedItem?.type === 'class' ? 'Class Booking Details' : 'Trainer Session Details'}
      >
        {selectedItem && (
          <div className="space-y-4">
            {/* User Info */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-black text-white mb-3 uppercase">User Information</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-white font-bold">{selectedItem.user_email}</p>
                </div>
                <div>
                  <p className="text-gray-400">User ID</p>
                  <p className="text-white font-mono text-xs">{selectedItem.user_id}</p>
                </div>
              </div>
            </div>

            {/* Booking/Session Info */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-black text-white mb-3 uppercase">
                {selectedItem.type === 'class' ? 'Class Details' : 'Trainer Details'}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">{selectedItem.type === 'class' ? 'Class' : 'Trainer'}</p>
                  <p className="text-gray-400">{selectedItem.type === 'class' ? 'Class' : 'Trainer'}</p>
                  <p className="text-red-500 font-bold">
                    {selectedItem.type === 'class' 
                      ? selectedItem.classes?.title 
                      : selectedItem.trainers?.name}
                  </p>
                  {selectedItem.type === 'trainer' && (
                    <p className="text-xs text-gray-500">{selectedItem.trainers?.specialty}</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-400">Date & Time</p>
                  <p className="text-white font-bold">
                    {new Date(selectedItem.type === 'class' ? selectedItem.booking_date : selectedItem.session_date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedItem.type === 'class' ? selectedItem.booking_time : selectedItem.session_time}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    selectedItem.status === 'confirmed' || selectedItem.status === 'scheduled'
                      ? 'bg-green-500/20 text-green-500' 
                      : selectedItem.status === 'completed'
                      ? 'bg-blue-500/20 text-blue-500'
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {selectedItem.status?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400">Payment</p>
                  <p className="text-white font-bold">
                    {selectedItem.payments ? (
                      <span className="text-green-500">✓ PAID</span>
                    ) : (
                      <span className="text-gray-500">No Payment</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes (for trainer sessions) */}
            {selectedItem.type === 'trainer' && selectedItem.notes && (
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h3 className="text-lg font-black text-white mb-2 uppercase">Notes</h3>
                <p className="text-gray-300 text-sm">{selectedItem.notes}</p>
              </div>
            )}

            {/* Update Status */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-black text-white mb-3 uppercase">Update Status</h3>
              <select
                value={selectedItem.status}
                onChange={(e) => updateBookingStatus(selectedItem.id, e.target.value, selectedItem.type)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white font-bold"
              >
                {selectedItem.type === 'class' ? (
                  <>
                    <option value="confirmed">CONFIRMED</option>
                    <option value="cancelled">CANCELLED</option>
                    <option value="completed">COMPLETED</option>
                  </>
                ) : (
                  <>
                    <option value="scheduled">SCHEDULED</option>
                    <option value="completed">COMPLETED</option>
                    <option value="cancelled">CANCELLED</option>
                  </>
                )}
              </select>
                {/* Delete Booking Button */}
  {(selectedItem.status === 'cancelled' || selectedItem.status === 'completed') && (
    <button
      onClick={() => deleteBooking(selectedItem.id, selectedItem.type)}
      className="w-full py-3 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg font-bold text-sm uppercase transition-all flex items-center justify-center space-x-2"
    >
      <Trash2 className="w-5 h-5" />
      <span>DELETE BOOKING</span>
    </button>
  )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};


const InquiriesManagement = ({ showToast }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showInquiryDetails, setShowInquiryDetails] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, []);

const deleteInquiry = async (id) => {
  if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;

  try {
    const { error } = await supabase
      .from('contact_inquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    showToast('Inquiry deleted successfully', 'success');
    
   
    setShowInquiryDetails(false);
    setSelectedInquiry(null);
    await loadInquiries();
    
  } catch (err) {
    
    showToast(err.message, 'error');
  }
};


const [showResponseModal, setShowResponseModal] = useState(false);
const [responseMessage, setResponseMessage] = useState('');


const sendResponse = async () => {
  if (!responseMessage.trim()) {
    showToast('Please enter a response message', 'error');
    return;
  }

  try {
    const emailResult = await sendInquiryResponseEmail(
      selectedInquiry.email,
      selectedInquiry.name,
      responseMessage
    );

    if (emailResult.success) {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ status: 'responded' })
        .eq('id', selectedInquiry.id);

      if (error) throw error;

      // Create notification for user
      await createNotification(
        selectedInquiry.id, // Using inquiry ID as user ID
        'status_update',
        'Inquiry Response Received',
        `We've responded to your inquiry! Check your email for our detailed response. ${responseMessage.substring(0, 100)}${responseMessage.length > 100 ? '...' : ''}`,
        selectedInquiry.id,
        'inquiry'
      );

      showToast('Response and notification sent successfully! 📧', 'success');
      setShowResponseModal(false);
      setResponseMessage('');
      setShowInquiryDetails(false);
      
      setTimeout(() => {
        loadInquiries();
      }, 100);
    } else {
      showToast('Failed to send response email', 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
};

const contactUser = (email, name) => {
 
  const subject = encodeURIComponent(`Re: Your BodyForge Inquiry`);
  const body = encodeURIComponent(`Dear ${name},\n\nThank you for contacting BodyForge.\n\n`);
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
};  
  const loadInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      showToast('Status updated successfully', 'success');
      loadInquiries();
      setShowInquiryDetails(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-950 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Date</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-bold">{inquiry.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{inquiry.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{inquiry.phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inquiry.status === 'new' 
                        ? 'bg-blue-500/20 text-blue-500' 
                        : inquiry.status === 'responded'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {inquiry.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        setShowInquiryDetails(true);
                      }}
                      className="text-red-500 hover:text-red-400 font-bold text-sm"
                    >
                      VIEW
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Details Modal */}
      <Modal isOpen={showInquiryDetails} onClose={() => setShowInquiryDetails(false)} title="Inquiry Details">
        {selectedInquiry && (
          <div className="space-y-4">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Name</p>
                  <p className="text-white font-bold">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Email</p>
                  <p className="text-white">{selectedInquiry.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Phone</p>
                  <p className="text-white">{selectedInquiry.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Date</p>
                  <p className="text-white">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase font-bold mb-2">Message</p>
              <p className="text-white leading-relaxed">{selectedInquiry.message}</p>
            </div>

 <div className="space-y-3">
  {/* Send Response Button */}
  <button
    onClick={() => setShowResponseModal(true)}
    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold uppercase flex items-center justify-center space-x-2"
  >
    <Send className="w-5 h-5" />
    <span>SEND RESPONSE</span>
  </button>

  <div className="flex space-x-3">
    <button
      onClick={() => updateInquiryStatus(selectedInquiry.id, 'responded')}
      className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold uppercase"
    >
      MARK AS RESPONDED
    </button>
    <button
      onClick={() => updateInquiryStatus(selectedInquiry.id, 'closed')}
      className="flex-1 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-bold uppercase"
    >
      CLOSE
    </button>
  </div>

  {selectedInquiry.status === 'closed' && (
    <button
      onClick={() => deleteInquiry(selectedInquiry.id)}
      className="w-full py-3 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg font-bold uppercase flex items-center justify-center space-x-2"
    >
      <Trash2 className="w-5 h-5" />
      <span>DELETE INQUIRY</span>
    </button>
  )}
</div>

{/* Add Response Modal */}
<Modal
  isOpen={showResponseModal}
  onClose={() => {
    setShowResponseModal(false);
    setResponseMessage('');
  }}
  title="Send Response to User"
>
  <div className="space-y-4">
    <div>
      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
        Response Message
      </label>
      <textarea
        value={responseMessage}
        onChange={(e) => setResponseMessage(e.target.value)}
        className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none resize-none"
        rows="6"
        placeholder="Type your response here..."
      />
    </div>
    
    <button
      onClick={sendResponse}
      className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold uppercase flex items-center justify-center space-x-2"
    >
      <Send className="w-5 h-5" />
      <span>SEND EMAIL</span>
    </button>
  </div>
</Modal>
          </div>
        )}
      </Modal>
    </>
  );
};


const Dashboard = ({ showToast }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeMembers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingInquiries: 0,
    totalTrainers: 0,
    totalClasses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

const loadStats = async () => {
  try {
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, deleted');

   
    const { data: memberships, error: membError } = await supabase
      .from('user_memberships')
      .select('*');

   
    const { data: bookings, error: bookError } = await supabase
      .from('class_bookings')
      .select('*');

   
    const { data: sessions, error: sessError } = await supabase
      .from('trainer_sessions')
      .select('*');

    
    const { data: inquiries, error: inqError } = await supabase
      .from('contact_inquiries')
      .select('*')
      .eq('status', 'new');

   
    const { data: payments, error: payError } = await supabase
      .from('payments')
      .select('amount, status')
      .eq('status', 'completed');

   
    const { count: trainersCount } = await supabase
      .from('trainers')
      .select('*', { count: 'exact', head: true });

    
    const { count: classesCount } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true });

   
    const totalRevenue = payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;
    const activeMembers = memberships?.filter(m => m.status === 'active').length || 0;
    
    
    const activeUsers = profiles?.filter(p => !p.deleted).length || 0;
    const totalUsers = profiles?.length || 0;
    
    const totalBookings = (bookings?.length || 0) + (sessions?.length || 0);

    setStats({
      totalUsers: activeUsers, 
      activeMembers: activeMembers,
      totalBookings: totalBookings,
      totalRevenue: totalRevenue,
      pendingInquiries: inquiries?.length || 0,
      totalTrainers: trainersCount || 0,
      totalClasses: classesCount || 0
    });
  } catch (err) {
   
    showToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Users}
          title="Total Members"
          value={stats.activeMembers}
         
          color="blue"
        />
        <StatsCard
          icon={Calendar}
          title="Total Bookings"
          value={stats.totalBookings}
          subtitle="Classes & Sessions"
          color="purple"
        />
        <StatsCard
          icon={DollarSign}
          title="Total Revenue"
          value={`MWK ${stats.totalRevenue.toLocaleString()}`}
          subtitle="From payments"
          color="red"
        />
        <StatsCard
          icon={MessageSquare}
          title="Pending Inquiries"
          value={stats.pendingInquiries}
          subtitle="Awaiting response"
          color="orange"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
  <h3 className="text-xl font-black text-white mb-4 uppercase flex items-center">
    <UserCheck className="w-6 h-6 mr-3 text-green-500" />
    Active Members
  </h3>
  <p className="text-4xl font-black text-green-500">{stats.activeMembers}</p>
  <p className="text-sm text-gray-400 mt-2">Out of {stats.totalUsers} total users</p>
</div>

        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-xl font-black text-white mb-4 uppercase flex items-center">
            <Dumbbell className="w-6 h-6 mr-3 text-blue-500" />
            Classes
          </h3>
          <p className="text-4xl font-black text-blue-500">{stats.totalClasses}</p>
          <p className="text-sm text-gray-400 mt-2">Available classes</p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-xl font-black text-white mb-4 uppercase flex items-center">
            <UserCheck className="w-6 h-6 mr-3 text-purple-500" />
            Trainers
          </h3>
          <p className="text-4xl font-black text-purple-500">{stats.totalTrainers}</p>
          <p className="text-sm text-gray-400 mt-2">Professional trainers</p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <h3 className="text-xl font-black text-white mb-4 uppercase flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-green-500" />
          Analytics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Conversion Rate</p>
            <p className="text-2xl font-black text-white">
              {stats.totalUsers > 0 ? Math.round((stats.activeMembers / stats.totalUsers) * 100) : 0}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Avg Revenue/Member</p>
            <p className="text-2xl font-black text-white">
              MWK {stats.activeMembers > 0 ? Math.round(stats.totalRevenue / stats.activeMembers).toLocaleString() : 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Bookings/Member</p>
            <p className="text-2xl font-black text-white">
              {stats.totalUsers > 0 ? (stats.totalBookings / stats.totalUsers).toFixed(1) : 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Response Needed</p>
            <p className="text-2xl font-black text-red-500">{stats.pendingInquiries}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function AdminApp() {
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
    showToast('Logged out successfully', 'success');
  };

  if (!adminUser) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <AdminLogin onLoginSuccess={setAdminUser} showToast={showToast} />
      </>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'classes', label: 'Classes', icon: Dumbbell },
    { id: 'trainers', label: 'Trainers', icon: UserCheck },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      { /*header*/}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500/20 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-wider">
                  <span className="text-red-500">BODY</span>
                  <span className="text-white">FORGE</span>
                </h1>
                <p className="text-xs text-gray-400">Admin Dashboard</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-bold">LOGOUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-zinc-950 border-b border-zinc-800 sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-500'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard showToast={showToast} />}
        {activeTab === 'users' && <UsersManagement showToast={showToast} />}
        {activeTab === 'classes' && <ClassesManagement showToast={showToast} />}
        {activeTab === 'trainers' && <TrainersManagement showToast={showToast} />}
        {activeTab === 'inquiries' && <InquiriesManagement showToast={showToast} />}
        {activeTab === 'bookings' && <BookingsManagement showToast={showToast} />}
      </main>
    </div>
  );
}