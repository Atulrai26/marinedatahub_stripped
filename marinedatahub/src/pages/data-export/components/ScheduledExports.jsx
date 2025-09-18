import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const ScheduledExports = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [schedules, setSchedules] = useState([
    {
      id: 'sched_001',
      name: 'Weekly Species Report',
      description: 'Automated weekly export of species identification data',
      frequency: 'weekly',
      nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      lastRun: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      format: 'xlsx',
      datasets: ['species_classifications', 'otolith_images'],
      isActive: true,
      recipients: ['research@marine.org', 'data@fisheries.gov']
    },
    {
      id: 'sched_002',
      name: 'Monthly Ocean Data Backup',
      description: 'Complete oceanographic dataset backup',
      frequency: 'monthly',
      nextRun: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      lastRun: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      format: 'zip',
      datasets: ['temperature_2024', 'salinity_2024', 'bathymetry'],
      isActive: true,
      recipients: ['backup@marine.org']
    },
    {
      id: 'sched_003',
      name: 'Daily Analysis Summary',
      description: 'Daily summary of analysis results',
      frequency: 'daily',
      nextRun: new Date(Date.now() + 12 * 60 * 60 * 1000),
      lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000),
      format: 'pdf',
      datasets: ['correlation_analysis', 'trend_analysis'],
      isActive: false,
      recipients: ['team@marine.org']
    }
  ]);

  const [newSchedule, setNewSchedule] = useState({
    name: '',
    description: '',
    frequency: 'weekly',
    format: 'csv',
    datasets: [],
    recipients: [''],
    isActive: true
  });

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const formatOptions = [
    { value: 'csv', label: 'CSV' },
    { value: 'xlsx', label: 'Excel' },
    { value: 'json', label: 'JSON' },
    { value: 'pdf', label: 'PDF Report' },
    { value: 'zip', label: 'ZIP Archive' }
  ];

  const getFrequencyIcon = (frequency) => {
    switch (frequency) {
      case 'daily':
        return 'Calendar';
      case 'weekly':
        return 'CalendarDays';
      case 'monthly':
        return 'CalendarRange';
      case 'quarterly':
        return 'CalendarClock';
      default:
        return 'Clock';
    }
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggleActive = (scheduleId) => {
    setSchedules(schedules?.map(schedule =>
      schedule?.id === scheduleId
        ? { ...schedule, isActive: !schedule?.isActive }
        : schedule
    ));
  };

  const handleDeleteSchedule = (scheduleId) => {
    setSchedules(schedules?.filter(schedule => schedule?.id !== scheduleId));
  };

  const handleCreateSchedule = () => {
    if (!newSchedule?.name?.trim()) return;

    const schedule = {
      id: `sched_${Date.now()}`,
      ...newSchedule,
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
      lastRun: null,
      recipients: newSchedule?.recipients?.filter(email => email?.trim())
    };

    setSchedules([...schedules, schedule]);
    setNewSchedule({
      name: '',
      description: '',
      frequency: 'weekly',
      format: 'csv',
      datasets: [],
      recipients: [''],
      isActive: true
    });
    setIsCreating(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Scheduled Exports</h3>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsCreating(true)}
            iconName="Plus"
            iconPosition="left"
          >
            New Schedule
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Automate regular data exports and reports
        </p>
      </div>
      {isCreating && (
        <div className="p-4 border-b border-border bg-muted/20">
          <h4 className="font-medium text-foreground mb-4">Create New Schedule</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Schedule Name"
              placeholder="e.g., Weekly Species Report"
              value={newSchedule?.name}
              onChange={(e) => setNewSchedule({ ...newSchedule, name: e?.target?.value })}
            />
            <Select
              label="Frequency"
              options={frequencyOptions}
              value={newSchedule?.frequency}
              onChange={(value) => setNewSchedule({ ...newSchedule, frequency: value })}
            />
            <Input
              label="Description"
              placeholder="Brief description of the export"
              value={newSchedule?.description}
              onChange={(e) => setNewSchedule({ ...newSchedule, description: e?.target?.value })}
            />
            <Select
              label="Format"
              options={formatOptions}
              value={newSchedule?.format}
              onChange={(value) => setNewSchedule({ ...newSchedule, format: value })}
            />
          </div>
          
          <div className="mt-4">
            <Input
              label="Email Recipients"
              placeholder="email@example.com"
              value={newSchedule?.recipients?.[0]}
              onChange={(e) => setNewSchedule({
                ...newSchedule,
                recipients: [e?.target?.value]
              })}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleCreateSchedule}
              disabled={!newSchedule?.name?.trim()}
            >
              Create Schedule
            </Button>
          </div>
        </div>
      )}
      <div className="divide-y divide-border">
        {schedules?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="CalendarClock" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No scheduled exports</p>
            <p className="text-xs text-muted-foreground mt-1">Create a schedule to automate exports</p>
          </div>
        ) : (
          schedules?.map((schedule) => (
            <div key={schedule?.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Icon name={getFrequencyIcon(schedule?.frequency)} size={16} color="var(--color-primary)" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-sm font-medium text-foreground">{schedule?.name}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        schedule?.isActive 
                          ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                      }`}>
                        {schedule?.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">{schedule?.description}</p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>{schedule?.frequency?.charAt(0)?.toUpperCase() + schedule?.frequency?.slice(1)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="FileText" size={12} />
                        <span>{schedule?.format?.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Database" size={12} />
                        <span>{schedule?.datasets?.length} datasets</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>Next: {formatDate(schedule?.nextRun)}</span>
                      {schedule?.lastRun && (
                        <>
                          <span>•</span>
                          <span>Last: {formatDate(schedule?.lastRun)}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Icon name="Mail" size={12} />
                        <span>{schedule?.recipients?.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(schedule?.id)}
                    iconName={schedule?.isActive ? 'Pause' : 'Play'}
                    className="h-8 w-8 p-0"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Settings"
                    className="h-8 w-8 p-0"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSchedule(schedule?.id)}
                    iconName="Trash2"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-error"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduledExports;