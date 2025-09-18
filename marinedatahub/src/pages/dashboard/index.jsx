import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import QuickUpload from '../../components/ui/QuickUpload';
import ExportQueue from '../../components/ui/ExportQueue';
import SearchBar from '../../components/ui/SearchBar';
import MetricsCard from './components/MetricsCard';
import ProjectOverview from './components/ProjectOverview';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import SystemStatus from './components/SystemStatus';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const metricsData = [
    {
      title: "Total Datasets",
      value: "1,247",
      change: "+12%",
      changeType: "increase",
      icon: "Database",
      color: "primary"
    },
    {
      title: "Active Processing",
      value: "8",
      change: "+3",
      changeType: "increase",
      icon: "Activity",
      color: "accent"
    },
    {
      title: "AI Classifications",
      value: "3,892",
      change: "+156",
      changeType: "increase",
      icon: "Brain",
      color: "secondary"
    },
    {
      title: "Data Quality Score",
      value: "96.8%",
      change: "+2.1%",
      changeType: "increase",
      icon: "CheckCircle",
      color: "success"
    }
  ];

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dashboard - MarineDataHub</title>
        <meta name="description" content="Marine data integration and visualization platform dashboard with AI-powered analysis capabilities" />
      </Helmet>
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome to MarineDataHub
                </h1>
                <p className="text-muted-foreground">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-full lg:w-96">
                  <SearchBar />
                </div>
                <ExportQueue />
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                color={metric?.color}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Project Overview - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <ProjectOverview />
            </div>
            
            {/* Activity Feed - Takes 1 column on xl screens */}
            <div className="xl:col-span-1">
              <ActivityFeed />
            </div>
          </div>

          {/* System Status */}
          <div className="mb-8">
            <SystemStatus />
          </div>

          {/* Footer Info */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Research Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Integrated marine data analysis with AI-powered species identification
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Data Sources</h3>
                <p className="text-sm text-muted-foreground">
                  Oceanographic, fisheries, and molecular biodiversity datasets
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">AI Capabilities</h3>
                <p className="text-sm text-muted-foreground">
                  Species classification, trend analysis, and correlation detection
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <QuickUpload />
    </div>
  );
};

export default Dashboard;