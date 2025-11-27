/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, Settings, MessageSquare, Calendar, CreditCard, Dumbbell, 
  UserCheck, X, Plus, Search, Filter, Edit2, Trash2, Eye, Ban, 
  CheckCircle, XCircle, Mail, Phone, LogOut, BarChart3, TrendingUp,
  Shield, Clock, MapPin, DollarSign, Activity
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qeolxzekqsbjwohjwahs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlb2x4emVrcXNiandvaGp3YWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNzU5MjcsImV4cCI6MjA3ODg1MTkyN30.Dg-6ptI5gUFrNsPzIRcD476z7z87j8NjvIN5_azWnzg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==================== TOAST NOTIFICATION ====================
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

// ==================== LOADING SPINNER ====================
const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return <div className={`${sizes[size]} border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin`} />;
};

// ==================== STATS CARD ====================
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

// ==================== MODAL ====================
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

// ==================== ADMIN LOGIN ====================
const AdminLogin = ({ onLoginSuccess, showToast }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // 1. Authenticate user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });
    if (authError) throw authError;

    const userId = authData.user.id;

    // 2. Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
       // we expect only one record

    if (adminError || !adminData) {
      throw new Error('Unauthorized: Admin access only');
    }

    // 3. Success
    showToast('Admin login successful! ', 'success');
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

// ==================== USERS MANAGEMENT ====================
const UsersManagement = ({ showToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Get all memberships with plan details
      const { data: memberships, error: membError } = await supabase
        .from('user_memberships')
        .select(`
          *,
          membership_plans(*)
        `)
        .order('created_at', { ascending: false });

      if (membError) throw membError;

      // Get unique users
      const userMap = new Map();
      
      for (const membership of memberships || []) {
        if (!userMap.has(membership.user_id)) {
          // Get user email from auth
          const { data: userData } = await supabase.auth.admin.getUserById(membership.user_id);
          
          userMap.set(membership.user_id, {
            id: membership.user_id,
            email: userData?.user?.email || 'Unknown',
            membership: membership,
            plan: membership.membership_plans
          });
        }
      }

      setUsers(Array.from(userMap.values()));
    } catch (err) {
      console.error('Load users error:', err);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetails = async (user) => {
    try {
      // Load user bookings and sessions
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
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">User ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Start Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">End Date</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-300">{user.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-red-500">{user.plan?.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.membership?.status === 'active' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {user.membership?.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(user.membership?.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(user.membership?.end_date).toLocaleDateString()}
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
                  <p className="text-gray-400">User ID</p>
                  <p className="text-white font-bold">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-gray-400">Current Plan</p>
                  <p className="text-red-500 font-bold">{selectedUser.plan?.name}</p>
                </div>
              </div>
            </div>

            {/* Membership */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-white uppercase">Membership</h3>
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
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Status</p>
                  <p className="text-white font-bold">{selectedUser.membership?.status}</p>
                </div>
                <div>
                  <p className="text-gray-400">Start Date</p>
                  <p className="text-white font-bold">
                    {new Date(selectedUser.membership?.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">End Date</p>
                  <p className="text-white font-bold">
                    {new Date(selectedUser.membership?.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
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
          </div>
        )}
      </Modal>
    </>
  );
};

// ==================== CLASSES MANAGEMENT ====================
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

// ==================== TRAINERS MANAGEMENT ====================
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

// ==================== BOOKINGS MANAGEMENT ====================
const BookingsManagement = ({ showToast }) => {
  const [bookings, setBookings] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('classes');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      // Load class bookings
      const { data: classBookings, error: classError } = await supabase
        .from('class_bookings')
        .select(`
          *,
          classes(*),
          payments(*)
        `)
        .order('created_at', { ascending: false });

      // Load trainer sessions
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

      // Get user emails for all bookings
      const bookingsWithEmails = await Promise.all(
        (classBookings || []).map(async (booking) => {
          const { data: userData } = await supabase.auth.admin.getUserById(booking.user_id);
          return {
            ...booking,
            user_email: userData?.user?.email || 'Unknown'
          };
        })
      );

      const sessionsWithEmails = await Promise.all(
        (trainerSessions || []).map(async (session) => {
          const { data: userData } = await supabase.auth.admin.getUserById(session.user_id);
          return {
            ...session,
            user_email: userData?.user?.email || 'Unknown'
          };
        })
      );

      setBookings(bookingsWithEmails);
      setSessions(sessionsWithEmails);
    } catch (err) {
      console.error('Load bookings error:', err);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
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
      showToast('Status updated successfully', 'success');
      loadBookings();
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
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Payment</th>
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
                      {booking.payments ? (
                        <span className="text-xs text-green-500 font-bold">✓ PAID</span>
                      ) : (
                        <span className="text-xs text-gray-500">NO PAYMENT</span>
                      )}
                    </td>
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
                      <select
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking.id, e.target.value, 'class')}
                        className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1 text-xs text-white font-bold"
                      >
                        <option value="confirmed">CONFIRMED</option>
                        <option value="cancelled">CANCELLED</option>
                        <option value="completed">COMPLETED</option>
                      </select>
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
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Payment</th>
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
                      {session.payments ? (
                        <span className="text-xs text-green-500 font-bold">✓ PAID</span>
                      ) : (
                        <span className="text-xs text-gray-500">NO PAYMENT</span>
                      )}
                    </td>
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
                      <select
                        value={session.status}
                        onChange={(e) => updateBookingStatus(session.id, e.target.value, 'session')}
                        className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1 text-xs text-white font-bold"
                      >
                        <option value="scheduled">SCHEDULED</option>
                        <option value="completed">COMPLETED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

// ==================== INQUIRIES MANAGEMENT ====================
const InquiriesManagement = ({ showToast }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showInquiryDetails, setShowInquiryDetails] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, []);

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
          </div>
        )}
      </Modal>
    </>
  );
};

// ==================== DASHBOARD ====================
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
      // Get unique users from auth.users table
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      // Get memberships
      const { data: memberships, error: membError } = await supabase
        .from('user_memberships')
        .select('*');

      // Get bookings
      const { data: bookings, error: bookError } = await supabase
        .from('class_bookings')
        .select('*');

      // Get trainer sessions
      const { data: sessions, error: sessError } = await supabase
        .from('trainer_sessions')
        .select('*');

      // Get inquiries
      const { data: inquiries, error: inqError } = await supabase
        .from('contact_inquiries')
        .select('*')
        .eq('status', 'new');

      // Get payments
      const { data: payments, error: payError } = await supabase
        .from('payments')
        .select('amount, status')
        .eq('status', 'completed');

      // Get trainers count
      const { count: trainersCount } = await supabase
        .from('trainers')
        .select('*', { count: 'exact', head: true });

      // Get classes count
      const { count: classesCount } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true });

      // Calculate stats
      const totalRevenue = payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;
      const activeMembers = memberships?.filter(m => m.status === 'active').length || 0;
      
      // Get unique users who have memberships
      const uniqueUserIds = new Set(memberships?.map(m => m.user_id));
      const totalUsers = uniqueUserIds.size;

      // Total bookings include both class bookings and trainer sessions
      const totalBookings = (bookings?.length || 0) + (sessions?.length || 0);

      setStats({
        totalUsers: totalUsers,
        activeMembers: activeMembers,
        totalBookings: totalBookings,
        totalRevenue: totalRevenue,
        pendingInquiries: inquiries?.length || 0,
        totalTrainers: trainersCount || 0,
        totalClasses: classesCount || 0
      });
    } catch (err) {
      console.error('Stats error:', err);
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
          value={stats.totalUsers}
          subtitle={`${stats.activeMembers} active`}
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
          <p className="text-sm text-gray-400 mt-2">Out of {stats.totalUsers} total members</p>
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

// ==================== MAIN ADMIN APP ====================
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
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header */}
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
      </main>
    </div>
  );
}