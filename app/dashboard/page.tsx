
// pages/dashboard.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SalesDashboard from '@/components/Dashboards/SalesDashboard';
import FinanceDashboard from '@/components/Dashboards/FinanceDashboard';
import DeveloperDashboard from '@/components/Dashboards/DeveloperDashboard';
import InvestorDashboard from '@/components/Dashboards/InvestorDashboard';
import ClientDashboard from '@/components/Dashboards/ClientDashboard';
import PartnerDashboard from '@/components/Dashboards/PartnerDashboard';

const Dashboard = () => {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Here, you can fetch user data from session or context
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.role) {
      router.push('/login');  // Redirect to login if no role exists
    } else {
      setRole(user.role);  // Set user role
    }
  }, []);

  if (!role) return <div>Loading...</div>;  // Wait for role to be set

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome to Your Dashboard</h1>
      {role === 'sales' && <SalesDashboard />}
      {role === 'finance' && <FinanceDashboard />}
      {role === 'developer' && <DeveloperDashboard />}
      {role === 'investor' && <InvestorDashboard />}
      {role === 'client' && <ClientDashboard />}
      {role === 'partner' && <PartnerDashboard />}
    </div>
  );
}

export default Dashboard;
