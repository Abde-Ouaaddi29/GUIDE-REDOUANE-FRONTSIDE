"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { FaCalendarCheck, FaCommentDots, FaChartBar, FaChartPie } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { URL_SERVER } from '@/app/constants';

// Fallback colors & pie slice labels (ratings not implemented backend yet)
const FEEDBACK_STATUS_COLORS: Record<string,string> = {
  PENDING: '#FFBB28',
  APPROVED: '#00C49F',
  DEACTIVATED: '#F44336'
};

// Workaround: some TS setups mis-infer Recharts JSX types. Cast to any to silence spurious errors.
// (If types resolve later, these casts can be removed.)
const RCBarChart: any = BarChart;
const RCBar: any = Bar;
const RCXAxis: any = XAxis;
const RCYAxis: any = YAxis;
const RCLegend: any = Legend;
const RCPieChart: any = PieChart;
const RCPie: any = Pie;
const RCCell: any = Cell;

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#F44336'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [appliedFrom, setAppliedFrom] = useState<string>('');
  const [appliedTo, setAppliedTo] = useState<string>('');

  const filtersDirty = fromDate !== appliedFrom || toDate !== appliedTo;

  const fetchData = async (initial:boolean=false) => {
    if (initial) setLoading(true); else setRefreshing(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('per_page','200');
      if (appliedFrom) params.set('from', appliedFrom);
      if (appliedTo) params.set('to', appliedTo);
      const [resvResp, fbResp] = await Promise.all([
        fetch(`${URL_SERVER}/api/v1/reservations?`+params.toString()),
        fetch(`${URL_SERVER}/api/v1/feedback?per_page=200${appliedFrom?`&from=${appliedFrom}`:''}${appliedTo?`&to=${appliedTo}`:''}`)
      ]);
      if (!resvResp.ok) throw new Error('Failed reservations');
      if (!fbResp.ok) throw new Error('Failed feedback');
      const resvJson = await resvResp.json();
      const fbJson = await fbResp.json();
      setReservations((resvJson.data||resvJson));
      setFeedbacks((fbJson.data||fbJson));
    } catch (e:any) {
      setError(e.message || 'Failed to load stats');
    } finally {
      if (initial) setLoading(false); else setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(true); }, []);

  const StatCard = ({ icon, title, value, colorClass }:{icon:React.ReactNode; title:string; value:number|string; colorClass:string}) => (
    <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className={`p-4 rounded-full mr-4 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        )}
      </div>
    </motion.div>
  );

  // Derived stats
  const reservationCount = reservations.length;
  const feedbackCount = feedbacks.length;

  // Monthly aggregation based on date_reservation or created_at fallback
  const monthlyReservationsData = useMemo(() => {
    const map: Record<string,number> = {};
    reservations.forEach(r => {
      const d = new Date(r.date_reservation || r.created_at);
      if (isNaN(d.getTime())) return;
      const key = d.toLocaleString('en', { month:'short' });
      map[key] = (map[key]||0) + 1;
    });
    const order = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return order.map(m => ({ month:m, reservations: map[m]||0 })).filter(row => row.reservations>0);
  }, [reservations]);

  // Y-axis integer ticks (1,2,3,...) based on max reservations in any month
  const reservationYAxisTicks = useMemo(() => {
    const maxVal = monthlyReservationsData.reduce((acc, cur) => Math.max(acc, cur.reservations), 0);
    if (maxVal <= 0) return [0,1];
    return Array.from({ length: maxVal }, (_, i) => i + 1);
  }, [monthlyReservationsData]);

  // Feedback status distribution
  const feedbackRatingsData = useMemo(() => {
    const counts: Record<string,number> = {};
    feedbacks.forEach(f => { counts[f.status] = (counts[f.status]||0)+1; });
    return Object.entries(counts).map(([name,value]) => ({ name, value }));
  }, [feedbacks]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex gap-4 flex-1">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">From</label>
            <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} className="border-gray-300 text-sm rounded px-2 py-2 focus:ring-pink-300 focus:border-pink-300" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">To</label>
            <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} className="border-gray-300 text-sm rounded px-2 py-2 focus:ring-pink-300 focus:border-pink-300" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>{ setFromDate(''); setToDate(''); setAppliedFrom(''); setAppliedTo(''); fetchData(true); }} className="px-4 py-2 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50">Reset</button>
          <button disabled={!filtersDirty || loading || refreshing} onClick={()=>{ setAppliedFrom(fromDate); setAppliedTo(toDate); fetchData(); }} className="px-4 py-2 text-sm rounded bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-60 flex items-center gap-2">
            {refreshing && <span className="w-3 h-3 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />}
            Apply
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded mb-4">{error}</div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={<FaCalendarCheck className="text-2xl text-blue-600" />}
          title="Total Reservations"
          value={reservationCount}
          colorClass="bg-blue-100"
        />
        <StatCard
          icon={<FaCommentDots className="text-2xl text-green-600" />}
          title="Total Feedback"
          value={feedbackCount}
          colorClass="bg-green-100"
        />
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reservations Chart */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaChartBar className="mr-2 text-pink-500" />
            Monthly Reservations
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <RCBarChart data={monthlyReservationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <RCXAxis dataKey="month" />
                <RCYAxis
                  allowDecimals={false}
                  domain={[0, reservationYAxisTicks[reservationYAxisTicks.length-1] || 1]}
                  ticks={reservationYAxisTicks}
                  tickFormatter={(v:number)=> v === 0 ? '' : v}
                />
                <Tooltip />
                <RCLegend />
                <RCBar dataKey="reservations" fill="#8884d8" />
              </RCBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Feedback Chart */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaChartPie className="mr-2 text-pink-500" />
            Feedback Ratings
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <RCPie
                  data={feedbackRatingsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {feedbackRatingsData.map((entry, index) => (
                    <RCCell key={`cell-${index}`} fill={FEEDBACK_STATUS_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </RCPie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded px-6 py-4 flex items-center gap-3 shadow">
            <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-700">Loading statistics...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminPage;