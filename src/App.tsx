import React, { useState, useMemo, CSSProperties } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Scatter, ScatterChart, ZAxis } from 'recharts';

interface Product {
  id: string;
  name: string;
  category: 'Classic' | 'Pitmaster';
  meatType: 'Beef' | 'Pork' | 'Poultry';
  weight: number;
  costPrice: number;
  wastePercentage: number;
  prepTimeMinutes: number;
  sellPrice: number;
  margin: number;
  units: number;
}

interface StartupCost {
  id: string;
  category: string;
  item: string;
  estimatedCost: number;
  actualCost: number;
  paid: boolean;
  notes: string;
}

interface MonthlyCost {
  id: string;
  category: string;
  item: string;
  monthlyCost: number;
  annualCost: number;
  type: string;
  notes: string;
}

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  } as CSSProperties,
  header: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '24px'
  } as CSSProperties,
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto'
  } as CSSProperties,
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2F3E46',
    margin: 0
  } as CSSProperties,
  subtitle: {
    color: '#282828',
    marginTop: '8px',
    fontSize: '16px'
  } as CSSProperties,
  tabsContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px'
  } as CSSProperties,
  tabsWrapper: {
    display: 'flex',
    gap: '4px',
    marginTop: '24px',
    borderBottom: '1px solid #e5e5e5'
  } as CSSProperties,
  tab: {
    padding: '12px 24px',
    fontWeight: '500',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: '#282828',
    borderRadius: '8px 8px 0 0',
    transition: 'all 0.2s'
  } as CSSProperties,
  tabActive: {
    backgroundColor: '#fff',
    color: '#587C74',
    borderBottom: '2px solid #587C74'
  } as CSSProperties,
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px'
  } as CSSProperties,
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  } as CSSProperties,
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px'
  } as CSSProperties,
  metricLabel: {
    fontSize: '14px',
    color: '#282828',
    marginBottom: '8px'
  } as CSSProperties,
  metricValue: {
    fontSize: '28px',
    fontWeight: 'bold'
  } as CSSProperties,
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '24px',
    marginBottom: '24px'
  } as CSSProperties,
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  } as CSSProperties,
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2F3E46',
    margin: 0
  } as CSSProperties,
  button: {
    backgroundColor: '#587C74',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  } as CSSProperties,
  buttonHover: {
    backgroundColor: '#4a6b64'
  } as CSSProperties,
  filterButton: {
    padding: '8px 16px',
    border: '1px solid #d4d4d4',
    borderRadius: '6px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  } as CSSProperties,
  filterButtonActive: {
    backgroundColor: '#587C74',
    color: '#fff',
    borderColor: '#587C74'
  } as CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  } as CSSProperties,
  tableHeader: {
    backgroundColor: '#f5f5f5',
    textAlign: 'left' as const,
    padding: '12px',
    fontWeight: '600',
    color: '#2F3E46'
  } as CSSProperties,
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #e5e5e5',
    position: 'relative' as const
  } as CSSProperties,
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #d4d4d4',
    borderRadius: '4px',
    fontSize: '14px'
  } as CSSProperties,
  inputSmall: {
    width: '80px',
    padding: '8px',
    border: '1px solid #d4d4d4',
    borderRadius: '4px',
    fontSize: '14px',
    textAlign: 'right' as const
  } as CSSProperties,
  select: {
    width: '100%',
    padding: '8px',
    border: '1px solid #d4d4d4',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#fff',
    minWidth: '120px'
  } as CSSProperties,
  deleteButton: {
    color: '#BB463C',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    fontWeight: 'bold'
  } as CSSProperties,
  statusBadge: {
    padding: '8px 16px',
    borderRadius: '4px',
    fontWeight: '600',
    display: 'inline-block',
    marginLeft: '8px'
  } as CSSProperties,
  progressBar: {
    width: '100%',
    height: '24px',
    backgroundColor: '#e5e5e5',
    borderRadius: '12px',
    overflow: 'hidden' as const,
    marginTop: '8px'
  } as CSSProperties,
  progressFill: {
    height: '100%',
    backgroundColor: '#587C74',
    transition: 'width 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '8px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600'
  } as CSSProperties,
  infoBox: {
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '16px'
  } as CSSProperties,
  warningBox: {
    backgroundColor: '#fff3cd',
    border: '1px solid #BB463C',
    borderLeft: '4px solid #BB463C',
    borderRadius: '8px',
    padding: '20px',
    marginTop: '16px'
  } as CSSProperties,
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  } as CSSProperties,
  filterButtonsContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    marginBottom: '16px'
  } as CSSProperties,
  sectionDivider: {
    marginTop: '32px',
    paddingTop: '32px',
    borderTop: '2px solid #e5e5e5'
  } as CSSProperties,
  eyeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
    opacity: 0.6
  } as CSSProperties,
  eyeButtonHover: {
    opacity: 1
  } as CSSProperties,
  infoIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#587C74',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'help',
    marginLeft: '6px',
    position: 'relative' as const,
    flexShrink: 0
  } as CSSProperties,
  tooltip: {
    position: 'absolute' as const,
    bottom: '25px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#2F3E46',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: '1.5',
    width: '280px',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    pointerEvents: 'none' as const
  } as CSSProperties,
  tooltipArrow: {
    position: 'absolute' as const,
    bottom: '-6px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid #2F3E46'
  } as CSSProperties
};

const BreakEvenAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'break-even' | 'startup' | 'monthly'>('break-even');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [hoveredEye, setHoveredEye] = useState<string | null>(null);

  // Panel visibility states
  const [showBreakEvenStatus, setShowBreakEvenStatus] = useState(true);
  const [showProfitProjection, setShowProfitProjection] = useState(true);
  const [showLaborCapacity, setShowLaborCapacity] = useState(true);
  const [showSeasonality, setShowSeasonality] = useState(true);
  const [showProductPerformance, setShowProductPerformance] = useState(true);
  const [showProductEfficiency, setShowProductEfficiency] = useState(true);
  const [showMarginContribution, setShowMarginContribution] = useState(true);
  const [showClassicVsPitmaster, setShowClassicVsPitmaster] = useState(true);
  const [showSalesVolumeInput, setShowSalesVolumeInput] = useState(true);

  // Product performance chart view states
  const [showMarginPerUnit, setShowMarginPerUnit] = useState(true);
  const [showUnitsPerHour, setShowUnitsPerHour] = useState(false);
  const [showHourlyProfitPotential, setShowHourlyProfitPotential] = useState(false);
  const [showMonthlySalesPotential, setShowMonthlySalesPotential] = useState(false);

  // Tooltip hover state
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'IERS Classic Burger',
      category: 'Classic',
      meatType: 'Beef',
      weight: 3.2,
      costPrice: 15.45,
      wastePercentage: 10,
      prepTimeMinutes: 10,
      sellPrice: 10,
      margin: -7.00,
      units: 80
    },
    {
      id: '2',
      name: 'IERS Pitmaster Brisket',
      category: 'Pitmaster',
      meatType: 'Beef',
      weight: 1,
      costPrice: 18.79,
      wastePercentage: 10,
      prepTimeMinutes: 12,
      sellPrice: 100,
      margin: 79.33,
      units: 10
    },
    {
      id: '3',
      name: 'IERS Pitmaster Ribs',
      category: 'Pitmaster',
      meatType: 'Pork',
      weight: 6,
      costPrice: 13.8,
      wastePercentage: 10,
      prepTimeMinutes: 15,
      sellPrice: 100,
      margin: 84.82,
      units: 10
    },
    {
      id: '4',
      name: 'IERS Pitmaster Steak',
      category: 'Pitmaster',
      meatType: 'Beef',
      weight: 2.5,
      costPrice: 15.55,
      wastePercentage: 10,
      prepTimeMinutes: 10,
      sellPrice: 100,
      margin: 82.89,
      units: 10
    },
    {
      id: '5',
      name: 'IERS Pitmaster Lamb',
      category: 'Pitmaster',
      meatType: 'Beef',
      weight: 2.5,
      costPrice: 41,
      wastePercentage: 10,
      prepTimeMinutes: 18,
      sellPrice: 100,
      margin: 54.90,
      units: 10
    },
    {
      id: '6',
      name: 'IERS Pitmaster Pulled Pork',
      category: 'Pitmaster',
      meatType: 'Pork',
      weight: 3.7,
      costPrice: 29.7,
      wastePercentage: 10,
      prepTimeMinutes: 20,
      sellPrice: 100,
      margin: 67.33,
      units: 10
    }
  ]);

  const [startupCosts, setStartupCosts] = useState<StartupCost[]>([
    { id: '1', category: 'Equipment', item: 'Smoker', estimatedCost: 5000, actualCost: 4800, paid: true, notes: 'Main cooking equipment' },
    { id: '2', category: 'Equipment', item: 'Refrigeration', estimatedCost: 3000, actualCost: 2800, paid: true, notes: 'Walk-in cooler' },
    { id: '3', category: 'Licensing', item: 'Business License', estimatedCost: 500, actualCost: 450, paid: true, notes: 'Annual renewal' },
    { id: '4', category: 'Setup', item: 'Initial Inventory', estimatedCost: 2000, actualCost: 2200, paid: false, notes: 'First stock order' }
  ]);

  const [monthlyCosts, setMonthlyCosts] = useState<MonthlyCost[]>([
    { id: '1', category: 'Space', item: 'Rent', monthlyCost: 8000, annualCost: 96000, type: 'Fixed', notes: 'Commercial kitchen space' },
    { id: '2', category: 'Labor', item: 'Butcher/Chef salary', monthlyCost: 6000, annualCost: 72000, type: 'Fixed', notes: 'Monthly salary' },
    { id: '3', category: 'Utilities', item: 'Electric & Gas', monthlyCost: 800, annualCost: 9600, type: 'Variable', notes: 'Smoker operation' },
    { id: '4', category: 'Marketing', item: 'Digital Ads', monthlyCost: 500, annualCost: 6000, type: 'Variable', notes: 'Social media & online' },
    { id: '5', category: 'Insurance', item: 'Business Insurance', monthlyCost: 400, annualCost: 4800, type: 'Fixed', notes: 'General liability' },
    { id: '6', category: 'Supplies', item: 'Packaging', monthlyCost: 300, annualCost: 3600, type: 'Variable', notes: 'Boxes, labels, bags' },
    { id: '7', category: 'Supplies', item: 'Cleaning Supplies', monthlyCost: 40, annualCost: 480, type: 'Variable', notes: 'Sanitizers, cloths' }
  ]);

  const [selectedProductFilter, setSelectedProductFilter] = useState<'all' | 'classic' | 'pitmaster'>('all');

  // Labor capacity inputs
  const [hoursPerDay, setHoursPerDay] = useState(5);
  const [daysPerMonth, setDaysPerMonth] = useState(18);

  // Seasonality multipliers (% of baseline)
  const [seasonalMultipliers, setSeasonalMultipliers] = useState({
    Jan: 70, Feb: 70, Mar: 85, Apr: 100, May: 120, Jun: 140,
    Jul: 150, Aug: 145, Sep: 120, Oct: 100, Nov: 80, Dec: 90
  });

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: 'New Product',
      category: 'Classic',
      meatType: 'Beef',
      weight: 1,
      costPrice: 0,
      wastePercentage: 10,
      prepTimeMinutes: 10,
      sellPrice: 0,
      margin: 0,
      units: 0
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value };
        
        // Calculate true cost (includes waste)
        const trueCost = updated.costPrice / (1 - updated.wastePercentage / 100);
        
        // Calculate margin
        updated.margin = updated.sellPrice - trueCost;
        
        return updated;
      }
      return p;
    }));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addStartupCost = () => {
    const newCost: StartupCost = {
      id: Date.now().toString(),
      category: '',
      item: '',
      estimatedCost: 0,
      actualCost: 0,
      paid: false,
      notes: ''
    };
    setStartupCosts([...startupCosts, newCost]);
  };

  const updateStartupCost = (id: string, field: keyof StartupCost, value: any) => {
    setStartupCosts(startupCosts.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const deleteStartupCost = (id: string) => {
    setStartupCosts(startupCosts.filter(c => c.id !== id));
  };

  const addMonthlyCost = () => {
    const newCost: MonthlyCost = {
      id: Date.now().toString(),
      category: '',
      item: '',
      monthlyCost: 0,
      annualCost: 0,
      type: 'Fixed',
      notes: ''
    };
    setMonthlyCosts([...monthlyCosts, newCost]);
  };

  const updateMonthlyCost = (id: string, field: keyof MonthlyCost, value: any) => {
    setMonthlyCosts(monthlyCosts.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        if (field === 'monthlyCost') {
          updated.annualCost = value * 12;
        }
        return updated;
      }
      return c;
    }));
  };

  const deleteMonthlyCost = (id: string) => {
    setMonthlyCosts(monthlyCosts.filter(c => c.id !== id));
  };

  const updateSeasonalMultiplier = (month: string, value: number) => {
    setSeasonalMultipliers({
      ...seasonalMultipliers,
      [month]: value
    });
  };

  const resetSeasonality = () => {
    setSeasonalMultipliers({
      Jan: 100, Feb: 100, Mar: 100, Apr: 100, May: 100, Jun: 100,
      Jul: 100, Aug: 100, Sep: 100, Oct: 100, Nov: 100, Dec: 100
    });
  };

  const applyBBQSeasonality = () => {
    setSeasonalMultipliers({
      Jan: 70, Feb: 70, Mar: 85, Apr: 100, May: 120, Jun: 140,
      Jul: 150, Aug: 145, Sep: 120, Oct: 100, Nov: 80, Dec: 90
    });
  };

  const calculations = useMemo(() => {
    const filteredProducts = products.filter(p => {
      if (selectedProductFilter === 'all') return true;
      if (selectedProductFilter === 'classic') return p.category === 'Classic';
      if (selectedProductFilter === 'pitmaster') return p.category === 'Pitmaster';
      return true;
    });

    const totalRevenue = filteredProducts.reduce((sum, p) => sum + (p.sellPrice * p.units), 0);
    const totalCost = filteredProducts.reduce((sum, p) => {
      const trueCost = p.costPrice / (1 - p.wastePercentage / 100);
      return sum + (trueCost * p.units);
    }, 0);
    const totalMargin = totalRevenue - totalCost;

    const classicProducts = filteredProducts.filter(p => p.category === 'Classic');
    const pitmasterProducts = filteredProducts.filter(p => p.category === 'Pitmaster');

    const classicRevenue = classicProducts.reduce((sum, p) => sum + (p.sellPrice * p.units), 0);
    const pitmasterRevenue = pitmasterProducts.reduce((sum, p) => sum + (p.sellPrice * p.units), 0);

    const classicCost = classicProducts.reduce((sum, p) => {
      const trueCost = p.costPrice / (1 - p.wastePercentage / 100);
      return sum + (trueCost * p.units);
    }, 0);
    const pitmasterCost = pitmasterProducts.reduce((sum, p) => {
      const trueCost = p.costPrice / (1 - p.wastePercentage / 100);
      return sum + (trueCost * p.units);
    }, 0);

    const classicMargin = classicRevenue - classicCost;
    const pitmasterMargin = pitmasterRevenue - pitmasterCost;

    const classicUnits = classicProducts.reduce((sum, p) => sum + p.units, 0);
    const pitmasterUnits = pitmasterProducts.reduce((sum, p) => sum + p.units, 0);

    const classicPrepTime = classicProducts.reduce((sum, p) => sum + (p.prepTimeMinutes * p.units), 0);
    const pitmasterPrepTime = pitmasterProducts.reduce((sum, p) => sum + (p.prepTimeMinutes * p.units), 0);

    const classicAvgMargin = classicUnits > 0 ? classicMargin / classicUnits : 0;
    const pitmasterAvgMargin = pitmasterUnits > 0 ? pitmasterMargin / pitmasterUnits : 0;

    return {
      totalRevenue,
      totalCost,
      totalMargin,
      classicRevenue,
      pitmasterRevenue,
      classicCost,
      pitmasterCost,
      classicMargin,
      pitmasterMargin,
      classicUnits,
      pitmasterUnits,
      classicPrepTime,
      pitmasterPrepTime,
      classicAvgMargin,
      pitmasterAvgMargin
    };
  }, [products, selectedProductFilter]);

  const totalStartupCosts = startupCosts.reduce((sum, cost) => sum + cost.actualCost, 0);
  const paidStartupCosts = startupCosts.filter(c => c.paid).reduce((sum, cost) => sum + cost.actualCost, 0);
  const unpaidStartupCosts = totalStartupCosts - paidStartupCosts;

  const totalMonthlyOpex = monthlyCosts.reduce((sum, cost) => sum + cost.monthlyCost, 0);
  const totalOperatingExpenses = totalMonthlyOpex + calculations.totalCost;
  const monthlyNetProfit = calculations.totalRevenue - totalOperatingExpenses;

  // Labor capacity calculations
  const totalMonthlyMinutes = hoursPerDay * 60 * daysPerMonth;
  const totalPrepTime = products.reduce((sum, p) => sum + (p.prepTimeMinutes * p.units), 0);
  const remainingCapacity = totalMonthlyMinutes - totalPrepTime;
  const utilizationPercent = totalMonthlyMinutes > 0 ? (totalPrepTime / totalMonthlyMinutes) * 100 : 0;

  // Break-even calculations
  const marginPercent = calculations.totalRevenue > 0 ? (calculations.totalMargin / calculations.totalRevenue) * 100 : 0;
  const isProfitable = monthlyNetProfit >= 0;

  // Calculate monthly performance with seasonality
  const monthlyData = Object.entries(seasonalMultipliers).map(([month, multiplier]) => {
    const monthRevenue = (calculations.totalRevenue * multiplier) / 100;
    const monthCOGS = (calculations.totalCost * multiplier) / 100;
    const monthGrossMargin = monthRevenue - monthCOGS;
    const monthOperatingExpenses = totalMonthlyOpex;
    const monthNetProfit = monthGrossMargin - monthOperatingExpenses;
    
    return {
      month,
      multiplier,
      revenue: monthRevenue,
      cogs: monthCOGS,
      grossMargin: monthGrossMargin,
      operatingExpenses: monthOperatingExpenses,
      netProfit: monthNetProfit,
      capacityUsed: (utilizationPercent * multiplier) / 100
    };
  });

  const annualRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const annualNetProfit = monthlyData.reduce((sum, m) => sum + m.netProfit, 0);
  const avgMonthlyProfit = annualNetProfit / 12;

  const bestMonth = monthlyData.reduce((best, current) => 
    current.netProfit > best.netProfit ? current : best
  , monthlyData[0]);

  const worstMonth = monthlyData.reduce((worst, current) => 
    current.netProfit < worst.netProfit ? current : worst
  , monthlyData[0]);

  // Cash reserve calculation
  const sortedMonths = [...monthlyData].sort((a, b) => a.netProfit - b.netProfit);
  const threeWorstMonths = sortedMonths.slice(0, 3);
  const cashReserveNeeded = Math.abs(threeWorstMonths.reduce((sum, m) => sum + Math.min(0, m.netProfit), 0));

  // 24-month projection with fixed cumulative profit calculation
  const projectionData = [];
  let cumulativeProfit = -totalStartupCosts; // Start with negative startup costs
  
  for (let month = 0; month <= 24; month++) {
    // For month 0, don't add any profit yet - just show the startup cost hole
    if (month === 0) {
      projectionData.push({
        month,
        monthName: 'Start',
        netProfit: 0,
        cumulativeProfit: cumulativeProfit,
        breakEven: 0
      });
      continue;
    }
    
    const monthIndex = (month - 1) % 12;
    const monthName = Object.keys(seasonalMultipliers)[monthIndex];
    const multiplier = Object.values(seasonalMultipliers)[monthIndex];
    
    const monthRevenue = (calculations.totalRevenue * multiplier) / 100;
    const monthCOGS = (calculations.totalCost * multiplier) / 100;
    const monthGrossMargin = monthRevenue - monthCOGS;
    const monthNetProfit = monthGrossMargin - totalMonthlyOpex;
    
    cumulativeProfit += monthNetProfit; // Add each month's net profit to cumulative
    
    projectionData.push({
      month,
      monthName,
      netProfit: monthNetProfit,
      cumulativeProfit: cumulativeProfit,
      breakEven: 0 // This is the break-even line at 0
    });
  }

  // Product performance metrics
  const productMetrics = products.map(p => {
    const trueCost = p.costPrice / (1 - p.wastePercentage / 100);
    const marginPerUnit = p.sellPrice - trueCost;
    const unitsPerHour = p.prepTimeMinutes > 0 ? 60 / p.prepTimeMinutes : 0;
    const euroPerMinute = p.prepTimeMinutes > 0 ? marginPerUnit / p.prepTimeMinutes : 0;
    const hourlyProfitPotential = unitsPerHour * marginPerUnit;
    const monthlySalesPotential = (totalMonthlyMinutes / p.prepTimeMinutes) * marginPerUnit;
    const totalMarginContribution = marginPerUnit * p.units;

    return {
      ...p,
      trueCost,
      marginPerUnit,
      unitsPerHour,
      euroPerMinute,
      hourlyProfitPotential,
      monthlySalesPotential,
      totalMarginContribution
    };
  }).sort((a, b) => b.marginPerUnit - a.marginPerUnit);

  const productEfficiencyRanking = [...productMetrics].sort((a, b) => b.euroPerMinute - a.euroPerMinute);
  const topMarginProducts = [...productMetrics].sort((a, b) => b.totalMarginContribution - a.totalMarginContribution).slice(0, 10);

  // Eye icon SVG component
  const EyeIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ color: '#587C74' }}
    >
      {isOpen ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </>
      )}
    </svg>
  );

  // Info icon component with tooltip
  const InfoIcon = ({ id, text }: { id: string; text: string }) => (
    <div
      style={styles.infoIcon}
      onMouseEnter={() => setHoveredTooltip(id)}
      onMouseLeave={() => setHoveredTooltip(null)}
    >
      i
      {hoveredTooltip === id && (
        <div style={styles.tooltip}>
          {text}
          <div style={styles.tooltipArrow} />
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Verbree Butchery - Business Analysis</h1>
          <p style={styles.subtitle}>Break-even analysis and financial planning dashboard</p>
        </div>
      </div>

      <div style={styles.tabsContainer}>
        <div style={styles.tabsWrapper}>
          <button
            onClick={() => setActiveTab('break-even')}
            style={{
              ...styles.tab,
              ...(activeTab === 'break-even' ? styles.tabActive : {})
            }}
          >
            Break-Even Analysis
          </button>
          <button
            onClick={() => setActiveTab('startup')}
            style={{
              ...styles.tab,
              ...(activeTab === 'startup' ? styles.tabActive : {})
            }}
          >
            Startup Costs
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            style={{
              ...styles.tab,
              ...(activeTab === 'monthly' ? styles.tabActive : {})
            }}
          >
            Monthly Operating Costs
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {activeTab === 'break-even' && (
          <div>
            {/* Top Metrics Panel - Added Startup Costs */}
            <div style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <div style={styles.metricLabel}>Monthly Revenue</div>
                <div style={{...styles.metricValue, color: '#587C74'}}>
                  €{calculations.totalRevenue.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.metricLabel}>Monthly Gross Margin</div>
                <div style={{...styles.metricValue, color: '#587C74'}}>
                  €{calculations.totalMargin.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                </div>
                <div style={{fontSize: '12px', color: '#282828', marginTop: '4px'}}>
                  (Includes waste/packaging)
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.metricLabel}>Operating Expenses</div>
                <div style={{...styles.metricValue, color: '#BB463C'}}>
                  €{totalOperatingExpenses.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.metricLabel}>Monthly Net Profit</div>
                <div style={{...styles.metricValue, color: monthlyNetProfit >= 0 ? '#587C74' : '#BB463C'}}>
                  €{monthlyNetProfit.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.metricLabel}>One-Time Startup Costs</div>
                <div style={{...styles.metricValue, color: '#2F3E46'}}>
                  €{totalStartupCosts.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                </div>
                <div style={{fontSize: '12px', color: unpaidStartupCosts > 0 ? '#BB463C' : '#587C74', marginTop: '4px'}}>
                  {unpaidStartupCosts > 0 ? `€${unpaidStartupCosts.toFixed(2)} unpaid` : 'All paid'}
                </div>
              </div>
            </div>

            {/* Break-Even Status Panel with Eye Icon */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={{...styles.cardTitle, display: 'flex', alignItems: 'center'}}>
                  Break-Even Status
                  <InfoIcon id="panel-breakeven" text="Shows if your monthly revenue covers all operating expenses. Profitable = margin exceeds 100% of expenses. Track this to know if you're making or losing money each month." />
                </h2>
                <button
                  onMouseEnter={() => setHoveredEye('breakeven')}
                  onMouseLeave={() => setHoveredEye(null)}
                  onClick={() => setShowBreakEvenStatus(!showBreakEvenStatus)}
                  style={{
                    ...styles.eyeButton,
                    ...(hoveredEye === 'breakeven' ? styles.eyeButtonHover : {})
                  }}
                >
                  <EyeIcon isOpen={showBreakEvenStatus} />
                </button>
              </div>
              
              {showBreakEvenStatus && (
                <>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
                    <span style={{fontWeight: '600', marginRight: '8px'}}>Monthly Break-Even Point:</span>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: isProfitable ? '#e8f4f1' : '#ffe5e5',
                      color: isProfitable ? '#587C74' : '#BB463C'
                    }}>
                      {isProfitable ? '✓ PROFITABLE' : '✕ UNPROFITABLE'}
                    </span>
                  </div>

                  <p style={{fontSize: '16px', marginBottom: '8px'}}>
                    Current margin covers <strong>{marginPercent.toFixed(1)}%</strong> of operating expenses
                  </p>

                  <div style={{marginTop: '16px'}}>
                    <div style={{fontSize: '14px', color: '#282828', marginBottom: '4px'}}>Margin vs Operating Expenses</div>
                    <div style={styles.progressBar}>
                      <div style={{
                        ...styles.progressFill,
                        width: `${Math.min(Math.abs(marginPercent), 100)}%`,
                        backgroundColor: isProfitable ? '#587C74' : '#BB463C'
                      }}>
                        {Math.abs(marginPercent).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div style={{
                    ...styles.infoBox,
                    backgroundColor: isProfitable ? '#e8f4f1' : '#ffe5e5',
                    borderLeft: isProfitable ? '4px solid #587C74' : '4px solid #BB463C',
                    marginTop: '16px'
                  }}>
                    <strong>Startup Cost Recovery:</strong> {isProfitable 
                      ? 'Not yet profitable - cannot recover startup costs' 
                      : 'Not yet profitable - cannot recover startup costs'}
                  </div>
                </>
              )}
            </div>

            {/* 24-Month Profit Projection Panel with Eye Icon - FIXED */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={{...styles.cardTitle, display: 'flex', alignItems: 'center'}}>
                  24-Month Profit Projection
                  <InfoIcon id="panel-projection" text="Shows cumulative profit over 2 years starting from negative startup costs. When the line crosses €0 (break-even line), you've recovered your investment and start making money." />
                </h2>
                <button
                  onMouseEnter={() => setHoveredEye('projection')}
                  onMouseLeave={() => setHoveredEye(null)}
                  onClick={() => setShowProfitProjection(!showProfitProjection)}
                  style={{
                    ...styles.eyeButton,
                    ...(hoveredEye === 'projection' ? styles.eyeButtonHover : {})
                  }}
                >
                  <EyeIcon isOpen={showProfitProjection} />
                </button>
              </div>
              
              {showProfitProjection && (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Cumulative Profit (€)', angle: -90, position: 'insideLeft' }}
                      tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: any) => `€${parseFloat(value).toFixed(2)}`}
                      labelFormatter={(label) => `Month ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="breakEven" 
                      stroke="#2F3E46" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Break-Even Line"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cumulativeProfit" 
                      stroke="#587C74" 
                      strokeWidth={2}
                      name="Cumulative Profit"
                      dot={{ fill: '#587C74', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Labor Capacity Analysis Panel with Eye Icon */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={{...styles.cardTitle, display: 'flex', alignItems: 'center'}}>
                  ⏱️ Labor Capacity Analysis (Kees Units)
                  <InfoIcon id="panel-labor" text="Tracks available butcher time (Kees Units = minutes). Shows if your sales plan is realistic given prep time constraints. Over 90% utilization = may need more staff or slower months." />
                </h2>
                <button
                  onMouseEnter={() => setHoveredEye('labor')}
                  onMouseLeave={() => setHoveredEye(null)}
                  onClick={() => setShowLaborCapacity(!showLaborCapacity)}
                  style={{
                    ...styles.eyeButton,
                    ...(hoveredEye === 'labor' ? styles.eyeButtonHover : {})
                  }}
                >
                  <EyeIcon isOpen={showLaborCapacity} />
                </button>
              </div>
              
              {showLaborCapacity && (
                <>
                  <div style={{
                    ...styles.infoBox,
                    backgroundColor: '#e8f4f1',
                    borderLeft: '4px solid #587C74'
                  }}>
                    <p style={{margin: 0, fontSize: '14px'}}>
                      <strong>💡 What are Kees Units?</strong> 1 Kees Unit = 1 minute of butcher labor. This shows if your sales plan is realistic given available prep time.
                    </p>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: '150px 150px', gap: '16px', marginTop: '16px', marginBottom: '16px'}}>
                    <div>
                      <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px'}}>Hours per Day:</label>
                      <input
                        type="number"
                        value={hoursPerDay}
                        onChange={(e) => setHoursPerDay(parseInt(e.target.value) || 0)}
                        style={styles.input}
                      />
                    </div>
                    <div>
                      <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px'}}>Days per Month:</label>
                      <input
                        type="number"
                        value={daysPerMonth}
                        onChange={(e) => setDaysPerMonth(parseInt(e.target.value) || 0)}
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px'}}>
                    <div style={{
                      ...styles.infoBox,
                      backgroundColor: '#e8f4f1',
                      borderLeft: '4px solid #587C74',
                      margin: 0
                    }}>
                      <div style={{fontSize: '14px', color: '#282828', marginBottom: '4px'}}>Available</div>
                      <div style={{fontSize: '28px', fontWeight: 'bold', color: '#587C74'}}>
                        {totalMonthlyMinutes.toLocaleString()} min
                      </div>
                    </div>
                    <div style={{
                      ...styles.infoBox,
                      backgroundColor: '#ffe5e5',
                      borderLeft: '4px solid #BB463C',
                      margin: 0
                    }}>
                      <div style={{fontSize: '14px', color: '#282828', marginBottom: '4px'}}>Used</div>
                      <div style={{fontSize: '28px', fontWeight: 'bold', color: '#BB463C'}}>
                        {totalPrepTime.toLocaleString()} min
                      </div>
                    </div>
                    <div style={{
                      ...styles.infoBox,
                      backgroundColor: '#e8f4f1',
                      borderLeft: '4px solid #587C74',
                      margin: 0
                    }}>
                      <div style={{fontSize: '14px', color: '#282828', marginBottom: '4px'}}>Remaining</div>
                      <div style={{fontSize: '28px', fontWeight: 'bold', color: '#587C74'}}>
                        {remainingCapacity.toLocaleString()} min
                      </div>
                    </div>
                    <div style={{
                      ...styles.infoBox,
                      backgroundColor: '#e8f0f4',
                      borderLeft: '4px solid #2F3E46',
                      margin: 0
                    }}>
                      <div style={{fontSize: '14px', color: '#282828', marginBottom: '4px'}}>Utilization</div>
                      <div style={{fontSize: '28px', fontWeight: 'bold', color: '#2F3E46'}}>
                        {utilizationPercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${Math.min(utilizationPercent, 100)}%`,
                      backgroundColor: utilizationPercent > 90 ? '#BB463C' : '#587C74'
                    }}>
                      {utilizationPercent.toFixed(1)}%
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Seasonality & Annual Performance Panel with Eye Icon */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={{...styles.cardTitle, display: 'flex', alignItems: 'center'}}>
                  📅 Seasonality & Annual Performance
                  <InfoIcon id="panel-seasonality" text="Model monthly sales fluctuations. BBQ businesses see peak demand in summer (120-150% of baseline) and slower winters (70-90%). Adjust multipliers to match your expected seasonal patterns." />
                </h2>
                <button
                  onMouseEnter={() => setHoveredEye('seasonality')}
                  onMouseLeave={() => setHoveredEye(null)}
                  onClick={() => setShowSeasonality(!showSeasonality)}
                  style={{
                    ...styles.eyeButton,
                    ...(hoveredEye === 'seasonality' ? styles.eyeButtonHover : {})
                  }}
                >
                  <EyeIcon isOpen={showSeasonality} />
                </button>
              </div>
              
              {showSeasonality && (
                <>
                  <div style={{
                    ...styles.infoBox,
                    backgroundColor: '#fff3cd',
                    borderLeft: '4px solid #BB463C'
                  }}>
                    <p style={{margin: 0, fontSize: '14px'}}>
                      <strong>💡 Why This Matters:</strong> BBQ demand fluctuates by season. Summer is peak (BBQ season), winter is slower. These multipliers let you model realistic monthly variations from your baseline sales. Set 100% = baseline (current product volumes), then adjust each month up or down.
                    </p>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px', marginBottom: '16px'}}>
                    <div style={{
                      ...styles.infoBox,
                      backgroundColor: '#e8f4f1',
                      borderLeft: '4px solid #587C74',
                      margin: 0
                    }}>
                      <div style={{fontSize: '14px', color: '#282828', marginBottom: '4px'}}>Annual Revenue</div>
                      <div style={{fontSize: '28px', fontWeight: 'bold', color: '#587C74'}}>
                        €{annualRevenue.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </div>
                    </div>
                    <div style={{
                      ...styles.infoBox,
                      backgroundColor: '#ffe5e5',
                      borderLeft: '4px solid #BB463C',
                      margin: 0
                    }}>
                      <div style={{fontSize: '14px', color: '#282828', marginBottom: '4px'}}>Annual Net Profit</div>
                      <div style={{fontSize: '28px', fontWeight: 'bold', color: '#BB463C'}}>
                        €{annualNetProfit.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </div>
                    </div>
                    <div style={{
                      ...styles.infoBox,
                      backgroundColor: '#ffe5e5',
                      borderLeft: '4px solid #BB463C',
                      margin: 0
                    }}>
                      <div style={{fontSize: '14px', color: '#282828', marginBottom: '4px'}}>Avg Monthly Profit</div>
                      <div style={{fontSize: '28px', fontWeight: 'bold', color: '#BB463C'}}>
                        €{avgMonthlyProfit.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </div>
                    </div>
                    <div style={{
                      ...styles.infoBox,
                      backgroundColor: '#e8f4f1',
                      borderLeft: '4px solid #587C74',
                      margin: 0
                    }}>
                      <div style={{fontSize: '14px', color: '#282828', marginBottom: '4px'}}>Best Month</div>
                      <div style={{fontSize: '28px', fontWeight: 'bold', color: '#587C74'}}>
                        {bestMonth.month}
                      </div>
                      <div style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                        €{bestMonth.netProfit.toFixed(0)}
                      </div>
                    </div>
                    <div style={{
                      ...styles.infoBox,
                      backgroundColor: '#ffe5e5',
                      borderLeft: '4px solid #BB463C',
                      margin: 0
                    }}>
                      <div style={{fontSize: '14px', color: '#282828', marginBottom: '4px'}}>Worst Month</div>
                      <div style={{fontSize: '28px', fontWeight: 'bold', color: '#BB463C'}}>
                        {worstMonth.month}
                      </div>
                      <div style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                        €{worstMonth.netProfit.toFixed(0)}
                      </div>
                    </div>
                  </div>

                  <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '16px'}}>Monthly Performance Across Year</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis 
                        yAxisId="left"
                        label={{ value: 'Net Profit (€)', angle: -90, position: 'insideLeft' }}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        label={{ value: 'Multiplier (%)', angle: 90, position: 'insideRight' }}
                      />
                      <Tooltip 
                        formatter={(value: any, name: string) => {
                          if (name === 'Demand Multiplier (%)') return `${value}%`;
                          return `€${parseFloat(value).toFixed(2)}`;
                        }}
                      />
                      <Legend />
                      <Bar 
                        yAxisId="left"
                        dataKey="netProfit" 
                        fill="#BB463C" 
                        name="Net Profit (€)"
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="multiplier" 
                        stroke="#FF9800" 
                        strokeWidth={2}
                        name="Demand Multiplier (%)"
                        dot={{ fill: '#FF9800', r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>

                  <div style={{marginTop: '24px'}}>
                    <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '16px'}}>
                      Adjust Seasonal Multipliers (% of Baseline)
                    </h3>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '16px'}}>
                      {Object.entries(seasonalMultipliers).map(([month, value]) => (
                        <div key={month}>
                          <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px'}}>
                            {month}
                          </label>
                          <input
                            type="number"
                            value={value}
                            onChange={(e) => updateSeasonalMultiplier(month, parseInt(e.target.value) || 0)}
                            style={{...styles.inputSmall, width: '100%', textAlign: 'center'}}
                          />
                          <div style={{fontSize: '12px', color: '#282828', textAlign: 'center', marginTop: '2px'}}>%</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button
                        onClick={resetSeasonality}
                        onMouseEnter={() => setHoveredButton('reset-season')}
                        onMouseLeave={() => setHoveredButton(null)}
                        style={{
                          ...styles.filterButton,
                          ...(hoveredButton === 'reset-season' ? styles.filterButtonActive : {})
                        }}
                      >
                        Reset to 100% (No Seasonality)
                      </button>
                      <button
                        onClick={applyBBQSeasonality}
                        onMouseEnter={() => setHoveredButton('apply-bbq')}
                        onMouseLeave={() => setHoveredButton(null)}
                        style={{
                          ...styles.filterButton,
                          ...(hoveredButton === 'apply-bbq' ? styles.filterButtonActive : {})
                        }}
                      >
                        Apply BBQ Seasonality Pattern
                      </button>
                    </div>
                  </div>

                  <div style={{marginTop: '24px'}}>
                    <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '16px'}}>
                      Detailed Monthly Breakdown
                    </h3>
                    <div style={{overflowX: 'auto'}}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.tableHeader}>Month</th>
                            <th style={{...styles.tableHeader, textAlign: 'center'}}>Multiplier</th>
                            <th style={{...styles.tableHeader, textAlign: 'right'}}>Revenue</th>
                            <th style={{...styles.tableHeader, textAlign: 'right'}}>COGS</th>
                            <th style={{...styles.tableHeader, textAlign: 'right'}}>Gross Margin</th>
                            <th style={{...styles.tableHeader, textAlign: 'right'}}>Operating Expenses</th>
                            <th style={{...styles.tableHeader, textAlign: 'right'}}>Net Profit</th>
                            <th style={{...styles.tableHeader, textAlign: 'center'}}>Capacity Used</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlyData.map((month) => (
                            <tr key={month.month}>
                              <td style={{...styles.tableCell, fontWeight: '600'}}>{month.month}</td>
                              <td style={{...styles.tableCell, textAlign: 'center'}}>
                                <span style={{
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  backgroundColor: month.multiplier >= 100 ? '#e8f4f1' : '#ffe5e5',
                                  color: month.multiplier >= 100 ? '#587C74' : '#BB463C',
                                  fontWeight: '600'
                                }}>
                                  {month.multiplier}%
                                </span>
                              </td>
                              <td style={{...styles.tableCell, textAlign: 'right'}}>€{month.revenue.toFixed(0)}</td>
                              <td style={{...styles.tableCell, textAlign: 'right', color: '#BB463C'}}>€{month.cogs.toFixed(0)}</td>
                              <td style={{...styles.tableCell, textAlign: 'right'}}>€{month.grossMargin.toFixed(0)}</td>
                              <td style={{...styles.tableCell, textAlign: 'right'}}>€{month.operatingExpenses.toFixed(0)}</td>
                              <td style={{
                                ...styles.tableCell, 
                                textAlign: 'right',
                                fontWeight: 'bold',
                                color: month.netProfit >= 0 ? '#587C74' : '#BB463C'
                              }}>
                                €{month.netProfit.toFixed(0)}
                              </td>
                              <td style={{...styles.tableCell, textAlign: 'center'}}>{month.capacityUsed.toFixed(0)}%</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot style={{backgroundColor: '#f5f5f5', fontWeight: 'bold'}}>
                          <tr>
                            <td colSpan={2} style={{...styles.tableCell, textAlign: 'right'}}>ANNUAL TOTAL</td>
                            <td style={{...styles.tableCell, textAlign: 'right'}}>€{annualRevenue.toFixed(0)}</td>
                            <td style={{...styles.tableCell, textAlign: 'right', color: '#BB463C'}}>
                              €{monthlyData.reduce((sum, m) => sum + m.cogs, 0).toFixed(0)}
                            </td>
                            <td style={{...styles.tableCell, textAlign: 'right'}}>
                              €{monthlyData.reduce((sum, m) => sum + m.grossMargin, 0).toFixed(0)}
                            </td>
                            <td style={{...styles.tableCell, textAlign: 'right'}}>
                              €{(totalMonthlyOpex * 12).toFixed(0)}
                            </td>
                            <td style={{
                              ...styles.tableCell, 
                              textAlign: 'right',
                              color: annualNetProfit >= 0 ? '#587C74' : '#BB463C'
                            }}>
                              €{annualNetProfit.toFixed(0)}
                            </td>
                            <td style={styles.tableCell}></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div style={styles.warningBox}>
                    <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#BB463C', marginBottom: '8px'}}>
                      ⚠️ Cash Flow Alert
                    </h3>
                    <p style={{margin: '8px 0'}}>
                      <strong>Warning:</strong> You'll lose money in {monthlyData.filter(m => m.netProfit < 0).length} months of the year. 
                      Worst month: {worstMonth.month} (€{worstMonth.netProfit.toFixed(0)} loss).
                    </p>
                    <p style={{margin: '8px 0'}}>
                      <strong>Cash Reserve Needed:</strong> You need at least €{cashReserveNeeded.toFixed(2)} in working capital to survive slow months (3x worst month).
                    </p>
                    <p style={{margin: '8px 0', fontSize: '14px'}}>
                      <strong>Options:</strong>
                    </p>
                    <ul style={{marginLeft: '20px', fontSize: '14px'}}>
                      <li>Build up cash during peak season (summer)</li>
                      <li>Reduce fixed costs in winter (fewer staff hours)</li>
                      <li>Add winter product lines (holiday catering, gift boxes)</li>
                      <li>Adjust prices to improve margins</li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Product Performance Comparison Panel with Eye Icon */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={{...styles.cardTitle, display: 'flex', alignItems: 'center'}}>
                  🎯 Product Performance Comparison
                  <InfoIcon id="panel-performance" text="Compare products by different metrics to see which ones are most profitable. Use checkboxes to toggle views. Higher bars = better performance for that metric." />
                </h2>
                <button
                  onMouseEnter={() => setHoveredEye('performance')}
                  onMouseLeave={() => setHoveredEye(null)}
                  onClick={() => setShowProductPerformance(!showProductPerformance)}
                  style={{
                    ...styles.eyeButton,
                    ...(hoveredEye === 'performance' ? styles.eyeButtonHover : {})
                  }}
                >
                  <EyeIcon isOpen={showProductPerformance} />
                </button>
              </div>
              
              {showProductPerformance && (
                <>
                  <div style={{
                    ...styles.infoBox,
                    backgroundColor: '#fff3cd',
                    borderLeft: '4px solid #BB463C'
                  }}>
                    <p style={{margin: 0, fontSize: '14px'}}>
                      <strong>💡 Key Insight:</strong> Higher margin doesn't always mean more profit! Check "Hourly Potential" to see which products make the most money per hour of labor.
                    </p>
                  </div>

                  <div style={styles.filterButtonsContainer}>
                    <label style={{fontWeight: '600', marginRight: '8px'}}>View:</label>
                    <input
                      type="checkbox"
                      checked={showMarginPerUnit}
                      onChange={(e) => setShowMarginPerUnit(e.target.checked)}
                      style={{marginRight: '4px'}}
                    />
                    <label style={{marginRight: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center'}} onClick={() => setShowMarginPerUnit(!showMarginPerUnit)}>
                      Margin per Unit (€)
                      <InfoIcon id="chart-margin" text="Raw profit per product sold. Sell Price minus True Cost (including waste)." />
                    </label>
                    <input
                      type="checkbox"
                      checked={showUnitsPerHour}
                      onChange={(e) => setShowUnitsPerHour(e.target.checked)}
                      style={{marginRight: '4px'}}
                    />
                    <label style={{marginRight: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center'}} onClick={() => setShowUnitsPerHour(!showUnitsPerHour)}>
                      Units per Hour
                      <InfoIcon id="chart-units" text="How many units can be prepared in 60 minutes. Formula: 60 ÷ Prep Time." />
                    </label>
                    <input
                      type="checkbox"
                      checked={showHourlyProfitPotential}
                      onChange={(e) => setShowHourlyProfitPotential(e.target.checked)}
                      style={{marginRight: '4px'}}
                    />
                    <label style={{marginRight: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center'}} onClick={() => setShowHourlyProfitPotential(!showHourlyProfitPotential)}>
                      💰 Hourly Profit Potential (€)
                      <InfoIcon id="chart-hourly" text="Total profit if you spent 1 hour making only this product. Units per Hour × Margin per Unit. Best measure of labor ROI!" />
                    </label>
                    <input
                      type="checkbox"
                      checked={showMonthlySalesPotential}
                      onChange={(e) => setShowMonthlySalesPotential(e.target.checked)}
                      style={{marginRight: '4px'}}
                    />
                    <label style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}} onClick={() => setShowMonthlySalesPotential(!showMonthlySalesPotential)}>
                      Monthly Sales Potential (€)
                      <InfoIcon id="chart-monthly" text="Maximum monthly profit if you dedicated ALL available capacity to just this product. Theoretical maximum." />
                    </label>
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productMetrics} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip formatter={(value: any) => `€${parseFloat(value).toFixed(2)}`} />
                      <Legend />
                      {showMarginPerUnit && (
                        <Bar dataKey="marginPerUnit" fill="#BB463C" name="Margin per Unit (€)" />
                      )}
                      {showUnitsPerHour && (
                        <Bar dataKey="unitsPerHour" fill="#587C74" name="Units per Hour" />
                      )}
                      {showHourlyProfitPotential && (
                        <Bar dataKey="hourlyProfitPotential" fill="#FF9800" name="Hourly Profit Potential (€)" />
                      )}
                      {showMonthlySalesPotential && (
                        <Bar dataKey="monthlySalesPotential" fill="#2F3E46" name="Monthly Sales Potential (€)" />
                      )}
                    </BarChart>
                  </ResponsiveContainer>

                  <div style={{
                    ...styles.infoBox,
                    backgroundColor: '#e8f4f1',
                    borderLeft: '4px solid #587C74',
                    marginTop: '16px'
                  }}>
                    <h3 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '8px'}}>📊 How to Read This Chart</h3>
                    <ul style={{marginLeft: '20px', fontSize: '14px', lineHeight: '1.6'}}>
                      <li><strong>Margin per Unit:</strong> Raw profit per product sold</li>
                      <li><strong>Units per Hour:</strong> How many you can prepare in 60 minutes</li>
                      <li><strong>Hourly Profit Potential:</strong> Total profit if you spent 1 hour making only this product</li>
                      <li><strong>Monthly Sales Potential:</strong> Maximum profit if you dedicated all capacity to this product</li>
                    </ul>
                    <p style={{margin: '8px 0 0 0', fontSize: '14px'}}>
                      <strong>💡 Strategic Tip:</strong> Products with high "Hourly Profit Potential" give you the best return on your limited butcher time!
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Product Efficiency Ranking Panel with Eye Icon */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={{...styles.cardTitle, display: 'flex', alignItems: 'center'}}>
                  🏆 Product Efficiency Ranking (€/Minute)
                  <InfoIcon id="panel-efficiency" text="Products ranked by profit per minute of labor. Top products make the MOST money per minute of butcher time. Focus on promoting these!" />
                </h2>
                <button
                  onMouseEnter={() => setHoveredEye('efficiency')}
                  onMouseLeave={() => setHoveredEye(null)}
                  onClick={() => setShowProductEfficiency(!showProductEfficiency)}
                  style={{
                    ...styles.eyeButton,
                    ...(hoveredEye === 'efficiency' ? styles.eyeButtonHover : {})
                  }}
                >
                  <EyeIcon isOpen={showProductEfficiency} />
                </button>
              </div>
              
              {showProductEfficiency && (
                <>
                  <div style={{
                    ...styles.infoBox,
                    backgroundColor: '#fff3cd',
                    borderLeft: '4px solid #BB463C'
                  }}>
                    <p style={{margin: 0, fontSize: '14px'}}>
                      <strong>💡 Key Insight:</strong> Products at the top make MORE money per minute of Kees' time. Focus on promoting these high-efficiency items!
                    </p>
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productEfficiencyRanking} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" label={{ value: '€ per Minute', position: 'insideBottom', offset: -5 }} />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip formatter={(value: any) => `€${parseFloat(value).toFixed(2)}/min`} />
                      <Bar dataKey="euroPerMinute" fill="#587C74" />
                    </BarChart>
                  </ResponsiveContainer>

                  <div style={{overflowX: 'auto', marginTop: '16px'}}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.tableHeader}>Product</th>
                          <th style={styles.tableHeader}>Category</th>
                          <th style={{...styles.tableHeader, textAlign: 'right'}}>Margin/Unit</th>
                          <th style={{...styles.tableHeader, textAlign: 'right'}}>€/Minute</th>
                          <th style={{...styles.tableHeader, textAlign: 'right'}}>€/Hour</th>
                          <th style={{...styles.tableHeader, textAlign: 'right'}}>Units/Hour</th>
                          <th style={{...styles.tableHeader, textAlign: 'right'}}>Current Units</th>
                          <th style={{...styles.tableHeader, textAlign: 'right'}}>Max Monthly</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productEfficiencyRanking.map((product) => (
                          <tr key={product.id}>
                            <td style={styles.tableCell}>{product.name}</td>
                            <td style={styles.tableCell}>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                backgroundColor: product.category === 'Pitmaster' ? '#e8f4f1' : '#e8f0f4',
                                color: product.category === 'Pitmaster' ? '#587C74' : '#2F3E46',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                {product.category}
                              </span>
                            </td>
                            <td style={{...styles.tableCell, textAlign: 'right'}}>€{product.marginPerUnit.toFixed(2)}</td>
                            <td style={{...styles.tableCell, textAlign: 'right', fontWeight: 'bold', color: '#587C74'}}>
                              €{product.euroPerMinute.toFixed(2)}
                            </td>
                            <td style={{...styles.tableCell, textAlign: 'right'}}>€{product.hourlyProfitPotential.toFixed(2)}</td>
                            <td style={{...styles.tableCell, textAlign: 'right'}}>{product.unitsPerHour.toFixed(1)}</td>
                            <td style={{...styles.tableCell, textAlign: 'right'}}>{product.units}</td>
                            <td style={{...styles.tableCell, textAlign: 'right'}}>{Math.floor(totalMonthlyMinutes / product.prepTimeMinutes)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Top 10 Products by Margin Contribution Panel with Eye Icon */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={{...styles.cardTitle, display: 'flex', alignItems: 'center'}}>
                  Top 10 Products by Margin Contribution
                  <InfoIcon id="panel-top10" text="Products that contribute MOST to your total gross margin based on current sales volumes. These are your revenue workhorses!" />
                </h2>
                <button
                  onMouseEnter={() => setHoveredEye('margin')}
                  onMouseLeave={() => setHoveredEye(null)}
                  onClick={() => setShowMarginContribution(!showMarginContribution)}
                  style={{
                    ...styles.eyeButton,
                    ...(hoveredEye === 'margin' ? styles.eyeButtonHover : {})
                  }}
                >
                  <EyeIcon isOpen={showMarginContribution} />
                </button>
              </div>
              
              {showMarginContribution && (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topMarginProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis label={{ value: '€', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value: any) => `€${parseFloat(value).toFixed(2)}`} />
                      <Bar dataKey="totalMarginContribution" fill="#587C74" name="Total Margin Contribution (€)" />
                    </BarChart>
                  </ResponsiveContainer>

                  <p style={{fontSize: '14px', color: '#282828', textAlign: 'center', marginTop: '8px'}}>
                    These products contribute the most to your total gross margin based on current sales volumes
                  </p>
                </>
              )}
            </div>

            {/* Classic vs Pitmaster Performance Panel with Eye Icon */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={{...styles.cardTitle, display: 'flex', alignItems: 'center'}}>
                  📊 Classic vs Pitmaster Performance
                  <InfoIcon id="panel-classvspitmaster" text="Compare your two product categories side-by-side. See which category generates more revenue, uses more time, and has better margins." />
                </h2>
                <button
                  onMouseEnter={() => setHoveredEye('classvspitmaster')}
                  onMouseLeave={() => setHoveredEye(null)}
                  onClick={() => setShowClassicVsPitmaster(!showClassicVsPitmaster)}
                  style={{
                    ...styles.eyeButton,
                    ...(hoveredEye === 'classvspitmaster' ? styles.eyeButtonHover : {})
                  }}
                >
                  <EyeIcon isOpen={showClassicVsPitmaster} />
                </button>
              </div>
              
              {showClassicVsPitmaster && (
                <>
                  <div style={styles.gridTwo}>
                    <div style={{
                      ...styles.infoBox,
                      backgroundColor: '#e8f0f4',
                      borderLeft: '4px solid #2F3E46',
                      margin: 0
                    }}>
                      <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#2F3E46', marginBottom: '8px'}}>
                        🍔 Classic Products
                      </h3>
                      <div style={{fontSize: '14px', marginBottom: '4px'}}>
                        <strong>Revenue:</strong> €{calculations.classicRevenue.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </div>
                      <div style={{fontSize: '14px', marginBottom: '4px'}}>
                        <strong>COGS:</strong> €{calculations.classicCost.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </div>
                      <div style={{fontSize: '14px', marginBottom: '4px', color: '#BB463C'}}>
                        <strong>Gross Margin:</strong> €{calculations.classicMargin.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </div>
                      <div style={{fontSize: '14px', marginBottom: '4px'}}>
                        <strong>Units Sold:</strong> {calculations.classicUnits} ({((calculations.classicUnits / (calculations.classicUnits + calculations.pitmasterUnits)) * 100).toFixed(1)}%)
                      </div>
                      <div style={{fontSize: '14px', marginBottom: '4px'}}>
                        <strong>Avg Margin/Unit:</strong> €{calculations.classicAvgMargin.toFixed(2)}
                      </div>
                      <div style={{fontSize: '14px'}}>
                        <strong>Prep Time:</strong> {calculations.classicPrepTime} min ({((calculations.classicPrepTime / (calculations.classicPrepTime + calculations.pitmasterPrepTime)) * 100).toFixed(1)}%)
                      </div>
                    </div>

                    <div style={{
                      ...styles.infoBox,
                      backgroundColor: '#e8f4f1',
                      borderLeft: '4px solid #587C74',
                      margin: 0
                    }}>
                      <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#587C74', marginBottom: '8px'}}>
                        🏆 Pitmaster Products
                      </h3>
                      <div style={{fontSize: '14px', marginBottom: '4px'}}>
                        <strong>Revenue:</strong> €{calculations.pitmasterRevenue.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </div>
                      <div style={{fontSize: '14px', marginBottom: '4px'}}>
                        <strong>COGS:</strong> €{calculations.pitmasterCost.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </div>
                      <div style={{fontSize: '14px', marginBottom: '4px', color: '#587C74'}}>
                        <strong>Gross Margin:</strong> €{calculations.pitmasterMargin.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </div>
                      <div style={{fontSize: '14px', marginBottom: '4px'}}>
                        <strong>Units Sold:</strong> {calculations.pitmasterUnits} ({((calculations.pitmasterUnits / (calculations.classicUnits + calculations.pitmasterUnits)) * 100).toFixed(1)}%)
                      </div>
                      <div style={{fontSize: '14px', marginBottom: '4px'}}>
                        <strong>Avg Margin/Unit:</strong> €{calculations.pitmasterAvgMargin.toFixed(2)}
                      </div>
                      <div style={{fontSize: '14px'}}>
                        <strong>Prep Time:</strong> {calculations.pitmasterPrepTime} min ({((calculations.pitmasterPrepTime / (calculations.classicPrepTime + calculations.pitmasterPrepTime)) * 100).toFixed(1)}%)
                      </div>
                    </div>

                    <div style={{
                      ...styles.infoBox,
                      backgroundColor: '#ffe5e5',
                      borderLeft: '4px solid #BB463C',
                      margin: 0
                    }}>
                      <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#BB463C', marginBottom: '8px'}}>
                        💰 Net Position
                      </h3>
                      <div style={{fontSize: '14px', marginBottom: '4px'}}>
                        <strong>Gross Margin:</strong> €{calculations.totalMargin.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </div>
                      <div style={{fontSize: '14px', marginBottom: '4px'}}>
                        <strong>Operating Expenses:</strong> €{totalOperatingExpenses.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </div>
                      <div style={{fontSize: '18px', fontWeight: 'bold', color: '#BB463C'}}>
                        <strong>Net Profit:</strong> €{monthlyNetProfit.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </div>
                      <div style={{fontSize: '12px', color: '#BB463C', marginTop: '8px'}}>
                        ⚠️ Need €{Math.abs(monthlyNetProfit).toFixed(2)} more in revenue or reduce costs
                      </div>
                    </div>
                  </div>

                  <div style={{
                    ...styles.infoBox,
                    backgroundColor: '#fff3cd',
                    borderLeft: '4px solid #BB463C',
                    marginTop: '16px'
                  }}>
                    <h3 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '8px'}}>💡 Strategic Insights</h3>
                    <ul style={{marginLeft: '20px', fontSize: '14px', lineHeight: '1.6'}}>
                      <li><strong>Margin Efficiency:</strong> Pitmaster products generate €{calculations.pitmasterAvgMargin.toFixed(2)} margin per unit vs €{calculations.classicAvgMargin.toFixed(2)} for Classic products (lower)</li>
                      <li><strong>Time ROI:</strong> Classic products take {calculations.classicPrepTime} min ({((calculations.classicPrepTime / (calculations.classicPrepTime + calculations.pitmasterPrepTime)) * 100).toFixed(1)}% of capacity) generating {((calculations.classicRevenue / calculations.totalRevenue) * 100).toFixed(1)}% of revenue</li>
                      <li><strong>Volume Strategy:</strong> Currently selling {calculations.classicUnits} Classic + {calculations.pitmasterUnits} Pitmaster units. Consider increasing Pitmaster production for higher margins.</li>
                      <li><strong>Break-Even Analysis:</strong> Need 0 total units to cover operating costs. Current mix: {calculations.classicUnits} Classic + {calculations.pitmasterUnits} Pitmaster = {calculations.classicUnits + calculations.pitmasterUnits} units</li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Monthly Sales Volume Input Panel with Eye Icon */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <h2 style={{...styles.cardTitle, display: 'flex', alignItems: 'center', margin: 0}}>
                    Monthly Sales Volume Input
                    <InfoIcon id="panel-salesinput" text="Define your product lineup and monthly sales targets. All calculations flow from this data. Update units to see instant impact on profitability across all panels." />
                  </h2>
                </div>
                <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                  <div style={styles.filterButtonsContainer}>
                    <button
                      onClick={() => setSelectedProductFilter('all')}
                      style={{
                        ...styles.filterButton,
                        ...(selectedProductFilter === 'all' ? styles.filterButtonActive : {})
                      }}
                    >
                      All Products
                    </button>
                    <button
                      onClick={() => setSelectedProductFilter('classic')}
                      style={{
                        ...styles.filterButton,
                        ...(selectedProductFilter === 'classic' ? styles.filterButtonActive : {})
                      }}
                    >
                      Classic Only
                    </button>
                    <button
                      onClick={() => setSelectedProductFilter('pitmaster')}
                      style={{
                        ...styles.filterButton,
                        ...(selectedProductFilter === 'pitmaster' ? styles.filterButtonActive : {})
                      }}
                    >
                      Pitmaster Only
                    </button>
                    <button
                      onClick={addProduct}
                      onMouseEnter={() => setHoveredButton('add-product')}
                      onMouseLeave={() => setHoveredButton(null)}
                      style={{
                        ...styles.button,
                        ...(hoveredButton === 'add-product' ? styles.buttonHover : {})
                      }}
                    >
                      + Add Product
                    </button>
                  </div>
                  <button
                    onMouseEnter={() => setHoveredEye('salesvolume')}
                    onMouseLeave={() => setHoveredEye(null)}
                    onClick={() => setShowSalesVolumeInput(!showSalesVolumeInput)}
                    style={{
                      ...styles.eyeButton,
                      ...(hoveredEye === 'salesvolume' ? styles.eyeButtonHover : {})
                    }}
                  >
                    <EyeIcon isOpen={showSalesVolumeInput} />
                  </button>
                </div>
              </div>

              {showSalesVolumeInput && (
                <>
                  <div style={{overflowX: 'auto'}}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.tableHeader}>Product</th>
                          <th style={{...styles.tableHeader, textAlign: 'center'}}>Category</th>
                          <th style={{...styles.tableHeader, textAlign: 'center'}}>Meat Type</th>
                          <th style={{...styles.tableHeader, textAlign: 'right'}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                              Weight (kg)
                              <InfoIcon id="weight" text="The weight of raw meat needed for this product before cooking and trimming." />
                            </div>
                          </th>
                          <th style={{...styles.tableHeader, textAlign: 'right'}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                              Base Cost (€)
                              <InfoIcon id="basecost" text="The raw cost of meat per unit before accounting for waste. This is what you pay your supplier." />
                            </div>
                          </th>
                          <th style={{...styles.tableHeader, textAlign: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                              Waste %
                              <InfoIcon id="waste" text="Percentage lost to trimming, fat removal, and cooking shrinkage. Typical range: 10-15% for quality cuts." />
                            </div>
                          </th>
                          <th style={{...styles.tableHeader, textAlign: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                              Prep (min)
                              <InfoIcon id="prep" text="Time in minutes to prepare one unit from raw meat to finished product. Used for capacity planning." />
                            </div>
                          </th>
                          <th style={{...styles.tableHeader, textAlign: 'right'}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                              True Cost (€)
                              <InfoIcon id="truecost" text="Actual cost per unit after accounting for waste. Formula: Base Cost ÷ (1 - Waste%). This is your real cost." />
                            </div>
                          </th>
                          <th style={{...styles.tableHeader, textAlign: 'right'}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                              Sell (€)
                              <InfoIcon id="sell" text="The price you charge customers for this product." />
                            </div>
                          </th>
                          <th style={{...styles.tableHeader, textAlign: 'right'}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                              Margin (€)
                              <InfoIcon id="margin" text="Gross profit per unit. Formula: Sell Price - True Cost. Positive = profitable, negative = losing money." />
                            </div>
                          </th>
                          <th style={{...styles.tableHeader, textAlign: 'right'}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                              €/min
                              <InfoIcon id="europermin" text="Profit earned per minute of labor. Higher = better use of butcher's time. Key metric for efficiency!" />
                            </div>
                          </th>
                          <th style={{...styles.tableHeader, textAlign: 'right'}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                              Units
                              <InfoIcon id="units" text="How many units you plan to sell per month. This drives all revenue and cost calculations." />
                            </div>
                          </th>
                          <th style={styles.tableHeader}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {products
                          .filter(p => {
                            if (selectedProductFilter === 'all') return true;
                            if (selectedProductFilter === 'classic') return p.category === 'Classic';
                            if (selectedProductFilter === 'pitmaster') return p.category === 'Pitmaster';
                            return true;
                          })
                          .map((product) => {
                            const trueCost = product.costPrice / (1 - product.wastePercentage / 100);
                            const euroPerMinute = product.prepTimeMinutes > 0 ? product.margin / product.prepTimeMinutes : 0;
                            
                            return (
                              <tr key={product.id}>
                                <td style={styles.tableCell}>
                                  <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                                    style={styles.input}
                                  />
                                </td>
                                <td style={styles.tableCell}>
                                  <select
                                    value={product.category}
                                    onChange={(e) => updateProduct(product.id, 'category', e.target.value)}
                                    style={styles.select}
                                  >
                                    <option>Classic</option>
                                    <option>Pitmaster</option>
                                  </select>
                                </td>
                                <td style={styles.tableCell}>
                                  <select
                                    value={product.meatType}
                                    onChange={(e) => updateProduct(product.id, 'meatType', e.target.value)}
                                    style={styles.select}
                                  >
                                    <option>Beef</option>
                                    <option>Pork</option>
                                    <option>Poultry</option>
                                  </select>
                                </td>
                                <td style={styles.tableCell}>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={product.weight}
                                    onChange={(e) => updateProduct(product.id, 'weight', parseFloat(e.target.value) || 0)}
                                    style={styles.inputSmall}
                                  />
                                </td>
                                <td style={styles.tableCell}>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={product.costPrice}
                                    onChange={(e) => updateProduct(product.id, 'costPrice', parseFloat(e.target.value) || 0)}
                                    style={styles.inputSmall}
                                  />
                                </td>
                                <td style={styles.tableCell}>
                                  <input
                                    type="number"
                                    step="1"
                                    value={product.wastePercentage}
                                    onChange={(e) => updateProduct(product.id, 'wastePercentage', parseFloat(e.target.value) || 0)}
                                    style={styles.inputSmall}
                                  />
                                </td>
                                <td style={styles.tableCell}>
                                  <input
                                    type="number"
                                    step="1"
                                    value={product.prepTimeMinutes}
                                    onChange={(e) => updateProduct(product.id, 'prepTimeMinutes', parseInt(e.target.value) || 0)}
                                    style={styles.inputSmall}
                                  />
                                </td>
                                <td style={{...styles.tableCell, textAlign: 'right', color: '#BB463C'}}>
                                  €{trueCost.toFixed(2)}
                                </td>
                                <td style={styles.tableCell}>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={product.sellPrice}
                                    onChange={(e) => updateProduct(product.id, 'sellPrice', parseFloat(e.target.value) || 0)}
                                    style={styles.inputSmall}
                                  />
                                </td>
                                <td style={{
                                  ...styles.tableCell, 
                                  textAlign: 'right',
                                  color: product.margin >= 0 ? '#587C74' : '#BB463C',
                                  fontWeight: 'bold'
                                }}>
                                  €{product.margin.toFixed(2)}
                                </td>
                                <td style={{
                                  ...styles.tableCell, 
                                  textAlign: 'right',
                                  color: euroPerMinute >= 0 ? '#587C74' : '#BB463C'
                                }}>
                                  €{euroPerMinute.toFixed(2)}
                                </td>
                                <td style={styles.tableCell}>
                                  <input
                                    type="number"
                                    step="1"
                                    value={product.units}
                                    onChange={(e) => updateProduct(product.id, 'units', parseInt(e.target.value) || 0)}
                                    style={styles.inputSmall}
                                  />
                                </td>
                                <td style={styles.tableCell}>
                                  <button
                                    onClick={() => deleteProduct(product.id)}
                                    style={styles.deleteButton}
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                      <tfoot style={{backgroundColor: '#f5f5f5', fontWeight: 'bold'}}>
                        <tr>
                          <td colSpan={7} style={{...styles.tableCell, textAlign: 'right'}}>ALL TOTALS:</td>
                          <td style={{...styles.tableCell, textAlign: 'right', color: '#BB463C'}}>€{calculations.totalCost.toFixed(2)}</td>
                          <td style={{...styles.tableCell, textAlign: 'right', color: '#587C74'}}>€{calculations.totalRevenue.toFixed(2)}</td>
                          <td style={{
                            ...styles.tableCell, 
                            textAlign: 'right',
                            color: calculations.totalMargin >= 0 ? '#587C74' : '#BB463C'
                          }}>€{calculations.totalMargin.toFixed(2)}</td>
                          <td colSpan={3} style={styles.tableCell}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'startup' && (
          <div>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>One-Time Startup Costs</h2>
                  <p style={{fontSize: '28px', fontWeight: 'bold', color: '#2F3E46', marginTop: '8px'}}>
                    Total Investment: €{totalStartupCosts.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                  </p>
                  <p style={{fontSize: '16px', color: unpaidStartupCosts > 0 ? '#BB463C' : '#587C74'}}>
                    Paid: €{paidStartupCosts.toFixed(2)} | Remaining: €{unpaidStartupCosts.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={addStartupCost}
                  onMouseEnter={() => setHoveredButton('add-startup')}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={{
                    ...styles.button,
                    ...(hoveredButton === 'add-startup' ? styles.buttonHover : {})
                  }}
                >
                  + Add Cost
                </button>
              </div>

              <div style={{marginBottom: '16px'}}>
                <div style={styles.progressBar}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${(paidStartupCosts / totalStartupCosts) * 100}%`
                  }}>
                    {((paidStartupCosts / totalStartupCosts) * 100).toFixed(0)}% Paid
                  </div>
                </div>
              </div>

              <div style={{overflowX: 'auto'}}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{...styles.tableHeader, textAlign: 'left'}}>Category</th>
                      <th style={{...styles.tableHeader, textAlign: 'left'}}>Item</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Estimated (€)</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Actual (€)</th>
                      <th style={{...styles.tableHeader, textAlign: 'center'}}>Status</th>
                      <th style={{...styles.tableHeader, textAlign: 'left'}}>Notes</th>
                      <th style={styles.tableHeader}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {startupCosts.map((cost) => (
                      <tr key={cost.id}>
                        <td style={styles.tableCell}>
                          <input
                            type="text"
                            value={cost.category}
                            onChange={(e) => updateStartupCost(cost.id, 'category', e.target.value)}
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <input
                            type="text"
                            value={cost.item}
                            onChange={(e) => updateStartupCost(cost.id, 'item', e.target.value)}
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <input
                            type="number"
                            step="0.01"
                            value={cost.estimatedCost}
                            onChange={(e) => updateStartupCost(cost.id, 'estimatedCost', parseFloat(e.target.value) || 0)}
                            style={{...styles.inputSmall, width: '110px'}}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <input
                            type="number"
                            step="0.01"
                            value={cost.actualCost}
                            onChange={(e) => updateStartupCost(cost.id, 'actualCost', parseFloat(e.target.value) || 0)}
                            style={{...styles.inputSmall, width: '110px'}}
                          />
                        </td>
                        <td style={{...styles.tableCell, textAlign: 'center'}}>
                          <input
                            type="checkbox"
                            checked={cost.paid}
                            onChange={(e) => updateStartupCost(cost.id, 'paid', e.target.checked)}
                            style={{width: '20px', height: '20px', cursor: 'pointer'}}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <input
                            type="text"
                            value={cost.notes}
                            onChange={(e) => updateStartupCost(cost.id, 'notes', e.target.value)}
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <button
                            onClick={() => deleteStartupCost(cost.id)}
                            style={styles.deleteButton}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{backgroundColor: '#f5f5f5', fontWeight: 'bold'}}>
                      <td colSpan={2} style={{...styles.tableCell, textAlign: 'right'}}>TOTALS:</td>
                      <td style={{...styles.tableCell, textAlign: 'right'}}>
                        €{startupCosts.reduce((sum, c) => sum + c.estimatedCost, 0).toFixed(2)}
                      </td>
                      <td style={{...styles.tableCell, textAlign: 'right', color: '#2F3E46'}}>
                        €{totalStartupCosts.toFixed(2)}
                      </td>
                      <td colSpan={3} style={styles.tableCell}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div style={styles.gridTwo}>
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: '#e8f4f1',
                  borderLeft: '4px solid #587C74'
                }}>
                  <h3 style={{fontWeight: 'bold', color: '#587C74', marginBottom: '8px', fontSize: '16px'}}>Paid Costs</h3>
                  <p style={{fontSize: '24px', fontWeight: 'bold', color: '#587C74', margin: 0}}>
                    €{paidStartupCosts.toFixed(2)}
                  </p>
                  <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                    {startupCosts.filter(c => c.paid).length} items completed
                  </p>
                </div>
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: '#ffe5e5',
                  borderLeft: '4px solid #BB463C'
                }}>
                  <h3 style={{fontWeight: 'bold', color: '#BB463C', marginBottom: '8px', fontSize: '16px'}}>Unpaid Costs</h3>
                  <p style={{fontSize: '24px', fontWeight: 'bold', color: '#BB463C', margin: 0}}>
                    €{unpaidStartupCosts.toFixed(2)}
                  </p>
                  <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                    {startupCosts.filter(c => !c.paid).length} items pending
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monthly' && (
          <div>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>Monthly Recurring Costs</h2>
                  <p style={{fontSize: '28px', fontWeight: 'bold', color: '#BB463C', marginTop: '8px'}}>
                    Total Operating: €{totalMonthlyOpex.toLocaleString('nl-NL', {minimumFractionDigits: 2})}/month
                  </p>
                  <p style={{fontSize: '16px', color: '#282828'}}>
                    Annual: €{(totalMonthlyOpex * 12).toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                  </p>
                </div>
                <button
                  onClick={addMonthlyCost}
                  onMouseEnter={() => setHoveredButton('add-monthly')}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={{
                    ...styles.button,
                    ...(hoveredButton === 'add-monthly' ? styles.buttonHover : {})
                  }}
                >
                  + Add Cost
                </button>
              </div>
              <div style={{overflowX: 'auto'}}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{...styles.tableHeader, textAlign: 'left'}}>Category</th>
                      <th style={{...styles.tableHeader, textAlign: 'left'}}>Item</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Monthly (€)</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Annual (€)</th>
                      <th style={{...styles.tableHeader, textAlign: 'center'}}>Type</th>
                      <th style={{...styles.tableHeader, textAlign: 'left'}}>Notes</th>
                      <th style={styles.tableHeader}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyCosts.map((cost) => (
                      <tr key={cost.id}>
                        <td style={styles.tableCell}>
                          <input
                            type="text"
                            value={cost.category}
                            onChange={(e) => updateMonthlyCost(cost.id, 'category', e.target.value)}
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <input
                            type="text"
                            value={cost.item}
                            onChange={(e) => updateMonthlyCost(cost.id, 'item', e.target.value)}
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <input
                            type="number"
                            step="0.01"
                            value={cost.monthlyCost}
                            onChange={(e) => updateMonthlyCost(cost.id, 'monthlyCost', parseFloat(e.target.value) || 0)}
                            style={{...styles.inputSmall, width: '110px'}}
                          />
                        </td>
                        <td style={{...styles.tableCell, textAlign: 'right'}}>€{cost.annualCost.toFixed(2)}</td>
                        <td style={styles.tableCell}>
                          <select
                            value={cost.type}
                            onChange={(e) => updateMonthlyCost(cost.id, 'type', e.target.value)}
                            style={styles.select}
                          >
                            <option>Fixed</option>
                            <option>Variable</option>
                          </select>
                        </td>
                        <td style={styles.tableCell}>
                          <input
                            type="text"
                            value={cost.notes}
                            onChange={(e) => updateMonthlyCost(cost.id, 'notes', e.target.value)}
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <button
                            onClick={() => deleteMonthlyCost(cost.id)}
                            style={styles.deleteButton}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{backgroundColor: '#f5f5f5', fontWeight: 'bold'}}>
                      <td colSpan={2} style={{...styles.tableCell, textAlign: 'right'}}>TOTALS:</td>
                      <td style={{...styles.tableCell, textAlign: 'right', color: '#BB463C'}}>
                        €{totalMonthlyOpex.toFixed(2)}
                      </td>
                      <td style={{...styles.tableCell, textAlign: 'right', color: '#BB463C'}}>
                        €{(totalMonthlyOpex * 12).toFixed(2)}
                      </td>
                      <td colSpan={3} style={styles.tableCell}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div style={styles.gridTwo}>
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: '#e8f0f4',
                  borderLeft: '4px solid #2F3E46'
                }}>
                  <h3 style={{fontWeight: 'bold', color: '#2F3E46', marginBottom: '8px', fontSize: '16px'}}>Fixed Costs</h3>
                  <p style={{fontSize: '24px', fontWeight: 'bold', color: '#2F3E46', margin: 0}}>
                    €{monthlyCosts.filter(c => c.type === 'Fixed').reduce((sum, c) => sum + c.monthlyCost, 0).toFixed(2)}
                  </p>
                  <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                    {monthlyCosts.filter(c => c.type === 'Fixed').length} items - Must pay regardless of sales
                  </p>
                </div>
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: '#e8f4f1',
                  borderLeft: '4px solid #587C74'
                }}>
                  <h3 style={{fontWeight: 'bold', color: '#587C74', marginBottom: '8px', fontSize: '16px'}}>Variable Costs</h3>
                  <p style={{fontSize: '24px', fontWeight: 'bold', color: '#587C74', margin: 0}}>
                    €{monthlyCosts.filter(c => c.type === 'Variable').reduce((sum, c) => sum + c.monthlyCost, 0).toFixed(2)}
                  </p>
                  <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                    {monthlyCosts.filter(c => c.type === 'Variable').length} items - Scale with business activity
                  </p>
                </div>
              </div>

              {/* Classic vs Pitmaster COGS Breakdown */}
              <div style={{...styles.sectionDivider}}>
                <h3 style={{fontSize: '18px', fontWeight: 'bold', color: '#2F3E46', marginBottom: '16px'}}>
                  Cost of Goods Sold (COGS) by Category
                </h3>
                <div style={styles.gridTwo}>
                  <div style={{
                    ...styles.infoBox,
                    backgroundColor: '#ffe5e5',
                    borderLeft: '4px solid #BB463C',
                    margin: 0
                  }}>
                    <h3 style={{fontWeight: 'bold', color: '#2F3E46', marginBottom: '8px', fontSize: '16px'}}>Classic COGS</h3>
                    <p style={{fontSize: '24px', fontWeight: 'bold', color: '#BB463C', margin: 0}}>
                      €{calculations.classicCost.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                    </p>
                    <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                      {calculations.classicUnits} units - {((calculations.classicCost / calculations.totalCost) * 100).toFixed(1)}% of total COGS
                    </p>
                  </div>
                  <div style={{
                    ...styles.infoBox,
                    backgroundColor: '#ffe5e5',
                    borderLeft: '4px solid #BB463C',
                    margin: 0
                  }}>
                    <h3 style={{fontWeight: 'bold', color: '#587C74', marginBottom: '8px', fontSize: '16px'}}>Pitmaster COGS</h3>
                    <p style={{fontSize: '24px', fontWeight: 'bold', color: '#BB463C', margin: 0}}>
                      €{calculations.pitmasterCost.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                    </p>
                    <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                      {calculations.pitmasterUnits} units - {((calculations.pitmasterCost / calculations.totalCost) * 100).toFixed(1)}% of total COGS
                    </p>
                  </div>
                </div>
              </div>

              <div style={{...styles.gridTwo, marginTop: '16px'}}>
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: '#ffe5e5',
                  borderLeft: '4px solid #BB463C'
                }}>
                  <h3 style={{fontWeight: 'bold', color: '#BB463C', marginBottom: '8px', fontSize: '16px'}}>Total COGS</h3>
                  <p style={{fontSize: '24px', fontWeight: 'bold', color: '#BB463C', margin: 0}}>
                    €{calculations.totalCost.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                  </p>
                  <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                    Calculated from product sales volume (includes waste)
                  </p>
                </div>
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: '#e8f0f4',
                  borderLeft: '4px solid #2F3E46'
                }}>
                  <h3 style={{fontWeight: 'bold', color: '#2F3E46', marginBottom: '8px', fontSize: '16px'}}>Total Operating Expenses</h3>
                  <p style={{fontSize: '24px', fontWeight: 'bold', color: '#2F3E46', margin: 0}}>
                    €{totalOperatingExpenses.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                  </p>
                  <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                    Monthly Opex (€{totalMonthlyOpex.toFixed(2)}) + COGS (€{calculations.totalCost.toFixed(2)})
                  </p>
                </div>
              </div>
              
              <div style={{
                ...styles.infoBox,
                backgroundColor: '#fff3cd',
                borderLeft: '4px solid #BB463C',
                marginTop: '16px'
              }}>
                <p style={{color: '#282828', margin: 0, fontSize: '14px'}}>
                  <strong>📦 Note:</strong> Total Operating Expenses includes both fixed costs (rent, labor, insurance) 
                  and variable costs (COGS, packaging, cleaning supplies).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakEvenAnalysis;